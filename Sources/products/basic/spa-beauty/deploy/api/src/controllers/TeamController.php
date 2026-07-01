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
        $body       = bodyJson();
        $name       = trim($body['name']       ?? '');
        $role       = trim($body['role']       ?? '');
        $image      = trim($body['image']      ?? '');
        $experience = trim($body['experience'] ?? '');
        $spec1      = trim($body['specialty1'] ?? '');
        $spec2      = trim($body['specialty2'] ?? '');
        $sort       = (int)($body['sort_order'] ?? 0);

        if (!$name) { Response::error('Tên chuyên viên không được để trống.', 422); return; }

        $this->db->execute(
            "INSERT INTO team_members (name, role, image, experience, specialty1, specialty2, sort_order) VALUES (?,?,?,?,?,?,?)",
            [$name, $role, $image, $experience, $spec1, $spec2, $sort]
        );
        Response::json(['id' => (int)$this->db->lastInsertId(), 'message' => 'Đã thêm chuyên viên.'], 201);
    }

    public function update(array $params): void {
        Auth::require();
        $id         = (int)($params['id'] ?? 0);
        $body       = bodyJson();
        $name       = trim($body['name']       ?? '');
        $role       = trim($body['role']       ?? '');
        $image      = trim($body['image']      ?? '');
        $experience = trim($body['experience'] ?? '');
        $spec1      = trim($body['specialty1'] ?? '');
        $spec2      = trim($body['specialty2'] ?? '');
        $sort       = (int)($body['sort_order'] ?? 0);

        if (!$name) { Response::error('Tên chuyên viên không được để trống.', 422); return; }

        $this->db->execute(
            "UPDATE team_members SET name=?, role=?, image=?, experience=?, specialty1=?, specialty2=?, sort_order=? WHERE id=?",
            [$name, $role, $image, $experience, $spec1, $spec2, $sort, $id]
        );
        Response::json(['message' => 'Đã cập nhật.']);
    }

    public function destroy(array $params): void {
        Auth::require();
        $id = (int)($params['id'] ?? 0);
        $this->db->execute("DELETE FROM team_members WHERE id=?", [$id]);
        Response::json(['message' => 'Đã xóa.']);
    }
}
