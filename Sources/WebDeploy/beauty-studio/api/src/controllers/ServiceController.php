<?php
declare(strict_types=1);

class ServiceController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query(
            'SELECT s.*, sc.name AS category_name
             FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             ORDER BY s.category_id ASC, s.sort_order ASC'
        );
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne('SELECT * FROM services WHERE id=?', [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function store(): void {
        Auth::require();
        $body        = bodyJson();
        $category_id = (int)($body['category_id'] ?? 0) ?: null;
        $name        = trim($body['name'] ?? '');
        $description = trim($body['description'] ?? '');
        $price       = trim($body['price'] ?? '');
        $image       = trim($body['image'] ?? '');
        $badge       = trim($body['badge'] ?? '');
        $sort_order  = (int)($body['sort_order'] ?? 0);
        $is_featured = (int)($body['is_featured'] ?? 0);

        if (!$name) { Response::error('Tên dịch vụ là bắt buộc.', 422); return; }

        $id = $this->db->execute(
            'INSERT INTO services (category_id,name,description,price,image,badge,sort_order,is_featured) VALUES (?,?,?,?,?,?,?,?)',
            [$category_id, $name, $description, $price, $image, $badge, $sort_order, $is_featured]
        );
        Response::json(['id' => $id, 'message' => 'Đã thêm dịch vụ.'], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $row = $this->db->queryOne('SELECT id FROM services WHERE id=?', [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }

        $body        = bodyJson();
        $category_id = (int)($body['category_id'] ?? 0) ?: null;
        $name        = trim($body['name'] ?? '');
        $description = trim($body['description'] ?? '');
        $price       = trim($body['price'] ?? '');
        $image       = trim($body['image'] ?? '');
        $badge       = trim($body['badge'] ?? '');
        $sort_order  = (int)($body['sort_order'] ?? 0);
        $is_featured = (int)($body['is_featured'] ?? 0);

        if (!$name) { Response::error('Tên dịch vụ là bắt buộc.', 422); return; }

        $this->db->execute(
            'UPDATE services SET category_id=?,name=?,description=?,price=?,image=?,badge=?,sort_order=?,is_featured=? WHERE id=?',
            [$category_id, $name, $description, $price, $image, $badge, $sort_order, $is_featured, (int)$p['id']]
        );
        Response::json(['message' => 'Đã cập nhật.']);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute('DELETE FROM services WHERE id=?', [(int)$p['id']]);
        Response::json(['message' => 'Đã xóa.']);
    }
}
