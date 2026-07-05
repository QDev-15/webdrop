<?php
declare(strict_types=1);

class ServiceController {
    public function __construct(private Database $db) {}

    public function index(array $p = []): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM services ORDER BY sort_order, id");
        Response::json($items);
    }

    public function store(array $p = []): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Ten dich vu la bat buoc.', 422); return; }
        $id = $this->db->execute(
            "INSERT INTO services (number, name, description, features, price, image, is_featured, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $b['number']      ?? '',
                $b['name'],
                $b['description'] ?? '',
                $b['features']    ?? '',
                $b['price']       ?? '',
                $b['image']       ?? '',
                (int)($b['is_featured'] ?? 0),
                (int)($b['sort_order']  ?? 0),
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p = []): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Ten dich vu la bat buoc.', 422); return; }
        $this->db->execute(
            "UPDATE services SET number=?, name=?, description=?, features=?, price=?, image=?, is_featured=?, sort_order=?
             WHERE id=?",
            [
                $b['number']      ?? '',
                $b['name'],
                $b['description'] ?? '',
                $b['features']    ?? '',
                $b['price']       ?? '',
                $b['image']       ?? '',
                (int)($b['is_featured'] ?? 0),
                (int)($b['sort_order']  ?? 0),
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
