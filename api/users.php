<?php
// READ: all accounts (administrators only). The password is never sent.
require __DIR__ . "/db.php";

requireAdmin();

$users = $pdo->query(
    "SELECT id, full_name, email, role, student_id, department, status, created_at
     FROM users
     ORDER BY created_at, id"
)->fetchAll();

sendJson(["users" => $users]);
