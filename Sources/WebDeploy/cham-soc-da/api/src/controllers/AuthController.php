<?php
declare(strict_types=1);

class AuthController {
    public function __construct(private Database $db) {}

    public function login(array $p): void {
        $b = bodyJson();
        $email    = trim($b['email'] ?? '');
        $password = trim($b['password'] ?? '');
        if (!$email || !$password) {
            Response::error('Email và mật khẩu không được để trống.');
            return;
        }
        $user = $this->db->queryOne("SELECT * FROM users WHERE email = ?", [$email]);
        if (!$user || !password_verify($password, $user['password'])) {
            Response::error('Email hoặc mật khẩu không đúng.', 401);
            return;
        }
        Auth::login($user);
        Response::json([
            'id'    => $user['id'],
            'name'  => $user['name'],
            'email' => $user['email'],
            'role'  => $user['role'],
        ]);
    }

    public function logout(array $p): void {
        Auth::logout();
        Response::json(['ok' => true]);
    }

    public function me(array $p): void {
        $user = Auth::user();
        if (!$user) {
            Response::error('Chưa đăng nhập.', 401);
            return;
        }
        $u = $this->db->queryOne("SELECT id, name, email, role FROM users WHERE id = ?", [$user['id']]);
        Response::json($u ?? $user);
    }

    public function updateProfile(array $p): void {
        Auth::require();
        $user = Auth::user();
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên không được để trống.', 422); return; }
        $this->db->execute("UPDATE users SET name = ? WHERE id = ?", [$name, $user['id']]);
        // If password change requested
        if (!empty($b['password'])) {
            if (strlen($b['password']) < 6) { Response::error('Mật khẩu phải có ít nhất 6 ký tự.', 422); return; }
            if (!empty($b['current_password'])) {
                $u = $this->db->queryOne("SELECT password FROM users WHERE id = ?", [$user['id']]);
                if (!$u || !password_verify($b['current_password'], $u['password'])) {
                    Response::error('Mật khẩu hiện tại không đúng.', 401); return;
                }
            }
            $this->db->execute(
                "UPDATE users SET password = ? WHERE id = ?",
                [password_hash($b['password'], PASSWORD_BCRYPT), $user['id']]
            );
        }
        $updated = $this->db->queryOne("SELECT id, name, email, role FROM users WHERE id = ?", [$user['id']]);
        Response::json($updated);
    }
}
