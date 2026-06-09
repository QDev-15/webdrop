<?php
declare(strict_types=1);

class ContactController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $contacts = $this->db->query("SELECT * FROM contacts ORDER BY created_at DESC");
        Response::json($contacts);
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
