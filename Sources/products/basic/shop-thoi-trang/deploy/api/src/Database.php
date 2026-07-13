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
        $this->seedProductReviews();
        $this->seedTestimonials();
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
            // General
            ['site_name',        'Nova Store',                       'general'],
            ['site_slogan',      'Phong cách mới mỗi ngày',           'general'],
            ['site_email',       'hello@novastore.vn',                'general'],
            ['site_phone',       '0901 234 567',                      'general'],
            ['site_phone2',      '0912 345 678',                      'general'],
            ['site_address',     '88 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM', 'general'],
            ['working_hours',    'Thứ 2 – Thứ 7: 8:00 – 21:00 · Chủ nhật: 9:00 – 19:00', 'general'],
            ['site_description', 'Thời trang phong cách mới — thiết kế táo bạo, chất liệu cao cấp, giá cả hợp lý.', 'general'],
            ['site_logo',        '', 'general'],
            ['site_favicon',     '', 'general'],
            // SEO
            ['meta_title',       'Nova Store — Thời Trang Phong Cách Mới',                          'seo'],
            ['meta_description', 'Khám phá bộ sưu tập thời trang nam nữ, trẻ em, phụ kiện và giày dép phong cách hiện đại tại Nova Store.', 'seo'],
            ['og_image',  '', 'seo'],
            ['ga_id',     '', 'seo'],
            ['gtm_id',    '', 'seo'],
            // Social
            ['facebook',    'https://facebook.com/novastore',  'social'],
            ['instagram',   'https://instagram.com/novastore', 'social'],
            ['tiktok',      'https://tiktok.com/@novastore',   'social'],
            ['youtube',     'https://youtube.com/@novastore',  'social'],
            ['zalo',        'https://zalo.me/0901234567',      'social'],
            ['zalo_number', '0901234567',                      'social'],
            // Hero (H3 Magazine Grid — text tĩnh, ảnh lấy từ hero_slides)
            ['hero_eyebrow',    'Bộ Sưu Tập Mới — 2026',                    'hero'],
            ['hero_title_1',    'PHONG',                                    'hero'],
            ['hero_title_2',    'CÁCH',                                     'hero'],
            ['hero_title_3',    'MỚI',                                      'hero'],
            ['hero_desc',       'Thiết kế táo bạo, chất liệu cao cấp và mức giá hợp lý — Nova Store mang phong cách đường phố hiện đại đến gần bạn hơn.', 'hero'],
            ['hero_cta1_text',  'Khám Phá Ngay', 'hero'],
            ['hero_cta1_link',  '/san-pham', 'hero'],
            ['hero_cta2_text',  'Xem Lookbook', 'hero'],
            ['hero_cta2_link',  '/san-pham', 'hero'],
            // Stats (stat bar)
            ['stat_customers',        '50', 'stats'],
            ['stat_customers_suffix', 'K+', 'stats'],
            ['stat_products',         '2850', 'stats'],
            ['stat_products_suffix',  '+', 'stats'],
            ['stat_rating',           '5', 'stats'],
            ['stat_freeship_pct',     '100', 'stats'],
            // Brand story (2 strips)
            ['story1_watermark', '01', 'about'],
            ['story1_badge',     'Câu Chuyện',                       'about'],
            ['story1_title_1',   'Thời Trang',                        'about'],
            ['story1_title_2',   'Từ Trái Tim',                       'about'],
            ['story1_text',      'Nova Store ra đời từ mong muốn mang đến những thiết kế trẻ trung, cá tính nhưng vẫn giữ được sự tinh tế. Mỗi bộ sưu tập là một câu chuyện — nơi phong cách cá nhân được tôn trọng tuyệt đối.', 'about'],
            ['story1_feat1',     'Chất liệu cao cấp, bền đẹp theo thời gian', 'about'],
            ['story1_feat2',     'Thiết kế riêng biệt, không trùng lặp', 'about'],
            ['story1_feat3',     'Sản xuất có trách nhiệm, bảo vệ môi trường', 'about'],
            ['story2_watermark', '02', 'about'],
            ['story2_badge',     'Cam Kết',                           'about'],
            ['story2_title_1',   'Chất Lượng',                        'about'],
            ['story2_title_2',   'Không Thỏa Hiệp',                   'about'],
            ['story2_text',      'Mỗi sản phẩm đều trải qua quy trình kiểm định nghiêm ngặt trước khi đến tay bạn. Chúng tôi cam kết đồng hành cùng bạn từ lúc đặt hàng đến sau khi nhận sản phẩm.', 'about'],
            ['story2_feat1',     'Bảo hành chất lượng 30 ngày', 'about'],
            ['story2_feat2',     'Đổi trả miễn phí trong 14 ngày', 'about'],
            ['story2_feat3',     'Giao hàng nhanh toàn quốc 2–4 ngày', 'about'],
            // Promo / Flash sale
            ['promo_tag',      'Flash Sale',                                                    'promo'],
            ['promo_title',    'GIẢM ĐẾN',                                                       'promo'],
            ['promo_percent',  '50%',                                                            'promo'],
            ['promo_desc',     'Áp dụng cho bộ sưu tập được chọn — số lượng có hạn, nhanh tay đặt hàng trước khi kết thúc chương trình.', 'promo'],
            ['promo_end_at',   '', 'promo'],
            // Newsletter
            ['newsletter_title', 'Nhận Ưu Đãi Độc Quyền', 'general'],
            ['newsletter_sub',   'Đăng ký ngay để nhận thông tin bộ sưu tập mới và khuyến mãi hấp dẫn', 'general'],
            // Footer
            ['footer_desc', 'Nova Store — thời trang phong cách mới. Thiết kế táo bạo, chất lượng đáng tin cậy, đồng hành cùng phong cách sống hiện đại của bạn.', 'footer'],
            // Contact
            ['contact_intro',  'Chúng tôi luôn sẵn sàng hỗ trợ bạn — phản hồi trong vòng 2 giờ làm việc', 'contact'],
            ['map_embed',      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4957372364!2d106.70108931480106!3d10.776900392318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3d6f5b6e63%3A0x9fac712bf40058ec!2zTmd1eeG7hW4gSHXhu4csIELhur9uIE5naMOpLCBRdeG6rW4gMSwgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s', 'contact'],
            // Shop policies
            ['shipping_fee',            '30000',  'shop'],
            ['free_shipping_threshold', '300000', 'shop'],
            ['return_days',             '14',     'shop'],
            // Payment methods — cấu hình bật/tắt tại tab "💳 Thanh toán"
            ['payment_cod_enabled',   '1', 'payment'],
            ['payment_sepay_enabled', '0', 'payment'],
            ['sepay_bank_code',       '',  'payment'],
            ['sepay_account_number',  '',  'payment'],
            ['sepay_account_name',    '',  'payment'],
            ['sepay_webhook_secret',  '',  'payment'],
            // SMTP
            ['smtp_host',      '', 'smtp'],
            ['smtp_port',      '587', 'smtp'],
            ['smtp_user',      '', 'smtp'],
            ['smtp_pass',      '', 'smtp'],
            ['smtp_from',      '', 'smtp'],
            ['smtp_from_name', 'Nova Store', 'smtp'],
            // System
            ['maintenance_mode', '0', 'system'],
            // Cloudinary
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key',    '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            // Integrations
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
            ['fb_pixel_id', '', 'integrations'],
        ];
        $stmt = $this->pdo->prepare("INSERT OR IGNORE INTO settings (key, value, grp) VALUES (?, ?, ?)");
        foreach ($settings as $row) { $stmt->execute($row); }
    }

    /**
     * hero_slides ở site này KHÔNG dùng làm carousel — Hero là H3 Magazine Grid tĩnh
     * (text lấy từ settings nhóm "hero"). 3 dòng đầu (sort_order 1-3) đóng vai trò
     * ảnh + nhãn cho lưới magazine bên phải (title = nhãn "Nữ"/"Nam"/"Phụ kiện"),
     * vẫn quản lý được qua Admin → Hero Slides như mọi site khác trong hệ thống.
     */
    private function seedHeroSlides(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM hero_slides")->fetchColumn();
        if ($count > 0) return;
        $slides = [
            ['Nữ',       '', 'https://picsum.photos/seed/novaHeroNu/500/800',   '', '/san-pham', 1, 1],
            ['Nam',      '', 'https://picsum.photos/seed/novaHeroNam/500/520',  '', '/san-pham', 2, 1],
            ['Phụ kiện', '', 'https://picsum.photos/seed/novaHeroPk/500/520',   '', '/san-pham', 3, 1],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO hero_slides (title, subtitle, image, btn_text, btn_link, sort_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($slides as $s) { $stmt->execute($s); }
    }

    private function seedProductCategories(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM product_categories")->fetchColumn();
        if ($count > 0) return;
        $cats = [
            ['Nữ',        'nu',        'https://picsum.photos/seed/novaCatNu/600/750', 1],
            ['Nam',       'nam',       'https://picsum.photos/seed/novaCatNam/600/750', 2],
            ['Trẻ Em',    'tre-em',    'https://picsum.photos/seed/novaCatTreEm/600/750', 3],
            ['Phụ Kiện',  'phu-kien',  'https://picsum.photos/seed/novaCatPhuKien/600/460', 4],
            ['Giày Dép',  'giay-dep',  'https://picsum.photos/seed/novaCatGiayDep/600/460', 5],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO product_categories (name, slug, image, sort_order) VALUES (?, ?, ?, ?)"
        );
        foreach ($cats as $c) { $stmt->execute($c); }
    }

    private function specsJson(string $material, string $fit, string $origin, string $sizesLabel, string $colorsLabel, string $dims, string $care = 'Giặt máy ≤ 30°C, không tẩy, phơi trong bóng râm'): string {
        return json_encode([
            ['Chất liệu', $material],
            ['Form dáng', $fit],
            ['Xuất xứ', $origin],
            ['Size có sẵn', $sizesLabel],
            ['Màu sắc', $colorsLabel],
            ['Số đo (size M)', $dims],
            ['Đóng gói', 'Túi zip tái chế, hộp giấy có thể tái sử dụng'],
            ['Bảo quản', $care],
            ['Bảo hành', '30 ngày — lỗi nhà sản xuất'],
        ], JSON_UNESCAPED_UNICODE);
    }

    private function featuresText(array $lines): string {
        return implode("\n", $lines);
    }

    private function seedProducts(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
        if ($count > 0) return;

        $brand = 'Nova Store';
        $sizesApparel = 'XS|S|M|L|XL|XXL';
        $sizesOne     = 'One Size';
        $colWhite  = 'Trắng:#ffffff';
        $colBlack  = 'Đen:#0a0a0a';
        $colBlue   = 'Xanh dương:#0052ff';
        $colPink   = 'Đỏ hồng:#e11d48';
        $colYellow = 'Vàng bơ:#d4a027';
        $colGreen  = 'Xanh lá:#16a34a';
        $colPurple = 'Tím:#7c3aed';
        $colOrange = 'Cam:#ea580c';
        $colGray   = 'Xám:#6b7280';
        $colCream  = 'Kem:#f0ead6';

        // [category_id, name, slug, brand, image, gallery, price, price_sale, badge, description, features, specs, material, origin, colors, sizes, rating, review_count, sold_count, stock_qty, in_stock, is_featured, is_new, sort_order]
        $products = [
            [1, 'Áo Blouse Crinkle Tay Phồng', 'ao-blouse-crinkle-tay-phong', $brand,
             'https://picsum.photos/seed/nova01/700/933',
             'https://picsum.photos/seed/nova01b/700/933|https://picsum.photos/seed/nova01c/700/933|https://picsum.photos/seed/nova01d/700/933',
             425000, null, 'Mới',
             'Áo blouse chất liệu crinkle nhăn tự nhiên, tay phồng điệu đà. Form rộng rãi che khuyết điểm tốt, dễ phối cùng quần jeans hoặc chân váy.',
             $this->featuresText(['Chất liệu crinkle mềm mại, thoáng mát cả ngày', 'Tay phồng bồng bềnh, tôn dáng vai', 'Phối được với quần jeans, quần culottes hoặc chân váy midi', 'Giặt máy được ở nhiệt độ thấp, không tẩy, không sấy nóng']),
             $this->specsJson('Crinkle 100% Polyester', 'Rộng rãi — form Oversize nhẹ', 'Việt Nam', 'XS / S / M / L / XL / XXL', 'Trắng / Đen / Xanh dương', 'Dài thân 62cm · Rộng ngực 56cm · Dài tay 60cm'),
             'Crinkle Polyester', 'Việt Nam', "$colWhite|$colBlack|$colBlue", $sizesApparel, 4.8, 32, 210, 60, 1, 1, 1, 1],

            [1, 'Quần Culottes Vải Lụa Mềm', 'quan-culottes-vai-lua-mem', $brand,
             'https://picsum.photos/seed/nova02/700/933',
             'https://picsum.photos/seed/nova02b/700/933|https://picsum.photos/seed/nova02c/700/933',
             350000, 500000, '-30%',
             'Quần culottes ống rộng chất liệu lụa mềm mại, độ rủ tự nhiên. Cạp chun sau lưng co giãn thoải mái, phù hợp dáng người.',
             $this->featuresText(['Chất liệu lụa mềm, độ rủ đẹp tự nhiên', 'Cạp chun sau co giãn 4 chiều', 'Ống rộng che khuyết điểm chân', 'Ủi ở nhiệt độ thấp, tránh ánh nắng trực tiếp khi phơi']),
             $this->specsJson('Lụa Satin cao cấp', 'Ống rộng — Culottes', 'Việt Nam', 'XS / S / M / L / XL', 'Đen / Kem', 'Dài quần 92cm · Vòng eo (chun) 60–80cm'),
             'Lụa Satin', 'Việt Nam', "$colBlack|$colCream", 'XS|S|M|L|XL', 4.6, 21, 140, 45, 1, 0, 0, 2],

            [1, 'Đầm Midi Ombre Tay Dài', 'dam-midi-ombre-tay-dai', $brand,
             'https://picsum.photos/seed/nova03/700/933',
             'https://picsum.photos/seed/nova03b/700/933|https://picsum.photos/seed/nova03c/700/933|https://picsum.photos/seed/nova03d/700/933',
             780000, null, 'Hot',
             'Đầm midi phối màu ombre độc đáo, tay dài thanh lịch. Chất liệu co giãn nhẹ ôm form vừa vặn, phù hợp dạo phố hoặc đi làm.',
             $this->featuresText(['Kỹ thuật nhuộm ombre độc quyền — không sản phẩm nào giống hệt nhau', 'Chất liệu co giãn 2 chiều, ôm dáng vừa phải', 'Tay dài, cổ tròn thanh lịch', 'Giặt tay hoặc chế độ giặt nhẹ, không vắt mạnh']),
             $this->specsJson('Cotton pha Spandex', 'Ôm vừa — Midi length', 'Việt Nam', 'XS / S / M / L / XL / XXL', 'Ombre xanh dương / Ombre hồng', 'Dài váy 105cm · Vòng ngực 84cm'),
             'Cotton Spandex', 'Việt Nam', "$colBlue|$colPink", $sizesApparel, 4.9, 18, 96, 30, 1, 1, 1, 3],

            [1, 'Chân Váy Xếp Li Midi', 'chan-vay-xep-li-midi', $brand,
             'https://picsum.photos/seed/nova04/700/933',
             'https://picsum.photos/seed/nova04b/700/933|https://picsum.photos/seed/nova04c/700/933',
             460000, null, null,
             'Chân váy xếp ly midi kinh điển, chất liệu đứng form đẹp. Dễ phối cùng áo thun basic hoặc áo sơ mi tối giản.',
             $this->featuresText(['Xếp ly đều, giữ form tốt qua nhiều lần giặt', 'Cạp cao tôn dáng', 'Lót trong thoáng mát, không lộ dáng', 'Ủi ở nhiệt độ trung bình để giữ nếp ly']),
             $this->specsJson('Polyester cao cấp', 'Xếp ly — cạp cao', 'Việt Nam', 'XS / S / M / L / XL', 'Đen / Xám', 'Dài váy 68cm · Vòng eo 62–74cm'),
             'Polyester', 'Việt Nam', "$colBlack|$colGray", 'XS|S|M|L|XL', 4.5, 14, 88, 40, 1, 0, 0, 4],

            [1, 'Áo Cardigan Dệt Kim Mỏng', 'ao-cardigan-det-kim-mong', $brand,
             'https://picsum.photos/seed/nova05/700/933',
             'https://picsum.photos/seed/nova05b/700/933|https://picsum.photos/seed/nova05c/700/933',
             392000, 490000, '-20%',
             'Áo cardigan dệt kim mỏng nhẹ, phù hợp mặc trong máy lạnh hoặc khoác ngoài những ngày se lạnh. Form basic dễ mặc mọi lúc.',
             $this->featuresText(['Chất liệu dệt kim mỏng nhẹ, thoáng khí', 'Cúc áo pha lê tinh tế', 'Form basic dễ phối với mọi outfit', 'Giặt tay hoặc túi giặt riêng để giữ form']),
             $this->specsJson('Len pha Acrylic', 'Form vừa — dệt kim', 'Việt Nam', 'XS / S / M / L / XL', 'Kem / Xám', 'Dài thân 58cm · Rộng ngực 52cm'),
             'Len Acrylic', 'Việt Nam', "$colCream|$colGray", 'XS|S|M|L|XL', 4.4, 9, 52, 35, 1, 0, 0, 5],

            [1, 'Váy Wrap Họa Tiết Hoa', 'vay-wrap-hoa-tiet-hoa', $brand,
             'https://picsum.photos/seed/nova06/700/933',
             'https://picsum.photos/seed/nova06b/700/933|https://picsum.photos/seed/nova06c/700/933',
             380000, 520000, '-27%',
             'Váy wrap họa tiết hoa nhí, thiết kế buộc dây tôn eo linh hoạt. Chất liệu voan nhẹ bay bổng, thích hợp cho những chuyến du lịch.',
             $this->featuresText(['Thiết kế wrap buộc dây điều chỉnh vòng eo linh hoạt', 'Họa tiết hoa nhí in kỹ thuật số bền màu', 'Chất liệu voan nhẹ, bay bổng khi di chuyển', 'Giặt tay nhẹ nhàng, không ngâm lâu']),
             $this->specsJson('Voan hoa in kỹ thuật số', 'Wrap — buộc dây eo', 'Việt Nam', 'XS / S / M / L', 'Họa tiết hoa nền trắng', 'Dài váy 98cm · Vòng eo điều chỉnh 58–80cm'),
             'Voan', 'Việt Nam', $colWhite, 'XS|S|M|L', 4.7, 11, 64, 28, 1, 0, 0, 6],

            [1, 'Đầm Suông Linen Basic', 'dam-suong-linen-basic', $brand,
             'https://picsum.photos/seed/nova07/700/933',
             'https://picsum.photos/seed/nova07b/700/933|https://picsum.photos/seed/nova07c/700/933',
             520000, null, 'Mới',
             'Đầm suông linen basic tối giản, mặc thoải mái cả ngày dài. Có túi hai bên tiện lợi, phù hợp công sở lẫn dạo phố.',
             $this->featuresText(['Chất liệu linen thoáng mát, thấm hút tốt', 'Form suông rộng rãi, không gò bó', 'Có túi 2 bên tiện lợi', 'Có thể mặc kèm thắt lưng để tạo điểm nhấn eo']),
             $this->specsJson('Linen 100%', 'Suông — rộng rãi', 'Việt Nam', 'XS / S / M / L / XL / XXL', 'Trắng / Đen / Cam', 'Dài váy 100cm · Rộng ngực 58cm'),
             'Linen', 'Việt Nam', "$colWhite|$colBlack|$colOrange", $sizesApparel, 4.6, 7, 40, 38, 1, 0, 1, 7],

            [1, 'Áo Khoác Trench Dáng Dài', 'ao-khoac-trench-dang-dai', $brand,
             'https://picsum.photos/seed/nova08/700/933',
             'https://picsum.photos/seed/nova08b/700/933|https://picsum.photos/seed/nova08c/700/933|https://picsum.photos/seed/nova08d/700/933',
             890000, null, 'Hot',
             'Áo khoác trench dáng dài kinh điển, thắt đai eo sang trọng. Chất liệu dày dặn giữ form, phù hợp làm điểm nhấn cho outfit mùa thu đông.',
             $this->featuresText(['Dáng trench coat kinh điển, thắt đai tôn eo', 'Chất liệu dày dặn, giữ form và cản gió tốt', 'Cổ áo bẻ cách điệu, 2 túi hộp tiện dụng', 'Bảo quản nơi khô ráo, treo móc để giữ form']),
             $this->specsJson('Dạ pha Polyester', 'Dáng dài — thắt đai', 'Việt Nam', 'XS / S / M / L / XL', 'Kem / Đen', 'Dài áo 95cm · Rộng ngực 60cm'),
             'Dạ Polyester', 'Việt Nam', "$colCream|$colBlack", $sizesApparel, 4.9, 15, 58, 25, 1, 1, 0, 8],

            [2, 'Áo Polo Classic Pique Nam', 'ao-polo-classic-pique-nam', $brand,
             'https://picsum.photos/seed/nova09/700/933',
             'https://picsum.photos/seed/nova09b/700/933|https://picsum.photos/seed/nova09c/700/933',
             320000, null, 'Hot',
             'Áo polo classic chất liệu pique cotton thoáng mát, form regular fit lịch sự. Lựa chọn an toàn cho cả đi làm và đi chơi.',
             $this->featuresText(['Chất liệu pique cotton 100%, thoáng khí', 'Form regular fit vừa vặn, không quá bó', 'Cổ bo 2 lớp giữ form lâu', 'Giặt máy bình thường, không cần ủi nhiều']),
             $this->specsJson('Cotton Pique 100%', 'Regular fit', 'Việt Nam', 'S / M / L / XL / XXL', 'Trắng / Đen / Xanh dương', 'Dài áo 70cm · Rộng ngực 54cm'),
             'Cotton Pique', 'Việt Nam', "$colWhite|$colBlack|$colBlue", 'S|M|L|XL|XXL', 4.7, 26, 180, 55, 1, 1, 0, 9],

            [2, 'Áo Thun Tay Dài Nam Cotton', 'ao-thun-tay-dai-nam-cotton', $brand,
             'https://picsum.photos/seed/nova10/700/933',
             'https://picsum.photos/seed/nova10b/700/933|https://picsum.photos/seed/nova10c/700/933',
             285000, null, null,
             'Áo thun tay dài chất cotton 100%, form regular dễ phối. Chất vải dày dặn không xuyên thấu, mặc được 4 mùa.',
             $this->featuresText(['Cotton 100% mềm mại, thấm hút mồ hôi tốt', 'Tay dài regular, không quá ôm', 'Chất vải dày dặn, không xuyên thấu', 'Giặt máy được, hạn chế sấy nhiệt cao']),
             $this->specsJson('Cotton 100%', 'Regular fit', 'Việt Nam', 'S / M / L / XL / XXL', 'Xám nhạt / Đen / Xanh lá', 'Dài áo 71cm · Dài tay 60cm'),
             'Cotton', 'Việt Nam', "$colGray|$colBlack|$colGreen", 'S|M|L|XL|XXL', 4.5, 12, 96, 48, 1, 0, 0, 10],

            [2, 'Quần Jeans Slim Fit', 'quan-jeans-slim-fit', $brand,
             'https://picsum.photos/seed/nova11/700/933',
             'https://picsum.photos/seed/nova11b/700/933|https://picsum.photos/seed/nova11c/700/933',
             620000, null, null,
             'Quần jeans slim fit denim co giãn nhẹ, ôm vừa phải tôn dáng. Đường may chắc chắn, bền màu sau nhiều lần giặt.',
             $this->featuresText(['Denim co giãn 2 chiều, thoải mái vận động', 'Form slim fit ôm vừa phải, không quá bó', 'Đường may chần chỉ đôi chắc chắn', 'Giặt lộn trái để giữ màu bền lâu']),
             $this->specsJson('Denim Cotton pha Spandex', 'Slim fit', 'Việt Nam', '29 / 30 / 31 / 32 / 33 / 34', 'Xanh đen', 'Dài quần 100cm · Vòng eo theo size'),
             'Denim', 'Việt Nam', $colBlue, '29|30|31|32|33|34', 4.8, 34, 220, 50, 1, 1, 0, 11],

            [2, 'Quần Cargo Wide Leg Unisex', 'quan-cargo-wide-leg-unisex', $brand,
             'https://picsum.photos/seed/nova12/700/933',
             'https://picsum.photos/seed/nova12b/700/933|https://picsum.photos/seed/nova12c/700/933',
             560000, null, 'Mới',
             'Quần cargo ống rộng phong cách unisex, nhiều túi hộp tiện dụng. Chất liệu kaki dày dặn, form đứng phong cách đường phố.',
             $this->featuresText(['4 túi hộp lớn tiện dụng đựng đồ', 'Ống rộng phong cách streetwear', 'Chất kaki dày dặn, form đứng', 'Giặt máy bình thường, ủi nhẹ nếu cần']),
             $this->specsJson('Kaki Cotton', 'Wide leg — ống rộng', 'Việt Nam', 'S / M / L / XL / XXL', 'Đen / Xám', 'Dài quần 102cm · Vòng eo theo size'),
             'Kaki Cotton', 'Việt Nam', "$colBlack|$colGray", 'S|M|L|XL|XXL', 4.6, 8, 44, 40, 1, 0, 1, 12],

            [2, 'Áo Khoác Bomber Unisex', 'ao-khoac-bomber-unisex', $brand,
             'https://picsum.photos/seed/nova13/700/933',
             'https://picsum.photos/seed/nova13b/700/933|https://picsum.photos/seed/nova13c/700/933',
             850000, null, null,
             'Áo khoác bomber unisex phong cách thể thao, chun gấu và cổ tay giữ nhiệt tốt. Lớp lót ấm áp phù hợp mùa lạnh.',
             $this->featuresText(['Chun gấu áo và cổ tay giữ nhiệt hiệu quả', 'Lớp lót ấm áp bên trong', 'Khóa kéo YKK bền bỉ', 'Bảo quản nơi khô ráo, tránh ẩm mốc']),
             $this->specsJson('Polyester phối lót nỉ', 'Regular — Bomber', 'Việt Nam', 'S / M / L / XL / XXL', 'Đen / Xanh dương', 'Dài áo 66cm · Rộng ngực 58cm'),
             'Polyester', 'Việt Nam', "$colBlack|$colBlue", 'S|M|L|XL|XXL', 4.7, 19, 72, 30, 1, 1, 0, 13],

            [2, 'Áo Sơ Mi Oxford Nam', 'ao-so-mi-oxford-nam', $brand,
             'https://picsum.photos/seed/nova14/700/933',
             'https://picsum.photos/seed/nova14b/700/933|https://picsum.photos/seed/nova14c/700/933',
             395000, null, null,
             'Áo sơ mi Oxford nam form regular, chất vải dày dặn có độ rủ đẹp. Phù hợp đi làm hoặc mặc casual cuối tuần.',
             $this->featuresText(['Vải Oxford dệt chéo, độ bền cao', 'Form regular vừa vặn, không gò bó', 'Cổ áo cứng cáp, giữ form khi ủi', 'Giặt máy được, nên ủi để đẹp form']),
             $this->specsJson('Cotton Oxford', 'Regular fit', 'Việt Nam', 'S / M / L / XL / XXL', 'Trắng / Xanh dương nhạt', 'Dài áo 74cm · Rộng ngực 56cm'),
             'Cotton Oxford', 'Việt Nam', "$colWhite|$colBlue", 'S|M|L|XL|XXL', 4.4, 6, 38, 42, 1, 0, 0, 14],

            [3, 'Bộ Đồ Set Bé Trai Cotton', 'bo-do-set-be-trai-cotton', $brand,
             'https://picsum.photos/seed/nova15/700/933',
             'https://picsum.photos/seed/nova15b/700/933',
             220000, null, null,
             'Bộ đồ set áo + quần cho bé trai, chất cotton mềm mại an toàn cho da nhạy cảm. Họa tiết năng động, dễ vận động vui chơi.',
             $this->featuresText(['Cotton 100%, an toàn cho da bé', 'Form thoải mái, dễ vận động', 'Họa tiết bền màu qua nhiều lần giặt', 'Giặt máy nhẹ, không dùng nước tẩy']),
             $this->specsJson('Cotton 100%', 'Regular — bộ set', 'Việt Nam', '2–3 tuổi / 4–5 tuổi / 6–7 tuổi / 8–9 tuổi', 'Xanh dương / Xám', 'Theo bảng size trẻ em'),
             'Cotton', 'Việt Nam', "$colBlue|$colGray", '2-3T|4-5T|6-7T|8-9T', 4.6, 5, 30, 40, 1, 0, 0, 15],

            [3, 'Váy Liền Bé Gái Hoa Nhí', 'vay-lien-be-gai-hoa-nhi', $brand,
             'https://picsum.photos/seed/nova16/700/933',
             'https://picsum.photos/seed/nova16b/700/933',
             245000, null, 'Mới',
             'Váy liền bé gái họa tiết hoa nhí dễ thương, chất liệu cotton thoáng mát. Thiết kế xòe nhẹ, phù hợp đi chơi hoặc dự tiệc.',
             $this->featuresText(['Cotton thoáng mát, an toàn cho da bé', 'Thiết kế xòe nhẹ nhàng, dễ thương', 'Khóa kéo sau lưng tiện thay đồ', 'Giặt tay nhẹ để giữ form váy']),
             $this->specsJson('Cotton 100%', 'Xòe nhẹ', 'Việt Nam', '2–3 tuổi / 4–5 tuổi / 6–7 tuổi / 8–9 tuổi', 'Hoa nhí nền trắng', 'Theo bảng size trẻ em'),
             'Cotton', 'Việt Nam', $colWhite, '2-3T|4-5T|6-7T|8-9T', 4.7, 8, 46, 35, 1, 0, 1, 16],

            [3, 'Áo Khoác Gió Trẻ Em', 'ao-khoac-gio-tre-em', $brand,
             'https://picsum.photos/seed/nova17/700/933',
             'https://picsum.photos/seed/nova17b/700/933',
             275000, 340000, '-20%',
             'Áo khoác gió trẻ em nhẹ, chống nước nhẹ, có mũ trùm tiện lợi. Phù hợp cho các hoạt động ngoài trời của bé.',
             $this->featuresText(['Chất liệu chống nước nhẹ, cản gió tốt', 'Có mũ trùm tháo rời tiện lợi', 'Form rộng rãi, dễ mặc thêm áo bên trong', 'Lau nhẹ hoặc giặt máy chế độ nhẹ']),
             $this->specsJson('Polyester chống nước', 'Rộng rãi — có mũ', 'Việt Nam', '2–3 tuổi / 4–5 tuổi / 6–7 tuổi / 8–9 tuổi', 'Vàng bơ / Xanh lá', 'Theo bảng size trẻ em'),
             'Polyester', 'Việt Nam', "$colYellow|$colGreen", '2-3T|4-5T|6-7T|8-9T', 4.5, 4, 22, 30, 1, 0, 0, 17],

            [4, 'Túi Mini Crossbody Da PU', 'tui-mini-crossbody-da-pu', $brand,
             'https://picsum.photos/seed/nova18/700/933',
             'https://picsum.photos/seed/nova18b/700/933|https://picsum.photos/seed/nova18c/700/933',
             450000, null, 'Yêu thích',
             'Túi mini crossbody da PU cao cấp, thiết kế nhỏ gọn tiện dụng. Dây đeo điều chỉnh được, phù hợp mọi outfit.',
             $this->featuresText(['Da PU cao cấp, chống nước nhẹ', 'Thiết kế nhỏ gọn, đủ đựng vật dụng cần thiết', 'Dây đeo điều chỉnh chiều dài linh hoạt', 'Lau nhẹ bằng khăn ẩm, tránh ánh nắng trực tiếp']),
             $this->specsJson('Da PU cao cấp', 'Mini crossbody', 'Việt Nam', 'One Size', 'Trắng / Đen / Tím', 'Rộng 18cm · Cao 12cm · Sâu 6cm'),
             'Da PU', 'Việt Nam', "$colWhite|$colBlack|$colPurple", $sizesOne, 4.8, 22, 130, 40, 1, 1, 0, 18],

            [4, 'Túi Tote Canvas Logo', 'tui-tote-canvas-logo', $brand,
             'https://picsum.photos/seed/nova19/700/933',
             'https://picsum.photos/seed/nova19b/700/933',
             295000, null, null,
             'Túi tote canvas in logo Nova Store, chất liệu chắc chắn bền bỉ. Rộng rãi, phù hợp đi học, đi làm hoặc đi chợ.',
             $this->featuresText(['Chất liệu canvas dày dặn, chịu lực tốt', 'Quai đeo vai chắc chắn', 'Rộng rãi, đủ đựng laptop 14 inch', 'Giặt máy nhẹ, phơi khô tự nhiên']),
             $this->specsJson('Canvas cotton', 'Tote — rộng rãi', 'Việt Nam', 'One Size', 'Trắng / Kem', 'Rộng 38cm · Cao 40cm'),
             'Canvas', 'Việt Nam', "$colWhite|$colCream", $sizesOne, 4.5, 10, 88, 55, 1, 0, 0, 19],

            [4, 'Thắt Lưng Da Bò Thật', 'that-lung-da-bo-that', $brand,
             'https://picsum.photos/seed/nova20/700/933',
             'https://picsum.photos/seed/nova20b/700/933',
             310000, null, null,
             'Thắt lưng da bò thật nguyên tấm, khóa hợp kim chống gỉ. Càng dùng càng lên màu đẹp theo thời gian.',
             $this->featuresText(['Da bò thật nguyên tấm, bền bỉ theo năm tháng', 'Khóa hợp kim mạ chống gỉ', 'Có thể cắt chỉnh độ dài phù hợp', 'Bảo quản nơi khô ráo, tránh ẩm']),
             $this->specsJson('Da bò thật', 'Chuẩn — điều chỉnh được', 'Việt Nam', 'Dài 110cm / 120cm / 130cm', 'Đen / Nâu', 'Rộng bản 3.5cm'),
             'Da bò thật', 'Việt Nam', $colBlack, '110cm|120cm|130cm', 4.6, 7, 48, 38, 1, 0, 0, 20],

            [4, 'Mũ Bucket Unisex', 'mu-bucket-unisex', $brand,
             'https://picsum.photos/seed/nova21/700/933',
             'https://picsum.photos/seed/nova21b/700/933',
             185000, null, 'Mới',
             'Mũ bucket unisex phong cách streetwear, chất liệu kaki bền form. Phụ kiện không thể thiếu cho outfit mùa hè.',
             $this->featuresText(['Chất kaki dày dặn, giữ form vành mũ', 'Lỗ thoát khí giúp thoáng mát', 'Phong cách unisex dễ phối đồ', 'Giặt tay nhẹ, không vò mạnh']),
             $this->specsJson('Kaki Cotton', 'Bucket — vành rộng', 'Việt Nam', 'One Size (điều chỉnh được)', 'Đen / Kem', 'Chu vi đầu 56–60cm'),
             'Kaki Cotton', 'Việt Nam', "$colBlack|$colCream", $sizesOne, 4.4, 5, 34, 45, 1, 0, 1, 21],

            [5, 'Giày Sneaker Basic Unisex', 'giay-sneaker-basic-unisex', $brand,
             'https://picsum.photos/seed/nova22/700/933',
             'https://picsum.photos/seed/nova22b/700/933|https://picsum.photos/seed/nova22c/700/933',
             680000, null, 'Hot',
             'Giày sneaker basic unisex đế êm, phù hợp mọi outfit hàng ngày. Chất liệu da PU kết hợp vải lưới thoáng khí.',
             $this->featuresText(['Đế cao su êm ái, giảm chấn tốt', 'Vải lưới thoáng khí kết hợp da PU', 'Phong cách basic, dễ phối mọi outfit', 'Lau nhẹ bằng khăn ẩm, tránh ngâm nước']),
             $this->specsJson('Da PU + Vải lưới', 'Basic — đế êm', 'Việt Nam', '36 / 37 / 38 / 39 / 40 / 41 / 42', 'Trắng / Đen', 'Trọng lượng ~280g/chiếc'),
             'Da PU + Vải lưới', 'Việt Nam', "$colWhite|$colBlack", '36|37|38|39|40|41|42', 4.8, 41, 260, 60, 1, 1, 0, 22],

            [5, 'Sandal Quai Ngang Nữ', 'sandal-quai-ngang-nu', $brand,
             'https://picsum.photos/seed/nova23/700/933',
             'https://picsum.photos/seed/nova23b/700/933',
             320000, 400000, '-20%',
             'Sandal quai ngang nữ tối giản, đế bệt êm chân. Phù hợp mặc cùng váy hoặc quần dài trong những ngày hè.',
             $this->featuresText(['Đế bệt êm chân, phù hợp đi cả ngày', 'Quai ngang tối giản, dễ phối đồ', 'Chất liệu da tổng hợp mềm mại', 'Lau nhẹ, tránh ngâm nước lâu']),
             $this->specsJson('Da tổng hợp', 'Đế bệt', 'Việt Nam', '35 / 36 / 37 / 38 / 39', 'Đen / Kem', 'Chiều cao đế 1.5cm'),
             'Da tổng hợp', 'Việt Nam', "$colBlack|$colCream", '35|36|37|38|39', 4.5, 13, 74, 40, 1, 0, 0, 23],

            [5, 'Boot Cổ Thấp Nam', 'boot-co-thap-nam', $brand,
             'https://picsum.photos/seed/nova24/700/933',
             'https://picsum.photos/seed/nova24b/700/933|https://picsum.photos/seed/nova24c/700/933',
             890000, null, 'Mới',
             'Boot cổ thấp nam chất liệu da lộn cao cấp, thiết kế chắc chắn nam tính. Phù hợp mặc cùng jeans hoặc quần kaki.',
             $this->featuresText(['Da lộn cao cấp, form dáng chắc chắn', 'Đế cao su chống trơn trượt', 'Cổ thấp thoải mái khi di chuyển', 'Dùng bàn chải chuyên dụng để vệ sinh da lộn']),
             $this->specsJson('Da lộn', 'Cổ thấp — chắc chắn', 'Việt Nam', '39 / 40 / 41 / 42 / 43', 'Nâu / Đen', 'Chiều cao cổ giày 10cm'),
             'Da lộn', 'Việt Nam', $colBlack, '39|40|41|42|43', 4.7, 9, 42, 25, 1, 0, 1, 24],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO products
                (category_id, name, slug, brand, image, gallery, price, price_sale, badge, description, features, specs, material, origin, colors, sizes, rating, review_count, sold_count, stock_qty, in_stock, is_featured, is_new, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($products as $p) { $stmt->execute($p); }
    }

    private function seedProductReviews(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM product_reviews")->fetchColumn();
        if ($count > 0) return;
        // product_id được suy ra theo sort_order lúc seed (1..24) — an toàn vì seedProducts() chạy trước
        // và bảng products trống trước khi seed lần đầu (AUTOINCREMENT bắt đầu từ 1).
        $reviews = [
            [1, 'Nguyễn Thị An', 5, 'Size M — Màu Trắng', '2026-06-15', 'Chất vải mềm mịn, mặc rất mát. Form áo đúng như hình, giao hàng nhanh. Chắc chắn sẽ ủng hộ shop tiếp!', 1],
            [1, 'Trần Bảo Ngọc', 5, 'Size S — Màu Đen', '2026-06-02', 'Tay phồng dễ thương, mặc lên rất điệu. Đóng gói cẩn thận, đúng như ảnh trên web.', 2],
            [1, 'Lê Minh Châu', 4, 'Size L — Màu Xanh dương', '2026-05-28', 'Áo đẹp, chỉ hơi rộng so với size thường mặc — nên chọn nhỏ hơn 1 size nếu muốn ôm hơn.', 3],
            [3, 'Phạm Thu Hà', 5, 'Size M — Ombre xanh dương', '2026-06-10', 'Màu ombre siêu đẹp ngoài đời, mỗi chiếc một khác nên cảm giác rất riêng. Rất hài lòng!', 1],
            [3, 'Đỗ Quỳnh Anh', 5, 'Size S — Ombre hồng', '2026-05-20', 'Chất vải co giãn thoải mái, mặc đi làm cả ngày không bí. Sẽ mua thêm màu khác.', 2],
            [9, 'Nguyễn Hoàng Nam', 5, 'Size L — Màu Trắng', '2026-06-18', 'Áo polo chất pique dày dặn, mặc mát và không nhăn. Form vừa vặn, đúng chuẩn regular fit.', 1],
            [9, 'Vũ Đức Thắng', 4, 'Size M — Màu Đen', '2026-06-05', 'Áo đẹp, giá hợp lý. Giao hàng hơi chậm 1 ngày so với dự kiến nhưng chất lượng ổn.', 2],
            [11, 'Trần Văn Hùng', 5, 'Size 31 — Xanh đen', '2026-06-12', 'Quần jean co giãn thoải mái, mặc đi làm cả ngày không mỏi. Đường may chắc chắn, đáng tiền.', 1],
            [11, 'Lý Gia Bảo', 5, 'Size 32 — Xanh đen', '2026-05-30', 'Form slim ôm vừa phải, không quá bó. Mình cao 1m75 mặc dài vừa đủ, rất ưng.', 2],
            [18, 'Hoàng Mai Linh', 5, 'One Size — Màu Đen', '2026-06-08', 'Túi nhỏ xinh, da PU nhìn sang như da thật. Dây đeo chắc chắn, đựng vừa điện thoại + ví.', 1],
            [22, 'Ngô Tuấn Kiệt', 5, 'Size 41 — Màu Trắng', '2026-06-20', 'Giày êm chân, đi cả ngày không đau. Thiết kế basic dễ phối với mọi loại quần áo.', 1],
            [22, 'Bùi Thanh Tùng', 4, 'Size 40 — Màu Đen', '2026-06-01', 'Giày đẹp, đế hơi cứng lúc mới mang nhưng đi vài ngày là mềm ra, ổn áp.', 2],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO product_reviews (product_id, author_name, rating, variant_note, review_date, content, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($reviews as $r) { $stmt->execute($r); }
    }

    private function seedTestimonials(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
        if ($count > 0) return;
        $testimonials = [
            ['Nguyễn Thị A',  'N', 'Khách hàng thường xuyên', 'Mình đã mua ở Nova Store hơn 10 lần rồi. Chất lượng luôn ổn định, đóng gói cẩn thận và giao hàng đúng hẹn. Rất tin tưởng shop!', 5, 'Mua áo oversize', 1, 1],
            ['Trần Văn B',    'T', 'Khách hàng mới', 'Lần đầu mua ở đây, ấn tượng với dịch vụ tư vấn nhiệt tình. Quần jeans vừa vặn, chất vải dày dặn xứng đáng với giá tiền.', 5, 'Mua quần jeans', 1, 2],
            ['Lê Thị C',      'L', 'Khách hàng VIP', 'Sản phẩm đúng như hình, form đẹp và chất liệu cao cấp. Mình đã giới thiệu cho rất nhiều bạn bè cùng mua.', 5, 'Mua váy floral', 1, 3],
            ['Phạm Minh D',   'P', 'Khách hàng thường xuyên', 'Áo khoác bomber chất lượng tốt, giữ ấm hiệu quả mà vẫn thời trang. Sẽ tiếp tục ủng hộ những bộ sưu tập tiếp theo.', 5, 'Mua áo khoác bomber', 1, 4],
            ['Hoàng Thị E',   'H', 'Blogger thời trang', 'Là người review nhiều shop thời trang, mình đánh giá cao chất lượng vải và độ hoàn thiện sản phẩm của Nova Store. Đáng đồng tiền bát gạo.', 5, 'Mua túi tote canvas', 1, 5],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO testimonials (author_name, author_avatar, author_role, content, stars, product_purchased, is_active, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($testimonials as $t) { $stmt->execute($t); }
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
