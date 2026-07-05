<?php
declare(strict_types=1);

class ServiceCategoryController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $cats = $this->db->query("SELECT * FROM service_categories ORDER BY sort_order ASC");
        Response::json($cats);
    }

    public function show(array $p): void {
        Auth::require();
        $cat = $this->db->queryOne("SELECT * FROM service_categories WHERE id = ?", [$p['id']]);
        if (!$cat) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($cat);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name  = trim($b['name'] ?? '');
        $slug  = trim($b['slug'] ?? '');
        if (!$name) { Response::error('Tên danh mục là bắt buộc.', 422); return; }
        if (!$slug) { $slug = strtolower(preg_replace('/\s+/', '-', $name)); }
        $id = $this->db->execute(
            "INSERT INTO service_categories (name, slug, sort_order) VALUES (?, ?, ?)",
            [$name, $slug, (int)($b['sort_order'] ?? 0)]
        );
        Response::json(['ok' => true, 'id' => $id]);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE service_categories SET name = ?, slug = ?, sort_order = ? WHERE id = ?",
            [
                trim($b['name']       ?? ''),
                trim($b['slug']       ?? ''),
                (int)($b['sort_order'] ?? 0),
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM service_categories WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
