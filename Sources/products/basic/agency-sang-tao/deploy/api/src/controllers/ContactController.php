<?php
declare(strict_types=1);

class ContactController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM contacts ORDER BY created_at DESC");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM contacts WHERE id=?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        // Auto mark as read
        if ($item['status'] === 'new') {
            $this->db->execute("UPDATE contacts SET status='read' WHERE id=?", [$p['id']]);
            $item['status'] = 'read';
        }
        Response::json($item);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute("UPDATE contacts SET status=? WHERE id=?", [$b['status'] ?? 'read', $p['id']]);
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM contacts WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
