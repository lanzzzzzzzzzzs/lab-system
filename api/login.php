<?php
require __DIR__ . "/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendJson(["error" => "Invalid request."], 405);
}

$input = getInput();
$email    = trim($input["email"] ?? "");
$password = $input["password"] ?? "";
$role     = $input["role"] ?? "student";   // the card chosen on the login screen

if ($email === "" || $password === "") {
    sendJson(["error" => "Enter your email and password to continue."], 400);
}

// ---- Too many wrong passwords = temporary time out ----
// Defaults can be changed in config.php ($MAX_LOGIN_ATTEMPTS and $LOCKOUT_MINUTES).
$maxAttempts   = (int) ($MAX_LOGIN_ATTEMPTS ?? 5);
$lockoutSecond = (int) ($LOCKOUT_MINUTES ?? 15) * 60;

// Failed tries are counted per email (lowercase, so Name@x.com and name@x.com are the same).
// The same rule applies to emails that do not exist, so nobody can learn which emails are registered.
// Times are worked out inside MySQL so PHP and MySQL time zones can never disagree.
$key = strtolower(substr($email, 0, 100));
$ip  = $_SERVER["REMOTE_ADDR"] ?? "";

// Forget old failures (older than the time out)
$pdo->prepare("DELETE FROM login_attempts WHERE created_at < (NOW() - INTERVAL ? SECOND)")
    ->execute([$lockoutSecond]);

$stmt = $pdo->prepare(
    "SELECT COUNT(*) AS failures, TIMESTAMPDIFF(SECOND, MAX(created_at), NOW()) AS since_last
     FROM login_attempts WHERE email = ? AND created_at >= (NOW() - INTERVAL ? SECOND)"
);
$stmt->execute([$key, $lockoutSecond]);
$recent = $stmt->fetch();
$failures = (int) $recent["failures"];

// Locked: do not even look at the password (a correct guess must not unlock it early)
if ($failures >= $maxAttempts) {
    $wait = max(1, $lockoutSecond - (int) $recent["since_last"]);
    $minutes = (int) ceil($wait / 60);
    header("Retry-After: $wait");
    sendJson([
        "error" => "Too many failed attempts. Please try again in $minutes minute" . ($minutes === 1 ? "" : "s") . ".",
        "locked" => true,
        "retry_after" => $wait
    ], 429);
}

// Find the user by email
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

// password_verify compares the typed password with the saved hash.
// We give the same message for a wrong email or a wrong password.
if (!$user || !password_verify($password, $user["password"])) {
    $pdo->prepare("INSERT INTO login_attempts (email, ip_address) VALUES (?, ?)")->execute([$key, $ip]);
    $left = $maxAttempts - ($failures + 1);

    if ($left <= 0) {
        // This was the last allowed try: the time out starts now
        $minutes = (int) ceil($lockoutSecond / 60);
        header("Retry-After: $lockoutSecond");
        sendJson([
            "error" => "Too many failed attempts. Please try again in $minutes minute" . ($minutes === 1 ? "" : "s") . ".",
            "locked" => true,
            "retry_after" => $lockoutSecond
        ], 429);
    }

    sendJson([
        "error" => "Invalid email or password. $left attempt" . ($left === 1 ? "" : "s") . " left.",
        "attempts_left" => $left
    ], 401);
}

// Correct password: clear the failed tries for this email
$pdo->prepare("DELETE FROM login_attempts WHERE email = ?")->execute([$key]);

// A suspended account cannot sign in
if ($user["status"] === "Suspended") {
    sendJson(["error" => "This account is suspended. Please contact the laboratory."], 403);
}

// The card the person chose must match the real role saved in the database
if ($user["role"] !== $role) {
    sendJson(["error" => "Please choose the correct role."], 403);
}

// Log in: new session id (security), then remember who this is
session_regenerate_id(true);
$_SESSION["user_id"] = $user["id"];
$_SESSION["role"] = $user["role"];

sendJson(["user" => userData($user)]);
