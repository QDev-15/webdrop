<?php
declare(strict_types=1);

class HeroSlideController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json($this->db->query("SELECT * FROM hero_slides ORDER BY sort_order, id"));
    }

    public function store(array $p): void {
        Auth::require();
        $b  = bodyJson();
        $id = $this->db->execute(
            "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                $b['title']       ?? '',
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

    public function reorder(array $p): void {
        Auth::require();
        $b     = bodyJson();
        $items = $b['items'] ?? [];
        foreach ($items as $item) {
            $this->db->execute(
                "UPDATE hero_slides SET sort_order=? WHERE id=?",
                [(int)($item['sort_order'] ?? 0), $item['id']]
            );
        }
        Response::json(['ok' => true]);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE hero_slides SET title=?, subtitle=?, button_text=?, button_link=?, image=?, sort_order=?, status=? WHERE id=?",
            [
                $b['title']       ?? '',
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
}
