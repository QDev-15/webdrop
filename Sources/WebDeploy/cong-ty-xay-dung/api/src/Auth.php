<?php
declare(strict_types=1);

class Auth {
    public static function start(): void {
        if (session_status() === PHP_SESSION_NONE) {
            $sessDir = dirname(DB_FILE) . DIRECTORY_SEPARATOR . 'sessions';
            if (!is_dir($sessDir)) { @mkdir($sessDir, 0755, true); }
            if (is_dir($sessDir) && is_writable($sessDir)) session_save_path($sessDir);
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
            session_name('congtyxaydung_sess');
            session_start();
        }
    }

    public static function login(array $user): void {
        self::start();
        session_regenerate_id(true);
        $_SESSION['user_id']    = $user['id'];
        $_SESSION['user_email'] = $user['email'];
    }

    public static function logout(): void {
        self::start();
        session_unset();
        session_destroy();
    }

    public static function check(): bool {
        self::start();
        return !empty($_SESSION['user_id']);
    }

    public static function require(): void {
        if (!self::check()) {
            http_response_code(401);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Chưa đăng nhập.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    public static function user(): ?array {
        if (!self::check()) return null;
        $db = Database::getInstance();
        return $db->queryOne("SELECT id, name, email, role FROM users WHERE id = ?", [$_SESSION['user_id']]);
    }
}
