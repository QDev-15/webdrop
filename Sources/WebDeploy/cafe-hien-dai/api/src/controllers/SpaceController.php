<?php
declare(strict_types=1);

class SpaceController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM spaces ORDER BY sort_order, id");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM spaces WHERE id = ?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên khu vực là bắt buộc.'); return; }
        $id = $this->db->execute(
            "INSERT INTO spaces (name, caption, overlay_text, description, image, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [$b['name'], $b['caption'] ?? '', $b['overlay_text'] ?? '', $b['description'] ?? '', $b['image'] ?? '', (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên khu vực là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE spaces SET name=?, caption=?, overlay_text=?, description=?, image=?, sort_order=?, status=? WHERE id=?",
            [$b['name'], $b['caption'] ?? '', $b['overlay_text'] ?? '', $b['description'] ?? '', $b['image'] ?? '', (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM spaces WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
