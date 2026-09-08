<?php
declare(strict_types=1);

class Database {
    private \PDO $pdo;
    private static ?Database $instance = null;

    private function __construct() {
        $dbDir = dirname(DB_FILE);
        if (!is_dir($dbDir)) {
            mkdir($dbDir, 0755, true);
        }
        $this->pdo = new \PDO('sqlite:' . DB_FILE);
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->pdo->exec('PRAGMA journal_mode = WAL');
        $this->migrate();
    }

    public static function getInstance(): self {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function migrate(): void {
        $schemaPath = __DIR__ . '/../schema.sql';
        $schema = file_get_contents($schemaPath);
        if ($schema === false) {
            throw new \RuntimeException('schema.sql not found: ' . $schemaPath);
        }
        // Strip dòng comment TRƯỚC khi split theo ';' — tránh trường hợp comment
        // chứa ';' làm vỡ explode() và làm rớt mất CREATE TABLE phía sau.
        $schema = preg_replace('/^\s*--.*$/m', '', $schema);
        foreach (array_filter(array_map('trim', explode(';', $schema))) as $stmt) {
            if ($stmt) {
                try { $this->pdo->exec($stmt); } catch (\PDOException $e) { /* ignore IF NOT EXISTS */ }
            }
        }
        $this->seedData();
    }

    private function seedData(): void {
        $this->seedUsers();
        $this->seedSettings();
        $this->seedHeroSlides();
        $this->seedExtensions();
    }

    protected function seedExtensions(): void {
        $this->seedCategories();
        $this->seedProducts();
        $this->seedSuppliers();
        $this->seedCustomers();
        $this->seedHistory();
    }

    private function seedUsers(): void {
        if ($this->scalar("SELECT COUNT(*) FROM users") > 0) return;
        $this->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['Quản lý', 'sysadmin@admin.com', password_hash('123456', PASSWORD_BCRYPT), 'superadmin']
        );
        $this->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['Nhân viên 01', 'nv01@pos-banhang.local', password_hash('123456', PASSWORD_BCRYPT), 'user']
        );
    }

    private function seedSettings(): void {
        if ($this->scalar("SELECT COUNT(*) FROM settings") > 0) return;
        $settings = [
            ['site_name', 'POS Bán Hàng', 'general'],
            ['site_tagline', 'Quản lý bán hàng chuyên nghiệp cho nhà hàng, quán ăn, café và cửa hàng bán lẻ', 'general'],
            ['site_description', 'Hệ thống POS bán hàng — quét mã vạch, giữ đơn, đa thanh toán, quản lý ca làm việc, kho hàng, khách hàng thân thiết và báo cáo trực quan.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'info@pos-shop.com', 'general'],
            ['site_phone', '0900 000 000', 'general'],
            ['site_address', '123 Đường Ví Dụ, Quận 1, TP.HCM, Việt Nam', 'general'],
            ['working_hours', 'Thứ 2 - Thứ 7: 7:00 - 22:00. Chủ Nhật: 9:00 - 20:00', 'general'],
            ['meta_title', 'POS Bán Hàng — Hệ thống quản lý bán hàng chuyên nghiệp', 'seo'],
            ['meta_description', 'Giải pháp POS bán hàng toàn diện: quét mã vạch, giữ đơn, đa thanh toán, quản lý ca, kho hàng, khách hàng và báo cáo trực quan.', 'seo'],
            ['meta_keywords', 'pos bán hàng, quản lý bán hàng, phần mềm quán ăn, phần mềm bán lẻ', 'seo'],
            ['facebook_url', '#', 'social'],
            ['instagram_url', '#', 'social'],
            ['zalo_url', '#', 'social'],
            ['footer_copyright', '© 2026 POS Bán hàng. All rights reserved.', 'footer'],
            ['footer_description', 'Hệ thống quản lý bán hàng chuyên nghiệp cho nhà hàng, quán ăn, café và cửa hàng bán lẻ.', 'footer'],
            ['smtp_host', '', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['currency_symbol', 'đ', 'system'],
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key', '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            ['cloudinary_folder', 'webdrop', 'cloudinary'],
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];
        foreach ($settings as [$key, $value, $group]) {
            $this->execute(
                "INSERT OR IGNORE INTO settings (key, value, grp) VALUES (?, ?, ?)",
                [$key, $value, $group]
            );
        }
    }

    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        $this->execute(
            "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
            [
                'Quản lý bán hàng chuyên nghiệp',
                'Bán hàng nhanh, quản lý kho chặt chẽ, chăm sóc khách hàng thân thiết — tất cả trong 1 hệ thống POS.',
                'Tìm hiểu thêm', '/gioi-thieu',
                'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80&auto=format&fit=crop',
                1,
            ]
        );
    }

    // ─── Extension seeds — ngách POS bán hàng ───────────────────────────────────

    private const CATEGORIES = [
        ['id' => 1, 'name' => 'Cơm'],
        ['id' => 2, 'name' => 'Mì/Phở'],
        ['id' => 3, 'name' => 'Nước'],
        ['id' => 4, 'name' => 'Tráng miệng'],
        ['id' => 5, 'name' => 'Khác'],
    ];

    private const SUPPLIERS = [
        'Chành Thực Phẩm Miền Tây',
        'Vựa Rau Củ Sạch An Bình',
        'Công ty TNHH Đồ Uống Sài Gòn',
    ];

    // Port 1:1 từ SEED_PRODUCTS trong seed-data.js (bản tĩnh Gói A)
    private const PRODUCTS = [
        ['id' => 1, 'name' => 'Cơm Tấm Sườn Bì Chả', 'category_id' => 1, 'price' => 45000, 'cost_price' => 27000, 'unit' => 'suất', 'stock' => 40, 'min_stock' => 10, 'barcode' => '8938501234501', 'image' => 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop'],
        ['id' => 2, 'name' => 'Cơm Gà Xối Mỡ', 'category_id' => 1, 'price' => 55000, 'cost_price' => 33000, 'unit' => 'suất', 'stock' => 30, 'min_stock' => 10, 'barcode' => '8938501234502', 'image' => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop'],
        ['id' => 3, 'name' => 'Cơm Thịt Kho Trứng', 'category_id' => 1, 'price' => 48000, 'cost_price' => 29000, 'unit' => 'suất', 'stock' => 25, 'min_stock' => 8, 'barcode' => '8938501234503', 'image' => 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=400&fit=crop'],
        ['id' => 4, 'name' => 'Cơm Gà Quay', 'category_id' => 1, 'price' => 60000, 'cost_price' => 37000, 'unit' => 'suất', 'stock' => 20, 'min_stock' => 8, 'barcode' => '8938501234504', 'image' => 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop'],
        ['id' => 5, 'name' => 'Cơm Chay Thập Cẩm', 'category_id' => 1, 'price' => 42000, 'cost_price' => 24000, 'unit' => 'suất', 'stock' => 15, 'min_stock' => 5, 'barcode' => '8938501234505', 'image' => 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop'],
        ['id' => 6, 'name' => 'Phở Bò Tái Nạm', 'category_id' => 2, 'price' => 55000, 'cost_price' => 32000, 'unit' => 'tô', 'stock' => 35, 'min_stock' => 10, 'barcode' => '8938501234506', 'image' => 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop'],
        ['id' => 7, 'name' => 'Phở Gà', 'category_id' => 2, 'price' => 50000, 'cost_price' => 29000, 'unit' => 'tô', 'stock' => 28, 'min_stock' => 10, 'barcode' => '8938501234507', 'image' => 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=400&fit=crop'],
        ['id' => 8, 'name' => 'Mì Vàng Sườn Non', 'category_id' => 2, 'price' => 48000, 'cost_price' => 28000, 'unit' => 'tô', 'stock' => 6, 'min_stock' => 8, 'barcode' => '8938501234508', 'image' => 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop'],
        ['id' => 9, 'name' => 'Bánh Canh Cua', 'category_id' => 2, 'price' => 52000, 'cost_price' => 31000, 'unit' => 'tô', 'stock' => 18, 'min_stock' => 6, 'barcode' => '8938501234509', 'image' => 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop'],
        ['id' => 10, 'name' => 'Hủ Tiếu Nam Vang', 'category_id' => 2, 'price' => 50000, 'cost_price' => 29000, 'unit' => 'tô', 'stock' => 22, 'min_stock' => 8, 'barcode' => '8938501234510', 'image' => 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop'],
        ['id' => 11, 'name' => 'Cà Phê Sữa Đá', 'category_id' => 3, 'price' => 25000, 'cost_price' => 9000, 'unit' => 'ly', 'stock' => 0, 'min_stock' => 15, 'barcode' => '8938501234511', 'image' => 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', 'variants' => [
            ['sku' => 'CF-S-D', 'size' => 'S', 'color' => 'Đá', 'stock' => 25, 'price' => 20000],
            ['sku' => 'CF-M-D', 'size' => 'M', 'color' => 'Đá', 'stock' => 30, 'price' => 25000],
            ['sku' => 'CF-L-D', 'size' => 'L', 'color' => 'Đá', 'stock' => 20, 'price' => 30000],
            ['sku' => 'CF-M-N', 'size' => 'M', 'color' => 'Nóng', 'stock' => 15, 'price' => 25000],
        ]],
        ['id' => 12, 'name' => 'Trà Đào Cam Sả', 'category_id' => 3, 'price' => 30000, 'cost_price' => 12000, 'unit' => 'ly', 'stock' => 0, 'min_stock' => 12, 'barcode' => '8938501234512', 'image' => 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400&h=400&fit=crop', 'variants' => [
            ['sku' => 'TD-S-D', 'size' => 'S', 'color' => 'Đá', 'stock' => 18, 'price' => 25000],
            ['sku' => 'TD-M-D', 'size' => 'M', 'color' => 'Đá', 'stock' => 22, 'price' => 30000],
            ['sku' => 'TD-L-D', 'size' => 'L', 'color' => 'Đá', 'stock' => 15, 'price' => 35000],
        ]],
        ['id' => 13, 'name' => 'Sinh Tố Bơ', 'category_id' => 3, 'price' => 30000, 'cost_price' => 14000, 'unit' => 'ly', 'stock' => 20, 'min_stock' => 8, 'barcode' => '8938501234513', 'image' => 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=400&fit=crop'],
        ['id' => 14, 'name' => 'Nước Cam Ép', 'category_id' => 3, 'price' => 20000, 'cost_price' => 8000, 'unit' => 'ly', 'stock' => 3, 'min_stock' => 10, 'barcode' => '8938501234514', 'image' => 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop'],
        ['id' => 15, 'name' => 'Bia Tiger', 'category_id' => 3, 'price' => 25000, 'cost_price' => 15000, 'unit' => 'lon', 'stock' => 60, 'min_stock' => 20, 'barcode' => '8938501234515', 'image' => 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400&h=400&fit=crop'],
        ['id' => 16, 'name' => 'Trà Sữa Trân Châu', 'category_id' => 3, 'price' => 35000, 'cost_price' => 14000, 'unit' => 'ly', 'stock' => 0, 'min_stock' => 15, 'barcode' => '8938501234516', 'image' => 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=400&fit=crop', 'variants' => [
            ['sku' => 'TS-S', 'size' => 'S', 'color' => 'Ít đá', 'stock' => 20, 'price' => 30000],
            ['sku' => 'TS-M', 'size' => 'M', 'color' => 'Ít đá', 'stock' => 25, 'price' => 35000],
            ['sku' => 'TS-L', 'size' => 'L', 'color' => 'Bình thường', 'stock' => 15, 'price' => 40000],
        ]],
        ['id' => 17, 'name' => 'Chè Ba Màu', 'category_id' => 4, 'price' => 20000, 'cost_price' => 9000, 'unit' => 'ly', 'stock' => 25, 'min_stock' => 8, 'barcode' => '8938501234517', 'image' => 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop'],
        ['id' => 18, 'name' => 'Kem Xoài', 'category_id' => 4, 'price' => 25000, 'cost_price' => 11000, 'unit' => 'ly', 'stock' => 5, 'min_stock' => 10, 'barcode' => '8938501234518', 'image' => 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop'],
        ['id' => 19, 'name' => 'Bánh Mì Thịt', 'category_id' => 5, 'price' => 20000, 'cost_price' => 9000, 'unit' => 'cái', 'stock' => 40, 'min_stock' => 15, 'barcode' => '8938501234519', 'image' => 'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=400&h=400&fit=crop'],
        ['id' => 20, 'name' => 'Bánh Cuốn Chả', 'category_id' => 5, 'price' => 25000, 'cost_price' => 12000, 'unit' => 'suất', 'stock' => 20, 'min_stock' => 8, 'barcode' => '8938501234520', 'image' => 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop'],
    ];

    // Port 1:1 từ SEED_CUSTOMERS — 10 khách đủ 4 hạng (Đồng/Bạc/Vàng/Kim Cương)
    private const CUSTOMERS = [
        ['name' => 'Nguyễn Văn An', 'phone' => '0901111111', 'email' => '', 'birthday' => '1992-03-14', 'total_spent' => 500000, 'points' => 50, 'days_ago' => 84],
        ['name' => 'Trần Thị Bích', 'phone' => '0902222222', 'email' => 'bich.tran@example.com', 'birthday' => '1995-07-22', 'total_spent' => 1500000, 'points' => 150, 'days_ago' => 110],
        ['name' => 'Lê Hoàng Cường', 'phone' => '0903333333', 'email' => '', 'birthday' => '1988-11-02', 'total_spent' => 3200000, 'points' => 320, 'days_ago' => 141],
        ['name' => 'Phạm Thị Dung', 'phone' => '0904444444', 'email' => 'dung.pham@example.com', 'birthday' => '1990-01-30', 'total_spent' => 7800000, 'points' => 780, 'days_ago' => 187],
        ['name' => 'Hoàng Văn Em', 'phone' => '0905555555', 'email' => '', 'birthday' => '1985-09-18', 'total_spent' => 9500000, 'points' => 950, 'days_ago' => 206],
        ['name' => 'Vũ Thị Phương', 'phone' => '0906666666', 'email' => 'phuong.vu@example.com', 'birthday' => '1993-05-06', 'total_spent' => 15000000, 'points' => 1500, 'days_ago' => 231],
        ['name' => 'Đặng Văn Giang', 'phone' => '0907777777', 'email' => '', 'birthday' => '1980-12-25', 'total_spent' => 25000000, 'points' => 2500, 'days_ago' => 280],
        ['name' => 'Bùi Thị Hoa', 'phone' => '0908888888', 'email' => 'hoa.bui@example.com', 'birthday' => '1991-04-09', 'total_spent' => 35000000, 'points' => 3500, 'days_ago' => 333],
        ['name' => 'Ngô Văn Inh', 'phone' => '0909999999', 'email' => '', 'birthday' => '1978-06-11', 'total_spent' => 52000000, 'points' => 5200, 'days_ago' => 402],
        ['name' => 'Đỗ Thị Kim', 'phone' => '0900000000', 'email' => '', 'birthday' => '', 'total_spent' => 0, 'points' => 0, 'days_ago' => 0],
    ];

    private function seedCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM categories") > 0) return;
        foreach (self::CATEGORIES as $i => $c) {
            $this->execute("INSERT INTO categories (id, name, sort_order) VALUES (?, ?, ?)", [$c['id'], $c['name'], $i]);
        }
    }

    private function seedProducts(): void {
        if ($this->scalar("SELECT COUNT(*) FROM products") > 0) return;
        foreach (self::PRODUCTS as $p) {
            $hasVariants = !empty($p['variants']);
            $this->execute(
                "INSERT INTO products (id, name, category_id, price, cost_price, unit, barcode, stock, min_stock, has_variants, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [$p['id'], $p['name'], $p['category_id'], $p['price'], $p['cost_price'], $p['unit'], $p['barcode'], $p['stock'], $p['min_stock'], $hasVariants ? 1 : 0, $p['image']]
            );
            if ($hasVariants) {
                foreach ($p['variants'] as $v) {
                    $this->execute(
                        "INSERT INTO product_variants (product_id, sku, size, color, stock, price) VALUES (?, ?, ?, ?, ?, ?)",
                        [$p['id'], $v['sku'], $v['size'], $v['color'], $v['stock'], $v['price']]
                    );
                }
            }
        }
    }

    private function seedSuppliers(): void {
        if ($this->scalar("SELECT COUNT(*) FROM suppliers") > 0) return;
        foreach (self::SUPPLIERS as $name) {
            $this->execute("INSERT INTO suppliers (name) VALUES (?)", [$name]);
        }
    }

    private function seedCustomers(): void {
        if ($this->scalar("SELECT COUNT(*) FROM customers") > 0) return;
        foreach (self::CUSTOMERS as $c) {
            $createdAt = date('Y-m-d H:i:s', strtotime('-' . $c['days_ago'] . ' days'));
            $this->execute(
                "INSERT INTO customers (name, phone, email, birthday, total_spent, points, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [$c['name'], $c['phone'], $c['email'], $c['birthday'], $c['total_spent'], $c['points'], $createdAt]
            );
        }
    }

    /**
     * Sinh lịch sử demo: ~30 đơn hàng trải 7 ngày gần nhất + 7 ca làm việc đã đóng
     * (không có ca nào mở sẵn) + 2 phiếu nhập kho mẫu + 1 phiếu trả hàng mẫu.
     * Port tinh thần từ seedGenerateHistory() trong seed-data.js (bản tĩnh) — dùng
     * số ngẫu nhiên thật (mt_rand) như bản gốc (bản gốc cũng dùng Math.random(),
     * không có gì đảm bảo tái lập y hệt — chỉ cần đúng cấu trúc/ràng buộc dữ liệu).
     */
    private function seedHistory(): void {
        if ($this->scalar("SELECT COUNT(*) FROM orders") > 0) return;

        $cashierId = (int)$this->scalar("SELECT id FROM users WHERE role = 'user' ORDER BY id LIMIT 1");
        if (!$cashierId) return;

        $products = $this->query("SELECT * FROM products");
        $variantsByProduct = [];
        foreach ($this->query("SELECT * FROM product_variants") as $v) {
            $variantsByProduct[$v['product_id']][] = $v;
        }
        $customerIds = array_column($this->query("SELECT id FROM customers"), 'id');
        $paymentMethods = ['cash', 'cash', 'cash', 'transfer', 'transfer', 'qr', 'card'];

        $coffeeOrderId = null;
        $coffeeVariantSku = null;

        for ($dayOffset = 6; $dayOffset >= 0; $dayOffset--) {
            $dayBase = strtotime("-{$dayOffset} days");
            $openTime = strtotime(date('Y-m-d', $dayBase) . ' 08:00:00');
            $closeTime = $dayOffset === 0
                ? strtotime(date('Y-m-d', $dayBase) . ' 12:00:00')
                : strtotime(date('Y-m-d', $dayBase) . ' 20:00:00');

            $openingCash = 500000;
            $shiftId = (int)$this->execute(
                "INSERT INTO shifts (user_id, opened_at, opening_cash, status) VALUES (?, ?, ?, 'open')",
                [$cashierId, date('Y-m-d H:i:s', $openTime), $openingCash]
            );

            $orderCount = mt_rand(3, 6);
            $cashRevenue = 0;

            for ($i = 0; $i < $orderCount; $i++) {
                $itemCount = mt_rand(1, 4);
                $items = [];
                for ($j = 0; $j < $itemCount; $j++) {
                    $product = $products[array_rand($products)];
                    $variantSku = null; $size = ''; $color = ''; $price = (float)$product['price']; $unit = $product['unit'];
                    if ($product['has_variants'] && !empty($variantsByProduct[$product['id']])) {
                        $v = $variantsByProduct[$product['id']][array_rand($variantsByProduct[$product['id']])];
                        $variantSku = $v['sku']; $size = $v['size']; $color = $v['color']; $price = (float)$v['price'];
                    }
                    $qty = mt_rand(1, 2);
                    $key = $product['id'] . '::' . ($variantSku ?? '');
                    if (isset($items[$key])) {
                        $items[$key]['quantity'] += $qty;
                    } else {
                        $items[$key] = [
                            'product_id' => $product['id'], 'name' => $product['name'], 'unit' => $unit,
                            'variant_sku' => $variantSku, 'size' => $size, 'color' => $color,
                            'price' => $price, 'quantity' => $qty,
                        ];
                    }
                }
                // Đảm bảo LUÔN có ít nhất 1 đơn chứa Cà Phê Sữa Đá (product_id=11) trong lịch sử
                // — dùng làm dữ liệu mẫu cho 1 phiếu trả hàng chắc chắn tồn tại sau seed, thay vì
                // trông chờ vào may rủi random (bản tĩnh gốc cũng dựa vào ngẫu nhiên, nhưng ở đây
                // cần đảm bảo tính năng "trả hàng" luôn có dữ liệu demo minh họa được).
                if ($coffeeOrderId === null && $dayOffset === 5 && $i === 0) {
                    $coffeeVariants = $variantsByProduct[11] ?? [];
                    if ($coffeeVariants) {
                        $v = $coffeeVariants[0];
                        $key = 11 . '::' . $v['sku'];
                        $items[$key] = [
                            'product_id' => 11, 'name' => 'Cà Phê Sữa Đá', 'unit' => 'ly',
                            'variant_sku' => $v['sku'], 'size' => $v['size'], 'color' => $v['color'],
                            'price' => (float)$v['price'], 'quantity' => 1,
                        ];
                    }
                }
                $items = array_values($items);

                $subtotal = array_sum(array_map(fn($it) => $it['price'] * $it['quantity'], $items));
                $discountPct = (mt_rand(1, 100) <= 25) ? mt_rand(5, 10) : 0;
                $discount = min($subtotal * $discountPct / 100, $subtotal);
                $total = max(0, $subtotal - $discount);

                $hasCustomer = !empty($customerIds) && mt_rand(1, 100) <= 60;
                $customerId = $hasCustomer ? $customerIds[array_rand($customerIds)] : null;
                $paymentMethod = $paymentMethods[array_rand($paymentMethods)];

                $orderTime = $openTime + ($i + 1) * mt_rand(20, 90) * 60;
                if ($orderTime > $closeTime) $orderTime = $closeTime - 300;

                $pointsEarned = $customerId ? (int)floor($total / 10000) : 0;

                $cashReceived = null; $changeGiven = null;
                if ($paymentMethod === 'cash') {
                    $cashReceived = ceil($total / 10000) * 10000;
                    $changeGiven = $cashReceived - $total;
                    $cashRevenue += $total;
                }

                $orderId = (int)$this->execute(
                    "INSERT INTO orders (code, table_no, customer_id, subtotal, discount, total, payment_method, cash_received, change_given, points_earned, shift_id, created_by, status, created_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?)",
                    ['', (string)mt_rand(1, 12), $customerId, $subtotal, $discount, $total, $paymentMethod, $cashReceived, $changeGiven, $pointsEarned, $shiftId, $cashierId, date('Y-m-d H:i:s', $orderTime)]
                );
                $code = 'HD' . date('ymd', $orderTime) . str_pad((string)$orderId, 4, '0', STR_PAD_LEFT);
                $this->execute("UPDATE orders SET code = ? WHERE id = ?", [$code, $orderId]);

                foreach ($items as $it) {
                    $this->execute(
                        "INSERT INTO order_items (order_id, product_id, variant_sku, product_name, unit, size, color, price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        [$orderId, $it['product_id'], $it['variant_sku'], $it['name'], $it['unit'], $it['size'], $it['color'], $it['price'], $it['quantity']]
                    );
                    if ($coffeeOrderId === null && $it['product_id'] === 11 && $it['variant_sku']) {
                        $coffeeOrderId = $orderId;
                        $coffeeVariantSku = $it['variant_sku'];
                    }
                }

                if ($customerId) {
                    $this->execute(
                        "UPDATE customers SET total_spent = total_spent + ?, points = points + ? WHERE id = ?",
                        [$total, $pointsEarned, $customerId]
                    );
                }
            }

            $closingCashExpected = $openingCash + $cashRevenue;
            $variance = mt_rand(-5000, 5000);
            $closingCashCounted = max(0, $closingCashExpected + $variance);
            $this->execute(
                "UPDATE shifts SET closed_at = ?, closing_cash_counted = ?, closing_cash_expected = ?, difference = ?, status = 'closed' WHERE id = ?",
                [date('Y-m-d H:i:s', $closeTime), $closingCashCounted, $closingCashExpected, $closingCashCounted - $closingCashExpected, $shiftId]
            );
        }

        // 2 phiếu nhập kho mẫu — chỉ ghi lịch sử, KHÔNG cộng thêm tồn kho (tồn kho hiện
        // tại đã là giá trị "đúng" được author sẵn trong self::PRODUCTS)
        $imp1Date = date('Y-m-d', strtotime('-3 days'));
        $imp1Total = 50 * 27000 + 40 * 32000;
        $imp1Id = (int)$this->execute(
            "INSERT INTO stock_imports (supplier, import_date, total_cost, created_by) VALUES (?, ?, ?, ?)",
            [self::SUPPLIERS[0], $imp1Date, $imp1Total, $cashierId]
        );
        $this->execute("INSERT INTO stock_import_items (import_id, product_id, product_name, quantity, unit_cost) VALUES (?, 1, 'Cơm Tấm Sườn Bì Chả', 50, 27000)", [$imp1Id]);
        $this->execute("INSERT INTO stock_import_items (import_id, product_id, product_name, quantity, unit_cost) VALUES (?, 6, 'Phở Bò Tái Nạm', 40, 32000)", [$imp1Id]);

        $imp2Date = date('Y-m-d', strtotime('-1 days'));
        $imp2Total = 30 * 8000 + 20 * 14000;
        $imp2Id = (int)$this->execute(
            "INSERT INTO stock_imports (supplier, import_date, total_cost, created_by) VALUES (?, ?, ?, ?)",
            [self::SUPPLIERS[1], $imp2Date, $imp2Total, $cashierId]
        );
        $this->execute("INSERT INTO stock_import_items (import_id, product_id, product_name, quantity, unit_cost) VALUES (?, 14, 'Nước Cam Ép', 30, 8000)", [$imp2Id]);
        $this->execute("INSERT INTO stock_import_items (import_id, product_id, product_name, quantity, unit_cost) VALUES (?, 13, 'Sinh Tố Bơ', 20, 14000)", [$imp2Id]);

        // 1 phiếu trả hàng mẫu — gắn vào đơn có Cà Phê Sữa Đá nếu tìm được, cộng lại tồn kho +1
        if ($coffeeOrderId !== null) {
            $item = $this->queryOne(
                "SELECT * FROM order_items WHERE order_id = ? AND product_id = 11 AND variant_sku = ?",
                [$coffeeOrderId, $coffeeVariantSku]
            );
            if ($item) {
                $returnId = (int)$this->execute(
                    "INSERT INTO returns (order_id, reason, refund_amount, created_by) VALUES (?, 'doi-y', ?, ?)",
                    [$coffeeOrderId, $item['price'] * 1, $cashierId]
                );
                $this->execute(
                    "INSERT INTO return_items (return_id, product_id, variant_sku, product_name, quantity) VALUES (?, 11, ?, ?, 1)",
                    [$returnId, $coffeeVariantSku, $item['product_name']]
                );
                $this->execute("UPDATE orders SET has_return = 1 WHERE id = ?", [$coffeeOrderId]);
                $this->execute("UPDATE product_variants SET stock = stock + 1 WHERE sku = ?", [$coffeeVariantSku]);
            }
        }
    }

    // ─── Query helpers ─────────────────────────────────────────────────────────

    public function query(string $sql, array $params = []): array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $rows = $this->query($sql, $params);
        return $rows[0] ?? null;
    }

    public function scalar(string $sql, array $params = []): mixed {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchColumn();
    }

    public function execute(string $sql, array $params = []): int|string {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $this->pdo->lastInsertId();
    }

    /** Dùng cho UPDATE có điều kiện chống race-condition (vd trừ tồn kho) — trả về số dòng bị ảnh hưởng. */
    public function executeAffected(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount();
    }

    public function beginTransaction(): void { $this->pdo->beginTransaction(); }
    public function commit(): void { $this->pdo->commit(); }
    public function rollBack(): void { if ($this->pdo->inTransaction()) $this->pdo->rollBack(); }

    public function getPdo(): \PDO {
        return $this->pdo;
    }
}

// Helper functions
function bodyJson(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function slugify(string $text): string {
    $text = mb_strtolower($text, 'UTF-8');
    $map = [
        'à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a',
        'ă'=>'a','ắ'=>'a','ặ'=>'a','ằ'=>'a','ẳ'=>'a','ẵ'=>'a',
        'â'=>'a','ấ'=>'a','ầ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a',
        'è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e',
        'ê'=>'e','ế'=>'e','ề'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e',
        'ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i',
        'ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o',
        'ô'=>'o','ố'=>'o','ồ'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o',
        'ơ'=>'o','ớ'=>'o','ờ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o',
        'ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u',
        'ư'=>'u','ứ'=>'u','ừ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u',
        'ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y',
        'đ'=>'d',
    ];
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', trim($text));
    return trim($text, '-');
}

/** Tính hạng thành viên theo tổng chi tiêu — dùng chung backend, khớp CRM.calcTier() bản tĩnh. */
function posCalcTier(float $totalSpent): string {
    if ($totalSpent >= 30000000) return 'kim-cuong';
    if ($totalSpent >= 10000000) return 'vang';
    if ($totalSpent >= 2000000) return 'bac';
    return 'dong';
}
?>
