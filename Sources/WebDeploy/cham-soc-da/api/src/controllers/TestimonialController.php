<?php
declare(strict_types=1);

class TestimonialController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $items = $this->db->query('SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC');
        Response::json($items);
    }

    public function show(int $id): void {
        Auth::require();
        $row = $this->db->queryOne('SELECT * FROM testimonials WHERE id = ?', [$id]);
        if (!$row) { Response::error('Khong tim thay danh gia.', 404); }
        Response::json($row);
    }

    public function store(): void {
        Auth::require();
        $d    = bodyJson();
        $name = trim($d['author_name'] ?? '');
        if (!$name) { Response::error('Ten khach hang la bat buoc.', 422); }
        $id = $this->db->execute(
            'INSERT INTO testimonials (author_name, author_avatar, condition, content, rating, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                $name,
                trim($d['author_avatar'] ?? ''),
                trim($d['condition'] ?? ''),
                trim($d['content'] ?? ''),
                (int)($d['rating'] ?? 5),
                (int)($d['sort_order'] ?? 0),
                (int)($d['is_active'] ?? 1),
            ]
        );
        $row = $this->db->queryOne('SELECT * FROM testimonials WHERE id = ?', [$id]);
        Response::json($row, 201);
    }

    public function update(int $id): void {
        Auth::require();
        $d    = bodyJson();
        $name = trim($d['author_name'] ?? '');
        if (!$name) { Response::error('Ten khach hang la bat buoc.', 422); }
        $this->db->execute(
            'UPDATE testimonials SET author_name=?, author_avatar=?, condition=?, content=?, rating=?, sort_order=?, is_active=? WHERE id=?',
            [
                $name,
                trim($d['author_avatar'] ?? ''),
                trim($d['condition'] ?? ''),
                trim($d['content'] ?? ''),
                (int)($d['rating'] ?? 5),
                (int)($d['sort_order'] ?? 0),
                (int)($d['is_active'] ?? 1),
                $id,
            ]
        );
        $row = $this->db->queryOne('SELECT * FROM testimonials WHERE id = ?', [$id]);
        Response::json($row);
    }

    public function destroy(int $id): void {
        Auth::require();
        $this->db->execute('DELETE FROM testimonials WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }
}
