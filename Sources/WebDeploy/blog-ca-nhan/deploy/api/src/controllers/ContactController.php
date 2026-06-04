<?php
declare(strict_types=1);

class ContactController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $status = $_GET['status'] ?? '';
        $where  = $status ? "WHERE status = ?" : "";
        $params = $status ? [$status] : [];
        $rows = $this->db->query(
            "SELECT * FROM contacts $where ORDER BY created_at DESC",
            $params
        );
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM contacts WHERE id = ?", [$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        // Auto mark as read
        if ($row['status'] === 'new') {
            $this->db->execute("UPDATE contacts SET status = 'read' WHERE id = ?", [$p['id']]);
            $row['status'] = 'read';
        }
        Response::json($row);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $status = $b['status'] ?? 'read';
        $this->db->execute("UPDATE contacts SET status = ? WHERE id = ?", [$status, $p['id']]);
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM contacts WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
