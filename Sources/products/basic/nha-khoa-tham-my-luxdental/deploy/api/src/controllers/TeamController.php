<?php
declare(strict_types=1);

class TeamController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM doctors ORDER BY sort_order ASC");
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        if (!$id) { Response::json(['error' => 'ID không hợp lệ.'], 400); return; }
        $row = $this->db->queryOne("SELECT * FROM doctors WHERE id = ?", [$id]);
        if (!$row) { Response::json(['error' => 'Không tìm thấy.'], 404); return; }
        Response::json($row);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::json(['error' => 'Tên bác sĩ không được để trống.'], 400); return; }
        $id = $this->db->execute(
            "INSERT INTO doctors (name, role, photo, description, experience_years, credentials, tag, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $name,
                trim($b['role']             ?? ''),
                trim($b['photo']            ?? ''),
                trim($b['description']      ?? ''),
                (int)($b['experience_years'] ?? 0),
                trim($b['credentials']      ?? ''),
                trim($b['tag']              ?? ''),
                (int)($b['sort_order']      ?? 0),
            ]
        );
        Response::json(['id' => $id, 'ok' => true]);
    }

    public function update(array $p): void {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        if (!$id) { Response::json(['error' => 'ID không hợp lệ.'], 400); return; }
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::json(['error' => 'Tên bác sĩ không được để trống.'], 400); return; }
        $this->db->execute(
            "UPDATE doctors SET name = ?, role = ?, photo = ?, description = ?,
             experience_years = ?, credentials = ?, tag = ?, sort_order = ? WHERE id = ?",
            [
                $name,
                trim($b['role']             ?? ''),
                trim($b['photo']            ?? ''),
                trim($b['description']      ?? ''),
                (int)($b['experience_years'] ?? 0),
                trim($b['credentials']      ?? ''),
                trim($b['tag']              ?? ''),
                (int)($b['sort_order']      ?? 0),
                $id,
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        if (!$id) { Response::json(['error' => 'ID không hợp lệ.'], 400); return; }
        $this->db->execute("DELETE FROM doctors WHERE id = ?", [$id]);
        Response::json(['ok' => true]);
    }
}
