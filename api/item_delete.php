<?php
// DELETE one piece of equipment (administrators only).
require __DIR__ . "/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendJson(["error" => "Invalid request."], 405);
}
requireAdmin();

$input = getInput();
$id = (int) ($input["id"] ?? 0);

// An item that has borrowing records must stay, so the history is not lost
$check = $pdo->prepare("SELECT COUNT(*) FROM borrow_requests WHERE equipment_id = ?");
$check->execute([$id]);
if ($check->fetchColumn() > 0) {
    sendJson(["error" => "This item has borrowing records, so it cannot be deleted. Set its condition to Maintenance instead."], 409);
}

$stmt = $pdo->prepare("DELETE FROM equipment WHERE id = ?");
$stmt->execute([$id]);

sendJson(["message" => "Equipment deleted."]);
