<?php
// Saves the changes from the Settings page (UPDATE).
require __DIR__ . "/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendJson(["error" => "Invalid request."], 405);
}

requireLogin();   // only logged-in users can change their profile

$input = getInput();
$fullName   = trim($input["full_name"] ?? "");
$email      = trim($input["email"] ?? "");
$department = trim($input["department"] ?? "");

// Server-side validation
if ($fullName === "" || $email === "") {
    sendJson(["error" => "Please complete all required fields."], 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJson(["error" => "Please enter a valid email address."], 400);
}
if (strlen($fullName) > 100 || strlen($department) > 100) {
    sendJson(["error" => "Name and department must be 100 characters or less."], 400);
}

// Is this email already used by a DIFFERENT person?
$check = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id <> ?");
$check->execute([$email, $_SESSION["user_id"]]);
if ($check->fetch()) {
    sendJson(["error" => "That email is already used by another account."], 409);
}

// Update only this user's row. The role and student ID cannot be changed here.
$update = $pdo->prepare("UPDATE users SET full_name = ?, email = ?, department = ? WHERE id = ?");
$update->execute([$fullName, $email, $department === "" ? null : $department, $_SESSION["user_id"]]);

// Send the fresh data back so the page can show it
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_SESSION["user_id"]]);

sendJson(["message" => "Profile saved.", "user" => userData($stmt->fetch())]);
