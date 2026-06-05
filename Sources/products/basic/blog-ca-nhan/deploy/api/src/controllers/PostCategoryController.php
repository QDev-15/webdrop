<?php
declare(strict_types=1);

class PostCategoryController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $cats = $this->db->query(
            "SELECT c.*, COUNT(po.id) as post_count
             FROM post_categories c
             LEFT JOIN posts po ON po.category_id = c.id
             GROUP BY c.id
             ORDER BY c.sort_order, c.name"
        );
        Response::json($cats);
    }

    public function show(array $p): void {
        Auth::require();
        $cat = $this->db->queryOne("SELECT * FROM post_categories WHERE id = ?", [$p['id']]);
        if (!$cat) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($cat);
    }

    public function store(array $p): void {
        Auth::require();
        $b    = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên danh mục không được để trống.'); return; }
        $slug = $b['slug'] ?? slugify($name);
        $id = $this->db->execute(
            "INSERT INTO post_categories (name, slug, description, sort_order) VALUES (?, ?, ?, ?)",
            [$name, $slug, $b['description'] ?? '', (int)($b['sort_order'] ?? 0)]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b    = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên danh mục không được để trống.'); return; }
        $slug = $b['slug'] ?? slugify($name);
        $this->db->execute(
            "UPDATE post_categories SET name = ?, slug = ?, description = ?, sort_order = ? WHERE id = ?",
            [$name, $slug, $b['description'] ?? '', (int)($b['sort_order'] ?? 0), $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM post_categories WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
