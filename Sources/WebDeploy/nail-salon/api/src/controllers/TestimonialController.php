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
        $body = bodyJson();
        $authorName     = trim($body['author_name']     ?? '');
        $authorLocation = trim($body['author_location'] ?? '');
        $authorAvatar   = trim($body['author_avatar']   ?? '');
        $content        = trim($body['content']         ?? '');
        $rating         = (int)($body['rating']         ?? 5);
        $sortOrder      = (int)($body['sort_order']     ?? 0);

        if (!$authorName || !$content) Response::error('Thiếu thông tin bắt buộc.', 422);
        if ($rating < 1 || $rating > 5) $rating = 5;

        $this->db->execute(
            "INSERT INTO testimonials (author_name, author_location, author_avatar, content, rating, sort_order) VALUES (?,?,?,?,?,?)",
            [$authorName, $authorLocation, $authorAvatar, $content, $rating, $sortOrder]
        );
        Response::json(['id' => (int)$this->db->lastInsertId(), 'message' => 'Đã thêm đánh giá.']);
    }

    public function update(array $params): void {
        Auth::require();
        $id = (int)($params['id'] ?? 0);
        if (!$id) Response::error('ID không hợp lệ.', 400);

        $body = bodyJson();
        $authorName     = trim($body['author_name']     ?? '');
        $authorLocation = trim($body['author_location'] ?? '');
        $authorAvatar   = trim($body['author_avatar']   ?? '');
        $content        = trim($body['content']         ?? '');
        $rating         = (int)($body['rating']         ?? 5);
        $sortOrder      = (int)($body['sort_order']     ?? 0);

        if (!$authorName || !$content) Response::error('Thiếu thông tin bắt buộc.', 422);
        if ($rating < 1 || $rating > 5) $rating = 5;

        $this->db->execute(
            "UPDATE testimonials SET author_name=?, author_location=?, author_avatar=?, content=?, rating=?, sort_order=? WHERE id=?",
            [$authorName, $authorLocation, $authorAvatar, $content, $rating, $sortOrder, $id]
        );
        Response::json(['message' => 'Đã cập nhật đánh giá.']);
    }

    public function destroy(array $params): void {
        Auth::require();
        $id = (int)($params['id'] ?? 0);
        if (!$id) Response::error('ID không hợp lệ.', 400);
        $this->db->execute("DELETE FROM testimonials WHERE id=?", [$id]);
        Response::json(['message' => 'Đã xóa đánh giá.']);
    }
}
