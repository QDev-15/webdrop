<?php
declare(strict_types=1);

class DestinationController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM destinations ORDER BY sort_order, id");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM destinations WHERE id=?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên điểm đến không được để trống.'); return; }
        $id = $this->db->execute(
            "INSERT INTO destinations (name, category_label, image, sort_order, status) VALUES (?,?,?,?,?)",
            [$b['name'], $b['category_label'] ?? '', $b['image'] ?? '', (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên điểm đến không được để trống.'); return; }
        $this->db->execute(
            "UPDATE destinations SET name=?, category_label=?, image=?, sort_order=?, status=? WHERE id=?",
            [$b['name'], $b['category_label'] ?? '', $b['image'] ?? '', (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM destinations WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
