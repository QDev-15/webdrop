<?php
declare(strict_types=1);

class PostController
{
    public function __construct(private Database $db) {}

    public function index(array $p): void
    {
        Auth::require();
        $posts = $this->db->query(
            "SELECT id, title, slug, excerpt, thumbnail, category, status, featured, created_at, updated_at
             FROM posts ORDER BY created_at DESC"
        );
        Response::json($posts);
    }

    public function show(array $p): void
    {
        Auth::require();
        $id = (int)$p['id'];
        $post = $this->db->row("SELECT * FROM posts WHERE id=?", [$id]);
        if (!$post) Response::notFound('Bài viết không tồn tại.');
        Response::json($post);
    }

    public function store(array $p): void
    {
        Auth::require();
        $b = bodyJson();

        if (empty($b['title'])) {
            Response::error('Tiêu đề bài viết không được để trống.');
        }

        $slug = $b['slug'] ?? slugify($b['title']);
        $user = Auth::user();

        $id = $this->db->execute(
            "INSERT INTO posts (title, slug, excerpt, content, thumbnail, category, status, featured,
                                meta_title, meta_description, created_by)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            [
                $b['title'],
                $slug,
                $b['excerpt']          ?? '',
                $b['content']          ?? '',
                $b['thumbnail']        ?? '',
                $b['category']         ?? '',
                $b['status']           ?? 'draft',
                (int)($b['featured']   ?? 0),
                $b['meta_title']       ?? '',
                $b['meta_description'] ?? '',
                $user['id'],
            ]
        );

        Response::json(['id' => (int)$id], 201);
    }

    public function update(array $p): void
    {
        Auth::require();
        $id = (int)$p['id'];
        $b  = bodyJson();

        if (empty($b['title'])) {
            Response::error('Tiêu đề bài viết không được để trống.');
        }

        $this->db->execute(
            "UPDATE posts SET
                title=?, excerpt=?, content=?, thumbnail=?, category=?,
                status=?, featured=?, meta_title=?, meta_description=?,
                updated_at=CURRENT_TIMESTAMP
             WHERE id=?",
            [
                $b['title'],
                $b['excerpt']          ?? '',
                $b['content']          ?? '',
                $b['thumbnail']        ?? '',
                $b['category']         ?? '',
                $b['status']           ?? 'draft',
                (int)($b['featured']   ?? 0),
                $b['meta_title']       ?? '',
                $b['meta_description'] ?? '',
                $id,
            ]
        );

        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void
    {
        Auth::require();
        $id = (int)$p['id'];
        $this->db->execute("DELETE FROM posts WHERE id=?", [$id]);
        Response::json(['ok' => true]);
    }
}
