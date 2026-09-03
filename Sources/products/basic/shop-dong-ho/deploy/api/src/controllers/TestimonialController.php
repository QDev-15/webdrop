<?php
declare(strict_types=1);

// Admin: CRUD đánh giá khách hàng (ve-chung-toi.html — LIST-ELEGANT testimonials).
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
        $data           = bodyJson();
        $authorName     = trim($data['author_name'] ?? '');
        $authorLocation = trim($data['author_location'] ?? '');
        $authorAvatar   = trim($data['author_avatar'] ?? '');
        $content        = trim($data['content'] ?? '');
        $sortOrder      = (int)($data['sort_order'] ?? 0);

        if (!$authorName || !$content) { Response::error('Tên khách hàng và nội dung không được để trống', 422); return; }

        $id = $this->db->execute(
            "INSERT INTO testimonials (author_name, author_location, author_avatar, content, sort_order) VALUES (?, ?, ?, ?, ?)",
            [$authorName, $authorLocation, $authorAvatar, $content, $sortOrder]
        );
        $row = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]);
        Response::json($row, 201);
    }

    public function update(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy đánh giá', 404); return; }

        $data           = bodyJson();
        $authorName     = trim($data['author_name'] ?? $row['author_name']);
        $authorLocation = trim($data['author_location'] ?? $row['author_location']);
        $authorAvatar   = trim($data['author_avatar'] ?? $row['author_avatar']);
        $content        = trim($data['content'] ?? $row['content']);
        $sortOrder      = (int)($data['sort_order'] ?? $row['sort_order']);

        $this->db->execute(
            "UPDATE testimonials SET author_name = ?, author_location = ?, author_avatar = ?, content = ?, sort_order = ? WHERE id = ?",
            [$authorName, $authorLocation, $authorAvatar, $content, $sortOrder, $id]
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
