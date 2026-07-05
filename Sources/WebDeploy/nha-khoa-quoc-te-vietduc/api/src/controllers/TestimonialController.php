<?php
declare(strict_types=1);

class TestimonialController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT id, author_name, author_role, author_avatar, stars, content, is_active, sort_order, created_at
             FROM testimonials ORDER BY sort_order ASC"
        );
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne(
            "SELECT id, author_name, author_role, author_avatar, stars, content, is_active, sort_order
             FROM testimonials WHERE id = ?",
            [(int)$p[1]]
        );
        if (!$row) { Response::error('Khong tim thay.', 404); return; }
        Response::json($row);
    }

    public function store(): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['author_name']) || empty($b['content'])) {
            Response::error('Ten tac gia va noi dung la bat buoc.'); return;
        }
        $id = $this->db->execute(
            "INSERT INTO testimonials (author_name, author_role, author_avatar, stars, content, is_active, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                trim($b['author_name']),
                trim($b['author_role']   ?? ''),
                trim($b['author_avatar'] ?? ''),
                (int)($b['stars']        ?? 5),
                trim($b['content']),
                isset($b['is_active']) ? (int)$b['is_active'] : 1,
                (int)($b['sort_order']   ?? 0),
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b  = bodyJson();
        $id = (int)$p[1];
        if (empty($b['author_name']) || empty($b['content'])) {
            Response::error('Ten tac gia va noi dung la bat buoc.'); return;
        }
        $this->db->execute(
            "UPDATE testimonials SET author_name=?, author_role=?, author_avatar=?,
             stars=?, content=?, is_active=?, sort_order=? WHERE id=?",
            [
                trim($b['author_name']),
                trim($b['author_role']   ?? ''),
                trim($b['author_avatar'] ?? ''),
                (int)($b['stars']        ?? 5),
                trim($b['content']),
                isset($b['is_active']) ? (int)$b['is_active'] : 1,
                (int)($b['sort_order']   ?? 0),
                $id,
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM testimonials WHERE id = ?", [(int)$p[1]]);
        Response::json(['ok' => true]);
    }
}
