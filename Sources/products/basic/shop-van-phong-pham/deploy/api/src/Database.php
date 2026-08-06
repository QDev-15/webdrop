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
            ['site_name',        'OFFICEHUB',                                                            'general'],
            ['site_slogan',      'Văn phòng phẩm chính hãng',                                             'general'],
            ['site_email',       'lienhe@officehub.vn',                                                   'general'],
            ['site_phone',       '028 3822 9988',                                                         'general'],
            ['site_address',     '145 Nguyễn Văn Trỗi, Phường 11, Quận Phú Nhuận, TP. Hồ Chí Minh',        'general'],
            ['working_hours',    'Thứ 2 – Thứ 7: 8:00 – 18:00, Nghỉ Chủ nhật và lễ',                       'general'],
            ['site_description', 'OFFICEHUB — Văn phòng phẩm chính hãng: bút viết, sổ tay, file tài liệu, dụng cụ văn phòng, balo laptop. Hơn 500 sản phẩm, giao hàng nhanh trong ngày tại TP.HCM và toàn quốc.', 'general'],
            ['site_logo',        '', 'general'],
            ['site_favicon',     '', 'general'],
            ['zalo_number',      '0938123456', 'general'],

            // ── Topbar (1 dòng thông báo, hiển thị mọi trang, tối đa 3 mục) ────────
            ['topbar_text_1', 'Miễn phí ship đơn từ 500K',   'general'],
            ['topbar_text_2', 'Đổi hàng trong 30 ngày',      'general'],
            ['topbar_text_3', 'Hỗ trợ doanh nghiệp B2B',     'general'],

            // ── SEO ──────────────────────────────────────────────────────────────
            ['meta_title',       'OFFICEHUB — Văn phòng phẩm chính hãng', 'seo'],
            ['meta_description', 'Văn phòng phẩm chính hãng: bút viết, sổ tay, file tài liệu, dụng cụ văn phòng, balo laptop. Giao hàng nhanh, giá tốt nhất TP.HCM và toàn quốc.', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?w=1200&auto=format&fit=crop&q=80', 'seo'],
            ['ga_id',    '', 'seo'],
            ['gtm_id',   '', 'seo'],

            // ── Social ───────────────────────────────────────────────────────────
            ['facebook',  '', 'social'],
            ['instagram', '', 'social'],
            ['youtube',   '', 'social'],
            ['tiktok',    '', 'social'],

            // ── Home (Search Zone — Biến thể 1 SEARCH-FIRST UNIFIED, thay thế hero ảnh) ────
            ['home_search_heading', 'Văn phòng phẩm chính hãng', 'home'],
            ['home_search_sub',     'Hơn 500 sản phẩm — giao hàng nhanh trong ngày tại TP.HCM', 'home'],

            // ── Bộ sưu tập (bo-suu-tap.html) ────────────────────────────────────────
            ['coll_hero_title', 'Bộ sưu tập', 'collection'],
            ['coll_hero_sub',   'Những bộ sưu tập được chọn lọc theo phong cách và nhu cầu làm việc', 'collection'],

            ['coll1_image', 'https://images.unsplash.com/photo-1622560481979-f5b0174242a0?w=800&auto=format&fit=crop&q=80', 'collection'],
            ['coll1_tag',   'Bút viết', 'collection'],
            ['coll1_title', 'Bút Cao Cấp', 'collection'],
            ['coll1_desc',  'Gel, bi, nước — nét mượt mà, lâu mực', 'collection'],
            ['coll1_link',  '/?category=but-viet', 'collection'],

            ['coll2_image', 'https://images.unsplash.com/photo-1568247067952-eab2ce84a349?w=800&auto=format&fit=crop&q=80', 'collection'],
            ['coll2_tag',   'Sổ tay', 'collection'],
            ['coll2_title', 'Sổ Tay Thiết Kế', 'collection'],
            ['coll2_desc',  'Bìa cứng, dotted & ruled — cho mọi phong cách ghi chép', 'collection'],
            ['coll2_link',  '/?category=so-tay', 'collection'],

            ['coll3_image', 'https://images.unsplash.com/photo-1528921581519-52b9d779df2b?w=800&auto=format&fit=crop&q=80', 'collection'],
            ['coll3_tag',   'Balo & Túi', 'collection'],
            ['coll3_title', 'Balo Laptop', 'collection'],
            ['coll3_desc',  'Chống nước, đa ngăn, vừa laptop 15.6"', 'collection'],
            ['coll3_link',  '/?category=balo-tui', 'collection'],

            ['coll4_image', 'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=800&auto=format&fit=crop&q=80', 'collection'],
            ['coll4_tag',   'Dụng cụ VP', 'collection'],
            ['coll4_title', 'Góc Làm Việc', 'collection'],
            ['coll4_desc',  'Kéo, dập ghim, bấm lỗ, hộp đựng bút — hoàn thiện bàn làm việc', 'collection'],
            ['coll4_link',  '/?category=dung-cu', 'collection'],

            ['coll_feature_eyebrow', 'Được mua nhiều nhất', 'collection'],
            ['coll_feature_title1',  'Bộ Văn Phòng Phẩm', 'collection'],
            ['coll_feature_title2',  'Trọn Gói', 'collection'],
            ['coll_feature_desc',    'Lựa chọn hoàn hảo cho công ty, trường học, văn phòng mới khai trương — đầy đủ bút, sổ, file, dụng cụ trong một đơn hàng.', 'collection'],
            ['coll_feature_item1',   'Tiết kiệm 15–25% so với mua lẻ', 'collection'],
            ['coll_feature_item2',   'Đóng gói riêng từng bộ theo yêu cầu', 'collection'],
            ['coll_feature_item3',   'Hỗ trợ in logo doanh nghiệp', 'collection'],
            ['coll_feature_item4',   'Giao hàng ngay trong ngày nội thành', 'collection'],
            ['coll_feature_image',   'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=600&auto=format&fit=crop&q=80', 'collection'],

            // ── Khuyến mãi (khuyen-mai.html) ─────────────────────────────────────────
            ['promo_hero_title', 'Khuyến mãi hôm nay', 'promo'],
            ['promo_hero_sub',   'Ưu đãi độc quyền — giảm giá đến 35%, freeship toàn quốc', 'promo'],
            ['promo_code1', 'OFFICE10',  'promo'], ['promo_code1_desc', 'Giảm 10% — không giới hạn đơn tối thiểu', 'promo'],
            ['promo_code2', 'OFFICEHUB', 'promo'], ['promo_code2_desc', 'Giảm 15% — đơn từ 300.000₫', 'promo'],
            ['promo_code3', 'VPPHAM',    'promo'], ['promo_code3_desc', 'Giảm 20% — đơn từ 500.000₫', 'promo'],

            // ── Dịch vụ doanh nghiệp (dich-vu.html) ──────────────────────────────────
            ['dv_hero_image', 'https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?w=1400&auto=format&fit=crop&q=80', 'services'],
            ['dv_hero_title1', 'Giải pháp văn phòng', 'services'],
            ['dv_hero_title2', 'cho doanh nghiệp', 'services'],
            ['dv_hero_desc', 'Từ startup nhỏ đến tập đoàn lớn — OFFICEHUB cung ứng văn phòng phẩm định kỳ, in ấn thương hiệu và quản lý đặt hàng toàn diện.', 'services'],

            ['dv_card1_title', 'Cung ứng định kỳ', 'services'],
            ['dv_card1_desc',  'Đặt lịch giao hàng hàng tuần / hàng tháng. Tự động bổ sung khi hết. Không lo thiếu hàng giữa tháng.', 'services'],
            ['dv_card1_list',  'Hợp đồng 3 / 6 / 12 tháng|Giảm thêm 5–15% theo tần suất|Nhắc nhở tự động trước 3 ngày', 'services'],
            ['dv_card2_title', 'In logo thương hiệu', 'services'],
            ['dv_card2_desc',  'In tên công ty, logo lên bút, sổ tay, balo — quà tặng nội bộ hoặc quà đối tác chuyên nghiệp.', 'services'],
            ['dv_card2_list',  'In offset / laser / thêu vi tính|Số lượng tối thiểu từ 50 chiếc|Mẫu thử miễn phí trước khi in', 'services'],
            ['dv_card3_title', 'Giao hàng ưu tiên', 'services'],
            ['dv_card3_desc',  'Giao trong 2–4 giờ nội thành TP.HCM. Tỉnh thành khác 24–48 giờ. Có shipper chuyên dụng cho đơn lớn.', 'services'],
            ['dv_card3_list',  'Giao tận tầng / phòng ban|Ký nhận điện tử, tracking thời gian thật|Không phụ phí cho đơn từ 1 triệu', 'services'],
            ['dv_card4_title', 'Hợp đồng doanh nghiệp', 'services'],
            ['dv_card4_desc',  'Xuất hóa đơn VAT, thanh toán chuyển khoản 15–30 ngày, báo cáo chi phí văn phòng phẩm theo tháng / quý.', 'services'],
            ['dv_card4_list',  'Hóa đơn điện tử hợp lệ|Công nợ linh hoạt cho đối tác lâu năm|Báo cáo tiêu dùng định kỳ', 'services'],

            ['dv_process1_title', 'Gửi yêu cầu', 'services'],
            ['dv_process1_desc',  'Điền form liên hệ hoặc gọi hotline — cho chúng tôi biết quy mô, nhu cầu và ngân sách của doanh nghiệp.', 'services'],
            ['dv_process2_title', 'Nhận báo giá', 'services'],
            ['dv_process2_desc',  'Chuyên viên tư vấn liên hệ trong vòng 2 giờ. Báo giá chi tiết, rõ ràng — không phụ thu ẩn.', 'services'],
            ['dv_process3_title', 'Ký hợp đồng', 'services'],
            ['dv_process3_desc',  'Ký số hoặc ký tay. Hợp đồng rõ điều khoản, linh hoạt điều chỉnh số lượng theo từng chu kỳ.', 'services'],
            ['dv_process4_title', 'Giao hàng & quản lý', 'services'],
            ['dv_process4_desc',  'Giao đúng lịch, xuất hóa đơn tự động, báo cáo định kỳ. Bạn tập trung việc chính — chúng tôi lo phần còn lại.', 'services'],

            ['dv_why1_title', 'Hàng chính hãng 100%', 'services'],
            ['dv_why1_desc',  'Nhập trực tiếp từ nhà phân phối chính thức. Giấy tờ kiểm định đầy đủ, có thể cung cấp khi cần cho kiểm toán.', 'services'],
            ['dv_why2_title', 'Giao hàng đúng giờ', 'services'],
            ['dv_why2_desc',  'Tỷ lệ giao đúng giờ 98.6% trong 3 năm qua. Cam kết bồi thường nếu trễ hơn 24 giờ so với lịch đã đặt.', 'services'],
            ['dv_why3_title', 'Chính sách đổi trả rõ ràng', 'services'],
            ['dv_why3_desc',  'Đổi hàng trong 30 ngày nếu lỗi nhà sản xuất. Không câu hỏi — không phụ phí. Hoàn tiền trong 3–5 ngày làm việc.', 'services'],
            ['dv_why4_title', 'Đội ngũ tư vấn tận tâm', 'services'],
            ['dv_why4_desc',  'Mỗi doanh nghiệp có 1 account manager riêng. Liên hệ qua Zalo, email hoặc điện thoại — phản hồi trong 30 phút.', 'services'],
            ['dv_why5_title', 'Giá cạnh tranh nhất thị trường', 'services'],
            ['dv_why5_desc',  'Cam kết bù giá nếu bạn tìm thấy cùng sản phẩm chính hãng rẻ hơn tại bất kỳ nhà cung cấp nào khác.', 'services'],
            ['dv_why6_title', 'Kho hàng đa dạng 500+ SKU', 'services'],
            ['dv_why6_desc',  'Luôn sẵn hàng tồn kho tối thiểu 30 ngày. Hiếm khi hết hàng — và khi hết, chúng tôi báo trước ít nhất 7 ngày.', 'services'],

            ['dv_stat1_num', '500', 'services'], ['dv_stat1_suffix', '+',   'services'], ['dv_stat1_label', 'Doanh nghiệp tin dùng',   'services'],
            ['dv_stat2_num', '8',   'services'], ['dv_stat2_suffix', '+',   'services'], ['dv_stat2_label', 'Năm kinh nghiệm',         'services'],
            ['dv_stat3_num', '98',  'services'], ['dv_stat3_suffix', '%',   'services'], ['dv_stat3_label', 'Tỷ lệ giao đúng giờ',     'services'],
            ['dv_stat4_num', '63',  'services'], ['dv_stat4_suffix', '/63', 'services'], ['dv_stat4_label', 'Tỉnh thành giao hàng',    'services'],

            ['dv_testi1_text',  '"OFFICEHUB là nhà cung cấp văn phòng phẩm duy nhất chúng tôi làm việc 4 năm nay. Giao hàng đúng giờ tuyệt đối, chất lượng ổn định, giá hợp lý hơn mua lẻ rất nhiều."', 'services'],
            ['dv_testi1_name',  'Nguyễn Thanh Minh', 'services'],
            ['dv_testi1_title', 'Trưởng phòng Hành chính — Công ty Xây dựng ABC', 'services'],
            ['dv_testi1_avatar', 'TM', 'services'],
            ['dv_testi2_text',  '"Từ khi ký hợp đồng cung ứng định kỳ, phòng hành chính tiết kiệm được khoảng 3–4 giờ mỗi tuần không cần đi mua lẻ. Hoá đơn VAT rõ ràng, dễ quyết toán."', 'services'],
            ['dv_testi2_name',  'Lê Thu Anh', 'services'],
            ['dv_testi2_title', 'CFO — Startup Fintech NextPay', 'services'],
            ['dv_testi2_avatar', 'LA', 'services'],
            ['dv_testi3_text',  '"Đặt bút in logo làm quà tặng đối tác — mẫu thử đẹp, in nét, giao đúng hạn trước sự kiện 5 ngày. Đối tác khen ngợi, chúng tôi rất hài lòng."', 'services'],
            ['dv_testi3_name',  'Phạm Quốc Hùng', 'services'],
            ['dv_testi3_title', 'Giám đốc Marketing — Tập đoàn Greenland', 'services'],
            ['dv_testi3_avatar', 'PH', 'services'],

            ['dv_policy1_title', 'Giao hàng đúng hẹn', 'services'],
            ['dv_policy1_desc',  '2–4h nội thành · 24–48h toàn quốc', 'services'],
            ['dv_policy2_title', 'Đổi trả 30 ngày', 'services'],
            ['dv_policy2_desc',  'Lỗi sản xuất — đổi miễn phí không câu hỏi', 'services'],
            ['dv_policy3_title', 'Hàng chính hãng', 'services'],
            ['dv_policy3_desc',  'Nhập khẩu chính ngạch · Đủ chứng từ kiểm định', 'services'],
            ['dv_policy4_title', 'Hóa đơn VAT', 'services'],
            ['dv_policy4_desc',  'Xuất hóa đơn điện tử · Dễ quyết toán thuế', 'services'],

            // ── Footer ───────────────────────────────────────────────────────────
            ['footer_about', 'Chuyên cung cấp văn phòng phẩm chính hãng cho cá nhân, doanh nghiệp và trường học trên toàn quốc.', 'footer'],

            // ── Liên hệ (lien-he.html) ─────────────────────────────────────────────
            ['contact_note', 'Phản hồi trong 30 phút trong giờ hành chính.', 'contact'],

            // ── Payment (tab "💳 Thanh toán") ────────────────────────────────────────
            ['payment_cod_enabled',      '1', 'payment'],
            ['payment_sepay_enabled',    '1', 'payment'],
            ['sepay_bank_code',          'MB',  'payment'],
            ['sepay_account_number',     '0099001122334',  'payment'],
            ['sepay_account_name',       'WEBDROP STORE TEST',  'payment'],
            ['sepay_webhook_secret',     'TEST_SEPAY_API_2026',  'payment'],
            ['shipping_fee',             '30000',   'payment'],
            ['free_shipping_threshold',  '500000',  'payment'],

            // ── SMTP ─────────────────────────────────────────────────────────────────
            ['smtp_host',      '', 'smtp'],
            ['smtp_port',      '587', 'smtp'],
            ['smtp_user',      '', 'smtp'],
            ['smtp_pass',      '', 'smtp'],
            ['smtp_from',      '', 'smtp'],
            ['smtp_from_name', 'OFFICEHUB', 'smtp'],

            // ── System (tab "Nâng cao") ──────────────────────────────────────────────
            ['maintenance_mode', '0', 'system'],

            // ── Cloudinary ───────────────────────────────────────────────────────────
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key',    '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            ['cloudinary_folder',     '', 'cloudinary'],

            // ── Integrations ─────────────────────────────────────────────────────────
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];

        $stmt = $this->pdo->prepare("INSERT OR IGNORE INTO settings (key, value, grp) VALUES (?, ?, ?)");
        foreach ($settings as $row) { $stmt->execute($row); }
    }

    private function seedHeroSlides(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM hero_slides")->fetchColumn();
        if ($count > 0) return;
        // Trang chủ OFFICEHUB dùng "Search Zone" (Biến thể 1 SEARCH-FIRST UNIFIED — h1 + ô tìm kiếm
        // lớn + filter toolbar + catalog đầy đủ) thay cho hero slider ảnh — template gốc không có
        // banner/slider ở index.html. Vẫn seed 1 record để giữ menu "Hero Slides" hoạt động đúng
        // chuẩn scaffold (không hiển thị trên site).
        $slides = [
            ['Search Zone trang chủ OFFICEHUB', 'Không hiển thị dạng ảnh — nội dung ô tìm kiếm quản lý ở Cài đặt > Trang chủ', '', '', '', 1, 'published'],
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
        // id: 1 Bút viết, 2 Sổ tay & giấy note, 3 File & kẹp tài liệu, 4 Dụng cụ văn phòng, 5 Balo & túi laptop
        $cats = [
            ['Bút viết',              'but-viet',  'https://images.unsplash.com/photo-1620275765334-4ed948bb4502?w=600&auto=format&fit=crop&q=80', 1],
            ['Sổ tay & giấy note',    'so-tay',    'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600&auto=format&fit=crop&q=80', 2],
            ['File & kẹp tài liệu',  'file-kep',  'https://images.unsplash.com/photo-1535957998253-26ae1ef29506?w=600&auto=format&fit=crop&q=80', 3],
            ['Dụng cụ văn phòng',    'dung-cu',   'https://images.unsplash.com/photo-1503958014551-3b41f69234d9?w=600&auto=format&fit=crop&q=80', 4],
            ['Balo & túi laptop',    'balo-tui',  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80', 5],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO product_categories (name, slug, image, sort_order) VALUES (?, ?, ?, ?)"
        );
        foreach ($cats as $c) { $stmt->execute($c); }
    }

    private function seedProducts(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
        if ($count > 0) return;

        // Danh mục slug -> id (khớp seedProductCategories ở trên)
        $catId = ['but-viet' => 1, 'so-tay' => 2, 'file-kep' => 3, 'dung-cu' => 4, 'balo-tui' => 5];

        $descTemplate = [
            'but-viet' => '%s chính hãng %s, nét mực đều, cầm viết êm tay — phù hợp cho học sinh, sinh viên, dân văn phòng cần viết nhiều mỗi ngày. Sản phẩm được OFFICEHUB nhập khẩu/phân phối chính thức, có đầy đủ tem nhãn.',
            'so-tay'   => '%s chính hãng %s, giấy dày mịn, không lem mực hai mặt — lựa chọn lý tưởng để ghi chú công việc, lên kế hoạch hoặc làm nhật ký. Thiết kế bìa tối giản, phù hợp mang theo văn phòng.',
            'file-kep' => '%s chính hãng %s, chất liệu bền chắc, giúp sắp xếp và bảo quản tài liệu gọn gàng, chuyên nghiệp — phù hợp cho văn phòng, trường học và nhu cầu lưu trữ hồ sơ cá nhân.',
            'dung-cu'  => '%s chính hãng %s, độ bền cao, thao tác nhanh gọn — dụng cụ không thể thiếu trên bàn làm việc của mọi văn phòng. Bảo hành 12 tháng theo chính sách OFFICEHUB.',
            'balo-tui' => '%s chính hãng %s, thiết kế chống sốc bảo vệ laptop, nhiều ngăn tiện dụng — đồng hành cùng bạn đi làm, đi học và di chuyển hàng ngày. Chất liệu chống nước, bền bỉ theo thời gian.',
        ];

        // Copy nguyên 36 sản phẩm thật từ assets/js/products-data.js của template — không bịa.
        // [category_slug, name, slug, image, price, price_sale, badge, brand, rating, sold, theme[]]
        $raw = [
            // Bút viết (8)
            ['but-viet', 'Bút bi Thiên Long TL-027 (Hộp 12 cây)', 'but-bi-thien-long-tl-027', 'https://images.unsplash.com/photo-1620275765334-4ed948bb4502?w=600&auto=format&fit=crop&q=80', 48000, null, 'hot', 'Thiên Long', 4.8, 3240, ['ban-chay']],
            ['but-viet', 'Bút gel Pentel EnerGel 0.5mm màu đen', 'but-gel-pentel-energel-05mm', 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=600&auto=format&fit=crop&q=80', 32000, 27000, 'sale', 'Pentel', 4.9, 1870, ['giam-gia']],
            ['but-viet', 'Bút mực Parker Jotter Ballpoint Blue', 'but-muc-parker-jotter-ballpoint-blue', 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80', 425000, null, 'new', 'Parker', 4.7, 420, ['hang-moi']],
            ['but-viet', 'Bút dạ quang Stabilo Boss 4 màu (hộp)', 'but-da-quang-stabilo-boss-4-mau', 'https://images.unsplash.com/photo-1612367980327-7454a7276aa7?w=600&auto=format&fit=crop&q=80', 68000, 55000, 'sale', 'Stabilo', 4.6, 980, ['giam-gia']],
            ['but-viet', 'Bút lông bảng Artline 577A nét 2mm', 'but-long-bang-artline-577a', 'https://images.unsplash.com/photo-1501618669935-18b6ecb13d6d?w=600&auto=format&fit=crop&q=80', 25000, null, '', 'Artline', 4.5, 2100, ['ban-chay']],
            ['but-viet', 'Bút kim Staedtler Mars Micro 0.3mm', 'but-kim-staedtler-mars-micro-03mm', 'https://images.unsplash.com/photo-1483546416237-76fd26bbcdd1?w=600&auto=format&fit=crop&q=80', 95000, null, 'new', 'Staedtler', 4.8, 350, ['hang-moi']],
            ['but-viet', 'Bộ bút màu Faber-Castell 24 màu Classic', 'bo-but-mau-faber-castell-24-mau', 'https://images.unsplash.com/photo-1587135991058-8816b028691f?w=600&auto=format&fit=crop&q=80', 145000, 125000, 'sale', 'Faber-Castell', 4.7, 760, ['giam-gia']],
            ['but-viet', 'Bút xóa được Pilot Frixion Point 0.5mm', 'but-xoa-duoc-pilot-frixion-point', 'https://images.unsplash.com/photo-1623697899811-f2403f50685e?w=600&auto=format&fit=crop&q=80', 42000, null, 'new', 'Pilot', 4.6, 890, ['hang-moi']],

            // Sổ tay & giấy note (8)
            ['so-tay', 'Sổ tay bìa cứng A5 Klong 200 trang', 'so-tay-bia-cung-a5-klong-200-trang', 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600&auto=format&fit=crop&q=80', 58000, null, '', 'Klong', 4.6, 2800, ['ban-chay']],
            ['so-tay', 'Vở ô ly Navigator 80 trang (lốc 10 cuốn)', 'vo-o-ly-navigator-80-trang', 'https://images.unsplash.com/photo-1510070009289-b5bc34383727?w=600&auto=format&fit=crop&q=80', 95000, 82000, 'sale', 'Navigator', 4.5, 4100, ['ban-chay', 'giam-gia']],
            ['so-tay', 'Giấy ghi chú 3M Post-it 76x76mm (màu vàng)', 'giay-ghi-chu-3m-post-it-76x76', 'https://images.unsplash.com/photo-1507831228884-93d43e81a99d?w=600&auto=format&fit=crop&q=80', 45000, null, 'hot', '3M', 4.7, 3560, ['ban-chay']],
            ['so-tay', 'Sổ da cao cấp Moleskine Classic A5 Ruled', 'so-da-moleskine-classic-a5-ruled', 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&auto=format&fit=crop&q=80', 380000, null, 'new', 'Moleskine', 4.9, 230, ['hang-moi']],
            ['so-tay', 'Block giấy màu pastel A5 100 tờ (5 màu)', 'block-giay-mau-pastel-a5-100-to', 'https://images.unsplash.com/photo-1618381801643-3d253a63a386?w=600&auto=format&fit=crop&q=80', 35000, 28000, 'sale', 'Office One', 4.4, 1200, ['giam-gia']],
            ['so-tay', 'Sổ lịch bàn 2026 Navigator (tháng/ngày)', 'so-lich-ban-2026-navigator', 'https://images.unsplash.com/photo-1454587399083-b11b22f48fb6?w=600&auto=format&fit=crop&q=80', 72000, null, 'new', 'Navigator', 4.5, 680, ['hang-moi']],
            ['so-tay', 'Tập học sinh Navigator 200 trang ô ly', 'tap-hoc-sinh-navigator-200-trang', 'https://images.unsplash.com/photo-1515787366009-7cbdd2dc587b?w=600&auto=format&fit=crop&q=80', 28000, null, '', 'Navigator', 4.5, 5200, ['ban-chay']],
            ['so-tay', 'Sổ bìa da A4 Klong LX-300 (200 trang)', 'so-bia-da-a4-klong-lx-300', 'https://images.unsplash.com/photo-1616964666162-31f61986d9aa?w=600&auto=format&fit=crop&q=80', 125000, 105000, 'sale', 'Klong', 4.6, 890, ['giam-gia']],

            // File & kẹp tài liệu (7)
            ['file-kep', 'File hộp nhựa A4 Thiên Long (màu ngẫu nhiên)', 'file-hop-nhua-a4-thien-long', 'https://images.unsplash.com/photo-1535957998253-26ae1ef29506?w=600&auto=format&fit=crop&q=80', 22000, null, '', 'Thiên Long', 4.5, 6800, ['ban-chay']],
            ['file-kep', 'Kẹp bướm inox No.100 (hộp 12 cái)', 'kep-buom-inox-no100-hop-12-cai', 'https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?w=600&auto=format&fit=crop&q=80', 32000, null, '', 'Office One', 4.4, 3400, ['ban-chay']],
            ['file-kep', 'Cặp tài liệu da A4 Cao Cấp (có dây kéo)', 'cap-tai-lieu-da-a4-cao-cap', 'https://images.unsplash.com/photo-1558478551-1a378f63328e?w=600&auto=format&fit=crop&q=80', 245000, 195000, 'sale', 'Office One', 4.7, 560, ['giam-gia']],
            ['file-kep', 'File lá A4 PP siêu dày 200 lá (lốc 100)', 'file-la-a4-pp-sieu-day-200-la', 'https://images.unsplash.com/photo-1501959181532-7d2a3c064642?w=600&auto=format&fit=crop&q=80', 155000, null, '', 'Thiên Long', 4.5, 2100, ['ban-chay']],
            ['file-kep', 'Hộp file treo tường nhựa ABS 5 ngăn', 'hop-file-treo-tuong-nhua-5-ngan', 'https://images.unsplash.com/photo-1506188232657-23c9c893ac2b?w=600&auto=format&fit=crop&q=80', 185000, null, 'new', 'Deli', 4.6, 420, ['hang-moi']],
            ['file-kep', 'Bìa còng 4 vòng Deli A4 50mm (bìa cứng)', 'bia-cong-4-vong-deli-a4-50mm', 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=600&auto=format&fit=crop&q=80', 68000, 55000, 'sale', 'Deli', 4.5, 870, ['giam-gia']],
            ['file-kep', 'Túi đựng tài liệu A4 PVC có khóa kéo', 'tui-dung-tai-lieu-a4-pvc-khoa-keo', 'https://images.unsplash.com/photo-1555178364-6c1f870e3349?w=600&auto=format&fit=crop&q=80', 18000, null, '', 'Office One', 4.3, 4200, ['ban-chay']],

            // Dụng cụ văn phòng (7)
            ['dung-cu', 'Bấm kim Kim Sến No.3 (hộp 1000 kim)', 'bam-kim-kim-sen-no3-hop-1000', 'https://images.unsplash.com/photo-1503958014551-3b41f69234d9?w=600&auto=format&fit=crop&q=80', 12000, null, '', 'Kim Sến', 4.6, 8900, ['ban-chay']],
            ['dung-cu', 'Kéo văn phòng Deli Stainless 21cm', 'keo-van-phong-deli-stainless-21cm', 'https://images.unsplash.com/photo-1531347118459-c3ea7a5ac61e?w=600&auto=format&fit=crop&q=80', 35000, null, '', 'Deli', 4.5, 2300, ['ban-chay']],
            ['dung-cu', 'Băng keo trong Acurun 2cm x 30m (carton 6)', 'bang-keo-trong-acurun-2cm-30m', 'https://images.unsplash.com/photo-1531256379416-9f000e90aacc?w=600&auto=format&fit=crop&q=80', 42000, 36000, 'sale', 'Acurun', 4.4, 3600, ['giam-gia']],
            ['dung-cu', 'Ghim kẹp giấy inox 33mm (hộp 100 cái)', 'ghim-kep-giay-inox-33mm-100-cai', 'https://images.unsplash.com/photo-1606223226391-c267641c318c?w=600&auto=format&fit=crop&q=80', 18000, null, '', 'Office One', 4.5, 5400, ['ban-chay']],
            ['dung-cu', 'Máy tính khoa học Casio FX-570VN Plus II', 'may-tinh-khoa-hoc-casio-fx570vn', 'https://images.unsplash.com/photo-1452601395039-3184bc03cb09?w=600&auto=format&fit=crop&q=80', 220000, 195000, 'sale', 'Casio', 4.9, 1900, ['ban-chay', 'giam-gia']],
            ['dung-cu', 'Đục lỗ 2 lỗ Deli E0130 (xử lý 20 tờ)', 'duc-lo-2-lo-deli-e0130', 'https://images.unsplash.com/photo-1549582100-d67ab35b3507?w=600&auto=format&fit=crop&q=80', 45000, null, 'new', 'Deli', 4.5, 680, ['hang-moi']],
            ['dung-cu', 'Bộ rập số & chữ cái nhựa 3mm Deli (36 ký tự)', 'bo-rap-so-chu-cai-nhua-3mm-deli', 'https://images.unsplash.com/photo-1601321268954-22646044f7d0?w=600&auto=format&fit=crop&q=80', 28000, null, 'new', 'Deli', 4.3, 450, ['hang-moi']],

            // Balo & túi laptop (6)
            ['balo-tui', 'Balo laptop 15.6" Samsonite Classic Business', 'balo-laptop-156-samsonite-classic', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80', 1850000, 1650000, 'sale', 'Samsonite', 4.8, 780, ['ban-chay', 'giam-gia']],
            ['balo-tui', 'Túi đựng laptop 14" Slim Tomtoc (xám)', 'tui-dung-laptop-14-slim-tomtoc', 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&auto=format&fit=crop&q=80', 480000, null, 'new', 'Tomtoc', 4.7, 340, ['hang-moi']],
            ['balo-tui', 'Balo chống nước Pacsafe Metrosafe LS350', 'balo-chong-nuoc-pacsafe-metrosafe-ls350', 'https://images.unsplash.com/photo-1577733975197-3b950ca5cabe?w=600&auto=format&fit=crop&q=80', 2200000, null, 'new', 'Pacsafe', 4.8, 180, ['hang-moi']],
            ['balo-tui', 'Túi tote canvas đựng tài liệu văn phòng (OAK)', 'tui-tote-canvas-tai-lieu-van-phong', 'https://images.unsplash.com/photo-1622560481156-01fc7e1693e6?w=600&auto=format&fit=crop&q=80', 195000, 165000, 'sale', 'OAK', 4.5, 620, ['giam-gia']],
            ['balo-tui', 'Cặp da đựng MacBook/laptop 13" SlimCase', 'cap-da-dung-laptop-13-slimcase', 'https://images.unsplash.com/photo-1594299447935-e5b840f54b9b?w=600&auto=format&fit=crop&q=80', 750000, 680000, 'sale', 'SlimCase', 4.7, 490, ['ban-chay', 'giam-gia']],
            ['balo-tui', 'Balo du lịch/làm việc 20L Deuter Vista (đen)', 'balo-du-lich-lam-viec-20l-deuter-vista', 'https://images.unsplash.com/photo-1541240290619-3f2fad86473d?w=600&auto=format&fit=crop&q=80', 1350000, null, 'new', 'Deuter', 4.6, 210, ['hang-moi']],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO products
                (category_id, name, slug, image, price, price_sale, badge, description, rating, in_stock, is_featured, is_new, sort_order, brand, theme, sold)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)"
        );

        $order = 1;
        foreach ($raw as $p) {
            [$catSlug, $name, $slug, $image, $price, $priceSale, $badge, $brand, $rating, $sold, $themes] = $p;

            $description = sprintf($descTemplate[$catSlug], $name, $brand);
            $themeCol    = '|' . implode('|', $themes) . '|';
            $isFeatured  = $badge === 'hot' ? 1 : 0;
            $isNew       = $badge === 'new' ? 1 : 0;

            $stmt->execute([
                $catId[$catSlug], $name, $slug, $image, $price, $priceSale, $badge, $description, $rating,
                $isFeatured, $isNew, $order, $brand, $themeCol, $sold,
            ]);
            $order++;
        }
    }
}
