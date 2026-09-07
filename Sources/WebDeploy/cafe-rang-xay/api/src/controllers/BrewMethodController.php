<?php
declare(strict_types=1);

class BrewMethodController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM brew_methods ORDER BY sort_order, id");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM brew_methods WHERE id = ?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên phương pháp là bắt buộc.'); return; }
        $id = $this->db->execute(
            "INSERT INTO brew_methods (icon, name, description, tag, sort_order, status) VALUES (?, ?, ?, ?, ?, ?)",
            [$b['icon'] ?? '☕', $b['name'], $b['description'] ?? '', $b['tag'] ?? '', (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên phương pháp là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE brew_methods SET icon=?, name=?, description=?, tag=?, sort_order=?, status=? WHERE id=?",
            [$b['icon'] ?? '☕', $b['name'], $b['description'] ?? '', $b['tag'] ?? '', (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM brew_methods WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
