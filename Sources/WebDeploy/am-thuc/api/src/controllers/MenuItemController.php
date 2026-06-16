<?php
declare(strict_types=1);

class MenuItemController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query(
            "SELECT i.*, c.name as category_name
             FROM menu_items i
             LEFT JOIN menu_categories c ON c.id = i.category_id
             ORDER BY i.sort_order, i.id"
        );
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne(
            "SELECT i.*, c.name as category_name
             FROM menu_items i
             LEFT JOIN menu_categories c ON c.id = i.category_id
             WHERE i.id=?",
            [$p['id']]
        );
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên món ăn không được để trống.'); return; }
        $slug = slugify($b['name']);
        $existing = $this->db->scalar("SELECT COUNT(*) FROM menu_items WHERE slug=?", [$slug]);
        if ($existing > 0) { $slug .= '-' . time(); }
        $id = $this->db->execute(
            "INSERT INTO menu_items (category_id, name, slug, description, price, price_sale, image, featured, sort_order, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $b['category_id'] ?? null,
                $b['name'],
                $slug,
                $b['description'] ?? '',
                (float)($b['price'] ?? 0),
                isset($b['price_sale']) && $b['price_sale'] !== '' ? (float)$b['price_sale'] : null,
                $b['image'] ?? '',
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
        if (empty($b['name'])) { Response::error('Tên món ăn không được để trống.'); return; }
        $this->db->execute(
            "UPDATE menu_items SET category_id=?, name=?, description=?, price=?, price_sale=?,
             image=?, featured=?, sort_order=?, status=? WHERE id=?",
            [
                $b['category_id'] ?? null,
                $b['name'],
                $b['description'] ?? '',
                (float)($b['price'] ?? 0),
                isset($b['price_sale']) && $b['price_sale'] !== '' ? (float)$b['price_sale'] : null,
                $b['image'] ?? '',
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
        $this->db->execute("DELETE FROM menu_items WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
