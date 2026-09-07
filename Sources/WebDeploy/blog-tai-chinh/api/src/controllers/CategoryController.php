<?php
declare(strict_types=1);

// Quản lý chuyên mục bài viết (post_categories).
class CategoryController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query(
            "SELECT c.*, (SELECT COUNT(*) FROM posts WHERE category_id = c.id) AS post_count
             FROM post_categories c ORDER BY c.sort_order, c.id"
        );
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM post_categories WHERE id = ?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên chuyên mục là bắt buộc.'); return; }
        $slug = trim($b['slug'] ?? '') ?: slugify($b['name']);
        $existing = $this->db->queryOne("SELECT id FROM post_categories WHERE slug = ?", [$slug]);
        if ($existing) { Response::error('Slug đã tồn tại, vui lòng chọn slug khác.', 409); return; }
        $id = $this->db->execute(
            "INSERT INTO post_categories (name, slug, show_on_home, sort_order) VALUES (?, ?, ?, ?)",
            [$b['name'], $slug, (int)($b['show_on_home'] ?? 1), (int)($b['sort_order'] ?? 0)]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên chuyên mục là bắt buộc.'); return; }
        $slug = trim($b['slug'] ?? '') ?: slugify($b['name']);
        $existing = $this->db->queryOne("SELECT id FROM post_categories WHERE slug = ? AND id != ?", [$slug, $p['id']]);
        if ($existing) { Response::error('Slug đã tồn tại, vui lòng chọn slug khác.', 409); return; }
        $this->db->execute(
            "UPDATE post_categories SET name=?, slug=?, show_on_home=?, sort_order=? WHERE id=?",
            [$b['name'], $slug, (int)($b['show_on_home'] ?? 1), (int)($b['sort_order'] ?? 0), $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM post_categories WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
