<?php
declare(strict_types=1);

class TestimonialController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $id = (int)$p['id'];
        if (!$id) { Response::error('ID không hợp lệ.', 400); return; }
        $item = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $authorName = trim($b['author_name'] ?? '');
        $content    = trim($b['content']     ?? '');
        if (!$authorName || !$content) {
            Response::error('Tên tác giả và nội dung là bắt buộc.', 422);
            return;
        }
        $id = $this->db->execute(
            "INSERT INTO testimonials (author_name, author_role, author_avatar, content, rating, is_featured, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                $authorName,
                trim($b['author_role']   ?? ''),
                trim($b['author_avatar'] ?? ''),
                $content,
                (int)($b['rating']       ?? 5),
                isset($b['is_featured']) ? (int)$b['is_featured'] : 1,
                (int)($b['sort_order']   ?? 0),
            ]
        );
        Response::json(['ok' => true, 'id' => $id]);
    }

    public function update(array $p): void {
        Auth::require();
        $b  = bodyJson();
        $id = (int)$p['id'];
        if (!$id) { Response::error('ID không hợp lệ.', 400); return; }
        $this->db->execute(
            "UPDATE testimonials SET author_name = ?, author_role = ?, author_avatar = ?, content = ?, rating = ?, is_featured = ?, sort_order = ? WHERE id = ?",
            [
                trim($b['author_name']   ?? ''),
                trim($b['author_role']   ?? ''),
                trim($b['author_avatar'] ?? ''),
                trim($b['content']       ?? ''),
                (int)($b['rating']       ?? 5),
                isset($b['is_featured']) ? (int)$b['is_featured'] : 1,
                (int)($b['sort_order']   ?? 0),
                $id,
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $id = (int)$p['id'];
        if (!$id) { Response::error('ID không hợp lệ.', 400); return; }
        $this->db->execute("DELETE FROM testimonials WHERE id = ?", [$id]);
        Response::json(['ok' => true]);
    }
}
