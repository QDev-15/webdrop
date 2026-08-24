<?php
declare(strict_types=1);

/** AccountAdminController — Admin xem danh sách người đăng tin (KHÔNG sửa mật khẩu người khác). */
class AccountAdminController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT a.id, a.name, a.email, a.phone, a.role, a.avatar, a.credit_balance, a.status, a.created_at,
                    (SELECT COUNT(*) FROM listings l WHERE l.account_id = a.id) AS listing_count
             FROM accounts a ORDER BY a.created_at DESC"
        );
        Response::json($rows);
    }

    public function updateStatus(array $p): void {
        Auth::require();
        $b = bodyJson();
        $status = ($b['status'] ?? '') === 'banned' ? 'banned' : 'active';
        $this->db->execute("UPDATE accounts SET status = ? WHERE id = ?", [$status, $p['id']]);
        Response::json(['ok' => true]);
    }
}
