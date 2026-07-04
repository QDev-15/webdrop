<?php
declare(strict_types=1);

class TeamController
{
    public function __construct(private Database $db) {}

    public function index(): void
    {
        Auth::require();
        $rows = $this->db->query(
            "SELECT * FROM team_members ORDER BY sort_order ASC, created_at DESC"
        );
        Response::json($rows);
    }

    public function store(): void
    {
        Auth::require();
        $body = bodyJson();
        $name = trim($body['name'] ?? '');
        if (!$name) { Response::error('Ten bac si khong duoc de trong.', 422); return; }

        $this->db->execute(
            "INSERT INTO team_members (name, role, bio, photo, sort_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?)",
            [
                $name,
                trim($body['role']  ?? ''),
                trim($body['bio']   ?? ''),
                trim($body['photo'] ?? ''),
                (int)($body['sort_order'] ?? 0),
                isset($body['is_active']) ? (int)$body['is_active'] : 1,
            ]
        );
        $id  = $this->db->lastInsertId();
        $row = $this->db->queryOne("SELECT * FROM team_members WHERE id = ?", [$id]);
        Response::json($row, 201);
    }

    public function update(int $id): void
    {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM team_members WHERE id = ?", [$id]);
        if (!$row) { Response::error('Khong tim thay bac si.', 404); return; }

        $body = bodyJson();
        $this->db->execute(
            "UPDATE team_members SET
                name       = ?,
                role       = ?,
                bio        = ?,
                photo      = ?,
                sort_order = ?,
                is_active  = ?
             WHERE id = ?",
            [
                trim($body['name']  ?? $row['name']),
                trim($body['role']  ?? $row['role']),
                trim($body['bio']   ?? $row['bio']),
                trim($body['photo'] ?? $row['photo']),
                isset($body['sort_order']) ? (int)$body['sort_order'] : (int)$row['sort_order'],
                isset($body['is_active'])  ? (int)$body['is_active']  : (int)$row['is_active'],
                $id,
            ]
        );
        $updated = $this->db->queryOne("SELECT * FROM team_members WHERE id = ?", [$id]);
        Response::json($updated);
    }

    public function destroy(int $id): void
    {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM team_members WHERE id = ?", [$id]);
        if (!$row) { Response::error('Khong tim thay bac si.', 404); return; }
        $this->db->execute("DELETE FROM team_members WHERE id = ?", [$id]);
        Response::json(['message' => 'Da xoa bac si.']);
    }
}
