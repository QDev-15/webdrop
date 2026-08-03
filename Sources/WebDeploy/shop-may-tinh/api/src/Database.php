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
        // Thêm cột coupon_code vào bảng orders nếu chưa có (cho DB đã tồn tại trước khi bổ sung tính năng coupon)
        try { $this->pdo->exec("ALTER TABLE orders ADD COLUMN coupon_code TEXT NOT NULL DEFAULT ''"); } catch (\Exception $e) {}
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
            ['site_name',        'NovaTech',                                                  'general'],
            ['site_slogan',      'Laptop, PC Gaming & Linh Kiện Máy Tính Chính Hãng',           'general'],
            ['site_email',       'cskh@novatech.vn',                                           'general'],
            ['site_phone',       '0900 123 456',                                               'general'],
            ['site_address',     '72 Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP. Hồ Chí Minh', 'general'],
            ['working_hours',    '8:00 – 21:00 · Tất cả các ngày',                             'general'],
            ['site_description', 'Cửa hàng máy tính uy tín — laptop, PC gaming, linh kiện chính hãng, bảo hành tận tâm, trả góp 0% lãi suất.', 'general'],
            ['site_logo',        '', 'general'],
            ['site_favicon',     '', 'general'],
            ['zalo_number',      '0900123456', 'general'],
            ['warranty_months',  '24', 'general'],

            // ── SEO ──────────────────────────────────────────────────────────────
            ['meta_title',       'NovaTech — Laptop, PC Gaming & Linh Kiện Máy Tính Chính Hãng', 'seo'],
            ['meta_description', 'Cửa hàng máy tính uy tín — laptop, PC gaming, linh kiện chính hãng, bảo hành tận tâm, trả góp 0% lãi suất.', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&auto=format&fit=crop&q=80', 'seo'],
            ['ga_id',    '', 'seo'],
            ['gtm_id',   '', 'seo'],

            // ── Social ───────────────────────────────────────────────────────────
            ['facebook',  'https://www.facebook.com/novatech.vn',  'social'],
            ['instagram', 'https://www.instagram.com/novatech.vn', 'social'],
            ['youtube',   'https://www.youtube.com/@novatech.vn',  'social'],
            ['zalo',      'https://zalo.me/0900123456',            'social'],

            // ── Hero (H7 Full-Screen Slider — ảnh lấy từ Hero Slides, chữ lấy từ đây) ──
            ['hero_badge',        'Ưu đãi tháng 7 — Giảm đến 20%', 'hero'],
            ['hero_title_pre',    'Dàn máy', 'hero'],
            ['hero_title_strong', 'hiệu năng đỉnh cao', 'hero'],
            ['hero_title_post',   'cho công việc & giải trí', 'hero'],
            ['hero_desc',         'Laptop, PC gaming và linh kiện chính hãng — tư vấn cấu hình miễn phí, bảo hành tận tâm trên toàn quốc.', 'hero'],
            ['hero_trust1',       'Bảo hành chính hãng 24 tháng', 'hero'],
            ['hero_trust2',       'Trả góp 0% lãi suất', 'hero'],
            ['hero_trust3',       'Giao hàng toàn quốc', 'hero'],

            // ── Feature icon row (Cam kết với khách hàng, 4 mục) ────────────────────
            ['value1_icon',  'patch-check-fill', 'values'],
            ['value1_title', 'Bảo hành chính hãng 24 tháng', 'values'],
            ['value1_desc',  '1 đổi 1 trong 30 ngày đầu nếu lỗi từ nhà sản xuất, hỗ trợ tận nơi toàn quốc', 'values'],
            ['value2_icon',  'credit-card-2-front-fill', 'values'],
            ['value2_title', 'Trả góp 0% lãi suất', 'values'],
            ['value2_desc',  'Duyệt hồ sơ nhanh qua thẻ tín dụng hoặc công ty tài chính liên kết', 'values'],
            ['value3_icon',  'headset', 'values'],
            ['value3_title', 'Hỗ trợ kỹ thuật 24/7', 'values'],
            ['value3_desc',  'Đội ngũ kỹ thuật viên tư vấn cấu hình, khắc phục sự cố nhanh chóng', 'values'],
            ['value4_icon',  'truck', 'values'],
            ['value4_title', 'Giao hàng & lắp đặt tận nơi', 'values'],
            ['value4_desc',  'Miễn phí vận chuyển nội thành, lắp đặt và bàn giao tận nhà', 'values'],

            // ── Promo (Full-bleed) ──────────────────────────────────────────────────
            ['promo_label',   'Ưu đãi có giới hạn', 'promo'],
            ['promo_title',   'Giảm đến',           'promo'],
            ['promo_percent', '20%',                'promo'],
            ['promo_desc',    'Áp dụng cho toàn bộ cấu hình PC Gaming dựng sẵn, kèm tặng bàn phím + chuột gaming trị giá 990.000đ.', 'promo'],
            ['promo_image',   'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1600&auto=format&fit=crop&q=80', 'promo'],

            // ── Reviews (Horizontal-scroll) ──────────────────────────────────────────
            ['reviews_avg',      '4.8', 'reviews'],
            ['reviews_count',    '1850', 'reviews'],
            ['review1_name',     'Minh Quân', 'reviews'],
            ['review1_location', 'TP.HCM', 'reviews'],
            ['review1_content',  'Máy chạy mượt, nhân viên tư vấn cấu hình rất kỹ theo đúng nhu cầu công việc của mình. Đóng gói cẩn thận.', 'reviews'],
            ['review1_rating',   '5', 'reviews'],
            ['review2_name',     'Hoàng Phúc', 'reviews'],
            ['review2_location', 'Hà Nội', 'reviews'],
            ['review2_content',  'Đặt PC Gaming theo yêu cầu, shop build đúng linh kiện, chạy thử stress test trước khi giao. Rất chuyên nghiệp.', 'reviews'],
            ['review2_rating',   '5', 'reviews'],
            ['review3_name',     'Thanh Trúc', 'reviews'],
            ['review3_location', 'Đà Nẵng', 'reviews'],
            ['review3_content',  'Trả góp thủ tục nhanh, laptop nhận trong ngày. Bảo hành tận nhà khi máy gặp lỗi, phản hồi nhanh.', 'reviews'],
            ['review3_rating',   '4', 'reviews'],
            ['review4_name',     'Đức Anh', 'reviews'],
            ['review4_location', 'Cần Thơ', 'reviews'],
            ['review4_content',  'Giá tốt hơn nhiều so với các nơi khác mình tham khảo, linh kiện chính hãng đầy đủ tem bảo hành.', 'reviews'],
            ['review4_rating',   '5', 'reviews'],

            // ── Stats (Stat-bar) ─────────────────────────────────────────────────────
            ['stat1_num', '15000', 'stats'], ['stat1_suffix', '+', 'stats'], ['stat1_label', 'Khách hàng tin dùng', 'stats'],
            ['stat2_num', '320',   'stats'], ['stat2_suffix', '+', 'stats'], ['stat2_label', 'Sản phẩm đang bán', 'stats'],
            ['stat3_num', '8',     'stats'], ['stat3_suffix', ' năm', 'stats'], ['stat3_label', 'Kinh nghiệm ngành', 'stats'],
            ['stat4_num', '63',    'stats'], ['stat4_suffix', ' tỉnh', 'stats'], ['stat4_label', 'Bảo hành toàn quốc', 'stats'],

            // ── Newsletter ───────────────────────────────────────────────────────────
            ['newsletter_title', 'Đăng ký nhận tin công nghệ', 'newsletter'],
            ['newsletter_desc',  'Nhận thông báo sản phẩm mới, ưu đãi độc quyền và mẹo chọn cấu hình phù hợp.', 'newsletter'],

            // ── Footer ───────────────────────────────────────────────────────────────
            ['footer_desc', 'Cửa hàng máy tính uy tín — laptop, PC gaming, linh kiện chính hãng và dịch vụ hậu mãi tận tâm.', 'footer'],

            // ── Contact ──────────────────────────────────────────────────────────────
            ['contact_intro', 'Chúng tôi luôn chào đón bạn đến trực tiếp trải nghiệm sản phẩm và test cấu hình trước khi mua. Đội ngũ kỹ thuật viên sẽ tư vấn đúng nhu cầu sử dụng của bạn.', 'contact'],
            ['map_embed',     'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0962853684824!2d105.84372241493954!3d21.027763885995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2sHoan%20Kiem%20Lake!5e0!3m2!1sen!2s!4v1626123456789!5m2!1sen!2s', 'contact'],

            // ── Shop policy ──────────────────────────────────────────────────────────
            ['return_days', '30', 'shop'],

            // ── Payment (tab "💳 Thanh toán") ────────────────────────────────────────
            ['payment_cod_enabled',      '1', 'payment'],
            ['payment_sepay_enabled',    '0', 'payment'],
            ['sepay_bank_code',          '',  'payment'],
            ['sepay_account_number',     '',  'payment'],
            ['sepay_account_name',       '',  'payment'],
            ['sepay_webhook_secret',     '',  'payment'],
            ['shipping_fee',             '30000',   'payment'],
            ['free_shipping_threshold',  '5000000', 'payment'],

            // ── SMTP ─────────────────────────────────────────────────────────────────
            ['smtp_host',      '', 'smtp'],
            ['smtp_port',      '587', 'smtp'],
            ['smtp_user',      '', 'smtp'],
            ['smtp_pass',      '', 'smtp'],
            ['smtp_from',      '', 'smtp'],
            ['smtp_from_name', 'NovaTech', 'smtp'],

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
            ['Dàn PC gaming RGB hiệu năng cao', '', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1600&auto=format&fit=crop&q=80', 'Khám phá sản phẩm', '/san-pham', 1, 'published'],
            ['Laptop cao cấp cho công việc',    '', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1600&auto=format&fit=crop&q=80', 'Khám phá sản phẩm', '/san-pham', 2, 'published'],
            ['Góc setup gaming đèn RGB',        '', 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1600&auto=format&fit=crop&q=80', 'Khám phá sản phẩm', '/san-pham', 3, 'published'],
            ['Linh kiện card đồ họa hiệu năng cao', '', 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=1600&auto=format&fit=crop&q=80', 'Khám phá sản phẩm', '/san-pham', 4, 'published'],
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
            ['Laptop',                 'laptop',                 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&auto=format&fit=crop&q=80', 1],
            ['PC Desktop',              'pc-desktop',              'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=700&auto=format&fit=crop&q=80', 2],
            ['Linh kiện',               'linh-kien',               'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500&auto=format&fit=crop&q=80', 3],
            ['Gaming Gear',             'gaming-gear',             'https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=500&auto=format&fit=crop&q=80', 4],
            ['Màn hình & Phụ kiện',     'man-hinh-phu-kien',       'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=700&auto=format&fit=crop&q=80', 5],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO product_categories (name, slug, image, sort_order) VALUES (?, ?, ?, ?)"
        );
        foreach ($cats as $c) { $stmt->execute($c); }
    }

    private function seedProducts(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
        if ($count > 0) return;

        // category_id: 1 Laptop, 2 PC Desktop, 3 Linh kiện, 4 Gaming Gear, 5 Màn hình & Phụ kiện
        // [category_id, name, slug, image, gallery, price, price_sale, badge, description, colors, config_options, specs, rating, review_count, in_stock, is_featured, is_new, sort_order]
        $products = [
            [2, 'PC Gaming Core i7 RTX 4060', 'pc-gaming-core-i7-rtx-4060',
             'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
             'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80|https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&auto=format&fit=crop&q=80|https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80|https://images.unsplash.com/photo-1587614382346-4ec70e388b6d?w=800&auto=format&fit=crop&q=80',
             27990000, 24990000, 'Bán chạy',
             'Cấu hình PC Gaming mạnh mẽ với CPU Core i7 thế hệ mới, card đồ họa RTX 4060 8GB, tản nhiệt AIO 240mm — chiến mọi tựa game AAA ở độ phân giải cao và mượt mà.',
             'Đen:#0f1029|Trắng bạc:#e8e9f2|Indigo:#6d5ef8',
             '8GB / 256GB|16GB / 512GB|32GB / 1TB',
             'CPU:Intel Core i7-13700F|Card đồ họa:NVIDIA RTX 4060 8GB|RAM:16GB DDR5 5200MHz|Ổ cứng:512GB NVMe SSD Gen4|Nguồn:650W 80 Plus Bronze|Bảo hành:24 tháng chính hãng',
             4.8, 186, 1, 1, 0, 1],

            [1, 'Laptop Mỏng Nhẹ UltraSlim 14', 'laptop-mong-nhe-ultraslim-14',
             'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80', '',
             18490000, null, 'Mới',
             'Laptop mỏng nhẹ 14 inch dành cho công việc di động — thiết kế nhôm nguyên khối, màn hình 2.2K sắc nét, thời lượng pin cả ngày làm việc.',
             'Đen:#0f1029|Trắng bạc:#e8e9f2|Xám titan:#9295b3',
             '8GB / 256GB|16GB / 512GB',
             'CPU:Intel Core i5-1340P|RAM:16GB LPDDR5|Ổ cứng:512GB NVMe SSD|Màn hình:14 inch 2.2K 90Hz|Pin:70Wh — khoảng 12 giờ sử dụng|Bảo hành:24 tháng chính hãng',
             4.7, 92, 1, 1, 1, 2],

            [5, 'Màn Hình Gaming 27" QHD 165Hz', 'man-hinh-gaming-27-qhd-165hz',
             'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80', '',
             6290000, null, '',
             'Màn hình gaming 27 inch độ phân giải QHD, tần số quét 165Hz, tấm nền IPS màu sắc chuẩn — mượt mà cho mọi tựa game tốc độ cao.',
             'Đen:#0f1029',
             '',
             'Kích thước:27 inch|Độ phân giải:QHD 2560x1440|Tần số quét:165Hz|Tấm nền:IPS|Cổng kết nối:2x HDMI 2.1, 1x DisplayPort 1.4|Bảo hành:36 tháng chính hãng',
             4.6, 64, 1, 1, 0, 3],

            [4, 'Bàn Phím Cơ RGB Switch Đỏ', 'ban-phim-co-rgb-switch-do',
             'https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=800&auto=format&fit=crop&q=80', '',
             1400000, 1190000, '-15%',
             'Bàn phím cơ fullsize switch đỏ linear, đèn nền RGB 16.8 triệu màu, kết nối USB-C có dây — cảm giác gõ êm, phản hồi nhanh cho gaming lẫn văn phòng.',
             'Đen:#0f1029|Trắng bạc:#e8e9f2',
             '',
             'Switch:Red switch (linear)|Layout:Fullsize 104 phím|Đèn nền:RGB 16.8 triệu màu|Kết nối:Có dây USB-C|Bảo hành:12 tháng chính hãng',
             4.5, 41, 1, 1, 0, 4],

            [3, 'Card Đồ Họa RTX 4070 12GB', 'card-do-hoa-rtx-4070-12gb',
             'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80', '',
             15990000, null, 'Mới',
             'Card đồ họa RTX 4070 12GB GDDR6X — hiệu năng vượt trội cho gaming 1440p/4K và các tác vụ dựng hình, AI, render đồ họa chuyên nghiệp.',
             '',
             '',
             'GPU:NVIDIA GeForce RTX 4070|VRAM:12GB GDDR6X|Xung nhịp:2490 MHz Boost|Nguồn khuyến nghị:650W|Cổng kết nối:3x DisplayPort, 1x HDMI|Bảo hành:36 tháng chính hãng',
             4.8, 37, 1, 1, 1, 5],

            [4, 'Chuột Gaming Không Dây Pro', 'chuot-gaming-khong-day-pro',
             'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', '',
             890000, null, '',
             'Chuột gaming không dây cảm biến quang học 26000 DPI, pin sử dụng liên tục đến 70 giờ, trọng lượng siêu nhẹ 63g — phản hồi tức thời cho mọi pha xử lý.',
             'Đen:#0f1029|Trắng bạc:#e8e9f2',
             '',
             'Cảm biến:Optical 26000 DPI|Kết nối:Wireless 2.4GHz + Bluetooth|Pin:70 giờ sử dụng liên tục|Trọng lượng:63g|Bảo hành:12 tháng chính hãng',
             4.6, 58, 1, 1, 0, 6],

            [1, 'Laptop Gaming RGB Core i9', 'laptop-gaming-rgb-core-i9',
             'https://images.unsplash.com/photo-1600861195091-690c92fdf20f?w=800&auto=format&fit=crop&q=80', '',
             38990000, null, 'Mới',
             'Laptop gaming hiệu năng đỉnh cao với Core i9, RTX 4070, màn hình 16 inch QHD+ 240Hz và hệ thống đèn RGB tùy biến — chiến mọi tựa game AAA ở thiết lập cao nhất.',
             'Đen:#0f1029',
             '16GB / 512GB|32GB / 1TB',
             'CPU:Intel Core i9-13900HX|Card đồ họa:NVIDIA RTX 4070 8GB|RAM:32GB DDR5|Ổ cứng:1TB NVMe SSD|Màn hình:16 inch QHD+ 240Hz|Bảo hành:24 tháng chính hãng',
             4.9, 29, 1, 0, 1, 7],

            [4, 'Bộ Setup Bàn Gaming RGB', 'bo-setup-ban-gaming-rgb',
             'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80', '',
             3490000, null, '',
             'Bộ combo setup bàn gaming gồm bàn phím, chuột, lót chuột và đèn LED RGB đồng bộ — nâng tầm góc chơi game/làm việc của bạn chỉ với một lần mua.',
             'Đen:#0f1029',
             '',
             'Bao gồm:Bàn phím, chuột, lót chuột, đèn LED RGB|Đồng bộ:RGB Sync đa thiết bị|Kết nối:USB có dây|Bảo hành:12 tháng chính hãng',
             4.4, 22, 1, 0, 0, 8],

            [3, 'Bo Mạch Chủ Chipset B760', 'bo-mach-chu-chipset-b760',
             'https://images.unsplash.com/photo-1587614382346-4ec70e388b6d?w=800&auto=format&fit=crop&q=80', '',
             3190000, null, '',
             'Bo mạch chủ chipset B760 hỗ trợ CPU Intel thế hệ 12/13/14, RAM DDR5 tối đa 128GB, khe PCIe 5.0 — nền tảng bền vững cho dàn PC hiệu năng cao.',
             '',
             '',
             'Chipset:Intel B760|Socket:LGA1700|RAM hỗ trợ:DDR5 tối đa 128GB|Khe PCIe:1x PCIe 5.0 x16|Bảo hành:36 tháng chính hãng',
             4.3, 15, 0, 0, 0, 9],

            [1, 'Laptop Văn Phòng Core i5', 'laptop-van-phong-core-i5',
             'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&auto=format&fit=crop&q=80', '',
             13880000, 12490000, '-10%',
             'Laptop văn phòng Core i5 mỏng nhẹ, pin trâu, hiệu năng ổn định cho các tác vụ office, xử lý dữ liệu và họp trực tuyến hằng ngày.',
             'Đen:#0f1029|Trắng bạc:#e8e9f2',
             '8GB / 256GB|8GB / 512GB',
             'CPU:Intel Core i5-1235U|RAM:8GB DDR4|Ổ cứng:512GB NVMe SSD|Màn hình:15.6 inch FHD|Bảo hành:24 tháng chính hãng',
             4.2, 34, 1, 0, 0, 10],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO products
                (category_id, name, slug, image, gallery, price, price_sale, badge, description, colors, config_options, specs, rating, review_count, in_stock, is_featured, is_new, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($products as $p) { $stmt->execute($p); }
    }

    private function seedCoupons(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM coupons")->fetchColumn();
        if ($count > 0) return;
        $coupons = [
            // [code, type, value, min_order, max_uses, expires_at, is_active]
            ['TECH10',   'percent', 10, 2000000, 100, null, 1],
            ['GIAM100K', 'fixed',   100000, 500000, 50, null, 1],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO coupons (code, type, value, min_order, max_uses, expires_at, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($coupons as $c) { $stmt->execute($c); }
    }
}
