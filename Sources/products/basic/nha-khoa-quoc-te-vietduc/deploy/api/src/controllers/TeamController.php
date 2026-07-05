<?php
declare(strict_types=1);

class TeamController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT id, name, role, flag, experience_years, photo, tags, description, sort_order, is_active, created_at
             FROM doctors ORDER BY sort_order ASC"
        );
        foreach ($rows as &$r) {
            $r['tags'] = $r['tags'] ? explode('|', $r['tags']) : [];
        }
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne(
            "SELECT id, name, role, flag, experience_years, photo, tags, description, sort_order, is_active
             FROM doctors WHERE id = ?",
            [(int)$p[1]]
        );
        if (!$row) { Response::error('Khong tim thay.', 404); return; }
        $row['tags'] = $row['tags'] ? explode('|', $row['tags']) : [];
        Response::json($row);
    }

    public function store(): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Ten bac si la bat buoc.'); return; }
        $tags = is_array($b['tags'] ?? null)
              ? implode('|', $b['tags'])
              : trim($b['tags'] ?? '');
        $id = $this->db->execute(
            "INSERT INTO doctors (name, role, flag, experience_years, photo, tags, description, sort_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                trim($b['name']),
                trim($b['role']        ?? ''),
                trim($b['flag']        ?? 'Trong nuoc'),
                (int)($b['experience_years'] ?? 0),
                trim($b['photo']       ?? ''),
                $tags,
                trim($b['description'] ?? ''),
                (int)($b['sort_order'] ?? 0),
                isset($b['is_active']) ? (int)$b['is_active'] : 1,
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b  = bodyJson();
        $id = (int)$p[1];
        if (empty($b['name'])) { Response::error('Ten bac si la bat buoc.'); return; }
        $tags = is_array($b['tags'] ?? null)
              ? implode('|', $b['tags'])
              : trim($b['tags'] ?? '');
        $this->db->execute(
            "UPDATE doctors SET name=?, role=?, flag=?, experience_years=?, photo=?,
             tags=?, description=?, sort_order=?, is_active=? WHERE id=?",
            [
                trim($b['name']),
                trim($b['role']        ?? ''),
                trim($b['flag']        ?? 'Trong nuoc'),
                (int)($b['experience_years'] ?? 0),
                trim($b['photo']       ?? ''),
                $tags,
                trim($b['description'] ?? ''),
                (int)($b['sort_order'] ?? 0),
                isset($b['is_active']) ? (int)$b['is_active'] : 1,
                $id,
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM doctors WHERE id = ?", [(int)$p[1]]);
        Response::json(['ok' => true]);
    }
}
