<?php
declare(strict_types=1);

class ContactController
{
    public function __construct(private Database $db) {}

    public function index(array $p): void
    {
        Auth::require();
        $status = $_GET['status'] ?? '';
        $where  = $status ? "WHERE status=?" : "";
        $params = $status ? [$status] : [];
        $rows   = $this->db->query(
            "SELECT * FROM contacts $where ORDER BY created_at DESC",
            $params
        );
        Response::json($rows);
    }

    public function show(array $p): void
    {
        Auth::require();
        $id  = (int)($p['id'] ?? 0);
        $row = $this->db->row("SELECT * FROM contacts WHERE id=?", [$id]);
        if (!$row) Response::notFound('Liên hệ không tìm thấy.');

        // Tự động đánh dấu đã đọc
        if ($row['status'] === 'new') {
            $this->db->execute("UPDATE contacts SET status='read' WHERE id=?", [$id]);
            $row['status'] = 'read';
        }
        Response::json($row);
    }

    public function updateStatus(array $p): void
    {
        Auth::require();
        $id     = (int)($p['id'] ?? 0);
        $b      = bodyJson();
        $status = $b['status'] ?? '';

        if (!in_array($status, ['new', 'read', 'replied'], true)) {
            Response::error('Trạng thái không hợp lệ.');
        }

        $this->db->execute("UPDATE contacts SET status=? WHERE id=?", [$status, $id]);
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void
    {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        $this->db->execute("DELETE FROM contacts WHERE id=?", [$id]);
        Response::json(['ok' => true]);
    }
}
