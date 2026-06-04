<?php
declare(strict_types=1);

ini_set('display_errors', '0');
ini_set('log_errors', '1');

require_once __DIR__ . '/config.php';

// IIS: HTTP_X_ORIGINAL_URL, Apache: REQUEST_URI
$uri     = $_SERVER['HTTP_X_ORIGINAL_URL']
        ?? $_SERVER['REDIRECT_URL']
        ?? $_SERVER['REQUEST_URI']
        ?? '/';
$path    = parse_url($uri, PHP_URL_PATH) ?? '/';
$path    = preg_replace('#^/api#', '', $path) ?: '/';

// Health check
if ($path === '/health') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'status'       => 'ok',
        'php'          => PHP_VERSION,
        'pdo_sqlite'   => extension_loaded('pdo_sqlite'),
        'db_writable'  => is_writable(dirname(DB_FILE)),
        'db_exists'    => file_exists(DB_FILE),
        'original_url' => $_SERVER['HTTP_X_ORIGINAL_URL'] ?? null,
        'request_uri'  => $_SERVER['REQUEST_URI'] ?? null,
        'path_detected'=> $path,
    ]);
    exit;
}

try {
    $router = require_once __DIR__ . '/src/bootstrap.php';
    $router->dispatch($_SERVER['REQUEST_METHOD'], $path);
} catch (Throwable $e) {
    if (!headers_sent()) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(500);
    }
    $isProd = defined('APP_ENV') && APP_ENV === 'production';
    echo json_encode([
        'error' => $isProd ? 'Lỗi máy chủ.' : $e->getMessage(),
        'file'  => $isProd ? null : $e->getFile() . ':' . $e->getLine(),
    ]);
}
