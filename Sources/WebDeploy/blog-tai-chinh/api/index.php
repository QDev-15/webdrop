<?php
declare(strict_types=1);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

require_once __DIR__ . '/config.php';

// CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = array_merge([APP_URL], defined('CORS_ORIGINS') ? CORS_ORIGINS : []);
if ($origin && in_array(rtrim($origin, '/'), array_map(fn($o) => rtrim($o, '/'), $allowed), true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-HTTP-Method-Override');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// URI parsing — hỗ trợ cả Apache (REDIRECT_URL) và IIS (HTTP_X_ORIGINAL_URL)
$uri     = $_SERVER['HTTP_X_ORIGINAL_URL'] ?? $_SERVER['REDIRECT_URL'] ?? $_SERVER['REQUEST_URI'] ?? '/';
$rawPath = parse_url($uri, PHP_URL_PATH) ?? '/';
$rawPath = preg_replace('#^/api#', '', $rawPath) ?: '/';

// ⚠️  Health check — LUÔN phải có để khách tự diagnose sau deploy
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
    // KHÔNG gán "$router = require_once(...)" — require_once trả về giá trị mặc định (1)
    // nếu bootstrap.php không có "return $router;" ở cuối, sẽ ĐÈ MẤT biến $router thật.
    // bootstrap.php chạy cùng scope với try{} này nên $router tự tồn tại sau require_once.
    require_once __DIR__ . '/src/bootstrap.php';
    // X-HTTP-Method-Override: shared hosting IIS/WebDAV block PUT/DELETE
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
    $isProd = defined('APP_ENV') && APP_ENV === 'production';
    http_response_code(500);
    echo json_encode([
        'error' => $isProd ? 'Lỗi máy chủ.' : $e->getMessage(),
        'file'  => $isProd ? null : $e->getFile() . ':' . $e->getLine(),
    ], JSON_UNESCAPED_UNICODE);
}
