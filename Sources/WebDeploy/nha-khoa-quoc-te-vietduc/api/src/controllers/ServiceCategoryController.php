<?php
declare(strict_types=1);

class ServiceCategoryController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT id, name, description, sort_order, is_active, created_at
             FROM service_categories ORDER BY sort_order ASC"
        );
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne(
            "SELECT id, name, description, sort_order, is_active, created_at
             FROM service_categories WHERE id = ?",
            [(int)$p[1]]
        );
        if (!$row) { Response::error('Khong tim thay.', 404); return; }
        Response::json($row);
    }

    public function store(): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Ten la bat buoc.'); return; }
        $id = $this->db->execute(
            "INSERT INTO service_categories (name, description, sort_order, is_active)
             VALUES (?, ?, ?, ?)",
            [
                trim($b['name']),
                trim($b['description'] ?? ''),
                (int)($b['sort_order'] ?? 0),
                isset($b['is_active']) ? (int)$b['is_active'] : 1,
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b  = bodyJson();
        $id = (int)$p[1];
        if (empty($b['name'])) { Response::error('Ten la bat buoc.'); return; }
        $this->db->execute(
            "UPDATE service_categories SET name=?, description=?, sort_order=?, is_active=? WHERE id=?",
            [
                trim($b['name']),
                trim($b['description'] ?? ''),
                (int)($b['sort_order'] ?? 0),
                isset($b['is_active']) ? (int)$b['is_active'] : 1,
                $id,
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute(
            "DELETE FROM service_categories WHERE id = ?",
            [(int)$p[1]]
        );
        Response::json(['ok' => true]);
    }
}
