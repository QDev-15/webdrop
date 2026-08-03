<?php
declare(strict_types=1);

// Public (không cần Auth): danh mục/sản phẩm/đơn hàng/thanh toán — file TĨNH.
// Tách riêng khỏi PublicController.php (site tự viết cho settings/hero-slides/entity riêng)
// để logic Order+Payment luôn nhất quán, không lệch giữa các site shop.
class ShopPublicController {
    public function __construct(private Database $db) {}

    public function productCategories(): void {
        $cats = $this->db->query(
            "SELECT pc.*, COUNT(p.id) as product_count
             FROM product_categories pc
             LEFT JOIN products p ON p.category_id = pc.id AND p.status = 'published'
             GROUP BY pc.id
             ORDER BY pc.sort_order ASC"
        );
        Response::json($cats);
    }

    // Lọc + phân trang — xem web-deploy-builder.md rule 36-38 cho UI sidebar filter tương ứng.
    // AI có thể thêm điều kiện lọc khác (sizes, brand...) nếu site có cột đó — theo đúng
    // pattern CAST(?  AS INTEGER) cho so sánh giá (bắt buộc — xem comment inline bên dưới).
    public function products(): void {
        $search      = trim($_GET['q'] ?? '');
        $categoryIds = array_values(array_filter(array_map('intval', explode(',', $_GET['category_ids'] ?? '')), fn($v) => $v > 0));
        $minPrice    = isset($_GET['min_price']) && $_GET['min_price'] !== '' ? (int)$_GET['min_price'] : null;
        $maxPrice    = isset($_GET['max_price']) && $_GET['max_price'] !== '' ? (int)$_GET['max_price'] : null;
        $colors      = array_values(array_filter(array_map('trim', explode(',', $_GET['colors'] ?? ''))));
        $minRating   = isset($_GET['min_rating']) && $_GET['min_rating'] !== '' ? (float)$_GET['min_rating'] : null;
        $inStockOnly = ($_GET['in_stock'] ?? '') === '1';
        $saleOnly    = ($_GET['sale'] ?? '') === '1';
        $newOnly     = ($_GET['is_new'] ?? '') === '1';
        // ▼ Mở rộng riêng cho shop-my-pham: thương hiệu (exact match, multi), loại da + theme (padded pipe LIKE).
        $brands      = array_values(array_filter(array_map('trim', explode(',', $_GET['brands'] ?? ''))));
        $skinTypes   = array_values(array_filter(array_map('trim', explode(',', $_GET['skin_types'] ?? ''))));
        $themes      = array_values(array_filter(array_map('trim', explode(',', $_GET['theme'] ?? ''))));
        $sort        = $_GET['sort'] ?? 'default';
        $page        = max(1, (int)($_GET['page'] ?? 1));
        $perPage     = max(1, min(200, (int)($_GET['per_page'] ?? 12)));

        $where  = ["p.status = 'published'"];
        $params = [];

        if ($search !== '') {
            $where[] = '(p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)';
            $needle  = '%' . substr($search, 0, 100) . '%';
            array_push($params, $needle, $needle, $needle);
        }
        if ($categoryIds) {
            $ph = implode(',', array_fill(0, count($categoryIds), '?'));
            $where[] = "p.category_id IN ($ph)";
            array_push($params, ...$categoryIds);
        }
        // CAST(? AS INTEGER) bắt buộc — PDOStatement::execute() với mảng luôn bind param dạng PARAM_STR,
        // trong khi vế trái là biểu thức COALESCE (không có column affinity) nên SQLite so sánh theo storage
        // class thô: numeric luôn "nhỏ hơn" text → thiếu CAST thì `>= ?` với chuỗi '0' luôn false, lọc mất hết sản phẩm.
        if ($minPrice !== null) { $where[] = "COALESCE(NULLIF(p.price_sale,0), p.price) >= CAST(? AS INTEGER)"; $params[] = $minPrice; }
        if ($maxPrice !== null) { $where[] = "COALESCE(NULLIF(p.price_sale,0), p.price) <= CAST(? AS INTEGER)"; $params[] = $maxPrice; }
        if ($colors) {
            $clauses = [];
            foreach ($colors as $c) { $clauses[] = "p.colors LIKE ?"; $params[] = '%' . $c . '%'; }
            $where[] = '(' . implode(' OR ', $clauses) . ')';
        }
        if ($minRating !== null) { $where[] = "p.rating >= ?"; $params[] = $minRating; }
        if ($inStockOnly) { $where[] = "p.in_stock = 1"; }
        if ($saleOnly) { $where[] = "p.price_sale IS NOT NULL AND p.price_sale > 0 AND p.price_sale < p.price"; }
        if ($newOnly) { $where[] = "p.is_new = 1"; }
        if ($brands) {
            $ph = implode(',', array_fill(0, count($brands), '?'));
            $where[] = "p.brand IN ($ph)";
            array_push($params, ...$brands);
        }
        if ($skinTypes) {
            $clauses = [];
            foreach ($skinTypes as $s) { $clauses[] = "p.skin_type LIKE ?"; $params[] = '%|' . $s . '|%'; }
            $where[] = '(' . implode(' OR ', $clauses) . ')';
        }
        if ($themes) {
            $clauses = [];
            foreach ($themes as $t) { $clauses[] = "p.theme LIKE ?"; $params[] = '%|' . $t . '|%'; }
            $where[] = '(' . implode(' OR ', $clauses) . ')';
        }

        $whereSql = implode(' AND ', $where);

        $orderBy = match ($sort) {
            'price-asc'  => 'COALESCE(NULLIF(p.price_sale,0), p.price) ASC',
            'price-desc' => 'COALESCE(NULLIF(p.price_sale,0), p.price) DESC',
            'rating-desc', 'rating' => 'p.rating DESC',
            'sold-desc'  => 'p.sold DESC',
            'newest', 'new' => 'p.id DESC',
            default      => 'p.sort_order ASC, p.created_at DESC',
        };

        $totalRow = $this->db->queryOne("SELECT COUNT(*) as c FROM products p WHERE $whereSql", $params);
        $total    = (int)($totalRow['c'] ?? 0);
        $offset   = ($page - 1) * $perPage;

        $rows = $this->db->query(
            "SELECT p.*, pc.name as category_name, pc.slug as category_slug
             FROM products p
             LEFT JOIN product_categories pc ON pc.id = p.category_id
             WHERE $whereSql
             ORDER BY $orderBy
             LIMIT ? OFFSET ?",
            [...$params, $perPage, $offset]
        );

        header('X-Total-Count: ' . $total);
        Response::json($rows);
    }

    public function productBySlug(array $params): void {
        $slug = $params['slug'] ?? '';
        $product = $this->db->queryOne(
            "SELECT p.*, pc.name as category_name, pc.slug as category_slug
             FROM products p
             LEFT JOIN product_categories pc ON pc.id = p.category_id
             WHERE p.slug = ? AND p.status = 'published'",
            [$slug]
        );
        if (!$product) { Response::error('Không tìm thấy sản phẩm', 404); return; }
        Response::json($product);
    }

    public function paymentMethods(): void {
        $rows = $this->db->query("SELECT key, value FROM settings WHERE grp = 'payment'");
        $s = [];
        foreach ($rows as $r) { $s[$r['key']] = $r['value']; }
        $bankCode      = $s['sepay_bank_code'] ?? '';
        $accountNumber = $s['sepay_account_number'] ?? '';
        $accountName   = $s['sepay_account_name'] ?? '';
        // Bật SePay nhưng chưa điền đủ tài khoản nhận tiền = chưa dùng được thật — không chào phương thức này cho khách
        $sepayReady = ($s['payment_sepay_enabled'] ?? '0') === '1' && $bankCode !== '' && $accountNumber !== '' && $accountName !== '';
        Response::json([
            'cod_enabled'          => ($s['payment_cod_enabled'] ?? '1') === '1',
            'sepay_enabled'        => $sepayReady,
            'sepay_bank_code'      => $bankCode,
            'sepay_account_number' => $accountNumber,
            'sepay_account_name'   => $accountName,
        ]);
    }

    // ── Coupon extension (bảng `coupons` riêng, độc lập với hệ discount của System DB) ──
    private function lookupCoupon(string $code, int $subtotal): array {
        $code = strtoupper(trim($code));
        if ($code === '') return ['ok' => false, 'error' => 'Vui lòng nhập mã giảm giá', 'coupon' => null, 'discount' => 0];

        $coupon = $this->db->queryOne("SELECT * FROM coupons WHERE code = ? AND is_active = 1", [$code]);
        if (!$coupon) return ['ok' => false, 'error' => 'Mã giảm giá không tồn tại hoặc đã ngừng áp dụng', 'coupon' => null, 'discount' => 0];
        if ($coupon['expires_at'] && strtotime($coupon['expires_at']) < time()) {
            return ['ok' => false, 'error' => 'Mã giảm giá đã hết hạn', 'coupon' => null, 'discount' => 0];
        }
        if ($coupon['max_uses'] !== null && (int)$coupon['used_count'] >= (int)$coupon['max_uses']) {
            return ['ok' => false, 'error' => 'Mã giảm giá đã hết lượt sử dụng', 'coupon' => null, 'discount' => 0];
        }
        if ($subtotal < (int)$coupon['min_order']) {
            $min = number_format((int)$coupon['min_order'], 0, ',', '.');
            return ['ok' => false, 'error' => "Đơn hàng tối thiểu {$min}đ để áp dụng mã này", 'coupon' => null, 'discount' => 0];
        }

        $discount = $coupon['type'] === 'percent'
            ? (int)round($subtotal * (int)$coupon['value'] / 100)
            : (int)$coupon['value'];
        $discount = min($discount, $subtotal);

        return ['ok' => true, 'error' => null, 'coupon' => $coupon, 'discount' => $discount];
    }

    public function validateCoupon(): void {
        $data     = bodyJson();
        $code     = trim($data['code'] ?? '');
        $subtotal = max(0, (int)($data['subtotal'] ?? 0));
        $result   = $this->lookupCoupon($code, $subtotal);
        if (!$result['ok']) { Response::error($result['error'], 422); return; }
        Response::json(['code' => $result['coupon']['code'], 'type' => $result['coupon']['type'], 'discount' => $result['discount']]);
    }

    public function createOrder(): void {
        $data          = bodyJson();
        $name          = trim($data['customer_name'] ?? '');
        $phone         = trim($data['phone'] ?? '');
        $email         = trim($data['email'] ?? '');
        $address       = trim($data['address'] ?? '');
        $note          = trim($data['note'] ?? '');
        $paymentMethod = trim($data['payment_method'] ?? 'cod');
        $couponCode    = strtoupper(trim($data['coupon_code'] ?? ''));
        $items         = is_array($data['items'] ?? null) ? $data['items'] : [];

        if (!$name || !$phone || !$address) {
            Response::error('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ giao hàng', 422);
            return;
        }
        if (mb_strlen($name) > 120 || mb_strlen($phone) > 30 || mb_strlen($email) > 200 || mb_strlen($address) > 500 || mb_strlen($note) > 1000) {
            Response::error('Nội dung vượt quá độ dài cho phép', 422);
            return;
        }
        if (!$items) { Response::error('Giỏ hàng đang trống', 422); return; }
        if (!in_array($paymentMethod, ['cod', 'sepay'], true)) {
            Response::error('Phương thức thanh toán không hợp lệ', 422);
            return;
        }

        $settingsRows = $this->db->query("SELECT key, value FROM settings WHERE grp IN ('payment','shop')");
        $s = [];
        foreach ($settingsRows as $r) { $s[$r['key']] = $r['value']; }

        if ($paymentMethod === 'cod' && ($s['payment_cod_enabled'] ?? '1') !== '1') {
            Response::error('Phương thức thanh toán khi nhận hàng hiện không khả dụng', 422);
            return;
        }
        if ($paymentMethod === 'sepay') {
            if (($s['payment_sepay_enabled'] ?? '0') !== '1') {
                Response::error('Phương thức chuyển khoản hiện không khả dụng', 422);
                return;
            }
            // Bật SePay nhưng chưa cấu hình đủ tài khoản nhận tiền → không tạo đơn (khách sẽ không có gì để quét/chuyển khoản)
            if (($s['sepay_bank_code'] ?? '') === '' || ($s['sepay_account_number'] ?? '') === '' || ($s['sepay_account_name'] ?? '') === '') {
                Response::error('Cửa hàng chưa cấu hình tài khoản nhận tiền SePay — vui lòng chọn phương thức khác hoặc liên hệ shop.', 422);
                return;
            }
        }

        // Tính lại giá từ DB — không tin giá client gửi lên
        $orderItems = [];
        $subtotal   = 0;
        foreach ($items as $it) {
            $pid = (int)($it['product_id'] ?? 0);
            $qty = max(1, min(99, (int)($it['qty'] ?? 1)));
            $product = $this->db->queryOne("SELECT * FROM products WHERE id = ? AND status = 'published'", [$pid]);
            if (!$product) continue;
            $price        = (int)($product['price_sale'] ?: $product['price']);
            $lineSubtotal = $price * $qty;
            $subtotal    += $lineSubtotal;
            $orderItems[] = ['product_id' => $pid, 'product_name' => $product['name'], 'price' => $price, 'qty' => $qty, 'subtotal' => $lineSubtotal];
        }
        if (!$orderItems) { Response::error('Giỏ hàng không hợp lệ', 422); return; }

        $discount = 0;
        $coupon   = null;
        if ($couponCode !== '') {
            $result = $this->lookupCoupon($couponCode, $subtotal);
            if (!$result['ok']) { Response::error($result['error'], 422); return; }
            $discount = $result['discount'];
            $coupon   = $result['coupon'];
        }

        $shippingFee = (int)($s['shipping_fee'] ?? 0);
        $threshold   = (int)($s['free_shipping_threshold'] ?? 0);
        if ($threshold > 0 && $subtotal >= $threshold) { $shippingFee = 0; }
        $total = max(0, $subtotal + $shippingFee - $discount);

        do {
            $orderCode = 'DH' . date('ymd') . strtoupper(substr(bin2hex(random_bytes(3)), 0, 5));
        } while ($this->db->queryOne("SELECT id FROM orders WHERE order_code = ?", [$orderCode]));

        $paymentStatus = $paymentMethod === 'sepay' ? 'pending' : 'unpaid';

        $orderId = $this->db->execute(
            "INSERT INTO orders (order_code, customer_name, phone, email, address, note, subtotal, shipping_fee, discount, coupon_code, total, payment_method, payment_status, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')",
            [$orderCode, $name, $phone, $email, $address, $note, $subtotal, $shippingFee, $discount, $coupon ? $coupon['code'] : null, $total, $paymentMethod, $paymentStatus]
        );

        foreach ($orderItems as $it) {
            $this->db->execute(
                "INSERT INTO order_items (order_id, product_id, product_name, price, qty, subtotal) VALUES (?, ?, ?, ?, ?, ?)",
                [$orderId, $it['product_id'], $it['product_name'], $it['price'], $it['qty'], $it['subtotal']]
            );
        }

        if ($coupon) {
            $this->db->execute("UPDATE coupons SET used_count = used_count + 1 WHERE id = ?", [$coupon['id']]);
        }

        $response = [
            'order_code'     => $orderCode,
            'subtotal'       => $subtotal,
            'shipping_fee'   => $shippingFee,
            'discount'       => $discount,
            'total'          => $total,
            'payment_method' => $paymentMethod,
            'payment_status' => $paymentStatus,
        ];
        if ($paymentMethod === 'sepay') {
            $response['sepay'] = [
                'bank_code'      => $s['sepay_bank_code'] ?? '',
                'account_number' => $s['sepay_account_number'] ?? '',
                'account_name'   => $s['sepay_account_name'] ?? '',
                'amount'         => $total,
                'content'        => $orderCode,
            ];
        }
        Response::json($response, 201);
    }

    public function orderStatus(array $params): void {
        $code  = $params['code'] ?? '';
        $order = $this->db->queryOne("SELECT order_code, payment_status, status, total FROM orders WHERE order_code = ?", [$code]);
        if (!$order) { Response::error('Không tìm thấy đơn hàng', 404); return; }
        Response::json($order);
    }

    public function sepayWebhook(): void {
        $secretRow  = $this->db->queryOne("SELECT value FROM settings WHERE key = 'sepay_webhook_secret'");
        $secret     = $secretRow['value'] ?? '';
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (!$secret || !hash_equals('Apikey ' . $secret, $authHeader)) {
            Response::error('Unauthorized', 401);
            return;
        }

        $data         = bodyJson();
        $content      = (string)($data['content'] ?? '');
        $amount       = (int)($data['transferAmount'] ?? 0);
        $transferType = $data['transferType'] ?? 'in';

        // Chỉ xử lý giao dịch tiền vào — bỏ qua giao dịch ra, luôn trả success cho SePay
        if ($transferType !== 'in' || !preg_match('/DH[0-9A-Z]+/', strtoupper($content), $m)) {
            Response::json(['success' => true]);
            return;
        }

        $order = $this->db->queryOne("SELECT * FROM orders WHERE order_code = ? AND payment_method = 'sepay'", [$m[0]]);
        if (!$order || $order['payment_status'] === 'paid' || $amount < (int)$order['total']) {
            Response::json(['success' => true]);
            return;
        }

        $this->db->execute(
            "UPDATE orders SET payment_status = 'paid', status = 'processing', updated_at = datetime('now') WHERE id = ?",
            [$order['id']]
        );
        Response::json(['success' => true]);
    }

    // Sitemap XML động — route GET /sitemap.xml (đăng ký ở bootstrap.php, xem
    // web-deploy-builder.md rule SEO). Ghi đè Content-Type JSON mặc định của Router.
    // $staticRoutes chỉ liệt kê các trang tĩnh CHUNG cho mọi site shop — nếu site có thêm
    // trang riêng (vd /ve-chung-toi, /khuyen-mai, /bo-suu-tap) thì AI (web-deploy-builder)
    // phải tự thêm vào mảng này khi tích hợp — KHÔNG viết lại toàn bộ method.
    public function sitemap(): void {
        header('Content-Type: application/xml; charset=utf-8');

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $base   = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        $staticRoutes = ['/', '/san-pham', '/lien-he', '/chinh-sach-bao-mat', '/dieu-khoan', '/bo-suu-tap', '/ve-chung-toi'];

        $urls = [];
        foreach ($staticRoutes as $route) {
            $urls[] = ['loc' => $base . $route, 'lastmod' => null];
        }

        $products = $this->db->query("SELECT slug, updated_at FROM products WHERE status = 'published'");
        foreach ($products as $p) {
            $urls[] = ['loc' => $base . '/san-pham/' . $p['slug'], 'lastmod' => substr($p['updated_at'], 0, 10)];
        }

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($urls as $u) {
            echo '  <url><loc>' . htmlspecialchars($u['loc'], ENT_XML1) . '</loc>';
            if ($u['lastmod']) echo '<lastmod>' . $u['lastmod'] . '</lastmod>';
            echo '</url>' . "\n";
        }
        echo '</urlset>';
    }
}
