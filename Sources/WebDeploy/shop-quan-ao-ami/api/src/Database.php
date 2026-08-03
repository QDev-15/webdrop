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
        $this->migrateAlter();
        $this->seedData();
    }

    // Áp dụng ALTER TABLE cho các cột thêm sau khi schema.sql đã tồn tại trên DB cũ.
    // Dùng try/catch vì SQLite ném lỗi nếu cột đã tồn tại — bỏ qua lỗi đó là đúng.
    private function migrateAlter(): void {
        try { $this->pdo->exec("ALTER TABLE orders ADD COLUMN coupon_code TEXT DEFAULT ''"); } catch (\Exception $e) {}
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
            ['site_name',        'AMI Fashion',                                                  'general'],
            ['site_slogan',      'Thời trang tối giản, chất liệu chuẩn',                          'general'],
            ['site_email',       'hello@amifashion.vn',                                           'general'],
            ['site_phone',       '0909 345 678',                                                  'general'],
            ['site_address',     '12 Lê Văn Sỹ, Quận 3, TP.HCM',                                  'general'],
            ['working_hours',    'Thứ 2 – Chủ nhật: 9:00 – 21:00',                                'general'],
            ['site_description', 'AMI Fashion — Bộ sưu tập quần áo thời trang tối giản, chất liệu cao cấp. Áo thun, áo sơ mi, quần jean, váy đầm, áo khoác.', 'general'],
            ['site_logo',        '', 'general'],
            ['site_favicon',     '', 'general'],
            ['zalo_number',      '0909345678', 'general'],

            // ── Topbar (1 dòng thông báo, hiển thị mọi trang) ─────────────────────
            ['topbar_text_1', 'Miễn phí vận chuyển đơn từ 599K', 'general'],
            ['topbar_text_2', 'Đổi trả trong 30 ngày',           'general'],
            ['topbar_text_3', 'Bảo hành chính hãng',             'general'],

            // ── SEO ──────────────────────────────────────────────────────────────
            ['meta_title',       'AMI Fashion — Thời trang tối giản, chất liệu chuẩn', 'seo'],
            ['meta_description', 'AMI Fashion — Bộ sưu tập quần áo thời trang tối giản, chất liệu cao cấp. Áo thun, áo sơ mi, quần jean, váy đầm, áo khoác.', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&auto=format&fit=crop&q=80', 'seo'],
            ['ga_id',    '', 'seo'],
            ['gtm_id',   '', 'seo'],

            // ── Social ───────────────────────────────────────────────────────────
            ['facebook',  '', 'social'],
            ['instagram', '', 'social'],
            ['tiktok',    '', 'social'],

            // ── Home (Search Zone — "hero" duy nhất của trang chủ) ────────────────
            ['home_search_heading', 'Tìm trong hơn 36 sản phẩm AMI', 'home'],

            // ── About (ve-chung-toi.html) ─────────────────────────────────────────
            ['about_hero_label', 'Câu chuyện AMI', 'about'],
            ['about_hero_title1', 'Ít hơn,', 'about'],
            ['about_hero_title2', 'nhưng tốt hơn.', 'about'],
            ['about_hero_desc', 'AMI Fashion ra đời từ niềm tin rằng thời trang thật sự không cần quá nhiều. Chúng tôi tạo ra những sản phẩm bền vững, tối giản — để bạn mặc mãi mà không lo lỗi thời.', 'about'],
            ['about_story_image', 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&auto=format&fit=crop&q=80', 'about'],
            ['about_story_label', 'Hành trình của chúng tôi', 'about'],
            ['about_story_title', 'Từ một chiếc áo thun trắng', 'about'],
            ['about_story_p1', 'AMI Fashion được thành lập vào năm 2020 bởi hai người bạn với chung một nỗi trăn trở: tại sao những chiếc áo thun cơ bản lại khó tìm đến vậy? Chất liệu không đạt, đường may không chắc, màu sắc nhanh phai.', 'about'],
            ['about_story_p2', 'Xuất phát từ đó, chúng tôi bắt đầu nghiên cứu chất liệu cotton hữu cơ từ các nhà cung cấp uy tín, cộng tác với các xưởng may nhỏ có tay nghề cao tại Việt Nam — và ra mắt chiếc áo thun basic đầu tiên với cam kết "mặc được 5 năm".', 'about'],
            ['about_story_p3', 'Ngày nay, AMI Fashion có hơn 36 sản phẩm trong bộ sưu tập, từ áo thun, sơ mi, quần jean đến váy đầm và áo khoác — tất cả đều giữ vững triết lý ban đầu: ít hơn, nhưng tốt hơn.', 'about'],

            ['value1_title', 'Chất liệu trước tiên', 'about'],
            ['value1_desc', 'Mọi sản phẩm AMI đều bắt đầu từ việc chọn chất liệu. Chúng tôi ưu tiên cotton hữu cơ, linen tự nhiên và các sợi vải thân thiện môi trường — có thể mặc thoải mái cả ngày dài.', 'about'],
            ['value2_title', 'Thiết kế vĩnh cửu', 'about'],
            ['value2_desc', 'Không theo xu hướng theo mùa, không "lỗi thời" sau 3 tháng. AMI thiết kế những sản phẩm bạn có thể mặc 5 năm sau mà vẫn phù hợp — tiết kiệm và bền vững hơn cho cả bạn và môi trường.', 'about'],
            ['value3_title', 'Sản xuất có trách nhiệm', 'about'],
            ['value3_desc', 'Chúng tôi chỉ cộng tác với các xưởng may tại Việt Nam đảm bảo điều kiện làm việc tốt, trả lương công bằng và không sử dụng lao động trẻ em. Mỗi sản phẩm AMI là sản phẩm của sự tử tế.', 'about'],

            ['astat1_num', '5000', 'about'], ['astat1_suffix', '+',    'about'], ['astat1_label', 'Khách hàng tin dùng',          'about'],
            ['astat2_num', '36',   'about'], ['astat2_suffix', '',     'about'], ['astat2_label', 'Sản phẩm trong bộ sưu tập',    'about'],
            ['astat3_num', '5',    'about'], ['astat3_suffix', ' năm', 'about'], ['astat3_label', 'Kinh nghiệm sản xuất',         'about'],
            ['astat4_num', '98',   'about'], ['astat4_suffix', '%',    'about'], ['astat4_label', 'Khách hàng hài lòng',          'about'],

            ['why1_title', 'Chất liệu kiểm định', 'about'],
            ['why1_desc', '100% cotton hữu cơ và linen tự nhiên, kiểm tra chất lượng từng lô hàng trước khi đưa vào sản xuất.', 'about'],
            ['why2_title', 'Giao hàng nhanh', 'about'],
            ['why2_desc', 'Giao hàng trong 24-48 giờ tại TP.HCM và Hà Nội. Toàn quốc 2-4 ngày làm việc.', 'about'],
            ['why3_title', 'Đổi trả dễ dàng', 'about'],
            ['why3_desc', '30 ngày đổi trả miễn phí nếu sản phẩm lỗi hoặc không vừa size. Không cần lý do.', 'about'],
            ['why4_title', 'Bảo hành chất liệu', 'about'],
            ['why4_desc', 'Cam kết bảo hành chất liệu 6 tháng — phai màu, bung đường may được đổi sản phẩm mới.', 'about'],

            ['testi1_text', 'Mình đã mặc chiếc áo thun trắng AMI được hơn 2 năm, giặt máy hàng tuần mà vẫn trắng đẹp, không co rút. Chất liệu vượt quá kỳ vọng của mình.', 'about'],
            ['testi1_name', 'Linh Nguyễn', 'about'], ['testi1_role', 'Nhân viên văn phòng, Hà Nội', 'about'], ['testi1_stars', '5', 'about'],
            ['testi1_avatar', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80', 'about'],
            ['testi2_text', 'AMI là thương hiệu mình tin dùng nhất cho quần jean. Chiếc Wide Leg mình mua năm ngoái vẫn đẹp như mới, dù đã mặc rất nhiều. Form chuẩn, chất jean dày và bền.', 'about'],
            ['testi2_name', 'Minh Trang', 'about'], ['testi2_role', 'Nhiếp ảnh gia, TP.HCM', 'about'], ['testi2_stars', '5', 'about'],
            ['testi2_avatar', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80', 'about'],
            ['testi3_text', 'Chiếc váy Midi Linen của AMI là món đồ mình mặc nhiều nhất mùa hè này. Nhẹ, mát, không nhăn, đi làm lẫn đi chơi đều phù hợp. Giao hàng cũng rất nhanh.', 'about'],
            ['testi3_name', 'Thu Hà', 'about'], ['testi3_role', 'Giáo viên, Đà Nẵng', 'about'], ['testi3_stars', '4', 'about'],
            ['testi3_avatar', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', 'about'],

            ['policy1_title', 'Miễn phí vận chuyển', 'about'],
            ['policy1_desc', 'Đơn hàng từ 599K được miễn phí ship toàn quốc. Giao trong 24-48 giờ tại TP.HCM và Hà Nội.', 'about'],
            ['policy2_title', 'Đổi trả 30 ngày', 'about'],
            ['policy2_desc', 'Đổi trả miễn phí trong 30 ngày nếu sản phẩm lỗi hoặc không đúng size. Hoàn tiền trong 3-5 ngày làm việc.', 'about'],
            ['policy3_title', 'Bảo hành chất liệu', 'about'],
            ['policy3_desc', 'Cam kết bảo hành chất liệu 6 tháng — phai màu bất thường hoặc bung đường may được đổi miễn phí.', 'about'],
            ['policy4_title', 'Hỗ trợ 24/7', 'about'],
            ['policy4_desc', 'Đội ngũ tư vấn qua Zalo, email và điện thoại. Trả lời trong vòng 30 phút trong giờ làm việc.', 'about'],

            ['about_cta_label', 'Sẵn sàng chưa?', 'about'],
            ['about_cta_title', 'Khám phá bộ sưu tập AMI', 'about'],
            ['about_cta_desc',  'Tìm chiếc sản phẩm phù hợp với phong cách của bạn.', 'about'],

            // ── Collection (bo-suu-tap.html) ──────────────────────────────────────
            ['coll_eyebrow',   'AMI Fashion 2025', 'collection'],
            ['coll_hero_title','Bộ sưu tập', 'collection'],
            ['coll_hero_sub',  'Những thiết kế tối giản, bền vững — được chọn lọc để phù hợp với nhiều phong cách sống khác nhau.', 'collection'],

            ['c1_image', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=900&auto=format&fit=crop&q=80', 'collection'],
            ['c1_label', 'Bộ sưu tập 01', 'collection'],
            ['c1_title', 'Hè Thiên Nhiên', 'collection'],
            ['c1_p1', 'Lấy cảm hứng từ những chuyến đi khám phá thiên nhiên, bộ sưu tập Hè Thiên Nhiên gồm các items nhẹ nhàng, thoáng mát với tông màu trung tính.', 'collection'],
            ['c1_p2', 'Chất liệu cotton hữu cơ và linen tự nhiên — mềm mại trên da, thân thiện với môi trường.', 'collection'],
            ['c1_link', '/san-pham?category=ao-thun,ao-so-mi', 'collection'],
            ['c1_link_label', 'Khám phá bộ sưu tập →', 'collection'],

            ['c2_image', 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=900&auto=format&fit=crop&q=80', 'collection'],
            ['c2_label', 'Bộ sưu tập 02', 'collection'],
            ['c2_title', 'Thu Đông Tối Giản', 'collection'],
            ['c2_p1', 'Sắc xám, đen, và be trung tính — cùng những chiếc áo khoác và áo len cardigan dày dặn, ấm áp. Thiết kế tối giản để bạn dễ phối đồ trong những ngày se lạnh.', 'collection'],
            ['c2_p2', 'Phù hợp từ văn phòng đến các buổi gặp gỡ cuối tuần.', 'collection'],
            ['c2_link', '/san-pham?category=ao-khoac', 'collection'],
            ['c2_link_label', 'Khám phá bộ sưu tập →', 'collection'],

            ['c3_image', 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=900&auto=format&fit=crop&q=80', 'collection'],
            ['c3_label', 'Bộ sưu tập 03', 'collection'],
            ['c3_title', 'Everyday Essentials', 'collection'],
            ['c3_p1', 'Những chiếc quần jean bền đẹp, những chiếc váy midi thanh lịch — bộ sưu tập Everyday Essentials là nền tảng cho mọi tủ đồ.', 'collection'],
            ['c3_p2', 'Đây là những sản phẩm bán chạy nhất của AMI, được khách hàng yêu thích nhiều nhất vì tính linh hoạt và độ bền vượt trội.', 'collection'],
            ['c3_link', '/san-pham?theme=ban-chay', 'collection'],
            ['c3_link_label', 'Xem sản phẩm bán chạy →', 'collection'],

            // ── Footer ───────────────────────────────────────────────────────────
            ['footer_about', 'Thời trang tối giản, chất liệu chuẩn. Mỗi sản phẩm AMI được chọn lọc kỹ lưỡng để mang lại sự thoải mái và phong cách bền vững.', 'footer'],

            // ── Contact (lien-he.html) ─────────────────────────────────────────────
            ['contact_note', 'Phản hồi nhanh nhất qua Zalo — chúng tôi thường trả lời trong vòng 30 phút trong giờ làm việc.', 'contact'],

            // ── Payment (tab "💳 Thanh toán") ────────────────────────────────────────
            ['payment_cod_enabled',      '1', 'payment'],
            ['payment_sepay_enabled',    '0', 'payment'],
            ['sepay_bank_code',          '',  'payment'],
            ['sepay_account_number',     '',  'payment'],
            ['sepay_account_name',       '',  'payment'],
            ['sepay_webhook_secret',     '',  'payment'],
            ['shipping_fee',             '30000',   'payment'],
            ['free_shipping_threshold',  '599000',  'payment'],

            // ── Shop policy ──────────────────────────────────────────────────────────
            ['return_days',     '30', 'shop'],
            ['warranty_months', '6',  'shop'],

            // ── SMTP ─────────────────────────────────────────────────────────────────
            ['smtp_host',      '', 'smtp'],
            ['smtp_port',      '587', 'smtp'],
            ['smtp_user',      '', 'smtp'],
            ['smtp_pass',      '', 'smtp'],
            ['smtp_from',      '', 'smtp'],
            ['smtp_from_name', 'AMI Fashion', 'smtp'],

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
        // Trang chủ AMI Fashion dùng "Search Zone" (h1 + ô tìm kiếm lớn) thay cho hero slider ảnh —
        // template gốc (Biến thể 2 CATEGORY-SECTIONS) không có bất kỳ hero/lifestyle image nào.
        // Vẫn seed 1 record để giữ menu "Hero Slides" hoạt động đúng chuẩn scaffold (không hiển thị trên site).
        $slides = [
            ['Search Zone trang chủ AMI Fashion', 'Không hiển thị dạng ảnh — nội dung ô tìm kiếm quản lý ở Cài đặt > Trang chủ', '', '', '', 1, 'published'],
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
        // id: 1 Áo Thun, 2 Áo Sơ Mi, 3 Quần Jean, 4 Váy & Đầm, 5 Áo Khoác
        $cats = [
            ['Áo Thun',   'ao-thun',   'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop&q=80', 1],
            ['Áo Sơ Mi',  'ao-so-mi',  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80', 2],
            ['Quần Jean', 'quan-jean', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80', 3],
            ['Váy & Đầm', 'vay-dam',   'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80', 4],
            ['Áo Khoác',  'ao-khoac',  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80', 5],
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
        $catId = ['ao-thun' => 1, 'ao-so-mi' => 2, 'quan-jean' => 3, 'vay-dam' => 4, 'ao-khoac' => 5];

        // Màu -> [Tên hiển thị, hex] — khớp COLOR_LABELS/COLOR_HEX của products-data.js gốc.
        $colorMap = [
            'trang'     => ['Trắng', '#f5f5f3'],
            'den'       => ['Đen', '#1a1916'],
            'be'        => ['Be', '#e8d5b8'],
            'xam'       => ['Xám', '#9e9b95'],
            'xanh-navy' => ['Xanh Navy', '#1e3a5f'],
            'hong'      => ['Hồng', '#f4a7b9'],
            'vang-kem'  => ['Vàng Kem', '#f0d57c'],
        ];

        // Mô tả theo danh mục — nội dung thật lấy từ giọng văn thương hiệu AMI (ve-chung-toi.html),
        // không phải Lorem ipsum. Template gốc chỉ có 1 đoạn mô tả chung (tab "Mô tả" cố định cho
        // mọi sản phẩm) — bài này viết lại theo từng danh mục cho hợp lý với chất liệu thật của loại đồ đó.
        $descTemplate = [
            'ao-thun'   => '%s được làm từ 100%% cotton hữu cơ cao cấp, thoáng mát và thấm hút mồ hôi tốt. Thiết kế tối giản, form dáng regular fit thoải mái, phù hợp mặc hàng ngày hoặc phối cùng nhiều items khác nhau. Đường may chắc chắn, màu sắc bền đẹp qua nhiều lần giặt.',
            'ao-so-mi'  => '%s may từ chất liệu linen và cotton pha, form dáng thanh lịch, phù hợp đi làm lẫn dạo phố. Vải nhẹ, thoáng khí, ít nhăn và giữ form tốt sau nhiều lần giặt.',
            'quan-jean' => '%s sử dụng vải denim bền chắc, form dáng chuẩn tôn dáng, đường may tỉ mỉ. Chất liệu co giãn nhẹ mang lại cảm giác thoải mái khi vận động cả ngày dài.',
            'vay-dam'   => '%s thiết kế tối giản, chất liệu linen/cotton mềm mại, thoáng mát — phù hợp đi làm, dạo phố hoặc những dịp gặp gỡ cuối tuần.',
            'ao-khoac'  => '%s chất liệu dày dặn, giữ ấm tốt trong những ngày se lạnh, thiết kế tối giản dễ phối cùng nhiều outfit khác nhau. Đường may chắc chắn, form dáng chuẩn.',
        ];

        // Copy nguyên 36 sản phẩm thật từ assets/js/products-data.js của template — không bịa.
        // [category_slug, name, slug, image, price, price_sale, badge, color_slug, sizes[], rating, sold, theme[]]
        $raw = [
            ['ao-thun', 'Áo Thun Basic Trắng AMI', 'ao-thun-basic-trang', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop&q=80', 290000, null, 'hot', 'trang', ['XS','S','M','L','XL'], 4.8, 318, ['ban-chay','hang-moi']],
            ['ao-thun', 'Áo Thun Basic Đen AMI', 'ao-thun-basic-den', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80', 290000, null, 'hot', 'den', ['XS','S','M','L','XL'], 4.7, 291, ['ban-chay']],
            ['ao-thun', 'Áo Thun Oversized Be AMI', 'ao-thun-oversized-be', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&auto=format&fit=crop&q=80', 350000, null, 'new', 'be', ['S','M','L','XL'], 4.6, 84, ['hang-moi']],
            ['ao-thun', 'Áo Thun Kẻ Sọc AMI', 'ao-thun-ke-soc', 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600&auto=format&fit=crop&q=80', 320000, 249000, 'sale', 'trang', ['S','M','L'], 4.3, 152, ['giam-gia']],
            ['ao-thun', 'Áo Thun In Hoa AMI', 'ao-thun-in-hoa', 'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=600&auto=format&fit=crop&q=80', 380000, null, 'new', 'trang', ['XS','S','M','L'], 4.5, 67, ['hang-moi']],
            ['ao-thun', 'Áo Thun Crop Top AMI', 'ao-thun-crop-top', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80', 260000, 210000, 'sale', 'den', ['XS','S','M'], 4.4, 209, ['ban-chay','giam-gia']],
            ['ao-thun', 'Áo Thun Basic Xám AMI', 'ao-thun-basic-xam', 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&auto=format&fit=crop&q=80', 290000, null, '', 'xam', ['XS','S','M','L','XL'], 4.6, 243, ['ban-chay']],
            ['ao-thun', 'Áo Thun Ribbed AMI', 'ao-thun-ribbed', 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&auto=format&fit=crop&q=80', 340000, null, 'new', 'be', ['XS','S','M','L'], 4.7, 92, ['hang-moi']],

            ['ao-so-mi', 'Áo Sơ Mi Linen Trắng AMI', 'ao-so-mi-linen-trang', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80', 590000, null, 'hot', 'trang', ['XS','S','M','L','XL'], 4.9, 376, ['ban-chay']],
            ['ao-so-mi', 'Áo Sơ Mi Oversize AMI', 'ao-so-mi-oversize', 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&auto=format&fit=crop&q=80', 620000, null, 'new', 'be', ['S','M','L','XL'], 4.7, 98, ['hang-moi']],
            ['ao-so-mi', 'Áo Sơ Mi Kẻ Classic AMI', 'ao-so-mi-ke-classic', 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600&auto=format&fit=crop&q=80', 550000, null, '', 'trang', ['S','M','L','XL'], 4.8, 284, ['ban-chay']],
            ['ao-so-mi', 'Áo Sơ Mi Cotton Oxford AMI', 'ao-so-mi-cotton-oxford', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80', 480000, 390000, 'sale', 'xanh-navy', ['S','M','L'], 4.5, 143, ['giam-gia']],
            ['ao-so-mi', 'Áo Sơ Mi Dáng Suông AMI', 'ao-so-mi-dang-suong', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80', 510000, null, 'new', 'trang', ['XS','S','M','L'], 4.6, 75, ['hang-moi']],
            ['ao-so-mi', 'Áo Sơ Mi Túi Ngực AMI', 'ao-so-mi-tui-nguc', 'https://images.unsplash.com/photo-1608234807905-4466023792f5?w=600&auto=format&fit=crop&q=80', 450000, null, '', 'be', ['S','M','L','XL'], 4.7, 198, ['ban-chay']],
            ['ao-so-mi', 'Áo Sơ Mi Tay Lửng AMI', 'ao-so-mi-tay-lung', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80', 430000, 350000, 'sale', 'trang', ['XS','S','M','L'], 4.4, 166, ['giam-gia']],

            ['quan-jean', 'Quần Jean Straight AMI', 'quan-jean-straight', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80', 690000, null, 'hot', 'xanh-navy', ['XS','S','M','L','XL'], 4.8, 327, ['ban-chay']],
            ['quan-jean', 'Quần Jean Rách Gối AMI', 'quan-jean-rach-goi', 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&auto=format&fit=crop&q=80', 750000, null, 'new', 'xanh-navy', ['XS','S','M','L'], 4.5, 89, ['hang-moi']],
            ['quan-jean', 'Quần Jean Baggy AMI', 'quan-jean-baggy', 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&auto=format&fit=crop&q=80', 790000, null, 'hot', 'xanh-navy', ['S','M','L','XL'], 4.7, 215, ['hang-moi','ban-chay']],
            ['quan-jean', 'Quần Jean Wide Leg AMI', 'quan-jean-wide-leg', 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&auto=format&fit=crop&q=80', 820000, null, 'hot', 'xanh-navy', ['XS','S','M','L'], 4.8, 248, ['ban-chay','hang-moi']],
            ['quan-jean', 'Quần Jean Skinny AMI', 'quan-jean-skinny', 'https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=600&auto=format&fit=crop&q=80', 650000, 520000, 'sale', 'den', ['XS','S','M','L'], 4.3, 172, ['giam-gia']],
            ['quan-jean', 'Quần Jean Short AMI', 'quan-jean-short', 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&auto=format&fit=crop&q=80', 490000, 390000, 'sale', 'xanh-navy', ['XS','S','M','L'], 4.2, 134, ['giam-gia']],

            ['vay-dam', 'Váy Midi Linen AMI', 'vay-midi-linen', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80', 790000, null, 'hot', 'be', ['XS','S','M','L'], 4.9, 412, ['ban-chay','hang-moi']],
            ['vay-dam', 'Đầm Maxi Hoa Nhí AMI', 'dam-maxi-hoa-nhi', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80', 890000, null, 'new', 'trang', ['XS','S','M','L'], 4.7, 87, ['hang-moi']],
            ['vay-dam', 'Váy Mini Caro AMI', 'vay-mini-caro', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&auto=format&fit=crop&q=80', 490000, null, '', 'den', ['XS','S','M'], 4.6, 263, ['ban-chay']],
            ['vay-dam', 'Đầm Sơ Mi AMI', 'dam-so-mi', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&auto=format&fit=crop&q=80', 650000, null, 'new', 'trang', ['XS','S','M','L'], 4.6, 104, ['hang-moi']],
            ['vay-dam', 'Váy Wrap AMI', 'vay-wrap', 'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=600&auto=format&fit=crop&q=80', 720000, null, '', 'hong', ['XS','S','M','L'], 4.7, 196, ['ban-chay']],
            ['vay-dam', 'Đầm Đen Basic AMI', 'dam-den-basic', 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=600&auto=format&fit=crop&q=80', 580000, 460000, 'sale', 'den', ['XS','S','M','L','XL'], 4.8, 338, ['ban-chay','giam-gia']],
            ['vay-dam', 'Váy Xếp Ly AMI', 'vay-xep-ly', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&auto=format&fit=crop&q=80', 610000, null, 'new', 'vang-kem', ['XS','S','M','L'], 4.5, 79, ['hang-moi']],
            ['vay-dam', 'Đầm Chiffon Hoa AMI', 'dam-chiffon-hoa', 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&auto=format&fit=crop&q=80', 780000, 590000, 'sale', 'hong', ['XS','S','M'], 4.4, 121, ['hang-moi','giam-gia']],

            ['ao-khoac', 'Áo Khoác Denim AMI', 'ao-khoac-denim', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80', 990000, null, 'hot', 'xanh-navy', ['S','M','L','XL'], 4.9, 289, ['ban-chay','hang-moi']],
            ['ao-khoac', 'Áo Blazer Linen AMI', 'ao-blazer-linen', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80', 1190000, null, 'new', 'be', ['XS','S','M','L'], 4.8, 76, ['hang-moi']],
            ['ao-khoac', 'Áo Khoác Gió AMI', 'ao-khoac-gio', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=600&auto=format&fit=crop&q=80', 850000, 650000, 'sale', 'den', ['S','M','L','XL'], 4.4, 143, ['giam-gia']],
            ['ao-khoac', 'Áo Bomber AMI', 'ao-bomber', 'https://images.unsplash.com/photo-1544923408-75c5cef46f14?w=600&auto=format&fit=crop&q=80', 780000, null, '', 'xam', ['S','M','L','XL'], 4.6, 187, ['ban-chay']],
            ['ao-khoac', 'Áo Len Cardigan AMI', 'ao-len-cardigan', 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80', 690000, null, 'new', 'be', ['S','M','L'], 4.7, 112, ['hang-moi']],
            ['ao-khoac', 'Áo Vest AMI', 'ao-vest', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80', 990000, null, '', 'xam', ['XS','S','M','L'], 4.8, 221, ['ban-chay']],
            ['ao-khoac', 'Áo Khoác Nhẹ AMI', 'ao-khoac-nhe', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&auto=format&fit=crop&q=80', 590000, 450000, 'sale', 'xam', ['S','M','L','XL'], 4.3, 98, ['giam-gia']],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO products
                (category_id, name, slug, image, price, price_sale, badge, description, colors, rating, in_stock, is_featured, is_new, sort_order, sizes, theme, sold, gallery)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?)"
        );

        $order = 1;
        foreach ($raw as $p) {
            [$catSlug, $name, $slug, $image, $price, $priceSale, $badge, $colorSlug, $sizes, $rating, $sold, $themes] = $p;

            $description = sprintf($descTemplate[$catSlug], $name);
            [$colorLabel, $colorHex] = $colorMap[$colorSlug];
            $colors    = "{$colorLabel}:{$colorHex}";
            $sizesCol  = '|' . implode('|', $sizes) . '|';
            $themeCol  = '|' . implode('|', $themes) . '|';
            $isFeatured = $badge === 'hot' ? 1 : 0;
            $isNew      = $badge === 'new' ? 1 : 0;

            $stmt->execute([
                $catId[$catSlug], $name, $slug, $image, $price, $priceSale, $badge, $description, $colors, $rating,
                $isFeatured, $isNew, $order, $sizesCol, $themeCol, $sold, '',
            ]);
            $order++;
        }
    }

    private function seedCoupons(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM coupons")->fetchColumn();
        if ($count > 0) return;
        $coupons = [
            // code, type, value, min_order, max_uses, expires_at, is_active
            ['AMI10',   'percent', 10,    0,      null, null, 1],
            ['GIAM50K', 'fixed',   50000, 300000, null, null, 1],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO coupons (code, type, value, min_order, max_uses, expires_at, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($coupons as $c) { $stmt->execute($c); }
    }
}
