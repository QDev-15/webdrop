<?php
declare(strict_types=1);

class SkillController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query(
            "SELECT s.*, g.name as group_name FROM skills s
             LEFT JOIN skill_groups g ON g.id = s.group_id
             ORDER BY g.sort_order, s.sort_order, s.id"
        );
        Response::json($items);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên kỹ năng là bắt buộc.'); return; }
        $id = $this->db->execute(
            "INSERT INTO skills (group_id, name, sort_order, status) VALUES (?, ?, ?, ?)",
            [$b['group_id'] ?? null, $b['name'], (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên kỹ năng là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE skills SET group_id=?, name=?, sort_order=?, status=? WHERE id=?",
            [$b['group_id'] ?? null, $b['name'], (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM skills WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
