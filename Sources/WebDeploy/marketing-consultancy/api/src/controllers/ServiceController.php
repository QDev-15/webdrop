<?php
declare(strict_types=1);

class ServiceController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json($this->db->query("SELECT * FROM services ORDER BY sort_order, id"));
    }

    public function show(array $p): void {
        Auth::require();
        $service = $this->db->queryOne("SELECT * FROM services WHERE id = ?", [$p['id']]);
        if (!$service) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($service);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề là bắt buộc.'); return; }
        $id = $this->db->execute(
            "INSERT INTO services (icon, title, short_desc, long_desc, image, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                $b['icon'] ?? '',
                $b['title'],
                $b['short_desc'] ?? '',
                $b['long_desc'] ?? '',
                $b['image'] ?? '',
                (int)($b['sort_order'] ?? 0),
                $b['status'] ?? 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE services SET icon=?, title=?, short_desc=?, long_desc=?, image=?, sort_order=?, status=? WHERE id=?",
            [
                $b['icon'] ?? '',
                $b['title'],
                $b['short_desc'] ?? '',
                $b['long_desc'] ?? '',
                $b['image'] ?? '',
                (int)($b['sort_order'] ?? 0),
                $b['status'] ?? 'published',
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM services WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
