<?php
declare(strict_types=1);

class FeaturedDrinkController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM featured_drinks ORDER BY sort_order, id");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM featured_drinks WHERE id = ?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên thức uống là bắt buộc.'); return; }
        $id = $this->db->execute(
            "INSERT INTO featured_drinks (image, origin, name, description, price, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                $b['image'] ?? '', $b['origin'] ?? '', $b['name'], $b['description'] ?? '',
                isset($b['price']) && $b['price'] !== '' ? (float)$b['price'] : null,
                (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên thức uống là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE featured_drinks SET image=?, origin=?, name=?, description=?, price=?, sort_order=?, status=? WHERE id=?",
            [
                $b['image'] ?? '', $b['origin'] ?? '', $b['name'], $b['description'] ?? '',
                isset($b['price']) && $b['price'] !== '' ? (float)$b['price'] : null,
                (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published', $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM featured_drinks WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
