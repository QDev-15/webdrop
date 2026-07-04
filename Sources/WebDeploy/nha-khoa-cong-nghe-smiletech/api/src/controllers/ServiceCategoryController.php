<?php
declare(strict_types=1);

class ServiceCategoryController
{
    public function __construct(private Database $db) {}

    public function index(): void
    {
        Auth::require();
        $rows = $this->db->query(
            "SELECT sc.*, (SELECT COUNT(*) FROM services WHERE category_id = sc.id) AS service_count
             FROM service_categories sc ORDER BY sc.sort_order ASC"
        );
        Response::json($rows);
    }

    public function store(): void
    {
        Auth::require();
        $body = bodyJson();
        $name = trim($body['name'] ?? '');
        if (!$name) { Response::error('Ten danh muc khong duoc de trong.', 422); return; }

        $slug = slugify($name);
        // ensure unique slug
        $existing = $this->db->queryOne("SELECT id FROM service_categories WHERE slug = ?", [$slug]);
        if ($existing) { $slug .= '-' . time(); }

        $sortOrder = (int)($body['sort_order'] ?? 0);
        $this->db->execute(
            "INSERT INTO service_categories (name, slug, sort_order) VALUES (?, ?, ?)",
            [$name, $slug, $sortOrder]
        );
        $id = $this->db->lastInsertId();
        $row = $this->db->queryOne("SELECT * FROM service_categories WHERE id = ?", [$id]);
        Response::json($row, 201);
    }

    public function update(int $id): void
    {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM service_categories WHERE id = ?", [$id]);
        if (!$row) { Response::error('Khong tim thay danh muc.', 404); return; }

        $body      = bodyJson();
        $name      = trim($body['name'] ?? $row['name']);
        $sortOrder = isset($body['sort_order']) ? (int)$body['sort_order'] : (int)$row['sort_order'];

        $this->db->execute(
            "UPDATE service_categories SET name = ?, sort_order = ? WHERE id = ?",
            [$name, $sortOrder, $id]
        );
        $updated = $this->db->queryOne("SELECT * FROM service_categories WHERE id = ?", [$id]);
        Response::json($updated);
    }

    public function destroy(int $id): void
    {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM service_categories WHERE id = ?", [$id]);
        if (!$row) { Response::error('Khong tim thay danh muc.', 404); return; }
        $this->db->execute("DELETE FROM service_categories WHERE id = ?", [$id]);
        Response::json(['message' => 'Da xoa danh muc.']);
    }
}
