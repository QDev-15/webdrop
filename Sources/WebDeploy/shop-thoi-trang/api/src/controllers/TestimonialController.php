<?php
declare(strict_types=1);

class TestimonialController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC"
        );
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
        $data              = bodyJson();
        $author_name       = trim($data['author_name'] ?? '');
        $author_avatar     = trim($data['author_avatar'] ?? '');
        $author_role       = trim($data['author_role'] ?? '');
        $content           = trim($data['content'] ?? '');
        $stars             = max(1, min(5, (int)($data['stars'] ?? 5)));
        $product_purchased = trim($data['product_purchased'] ?? '');
        $is_active         = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1;
        $sort_order        = (int)($data['sort_order'] ?? 0);

        if (!$author_name || !$content) {
            Response::error('Tên và nội dung đánh giá không được để trống', 422);
            return;
        }

        $id = $this->db->execute(
            "INSERT INTO testimonials (author_name, author_avatar, author_role, content, stars, product_purchased, is_active, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [$author_name, $author_avatar, $author_role, $content, $stars, $product_purchased, $is_active, $sort_order]
        );
        $row = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]);
        Response::json($row, 201);
    }

    public function update(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy đánh giá', 404); return; }

        $data              = bodyJson();
        $author_name       = trim($data['author_name'] ?? $row['author_name']);
        $author_avatar     = trim($data['author_avatar'] ?? ($row['author_avatar'] ?? ''));
        $author_role       = trim($data['author_role'] ?? ($row['author_role'] ?? ''));
        $content           = trim($data['content'] ?? $row['content']);
        $stars             = max(1, min(5, (int)($data['stars'] ?? $row['stars'])));
        $product_purchased = trim($data['product_purchased'] ?? ($row['product_purchased'] ?? ''));
        $is_active         = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : (int)$row['is_active'];
        $sort_order        = (int)($data['sort_order'] ?? $row['sort_order']);

        $this->db->execute(
            "UPDATE testimonials SET author_name=?, author_avatar=?, author_role=?, content=?, stars=?, product_purchased=?, is_active=?, sort_order=? WHERE id=?",
            [$author_name, $author_avatar, $author_role, $content, $stars, $product_purchased, $is_active, $sort_order, $id]
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
