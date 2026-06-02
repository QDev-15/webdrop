<?php
class ContactController {
    public function __construct(private Database $db) {}

    public function index(array $params): void {
        Auth::require();
        $status = $_GET['status'] ?? '';
        if ($status) {
            $rows = $this->db->query(
                "SELECT * FROM contacts WHERE status = ? ORDER BY created_at DESC", [$status]
            );
        } else {
            $rows = $this->db->query("SELECT * FROM contacts ORDER BY created_at DESC");
        }
        Response::ok($rows);
    }

    public function show(array $params): void {
        Auth::require();
        $contact = $this->db->queryOne("SELECT * FROM contacts WHERE id = ?", [$params['id']]);
        if (!$contact) Response::notFound('Liên hệ không tồn tại');

        // Tự đánh dấu "read" khi xem
        if ($contact['status'] === 'new') {
            $this->db->execute("UPDATE contacts SET status = 'read' WHERE id = ?", [$params['id']]);
            $contact['status'] = 'read';
        }
        Response::ok($contact);
    }

    public function update(array $params): void {
        Auth::require();
        $contact = $this->db->queryOne("SELECT id FROM contacts WHERE id = ?", [$params['id']]);
        if (!$contact) Response::notFound('Liên hệ không tồn tại');

        $body   = bodyJson();
        $status = $body['status'] ?? null;
        $allowed = ['new', 'read', 'replied'];
        if ($status && !in_array($status, $allowed)) {
            Response::error('Trạng thái không hợp lệ');
        }
        if ($status) {
            $this->db->execute("UPDATE contacts SET status = ? WHERE id = ?", [$status, $params['id']]);
        }
        Response::ok($this->db->queryOne("SELECT * FROM contacts WHERE id = ?", [$params['id']]));
    }

    public function destroy(array $params): void {
        Auth::require();
        if (!$this->db->queryOne("SELECT id FROM contacts WHERE id = ?", [$params['id']])) {
            Response::notFound('Liên hệ không tồn tại');
        }
        $this->db->execute("DELETE FROM contacts WHERE id = ?", [$params['id']]);
        Response::ok();
    }
}
