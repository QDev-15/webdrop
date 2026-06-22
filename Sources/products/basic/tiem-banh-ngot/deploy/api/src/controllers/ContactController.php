<?php
declare(strict_types=1);

class ContactController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $contacts = $this->db->query(
            "SELECT * FROM contacts ORDER BY created_at DESC"
        );
        Response::json($contacts);
    }

    public function show(array $p): void {
        Auth::require();
        $contact = $this->db->queryOne("SELECT * FROM contacts WHERE id = ?", [$p['id']]);
        if (!$contact) { Response::error('Không tìm thấy.', 404); return; }
        // Mark as read
        if ($contact['status'] === 'new') {
            $this->db->execute("UPDATE contacts SET status = 'read' WHERE id = ?", [$p['id']]);
            $contact['status'] = 'read';
        }
        Response::json($contact);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE contacts SET status = ? WHERE id = ?",
            [$b['status'] ?? 'read', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM contacts WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
