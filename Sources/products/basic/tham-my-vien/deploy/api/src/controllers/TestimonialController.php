<?php
declare(strict_types=1);

class TestimonialController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM testimonials ORDER BY sort_order ASC, id ASC");
        Response::json($rows);
    }

    public function store(array $p): void {
        Auth::require();
        $b    = bodyJson();
        $name = trim($b['customer_name'] ?? '');
        $content = trim($b['content'] ?? '');
        if (!$name || !$content) {
            Response::error('Tên khách hàng và nội dung không được để trống.'); return;
        }
        $rating = max(1, min(5, (int)($b['rating'] ?? 5)));
        $this->db->execute(
            "INSERT INTO testimonials (customer_name, avatar, service_name, rating, content, status, sort_order)
             VALUES (?,?,?,?,?,?,?)",
            [
                $name,
                trim($b['avatar'] ?? ''),
                trim($b['service_name'] ?? ''),
                $rating, $content,
                in_array($b['status'] ?? '', ['published','draft']) ? $b['status'] : 'published',
                (int)($b['sort_order'] ?? 0),
            ]
        );
        $row = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$this->db->lastInsertId()]);
        Response::json($row, 201);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function update(array $p): void {
        Auth::require();
        $b  = bodyJson();
        $id = (int)$p['id'];
        $row = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }

        $rating = isset($b['rating']) ? max(1, min(5, (int)$b['rating'])) : (int)$row['rating'];
        $this->db->execute(
            "UPDATE testimonials SET customer_name=?, avatar=?, service_name=?, rating=?, content=?, status=?, sort_order=? WHERE id=?",
            [
                trim($b['customer_name'] ?? $row['customer_name']),
                trim($b['avatar'] ?? $row['avatar']),
                trim($b['service_name'] ?? $row['service_name']),
                $rating,
                trim($b['content'] ?? $row['content']),
                in_array($b['status'] ?? '', ['published','draft']) ? $b['status'] : $row['status'],
                (int)($b['sort_order'] ?? $row['sort_order']),
                $id,
            ]
        );
        Response::json($this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]));
    }

    public function destroy(array $p): void {
        Auth::require();
        $id = (int)$p['id'];
        if (!$this->db->queryOne("SELECT id FROM testimonials WHERE id = ?", [$id])) {
            Response::error('Không tìm thấy.', 404); return;
        }
        $this->db->execute("DELETE FROM testimonials WHERE id = ?", [$id]);
        Response::json(['ok' => true]);
    }
}
