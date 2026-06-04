<?php
declare(strict_types=1);

class AuthController
{
    public function __construct(private Database $db) {}

    public function login(array $p): void
    {
        $b        = bodyJson();
        $email    = trim($b['email'] ?? '');
        $password = $b['password'] ?? '';

        if (!$email || !$password) {
            Response::error('Email và mật khẩu không được để trống.');
        }

        $user = $this->db->row("SELECT * FROM users WHERE email = ?", [$email]);
        if (!$user || !password_verify($password, $user['password'])) {
            Response::error('Email hoặc mật khẩu không đúng.', 401);
        }

        Auth::login($user);
        Response::json([
            'id'   => $user['id'],
            'name' => $user['name'],
            'role' => $user['role'],
        ]);
    }

    public function logout(array $p): void
    {
        Auth::logout();
        Response::json(['ok' => true]);
    }

    public function me(array $p): void
    {
        Auth::require();
        Response::json(Auth::user());
    }
}
