<?php
declare(strict_types=1);

class ProfileController {
    public function __construct(private Database $db) {}

    public function update(array $p = []): void {
        Auth::require();
        $user = Auth::user();
        $b    = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên không được để trống.', 422); return; }
        $this->db->execute('UPDATE users SET name=? WHERE id=?', [$name, $user['id']]);
        Response::json(['message' => 'Đã cập nhật hồ sơ.']);
    }

    public function changePassword(array $p = []): void {
        Auth::require();
        $user        = Auth::user();
        $b           = bodyJson();
        $current     = trim($b['current_password'] ?? '');
        $newPass     = trim($b['new_password'] ?? '');
        $confirm     = trim($b['confirm_password'] ?? '');

        if (!$current || !$newPass || !$confirm) {
            Response::error('Vui lòng điền đầy đủ thông tin.', 422); return;
        }
        if ($newPass !== $confirm) {
            Response::error('Mật khẩu xác nhận không khớp.', 422); return;
        }
        if (strlen($newPass) < 6) {
            Response::error('Mật khẩu mới phải có ít nhất 6 ký tự.', 422); return;
        }

        $dbUser = $this->db->queryOne('SELECT * FROM users WHERE id=?', [$user['id']]);
        if (!$dbUser || !password_verify($current, $dbUser['password'])) {
            Response::error('Mật khẩu hiện tại không đúng.', 401); return;
        }

        $hash = password_hash($newPass, PASSWORD_BCRYPT);
        $this->db->execute('UPDATE users SET password=? WHERE id=?', [$hash, $user['id']]);
        Response::json(['message' => 'Đã đổi mật khẩu thành công.']);
    }
}
