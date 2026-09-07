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
        $item = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    private function fields(array $b): array {
        return [
            'author_name'   => trim((string)($b['author_name'] ?? '')),
            'author_role'   => (string)($b['author_role'] ?? ''),
            'author_avatar' => (string)($b['author_avatar'] ?? ''),
            'content'       => (string)($b['content'] ?? ''),
            'rating'        => max(1, min(5, (int)($b['rating'] ?? 5))),
            'sort_order'    => (int)($b['sort_order'] ?? 0),
            'status'        => ($b['status'] ?? 'published') === 'draft' ? 'draft' : 'published',
        ];
    }

    public function store(array $p): void {
        Auth::require();
        $f = $this->fields(bodyJson());
        if (!$f['author_name'] || !$f['content']) { Response::error('Tên và nội dung không được để trống.'); return; }
        $id = $this->db->execute(
            "INSERT INTO testimonials (author_name, author_role, author_avatar, content, rating, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [$f['author_name'], $f['author_role'], $f['author_avatar'], $f['content'], $f['rating'], $f['sort_order'], $f['status']]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $f = $this->fields(bodyJson());
        if (!$f['author_name'] || !$f['content']) { Response::error('Tên và nội dung không được để trống.'); return; }
        $this->db->execute(
            "UPDATE testimonials SET author_name=?, author_role=?, author_avatar=?, content=?, rating=?, sort_order=?, status=? WHERE id=?",
            [$f['author_name'], $f['author_role'], $f['author_avatar'], $f['content'], $f['rating'], $f['sort_order'], $f['status'], $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM testimonials WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
