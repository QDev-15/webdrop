<?php
declare(strict_types=1);

class ProductController {
    public function __construct(private Database $db) {}

    private function attachVariants(array $products): array {
        if (!$products) return $products;
        $ids = array_column($products, 'id');
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $variants = $this->db->query("SELECT * FROM product_variants WHERE product_id IN ($placeholders) ORDER BY id", $ids);
        $byProduct = [];
        foreach ($variants as $v) { $byProduct[$v['product_id']][] = $v; }
        foreach ($products as &$p) {
            $p['has_variants'] = (bool)$p['has_variants'];
            $p['variants'] = $byProduct[$p['id']] ?? [];
        }
        return $products;
    }

    // GET /pos/products — đọc cho lưới bán hàng (Cashier) — mọi role đã đăng nhập.
    public function posIndex(array $p): void {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM products ORDER BY id");
        Response::json($this->attachVariants($rows));
    }

    // GET /products — danh sách quản lý sản phẩm (admin). Template gốc (ql-menu.html)
    // không phân trang — hiển thị toàn bộ + ô tìm kiếm lọc client-side, giữ đúng hành vi.
    public function index(array $p): void {
        Auth::requireRole('superadmin');
        $rows = $this->db->query("SELECT * FROM products ORDER BY id");
        Response::json($this->attachVariants($rows));
    }

    public function show(array $p): void {
        Auth::requireRole('superadmin');
        $row = $this->db->queryOne("SELECT * FROM products WHERE id = ?", [$p['id']]);
        if (!$row) { Response::error('Không tìm thấy sản phẩm.', 404); return; }
        Response::json($this->attachVariants([$row])[0]);
    }

    private function validateAndCollect(array $b, ?int $editingId): array|string {
        $name = trim($b['name'] ?? '');
        $categoryId = (int)($b['category_id'] ?? 0);
        $price = (float)($b['price'] ?? -1);
        $costPrice = (float)($b['cost_price'] ?? -1);
        $unit = trim($b['unit'] ?? '');
        $barcode = trim($b['barcode'] ?? '') ?: null;
        $stock = (int)($b['stock'] ?? 0);
        $minStock = (int)($b['min_stock'] ?? 0);
        $hasVariants = !empty($b['has_variants']);
        $image = trim($b['image'] ?? '');

        if (!$name) return 'Vui lòng nhập tên sản phẩm.';
        if ($price <= 0) return 'Giá bán phải lớn hơn 0.';
        if ($costPrice < 0) return 'Giá vốn không hợp lệ.';
        if (!$unit) return 'Vui lòng nhập đơn vị tính.';
        if ($stock < 0 || $minStock < 0) return 'Tồn kho không hợp lệ.';

        if ($barcode) {
            $dup = $this->db->queryOne(
                "SELECT id FROM products WHERE barcode = ? AND id != ?",
                [$barcode, $editingId ?? 0]
            );
            if ($dup) return 'Mã vạch này đã được dùng cho sản phẩm khác.';
        }

        $variants = [];
        if ($hasVariants) {
            $rawVariants = is_array($b['variants'] ?? null) ? $b['variants'] : [];
            foreach ($rawVariants as $v) {
                $size = trim($v['size'] ?? '');
                $color = trim($v['color'] ?? '');
                $sku = trim($v['sku'] ?? '');
                $vStock = (int)($v['stock'] ?? 0);
                $vPrice = (float)($v['price'] ?? $price);
                if (!$size && !$color) continue;
                if (!$sku) return 'Vui lòng nhập SKU cho mọi biến thể.';
                if ($vStock < 0) return 'Tồn kho biến thể không hợp lệ.';
                $variants[] = ['sku' => $sku, 'size' => $size, 'color' => $color, 'stock' => $vStock, 'price' => $vPrice];
            }
            if (!$variants) return 'Vui lòng thêm ít nhất 1 biến thể hoặc tắt "Có biến thể".';
            $skus = array_map(fn($v) => $v['sku'], $variants);
            if (count(array_unique($skus)) !== count($skus)) return 'SKU biến thể bị trùng, vui lòng kiểm tra lại.';
        }

        return [
            'name' => $name, 'category_id' => $categoryId ?: null, 'price' => $price, 'cost_price' => $costPrice,
            'unit' => $unit, 'barcode' => $barcode, 'stock' => $hasVariants ? 0 : $stock,
            'min_stock' => $minStock, 'has_variants' => $hasVariants ? 1 : 0, 'image' => $image,
            'variants' => $variants,
        ];
    }

    public function store(array $p): void {
        Auth::requireRole('superadmin');
        $b = bodyJson();
        $data = $this->validateAndCollect($b, null);
        if (is_string($data)) { Response::error($data); return; }

        $this->db->beginTransaction();
        try {
            $id = (int)$this->db->execute(
                "INSERT INTO products (name, category_id, price, cost_price, unit, barcode, stock, min_stock, has_variants, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [$data['name'], $data['category_id'], $data['price'], $data['cost_price'], $data['unit'], $data['barcode'], $data['stock'], $data['min_stock'], $data['has_variants'], $data['image']]
            );
            foreach ($data['variants'] as $v) {
                $dup = $this->db->queryOne("SELECT id FROM product_variants WHERE sku = ?", [$v['sku']]);
                if ($dup) throw new \RuntimeException('SKU "' . $v['sku'] . '" đã tồn tại ở sản phẩm khác.');
                $this->db->execute(
                    "INSERT INTO product_variants (product_id, sku, size, color, stock, price) VALUES (?, ?, ?, ?, ?, ?)",
                    [$id, $v['sku'], $v['size'], $v['color'], $v['stock'], $v['price']]
                );
            }
            $this->db->commit();
            Response::json(['id' => $id], 201);
        } catch (\Throwable $e) {
            $this->db->rollBack();
            Response::error($e->getMessage(), 400);
        }
    }

    public function update(array $p): void {
        Auth::requireRole('superadmin');
        $id = (int)$p['id'];
        $existing = $this->db->queryOne("SELECT * FROM products WHERE id = ?", [$id]);
        if (!$existing) { Response::error('Không tìm thấy sản phẩm.', 404); return; }

        $b = bodyJson();
        $data = $this->validateAndCollect($b, $id);
        if (is_string($data)) { Response::error($data); return; }

        $this->db->beginTransaction();
        try {
            $this->db->execute(
                "UPDATE products SET name=?, category_id=?, price=?, cost_price=?, unit=?, barcode=?, min_stock=?, has_variants=?, image=? WHERE id=?",
                [$data['name'], $data['category_id'], $data['price'], $data['cost_price'], $data['unit'], $data['barcode'], $data['min_stock'], $data['has_variants'], $data['image'], $id]
            );
            if (!$data['has_variants']) {
                // Chỉ cho phép sửa tay stock khi KHÔNG có biến thể — có biến thể thì tồn
                // kho tổng luôn suy ra từ tổng stock từng biến thể (khớp getTotalStock()).
                $this->db->execute("UPDATE products SET stock = ? WHERE id = ?", [$data['stock'], $id]);
            }

            $existingSkus = array_column($this->db->query("SELECT sku FROM product_variants WHERE product_id = ?", [$id]), 'sku');
            $newSkus = array_map(fn($v) => $v['sku'], $data['variants']);
            foreach ($existingSkus as $sku) {
                if (!in_array($sku, $newSkus, true)) {
                    $this->db->execute("DELETE FROM product_variants WHERE sku = ?", [$sku]);
                }
            }
            foreach ($data['variants'] as $v) {
                $dup = $this->db->queryOne("SELECT id FROM product_variants WHERE sku = ? AND product_id != ?", [$v['sku'], $id]);
                if ($dup) throw new \RuntimeException('SKU "' . $v['sku'] . '" đã tồn tại ở sản phẩm khác.');
                $current = $this->db->queryOne("SELECT id FROM product_variants WHERE sku = ? AND product_id = ?", [$v['sku'], $id]);
                if ($current) {
                    $this->db->execute(
                        "UPDATE product_variants SET size=?, color=?, stock=?, price=? WHERE sku=?",
                        [$v['size'], $v['color'], $v['stock'], $v['price'], $v['sku']]
                    );
                } else {
                    $this->db->execute(
                        "INSERT INTO product_variants (product_id, sku, size, color, stock, price) VALUES (?, ?, ?, ?, ?, ?)",
                        [$id, $v['sku'], $v['size'], $v['color'], $v['stock'], $v['price']]
                    );
                }
            }
            $this->db->commit();
            Response::json(['ok' => true]);
        } catch (\Throwable $e) {
            $this->db->rollBack();
            Response::error($e->getMessage(), 400);
        }
    }

    public function destroy(array $p): void {
        Auth::requireRole('superadmin');
        try {
            $this->db->execute("DELETE FROM products WHERE id = ?", [$p['id']]);
            Response::json(['ok' => true]);
        } catch (\PDOException $e) {
            // FK RESTRICT — sản phẩm đã có trong lịch sử đơn hàng/phiếu nhập/phiếu trả
            Response::error('Không thể xóa — sản phẩm này đã có trong lịch sử đơn hàng/nhập kho/trả hàng.', 409);
        }
    }
}
