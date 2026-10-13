<?php
// DELETE: remove an account (administrators only).
require __DIR__ . "/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendJson(["error" => "Invalid request."], 405);
}
requireAdmin();

$input = getInput();
$id = (int) ($input["id"] ?? 0);

if ($id === (int) $_SESSION["user_id"]) {
    sendJson(["error" => "You cannot remove your own account."], 400);
}

// A person who still holds borrowed equipment cannot be removed
$check = $pdo->prepare("SELECT COUNT(*) FROM borrow_requests WHERE user_id = ? AND status = 'Approved'");
$check->execute([$id]);
if ($check->fetchColumn() > 0) {
    sendJson(["error" => "This user still has borrowed equipment. Mark it as returned first."], 409);
}

// Delete the person's own records first, then the account (all together)
$pdo->beginTransaction();
$pdo->prepare("DELETE FROM borrow_requests WHERE user_id = ?")->execute([$id]);
$pdo->prepare("DELETE FROM support_messages WHERE user_id = ?")->execute([$id]);
$pdo->prepare("DELETE FROM users WHERE id = ?")->execute([$id]);
$pdo->commit();

sendJson(["message" => "Account removed."]);
