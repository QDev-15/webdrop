<?php
declare(strict_types=1);

class PostController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $type   = $_GET['type'] ?? '';
        $search = trim(substr((string)($_GET['q'] ?? ''), 0, 100));

        $where  = [];
        $params = [];
        if ($type === 'article' || $type === 'recipe') { $where[] = "po.type = ?"; $params[] = $type; }
        if ($search) {
            $where[] = "(po.title LIKE ? OR po.excerpt LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }
        $whereStr = $where ? 'WHERE ' . implode(' AND ', $where) : '';

        $posts = $this->db->query(
            "SELECT po.id, po.title, po.slug, po.type, po.image, po.status, po.featured,
                    po.read_minutes, po.views, po.saved_count, po.published_at,
                    c.name as category_name
             FROM posts po
             LEFT JOIN post_categories c ON c.id = po.category_id
             $whereStr
             ORDER BY po.published_at DESC",
            $params
        );
        Response::json($posts);
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
        Response::json($post);
    }

    private function fields(array $b): array {
        $type = ($b['type'] ?? 'article') === 'recipe' ? 'recipe' : 'article';
        return [
            'category_id'  => $b['category_id'] !== '' && $b['category_id'] !== null ? (int)$b['category_id'] : null,
            'type'         => $type,
            'excerpt'      => (string)($b['excerpt'] ?? ''),
            'content'      => (string)($b['content'] ?? ''),
            'pullquote'    => (string)($b['pullquote'] ?? ''),
            'image'        => (string)($b['image'] ?? ''),
            'author_name'  => (string)($b['author_name'] ?? ''),
            'author_avatar'=> (string)($b['author_avatar'] ?? ''),
            'author_bio'   => (string)($b['author_bio'] ?? ''),
            'read_minutes' => max(1, (int)($b['read_minutes'] ?? 5)),
            'tags'         => (string)($b['tags'] ?? ''),
            'featured'     => !empty($b['featured']) ? 1 : 0,
            'status'       => ($b['status'] ?? 'published') === 'draft' ? 'draft' : 'published',
            'difficulty'   => (string)($b['difficulty'] ?? ''),
            'prep_time'    => (string)($b['prep_time'] ?? ''),
            'cook_time'    => (string)($b['cook_time'] ?? ''),
            'servings'     => (string)($b['servings'] ?? ''),
            'saved_count'  => max(0, (int)($b['saved_count'] ?? 0)),
            'ingredients'  => (string)($b['ingredients'] ?? ''),
            'steps'        => (string)($b['steps'] ?? ''),
            'tip'          => (string)($b['tip'] ?? ''),
        ];
    }

    public function store(array $p): void {
        Auth::require();
        $b     = bodyJson();
        $title = trim($b['title'] ?? '');
        if (!$title) { Response::error('Tiêu đề không được để trống.'); return; }
        $slug = trim($b['slug'] ?? '') ?: slugify($title);
        $f    = $this->fields($b);
        $publishedAt = trim($b['published_at'] ?? '') ?: date('Y-m-d H:i:s');

        $id = $this->db->execute(
            "INSERT INTO posts (category_id, type, title, slug, excerpt, content, pullquote, image,
                author_name, author_avatar, author_bio, read_minutes, tags, featured, status,
                difficulty, prep_time, cook_time, servings, saved_count, ingredients, steps, tip, published_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $f['category_id'], $f['type'], $title, $slug, $f['excerpt'], $f['content'], $f['pullquote'], $f['image'],
                $f['author_name'], $f['author_avatar'], $f['author_bio'], $f['read_minutes'], $f['tags'], $f['featured'], $f['status'],
                $f['difficulty'], $f['prep_time'], $f['cook_time'], $f['servings'], $f['saved_count'], $f['ingredients'], $f['steps'], $f['tip'], $publishedAt,
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b     = bodyJson();
        $title = trim($b['title'] ?? '');
        if (!$title) { Response::error('Tiêu đề không được để trống.'); return; }
        $slug = trim($b['slug'] ?? '') ?: slugify($title);
        $f    = $this->fields($b);
        $publishedAt = trim($b['published_at'] ?? '') ?: date('Y-m-d H:i:s');

        $this->db->execute(
            "UPDATE posts SET
               category_id = ?, type = ?, title = ?, slug = ?, excerpt = ?, content = ?, pullquote = ?, image = ?,
               author_name = ?, author_avatar = ?, author_bio = ?, read_minutes = ?, tags = ?, featured = ?, status = ?,
               difficulty = ?, prep_time = ?, cook_time = ?, servings = ?, saved_count = ?, ingredients = ?, steps = ?, tip = ?,
               published_at = ?
             WHERE id = ?",
            [
                $f['category_id'], $f['type'], $title, $slug, $f['excerpt'], $f['content'], $f['pullquote'], $f['image'],
                $f['author_name'], $f['author_avatar'], $f['author_bio'], $f['read_minutes'], $f['tags'], $f['featured'], $f['status'],
                $f['difficulty'], $f['prep_time'], $f['cook_time'], $f['servings'], $f['saved_count'], $f['ingredients'], $f['steps'], $f['tip'],
                $publishedAt, $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM posts WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
