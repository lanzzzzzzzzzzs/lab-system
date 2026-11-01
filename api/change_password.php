<?php
// Changes the password of the logged-in user (UPDATE).
require __DIR__ . "/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendJson(["error" => "Invalid request."], 405);
}

requireLogin();   // only logged-in users can change their password

$input   = getInput();
$current = $input["current_password"] ?? "";
$new     = $input["new_password"] ?? "";
$confirm = $input["confirm_password"] ?? "";

// Server-side validation (the browser checks too, but never trust only the browser)
if ($current === "") {
    sendJson(["error" => "Enter your current password.", "field" => "current"], 400);
}
if (strlen($new) < 8) {
    sendJson(["error" => "Use at least 8 characters.", "field" => "new"], 400);
}
if (strlen($new) > 72) {   // bcrypt only uses the first 72 bytes
    sendJson(["error" => "Use 72 characters or fewer.", "field" => "new"], 400);
}
if ($new !== $confirm) {
    sendJson(["error" => "Passwords do not match.", "field" => "confirm"], 400);
}

// Check the current password against the saved hash
$stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
$stmt->execute([$_SESSION["user_id"]]);
$row = $stmt->fetch();

if (!$row || !password_verify($current, $row["password"])) {
    sendJson(["error" => "Your current password is incorrect.", "field" => "current"], 403);
}

// The new password must be different from the current one
if (password_verify($new, $row["password"])) {
    sendJson(["error" => "Choose a password different from your current one.", "field" => "new"], 400);
}

// Save only the hash, never the plain password
$update = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
$update->execute([password_hash($new, PASSWORD_DEFAULT), $_SESSION["user_id"]]);

session_regenerate_id(true);   // fresh session id after a security change

sendJson(["message" => "Password updated."]);
