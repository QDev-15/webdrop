<?php

class AuthController {
    private Database $db;
    public function __construct(Database $db) { $this->db = $db; }

    public function login(array $p): void {
        $b = bodyJson();
        if (empty($b['email']) || empty($b['password'])) {
            Response::error('Email và mật khẩu không được để trống');
        }
        $user = $this->db->queryOne(
            "SELECT * FROM users WHERE email = ?",
            [trim($b['email'])]
        );
        if (!$user || !password_verify($b['password'], $user['password'])) {
            Response::error('Email hoặc mật khẩu không đúng', 401);
        }
        Auth::login($user);
        Response::json([
            'id'   => $user['id'],
            'name' => $user['name'],
            'role' => $user['role'],
        ]);
    }

    public function logout(array $p): void {
        Auth::logout();
        Response::json(['ok' => true]);
    }

    public function me(array $p): void {
        $user = Auth::user();
        if (!$user) Response::unauthorized();
        Response::json($user);
    }
}
