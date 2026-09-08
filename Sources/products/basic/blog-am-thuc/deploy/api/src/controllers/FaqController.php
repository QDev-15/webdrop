<?php
declare(strict_types=1);

class FaqController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json($this->db->query("SELECT * FROM faqs ORDER BY sort_order, id"));
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM faqs WHERE id = ?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $question = trim($b['question'] ?? '');
        $answer   = trim($b['answer'] ?? '');
        if (!$question || !$answer) { Response::error('Câu hỏi và câu trả lời không được để trống.'); return; }
        $id = $this->db->execute(
            "INSERT INTO faqs (question, answer, sort_order, status) VALUES (?, ?, ?, ?)",
            [$question, $answer, (int)($b['sort_order'] ?? 0), ($b['status'] ?? 'published') === 'draft' ? 'draft' : 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $question = trim($b['question'] ?? '');
        $answer   = trim($b['answer'] ?? '');
        if (!$question || !$answer) { Response::error('Câu hỏi và câu trả lời không được để trống.'); return; }
        $this->db->execute(
            "UPDATE faqs SET question=?, answer=?, sort_order=?, status=? WHERE id=?",
            [$question, $answer, (int)($b['sort_order'] ?? 0), ($b['status'] ?? 'published') === 'draft' ? 'draft' : 'published', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM faqs WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
