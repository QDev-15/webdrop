<?php

class Auth {
    public static function start(): void {
        if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.cookie_httponly', '1');
            ini_set('session.cookie_samesite', 'Lax');
            session_start();
        }
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

    public static function check(): bool {
        self::start();
        return isset($_SESSION['user_id']);
    }

    public static function require(): void {
        if (!self::check()) {
            Response::unauthorized();
        }
    }

    public static function user(): ?array {
        self::start();
        if (!isset($_SESSION['user_id'])) return null;
        return [
            'id'   => $_SESSION['user_id'],
            'name' => $_SESSION['user_name'],
            'role' => $_SESSION['user_role'],
        ];
    }
}
