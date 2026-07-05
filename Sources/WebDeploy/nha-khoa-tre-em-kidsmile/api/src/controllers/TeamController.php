<?php
declare(strict_types=1);

class TeamController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM doctors ORDER BY sort_order ASC");
        Response::json($rows);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên bác sĩ không được để trống.', 422); return; }
        $id = $this->db->execute(
            "INSERT INTO doctors (name, role, bio, photo, experience_years, specialties, sort_order, is_active) VALUES (?,?,?,?,?,?,?,?)",
            [
                $name,
                trim($b['role']             ?? ''),
                trim($b['bio']              ?? ''),
                trim($b['photo']            ?? ''),
                (int)($b['experience_years'] ?? 0),
                trim($b['specialties']      ?? ''),
                (int)($b['sort_order']       ?? 0),
                isset($b['is_active']) && !$b['is_active'] ? 0 : 1,
            ]
        );
        Response::json($this->db->queryOne("SELECT * FROM doctors WHERE id = ?", [$id]), 201);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM doctors WHERE id = ?", [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $id = (int)$p['id'];
        $row = $this->db->queryOne("SELECT id FROM doctors WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        $this->db->execute(
            "UPDATE doctors SET name=?, role=?, bio=?, photo=?, experience_years=?, specialties=?, sort_order=?, is_active=? WHERE id=?",
            [
                trim($b['name']              ?? ''),
                trim($b['role']              ?? ''),
                trim($b['bio']               ?? ''),
                trim($b['photo']             ?? ''),
                (int)($b['experience_years']  ?? 0),
                trim($b['specialties']        ?? ''),
                (int)($b['sort_order']         ?? 0),
                isset($b['is_active']) && !$b['is_active'] ? 0 : 1,
                $id,
            ]
        );
        Response::json($this->db->queryOne("SELECT * FROM doctors WHERE id = ?", [$id]));
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM doctors WHERE id = ?", [(int)$p['id']]);
        Response::json(['ok' => true]);
    }
}
