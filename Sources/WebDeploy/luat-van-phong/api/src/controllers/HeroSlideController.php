<?php

class HeroSlideController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM hero_slides ORDER BY sort_order, id");
        Response::json($items);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) Response::error('Tiêu đề không được để trống');
        $id = $this->db->execute(
            "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                $b['title'],
                $b['subtitle']    ?? '',
                $b['button_text'] ?? '',
                $b['button_link'] ?? '',
                $b['image']       ?? '',
                (int)($b['sort_order'] ?? 0),
                $b['status']      ?? 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE hero_slides SET title=?, subtitle=?, button_text=?, button_link=?, image=?, sort_order=?, status=?
             WHERE id=?",
            [
                $b['title'],
                $b['subtitle']    ?? '',
                $b['button_text'] ?? '',
                $b['button_link'] ?? '',
                $b['image']       ?? '',
                (int)($b['sort_order'] ?? 0),
                $b['status']      ?? 'published',
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM hero_slides WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }

    public function reorder(array $p): void {
        Auth::require();
        $b = bodyJson();
        foreach ($b['order'] ?? [] as $i => $id) {
            $this->db->execute("UPDATE hero_slides SET sort_order=? WHERE id=?", [$i, $id]);
        }
        Response::json(['ok' => true]);
    }
}
