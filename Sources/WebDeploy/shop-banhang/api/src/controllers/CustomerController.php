<?php
declare(strict_types=1);

class CustomerController {
    public function __construct(private Database $db) {}

    private function withTier(array $c): array {
        $c['tier'] = posCalcTier((float)$c['total_spent']);
        return $c;
    }

    private function withLastPurchase(array $c): array {
        $c['last_purchase'] = $this->db->scalar(
            "SELECT created_at FROM orders WHERE customer_id = ? ORDER BY created_at DESC LIMIT 1", [$c['id']]
        );
        return $c;
    }

    // ── Admin CRUD (ql-khach-hang.html) — superadmin only ──────────────────────

    public function index(array $p): void {
        Auth::requireRole('superadmin');
        $q = trim((string)($_GET['q'] ?? ''));
        if ($q) {
            $like = '%' . $q . '%';
            $rows = $this->db->query(
                "SELECT * FROM customers WHERE name LIKE ? OR phone LIKE ? ORDER BY created_at DESC",
                [$like, $like]
            );
        } else {
            $rows = $this->db->query("SELECT * FROM customers ORDER BY created_at DESC");
        }
        $rows = array_map([$this, 'withTier'], $rows);
        $rows = array_map([$this, 'withLastPurchase'], $rows);
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::requireRole('superadmin');
        $customer = $this->db->queryOne("SELECT * FROM customers WHERE id = ?", [$p['id']]);
        if (!$customer) { Response::error('Không tìm thấy khách hàng.', 404); return; }
        $orders = $this->db->query(
            "SELECT o.*, (SELECT COALESCE(SUM(quantity),0) FROM order_items WHERE order_id = o.id) AS item_qty
             FROM orders o WHERE o.customer_id = ? ORDER BY o.created_at DESC",
            [$p['id']]
        );
        $customer = $this->withTier($customer);
        $customer['orders'] = $orders;
        Response::json($customer);
    }

    private static function validatePhone(string $phone): bool {
        return (bool)preg_match('/^0\d{9}$/', $phone);
    }

    public function store(array $p): void {
        Auth::requireRole('superadmin');
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        $phone = trim($b['phone'] ?? '');
        $email = trim($b['email'] ?? '');
        $birthday = trim($b['birthday'] ?? '');
        if (!$name) { Response::error('Vui lòng nhập tên khách hàng.'); return; }
        if (!self::validatePhone($phone)) { Response::error('Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0).'); return; }
        $dup = $this->db->queryOne("SELECT id FROM customers WHERE phone = ?", [$phone]);
        if ($dup) { Response::error('Số điện thoại này đã được dùng bởi khách hàng khác.', 409); return; }
        $id = $this->db->execute(
            "INSERT INTO customers (name, phone, email, birthday) VALUES (?, ?, ?, ?)",
            [$name, $phone, $email, $birthday]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::requireRole('superadmin');
        $existing = $this->db->queryOne("SELECT id FROM customers WHERE id = ?", [$p['id']]);
        if (!$existing) { Response::error('Không tìm thấy khách hàng.', 404); return; }
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        $phone = trim($b['phone'] ?? '');
        $email = trim($b['email'] ?? '');
        $birthday = trim($b['birthday'] ?? '');
        if (!$name) { Response::error('Vui lòng nhập tên khách hàng.'); return; }
        if (!self::validatePhone($phone)) { Response::error('Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0).'); return; }
        $dup = $this->db->queryOne("SELECT id FROM customers WHERE phone = ? AND id != ?", [$phone, $p['id']]);
        if ($dup) { Response::error('Số điện thoại này đã được dùng bởi khách hàng khác.', 409); return; }
        $this->db->execute(
            "UPDATE customers SET name=?, phone=?, email=?, birthday=? WHERE id=?",
            [$name, $phone, $email, $birthday, $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::requireRole('superadmin');
        $this->db->execute("DELETE FROM customers WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }

    // ── Cashier — tìm/thêm nhanh khách hàng khi lập đơn (mọi role) ─────────────

    public function search(array $p): void {
        Auth::require();
        $q = trim((string)($_GET['q'] ?? ''));
        if (!$q) { Response::json([]); return; }
        // Ưu tiên khớp đúng đầu SĐT (giống findCustomersByPhonePrefix), rơi về tìm chung theo tên/SĐT
        $prefixMatches = $this->db->query(
            "SELECT * FROM customers WHERE phone LIKE ? ORDER BY name LIMIT 8",
            [$q . '%']
        );
        $rows = $prefixMatches ?: $this->db->query(
            "SELECT * FROM customers WHERE name LIKE ? OR phone LIKE ? ORDER BY name LIMIT 8",
            ['%' . $q . '%', '%' . $q . '%']
        );
        Response::json(array_map([$this, 'withTier'], $rows));
    }

    public function quickAdd(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        $phone = trim($b['phone'] ?? '');
        if (!$name) { Response::error('Vui lòng nhập tên khách hàng.'); return; }
        if (!self::validatePhone($phone)) { Response::error('Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0).'); return; }
        $dup = $this->db->queryOne("SELECT id FROM customers WHERE phone = ?", [$phone]);
        if ($dup) { Response::error('Số điện thoại này đã tồn tại trong hệ thống.', 409); return; }
        $id = $this->db->execute(
            "INSERT INTO customers (name, phone, email, birthday) VALUES (?, ?, '', '')",
            [$name, $phone]
        );
        $customer = $this->db->queryOne("SELECT * FROM customers WHERE id = ?", [$id]);
        Response::json($this->withTier($customer), 201);
    }
}
