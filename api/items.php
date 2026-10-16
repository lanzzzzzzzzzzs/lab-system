<?php
// READ: the equipment list and the categories (any logged-in user).
require __DIR__ . "/db.php";

requireLogin();

$items = $pdo->query(
    "SELECT e.id, e.name, e.code, e.category_id, c.name AS category,
            e.total_units, e.available_units, e.inspection_units, e.icon, e.color, e.created_at
     FROM equipment e
     JOIN categories c ON c.id = e.category_id
     ORDER BY e.name"
)->fetchAll();

$categories = $pdo->query("SELECT id, name FROM categories ORDER BY name")->fetchAll();

// Active professors (a student picks one when requesting equipment)
$professors = $pdo->query(
    "SELECT id, full_name, department FROM users
     WHERE role = 'professor' AND status = 'Active'
     ORDER BY full_name"
)->fetchAll();

sendJson(["items" => $items, "categories" => $categories, "professors" => $professors]);
