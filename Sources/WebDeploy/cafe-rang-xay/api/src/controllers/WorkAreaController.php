<?php
declare(strict_types=1);

class WorkAreaController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM work_areas ORDER BY sort_order, id");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM work_areas WHERE id = ?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên khu vực là bắt buộc.'); return; }
        $id = $this->db->execute(
            "INSERT INTO work_areas (name, caption, detail_title, short_sub, description, image, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $b['name'], $b['caption'] ?? '', $b['detail_title'] ?? '', $b['short_sub'] ?? '',
                $b['description'] ?? '', $b['image'] ?? '', (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên khu vực là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE work_areas SET name=?, caption=?, detail_title=?, short_sub=?, description=?, image=?, sort_order=?, status=? WHERE id=?",
            [
                $b['name'], $b['caption'] ?? '', $b['detail_title'] ?? '', $b['short_sub'] ?? '',
                $b['description'] ?? '', $b['image'] ?? '', (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published', $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM work_areas WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
