<?php
declare(strict_types=1);

class UserController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $users = $this->db->query(
            "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
        );
        Response::json($users);
    }

    public function store(array $p): void {
        Auth::requireRole('superadmin');
        $b = bodyJson();
        $name  = trim($b['name'] ?? '');
        $email = trim($b['email'] ?? '');
        $pass  = $b['password'] ?? '';
        if (!$name || !$email || !$pass) {
            Response::error('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        $exists = $this->db->scalar("SELECT COUNT(*) FROM users WHERE email = ?", [$email]);
        if ($exists > 0) {
            Response::error('Email đã được sử dụng.', 409);
            return;
        }
        $id = $this->db->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [$name, $email, password_hash($pass, PASSWORD_BCRYPT), $b['role'] ?? 'user']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b    = bodyJson();
        $u    = Auth::user();
        if ((int)$p['id'] !== (int)$u['id'] && $u['role'] !== 'superadmin') {
            Response::error('Không có quyền.', 403);
            return;
        }
        $name  = trim($b['name'] ?? '');
        $email = trim($b['email'] ?? '');
        if (!$name || !$email) {
            Response::error('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        $this->db->execute(
            "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
            [$name, $email, $b['role'] ?? 'user', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::requireRole('superadmin');
        $u = Auth::user();
        if ((int)$p['id'] === (int)$u['id']) {
            Response::error('Không thể xóa tài khoản đang đăng nhập.');
            return;
        }
        $this->db->execute("DELETE FROM users WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }

    public function changePassword(array $p): void {
        Auth::require();
        $b = bodyJson();
        $u = Auth::user();
        $user = $this->db->queryOne("SELECT * FROM users WHERE id = ?", [$p['id']]);
        if (!$user) { Response::error('Không tìm thấy.', 404); return; }
        if ((int)$p['id'] !== (int)$u['id'] && $u['role'] !== 'superadmin') {
            Response::error('Không có quyền.', 403);
            return;
        }
        $pass = $b['password'] ?? '';
        if (strlen($pass) < 6) {
            Response::error('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }
        $this->db->execute(
            "UPDATE users SET password = ? WHERE id = ?",
            [password_hash($pass, PASSWORD_BCRYPT), $p['id']]
        );
        Response::json(['ok' => true]);
    }
}
