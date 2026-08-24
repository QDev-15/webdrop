<?php
declare(strict_types=1);

class ArticleController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json($this->db->query("SELECT * FROM articles ORDER BY published_at DESC"));
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM articles WHERE id = ?", [$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    private function uniqueSlug(string $base, ?int $excludeId = null): string {
        $slug = $base; $i = 2;
        while (true) {
            $sql = "SELECT id FROM articles WHERE slug = ?";
            $params = [$slug];
            if ($excludeId) { $sql .= " AND id != ?"; $params[] = $excludeId; }
            if (!$this->db->queryOne($sql, $params)) break;
            $slug = $base . '-' . $i; $i++;
        }
        return $slug;
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề là bắt buộc.'); return; }
        $slug = $this->uniqueSlug(slugify($b['title']));
        $id = $this->db->execute(
            "INSERT INTO articles (title, slug, category, thumbnail, excerpt, content, author, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [$b['title'], $slug, $b['category'] ?? '', $b['thumbnail'] ?? '', $b['excerpt'] ?? '', $b['content'] ?? '',
             $b['author'] ?? 'Đội ngũ biên tập RaoNhà', $b['published_at'] ?? date('Y-m-d H:i:s')]
        );
        Response::json(['id' => $id, 'slug' => $slug], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề là bắt buộc.'); return; }
        $existing = $this->db->queryOne("SELECT slug FROM articles WHERE id = ?", [$p['id']]);
        if (!$existing) { Response::error('Không tìm thấy.', 404); return; }
        $slug = $existing['slug'];
        if (!empty($b['regenerate_slug'])) { $slug = $this->uniqueSlug(slugify($b['title']), (int)$p['id']); }
        $this->db->execute(
            "UPDATE articles SET title=?, slug=?, category=?, thumbnail=?, excerpt=?, content=?, author=?, published_at=? WHERE id=?",
            [$b['title'], $slug, $b['category'] ?? '', $b['thumbnail'] ?? '', $b['excerpt'] ?? '', $b['content'] ?? '',
             $b['author'] ?? 'Đội ngũ biên tập RaoNhà', $b['published_at'] ?? date('Y-m-d H:i:s'), $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM articles WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
