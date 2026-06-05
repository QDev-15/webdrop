<?php
declare(strict_types=1);

class MenuItemController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $catId = $_GET['category_id'] ?? '';
        if ($catId) {
            $items = $this->db->query(
                "SELECT i.*, c.name as category_name FROM menu_items i LEFT JOIN menu_categories c ON c.id = i.category_id WHERE i.category_id = ? ORDER BY i.sort_order, i.id",
                [$catId]
            );
        } else {
            $items = $this->db->query(
                "SELECT i.*, c.name as category_name FROM menu_items i LEFT JOIN menu_categories c ON c.id = i.category_id ORDER BY c.sort_order, i.sort_order, i.id"
            );
        }
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne(
            "SELECT i.*, c.name as category_name FROM menu_items i LEFT JOIN menu_categories c ON c.id = i.category_id WHERE i.id = ?",
            [$p['id']]
        );
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên món là bắt buộc.'); return; }
        $slug = slugify($b['name']);
        $id = $this->db->execute(
            "INSERT INTO menu_items (category_id, name, slug, description, price, image, featured, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [$b['category_id'] ?? null, $b['name'], $slug, $b['description'] ?? '', (float)($b['price'] ?? 0), $b['image'] ?? '', (int)($b['featured'] ?? 0), (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên món là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE menu_items SET category_id=?, name=?, description=?, price=?, image=?, featured=?, sort_order=?, status=? WHERE id=?",
            [$b['category_id'] ?? null, $b['name'], $b['description'] ?? '', (float)($b['price'] ?? 0), $b['image'] ?? '', (int)($b['featured'] ?? 0), (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM menu_items WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
