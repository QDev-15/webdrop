<?php
declare(strict_types=1);

class Auth {
    private static ?array $currentUser = null;

    public static function start(): void {
        if (session_status() === PHP_SESSION_NONE) {
            // Sessions stored next to DB — already protected from web access
            $sessDir = dirname(DB_FILE) . DIRECTORY_SEPARATOR . 'sessions';
            if (!is_dir($sessDir)) { @mkdir($sessDir, 0755, true); }
            if (is_dir($sessDir) && is_writable($sessDir)) session_save_path($sessDir);
            // HTTPS detection — includes IIS reverse proxy (X-Forwarded-Proto)
            $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
                     || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https'
                     || ($_SERVER['HTTP_X_FORWARDED_SSL']   ?? '') === 'on'
                     || ($_SERVER['SERVER_PORT'] ?? '') === '443';
            session_set_cookie_params([
                'lifetime' => 86400,
                'path'     => '/',
                'secure'   => $isHttps,
                'httponly' => true,
                'samesite' => 'Lax',
            ]);
            session_name('QuanAnPhoBien');  // unique per site — must be alphanumeric only (PHP 8 rejects hyphens)
            session_start();
        }
    }

    public static function login(array $user): void {
        self::start();
        session_regenerate_id(true);
        $_SESSION['user_id']    = $user['id'];
        $_SESSION['user_name']  = $user['name'];
        $_SESSION['user_email'] = $user['email'] ?? '';
        $_SESSION['user_role']  = $user['role'];
        self::$currentUser = $user;
    }

    public static function logout(): void {
        self::start();
        session_destroy();
        self::$currentUser = null;
    }

    public static function user(): ?array {
        self::start();
        if (empty($_SESSION['user_id'])) return null;
        return [
            'id'    => $_SESSION['user_id'],
            'name'  => $_SESSION['user_name'],
            'email' => $_SESSION['user_email'] ?? '',
            'role'  => $_SESSION['user_role'],
        ];
    }

    public static function require(): void {
        $user = self::user();
        if (!$user) {
            header('Content-Type: application/json; charset=utf-8');
            http_response_code(401);
            echo json_encode(['error' => 'Chưa đăng nhập.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    public static function requireRole(string $role): void {
        self::require();
        $user = self::user();
        if ($user['role'] !== $role) {
            header('Content-Type: application/json; charset=utf-8');
            http_response_code(403);
            echo json_encode(['error' => 'Không có quyền.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }
}
