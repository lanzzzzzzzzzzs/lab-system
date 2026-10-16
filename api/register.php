<?php
// Creates an account.
// "student" is open to everyone. "professor" and "admin" also need a secret code from config.php.
require __DIR__ . "/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendJson(["error" => "Invalid request."], 405);
}

$input = getInput();
$type       = $input["account_type"] ?? "student";   // "student", "professor" or "admin"
$fullName   = trim($input["full_name"] ?? "");
$email      = trim($input["email"] ?? "");
$password   = $input["password"] ?? "";
$idNumber   = trim($input["student_id"] ?? "");      // the student ID or the staff ID
$department = trim($input["department"] ?? "");
$accessCode = (string) ($input["access_code"] ?? "");

if (!in_array($type, ["student", "professor", "admin"])) {
    sendJson(["error" => "Invalid account type."], 400);
}

// Server-side validation (the browser can be bypassed, so PHP checks again)
if ($fullName === "" || $email === "" || $password === "") {
    sendJson(["error" => "Please complete all required fields."], 400);
}
// The student ID (or staff ID) and the department are required for every account
if ($idNumber === "" || $department === "") {
    sendJson(["error" => "Please enter your ID and department."], 400);
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

// The role is decided here on the server. Without the right secret code it is always "student".
$role = "student";

// Every attempt to create a professor or administrator is saved in account_attempts
$log = $pdo->prepare("INSERT INTO account_attempts (email, account_type, success, ip_address) VALUES (?, ?, ?, ?)");
$ip = $_SERVER["REMOTE_ADDR"] ?? "";

if ($type !== "student") {
    if ($idNumber === "" || $department === "" || $accessCode === "") {
        sendJson(["error" => "Please complete all required fields."], 400);
    }

    // The secret code for this account type comes from config.php
    $secret = ($type === "admin") ? ($ADMIN_CODE ?? "") : ($PROFESSOR_CODE ?? "");
    $label  = ($type === "admin") ? "administrator" : "professor";

    if ($secret === "") {
        $log->execute([$email, $type, 0, $ip]);
        sendJson(["error" => "Creating a $label account is not available."], 403);
    }
    // hash_equals compares two texts safely
    if (!hash_equals($secret, $accessCode)) {
        $log->execute([$email, $type, 0, $ip]);
        sendJson(["error" => "Invalid $label code."], 403);
    }

    $role = $type;
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
    $log->execute([$email, $type, 1, $ip]);
    sendJson(["message" => "Administrator account created. Sign in with the Administrator card."], 201);
}
if ($role === "professor") {
    $log->execute([$email, $type, 1, $ip]);
    sendJson(["message" => "Professor account created. Sign in with the Professor card."], 201);
}
sendJson(["message" => "Account created. You can now sign in."], 201);
