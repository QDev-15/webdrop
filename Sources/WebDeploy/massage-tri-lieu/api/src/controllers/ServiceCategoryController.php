<?php
declare(strict_types=1);

class ServiceCategoryController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM service_categories ORDER BY sort_order ASC");
        Response::json($items);
    }

    public function store(array $p): void {
        Auth::require();
        $b    = bodyJson();
        $name = trim((string)($b['name'] ?? ''));
        if (!$name) { Response::error('Ten danh muc khong duoc de trong.', 422); return; }
        $slug  = trim((string)($b['slug'] ?? ''));
        if (!$slug) $slug = slugify($name);
        $desc  = trim((string)($b['description'] ?? ''));
        $sort  = (int)($b['sort_order'] ?? 0);
        $active = isset($b['active']) ? (int)$b['active'] : 1;
        $id = $this->db->execute(
            "INSERT INTO service_categories (name, slug, description, sort_order, active) VALUES (?, ?, ?, ?, ?)",
            [$name, $slug, $desc, $sort, $active]
        );
        $item = $this->db->queryOne("SELECT * FROM service_categories WHERE id = ?", [$id]);
        Response::json($item, 201);
    }

    public function update(array $p): void {
        Auth::require();
        $id   = (int)($p['id'] ?? 0);
        $row  = $this->db->queryOne("SELECT * FROM service_categories WHERE id = ?", [$id]);
        if (!$row) { Response::error('Khong tim thay danh muc.', 404); return; }
        $b    = bodyJson();
        $name = trim((string)($b['name'] ?? $row['name']));
        $slug = trim((string)($b['slug'] ?? $row['slug']));
        if (!$slug) $slug = slugify($name);
        $desc   = trim((string)($b['description'] ?? $row['description']));
        $sort   = isset($b['sort_order']) ? (int)$b['sort_order'] : (int)$row['sort_order'];
        $active = isset($b['active']) ? (int)$b['active'] : (int)$row['active'];
        $this->db->execute(
            "UPDATE service_categories SET name=?, slug=?, description=?, sort_order=?, active=? WHERE id=?",
            [$name, $slug, $desc, $sort, $active, $id]
        );
        Response::json($this->db->queryOne("SELECT * FROM service_categories WHERE id = ?", [$id]));
    }

    public function destroy(array $p): void {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        if (!$this->db->queryOne("SELECT id FROM service_categories WHERE id = ?", [$id])) {
            Response::error('Khong tim thay danh muc.', 404); return;
        }
        $this->db->execute("DELETE FROM service_categories WHERE id = ?", [$id]);
        Response::json(['ok' => true]);
    }
}
