<?php
// READ: borrowing requests.
// An administrator gets everyone's requests. A student gets only their own.
require __DIR__ . "/db.php";

requireLogin();

$sql = "SELECT r.id, r.user_id, u.full_name AS student, u.department, r.equipment_id, r.quantity,
               e.name AS item, e.code, r.date_requested, r.return_date,
               r.date_reviewed, r.date_returned, r.status
        FROM borrow_requests r
        JOIN users u ON u.id = r.user_id
        JOIN equipment e ON e.id = r.equipment_id";

if ($_SESSION["role"] === "admin") {
    $stmt = $pdo->query($sql . " ORDER BY r.id DESC");
} else {
    $stmt = $pdo->prepare($sql . " WHERE r.user_id = ? ORDER BY r.id DESC");
    $stmt->execute([$_SESSION["user_id"]]);
}

sendJson(["requests" => $stmt->fetchAll()]);
