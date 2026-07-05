<?php
declare(strict_types=1);

class TeamController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM doctors ORDER BY sort_order ASC, created_at ASC");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $id = (int)$p['id'];
        if (!$id) { Response::error('ID không hợp lệ.', 400); return; }
        $item = $this->db->queryOne("SELECT * FROM doctors WHERE id = ?", [$id]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b    = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên bác sĩ là bắt buộc.', 422); return; }

        $id = $this->db->execute(
            "INSERT INTO doctors (name, role, bio, photo, experience_years, specialties, sort_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $name,
                trim($b['role']             ?? ''),
                trim($b['bio']              ?? ''),
                trim($b['photo']            ?? ''),
                (int)($b['experience_years'] ?? 0),
                trim($b['specialties']       ?? ''),
                (int)($b['sort_order']       ?? 0),
                isset($b['is_active']) ? (int)$b['is_active'] : 1,
            ]
        );
        Response::json(['ok' => true, 'id' => $id]);
    }

    public function update(array $p): void {
        Auth::require();
        $b  = bodyJson();
        $id = (int)$p['id'];
        if (!$id) { Response::error('ID không hợp lệ.', 400); return; }

        $this->db->execute(
            "UPDATE doctors SET name = ?, role = ?, bio = ?, photo = ?, experience_years = ?, specialties = ?, sort_order = ?, is_active = ? WHERE id = ?",
            [
                trim($b['name']              ?? ''),
                trim($b['role']              ?? ''),
                trim($b['bio']               ?? ''),
                trim($b['photo']             ?? ''),
                (int)($b['experience_years']  ?? 0),
                trim($b['specialties']        ?? ''),
                (int)($b['sort_order']        ?? 0),
                isset($b['is_active']) ? (int)$b['is_active'] : 1,
                $id,
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $id = (int)$p['id'];
        if (!$id) { Response::error('ID không hợp lệ.', 400); return; }
        $this->db->execute("DELETE FROM doctors WHERE id = ?", [$id]);
        Response::json(['ok' => true]);
    }
}
