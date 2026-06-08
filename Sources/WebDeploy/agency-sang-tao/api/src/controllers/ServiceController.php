<?php
declare(strict_types=1);

class ServiceController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM services ORDER BY sort_order, id");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM services WHERE id=?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên dịch vụ không được để trống.'); return; }
        $id = $this->db->execute(
            "INSERT INTO services (name, slug, description, content, icon, image, tags, featured, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [$b['name'], slugify($b['name']), $b['description'] ?? '', $b['content'] ?? '', $b['icon'] ?? '', $b['image'] ?? '', $b['tags'] ?? '', $b['featured'] ?? 0, $b['sort_order'] ?? 0, $b['status'] ?? 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE services SET name=?, description=?, content=?, icon=?, image=?, tags=?, featured=?, sort_order=?, status=? WHERE id=?",
            [$b['name'] ?? '', $b['description'] ?? '', $b['content'] ?? '', $b['icon'] ?? '', $b['image'] ?? '', $b['tags'] ?? '', $b['featured'] ?? 0, $b['sort_order'] ?? 0, $b['status'] ?? 'published', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM services WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
