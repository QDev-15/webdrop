<?php
declare(strict_types=1);

// Trang "Tài khoản" (Profile) trong admin — chỉ cho phép user tự sửa tên
// và tự đổi mật khẩu của chính mình. Site này không có trang quản lý danh
// sách users (chỉ 1 tài khoản sysadmin seed sẵn) nên không cần thao tác :id.
class UserController {
    public function __construct(private Database $db) {}

    public function updateProfile(array $p): void {
        Auth::require();
        $b = bodyJson();
        $currentUser = Auth::user();
        $name = trim($b['name'] ?? '');
        if ($name === '') { Response::error('Tên không được để trống.'); return; }

        $this->db->execute("UPDATE users SET name = ? WHERE id = ?", [$name, $currentUser['id']]);
        Auth::updateName($name);

        Response::json([
            'id'    => $currentUser['id'],
            'name'  => $name,
            'email' => $currentUser['email'],
            'role'  => $currentUser['role'],
        ]);
    }

    public function changePassword(array $p): void {
        Auth::require();
        $b = bodyJson();
        $currentUser = Auth::user();

        $currentPassword = $b['current_password'] ?? '';
        $newPassword     = $b['password'] ?? '';

        if (empty($currentPassword)) { Response::error('Vui lòng nhập mật khẩu hiện tại.'); return; }
        if (strlen($newPassword) < 6) { Response::error('Mật khẩu mới phải có ít nhất 6 ký tự.'); return; }

        $user = $this->db->queryOne("SELECT * FROM users WHERE id = ?", [$currentUser['id']]);
        if (!$user || !password_verify($currentPassword, $user['password'])) {
            Response::error('Mật khẩu hiện tại không đúng.');
            return;
        }

        $this->db->execute(
            "UPDATE users SET password = ? WHERE id = ?",
            [password_hash($newPassword, PASSWORD_BCRYPT), $currentUser['id']]
        );
        Response::json(['ok' => true]);
    }
}
