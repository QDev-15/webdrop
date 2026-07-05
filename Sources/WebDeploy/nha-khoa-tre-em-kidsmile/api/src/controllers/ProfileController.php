<?php
declare(strict_types=1);

class ProfileController {
    public function __construct(private Database $db) {}

    // GET /profile
    public function show(array $p): void {
        Auth::require();
        $user = Auth::user();
        $row = $this->db->queryOne("SELECT id, name, email, role, created_at FROM users WHERE id = ?", [$user['id']]);
        if (!$row) { Response::error('Không tìm thấy tài khoản.', 404); return; }
        Response::json($row);
    }

    // POST /profile/update
    public function update(array $p): void {
        Auth::require();
        $user = Auth::user();
        $b = bodyJson();
        $name  = trim($b['name']  ?? '');
        $email = trim($b['email'] ?? '');
        if (!$name || !$email) {
            Response::error('Tên và email không được để trống.', 422);
            return;
        }
        // Check email unique (exclude self)
        $existing = $this->db->queryOne("SELECT id FROM users WHERE email = ? AND id != ?", [$email, $user['id']]);
        if ($existing) { Response::error('Email đã được dùng bởi tài khoản khác.', 409); return; }
        $this->db->execute("UPDATE users SET name = ?, email = ? WHERE id = ?", [$name, $email, $user['id']]);
        Response::json(['ok' => true, 'name' => $name, 'email' => $email]);
    }

    // POST /profile/change-password
    public function changePassword(array $p): void {
        Auth::require();
        $user = Auth::user();
        $b = bodyJson();
        $current = $b['current_password'] ?? '';
        $newPass = $b['new_password']     ?? '';
        if (!$current || !$newPass) {
            Response::error('Mật khẩu hiện tại và mật khẩu mới không được để trống.', 422);
            return;
        }
        if (strlen($newPass) < 6) {
            Response::error('Mật khẩu mới phải có ít nhất 6 ký tự.', 422);
            return;
        }
        $row = $this->db->queryOne("SELECT password FROM users WHERE id = ?", [$user['id']]);
        if (!$row || !password_verify($current, $row['password'])) {
            Response::error('Mật khẩu hiện tại không đúng.', 401);
            return;
        }
        $hashed = password_hash($newPass, PASSWORD_BCRYPT);
        $this->db->execute("UPDATE users SET password = ? WHERE id = ?", [$hashed, $user['id']]);
        Response::json(['ok' => true]);
    }
}
