<?php
declare(strict_types=1);

// Admin: quản lý đơn hàng — file TĨNH, không sửa trừ khi có yêu cầu nghiệp vụ mới.
class OrderController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $status = trim($_GET['status'] ?? '');
        $where  = [];
        $params = [];
        if ($status !== '') { $where[] = 'status = ?'; $params[] = $status; }
        $whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';
        $rows = $this->db->query(
            "SELECT o.*, (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) as item_count
             FROM orders o $whereSql
             ORDER BY o.created_at DESC",
            $params
        );
        Response::json($rows);
    }

    public function show(array $params): void {
        Auth::require();
        $id    = (int)($params['id'] ?? 0);
        $order = $this->db->queryOne("SELECT * FROM orders WHERE id = ?", [$id]);
        if (!$order) { Response::error('Không tìm thấy đơn hàng', 404); return; }
        $order['items'] = $this->db->query("SELECT * FROM order_items WHERE order_id = ?", [$id]);
        Response::json($order);
    }

    public function updateStatus(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT id FROM orders WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy đơn hàng', 404); return; }

        $data          = bodyJson();
        $status        = trim($data['status'] ?? '');
        $paymentStatus = trim($data['payment_status'] ?? '');

        $validStatus  = ['pending', 'processing', 'shipping', 'completed', 'cancelled'];
        $validPayment = ['unpaid', 'pending', 'paid'];

        if ($status !== '' && !in_array($status, $validStatus, true)) {
            Response::error('Trạng thái đơn hàng không hợp lệ', 422); return;
        }
        if ($paymentStatus !== '' && !in_array($paymentStatus, $validPayment, true)) {
            Response::error('Trạng thái thanh toán không hợp lệ', 422); return;
        }

        if ($status !== '') {
            $this->db->execute("UPDATE orders SET status=?, updated_at=datetime('now') WHERE id=?", [$status, $id]);
        }
        if ($paymentStatus !== '') {
            $this->db->execute("UPDATE orders SET payment_status=?, updated_at=datetime('now') WHERE id=?", [$paymentStatus, $id]);
        }

        $order = $this->db->queryOne("SELECT * FROM orders WHERE id = ?", [$id]);
        Response::json($order);
    }
}
