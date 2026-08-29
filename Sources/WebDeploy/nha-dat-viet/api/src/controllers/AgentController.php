<?php
declare(strict_types=1);

class AgentController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json($this->db->query("SELECT * FROM agents ORDER BY sort_order, id"));
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM agents WHERE id = ?", [$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên môi giới là bắt buộc.'); return; }
        $id = $this->db->execute(
            "INSERT INTO agents (name, title, phone, zalo, avatar, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
            [$b['name'], $b['title'] ?? '', $b['phone'] ?? '', $b['zalo'] ?? '', $b['avatar'] ?? '', (int)($b['sort_order'] ?? 0)]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) { Response::error('Tên môi giới là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE agents SET name=?, title=?, phone=?, zalo=?, avatar=?, sort_order=? WHERE id=?",
            [$b['name'], $b['title'] ?? '', $b['phone'] ?? '', $b['zalo'] ?? '', $b['avatar'] ?? '', (int)($b['sort_order'] ?? 0), $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM agents WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
