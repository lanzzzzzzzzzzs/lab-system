<?php
// UPDATE: an administrator changes the "Return by" date and time of a borrowed item.
require __DIR__ . "/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendJson(["error" => "Invalid request."], 405);
}
requireAdmin();

// True when the text is a real date like 2026-10-21
function validDate($text) {
    $date = DateTime::createFromFormat("Y-m-d", $text);
    return $date && $date->format("Y-m-d") === $text;
}

// True when the text is a time like 08:30 or 17:00
function validTime($text) {
    return preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $text) === 1;
}

$input      = getInput();
$id         = (int) ($input["id"] ?? 0);
$returnDate = $input["return_date"] ?? "";
$returnTime = $input["return_time"] ?? "";

if (!validDate($returnDate) || !validTime($returnTime)) {
    sendJson(["error" => "Please choose a valid return date and time."], 400);
}

// Find the request
$stmt = $pdo->prepare("SELECT status, date_reviewed FROM borrow_requests WHERE id = ?");
$stmt->execute([$id]);
$request = $stmt->fetch();
if (!$request) {
    sendJson(["error" => "Request not found."], 404);
}

// Only an item that is still borrowed can be changed.
// A returned item keeps its record, so its on-time or late result stays honest.
if ($request["status"] !== "Approved") {
    sendJson(["error" => "Only items that are currently borrowed can be changed."], 409);
}

// The new return time must come after the moment the item was borrowed
if ("$returnDate $returnTime" <= substr($request["date_reviewed"], 0, 16)) {
    sendJson(["error" => "The return time must be after the time it was borrowed."], 400);
}

$pdo->prepare("UPDATE borrow_requests SET return_date = ?, return_time = ? WHERE id = ?")
    ->execute([$returnDate, $returnTime, $id]);

sendJson(["message" => "Return time updated."]);
