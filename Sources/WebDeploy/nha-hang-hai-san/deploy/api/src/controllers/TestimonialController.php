<?php
declare(strict_types=1);

class TestimonialController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query(
            "SELECT * FROM testimonials ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$p['id']]);
        if (!$item) { Response::error('Khong tim thay.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['author_name']) || empty($b['content'])) {
            Response::error('Ten tac gia va noi dung la bat buoc.'); return;
        }
        $id = $this->db->execute(
            "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                $b['author_name'],
                $b['author_title'] ?? '',
                $b['author_avatar'] ?? '',
                $b['content'],
                (int)($b['rating'] ?? 5),
                (int)($b['sort_order'] ?? 0),
                $b['status'] ?? 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['author_name']) || empty($b['content'])) {
            Response::error('Ten tac gia va noi dung la bat buoc.'); return;
        }
        $this->db->execute(
            "UPDATE testimonials SET author_name=?, author_title=?, author_avatar=?, content=?, rating=?, sort_order=?, status=? WHERE id=?",
            [
                $b['author_name'],
                $b['author_title'] ?? '',
                $b['author_avatar'] ?? '',
                $b['content'],
                (int)($b['rating'] ?? 5),
                (int)($b['sort_order'] ?? 0),
                $b['status'] ?? 'published',
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM testimonials WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
