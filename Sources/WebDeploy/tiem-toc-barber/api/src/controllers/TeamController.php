<?php
declare(strict_types=1);

class TeamController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query('SELECT * FROM team ORDER BY sort_order ASC, id ASC');
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne('SELECT * FROM team WHERE id = ?', [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên là bắt buộc.'); return; }
        $id = $this->db->execute(
            'INSERT INTO team (name, role, specialty, image, sort_order, status) VALUES (?, ?, ?, ?, ?, ?)',
            [$name, trim($b['role'] ?? ''), trim($b['specialty'] ?? ''), trim($b['image'] ?? ''),
             (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $id = (int)$p['id'];
        $existing = $this->db->queryOne('SELECT id FROM team WHERE id = ?', [$id]);
        if (!$existing) { Response::error('Không tìm thấy.', 404); return; }
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên là bắt buộc.'); return; }
        $this->db->execute(
            'UPDATE team SET name=?, role=?, specialty=?, image=?, sort_order=?, status=? WHERE id=?',
            [$name, trim($b['role'] ?? ''), trim($b['specialty'] ?? ''), trim($b['image'] ?? ''),
             (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published', $id]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute('DELETE FROM team WHERE id = ?', [(int)$p['id']]);
        Response::json(['ok' => true]);
    }
}
