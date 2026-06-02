<?php
class PostController {
    public function __construct(private Database $db) {}

    public function index(array $params): void {
        Auth::require();
        $posts = $this->db->query(
            "SELECT p.*, c.name AS category_name
             FROM posts p
             LEFT JOIN categories c ON p.category_id = c.id
             ORDER BY p.created_at DESC"
        );
        Response::ok($posts);
    }

    public function show(array $params): void {
        Auth::require();
        $post = $this->db->queryOne("SELECT * FROM posts WHERE id = ?", [$params['id']]);
        if (!$post) Response::notFound('Bài viết không tồn tại');
        Response::ok($post);
    }

    public function store(array $params): void {
        Auth::require();
        $body = bodyJson();
        $title = trim($body['title'] ?? '');
        if (!$title) Response::error('Tiêu đề không được để trống');

        $slug = $body['slug'] ?? slugify($title);
        // Đảm bảo slug unique
        $exists = $this->db->scalar("SELECT COUNT(*) FROM posts WHERE slug = ?", [$slug]);
        if ($exists) $slug .= '-' . time();

        $id = $this->db->execute(
            "INSERT INTO posts (title, slug, content, excerpt, thumbnail, category_id,
                status, featured, meta_title, meta_description, created_by, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
            [
                $title,
                $slug,
                sanitizeHtml($body['content'] ?? ''),
                $body['excerpt'] ?? '',
                $body['thumbnail'] ?? '',
                $body['category_id'] ?? null,
                $body['status'] ?? 'draft',
                !empty($body['featured']) ? 1 : 0,
                $body['meta_title'] ?? '',
                $body['meta_description'] ?? '',
                Auth::id(),
            ]
        );
        $post = $this->db->queryOne("SELECT * FROM posts WHERE id = ?", [$id]);
        Response::created($post);
    }

    public function update(array $params): void {
        Auth::require();
        $post = $this->db->queryOne("SELECT * FROM posts WHERE id = ?", [$params['id']]);
        if (!$post) Response::notFound('Bài viết không tồn tại');

        $body  = bodyJson();
        $title = trim($body['title'] ?? $post['title']);
        $slug  = $body['slug'] ?? $post['slug'];

        // Kiểm tra slug trùng (trừ chính nó)
        $conflict = $this->db->scalar(
            "SELECT COUNT(*) FROM posts WHERE slug = ? AND id != ?", [$slug, $params['id']]
        );
        if ($conflict) $slug = $slug . '-' . time();

        $this->db->execute(
            "UPDATE posts SET title=?, slug=?, content=?, excerpt=?, thumbnail=?,
                category_id=?, status=?, featured=?, meta_title=?, meta_description=?,
                updated_at=CURRENT_TIMESTAMP
             WHERE id=?",
            [
                $title,
                $slug,
                sanitizeHtml($body['content'] ?? $post['content']),
                $body['excerpt'] ?? $post['excerpt'],
                $body['thumbnail'] ?? $post['thumbnail'],
                $body['category_id'] ?? $post['category_id'],
                $body['status'] ?? $post['status'],
                // Chỉ thay đổi featured nếu client gửi field — tránh reset về 0 khi update partial
                array_key_exists('featured', $body) ? (!empty($body['featured']) ? 1 : 0) : $post['featured'],
                $body['meta_title'] ?? $post['meta_title'],
                $body['meta_description'] ?? $post['meta_description'],
                $params['id'],
            ]
        );
        Response::ok($this->db->queryOne("SELECT * FROM posts WHERE id = ?", [$params['id']]));
    }

    public function destroy(array $params): void {
        Auth::require();
        $post = $this->db->queryOne("SELECT id FROM posts WHERE id = ?", [$params['id']]);
        if (!$post) Response::notFound('Bài viết không tồn tại');
        $this->db->execute("DELETE FROM posts WHERE id = ?", [$params['id']]);
        Response::ok();
    }
}
