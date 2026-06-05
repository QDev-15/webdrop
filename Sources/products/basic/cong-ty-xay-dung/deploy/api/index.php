<?php
declare(strict_types=1);

ini_set('display_errors', '0');
ini_set('log_errors', '1');

require_once __DIR__ . '/config.php';

// Lấy path gốc: IIS dùng HTTP_X_ORIGINAL_URL, Apache dùng REQUEST_URI
$uri = $_SERVER['HTTP_X_ORIGINAL_URL']
    ?? $_SERVER['REDIRECT_URL']
    ?? $_SERVER['REQUEST_URI']
    ?? '/';
$rawPath = parse_url($uri, PHP_URL_PATH) ?? '/';
$rawPath = preg_replace('#^/api#', '', $rawPath) ?: '/';

// Health check — không cần DB hay session
if ($rawPath === '/health') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'status'       => 'ok',
        'php'          => PHP_VERSION,
        'pdo_sqlite'   => extension_loaded('pdo_sqlite'),
        'db_writable'  => is_writable(dirname(DB_FILE)),
        'db_exists'    => file_exists(DB_FILE),
        'request_uri'  => $_SERVER['REQUEST_URI']  ?? null,
        'original_url' => $_SERVER['HTTP_X_ORIGINAL_URL'] ?? null,
        'redirect_url' => $_SERVER['REDIRECT_URL'] ?? null,
        'path_detected'=> $rawPath,
    ]);
    exit;
}

try {
    $router = require_once __DIR__ . '/src/bootstrap.php';
    $router->dispatch($_SERVER['REQUEST_METHOD'], $rawPath);
} catch (Throwable $e) {
    if (!headers_sent()) {
        header('Content-Type: application/json; charset=utf-8');
    }
    $isProd = defined('APP_ENV') && APP_ENV === 'production';
    http_response_code($isProd ? 500 : 500);
    echo json_encode([
        'error' => $isProd ? 'Lỗi máy chủ.' : $e->getMessage(),
        'file'  => $isProd ? null : $e->getFile() . ':' . $e->getLine(),
    ]);
}
