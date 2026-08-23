<?php
declare(strict_types=1);

/** ListingController — Admin: kiểm duyệt & quản lý toàn bộ tin đăng trên sàn. */
class ListingController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $status = $_GET['status'] ?? '';
        $sql = "SELECT l.*, a.name AS account_name, a.email AS account_email, a.phone AS account_phone
                FROM listings l JOIN accounts a ON a.id = l.account_id";
        $params = [];
        if ($status) { $sql .= " WHERE l.status = ?"; $params[] = $status; }
        $sql .= " ORDER BY l.created_at DESC";
        Response::json($this->db->query($sql, $params));
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne(
            "SELECT l.*, a.name AS account_name, a.email AS account_email, a.phone AS account_phone
             FROM listings l JOIN accounts a ON a.id = l.account_id WHERE l.id = ?",
            [$p['id']]
        );
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function approve(array $p): void {
        Auth::require();
        $this->db->execute("UPDATE listings SET status = 'approved' WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }

    public function reject(array $p): void {
        Auth::require();
        $this->db->execute("UPDATE listings SET status = 'rejected' WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM listings WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
