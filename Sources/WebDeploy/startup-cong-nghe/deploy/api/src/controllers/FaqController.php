<?php

class FaqController {
    private Database $db;
    public function __construct(Database $db) { $this->db = $db; }

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM faqs ORDER BY sort_order, id");
        Response::json($items);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['question']) || empty($b['answer'])) {
            Response::error('Câu hỏi và câu trả lời không được để trống');
        }
        $id = $this->db->execute(
            "INSERT INTO faqs (question, answer, sort_order, status) VALUES (?, ?, ?, ?)",
            [
                strip_tags($b['question']),
                $b['answer'],
                (int)($b['sort_order'] ?? 0),
                $b['status']           ?? 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE faqs SET question=?, answer=?, sort_order=?, status=? WHERE id=?",
            [
                strip_tags($b['question']  ?? ''),
                $b['answer']               ?? '',
                (int)($b['sort_order']     ?? 0),
                $b['status']               ?? 'published',
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM faqs WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
