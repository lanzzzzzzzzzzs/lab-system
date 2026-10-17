<?php
// UPDATE: an administrator marks a message as read, or archives it.
// There is no "reply" here on purpose: replies are sent through Outlook.
require __DIR__ . "/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendJson(["error" => "Invalid request."], 405);
}
requireAdmin();

$input  = getInput();
$id     = (int) ($input["id"] ?? 0);
$action = $input["action"] ?? "";

$check = $pdo->prepare("SELECT id FROM support_messages WHERE id = ?");
$check->execute([$id]);
if (!$check->fetch()) {
    sendJson(["error" => "Message not found."], 404);
}

if ($action === "read") {
    // COALESCE keeps the first time it was opened
    $pdo->prepare("UPDATE support_messages SET read_at = COALESCE(read_at, ?) WHERE id = ?")
        ->execute([date("Y-m-d H:i:s"), $id]);
    sendJson(["message" => "Marked as read."]);
}

if ($action === "archive") {
    $pdo->prepare("UPDATE support_messages SET archived = 1 WHERE id = ?")->execute([$id]);
    sendJson(["message" => "Message archived."]);
}

sendJson(["error" => "Unknown action."], 400);
