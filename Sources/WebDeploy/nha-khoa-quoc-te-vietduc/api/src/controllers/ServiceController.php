<?php
declare(strict_types=1);

class ServiceController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT s.id, s.category_id, sc.name AS category_name, s.image, s.tag,
                    s.name, s.description, s.price, s.price_unit, s.sort_order, s.is_active, s.created_at
             FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             ORDER BY s.sort_order ASC"
        );
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne(
            "SELECT s.id, s.category_id, sc.name AS category_name, s.image, s.tag,
                    s.name, s.description, s.price, s.price_unit, s.sort_order, s.is_active
             FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             WHERE s.id = ?",
            [(int)$p[1]]
        );
        if (!$row) { Response::error('Khong tim thay.', 404); return; }
        Response::json($row);
    }

    public function store(): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Ten dich vu la bat buoc.'); return; }
        $id = $this->db->execute(
            "INSERT INTO services (category_id, image, tag, name, description, price, price_unit, sort_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $b['category_id'] ? (int)$b['category_id'] : null,
                trim($b['image']       ?? ''),
                trim($b['tag']         ?? ''),
                trim($b['name']),
                trim($b['description'] ?? ''),
                trim($b['price']       ?? ''),
                trim($b['price_unit']  ?? ''),
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
        if (empty($b['name'])) { Response::error('Ten dich vu la bat buoc.'); return; }
        $this->db->execute(
            "UPDATE services SET category_id=?, image=?, tag=?, name=?, description=?,
             price=?, price_unit=?, sort_order=?, is_active=? WHERE id=?",
            [
                $b['category_id'] ? (int)$b['category_id'] : null,
                trim($b['image']       ?? ''),
                trim($b['tag']         ?? ''),
                trim($b['name']),
                trim($b['description'] ?? ''),
                trim($b['price']       ?? ''),
                trim($b['price_unit']  ?? ''),
                (int)($b['sort_order'] ?? 0),
                isset($b['is_active']) ? (int)$b['is_active'] : 1,
                $id,
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM services WHERE id = ?", [(int)$p[1]]);
        Response::json(['ok' => true]);
    }
}
