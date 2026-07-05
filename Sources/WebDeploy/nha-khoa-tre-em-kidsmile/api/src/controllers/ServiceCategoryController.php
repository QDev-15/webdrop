<?php
declare(strict_types=1);

class ServiceCategoryController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM service_categories ORDER BY sort_order ASC");
        Response::json($rows);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên danh mục không được để trống.', 422); return; }
        $slug = $b['slug'] ?? preg_replace('/[^a-z0-9]+/', '-', strtolower($name));
        $id = $this->db->execute(
            "INSERT INTO service_categories (name, slug, sort_order) VALUES (?, ?, ?)",
            [$name, $slug, (int)($b['sort_order'] ?? 0)]
        );
        Response::json($this->db->queryOne("SELECT * FROM service_categories WHERE id = ?", [$id]), 201);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM service_categories WHERE id = ?", [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $id = (int)$p['id'];
        $row = $this->db->queryOne("SELECT id FROM service_categories WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        $this->db->execute(
            "UPDATE service_categories SET name=?, slug=?, sort_order=? WHERE id=?",
            [trim($b['name'] ?? ''), trim($b['slug'] ?? ''), (int)($b['sort_order'] ?? 0), $id]
        );
        Response::json($this->db->queryOne("SELECT * FROM service_categories WHERE id = ?", [$id]));
    }

    public function destroy(array $p): void {
        Auth::require();
        $id = (int)$p['id'];
        $this->db->execute("DELETE FROM service_categories WHERE id = ?", [$id]);
        Response::json(['ok' => true]);
    }
}
