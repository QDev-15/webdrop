<?php
declare(strict_types=1);

class TagController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $tags = $this->db->query(
            "SELECT t.*, COUNT(pt.post_id) as post_count
             FROM tags t
             LEFT JOIN post_tags pt ON pt.tag_id = t.id
             GROUP BY t.id
             ORDER BY post_count DESC, t.name"
        );
        Response::json($tags);
    }

    public function store(array $p): void {
        Auth::require();
        $b    = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên tag không được để trống.'); return; }
        $slug = $b['slug'] ?? slugify($name);
        $id = $this->db->execute(
            "INSERT INTO tags (name, slug) VALUES (?, ?)",
            [$name, $slug]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b    = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên tag không được để trống.'); return; }
        $slug = $b['slug'] ?? slugify($name);
        $this->db->execute(
            "UPDATE tags SET name = ?, slug = ? WHERE id = ?",
            [$name, $slug, $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM post_tags WHERE tag_id = ?", [$p['id']]);
        $this->db->execute("DELETE FROM tags WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
