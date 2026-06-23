<?php
declare(strict_types=1);

class ServiceCategoryController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query('SELECT * FROM service_categories ORDER BY sort_order ASC');
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne('SELECT * FROM service_categories WHERE id=?', [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function store(): void {
        Auth::require();
        $body = bodyJson();
        $name        = trim($body['name'] ?? '');
        $slug        = trim($body['slug'] ?? '') ?: slugify($name);
        $icon        = trim($body['icon'] ?? '');
        $description = trim($body['description'] ?? '');
        $image       = trim($body['image'] ?? '');
        $sort_order  = (int)($body['sort_order'] ?? 0);

        if (!$name) { Response::error('Tên danh mục là bắt buộc.', 422); return; }

        $id = $this->db->execute(
            'INSERT INTO service_categories (name,slug,icon,description,image,sort_order) VALUES (?,?,?,?,?,?)',
            [$name, $slug, $icon, $description, $image, $sort_order]
        );
        Response::json(['id' => $id, 'message' => 'Đã tạo danh mục.'], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $row = $this->db->queryOne('SELECT id FROM service_categories WHERE id=?', [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }

        $body = bodyJson();
        $name        = trim($body['name'] ?? '');
        $slug        = trim($body['slug'] ?? '') ?: slugify($name);
        $icon        = trim($body['icon'] ?? '');
        $description = trim($body['description'] ?? '');
        $image       = trim($body['image'] ?? '');
        $sort_order  = (int)($body['sort_order'] ?? 0);

        if (!$name) { Response::error('Tên danh mục là bắt buộc.', 422); return; }

        $this->db->execute(
            'UPDATE service_categories SET name=?,slug=?,icon=?,description=?,image=?,sort_order=? WHERE id=?',
            [$name, $slug, $icon, $description, $image, $sort_order, (int)$p['id']]
        );
        Response::json(['message' => 'Đã cập nhật.']);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute('DELETE FROM service_categories WHERE id=?', [(int)$p['id']]);
        Response::json(['message' => 'Đã xóa.']);
    }
}
