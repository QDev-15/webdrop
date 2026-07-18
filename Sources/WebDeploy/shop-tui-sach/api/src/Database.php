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
        // Strip comments TRƯỚC khi split — tránh filter loại bỏ CREATE TABLE nằm sau comment block
        $sql = preg_replace('/^\s*--.*$/m', '', $sql);
        $statements = array_filter(array_map('trim', explode(';', $sql)), fn($s) => $s !== '');
        foreach ($statements as $stmt) { $this->pdo->exec($stmt . ';'); }
        $this->seedData();
    }

    private function seedData(): void {
        $this->seedUsers();
        $this->seedSettings();
        $this->seedHeroSlides();
        $this->seedProductCategories();
        $this->seedProducts();
        $this->seedCoupons();
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
        if ($count > 0) return;

        $settings = [
            // ── General ──────────────────────────────────────────────────────────
            ['site_name',        'Maison Cuir',                                        'general'],
            ['site_slogan',      'Túi Da Thủ Công Cao Cấp',                             'general'],
            ['site_email',       'hello@maisoncuir.vn',                                'general'],
            ['site_phone',       '0900 000 000',                                       'general'],
            ['site_address',     '12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', 'general'],
            ['working_hours',    '9:00 – 20:00 · Thứ 2 – Chủ nhật',                    'general'],
            ['site_description', 'Maison Cuir — túi xách da thật thủ công cao cấp, thiết kế tinh xảo, bảo hành trọn đời. Khám phá bộ sưu tập túi xách, ví da, phụ kiện da cao cấp.', 'general'],
            ['site_logo',        '', 'general'],
            ['site_favicon',     '', 'general'],
            ['zalo_number',      '0900000000', 'general'],

            // ── SEO ──────────────────────────────────────────────────────────────
            ['meta_title',       'Maison Cuir — Túi Da Thủ Công Cao Cấp', 'seo'],
            ['meta_description', 'Maison Cuir — túi xách da thật thủ công cao cấp, thiết kế tinh xảo, bảo hành trọn đời. Khám phá bộ sưu tập túi xách, ví da, phụ kiện da cao cấp.', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&auto=format&fit=crop&q=80', 'seo'],
            ['ga_id',    '', 'seo'],
            ['gtm_id',   '', 'seo'],

            // ── Social ───────────────────────────────────────────────────────────
            ['facebook',  'https://www.facebook.com/maisoncuir',  'social'],
            ['instagram', 'https://www.instagram.com/maisoncuir', 'social'],
            ['tiktok',    'https://www.tiktok.com/@maisoncuir',   'social'],
            ['zalo',      'https://zalo.me/0900000000',           'social'],

            // ── Hero (H2 Split 45/55 — ảnh + nội dung lấy từ Hero Slides) ───────────
            ['hero_tag',           'Bộ sưu tập Thu Đông 2026', 'hero'],
            ['hero_stat1_num',     '15', 'hero'], ['hero_stat1_suffix', '+',   'hero'], ['hero_stat1_label', 'Năm kinh nghiệm', 'hero'],
            ['hero_stat2_num',     '100', 'hero'], ['hero_stat2_suffix', '%', 'hero'], ['hero_stat2_label', 'Da thật cao cấp', 'hero'],
            ['hero_stat3_num',     '5000', 'hero'], ['hero_stat3_suffix', '+', 'hero'], ['hero_stat3_label', 'Khách hàng tin chọn', 'hero'],

            // ── Feature icon row (Trust badges, 4 mục) ───────────────────────────────
            ['value1_icon',  'gem', 'values'],
            ['value1_title', 'Da thật 100%',            'values'],
            ['value1_desc',  'Nguồn da nhập khẩu chọn lọc', 'values'],
            ['value2_icon',  'shield-check',  'values'],
            ['value2_title', 'Bảo hành trọn đời',        'values'],
            ['value2_desc',  'Sửa chữa & bảo dưỡng miễn phí', 'values'],
            ['value3_icon',  'truck',         'values'],
            ['value3_title', 'Miễn phí vận chuyển',             'values'],
            ['value3_desc',  'Đơn hàng từ 2.000.000đ', 'values'],
            ['value4_icon',  'arrow-repeat',       'values'],
            ['value4_title', 'Đổi trả 30 ngày',               'values'],
            ['value4_desc',  'Hoàn tiền 100% nếu lỗi', 'values'],

            // ── Promo (Full-bleed) ──────────────────────────────────────────────────
            ['promo_label',   'Ưu đãi giới hạn', 'promo'],
            ['promo_title',   'Giảm',           'promo'],
            ['promo_percent', '20%',                'promo'],
            ['promo_desc',    'Áp dụng cho toàn bộ dòng sản phẩm Heritage Collection. Số lượng có hạn.', 'promo'],
            ['promo_image',   'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1600&auto=format&fit=crop&q=80', 'promo'],

            // ── Reviews (Horizontal-scroll) ──────────────────────────────────────────
            ['reviews_avg',      '5.0', 'reviews'],
            ['reviews_count',    '128', 'reviews'],
            ['review1_name',     'Ngọc Anh', 'reviews'],
            ['review1_location', 'TP. Hồ Chí Minh', 'reviews'],
            ['review1_content',  'Chất lượng da vượt ngoài mong đợi, đường may sắc sảo. Chiếc túi tôi mua đã dùng hơn 2 năm vẫn đẹp như mới.', 'reviews'],
            ['review1_rating',   '5', 'reviews'],
            ['review2_name',     'Minh Quân', 'reviews'],
            ['review2_location', 'Hà Nội', 'reviews'],
            ['review2_content',  'Dịch vụ tư vấn tận tâm, đóng gói sang trọng. Sản phẩm đúng như hình ảnh, rất đáng đồng tiền bát gạo.', 'reviews'],
            ['review2_rating',   '5', 'reviews'],
            ['review3_name',     'Thu Hà', 'reviews'],
            ['review3_location', 'Đà Nẵng', 'reviews'],
            ['review3_content',  'Mua tặng mẹ nhân dịp sinh nhật, mẹ rất thích. Chất da mềm, mùi da thật rõ ràng, không phải da công nghiệp.', 'reviews'],
            ['review3_rating',   '5', 'reviews'],
            ['review4_name',     'Hoàng Long', 'reviews'],
            ['review4_location', 'Hải Phòng', 'reviews'],
            ['review4_content',  'Chính sách bảo hành trọn đời là điểm cộng lớn nhất khiến tôi quay lại mua thêm sản phẩm khác.', 'reviews'],
            ['review4_rating',   '5', 'reviews'],

            // ── Stats (Stat-bar) ─────────────────────────────────────────────────────
            ['stat1_num', '15',   'stats'], ['stat1_suffix', '+', 'stats'], ['stat1_label', 'Năm chế tác', 'stats'],
            ['stat2_num', '42',   'stats'], ['stat2_suffix', '', 'stats'], ['stat2_label', 'Nghệ nhân lành nghề', 'stats'],
            ['stat3_num', '5000', 'stats'], ['stat3_suffix', '+', 'stats'], ['stat3_label', 'Khách hàng hài lòng', 'stats'],
            ['stat4_num', '98',   'stats'], ['stat4_suffix', '%', 'stats'], ['stat4_label', 'Đánh giá 5 sao', 'stats'],

            // ── Newsletter ───────────────────────────────────────────────────────────
            ['newsletter_title', 'Đăng ký nhận ưu đãi riêng', 'newsletter'],
            ['newsletter_desc',  'Nhận thông tin bộ sưu tập mới và ưu đãi độc quyền dành cho thành viên.', 'newsletter'],

            // ── Footer ───────────────────────────────────────────────────────────────
            ['footer_desc', 'Thương hiệu túi da thủ công cao cấp, chế tác từ da thật với hơn 15 năm kinh nghiệm — tôn vinh nghệ thuật thủ công truyền thống.', 'footer'],

            // ── Contact ──────────────────────────────────────────────────────────────
            ['contact_intro', 'Đến showroom để được tư vấn trực tiếp, trải nghiệm chất liệu da thật và thử form dáng phù hợp với phong cách của bạn.', 'contact'],
            ['map_embed',     'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.395!2d106.700!3d10.776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzM0LjAiTiAxMDbCsDQyJzAwLjAiRQ!5e0!3m2!1svi!2s!4v1700000000000', 'contact'],

            // ── Shop policy ──────────────────────────────────────────────────────────
            ['return_days', '30', 'shop'],

            // ── Payment (tab "💳 Thanh toán") ────────────────────────────────────────
            ['payment_cod_enabled',      '1', 'payment'],
            ['payment_sepay_enabled',    '0', 'payment'],
            ['sepay_bank_code',          '',  'payment'],
            ['sepay_account_number',     '',  'payment'],
            ['sepay_account_name',       '',  'payment'],
            ['sepay_webhook_secret',     '',  'payment'],
            ['shipping_fee',             '30000',  'payment'],
            ['free_shipping_threshold',  '2000000', 'payment'],

            // ── SMTP ─────────────────────────────────────────────────────────────────
            ['smtp_host',      '', 'smtp'],
            ['smtp_port',      '587', 'smtp'],
            ['smtp_user',      '', 'smtp'],
            ['smtp_pass',      '', 'smtp'],
            ['smtp_from',      '', 'smtp'],
            ['smtp_from_name', 'Maison Cuir', 'smtp'],

            // ── System (tab "Nâng cao") ──────────────────────────────────────────────
            ['maintenance_mode', '0', 'system'],

            // ── Cloudinary ───────────────────────────────────────────────────────────
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key',    '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            ['cloudinary_folder',     '', 'cloudinary'],

            // ── Integrations ─────────────────────────────────────────────────────────
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
            ['fb_pixel_id', '', 'integrations'],
        ];

        $stmt = $this->pdo->prepare("INSERT OR IGNORE INTO settings (key, value, grp) VALUES (?, ?, ?)");
        foreach ($settings as $row) { $stmt->execute($row); }
    }

    private function seedHeroSlides(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM hero_slides")->fetchColumn();
        if ($count > 0) return;
        $slides = [
            [
                'Nghệ thuật da thật thủ công tinh xảo',
                'Túi xách và phụ kiện da thật cao cấp, được chế tác thủ công bởi nghệ nhân lành nghề tại Việt Nam.',
                'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&auto=format&fit=crop&q=80',
                'Khám phá bộ sưu tập', '/san-pham', 1, 'published',
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
            ['Túi xách tay',  'tui-xach-tay',  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=80', 1],
            ['Túi đeo chéo',  'tui-deo-cheo',  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&auto=format&fit=crop&q=80', 2],
            ['Ví & Clutch',   'vi-clutch',     'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500&auto=format&fit=crop&q=80', 3],
            ['Phụ kiện da',   'phu-kien-da',   'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&auto=format&fit=crop&q=80', 4],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO product_categories (name, slug, image, sort_order) VALUES (?, ?, ?, ?)"
        );
        foreach ($cats as $c) { $stmt->execute($c); }
    }

    private function seedProducts(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
        if ($count > 0) return;

        $colNau      = 'Nâu da bò:#3b2a1e';
        $colDen      = 'Đen:#0e0c0a';
        $colBurgundy = 'Burgundy:#7a2e3a';
        $colVang     = 'Vàng đồng:#c9a24d';
        $colKem      = 'Kem:#e8ded0';

        // [category_id, name, slug, image, price, price_sale, badge, description, colors, rating, in_stock, is_featured, is_new, sort_order, sizes]
        $products = [
            // ── Túi xách tay (category 1) ────────────────────────────────────────
            [1, 'Signature Tote', 'signature-tote',
             'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700&auto=format&fit=crop&q=80',
             2890000, null, 'Best seller',
             'Signature Tote là mẫu túi biểu tượng của thương hiệu — chế tác từ da bò thật nguyên miếng, form dáng tối giản, dung tích rộng rãi phù hợp cho công sở lẫn dạo phố. Đường may tay tỉ mỉ, khóa kim loại mạ vàng chống oxy hóa.',
             "$colNau|$colDen|$colBurgundy|$colKem", 4.9, 1, 1, 0, 1, 'S|M|L'],

            [1, 'Minimal Satchel', 'minimal-satchel',
             'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=700&auto=format&fit=crop&q=80',
             2550000, 3000000, '-15%',
             'Túi xách tay da đen tối giản, form dáng thanh lịch dễ phối cùng trang phục công sở. Khóa kim loại chắc chắn, quai đeo êm vai.',
             "$colDen|$colNau", 4.6, 1, 0, 0, 2, 'S|M'],

            // ── Túi đeo chéo (category 2) ─────────────────────────────────────────
            [2, 'Heritage Crossbody', 'heritage-crossbody',
             'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&auto=format&fit=crop&q=80',
             1990000, 2490000, '-20%',
             'Túi đeo chéo da bò chế tác thủ công, kích thước gọn nhẹ tiện dụng khi di chuyển. Dây đeo có thể điều chỉnh độ dài, phù hợp nhiều dáng người.',
             "$colNau|$colBurgundy", 4.7, 1, 1, 0, 3, 'S|M'],

            [2, 'Atelier Shoulder Bag', 'atelier-shoulder-bag',
             'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=700&auto=format&fit=crop&q=80',
             3190000, null, 'Mới về',
             'Túi xách vai da thật form dáng rộng rãi, phù hợp đựng đồ dùng cần thiết mỗi ngày. Thiết kế hiện đại, tinh tế, phối được nhiều phong cách.',
             "$colDen|$colVang", 4.8, 1, 1, 1, 4, 'M|L|XL'],

            [2, 'Petit Sling', 'petit-sling',
             'https://images.unsplash.com/photo-1584917865461-3e0a3a4b3e2b?w=700&auto=format&fit=crop&q=80',
             1690000, null, 'Best seller',
             'Túi đeo chéo nhỏ gọn da nâu, thiết kế tối giản tiện lợi cho những chuyến đi ngắn. Vừa đủ chứa điện thoại, ví và các vật dụng nhỏ.',
             "$colNau|$colDen", 4.5, 1, 0, 0, 5, 'S'],

            // ── Ví & Clutch (category 3) ──────────────────────────────────────────
            [3, 'Noir Clutch', 'noir-clutch',
             'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=700&auto=format&fit=crop&q=80',
             1290000, null, '',
             'Ví da nữ cầm tay màu đen sang trọng, thiết kế tối giản phù hợp cho các buổi tiệc hoặc sự kiện quan trọng. Lót trong bằng vải canvas cao cấp.',
             "$colDen|$colBurgundy", 4.6, 1, 1, 0, 6, 'S'],

            // ── Phụ kiện da (category 4) ──────────────────────────────────────────
            [4, 'Classic Belt', 'classic-belt',
             'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=700&auto=format&fit=crop&q=80',
             890000, null, '',
             'Thắt lưng da nam cao cấp, mặt khóa kim loại mạ vàng chống oxy hóa. Form dáng cổ điển, dễ phối cùng trang phục công sở lẫn dạo phố.',
             "$colNau|$colDen", 4.4, 1, 0, 0, 7, 'S|M|L'],

            [4, 'Executive Wallet', 'executive-wallet',
             'https://images.unsplash.com/photo-1601369447883-2a2eb0b34e6e?w=700&auto=format&fit=crop&q=80',
             750000, null, '',
             'Ví nam da bò thật, nhiều ngăn chứa thẻ và tiền mặt tiện lợi. Đường may tỉ mỉ, form dáng mỏng gọn dễ mang theo.',
             "$colNau|$colDen", 4.3, 1, 0, 0, 8, 'S'],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO products
                (category_id, name, slug, image, price, price_sale, badge, description, colors, rating, in_stock, is_featured, is_new, sort_order, sizes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($products as $p) { $stmt->execute($p); }
    }

    private function seedCoupons(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM coupons")->fetchColumn();
        if ($count > 0) return;
        $coupons = [
            ['WELCOME10', 'percent', 10, 1000000, 500, 0, null, 1],
            ['FREESHIP',  'fixed',   50000, 1000000, null, 0, null, 1],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO coupons (code, type, value, min_order, max_uses, used_count, expires_at, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($coupons as $c) { $stmt->execute($c); }
    }
}
