<?php
declare(strict_types=1);

class ServiceController
{
    public function __construct(private Database $db) {}

    public function index(): void
    {
        Auth::require();
        $rows = $this->db->query(
            "SELECT s.*, sc.name AS category_name
             FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             ORDER BY s.sort_order ASC"
        );
        Response::json($rows);
    }

    public function store(): void
    {
        Auth::require();
        $body = bodyJson();
        $name = trim($body['name'] ?? '');
        if (!$name) { Response::error('Ten dich vu khong duoc de trong.', 422); return; }

        $this->db->execute(
            "INSERT INTO services (category_id, name, tag, description, image, price, sort_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $body['category_id'] ?? null,
                $name,
                trim($body['tag'] ?? ''),
                trim($body['description'] ?? ''),
                trim($body['image'] ?? ''),
                trim($body['price'] ?? ''),
                (int)($body['sort_order'] ?? 0),
                isset($body['is_active']) ? (int)$body['is_active'] : 1,
            ]
        );
        $id  = $this->db->lastInsertId();
        $row = $this->db->queryOne("SELECT * FROM services WHERE id = ?", [$id]);
        Response::json($row, 201);
    }

    public function update(int $id): void
    {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM services WHERE id = ?", [$id]);
        if (!$row) { Response::error('Khong tim thay dich vu.', 404); return; }

        $body = bodyJson();
        $this->db->execute(
            "UPDATE services SET
                category_id = ?,
                name        = ?,
                tag         = ?,
                description = ?,
                image       = ?,
                price       = ?,
                sort_order  = ?,
                is_active   = ?
             WHERE id = ?",
            [
                $body['category_id'] ?? $row['category_id'],
                trim($body['name'] ?? $row['name']),
                trim($body['tag'] ?? $row['tag']),
                trim($body['description'] ?? $row['description']),
                trim($body['image'] ?? $row['image']),
                trim($body['price'] ?? $row['price']),
                isset($body['sort_order']) ? (int)$body['sort_order'] : (int)$row['sort_order'],
                isset($body['is_active']) ? (int)$body['is_active'] : (int)$row['is_active'],
                $id,
            ]
        );
        $updated = $this->db->queryOne("SELECT * FROM services WHERE id = ?", [$id]);
        Response::json($updated);
    }

    public function destroy(int $id): void
    {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM services WHERE id = ?", [$id]);
        if (!$row) { Response::error('Khong tim thay dich vu.', 404); return; }
        $this->db->execute("DELETE FROM services WHERE id = ?", [$id]);
        Response::json(['message' => 'Da xoa dich vu.']);
    }
}
