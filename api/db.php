<?php
// Shared code used by every file in the api folder:
// the session, the database connection, and a few small helper functions.

// Send an answer back to JavaScript as JSON, then stop
function sendJson($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// Read the JSON that JavaScript sent with fetch()
function getInput() {
    $input = json_decode(file_get_contents("php://input"), true);
    return is_array($input) ? $input : [];
}

// Stop if nobody is logged in.
// It also checks the database every time, so a suspended or removed account is
// stopped right away, and a changed role (promote / demote) takes effect immediately.
function requireLogin() {
    global $pdo;

    if (!isset($_SESSION["user_id"])) {
        sendJson(["error" => "Please log in first."], 401);
    }

    $stmt = $pdo->prepare("SELECT role, status FROM users WHERE id = ?");
    $stmt->execute([$_SESSION["user_id"]]);
    $user = $stmt->fetch();

    if (!$user || $user["status"] !== "Active") {
        $_SESSION = [];
        session_destroy();
        sendJson(["error" => "Your account is not active."], 401);
    }

    $_SESSION["role"] = $user["role"];
}

// Stop if the logged-in user is not an administrator
function requireAdmin() {
    requireLogin();
    if ($_SESSION["role"] !== "admin") {
        sendJson(["error" => "Administrators only."], 403);
    }
}

// Stop if the logged-in user is not a professor
function requireProfessor() {
    requireLogin();
    if ($_SESSION["role"] !== "professor") {
        sendJson(["error" => "Professors only."], 403);
    }
}

// The user information that is safe to send to the browser (never the password)
function userData($row) {
    return [
        "id" => (int) $row["id"],
        "full_name" => $row["full_name"],
        "email" => $row["email"],
        "role" => $row["role"],
        "student_id" => $row["student_id"],
        "department" => $row["department"]
    ];
}

// Dates and "today" use this timezone. Change it to yours if needed.
date_default_timezone_set("Asia/Manila");

// Start the session (this is how PHP remembers who is logged in)
session_set_cookie_params(["httponly" => true, "samesite" => "Lax"]);
session_start();

header("Content-Type: application/json");

require __DIR__ . "/config.php";

// Connect to MySQL using PDO
try {
    $pdo = new PDO(
        "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
        $DB_USER,
        $DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $e) {
    sendJson(["error" => "Unable to connect to the database."], 500);
}
