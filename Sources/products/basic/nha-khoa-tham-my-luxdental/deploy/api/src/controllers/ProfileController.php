<?php
declare(strict_types=1);

class ProfileController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $user = Auth::user();
        $row = $this->db->queryOne("SELECT id, name, email, role FROM users WHERE id = ?", [$user['id']]);
        if (!$row) { Response::json(['error' => 'Không tìm thấy.'], 404); return; }
        Response::json($row);
    }

    public function update(array $p): void {
        Auth::require();
        $user = Auth::user();
        $b = bodyJson();
        $name  = trim($b['name'] ?? '');
        $email = trim($b['email'] ?? '');
        if (!$name || !$email) { Response::json(['error' => 'Tên và email không được để trống.'], 400); return; }
        // Check email unique excluding self
        $exist = $this->db->queryOne("SELECT id FROM users WHERE email = ? AND id != ?", [$email, $user['id']]);
        if ($exist) { Response::json(['error' => 'Email đã được sử dụng.'], 409); return; }
        $this->db->execute("UPDATE users SET name = ?, email = ? WHERE id = ?", [$name, $email, $user['id']]);
        Response::json(['ok' => true]);
    }

    public function changePassword(array $p): void {
        Auth::require();
        $user = Auth::user();
        $b = bodyJson();
        $current = $b['current_password'] ?? '';
        $newPw   = $b['new_password'] ?? '';
        if (!$current || !$newPw) { Response::json(['error' => 'Vui lòng điền đầy đủ thông tin.'], 400); return; }
        $row = $this->db->queryOne("SELECT password FROM users WHERE id = ?", [$user['id']]);
        if (!$row || !password_verify($current, $row['password'])) {
            Response::json(['error' => 'Mật khẩu hiện tại không đúng.'], 400); return;
        }
        $hash = password_hash($newPw, PASSWORD_BCRYPT);
        $this->db->execute("UPDATE users SET password = ? WHERE id = ?", [$hash, $user['id']]);
        Response::json(['ok' => true]);
    }
}
