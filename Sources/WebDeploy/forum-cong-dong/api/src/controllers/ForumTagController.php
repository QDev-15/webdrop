<?php
declare(strict_types=1);

class ForumTagController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json($this->db->query("SELECT * FROM forum_tags ORDER BY usage_count DESC, id ASC"));
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên tag không được để trống.'); return; }
        $id = $this->db->execute(
            "INSERT INTO forum_tags (name, slug, usage_count) VALUES (?, ?, ?)",
            [$b['name'], slugify($b['name']), (int)($b['usage_count'] ?? 0)]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE forum_tags SET name=?, slug=?, usage_count=? WHERE id=?",
            [$b['name'], slugify($b['name']), (int)($b['usage_count'] ?? 0), $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM forum_tags WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
