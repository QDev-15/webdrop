<?php
declare(strict_types=1);

class ProfileController {
    public function __construct(private Database $db) {}

    public function show(array $p = []): void {
        Auth::require();
        $user = Auth::user();
        $row  = $this->db->queryOne(
            "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
            [$user['id']]
        );
        if (!$row) { Response::error('Khong tim thay.', 404); return; }
        Response::json($row);
    }

    public function update(array $p = []): void {
        Auth::require();
        $b    = bodyJson();
        $user = Auth::user();
        if (empty($b['name'])) { Response::error('Ten la bat buoc.'); return; }
        $this->db->execute(
            "UPDATE users SET name = ? WHERE id = ?",
            [htmlspecialchars(trim($b['name']), ENT_QUOTES, 'UTF-8'), $user['id']]
        );
        Response::json(['ok' => true]);
    }

    public function changePassword(array $p = []): void {
        Auth::require();
        $b    = bodyJson();
        $user = Auth::user();
        if (empty($b['current_password']) || empty($b['new_password'])) {
            Response::error('Mat khau hien tai va mat khau moi la bat buoc.'); return;
        }
        $row = $this->db->queryOne("SELECT password FROM users WHERE id = ?", [$user['id']]);
        if (!$row || !password_verify($b['current_password'], $row['password'])) {
            Response::error('Mat khau hien tai khong dung.', 401); return;
        }
        $hash = password_hash($b['new_password'], PASSWORD_BCRYPT);
        $this->db->execute("UPDATE users SET password = ? WHERE id = ?", [$hash, $user['id']]);
        Response::json(['ok' => true]);
    }
}
