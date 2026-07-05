<?php
declare(strict_types=1);

class TestimonialController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC");
        Response::json($rows);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $author = trim($b['author_name'] ?? '');
        $content = trim($b['content'] ?? '');
        if (!$author || !$content) { Response::error('Tên tác giả và nội dung là bắt buộc.', 422); return; }
        $id = $this->db->execute(
            "INSERT INTO testimonials (author_name, author_meta, author_avatar, content, rating, is_featured, sort_order) VALUES (?,?,?,?,?,?,?)",
            [
                $author,
                trim($b['author_meta']   ?? ''),
                trim($b['author_avatar'] ?? ''),
                $content,
                (int)($b['rating']     ?? 5),
                isset($b['is_featured']) && $b['is_featured'] ? 1 : 0,
                (int)($b['sort_order'] ?? 0),
            ]
        );
        Response::json($this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]), 201);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $id = (int)$p['id'];
        $row = $this->db->queryOne("SELECT id FROM testimonials WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        $this->db->execute(
            "UPDATE testimonials SET author_name=?, author_meta=?, author_avatar=?, content=?, rating=?, is_featured=?, sort_order=? WHERE id=?",
            [
                trim($b['author_name']   ?? ''),
                trim($b['author_meta']   ?? ''),
                trim($b['author_avatar'] ?? ''),
                trim($b['content']       ?? ''),
                (int)($b['rating']       ?? 5),
                isset($b['is_featured']) && $b['is_featured'] ? 1 : 0,
                (int)($b['sort_order']   ?? 0),
                $id,
            ]
        );
        Response::json($this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]));
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM testimonials WHERE id = ?", [(int)$p['id']]);
        Response::json(['ok' => true]);
    }
}
