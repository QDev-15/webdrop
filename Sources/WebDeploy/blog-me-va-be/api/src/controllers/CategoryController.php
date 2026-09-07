<?php
declare(strict_types=1);

class CategoryController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query(
            "SELECT c.*, (SELECT COUNT(*) FROM posts WHERE category_slug = c.slug) AS post_count
             FROM categories c ORDER BY c.sort_order, c.id"
        );
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM categories WHERE id = ?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên chuyên mục là bắt buộc.'); return; }
        $slug = trim($b['slug'] ?? '') ?: slugify($name);
        $exists = $this->db->queryOne("SELECT id FROM categories WHERE slug = ?", [$slug]);
        if ($exists) { Response::error('Slug đã tồn tại.', 409); return; }
        $id = $this->db->execute(
            "INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)",
            [$name, $slug, (int)($b['sort_order'] ?? 0)]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên chuyên mục là bắt buộc.'); return; }
        $slug = trim($b['slug'] ?? '') ?: slugify($name);
        $exists = $this->db->queryOne("SELECT id FROM categories WHERE slug = ? AND id != ?", [$slug, $p['id']]);
        if ($exists) { Response::error('Slug đã tồn tại.', 409); return; }
        $this->db->execute(
            "UPDATE categories SET name=?, slug=?, sort_order=? WHERE id=?",
            [$name, $slug, (int)($b['sort_order'] ?? 0), $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM categories WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
