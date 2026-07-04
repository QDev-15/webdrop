<?php
declare(strict_types=1);

class ContactController {
    public function __construct(private Database $db) {}

    public function store(array $p): void {
        $b    = bodyJson();
        $name = trim($b['name'] ?? '');
        $msg  = trim($b['message'] ?? '');
        if (!$name) { Response::error('Tên không được để trống.'); return; }
        if (!$msg)  { Response::error('Nội dung không được để trống.'); return; }

        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?,?,?,?,?)",
            [
                $name,
                trim($b['email'] ?? ''),
                trim($b['phone'] ?? ''),
                trim($b['subject'] ?? ''),
                $msg,
            ]
        );
        Response::json(['ok' => true, 'id' => $this->db->lastInsertId()], 201);
    }

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
