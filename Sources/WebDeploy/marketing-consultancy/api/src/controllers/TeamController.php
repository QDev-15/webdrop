<?php
declare(strict_types=1);

class TeamController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json($this->db->query(
            "SELECT * FROM team_members ORDER BY CASE tier WHEN 'leadership' THEN 0 ELSE 1 END, sort_order, id"
        ));
    }

    public function show(array $p): void {
        Auth::require();
        $member = $this->db->queryOne("SELECT * FROM team_members WHERE id = ?", [$p['id']]);
        if (!$member) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($member);
    }

    private const TIERS = ['leadership', 'consultant'];

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Họ tên là bắt buộc.'); return; }
        $tier = $b['tier'] ?? 'consultant';
        if (!in_array($tier, self::TIERS, true)) { Response::error('Tier không hợp lệ.'); return; }
        $id = $this->db->execute(
            "INSERT INTO team_members (name, position, bio, avatar, tier, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                $b['name'],
                $b['position']   ?? '',
                $b['bio']        ?? '',
                $b['avatar']     ?? '',
                $tier,
                (int)($b['sort_order'] ?? 0),
                $b['status']     ?? 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Họ tên là bắt buộc.'); return; }
        $tier = $b['tier'] ?? 'consultant';
        if (!in_array($tier, self::TIERS, true)) { Response::error('Tier không hợp lệ.'); return; }
        $this->db->execute(
            "UPDATE team_members SET name=?, position=?, bio=?, avatar=?, tier=?, sort_order=?, status=? WHERE id=?",
            [
                $b['name'],
                $b['position']   ?? '',
                $b['bio']        ?? '',
                $b['avatar']     ?? '',
                $tier,
                (int)($b['sort_order'] ?? 0),
                $b['status']     ?? 'published',
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM team_members WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
