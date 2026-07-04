<?php
declare(strict_types=1);

class ProfileController {
    public function __construct(private Database $db) {}

    public function show(array $p = []): void {
        Auth::require();
        $user = Auth::user();
        $row  = $this->db->queryOne('SELECT id, name, email, role, created_at FROM users WHERE id=?', [$user['id']]);
        Response::json($row ?? $user);
    }

    public function update(array $p = []): void {
        Auth::require();
        $user = Auth::user();
        $b    = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Ten khong duoc de trong.', 422); return; }

        if (!empty($b['new_password'])) {
            $current = trim($b['current_password'] ?? '');
            $newPass = trim($b['new_password'] ?? '');
            $confirm = trim($b['confirm_password'] ?? '');
            if (!$current || !$newPass || !$confirm) {
                Response::error('Vui long dien day du thong tin.', 422); return;
            }
            if ($newPass !== $confirm) {
                Response::error('Mat khau xac nhan khong khop.', 422); return;
            }
            if (strlen($newPass) < 6) {
                Response::error('Mat khau moi phai co it nhat 6 ky tu.', 422); return;
            }
            $dbUser = $this->db->queryOne('SELECT * FROM users WHERE id=?', [$user['id']]);
            if (!$dbUser || !password_verify($current, $dbUser['password'])) {
                Response::error('Mat khau hien tai khong dung.', 401); return;
            }
            $hash = password_hash($newPass, PASSWORD_DEFAULT);
            $this->db->execute('UPDATE users SET name=?, password=? WHERE id=?', [$name, $hash, $user['id']]);
        } else {
            $this->db->execute('UPDATE users SET name=? WHERE id=?', [$name, $user['id']]);
        }
        Response::json(['message' => 'Da cap nhat ho so.']);
    }
}
