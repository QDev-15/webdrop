<?php
declare(strict_types=1);

class MenuCategoryController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $cats = $this->db->query(
            "SELECT c.*, (SELECT COUNT(*) FROM menu_items WHERE category_id=c.id) as item_count
             FROM menu_categories c ORDER BY c.sort_order, c.id"
        );
        Response::json($cats);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên danh mục không được để trống.'); return; }
        $slug = slugify($b['name']);
        // ensure unique slug
        $existing = $this->db->scalar("SELECT COUNT(*) FROM menu_categories WHERE slug=?", [$slug]);
        if ($existing > 0) { $slug .= '-' . time(); }
        $id = $this->db->execute(
            "INSERT INTO menu_categories (name, slug, description, image, sort_order, status) VALUES (?, ?, ?, ?, ?, ?)",
            [$b['name'], $slug, $b['description'] ?? '', $b['image'] ?? '', (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên danh mục không được để trống.'); return; }
        $this->db->execute(
            "UPDATE menu_categories SET name=?, description=?, image=?, sort_order=?, status=? WHERE id=?",
            [$b['name'], $b['description'] ?? '', $b['image'] ?? '', (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM menu_categories WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
