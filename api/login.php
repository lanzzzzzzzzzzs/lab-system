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

// Find the user by email
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

// password_verify compares the typed password with the saved hash.
// We give the same message for a wrong email or a wrong password.
if (!$user || !password_verify($password, $user["password"])) {
    sendJson(["error" => "Invalid email or password."], 401);
}

// A suspended account cannot sign in
if ($user["status"] === "Suspended") {
    sendJson(["error" => "This account is suspended. Please contact the laboratory."], 403);
}

// The card the person chose must match the real role saved in the database
if ($user["role"] !== $role) {
    if ($user["role"] === "admin") {
        sendJson(["error" => "This is an administrator account. Choose Administrator."], 403);
    }
    sendJson(["error" => "This is a student account. Choose Student."], 403);
}

// Log in: new session id (security), then remember who this is
session_regenerate_id(true);
$_SESSION["user_id"] = $user["id"];
$_SESSION["role"] = $user["role"];

sendJson(["user" => userData($user)]);
