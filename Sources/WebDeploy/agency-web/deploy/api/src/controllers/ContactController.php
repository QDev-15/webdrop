<?php
declare(strict_types=1);

class ContactController
{
    public function __construct(private Database $db) {}

    public function index(array $p): void
    {
        Auth::require();
        $status = $_GET['status'] ?? '';
        if ($status) {
            $contacts = $this->db->query(
                "SELECT * FROM contacts WHERE status=? ORDER BY created_at DESC",
                [$status]
            );
        } else {
            $contacts = $this->db->query(
                "SELECT * FROM contacts ORDER BY created_at DESC"
            );
        }
        Response::json($contacts);
    }

    public function show(array $p): void
    {
        Auth::require();
        $id = (int)$p['id'];
        $contact = $this->db->row("SELECT * FROM contacts WHERE id=?", [$id]);
        if (!$contact) Response::notFound('Liên hệ không tồn tại.');

        // Auto-mark as read
        if ($contact['status'] === 'new') {
            $this->db->execute("UPDATE contacts SET status='read' WHERE id=?", [$id]);
            $contact['status'] = 'read';
        }

        Response::json($contact);
    }

    public function updateStatus(array $p): void
    {
        Auth::require();
        $id = (int)$p['id'];
        $b  = bodyJson();
        $allowed = ['new', 'read', 'replied'];
        $status  = $b['status'] ?? '';

        if (!in_array($status, $allowed, true)) {
            Response::error('Trạng thái không hợp lệ.');
        }

        $this->db->execute("UPDATE contacts SET status=? WHERE id=?", [$status, $id]);
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void
    {
        Auth::require();
        $id = (int)$p['id'];
        $this->db->execute("DELETE FROM contacts WHERE id=?", [$id]);
        Response::json(['ok' => true]);
    }
}
