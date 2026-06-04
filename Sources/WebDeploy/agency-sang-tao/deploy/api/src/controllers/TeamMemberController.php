<?php
declare(strict_types=1);

class TeamMemberController
{
    public function __construct(private Database $db) {}

    public function index(array $p): void
    {
        Auth::require();
        $members = $this->db->query("SELECT * FROM team_members ORDER BY sort_order, id");
        Response::json($members);
    }

    public function show(array $p): void
    {
        Auth::require();
        $id = (int)$p['id'];
        $member = $this->db->row("SELECT * FROM team_members WHERE id=?", [$id]);
        if (!$member) Response::notFound('Thành viên không tồn tại.');
        Response::json($member);
    }

    public function store(array $p): void
    {
        Auth::require();
        $b = bodyJson();

        if (empty($b['name'])) {
            Response::error('Tên thành viên không được để trống.');
        }

        $id = $this->db->execute(
            "INSERT INTO team_members (name, position, bio, experience, avatar, sort_order, status)
             VALUES (?,?,?,?,?,?,?)",
            [
                $b['name'],
                $b['position']   ?? '',
                $b['bio']        ?? '',
                $b['experience'] ?? '',
                $b['avatar']     ?? '',
                (int)($b['sort_order'] ?? 0),
                $b['status']     ?? 'published',
            ]
        );

        Response::json(['id' => (int)$id], 201);
    }

    public function update(array $p): void
    {
        Auth::require();
        $id = (int)$p['id'];
        $b  = bodyJson();

        if (empty($b['name'])) {
            Response::error('Tên thành viên không được để trống.');
        }

        $this->db->execute(
            "UPDATE team_members SET name=?, position=?, bio=?, experience=?, avatar=?, sort_order=?, status=? WHERE id=?",
            [
                $b['name'],
                $b['position']   ?? '',
                $b['bio']        ?? '',
                $b['experience'] ?? '',
                $b['avatar']     ?? '',
                (int)($b['sort_order'] ?? 0),
                $b['status']     ?? 'published',
                $id,
            ]
        );

        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void
    {
        Auth::require();
        $id = (int)$p['id'];
        $this->db->execute("DELETE FROM team_members WHERE id=?", [$id]);
        Response::json(['ok' => true]);
    }
}
