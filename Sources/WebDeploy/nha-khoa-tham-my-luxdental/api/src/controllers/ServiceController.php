<?php
declare(strict_types=1);

class ServiceController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT s.*, c.name AS category_name FROM services s
             LEFT JOIN service_categories c ON s.category_id = c.id
             ORDER BY s.sort_order ASC"
        );
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        if (!$id) { Response::json(['error' => 'ID không hợp lệ.'], 400); return; }
        $row = $this->db->queryOne("SELECT * FROM services WHERE id = ?", [$id]);
        if (!$row) { Response::json(['error' => 'Không tìm thấy.'], 404); return; }
        Response::json($row);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::json(['error' => 'Tên dịch vụ không được để trống.'], 400); return; }
        $id = $this->db->execute(
            "INSERT INTO services (category_id, name, description, image, tag, price, price_unit, is_featured, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                isset($b['category_id']) && $b['category_id'] !== '' ? (int)$b['category_id'] : null,
                $name,
                trim($b['description'] ?? ''),
                trim($b['image']       ?? ''),
                trim($b['tag']         ?? ''),
                trim($b['price']       ?? ''),
                trim($b['price_unit']  ?? ''),
                isset($b['is_featured']) ? (int)$b['is_featured'] : 0,
                (int)($b['sort_order'] ?? 0),
            ]
        );
        Response::json(['id' => $id, 'ok' => true]);
    }

    public function update(array $p): void {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        if (!$id) { Response::json(['error' => 'ID không hợp lệ.'], 400); return; }
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::json(['error' => 'Tên dịch vụ không được để trống.'], 400); return; }
        $this->db->execute(
            "UPDATE services SET category_id = ?, name = ?, description = ?, image = ?, tag = ?,
             price = ?, price_unit = ?, is_featured = ?, sort_order = ? WHERE id = ?",
            [
                isset($b['category_id']) && $b['category_id'] !== '' ? (int)$b['category_id'] : null,
                $name,
                trim($b['description'] ?? ''),
                trim($b['image']       ?? ''),
                trim($b['tag']         ?? ''),
                trim($b['price']       ?? ''),
                trim($b['price_unit']  ?? ''),
                isset($b['is_featured']) ? (int)$b['is_featured'] : 0,
                (int)($b['sort_order'] ?? 0),
                $id,
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        if (!$id) { Response::json(['error' => 'ID không hợp lệ.'], 400); return; }
        $this->db->execute("DELETE FROM services WHERE id = ?", [$id]);
        Response::json(['ok' => true]);
    }
}
