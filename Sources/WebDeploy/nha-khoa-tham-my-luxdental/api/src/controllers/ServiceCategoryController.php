<?php
declare(strict_types=1);

class ServiceCategoryController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM service_categories ORDER BY sort_order ASC");
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        if (!$id) { Response::json(['error' => 'ID không hợp lệ.'], 400); return; }
        $row = $this->db->queryOne("SELECT * FROM service_categories WHERE id = ?", [$id]);
        if (!$row) { Response::json(['error' => 'Không tìm thấy.'], 404); return; }
        Response::json($row);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        $slug = trim($b['slug'] ?? '');
        if (!$name) { Response::json(['error' => 'Tên nhóm không được để trống.'], 400); return; }
        if (!$slug) $slug = strtolower(preg_replace('/\s+/', '-', $name));
        $sort = (int)($b['sort_order'] ?? 0);
        try {
            $id = $this->db->execute(
                "INSERT INTO service_categories (name, slug, sort_order) VALUES (?, ?, ?)",
                [$name, $slug, $sort]
            );
            Response::json(['id' => $id, 'ok' => true]);
        } catch (\Exception $e) {
            Response::json(['error' => 'Slug đã tồn tại.'], 409);
        }
    }

    public function update(array $p): void {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        if (!$id) { Response::json(['error' => 'ID không hợp lệ.'], 400); return; }
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        $slug = trim($b['slug'] ?? '');
        if (!$name) { Response::json(['error' => 'Tên nhóm không được để trống.'], 400); return; }
        $sort = (int)($b['sort_order'] ?? 0);
        $this->db->execute(
            "UPDATE service_categories SET name = ?, slug = ?, sort_order = ? WHERE id = ?",
            [$name, $slug, $sort, $id]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        if (!$id) { Response::json(['error' => 'ID không hợp lệ.'], 400); return; }
        $this->db->execute("DELETE FROM service_categories WHERE id = ?", [$id]);
        Response::json(['ok' => true]);
    }
}
