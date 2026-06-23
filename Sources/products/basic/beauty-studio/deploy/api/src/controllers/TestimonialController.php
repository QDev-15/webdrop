<?php
declare(strict_types=1);

class TestimonialController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query('SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC');
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne('SELECT * FROM testimonials WHERE id=?', [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function store(): void {
        Auth::require();
        $body         = bodyJson();
        $author_name  = trim($body['author_name'] ?? '');
        $author_title = trim($body['author_title'] ?? '');
        $author_avatar= trim($body['author_avatar'] ?? '');
        $content      = trim($body['content'] ?? '');
        $rating       = max(1, min(5, (int)($body['rating'] ?? 5)));
        $sort_order   = (int)($body['sort_order'] ?? 0);
        $is_visible   = (int)($body['is_visible'] ?? 1);

        if (!$author_name || !$content) {
            Response::error('Tên và nội dung đánh giá là bắt buộc.', 422);
            return;
        }

        $id = $this->db->execute(
            'INSERT INTO testimonials (author_name,author_title,author_avatar,content,rating,sort_order,is_visible) VALUES (?,?,?,?,?,?,?)',
            [$author_name, $author_title, $author_avatar, $content, $rating, $sort_order, $is_visible]
        );
        Response::json(['id' => $id, 'message' => 'Đã thêm đánh giá.'], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $row = $this->db->queryOne('SELECT id FROM testimonials WHERE id=?', [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }

        $body         = bodyJson();
        $author_name  = trim($body['author_name'] ?? '');
        $author_title = trim($body['author_title'] ?? '');
        $author_avatar= trim($body['author_avatar'] ?? '');
        $content      = trim($body['content'] ?? '');
        $rating       = max(1, min(5, (int)($body['rating'] ?? 5)));
        $sort_order   = (int)($body['sort_order'] ?? 0);
        $is_visible   = (int)($body['is_visible'] ?? 1);

        if (!$author_name || !$content) {
            Response::error('Tên và nội dung đánh giá là bắt buộc.', 422);
            return;
        }

        $this->db->execute(
            'UPDATE testimonials SET author_name=?,author_title=?,author_avatar=?,content=?,rating=?,sort_order=?,is_visible=? WHERE id=?',
            [$author_name, $author_title, $author_avatar, $content, $rating, $sort_order, $is_visible, (int)$p['id']]
        );
        Response::json(['message' => 'Đã cập nhật.']);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute('DELETE FROM testimonials WHERE id=?', [(int)$p['id']]);
        Response::json(['message' => 'Đã xóa.']);
    }
}
