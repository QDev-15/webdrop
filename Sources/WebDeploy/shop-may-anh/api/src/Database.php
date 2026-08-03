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
        // ALTER TABLE cho DB đã tạo trước khi thêm cột/bảng mới
        try { $this->pdo->exec("ALTER TABLE orders ADD COLUMN coupon_code TEXT NOT NULL DEFAULT ''"); } catch (\Exception $e) {}
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
            ['site_name',        'PhotoPro',                                                     'general'],
            ['site_slogan',      'Máy Ảnh & Thiết Bị Nhiếp Ảnh Chính Hãng',                       'general'],
            ['site_email',       'lienhe@photopro.vn',                                            'general'],
            ['site_phone',       '0909 123 456',                                                  'general'],
            ['site_address',     '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',       'general'],
            ['working_hours',    '8:30 – 21:00 (Cả tuần)',                                        'general'],
            ['site_description', 'Cửa hàng máy ảnh & thiết bị nhiếp ảnh chính hãng — thân máy, ống kính, tripod, phụ kiện — bảo hành chính hãng toàn quốc.', 'general'],
            ['site_logo',        '', 'general'],
            ['site_favicon',     '', 'general'],
            ['zalo_number',      '0909123456', 'general'],
            ['warranty_months',  '24', 'general'],

            // ── SEO ──────────────────────────────────────────────────────────────
            ['meta_title',       'PhotoPro — Máy Ảnh & Thiết Bị Nhiếp Ảnh Chính Hãng', 'seo'],
            ['meta_description', 'Cửa hàng máy ảnh & thiết bị nhiếp ảnh chính hãng — thân máy mirrorless/DSLR, ống kính, tripod, phụ kiện — bảo hành chính hãng, tư vấn kỹ thuật chuyên sâu.', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop&q=80', 'seo'],
            ['ga_id',    '', 'seo'],
            ['gtm_id',   '', 'seo'],

            // ── Social ───────────────────────────────────────────────────────────
            ['facebook',  'https://www.facebook.com/photopro.vn',  'social'],
            ['instagram', 'https://www.instagram.com/photopro.vn', 'social'],
            ['zalo',      'https://zalo.me/0909123456',            'social'],

            // ── Hero (H10 Geometric Split — 1 hero tĩnh, không phải slider crossfade) ──
            ['hero_tag',         'Đại lý ủy quyền chính hãng', 'hero'],
            ['hero_title_pre',   'Bắt trọn từng', 'hero'],
            ['hero_title_em',    'khoảnh khắc sắc nét', 'hero'],
            ['hero_desc',        'Thân máy mirrorless & DSLR, ống kính, tripod và phụ kiện chính hãng — tư vấn kỹ thuật chuyên sâu, bảo hành toàn quốc, hỗ trợ trả góp 0%.', 'hero'],
            ['hero_note',        'Bảo hành chính hãng 24 tháng · Đổi trả trong 7 ngày', 'hero'],
            ['hero_float_num',   '30+ thương hiệu', 'hero'],
            ['hero_float_label', 'phân phối chính hãng', 'hero'],

            // ── Feature icon row (Dịch vụ hậu mãi, 4 mục) ────────────────────────────
            ['value1_icon',  'chat-square-dots', 'values'],
            ['value1_title', 'Tư vấn kỹ thuật', 'values'],
            ['value1_desc',  'Kỹ thuật viên giàu kinh nghiệm tư vấn theo nhu cầu chụp thực tế, không chạy theo doanh số.', 'values'],
            ['value2_icon',  'patch-check', 'values'],
            ['value2_title', 'Bảo hành chính hãng', 'values'],
            ['value2_desc',  'Bảo hành 24 tháng tại trung tâm ủy quyền, hỗ trợ đổi máy nếu lỗi do nhà sản xuất.', 'values'],
            ['value3_icon',  'wrench-adjustable', 'values'],
            ['value3_title', 'Sửa chữa & vệ sinh cảm biến', 'values'],
            ['value3_desc',  'Dịch vụ vệ sinh cảm biến, hiệu chỉnh lấy nét, thay thế linh kiện chính hãng tại chỗ.', 'values'],
            ['value4_icon',  'credit-card-2-front', 'values'],
            ['value4_title', 'Trả góp 0% lãi suất', 'values'],
            ['value4_desc',  'Hỗ trợ trả góp qua thẻ tín dụng và công ty tài chính, duyệt hồ sơ nhanh trong ngày.', 'values'],

            // ── Story (Alternating-strips, 2 khối) ───────────────────────────────────
            ['story1_badge',    'Đại lý ủy quyền', 'story'],
            ['story1_title_pre','Phân phối chính hãng từ', 'story'],
            ['story1_title_em', '30+ thương hiệu', 'story'],
            ['story1_text',     'Là đại lý ủy quyền của Sony, Canon, Fujifilm, Nikon và các hãng phụ kiện hàng đầu — mọi sản phẩm đều có tem chống hàng giả và phiếu bảo hành điện tử.', 'story'],
            ['story1_image',    'https://images.unsplash.com/photo-1550928431-ee0ec6db30d3?w=700&auto=format&fit=crop&q=80', 'story'],
            ['story1_li1',      'Nhập khẩu chính ngạch, đầy đủ hóa đơn VAT', 'story'],
            ['story1_li2',      'Kiểm định 100% máy trước khi lên kệ', 'story'],
            ['story1_li3',      'Đội ngũ kỹ thuật viên được hãng đào tạo', 'story'],
            ['story2_badge',    'Xưởng kỹ thuật riêng', 'story'],
            ['story2_title_pre','Sửa chữa & bảo trì', 'story'],
            ['story2_title_em', 'tại chỗ, minh bạch', 'story'],
            ['story2_text',     'Xưởng kỹ thuật trang bị máy hiệu chỉnh lấy nét chuyên dụng, xử lý từ vệ sinh cảm biến đến thay thế mainboard — báo giá rõ ràng trước khi sửa.', 'story'],
            ['story2_image',    'https://images.unsplash.com/photo-1552168324-d612d77725e3?w=700&auto=format&fit=crop&q=80', 'story'],
            ['story2_li1',      'Báo giá chi tiết trước khi tiến hành sửa', 'story'],
            ['story2_li2',      'Linh kiện thay thế chính hãng có tem bảo hành', 'story'],
            ['story2_li3',      'Nhận sửa cả máy không mua tại cửa hàng', 'story'],

            // ── Stats (Stat-bar, 4 mục) ───────────────────────────────────────────────
            ['stat1_num', '30',    'stats'], ['stat1_suffix', '+', 'stats'], ['stat1_label', 'Thương hiệu phân phối', 'stats'],
            ['stat2_num', '850',   'stats'], ['stat2_suffix', '+', 'stats'], ['stat2_label', 'Thiết bị đang bán', 'stats'],
            ['stat3_num', '12000', 'stats'], ['stat3_suffix', '+', 'stats'], ['stat3_label', 'Nhiếp ảnh gia tin dùng', 'stats'],
            ['stat4_num', '11',    'stats'], ['stat4_suffix', '',  'stats'], ['stat4_label', 'Năm kinh nghiệm', 'stats'],

            // ── Reviews (Horizontal-scroll, 4 mục) ────────────────────────────────────
            ['review1_name',    'Anh Huy', 'reviews'],
            ['review1_role',    'Nhiếp ảnh gia sự kiện, TP.HCM', 'reviews'],
            ['review1_content', 'Được tư vấn combo thân máy + ống kính đúng nhu cầu chụp sự kiện, không bị ép mua thêm phụ kiện không cần thiết. Rất chuyên nghiệp.', 'reviews'],
            ['review1_rating',  '5', 'reviews'],
            ['review2_name',    'Chị Linh', 'reviews'],
            ['review2_role',    'Content creator, Hà Nội', 'reviews'],
            ['review2_content', 'Máy được kiểm định kỹ trước khi giao, có phiếu test cảm biến đầy đủ. Mua online mà vẫn yên tâm như mua trực tiếp.', 'reviews'],
            ['review2_rating',  '5', 'reviews'],
            ['review3_name',    'Anh Minh', 'reviews'],
            ['review3_role',    'Nhiếp ảnh phong cảnh, Đà Lạt', 'reviews'],
            ['review3_content', 'Dịch vụ vệ sinh cảm biến nhanh gọn, kỹ thuật viên giải thích rõ tình trạng máy. Sẽ quay lại khi cần nâng cấp thiết bị.', 'reviews'],
            ['review3_rating',  '5', 'reviews'],
            ['review4_name',    'Chị Thu', 'reviews'],
            ['review4_role',    'Studio ảnh cưới, Đà Nẵng', 'reviews'],
            ['review4_content', 'Trả góp 0% duyệt nhanh, giao hàng đúng hẹn. Thân máy còn nguyên tem chống giả, bảo hành tra cứu online rõ ràng.', 'reviews'],
            ['review4_rating',  '5', 'reviews'],

            // ── Newsletter ───────────────────────────────────────────────────────────
            ['newsletter_title', 'Nhận tin khuyến mãi & hàng mới về', 'newsletter'],
            ['newsletter_desc',  'Đăng ký để nhận mã giảm 500.000đ cho đơn hàng thân máy đầu tiên.', 'newsletter'],

            // ── Footer ───────────────────────────────────────────────────────────────
            ['footer_desc', 'Cửa hàng máy ảnh & thiết bị nhiếp ảnh chính hãng — thân máy, ống kính, tripod, phụ kiện — bảo hành chính hãng toàn quốc.', 'footer'],

            // ── Brands (trang Thương hiệu, 4 mục) ─────────────────────────────────────
            ['brand1_name',  'Sony',     'brands'],
            ['brand1_desc',  'Dòng Alpha mirrorless full-frame', 'brands'],
            ['brand1_image', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80', 'brands'],
            ['brand2_name',  'Canon',    'brands'],
            ['brand2_desc',  'Dòng EOS DSLR & mirrorless', 'brands'],
            ['brand2_image', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=80', 'brands'],
            ['brand3_name',  'Nikon',    'brands'],
            ['brand3_desc',  'Dòng Z-series mirrorless', 'brands'],
            ['brand3_image', 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=500&auto=format&fit=crop&q=80', 'brands'],
            ['brand4_name',  'Fujifilm', 'brands'],
            ['brand4_desc',  'Dòng X-series APS-C', 'brands'],
            ['brand4_image', 'https://images.unsplash.com/photo-1606986628253-05620d1f9fa1?w=500&auto=format&fit=crop&q=80', 'brands'],

            // ── Shop policy ──────────────────────────────────────────────────────────
            ['return_days', '7', 'shop'],

            // ── Payment (tab "💳 Thanh toán") ────────────────────────────────────────
            ['payment_cod_enabled',      '1', 'payment'],
            ['payment_sepay_enabled',    '0', 'payment'],
            ['sepay_bank_code',          '',  'payment'],
            ['sepay_account_number',     '',  'payment'],
            ['sepay_account_name',       '',  'payment'],
            ['sepay_webhook_secret',     '',  'payment'],
            ['shipping_fee',             '30000',   'payment'],
            ['free_shipping_threshold',  '10000000', 'payment'],

            // ── Contact ──────────────────────────────────────────────────────────────
            ['contact_intro',          'Có câu hỏi về máy ảnh, ống kính hoặc muốn đặt lịch bảo trì, vệ sinh cảm biến? Gửi thông tin cho chúng tôi, kỹ thuật viên sẽ phản hồi trong vòng 2 giờ làm việc.', 'contact'],
            ['contact_workshop_text',  'Nhận sửa chữa & vệ sinh cảm biến trong ngày, có lịch hẹn trước', 'contact'],
            ['map_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4952!2d106.700!3d10.776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzMzLjYiTiAxMDbCsDQyJzAwLjAiRQ!5e0!3m2!1svi!2s!4v1700000000000', 'contact'],

            // ── SMTP ─────────────────────────────────────────────────────────────────
            ['smtp_host',      '', 'smtp'],
            ['smtp_port',      '587', 'smtp'],
            ['smtp_user',      '', 'smtp'],
            ['smtp_pass',      '', 'smtp'],
            ['smtp_from',      '', 'smtp'],
            ['smtp_from_name', 'PhotoPro', 'smtp'],

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
        // Hero H10 Geometric Split là 1 ảnh tĩnh (không phải slider crossfade) — chỉ seed 1 slide,
        // nhưng vẫn dùng chung menu "Hero Slides" của scaffold để chủ shop tự đổi ảnh hero qua admin.
        $slides = [
            ['Ảnh hero trang chủ', '', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&auto=format&fit=crop&q=80', '', '', 1, 'published'],
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
            ['Máy Ảnh Mirrorless',   'may-anh-mirrorless',   'https://images.unsplash.com/photo-1626006113664-4a217873939d?w=600&auto=format&fit=crop&q=80', 1],
            ['Máy Ảnh DSLR',         'may-anh-dslr',         'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&auto=format&fit=crop&q=80', 2],
            ['Ống Kính',             'ong-kinh',             'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=600&auto=format&fit=crop&q=80', 3],
            ['Tripod & Phụ Kiện',    'tripod-phu-kien',      'https://images.unsplash.com/photo-1634680582783-0b06ca18a449?w=600&auto=format&fit=crop&q=80', 4],
            ['Flash & Đèn Chụp',     'flash-den-chup',       'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=600&auto=format&fit=crop&q=80', 5],
            ['Thẻ Nhớ & Balo',       'the-nho-balo',         'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=600&auto=format&fit=crop&q=80', 6],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO product_categories (name, slug, image, sort_order) VALUES (?, ?, ?, ?)"
        );
        foreach ($cats as $c) { $stmt->execute($c); }
    }

    private function seedProducts(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
        if ($count > 0) return;

        // category_id: 1 Máy Ảnh Mirrorless, 2 Máy Ảnh DSLR, 3 Ống Kính, 4 Tripod & Phụ Kiện, 5 Flash & Đèn Chụp, 6 Thẻ Nhớ & Balo
        // [category_id, name, slug, image, price, price_sale, badge, description, colors, brand, rating, in_stock, is_featured, is_new, sort_order,
        //  gallery, bundle_options, specs, review_count, sold_count]
        $products = [
            [1, 'Sony Alpha A7 IV (Thân máy)', 'sony-alpha-a7-iv-than-may',
             'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
             56990000, 52990000, 'Bán chạy',
             'Sony Alpha A7 IV là thân máy mirrorless full-frame thế hệ thứ 4 trong dòng Alpha, kế thừa cảm biến 33MP mới cùng hệ thống lấy nét 759 điểm phủ 94% khung hình. Máy hỗ trợ quay video 4K 60fps 10-bit 4:2:2, khe cắm thẻ kép CFexpress Type A / SD UHS-II, màn hình lật xoay cảm ứng — phù hợp cho nhiếp ảnh gia chuyên nghiệp lẫn nhà làm phim độc lập.',
             'Đen:#1c1c1c|Bạc:#c7c9cb', 'Sony', 4.9, 1, 1, 0, 1,
             'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80|https://images.unsplash.com/photo-1552168324-d612d77725e3?w=800&auto=format&fit=crop&q=80|https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?w=800&auto=format&fit=crop&q=80',
             'Chỉ thân máy|Kèm ống kính kit 28-70mm|Full-box phụ kiện (thẻ nhớ + túi + pin)',
             'Cảm biến:Exmor R CMOS full-frame 33MP|Chip xử lý:BIONZ XR|Dải ISO:100 – 51.200 (mở rộng 50 – 204.800)|Quay video:4K 60fps 10-bit 4:2:2, Full HD 120fps|Lấy nét:759 điểm lấy nét theo pha, AI Eye-AF người & động vật|Khe thẻ nhớ:CFexpress Type A / SD UHS-II (kép)|Trọng lượng:658g (kèm pin và thẻ nhớ)|Bảo hành:24 tháng chính hãng',
             186, 940],

            [1, 'Canon EOS R6 Mark II', 'canon-eos-r6-mark-ii',
             'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
             48500000, null, 'Mới',
             'Canon EOS R6 Mark II là thân máy mirrorless full-frame hiệu năng cao, cảm biến 24.2MP, tốc độ chụp liên tiếp lên đến 40fps điện tử, chống rung 5 trục trên thân máy — lựa chọn lý tưởng cho nhiếp ảnh sự kiện và thể thao.',
             'Đen:#1c1c1c', 'Canon', 4.8, 1, 1, 1, 2,
             '', '', '', 0, 0],

            [1, 'Fujifilm X-T5 (Thân máy)', 'fujifilm-x-t5-than-may',
             'https://images.unsplash.com/photo-1519183071298-a2962be96f83?w=800&auto=format&fit=crop&q=80',
             36900000, null, '',
             'Fujifilm X-T5 sở hữu cảm biến APS-C 40MP X-Trans CMOS 5 HR, thân máy thiết kế retro cổ điển với các núm chỉnh tốc độ/khẩu độ cơ học, chống rung 5 trục trong thân máy — mang lại chất ảnh đặc trưng cho người yêu phong cách chụp truyền thống.',
             'Đen:#1c1c1c|Bạc:#c7c9cb', 'Fujifilm', 4.9, 1, 1, 0, 3,
             '', '', '', 0, 0],

            [1, 'Nikon Z6 III (Thân máy)', 'nikon-z6-iii-than-may',
             'https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?w=800&auto=format&fit=crop&q=80',
             55900000, null, '',
             'Nikon Z6 III trang bị cảm biến full-frame stacked BSI CMOS 24.5MP tốc độ đọc nhanh, quay video 6K RAW nội bộ, EVF độ sáng 4000-nit — hiệu năng vượt trội cho cả nhiếp ảnh chuyên nghiệp lẫn làm phim.',
             'Đen:#1c1c1c', 'Nikon', 4.8, 1, 0, 0, 4,
             '', '', '', 0, 0],

            [3, 'Sony FE 24-70mm f/2.8 GM II', 'sony-fe-24-70mm-f28-gm-ii',
             'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800&auto=format&fit=crop&q=80',
             45990000, null, '',
             'Ống kính zoom tiêu chuẩn Sony FE 24-70mm f/2.8 GM II — thiết kế nhẹ hơn 20% so với thế hệ trước, lấy nét tự động êm và nhanh nhờ 4 motor XD Linear, độ nét vượt trội ở mọi khoảng tiêu cự — lựa chọn hàng đầu cho chụp sự kiện, chân dung và phong cảnh.',
             '', 'Sony', 5.0, 1, 1, 0, 5,
             '', '', '', 0, 0],

            [4, 'Manfrotto Befree Advanced', 'manfrotto-befree-advanced',
             'https://images.unsplash.com/photo-1607685836727-b2b3c58f9a16?w=800&auto=format&fit=crop&q=80',
             4890000, 4290000, '-12%',
             'Tripod du lịch Manfrotto Befree Advanced — chân nhôm gấp gọn, tải trọng tối đa 8kg, đầu ball-head xoay 360° kèm túi đựng chuyên dụng — bạn đồng hành lý tưởng cho các chuyến đi chụp ảnh phong cảnh.',
             '', '', 4.7, 1, 1, 0, 6,
             '', '', '', 0, 0],

            [5, 'Godox V1 (Đèn Flash Rời)', 'godox-v1-den-flash-roi',
             'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800&auto=format&fit=crop&q=80',
             5190000, null, '',
             'Đèn flash rời Godox V1 đầu tròn cho ánh sáng tự nhiên, hỗ trợ TTL/HSS, hệ thống truyền tín hiệu không dây 2.4GHz tích hợp — phù hợp chụp chân dung studio lẫn dã ngoại.',
             '', '', 4.6, 1, 0, 0, 7,
             '', '', '', 0, 0],

            [6, 'Lowepro ProTactic 350 AW II', 'lowepro-protactic-350-aw-ii',
             'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=800&auto=format&fit=crop&q=80',
             3190000, null, '',
             'Balo máy ảnh Lowepro ProTactic 350 AW II — ngăn đệm tùy chỉnh chứa được thân máy + 3-4 ống kính, áo mưa phủ AW tích hợp, nhiều điểm gắn phụ kiện MOLLE — bảo vệ thiết bị tối ưu khi di chuyển.',
             '', '', 4.8, 1, 1, 0, 8,
             '', '', '', 0, 0],

            [6, 'SanDisk Extreme Pro 128GB', 'sandisk-extreme-pro-128gb',
             'https://images.unsplash.com/photo-1610465299996-30f240ac2b1c?w=800&auto=format&fit=crop&q=80',
             890000, null, '',
             'Thẻ nhớ SanDisk Extreme Pro 128GB tốc độ đọc lên đến 200MB/s, chuẩn UHS-I U3 V30 — đáp ứng tốt nhu cầu quay 4K liên tục và chụp burst tốc độ cao.',
             '', '', 4.9, 1, 0, 0, 9,
             '', '', '', 0, 0],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO products
                (category_id, name, slug, image, price, price_sale, badge, description, colors, brand, rating, in_stock, is_featured, is_new, sort_order,
                 gallery, bundle_options, specs, review_count, sold_count)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($products as $p) { $stmt->execute($p); }
    }

    private function seedCoupons(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM coupons")->fetchColumn();
        if ($count > 0) return;
        $coupons = [
            // code, type, value, min_order, max_uses, is_active
            ['PHOTO10', 'percent', 10, 1000000, 100, 1],
            ['GIAM500K', 'fixed',  500000, 5000000, 50,  1],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO coupons (code, type, value, min_order, max_uses, is_active) VALUES (?, ?, ?, ?, ?, ?)"
        );
        foreach ($coupons as $c) { $stmt->execute($c); }
    }
}
