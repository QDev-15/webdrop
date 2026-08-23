<?php
declare(strict_types=1);

class WalletController {
    public function __construct(private Database $db) {}

    private function setting(string $key): string {
        $row = $this->db->queryOne("SELECT value FROM settings WHERE key = ?", [$key]);
        return $row['value'] ?? '';
    }

    /** GET /public/my-wallet-transactions — lịch sử giao dịch của CHÍNH tài khoản đang đăng nhập */
    public function myTransactions(array $p): void {
        $session = AccountAuth::require();
        Response::json($this->db->query(
            "SELECT * FROM wallet_transactions WHERE account_id = ? ORDER BY created_at DESC",
            [$session['id']]
        ));
    }

    /** POST /public/wallet/topup — AccountAuth required */
    public function topup(array $p): void {
        $session = AccountAuth::require();
        $b = bodyJson();
        $amount = (int)($b['amount'] ?? 0);
        $method = ($b['method'] ?? '') === 'sepay' ? 'sepay' : 'chuyen-khoan-thu-cong';

        if ($amount < 20000) { Response::error('Số tiền nạp tối thiểu là 20.000đ.'); return; }

        if ($method === 'sepay' && $this->setting('payment_sepay_enabled') !== '1') {
            Response::error('Phương thức chuyển khoản SePay hiện chưa được bật.', 400); return;
        }
        if ($method === 'chuyen-khoan-thu-cong' && $this->setting('payment_manual_enabled') !== '1') {
            Response::error('Phương thức chuyển khoản thủ công hiện chưa được bật.', 400); return;
        }

        $ref = 'NAP' . $session['id'] . time();
        $this->db->execute(
            "INSERT INTO wallet_transactions (account_id, type, amount, method, note, status, sepay_ref) VALUES (?, 'nap', ?, ?, ?, 'pending', ?)",
            [$session['id'], $amount, $method, 'Yêu cầu nạp credit vào ví', $ref]
        );

        Response::json([
            'ok'     => true,
            'status' => 'pending',
            'ref'    => $ref,
            'amount' => $amount,
            'bank'   => [
                'bank_name'      => $this->setting('sepay_bank_name'),
                'account_number' => $this->setting('sepay_account_number'),
                'account_name'   => $this->setting('sepay_account_name'),
                'content'        => $ref,
            ],
            'message' => $method === 'sepay'
                ? 'Vui lòng chuyển khoản đúng nội dung để hệ thống tự động xác nhận.'
                : 'Yêu cầu nạp credit đã được ghi nhận — RaoNhà sẽ xác nhận trong thời gian sớm nhất.',
        ], 201);
    }

    /** POST /public/sepay-webhook — SePay gọi khi có giao dịch chuyển khoản khớp nội dung */
    public function sepayWebhook(array $p): void {
        $secret = $this->setting('sepay_webhook_secret');
        $given = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        $b = bodyJson();
        $providedSecret = trim(str_replace('Apikey', '', $given)) ?: ($b['secret'] ?? '');
        if (!$secret || !hash_equals($secret, (string)$providedSecret)) { Response::error('Không có quyền.', 401); return; }

        $content = trim($b['content'] ?? $b['description'] ?? '');
        $amount = (int)($b['transferAmount'] ?? $b['amount'] ?? 0);
        if (!$content || $amount <= 0) { Response::error('Thiếu dữ liệu giao dịch.'); return; }

        // Tìm ref (mã NAP...) nằm trong nội dung chuyển khoản
        if (!preg_match('/NAP\d+/', $content, $m)) { Response::json(['ok' => true, 'matched' => false]); return; }
        $ref = $m[0];
        $txn = $this->db->queryOne("SELECT * FROM wallet_transactions WHERE sepay_ref = ? AND status = 'pending'", [$ref]);
        if (!$txn) { Response::json(['ok' => true, 'matched' => false]); return; }

        // UPDATE có điều kiện status='pending' — nếu SePay gọi webhook 2 lần cho cùng giao dịch
        // (double delivery), lần thứ 2 sẽ có 0 dòng bị ảnh hưởng nên KHÔNG cộng credit thêm lần nữa.
        $affected = $this->db->executeAffected(
            "UPDATE wallet_transactions SET status = 'completed', amount = ? WHERE id = ? AND status = 'pending'",
            [$amount, $txn['id']]
        );
        if ($affected === 0) { Response::json(['ok' => true, 'matched' => false]); return; }
        $this->db->execute("UPDATE accounts SET credit_balance = credit_balance + ? WHERE id = ?", [$amount, $txn['account_id']]);
        Response::json(['ok' => true, 'matched' => true]);
    }

    // ─── Admin ──────────────────────────────────────────────────────────────

    public function index(array $p): void {
        Auth::require();
        $status = $_GET['status'] ?? '';
        $sql = "SELECT w.*, a.name AS account_name, a.email AS account_email
                FROM wallet_transactions w JOIN accounts a ON a.id = w.account_id";
        $params = [];
        if ($status) { $sql .= " WHERE w.status = ?"; $params[] = $status; }
        $sql .= " ORDER BY w.created_at DESC";
        Response::json($this->db->query($sql, $params));
    }

    public function approve(array $p): void {
        Auth::require();
        $txn = $this->db->queryOne("SELECT * FROM wallet_transactions WHERE id = ?", [$p['id']]);
        if (!$txn) { Response::error('Không tìm thấy giao dịch.', 404); return; }
        if ($txn['status'] !== 'pending') { Response::error('Giao dịch này đã được xử lý.'); return; }

        $affected = $this->db->executeAffected(
            "UPDATE wallet_transactions SET status = 'completed' WHERE id = ? AND status = 'pending'",
            [$txn['id']]
        );
        if ($affected === 0) { Response::error('Giao dịch này đã được xử lý.'); return; }
        if ($txn['type'] === 'nap') {
            $this->db->execute("UPDATE accounts SET credit_balance = credit_balance + ? WHERE id = ?", [(int)$txn['amount'], $txn['account_id']]);
        }
        Response::json(['ok' => true]);
    }

    public function reject(array $p): void {
        Auth::require();
        $txn = $this->db->queryOne("SELECT * FROM wallet_transactions WHERE id = ?", [$p['id']]);
        if (!$txn) { Response::error('Không tìm thấy giao dịch.', 404); return; }
        if ($txn['status'] !== 'pending') { Response::error('Giao dịch này đã được xử lý.'); return; }
        $this->db->execute("UPDATE wallet_transactions SET status = 'rejected' WHERE id = ?", [$txn['id']]);
        Response::json(['ok' => true]);
    }
}
