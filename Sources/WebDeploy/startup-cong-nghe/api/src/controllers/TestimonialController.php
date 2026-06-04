<?php

class TestimonialController {
    private Database $db;
    public function __construct(Database $db) { $this->db = $db; }

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM testimonials ORDER BY sort_order, id");
        Response::json($items);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['author_name']) || empty($b['content'])) {
            Response::error('Tên tác giả và nội dung không được để trống');
        }
        $id = $this->db->execute(
            "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                strip_tags($b['author_name']   ?? ''),
                strip_tags($b['author_title']  ?? ''),
                strip_tags($b['author_avatar'] ?? ''),
                strip_tags($b['content']),
                (int)($b['rating']             ?? 5),
                (int)($b['sort_order']         ?? 0),
                $b['status']                   ?? 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE testimonials SET author_name=?, author_title=?, author_avatar=?, content=?, rating=?, sort_order=?, status=?
             WHERE id=?",
            [
                strip_tags($b['author_name']   ?? ''),
                strip_tags($b['author_title']  ?? ''),
                strip_tags($b['author_avatar'] ?? ''),
                strip_tags($b['content']       ?? ''),
                (int)($b['rating']             ?? 5),
                (int)($b['sort_order']         ?? 0),
                $b['status']                   ?? 'published',
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM testimonials WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
