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
            ['site_name',        'Vườn Xanh',                                          'general'],
            ['site_slogan',      'Nông sản sạch mỗi ngày',                              'general'],
            ['site_email',       'hello@vuonxanh.vn',                                  'general'],
            ['site_phone',       '0909 123 456',                                       'general'],
            ['site_address',     '123 Đường Nông Trại, Phường Linh Trung, TP. Thủ Đức, TP.HCM', 'general'],
            ['working_hours',    '7:00 – 20:00 · Tất cả các ngày trong tuần',           'general'],
            ['site_description', 'Vườn Xanh cung cấp rau củ quả hữu cơ tươi mỗi ngày từ nông trại đến bàn ăn — không thuốc bảo vệ thực vật, giao hàng trong ngày.', 'general'],
            ['site_logo',        '', 'general'],
            ['site_favicon',     '', 'general'],
            ['zalo_number',      '0909123456', 'general'],
            ['announcement_text','🌿 Giao rau trong ngày nội thành · Freeship đơn từ 300.000đ', 'general'], // hiển thị dạng text thuần, không markup

            // ── SEO ──────────────────────────────────────────────────────────────
            ['meta_title',       'Vườn Xanh — Rau Củ Quả Hữu Cơ Giao Tận Nhà', 'seo'],
            ['meta_description', 'Vườn Xanh cung cấp rau củ quả hữu cơ tươi mỗi ngày từ nông trại đến bàn ăn — không thuốc bảo vệ thực vật, giao hàng trong ngày.', 'seo'],
            ['og_image', '', 'seo'],
            ['ga_id',    '', 'seo'],
            ['gtm_id',   '', 'seo'],

            // ── Social (template chỉ có Facebook / Instagram / Zalo) ────────────────
            ['facebook',  'https://www.facebook.com/vuonxanh',  'social'],
            ['instagram', 'https://www.instagram.com/vuonxanh', 'social'],
            ['zalo',      'https://zalo.me/0909123456',         'social'],

            // ── Home: Hero (H6 Asymmetric Offset) ────────────────────────────────────
            ['hero_tag',          'Hơn 4 năm đồng hành cùng nông trại Việt', 'home'],
            ['hero_float_num',    '120', 'home'],
            ['hero_float_suffix', '+',   'home'],
            ['hero_float_label',  'liên kết trực tiếp', 'home'],

            // ── Home: Commitments (FEATURE-ICON-ROW, 4 mục) ──────────────────────────
            ['commit1_icon',  'patch-check-fill', 'home'],
            ['commit1_title', '100% hữu cơ', 'home'],
            ['commit1_desc',  'Canh tác tự nhiên, có chứng nhận VietGAP rõ ràng.', 'home'],
            ['commit2_icon',  'lightning-charge-fill', 'home'],
            ['commit2_title', 'Giao trong ngày', 'home'],
            ['commit2_desc',  'Đặt trước 10h sáng, nhận rau tươi ngay chiều cùng ngày.', 'home'],
            ['commit3_icon',  'shield-check', 'home'],
            ['commit3_title', 'Không thuốc BVTV', 'home'],
            ['commit3_desc',  'Kiểm nghiệm dư lượng định kỳ tại từng lô hàng.', 'home'],
            ['commit4_icon',  'arrow-repeat', 'home'],
            ['commit4_title', 'Hoàn tiền nếu chưa hài lòng', 'home'],
            ['commit4_desc',  'Đổi trả trong 24h nếu rau không tươi như cam kết.', 'home'],

            // ── Home: Timeline (Từ vườn đến bàn ăn, 4 bước) ──────────────────────────
            ['timeline1_title', 'Thu hoạch trong đêm', 'home'],
            ['timeline1_desc',  'Rau được hái vào sáng sớm để giữ độ giòn và dinh dưỡng tối đa.', 'home'],
            ['timeline2_title', 'Sơ chế & rửa sạch', 'home'],
            ['timeline2_desc',  'Loại bỏ lá hư, rửa qua hệ thống nước sạch đạt chuẩn.', 'home'],
            ['timeline3_title', 'Đóng gói giữ tươi', 'home'],
            ['timeline3_desc',  'Đóng gói bằng vật liệu thoáng khí, hạn chế dập úng.', 'home'],
            ['timeline4_title', 'Giao đến tận cửa', 'home'],
            ['timeline4_desc',  'Vận chuyển lạnh, giao trong ngày nội thành.', 'home'],

            // ── Home: Promo (FULL-BLEED torn-paper, combo tuần) ──────────────────────
            ['promo_label',    'Combo rau củ tuần', 'home'],
            ['promo_title',    'Đặt một lần, ăn rau tươi cả tuần', 'home'],
            ['promo_desc',     'Combo 7 ngày gồm rau ăn lá, củ quả và rau gia vị được cân đối sẵn — tiết kiệm thời gian đi chợ mỗi ngày.', 'home'],
            ['promo_list1',    'Đủ khẩu phần cho gia đình 4 người', 'home'],
            ['promo_list2',    'Đổi món linh hoạt mỗi tuần', 'home'],
            ['promo_list3',    'Tiết kiệm 20% so với mua lẻ', 'home'],
            ['promo_cta_text', 'Đặt combo ngay', 'home'],
            ['promo_image',    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=700&auto=format&fit=crop&q=80', 'home'],
            ['promo_tag',      '-20%', 'home'],

            // ── Home: Brand story (ALTERNATING-STRIPS, 2 dòng) ───────────────────────
            ['story1_num',         '01', 'home'],
            ['story1_title_pre',   'Từ', 'home'],
            ['story1_title_strong','nông trại Đà Lạt', 'home'],
            ['story1_title_post',  'đến bàn ăn của bạn', 'home'],
            ['story1_text',    'Vườn Xanh hợp tác trực tiếp với hơn 120 nông hộ tại Đà Lạt, Mộc Châu và Long An — bỏ qua trung gian để rau đến tay bạn nhanh hơn, tươi hơn và giá hợp lý hơn.', 'home'],
            ['story1_list1',   'Thu mua trực tiếp từ nông hộ', 'home'],
            ['story1_list2',   'Truy xuất nguồn gốc từng lô hàng', 'home'],
            ['story1_image',   'https://images.unsplash.com/photo-1595855759920-86582396756c?w=700&auto=format&fit=crop&q=80', 'home'],
            ['story2_num',         '02', 'home'],
            ['story2_title_pre',   'Cam kết', 'home'],
            ['story2_title_strong','không hóa chất', 'home'],
            ['story2_title_post',  'không thuốc trừ sâu', 'home'],
            ['story2_text',    'Mỗi lô rau đều được kiểm nghiệm dư lượng thuốc bảo vệ thực vật trước khi đóng gói. Chúng tôi tin rằng thực phẩm sạch bắt đầu từ sự minh bạch với khách hàng.', 'home'],
            ['story2_list1',   'Kiểm nghiệm định kỳ tại phòng lab độc lập', 'home'],
            ['story2_list2',   'Chứng nhận VietGAP cho toàn bộ nông trại', 'home'],
            ['story2_image',   'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=700&auto=format&fit=crop&q=80', 'home'],

            // ── Home: Stats (STAT-BAR, 4 mục) ────────────────────────────────────────
            ['stat1_num', '5000', 'home'], ['stat1_suffix', '+', 'home'], ['stat1_label', 'Khách hàng tin dùng', 'home'],
            ['stat2_num', '120',  'home'], ['stat2_suffix', '+', 'home'], ['stat2_label', 'Nông trại liên kết', 'home'],
            ['stat3_num', '15',   'home'], ['stat3_suffix', ' tỉnh', 'home'], ['stat3_label', 'Giao hàng phủ khắp', 'home'],
            ['stat4_num', '4',    'home'], ['stat4_suffix', ' năm', 'home'], ['stat4_label', 'Kinh nghiệm nông sản sạch', 'home'],

            // ── Home: Newsletter (nhúng trong footer) ────────────────────────────────
            ['newsletter_title', 'Nhận ưu đãi mỗi tuần', 'home'],
            ['newsletter_desc',  'Đăng ký để nhận mã giảm giá combo rau và thông báo hàng theo mùa mới về.', 'home'],

            // ── Reviews (HORIZONTAL-SCROLL, 4 đánh giá) ──────────────────────────────
            ['review1_name',     'Trần Thu Hà', 'reviews'],
            ['review1_location', 'Quận 7, TP.HCM', 'reviews'],
            ['review1_content',  'Rau tươi thật sự, hôm nào đặt cũng thấy còn dính đất, ăn giòn và ngọt hơn hẳn rau ngoài chợ.', 'reviews'],
            ['review1_rating',   '5', 'reviews'],
            ['review2_name',     'Nguyễn Minh Quân', 'reviews'],
            ['review2_location', 'Cầu Giấy, Hà Nội', 'reviews'],
            ['review2_content',  'Combo rau tuần rất tiện, mình không phải nghĩ hôm nay ăn gì nữa. Giao đúng giờ, đóng gói gọn gàng.', 'reviews'],
            ['review2_rating',   '5', 'reviews'],
            ['review3_name',     'Lê Phương Linh', 'reviews'],
            ['review3_location', 'Thủ Đức, TP.HCM', 'reviews'],
            ['review3_content',  'Giá hơi cao hơn chợ một chút nhưng đổi lại yên tâm về nguồn gốc. Sẽ tiếp tục ủng hộ shop.', 'reviews'],
            ['review3_rating',   '4', 'reviews'],
            ['review4_name',     'Phạm Anh Thư', 'reviews'],
            ['review4_location', 'Hải Châu, Đà Nẵng', 'reviews'],
            ['review4_content',  'Đặt hàng qua web rất dễ, đội giao hàng thân thiện. Rau nhà mình dùng quen hai tháng nay rồi.', 'reviews'],
            ['review4_rating',   '5', 'reviews'],

            // ── Footer ───────────────────────────────────────────────────────────────
            ['footer_desc', 'Rau củ quả hữu cơ từ nông trại đến bàn ăn — tươi mỗi ngày, sạch mỗi bữa, minh bạch mỗi lô hàng.', 'footer'],

            // ── Shop policy ──────────────────────────────────────────────────────────
            ['return_hours', '24', 'shop'],

            // ── Contact ──────────────────────────────────────────────────────────────
            ['contact_intro',        'Đội ngũ Vườn Xanh sẵn sàng tư vấn combo phù hợp, giải đáp về nguồn gốc rau củ hoặc hỗ trợ theo dõi đơn hàng của bạn.', 'contact'],
            ['contact_delivery_note','Đặt trước 10:00 sáng — nhận rau ngay chiều cùng ngày', 'contact'],
            ['map_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.395!2d106.7712!3d10.8506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDUxJzAyLjIiTiAxMDbCsDQ2JzE2LjMiRQ!5e0!3m2!1svi!2s!4v1000000000000', 'contact'],

            // ── Payment (tab "💳 Thanh toán") ────────────────────────────────────────
            ['payment_cod_enabled',      '1', 'payment'],
            ['payment_sepay_enabled',    '1', 'payment'],
            ['sepay_bank_code',          'MB',  'payment'],
            ['sepay_account_number',     '0099001122334',  'payment'],
            ['sepay_account_name',       'WEBDROP STORE TEST',  'payment'],
            ['sepay_webhook_secret',     'TEST_SEPAY_API_2026',  'payment'],
            ['shipping_fee',             '20000',  'payment'],
            ['free_shipping_threshold',  '300000', 'payment'],

            // ── SMTP ─────────────────────────────────────────────────────────────────
            ['smtp_host',      '', 'smtp'],
            ['smtp_port',      '587', 'smtp'],
            ['smtp_user',      '', 'smtp'],
            ['smtp_pass',      '', 'smtp'],
            ['smtp_from',      '', 'smtp'],
            ['smtp_from_name', 'Vườn Xanh', 'smtp'],

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
                'Rau củ tươi mộc, hái sáng nay — giao tận tay hôm nay',
                'Vườn Xanh chọn lọc rau củ quả từ những nông trại canh tác tự nhiên, không thuốc bảo vệ thực vật, thu hoạch trong đêm và giao đến bạn ngay trong ngày.',
                'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1600&auto=format&fit=crop&q=80',
                'Xem sản phẩm', '/san-pham', 1, 'published',
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
            ['Rau ăn lá',          'rau-an-la',          'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=500&auto=format&fit=crop&q=80', 1],
            ['Củ quả tươi',        'cu-qua-tuoi',         'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=80', 2],
            ['Rau gia vị',         'rau-gia-vi',          'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=500&auto=format&fit=crop&q=80', 3],
            ['Trái cây sạch',      'trai-cay-sach',       'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=500&auto=format&fit=crop&q=80', 4],
            ['Combo rau củ tuần',  'combo-rau-cu-tuan',   'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&auto=format&fit=crop&q=80', 5],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO product_categories (name, slug, image, sort_order) VALUES (?, ?, ?, ?)"
        );
        foreach ($cats as $c) { $stmt->execute($c); }
    }

    private function seedProducts(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
        if ($count > 0) return;

        $colGreen  = 'Xanh lá:#4c7a3a';
        $colRed    = 'Đỏ:#c0392b';
        $colOrange = 'Cam:#d97f2e';
        $colYellow = 'Vàng:#dbb42c';

        // [category_id, name, slug, image, price, price_sale, badge, description, colors, rating, in_stock,
        //  is_featured, is_new, sort_order, unit, gallery, tags, nutrition, sold_count, stock_qty]
        $products = [
            // ── Rau ăn lá (category 1) ────────────────────────────────────────────
            [1, 'Rau muống hữu cơ', 'rau-muong-huu-co',
             'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=700&auto=format&fit=crop&q=80',
             15000, null, 'Bán chạy',
             'Rau muống hữu cơ trồng thủy canh, thân giòn ngọt, không dư lượng thuốc bảo vệ thực vật — thu hoạch trong đêm và giao ngay trong ngày.',
             $colGreen, 4.7, 1, 1, 0, 1, 'bó', '', 'Hữu cơ|Không thuốc BVTV',
             'Năng lượng:19 kcal / 100g|Vitamin C:55% nhu cầu hàng ngày|Sắt:1.7 mg / 100g', 1240, 86],

            [1, 'Cải bó xôi baby hữu cơ', 'cai-bo-xoi-baby-huu-co',
             'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?w=700&auto=format&fit=crop&q=80',
             33000, 28000, 'Mới',
             'Cải bó xôi baby trồng thủy canh trong nhà kính, lá non mềm, vị ngọt nhẹ, thích hợp làm salad, sinh tố xanh hoặc xào tỏi. Thu hoạch trong ngày giao, không qua kho trung chuyển.',
             $colGreen, 4.8, 1, 1, 1, 2, 'túi 300g',
             'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&auto=format&fit=crop&q=80|https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80|https://images.unsplash.com/photo-1595855759920-86582396756c?w=800&auto=format&fit=crop&q=80',
             'Hữu cơ|VietGAP|Không thuốc BVTV',
             'Năng lượng:23 kcal / 100g|Vitamin A:469% nhu cầu hàng ngày|Vitamin K:604% nhu cầu hàng ngày|Sắt:2.7 mg / 100g|Chất xơ:2.2 g / 100g', 980, 42],

            [1, 'Xà lách Romaine', 'xa-lach-romaine',
             'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=700&auto=format&fit=crop&q=80',
             18000, null, '',
             'Xà lách Romaine lá dài, giòn mát, vị thanh nhẹ — lựa chọn quen thuộc cho salad và cuốn rau sạch mỗi ngày.',
             $colGreen, 4.5, 1, 0, 0, 3, 'bó', '', 'Hữu cơ', '', 540, 60],

            [1, 'Cải xoăn Kale', 'cai-xoan-kale',
             'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=700&auto=format&fit=crop&q=80',
             35000, null, 'Mới',
             'Cải xoăn Kale giàu chất xơ và vitamin, lá dày giòn — phù hợp ép nước, xào nhanh hoặc làm salad kiểu Âu.',
             $colGreen, 4.6, 1, 0, 1, 4, 'túi 250g', '', 'Hữu cơ|VietGAP', '', 320, 30],

            [1, 'Cải ngọt', 'cai-ngot',
             'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=700&auto=format&fit=crop&q=80',
             14000, null, '',
             'Cải ngọt tươi non, thân mềm dễ chế biến — món rau luộc, xào tỏi quen thuộc trong bữa cơm gia đình Việt.',
             $colGreen, 4.4, 1, 0, 0, 5, 'bó', '', 'Hữu cơ', '', 610, 70],

            [1, 'Rau dền đỏ', 'rau-den-do',
             'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=700&auto=format&fit=crop&q=80',
             16000, null, '',
             'Rau dền đỏ giàu sắt, lá mềm ngọt mát — thường dùng nấu canh giải nhiệt ngày hè.',
             $colRed, 4.3, 1, 0, 0, 6, 'bó', '', 'Hữu cơ', '', 210, 40],

            // ── Củ quả tươi (category 2) ─────────────────────────────────────────
            [2, 'Cà chua bi Đà Lạt', 'ca-chua-bi-da-lat',
             'https://images.unsplash.com/photo-1611048267451-e6ed903d4a38?w=700&auto=format&fit=crop&q=80',
             40000, 34000, '-15%',
             'Cà chua bi Đà Lạt vị chua ngọt cân bằng, vỏ mọng căng — ăn trực tiếp, làm salad hoặc sốt mì Ý đều ngon.',
             $colRed, 4.6, 1, 1, 0, 1, 'hộp 500g', '', 'Hữu cơ|VietGAP',
             'Năng lượng:18 kcal / 100g|Vitamin C:21% nhu cầu hàng ngày|Kali:237 mg / 100g', 860, 55],

            [2, 'Khoai lang mật', 'khoai-lang-mat',
             'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=700&auto=format&fit=crop&q=80',
             32000, null, '',
             'Khoai lang mật ruột vàng cam, vị ngọt đậm tự nhiên khi hấp hoặc nướng — món ăn vặt lành mạnh cho cả gia đình.',
             $colOrange, 4.5, 1, 1, 0, 2, 'kg', '', 'Hữu cơ', '', 700, 48],

            [2, 'Bí đỏ hồ lô', 'bi-do-ho-lo',
             'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=700&auto=format&fit=crop&q=80',
             22000, null, '',
             'Bí đỏ hồ lô ruột chắc, bở ngọt — thích hợp nấu canh, hầm xương hoặc làm súp bí đỏ cho bé.',
             $colOrange, 4.4, 1, 1, 0, 3, 'kg', '', 'Hữu cơ', '', 430, 66],

            [2, 'Dưa leo baby', 'dua-leo-baby',
             'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=700&auto=format&fit=crop&q=80',
             26000, null, '',
             'Dưa leo baby giòn mọng, ít hạt — ăn sống, làm salad hoặc ép nước detox đều thích hợp.',
             $colGreen, 4.3, 1, 0, 0, 4, 'kg', '', 'Hữu cơ|Không thuốc BVTV', '', 380, 52],

            [2, 'Cà rốt baby', 'ca-rot-baby',
             'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=700&auto=format&fit=crop&q=80',
             25000, null, '',
             'Cà rốt baby củ nhỏ đều, ngọt giòn tự nhiên — ăn sống chấm sốt hoặc xào thập cẩm cho bé đều hợp.',
             $colOrange, 4.5, 1, 0, 0, 5, 'kg', '', 'Hữu cơ|VietGAP', '', 300, 40],

            [2, 'Củ dền đỏ', 'cu-den-do',
             'https://images.unsplash.com/photo-1611048267451-e6ed903d4a38?w=700&auto=format&fit=crop&q=80',
             24000, null, '',
             'Củ dền đỏ giàu chất chống oxy hóa, vị ngọt đất đặc trưng — nấu canh hoặc ép nước đều rất tốt cho sức khỏe.',
             $colRed, 4.2, 1, 0, 0, 6, 'kg', '', 'Hữu cơ', '', 180, 35],

            [2, 'Bắp ngô ngọt', 'bap-ngo-ngot',
             'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=700&auto=format&fit=crop&q=80',
             18000, null, '',
             'Bắp ngô ngọt hạt căng mọng, hấp hoặc luộc lên có vị ngọt tự nhiên không cần thêm đường.',
             $colYellow, 4.4, 1, 0, 0, 7, 'kg', '', 'Hữu cơ', '', 260, 45],

            // ── Rau gia vị (category 3) ───────────────────────────────────────────
            [3, 'Rau thơm tổng hợp', 'rau-thom-tong-hop',
             'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=700&auto=format&fit=crop&q=80',
             12000, null, '',
             'Combo rau thơm gồm húng quế, tía tô, kinh giới — đủ dùng cho các món cuốn và bún, phở tại nhà.',
             $colGreen, 4.3, 1, 0, 0, 1, 'bó', '', 'Hữu cơ', '', 420, 90],

            [3, 'Hành lá', 'hanh-la',
             'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=700&auto=format&fit=crop&q=80',
             10000, null, '',
             'Hành lá tươi xanh, thân giòn thơm — gia vị không thể thiếu cho món canh, cháo và các món xào.',
             $colGreen, 4.2, 1, 0, 0, 2, 'bó', '', 'Hữu cơ', '', 500, 100],

            [3, 'Rau mùi (ngò)', 'rau-mui-ngo',
             'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=700&auto=format&fit=crop&q=80',
             8000, null, '',
             'Rau mùi thơm nhẹ, thường dùng rắc lên món canh, phở hoặc gỏi để tăng hương vị.',
             $colGreen, 4.1, 1, 0, 0, 3, 'bó', '', 'Hữu cơ', '', 350, 80],

            // ── Trái cây sạch (category 4) ────────────────────────────────────────
            [4, 'Bơ sáp 034', 'bo-sap-034',
             'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=700&auto=format&fit=crop&q=80',
             55000, null, 'Mới',
             'Bơ sáp 034 Đắk Lắk cơm vàng dẻo béo, hạt nhỏ — chín tự nhiên, không dùng thuốc giấm chín.',
             $colGreen, 4.7, 1, 1, 1, 1, 'kg', '', 'Hữu cơ|VietGAP', '', 610, 38],

            [4, 'Chuối già hương', 'chuoi-gia-huong',
             'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=700&auto=format&fit=crop&q=80',
             28000, null, '',
             'Chuối già hương chín cây tự nhiên, vị ngọt thơm đậm — trái cây tráng miệng quen thuộc mỗi ngày.',
             $colYellow, 4.5, 1, 0, 0, 2, 'nải', '', 'Hữu cơ', '', 400, 50],

            [4, 'Cam sành', 'cam-sanh',
             'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=700&auto=format&fit=crop&q=80',
             45000, null, '',
             'Cam sành mọng nước, vị chua ngọt hài hòa — ép nước hoặc ăn trực tiếp đều bổ sung vitamin C dồi dào.',
             $colOrange, 4.6, 1, 0, 0, 3, 'kg', '', 'Hữu cơ|VietGAP', '', 320, 42],

            [4, 'Dưa hấu không hạt', 'dua-hau-khong-hat',
             'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=700&auto=format&fit=crop&q=80',
             35000, null, '',
             'Dưa hấu không hạt ruột đỏ mọng, ngọt mát giải nhiệt — tiện lợi cho cả gia đình, không lo nhả hạt.',
             $colRed, 4.4, 1, 0, 0, 4, 'quả', '', 'Hữu cơ', '', 250, 25],

            // ── Combo rau củ tuần (category 5) ────────────────────────────────────
            [5, 'Combo rau củ 7 ngày', 'combo-rau-cu-7-ngay',
             'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=700&auto=format&fit=crop&q=80',
             189000, null, 'Combo',
             'Combo 7 ngày gồm rau ăn lá, củ quả và rau gia vị được cân đối sẵn theo khẩu phần gia đình 4 người — tiết kiệm thời gian đi chợ mỗi ngày.',
             $colGreen, 4.9, 1, 1, 0, 1, 'combo', '', 'Hữu cơ', '', 320, 20],

            [5, 'Combo rau củ gia đình', 'combo-rau-cu-gia-dinh',
             'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=700&auto=format&fit=crop&q=80',
             259000, null, 'Combo',
             'Combo rau củ đầy đủ cho gia đình đông người, gồm đa dạng rau ăn lá, củ quả và trái cây theo mùa.',
             $colGreen, 4.8, 1, 0, 0, 2, 'combo', '', 'Hữu cơ', '', 180, 15],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO products
                (category_id, name, slug, image, price, price_sale, badge, description, colors, rating, in_stock,
                 is_featured, is_new, sort_order, unit, gallery, tags, nutrition, sold_count, stock_qty)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($products as $p) { $stmt->execute($p); }
    }

    private function seedCoupons(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM coupons")->fetchColumn();
        if ($count > 0) return;
        $coupons = [
            ['RAUXANH10', 'percent', 10, 150000, 500, 0, null, 1],
            ['FREESHIP20', 'fixed',   20000, 200000, null, 0, null, 1],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO coupons (code, type, value, min_order, max_uses, used_count, expires_at, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($coupons as $c) { $stmt->execute($c); }
    }
}
