<?php
declare(strict_types=1);

class TestimonialController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json($this->db->query("SELECT * FROM testimonials ORDER BY sort_order, id"));
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['author_name'])) { Response::error('Tên khách hàng là bắt buộc.'); return; }
        $id = $this->db->execute(
            "INSERT INTO testimonials (author_name, author_role, avatar, content, sort_order) VALUES (?, ?, ?, ?, ?)",
            [$b['author_name'], $b['author_role'] ?? '', $b['avatar'] ?? '', $b['content'] ?? '', (int)($b['sort_order'] ?? 0)]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['author_name'])) { Response::error('Tên khách hàng là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE testimonials SET author_name=?, author_role=?, avatar=?, content=?, sort_order=? WHERE id=?",
            [$b['author_name'], $b['author_role'] ?? '', $b['avatar'] ?? '', $b['content'] ?? '', (int)($b['sort_order'] ?? 0), $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM testimonials WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
