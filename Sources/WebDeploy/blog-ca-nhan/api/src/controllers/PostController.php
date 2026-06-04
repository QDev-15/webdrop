<?php
declare(strict_types=1);

class PostController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $page     = max(1, (int)($_GET['page'] ?? 1));
        $limit    = min((int)($_GET['limit'] ?? 20), 100);
        $offset   = ($page - 1) * $limit;
        $status   = $_GET['status'] ?? '';
        $category = $_GET['category'] ?? '';
        $search   = $_GET['search'] ?? '';

        $where  = [];
        $params = [];
        if ($status) { $where[] = "po.status = ?"; $params[] = $status; }
        if ($category) { $where[] = "po.category_id = ?"; $params[] = $category; }
        if ($search) {
            $where[] = "(po.title LIKE ? OR po.excerpt LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }
        $whereStr = $where ? "WHERE " . implode(' AND ', $where) : '';

        $total = $this->db->scalar(
            "SELECT COUNT(*) FROM posts po $whereStr",
            $params
        );

        $posts = $this->db->query(
            "SELECT po.id, po.title, po.slug, po.excerpt, po.thumbnail,
                    po.status, po.featured, po.read_time, po.views, po.created_at, po.updated_at,
                    c.name as category_name
             FROM posts po
             LEFT JOIN post_categories c ON c.id = po.category_id
             $whereStr
             ORDER BY po.created_at DESC
             LIMIT ? OFFSET ?",
            array_merge($params, [$limit, $offset])
        );

        Response::json([
            'data'       => $posts,
            'total'      => (int)$total,
            'page'       => $page,
            'limit'      => $limit,
            'totalPages' => (int)ceil($total / $limit),
        ]);
    }

    public function show(array $p): void {
        Auth::require();
        $post = $this->db->queryOne(
            "SELECT po.*, c.name as category_name
             FROM posts po
             LEFT JOIN post_categories c ON c.id = po.category_id
             WHERE po.id = ?",
            [$p['id']]
        );
        if (!$post) { Response::error('Không tìm thấy.', 404); return; }
        // Fetch tags
        $tags = $this->db->query(
            "SELECT t.id, t.name, t.slug FROM tags t
             JOIN post_tags pt ON pt.tag_id = t.id
             WHERE pt.post_id = ?",
            [$post['id']]
        );
        $post['tags'] = $tags;
        Response::json($post);
    }

    public function store(array $p): void {
        Auth::require();
        $b     = bodyJson();
        $title = trim($b['title'] ?? '');
        if (!$title) { Response::error('Tiêu đề không được để trống.'); return; }
        $slug  = trim($b['slug'] ?? '') ?: slugify($title);
        $user  = Auth::user();
        $id = $this->db->execute(
            "INSERT INTO posts (category_id, title, slug, excerpt, content, thumbnail,
                                status, featured, read_time, meta_title, meta_description, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $b['category_id'] ?? null,
                $title, $slug,
                $b['excerpt'] ?? '',
                $b['content'] ?? '',
                $b['thumbnail'] ?? '',
                $b['status'] ?? 'draft',
                $b['featured'] ? 1 : 0,
                (int)($b['read_time'] ?? 5),
                $b['meta_title'] ?? '',
                $b['meta_description'] ?? '',
                $user['id'],
            ]
        );
        // Save tags
        if (!empty($b['tags']) && is_array($b['tags'])) {
            $this->saveTags($id, $b['tags']);
        }
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b     = bodyJson();
        $title = trim($b['title'] ?? '');
        if (!$title) { Response::error('Tiêu đề không được để trống.'); return; }
        $slug  = trim($b['slug'] ?? '') ?: slugify($title);
        $this->db->execute(
            "UPDATE posts SET
               category_id = ?, title = ?, slug = ?, excerpt = ?, content = ?,
               thumbnail = ?, status = ?, featured = ?, read_time = ?,
               meta_title = ?, meta_description = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?",
            [
                $b['category_id'] ?? null,
                $title, $slug,
                $b['excerpt'] ?? '',
                $b['content'] ?? '',
                $b['thumbnail'] ?? '',
                $b['status'] ?? 'draft',
                $b['featured'] ? 1 : 0,
                (int)($b['read_time'] ?? 5),
                $b['meta_title'] ?? '',
                $b['meta_description'] ?? '',
                $p['id'],
            ]
        );
        // Update tags
        $this->db->execute("DELETE FROM post_tags WHERE post_id = ?", [$p['id']]);
        if (!empty($b['tags']) && is_array($b['tags'])) {
            $this->saveTags((int)$p['id'], $b['tags']);
        }
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM post_tags WHERE post_id = ?", [$p['id']]);
        $this->db->execute("DELETE FROM posts WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }

    private function saveTags(int $postId, array $tagIds): void {
        foreach ($tagIds as $tagId) {
            $tagId = (int)$tagId;
            if ($tagId > 0) {
                try {
                    $this->db->execute(
                        "INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)",
                        [$postId, $tagId]
                    );
                } catch (\Exception $e) {
                    // ignore duplicate
                }
            }
        }
    }
}
