<?php
declare(strict_types=1);

class ContactController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $status = $_GET['status'] ?? '';
        if ($status) {
            $contacts = $this->db->query(
                "SELECT * FROM contacts WHERE status=? ORDER BY created_at DESC", [$status]
            );
        } else {
            $contacts = $this->db->query("SELECT * FROM contacts ORDER BY created_at DESC");
        }
        Response::json($contacts);
    }

    public function show(array $p): void {
        Auth::require();
        $c = $this->db->queryOne("SELECT * FROM contacts WHERE id=?", [$p['id']]);
        if (!$c) { Response::error('Không tìm thấy.', 404); return; }
        // Mark as read
        if ($c['status'] === 'new') {
            $this->db->execute("UPDATE contacts SET status='read' WHERE id=?", [$p['id']]);
            $c['status'] = 'read';
        }
        Response::json($c);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $status = $b['status'] ?? 'read';
        if (!in_array($status, ['new','read','replied'], true)) {
            Response::error('Trạng thái không hợp lệ.'); return;
        }
        $this->db->execute("UPDATE contacts SET status=? WHERE id=?", [$status, $p['id']]);
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM contacts WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
