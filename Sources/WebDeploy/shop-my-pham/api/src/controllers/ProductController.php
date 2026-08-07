<?php
declare(strict_types=1);

// Admin: CRUD sản phẩm — file BASE, AI chỉ được thêm field vào $BASE_FIELDS bên dưới
// nếu schema.sql của site có thêm cột (brand/gallery/sizes/features/specs/origin...).
// KHÔNG viết lại toàn bộ file — chỉ mở rộng mảng field trắng (whitelist).
class ProductController {
    public function __construct(private Database $db) {}

    // ▼ Mở rộng tại đây nếu products có thêm cột — mỗi field: 'key' => kiểu ép ('s'=string,'i'=int,'f'=float)
    // brand/skin_type/theme/sold: cột riêng của shop-my-pham (mỹ phẩm) — xem schema.sql.
    private const BASE_FIELDS = [
        'name' => 's', 'image' => 's', 'price' => 'i', 'price_sale' => 'i',
        'badge' => 's', 'description' => 's', 'colors' => 's', 'rating' => 'f',
        'in_stock' => 'i', 'is_featured' => 'i', 'is_new' => 'i', 'status' => 's', 'sort_order' => 'i',
        'brand' => 's', 'skin_type' => 's', 'theme' => 's', 'sold' => 'i', 'gallery' => 's',
    ];

    private function cast(string $type, mixed $v): mixed {
        return match ($type) {
            'i' => (int)$v,
            'f' => (float)$v,
            default => trim((string)$v),
        };
    }

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

    public function store(): void {
        Auth::require();
        $data = bodyJson();
        $name = trim($data['name'] ?? '');
        if (!$name) { Response::error('Tên sản phẩm không được để trống', 422); return; }

        $categoryId = isset($data['category_id']) && $data['category_id'] ? (int)$data['category_id'] : null;

        $cols   = ['category_id'];
        $marks  = ['?'];
        $values = [$categoryId];
        foreach (self::BASE_FIELDS as $field => $type) {
            $cols[]   = $field;
            $marks[]  = '?';
            $default  = $field === 'status' ? 'published' : ($field === 'rating' ? 5 : ($field === 'in_stock' ? 1 : ''));
            $values[] = $this->cast($type, $data[$field] ?? $default);
        }

        $slug = slugify($name);
        $base = $slug;
        $i    = 1;
        while ($this->db->queryOne("SELECT id FROM products WHERE slug = ?", [$slug])) {
            $slug = $base . '-' . $i++;
        }
        $cols[] = 'slug'; $marks[] = '?'; $values[] = $slug;

        $id = $this->db->execute(
            "INSERT INTO products (" . implode(', ', $cols) . ") VALUES (" . implode(', ', $marks) . ")",
            $values
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
        $categoryId = isset($data['category_id'])
            ? ($data['category_id'] ? (int)$data['category_id'] : null)
            : $row['category_id'];

        $sets   = ['category_id = ?'];
        $values = [$categoryId];
        foreach (self::BASE_FIELDS as $field => $type) {
            $sets[]   = "$field = ?";
            $values[] = array_key_exists($field, $data) ? $this->cast($type, $data[$field]) : $row[$field];
        }
        $values[] = $id;

        $this->db->execute(
            "UPDATE products SET " . implode(', ', $sets) . ", updated_at = datetime('now') WHERE id = ?",
            $values
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
