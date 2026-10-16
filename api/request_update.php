<?php
// UPDATE: an administrator approves, declines, or marks a request as returned.
require __DIR__ . "/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendJson(["error" => "Invalid request."], 405);
}
requireAdmin();

$input  = getInput();
$id     = (int) ($input["id"] ?? 0);
$action = $input["action"] ?? "";

// Find the request and its equipment
$stmt = $pdo->prepare("SELECT * FROM borrow_requests WHERE id = ?");
$stmt->execute([$id]);
$request = $stmt->fetch();
if (!$request) {
    sendJson(["error" => "Request not found."], 404);
}

$stmt = $pdo->prepare("SELECT * FROM equipment WHERE id = ?");
$stmt->execute([$request["equipment_id"]]);
$item = $stmt->fetch();

$now = date("Y-m-d H:i:s");   // the day and the time

if ($action === "approve") {
    if ($request["status"] !== "Authorized") {
        sendJson(["error" => "The professor must authorize this request first."], 409);
    }
    if ($item["available_units"] < $request["quantity"]) {
        sendJson(["error" => "Not enough units of this equipment are available."], 409);
    }

    // Two changes that must happen together: take the units, mark the request approved
    $pdo->beginTransaction();
    $pdo->prepare("UPDATE equipment SET available_units = available_units - ? WHERE id = ?")
        ->execute([$request["quantity"], $item["id"]]);
    $pdo->prepare("UPDATE borrow_requests SET status = 'Approved', date_reviewed = ? WHERE id = ?")
        ->execute([$now, $id]);
    $pdo->commit();

    sendJson(["message" => "Request approved."]);
}

if ($action === "decline") {
    if (!in_array($request["status"], ["Pending", "Authorized"])) {
        sendJson(["error" => "Only requests that are still waiting can be declined."], 409);
    }
    $pdo->prepare("UPDATE borrow_requests SET status = 'Declined', date_reviewed = ? WHERE id = ?")
        ->execute([$now, $id]);

    sendJson(["message" => "Request declined."]);
}

if ($action === "return") {
    if ($request["status"] !== "Approved") {
        sendJson(["error" => "Only borrowed items can be marked as returned."], 409);
    }

    // Mark returned and give the units back (never more than the total)
    $pdo->beginTransaction();
    $pdo->prepare("UPDATE borrow_requests SET status = 'Returned', date_returned = ? WHERE id = ?")
        ->execute([$now, $id]);
    $pdo->prepare("UPDATE equipment SET available_units = LEAST(available_units + ?, total_units - inspection_units) WHERE id = ?")
        ->execute([$request["quantity"], $item["id"]]);
    $pdo->commit();

    sendJson(["message" => "Item marked as returned."]);
}

sendJson(["error" => "Unknown action."], 400);
