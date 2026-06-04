<?php
declare(strict_types=1);

class TeamMemberController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $members = $this->db->query("SELECT * FROM team_members ORDER BY sort_order, id");
        Response::json($members);
    }

    public function show(array $p): void {
        Auth::require();
        $m = $this->db->queryOne("SELECT * FROM team_members WHERE id=?", [$p['id']]);
        if (!$m) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($m);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên không được để trống.'); return; }
        $id = $this->db->execute(
            "INSERT INTO team_members (name, position, bio, experience, avatar, certificates, is_leader, sort_order, status) VALUES (?,?,?,?,?,?,?,?,?)",
            [$b['name'], $b['position'] ?? '', $b['bio'] ?? '', $b['experience'] ?? '', $b['avatar'] ?? '', $b['certificates'] ?? '', $b['is_leader'] ?? 0, $b['sort_order'] ?? 0, $b['status'] ?? 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE team_members SET name=?, position=?, bio=?, experience=?, avatar=?, certificates=?, is_leader=?, sort_order=?, status=? WHERE id=?",
            [$b['name'] ?? '', $b['position'] ?? '', $b['bio'] ?? '', $b['experience'] ?? '', $b['avatar'] ?? '', $b['certificates'] ?? '', $b['is_leader'] ?? 0, $b['sort_order'] ?? 0, $b['status'] ?? 'published', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM team_members WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
