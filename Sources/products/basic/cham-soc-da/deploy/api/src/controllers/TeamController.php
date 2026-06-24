<?php
declare(strict_types=1);

class TeamController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $items = $this->db->query('SELECT * FROM team_members ORDER BY sort_order ASC');
        Response::json($items);
    }

    public function show(int $id): void {
        Auth::require();
        $row = $this->db->queryOne('SELECT * FROM team_members WHERE id = ?', [$id]);
        if (!$row) { Response::error('Khong tim thay bac si.', 404); }
        Response::json($row);
    }

    public function store(): void {
        Auth::require();
        $d    = bodyJson();
        $name = trim($d['name'] ?? '');
        if (!$name) { Response::error('Ten bac si la bat buoc.', 422); }
        $id = $this->db->execute(
            'INSERT INTO team_members (name, role, speciality, experience, image, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                $name,
                trim($d['role'] ?? ''),
                trim($d['speciality'] ?? ''),
                trim($d['experience'] ?? ''),
                trim($d['image'] ?? ''),
                (int)($d['sort_order'] ?? 0),
                (int)($d['is_active'] ?? 1),
            ]
        );
        $row = $this->db->queryOne('SELECT * FROM team_members WHERE id = ?', [$id]);
        Response::json($row, 201);
    }

    public function update(int $id): void {
        Auth::require();
        $d    = bodyJson();
        $name = trim($d['name'] ?? '');
        if (!$name) { Response::error('Ten bac si la bat buoc.', 422); }
        $this->db->execute(
            'UPDATE team_members SET name=?, role=?, speciality=?, experience=?, image=?, sort_order=?, is_active=? WHERE id=?',
            [
                $name,
                trim($d['role'] ?? ''),
                trim($d['speciality'] ?? ''),
                trim($d['experience'] ?? ''),
                trim($d['image'] ?? ''),
                (int)($d['sort_order'] ?? 0),
                (int)($d['is_active'] ?? 1),
                $id,
            ]
        );
        $row = $this->db->queryOne('SELECT * FROM team_members WHERE id = ?', [$id]);
        Response::json($row);
    }

    public function destroy(int $id): void {
        Auth::require();
        $this->db->execute('DELETE FROM team_members WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }
}
