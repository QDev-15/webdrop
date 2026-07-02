<?php
declare(strict_types=1);

class TeamController {
    public function __construct(private Database $db) {}

    /** GET /team */
    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT * FROM team ORDER BY sort_order, id"
        );
        Response::json($rows);
    }

    /** GET /team/:id */
    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM team WHERE id = ?", [$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    /** POST /team */
    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();

        if (empty($b['name'])) {
            Response::error('Tên chuyên viên là bắt buộc.');
            return;
        }

        $id = $this->db->execute(
            "INSERT INTO team
                (name, title, bio, image, specialties, is_published, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                trim($b['name']),
                trim($b['title'] ?? ''),
                trim($b['bio'] ?? ''),
                trim($b['image'] ?? ''),
                trim($b['specialties'] ?? ''),
                isset($b['is_published']) ? (int)(bool)$b['is_published'] : 1,
                (int)($b['sort_order'] ?? 0),
            ]
        );
        Response::json(['id' => $id], 201);
    }

    /** POST /team/:id/update */
    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();

        if (empty($b['name'])) {
            Response::error('Tên chuyên viên là bắt buộc.');
            return;
        }

        $this->db->execute(
            "UPDATE team SET
                name         = ?,
                title        = ?,
                bio          = ?,
                image        = ?,
                specialties  = ?,
                is_published = ?,
                sort_order   = ?
             WHERE id = ?",
            [
                trim($b['name']),
                trim($b['title'] ?? ''),
                trim($b['bio'] ?? ''),
                trim($b['image'] ?? ''),
                trim($b['specialties'] ?? ''),
                isset($b['is_published']) ? (int)(bool)$b['is_published'] : 1,
                (int)($b['sort_order'] ?? 0),
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    /** POST /team/:id/delete */
    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM team WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
