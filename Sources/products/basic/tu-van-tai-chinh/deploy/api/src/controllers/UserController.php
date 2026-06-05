<?php
declare(strict_types=1);

class UserController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $users = $this->db->query("SELECT id, name, email, role, created_at FROM users ORDER BY id");
        Response::json($users);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name']) || empty($b['email']) || empty($b['password'])) {
            Response::error('Thiếu thông tin bắt buộc.'); return;
        }
        $existing = $this->db->queryOne("SELECT id FROM users WHERE email=?", [$b['email']]);
        if ($existing) { Response::error('Email đã tồn tại.', 409); return; }
        $id = $this->db->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)",
            [$b['name'], $b['email'], password_hash($b['password'], PASSWORD_BCRYPT), $b['role'] ?? 'user']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE users SET name=?, email=?, role=? WHERE id=?",
            [$b['name'] ?? '', $b['email'] ?? '', $b['role'] ?? 'user', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $u = Auth::user();
        if ((int)$p['id'] === (int)$u['id']) {
            Response::error('Không thể xóa tài khoản đang đăng nhập.'); return;
        }
        $this->db->execute("DELETE FROM users WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }

    public function changePassword(array $p): void {
        Auth::require();
        $b = bodyJson();
        $u = Auth::user();
        $user = $this->db->queryOne("SELECT * FROM users WHERE id=?", [$p['id']]);
        if (!$user) { Response::error('Không tìm thấy.', 404); return; }
        // Only superadmin can change others' password
        if ((int)$p['id'] !== (int)$u['id'] && $u['role'] !== 'superadmin') {
            Response::error('Không có quyền.', 403); return;
        }
        if (empty($b['password'])) { Response::error('Mật khẩu mới không được để trống.'); return; }
        $this->db->execute(
            "UPDATE users SET password=? WHERE id=?",
            [password_hash($b['password'], PASSWORD_BCRYPT), $p['id']]
        );
        Response::json(['ok' => true]);
    }
}
