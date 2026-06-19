<?php
declare(strict_types=1);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

require_once __DIR__ . '/config.php';

// CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = array_merge(defined('CORS_ORIGINS') ? CORS_ORIGINS : [], [APP_URL]);
if (in_array($origin, $allowed, true) || empty($origin)) {
    $useOrigin = $origin ?: APP_URL;
    header("Access-Control-Allow-Origin: $useOrigin");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-HTTP-Method-Override');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// URI parsing — hỗ trợ cả Apache (REDIRECT_URL) và IIS (HTTP_X_ORIGINAL_URL)
$uri     = $_SERVER['HTTP_X_ORIGINAL_URL'] ?? $_SERVER['REDIRECT_URL'] ?? $_SERVER['REQUEST_URI'] ?? '/';
$rawPath = parse_url($uri, PHP_URL_PATH) ?? '/';
$rawPath = preg_replace('#^/api#', '', $rawPath) ?: '/';

// ⚠️ Health check
if ($rawPath === '/health') {
    header('Content-Type: application/json; charset=utf-8');
    $dbDir = dirname(DB_FILE);
    $schemaPath = __DIR__ . '/schema.sql';
    $info = [
        'status'        => 'ok',
        'php'           => PHP_VERSION,
        'pdo_sqlite'    => extension_loaded('pdo_sqlite'),
        'db_dir'        => $dbDir,
        'db_dir_exists' => is_dir($dbDir),
        'db_dir_write'  => is_writable($dbDir) ? 'writable' : 'NOT WRITABLE',
        'db_exists'     => file_exists(DB_FILE),
        'schema_sql'    => file_exists($schemaPath) ? 'found' : 'MISSING',
        'schema_path'   => $schemaPath,
        'app_url'       => APP_URL,
        'app_env'       => APP_ENV,
        'request_uri'   => $_SERVER['REQUEST_URI'] ?? 'n/a',
        'redirect_url'  => $_SERVER['REDIRECT_URL'] ?? 'n/a',
        'parsed_path'   => $rawPath,
    ];
    // Quick DB test
    if (extension_loaded('pdo_sqlite') && is_writable($dbDir)) {
        try {
            $testPdo = new \PDO('sqlite:' . DB_FILE);
            $tables = $testPdo->query("SELECT name FROM sqlite_master WHERE type='table'")->fetchAll(\PDO::FETCH_COLUMN);
            $info['db_tables'] = $tables;
            $info['db_status'] = 'connected';
        } catch (\Throwable $ex) {
            $info['db_status'] = 'ERROR: ' . $ex->getMessage();
        }
    }
    echo json_encode($info, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
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
    $isProd = defined('APP_ENV') && APP_ENV === 'production';
    // Luôn ghi log đầy đủ vào error_log dù ở production
    error_log('[agency-sang-tao] ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    http_response_code(500);
    echo json_encode([
        'error' => $isProd ? 'Lỗi máy chủ.' : $e->getMessage(),
        'file'  => $isProd ? null : $e->getFile() . ':' . $e->getLine(),
    ], JSON_UNESCAPED_UNICODE);
}
