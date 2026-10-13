<?php
// CREATE or UPDATE one piece of equipment (administrators only).
// id = 0  -> add a new item.   id > 0 -> edit that item.
require __DIR__ . "/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendJson(["error" => "Invalid request."], 405);
}
requireAdmin();

$input = getInput();
$id         = (int) ($input["id"] ?? 0);
$name       = trim($input["name"] ?? "");
$code       = strtoupper(trim($input["code"] ?? ""));
$categoryId = (int) ($input["category_id"] ?? 0);
$total      = (int) ($input["total_units"] ?? 0);
$available  = (int) ($input["available_units"] ?? 0);
$condition  = $input["condition_status"] ?? "";
$icon       = $input["icon"] ?? "";
$color      = $input["color"] ?? "";

// Only these values are allowed
$conditions = ["Operational", "Inspection", "Maintenance"];
$icons      = ["cube", "beaker", "flask", "microscope", "thermometer"];
$colors     = ["indigo", "cyan", "amber", "violet", "emerald", "rose"];

// Validation
if ($name === "" || $code === "") {
    sendJson(["error" => "Please complete all required fields."], 400);
}
if (strlen($name) > 100 || strlen($code) > 20) {
    sendJson(["error" => "The name or code is too long."], 400);
}
if ($total < 1 || $total > 1000) {
    sendJson(["error" => "Total units must be between 1 and 1000."], 400);
}
if ($available < 0 || $available > $total) {
    sendJson(["error" => "Available units must be between 0 and the total units."], 400);
}
if (!in_array($condition, $conditions) || !in_array($icon, $icons) || !in_array($color, $colors)) {
    sendJson(["error" => "Invalid condition, icon, or color."], 400);
}

// The category must exist
$check = $pdo->prepare("SELECT id FROM categories WHERE id = ?");
$check->execute([$categoryId]);
if (!$check->fetch()) {
    sendJson(["error" => "Please choose a category."], 400);
}

// The code must be unique (ignore the item we are editing)
$check = $pdo->prepare("SELECT id FROM equipment WHERE code = ? AND id <> ?");
$check->execute([$code, $id]);
if ($check->fetch()) {
    sendJson(["error" => "That equipment code is already used."], 409);
}

if ($id > 0) {
    $stmt = $pdo->prepare(
        "UPDATE equipment SET name = ?, code = ?, category_id = ?, total_units = ?,
                available_units = ?, condition_status = ?, icon = ?, color = ?
         WHERE id = ?"
    );
    $stmt->execute([$name, $code, $categoryId, $total, $available, $condition, $icon, $color, $id]);
    sendJson(["message" => "Equipment updated."]);
}

$stmt = $pdo->prepare(
    "INSERT INTO equipment (name, code, category_id, total_units, available_units, condition_status, icon, color)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
);
$stmt->execute([$name, $code, $categoryId, $total, $available, $condition, $icon, $color]);
sendJson(["message" => "Equipment added."], 201);
