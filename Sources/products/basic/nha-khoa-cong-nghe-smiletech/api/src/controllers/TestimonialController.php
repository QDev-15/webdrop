<?php
declare(strict_types=1);

class TestimonialController
{
    public function __construct(private Database $db) {}

    public function index(): void
    {
        Auth::require();
        $rows = $this->db->query(
            "SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC"
        );
        Response::json($rows);
    }

    public function store(): void
    {
        Auth::require();
        $body       = bodyJson();
        $authorName = trim($body['author_name'] ?? '');
        $content    = trim($body['content'] ?? '');
        if (!$authorName || !$content) {
            Response::error('Ten tac gia va noi dung khong duoc de trong.', 422);
            return;
        }

        $this->db->execute(
            "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                $authorName,
                trim($body['author_title'] ?? ''),
                trim($body['author_avatar'] ?? ''),
                $content,
                (int)($body['rating'] ?? 5),
                (int)($body['sort_order'] ?? 0),
                isset($body['is_active']) ? (int)$body['is_active'] : 1,
            ]
        );
        $id  = $this->db->lastInsertId();
        $row = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]);
        Response::json($row, 201);
    }

    public function update(int $id): void
    {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]);
        if (!$row) { Response::error('Khong tim thay danh gia.', 404); return; }

        $body = bodyJson();
        $this->db->execute(
            "UPDATE testimonials SET
                author_name   = ?,
                author_title  = ?,
                author_avatar = ?,
                content       = ?,
                rating        = ?,
                sort_order    = ?,
                is_active     = ?
             WHERE id = ?",
            [
                trim($body['author_name']   ?? $row['author_name']),
                trim($body['author_title']  ?? $row['author_title']),
                trim($body['author_avatar'] ?? $row['author_avatar']),
                trim($body['content']       ?? $row['content']),
                (int)($body['rating']      ?? $row['rating']),
                (int)($body['sort_order']  ?? $row['sort_order']),
                isset($body['is_active']) ? (int)$body['is_active'] : (int)$row['is_active'],
                $id,
            ]
        );
        $updated = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]);
        Response::json($updated);
    }

    public function destroy(int $id): void
    {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]);
        if (!$row) { Response::error('Khong tim thay danh gia.', 404); return; }
        $this->db->execute("DELETE FROM testimonials WHERE id = ?", [$id]);
        Response::json(['message' => 'Da xoa danh gia.']);
    }
}
