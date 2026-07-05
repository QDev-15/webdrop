<?php
declare(strict_types=1);

class TeamController {
    public function __construct(private Database $db) {}

    public function index(array $p = []): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM doctors ORDER BY sort_order, id");
        Response::json($items);
    }

    public function store(array $p = []): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Ten bac si la bat buoc.', 422); return; }
        $id = $this->db->execute(
            "INSERT INTO doctors (name, role, experience_years, photo, tags, quote, sort_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $b['name'],
                $b['role']             ?? '',
                (int)($b['experience_years'] ?? 0),
                $b['photo']            ?? '',
                $b['tags']             ?? '',
                $b['quote']            ?? '',
                (int)($b['sort_order'] ?? 0),
                (int)($b['is_active']  ?? 1),
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p = []): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Ten bac si la bat buoc.', 422); return; }
        $this->db->execute(
            "UPDATE doctors SET name=?, role=?, experience_years=?, photo=?, tags=?, quote=?, sort_order=?, is_active=?
             WHERE id=?",
            [
                $b['name'],
                $b['role']             ?? '',
                (int)($b['experience_years'] ?? 0),
                $b['photo']            ?? '',
                $b['tags']             ?? '',
                $b['quote']            ?? '',
                (int)($b['sort_order'] ?? 0),
                (int)($b['is_active']  ?? 1),
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p = []): void {
        Auth::require();
        $this->db->execute("DELETE FROM doctors WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
