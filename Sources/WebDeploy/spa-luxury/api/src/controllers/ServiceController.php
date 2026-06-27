<?php
declare(strict_types=1);

class ServiceController {
    public function __construct(private Database $db) {}

    /** GET /services */
    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT s.*, sc.name AS category_name
             FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             ORDER BY s.category_id, s.sort_order, s.id"
        );
        Response::json($rows);
    }

    /** POST /services */
    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();

        if (empty($b['name'])) {
            Response::error('Tên dịch vụ là bắt buộc.');
            return;
        }

        $id = $this->db->execute(
            "INSERT INTO services
                (category_id, name, description, duration_minutes, price, price_unit, is_featured, image, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                isset($b['category_id']) && $b['category_id'] !== '' ? (int)$b['category_id'] : null,
                trim($b['name']),
                $b['description'] ?? '',
                isset($b['duration_minutes']) && $b['duration_minutes'] !== '' ? (int)$b['duration_minutes'] : null,
                isset($b['price']) ? (int)$b['price'] : 0,
                $b['price_unit'] ?? 'người',
                isset($b['is_featured']) ? (int)(bool)$b['is_featured'] : 0,
                $b['image'] ?? '',
                (int)($b['sort_order'] ?? 0),
            ]
        );
        Response::json(['id' => $id], 201);
    }

    /** POST /services/:id/update */
    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();

        if (empty($b['name'])) {
            Response::error('Tên dịch vụ là bắt buộc.');
            return;
        }

        $this->db->execute(
            "UPDATE services SET
                category_id      = ?,
                name             = ?,
                description      = ?,
                duration_minutes = ?,
                price            = ?,
                price_unit       = ?,
                is_featured      = ?,
                image            = ?,
                sort_order       = ?
             WHERE id = ?",
            [
                isset($b['category_id']) && $b['category_id'] !== '' ? (int)$b['category_id'] : null,
                trim($b['name']),
                $b['description'] ?? '',
                isset($b['duration_minutes']) && $b['duration_minutes'] !== '' ? (int)$b['duration_minutes'] : null,
                isset($b['price']) ? (int)$b['price'] : 0,
                $b['price_unit'] ?? 'người',
                isset($b['is_featured']) ? (int)(bool)$b['is_featured'] : 0,
                $b['image'] ?? '',
                (int)($b['sort_order'] ?? 0),
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    /** POST /services/:id/delete */
    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM services WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
