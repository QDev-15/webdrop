<?php
declare(strict_types=1);

class Auth {
    private static ?array $currentUser = null;

    public static function start(): void {
        if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.cookie_httponly', '1');
            ini_set('session.cookie_samesite', 'Lax');
            session_name('blog_session');
            session_start();
        }
    }

    public static function login(array $user): void {
        self::start();
        session_regenerate_id(true);
        $_SESSION['user_id']   = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email']= $user['email'];
        $_SESSION['user_role'] = $user['role'];
        self::$currentUser = $user;
    }

    public static function logout(): void {
        self::start();
        session_destroy();
        self::$currentUser = null;
    }

    public static function check(): bool {
        self::start();
        return !empty($_SESSION['user_id']);
    }

    public static function user(): ?array {
        if (!self::check()) return null;
        return [
            'id'    => $_SESSION['user_id'],
            'name'  => $_SESSION['user_name'],
            'email' => $_SESSION['user_email'],
            'role'  => $_SESSION['user_role'],
        ];
    }

    public static function require(): void {
        if (!self::check()) {
            http_response_code(401);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Chưa đăng nhập.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    public static function requireRole(string $role): void {
        self::require();
        $user = self::user();
        if ($user['role'] !== $role && $user['role'] !== 'superadmin') {
            http_response_code(403);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Không có quyền.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }
}
