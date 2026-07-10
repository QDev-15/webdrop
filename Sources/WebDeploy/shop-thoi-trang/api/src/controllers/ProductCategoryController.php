<?php
declare(strict_types=1);

class ProductCategoryController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT pc.*, COUNT(p.id) as product_count
             FROM product_categories pc
             LEFT JOIN products p ON p.category_id = pc.id
             GROUP BY pc.id
             ORDER BY pc.sort_order ASC, pc.created_at DESC"
        );
        Response::json($rows);
    }

    public function show(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM product_categories WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy danh mục', 404); return; }
        Response::json($row);
    }

    public function store(): void {
        Auth::require();
        $data       = bodyJson();
        $name       = trim($data['name'] ?? '');
        $image      = trim($data['image'] ?? '');
        $sort_order = (int)($data['sort_order'] ?? 0);

        if (!$name) { Response::error('Tên danh mục không được để trống', 422); return; }

        $slug = slugify($name);
        $base = $slug;
        $i    = 1;
        while ($this->db->queryOne("SELECT id FROM product_categories WHERE slug = ?", [$slug])) {
            $slug = $base . '-' . $i++;
        }

        $id = $this->db->execute(
            "INSERT INTO product_categories (name, slug, image, sort_order) VALUES (?, ?, ?, ?)",
            [$name, $slug, $image, $sort_order]
        );
        $row = $this->db->queryOne("SELECT * FROM product_categories WHERE id = ?", [$id]);
        Response::json($row, 201);
    }

    public function update(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM product_categories WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy danh mục', 404); return; }

        $data       = bodyJson();
        $name       = trim($data['name'] ?? $row['name']);
        $image      = trim($data['image'] ?? $row['image']);
        $sort_order = (int)($data['sort_order'] ?? $row['sort_order']);

        $this->db->execute(
            "UPDATE product_categories SET name = ?, image = ?, sort_order = ? WHERE id = ?",
            [$name, $image, $sort_order, $id]
        );
        $row = $this->db->queryOne("SELECT * FROM product_categories WHERE id = ?", [$id]);
        Response::json($row);
    }

    public function destroy(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT id FROM product_categories WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy danh mục', 404); return; }
        $this->db->execute("UPDATE products SET category_id = NULL WHERE category_id = ?", [$id]);
        $this->db->execute("DELETE FROM product_categories WHERE id = ?", [$id]);
        Response::json(['message' => 'Đã xóa danh mục']);
    }
}
