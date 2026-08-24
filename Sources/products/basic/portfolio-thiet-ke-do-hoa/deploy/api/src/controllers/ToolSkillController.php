<?php
declare(strict_types=1);

class ToolSkillController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM tools_skills ORDER BY sort_order, id");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM tools_skills WHERE id=?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên công cụ không được để trống.'); return; }
        $id = $this->db->execute(
            "INSERT INTO tools_skills (name, level_label, level_percent, sort_order, status) VALUES (?,?,?,?,?)",
            [$b['name'], $b['level_label'] ?? '', (int)($b['level_percent'] ?? 80), (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên công cụ không được để trống.'); return; }
        $this->db->execute(
            "UPDATE tools_skills SET name=?, level_label=?, level_percent=?, sort_order=?, status=? WHERE id=?",
            [$b['name'], $b['level_label'] ?? '', (int)($b['level_percent'] ?? 80), (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM tools_skills WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
