<?php
// Tells the browser who is logged in (used when the page is reloaded).
require __DIR__ . "/db.php";

requireLogin();

$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_SESSION["user_id"]]);
$user = $stmt->fetch();

// The account was deleted while the session was still open
if (!$user) {
    session_destroy();
    sendJson(["error" => "Please log in first."], 401);
}

sendJson(["user" => userData($user)]);
