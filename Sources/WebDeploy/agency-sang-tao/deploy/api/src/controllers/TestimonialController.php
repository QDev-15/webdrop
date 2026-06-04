<?php
declare(strict_types=1);

class TestimonialController
{
    public function __construct(private Database $db) {}

    public function index(array $p): void
    {
        Auth::require();
        $testimonials = $this->db->query("SELECT * FROM testimonials ORDER BY sort_order, id");
        Response::json($testimonials);
    }

    public function show(array $p): void
    {
        Auth::require();
        $id = (int)$p['id'];
        $t = $this->db->row("SELECT * FROM testimonials WHERE id=?", [$id]);
        if (!$t) Response::notFound('Nhận xét không tồn tại.');
        Response::json($t);
    }

    public function store(array $p): void
    {
        Auth::require();
        $b = bodyJson();

        if (empty($b['author_name']) || empty($b['content'])) {
            Response::error('Tên tác giả và nội dung không được để trống.');
        }

        $id = $this->db->execute(
            "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order, status)
             VALUES (?,?,?,?,?,?,?)",
            [
                $b['author_name'],
                $b['author_title']  ?? '',
                $b['author_avatar'] ?? '',
                $b['content'],
                (int)($b['rating']     ?? 5),
                (int)($b['sort_order'] ?? 0),
                $b['status']        ?? 'published',
            ]
        );

        Response::json(['id' => (int)$id], 201);
    }

    public function update(array $p): void
    {
        Auth::require();
        $id = (int)$p['id'];
        $b  = bodyJson();

        if (empty($b['author_name']) || empty($b['content'])) {
            Response::error('Tên tác giả và nội dung không được để trống.');
        }

        $this->db->execute(
            "UPDATE testimonials SET author_name=?, author_title=?, author_avatar=?,
             content=?, rating=?, sort_order=?, status=? WHERE id=?",
            [
                $b['author_name'],
                $b['author_title']  ?? '',
                $b['author_avatar'] ?? '',
                $b['content'],
                (int)($b['rating']     ?? 5),
                (int)($b['sort_order'] ?? 0),
                $b['status']        ?? 'published',
                $id,
            ]
        );

        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void
    {
        Auth::require();
        $id = (int)$p['id'];
        $this->db->execute("DELETE FROM testimonials WHERE id=?", [$id]);
        Response::json(['ok' => true]);
    }
}
