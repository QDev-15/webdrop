<?php
class AuthController {
    public function __construct(private Database $db) {}

    public function login(array $params): void {
        $body  = bodyJson();
        $email = trim($body['email'] ?? '');
        $pass  = $body['password'] ?? '';

        if (!$email || !$pass) {
            Response::error('Email và mật khẩu không được để trống');
        }

        $user = $this->db->queryOne(
            "SELECT * FROM users WHERE email = ?", [$email]
        );

        if (!$user || !password_verify($pass, $user['password'])) {
            Response::error('Email hoặc mật khẩu không đúng', 401);
        }

        Auth::login($user);
        Response::ok(['id' => $user['id'], 'name' => $user['name'], 'role' => $user['role']]);
    }

    public function logout(array $params): void {
        Auth::logout();
        Response::ok();
    }

    public function me(array $params): void {
        Auth::require();
        $user = $this->db->queryOne(
            "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
            [Auth::id()]
        );
        Response::ok($user);
    }
}
