<?php
declare(strict_types=1);

class ServiceController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $services = $this->db->query(
            "SELECT s.*, sc.name AS category_name
             FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             ORDER BY s.sort_order ASC"
        );
        Response::json($services);
    }

    public function show(array $p): void {
        Auth::require();
        $id = (int)$p['id'];
        if (!$id) { Response::error('ID không hợp lệ.', 400); return; }
        $svc = $this->db->queryOne(
            "SELECT s.*, sc.name AS category_name
             FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             WHERE s.id = ?",
            [$id]
        );
        if (!$svc) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($svc);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên dịch vụ là bắt buộc.', 422); return; }

        $catId = !empty($b['category_id']) ? (int)$b['category_id'] : null;
        $id = $this->db->execute(
            "INSERT INTO services (category_id, number, name, description, price, price_unit, is_featured, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $catId,
                trim($b['number']      ?? ''),
                $name,
                trim($b['description'] ?? ''),
                trim($b['price']       ?? ''),
                trim($b['price_unit']  ?? ''),
                isset($b['is_featured']) ? (int)$b['is_featured'] : 0,
                (int)($b['sort_order'] ?? 0),
            ]
        );
        Response::json(['ok' => true, 'id' => $id]);
    }

    public function update(array $p): void {
        Auth::require();
        $b  = bodyJson();
        $id = (int)$p['id'];
        if (!$id) { Response::error('ID không hợp lệ.', 400); return; }

        $catId = !empty($b['category_id']) ? (int)$b['category_id'] : null;
        $this->db->execute(
            "UPDATE services SET category_id = ?, number = ?, name = ?, description = ?, price = ?, price_unit = ?, is_featured = ?, sort_order = ? WHERE id = ?",
            [
                $catId,
                trim($b['number']      ?? ''),
                trim($b['name']        ?? ''),
                trim($b['description'] ?? ''),
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
        $id = (int)$p['id'];
        if (!$id) { Response::error('ID không hợp lệ.', 400); return; }
        $this->db->execute("DELETE FROM services WHERE id = ?", [$id]);
        Response::json(['ok' => true]);
    }
}
