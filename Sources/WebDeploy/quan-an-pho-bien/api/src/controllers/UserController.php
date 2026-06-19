<?php
declare(strict_types=1);

class UserController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $users = $this->db->query("SELECT id, name, email, role, created_at FROM users ORDER BY id");
        Response::json($users);
    }

    public function show(array $p): void {
        Auth::require();
        $user = $this->db->queryOne("SELECT id, name, email, role, created_at FROM users WHERE id = ?", [$p['id']]);
        if (!$user) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($user);
    }

    public function store(array $p): void {
        Auth::requireRole('superadmin');
        $b = bodyJson();
        if (empty($b['name']) || empty($b['email']) || empty($b['password'])) {
            Response::error('Tên, email và mật khẩu là bắt buộc.');
            return;
        }
        $existing = $this->db->queryOne("SELECT id FROM users WHERE email = ?", [$b['email']]);
        if ($existing) { Response::error('Email đã tồn tại.', 409); return; }
        $id = $this->db->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [$b['name'], $b['email'], password_hash($b['password'], PASSWORD_BCRYPT), $b['role'] ?? 'user']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $currentUser = Auth::user();
        if ((int)$p['id'] !== (int)$currentUser['id'] && $currentUser['role'] !== 'superadmin') {
            Response::error('Không có quyền.', 403); return;
        }
        if (empty($b['name'])) { Response::error('Tên là bắt buộc.'); return; }
        // Chỉ superadmin mới được thay đổi role — user thường chỉ được sửa name
        $role = ($currentUser['role'] === 'superadmin') ? ($b['role'] ?? 'user') : null;
        if ($role !== null) {
            $this->db->execute(
                "UPDATE users SET name=?, role=? WHERE id=?",
                [$b['name'], $role, $p['id']]
            );
        } else {
            $this->db->execute(
                "UPDATE users SET name=? WHERE id=?",
                [$b['name'], $p['id']]
            );
        }
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::requireRole('superadmin');
        $currentUser = Auth::user();
        if ((int)$p['id'] === (int)$currentUser['id']) {
            Response::error('Không thể xóa tài khoản đang đăng nhập.'); return;
        }
        $this->db->execute("DELETE FROM users WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }

    public function changePassword(array $p): void {
        Auth::require();
        $b = bodyJson();
        $currentUser = Auth::user();
        $user = $this->db->queryOne("SELECT * FROM users WHERE id = ?", [$p['id']]);
        if (!$user) { Response::error('Không tìm thấy.', 404); return; }
        if ((int)$p['id'] !== (int)$currentUser['id'] && $currentUser['role'] !== 'superadmin') {
            Response::error('Không có quyền.', 403); return;
        }
        if (empty($b['password'])) { Response::error('Mật khẩu không được để trống.'); return; }
        if (strlen($b['password']) < 6) { Response::error('Mật khẩu phải có ít nhất 6 ký tự.'); return; }
        // User đổi mật khẩu của chính mình phải cung cấp mật khẩu hiện tại
        $isSelf = (int)$p['id'] === (int)$currentUser['id'];
        if ($isSelf && !empty($b['current_password'])) {
            if (!password_verify($b['current_password'], $user['password'])) {
                Response::error('Mật khẩu hiện tại không đúng.'); return;
            }
        } elseif ($isSelf && empty($b['current_password'])) {
            Response::error('Vui lòng nhập mật khẩu hiện tại.'); return;
        }
        $this->db->execute(
            "UPDATE users SET password = ? WHERE id = ?",
            [password_hash($b['password'], PASSWORD_BCRYPT), $p['id']]
        );
        Response::json(['ok' => true]);
    }
}
