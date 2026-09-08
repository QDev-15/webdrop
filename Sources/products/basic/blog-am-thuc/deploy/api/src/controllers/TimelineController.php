<?php
declare(strict_types=1);

class TimelineController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json($this->db->query("SELECT * FROM timeline_items ORDER BY sort_order, id"));
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM timeline_items WHERE id = ?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $year  = trim($b['year'] ?? '');
        $title = trim($b['title'] ?? '');
        if (!$year || !$title) { Response::error('Năm và tiêu đề không được để trống.'); return; }
        $id = $this->db->execute(
            "INSERT INTO timeline_items (year, title, description, sort_order) VALUES (?, ?, ?, ?)",
            [$year, $title, (string)($b['description'] ?? ''), (int)($b['sort_order'] ?? 0)]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $year  = trim($b['year'] ?? '');
        $title = trim($b['title'] ?? '');
        if (!$year || !$title) { Response::error('Năm và tiêu đề không được để trống.'); return; }
        $this->db->execute(
            "UPDATE timeline_items SET year=?, title=?, description=?, sort_order=? WHERE id=?",
            [$year, $title, (string)($b['description'] ?? ''), (int)($b['sort_order'] ?? 0), $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM timeline_items WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
