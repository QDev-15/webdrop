<?php
declare(strict_types=1);

class TeamController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json($this->db->query("SELECT * FROM team_members ORDER BY sort_order, id"));
    }

    public function store(array $p): void {
        Auth::require();
        $b  = bodyJson();
        $id = $this->db->execute(
            "INSERT INTO team_members (name, position, bio, avatar, sort_order, status) VALUES (?, ?, ?, ?, ?, ?)",
            [
                $b['name']       ?? '',
                $b['position']   ?? '',
                $b['bio']        ?? '',
                $b['avatar']     ?? '',
                (int)($b['sort_order'] ?? 0),
                $b['status']     ?? 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE team_members SET name=?, position=?, bio=?, avatar=?, sort_order=?, status=? WHERE id=?",
            [
                $b['name']       ?? '',
                $b['position']   ?? '',
                $b['bio']        ?? '',
                $b['avatar']     ?? '',
                (int)($b['sort_order'] ?? 0),
                $b['status']     ?? 'published',
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM team_members WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
