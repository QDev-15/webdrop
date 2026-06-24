<?php
declare(strict_types=1);

class ServiceController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $items = $this->db->query(
            'SELECT s.*, sc.name AS category_name FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             ORDER BY s.sort_order ASC'
        );
        Response::json($items);
    }

    public function show(int $id): void {
        Auth::require();
        $row = $this->db->queryOne('SELECT * FROM services WHERE id = ?', [$id]);
        if (!$row) { Response::error('Khong tim thay dich vu.', 404); }
        Response::json($row);
    }

    public function store(): void {
        Auth::require();
        $d    = bodyJson();
        $name = trim($d['name'] ?? '');
        if (!$name) { Response::error('Ten dich vu la bat buoc.', 422); }
        $slug = slugify($name);
        $existing = $this->db->count('SELECT COUNT(*) FROM services WHERE slug = ?', [$slug]);
        if ($existing > 0) { $slug .= '-' . time(); }
        $id = $this->db->execute(
            'INSERT INTO services (category_id, name, slug, image, category_label, description, price, duration, sort_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $d['category_id'] ? (int)$d['category_id'] : null,
                $name,
                $slug,
                trim($d['image'] ?? ''),
                trim($d['category_label'] ?? ''),
                trim($d['description'] ?? ''),
                trim($d['price'] ?? ''),
                trim($d['duration'] ?? ''),
                (int)($d['sort_order'] ?? 0),
                (int)($d['is_active'] ?? 1),
            ]
        );
        $row = $this->db->queryOne('SELECT * FROM services WHERE id = ?', [$id]);
        Response::json($row, 201);
    }

    public function update(int $id): void {
        Auth::require();
        $d    = bodyJson();
        $name = trim($d['name'] ?? '');
        if (!$name) { Response::error('Ten dich vu la bat buoc.', 422); }
        $this->db->execute(
            'UPDATE services SET category_id=?, name=?, image=?, category_label=?, description=?, price=?, duration=?, sort_order=?, is_active=? WHERE id=?',
            [
                $d['category_id'] ? (int)$d['category_id'] : null,
                $name,
                trim($d['image'] ?? ''),
                trim($d['category_label'] ?? ''),
                trim($d['description'] ?? ''),
                trim($d['price'] ?? ''),
                trim($d['duration'] ?? ''),
                (int)($d['sort_order'] ?? 0),
                (int)($d['is_active'] ?? 1),
                $id,
            ]
        );
        $row = $this->db->queryOne('SELECT * FROM services WHERE id = ?', [$id]);
        Response::json($row);
    }

    public function destroy(int $id): void {
        Auth::require();
        $this->db->execute('DELETE FROM services WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }
}
