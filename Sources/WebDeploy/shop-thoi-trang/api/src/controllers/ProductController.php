<?php
declare(strict_types=1);

class ProductController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $page    = max(1, (int)($_GET['page'] ?? 1));
        $perPage = max(1, min(200, (int)($_GET['per_page'] ?? 20)));
        $offset  = ($page - 1) * $perPage;

        $search   = trim($_GET['q'] ?? '');
        $whereSql = '1=1';
        $params   = [];
        if ($search !== '') {
            $whereSql = '(p.name LIKE ? OR p.description LIKE ?)';
            $needle   = '%' . substr($search, 0, 100) . '%';
            $params   = [$needle, $needle];
        }

        $total = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM products p WHERE $whereSql", $params)['c'] ?? 0);
        $rows  = $this->db->query(
            "SELECT p.*, pc.name as category_name
             FROM products p
             LEFT JOIN product_categories pc ON pc.id = p.category_id
             WHERE $whereSql
             ORDER BY p.sort_order ASC, p.created_at DESC
             LIMIT ? OFFSET ?",
            [...$params, $perPage, $offset]
        );

        header('X-Total-Count: ' . $total);
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

    private function extract(array $data, ?array $existing = null): array {
        $get = fn(string $key, mixed $default) => array_key_exists($key, $data) ? $data[$key] : ($existing[$key] ?? $default);

        return [
            'category_id'  => $get('category_id', null) !== null && $get('category_id', null) !== '' ? (int)$get('category_id', null) : null,
            'name'         => trim((string)$get('name', '')),
            'brand'        => trim((string)$get('brand', '')),
            'image'        => trim((string)$get('image', '')),
            'gallery'      => trim((string)$get('gallery', '')),
            'price'        => (int)$get('price', 0),
            'price_sale'   => $get('price_sale', '') !== '' && $get('price_sale', null) !== null ? (int)$get('price_sale', null) : null,
            'badge'        => trim((string)$get('badge', '')),
            'description'  => trim((string)$get('description', '')),
            'features'     => trim((string)$get('features', '')),
            'specs'        => trim((string)$get('specs', '')),
            'material'     => trim((string)$get('material', '')),
            'origin'       => trim((string)$get('origin', 'Việt Nam')) ?: 'Việt Nam',
            'colors'       => trim((string)$get('colors', '')),
            'sizes'        => trim((string)$get('sizes', '')),
            'rating'       => max(0, min(5, (float)$get('rating', 5))),
            'review_count' => max(0, (int)$get('review_count', 0)),
            'sold_count'   => max(0, (int)$get('sold_count', 0)),
            'stock_qty'    => max(0, (int)$get('stock_qty', 0)),
            'in_stock'     => (int)$get('in_stock', 1) ? 1 : 0,
            'is_featured'  => (int)$get('is_featured', 0) ? 1 : 0,
            'is_new'       => (int)$get('is_new', 0) ? 1 : 0,
            'status'       => trim((string)$get('status', 'published')) ?: 'published',
            'sort_order'   => (int)$get('sort_order', 0),
        ];
    }

    public function store(): void {
        Auth::require();
        $data = bodyJson();
        $f    = $this->extract($data);

        if (!$f['name']) { Response::error('Tên sản phẩm không được để trống', 422); return; }

        $slug = slugify($f['name']);
        $base = $slug;
        $i    = 1;
        while ($this->db->queryOne("SELECT id FROM products WHERE slug = ?", [$slug])) {
            $slug = $base . '-' . $i++;
        }

        $id = $this->db->execute(
            "INSERT INTO products (category_id, name, slug, brand, image, gallery, price, price_sale, badge, description, features, specs, material, origin, colors, sizes, rating, review_count, sold_count, stock_qty, in_stock, is_featured, is_new, status, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $f['category_id'], $f['name'], $slug, $f['brand'], $f['image'], $f['gallery'],
                $f['price'], $f['price_sale'], $f['badge'], $f['description'], $f['features'], $f['specs'],
                $f['material'], $f['origin'], $f['colors'], $f['sizes'], $f['rating'], $f['review_count'],
                $f['sold_count'], $f['stock_qty'], $f['in_stock'], $f['is_featured'], $f['is_new'], $f['status'], $f['sort_order'],
            ]
        );
        $row = $this->db->queryOne("SELECT * FROM products WHERE id = ?", [$id]);
        Response::json($row, 201);
    }

    public function update(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM products WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy sản phẩm', 404); return; }

        $data = bodyJson();
        $f    = $this->extract($data, $row);
        if (!$f['name']) { $f['name'] = $row['name']; }

        $this->db->execute(
            "UPDATE products SET category_id=?, name=?, brand=?, image=?, gallery=?, price=?, price_sale=?, badge=?, description=?, features=?, specs=?, material=?, origin=?, colors=?, sizes=?, rating=?, review_count=?, sold_count=?, stock_qty=?, in_stock=?, is_featured=?, is_new=?, status=?, sort_order=?, updated_at=datetime('now') WHERE id=?",
            [
                $f['category_id'], $f['name'], $f['brand'], $f['image'], $f['gallery'],
                $f['price'], $f['price_sale'], $f['badge'], $f['description'], $f['features'], $f['specs'],
                $f['material'], $f['origin'], $f['colors'], $f['sizes'], $f['rating'], $f['review_count'],
                $f['sold_count'], $f['stock_qty'], $f['in_stock'], $f['is_featured'], $f['is_new'], $f['status'], $f['sort_order'],
                $id,
            ]
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
