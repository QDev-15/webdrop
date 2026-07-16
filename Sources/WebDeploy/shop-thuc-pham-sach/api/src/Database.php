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
            ['site_name',        'Tươi Mỗi Ngày',                                       'general'],
            ['site_slogan',      'Thực phẩm sạch, tươi mỗi ngày',                        'general'],
            ['site_email',       'lienhe@tenshop.vn',                                    'general'],
            ['site_phone',       '0900 000 000',                                         'general'],
            ['site_address',     '123 Đường ABC, Phường Bến Nghé, Quận 1, TP.HCM',        'general'],
            ['working_hours',    '7:00 – 21:00 (Cả tuần)',                                'general'],
            ['site_description', 'Rau củ hữu cơ, thịt cá tươi, gạo & đồ khô — chọn lọc từ nông trại liên kết, truy xuất nguồn gốc rõ ràng, giao đến tận bếp nhà bạn trong ngày.', 'general'],
            ['site_logo',        '', 'general'],
            ['site_favicon',     '', 'general'],
            ['zalo_number',      '0900000000', 'general'],

            // ── SEO ──────────────────────────────────────────────────────────────
            ['meta_title',       'Tươi Mỗi Ngày — Thực Phẩm Sạch, Tươi Mỗi Ngày', 'seo'],
            ['meta_description', 'Rau củ hữu cơ, thịt cá tươi, gạo & đồ khô truy xuất nguồn gốc rõ ràng, giao hàng lạnh trong ngày. Đạt chuẩn VietGAP — không thuốc bảo vệ thực vật.', 'seo'],
            ['og_image', '', 'seo'],
            ['ga_id',    '', 'seo'],
            ['gtm_id',   '', 'seo'],

            // ── Social (template chỉ có Facebook / Instagram / Zalo) ────────────────
            ['facebook',  'https://www.facebook.com/tuoimoingay',  'social'],
            ['instagram', 'https://www.instagram.com/tuoimoingay', 'social'],
            ['zalo',      'https://zalo.me/0900000000',            'social'],

            // ── Home: Hero (H4 Centered Minimal) ─────────────────────────────────────
            ['hero_tag',   '100% Organic — Đạt chuẩn VietGAP', 'home'],
            ['hero_note',  'Giao hàng lạnh trong 2–4 giờ tại nội thành · Hoàn tiền nếu không hài lòng', 'home'],
            ['hero_float_num',    '120', 'home'],
            ['hero_float_suffix', '+',   'home'],
            ['hero_float_label',  'nông trại liên kết trên khắp Việt Nam', 'home'],

            // ── Home: Trust strip (5 mục cố định trong template — không cần quản lý qua admin) ──
            // (Đạt chuẩn VietGAP / Không thuốc BVTV / Truy xuất nguồn gốc / Chuỗi lạnh khép kín / Đổi trả trong 24h — render tĩnh trong HomePage)

            // ── Home: Commitments (FEATURE-ICON-ROW, 4 mục) ──────────────────────────
            ['commit1_icon',  'flower1', 'home'],
            ['commit1_title', '100% tự nhiên', 'home'],
            ['commit1_desc',  'Không chất bảo quản, không phẩm màu, không biến đổi gen — đúng như thiên nhiên vốn có.', 'home'],
            ['commit2_icon',  'qr-code-scan', 'home'],
            ['commit2_title', 'Nguồn gốc rõ ràng', 'home'],
            ['commit2_desc',  'Quét mã QR để xem thông tin nông trại, ngày thu hoạch của từng lô hàng.', 'home'],
            ['commit3_icon',  'snow', 'home'],
            ['commit3_title', 'Giao hàng lạnh trong ngày', 'home'],
            ['commit3_desc',  'Xe chuyên dụng bảo quản lạnh, đảm bảo độ tươi đến tận cửa nhà bạn.', 'home'],
            ['commit4_icon',  'arrow-repeat', 'home'],
            ['commit4_title', 'Cam kết hoàn tiền', 'home'],
            ['commit4_desc',  'Hoàn tiền 100% nếu sản phẩm không đạt chuẩn chất lượng đã công bố.', 'home'],

            // ── Home: Timeline "Từ nông trại đến bàn ăn" (4 bước) ────────────────────
            ['timeline1_title', 'Thu hoạch mỗi sáng sớm', 'home'],
            ['timeline1_desc',  'Nông sản được thu hoạch trực tiếp tại các nông trại liên kết ngay trong ngày, đảm bảo độ tươi tối đa.', 'home'],
            ['timeline2_title', 'Kiểm định chất lượng', 'home'],
            ['timeline2_desc',  'Test dư lượng thuốc bảo vệ thực vật, đối chiếu chuẩn VietGAP/Organic trước khi nhập kho.', 'home'],
            ['timeline3_title', 'Đóng gói & bảo quản lạnh', 'home'],
            ['timeline3_desc',  'Sản phẩm được đóng gói trong chuỗi lạnh khép kín, gắn mã QR truy xuất nguồn gốc từng lô hàng.', 'home'],
            ['timeline4_title', 'Giao hàng trong ngày', 'home'],
            ['timeline4_desc',  'Xe lạnh chuyên dụng giao tận nơi trong 2–4 giờ, đảm bảo thực phẩm tươi ngon khi đến bếp nhà bạn.', 'home'],

            // ── Home: Brand story (ALTERNATING-STRIPS, 2 dòng) ───────────────────────
            ['story1_badge', 'Nông trại liên kết', 'home'],
            ['story1_title_strong', '120+ nông trại trên', 'home'],
            ['story1_title_post',   'khắp Việt Nam', 'home'],
            ['story1_text',  'Chúng tôi hợp tác trực tiếp với các nông trại canh tác theo hướng hữu cơ tại Đà Lạt, Mộc Châu, Long An — cắt bỏ khâu trung gian để mang đến giá tốt nhất cho khách hàng.', 'home'],
            ['story1_list1', 'Ký hợp đồng bao tiêu dài hạn với nông dân', 'home'],
            ['story1_list2', 'Hỗ trợ kỹ thuật canh tác hữu cơ', 'home'],
            ['story1_list3', 'Kiểm tra định kỳ chất lượng đất & nước', 'home'],
            ['story1_image', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=700&auto=format&fit=crop&q=80', 'home'],
            ['story2_badge', 'Cam kết chất lượng', 'home'],
            ['story2_title_strong', 'Không hóa chất,', 'home'],
            ['story2_title_post',   'không biến đổi gen', 'home'],
            ['story2_text',  'Mọi sản phẩm đều được xét nghiệm dư lượng thuốc bảo vệ thực vật tại phòng lab độc lập trước khi đến tay khách hàng — an tâm cho từng bữa ăn gia đình.', 'home'],
            ['story2_list1', 'Xét nghiệm dư lượng tại lab độc lập', 'home'],
            ['story2_list2', 'Không sử dụng chất bảo quản', 'home'],
            ['story2_list3', 'Bao bì thân thiện môi trường', 'home'],
            ['story2_image', 'https://images.unsplash.com/photo-1666063425838-0073a360c4f1?w=700&auto=format&fit=crop&q=80', 'home'],

            // ── Home: Stats (STAT-BAR, 4 mục) ────────────────────────────────────────
            ['stat1_num', '120',   'home'], ['stat1_suffix', '+', 'home'], ['stat1_label', 'Nông trại liên kết', 'home'],
            ['stat2_num', '500',   'home'], ['stat2_suffix', '+', 'home'], ['stat2_label', 'Sản phẩm sạch', 'home'],
            ['stat3_num', '15000', 'home'], ['stat3_suffix', '+', 'home'], ['stat3_label', 'Khách hàng tin dùng', 'home'],
            ['stat4_num', '8',     'home'], ['stat4_suffix', '',  'home'], ['stat4_label', 'Năm kinh nghiệm', 'home'],

            // ── Home: Newsletter ──────────────────────────────────────────────────────
            ['newsletter_title', 'Nhận ưu đãi & tin nông sản mới', 'home'],
            ['newsletter_desc',  'Đăng ký để nhận mã giảm giá 10.000đ cho đơn hàng đầu tiên.', 'home'],

            // ── Reviews (HORIZONTAL-SCROLL, 4 đánh giá) ──────────────────────────────
            ['review1_name',     'Chị Hương', 'reviews'],
            ['review1_location', 'Quận 2, TP.HCM', 'reviews'],
            ['review1_content',  'Rau ở đây tươi thật sự, mua buổi sáng là còn dính sương. Gia đình mình chuyển hẳn sang dùng đồ ở đây được 6 tháng rồi.', 'reviews'],
            ['review1_rating',   '5', 'reviews'],
            ['review2_name',     'Anh Tuấn', 'reviews'],
            ['review2_location', 'Cầu Giấy, Hà Nội', 'reviews'],
            ['review2_content',  'Thích nhất là mã QR truy xuất nguồn gốc — biết chính xác rau mua từ nông trại nào, thu hoạch ngày nào. Rất yên tâm.', 'reviews'],
            ['review2_rating',   '5', 'reviews'],
            ['review3_name',     'Chị Lan Anh', 'reviews'],
            ['review3_location', 'Thủ Đức, TP.HCM', 'reviews'],
            ['review3_content',  'Giao hàng nhanh, đóng gói giữ lạnh cẩn thận. Thịt gà ức không có mùi kháng sinh như mấy chỗ khác.', 'reviews'],
            ['review3_rating',   '5', 'reviews'],
            ['review4_name',     'Chị Minh Thư', 'reviews'],
            ['review4_location', 'Hải Châu, Đà Nẵng', 'reviews'],
            ['review4_content',  'Giá hợp lý hơn mình nghĩ so với chất lượng nhận được. Đặt online tiện, có app theo dõi đơn hàng rõ ràng.', 'reviews'],
            ['review4_rating',   '5', 'reviews'],

            // ── Footer ───────────────────────────────────────────────────────────────
            ['footer_desc', 'Thực phẩm sạch — rau củ hữu cơ, thịt cá tươi, gạo & đồ khô truy xuất nguồn gốc rõ ràng, giao hàng lạnh mỗi ngày.', 'footer'],

            // ── Shop policy ──────────────────────────────────────────────────────────
            ['return_hours', '24', 'shop'],

            // ── Contact ──────────────────────────────────────────────────────────────
            ['contact_intro',        'Có câu hỏi về sản phẩm, đơn hàng hoặc muốn hợp tác nông trại? Gửi tin nhắn cho chúng tôi, đội ngũ sẽ phản hồi trong vòng 24 giờ.', 'contact'],
            ['contact_delivery_note','Giao hàng lạnh trong 2–4 giờ tại nội thành', 'contact'],
            ['map_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4952!2d106.700!3d10.776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzMzLjYiTiAxMDbCsDQyJzAwLjAiRQ!5e0!3m2!1svi!2s!4v1700000000000', 'contact'],

            // ── Payment (tab "💳 Thanh toán") ────────────────────────────────────────
            ['payment_cod_enabled',      '1', 'payment'],
            ['payment_sepay_enabled',    '0', 'payment'],
            ['sepay_bank_code',          '',  'payment'],
            ['sepay_account_number',     '',  'payment'],
            ['sepay_account_name',       '',  'payment'],
            ['sepay_webhook_secret',     '',  'payment'],
            ['shipping_fee',             '15000',  'payment'],
            ['free_shipping_threshold',  '300000', 'payment'],

            // ── SMTP ─────────────────────────────────────────────────────────────────
            ['smtp_host',      '', 'smtp'],
            ['smtp_port',      '587', 'smtp'],
            ['smtp_user',      '', 'smtp'],
            ['smtp_pass',      '', 'smtp'],
            ['smtp_from',      '', 'smtp'],
            ['smtp_from_name', 'Tươi Mỗi Ngày', 'smtp'],

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
                'Thực phẩm sạch, tươi mỗi ngày',
                'Rau củ hữu cơ, thịt cá tươi, gạo & đồ khô — chọn lọc từ nông trại liên kết, truy xuất nguồn gốc rõ ràng, giao đến tận bếp nhà bạn trong ngày.',
                'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1400&auto=format&fit=crop&q=80',
                'Khám phá sản phẩm', '/san-pham', 1, 'published',
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
            ['Rau Củ Hữu Cơ',       'rau-cu-huu-co',       'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80', 1],
            ['Trái Cây Tươi',       'trai-cay-tuoi',       'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&auto=format&fit=crop&q=80', 2],
            ['Thịt & Hải Sản Sạch', 'thit-hai-san-sach',   'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&auto=format&fit=crop&q=80', 3],
            ['Gạo & Ngũ Cốc',       'gao-ngu-coc',         'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80', 4],
            ['Trứng & Sữa Tươi',    'trung-sua-tuoi',      'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=500&auto=format&fit=crop&q=80', 5],
            ['Gia Vị & Đồ Khô',     'gia-vi-do-kho',       'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80', 6],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO product_categories (name, slug, image, sort_order) VALUES (?, ?, ?, ?)"
        );
        foreach ($cats as $c) { $stmt->execute($c); }
    }

    private function seedProducts(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
        if ($count > 0) return;

        $colGreen  = 'Xanh lá:#3f7d4a';
        $colRed    = 'Đỏ:#c0392b';
        $colOrange = 'Cam:#d97706';
        $colYellow = 'Vàng:#dbb42c';

        // [category_id, name, slug, image, price, price_sale, badge, description, colors, rating, in_stock,
        //  is_featured, is_new, sort_order, unit, certs, gallery, nutrition, origin_farm, harvest_note, sold_count, stock_qty]
        $products = [
            // ── Rau Củ Hữu Cơ (category 1) ────────────────────────────────────────
            [1, 'Rau muống hữu cơ', 'rau-muong-huu-co',
             'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=700&auto=format&fit=crop&q=80',
             18000, null, 'Bán chạy',
             'Rau muống hữu cơ trồng theo tiêu chuẩn VietGAP tại nông trại Đà Lạt, không thuốc bảo vệ thực vật, thu hoạch trong ngày và giao đến bạn khi còn tươi nguyên.',
             $colGreen, 4.9, 1, 1, 0, 1, 'bó 300g', 'VietGAP|Organic',
             'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80|https://images.unsplash.com/photo-1517191434949-30e9a984de84?w=800&auto=format&fit=crop&q=80|https://images.unsplash.com/photo-1595855709577-98d0e6e6a01d?w=800&auto=format&fit=crop&q=80',
             'Khối lượng:300g / bó|Năng lượng:19 kcal / 100g|Chất xơ:2.1g / 100g|Vitamin A, C:Hàm lượng cao|Hạn sử dụng:2 ngày kể từ khi giao (bảo quản lạnh)',
             'Nông trại hữu cơ Đà Lạt — mã NT-0182', 'Thu hoạch trong vòng 24 giờ trước khi giao', 2340, 120],

            [1, 'Cà chua bi hữu cơ', 'ca-chua-bi-huu-co',
             'https://images.unsplash.com/photo-1737963181484-450b15ca0ae4?w=700&auto=format&fit=crop&q=80',
             32000, null, 'Organic',
             'Cà chua bi hữu cơ vị chua ngọt cân bằng, vỏ mọng căng — ăn trực tiếp, làm salad hoặc sốt mì Ý đều ngon.',
             $colRed, 4.8, 1, 0, 0, 2, 'khay 500g', 'VietGAP|Organic', '',
             'Năng lượng:18 kcal / 100g|Vitamin C:21% nhu cầu hàng ngày|Kali:237 mg / 100g',
             'Nông trại liên kết Đà Lạt', '', 860, 55],

            [1, 'Cải xanh hữu cơ', 'cai-xanh-huu-co',
             'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop&q=80',
             16000, null, '',
             'Cải xanh hữu cơ lá non mềm, vị ngọt nhẹ — món rau luộc, xào tỏi quen thuộc trong bữa cơm gia đình Việt.',
             $colGreen, 4.6, 1, 0, 0, 3, 'bó', 'Organic', '', '', '', '', 420, 60],

            [1, 'Xà lách hữu cơ', 'xa-lach-huu-co',
             'https://images.unsplash.com/photo-1517191434949-30e9a984de84?w=700&auto=format&fit=crop&q=80',
             14000, null, '',
             'Xà lách hữu cơ giòn mát, vị thanh nhẹ — lựa chọn quen thuộc cho salad và cuốn rau sạch mỗi ngày.',
             $colGreen, 4.5, 1, 0, 0, 4, 'gói 200g', 'Organic', '', '', '', '', 310, 45],

            [1, 'Cải bó xôi hữu cơ', 'cai-bo-xoi-huu-co',
             'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?w=700&auto=format&fit=crop&q=80',
             28000, null, 'Mới',
             'Cải bó xôi hữu cơ trồng thủy canh trong nhà kính, lá non mềm, thích hợp làm salad, sinh tố xanh hoặc xào tỏi.',
             $colGreen, 4.7, 1, 0, 1, 5, 'túi 250g', 'VietGAP|Organic', '',
             'Vitamin A:469% nhu cầu hàng ngày|Sắt:2.7 mg / 100g',
             '', '', 280, 38],

            // ── Trái Cây Tươi (category 2) ────────────────────────────────────────
            [2, 'Bơ sáp Đắk Lắk', 'bo-sap-dak-lak',
             'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=700&auto=format&fit=crop&q=80',
             68000, null, '',
             'Bơ sáp Đắk Lắk cơm vàng dẻo béo, hạt nhỏ — chín tự nhiên, không dùng thuốc giấm chín.',
             $colGreen, 4.9, 1, 1, 0, 1, 'kg', 'VietGAP', '', '', '', '', 610, 38],

            [2, 'Cam sành Hà Giang', 'cam-sanh-ha-giang',
             'https://images.unsplash.com/photo-1547514701-42782101795e?w=700&auto=format&fit=crop&q=80',
             45000, null, '',
             'Cam sành Hà Giang mọng nước, vị chua ngọt hài hòa — ép nước hoặc ăn trực tiếp đều bổ sung vitamin C dồi dào.',
             $colOrange, 4.6, 1, 0, 0, 2, 'kg', 'VietGAP', '', '', '', '', 320, 42],

            [2, 'Xoài cát Hòa Lộc', 'xoai-cat-hoa-loc',
             'https://images.unsplash.com/photo-1553279768-865429fa0078?w=700&auto=format&fit=crop&q=80',
             89000, null, 'Mới',
             'Xoài cát Hòa Lộc thịt vàng dày, vị ngọt thơm đặc trưng — trái cây tráng miệng cao cấp được ưa chuộng nhất mùa.',
             $colYellow, 4.8, 1, 0, 1, 3, 'kg', 'VietGAP', '', '', '', '', 260, 30],

            [2, 'Thanh long ruột đỏ', 'thanh-long-ruot-do',
             'https://images.unsplash.com/photo-1527325678964-54921661f888?w=700&auto=format&fit=crop&q=80',
             42000, null, '',
             'Thanh long ruột đỏ ngọt mát giải nhiệt, giàu chất chống oxy hóa — món tráng miệng lành mạnh cho cả gia đình.',
             $colRed, 4.5, 1, 0, 0, 4, 'kg', 'VietGAP', '', '', '', '', 240, 34],

            // ── Thịt & Hải Sản Sạch (category 3) ────────────────────────────────────
            [3, 'Ức gà sạch không kháng sinh', 'uc-ga-sach-khong-khang-sinh',
             'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=700&auto=format&fit=crop&q=80',
             62000, null, '',
             'Ức gà nuôi theo quy trình sạch, không sử dụng kháng sinh và tăng trọng — thịt săn chắc, phù hợp chế độ ăn lành mạnh.',
             $colRed, 4.7, 1, 1, 0, 1, '500g', '', '',
             'Năng lượng:110 kcal / 100g|Protein:23g / 100g',
             '', '', 540, 40],

            [3, 'Tôm sú tươi sống', 'tom-su-tuoi-song',
             'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=700&auto=format&fit=crop&q=80',
             255000, 300000, '-15%',
             'Tôm sú tươi sống size lớn, đánh bắt và vận chuyển trong chuỗi lạnh khép kín — vị ngọt đậm, thịt chắc.',
             $colRed, 4.8, 1, 0, 0, 2, 'kg', '', '', '', '', '', 310, 22],

            [3, 'Thịt ba chỉ heo sạch', 'thit-ba-chi-heo-sach',
             'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=700&auto=format&fit=crop&q=80',
             89000, null, '',
             'Thịt ba chỉ heo nuôi theo chuẩn VietGAHP, không tồn dư kháng sinh — thớ thịt đều, tỷ lệ nạc mỡ cân đối.',
             $colRed, 4.6, 1, 0, 0, 3, '500g', 'VietGAP', '', '', '', '', 280, 36],

            [3, 'Cá basa phi lê tươi', 'ca-basa-phi-le-tuoi',
             'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=700&auto=format&fit=crop&q=80',
             55000, null, '',
             'Cá basa phi lê lọc xương sẵn, nuôi trong môi trường nước sạch được kiểm định — tiện lợi cho bữa cơm hàng ngày.',
             $colRed, 4.4, 1, 0, 0, 4, '500g', '', '', '', '', '', 190, 28],

            [3, 'Chả cá thác lác tự nhiên', 'cha-ca-thac-lac-tu-nhien',
             'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=700&auto=format&fit=crop&q=80',
             68000, null, '',
             'Chả cá thác lác quết tay từ cá tươi tự nhiên, không hàn the, không chất bảo quản — dai ngon đúng vị.',
             $colRed, 4.5, 1, 0, 0, 5, '300g', '', '', '', '', '', 150, 25],

            // ── Gạo & Ngũ Cốc (category 4) ────────────────────────────────────────
            [4, 'Gạo ST25', 'gao-st25',
             'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=700&auto=format&fit=crop&q=80',
             175000, null, 'Mới',
             'Gạo ST25 — giống lúa đạt danh hiệu gạo ngon nhất thế giới, hạt gạo dẻo thơm tự nhiên, không pha trộn.',
             $colYellow, 5.0, 1, 1, 1, 1, 'túi 5kg', '',
             '',
             'Năng lượng:130 kcal / 100g (đã nấu)|Carbohydrate:28g / 100g (đã nấu)',
             '', '', 980, 65],

            [4, 'Gạo lứt huyết rồng', 'gao-lut-huyet-rong',
             'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=700&auto=format&fit=crop&q=80',
             68000, null, '',
             'Gạo lứt huyết rồng nguyên cám, giàu chất xơ và vi chất — phù hợp chế độ ăn kiêng, hỗ trợ tiêu hóa.',
             $colRed, 4.6, 1, 0, 0, 2, 'túi 2kg', '', '', '', '', '', 320, 40],

            [4, 'Yến mạch nguyên hạt', 'yen-mach-nguyen-hat',
             'https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?w=700&auto=format&fit=crop&q=80',
             55000, null, '',
             'Yến mạch nguyên hạt nhập khẩu, giàu chất xơ hòa tan — dùng nấu cháo, pha sữa hoặc làm granola tại nhà.',
             $colYellow, 4.5, 1, 0, 0, 3, 'túi 1kg', '', '', '', '', '', 260, 48],

            [4, 'Đậu xanh hữu cơ', 'dau-xanh-huu-co',
             'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=700&auto=format&fit=crop&q=80',
             32000, null, '',
             'Đậu xanh hữu cơ hạt đều, không mọt — nấu chè, xôi hoặc làm giá đỗ tại nhà đều thơm ngon.',
             $colGreen, 4.4, 1, 0, 0, 4, 'túi 500g', 'Organic', '', '', '', '', 210, 50],

            // ── Trứng & Sữa Tươi (category 5) ───────────────────────────────────────
            [5, 'Trứng gà ta hữu cơ', 'trung-ga-ta-huu-co',
             'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=700&auto=format&fit=crop&q=80',
             45000, null, '',
             'Trứng gà ta nuôi thả vườn theo hướng hữu cơ, lòng đỏ đậm màu tự nhiên — an toàn cho cả trẻ nhỏ.',
             $colYellow, 4.9, 1, 1, 0, 1, 'hộp 10 quả', 'Organic',
             '', 'Năng lượng:143 kcal / 100g|Protein:13g / 100g',
             '', '', 720, 80],

            [5, 'Trứng vịt tươi', 'trung-vit-tuoi',
             'https://images.unsplash.com/photo-1569288052389-dac9b0ac9efd?w=700&auto=format&fit=crop&q=80',
             55000, null, '',
             'Trứng vịt tươi từ trang trại nuôi thả tự nhiên — lòng đỏ béo bùi, phù hợp cho món luộc, kho hoặc làm bánh.',
             $colYellow, 4.3, 1, 0, 0, 2, 'chục', '', '', '', '', '', 180, 30],

            [5, 'Sữa tươi thanh trùng', 'sua-tuoi-thanh-trung',
             'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=700&auto=format&fit=crop&q=80',
             42000, null, '',
             'Sữa tươi thanh trùng nguyên chất không đường, không chất bảo quản — giữ trọn dưỡng chất tự nhiên từ nông trại bò sữa.',
             $colYellow, 4.6, 1, 0, 0, 3, 'chai 1L', '', '', '', '', '', 260, 44],

            [5, 'Sữa chua hữu cơ nguyên chất', 'sua-chua-huu-co-nguyen-chat',
             'https://images.unsplash.com/photo-1571212515416-fca988083b70?w=700&auto=format&fit=crop&q=80',
             38000, null, '',
             'Sữa chua hữu cơ lên men tự nhiên, không đường tinh luyện — hỗ trợ tiêu hóa, phù hợp cho cả gia đình.',
             $colYellow, 4.7, 1, 0, 0, 4, 'hộp 4 hũ', 'Organic', '', '', '', '', 300, 52],

            // ── Gia Vị & Đồ Khô (category 6) ──────────────────────────────────────
            [6, 'Mật ong rừng nguyên chất', 'mat-ong-rung-nguyen-chat',
             'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=700&auto=format&fit=crop&q=80',
             195000, null, 'Organic',
             'Mật ong rừng nguyên chất thu hoạch từ vùng núi Tây Nguyên, không pha trộn đường — vị ngọt thanh tự nhiên.',
             $colOrange, 5.0, 1, 1, 0, 1, 'chai 500ml', 'Organic', '', '', '', '', 640, 34],

            [6, 'Nấm hương khô Đà Lạt', 'nam-huong-kho-da-lat',
             'https://images.unsplash.com/photo-1713084873964-18546ce8e93c?w=700&auto=format&fit=crop&q=80',
             88000, null, '',
             'Nấm hương khô Đà Lạt phơi tự nhiên, hương thơm đậm đà — dùng nấu súp, hầm hoặc xào đều dậy mùi.',
             $colOrange, 4.6, 1, 0, 0, 2, 'gói 200g', '', '', '', '', '', 420, 48],

            [6, 'Tiêu đen Phú Quốc', 'tieu-den-phu-quoc',
             'https://images.unsplash.com/photo-1599909533144-c4a86d0e2cbe?w=700&auto=format&fit=crop&q=80',
             45000, null, '',
             'Tiêu đen Phú Quốc hạt chắc, cay nồng đặc trưng — gia vị không thể thiếu trong gian bếp Việt.',
             $colRed, 4.7, 1, 0, 0, 3, 'gói 100g', '', '', '', '', '', 380, 55],

            [6, 'Nước mắm nhĩ truyền thống', 'nuoc-mam-nhi-truyen-thong',
             'https://images.unsplash.com/photo-1611574474484-6f9fd50b6b1f?w=700&auto=format&fit=crop&q=80',
             65000, null, '',
             'Nước mắm nhĩ ủ chượp truyền thống 12 tháng từ cá cơm tươi — vị đậm đà, không chất bảo quản.',
             $colOrange, 4.8, 1, 0, 0, 4, 'chai 500ml', '', '', '', '', '', 350, 40],

            [6, 'Muối tôm Tây Ninh', 'muoi-tom-tay-ninh',
             'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=700&auto=format&fit=crop&q=80',
             35000, null, '',
             'Muối tôm Tây Ninh rang thủ công theo công thức gia truyền — chấm trái cây hoặc ướp món nướng đều hợp.',
             $colOrange, 4.4, 1, 0, 0, 5, 'hộp 200g', '', '', '', '', '', 260, 45],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO products
                (category_id, name, slug, image, price, price_sale, badge, description, colors, rating, in_stock,
                 is_featured, is_new, sort_order, unit, certs, gallery, nutrition, origin_farm, harvest_note, sold_count, stock_qty)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($products as $p) { $stmt->execute($p); }
    }

    private function seedCoupons(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM coupons")->fetchColumn();
        if ($count > 0) return;
        $coupons = [
            ['TUOI10',    'percent', 10,    150000, 500, 0, null, 1],
            ['FREESHIP', 'fixed',   15000, 200000, null, 0, null, 1],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO coupons (code, type, value, min_order, max_uses, used_count, expires_at, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($coupons as $c) { $stmt->execute($c); }
    }
}
