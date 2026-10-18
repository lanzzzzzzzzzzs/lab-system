<?php
// CREATE: a student asks to borrow items for a laboratory class.
// The request waits for the chosen professor to confirm it.
require __DIR__ . "/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendJson(["error" => "Invalid request."], 405);
}
requireLogin();
if ($_SESSION["role"] !== "student") {
    sendJson(["error" => "Only students can request equipment."], 403);
}

// True when the text is a real date like 2026-10-21
function validDate($text) {
    $date = DateTime::createFromFormat("Y-m-d", $text);
    return $date && $date->format("Y-m-d") === $text;
}

// True when the text is a time like 08:30 or 17:00
function validTime($text) {
    return preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $text) === 1;
}

$input = getInput();
$items       = $input["items"] ?? [];          // [ { "id": 1, "quantity": 2 }, ... ]
$professorId = (int) ($input["professor_id"] ?? 0);
$courseCode  = trim($input["course_code"] ?? "");
$courseName  = trim($input["course_name"] ?? "");
$section     = trim($input["section"] ?? "");
$schedule    = trim($input["schedule"] ?? "");
$purpose     = trim($input["purpose"] ?? "");
$dateNeeded  = $input["date_needed"] ?? "";
$timeNeeded  = $input["time_needed"] ?? "";
$returnDate  = $input["return_date"] ?? "";
$returnTime  = $input["return_time"] ?? "";

if (!is_array($items) || count($items) === 0) {
    sendJson(["error" => "Select at least one item."], 400);
}

// The class details are required: they are what the professor confirms
if ($professorId < 1 || $courseCode === "" || $courseName === "" || $section === "" || $schedule === "" || $purpose === "") {
    sendJson(["error" => "Please complete the class details."], 400);
}
if (strlen($courseCode) > 20 || strlen($courseName) > 100 || strlen($section) > 30 || strlen($schedule) > 100 || strlen($purpose) > 200) {
    sendJson(["error" => "One of the class details is too long."], 400);
}

// The professor must exist and be active
$stmt = $pdo->prepare("SELECT id FROM users WHERE id = ? AND role = 'professor' AND status = 'Active'");
$stmt->execute([$professorId]);
if (!$stmt->fetch()) {
    sendJson(["error" => "Please choose a valid professor."], 400);
}

// Dates and times must be real, the date needed cannot be in the past,
// and the return must come after the time needed
if (!validDate($dateNeeded) || !validDate($returnDate) || !validTime($timeNeeded) || !validTime($returnTime)) {
    sendJson(["error" => "Please choose valid dates and times."], 400);
}
if ($dateNeeded < date("Y-m-d")) {
    sendJson(["error" => "The date needed cannot be in the past."], 400);
}
if ("$returnDate $returnTime" <= "$dateNeeded $timeNeeded") {
    sendJson(["error" => "The return must be after the time needed."], 400);
}

// Build a list: equipment id => quantity (the same item twice is added together)
$wanted = [];
foreach ($items as $entry) {
    $id  = is_array($entry) ? (int) ($entry["id"] ?? 0) : 0;
    $qty = is_array($entry) ? (int) ($entry["quantity"] ?? 0) : 0;
    if ($id < 1 || $qty < 1) {
        sendJson(["error" => "Invalid item or quantity."], 400);
    }
    $wanted[$id] = ($wanted[$id] ?? 0) + $qty;
}

// Check every item first, so nothing is saved if one of them is a problem
$findItem = $pdo->prepare("SELECT name, available_units FROM equipment WHERE id = ?");

foreach ($wanted as $itemId => $qty) {
    $findItem->execute([$itemId]);
    $item = $findItem->fetch();

    if (!$item) {
        sendJson(["error" => "One of the items does not exist."], 404);
    }
    if ($item["available_units"] < 1) {
        sendJson(["error" => $item["name"] . " is not available right now."], 409);
    }
    if ($qty > $item["available_units"]) {
        sendJson(["error" => "Only " . $item["available_units"] . " unit(s) of " . $item["name"] . " are available."], 409);
    }
}

// Save one row per item, all together (a transaction). The status starts as Pending.
$insert = $pdo->prepare(
    "INSERT INTO borrow_requests
        (user_id, equipment_id, quantity, professor_id, course_code, course_name, section, schedule, purpose,
         date_needed, time_needed, return_date, return_time)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
$pdo->beginTransaction();
foreach ($wanted as $itemId => $qty) {
    $insert->execute([
        $_SESSION["user_id"], $itemId, $qty, $professorId,
        $courseCode, $courseName, $section, $schedule, $purpose,
        $dateNeeded, $timeNeeded, $returnDate, $returnTime
    ]);
}
$pdo->commit();

sendJson(["message" => "Request sent. Your professor will confirm your class first."], 201);
