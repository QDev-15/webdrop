<?php
declare(strict_types=1);

class ForumCategoryController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $cats = $this->db->query(
            "SELECT c.*, COUNT(t.id) as thread_count
             FROM forum_categories c
             LEFT JOIN forum_threads t ON t.category_id = c.id
             GROUP BY c.id
             ORDER BY c.sort_order, c.id"
        );
        Response::json($cats);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM forum_categories WHERE id = ?", [$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên danh mục không được để trống.'); return; }
        $id = $this->db->execute(
            "INSERT INTO forum_categories (name, slug, description, icon, sort_order, status) VALUES (?, ?, ?, ?, ?, ?)",
            [$b['name'], slugify($b['name']), $b['description'] ?? '', $b['icon'] ?? '',
             (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE forum_categories SET name=?, slug=?, description=?, icon=?, sort_order=?, status=? WHERE id=?",
            [$b['name'], slugify($b['name']), $b['description'] ?? '', $b['icon'] ?? '',
             (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM forum_categories WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
