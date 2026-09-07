<?php
declare(strict_types=1);

class PostController {
    // Whitelist field — không insert/update trực tiếp từ bodyJson() (rule bảo mật)
    // 'title' và 'slug' xử lý riêng (validate + auto-slug) — không nằm trong danh sách này
    private const FIELDS = [
        'excerpt', 'content', 'thumbnail', 'category_slug',
        'author_name', 'author_avatar', 'author_role', 'read_time', 'tags',
        'featured', 'popular', 'saved', 'status', 'published_at',
    ];

    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $page    = max(1, (int)($_GET['page'] ?? 1));
        $perPage = 20;
        $offset  = ($page - 1) * $perPage;
        $search  = substr(trim($_GET['q'] ?? ''), 0, 100);

        $where  = '';
        $params = [];
        if ($search !== '') {
            $where = "WHERE (p.title LIKE ? OR p.excerpt LIKE ?)";
            $like = '%' . $search . '%';
            $params = [$like, $like];
        }

        $total = (int)$this->db->scalar("SELECT COUNT(*) FROM posts p $where", $params);
        $rows = $this->db->query(
            "SELECT p.*, c.name AS category_name FROM posts p
             LEFT JOIN categories c ON c.slug = p.category_slug
             $where
             ORDER BY p.published_at DESC, p.id DESC
             LIMIT ? OFFSET ?",
            [...$params, $perPage, $offset]
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
        $title = trim($b['title'] ?? '');
        if (!$title) { Response::error('Tiêu đề là bắt buộc.'); return; }

        $slug = trim($b['slug'] ?? '') ?: slugify($title);
        $exists = $this->db->queryOne("SELECT id FROM posts WHERE slug = ?", [$slug]);
        if ($exists) { $slug .= '-' . substr(uniqid(), -5); }

        $data = $this->extract($b);
        $cols = array_merge(['title', 'slug'], self::FIELDS);
        $vals = array_merge([$title, $slug], array_values($data));
        $placeholders = implode(',', array_fill(0, count($cols), '?'));
        $id = $this->db->execute(
            "INSERT INTO posts (" . implode(',', $cols) . ") VALUES ($placeholders)",
            $vals
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $title = trim($b['title'] ?? '');
        if (!$title) { Response::error('Tiêu đề là bắt buộc.'); return; }

        $slug = trim($b['slug'] ?? '') ?: slugify($title);
        $exists = $this->db->queryOne("SELECT id FROM posts WHERE slug = ? AND id != ?", [$slug, $p['id']]);
        if ($exists) { $slug .= '-' . substr(uniqid(), -5); }

        $data = $this->extract($b);
        $set  = array_map(fn($c) => "$c=?", array_merge(['title', 'slug'], self::FIELDS));
        $vals = array_merge([$title, $slug], array_values($data), [$p['id']]);
        $this->db->execute(
            "UPDATE posts SET " . implode(',', $set) . " WHERE id = ?",
            $vals
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM posts WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }

    private function extract(array $b): array {
        return [
            'excerpt'       => trim($b['excerpt'] ?? ''),
            'content'       => $b['content'] ?? '',
            'thumbnail'     => trim($b['thumbnail'] ?? ''),
            'category_slug' => trim($b['category_slug'] ?? ''),
            'author_name'   => trim($b['author_name'] ?? '') ?: 'Hạ Vy',
            'author_avatar' => trim($b['author_avatar'] ?? ''),
            'author_role'   => trim($b['author_role'] ?? '') ?: 'Mẹ của Kem & Sữa',
            'read_time'     => (int)($b['read_time'] ?? 5),
            'tags'          => trim($b['tags'] ?? ''),
            'featured'      => !empty($b['featured']) ? 1 : 0,
            'popular'       => !empty($b['popular']) ? 1 : 0,
            'saved'         => !empty($b['saved']) ? 1 : 0,
            'status'        => in_array($b['status'] ?? '', ['published', 'draft'], true) ? $b['status'] : 'published',
            'published_at'  => trim($b['published_at'] ?? '') ?: date('Y-m-d H:i:s'),
        ];
    }
}
