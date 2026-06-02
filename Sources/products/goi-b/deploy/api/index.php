<?php
require_once __DIR__ . '/config.php';

// CORS — chỉ cho phép origin trong whitelist, không dùng wildcard kèm credentials
$origin  = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = APP_ENV === 'development'
    ? ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173']
    : [rtrim(APP_URL, '/')];

if (in_array($origin, $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');
header('Vary: Origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/src/bootstrap.php';
