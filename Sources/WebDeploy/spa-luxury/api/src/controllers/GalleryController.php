<?php
declare(strict_types=1);

class GalleryController {
    public function __construct(private Database $db) {}

    /** GET /gallery */
    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT * FROM gallery_items ORDER BY sort_order, id"
        );
        Response::json($rows);
    }

    /** POST /gallery */
    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();

        if (empty($b['name'])) {
            Response::error('Tên ảnh là bắt buộc.');
            return;
        }
        if (empty($b['image'])) {
            Response::error('URL ảnh là bắt buộc.');
            return;
        }

        $id = $this->db->execute(
            "INSERT INTO gallery_items
                (name, description, image, sort_order, is_published)
             VALUES (?, ?, ?, ?, ?)",
            [
                trim($b['name']),
                trim($b['description'] ?? ''),
                trim($b['image']),
                (int)($b['sort_order'] ?? 0),
                isset($b['is_published']) ? (int)(bool)$b['is_published'] : 1,
            ]
        );
        Response::json(['id' => $id], 201);
    }

    /** POST /gallery/:id/update */
    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();

        if (empty($b['name'])) {
            Response::error('Tên ảnh là bắt buộc.');
            return;
        }
        if (empty($b['image'])) {
            Response::error('URL ảnh là bắt buộc.');
            return;
        }

        $this->db->execute(
            "UPDATE gallery_items SET
                name         = ?,
                description  = ?,
                image        = ?,
                sort_order   = ?,
                is_published = ?
             WHERE id = ?",
            [
                trim($b['name']),
                trim($b['description'] ?? ''),
                trim($b['image']),
                (int)($b['sort_order'] ?? 0),
                isset($b['is_published']) ? (int)(bool)$b['is_published'] : 1,
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    /** POST /gallery/:id/delete */
    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM gallery_items WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
