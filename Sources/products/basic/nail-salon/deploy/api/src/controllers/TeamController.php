<?php
declare(strict_types=1);

class TeamController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM team_members ORDER BY sort_order ASC, id ASC");
        Response::json($rows);
    }

    public function store(): void {
        Auth::require();
        $body      = bodyJson();
        $name      = trim($body['name']       ?? '');
        $role      = trim($body['role']       ?? '');
        $image     = trim($body['image']      ?? '');
        $spec1     = trim($body['specialty1'] ?? '');
        $spec2     = trim($body['specialty2'] ?? '');
        $sortOrder = (int)($body['sort_order']?? 0);

        if (!$name) Response::error('Tên thợ không được để trống.', 422);

        $this->db->execute(
            "INSERT INTO team_members (name, role, image, specialty1, specialty2, sort_order) VALUES (?,?,?,?,?,?)",
            [$name, $role, $image, $spec1, $spec2, $sortOrder]
        );
        Response::json(['id' => (int)$this->db->lastInsertId(), 'message' => 'Đã thêm thành viên.']);
    }

    public function update(array $params): void {
        Auth::require();
        $id = (int)($params['id'] ?? 0);
        if (!$id) Response::error('ID không hợp lệ.', 400);

        $body      = bodyJson();
        $name      = trim($body['name']       ?? '');
        $role      = trim($body['role']       ?? '');
        $image     = trim($body['image']      ?? '');
        $spec1     = trim($body['specialty1'] ?? '');
        $spec2     = trim($body['specialty2'] ?? '');
        $sortOrder = (int)($body['sort_order']?? 0);

        if (!$name) Response::error('Tên thợ không được để trống.', 422);

        $this->db->execute(
            "UPDATE team_members SET name=?, role=?, image=?, specialty1=?, specialty2=?, sort_order=? WHERE id=?",
            [$name, $role, $image, $spec1, $spec2, $sortOrder, $id]
        );
        Response::json(['message' => 'Đã cập nhật thành viên.']);
    }

    public function destroy(array $params): void {
        Auth::require();
        $id = (int)($params['id'] ?? 0);
        if (!$id) Response::error('ID không hợp lệ.', 400);
        $this->db->execute("DELETE FROM team_members WHERE id=?", [$id]);
        Response::json(['message' => 'Đã xóa thành viên.']);
    }
}
