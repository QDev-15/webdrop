<?php
declare(strict_types=1);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

require_once __DIR__ . '/config.php';

// CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = array_merge([APP_URL], defined('CORS_ORIGINS') ? CORS_ORIGINS : []);
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: ' . APP_URL);
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-HTTP-Method-Override, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// URI parsing — hỗ trợ Apache và IIS
$uri     = $_SERVER['HTTP_X_ORIGINAL_URL'] ?? $_SERVER['REDIRECT_URL'] ?? $_SERVER['REQUEST_URI'] ?? '/';
$rawPath = parse_url($uri, PHP_URL_PATH) ?? '/';
$rawPath = preg_replace('#^/api#', '', $rawPath) ?: '/';

// Health check
if ($rawPath === '/health') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'status'      => 'ok',
        'php'         => PHP_VERSION,
        'pdo_sqlite'  => extension_loaded('pdo_sqlite'),
        'db_dir'      => is_writable(dirname(DB_FILE)) ? 'writable' : 'not writable',
        'db_exists'   => file_exists(DB_FILE),
        'schema_sql'  => file_exists(__DIR__ . '/schema.sql') ? 'found' : 'MISSING',
        'path'        => $rawPath,
    ]);
    exit;
}

try {
    $router = require_once __DIR__ . '/src/bootstrap.php';
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method === 'POST') {
        $override = strtoupper($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ?? '');
        if (in_array($override, ['PUT', 'PATCH', 'DELETE'], true)) {
            $method = $override;
        }
    }
    $router->dispatch($method, $rawPath);
} catch (Throwable $e) {
    if (!headers_sent()) header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    // Luôn hiển thị message để dễ debug — không lộ source code
    $msg = $e->getMessage();
    // Ẩn đường dẫn tuyệt đối khỏi message
    $msg = preg_replace('#[A-Za-z]?:?[/\\\\][^\s:]+#', '[path]', $msg);
    echo json_encode(['error' => $msg], JSON_UNESCAPED_UNICODE);
}
