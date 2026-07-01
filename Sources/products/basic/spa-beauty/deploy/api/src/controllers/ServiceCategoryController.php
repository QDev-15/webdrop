<?php
declare(strict_types=1);

class ServiceCategoryController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM service_categories ORDER BY sort_order ASC, id ASC");
        Response::json($rows);
    }

    public function store(): void {
        Auth::require();
        $body = bodyJson();
        $name = trim($body['name'] ?? '');
        $icon = trim($body['icon'] ?? '💆');
        $sort = (int)($body['sort_order'] ?? 0);

        if (!$name) { Response::error('Tên danh mục không được để trống.', 422); return; }

        $this->db->execute(
            "INSERT INTO service_categories (name, icon, sort_order) VALUES (?, ?, ?)",
            [$name, $icon, $sort]
        );
        Response::json(['id' => (int)$this->db->lastInsertId(), 'message' => 'Đã tạo danh mục.'], 201);
    }

    public function update(array $params): void {
        Auth::require();
        $id   = (int)($params['id'] ?? 0);
        $body = bodyJson();
        $name = trim($body['name'] ?? '');
        $icon = trim($body['icon'] ?? '💆');
        $sort = (int)($body['sort_order'] ?? 0);

        if (!$name) { Response::error('Tên danh mục không được để trống.', 422); return; }

        $this->db->execute(
            "UPDATE service_categories SET name=?, icon=?, sort_order=? WHERE id=?",
            [$name, $icon, $sort, $id]
        );
        Response::json(['message' => 'Đã cập nhật.']);
    }

    public function destroy(array $params): void {
        Auth::require();
        $id = (int)($params['id'] ?? 0);
        $this->db->execute("DELETE FROM service_categories WHERE id=?", [$id]);
        Response::json(['message' => 'Đã xóa.']);
    }
}
