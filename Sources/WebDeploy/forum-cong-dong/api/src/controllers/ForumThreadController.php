<?php
declare(strict_types=1);

class ForumThreadController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $threads = $this->db->query(
            "SELECT t.*, c.name as category_name
             FROM forum_threads t
             LEFT JOIN forum_categories c ON c.id = t.category_id
             ORDER BY t.is_pinned DESC, t.updated_at DESC, t.id DESC"
        );
        Response::json($threads);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne(
            "SELECT t.*, c.name as category_name
             FROM forum_threads t
             LEFT JOIN forum_categories c ON c.id = t.category_id
             WHERE t.id = ?",
            [$p['id']]
        );
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    private function uniqueSlug(string $base, ?int $excludeId = null): string {
        $slug = slugify($base);
        $original = $slug;
        $i = 1;
        while (true) {
            $sql = "SELECT COUNT(*) FROM forum_threads WHERE slug = ?";
            $params = [$slug];
            if ($excludeId !== null) { $sql .= " AND id != ?"; $params[] = $excludeId; }
            if ($this->db->scalar($sql, $params) == 0) break;
            $slug = $original . '-' . $i++;
        }
        return $slug;
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề không được để trống.'); return; }
        if (empty($b['author_name'])) { Response::error('Tên tác giả không được để trống.'); return; }

        $id = $this->db->execute(
            "INSERT INTO forum_threads (category_id, title, slug, content, author_name, author_email, author_avatar, reply_count, is_pinned, is_hot, status, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $b['category_id'] ? (int)$b['category_id'] : null,
                $b['title'],
                $this->uniqueSlug($b['title']),
                $b['content'] ?? '',
                $b['author_name'],
                $b['author_email'] ?? '',
                $b['author_avatar'] ?? '',
                (int)($b['reply_count'] ?? 0),
                (int)($b['is_pinned'] ?? 0),
                (int)($b['is_hot'] ?? 0),
                $b['status'] ?? 'published',
                (int)($b['sort_order'] ?? 0),
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE forum_threads SET category_id=?, title=?, slug=?, content=?, author_name=?, author_email=?, author_avatar=?, reply_count=?, is_pinned=?, is_hot=?, status=?, sort_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
            [
                $b['category_id'] ? (int)$b['category_id'] : null,
                $b['title'],
                $this->uniqueSlug($b['title'], (int)$p['id']),
                $b['content'] ?? '',
                $b['author_name'],
                $b['author_email'] ?? '',
                $b['author_avatar'] ?? '',
                (int)($b['reply_count'] ?? 0),
                (int)($b['is_pinned'] ?? 0),
                (int)($b['is_hot'] ?? 0),
                $b['status'] ?? 'published',
                (int)($b['sort_order'] ?? 0),
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM forum_threads WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
