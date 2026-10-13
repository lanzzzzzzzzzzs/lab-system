<?php
// UPDATE: change another person's access level or status (administrators only).
require __DIR__ . "/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendJson(["error" => "Invalid request."], 405);
}
requireAdmin();

$input  = getInput();
$id     = (int) ($input["id"] ?? 0);
$action = $input["action"] ?? "";

// You cannot change your own account here (so you cannot lock yourself out)
if ($id === (int) $_SESSION["user_id"]) {
    sendJson(["error" => "You cannot change your own account."], 400);
}

$stmt = $pdo->prepare("SELECT role, status FROM users WHERE id = ?");
$stmt->execute([$id]);
$user = $stmt->fetch();
if (!$user) {
    sendJson(["error" => "User not found."], 404);
}

if ($action === "promote") {
    $pdo->prepare("UPDATE users SET role = 'admin' WHERE id = ?")->execute([$id]);
    sendJson(["message" => "User promoted to administrator."]);
}
if ($action === "demote") {
    $pdo->prepare("UPDATE users SET role = 'student' WHERE id = ?")->execute([$id]);
    sendJson(["message" => "User changed to student."]);
}
if ($action === "suspend") {
    $pdo->prepare("UPDATE users SET status = 'Suspended' WHERE id = ?")->execute([$id]);
    sendJson(["message" => "Account suspended."]);
}
if ($action === "activate") {
    $pdo->prepare("UPDATE users SET status = 'Active' WHERE id = ?")->execute([$id]);
    sendJson(["message" => "Account reactivated."]);
}

sendJson(["error" => "Unknown action."], 400);
