<?php
class CategoryController {
    public function __construct(private Database $db) {}

    public function index(array $params): void {
        Auth::require();
        $cats = $this->db->query(
            "SELECT c.*, p.name AS parent_name,
                (SELECT COUNT(*) FROM posts WHERE category_id = c.id) AS post_count
             FROM categories c
             LEFT JOIN categories p ON c.parent_id = p.id
             ORDER BY c.name"
        );
        Response::ok($cats);
    }

    public function show(array $params): void {
        Auth::require();
        $cat = $this->db->queryOne("SELECT * FROM categories WHERE id = ?", [$params['id']]);
        if (!$cat) Response::notFound('Danh mục không tồn tại');
        Response::ok($cat);
    }

    public function store(array $params): void {
        Auth::require();
        $body = bodyJson();
        $name = trim($body['name'] ?? '');
        if (!$name) Response::error('Tên danh mục không được để trống');

        $slug   = $body['slug'] ?? slugify($name);
        $exists = $this->db->scalar("SELECT COUNT(*) FROM categories WHERE slug = ?", [$slug]);
        if ($exists) $slug .= '-' . time();

        $id = $this->db->execute(
            "INSERT INTO categories (name, slug, description, thumbnail, parent_id) VALUES (?, ?, ?, ?, ?)",
            [
                $name, $slug,
                $body['description'] ?? '',
                $body['thumbnail'] ?? '',
                $body['parent_id'] ?? null,
            ]
        );
        Response::created($this->db->queryOne("SELECT * FROM categories WHERE id = ?", [$id]));
    }

    public function update(array $params): void {
        Auth::require();
        $cat = $this->db->queryOne("SELECT * FROM categories WHERE id = ?", [$params['id']]);
        if (!$cat) Response::notFound('Danh mục không tồn tại');

        $body = bodyJson();
        $name = trim($body['name'] ?? $cat['name']);
        $slug = $body['slug'] ?? $cat['slug'];

        $conflict = $this->db->scalar(
            "SELECT COUNT(*) FROM categories WHERE slug = ? AND id != ?", [$slug, $params['id']]
        );
        if ($conflict) $slug .= '-' . time();

        $this->db->execute(
            "UPDATE categories SET name=?, slug=?, description=?, thumbnail=?, parent_id=? WHERE id=?",
            [
                $name, $slug,
                $body['description'] ?? $cat['description'],
                $body['thumbnail'] ?? $cat['thumbnail'],
                $body['parent_id'] ?? $cat['parent_id'],
                $params['id'],
            ]
        );
        Response::ok($this->db->queryOne("SELECT * FROM categories WHERE id = ?", [$params['id']]));
    }

    public function destroy(array $params): void {
        Auth::require();
        if (!$this->db->queryOne("SELECT id FROM categories WHERE id = ?", [$params['id']])) {
            Response::notFound('Danh mục không tồn tại');
        }
        // Bỏ liên kết posts về danh mục này
        $this->db->execute("UPDATE posts SET category_id = NULL WHERE category_id = ?", [$params['id']]);
        $this->db->execute("DELETE FROM categories WHERE id = ?", [$params['id']]);
        Response::ok();
    }
}
