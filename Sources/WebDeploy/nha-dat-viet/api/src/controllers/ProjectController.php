<?php
declare(strict_types=1);

// Dự án đang phân phối (du-an.html) — Nhà Đất Việt hợp tác phân phối, KHÔNG phải chủ đầu tư.
class ProjectController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json($this->db->query("SELECT * FROM projects ORDER BY sort_order, id"));
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM projects WHERE id = ?", [$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tên dự án là bắt buộc.'); return; }
        $id = $this->db->execute(
            "INSERT INTO projects (title, image, status_label, description, investor, price_label, area_label, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [$b['title'], $b['image'] ?? '', $b['status_label'] ?? 'Đang mở bán', $b['description'] ?? '',
             $b['investor'] ?? '', $b['price_label'] ?? '', $b['area_label'] ?? '', (int)($b['sort_order'] ?? 0)]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tên dự án là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE projects SET title=?, image=?, status_label=?, description=?, investor=?, price_label=?, area_label=?, sort_order=? WHERE id=?",
            [$b['title'], $b['image'] ?? '', $b['status_label'] ?? 'Đang mở bán', $b['description'] ?? '',
             $b['investor'] ?? '', $b['price_label'] ?? '', $b['area_label'] ?? '', (int)($b['sort_order'] ?? 0), $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM projects WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
