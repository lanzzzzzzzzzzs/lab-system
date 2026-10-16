<?php
// READ: borrowing requests.
// Administrator: everyone's.  Professor: the ones sent to them.  Student: their own.
require __DIR__ . "/db.php";

requireLogin();

$sql = "SELECT r.id, r.user_id, u.full_name AS student, u.department, r.equipment_id, r.quantity,
               e.name AS item, e.code, r.professor_id, p.full_name AS professor,
               r.course_code, r.course_name, r.section, r.schedule, r.purpose,
               r.date_requested, r.date_needed, r.time_needed, r.return_date, r.return_time,
               r.date_confirmed, r.date_reviewed, r.date_returned, r.status
        FROM borrow_requests r
        JOIN users u ON u.id = r.user_id
        JOIN equipment e ON e.id = r.equipment_id
        LEFT JOIN users p ON p.id = r.professor_id";

if ($_SESSION["role"] === "admin") {
    $stmt = $pdo->query($sql . " ORDER BY r.id DESC");
} elseif ($_SESSION["role"] === "professor") {
    $stmt = $pdo->prepare($sql . " WHERE r.professor_id = ? ORDER BY r.id DESC");
    $stmt->execute([$_SESSION["user_id"]]);
} else {
    $stmt = $pdo->prepare($sql . " WHERE r.user_id = ? ORDER BY r.id DESC");
    $stmt->execute([$_SESSION["user_id"]]);
}

sendJson(["requests" => $stmt->fetchAll()]);
