<?php
declare(strict_types=1);

class ProductController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT p.*, pc.name as category_name
             FROM products p
             LEFT JOIN product_categories pc ON pc.id = p.category_id
             ORDER BY p.sort_order ASC, p.created_at DESC"
        );
        Response::json($rows);
    }

    public function show(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne(
            "SELECT p.*, pc.name as category_name FROM products p
             LEFT JOIN product_categories pc ON pc.id = p.category_id
             WHERE p.id = ?",
            [$id]
        );
        if (!$row) { Response::error('Không tìm thấy sản phẩm', 404); return; }
        Response::json($row);
    }

    public function store(): void {
        Auth::require();
        $data        = bodyJson();
        $name        = trim($data['name'] ?? '');
        $category_id = isset($data['category_id']) && $data['category_id'] ? (int)$data['category_id'] : null;
        $image       = trim($data['image'] ?? '');
        $price       = (int)($data['price'] ?? 0);
        $price_sale  = isset($data['price_sale']) && $data['price_sale'] !== '' ? (int)$data['price_sale'] : null;
        $badge       = trim($data['badge'] ?? '');
        $description = trim($data['description'] ?? '');
        $material    = trim($data['material'] ?? '');
        $colors      = trim($data['colors'] ?? '');
        $gallery     = trim($data['gallery'] ?? '');
        $rating      = isset($data['rating']) && $data['rating'] !== '' ? max(0, min(5, (float)$data['rating'])) : 5;
        $in_stock    = isset($data['in_stock']) ? (int)$data['in_stock'] : 1;
        $is_featured = (int)($data['is_featured'] ?? 0);
        $is_new      = (int)($data['is_new'] ?? 0);
        $status      = trim($data['status'] ?? 'published');
        $sort_order  = (int)($data['sort_order'] ?? 0);

        if (!$name) { Response::error('Tên sản phẩm không được để trống', 422); return; }

        $slug = slugify($name);
        $base = $slug;
        $i    = 1;
        while ($this->db->queryOne("SELECT id FROM products WHERE slug = ?", [$slug])) {
            $slug = $base . '-' . $i++;
        }

        $id = $this->db->execute(
            "INSERT INTO products (category_id, name, slug, image, price, price_sale, badge, description, material, colors, gallery, rating, in_stock, is_featured, is_new, status, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [$category_id, $name, $slug, $image, $price, $price_sale, $badge, $description, $material, $colors, $gallery, $rating, $in_stock ? 1 : 0, $is_featured ? 1 : 0, $is_new ? 1 : 0, $status, $sort_order]
        );
        $row = $this->db->queryOne("SELECT * FROM products WHERE id = ?", [$id]);
        Response::json($row, 201);
    }

    public function update(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM products WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy sản phẩm', 404); return; }

        $data        = bodyJson();
        $name        = trim($data['name'] ?? $row['name']);
        $category_id = isset($data['category_id']) ? ($data['category_id'] ? (int)$data['category_id'] : null) : $row['category_id'];
        $image       = trim($data['image'] ?? $row['image']);
        $price       = (int)($data['price'] ?? $row['price']);
        $price_sale  = isset($data['price_sale'])
            ? ($data['price_sale'] !== '' ? (int)$data['price_sale'] : null)
            : $row['price_sale'];
        $badge       = trim($data['badge'] ?? ($row['badge'] ?? ''));
        $description = trim($data['description'] ?? ($row['description'] ?? ''));
        $material    = trim($data['material'] ?? ($row['material'] ?? ''));
        $colors      = trim($data['colors'] ?? ($row['colors'] ?? ''));
        $gallery     = trim($data['gallery'] ?? ($row['gallery'] ?? ''));
        $rating      = isset($data['rating']) && $data['rating'] !== '' ? max(0, min(5, (float)$data['rating'])) : (float)($row['rating'] ?? 5);
        $in_stock    = isset($data['in_stock']) ? (int)$data['in_stock'] : (int)$row['in_stock'];
        $is_featured = (int)($data['is_featured'] ?? $row['is_featured']);
        $is_new      = (int)($data['is_new'] ?? $row['is_new']);
        $status      = trim($data['status'] ?? $row['status']);
        $sort_order  = (int)($data['sort_order'] ?? $row['sort_order']);

        $this->db->execute(
            "UPDATE products SET category_id=?, name=?, image=?, price=?, price_sale=?, badge=?, description=?, material=?, colors=?, gallery=?, rating=?, in_stock=?, is_featured=?, is_new=?, status=?, sort_order=?, updated_at=datetime('now') WHERE id=?",
            [$category_id, $name, $image, $price, $price_sale, $badge, $description, $material, $colors, $gallery, $rating, $in_stock ? 1 : 0, $is_featured ? 1 : 0, $is_new ? 1 : 0, $status, $sort_order, $id]
        );
        $row = $this->db->queryOne("SELECT * FROM products WHERE id = ?", [$id]);
        Response::json($row);
    }

    public function destroy(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT id FROM products WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy sản phẩm', 404); return; }
        $this->db->execute("DELETE FROM products WHERE id = ?", [$id]);
        Response::json(['message' => 'Đã xóa sản phẩm']);
    }
}
