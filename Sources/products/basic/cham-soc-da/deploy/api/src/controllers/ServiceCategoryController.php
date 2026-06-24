<?php
declare(strict_types=1);

class ServiceCategoryController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $cats = $this->db->query('SELECT * FROM service_categories ORDER BY sort_order ASC');
        Response::json($cats);
    }

    public function store(): void {
        Auth::require();
        $d    = bodyJson();
        $name = trim($d['name'] ?? '');
        if (!$name) { Response::error('Ten danh muc la bat buoc.', 422); }
        $slug = slugify($name);
        // ensure unique slug
        $existing = $this->db->count('SELECT COUNT(*) FROM service_categories WHERE slug = ?', [$slug]);
        if ($existing > 0) { $slug .= '-' . time(); }
        $id = $this->db->execute(
            'INSERT INTO service_categories (name, slug, description, icon, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)',
            [$name, $slug, trim($d['description'] ?? ''), trim($d['icon'] ?? ''), (int)($d['sort_order'] ?? 0), (int)($d['is_active'] ?? 1)]
        );
        $row = $this->db->queryOne('SELECT * FROM service_categories WHERE id = ?', [$id]);
        Response::json($row, 201);
    }

    public function update(int $id): void {
        Auth::require();
        $d    = bodyJson();
        $name = trim($d['name'] ?? '');
        if (!$name) { Response::error('Ten danh muc la bat buoc.', 422); }
        $this->db->execute(
            'UPDATE service_categories SET name=?, description=?, icon=?, sort_order=?, is_active=? WHERE id=?',
            [$name, trim($d['description'] ?? ''), trim($d['icon'] ?? ''), (int)($d['sort_order'] ?? 0), (int)($d['is_active'] ?? 1), $id]
        );
        $row = $this->db->queryOne('SELECT * FROM service_categories WHERE id = ?', [$id]);
        Response::json($row);
    }

    public function destroy(int $id): void {
        Auth::require();
        $this->db->execute('DELETE FROM service_categories WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }
}
