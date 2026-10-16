<?php
// UPDATE: change another person's role or status (administrators only).
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

if ($action === "role") {
    $newRole = $input["role"] ?? "";
    if (!in_array($newRole, ["student", "professor", "admin"])) {
        sendJson(["error" => "Invalid role."], 400);
    }

    // A professor with requests waiting for confirmation must finish them first
    if ($user["role"] === "professor" && $newRole !== "professor") {
        $check = $pdo->prepare("SELECT COUNT(*) FROM borrow_requests WHERE professor_id = ? AND status = 'Pending'");
        $check->execute([$id]);
        if ($check->fetchColumn() > 0) {
            sendJson(["error" => "This professor still has requests waiting for confirmation."], 409);
        }
    }

    $pdo->prepare("UPDATE users SET role = ? WHERE id = ?")->execute([$newRole, $id]);
    sendJson(["message" => "Role updated."]);
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
