<?php
class PageController {
    public function __construct(private Database $db) {}

    public function index(array $params): void {
        Auth::require();
        Response::ok($this->db->query("SELECT * FROM pages ORDER BY created_at DESC"));
    }

    public function show(array $params): void {
        Auth::require();
        $page = $this->db->queryOne("SELECT * FROM pages WHERE id = ?", [$params['id']]);
        if (!$page) Response::notFound('Trang không tồn tại');
        Response::ok($page);
    }

    public function store(array $params): void {
        Auth::require();
        $body  = bodyJson();
        $title = trim($body['title'] ?? '');
        if (!$title) Response::error('Tiêu đề không được để trống');

        $slug   = $body['slug'] ?? slugify($title);
        $exists = $this->db->scalar("SELECT COUNT(*) FROM pages WHERE slug = ?", [$slug]);
        if ($exists) $slug .= '-' . time();

        $id = $this->db->execute(
            "INSERT INTO pages (title, slug, content, template, meta_title, meta_description, status, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $title, $slug,
                sanitizeHtml($body['content'] ?? ''),
                $body['template'] ?? '',
                $body['meta_title'] ?? '',
                $body['meta_description'] ?? '',
                $body['status'] ?? 'draft',
                Auth::id(),
            ]
        );
        Response::created($this->db->queryOne("SELECT * FROM pages WHERE id = ?", [$id]));
    }

    public function update(array $params): void {
        Auth::require();
        $page = $this->db->queryOne("SELECT * FROM pages WHERE id = ?", [$params['id']]);
        if (!$page) Response::notFound('Trang không tồn tại');

        $body  = bodyJson();
        $title = trim($body['title'] ?? $page['title']);
        $slug  = $body['slug'] ?? $page['slug'];

        $conflict = $this->db->scalar(
            "SELECT COUNT(*) FROM pages WHERE slug = ? AND id != ?", [$slug, $params['id']]
        );
        if ($conflict) $slug .= '-' . time();

        $this->db->execute(
            "UPDATE pages SET title=?, slug=?, content=?, template=?, meta_title=?,
                meta_description=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
            [
                $title, $slug,
                sanitizeHtml($body['content'] ?? $page['content']),
                $body['template'] ?? $page['template'],
                $body['meta_title'] ?? $page['meta_title'],
                $body['meta_description'] ?? $page['meta_description'],
                $body['status'] ?? $page['status'],
                $params['id'],
            ]
        );
        Response::ok($this->db->queryOne("SELECT * FROM pages WHERE id = ?", [$params['id']]));
    }

    public function destroy(array $params): void {
        Auth::require();
        if (!$this->db->queryOne("SELECT id FROM pages WHERE id = ?", [$params['id']])) {
            Response::notFound('Trang không tồn tại');
        }
        $this->db->execute("DELETE FROM pages WHERE id = ?", [$params['id']]);
        Response::ok();
    }
}
