<?php
declare(strict_types=1);

class FaqController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $faqs = $this->db->query("SELECT * FROM faqs ORDER BY sort_order, id");
        Response::json($faqs);
    }

    public function show(array $p): void {
        Auth::require();
        $faq = $this->db->queryOne("SELECT * FROM faqs WHERE id = ?", [$p['id']]);
        if (!$faq) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($faq);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['question']) || empty($b['answer'])) { Response::error('Câu hỏi và câu trả lời là bắt buộc.'); return; }
        $id = $this->db->execute(
            "INSERT INTO faqs (question, answer, page, sort_order, status) VALUES (?, ?, ?, ?, ?)",
            [$b['question'], $b['answer'], $b['page'] ?? 'dich-vu', (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['question']) || empty($b['answer'])) { Response::error('Câu hỏi và câu trả lời là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE faqs SET question=?, answer=?, page=?, sort_order=?, status=? WHERE id=?",
            [$b['question'], $b['answer'], $b['page'] ?? 'dich-vu', (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM faqs WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
