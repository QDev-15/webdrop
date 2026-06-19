<?php
declare(strict_types=1);

// Note: This controller is repurposed for products table in the bakery context
class MenuItemController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query(
            "SELECT p.*, c.name as category_name
             FROM products p
             LEFT JOIN product_categories c ON c.id = p.category_id
             ORDER BY p.sort_order, p.id"
        );
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne(
            "SELECT p.*, c.name as category_name
             FROM products p
             LEFT JOIN product_categories c ON c.id = p.category_id
             WHERE p.id = ?",
            [$p['id']]
        );
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên sản phẩm là bắt buộc.'); return; }
        $slug = slugify($b['name']);
        $existing = $this->db->queryOne("SELECT id FROM products WHERE slug = ?", [$slug]);
        if ($existing) $slug = $slug . '-' . time();
        $id = $this->db->execute(
            "INSERT INTO products (category_id, name, slug, description, price, price_note, image, tag, featured, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $b['category_id'] ?? null,
                $b['name'],
                $slug,
                $b['description'] ?? '',
                isset($b['price']) && $b['price'] !== '' ? (float)$b['price'] : 0,
                $b['price_note'] ?? '',
                $b['image'] ?? '',
                $b['tag'] ?? '',
                (int)($b['featured'] ?? 0),
                (int)($b['sort_order'] ?? 0),
                $b['status'] ?? 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên sản phẩm là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE products SET category_id=?, name=?, description=?, price=?, price_note=?, image=?, tag=?, featured=?, sort_order=?, status=? WHERE id=?",
            [
                $b['category_id'] ?? null,
                $b['name'],
                $b['description'] ?? '',
                isset($b['price']) && $b['price'] !== '' ? (float)$b['price'] : 0,
                $b['price_note'] ?? '',
                $b['image'] ?? '',
                $b['tag'] ?? '',
                (int)($b['featured'] ?? 0),
                (int)($b['sort_order'] ?? 0),
                $b['status'] ?? 'published',
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM products WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
