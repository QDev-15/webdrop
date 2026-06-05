<?php
declare(strict_types=1);

class Auth {
    private static ?array $currentUser = null;

    public static function start(): void {
        if (session_status() === PHP_SESSION_NONE) {
            $secure   = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
            $sameSite = $secure ? 'None' : 'Lax';
            session_set_cookie_params([
                'lifetime' => 86400 * 30,
                'path'     => '/',
                'secure'   => $secure,
                'httponly' => true,
                'samesite' => $sameSite,
            ]);
            session_start();
        }
    }

    public static function login(array $user): void {
        self::start();
        session_regenerate_id(true);
        $_SESSION['user_id']   = $user['id'];
        $_SESSION['user_role'] = $user['role'];
    }

    public static function logout(): void {
        self::start();
        session_destroy();
    }

    public static function user(): ?array {
        if (self::$currentUser !== null) {
            return self::$currentUser;
        }
        self::start();
        if (!isset($_SESSION['user_id'])) return null;
        $db   = Database::getInstance();
        $user = $db->queryOne("SELECT id, name, email, role FROM users WHERE id=?", [$_SESSION['user_id']]);
        self::$currentUser = $user ?: null;
        return self::$currentUser;
    }

    public static function check(): bool {
        return self::user() !== null;
    }

    public static function require(): void {
        if (!self::check()) {
            http_response_code(401);
            echo json_encode(['error' => 'Chưa đăng nhập.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }
}
