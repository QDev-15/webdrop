<?php
declare(strict_types=1);

class ReturnController {
    private const REASONS = ['loi-san-pham', 'doi-y', 'giao-nham', 'khac'];

    public function __construct(private Database $db) {}

    private function returnableItems(array $order): array {
        $items = $this->db->query("SELECT * FROM order_items WHERE order_id = ?", [$order['id']]);
        $priorReturns = $this->db->query(
            "SELECT ri.* FROM return_items ri INNER JOIN returns r ON r.id = ri.return_id WHERE r.order_id = ?",
            [$order['id']]
        );
        $returnedQty = [];
        foreach ($priorReturns as $ri) {
            $key = $ri['product_id'] . '::' . ($ri['variant_sku'] ?? '');
            $returnedQty[$key] = ($returnedQty[$key] ?? 0) + (int)$ri['quantity'];
        }
        foreach ($items as &$it) {
            $key = $it['product_id'] . '::' . ($it['variant_sku'] ?? '');
            $it['already_returned'] = $returnedQty[$key] ?? 0;
            $it['max_returnable'] = max(0, (int)$it['quantity'] - $it['already_returned']);
        }
        return $items;
    }

    // GET /returns/lookup/:code — mọi role
    public function lookup(array $p): void {
        Auth::require();
        $order = $this->db->queryOne("SELECT * FROM orders WHERE code = ?", [$p['code']]);
        if (!$order) { Response::error('Không tìm thấy hóa đơn với mã: ' . $p['code'], 404); return; }
        if ($order['customer_id']) {
            $customer = $this->db->queryOne("SELECT name FROM customers WHERE id = ?", [$order['customer_id']]);
            $order['customer_name'] = $customer['name'] ?? 'Khách lẻ';
        } else {
            $order['customer_name'] = 'Khách lẻ';
        }
        $order['items'] = $this->returnableItems($order);
        Response::json($order);
    }

    // POST /returns — xử lý trả hàng/hoàn tiền, mọi role
    public function process(array $p): void {
        Auth::require();
        $user = Auth::user();
        $b = bodyJson();

        $code = trim((string)($b['order_code'] ?? ''));
        $reason = $b['reason'] ?? '';
        $selections = is_array($b['items'] ?? null) ? $b['items'] : [];

        if (!in_array($reason, self::REASONS, true)) { Response::error('Vui lòng chọn lý do trả hàng.'); return; }
        if (!$selections) { Response::error('Vui lòng chọn ít nhất 1 sản phẩm cần trả.'); return; }

        $order = $this->db->queryOne("SELECT * FROM orders WHERE code = ?", [$code]);
        if (!$order) { Response::error('Không tìm thấy hóa đơn.', 404); return; }

        $returnable = $this->returnableItems($order);

        $refundAmount = 0;
        $lines = [];
        foreach ($selections as $sel) {
            $productId = (int)($sel['product_id'] ?? 0);
            $variantSku = trim((string)($sel['variant_sku'] ?? '')) ?: null;
            $qty = (int)($sel['quantity'] ?? 0);
            if ($qty <= 0) { Response::error('Số lượng trả phải lớn hơn 0.'); return; }

            $ref = null;
            foreach ($returnable as $it) {
                if ((int)$it['product_id'] === $productId && ($it['variant_sku'] ?? null) === $variantSku) { $ref = $it; break; }
            }
            if (!$ref) { Response::error('Sản phẩm không thuộc đơn hàng này.'); return; }
            if ($qty > $ref['max_returnable']) {
                Response::error("{$ref['product_name']} chỉ có thể trả tối đa {$ref['max_returnable']} (đã mua {$ref['quantity']}, đã trả {$ref['already_returned']}).");
                return;
            }
            $refundAmount += (float)$ref['price'] * $qty;
            $lines[] = ['product_id' => $productId, 'variant_sku' => $variantSku, 'product_name' => $ref['product_name'], 'quantity' => $qty];
        }

        $this->db->beginTransaction();
        try {
            $returnId = (int)$this->db->execute(
                "INSERT INTO returns (order_id, reason, refund_amount, created_by) VALUES (?, ?, ?, ?)",
                [$order['id'], $reason, $refundAmount, $user['id']]
            );
            foreach ($lines as $line) {
                $this->db->execute(
                    "INSERT INTO return_items (return_id, product_id, variant_sku, product_name, quantity) VALUES (?, ?, ?, ?, ?)",
                    [$returnId, $line['product_id'], $line['variant_sku'], $line['product_name'], $line['quantity']]
                );
                if ($line['variant_sku']) {
                    $this->db->execute("UPDATE product_variants SET stock = stock + ? WHERE sku = ?", [$line['quantity'], $line['variant_sku']]);
                } else {
                    $this->db->execute("UPDATE products SET stock = stock + ? WHERE id = ?", [$line['quantity'], $line['product_id']]);
                }
            }
            $this->db->execute("UPDATE orders SET has_return = 1 WHERE id = ?", [$order['id']]);
            $this->db->commit();
            Response::json(['ok' => true, 'refund_amount' => $refundAmount], 201);
        } catch (\Throwable $e) {
            $this->db->rollBack();
            Response::error($e->getMessage(), 400);
        }
    }
}
