<?php
declare(strict_types=1);

class ServiceController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT s.*, sc.name AS category_name
             FROM services s LEFT JOIN service_categories sc ON sc.id = s.category_id
             ORDER BY sc.sort_order ASC, s.sort_order ASC, s.id ASC"
        );
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne('SELECT * FROM services WHERE id = ?', [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        $categoryId = (int)($b['category_id'] ?? 0);
        if (!$name) { Response::error('Tên dịch vụ là bắt buộc.'); return; }
        if (!$categoryId) { Response::error('Danh mục là bắt buộc.'); return; }
        $id = $this->db->execute(
            'INSERT INTO services (category_id, name, note, description, price_text, image, is_featured, sort_order, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $categoryId, $name,
                trim($b['note'] ?? ''), trim($b['description'] ?? ''),
                trim($b['price_text'] ?? ''), trim($b['image'] ?? ''),
                (int)($b['is_featured'] ?? 0), (int)($b['sort_order'] ?? 0),
                $b['status'] ?? 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $id = (int)$p['id'];
        $existing = $this->db->queryOne('SELECT id FROM services WHERE id = ?', [$id]);
        if (!$existing) { Response::error('Không tìm thấy.', 404); return; }
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        $categoryId = (int)($b['category_id'] ?? 0);
        if (!$name) { Response::error('Tên dịch vụ là bắt buộc.'); return; }
        if (!$categoryId) { Response::error('Danh mục là bắt buộc.'); return; }
        $this->db->execute(
            'UPDATE services SET category_id=?, name=?, note=?, description=?, price_text=?, image=?, is_featured=?, sort_order=?, status=? WHERE id=?',
            [
                $categoryId, $name,
                trim($b['note'] ?? ''), trim($b['description'] ?? ''),
                trim($b['price_text'] ?? ''), trim($b['image'] ?? ''),
                (int)($b['is_featured'] ?? 0), (int)($b['sort_order'] ?? 0),
                $b['status'] ?? 'published', $id,
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute('DELETE FROM services WHERE id = ?', [(int)$p['id']]);
        Response::json(['ok' => true]);
    }
}
