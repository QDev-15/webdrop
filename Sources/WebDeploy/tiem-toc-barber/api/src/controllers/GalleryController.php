<?php
declare(strict_types=1);

class GalleryController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query('SELECT * FROM gallery_items ORDER BY sort_order ASC, id ASC');
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne('SELECT * FROM gallery_items WHERE id = ?', [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $image = trim($b['image'] ?? '');
        if (!$image) { Response::error('Ảnh là bắt buộc.'); return; }
        $id = $this->db->execute(
            'INSERT INTO gallery_items (image, alt_text, sort_order, status) VALUES (?, ?, ?, ?)',
            [$image, trim($b['alt_text'] ?? ''), (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $id = (int)$p['id'];
        $existing = $this->db->queryOne('SELECT id FROM gallery_items WHERE id = ?', [$id]);
        if (!$existing) { Response::error('Không tìm thấy.', 404); return; }
        $b = bodyJson();
        $image = trim($b['image'] ?? '');
        if (!$image) { Response::error('Ảnh là bắt buộc.'); return; }
        $this->db->execute(
            'UPDATE gallery_items SET image=?, alt_text=?, sort_order=?, status=? WHERE id=?',
            [$image, trim($b['alt_text'] ?? ''), (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published', $id]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute('DELETE FROM gallery_items WHERE id = ?', [(int)$p['id']]);
        Response::json(['ok' => true]);
    }
}
