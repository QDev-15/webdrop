<?php

class CaseController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM cases ORDER BY sort_order, year DESC, id");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM cases WHERE id=?", [$p['id']]);
        if (!$item) Response::notFound();
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) Response::error('Tiêu đề không được để trống');
        $id = $this->db->execute(
            "INSERT INTO cases (title, category, summary, outcome, year, location, sort_order, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $b['title'],
                $b['category']   ?? '',
                $b['summary']    ?? '',
                $b['outcome']    ?? '',
                (int)($b['year'] ?? date('Y')),
                $b['location']   ?? '',
                (int)($b['sort_order'] ?? 0),
                $b['status']     ?? 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) Response::error('Tiêu đề không được để trống');
        $this->db->execute(
            "UPDATE cases SET title=?, category=?, summary=?, outcome=?, year=?, location=?, sort_order=?, status=?
             WHERE id=?",
            [
                $b['title'],
                $b['category']   ?? '',
                $b['summary']    ?? '',
                $b['outcome']    ?? '',
                (int)($b['year'] ?? date('Y')),
                $b['location']   ?? '',
                (int)($b['sort_order'] ?? 0),
                $b['status']     ?? 'published',
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM cases WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
