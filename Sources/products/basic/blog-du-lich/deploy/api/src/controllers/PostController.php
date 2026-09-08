<?php
declare(strict_types=1);

class PostController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $q = trim($_GET['q'] ?? '');
        $where = '';
        $params = [];
        if ($q !== '') {
            $where = " WHERE p.title LIKE ? OR p.excerpt LIKE ?";
            $like = '%' . substr($q, 0, 100) . '%';
            $params = [$like, $like];
        }
        $items = $this->db->query(
            "SELECT p.*, c.name AS category_name FROM posts p
             LEFT JOIN post_categories c ON c.id = p.category_id" . $where . "
             ORDER BY p.published_date DESC, p.id DESC",
            $params
        );
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM posts WHERE id=?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    private const FIELDS = [
        'category_id', 'title', 'slug', 'thumbnail', 'excerpt', 'content',
        'tags', 'gallery_images', 'read_time', 'published_date', 'updated_date',
        'featured', 'sort_order', 'status',
    ];

    private function extract(array $b): array {
        $out = [];
        foreach (self::FIELDS as $f) {
            $v = $b[$f] ?? null;
            if ($f === 'category_id') { $out[$f] = $v !== null && $v !== '' ? (int)$v : null; continue; }
            if (in_array($f, ['read_time', 'sort_order'], true)) { $out[$f] = (int)($v ?? 0); continue; }
            if ($f === 'featured') { $out[$f] = (int)($v ?? 0); continue; }
            if ($f === 'status') { $out[$f] = $v ?: 'published'; continue; }
            $out[$f] = (string)($v ?? '');
        }
        return $out;
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề không được để trống.'); return; }
        $slug = !empty($b['slug']) ? slugify($b['slug']) : slugify($b['title']);
        $d = $this->extract($b);
        $id = $this->db->execute(
            "INSERT INTO posts (category_id, title, slug, thumbnail, excerpt, content, tags, gallery_images, read_time, published_date, updated_date, featured, sort_order, status)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [$d['category_id'], $b['title'], $slug, $d['thumbnail'], $d['excerpt'], $d['content'], $d['tags'],
             $d['gallery_images'], $d['read_time'], $d['published_date'], $d['updated_date'], $d['featured'], $d['sort_order'], $d['status']]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề không được để trống.'); return; }
        $slug = !empty($b['slug']) ? slugify($b['slug']) : slugify($b['title']);
        $d = $this->extract($b);
        $this->db->execute(
            "UPDATE posts SET category_id=?, title=?, slug=?, thumbnail=?, excerpt=?, content=?, tags=?, gallery_images=?, read_time=?, published_date=?, updated_date=?, featured=?, sort_order=?, status=? WHERE id=?",
            [$d['category_id'], $b['title'], $slug, $d['thumbnail'], $d['excerpt'], $d['content'], $d['tags'],
             $d['gallery_images'], $d['read_time'], $d['published_date'], $d['updated_date'], $d['featured'], $d['sort_order'], $d['status'], $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM posts WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
