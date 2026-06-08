<?php
declare(strict_types=1);

class ServiceController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json($this->db->query("SELECT * FROM services ORDER BY sort_order, id"));
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên dịch vụ không được để trống.'); return; }
        $slug = slugify($name);
        $id = $this->db->execute(
            "INSERT INTO services (name, slug, description, content, icon, image, sort_order, featured, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [$name, $slug, $b['description'] ?? '', $b['content'] ?? '', $b['icon'] ?? '', $b['image'] ?? '', $b['sort_order'] ?? 0, $b['featured'] ?? 0, $b['status'] ?? 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function reorder(array $p): void {
        Auth::require();
        $b = bodyJson();
        foreach ($b['ids'] ?? [] as $i => $id) {
            $this->db->execute("UPDATE services SET sort_order = ? WHERE id = ?", [$i, $id]);
        }
        Response::json(['ok' => true]);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE services SET name=?, description=?, content=?, icon=?, image=?, sort_order=?, featured=?, status=? WHERE id=?",
            [$b['name'] ?? '', $b['description'] ?? '', $b['content'] ?? '', $b['icon'] ?? '', $b['image'] ?? '', $b['sort_order'] ?? 0, $b['featured'] ?? 0, $b['status'] ?? 'published', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM services WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
