<?php
declare(strict_types=1);

class TestimonialController {
    public function __construct(private Database $db) {}

    public function index(array $p = []): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM testimonials ORDER BY sort_order, id");
        Response::json($items);
    }

    public function store(array $p = []): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['author_name']) || empty($b['quote'])) {
            Response::error('Ten tac gia va noi dung la bat buoc.', 422);
            return;
        }
        $id = $this->db->execute(
            "INSERT INTO testimonials (author_name, author_meta, author_avatar, stars, quote, is_active, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                $b['author_name'],
                $b['author_meta']   ?? '',
                $b['author_avatar'] ?? '',
                (int)($b['stars']      ?? 5),
                $b['quote'],
                (int)($b['is_active']  ?? 1),
                (int)($b['sort_order'] ?? 0),
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p = []): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['author_name']) || empty($b['quote'])) {
            Response::error('Ten tac gia va noi dung la bat buoc.', 422);
            return;
        }
        $this->db->execute(
            "UPDATE testimonials SET author_name=?, author_meta=?, author_avatar=?, stars=?, quote=?, is_active=?, sort_order=?
             WHERE id=?",
            [
                $b['author_name'],
                $b['author_meta']   ?? '',
                $b['author_avatar'] ?? '',
                (int)($b['stars']      ?? 5),
                $b['quote'],
                (int)($b['is_active']  ?? 1),
                (int)($b['sort_order'] ?? 0),
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p = []): void {
        Auth::require();
        $this->db->execute("DELETE FROM testimonials WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
