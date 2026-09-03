<?php
declare(strict_types=1);

// Admin: CRUD "Bộ sưu tập" (trang bo-suu-tap.html) — 4 phong cách nội thất.
class CollectionController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT c.*, COUNT(p.id) as product_count
             FROM collections c
             LEFT JOIN products p ON p.collection_id = c.id
             GROUP BY c.id
             ORDER BY c.sort_order ASC, c.created_at DESC"
        );
        Response::json($rows);
    }

    public function show(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM collections WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy bộ sưu tập', 404); return; }
        Response::json($row);
    }

    public function store(): void {
        Auth::require();
        $data       = bodyJson();
        $name       = trim($data['name'] ?? '');
        $description = trim($data['description'] ?? '');
        $image      = trim($data['image'] ?? '');
        $sortOrder  = (int)($data['sort_order'] ?? 0);

        if (!$name) { Response::error('Tên bộ sưu tập không được để trống', 422); return; }

        $slug = slugify($name);
        $base = $slug;
        $i    = 1;
        while ($this->db->queryOne("SELECT id FROM collections WHERE slug = ?", [$slug])) {
            $slug = $base . '-' . $i++;
        }

        $id = $this->db->execute(
            "INSERT INTO collections (name, slug, description, image, sort_order) VALUES (?, ?, ?, ?, ?)",
            [$name, $slug, $description, $image, $sortOrder]
        );
        $row = $this->db->queryOne("SELECT * FROM collections WHERE id = ?", [$id]);
        Response::json($row, 201);
    }

    public function update(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM collections WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy bộ sưu tập', 404); return; }

        $data        = bodyJson();
        $name        = trim($data['name'] ?? $row['name']);
        $description = trim($data['description'] ?? $row['description']);
        $image       = trim($data['image'] ?? $row['image']);
        $sortOrder   = (int)($data['sort_order'] ?? $row['sort_order']);

        $this->db->execute(
            "UPDATE collections SET name = ?, description = ?, image = ?, sort_order = ? WHERE id = ?",
            [$name, $description, $image, $sortOrder, $id]
        );
        $row = $this->db->queryOne("SELECT * FROM collections WHERE id = ?", [$id]);
        Response::json($row);
    }

    public function destroy(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT id FROM collections WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy bộ sưu tập', 404); return; }
        $this->db->execute("UPDATE products SET collection_id = NULL WHERE collection_id = ?", [$id]);
        $this->db->execute("DELETE FROM collections WHERE id = ?", [$id]);
        Response::json(['message' => 'Đã xóa bộ sưu tập']);
    }
}
