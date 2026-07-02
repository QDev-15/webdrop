<?php
declare(strict_types=1);

class ServiceCategoryController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query('SELECT * FROM service_categories ORDER BY sort_order ASC, id ASC');
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne('SELECT * FROM service_categories WHERE id = ?', [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên danh mục là bắt buộc.'); return; }
        $slug = trim($b['slug'] ?? '') ?: slugify($name);
        $id = $this->db->execute(
            'INSERT INTO service_categories (name, slug, icon, tag, sort_order) VALUES (?, ?, ?, ?, ?)',
            [$name, $slug, trim($b['icon'] ?? ''), trim($b['tag'] ?? ''), (int)($b['sort_order'] ?? 0)]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $id = (int)$p['id'];
        $existing = $this->db->queryOne('SELECT id FROM service_categories WHERE id = ?', [$id]);
        if (!$existing) { Response::error('Không tìm thấy.', 404); return; }
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên danh mục là bắt buộc.'); return; }
        $slug = trim($b['slug'] ?? '') ?: slugify($name);
        $this->db->execute(
            'UPDATE service_categories SET name=?, slug=?, icon=?, tag=?, sort_order=? WHERE id=?',
            [$name, $slug, trim($b['icon'] ?? ''), trim($b['tag'] ?? ''), (int)($b['sort_order'] ?? 0), $id]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute('DELETE FROM service_categories WHERE id = ?', [(int)$p['id']]);
        Response::json(['ok' => true]);
    }
}
