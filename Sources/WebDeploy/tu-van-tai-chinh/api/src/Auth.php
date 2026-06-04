<?php
declare(strict_types=1);

class Auth {
    public static function start(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_set_cookie_params([
                'lifetime' => 86400 * 7,
                'path'     => '/',
                'secure'   => isset($_SERVER['HTTPS']),
                'httponly' => true,
                'samesite' => 'Lax',
            ]);
            session_start();
        }
    }

    public static function require(): void {
        self::start();
        if (empty($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Chưa đăng nhập.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    public static function user(): ?array {
        self::start();
        if (empty($_SESSION['user_id'])) return null;
        return [
            'id'   => $_SESSION['user_id'],
            'name' => $_SESSION['user_name'] ?? '',
            'role' => $_SESSION['user_role'] ?? 'user',
        ];
    }

    public static function login(array $user): void {
        self::start();
        session_regenerate_id(true);
        $_SESSION['user_id']   = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_role'] = $user['role'];
    }

    public static function logout(): void {
        self::start();
        session_destroy();
    }
}
