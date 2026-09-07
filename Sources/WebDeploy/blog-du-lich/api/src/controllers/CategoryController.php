<?php
declare(strict_types=1);

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
        $item = $this->db->queryOne("SELECT * FROM post_categories WHERE id=?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên chuyên mục không được để trống.'); return; }
        $slug = !empty($b['slug']) ? slugify($b['slug']) : slugify($b['name']);
        $id = $this->db->execute(
            "INSERT INTO post_categories (name, slug, icon, tag_class, sort_order) VALUES (?,?,?,?,?)",
            [$b['name'], $slug, $b['icon'] ?? '', $b['tag_class'] ?? '', (int)($b['sort_order'] ?? 0)]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên chuyên mục không được để trống.'); return; }
        $slug = !empty($b['slug']) ? slugify($b['slug']) : slugify($b['name']);
        $this->db->execute(
            "UPDATE post_categories SET name=?, slug=?, icon=?, tag_class=?, sort_order=? WHERE id=?",
            [$b['name'], $slug, $b['icon'] ?? '', $b['tag_class'] ?? '', (int)($b['sort_order'] ?? 0), $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM post_categories WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
