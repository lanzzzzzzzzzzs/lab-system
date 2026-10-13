<?php
// CREATE: saves a message from the Contact page.
require __DIR__ . "/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendJson(["error" => "Invalid request."], 405);
}
requireLogin();

$input   = getInput();
$topic   = $input["topic"] ?? "";
$message = trim($input["message"] ?? "");

$topics = ["Borrowing request", "Returns and extensions", "Damaged equipment", "Equipment availability", "Account problem", "Other"];

if (!in_array($topic, $topics)) {
    sendJson(["error" => "Please choose a topic."], 400);
}
if (strlen($message) < 10) {
    sendJson(["error" => "Please write a message of at least 10 characters."], 400);
}
if (strlen($message) > 1000) {
    sendJson(["error" => "The message must be 1000 characters or less."], 400);
}

$stmt = $pdo->prepare("INSERT INTO support_messages (user_id, topic, message) VALUES (?, ?, ?)");
$stmt->execute([$_SESSION["user_id"], $topic, $message]);

sendJson(["message" => "Message sent. The laboratory team will reply within one working day."], 201);
