<?php
// CREATE: a student asks to borrow items. Each item has a quantity (how many units).
require __DIR__ . "/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendJson(["error" => "Invalid request."], 405);
}
requireLogin();
if ($_SESSION["role"] !== "student") {
    sendJson(["error" => "Only students can request equipment."], 403);
}

$input = getInput();
$items      = $input["items"] ?? [];          // [ { "id": 1, "quantity": 2 }, ... ]
$returnDate = $input["return_date"] ?? "";

if (!is_array($items) || count($items) === 0) {
    sendJson(["error" => "Select at least one item."], 400);
}

// Build a list: equipment id => quantity (the same item twice is added together)
$wanted = [];
foreach ($items as $entry) {
    $id  = is_array($entry) ? (int) ($entry["id"] ?? 0) : 0;
    $qty = is_array($entry) ? (int) ($entry["quantity"] ?? 0) : 0;
    if ($id < 1 || $qty < 1) {
        sendJson(["error" => "Invalid item or quantity."], 400);
    }
    $wanted[$id] = ($wanted[$id] ?? 0) + $qty;
}

// The return date must be a real date, and not in the past
$date = DateTime::createFromFormat("Y-m-d", $returnDate);
if (!$date || $date->format("Y-m-d") !== $returnDate) {
    sendJson(["error" => "Please choose a valid return date."], 400);
}
if ($returnDate < date("Y-m-d")) {
    sendJson(["error" => "The return date cannot be in the past."], 400);
}

// Check every item first, so nothing is saved if one of them is a problem
$findItem = $pdo->prepare("SELECT name, available_units, condition_status FROM equipment WHERE id = ?");

foreach ($wanted as $itemId => $qty) {
    $findItem->execute([$itemId]);
    $item = $findItem->fetch();

    if (!$item) {
        sendJson(["error" => "One of the items does not exist."], 404);
    }
    if ($item["condition_status"] !== "Operational" || $item["available_units"] < 1) {
        sendJson(["error" => $item["name"] . " is not available right now."], 409);
    }
    if ($qty > $item["available_units"]) {
        sendJson(["error" => "Only " . $item["available_units"] . " unit(s) of " . $item["name"] . " are available."], 409);
    }
}

// Save one row per item, all together (a transaction)
$insert = $pdo->prepare("INSERT INTO borrow_requests (user_id, equipment_id, quantity, return_date) VALUES (?, ?, ?, ?)");
$pdo->beginTransaction();
foreach ($wanted as $itemId => $qty) {
    $insert->execute([$_SESSION["user_id"], $itemId, $qty, $returnDate]);
}
$pdo->commit();

sendJson(["message" => "Request submitted. Waiting for approval."], 201);
