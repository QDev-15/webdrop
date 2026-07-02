<?php
declare(strict_types=1);

class ServiceController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query("
            SELECT s.*, c.name AS category_name
            FROM services s
            LEFT JOIN service_categories c ON c.id = s.category_id
            ORDER BY s.sort_order ASC, s.id ASC
        ");
        Response::json($rows);
    }

    public function store(): void {
        Auth::require();
        $body = bodyJson();
        $catId    = ($body['category_id'] === '' || $body['category_id'] === null) ? null : (int)$body['category_id'];
        $name     = trim($body['name']        ?? '');
        $tag      = trim($body['tag']         ?? '');
        $desc     = trim($body['description'] ?? '');
        $price    = trim($body['price']       ?? '');
        $duration = trim($body['duration']    ?? '');
        $image    = trim($body['image']       ?? '');
        $featured = (int)($body['featured']   ?? 0);
        $sort     = (int)($body['sort_order'] ?? 0);

        if (!$name) { Response::error('Tên dịch vụ không được để trống.', 422); return; }

        $this->db->execute(
            "INSERT INTO services (category_id, name, tag, description, price, duration, image, featured, sort_order) VALUES (?,?,?,?,?,?,?,?,?)",
            [$catId, $name, $tag, $desc, $price, $duration, $image, $featured, $sort]
        );
        Response::json(['id' => (int)$this->db->lastInsertId(), 'message' => 'Đã tạo dịch vụ.'], 201);
    }

    public function update(array $params): void {
        Auth::require();
        $id       = (int)($params['id'] ?? 0);
        $body     = bodyJson();
        $catId    = ($body['category_id'] === '' || $body['category_id'] === null) ? null : (int)$body['category_id'];
        $name     = trim($body['name']        ?? '');
        $tag      = trim($body['tag']         ?? '');
        $desc     = trim($body['description'] ?? '');
        $price    = trim($body['price']       ?? '');
        $duration = trim($body['duration']    ?? '');
        $image    = trim($body['image']       ?? '');
        $featured = (int)($body['featured']   ?? 0);
        $sort     = (int)($body['sort_order'] ?? 0);

        if (!$name) { Response::error('Tên dịch vụ không được để trống.', 422); return; }

        $this->db->execute(
            "UPDATE services SET category_id=?, name=?, tag=?, description=?, price=?, duration=?, image=?, featured=?, sort_order=? WHERE id=?",
            [$catId, $name, $tag, $desc, $price, $duration, $image, $featured, $sort, $id]
        );
        Response::json(['message' => 'Đã cập nhật.']);
    }

    public function destroy(array $params): void {
        Auth::require();
        $id = (int)($params['id'] ?? 0);
        $this->db->execute("DELETE FROM services WHERE id=?", [$id]);
        Response::json(['message' => 'Đã xóa.']);
    }
}
