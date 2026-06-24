<?php
declare(strict_types=1);

class TestimonialController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM testimonials ORDER BY sort_order ASC");
        Response::json($items);
    }

    public function store(array $p): void {
        Auth::require();
        $b           = bodyJson();
        $authorName  = trim((string)($b['author_name'] ?? ''));
        if (!$authorName) { Response::error('Ten tac gia khong duoc de trong.', 422); return; }
        $authorInfo   = trim((string)($b['author_info'] ?? ''));
        $authorAvatar = trim((string)($b['author_avatar'] ?? ''));
        $content      = trim((string)($b['content'] ?? ''));
        $rating       = max(1, min(5, (int)($b['rating'] ?? 5)));
        $sort         = (int)($b['sort_order'] ?? 0);
        $active       = isset($b['active']) ? (int)$b['active'] : 1;
        $id = $this->db->execute(
            "INSERT INTO testimonials (author_name, author_info, author_avatar, content, rating, sort_order, active)
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            [$authorName, $authorInfo, $authorAvatar, $content, $rating, $sort, $active]
        );
        Response::json($this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]), 201);
    }

    public function update(array $p): void {
        Auth::require();
        $id  = (int)($p['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]);
        if (!$row) { Response::error('Khong tim thay danh gia.', 404); return; }
        $b            = bodyJson();
        $authorName   = trim((string)($b['author_name'] ?? $row['author_name']));
        $authorInfo   = trim((string)($b['author_info'] ?? $row['author_info']));
        $authorAvatar = trim((string)($b['author_avatar'] ?? $row['author_avatar']));
        $content      = trim((string)($b['content'] ?? $row['content']));
        $rating       = isset($b['rating']) ? max(1, min(5, (int)$b['rating'])) : (int)$row['rating'];
        $sort         = isset($b['sort_order']) ? (int)$b['sort_order'] : (int)$row['sort_order'];
        $active       = isset($b['active']) ? (int)$b['active'] : (int)$row['active'];
        $this->db->execute(
            "UPDATE testimonials SET author_name=?, author_info=?, author_avatar=?, content=?, rating=?, sort_order=?, active=? WHERE id=?",
            [$authorName, $authorInfo, $authorAvatar, $content, $rating, $sort, $active, $id]
        );
        Response::json($this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]));
    }

    public function destroy(array $p): void {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        if (!$this->db->queryOne("SELECT id FROM testimonials WHERE id = ?", [$id])) {
            Response::error('Khong tim thay danh gia.', 404); return;
        }
        $this->db->execute("DELETE FROM testimonials WHERE id = ?", [$id]);
        Response::json(['ok' => true]);
    }
}
