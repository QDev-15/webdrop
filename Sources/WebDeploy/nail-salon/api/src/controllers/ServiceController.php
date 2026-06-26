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
        $body       = bodyJson();
        $categoryId = (int)($body['category_id'] ?? 0) ?: null;
        $name       = trim($body['name']        ?? '');
        $tag        = trim($body['tag']         ?? '');
        $description= trim($body['description'] ?? '');
        $price      = trim($body['price']       ?? '');
        $image      = trim($body['image']       ?? '');
        $featured   = (int)($body['featured']   ?? 0);
        $sortOrder  = (int)($body['sort_order'] ?? 0);

        if (!$name) Response::error('Tên dịch vụ không được để trống.', 422);

        $this->db->execute(
            "INSERT INTO services (category_id, name, tag, description, price, image, featured, sort_order) VALUES (?,?,?,?,?,?,?,?)",
            [$categoryId, $name, $tag, $description, $price, $image, $featured, $sortOrder]
        );
        Response::json(['id' => (int)$this->db->lastInsertId(), 'message' => 'Đã thêm dịch vụ.']);
    }

    public function update(array $params): void {
        Auth::require();
        $id = (int)($params['id'] ?? 0);
        if (!$id) Response::error('ID không hợp lệ.', 400);

        $body       = bodyJson();
        $categoryId = (int)($body['category_id'] ?? 0) ?: null;
        $name       = trim($body['name']        ?? '');
        $tag        = trim($body['tag']         ?? '');
        $description= trim($body['description'] ?? '');
        $price      = trim($body['price']       ?? '');
        $image      = trim($body['image']       ?? '');
        $featured   = (int)($body['featured']   ?? 0);
        $sortOrder  = (int)($body['sort_order'] ?? 0);

        if (!$name) Response::error('Tên dịch vụ không được để trống.', 422);

        $this->db->execute(
            "UPDATE services SET category_id=?, name=?, tag=?, description=?, price=?, image=?, featured=?, sort_order=? WHERE id=?",
            [$categoryId, $name, $tag, $description, $price, $image, $featured, $sortOrder, $id]
        );
        Response::json(['message' => 'Đã cập nhật dịch vụ.']);
    }

    public function destroy(array $params): void {
        Auth::require();
        $id = (int)($params['id'] ?? 0);
        if (!$id) Response::error('ID không hợp lệ.', 400);
        $this->db->execute("DELETE FROM services WHERE id=?", [$id]);
        Response::json(['message' => 'Đã xóa dịch vụ.']);
    }
}
