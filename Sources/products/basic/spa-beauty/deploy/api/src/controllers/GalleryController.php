<?php
declare(strict_types=1);

class GalleryController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM gallery_items ORDER BY sort_order ASC, id ASC");
        Response::json($rows);
    }

    public function store(): void {
        Auth::require();
        $body  = bodyJson();
        $image = trim($body['image'] ?? '');
        $title = trim($body['title'] ?? '');
        $sort  = (int)($body['sort_order'] ?? 0);

        if (!$image) { Response::error('URL ảnh không được để trống.', 422); return; }

        $this->db->execute(
            "INSERT INTO gallery_items (image, title, sort_order) VALUES (?, ?, ?)",
            [$image, $title, $sort]
        );
        Response::json(['id' => (int)$this->db->lastInsertId(), 'message' => 'Đã thêm ảnh vào gallery.'], 201);
    }

    public function update(array $params): void {
        Auth::require();
        $id    = (int)($params['id'] ?? 0);
        $body  = bodyJson();
        $image = trim($body['image'] ?? '');
        $title = trim($body['title'] ?? '');
        $sort  = (int)($body['sort_order'] ?? 0);

        if (!$image) { Response::error('URL ảnh không được để trống.', 422); return; }

        $this->db->execute(
            "UPDATE gallery_items SET image=?, title=?, sort_order=? WHERE id=?",
            [$image, $title, $sort, $id]
        );
        Response::json(['message' => 'Đã cập nhật.']);
    }

    public function destroy(array $params): void {
        Auth::require();
        $id = (int)($params['id'] ?? 0);
        $this->db->execute("DELETE FROM gallery_items WHERE id=?", [$id]);
        Response::json(['message' => 'Đã xóa.']);
    }
}
