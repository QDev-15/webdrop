<?php
declare(strict_types=1);

class PostController {
    // Whitelist field cho phép ghi — không dùng bodyJson() trực tiếp vào INSERT/UPDATE.
    private const FIELDS = [
        'category_id', 'title', 'slug', 'excerpt', 'content', 'thumbnail',
        'author_name', 'author_avatar', 'author_role', 'author_bio', 'tags',
        'read_time', 'home_section', 'home_order', 'trending_order',
        'status', 'published_at',
    ];

    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $page    = max(1, (int)($_GET['page'] ?? 1));
        $perPage = 20;
        $search  = trim(substr((string)($_GET['q'] ?? ''), 0, 100));

        $where  = '';
        $params = [];
        if ($search !== '') {
            $where = "WHERE (p.title LIKE ? OR p.excerpt LIKE ?)";
            $like  = '%' . $search . '%';
            $params = [$like, $like];
        }

        $total = (int)$this->db->scalar("SELECT COUNT(*) FROM posts p $where", $params);
        $offset = ($page - 1) * $perPage;
        $rows = $this->db->query(
            "SELECT p.*, c.name AS category_name, c.slug AS category_slug
             FROM posts p LEFT JOIN post_categories c ON c.id = p.category_id
             $where
             ORDER BY p.published_at DESC, p.id DESC
             LIMIT $perPage OFFSET $offset",
            $params
        );
        header('X-Total-Count: ' . $total);
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM posts WHERE id = ?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề là bắt buộc.'); return; }
        $slug = trim($b['slug'] ?? '') ?: slugify($b['title']);
        $existing = $this->db->queryOne("SELECT id FROM posts WHERE slug = ?", [$slug]);
        if ($existing) { Response::error('Slug đã tồn tại, vui lòng chọn slug khác.', 409); return; }

        $data = $this->extract($b);
        $data['slug'] = $slug;

        $cols = array_keys($data);
        $placeholders = implode(',', array_fill(0, count($cols), '?'));
        $id = $this->db->execute(
            "INSERT INTO posts (" . implode(',', $cols) . ") VALUES ($placeholders)",
            array_values($data)
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề là bắt buộc.'); return; }
        $slug = trim($b['slug'] ?? '') ?: slugify($b['title']);
        $existing = $this->db->queryOne("SELECT id FROM posts WHERE slug = ? AND id != ?", [$slug, $p['id']]);
        if ($existing) { Response::error('Slug đã tồn tại, vui lòng chọn slug khác.', 409); return; }

        $data = $this->extract($b);
        $data['slug'] = $slug;
        $data['updated_at'] = date('Y-m-d H:i:s');

        $setClause = implode(',', array_map(fn($c) => "$c=?", array_keys($data)));
        $this->db->execute(
            "UPDATE posts SET $setClause WHERE id=?",
            [...array_values($data), $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM posts WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }

    private function extract(array $b): array {
        $out = [];
        foreach (self::FIELDS as $f) {
            if ($f === 'slug') continue; // xử lý riêng
            if (!array_key_exists($f, $b)) continue;
            $out[$f] = match ($f) {
                'category_id', 'read_time', 'home_order', 'trending_order' => $b[$f] !== '' && $b[$f] !== null ? (int)$b[$f] : ($f === 'category_id' ? null : 0),
                default => (string)$b[$f],
            };
        }
        $out['title']        = $b['title'];
        $out['status']       = $out['status']       ?? 'published';
        $out['published_at'] = $out['published_at'] ?? date('Y-m-d H:i:s');
        $out['read_time']    = $out['read_time']    ?? 5;
        return $out;
    }
}
