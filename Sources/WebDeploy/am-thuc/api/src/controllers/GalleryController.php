<?php
declare(strict_types=1);

class GalleryController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json($this->db->query("SELECT * FROM gallery_items ORDER BY sort_order, id"));
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['image'])) { Response::error('Ảnh không được để trống.'); return; }
        $id = $this->db->execute(
            "INSERT INTO gallery_items (title, description, image, category, sort_order, status) VALUES (?, ?, ?, ?, ?, ?)",
            [
                $b['title'] ?? '',
                $b['description'] ?? '',
                $b['image'],
                $b['category'] ?? '',
                (int)($b['sort_order'] ?? 0),
                $b['status'] ?? 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function reorder(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (!isset($b['ids']) || !is_array($b['ids'])) { Response::error('Dữ liệu không hợp lệ.'); return; }
        foreach ($b['ids'] as $order => $id) {
            $this->db->execute("UPDATE gallery_items SET sort_order=? WHERE id=?", [$order, $id]);
        }
        Response::json(['ok' => true]);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['image'])) { Response::error('Ảnh không được để trống.'); return; }
        $this->db->execute(
            "UPDATE gallery_items SET title=?, description=?, image=?, category=?, sort_order=?, status=? WHERE id=?",
            [
                $b['title'] ?? '',
                $b['description'] ?? '',
                $b['image'],
                $b['category'] ?? '',
                (int)($b['sort_order'] ?? 0),
                $b['status'] ?? 'published',
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM gallery_items WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
