<?php
declare(strict_types=1);

class SkillGroupController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $groups = $this->db->query("SELECT * FROM skill_groups ORDER BY sort_order, id");
        foreach ($groups as &$group) {
            $group['skills'] = $this->db->query(
                "SELECT * FROM skills WHERE group_id = ? ORDER BY sort_order, id",
                [$group['id']]
            );
        }
        Response::json($groups);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên nhóm là bắt buộc.'); return; }
        $id = $this->db->execute(
            "INSERT INTO skill_groups (name, sort_order) VALUES (?, ?)",
            [$b['name'], (int)($b['sort_order'] ?? 0)]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên nhóm là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE skill_groups SET name=?, sort_order=? WHERE id=?",
            [$b['name'], (int)($b['sort_order'] ?? 0), $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM skills WHERE group_id = ?", [$p['id']]);
        $this->db->execute("DELETE FROM skill_groups WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
