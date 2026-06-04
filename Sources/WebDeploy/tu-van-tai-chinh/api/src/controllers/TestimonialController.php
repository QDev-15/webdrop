<?php
declare(strict_types=1);

class TestimonialController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM testimonials ORDER BY sort_order, id");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $t = $this->db->queryOne("SELECT * FROM testimonials WHERE id=?", [$p['id']]);
        if (!$t) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($t);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['author_name'])) { Response::error('Tên tác giả không được để trống.'); return; }
        if (empty($b['content'])) { Response::error('Nội dung không được để trống.'); return; }
        $id = $this->db->execute(
            "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order, status) VALUES (?,?,?,?,?,?,?)",
            [$b['author_name'], $b['author_title'] ?? '', $b['author_avatar'] ?? '', $b['content'], $b['rating'] ?? 5, $b['sort_order'] ?? 0, $b['status'] ?? 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE testimonials SET author_name=?, author_title=?, author_avatar=?, content=?, rating=?, sort_order=?, status=? WHERE id=?",
            [$b['author_name'] ?? '', $b['author_title'] ?? '', $b['author_avatar'] ?? '', $b['content'] ?? '', $b['rating'] ?? 5, $b['sort_order'] ?? 0, $b['status'] ?? 'published', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM testimonials WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
