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
        // Thêm cột coupon_code vào orders cho DB cũ (schema.sql đã có cho DB mới — lệnh này fail silently nếu cột đã tồn tại)
        try { $this->pdo->exec("ALTER TABLE orders ADD COLUMN coupon_code TEXT NOT NULL DEFAULT ''"); } catch(\Exception $e) {}
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
            ['site_name',        'AMI Mobile',                                                    'general'],
            ['site_slogan',      'Điện Thoại & Phụ Kiện Chính Hãng',                                'general'],
            ['site_email',       'hello@amimobile.vn',                                             'general'],
            ['site_phone',       '0900 000 000',                                                   'general'],
            ['site_address',     '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',                       'general'],
            ['working_hours',    'Thứ 2 – Chủ nhật: 8:00 – 21:00',                                  'general'],
            ['site_description', 'AMI Mobile — cửa hàng điện thoại, tai nghe, phụ kiện chính hãng. iPhone, Samsung, Xiaomi, OPPO giá tốt nhất.', 'general'],
            ['site_logo',        '', 'general'],
            ['site_favicon',     '', 'general'],
            ['zalo_number',      '0900000000', 'general'],
            ['warranty_months',  '12', 'general'],

            // ── SEO ──────────────────────────────────────────────────────────────
            ['meta_title',       'AMI Mobile — Điện Thoại & Phụ Kiện Chính Hãng', 'seo'],
            ['meta_description', 'AMI Mobile — cửa hàng điện thoại, tai nghe, phụ kiện chính hãng. iPhone, Samsung, Xiaomi, OPPO giá tốt nhất.', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80', 'seo'],
            ['ga_id',    '', 'seo'],
            ['gtm_id',   '', 'seo'],

            // ── Social ───────────────────────────────────────────────────────────
            ['facebook',  '', 'social'],
            ['instagram', '', 'social'],
            ['youtube',   '', 'social'],
            ['tiktok',    '', 'social'],

            // ── Hero (Intro Banner H5 Bold Typography) ──────────────────────────────
            ['hero_stamp',       'AMI Mobile 2025', 'hero'],
            ['hero_title_line1', 'ĐIỆN THOẠI', 'hero'],
            ['hero_title_line2', 'CHẤT.', 'hero'],
            ['hero_title_line3', 'GIÁ THẬT.', 'hero'],
            ['hero_desc',        'Chuyên cung cấp điện thoại, tai nghe và phụ kiện công nghệ chính hãng — bảo hành đầy đủ, giao hàng nhanh toàn quốc.', 'hero'],
            ['hero_cta_text',    'Mua ngay', 'hero'],
            ['hero_cta2_text',   'Xem khuyến mãi', 'hero'],
            ['ticker_1', 'iPhone 16 Series', 'hero'],
            ['ticker_2', 'Samsung Galaxy S24 Ultra', 'hero'],
            ['ticker_3', 'AirPods Pro 2 giảm 8%', 'hero'],
            ['ticker_4', 'Xiaomi 14 Ultra mới về', 'hero'],
            ['ticker_5', 'Samsung Galaxy Z Fold 6', 'hero'],
            ['ticker_6', 'Bảo hành 12 tháng chính hãng', 'hero'],

            // ── Stats (trang chủ — Stat Bar 4 mục) ────────────────────────────────
            ['hstat1_num', '12000', 'stats'], ['hstat1_suffix', '+',    'stats'], ['hstat1_label', 'Sản phẩm đã bán',        'stats'],
            ['hstat2_num', '98',    'stats'], ['hstat2_suffix', '%',    'stats'], ['hstat2_label', 'Khách hài lòng',         'stats'],
            ['hstat3_num', '15',    'stats'], ['hstat3_suffix', ' năm', 'stats'], ['hstat3_label', 'Kinh nghiệm',            'stats'],
            ['hstat4_num', '63',    'stats'], ['hstat4_suffix', '',     'stats'], ['hstat4_label', 'Tỉnh thành giao hàng',   'stats'],
            // ── Stats (trang Về chúng tôi — 4 mục) ────────────────────────────────
            ['astat1_num', '15',    'stats'], ['astat1_suffix', '+', 'stats'], ['astat1_label', 'Năm kinh nghiệm',     'stats'],
            ['astat2_num', '50000', 'stats'], ['astat2_suffix', '+', 'stats'], ['astat2_label', 'Khách hàng tin dùng', 'stats'],
            ['astat3_num', '12000', 'stats'], ['astat3_suffix', '+', 'stats'], ['astat3_label', 'Sản phẩm đã bán',     'stats'],
            ['astat4_num', '98',    'stats'], ['astat4_suffix', '%', 'stats'], ['astat4_label', 'Khách hài lòng',      'stats'],

            // ── About (trang Về chúng tôi) ─────────────────────────────────────────
            ['about_img', 'https://images.unsplash.com/photo-1777073233203-314199f1f1e4?w=900&auto=format&fit=crop&q=80', 'about'],
            ['about_lead1', 'AMI Mobile được thành lập năm 2010 với mục tiêu mang đến cho người tiêu dùng Việt Nam những chiếc điện thoại và phụ kiện chính hãng, chất lượng cao với giá thành cạnh tranh nhất.', 'about'],
            ['about_lead2', 'Qua hơn 15 năm hoạt động, chúng tôi tự hào đã phục vụ hơn 50,000 khách hàng trên toàn quốc, xây dựng được niềm tin vững chắc trong cộng đồng người yêu công nghệ di động.', 'about'],
            ['value1_icon', '🏷️', 'about'], ['value1_title', 'Hàng chính hãng', 'about'], ['value1_desc', '100% sản phẩm có hóa đơn chính hãng, dán tem kiểm định, đảm bảo nguồn gốc xuất xứ rõ ràng.', 'about'],
            ['value2_icon', '💰', 'about'], ['value2_title', 'Giá cạnh tranh',  'about'], ['value2_desc', 'Cam kết giá thấp nhất thị trường. Tìm thấy nơi bán rẻ hơn — chúng tôi hỗ trợ giảm thêm 5%.', 'about'],
            ['value3_icon', '🤝', 'about'], ['value3_title', 'Hậu mãi tận tâm', 'about'], ['value3_desc', 'Đội ngũ kỹ thuật hỗ trợ 7/7, bảo hành đúng hạn, đổi trả nhanh gọn không phiền hà.', 'about'],
            ['team1_name', 'Nguyễn Văn A', 'about'], ['team1_role', 'Giám đốc điều hành',       'about'], ['team1_color', 'accent', 'about'],
            ['team2_name', 'Trần Thị B',   'about'], ['team2_role', 'Trưởng phòng kinh doanh',  'about'], ['team2_color', 'mustard', 'about'],
            ['team3_name', 'Lê Văn C',     'about'], ['team3_role', 'Trưởng kỹ thuật',          'about'], ['team3_color', 'dark2',   'about'],
            ['team4_name', 'Phạm Thị D',   'about'], ['team4_role', 'Chăm sóc khách hàng',      'about'], ['team4_color', 'gray',    'about'],

            // ── Promotions (trang Khuyến mãi) ────────────────────────────────────────
            ['promo_percent', '30', 'promotions'],
            ['promo_desc', 'Áp dụng cho iPhone 15 Series, Samsung Galaxy S24, Xiaomi 14 và nhiều mẫu khác. Số lượng có hạn!', 'promotions'],
            ['promo_card1_icon', '📦', 'promotions'], ['promo_card1_title', 'Miễn phí vận chuyển',   'promotions'], ['promo_card1_desc', 'Áp dụng cho đơn hàng từ 500,000đ. Giao hàng nhanh 2–4 giờ nội thành TP.HCM.', 'promotions'],
            ['promo_card2_icon', '🔄', 'promotions'], ['promo_card2_title', 'Đổi trả trong 7 ngày',  'promotions'], ['promo_card2_desc', 'Không hài lòng? Đổi trả miễn phí trong 7 ngày kể từ ngày mua — không cần lý do.', 'promotions'],
            ['promo_card3_icon', '🛡️', 'promotions'], ['promo_card3_title', 'Bảo hành 12 tháng',     'promotions'], ['promo_card3_desc', 'Toàn bộ sản phẩm đều được bảo hành 12 tháng tại trung tâm bảo hành ủy quyền chính hãng.', 'promotions'],

            // ── Footer ───────────────────────────────────────────────────────────────
            ['footer_about', 'Chuyên cung cấp điện thoại, tai nghe và phụ kiện chính hãng.', 'footer'],

            // ── Shop policy ──────────────────────────────────────────────────────────
            ['return_days', '7', 'shop'],

            // ── Payment (tab "💳 Thanh toán") ────────────────────────────────────────
            ['payment_cod_enabled',      '1', 'payment'],
            ['payment_sepay_enabled',    '1', 'payment'],
            ['sepay_bank_code',          'MB',  'payment'],
            ['sepay_account_number',     '0099001122334',  'payment'],
            ['sepay_account_name',       'WEBDROP STORE TEST',  'payment'],
            ['sepay_webhook_secret',     'TEST_SEPAY_API_2026',  'payment'],
            ['shipping_fee',             '25000',   'payment'],
            ['free_shipping_threshold',  '500000',  'payment'],

            // ── Contact ──────────────────────────────────────────────────────────────
            ['contact_intro', 'Đội ngũ tư vấn AMI Mobile luôn sẵn sàng hỗ trợ bạn chọn chiếc điện thoại phù hợp nhất với nhu cầu và ngân sách.', 'contact'],

            // ── SMTP ─────────────────────────────────────────────────────────────────
            ['smtp_host',      '', 'smtp'],
            ['smtp_port',      '587', 'smtp'],
            ['smtp_user',      '', 'smtp'],
            ['smtp_pass',      '', 'smtp'],
            ['smtp_from',      '', 'smtp'],
            ['smtp_from_name', 'AMI Mobile', 'smtp'],

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
        // Intro Banner (H5 Bold Typography) là chữ lớn + ticker marquee, KHÔNG dùng ảnh slider —
        // nội dung chữ quản lý qua settings nhóm 'hero' (xem seedSettings). Vẫn seed 1 record để
        // giữ menu "Hero Slides" hoạt động đúng chuẩn scaffold (cùng pattern các site hero tĩnh khác).
        $slides = [
            ['Banner trang chủ AMI Mobile', 'Không hiển thị dạng ảnh — nội dung banner quản lý ở Cài đặt > Trang chủ', '', '', '', 1, 'published'],
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
        // id: 1 Điện thoại, 2 Tai nghe, 3 Sạc & Cáp, 4 Ốp lưng & Phụ kiện
        $cats = [
            ['Điện Thoại',            'dien-thoai', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80', 1],
            ['Tai Nghe',              'tai-nghe',   'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&auto=format&fit=crop&q=80', 2],
            ['Sạc & Cáp',             'sac-cap',    'https://images.unsplash.com/photo-1591290619618-904f6dd935e3?w=600&auto=format&fit=crop&q=80', 3],
            ['Ốp Lưng & Phụ Kiện',    'op-lung',    'https://images.unsplash.com/photo-1535157412991-2ef801c1748b?w=600&auto=format&fit=crop&q=80', 4],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO product_categories (name, slug, image, sort_order) VALUES (?, ?, ?, ?)"
        );
        foreach ($cats as $c) { $stmt->execute($c); }
    }

    private function seedProducts(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
        if ($count > 0) return;

        // Nội dung copy nguyên từ assets/js/products-data.js của template (42 sản phẩm thật, không bịa).
        // category_id: 1 Điện thoại, 2 Tai nghe, 3 Sạc & Cáp, 4 Ốp lưng & Phụ kiện
        // [category_id, name, slug, image, price, price_sale, badge, colors, brand, rating, sold, theme, sort_order]
        $raw = [
            [1, 'iPhone 16 Pro Max 256GB Natural Titanium', 'iphone-16-pro-max-256gb', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80', 49990000, null, 'hot', 'bac', 'apple', 4.9, 456, 'noi-bat'],
            [1, 'iPhone 16 Pro 128GB Black Titanium', 'iphone-16-pro-128gb-black', 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=600&auto=format&fit=crop&q=80', 39990000, 37990000, 'sale', 'den', 'apple', 4.8, 312, 'noi-bat,giam-gia'],
            [1, 'iPhone 16 Plus 256GB Pink', 'iphone-16-plus-256gb-pink', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80', 29990000, null, 'new', 'tim', 'apple', 4.7, 145, 'moi-ve'],
            [1, 'iPhone 16 128GB Teal', 'iphone-16-128gb-teal', 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80', 26990000, null, 'new', 'xanh', 'apple', 4.7, 234, 'moi-ve'],
            [1, 'iPhone 15 Pro 256GB Blue Titanium', 'iphone-15-pro-256gb-blue', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80', 32990000, 29990000, 'sale', 'xanh', 'apple', 4.8, 267, 'giam-gia'],
            [1, 'iPhone 15 128GB Yellow', 'iphone-15-128gb-yellow', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80', 19990000, 17490000, 'sale', 'vang', 'apple', 4.6, 489, 'giam-gia'],
            [1, 'iPhone 15 Plus 128GB Black', 'iphone-15-plus-128gb-black', 'https://images.unsplash.com/photo-1634403665481-74948d815f03?w=600&auto=format&fit=crop&q=80', 22990000, null, '', 'den', 'apple', 4.5, 178, ''],
            [1, 'iPhone 14 128GB Deep Purple', 'iphone-14-128gb-purple', 'https://images.unsplash.com/photo-1583291023438-41cef6453b1f?w=600&auto=format&fit=crop&q=80', 15990000, 13490000, 'sale', 'tim', 'apple', 4.5, 678, 'giam-gia'],
            [1, 'iPhone 14 Plus 256GB Blue', 'iphone-14-plus-256gb-blue', 'https://images.unsplash.com/photo-1524226108234-3cccbbbfa86d?w=600&auto=format&fit=crop&q=80', 19990000, null, '', 'xanh', 'apple', 4.4, 89, ''],
            [1, 'iPhone SE 2022 64GB Midnight', 'iphone-se-2022-64gb-midnight', 'https://images.unsplash.com/photo-1583142485083-291557266e6a?w=600&auto=format&fit=crop&q=80', 9990000, 8490000, 'sale', 'den', 'apple', 4.3, 345, 'giam-gia'],
            [1, 'iPhone 13 128GB Alpine Green', 'iphone-13-128gb-green', 'https://images.unsplash.com/photo-1557680784-6db47c6f56ab?w=600&auto=format&fit=crop&q=80', 12990000, 10990000, 'sale', 'xanh', 'apple', 4.4, 456, 'giam-gia'],

            [1, 'Samsung Galaxy S24 Ultra 512GB Titanium Black', 'samsung-galaxy-s24-ultra-512gb', 'https://images.unsplash.com/photo-1576107324820-c10884700b6b?w=600&auto=format&fit=crop&q=80', 34990000, null, 'hot', 'den', 'samsung', 4.9, 389, 'noi-bat'],
            [1, 'Samsung Galaxy S24+ 256GB Cobalt Violet', 'samsung-galaxy-s24-plus-violet', 'https://images.unsplash.com/photo-1547658718-f4311ad64746?w=600&auto=format&fit=crop&q=80', 25990000, 23990000, 'sale', 'tim', 'samsung', 4.7, 234, 'giam-gia'],
            [1, 'Samsung Galaxy S24 256GB Onyx Black', 'samsung-galaxy-s24-black', 'https://images.unsplash.com/photo-1707438095940-1eee18e85400?w=600&auto=format&fit=crop&q=80', 20990000, null, 'new', 'den', 'samsung', 4.6, 178, 'moi-ve'],
            [1, 'Samsung Galaxy Z Fold 6 512GB Shadow', 'samsung-galaxy-z-fold-6-512gb', 'https://images.unsplash.com/photo-1655803281586-2053d8edcaa1?w=600&auto=format&fit=crop&q=80', 49990000, null, 'hot', 'den', 'samsung', 4.8, 89, 'noi-bat'],
            [1, 'Samsung Galaxy Z Flip 6 256GB Lemon Yellow', 'samsung-galaxy-z-flip-6-yellow', 'https://images.unsplash.com/photo-1721864457758-ff2cfa47f58a?w=600&auto=format&fit=crop&q=80', 27990000, null, 'new', 'vang', 'samsung', 4.7, 134, 'moi-ve'],
            [1, 'Samsung Galaxy A55 5G 256GB Awesome Iceblue', 'samsung-galaxy-a55-5g', 'https://images.unsplash.com/photo-1705585174953-9b2aa8afc174?w=600&auto=format&fit=crop&q=80', 11990000, null, '', 'xanh', 'samsung', 4.4, 267, ''],
            [1, 'Samsung Galaxy A35 5G 128GB Awesome Lemon', 'samsung-galaxy-a35-5g', 'https://images.unsplash.com/photo-1583573636246-18cb2246697f?w=600&auto=format&fit=crop&q=80', 7990000, 6990000, 'sale', 'vang', 'samsung', 4.3, 345, 'giam-gia'],
            [1, 'Samsung Galaxy M55 5G 128GB Dark Blue', 'samsung-galaxy-m55-5g', 'https://images.unsplash.com/photo-1628866971123-6697eb767771?w=600&auto=format&fit=crop&q=80', 8990000, null, '', 'xanh', 'samsung', 4.2, 198, ''],

            [1, 'Xiaomi 14 Ultra 512GB Titanium White', 'xiaomi-14-ultra-512gb-white', 'https://images.unsplash.com/photo-1567428486597-8c5328fd3816?w=600&auto=format&fit=crop&q=80', 29990000, null, 'hot', 'trang', 'xiaomi', 4.8, 145, 'noi-bat'],
            [1, 'Xiaomi 14 256GB Black', 'xiaomi-14-256gb-black', 'https://images.unsplash.com/photo-1544228865-7d73678c0f28?w=600&auto=format&fit=crop&q=80', 22990000, null, '', 'den', 'xiaomi', 4.6, 167, ''],
            [1, 'Redmi Note 13 Pro 5G 256GB Aurora Purple', 'redmi-note-13-pro-5g-purple', 'https://images.unsplash.com/photo-1539693186763-df6665847771?w=600&auto=format&fit=crop&q=80', 8990000, 7490000, 'sale', 'tim', 'xiaomi', 4.4, 456, 'giam-gia'],
            [1, 'Poco X6 Pro 256GB Yellow Tiger', 'poco-x6-pro-256gb-yellow', 'https://images.unsplash.com/photo-1537145605632-2fa0f95316b0?w=600&auto=format&fit=crop&q=80', 7990000, null, 'new', 'vang', 'xiaomi', 4.3, 234, 'moi-ve'],
            [1, 'Redmi 13 128GB Ocean Blue', 'redmi-13-128gb-blue', 'https://images.unsplash.com/photo-1592320402243-605cc3e935f7?w=600&auto=format&fit=crop&q=80', 3990000, null, '', 'xanh', 'xiaomi', 4.1, 678, ''],

            [1, 'OPPO Find X7 Ultra 256GB Comet Blue', 'oppo-find-x7-ultra-blue', 'https://images.unsplash.com/photo-1557767382-97b28f5488e7?w=600&auto=format&fit=crop&q=80', 29990000, null, 'hot', 'xanh', 'oppo', 4.7, 89, 'noi-bat'],
            [1, 'OPPO Reno 12 Pro 256GB Nebula Blue', 'oppo-reno-12-pro-blue', 'https://images.unsplash.com/photo-1600577231598-31ea4cb50da3?w=600&auto=format&fit=crop&q=80', 12990000, 11490000, 'sale', 'xanh', 'oppo', 4.5, 178, 'giam-gia'],
            [1, 'OPPO A79 5G 256GB Mystery Black', 'oppo-a79-5g-black', 'https://images.unsplash.com/photo-1596207891316-23851be3cc20?w=600&auto=format&fit=crop&q=80', 6990000, null, '', 'den', 'oppo', 4.2, 234, ''],
            [1, 'OPPO Find N3 Flip 256GB Gold', 'oppo-find-n3-flip-gold', 'https://images.unsplash.com/photo-1724323192353-f80f38e91b9d?w=600&auto=format&fit=crop&q=80', 22990000, null, 'new', 'vang', 'oppo', 4.6, 78, 'moi-ve'],

            [2, 'Apple AirPods Pro 2 (USB-C)', 'airpods-pro-2-usb-c', 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&auto=format&fit=crop&q=80', 6490000, 5990000, 'sale', 'trang', 'apple', 4.8, 567, 'phu-kien,giam-gia'],
            [2, 'Samsung Galaxy Buds3 Pro', 'samsung-galaxy-buds3-pro', 'https://images.unsplash.com/photo-1778577528649-7fa38128332a?w=600&auto=format&fit=crop&q=80', 4490000, null, 'new', 'bac', 'samsung', 4.6, 234, 'phu-kien,moi-ve'],
            [2, 'Sony WH-1000XM5 Over-Ear', 'sony-wh-1000xm5', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&auto=format&fit=crop&q=80', 8990000, 7490000, 'sale', 'den', 'sony', 4.9, 189, 'phu-kien,giam-gia'],
            [2, 'Sony WF-1000XM5 In-Ear', 'sony-wf-1000xm5', 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&auto=format&fit=crop&q=80', 6990000, null, '', 'bac', 'sony', 4.8, 145, 'phu-kien'],
            [2, 'JBL Tune 720BT Wireless', 'jbl-tune-720bt', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80', 1390000, null, '', 'xanh', 'jbl', 4.3, 456, 'phu-kien'],
            [2, 'Xiaomi Buds 4 Pro ANC', 'xiaomi-buds-4-pro', 'https://images.unsplash.com/photo-1578319439584-104c94d37305?w=600&auto=format&fit=crop&q=80', 1990000, null, 'new', 'trang', 'xiaomi', 4.4, 289, 'phu-kien,moi-ve'],

            [3, 'Apple MagSafe Charger 15W', 'apple-magsafe-charger-15w', 'https://images.unsplash.com/photo-1591290619618-904f6dd935e3?w=600&auto=format&fit=crop&q=80', 990000, null, '', 'trang', 'apple', 4.6, 678, 'phu-kien'],
            [3, 'Samsung 45W Super Fast Charger', 'samsung-45w-charger', 'https://images.unsplash.com/photo-1520287636485-66d0e25add79?w=600&auto=format&fit=crop&q=80', 690000, null, '', 'den', 'samsung', 4.5, 456, 'phu-kien'],
            [3, 'Anker PowerBank 20000mAh 67W', 'anker-powerbank-20000mah-67w', 'https://images.unsplash.com/photo-1566554738544-d962991c3fee?w=600&auto=format&fit=crop&q=80', 1290000, 990000, 'sale', 'den', 'anker', 4.7, 345, 'phu-kien,giam-gia'],
            [3, 'Cáp USB-C Lightning 2m MFi', 'cap-usb-c-lightning-2m', 'https://images.unsplash.com/photo-1499033300314-43c811cff6d5?w=600&auto=format&fit=crop&q=80', 490000, null, '', 'trang', 'apple', 4.4, 789, 'phu-kien'],

            [4, 'Ốp lưng iPhone 16 Pro Max Clear MagSafe', 'op-lung-iphone-16-pro-max-clear', 'https://images.unsplash.com/photo-1535157412991-2ef801c1748b?w=600&auto=format&fit=crop&q=80', 490000, null, 'new', 'trang', 'apple', 4.3, 345, 'phu-kien,moi-ve'],
            [4, 'Ốp lưng Samsung S24 Ultra Silicone', 'op-lung-samsung-s24-ultra-silicone', 'https://images.unsplash.com/photo-1542219550-76864b1bc385?w=600&auto=format&fit=crop&q=80', 390000, null, '', 'den', 'samsung', 4.2, 267, 'phu-kien'],
            [4, 'Ốp lưng iPhone 15 Leather Brown', 'op-lung-iphone-15-leather-brown', 'https://images.unsplash.com/photo-1613294064031-8935937266f4?w=600&auto=format&fit=crop&q=80', 890000, 690000, 'sale', 'bac', 'apple', 4.4, 189, 'phu-kien,giam-gia'],
            [4, 'Kính cường lực iPhone 16 Full Viền', 'kinh-cuong-luc-iphone-16-full', 'https://images.unsplash.com/photo-1667525338522-db562e851305?w=600&auto=format&fit=crop&q=80', 290000, null, '', 'trang', 'apple', 4.3, 567, 'phu-kien'],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO products
                (category_id, name, slug, image, price, price_sale, badge, description, colors, brand, rating, in_stock, is_featured, is_new, sort_order, theme, sold, gallery)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)"
        );
        $order = 1;
        foreach ($raw as $p) {
            [$categoryId, $name, $slug, $image, $price, $priceSale, $badge, $color, $brand, $rating, $sold, $theme] = $p;
            $description = "Sản phẩm {$name} chính hãng, bảo hành 12 tháng tại trung tâm bảo hành ủy quyền. Giao hàng toàn quốc, đổi trả trong 7 ngày.";
            $isFeatured  = str_contains($theme, 'noi-bat') ? 1 : 0;
            $isNew       = $badge === 'new' ? 1 : 0;
            $stmt->execute([
                $categoryId, $name, $slug, $image, $price, $priceSale, $badge, $description, $color, $brand, $rating,
                $isFeatured, $isNew, $order, $theme, $sold, '',
            ]);
            $order++;
        }
    }

    private function seedCoupons(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM coupons")->fetchColumn();
        if ($count > 0) return;
        // 2 mã mẫu: AMI10 (giảm 10%), GIAM50K (giảm 50.000đ cho đơn từ 300.000đ)
        $coupons = [
            ['AMI10',   'percent', 10,    0,      100, null, 1],
            ['GIAM50K', 'fixed',   50000, 300000, 50,  null, 1],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO coupons (code, type, value, min_order, max_uses, expires_at, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($coupons as $c) { $stmt->execute($c); }
    }
}
