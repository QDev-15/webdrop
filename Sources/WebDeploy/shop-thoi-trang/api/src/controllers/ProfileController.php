<?php
declare(strict_types=1);

class ProfileController {
    public function __construct(private Database $db) {}

    public function show(): void {
        Auth::require();
        $user = Auth::user();
        $row  = $this->db->queryOne("SELECT id, name, email, role, created_at FROM users WHERE id = ?", [$user['id']]);
        if (!$row) { Response::error('Không tìm thấy người dùng', 404); return; }
        Response::json($row);
    }

    public function update(): void {
        Auth::require();
        $user = Auth::user();
        $data = bodyJson();
        $name = trim($data['name'] ?? '');
        if (!$name) { Response::error('Tên không được để trống', 422); return; }
        $this->db->execute("UPDATE users SET name = ? WHERE id = ?", [$name, $user['id']]);
        $row = $this->db->queryOne("SELECT id, name, email, role, created_at FROM users WHERE id = ?", [$user['id']]);
        Response::json($row);
    }

    public function changePassword(): void {
        Auth::require();
        $user        = Auth::user();
        $data        = bodyJson();
        $current     = $data['current_password'] ?? '';
        $newPassword = $data['new_password'] ?? '';

        if (!$current || !$newPassword) {
            Response::error('Vui lòng nhập mật khẩu hiện tại và mật khẩu mới', 422);
            return;
        }
        if (strlen($newPassword) < 6) {
            Response::error('Mật khẩu mới phải có ít nhất 6 ký tự', 422);
            return;
        }

        $row = $this->db->queryOne("SELECT password FROM users WHERE id = ?", [$user['id']]);
        if (!$row || !password_verify($current, $row['password'])) {
            Response::error('Mật khẩu hiện tại không đúng', 401);
            return;
        }

        $hash = password_hash($newPassword, PASSWORD_DEFAULT);
        $this->db->execute("UPDATE users SET password = ? WHERE id = ?", [$hash, $user['id']]);
        Response::json(['message' => 'Đổi mật khẩu thành công']);
    }
}
