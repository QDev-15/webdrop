<?php
declare(strict_types=1);

class TeamController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM team ORDER BY sort_order ASC, id ASC");
        Response::json($rows);
    }

    public function store(array $p): void {
        Auth::require();
        $b    = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên bác sĩ không được để trống.'); return; }

        $this->db->execute(
            "INSERT INTO team (name, title, role, specialty, education, experience, cases_count, certifications, image, badge, sort_order, status)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
            [
                $name,
                trim($b['title'] ?? ''),
                trim($b['role'] ?? ''),
                trim($b['specialty'] ?? ''),
                trim($b['education'] ?? ''),
                trim($b['experience'] ?? ''),
                (int)($b['cases_count'] ?? 0),
                trim($b['certifications'] ?? ''),
                trim($b['image'] ?? ''),
                trim($b['badge'] ?? ''),
                (int)($b['sort_order'] ?? 0),
                in_array($b['status'] ?? '', ['published','draft']) ? $b['status'] : 'published',
            ]
        );
        $row = $this->db->queryOne("SELECT * FROM team WHERE id = ?", [$this->db->lastInsertId()]);
        Response::json($row, 201);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM team WHERE id = ?", [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function update(array $p): void {
        Auth::require();
        $b   = bodyJson();
        $id  = (int)$p['id'];
        $row = $this->db->queryOne("SELECT * FROM team WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }

        $this->db->execute(
            "UPDATE team SET name=?, title=?, role=?, specialty=?, education=?, experience=?,
             cases_count=?, certifications=?, image=?, badge=?, sort_order=?, status=? WHERE id=?",
            [
                trim($b['name'] ?? $row['name']),
                trim($b['title'] ?? $row['title']),
                trim($b['role'] ?? $row['role']),
                trim($b['specialty'] ?? $row['specialty']),
                trim($b['education'] ?? $row['education']),
                trim($b['experience'] ?? $row['experience']),
                (int)($b['cases_count'] ?? $row['cases_count']),
                trim($b['certifications'] ?? $row['certifications']),
                trim($b['image'] ?? $row['image']),
                trim($b['badge'] ?? $row['badge']),
                (int)($b['sort_order'] ?? $row['sort_order']),
                in_array($b['status'] ?? '', ['published','draft']) ? $b['status'] : $row['status'],
                $id,
            ]
        );
        Response::json($this->db->queryOne("SELECT * FROM team WHERE id = ?", [$id]));
    }

    public function destroy(array $p): void {
        Auth::require();
        $id = (int)$p['id'];
        if (!$this->db->queryOne("SELECT id FROM team WHERE id = ?", [$id])) {
            Response::error('Không tìm thấy.', 404); return;
        }
        $this->db->execute("DELETE FROM team WHERE id = ?", [$id]);
        Response::json(['ok' => true]);
    }
}
