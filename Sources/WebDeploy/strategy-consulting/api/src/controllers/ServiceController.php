<?php
declare(strict_types=1);

class ServiceController {
    private const STATUSES = ['published', 'draft'];

    public function __construct(private Database $db) {}

    private function resolveStatus(array $b): string {
        $status = $b['status'] ?? 'published';
        return in_array($status, self::STATUSES, true) ? $status : 'published';
    }

    public function index(array $p): void {
        Auth::require();
        $services = $this->db->query("SELECT * FROM services ORDER BY sort_order, id");
        Response::json($services);
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
            "INSERT INTO services (icon, title, description, sort_order, status) VALUES (?, ?, ?, ?, ?)",
            [$b['icon'] ?? '', $b['title'], $b['description'] ?? '', (int)($b['sort_order'] ?? 0), $this->resolveStatus($b)]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE services SET icon=?, title=?, description=?, sort_order=?, status=? WHERE id=?",
            [$b['icon'] ?? '', $b['title'], $b['description'] ?? '', (int)($b['sort_order'] ?? 0), $this->resolveStatus($b), $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM services WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
