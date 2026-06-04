<?php
declare(strict_types=1);
ini_set('display_errors', '0');
error_reporting(E_ALL);

function jsonError(string $msg, int $code = 500): void {
    if (!headers_sent()) {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
    }
    echo json_encode(['error' => 'Lỗi hệ thống', 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    require_once __DIR__ . '/src/bootstrap.php';
} catch (Throwable $e) {
    // Bootstrap failed (DB connect, missing ext, etc.) — return readable JSON
    $env = defined('APP_ENV') ? APP_ENV : 'production';
    jsonError($env === 'development' ? $e->getMessage() : 'Khởi động hệ thống thất bại. Kiểm tra PHP extension pdo_sqlite và quyền thư mục.');
}

$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Strip /api prefix if accessed via subdirectory
$uri = preg_replace('#^/api#', '', $uri) ?: '/';

try {
    $router->dispatch($method, $uri);
} catch (Throwable $e) {
    Response::json([
        'error'   => 'Lỗi hệ thống',
        'message' => APP_ENV === 'development' ? $e->getMessage() : 'Vui lòng thử lại sau',
    ], 500);
}
