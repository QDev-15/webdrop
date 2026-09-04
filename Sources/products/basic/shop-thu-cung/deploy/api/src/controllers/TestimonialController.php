<?php
declare(strict_types=1);

// Admin: CRUD đánh giá khách hàng (testimonials) — hiển thị ở trang chủ (LIST-ELEGANT).
class TestimonialController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC");
        Response::json($rows);
    }

    public function show(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy đánh giá', 404); return; }
        Response::json($row);
    }

    public function store(): void {
        Auth::require();
        $data = bodyJson();
        $authorName = trim($data['author_name'] ?? '');
        if (!$authorName) { Response::error('Tên khách hàng không được để trống', 422); return; }

        $id = $this->db->execute(
            "INSERT INTO testimonials (author_name, author_role, author_avatar, content, rating, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
            [
                $authorName,
                trim($data['author_role'] ?? ''),
                trim($data['author_avatar'] ?? ''),
                trim($data['content'] ?? ''),
                max(1, min(5, (int)($data['rating'] ?? 5))),
                (int)($data['sort_order'] ?? 0),
            ]
        );
        $row = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]);
        Response::json($row, 201);
    }

    public function update(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy đánh giá', 404); return; }

        $data = bodyJson();
        $this->db->execute(
            "UPDATE testimonials SET author_name = ?, author_role = ?, author_avatar = ?, content = ?, rating = ?, sort_order = ? WHERE id = ?",
            [
                trim($data['author_name'] ?? $row['author_name']),
                trim($data['author_role'] ?? $row['author_role']),
                trim($data['author_avatar'] ?? $row['author_avatar']),
                trim($data['content'] ?? $row['content']),
                max(1, min(5, (int)($data['rating'] ?? $row['rating']))),
                (int)($data['sort_order'] ?? $row['sort_order']),
                $id,
            ]
        );
        $row = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]);
        Response::json($row);
    }

    public function destroy(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT id FROM testimonials WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy đánh giá', 404); return; }
        $this->db->execute("DELETE FROM testimonials WHERE id = ?", [$id]);
        Response::json(['message' => 'Đã xóa đánh giá']);
    }
}
