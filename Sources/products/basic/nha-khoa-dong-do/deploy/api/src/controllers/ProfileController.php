<?php
declare(strict_types=1);

class ProfileController {
    public function __construct(private Database $db) {}

    public function show(array $p): void {
        Auth::require();
        $user = Auth::user();
        $row = $this->db->queryOne(
            "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
            [$user['id']]
        );
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $user = Auth::user();
        if (empty($b['name'])) { Response::error('Tên là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE users SET name = ? WHERE id = ?",
            [htmlspecialchars(trim($b['name']), ENT_QUOTES, 'UTF-8'), $user['id']]
        );
        Response::json(['ok' => true]);
    }
}
