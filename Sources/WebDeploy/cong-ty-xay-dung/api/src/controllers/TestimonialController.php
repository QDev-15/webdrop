<?php
declare(strict_types=1);

class TestimonialController
{
    public function __construct(private Database $db) {}

    public function index(array $p): void
    {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM testimonials ORDER BY sort_order, id");
        Response::json($rows);
    }

    public function show(array $p): void
    {
        Auth::require();
        $id  = (int)($p['id'] ?? 0);
        $row = $this->db->row("SELECT * FROM testimonials WHERE id=?", [$id]);
        if (!$row) Response::notFound('Đánh giá không tìm thấy.');
        Response::json($row);
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
                min(5, max(1, (int)($b['rating'] ?? 5))),
                (int)($b['sort_order'] ?? 0),
                in_array($b['status'] ?? '', ['published', 'draft']) ? $b['status'] : 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void
    {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        $b  = bodyJson();

        if (empty($b['author_name']) || empty($b['content'])) {
            Response::error('Tên tác giả và nội dung không được để trống.');
        }

        $this->db->execute(
            "UPDATE testimonials SET author_name=?, author_title=?, author_avatar=?, content=?,
             rating=?, sort_order=?, status=? WHERE id=?",
            [
                $b['author_name'],
                $b['author_title']  ?? '',
                $b['author_avatar'] ?? '',
                $b['content'],
                min(5, max(1, (int)($b['rating'] ?? 5))),
                (int)($b['sort_order'] ?? 0),
                in_array($b['status'] ?? '', ['published', 'draft']) ? $b['status'] : 'published',
                $id,
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void
    {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        $this->db->execute("DELETE FROM testimonials WHERE id=?", [$id]);
        Response::json(['ok' => true]);
    }
}
