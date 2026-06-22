<?php
declare(strict_types=1);

// Note: This controller is repurposed for product_categories in the bakery context
class MenuCategoryController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $cats = $this->db->query(
            "SELECT c.*, (SELECT COUNT(*) FROM products WHERE category_id = c.id) as item_count
             FROM product_categories c ORDER BY c.sort_order, c.id"
        );
        Response::json($cats);
    }

    public function show(array $p): void {
        Auth::require();
        $cat = $this->db->queryOne("SELECT * FROM product_categories WHERE id = ?", [$p['id']]);
        if (!$cat) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($cat);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên danh mục là bắt buộc.'); return; }
        $slug = slugify($b['name']);
        $existing = $this->db->queryOne("SELECT id FROM product_categories WHERE slug = ?", [$slug]);
        if ($existing) $slug = $slug . '-' . time();
        $id = $this->db->execute(
            "INSERT INTO product_categories (name, slug, description, icon, image, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                $b['name'],
                $slug,
                $b['description'] ?? '',
                $b['icon'] ?? '',
                $b['image'] ?? '',
                (int)($b['sort_order'] ?? 0),
                $b['status'] ?? 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên danh mục là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE product_categories SET name=?, description=?, icon=?, image=?, sort_order=?, status=? WHERE id=?",
            [
                $b['name'],
                $b['description'] ?? '',
                $b['icon'] ?? '',
                $b['image'] ?? '',
                (int)($b['sort_order'] ?? 0),
                $b['status'] ?? 'published',
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM product_categories WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
