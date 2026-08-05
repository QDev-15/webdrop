<?php
declare(strict_types=1);

class Database {
    private static ?Database $instance = null;
    private PDO $pdo;

    private function __construct() {
        $dir = dirname(DB_FILE);
        if (!is_dir($dir)) { @mkdir($dir, 0755, true); }
        $this->pdo = new PDO('sqlite:' . DB_FILE, null, null, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->migrate();
    }

    public static function getInstance(): static {
        if (!self::$instance) { self::$instance = new static(); }
        return self::$instance;
    }

    public function query(string $sql, array $params = []): array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $rows = $this->query($sql, $params);
        return $rows[0] ?? null;
    }

    public function execute(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (int)$this->pdo->lastInsertId();
    }

    public function lastInsertId(): string {
        return $this->pdo->lastInsertId();
    }

    private function migrate(): void {
        $sqlFile = __DIR__ . '/../schema.sql';
        $sql = file_get_contents($sqlFile);
        if ($sql === false) { throw new \RuntimeException('Cannot read schema.sql'); }
        // Strip comments TRUOC khi split — tranh filter loai bo CREATE TABLE sau comment block
        $sql = preg_replace('/^\s*--.*$/m', '', $sql);
        $statements = array_filter(array_map('trim', explode(';', $sql)), fn($s) => $s !== '');
        foreach ($statements as $stmt) { $this->pdo->exec($stmt . ';'); }
        $this->runMigrations();
        $this->seedData();
    }

    private function runMigrations(): void {
        // Thêm cột products mới nếu chưa có (cho DB đã tồn tại trước khi thêm cột)
        $prodCols = array_column($this->pdo->query("PRAGMA table_info(products)")->fetchAll(), 'name');
        foreach (["material TEXT NOT NULL DEFAULT ''", "specs TEXT NOT NULL DEFAULT ''"] as $def) {
            $col = explode(' ', $def)[0];
            if (!in_array($col, $prodCols)) {
                $this->pdo->exec("ALTER TABLE products ADD COLUMN $def");
            }
        }
        // Fix badge: '-xx%' / 'Mới' → enum values theo thuộc tính sản phẩm
        $hasWrong = (int)$this->pdo->query("SELECT COUNT(*) FROM products WHERE badge LIKE '-%' OR badge = 'M\u{1EDB}i'")->fetchColumn();
        if ($hasWrong > 0) {
            $this->pdo->exec("UPDATE products SET badge = 'hot' WHERE (badge LIKE '-%' OR badge = 'M\u{1EDB}i') AND is_featured = 1 AND price_sale IS NOT NULL AND price_sale > 0");
            $this->pdo->exec("UPDATE products SET badge = 'new' WHERE (badge LIKE '-%' OR badge = 'M\u{1EDB}i') AND is_new = 1");
            $this->pdo->exec("UPDATE products SET badge = 'sale' WHERE badge LIKE '-%' AND is_featured = 0 AND is_new = 0 AND price_sale IS NOT NULL AND price_sale > 0");
            $this->pdo->exec("UPDATE products SET badge = '' WHERE badge LIKE '-%'");
        }
        // Thêm coupon_code vào orders nếu chưa có
        $orderCols = array_column($this->pdo->query("PRAGMA table_info(orders)")->fetchAll(), 'name');
        if (!in_array('coupon_code', $orderCols)) {
            $this->pdo->exec("ALTER TABLE orders ADD COLUMN coupon_code TEXT NOT NULL DEFAULT ''");
        }
    }

    private function seedData(): void {
        $this->seedUsers();
        $this->seedSettings();
        $this->seedHeroSlides();
        $this->seedProductColors();
        $this->seedProductCategories();
        $this->seedProducts();
        $this->seedCoupons();
    }

    private function seedProductColors(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM product_colors")->fetchColumn();
        if ($count > 0) return;
        $colors = [
            ['Terracotta', '#b5651d', 1],
            ['Sage',       '#87a06b', 2],
            ['Kem',        '#f5f0e8', 3],
            ['Nâu đất',   '#7d4e2d', 4],
            ['Trắng',      '#ffffff', 5],
            ['Đen',        '#1e1e1e', 6],
            ['Xám',        '#9e9e9e', 7],
            ['Xanh lá',    '#4caf50', 8],
            ['Xanh dương', '#2196f3', 9],
            ['Đỏ',         '#e53935', 10],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO product_colors (name, hex, sort_order) VALUES (?, ?, ?)");
        foreach ($colors as $c) { $stmt->execute($c); }
    }

    private function seedUsers(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
        if ($count > 0) return;
        $hash = password_hash('123456', PASSWORD_DEFAULT);
        $stmt = $this->pdo->prepare(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
        );
        $stmt->execute(['Admin', 'sysadmin@admin.com', $hash, 'superadmin']);
    }

    private function seedSettings(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM settings")->fetchColumn();
        if ($count > 0) {
            $this->pdo->exec("INSERT OR IGNORE INTO settings (key, value, grp) VALUES ('site_theme', 'warm-artisan', 'design')");
            return;
        }
        $settings = [
            // General
            ['site_name',        'Shop Đồ Gia Dụng',             'general'],
            ['site_email',       'hello@shopgiadung.vn',          'general'],
            ['site_phone',       '0900 888 666',                  'general'],
            ['site_address',     '456 Nguyễn Huệ, Q.1, TP.HCM',  'general'],
            ['working_hours',    '9:00 – 20:00 · Tất cả các ngày','general'],
            ['site_description', 'Cửa hàng đồ gia dụng chất lượng cao với giá hợp lý – mang đến sự tiện nghi cho gia đình Việt.', 'general'],
            ['site_slogan',      'Đồ Gia Dụng Chất Lượng Cao',   'general'],
            // SEO
            ['meta_title',       'Shop Đồ Gia Dụng – Chất Lượng & Giá Tốt',  'seo'],
            ['meta_description', 'Khám phá bộ sưu tập đồ gia dụng, nội thất, trang trí nhà cửa với chất lượng cao và giá cạnh tranh.', 'seo'],
            ['meta_keywords',    'đồ gia dụng, nhà bếp, trang trí nhà, đèn chiếu sáng', 'seo'],
            // Social
            ['facebook',        'https://www.facebook.com/shopgiadung',   'social'],
            ['instagram',       'https://www.instagram.com/shopgiadung',  'social'],
            ['tiktok',          'https://www.tiktok.com/@shopgiadung',    'social'],
            ['zalo',            'https://zalo.me/0900888666',             'social'],
            ['zalo_number',     '0900888666',                             'social'],
            // Design / Theme
            ['site_theme',      'warm-artisan',                  'design'],
            // Footer
            ['footer_desc',     'Chúng tôi mang đến những sản phẩm đồ gia dụng chất lượng cao, được kiểm tra kỹ lưỡng để phục vụ gia đình Việt.', 'footer'],
            // Contact
            ['map_embed',       'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.5!2d106.6!3d10.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1', 'contact'],
            // Hero settings
            ['hero_tag',         'Thiết Bị Gia Đình Tốt Nhất 2025',      'hero'],
            ['hero_title_part1', 'Đồ Gia Dụng',                           'hero'],
            ['hero_title_part2', 'Chất Lượng',                             'hero'],
            ['hero_title_line2', '– Chăm Sóc Gia Đình Bạn',               'hero'],
            ['hero_subtitle',    'Tất cả những gì bạn cần để tạo một ngôi nhà ấm cúng, tiện nghi và đầy đủ tiện ích hiện đại.', 'hero'],
            ['hero_note',        'Giao hàng miễn phí từ 500.000đ · Đảm bảo chất lượng',  'hero'],
            // Stats
            ['stat_customers',  '8000',   'stats'],
            ['stat_products',   '400',    'stats'],
            ['stat_years',      '3',      'stats'],
            ['stat_provinces',  '63',     'stats'],
            // Shop policies
            ['shipping_fee',           '50000',  'shop'],
            ['free_shipping_threshold','500000', 'shop'],
            ['return_days',            '30',     'shop'],
            ['warranty_months',        '12',     'shop'],
            // Payment methods
            ['payment_cod_enabled',    '1', 'payment'],
            ['payment_sepay_enabled',    '1', 'payment'],
            ['sepay_bank_code',          'MB',  'payment'],
            ['sepay_account_number',     '0099001122334',  'payment'],
            ['sepay_account_name',       'WEBDROP STORE TEST',  'payment'],
            ['sepay_webhook_secret',     'TEST_SEPAY_API_2026',  'payment'],
            // SMTP
            ['smtp_host',     '', 'smtp'],
            ['smtp_port',     '587', 'smtp'],
            ['smtp_user',     '', 'smtp'],
            ['smtp_pass',     '', 'smtp'],
            ['smtp_from',     '', 'smtp'],
            ['smtp_from_name','Shop Đồ Gia Dụng', 'smtp'],
            // System
            ['maintenance_mode', '0', 'system'],
            ['google_analytics', '', 'system'],
            // Cloudinary
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key',    '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            // Integrations
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
            ['fb_pixel_id', '', 'integrations'],
            ['zalo_oa_id',  '', 'integrations'],
        ];
        $stmt = $this->pdo->prepare("INSERT OR IGNORE INTO settings (key, value, grp) VALUES (?, ?, ?)");
        foreach ($settings as $row) { $stmt->execute($row); }
    }

    private function seedHeroSlides(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM hero_slides")->fetchColumn();
        if ($count > 0) return;
        $slides = [
            [
                'Đồ Gia Dụng Chất Lượng',
                'Sản phẩm được chọn lọc kỹ lưỡng từ các nhà cung cấp uy tín – bền, đẹp và tiết kiệm điện năng',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop&q=80',
                'Mua sắm ngay', '/san-pham', 1, 'published'
            ],
            [
                'Bộ Sưu Tập Nhập Khẩu',
                'Thiết bị nhập khẩu từ châu Âu và Nhật Bản – công nghệ tiên tiến, thiết kế thời trang',
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop&q=80',
                'Xem bộ sưu tập', '/bo-suu-tap', 2, 'published'
            ],
            [
                'Khuyến Mãi Đặc Biệt',
                'Giảm đến 35% cho các sản phẩm nhà bếp và trang trí – chỉ áp dụng trong tháng này',
                'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=1200&auto=format&fit=crop&q=80',
                'Tìm hiểu thêm', '/san-pham', 3, 'published'
            ],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO hero_slides (title, subtitle, image, button_text, button_link, sort_order, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($slides as $s) { $stmt->execute($s); }
    }

    private function seedProductCategories(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM product_categories")->fetchColumn();
        if ($count > 0) return;
        $cats = [
            ['Nhà Bếp',          'nha-bep',        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop&q=80', 1],
            ['Trang Trí',        'trang-tri',      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&auto=format&fit=crop&q=80', 2],
            ['Phòng Tắm',        'phong-tam',      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&auto=format&fit=crop&q=80', 3],
            ['Nội Thất Nhỏ',     'noi-that-nho',   'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80', 4],
            ['Đèn & Chiếu Sáng', 'den-chieu-sang', 'https://images.unsplash.com/photo-1762098801378-26bc46ae6306?w=600&auto=format&fit=crop&q=80', 5],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO product_categories (name, slug, image, sort_order) VALUES (?, ?, ?, ?)"
        );
        foreach ($cats as $c) { $stmt->execute($c); }
    }

    private function seedProducts(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
        if ($count > 0) return;

        $colorWarm = 'Terracotta:#b5651d|Sage:#87a06b';

        // columns: category_id, name, slug, image, price, price_sale, badge, description, colors, rating, in_stock, is_featured, is_new, sort_order
        $products = [
            // Nhà Bếp (8 products) — category_id = 1
            [1, 'Bộ Nồi Nấu Ăn 5 Chiếc', 'bo-noi-nau-an-5-chiec',
             'https://images.unsplash.com/photo-1584990347193-6bebebfeaeee?w=800&auto=format&fit=crop&q=80',
             1290000, 1050000, '-19%',
             'Bộ nồi nấu ăn 5 chiếc với đáy dẫn nhiệt đều đặn, nắp kính bền chắc. Tiết kiệm điện năng 30% so với nồi thường. Thép không gỉ cao cấp.',
             $colorWarm, 4.8, 1, 1, 0, 1],

            [1, 'Thớt Gỗ Tự Nhiên', 'thot-go-tu-nhien',
             'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&auto=format&fit=crop&q=80',
             185000, null, '',
             'Thớt gỗ tự nhiên được xử lý an toàn thực phẩm. Không mối mọt, không cong vênh, dễ vệ sinh sau mỗi lần sử dụng.',
             $colorWarm, 4.6, 1, 0, 1, 2],

            [1, 'Tủ Bếp Modular 3 Tầng', 'tu-bep-modular-3-tang',
             'https://images.unsplash.com/photo-1708358977332-84e95c0083a6?w=800&auto=format&fit=crop&q=80',
             2480000, 1990000, '-20%',
             'Tủ bếp module có thể ghép nối tùy ý, chứa tới 60 loại dụng cụ nấu nướng. Khung thép sơn tĩnh điện bền bỉ.',
             $colorWarm, 4.9, 1, 1, 0, 3],

            [1, 'Giá Để Gia Vị Quay Tự Động', 'gia-de-gia-vi-quay-tu-dong',
             'https://images.unsplash.com/photo-1715758583410-ca01efec6548?w=800&auto=format&fit=crop&q=80',
             285000, null, '',
             'Giá để gia vị quay tự động, cơ chế đóng mở êm ái. Lắp ráp trong 10 phút, không cần khoan. Thép mạ kẽm cao cấp.',
             $colorWarm, 4.5, 1, 0, 0, 4],

            [1, 'Quạt Hút Mùi Bếp Thông Minh', 'quat-hut-mui-bep-thong-minh',
             'https://images.unsplash.com/photo-1642979430180-e676c2235ce2?w=800&auto=format&fit=crop&q=80',
             1680000, 1380000, '-18%',
             'Quạt hút mùi thông minh tự động bật/tắt theo độ ẩm, tiếng ồn chỉ 50dB. Lọc carbon hiệu quả tới 6 tháng.',
             $colorWarm, 4.7, 1, 1, 0, 5],

            [1, 'Bộ Rổ Rá Nhiều Kích Cỡ', 'bo-ro-ra-nhieu-kich-co',
             'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop&q=80',
             425000, 349000, '-18%',
             'Bộ rổ rá 5 chiếc nhiều kích cỡ khác nhau, phù hợp với nhiều loại rau củ. Đáy chống trơn trượt, bảo hành 2 năm.',
             $colorWarm, 4.6, 1, 0, 0, 6],

            [1, 'Hộp Đựng Thực Phẩm Có Nắp', 'hop-dung-thuc-pham-co-nap',
             'https://images.unsplash.com/photo-1665387075827-81bdc0aa7ca5?w=800&auto=format&fit=crop&q=80',
             195000, null, 'Mới',
             'Hộp đựng thực phẩm kín, giữ tươi sống 3 ngày. Không ngấm nước, dễ vệ sinh. Nhựa PP cao cấp an toàn thực phẩm.',
             $colorWarm, 4.4, 1, 0, 1, 7],

            [1, 'Bộ Dụng Cụ Nhà Bếp Inox', 'bo-dung-cu-nha-bep-inox',
             'https://images.unsplash.com/photo-1643213399445-842d8f6b9a45?w=800&auto=format&fit=crop&q=80',
             125000, 89000, '-29%',
             'Bộ dụng cụ nhà bếp inox 5 món bao gồm muỗng, đũa, dao, kéo và dụng cụ nạo. Không gỉ, bền đẹp theo năm tháng.',
             $colorWarm, 4.5, 1, 1, 0, 8],

            // Trang Trí (8 products) — category_id = 2
            [2, 'Bảng Treo Tường Gỗ Sồi', 'bang-treo-tuong-go-soi',
             'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&auto=format&fit=crop&q=80',
             450000, 380000, '-16%',
             'Bảng treo tường gỗ sồi phủ sơn trắng, khung ảnh dễ thay đổi. Phù hợp phong cách Scandinavian hiện đại.',
             $colorWarm, 4.7, 1, 1, 0, 9],

            [2, 'Hộp Trang Trí Gỗ Veneer', 'hop-trang-tri-go-veneer',
             'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
             380000, null, '',
             'Hộp treo tường gỗ veneer 3 ngăn, thiết kế tối giản. Đặt đồ trang trí, sách nhỏ, hay tranh ảnh trang nhã.',
             $colorWarm, 4.6, 1, 0, 0, 10],

            [2, 'Tranh Vải Canvas 3 Tấm', 'tranh-vai-canvas-3-tam',
             'https://images.unsplash.com/photo-1602172691871-49e231a20dbc?w=800&auto=format&fit=crop&q=80',
             320000, 259000, '-19%',
             'Bộ tranh vải canvas 3 tấm với họa tiết hoa lá nhiệt đới, khung gỗ nhẹ. Tạo điểm nhấn cho phòng khách.',
             $colorWarm, 4.5, 1, 0, 1, 11],

            [2, 'Bình Gốm Sứ Cắm Hoa', 'binh-gom-su-cam-hoa',
             'https://images.unsplash.com/photo-1614175154640-f965c6323d21?w=800&auto=format&fit=crop&q=80',
             285000, 219000, '-23%',
             'Bình gốm sứ cao cấp được trang trí đẹp mắt, phù hợp cắm hoa tươi hoặc hoa giả. Thiết kế vạn năng sang trọng.',
             $colorWarm, 4.4, 1, 1, 0, 12],

            [2, 'Thảm Treo Tường Bohemian', 'tham-treo-tuong-bohemian',
             'https://images.unsplash.com/photo-1661034494973-ed878468e23f?w=800&auto=format&fit=crop&q=80',
             520000, 445000, '-14%',
             'Thảm treo tường kích thước 1.5m x 2m, họa tiết bohemian đa sắc. Xử lý kháng khuẩn tự nhiên. Vải cotton/polyester.',
             $colorWarm, 4.8, 1, 1, 0, 13],

            [2, 'Nến Thơm Tinh Dầu Ceramic', 'nen-thom-tinh-dau-ceramic',
             'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=800&auto=format&fit=crop&q=80',
             165000, null, 'Mới',
             'Nến thơm trong hũ ceramic với hương tinh dầu thiên nhiên 100%. Cháy 40 giờ liên tục, an toàn cho trẻ em.',
             $colorWarm, 4.6, 1, 0, 1, 14],

            [2, 'Chân Nến Trang Trí Đồng', 'chan-nen-trang-tri-dong',
             'https://images.unsplash.com/photo-1614175154640-f965c6323d21?w=800&auto=format&fit=crop&q=80',
             240000, 189000, '-21%',
             'Chân nến trang trí bằng đồng nguyên khối, cao 30cm. Tăng thêm sự sang trọng cho góc nhà của bạn.',
             $colorWarm, 4.5, 1, 0, 0, 15],

            [2, 'Khung Ảnh 4 Ô Gỗ Veneer', 'khung-anh-4-o-go-veneer',
             'https://images.unsplash.com/photo-1602172691871-49e231a20dbc?w=800&auto=format&fit=crop&q=80',
             185000, 145000, '-22%',
             'Khung ảnh gỗ veneer 4 ô cạnh nhau, chứa 4 ảnh 15x15cm. Lắp tường hoặc để bàn đều được. Kính cường lực.',
             $colorWarm, 4.3, 1, 1, 0, 16],

            // Phòng Tắm (8 products) — category_id = 3
            [3, 'Tủ Treo Phòng Tắm Tiết Kiệm Chỗ', 'tu-treo-phong-tam-tiet-kiem-cho',
             'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=80',
             680000, 545000, '-20%',
             'Tủ treo phòng tắm chứa 8 khoang, khung nhôm chống gỉ. Tiết kiệm 60% không gian. Nhôm anode, cửa kính cường lực.',
             $colorWarm, 4.7, 1, 1, 0, 17],

            [3, 'Bàn Phòng Tắm Kết Hợp Tủ', 'ban-phong-tam-ket-hop-tu',
             'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=80',
             1380000, 1150000, '-17%',
             'Bàn phòng tắm kết hợp tủ chứa phía dưới, mặt bàn đá nhân tạo chịu ẩm. Gỗ công nghiệp E1, đá nhân tạo, sơn PU.',
             $colorWarm, 4.8, 1, 0, 0, 18],

            [3, 'Giá Để Khăn Phòng Tắm', 'gia-de-khan-phong-tam',
             'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=80',
             245000, 189000, '-23%',
             'Giá để khăn sơn tĩnh điện, chứa được 4 chiếc khăn tắm cỡ lớn. Lắp tường trong 15 phút. Thép sơn tĩnh điện.',
             $colorWarm, 4.5, 1, 0, 1, 19],

            [3, 'Vòi Tắm Mưa LED', 'voi-tam-mua-led',
             'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=80',
             890000, 720000, '-19%',
             'Vòi tắm mưa 40cm có đèn LED 7 màu tự động, điều chỉnh nhiệt độ nước chính xác 0.5°C. Tiết kiệm nước 40%.',
             $colorWarm, 4.9, 1, 1, 0, 20],

            [3, 'Thảm Phòng Tắm Chống Trơn', 'tham-phong-tam-chong-tron',
             'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=80',
             180000, 145000, '-19%',
             'Thảm phòng tắm PVC chống trơn với khả năng hút nước mạnh, kích thước 60x40cm. Dễ giặt máy, khô nhanh.',
             $colorWarm, 4.6, 1, 0, 0, 21],

            [3, 'Khóa Tiết Kiệm Nước Vòi', 'khoa-tiet-kiem-nuoc-voi',
             'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=80',
             95000, 75000, '-21%',
             'Khóa tiết kiệm nước cho vòi bằng stainless steel, tiết kiệm nước 50%. Lắp dễ dàng, tương thích mọi loại vòi.',
             $colorWarm, 4.4, 1, 1, 0, 22],

            [3, 'Kệ Để Đồ Phòng Tắm Treo', 'ke-de-do-phong-tam-treo',
             'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=80',
             125000, 98000, '-22%',
             'Kệ treo phòng tắm nhôm anode, chứa sữa tắm, dầu gội, dụng cụ vệ sinh. Thoáng khí tự nhiên không bị mốc.',
             $colorWarm, 4.5, 1, 0, 1, 23],

            // Nội Thất Nhỏ (8 products) — category_id = 4
            [4, 'Tủ Để Giày Gỗ 5 Tầng', 'tu-de-giay-go-5-tang',
             'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
             580000, 475000, '-18%',
             'Tủ để giày gỗ công nghiệp 5 tầng, chứa được 15 đôi giày. Khung sắt chắc chắn, chân chống ẩm hiệu quả.',
             $colorWarm, 4.7, 1, 1, 0, 24],

            [4, 'Giá Sách Gỗ Nhiều Tầng', 'gia-sach-go-nhieu-tang',
             'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
             320000, 249000, '-22%',
             'Giá sách nhiều tầng có bánh xe di động. Chứa 50 cuốn sách, tìm kiếm dễ dàng. Gỗ sồi, bánh xe cao su.',
             $colorWarm, 4.6, 1, 0, 0, 25],

            [4, 'Bàn Trang Điểm Có Tủ', 'ban-trang-diem-co-tu',
             'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
             790000, 640000, '-19%',
             'Bàn trang điểm gỗ công nghiệp 1m x 0.5m, có tủ chứa 6 ngăn kéo. Gương LED 3 sắc độ ánh sáng tiện dụng.',
             $colorWarm, 4.8, 1, 1, 0, 26],

            [4, 'Kệ Góc Xoay 4 Tầng', 'ke-goc-xoay-4-tang',
             'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
             680000, 545000, '-20%',
             'Kệ góc xoay 4 tầng, tận dụng không gian góc tường hiệu quả. Chứa cả đồ vật nặng và nhẹ. Thép + kính cường lực.',
             $colorWarm, 4.5, 1, 1, 0, 27],

            [4, 'Ghế Ngồi Có Hộp Chứa', 'ghe-ngoi-co-hop-chua',
             'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
             480000, 385000, '-20%',
             'Ghế ngồi đa năng với hộp chứa đồ bên trong, nệm polyurethane cao cấp. Bền bỉ với gia đình 4 người trong 5 năm.',
             $colorWarm, 4.6, 1, 0, 1, 28],

            [4, 'Giá Để Cây Cảnh Bánh Xe', 'gia-de-cay-canh-banh-xe',
             'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
             295000, 235000, '-20%',
             'Giá để cây cảnh với bánh xe di động, chứa 8 chậu cây. Mặt bàn có lỗ thoáng nước. Gỗ tần bì, bánh xe cao su.',
             $colorWarm, 4.4, 1, 1, 0, 29],

            [4, 'Bàn Gập Tường Tiết Kiệm Chỗ', 'ban-gap-tuong-tiet-kiem-cho',
             'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
             340000, 270000, '-21%',
             'Bàn gập tường 1m x 0.5m, khi gập chiều rộng chỉ 5cm. Cơ chế an toàn giữ lực tối đa 50kg. Gỗ MDF + lò xo khí.',
             $colorWarm, 4.7, 1, 1, 0, 30],

            // Đèn & Chiếu Sáng (8 products) — category_id = 5
            [5, 'Đèn Bàn LED Tích Điện', 'den-ban-led-tich-dien',
             'https://images.unsplash.com/photo-1762098801378-26bc46ae6306?w=800&auto=format&fit=crop&q=80',
             285000, 225000, '-21%',
             'Đèn bàn LED tích điện 3 mức sáng, thời gian hoạt động 12 giờ mỗi lần sạc. Bảo hành 2 năm. Nhôm anode, LED SMD.',
             $colorWarm, 4.8, 1, 1, 0, 31],

            [5, 'Đèn Sàn Vòng Tròn LED', 'den-san-vong-tron-led',
             'https://images.unsplash.com/photo-1762098801378-26bc46ae6306?w=800&auto=format&fit=crop&q=80',
             890000, 720000, '-19%',
             'Đèn sàn LED vòng tròn điều chỉnh độ sáng 0-100%, 5 nhiệt độ màu từ 2700K-6500K. Tiết kiệm điện 80%.',
             $colorWarm, 4.9, 1, 1, 0, 32],

            [5, 'Bóng Đèn Thông Minh WiFi', 'bong-den-thong-minh-wifi',
             'https://images.unsplash.com/photo-1762098801378-26bc46ae6306?w=800&auto=format&fit=crop&q=80',
             180000, 145000, '-19%',
             'Bóng đèn thông minh WiFi 9W, điều khiển qua điện thoại, 16 triệu màu, tương thích Home App. LED COB, đuôi E27.',
             $colorWarm, 4.6, 1, 0, 1, 33],

            [5, 'Đèn Thả Bóng Vintage', 'den-tha-bong-vintage',
             'https://images.unsplash.com/photo-1762098801378-26bc46ae6306?w=800&auto=format&fit=crop&q=80',
             340000, 270000, '-21%',
             'Đèn thả bóng vintage với cáp vải đan kết, chiều dài dây có thể điều chỉnh. Phù hợp phong cách loft, retro.',
             $colorWarm, 4.5, 1, 1, 0, 34],

            [5, 'Đèn Treo Tường Kiến Trúc', 'den-treo-tuong-kien-truc',
             'https://images.unsplash.com/photo-1762098801378-26bc46ae6306?w=800&auto=format&fit=crop&q=80',
             560000, 450000, '-20%',
             'Đèn treo tường kiến trúc chiều dài 50cm, có khe để ảnh hoặc cây xanh nhỏ. Tạo không gian phát sáng độc đáo.',
             $colorWarm, 4.7, 1, 1, 0, 35],

            [5, 'Đèn Bàn Cổ Tay Cong', 'den-ban-co-tay-cong',
             'https://images.unsplash.com/photo-1762098801378-26bc46ae6306?w=800&auto=format&fit=crop&q=80',
             420000, 335000, '-20%',
             'Đèn bàn có tay cong điều chỉnh góc phát sáng 120 độ, chân cân bằng ổn định. Bảo hành 3 năm. Thép sơn + LED.',
             $colorWarm, 4.6, 1, 0, 0, 36],

            [5, 'Dây Đèn LED Trang Trí', 'day-den-led-trang-tri',
             'https://images.unsplash.com/photo-1762098801378-26bc46ae6306?w=800&auto=format&fit=crop&q=80',
             185000, 145000, '-22%',
             'Dây đèn LED trang trí 10m, 8 chế độ sáng khác nhau, chống nước IP65, tiết kiệm điện. Dây PVC, LED SMD.',
             $colorWarm, 4.4, 1, 0, 1, 37],

            [5, 'Đèn Xông Tinh Dầu LED', 'den-xong-tinh-dau-led',
             'https://images.unsplash.com/photo-1762098801378-26bc46ae6306?w=800&auto=format&fit=crop&q=80',
             240000, 190000, '-21%',
             'Đèn xông tinh dầu kết hợp ánh sáng LED 7 màu, sóng siêu âm 3 chế độ. Dung tích 400ml, tiếng ồn <25dB.',
             $colorWarm, 4.5, 1, 1, 0, 38],
        ];

        // theme + sold — map theo đúng tên mục trong từng danh mục
        // is_featured=1 → ban-chay, is_new=1 → moi-ve, có price_sale → giam-gia
        $themeSold = [
            // Nhà Bếp (8)
            ['ban-chay,giam-gia', 245], ['moi-ve', 183], ['ban-chay,giam-gia', 312], ['', 97],
            ['ban-chay,giam-gia', 176], ['giam-gia', 54], ['moi-ve', 128], ['ban-chay,giam-gia', 66],
            // Trang Trí (8)
            ['ban-chay,giam-gia', 74], ['', 41], ['moi-ve,giam-gia', 55], ['ban-chay,giam-gia', 162],
            ['ban-chay,giam-gia', 38], ['moi-ve', 92], ['giam-gia', 29], ['ban-chay,giam-gia', 203],
            // Phòng Tắm (7)
            ['ban-chay,giam-gia', 187], ['giam-gia', 73], ['moi-ve,giam-gia', 58], ['ban-chay,giam-gia', 33],
            ['giam-gia', 82], ['ban-chay,giam-gia', 44], ['moi-ve,giam-gia', 115],
            // Nội Thất Nhỏ (7)
            ['ban-chay,giam-gia', 148], ['giam-gia', 89], ['ban-chay,giam-gia', 37], ['ban-chay,giam-gia', 64],
            ['moi-ve,giam-gia', 52], ['ban-chay,giam-gia', 48], ['ban-chay,giam-gia', 27],
            // Đèn & Chiếu Sáng (8)
            ['ban-chay,giam-gia', 63], ['ban-chay,giam-gia', 196], ['moi-ve,giam-gia', 118], ['ban-chay,giam-gia', 31],
            ['ban-chay,giam-gia', 143], ['giam-gia', 47], ['moi-ve,giam-gia', 22], ['ban-chay,giam-gia', 63],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO products (category_id, name, slug, image, price, price_sale, badge, description, colors, rating, in_stock, is_featured, is_new, sort_order, theme, sold)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($products as $i => $p) {
            [$theme, $sold] = $themeSold[$i];
            // Tính badge từ thuộc tính sản phẩm — không dùng giá trị hardcode trong mảng
            // $p[11]=is_featured, $p[12]=is_new, $p[5]=price_sale
            if ($p[11] == 1 && $p[5] !== null) { $p[6] = 'hot'; }
            elseif ($p[12] == 1) { $p[6] = 'new'; }
            elseif ($p[5] !== null) { $p[6] = 'sale'; }
            else { $p[6] = ''; }
            $stmt->execute([...$p, $theme, $sold]);
        }
    }

    private function seedCoupons(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM coupons")->fetchColumn();
        if ($count > 0) return;
        $coupons = [
            ['WELCOME10', 'percent', 10,    200000,  0,   null, 1],
            ['SALE15',    'percent', 15,    500000,  100, null, 1],
            ['GIAM50K',   'fixed',   50000, 300000,  50,  null, 1],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO coupons (code, type, value, min_order, max_uses, expires_at, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($coupons as $c) { $stmt->execute($c); }
    }
}
