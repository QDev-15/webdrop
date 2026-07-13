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
            ['site_name',        'Volt Kicks',                                        'general'],
            ['site_slogan',      'Giày Dép Chính Hãng, Phong Cách Đường Phố',          'general'],
            ['site_email',       'hello@voltkicks.vn',                                'general'],
            ['site_phone',       '0900 123 456',                                      'general'],
            ['site_address',     '88 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh', 'general'],
            ['working_hours',    '9:00 – 21:00 · Tất cả các ngày trong tuần',          'general'],
            ['site_description', 'Volt Kicks — cửa hàng giày dép chính hãng, phong cách đường phố. Sneaker, boot, giày chạy bộ và sandal chất lượng cao, giao hàng toàn quốc.', 'general'],
            ['site_logo',        '', 'general'],
            ['site_favicon',     '', 'general'],
            ['zalo_number',      '0900123456', 'general'],

            // ── SEO ──────────────────────────────────────────────────────────────
            ['meta_title',       'Volt Kicks — Giày Dép Chính Hãng, Phong Cách Đường Phố', 'seo'],
            ['meta_description', 'Khám phá bộ sưu tập sneaker, boot, giày chạy bộ và sandal chính hãng tại Volt Kicks — thiết kế cá tính, chất lượng cao, giao hàng toàn quốc.', 'seo'],
            ['og_image', '', 'seo'],
            ['ga_id',    '', 'seo'],
            ['gtm_id',   '', 'seo'],

            // ── Social ───────────────────────────────────────────────────────────
            ['facebook',  'https://www.facebook.com/voltkicks',  'social'],
            ['instagram', 'https://www.instagram.com/voltkicks', 'social'],
            ['tiktok',    'https://www.tiktok.com/@voltkicks',   'social'],
            ['zalo',      'https://zalo.me/0900123456',          'social'],

            // ── Hero (H1 Full-Screen Overlay — ảnh chính lấy từ Hero Slides) ────────
            ['hero_tag',           'Bộ sưu tập Thu Đông 2025 vừa ra mắt', 'hero'],
            ['hero_stat1_num',     '120', 'hero'], ['hero_stat1_suffix', '+',   'hero'], ['hero_stat1_label', 'Mẫu giày', 'hero'],
            ['hero_stat2_num',     '18000', 'hero'], ['hero_stat2_suffix', '+', 'hero'], ['hero_stat2_label', 'Khách hàng', 'hero'],
            ['hero_stat3_num',     '4', 'hero'], ['hero_stat3_suffix', '.9★', 'hero'], ['hero_stat3_label', 'Đánh giá trung bình', 'hero'],

            // ── Feature icon row (Vì sao chọn chúng tôi, 4 mục) ─────────────────────
            ['value1_icon',  'patch-check-fill', 'values'],
            ['value1_title', 'Hàng chính hãng 100%',            'values'],
            ['value1_desc',  'Cam kết sản phẩm chính hãng, có tem chống hàng giả và hóa đơn đầy đủ', 'values'],
            ['value2_icon',  'arrow-repeat',  'values'],
            ['value2_title', 'Đổi trả trong 15 ngày',        'values'],
            ['value2_desc',  'Đổi size, đổi mẫu miễn phí nếu chưa vừa ý hoặc chưa đúng kích cỡ', 'values'],
            ['value3_icon',  'truck',         'values'],
            ['value3_title', 'Giao hàng nhanh 2H',             'values'],
            ['value3_desc',  'Giao hàng hỏa tốc nội thành, toàn quốc trong 1-3 ngày làm việc', 'values'],
            ['value4_icon',  'headset',       'values'],
            ['value4_title', 'Tư vấn 24/7',               'values'],
            ['value4_desc',  'Đội ngũ tư vấn viên hỗ trợ chọn size và mẫu giày phù hợp mọi lúc', 'values'],

            // ── Promo (Full-bleed) ──────────────────────────────────────────────────
            ['promo_label',   'Ưu đãi có giới hạn', 'promo'],
            ['promo_title',   'Giảm đến',           'promo'],
            ['promo_percent', '35%',                'promo'],
            ['promo_desc',    'Áp dụng cho bộ sưu tập Sneaker mới nhất — số lượng có hạn, nhanh tay đặt hàng trước khi kết thúc chương trình.', 'promo'],
            ['promo_image',   'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=700&auto=format&fit=crop&q=80', 'promo'],

            // ── Reviews (Horizontal-scroll) ──────────────────────────────────────────
            ['reviews_avg',      '4.9', 'reviews'],
            ['reviews_count',    '3.200+', 'reviews'],
            ['review1_name',     'Minh Khang', 'reviews'],
            ['review1_location', 'TP.HCM · Tháng 6/2025', 'reviews'],
            ['review1_content',  'Đôi giày cực kỳ thoải mái, đi cả ngày không đau chân. Giao hàng nhanh, đóng gói cẩn thận.', 'reviews'],
            ['review1_rating',   '5', 'reviews'],
            ['review2_name',     'Thanh Tùng', 'reviews'],
            ['review2_location', 'Hà Nội · Tháng 6/2025', 'reviews'],
            ['review2_content',  'Chất lượng y như hình, form giày chuẩn. Đây là lần thứ 3 mình mua ở shop rồi.', 'reviews'],
            ['review2_rating',   '5', 'reviews'],
            ['review3_name',     'Hải Đăng', 'reviews'],
            ['review3_location', 'Đà Nẵng · Tháng 5/2025', 'reviews'],
            ['review3_content',  'Shop tư vấn size rất kỹ, mang vừa chân ngay lần đầu. Sẽ ủng hộ tiếp trong tương lai.', 'reviews'],
            ['review3_rating',   '4', 'reviews'],
            ['review4_name',     'Lan Phương', 'reviews'],
            ['review4_location', 'Cần Thơ · Tháng 5/2025', 'reviews'],
            ['review4_content',  'Mẫu mã đa dạng, giá hợp lý so với chất lượng. Đóng gói kỹ, không lo móp hộp.', 'reviews'],
            ['review4_rating',   '5', 'reviews'],

            // ── Stats (Stat-bar) ─────────────────────────────────────────────────────
            ['stat1_num', '18000', 'stats'], ['stat1_suffix', '+', 'stats'], ['stat1_label', 'Khách hàng hài lòng', 'stats'],
            ['stat2_num', '120',   'stats'], ['stat2_suffix', '+', 'stats'], ['stat2_label', 'Mẫu giày', 'stats'],
            ['stat3_num', '6',     'stats'], ['stat3_suffix', ' năm', 'stats'], ['stat3_label', 'Kinh nghiệm', 'stats'],
            ['stat4_num', '63',    'stats'], ['stat4_suffix', ' tỉnh', 'stats'], ['stat4_label', 'Giao hàng toàn quốc', 'stats'],

            // ── Newsletter ───────────────────────────────────────────────────────────
            ['newsletter_title', 'Đăng ký nhận tin khuyến mãi', 'newsletter'],
            ['newsletter_desc',  'Nhận thông báo ưu đãi độc quyền, hàng mới về và mã giảm giá đặc biệt', 'newsletter'],

            // ── Footer ───────────────────────────────────────────────────────────────
            ['footer_desc', 'Volt Kicks — thương hiệu giày dép chính hãng dành cho giới trẻ yêu thích phong cách đường phố. Chất lượng thật, giá trị thật.', 'footer'],

            // ── Contact ──────────────────────────────────────────────────────────────
            ['contact_intro', 'Đội ngũ tư vấn viên luôn sẵn sàng hỗ trợ bạn chọn đúng size và mẫu giày', 'contact'],
            ['map_embed',     'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0962853684824!2d105.84372241493954!3d21.027763885995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2sHoan%20Kiem%20Lake!5e0!3m2!1sen!2s!4v1626123456789!5m2!1sen!2s', 'contact'],

            // ── Shop policy ──────────────────────────────────────────────────────────
            ['return_days', '15', 'shop'],

            // ── Payment (tab "💳 Thanh toán") ────────────────────────────────────────
            ['payment_cod_enabled',      '1', 'payment'],
            ['payment_sepay_enabled',    '0', 'payment'],
            ['sepay_bank_code',          '',  'payment'],
            ['sepay_account_number',     '',  'payment'],
            ['sepay_account_name',       '',  'payment'],
            ['sepay_webhook_secret',     '',  'payment'],
            ['shipping_fee',             '30000',  'payment'],
            ['free_shipping_threshold',  '500000', 'payment'],

            // ── SMTP ─────────────────────────────────────────────────────────────────
            ['smtp_host',      '', 'smtp'],
            ['smtp_port',      '587', 'smtp'],
            ['smtp_user',      '', 'smtp'],
            ['smtp_pass',      '', 'smtp'],
            ['smtp_from',      '', 'smtp'],
            ['smtp_from_name', 'Volt Kicks', 'smtp'],

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
                'Bước đi khác biệt mỗi ngày',
                'Volt Kicks mang đến những đôi giày chất lượng, thiết kế cá tính, đồng hành cùng phong cách đường phố của bạn mỗi ngày.',
                'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1600&auto=format&fit=crop&q=80',
                'Khám phá ngay', '/san-pham', 1, 'published',
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
            ['Sneaker',   'sneaker',   'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=80', 1],
            ['Boot',      'boot',      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&auto=format&fit=crop&q=80', 2],
            ['Chạy bộ',   'chay-bo',   'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&auto=format&fit=crop&q=80', 3],
            ['Sandal',    'sandal',    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=80', 4],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO product_categories (name, slug, image, sort_order) VALUES (?, ?, ?, ?)"
        );
        foreach ($cats as $c) { $stmt->execute($c); }
    }

    private function seedProducts(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
        if ($count > 0) return;

        $colVolt  = 'Volt Lime:#d4ff3f';
        $colBlack = 'Đen:#050706';
        $colWhite = 'Trắng:#ffffff';
        $colCyan  = 'Cyan:#00e5ff';
        $colBrown = 'Nâu:#8b6f5e';

        // [category_id, name, slug, image, price, price_sale, badge, description, colors, rating, in_stock, is_featured, is_new, sort_order, sizes]
        $products = [
            // ── Sneaker (category 1) ──────────────────────────────────────────────
            [1, 'Sneaker Dệt Kỹ Thuật Volt Trim', 'sneaker-det-ky-thuat-volt-trim',
             'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=700&auto=format&fit=crop&q=80',
             2390000, 1890000, 'Bán chạy',
             'Sneaker chất liệu vải dệt kỹ thuật phối da lộn, đế đệm khí êm ái. Form dáng năng động, phù hợp phối cùng streetwear hoặc đi làm hằng ngày.',
             "$colVolt|$colBlack|$colWhite", 4.9, 1, 1, 0, 1, '39|40|41|42|43|44'],

            [1, 'Sneaker Low-Top Basic Trắng', 'sneaker-low-top-basic-trang',
             'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=700&auto=format&fit=crop&q=80',
             1690000, null, '',
             'Sneaker low-top tối giản, phối được với mọi outfit. Chất liệu da tổng hợp bền bỉ, đế cao su chống trơn trượt.',
             "$colWhite|$colBlack", 4.6, 1, 0, 0, 2, '38|39|40|41|42|43|44'],

            [1, 'Sneaker Canvas Phối Cyan', 'sneaker-canvas-phoi-cyan',
             'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=700&auto=format&fit=crop&q=80',
             1590000, null, 'Mới',
             'Sneaker vải canvas thoáng khí, phối màu cyan nổi bật. Thiết kế trẻ trung, năng lượng, phù hợp mùa hè.',
             "$colCyan|$colBlack", 4.5, 1, 0, 1, 3, '39|40|41|42|43'],

            [1, 'Sneaker Retro Basketball High-Top', 'sneaker-retro-basketball-high-top',
             'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=700&auto=format&fit=crop&q=80',
             2490000, null, 'Mới',
             'Sneaker cổ cao phong cách basketball retro, đệm cổ chân dày dặn bảo vệ mắt cá. Đế cao tăng chiều cao nhẹ nhàng.',
             "$colBlack|$colVolt", 4.8, 1, 1, 1, 4, '40|41|42|43|44'],

            [1, 'Sneaker Chunky Dad Shoes Trắng-Nâu', 'sneaker-chunky-dad-shoes',
             'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=700&auto=format&fit=crop&q=80',
             1790000, null, '',
             'Sneaker chunky dáng dad-shoes đang thịnh hành, đế dày phối 2 tông màu cá tính. Êm chân khi di chuyển cả ngày.',
             "$colWhite|$colBrown", 4.4, 1, 0, 0, 5, '38|39|40|41|42'],

            [1, 'Sneaker Slip-On Tiện Lợi', 'sneaker-slip-on-tien-loi',
             'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=700&auto=format&fit=crop&q=80',
             1250000, null, '',
             'Sneaker slip-on không dây, xỏ nhanh tiện lợi. Chất liệu co giãn nhẹ, phù hợp di chuyển hằng ngày.',
             "$colWhite|$colVolt", 4.3, 1, 0, 0, 6, '38|39|40|41|42'],

            // ── Boot (category 2) ──────────────────────────────────────────────────
            [2, 'Boot Cổ Cao Da Lộn Nâu', 'boot-co-cao-da-lon-nau',
             'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=700&auto=format&fit=crop&q=80',
             2150000, null, 'Mới',
             'Boot cổ cao da lộn cao cấp, form dáng cứng cáp, phù hợp thời tiết se lạnh hoặc phối phong cách workwear.',
             "$colBrown|$colBlack", 4.8, 1, 1, 1, 7, '40|41|42|43|44'],

            [2, 'Boot Combat Dây Buộc Chunky Sole', 'boot-combat-day-buoc-chunky-sole',
             'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=700&auto=format&fit=crop&q=80',
             2350000, null, '',
             'Boot combat cá tính với đế chunky dày, dây buộc chắc chắn. Điểm nhấn hoàn hảo cho outfit đường phố.',
             "$colBlack", 4.6, 1, 0, 0, 8, '39|40|41|42|43'],

            [2, 'Boot Chelsea Da Trơn Basic', 'boot-chelsea-da-tron-basic',
             'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=700&auto=format&fit=crop&q=80',
             1990000, 1690000, '-15%',
             'Boot Chelsea da trơn tối giản, dễ phối đồ. Cổ giày co giãn xỏ nhanh, đế bền bỉ chống trơn.',
             "$colBlack|$colBrown", 4.5, 1, 0, 0, 9, '40|41|42|43|44'],

            [2, 'Boot Da Lộn Cổ Thấp Basic', 'boot-da-lon-co-thap-basic',
             'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=700&auto=format&fit=crop&q=80',
             1850000, null, '',
             'Boot cổ thấp da lộn basic, linh hoạt phối cùng quần jeans hoặc kaki. Đế cao su bám đường tốt.',
             "$colBrown", 4.4, 1, 0, 0, 10, '39|40|41|42|43'],

            // ── Chạy bộ (category 3) ─────────────────────────────────────────────
            [3, 'Giày Chạy Bộ Đệm Khí Responsive', 'giay-chay-bo-dem-khi-responsive',
             'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=700&auto=format&fit=crop&q=80',
             1450000, null, '',
             'Giày chạy bộ công nghệ đệm khí responsive, hoàn hồi năng lượng tốt cho mỗi bước chạy. Upper lưới thoáng khí.',
             "$colCyan|$colVolt", 4.7, 1, 1, 0, 11, '39|40|41|42|43|44'],

            [3, 'Giày Chạy Bộ Siêu Nhẹ Breathable Mesh', 'giay-chay-bo-sieu-nhe-breathable-mesh',
             'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=700&auto=format&fit=crop&q=80',
             1350000, null, 'Mới',
             'Giày chạy bộ siêu nhẹ với upper mesh thoáng khí tối đa, phù hợp chạy đường dài mùa nóng.',
             "$colWhite|$colCyan", 4.5, 1, 0, 1, 12, '38|39|40|41|42|43'],

            [3, 'Giày Chạy Bộ Marathon Pro', 'giay-chay-bo-marathon-pro',
             'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=700&auto=format&fit=crop&q=80',
             1950000, null, 'Bán chạy',
             'Giày chạy bộ chuyên marathon, đế giữa carbon-plate hỗ trợ đẩy bước hiệu quả. Dành cho runner nghiêm túc.',
             "$colBlack|$colVolt", 4.8, 1, 1, 0, 13, '40|41|42|43|44'],

            [3, 'Giày Chạy Bộ Trail Chống Trơn', 'giay-chay-bo-trail-chong-tron',
             'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=700&auto=format&fit=crop&q=80',
             1690000, null, '',
             'Giày chạy trail với đế gai chống trơn trượt, upper chống nước nhẹ — lý tưởng cho địa hình gồ ghề.',
             "$colBlack|$colCyan", 4.6, 1, 0, 0, 14, '40|41|42|43|44'],

            // ── Sandal (category 4) ──────────────────────────────────────────────
            [4, 'Sandal Quai Ngang Thể Thao', 'sandal-quai-ngang-the-thao',
             'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700&auto=format&fit=crop&q=80',
             930000, 790000, '-15%',
             'Sandal quai ngang thể thao, đế êm chống sốc. Phù hợp đi biển, dạo phố ngày hè.',
             "$colBlack|$colWhite", 4.3, 1, 0, 0, 15, '38|39|40|41|42|43'],

            [4, 'Sandal Trekking Đế Gai', 'sandal-trekking-de-gai',
             'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700&auto=format&fit=crop&q=80',
             850000, null, '',
             'Sandal trekking đế gai bám địa hình tốt, quai dán chắc chắn — phù hợp dã ngoại, leo núi nhẹ.',
             "$colBrown|$colBlack", 4.2, 1, 0, 0, 16, '39|40|41|42|43|44'],

            [4, 'Dép Slide Basic Logo', 'dep-slide-basic-logo',
             'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700&auto=format&fit=crop&q=80',
             450000, null, 'Mới',
             'Dép slide basic in logo, chất liệu EVA nhẹ êm chân — item không thể thiếu để mang trong nhà hoặc dạo gần.',
             "$colBlack|$colWhite|$colVolt", 4.4, 1, 0, 1, 17, '38|39|40|41|42|43|44'],

            [4, 'Sandal Da Quai Chéo Basic', 'sandal-da-quai-cheo-basic',
             'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700&auto=format&fit=crop&q=80',
             690000, null, '',
             'Sandal da quai chéo tối giản, khóa cài chắc chắn dễ điều chỉnh. Phù hợp mang hằng ngày.',
             "$colBrown|$colBlack", 4.1, 1, 0, 0, 18, '38|39|40|41|42'],
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
            ['WELCOME10', 'percent', 10, 500000, 500, 0, null, 1],
            ['FREESHIP',  'fixed',   30000, 500000, null, 0, null, 1],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO coupons (code, type, value, min_order, max_uses, used_count, expires_at, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($coupons as $c) { $stmt->execute($c); }
    }
}
