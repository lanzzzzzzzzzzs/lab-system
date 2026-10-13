<?php
// Creates an account. account_type "student" is open to everyone.
// account_type "admin" also needs the secret administrator code from config.php.
require __DIR__ . "/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendJson(["error" => "Invalid request."], 405);
}

$input = getInput();
$type       = $input["account_type"] ?? "student";   // "student" or "admin"
$fullName   = trim($input["full_name"] ?? "");
$email      = trim($input["email"] ?? "");
$password   = $input["password"] ?? "";
$idNumber   = trim($input["student_id"] ?? "");      // the student ID or the staff ID
$department = trim($input["department"] ?? "");
$adminCode  = (string) ($input["admin_code"] ?? "");

// Server-side validation (the browser can be bypassed, so PHP checks again)
if ($fullName === "" || $email === "" || $password === "") {
    sendJson(["error" => "Please complete all required fields."], 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJson(["error" => "Please enter a valid email address."], 400);
}
if (strlen($password) < 8) {
    sendJson(["error" => "Password must be at least 8 characters."], 400);
}
if (strlen($fullName) > 100 || strlen($idNumber) > 30 || strlen($department) > 100) {
    sendJson(["error" => "One of the fields is too long."], 400);
}

// The role is decided here on the server. Without the secret code it is always "student".
$role = "student";

// Every attempt to create an administrator is saved in the admin_attempts table
$log = $pdo->prepare("INSERT INTO admin_attempts (email, success, ip_address) VALUES (?, ?, ?)");
$ip = $_SERVER["REMOTE_ADDR"] ?? "";

if ($type === "admin") {
    if ($idNumber === "" || $department === "" || $adminCode === "") {
        sendJson(["error" => "Please complete all required fields."], 400);
    }

    // $ADMIN_CODE comes from config.php. hash_equals compares two texts safely.
    if (!isset($ADMIN_CODE) || $ADMIN_CODE === "") {
        $log->execute([$email, 0, $ip]);
        sendJson(["error" => "Administrator registration is not available."], 403);
    }
    if (!hash_equals($ADMIN_CODE, $adminCode)) {
        $log->execute([$email, 0, $ip]);
        sendJson(["error" => "Invalid administrator code."], 403);
    }

    $role = "admin";
}

// Is the email already used?
// The ? is a placeholder: the value is sent separately, which prevents SQL injection.
$check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$check->execute([$email]);
if ($check->fetch()) {
    sendJson(["error" => "That email is already registered."], 409);
}

// Hash the password. We never save the real password.
$hash = password_hash($password, PASSWORD_DEFAULT);

$insert = $pdo->prepare(
    "INSERT INTO users (full_name, email, password, role, student_id, department) VALUES (?, ?, ?, ?, ?, ?)"
);
$insert->execute([
    $fullName, $email, $hash, $role,
    $idNumber === "" ? null : $idNumber,
    $department === "" ? null : $department
]);

if ($role === "admin") {
    $log->execute([$email, 1, $ip]);
    sendJson(["message" => "Administrator account created. Sign in with the Administrator card."], 201);
}
sendJson(["message" => "Account created. You can now sign in."], 201);
