<?php
// The numbers shown on the login page. Only totals: no names and no private data.
require __DIR__ . "/db.php";

$equipment = $pdo->query(
    "SELECT COALESCE(SUM(total_units), 0) AS total, COALESCE(SUM(available_units), 0) AS available FROM equipment"
)->fetch();

$accounts = (int) $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
$requests = (int) $pdo->query("SELECT COUNT(*) FROM borrow_requests")->fetchColumn();
$courses  = (int) $pdo->query("SELECT COUNT(DISTINCT course_code) FROM borrow_requests WHERE course_code IS NOT NULL")->fetchColumn();

// On-time returns: items given back before the promised date and time
$returned = $pdo->query(
    "SELECT COUNT(*) AS total,
            COALESCE(SUM(CASE WHEN date_returned <= TIMESTAMP(return_date, COALESCE(return_time, '23:59:59')) THEN 1 ELSE 0 END), 0) AS on_time
     FROM borrow_requests
     WHERE status = 'Returned'"
)->fetch();

// null means "nothing was returned yet", so there is no percentage to show
$onTime = $returned["total"] > 0 ? (int) round($returned["on_time"] / $returned["total"] * 100) : null;

sendJson([
    "items"     => (int) $equipment["total"],
    "available" => (int) $equipment["available"],
    "on_time"   => $onTime,
    "accounts"  => $accounts,
    "requests"  => $requests,
    "courses"   => $courses
]);
