<?php
declare(strict_types=1);

class TestimonialController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM testimonials ORDER BY sort_order ASC, id DESC");
        Response::json($rows);
    }

    public function store(): void {
        Auth::require();
        $body    = bodyJson();
        $name    = trim($body['author_name']     ?? '');
        $loc     = trim($body['author_location'] ?? '');
        $avatar  = trim($body['author_avatar']   ?? '');
        $content = trim($body['content']         ?? '');
        $rating  = (int)($body['rating']         ?? 5);
        $sort    = (int)($body['sort_order']      ?? 0);

        if (!$name || !$content) { Response::error('Tên và nội dung không được để trống.', 422); return; }

        $this->db->execute(
            "INSERT INTO testimonials (author_name, author_location, author_avatar, content, rating, sort_order) VALUES (?,?,?,?,?,?)",
            [$name, $loc, $avatar, $content, $rating, $sort]
        );
        Response::json(['id' => (int)$this->db->lastInsertId(), 'message' => 'Đã thêm đánh giá.'], 201);
    }

    public function update(array $params): void {
        Auth::require();
        $id      = (int)($params['id'] ?? 0);
        $body    = bodyJson();
        $name    = trim($body['author_name']     ?? '');
        $loc     = trim($body['author_location'] ?? '');
        $avatar  = trim($body['author_avatar']   ?? '');
        $content = trim($body['content']         ?? '');
        $rating  = (int)($body['rating']         ?? 5);
        $sort    = (int)($body['sort_order']      ?? 0);

        if (!$name || !$content) { Response::error('Tên và nội dung không được để trống.', 422); return; }

        $this->db->execute(
            "UPDATE testimonials SET author_name=?, author_location=?, author_avatar=?, content=?, rating=?, sort_order=? WHERE id=?",
            [$name, $loc, $avatar, $content, $rating, $sort, $id]
        );
        Response::json(['message' => 'Đã cập nhật.']);
    }

    public function destroy(array $params): void {
        Auth::require();
        $id = (int)($params['id'] ?? 0);
        $this->db->execute("DELETE FROM testimonials WHERE id=?", [$id]);
        Response::json(['message' => 'Đã xóa.']);
    }
}
