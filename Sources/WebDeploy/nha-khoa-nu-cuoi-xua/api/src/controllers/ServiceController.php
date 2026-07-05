<?php
declare(strict_types=1);

class ServiceController {
    public function __construct(private Database $db) {}

    public function index(array $p = []): void {
        Auth::require();
        $items = $this->db->query(
            "SELECT s.*, sc.name AS category_name FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             ORDER BY s.category_id, s.sort_order, s.id"
        );
        Response::json($items);
    }

    public function store(array $p = []): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Ten dich vu la bat buoc.', 422); return; }
        $id = $this->db->execute(
            "INSERT INTO services (category_id, image, tag, name, description, price, price_unit, sort_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                ($b['category_id'] ?? null) ?: null,
                $b['image']       ?? '',
                $b['tag']         ?? '',
                $b['name'],
                $b['description'] ?? '',
                $b['price']       ?? '',
                $b['price_unit']  ?? '',
                (int)($b['sort_order'] ?? 0),
                (int)($b['is_active']  ?? 1),
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p = []): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Ten dich vu la bat buoc.', 422); return; }
        $this->db->execute(
            "UPDATE services SET category_id=?, image=?, tag=?, name=?, description=?, price=?, price_unit=?, sort_order=?, is_active=?
             WHERE id=?",
            [
                ($b['category_id'] ?? null) ?: null,
                $b['image']       ?? '',
                $b['tag']         ?? '',
                $b['name'],
                $b['description'] ?? '',
                $b['price']       ?? '',
                $b['price_unit']  ?? '',
                (int)($b['sort_order'] ?? 0),
                (int)($b['is_active']  ?? 1),
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p = []): void {
        Auth::require();
        $this->db->execute("DELETE FROM services WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
