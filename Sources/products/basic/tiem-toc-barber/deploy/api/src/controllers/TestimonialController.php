<?php
declare(strict_types=1);

class TestimonialController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query('SELECT * FROM testimonials ORDER BY sort_order ASC, id ASC');
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne('SELECT * FROM testimonials WHERE id = ?', [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name = trim($b['customer_name'] ?? '');
        $content = trim($b['content'] ?? '');
        if (!$name || !$content) { Response::error('Tên khách hàng và nội dung là bắt buộc.'); return; }
        $id = $this->db->execute(
            'INSERT INTO testimonials (customer_name, avatar, meta, rating, content, status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                $name, trim($b['avatar'] ?? ''), trim($b['meta'] ?? ''),
                (int)($b['rating'] ?? 5), $content,
                $b['status'] ?? 'published', (int)($b['sort_order'] ?? 0),
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $id = (int)$p['id'];
        $existing = $this->db->queryOne('SELECT id FROM testimonials WHERE id = ?', [$id]);
        if (!$existing) { Response::error('Không tìm thấy.', 404); return; }
        $b = bodyJson();
        $name = trim($b['customer_name'] ?? '');
        $content = trim($b['content'] ?? '');
        if (!$name || !$content) { Response::error('Tên khách hàng và nội dung là bắt buộc.'); return; }
        $this->db->execute(
            'UPDATE testimonials SET customer_name=?, avatar=?, meta=?, rating=?, content=?, status=?, sort_order=? WHERE id=?',
            [
                $name, trim($b['avatar'] ?? ''), trim($b['meta'] ?? ''),
                (int)($b['rating'] ?? 5), $content,
                $b['status'] ?? 'published', (int)($b['sort_order'] ?? 0), $id,
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute('DELETE FROM testimonials WHERE id = ?', [(int)$p['id']]);
        Response::json(['ok' => true]);
    }
}
