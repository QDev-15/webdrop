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
        $body      = bodyJson();
        $image     = trim($body['image']      ?? '');
        $title     = trim($body['title']      ?? '');
        $sortOrder = (int)($body['sort_order'] ?? 0);

        if (!$image) Response::error('URL ảnh không được để trống.', 422);

        $this->db->execute(
            "INSERT INTO gallery_items (image, title, sort_order) VALUES (?,?,?)",
            [$image, $title, $sortOrder]
        );
        Response::json(['id' => (int)$this->db->lastInsertId(), 'message' => 'Đã thêm ảnh.']);
    }

    public function update(array $params): void {
        Auth::require();
        $id = (int)($params['id'] ?? 0);
        if (!$id) Response::error('ID không hợp lệ.', 400);

        $body      = bodyJson();
        $image     = trim($body['image']      ?? '');
        $title     = trim($body['title']      ?? '');
        $sortOrder = (int)($body['sort_order'] ?? 0);

        if (!$image) Response::error('URL ảnh không được để trống.', 422);

        $this->db->execute(
            "UPDATE gallery_items SET image=?, title=?, sort_order=? WHERE id=?",
            [$image, $title, $sortOrder, $id]
        );
        Response::json(['message' => 'Đã cập nhật ảnh.']);
    }

    public function destroy(array $params): void {
        Auth::require();
        $id = (int)($params['id'] ?? 0);
        if (!$id) Response::error('ID không hợp lệ.', 400);
        $this->db->execute("DELETE FROM gallery_items WHERE id=?", [$id]);
        Response::json(['message' => 'Đã xóa ảnh.']);
    }
}
