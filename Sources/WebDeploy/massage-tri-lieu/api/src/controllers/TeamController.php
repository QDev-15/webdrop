<?php
declare(strict_types=1);

class TeamController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM therapists ORDER BY sort_order ASC");
        Response::json($items);
    }

    public function store(array $p): void {
        Auth::require();
        $b    = bodyJson();
        $name = trim((string)($b['name'] ?? ''));
        if (!$name) { Response::error('Ten chuyen vien khong duoc de trong.', 422); return; }
        $specialty  = trim((string)($b['specialty'] ?? ''));
        $experience = trim((string)($b['experience'] ?? ''));
        $image      = trim((string)($b['image'] ?? ''));
        $sort       = (int)($b['sort_order'] ?? 0);
        $active     = isset($b['active']) ? (int)$b['active'] : 1;
        $id = $this->db->execute(
            "INSERT INTO therapists (name, specialty, experience, image, sort_order, active) VALUES (?, ?, ?, ?, ?, ?)",
            [$name, $specialty, $experience, $image, $sort, $active]
        );
        Response::json($this->db->queryOne("SELECT * FROM therapists WHERE id = ?", [$id]), 201);
    }

    public function update(array $p): void {
        Auth::require();
        $id  = (int)($p['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM therapists WHERE id = ?", [$id]);
        if (!$row) { Response::error('Khong tim thay chuyen vien.', 404); return; }
        $b          = bodyJson();
        $name       = trim((string)($b['name'] ?? $row['name']));
        $specialty  = trim((string)($b['specialty'] ?? $row['specialty']));
        $experience = trim((string)($b['experience'] ?? $row['experience']));
        $image      = trim((string)($b['image'] ?? $row['image']));
        $sort       = isset($b['sort_order']) ? (int)$b['sort_order'] : (int)$row['sort_order'];
        $active     = isset($b['active']) ? (int)$b['active'] : (int)$row['active'];
        $this->db->execute(
            "UPDATE therapists SET name=?, specialty=?, experience=?, image=?, sort_order=?, active=? WHERE id=?",
            [$name, $specialty, $experience, $image, $sort, $active, $id]
        );
        Response::json($this->db->queryOne("SELECT * FROM therapists WHERE id = ?", [$id]));
    }

    public function destroy(array $p): void {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        if (!$this->db->queryOne("SELECT id FROM therapists WHERE id = ?", [$id])) {
            Response::error('Khong tim thay chuyen vien.', 404); return;
        }
        $this->db->execute("DELETE FROM therapists WHERE id = ?", [$id]);
        Response::json(['ok' => true]);
    }
}
