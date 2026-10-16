<?php
// CREATE or UPDATE one piece of equipment (administrators only).
// id = 0  -> add a new item.   id > 0 -> edit that item.
//
// An item has several units. Some of them can be in inspection while the others are fine:
//   total units = available + in inspection + borrowed
// The administrator types the total and the units in inspection.
// The available units are worked out here, so the numbers can never disagree.
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
$inspection = (int) ($input["inspection_units"] ?? 0);
$icon       = $input["icon"] ?? "";
$color      = $input["color"] ?? "";

// Only these values are allowed
$icons  = ["cube", "beaker", "flask", "microscope", "thermometer", "testtube", "tongs",
           "flame", "hotplate", "pipette", "funnel", "goggles", "gloves", "stand"];
$colors = ["indigo", "cyan", "amber", "violet", "emerald", "rose", "teal", "orange", "sky", "fuchsia", "lime"];

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
if ($inspection < 0 || $inspection > $total) {
    sendJson(["error" => "Units in inspection must be between 0 and the total units."], 400);
}
if (!in_array($icon, $icons) || !in_array($color, $colors)) {
    sendJson(["error" => "Invalid icon or color."], 400);
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

// How many units are borrowed right now (approved requests that were not returned yet)
$stmt = $pdo->prepare("SELECT COALESCE(SUM(quantity), 0) FROM borrow_requests WHERE equipment_id = ? AND status = 'Approved'");
$stmt->execute([$id]);
$borrowed = (int) $stmt->fetchColumn();

// Available units are what is left
$available = $total - $inspection - $borrowed;
if ($available < 0) {
    sendJson(["error" => "Not enough free units: $borrowed unit(s) are borrowed right now."], 409);
}

if ($id > 0) {
    $stmt = $pdo->prepare(
        "UPDATE equipment SET name = ?, code = ?, category_id = ?, total_units = ?,
                available_units = ?, inspection_units = ?, icon = ?, color = ?
         WHERE id = ?"
    );
    $stmt->execute([$name, $code, $categoryId, $total, $available, $inspection, $icon, $color, $id]);
    sendJson(["message" => "Equipment updated."]);
}

$stmt = $pdo->prepare(
    "INSERT INTO equipment (name, code, category_id, total_units, available_units, inspection_units, icon, color)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
);
$stmt->execute([$name, $code, $categoryId, $total, $available, $inspection, $icon, $color]);
sendJson(["message" => "Equipment added."], 201);
