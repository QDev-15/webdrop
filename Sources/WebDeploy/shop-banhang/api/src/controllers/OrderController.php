<?php
declare(strict_types=1);

class OrderController {
    public function __construct(private Database $db) {}

    private function loadFull(int $orderId): array {
        $order = $this->db->queryOne("SELECT * FROM orders WHERE id = ?", [$orderId]);
        $order['items'] = $this->db->query("SELECT * FROM order_items WHERE order_id = ?", [$orderId]);
        if ($order['customer_id']) {
            $customer = $this->db->queryOne("SELECT id, name, phone, points FROM customers WHERE id = ?", [$order['customer_id']]);
            $order['customer_name'] = $customer['name'] ?? 'Khách lẻ';
        } else {
            $order['customer_name'] = 'Khách lẻ';
        }
        return $order;
    }

    // POST /pos/checkout — lập đơn & thanh toán (mọi role đã đăng nhập, cần ca đang mở)
    public function store(array $p): void {
        Auth::require();
        $user = Auth::user();
        $b = bodyJson();

        $shift = $this->db->queryOne("SELECT * FROM shifts WHERE user_id = ? AND status = 'open' ORDER BY id DESC LIMIT 1", [$user['id']]);
        if (!$shift) { Response::error('Chưa mở ca làm việc. Vui lòng mở ca trước khi bán hàng.', 400); return; }

        $rawItems = is_array($b['items'] ?? null) ? $b['items'] : [];
        if (!$rawItems) { Response::error('Vui lòng chọn ít nhất một sản phẩm.'); return; }

        // ── Recompute giá/tên/đơn vị TỪ DATABASE — không tin dữ liệu client gửi lên ──
        $items = [];
        foreach ($rawItems as $raw) {
            $productId = (int)($raw['product_id'] ?? 0);
            $variantSku = trim((string)($raw['variant_sku'] ?? '')) ?: null;
            $qty = (int)($raw['quantity'] ?? 0);
            if ($productId <= 0 || $qty <= 0) { Response::error('Dữ liệu sản phẩm không hợp lệ.'); return; }

            $product = $this->db->queryOne("SELECT * FROM products WHERE id = ?", [$productId]);
            if (!$product) { Response::error('Sản phẩm không tồn tại (ID ' . $productId . ').'); return; }

            $price = (float)$product['price']; $size = ''; $color = '';
            if ($product['has_variants']) {
                if (!$variantSku) { Response::error($product['name'] . ' cần chọn biến thể.'); return; }
                $variant = $this->db->queryOne("SELECT * FROM product_variants WHERE sku = ? AND product_id = ?", [$variantSku, $productId]);
                if (!$variant) { Response::error('Biến thể không tồn tại: ' . $product['name']); return; }
                $price = (float)$variant['price']; $size = $variant['size']; $color = $variant['color'];
            } else {
                $variantSku = null;
            }

            $key = $productId . '::' . ($variantSku ?? '');
            if (isset($items[$key])) {
                $items[$key]['quantity'] += $qty;
            } else {
                $items[$key] = [
                    'product_id' => $productId, 'variant_sku' => $variantSku, 'name' => $product['name'],
                    'unit' => $product['unit'], 'size' => $size, 'color' => $color, 'price' => $price, 'quantity' => $qty,
                ];
            }
        }
        $items = array_values($items);

        $subtotal = array_sum(array_map(fn($it) => $it['price'] * $it['quantity'], $items));

        $discountType = ($b['discount']['type'] ?? 'percent') === 'fixed' ? 'fixed' : 'percent';
        $discountValueRaw = (float)($b['discount']['value'] ?? 0);
        $discountValue = max(0, $discountValueRaw);
        $discountAmount = $discountType === 'percent'
            ? ($subtotal * min($discountValue, 100) / 100)
            : $discountValue;
        $discountAmount = min($discountAmount, $subtotal);
        $total = max(0, $subtotal - $discountAmount);

        $paymentMethod = in_array($b['payment_method'] ?? '', ['cash', 'transfer', 'qr', 'card'], true) ? $b['payment_method'] : 'cash';
        $cashReceived = null; $changeGiven = null;
        if ($paymentMethod === 'cash') {
            $cashReceived = (float)($b['cash_received'] ?? 0);
            if ($cashReceived < $total) { Response::error('Tiền khách đưa không đủ để thanh toán.'); return; }
            $changeGiven = $cashReceived - $total;
        }

        $customerId = !empty($b['customer_id']) ? (int)$b['customer_id'] : null;
        if ($customerId) {
            $customer = $this->db->queryOne("SELECT id FROM customers WHERE id = ?", [$customerId]);
            if (!$customer) { Response::error('Khách hàng không tồn tại.'); return; }
        }
        $pointsEarned = $customerId ? (int)floor($total / 10000) : 0;
        $tableNo = trim((string)($b['table_no'] ?? ''));

        $this->db->beginTransaction();
        try {
            // Trừ tồn kho atomic — UPDATE có điều kiện + kiểm rowCount, tránh race condition (TOCTOU).
            // Nếu BẤT KỲ item nào không đủ hàng → rollback toàn bộ, không trừ phần nào.
            foreach ($items as $it) {
                if ($it['variant_sku']) {
                    $affected = $this->db->executeAffected(
                        "UPDATE product_variants SET stock = stock - ? WHERE sku = ? AND stock >= ?",
                        [$it['quantity'], $it['variant_sku'], $it['quantity']]
                    );
                } else {
                    $affected = $this->db->executeAffected(
                        "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
                        [$it['quantity'], $it['product_id'], $it['quantity']]
                    );
                }
                if ($affected === 0) {
                    $label = $it['name'] . ($it['size'] ? " ({$it['size']}/{$it['color']})" : '');
                    throw new \RuntimeException($label . ' không đủ tồn kho.');
                }
            }

            $orderId = (int)$this->db->execute(
                "INSERT INTO orders (code, table_no, customer_id, subtotal, discount, total, payment_method, cash_received, change_given, points_earned, shift_id, created_by, status)
                 VALUES ('', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed')",
                [$tableNo, $customerId, $subtotal, $discountAmount, $total, $paymentMethod, $cashReceived, $changeGiven, $pointsEarned, $shift['id'], $user['id']]
            );
            $code = 'HD' . date('ymdHis') . str_pad((string)$orderId, 4, '0', STR_PAD_LEFT);
            $this->db->execute("UPDATE orders SET code = ? WHERE id = ?", [$code, $orderId]);

            foreach ($items as $it) {
                $this->db->execute(
                    "INSERT INTO order_items (order_id, product_id, variant_sku, product_name, unit, size, color, price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [$orderId, $it['product_id'], $it['variant_sku'], $it['name'], $it['unit'], $it['size'], $it['color'], $it['price'], $it['quantity']]
                );
            }

            if ($customerId) {
                $this->db->execute(
                    "UPDATE customers SET total_spent = total_spent + ?, points = points + ? WHERE id = ?",
                    [$total, $pointsEarned, $customerId]
                );
            }

            $this->db->commit();
            Response::json($this->loadFull($orderId), 201);
        } catch (\Throwable $e) {
            $this->db->rollBack();
            Response::error($e->getMessage(), 400);
        }
    }

    // GET /orders/find/:code — tra cứu hóa đơn theo mã (dùng ở trang Trả hàng, mọi role)
    public function findByCode(array $p): void {
        Auth::require();
        $order = $this->db->queryOne("SELECT * FROM orders WHERE code = ?", [$p['code']]);
        if (!$order) { Response::error('Không tìm thấy hóa đơn với mã: ' . $p['code'], 404); return; }
        Response::json($this->loadFull((int)$order['id']));
    }
}
