<?php
// READ: contact messages.
// An administrator sees everyone's messages (except the archived ones).
// A student or professor sees only their own.
require __DIR__ . "/db.php";

requireLogin();

$sql = "SELECT m.id, m.user_id, u.full_name AS sender, u.email, u.role, u.student_id, u.department,
               m.topic, m.subject, m.message, m.created_at, m.read_at, m.archived
        FROM support_messages m
        JOIN users u ON u.id = m.user_id";

if ($_SESSION["role"] === "admin") {
    $stmt = $pdo->query($sql . " WHERE m.archived = 0 ORDER BY m.id DESC");
} else {
    $stmt = $pdo->prepare($sql . " WHERE m.user_id = ? ORDER BY m.id DESC");
    $stmt->execute([$_SESSION["user_id"]]);
}

sendJson(["messages" => $stmt->fetchAll()]);
