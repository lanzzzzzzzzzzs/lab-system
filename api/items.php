<?php
// READ: the equipment list and the categories (any logged-in user).
require __DIR__ . "/db.php";

requireLogin();

$items = $pdo->query(
    "SELECT e.id, e.name, e.code, e.category_id, c.name AS category,
            e.total_units, e.available_units, e.condition_status, e.icon, e.color, e.created_at
     FROM equipment e
     JOIN categories c ON c.id = e.category_id
     ORDER BY e.name"
)->fetchAll();

$categories = $pdo->query("SELECT id, name FROM categories ORDER BY name")->fetchAll();

sendJson(["items" => $items, "categories" => $categories]);
