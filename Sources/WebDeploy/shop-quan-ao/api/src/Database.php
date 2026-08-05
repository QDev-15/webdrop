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
            ['site_name',        'Lys Chic',                          'general'],
            ['site_slogan',      'Vẻ đẹp nhẹ nhàng trong từng thớ vải', 'general'],
            ['site_email',       'hello@lyschic.vn',                  'general'],
            ['site_phone',       '0938 123 456',                      'general'],
            ['site_address',     '12 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh', 'general'],
            ['working_hours',    '9:00 – 21:00 · Tất cả các ngày trong tuần', 'general'],
            ['site_description', 'Lys Chic — thời trang nữ nhẹ nhàng, tinh tế. Chất liệu mềm mại, thiết kế tối giản, đồng hành cùng phong cách sống hiện đại của bạn.', 'general'],
            ['site_logo',        '', 'general'],
            ['site_favicon',     '', 'general'],
            ['zalo_number',      '0938123456', 'general'],

            // ── SEO ──────────────────────────────────────────────────────────────
            ['meta_title',       'Lys Chic — Thời Trang Nữ Nhẹ Nhàng, Tinh Tế', 'seo'],
            ['meta_description', 'Khám phá bộ sưu tập váy đầm, áo, quần và phụ kiện thời trang nữ tại Lys Chic — chất liệu mềm mại, form dáng tinh tế, giao hàng toàn quốc.', 'seo'],
            ['og_image', '', 'seo'],
            ['ga_id',    '', 'seo'],
            ['gtm_id',   '', 'seo'],

            // ── Social ───────────────────────────────────────────────────────────
            ['facebook',  'https://www.facebook.com/lyschic',  'social'],
            ['instagram', 'https://www.instagram.com/lyschic', 'social'],
            ['tiktok',    'https://www.tiktok.com/@lyschic',   'social'],
            ['zalo',      'https://zalo.me/0938123456',        'social'],

            // ── Hero (H12 Two-Column — ảnh chính lấy từ Hero Slides) ────────────────
            ['hero_tag',           'Bộ sưu tập Xuân Hè 2026',                                                   'hero'],
            ['hero_note',          'Miễn phí giao hàng đơn từ 300.000đ · Đổi trả trong 15 ngày',                 'hero'],
            ['hero_rating_score',  '4.9/5',                                                                     'hero'],
            ['hero_rating_count',  '2.100+',                                                                    'hero'],
            ['hero_sale_percent',  '30',                                                                        'hero'],

            // ── Brand values (List-Elegant) ─────────────────────────────────────────
            ['value1_icon',  'flower2',       'values'],
            ['value1_title', 'Chất liệu cao cấp, mềm mại',            'values'],
            ['value1_desc',  'Vải được chọn lọc kỹ càng, thoáng mát và an toàn cho làn da', 'values'],
            ['value2_icon',  'arrow-repeat',  'values'],
            ['value2_title', 'Đổi trả miễn phí trong 15 ngày',        'values'],
            ['value2_desc',  'Đổi size, đổi mẫu dễ dàng nếu chưa vừa ý', 'values'],
            ['value3_icon',  'truck',         'values'],
            ['value3_title', 'Giao hàng nhanh toàn quốc',             'values'],
            ['value3_desc',  'Nội thành 1-2 ngày, tỉnh thành khác 2-4 ngày làm việc', 'values'],
            ['value4_icon',  'heart',         'values'],
            ['value4_title', 'Tư vấn phối đồ tận tình',               'values'],
            ['value4_desc',  'Đội ngũ stylist hỗ trợ chọn trang phục phù hợp dáng người', 'values'],

            // ── Promo (Full-bleed) ──────────────────────────────────────────────────
            ['promo_label',   'Ưu đãi có giới hạn', 'promo'],
            ['promo_title',   'Giảm đến',           'promo'],
            ['promo_percent', '30%',                'promo'],
            ['promo_desc',    'Áp dụng cho bộ sưu tập Xuân Hè mới nhất — số lượng có hạn, nhanh tay đặt hàng trước khi kết thúc chương trình.', 'promo'],
            ['promo_image',   'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&auto=format&fit=crop&q=80', 'promo'],

            // ── Reviews (Horizontal-scroll) ──────────────────────────────────────────
            ['reviews_avg',      '4.9', 'reviews'],
            ['reviews_count',    '2.100+', 'reviews'],
            ['review1_name',     'Hồng Anh', 'reviews'],
            ['review1_location', 'TP.HCM · Tháng 6/2026', 'reviews'],
            ['review1_content',  'Vải mềm mịn, form dáng chuẩn. Mình rất hài lòng và sẽ ủng hộ shop lâu dài.', 'reviews'],
            ['review1_rating',   '5', 'reviews'],
            ['review2_name',     'Thảo My', 'reviews'],
            ['review2_location', 'Hà Nội · Tháng 6/2026', 'reviews'],
            ['review2_content',  'Đóng gói xinh xắn, giao hàng nhanh. Mẫu mã đúng như hình, màu sắc tươi tắn.', 'reviews'],
            ['review2_rating',   '5', 'reviews'],
            ['review3_name',     'Lan Chi', 'reviews'],
            ['review3_location', 'Đà Nẵng · Tháng 5/2026', 'reviews'],
            ['review3_content',  'Shop tư vấn phối đồ rất nhiệt tình, mình mua thêm được vài món phù hợp.', 'reviews'],
            ['review3_rating',   '4', 'reviews'],
            ['review4_name',     'Ngọc Diễm', 'reviews'],
            ['review4_location', 'Cần Thơ · Tháng 5/2026', 'reviews'],
            ['review4_content',  'Chất lượng vượt mong đợi so với giá tiền. Đã mua 3 lần và luôn hài lòng.', 'reviews'],
            ['review4_rating',   '5', 'reviews'],

            // ── Stats (Stat-bar) ─────────────────────────────────────────────────────
            ['stat1_num', '12000', 'stats'], ['stat1_suffix', '+', 'stats'], ['stat1_label', 'Khách hàng hài lòng', 'stats'],
            ['stat2_num', '180',   'stats'], ['stat2_suffix', '+', 'stats'], ['stat2_label', 'Mẫu thiết kế', 'stats'],
            ['stat3_num', '4',     'stats'], ['stat3_suffix', ' năm', 'stats'], ['stat3_label', 'Kinh nghiệm', 'stats'],
            ['stat4_num', '63',    'stats'], ['stat4_suffix', '', 'stats'], ['stat4_label', 'Tỉnh thành giao hàng toàn quốc', 'stats'],

            // ── Newsletter ───────────────────────────────────────────────────────────
            ['newsletter_title', 'Đăng ký nhận tin khuyến mãi', 'newsletter'],
            ['newsletter_desc',  'Nhận thông báo ưu đãi độc quyền, mẫu mới về và mã giảm giá đặc biệt', 'newsletter'],

            // ── Footer ───────────────────────────────────────────────────────────────
            ['footer_desc', 'Lys Chic — thời trang nữ nhẹ nhàng, tinh tế. Chất liệu mềm mại, thiết kế tối giản mang lại sự tự tin trong từng khoảnh khắc.', 'footer'],

            // ── Contact ──────────────────────────────────────────────────────────────
            ['contact_intro', 'Đội ngũ stylist luôn sẵn sàng tư vấn phối đồ và hỗ trợ chọn size phù hợp', 'contact'],
            ['map_embed',     'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4957372364!2d106.70108931480106!3d10.776900392318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3d6f5b6e63%3A0x9fac712bf40058ec!2zTmd1eeG7hW4gVHLDo2ksIELhur9uIE5naMOpLCBRdeG6rW4gMSwgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s', 'contact'],

            // ── Shop policy ──────────────────────────────────────────────────────────
            ['return_days', '15', 'shop'],

            // ── Payment (tab "💳 Thanh toán") ────────────────────────────────────────
            ['payment_cod_enabled',      '1', 'payment'],
            ['payment_sepay_enabled',    '1', 'payment'],
            ['sepay_bank_code',          'MB',  'payment'],
            ['sepay_account_number',     '0099001122334',  'payment'],
            ['sepay_account_name',       'WEBDROP STORE TEST',  'payment'],
            ['sepay_webhook_secret',     'TEST_SEPAY_API_2026',  'payment'],
            ['shipping_fee',             '30000',  'payment'],
            ['free_shipping_threshold',  '300000', 'payment'],

            // ── SMTP ─────────────────────────────────────────────────────────────────
            ['smtp_host',      '', 'smtp'],
            ['smtp_port',      '587', 'smtp'],
            ['smtp_user',      '', 'smtp'],
            ['smtp_pass',      '', 'smtp'],
            ['smtp_from',      '', 'smtp'],
            ['smtp_from_name', 'Lys Chic', 'smtp'],

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
                'Vẻ đẹp nhẹ nhàng trong từng thớ vải',
                'Chất liệu mềm mại, form dáng tinh tế — Lys Chic mang đến vẻ đẹp nữ tính, nhẹ nhàng cho mỗi khoảnh khắc trong ngày của bạn.',
                'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&auto=format&fit=crop&q=80',
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
            ['Váy đầm',   'vay-dam',   'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500&auto=format&fit=crop&q=80', 1],
            ['Áo',        'ao',        'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=500&auto=format&fit=crop&q=80', 2],
            ['Quần',      'quan',      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=80', 3],
            ['Phụ kiện',  'phu-kien',  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=80', 4],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO product_categories (name, slug, image, sort_order) VALUES (?, ?, ?, ?)"
        );
        foreach ($cats as $c) { $stmt->execute($c); }
    }

    private function seedProducts(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
        if ($count > 0) return;

        $colLavender = 'Lavender:#b98bd1';
        $colButter   = 'Butter:#f2c14e';
        $colBlush    = 'Blush:#f7d8de';
        $colWhite    = 'Trắng:#ffffff';
        $colBlack    = 'Đen:#2b2230';
        $sizesApparel = 'XS|S|M|L|XL';
        $sizesOne     = 'One Size';

        // [category_id, name, slug, image, price, price_sale, badge, description, colors, rating, in_stock, is_featured, is_new, sort_order, sizes] (gallery='' appended in execute)
        $products = [
            // ── Váy đầm (category 1) ──────────────────────────────────────────────
            [1, 'Đầm Suông Linen Cổ Tim', 'dam-suong-linen-co-tim',
             'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&auto=format&fit=crop&q=80',
             590000, 790000, 'Bán chạy',
             'Đầm suông chất liệu linen mềm mại, cổ tim nhẹ nhàng nữ tính. Form rộng rãi thoải mái vận động, phù hợp dạo phố hoặc đi làm.',
             "$colLavender|$colWhite|$colBlack", 4.9, 1, 1, 0, 1, $sizesApparel],

            [1, 'Đầm Hoa Nhí Wrap Buộc Eo', 'dam-hoa-nhi-wrap-buoc-eo',
             'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&auto=format&fit=crop&q=80',
             690000, null, 'Mới',
             'Đầm wrap họa tiết hoa nhí, thiết kế buộc dây tôn eo linh hoạt. Chất liệu voan nhẹ bay bổng, thích hợp cho những chuyến du lịch.',
             "$colBlush|$colWhite", 4.8, 1, 1, 1, 2, $sizesApparel],

            [1, 'Đầm Midi Tay Bèo Pastel', 'dam-midi-tay-beo-pastel',
             'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&auto=format&fit=crop&q=80',
             620000, null, '',
             'Đầm midi tay bèo điệu đà, chất liệu cotton lụa thoáng mát. Form ôm nhẹ vừa phải, tôn dáng người mặc.',
             "$colLavender|$colBlush", 4.7, 1, 0, 0, 3, $sizesApparel],

            [1, 'Đầm 2 Dây Chấm Bi Vintage', 'dam-2-day-cham-bi-vintage',
             'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=700&auto=format&fit=crop&q=80',
             450000, 590000, '-24%',
             'Đầm 2 dây họa tiết chấm bi phong cách vintage, phối cùng áo cardigan hoặc mặc riêng đều đẹp.',
             "$colWhite|$colBlack", 4.6, 1, 0, 0, 4, $sizesApparel],

            [1, 'Đầm Babydoll Voi Xếp Ly', 'dam-babydoll-xep-ly',
             'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=700&auto=format&fit=crop&q=80',
             520000, null, '',
             'Đầm babydoll xếp ly nhẹ nhàng, phần thân trên ôm vừa và chân váy xòe bồng bềnh dễ thương.',
             "$colBlush|$colLavender", 4.5, 0, 0, 1, 5, $sizesApparel],

            // ── Áo (category 2) ──────────────────────────────────────────────────
            [2, 'Áo Blouse Tay Phồng Lụa', 'ao-blouse-tay-phong-lua',
             'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=700&auto=format&fit=crop&q=80',
             320000, null, 'Mới',
             'Áo blouse chất liệu lụa mềm mại, tay phồng điệu đà. Form rộng rãi che khuyết điểm tốt, dễ phối cùng quần jeans hoặc chân váy.',
             "$colWhite|$colBlush|$colButter", 4.8, 1, 1, 1, 6, $sizesApparel],

            [2, 'Áo Sơ Mi Cổ Bèo Tối Giản', 'ao-so-mi-co-beo-toi-gian',
             'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=700&auto=format&fit=crop&q=80',
             380000, null, '',
             'Áo sơ mi cổ bèo tối giản, chất vải cotton pha thoáng mát, mặc được cả đi làm và đi chơi.',
             "$colWhite|$colLavender", 4.6, 1, 0, 0, 7, $sizesApparel],

            [2, 'Áo Croptop Dây Phối Ren', 'ao-croptop-day-phoi-ren',
             'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&auto=format&fit=crop&q=80',
             240000, 300000, '-20%',
             'Áo croptop dây phối ren tinh tế, phù hợp mặc layer cùng áo khoác hoặc blazer.',
             "$colBlush|$colBlack", 4.4, 1, 0, 0, 8, $sizesApparel],

            [2, 'Áo Cardigan Dệt Kim Mỏng', 'ao-cardigan-det-kim-mong',
             'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&auto=format&fit=crop&q=80',
             420000, null, '',
             'Áo cardigan dệt kim mỏng nhẹ, phù hợp mặc trong máy lạnh hoặc khoác ngoài những ngày se lạnh.',
             "$colButter|$colWhite", 4.5, 1, 0, 0, 9, $sizesApparel],

            [2, 'Áo Kiểu Tay Lỡ Basic', 'ao-kieu-tay-lo-basic',
             'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&auto=format&fit=crop&q=80',
             280000, null, 'Hàng mới',
             'Áo kiểu tay lỡ basic dễ phối đồ, chất liệu cotton mềm mịn thấm hút mồ hôi tốt.',
             "$colWhite|$colLavender|$colBlack", 4.3, 1, 0, 1, 10, $sizesApparel],

            // ── Quần (category 3) ────────────────────────────────────────────────
            [3, 'Quần Culottes Ống Rộng', 'quan-culottes-ong-rong',
             'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&auto=format&fit=crop&q=80',
             420000, null, '',
             'Quần culottes ống rộng chất liệu lụa mềm mại, độ rủ tự nhiên. Cạp chun sau lưng co giãn thoải mái.',
             "$colBlack|$colWhite", 4.6, 1, 0, 0, 11, $sizesApparel],

            [3, 'Quần Baggy Kaki Cạp Cao', 'quan-baggy-kaki-cap-cao',
             'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&auto=format&fit=crop&q=80',
             450000, 550000, '-18%',
             'Quần baggy kaki cạp cao form rộng rãi, phong cách năng động dễ phối cùng áo croptop hoặc áo thun basic.',
             "$colBlack|$colButter", 4.5, 1, 1, 0, 12, $sizesApparel],

            [3, 'Quần Jean Ống Loe Lưng Cao', 'quan-jean-ong-loe-lung-cao',
             'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&auto=format&fit=crop&q=80',
             520000, null, 'Bán chạy',
             'Quần jean ống loe lưng cao tôn dáng, chất denim co giãn nhẹ thoải mái vận động cả ngày.',
             "$colWhite", 4.7, 1, 1, 0, 13, $sizesApparel],

            [3, 'Chân Váy Xếp Ly Midi', 'chan-vay-xep-ly-midi',
             'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=700&auto=format&fit=crop&q=80',
             360000, null, '',
             'Chân váy xếp ly midi kinh điển, chất liệu đứng form đẹp, dễ phối cùng áo thun basic hoặc áo sơ mi.',
             "$colLavender|$colBlack", 4.4, 0, 0, 0, 14, $sizesApparel],

            // ── Phụ kiện (category 4) ─────────────────────────────────────────────
            [4, 'Túi Xách Mini Da Mềm', 'tui-xach-mini-da-mem',
             'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&auto=format&fit=crop&q=80',
             450000, null, 'Yêu thích',
             'Túi xách mini da mềm cao cấp, thiết kế nhỏ gọn tiện dụng, dây đeo điều chỉnh linh hoạt.',
             "$colLavender|$colBlack|$colWhite", 4.8, 1, 1, 0, 15, $sizesOne],

            [4, 'Nón Bucket Vải Cotton', 'non-bucket-vai-cotton',
             'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=700&auto=format&fit=crop&q=80',
             185000, null, 'Mới',
             'Nón bucket vải cotton mềm mại, phong cách trẻ trung dễ phối đồ, phụ kiện không thể thiếu mùa hè.',
             "$colButter|$colBlack", 4.5, 1, 0, 1, 16, $sizesOne],

            [4, 'Khăn Lụa Họa Tiết Hoa', 'khan-lua-hoa-tiet-hoa',
             'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&auto=format&fit=crop&q=80',
             165000, 220000, '-25%',
             'Khăn lụa họa tiết hoa nhí, có thể buộc tóc, quàng cổ hoặc trang trí túi xách — món phụ kiện đa năng.',
             "$colBlush|$colLavender", 4.6, 1, 0, 0, 17, $sizesOne],

            [4, 'Thắt Lưng Da Bản Nhỏ', 'that-lung-da-ban-nho',
             'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&auto=format&fit=crop&q=80',
             145000, null, '',
             'Thắt lưng da bản nhỏ tinh tế, giúp tôn eo khi phối cùng đầm suông hoặc áo blouse.',
             "$colBlack|$colWhite", 4.3, 1, 0, 0, 18, $sizesOne],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO products
                (category_id, name, slug, image, price, price_sale, badge, description, colors, rating, in_stock, is_featured, is_new, sort_order, sizes, gallery)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($products as $p) { $stmt->execute([...$p, '']); }
    }

    private function seedCoupons(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM coupons")->fetchColumn();
        if ($count > 0) return;
        $coupons = [
            ['WELCOME10', 'percent', 10, 300000, 500, 0, null, 1],
            ['FREESHIP',  'fixed',   30000, 500000, null, 0, null, 1],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO coupons (code, type, value, min_order, max_uses, used_count, expires_at, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($coupons as $c) { $stmt->execute($c); }
    }
}
