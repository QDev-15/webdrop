<?php
declare(strict_types=1);

class StockController {
    public function __construct(private Database $db) {}

    // ── Nhà cung cấp ─────────────────────────────────────────────────────────

    public function suppliers(array $p): void {
        Auth::requireRole('superadmin');
        Response::json($this->db->query("SELECT * FROM suppliers ORDER BY name"));
    }

    public function addSupplier(array $p): void {
        Auth::requireRole('superadmin');
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Vui lòng nhập tên nhà cung cấp.'); return; }
        $this->db->execute("INSERT OR IGNORE INTO suppliers (name) VALUES (?)", [$name]);
        Response::json($this->db->query("SELECT * FROM suppliers ORDER BY name"));
    }

    // ── Nhập kho ─────────────────────────────────────────────────────────────

    public function createImport(array $p): void {
        Auth::requireRole('superadmin');
        $user = Auth::user();
        $b = bodyJson();
        $supplier = trim($b['supplier'] ?? '');
        $date = trim($b['date'] ?? '') ?: date('Y-m-d');
        $lines = is_array($b['lines'] ?? null) ? $b['lines'] : [];

        if (!$supplier) { Response::error('Vui lòng chọn hoặc nhập nhà cung cấp.'); return; }
        if (!$lines) { Response::error('Vui lòng chọn ít nhất 1 sản phẩm để nhập kho.'); return; }

        $items = [];
        $totalCost = 0;
        foreach ($lines as $line) {
            $productId = (int)($line['product_id'] ?? 0);
            $variantSku = trim((string)($line['variant_sku'] ?? '')) ?: null;
            $qty = (int)($line['quantity'] ?? 0);
            $unitCost = (float)($line['unit_cost'] ?? -1);
            if ($productId <= 0 || $qty <= 0) { Response::error('Số lượng nhập phải lớn hơn 0.'); return; }
            if ($unitCost < 0) { Response::error('Đơn giá nhập không hợp lệ.'); return; }

            $product = $this->db->queryOne("SELECT * FROM products WHERE id = ?", [$productId]);
            if (!$product) { Response::error('Sản phẩm không tồn tại.'); return; }

            if ($product['has_variants']) {
                if (!$variantSku) { Response::error('Vui lòng chọn biến thể cho "' . $product['name'] . '".'); return; }
                $variant = $this->db->queryOne("SELECT id FROM product_variants WHERE sku = ? AND product_id = ?", [$variantSku, $productId]);
                if (!$variant) { Response::error('Biến thể không hợp lệ cho "' . $product['name'] . '".'); return; }
            } else {
                $variantSku = null;
            }
            $items[] = ['product_id' => $productId, 'variant_sku' => $variantSku, 'product_name' => $product['name'], 'quantity' => $qty, 'unit_cost' => $unitCost];
            $totalCost += $qty * $unitCost;
        }

        $this->db->beginTransaction();
        try {
            $this->db->execute("INSERT OR IGNORE INTO suppliers (name) VALUES (?)", [$supplier]);
            $importId = (int)$this->db->execute(
                "INSERT INTO stock_imports (supplier, import_date, total_cost, created_by) VALUES (?, ?, ?, ?)",
                [$supplier, $date, $totalCost, $user['id']]
            );
            foreach ($items as $it) {
                $this->db->execute(
                    "INSERT INTO stock_import_items (import_id, product_id, variant_sku, product_name, quantity, unit_cost) VALUES (?, ?, ?, ?, ?, ?)",
                    [$importId, $it['product_id'], $it['variant_sku'], $it['product_name'], $it['quantity'], $it['unit_cost']]
                );
                if ($it['variant_sku']) {
                    $this->db->execute("UPDATE product_variants SET stock = stock + ? WHERE sku = ?", [$it['quantity'], $it['variant_sku']]);
                } else {
                    $this->db->execute("UPDATE products SET stock = stock + ? WHERE id = ?", [$it['quantity'], $it['product_id']]);
                }
            }
            $this->db->commit();
            Response::json(['id' => $importId], 201);
        } catch (\Throwable $e) {
            $this->db->rollBack();
            Response::error($e->getMessage(), 400);
        }
    }

    public function importsHistory(array $p): void {
        Auth::requireRole('superadmin');
        $imports = $this->db->query("SELECT * FROM stock_imports ORDER BY id DESC");
        foreach ($imports as &$imp) {
            $imp['items'] = $this->db->query("SELECT * FROM stock_import_items WHERE import_id = ?", [$imp['id']]);
        }
        Response::json($imports);
    }

    // ── Kiểm kê tồn kho ──────────────────────────────────────────────────────

    public function stocktakeRows(array $p): void {
        Auth::requireRole('superadmin');
        $rows = [];
        $products = $this->db->query("SELECT * FROM products ORDER BY id");
        foreach ($products as $product) {
            if ($product['has_variants']) {
                $variants = $this->db->query("SELECT * FROM product_variants WHERE product_id = ? ORDER BY id", [$product['id']]);
                foreach ($variants as $v) {
                    $rows[] = ['product_id' => (int)$product['id'], 'variant_sku' => $v['sku'], 'label' => $product['name'] . ' (' . $v['size'] . '/' . $v['color'] . ')', 'system_stock' => (int)$v['stock']];
                }
            } else {
                $rows[] = ['product_id' => (int)$product['id'], 'variant_sku' => null, 'label' => $product['name'], 'system_stock' => (int)$product['stock']];
            }
        }
        Response::json($rows);
    }

    // body: { checked_by, counted: [{product_id, variant_sku, counted}] }
    public function applyStocktake(array $p): void {
        Auth::requireRole('superadmin');
        $b = bodyJson();
        $checkedBy = trim($b['checked_by'] ?? '') ?: (Auth::user()['name'] ?? '');
        $counted = is_array($b['counted'] ?? null) ? $b['counted'] : [];

        $discrepancies = 0;
        $this->db->beginTransaction();
        try {
            foreach ($counted as $row) {
                $productId = (int)($row['product_id'] ?? 0);
                $variantSku = trim((string)($row['variant_sku'] ?? '')) ?: null;
                if (!is_numeric($row['counted'] ?? null)) continue;
                $countedQty = max(0, (int)$row['counted']);

                if ($variantSku) {
                    $current = (int)$this->db->scalar("SELECT stock FROM product_variants WHERE sku = ? AND product_id = ?", [$variantSku, $productId]);
                    if ($countedQty !== $current) $discrepancies++;
                    $this->db->execute("UPDATE product_variants SET stock = ? WHERE sku = ? AND product_id = ?", [$countedQty, $variantSku, $productId]);
                } else {
                    $current = (int)$this->db->scalar("SELECT stock FROM products WHERE id = ?", [$productId]);
                    if ($countedQty !== $current) $discrepancies++;
                    $this->db->execute("UPDATE products SET stock = ? WHERE id = ?", [$countedQty, $productId]);
                }
            }
            $id = $this->db->execute(
                "INSERT INTO stocktakes (stocktake_date, checked_by, discrepancies) VALUES (?, ?, ?)",
                [date('Y-m-d'), $checkedBy, $discrepancies]
            );
            $this->db->commit();
            Response::json(['id' => $id, 'discrepancies' => $discrepancies], 201);
        } catch (\Throwable $e) {
            $this->db->rollBack();
            Response::error($e->getMessage(), 400);
        }
    }

    public function stocktakeHistory(array $p): void {
        Auth::requireRole('superadmin');
        Response::json($this->db->query("SELECT * FROM stocktakes ORDER BY id DESC"));
    }
}
