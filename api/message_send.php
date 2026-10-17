<?php
// CREATE: a student or professor sends a message to the laboratory (Contact page).
// Administrators do not use it: they are the laboratory.
require __DIR__ . "/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendJson(["error" => "Invalid request."], 405);
}
requireLogin();

if ($_SESSION["role"] === "admin") {
    sendJson(["error" => "Administrators do not need to contact the laboratory."], 403);
}

$input   = getInput();
$topic   = $input["topic"] ?? "";
$subject = trim($input["subject"] ?? "");
$message = trim($input["message"] ?? "");

$topics = ["Borrowing request", "Class authorization", "Equipment issue", "Returns and extensions", "General question"];

if (!in_array($topic, $topics)) {
    sendJson(["error" => "Please choose a topic."], 400);
}
if (strlen($subject) < 3 || strlen($subject) > 150) {
    sendJson(["error" => "Please write a subject of 3 to 150 characters."], 400);
}
if (strlen($message) < 10) {
    sendJson(["error" => "Please write a message of at least 10 characters."], 400);
}
if (strlen($message) > 1000) {
    sendJson(["error" => "The message must be 1000 characters or less."], 400);
}

$stmt = $pdo->prepare("INSERT INTO support_messages (user_id, topic, subject, message) VALUES (?, ?, ?, ?)");
$stmt->execute([$_SESSION["user_id"], $topic, $subject, $message]);

sendJson(["message" => "Request received. The reply will arrive by email."], 201);
