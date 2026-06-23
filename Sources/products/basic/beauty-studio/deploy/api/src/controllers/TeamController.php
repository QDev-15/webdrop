<?php
declare(strict_types=1);

class TeamController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query('SELECT * FROM team_members ORDER BY sort_order ASC');
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne('SELECT * FROM team_members WHERE id=?', [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function store(): void {
        Auth::require();
        $body       = bodyJson();
        $name       = trim($body['name'] ?? '');
        $role       = trim($body['role'] ?? '');
        $bio        = trim($body['bio'] ?? '');
        $avatar     = trim($body['avatar'] ?? '');
        $sort_order = (int)($body['sort_order'] ?? 0);
        $is_visible = (int)($body['is_visible'] ?? 1);

        if (!$name || !$role) {
            Response::error('Tên và chức danh là bắt buộc.', 422);
            return;
        }

        $id = $this->db->execute(
            'INSERT INTO team_members (name,role,bio,avatar,sort_order,is_visible) VALUES (?,?,?,?,?,?)',
            [$name, $role, $bio, $avatar, $sort_order, $is_visible]
        );
        Response::json(['id' => $id, 'message' => 'Đã thêm thành viên.'], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $row = $this->db->queryOne('SELECT id FROM team_members WHERE id=?', [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }

        $body       = bodyJson();
        $name       = trim($body['name'] ?? '');
        $role       = trim($body['role'] ?? '');
        $bio        = trim($body['bio'] ?? '');
        $avatar     = trim($body['avatar'] ?? '');
        $sort_order = (int)($body['sort_order'] ?? 0);
        $is_visible = (int)($body['is_visible'] ?? 1);

        if (!$name || !$role) {
            Response::error('Tên và chức danh là bắt buộc.', 422);
            return;
        }

        $this->db->execute(
            'UPDATE team_members SET name=?,role=?,bio=?,avatar=?,sort_order=?,is_visible=? WHERE id=?',
            [$name, $role, $bio, $avatar, $sort_order, $is_visible, (int)$p['id']]
        );
        Response::json(['message' => 'Đã cập nhật.']);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute('DELETE FROM team_members WHERE id=?', [(int)$p['id']]);
        Response::json(['message' => 'Đã xóa.']);
    }
}
