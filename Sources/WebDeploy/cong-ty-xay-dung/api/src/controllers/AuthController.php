<?php
declare(strict_types=1);

class AuthController {
    public function __construct(private Database $db) {}

    public function login(array $p): void {
        $b = bodyJson();
        $email    = trim($b['email'] ?? '');
        $password = $b['password'] ?? '';
        if (!$email || !$password) {
            Response::error('Email và mật khẩu không được để trống.'); return;
        }
        $user = $this->db->queryOne("SELECT * FROM users WHERE email = ?", [$email]);
        if (!$user || !password_verify($password, $user['password'])) {
            Response::error('Email hoặc mật khẩu không đúng.', 401); return;
        }
        Auth::login($user);
        Response::json(['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email'], 'role' => $user['role']]);
    }

    public function logout(array $p): void {
        Auth::logout();
        Response::json(['ok' => true]);
    }

    public function me(array $p): void {
        Auth::require();
        $user = Auth::user();
        if (!$user) { Response::error('Không tìm thấy người dùng.', 404); return; }
        Response::json($user);
    }
}
