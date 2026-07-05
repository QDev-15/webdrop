<?php
declare(strict_types=1);

class ServiceCategoryController {
    public function __construct(private Database $db) {}

    public function index(array $p = []): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM service_categories ORDER BY sort_order, id");
        Response::json($items);
    }

    public function store(array $p = []): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Ten nhom dich vu la bat buoc.', 422); return; }
        $id = $this->db->execute(
            "INSERT INTO service_categories (name, description, sort_order, is_active) VALUES (?, ?, ?, ?)",
            [
                $b['name'],
                $b['description'] ?? '',
                (int)($b['sort_order'] ?? 0),
                (int)($b['is_active'] ?? 1),
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p = []): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Ten nhom dich vu la bat buoc.', 422); return; }
        $this->db->execute(
            "UPDATE service_categories SET name=?, description=?, sort_order=?, is_active=? WHERE id=?",
            [
                $b['name'],
                $b['description'] ?? '',
                (int)($b['sort_order'] ?? 0),
                (int)($b['is_active'] ?? 1),
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p = []): void {
        Auth::require();
        $this->db->execute("DELETE FROM service_categories WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
