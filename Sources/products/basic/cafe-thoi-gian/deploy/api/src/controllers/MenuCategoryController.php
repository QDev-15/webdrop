<?php
declare(strict_types=1);

class MenuCategoryController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $cats = $this->db->query("SELECT *, (SELECT COUNT(*) FROM menu_items WHERE category_id = menu_categories.id) as item_count FROM menu_categories ORDER BY sort_order, id");
        Response::json($cats);
    }

    public function show(array $p): void {
        Auth::require();
        $cat = $this->db->queryOne("SELECT * FROM menu_categories WHERE id = ?", [$p['id']]);
        if (!$cat) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($cat);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên danh mục là bắt buộc.'); return; }
        $slug = slugify($b['name']);
        $id = $this->db->execute(
            "INSERT INTO menu_categories (name, slug, description, icon, sort_order, status) VALUES (?, ?, ?, ?, ?, ?)",
            [$b['name'], $slug, $b['description'] ?? '', $b['icon'] ?? '', (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên danh mục là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE menu_categories SET name=?, description=?, icon=?, sort_order=?, status=? WHERE id=?",
            [$b['name'], $b['description'] ?? '', $b['icon'] ?? '', (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM menu_categories WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
