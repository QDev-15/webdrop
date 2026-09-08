<?php
declare(strict_types=1);

class PostController {
    // Whitelist field — không dùng bodyJson() trực tiếp vào INSERT/UPDATE
    private const FIELDS = [
        'category_id', 'title', 'excerpt', 'content', 'thumbnail',
        'author_name', 'author_avatar', 'author_role', 'author_bio', 'tags',
        'featured', 'read_time', 'review_score', 'review_score_label', 'review_category',
        'status', 'meta_title', 'meta_description',
    ];

    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $page    = max(1, (int)($_GET['page'] ?? 1));
        $perPage = min(100, max(1, (int)($_GET['per_page'] ?? 20)));
        $offset  = ($page - 1) * $perPage;
        $search  = trim((string)($_GET['q'] ?? ''));
        $category = trim((string)($_GET['category_id'] ?? ''));

        $where  = [];
        $params = [];
        if ($search !== '') {
            $search = substr($search, 0, 100);
            $where[] = "(po.title LIKE ? OR po.excerpt LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }
        if ($category !== '') {
            $where[] = "po.category_id = ?";
            $params[] = (int)$category;
        }
        $whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

        $total = (int)$this->db->scalar("SELECT COUNT(*) FROM posts po $whereSql", $params);
        $rows = $this->db->query(
            "SELECT po.*, c.name AS category_name
             FROM posts po LEFT JOIN post_categories c ON c.id = po.category_id
             $whereSql
             ORDER BY po.created_at DESC
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
        if (!$title) { Response::error('Tiêu đề không được để trống.'); return; }
        $slug = !empty($b['slug']) ? slugify($b['slug']) : slugify($title);
        $user = Auth::user();

        $data = $this->extract($b);
        $cols = array_keys($data);
        $placeholders = implode(',', array_fill(0, count($cols), '?'));
        $id = $this->db->execute(
            "INSERT INTO posts (title, slug, " . implode(',', $cols) . ", created_by)
             VALUES (?, ?, $placeholders, ?)",
            [$title, $slug, ...array_values($data), $user['id']]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $title = trim($b['title'] ?? '');
        if (!$title) { Response::error('Tiêu đề không được để trống.'); return; }
        $slug = !empty($b['slug']) ? slugify($b['slug']) : slugify($title);

        $data = $this->extract($b);
        $setSql = implode(', ', array_map(fn($c) => "$c = ?", array_keys($data)));
        $this->db->execute(
            "UPDATE posts SET title = ?, slug = ?, $setSql, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            [$title, $slug, ...array_values($data), $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM posts WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }

    /** Whitelist + type-cast field từ body — dùng chung cho store()/update() */
    private function extract(array $b): array {
        $out = [];
        foreach (self::FIELDS as $f) {
            if (!array_key_exists($f, $b)) continue;
            $v = $b[$f];
            switch ($f) {
                case 'category_id':
                    $out[$f] = $v !== '' && $v !== null ? (int)$v : null;
                    break;
                case 'featured':
                    $out[$f] = $v ? 1 : 0;
                    break;
                case 'read_time':
                    $out[$f] = (int)($v ?: 5);
                    break;
                case 'review_score':
                    $out[$f] = ($v === '' || $v === null) ? null : (float)$v;
                    break;
                case 'status':
                    $out[$f] = in_array($v, ['draft', 'published'], true) ? $v : 'draft';
                    break;
                default:
                    $out[$f] = (string)$v;
            }
        }
        // Đảm bảo các field bắt buộc luôn có mặt (INSERT cần đủ cột theo cùng thứ tự)
        foreach (self::FIELDS as $f) {
            if (!array_key_exists($f, $out)) {
                $out[$f] = match ($f) {
                    'category_id', 'review_score' => null,
                    'featured' => 0,
                    'read_time' => 5,
                    'status' => 'draft',
                    default => '',
                };
            }
        }
        return $out;
    }
}
