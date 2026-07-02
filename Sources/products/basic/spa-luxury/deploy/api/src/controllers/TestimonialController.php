<?php
declare(strict_types=1);

class TestimonialController {
    public function __construct(private Database $db) {}

    /** GET /testimonials */
    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT * FROM testimonials ORDER BY sort_order, id"
        );
        Response::json($rows);
    }

    /** GET /testimonials/:id */
    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    /** POST /testimonials */
    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();

        if (empty($b['name'])) {
            Response::error('Tên khách hàng là bắt buộc.');
            return;
        }
        if (empty($b['content'])) {
            Response::error('Nội dung đánh giá là bắt buộc.');
            return;
        }

        $id = $this->db->execute(
            "INSERT INTO testimonials
                (name, role, location, rating, content, avatar, is_published, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                trim($b['name']),
                trim($b['role'] ?? ''),
                trim($b['location'] ?? ''),
                min(5, max(1, (int)($b['rating'] ?? 5))),
                trim($b['content']),
                trim($b['avatar'] ?? ''),
                isset($b['is_published']) ? (int)(bool)$b['is_published'] : 1,
                (int)($b['sort_order'] ?? 0),
            ]
        );
        Response::json(['id' => $id], 201);
    }

    /** POST /testimonials/:id/update */
    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();

        if (empty($b['name'])) {
            Response::error('Tên khách hàng là bắt buộc.');
            return;
        }
        if (empty($b['content'])) {
            Response::error('Nội dung đánh giá là bắt buộc.');
            return;
        }

        $this->db->execute(
            "UPDATE testimonials SET
                name         = ?,
                role         = ?,
                location     = ?,
                rating       = ?,
                content      = ?,
                avatar       = ?,
                is_published = ?,
                sort_order   = ?
             WHERE id = ?",
            [
                trim($b['name']),
                trim($b['role'] ?? ''),
                trim($b['location'] ?? ''),
                min(5, max(1, (int)($b['rating'] ?? 5))),
                trim($b['content']),
                trim($b['avatar'] ?? ''),
                isset($b['is_published']) ? (int)(bool)$b['is_published'] : 1,
                (int)($b['sort_order'] ?? 0),
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    /** POST /testimonials/:id/delete */
    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM testimonials WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
