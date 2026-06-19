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

    public function updateProfile(array $p): void {
        Auth::require();
        $current = Auth::user();
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if ($name === '') Response::error('Họ tên không được để trống');
        if (!empty($b['old_password']) && !empty($b['new_password'])) {
            $row = $this->db->queryOne("SELECT password FROM users WHERE id=?", [$current['id']]);
            if (!$row || !password_verify($b['old_password'], $row['password'])) {
                Response::error('Mật khẩu hiện tại không đúng', 400);
            }
            $this->db->execute(
                "UPDATE users SET name=?, password=? WHERE id=?",
                [$name, password_hash($b['new_password'], PASSWORD_BCRYPT), $current['id']]
            );
        } else {
            $this->db->execute("UPDATE users SET name=? WHERE id=?", [$name, $current['id']]);
        }
        Response::json(['ok' => true]);
    }
}
