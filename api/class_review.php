<?php
// UPDATE: a professor authorizes or declines a request that was sent to them.
require __DIR__ . "/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendJson(["error" => "Invalid request."], 405);
}
requireProfessor();

$input  = getInput();
$id     = (int) ($input["id"] ?? 0);
$action = $input["action"] ?? "";

// A professor can only review requests that were sent to them
$stmt = $pdo->prepare("SELECT status FROM borrow_requests WHERE id = ? AND professor_id = ?");
$stmt->execute([$id, $_SESSION["user_id"]]);
$request = $stmt->fetch();
if (!$request) {
    sendJson(["error" => "Request not found."], 404);
}
if ($request["status"] !== "Pending") {
    sendJson(["error" => "This request was already reviewed."], 409);
}

$now = date("Y-m-d H:i:s");   // the day and the time

if ($action === "authorize") {
    $pdo->prepare("UPDATE borrow_requests SET status = 'Authorized', date_confirmed = ? WHERE id = ?")
        ->execute([$now, $id]);
    sendJson(["message" => "Request authorized. The laboratory will review it next."]);
}

if ($action === "decline") {
    $pdo->prepare("UPDATE borrow_requests SET status = 'Declined', date_confirmed = ?, date_reviewed = ? WHERE id = ?")
        ->execute([$now, $now, $id]);
    sendJson(["message" => "Request declined."]);
}

sendJson(["error" => "Unknown action."], 400);
