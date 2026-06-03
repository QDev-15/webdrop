<?php
declare(strict_types=1);

// Maintenance mode check (before loading anything else)
if (file_exists(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
} else {
    http_response_code(503);
    echo json_encode(['error' => 'config.php not found']);
    exit;
}

// Check maintenance mode
// (Settings not available before DB init, so we read a flag file)
if (file_exists(__DIR__ . '/maintenance.flag')) {
    http_response_code(503);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Website đang bảo trì. Vui lòng quay lại sau.']);
    exit;
}

require_once __DIR__ . '/src/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri    = $_SERVER['REQUEST_URI'];

// Strip base path prefix — handles /api/... deployments
$basePath = '/api';
if (str_starts_with($uri, $basePath)) {
    $uri = substr($uri, strlen($basePath));
}
if ($uri === '' || $uri === false) {
    $uri = '/';
}

$router->dispatch($method, $uri);
