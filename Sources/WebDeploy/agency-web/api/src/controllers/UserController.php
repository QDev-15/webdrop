<?php
declare(strict_types=1);

class UserController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json($this->db->query("SELECT id, name, email, role, created_at FROM users ORDER BY id"));
    }

    public function store(array $p): void {
        Auth::require();
        $u = Auth::user();
        if ($u['role'] !== 'superadmin') { Response::error('Không có quyền.', 403); return; }
        $b = bodyJson();
        if (empty($b['email']) || empty($b['password'])) {
            Response::error('Email và mật khẩu không được để trống.');
            return;
        }
        try {
            $id = $this->db->execute(
                "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
                [
                    $b['name']  ?? '',
                    $b['email'],
                    password_hash($b['password'], PASSWORD_BCRYPT),
                    $b['role']  ?? 'user',
                ]
            );
            Response::json(['id' => $id], 201);
        } catch (\PDOException $e) {
            Response::error('Email đã tồn tại.', 409);
        }
    }

    public function update(array $p): void {
        Auth::require();
        $u = Auth::user();
        if ($u['role'] !== 'superadmin' && (int)$p['id'] !== (int)$u['id']) {
            Response::error('Không có quyền.', 403); return;
        }
        $b = bodyJson();
        $this->db->execute(
            "UPDATE users SET name=?, email=?, role=? WHERE id=?",
            [
                $b['name']  ?? '',
                $b['email'] ?? '',
                ($u['role'] === 'superadmin') ? ($b['role'] ?? 'user') : $u['role'],
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $u = Auth::user();
        if ($u['role'] !== 'superadmin') { Response::error('Không có quyền.', 403); return; }
        if ((int)$p['id'] === (int)$u['id']) { Response::error('Không thể xóa chính mình.'); return; }
        $this->db->execute("DELETE FROM users WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }

    public function changePassword(array $p): void {
        Auth::require();
        $b = bodyJson();
        $u = Auth::user();
        $user = $this->db->queryOne("SELECT * FROM users WHERE id=?", [$p['id']]);
        if (!$user) { Response::error('Không tìm thấy.', 404); return; }
        if ((int)$p['id'] !== (int)$u['id'] && $u['role'] !== 'superadmin') {
            Response::error('Không có quyền.', 403); return;
        }
        if (empty($b['password'])) { Response::error('Mật khẩu không được để trống.'); return; }
        if (strlen($b['password']) < 6) { Response::error('Mật khẩu phải có ít nhất 6 ký tự.'); return; }
        $this->db->execute(
            "UPDATE users SET password=? WHERE id=?",
            [password_hash($b['password'], PASSWORD_BCRYPT), $p['id']]
        );
        Response::json(['ok' => true]);
    }
}
