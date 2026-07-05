<?php
declare(strict_types=1);

class ServiceController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT s.*, sc.name AS category_name FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             ORDER BY s.sort_order ASC"
        );
        Response::json($rows);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên dịch vụ không được để trống.', 422); return; }
        $id = $this->db->execute(
            "INSERT INTO services (category_id, name, description, icon, tags, price, price_unit, is_featured, sort_order) VALUES (?,?,?,?,?,?,?,?,?)",
            [
                $b['category_id'] ? (int)$b['category_id'] : null,
                $name,
                trim($b['description'] ?? ''),
                trim($b['icon']        ?? ''),
                trim($b['tags']        ?? ''),
                trim($b['price']       ?? ''),
                trim($b['price_unit']  ?? ''),
                isset($b['is_featured']) && $b['is_featured'] ? 1 : 0,
                (int)($b['sort_order'] ?? 0),
            ]
        );
        Response::json($this->db->queryOne("SELECT * FROM services WHERE id = ?", [$id]), 201);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM services WHERE id = ?", [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $id = (int)$p['id'];
        $row = $this->db->queryOne("SELECT id FROM services WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        $this->db->execute(
            "UPDATE services SET category_id=?, name=?, description=?, icon=?, tags=?, price=?, price_unit=?, is_featured=?, sort_order=? WHERE id=?",
            [
                $b['category_id'] ? (int)$b['category_id'] : null,
                trim($b['name']        ?? ''),
                trim($b['description'] ?? ''),
                trim($b['icon']        ?? ''),
                trim($b['tags']        ?? ''),
                trim($b['price']       ?? ''),
                trim($b['price_unit']  ?? ''),
                isset($b['is_featured']) && $b['is_featured'] ? 1 : 0,
                (int)($b['sort_order'] ?? 0),
                $id,
            ]
        );
        Response::json($this->db->queryOne("SELECT * FROM services WHERE id = ?", [$id]));
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM services WHERE id = ?", [(int)$p['id']]);
        Response::json(['ok' => true]);
    }
}
