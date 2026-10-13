<?php
require __DIR__ . "/db.php";

// Forget everything about this session
$_SESSION = [];
session_destroy();

sendJson(["message" => "Logged out."]);
