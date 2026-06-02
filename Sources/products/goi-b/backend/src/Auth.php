<?php
/**
 * Auth — quản lý session đăng nhập
 */
class Auth {
    public static function login(array $user): void {
        session_regenerate_id(true);
        $_SESSION['uid']  = (int) $user['id'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['name'] = $user['name'];
    }

    public static function logout(): void {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $p = session_get_cookie_params();
            setcookie(session_name(), '', time() - 3600, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
        }
        session_destroy();
    }

    public static function check(): bool {
        return isset($_SESSION['uid']);
    }

    public static function id(): ?int {
        return $_SESSION['uid'] ?? null;
    }

    public static function role(): ?string {
        return $_SESSION['role'] ?? null;
    }

    public static function user(): ?array {
        if (!self::check()) return null;
        return ['id' => $_SESSION['uid'], 'role' => $_SESSION['role'], 'name' => $_SESSION['name']];
    }

    // Gọi ở đầu mỗi controller cần xác thực — tự exit nếu chưa login
    public static function require(): void {
        if (!self::check()) {
            Response::json(['error' => 'Chưa đăng nhập'], 401);
            exit;
        }
    }
}
