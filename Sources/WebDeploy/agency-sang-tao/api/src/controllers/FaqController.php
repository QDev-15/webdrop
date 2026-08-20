<?php
declare(strict_types=1);

class FaqController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM faqs ORDER BY sort_order, id");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM faqs WHERE id=?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['question']) || empty($b['answer'])) { Response::error('Câu hỏi và câu trả lời không được để trống.'); return; }
        $id = $this->db->execute(
            "INSERT INTO faqs (question, answer, page, sort_order, status) VALUES (?, ?, ?, ?, ?)",
            [$b['question'], $b['answer'], $b['page'] ?? 'dich-vu', $b['sort_order'] ?? 0, $b['status'] ?? 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE faqs SET question=?, answer=?, page=?, sort_order=?, status=? WHERE id=?",
            [$b['question'] ?? '', $b['answer'] ?? '', $b['page'] ?? 'dich-vu', $b['sort_order'] ?? 0, $b['status'] ?? 'published', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM faqs WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
