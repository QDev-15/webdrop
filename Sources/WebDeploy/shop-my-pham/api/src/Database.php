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
        // Thêm cột coupon_code vào bảng orders nếu DB cũ chưa có (idempotent)
        try { $this->pdo->exec("ALTER TABLE orders ADD COLUMN coupon_code TEXT DEFAULT ''"); } catch (\Exception $e) {}
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
            ['site_name',        'LUMIÈRE Beauty',                                                    'general'],
            ['site_slogan',      'Mỹ phẩm cao cấp, thành phần an toàn',                                'general'],
            ['site_email',       'hello@lumiere-beauty.vn',                                            'general'],
            ['site_phone',       '0901 234 567',                                                       'general'],
            ['site_address',     '123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',                       'general'],
            ['working_hours',    'Thứ Hai – Thứ Bảy: 8:00 – 22:00, Chủ Nhật: 9:00 – 20:00',             'general'],
            ['site_description', 'LUMIÈRE — Khám phá hơn 36 sản phẩm mỹ phẩm cao cấp: chăm sóc da, trang điểm, nước hoa, dụng cụ làm đẹp. Thành phần an toàn, chính hãng 100%.', 'general'],
            ['site_logo',        '', 'general'],
            ['site_favicon',     '', 'general'],
            ['zalo_number',      '0901234567', 'general'],

            // ── Topbar (1 dòng thông báo, hiển thị mọi trang, tối đa 3 mục) ────────
            ['topbar_text_1', 'Miễn phí ship đơn từ 500K', 'general'],
            ['topbar_text_2', 'Đổi trả 30 ngày',           'general'],
            ['topbar_text_3', 'Thành phần an toàn',        'general'],

            // ── SEO ──────────────────────────────────────────────────────────────
            ['meta_title',       'LUMIÈRE Beauty — Mỹ phẩm cao cấp, thành phần an toàn', 'seo'],
            ['meta_description', 'LUMIÈRE — Khám phá hơn 36 sản phẩm mỹ phẩm cao cấp: chăm sóc da, trang điểm, nước hoa. Thành phần an toàn, chính hãng 100%.', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=80', 'seo'],
            ['ga_id',    '', 'seo'],
            ['gtm_id',   '', 'seo'],

            // ── Social ───────────────────────────────────────────────────────────
            ['facebook',  '', 'social'],
            ['instagram', '', 'social'],
            ['youtube',   '', 'social'],
            ['tiktok',    '', 'social'],

            // ── Home (Search Zone — thay thế hero ảnh trên trang chủ) ─────────────
            ['home_search_heading', 'Tìm trong 36 sản phẩm mỹ phẩm', 'home'],
            ['home_search_sub',     'Chăm sóc da · Trang điểm · Nước hoa · Dụng cụ làm đẹp', 'home'],

            // ── About (ve-chung-toi.html) ─────────────────────────────────────────
            ['about_hero_image', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&auto=format&fit=crop&q=80', 'about'],
            ['about_hero_label', 'Câu chuyện của chúng tôi', 'about'],
            ['about_hero_title1', 'Vẻ Đẹp Đích Thực', 'about'],
            ['about_hero_title2', 'Từ Thiên Nhiên', 'about'],
            ['about_hero_desc', 'Hành trình 8 năm tìm kiếm và chắt lọc những tinh hoa mỹ phẩm tốt nhất thế giới — để mỗi sản phẩm LUMIÈRE là một cam kết về chất lượng, an toàn và hiệu quả.', 'about'],

            ['story1_image', 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=700&auto=format&fit=crop&q=80', 'about'],
            ['story1_label', 'Khởi đầu — 2017', 'about'],
            ['story1_title1', 'Từ Niềm Đam Mê', 'about'],
            ['story1_title2', 'Đến Sứ Mệnh', 'about'],
            ['story1_p1', 'LUMIÈRE được thành lập năm 2017 bởi một nhóm chuyên gia mỹ phẩm và bác sĩ da liễu có cùng niềm tin: vẻ đẹp thực sự đến từ sức khỏe làn da, không phải từ lớp phủ bề ngoài.', 'about'],
            ['story1_p2', 'Xuất phát từ sự thất vọng với những sản phẩm hứa hẹn nhiều nhưng không thực sự hiệu quả — hoặc chứa hóa chất có hại — chúng tôi quyết tâm xây dựng một thương hiệu khác biệt: minh bạch về thành phần, trung thực về kết quả.', 'about'],

            ['story2_image', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=700&auto=format&fit=crop&q=80', 'about'],
            ['story2_label', 'Hôm nay', 'about'],
            ['story2_title1', 'Đối Tác Tin Cậy', 'about'],
            ['story2_title2', 'Của 50.000+ Khách Hàng', 'about'],
            ['story2_p1', 'Sau 8 năm, LUMIÈRE tự hào là đối tác làm đẹp được tin tưởng bởi hơn 50.000 khách hàng trên toàn quốc. Chúng tôi hợp tác trực tiếp với các thương hiệu mỹ phẩm hàng đầu thế giới — đảm bảo mọi sản phẩm đều chính hãng 100%.', 'about'],
            ['story2_p2', 'Mỗi sản phẩm trước khi được bày lên kệ đều qua quy trình kiểm định nghiêm ngặt: kiểm tra thành phần, hạn sử dụng, giấy tờ xuất xứ và test thực tế trên nhiều loại da khác nhau.', 'about'],

            ['value1_title', 'An Toàn Tuyệt Đối', 'about'],
            ['value1_desc', 'Không Paraben, không sulfate, không hương liệu tổng hợp. Tất cả thành phần đều được kiểm định an toàn cho mọi loại da, kể cả da nhạy cảm nhất.', 'about'],
            ['value2_title', 'Minh Bạch Thành Phần', 'about'],
            ['value2_desc', 'Chúng tôi công bố đầy đủ danh sách thành phần (INCI list) của mọi sản phẩm. Bạn có quyền biết mình đang bôi gì lên da.', 'about'],
            ['value3_title', 'Không Thử Nghiệm Động Vật', 'about'],
            ['value3_desc', 'LUMIÈRE và toàn bộ thương hiệu đối tác đều cam kết Cruelty-Free. Vẻ đẹp của bạn không đánh đổi bằng sự đau khổ của bất kỳ sinh vật nào.', 'about'],
            ['value4_title', 'Tận Tâm Phục Vụ', 'about'],
            ['value4_desc', 'Đội ngũ tư vấn viên được đào tạo bài bản sẵn sàng hỗ trợ bạn 7 ngày/tuần — từ lựa chọn sản phẩm đến xây dựng routine chăm sóc da phù hợp.', 'about'],

            ['astat1_num', '50000', 'about'], ['astat1_suffix', '+',    'about'], ['astat1_label', 'Khách hàng tin tưởng',          'about'],
            ['astat2_num', '36',    'about'], ['astat2_suffix', '',     'about'], ['astat2_label', 'Sản phẩm chính hãng',           'about'],
            ['astat3_num', '8',     'about'], ['astat3_suffix', ' năm', 'about'], ['astat3_label', 'Kinh nghiệm ngành mỹ phẩm',     'about'],
            ['astat4_num', '98',    'about'], ['astat4_suffix', '%',    'about'], ['astat4_label', 'Khách hàng hài lòng',           'about'],

            ['why1_title', 'Chính Hãng 100% — Cam Kết Hoàn Tiền Gấp Đôi', 'about'],
            ['why1_desc', 'Mọi sản phẩm tại LUMIÈRE đều có giấy tờ chứng minh xuất xứ rõ ràng, nhập trực tiếp từ thương hiệu hoặc nhà phân phối chính thức. Phát hiện hàng giả — hoàn tiền gấp đôi, không điều kiện.', 'about'],
            ['why2_title', 'Tư Vấn Da Liễu Miễn Phí Theo Từng Loại Da', 'about'],
            ['why2_desc', 'Đội ngũ tư vấn viên của LUMIÈRE — gồm chuyên gia mỹ phẩm và cộng tác viên bác sĩ da liễu — sẽ phân tích da và đề xuất routine phù hợp riêng cho bạn.', 'about'],
            ['why3_title', 'Bảo Quản Chuẩn — Kiểm Soát Nhiệt Độ Kho', 'about'],
            ['why3_desc', 'Kho hàng của LUMIÈRE được kiểm soát nhiệt độ 18–22°C, đảm bảo chất lượng sản phẩm không bị ảnh hưởng từ khi nhập về đến tay bạn.', 'about'],
            ['why4_title', 'Cộng Đồng Làm Đẹp 50.000+ Thành Viên', 'about'],
            ['why4_desc', 'Tham gia cộng đồng LUMIÈRE để nhận review thật từ người dùng thật, chia sẻ routine chăm sóc da, nhận thông tin sản phẩm mới và ưu đãi độc quyền.', 'about'],

            ['testi1_text', 'Da tôi thay đổi hoàn toàn sau 1 tháng dùng Serum Vitamin C của LUMIÈRE. Thâm nám mờ đi rõ rệt, da sáng và căng hơn hẳn. Quan trọng là không bị kích ứng — trước đây da tôi rất nhạy cảm.', 'about'],
            ['testi1_name', 'Nguyễn Mai Anh', 'about'], ['testi1_role', 'Kế toán · Hà Nội', 'about'], ['testi1_stars', '5', 'about'],
            ['testi1_avatar', 'https://images.unsplash.com/photo-1525268771113-32d9e9021a97?w=80&h=80&auto=format&fit=crop&q=70', 'about'],
            ['testi2_text', 'Mua nước hoa Chanel tại LUMIÈRE giá tốt hơn cửa hàng duty-free mà vẫn chính hãng 100%. Nhân viên tư vấn rất nhiệt tình, giúp tôi chọn được mùi phù hợp với phong cách. Sẽ quay lại mua tiếp.', 'about'],
            ['testi2_name', 'Trần Thanh Hương', 'about'], ['testi2_role', 'Giám đốc Marketing · TP.HCM', 'about'], ['testi2_stars', '5', 'about'],
            ['testi2_avatar', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&h=80&auto=format&fit=crop&q=70', 'about'],
            ['testi3_text', 'Tôi đã thử nhiều thương hiệu mỹ phẩm online khác nhau và thường lo về hàng giả. Nhưng LUMIÈRE luôn có hóa đơn chính hãng, đóng gói cẩn thận và giao hàng đúng hẹn. Tuyệt vời!', 'about'],
            ['testi3_name', 'Lê Ngọc Lan', 'about'], ['testi3_role', 'Giáo viên · Đà Nẵng', 'about'], ['testi3_stars', '5', 'about'],
            ['testi3_avatar', 'https://images.unsplash.com/photo-1506252374453-ef5237291d83?w=80&h=80&auto=format&fit=crop&q=70', 'about'],

            ['policy1_title', 'Miễn Phí Vận Chuyển', 'about'],
            ['policy1_desc', 'Cho đơn hàng từ 500.000đ trên toàn quốc. Giao hàng nhanh 1–2 ngày tại TP.HCM và Hà Nội. Cam kết đóng gói cẩn thận, nguyên vẹn.', 'about'],
            ['policy2_title', 'Đổi Trả 30 Ngày', 'about'],
            ['policy2_desc', 'Sản phẩm lỗi, không đúng mô tả hoặc gây kích ứng không mong muốn — đổi trả miễn phí trong 30 ngày kể từ ngày nhận hàng.', 'about'],
            ['policy3_title', 'Chính Hãng Bảo Đảm', 'about'],
            ['policy3_desc', '100% hàng chính hãng có hóa đơn, giấy tờ nhập khẩu đầy đủ. Phát hiện hàng giả — hoàn tiền gấp đôi ngay lập tức, không điều kiện kèm theo.', 'about'],
            ['policy4_title', 'Tư Vấn Chuyên Gia', 'about'],
            ['policy4_desc', 'Chat trực tiếp với chuyên gia tư vấn mỹ phẩm — 7 ngày/tuần, từ 8h–22h. Phân tích loại da miễn phí và xây dựng routine chăm sóc da cá nhân hóa.', 'about'],

            ['about_cta_label', 'Bắt đầu hành trình làm đẹp', 'about'],
            ['about_cta_title1', 'Sẵn Sàng Chăm Sóc', 'about'],
            ['about_cta_title2', 'Làn Da Của Bạn?', 'about'],
            ['about_cta_desc',  'Khám phá hơn 36 sản phẩm mỹ phẩm cao cấp, chính hãng từ các thương hiệu hàng đầu thế giới. Tư vấn viên của chúng tôi sẵn sàng giúp bạn tìm đúng sản phẩm cho làn da.', 'about'],

            // ── Collection (bo-suu-tap.html) ──────────────────────────────────────
            ['coll_hero_title','Bộ Sưu Tập', 'collection'],
            ['coll_hero_sub',  'Những bộ sưu tập mỹ phẩm được tuyển chọn kỹ lưỡng, mang đến trải nghiệm làm đẹp hoàn chỉnh', 'collection'],

            ['c1_image', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1400&auto=format&fit=crop&q=80', 'collection'],
            ['c1_label', 'Bộ sưu tập 01', 'collection'],
            ['c1_title1', 'Skincare Routine', 'collection'],
            ['c1_title2', 'Toàn Diện', 'collection'],
            ['c1_desc', 'Bộ đôi hoàn hảo từ tẩy trang đến chống nắng — 10 bước chăm sóc da chuẩn K-Beauty cho làn da căng bóng, khỏe mạnh.', 'collection'],
            ['c1_link', '/san-pham?category=cham-soc-da', 'collection'],
            ['c1_link_label', 'Xem bộ sưu tập →', 'collection'],

            ['c2_image', 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=700&auto=format&fit=crop&q=80', 'collection'],
            ['c2_label', 'Bộ sưu tập 02', 'collection'],
            ['c2_title1', 'Hương Thơm', 'collection'],
            ['c2_title2', 'Đặc Quyền', 'collection'],
            ['c2_desc', 'Những mùi hương đẳng cấp từ các nhà chế tác nổi tiếng thế giới. Mỗi chai nước hoa là một câu chuyện cảm xúc riêng biệt — từ floral sang trọng đến oriental huyền bí.', 'collection'],
            ['c2_feature1', 'Nồng độ EDP (Eau de Parfum) lưu hương 6–12 giờ', 'collection'],
            ['c2_feature2', 'Nguyên liệu nhập khẩu từ Pháp & Trung Đông', 'collection'],
            ['c2_feature3', 'Bao bì cao cấp, phù hợp làm quà tặng', 'collection'],
            ['c2_link', '/san-pham?category=nuoc-hoa', 'collection'],
            ['c2_link_label', 'Khám phá ngay →', 'collection'],

            ['c3_image', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=700&auto=format&fit=crop&q=80', 'collection'],
            ['c3_label', 'Bộ sưu tập 03', 'collection'],
            ['c3_title1', 'Công Cụ Làm Đẹp', 'collection'],
            ['c3_title2', 'Chuyên Nghiệp', 'collection'],
            ['c3_desc', 'Từ máy rửa mặt sonic, bộ cọ trang điểm cao cấp đến lăn đá thạch anh hồng — tất cả công cụ bạn cần để nâng tầm quy trình làm đẹp tại nhà lên chuẩn salon chuyên nghiệp.', 'collection'],
            ['c3_feature1', 'Chất liệu cao cấp, độ bền cao', 'collection'],
            ['c3_feature2', 'Được kiểm định an toàn cho da nhạy cảm', 'collection'],
            ['c3_feature3', 'Hướng dẫn sử dụng chi tiết kèm theo', 'collection'],
            ['c3_link', '/san-pham?category=dung-cu-lam-dep', 'collection'],
            ['c3_link_label', 'Khám phá ngay →', 'collection'],

            // ── Footer ───────────────────────────────────────────────────────────
            ['footer_about', 'Mỹ phẩm cao cấp, thành phần an toàn. Vẻ đẹp đích thực từ thiên nhiên.', 'footer'],

            // ── Contact (lien-he.html) ─────────────────────────────────────────────
            ['contact_note', 'Phản hồi trong vòng 2 giờ trong giờ làm việc.', 'contact'],
            ['return_policy_note', 'Đổi trả miễn phí trong 30 ngày kể từ ngày nhận hàng. Sản phẩm còn nguyên seal, chưa qua sử dụng. Hàng lỗi / không đúng mô tả: đổi ngay, không tính phí. Liên hệ hotline hoặc email để được hỗ trợ.', 'contact'],

            // ── Payment (tab "💳 Thanh toán") ────────────────────────────────────────
            ['payment_cod_enabled',      '1', 'payment'],
            ['payment_sepay_enabled',    '1', 'payment'],
            ['sepay_bank_code',          'MB',  'payment'],
            ['sepay_account_number',     '0099001122334',  'payment'],
            ['sepay_account_name',       'WEBDROP STORE TEST',  'payment'],
            ['sepay_webhook_secret',     'TEST_SEPAY_API_2026',  'payment'],
            ['shipping_fee',             '30000',   'payment'],
            ['free_shipping_threshold',  '500000',  'payment'],

            // ── Shop policy ──────────────────────────────────────────────────────────
            ['return_days', '30', 'shop'],

            // ── SMTP ─────────────────────────────────────────────────────────────────
            ['smtp_host',      '', 'smtp'],
            ['smtp_port',      '587', 'smtp'],
            ['smtp_user',      '', 'smtp'],
            ['smtp_pass',      '', 'smtp'],
            ['smtp_from',      '', 'smtp'],
            ['smtp_from_name', 'LUMIÈRE Beauty', 'smtp'],

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
        // Trang chủ LUMIÈRE dùng "Search Zone" (h1 + ô tìm kiếm lớn + category chips) thay cho hero
        // slider ảnh — template gốc không có bất kỳ hero/lifestyle image nào ở trang chủ.
        // Vẫn seed 1 record để giữ menu "Hero Slides" hoạt động đúng chuẩn scaffold (không hiển thị trên site).
        $slides = [
            ['Search Zone trang chủ LUMIÈRE Beauty', 'Không hiển thị dạng ảnh — nội dung ô tìm kiếm quản lý ở Cài đặt > Trang chủ', '', '', '', 1, 'published'],
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
        // id: 1 Chăm Sóc Da, 2 Trang Điểm, 3 Chăm Sóc Tóc, 4 Nước Hoa, 5 Dụng Cụ Làm Đẹp
        $cats = [
            ['Chăm Sóc Da',      'cham-soc-da',      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80', 1],
            ['Trang Điểm',       'trang-diem',       'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80', 2],
            ['Chăm Sóc Tóc',     'cham-soc-toc',     'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=600&auto=format&fit=crop&q=80', 3],
            ['Nước Hoa',         'nuoc-hoa',         'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80', 4],
            ['Dụng Cụ Làm Đẹp',  'dung-cu-lam-dep',  'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80', 5],
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
        $catId = ['cham-soc-da' => 1, 'trang-diem' => 2, 'cham-soc-toc' => 3, 'nuoc-hoa' => 4, 'dung-cu-lam-dep' => 5];

        // Mô tả theo danh mục — nội dung thật viết theo giọng văn thương hiệu LUMIÈRE
        // (ve-chung-toi.html: minh bạch thành phần, an toàn, chính hãng), không phải Lorem ipsum.
        $descTemplate = [
            'cham-soc-da'     => '%s giúp cải thiện tình trạng da rõ rệt sau thời gian sử dụng đều đặn. Công thức không chứa hương liệu tổng hợp, không Paraben, phù hợp với da nhạy cảm. Kết hợp cùng quy trình chăm sóc da hàng ngày để đạt hiệu quả tốt nhất — sáng da, đều màu, khỏe mạnh từ bên trong.',
            'trang-diem'      => '%s mang đến lớp trang điểm hoàn hảo, lâu trôi mà vẫn mỏng nhẹ, thoáng da. Chất liệu chính hãng nhập khẩu, được kiểm định an toàn cho mọi loại da. Dễ dàng phối hợp trong mọi routine trang điểm, từ đi làm hàng ngày đến các dịp đặc biệt.',
            'cham-soc-toc'    => '%s phục hồi mái tóc hư tổn từ sâu bên trong, giúp tóc chắc khỏe, mềm mượt và giảm gãy rụng. Thành phần chiết xuất tự nhiên, không chứa sulfate gây hại, an toàn cho da đầu nhạy cảm. Sử dụng đều đặn để thấy sự khác biệt rõ rệt.',
            'nuoc-hoa'        => '%s mang đến mùi hương tinh tế, lưu hương lâu và đẳng cấp. Nguyên liệu chọn lọc từ các nhà chế tác nước hoa nổi tiếng thế giới, đóng chai chính hãng 100%% có tem nhập khẩu. Một lựa chọn hoàn hảo cho cả sử dụng hàng ngày lẫn làm quà tặng sang trọng.',
            'dung-cu-lam-dep' => '%s được thiết kế tối ưu cho quy trình làm đẹp tại nhà, chất liệu cao cấp, độ bền cao và đã qua kiểm định an toàn. Dễ sử dụng, dễ vệ sinh, giúp nâng tầm routine chăm sóc bản thân lên chuẩn chuyên nghiệp như tại salon.',
        ];

        // Copy nguyên 36 sản phẩm thật từ assets/js/products-data.js của template — không bịa.
        // [category_slug, name, slug, image, price, price_sale, badge, brand, skinTypes[], rating, sold, theme[]]
        $raw = [
            // Chăm sóc da (8)
            ['cham-soc-da', 'Serum Vitamin C & Niacinamide', 'serum-vitamin-c-niacinamide', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80', 580000, null, 'hot', 'The Ordinary', ['da-dau','da-hon-hop'], 4.8, 248, ['ban-chay','hang-moi']],
            ['cham-soc-da', 'Kem Dưỡng Ẩm Sâu Hyaluronic', 'kem-duong-am-sau-hyaluronic', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&auto=format&fit=crop&q=80', 720000, null, '', 'CeraVe', ['da-kho','da-nhay-cam','moi-loai-da'], 4.7, 195, ['ban-chay']],
            ['cham-soc-da', 'Toner Cân Bằng Da pH Essence', 'toner-can-bang-da-ph', 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&auto=format&fit=crop&q=80', 390000, null, '', 'Innisfree', ['da-dau','da-hon-hop','moi-loai-da'], 4.5, 173, ['ban-chay']],
            ['cham-soc-da', 'Sữa Rửa Mặt Dịu Nhẹ Ceramide', 'sua-rua-mat-diu-nhe-ceramide', 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=600&auto=format&fit=crop&q=80', 320000, null, 'new', 'CeraVe', ['da-nhay-cam','moi-loai-da'], 4.6, 142, ['hang-moi']],
            ['cham-soc-da', 'Kem Chống Nắng SPF50+ PA++++', 'kem-chong-nang-spf50-pa', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80', 450000, 360000, 'sale', 'Anessa', ['moi-loai-da'], 4.9, 312, ['ban-chay','giam-gia']],
            ['cham-soc-da', 'Mặt Nạ Dưỡng Da Ngủ Laneige', 'mat-na-duong-da-ngu-laneige', 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop&q=80', 680000, 520000, 'sale', 'Laneige', ['moi-loai-da'], 4.4, 98, ['giam-gia']],
            ['cham-soc-da', 'Kem Mắt Chống Lão Hóa Collagen', 'kem-mat-chong-lao-hoa-collagen', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80', 850000, null, 'new', 'Sulwhasoo', ['moi-loai-da'], 4.8, 67, ['hang-moi']],
            ['cham-soc-da', 'Retinol Serum 0.5% Anti-Aging', 'retinol-serum-05-anti-aging', 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600&auto=format&fit=crop&q=80', 690000, null, '', 'The Ordinary', ['da-kho','moi-loai-da'], 4.7, 178, ['ban-chay']],

            // Trang điểm (8)
            ['trang-diem', 'Kem Nền Lâu Trôi Pro Longwear', 'kem-nen-lau-troi-pro-longwear', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80', 890000, null, 'hot', 'MAC', ['da-dau','da-hon-hop'], 4.8, 224, ['ban-chay']],
            ['trang-diem', 'Son Môi Velvet Liquid Rouge', 'son-moi-velvet-liquid-rouge', 'https://images.unsplash.com/photo-1551038247-3d9af20df552?w=600&auto=format&fit=crop&q=80', 520000, null, 'new', 'Charlotte Tilbury', ['moi-loai-da'], 4.9, 289, ['ban-chay','hang-moi']],
            ['trang-diem', 'Phấn Mắt 16 Màu Smoky Eyes', 'phan-mat-16-mau-smoky-eyes', 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=600&auto=format&fit=crop&q=80', 750000, null, '', 'MAC', ['moi-loai-da'], 4.7, 156, ['ban-chay']],
            ['trang-diem', 'Mascara Dài Mi Ultra Volume', 'mascara-dai-mi-ultra-volume', 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&auto=format&fit=crop&q=80', 390000, 299000, 'sale', "L'Occitane", ['moi-loai-da'], 4.5, 134, ['giam-gia']],
            ['trang-diem', 'Kem Che Khuyết Điểm HD Cover', 'kem-che-khuyet-diem-hd', 'https://images.unsplash.com/photo-1592136957897-b2b6ca21e10d?w=600&auto=format&fit=crop&q=80', 420000, null, 'new', 'Charlotte Tilbury', ['da-kho','da-nhay-cam'], 4.6, 89, ['hang-moi']],
            ['trang-diem', 'Má Hồng Peach Glow Blush', 'ma-hong-peach-glow-blush', 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=600&auto=format&fit=crop&q=80', 580000, null, 'new', 'Charlotte Tilbury', ['moi-loai-da'], 4.8, 112, ['hang-moi']],
            ['trang-diem', 'Highlighter Satin Glow', 'highlighter-satin-glow', 'https://images.unsplash.com/photo-1542736143-29a8432162bc?w=600&auto=format&fit=crop&q=80', 490000, 370000, 'sale', 'MAC', ['moi-loai-da'], 4.6, 78, ['giam-gia']],
            ['trang-diem', 'Phấn Phủ Kiểm Dầu Translucent', 'phan-phu-kiem-dau-translucent', 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?w=600&auto=format&fit=crop&q=80', 620000, null, '', 'MAC', ['da-dau','da-hon-hop'], 4.7, 189, ['ban-chay']],

            // Chăm sóc tóc (7)
            ['cham-soc-toc', 'Dầu Gội Phục Hồi Hư Tổn', 'dau-goi-phuc-hoi-hu-ton', 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=600&auto=format&fit=crop&q=80', 380000, null, '', 'Kérastase', ['moi-loai-da'], 4.7, 201, ['ban-chay']],
            ['cham-soc-toc', 'Dầu Xả Keratin Phục Hồi Sâu', 'dau-xa-keratin-phuc-hoi-sau', 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=600&auto=format&fit=crop&q=80', 420000, null, '', 'Kérastase', ['moi-loai-da'], 4.6, 167, ['ban-chay']],
            ['cham-soc-toc', 'Mặt Nạ Tóc Collagen Deep Care', 'mat-na-toc-collagen-deep', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80', 550000, 420000, 'sale', "L'Occitane", ['moi-loai-da'], 4.5, 89, ['giam-gia']],
            ['cham-soc-toc', 'Tinh Dầu Dưỡng Tóc Argan Oil', 'tinh-dau-duong-toc-argan', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80', 680000, null, 'new', "L'Occitane", ['moi-loai-da'], 4.8, 124, ['hang-moi']],
            ['cham-soc-toc', 'Xịt Dưỡng Tóc Leave-In', 'xit-duong-toc-leave-in', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80', 310000, 240000, 'sale', 'Kérastase', ['moi-loai-da'], 4.4, 76, ['giam-gia']],
            ['cham-soc-toc', 'Serum Tóc Chống Đứt Gãy', 'serum-toc-chong-dut-gay', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&auto=format&fit=crop&q=80', 490000, null, '', 'Kérastase', ['moi-loai-da'], 4.7, 143, ['ban-chay']],
            ['cham-soc-toc', 'Kem Ủ Tóc Phục Hồi Overnight', 'kem-u-toc-phuc-hoi-overnight', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&auto=format&fit=crop&q=80', 360000, null, 'new', "L'Occitane", ['moi-loai-da'], 4.5, 58, ['hang-moi']],

            // Nước hoa (6)
            ['nuoc-hoa', 'Nước Hoa Floral Bloom EDP', 'nuoc-hoa-floral-bloom-edp', 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80', 1850000, null, 'new', 'Chanel', ['moi-loai-da'], 4.9, 87, ['ban-chay','hang-moi']],
            ['nuoc-hoa', 'Nước Hoa Rose Noir EDP 75ml', 'nuoc-hoa-rose-noir-edp', 'https://images.unsplash.com/photo-1521341957697-b93449760f30?w=600&auto=format&fit=crop&q=80', 2100000, null, '', 'Chanel', ['moi-loai-da'], 4.8, 64, ['ban-chay']],
            ['nuoc-hoa', 'Tinh Dầu Khuếch Tán Phòng', 'tinh-dau-khuech-tan-phong', 'https://images.unsplash.com/photo-1527239441953-caffd968d952?w=600&auto=format&fit=crop&q=80', 680000, 520000, 'sale', "L'Occitane", ['moi-loai-da'], 4.6, 112, ['giam-gia']],
            ['nuoc-hoa', 'Nước Hoa Tóc Floral Hair Mist', 'nuoc-hoa-toc-floral-mist', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80', 480000, null, 'new', 'Chanel', ['moi-loai-da'], 4.5, 45, ['hang-moi']],
            ['nuoc-hoa', 'Set Nước Hoa Mini 5 Mùi', 'set-nuoc-hoa-mini-5-mui', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80', 950000, 720000, 'sale', 'Chanel', ['moi-loai-da'], 4.7, 98, ['giam-gia']],
            ['nuoc-hoa', 'Nước Hoa Oriental Oud Noir EDP', 'nuoc-hoa-oriental-oud-noir', 'https://images.unsplash.com/photo-1551292831-023188e78222?w=600&auto=format&fit=crop&q=80', 2500000, null, '', 'Chanel', ['moi-loai-da'], 4.9, 38, ['ban-chay']],

            // Dụng cụ làm đẹp (7)
            ['dung-cu-lam-dep', 'Máy Rửa Mặt Sonic Vibration', 'may-rua-mat-sonic-vibration', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80', 1250000, null, 'hot', 'Foreo', ['moi-loai-da'], 4.8, 145, ['ban-chay']],
            ['dung-cu-lam-dep', 'Bộ Cọ Trang Điểm 12 Cái', 'bo-co-trang-diem-12-cai', 'https://images.unsplash.com/photo-1506252374453-ef5237291d83?w=600&auto=format&fit=crop&q=80', 680000, null, '', 'MAC', ['moi-loai-da'], 4.7, 132, ['ban-chay']],
            ['dung-cu-lam-dep', 'Bông Tán Phấn Đàn Hồi Velvet', 'bong-tan-phan-dan-hoi-velvet', 'https://images.unsplash.com/photo-1525268771113-32d9e9021a97?w=600&auto=format&fit=crop&q=80', 120000, 89000, 'sale', 'Generic', ['moi-loai-da'], 4.3, 78, ['giam-gia']],
            ['dung-cu-lam-dep', 'Gương Trang Điểm LED 3 Chế Độ', 'guong-trang-diem-led-3-che-do', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80', 890000, null, 'new', 'Generic', ['moi-loai-da'], 4.6, 67, ['hang-moi']],
            ['dung-cu-lam-dep', 'Máy Cuộn Mi Hơi Nóng Tự Động', 'may-cuon-mi-hoi-nong', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80', 350000, 270000, 'sale', 'Generic', ['moi-loai-da'], 4.4, 56, ['giam-gia']],
            ['dung-cu-lam-dep', 'Lăn Đá Thạch Anh Hồng Dưỡng Da', 'lan-da-thach-anh-hong', 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&auto=format&fit=crop&q=80', 480000, null, '', 'Generic', ['moi-loai-da'], 4.7, 198, ['ban-chay','hang-moi']],
            ['dung-cu-lam-dep', 'Máy Xịt Khoáng Nano Mist Facial', 'may-xit-khoang-nano-mist', 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=600&auto=format&fit=crop&q=80', 290000, null, '', 'Generic', ['moi-loai-da'], 4.5, 134, ['ban-chay']],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO products
                (category_id, name, slug, image, price, price_sale, badge, description, rating, in_stock, is_featured, is_new, sort_order, brand, skin_type, theme, sold, gallery)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?)"
        );

        $order = 1;
        foreach ($raw as $p) {
            [$catSlug, $name, $slug, $image, $price, $priceSale, $badge, $brand, $skinTypes, $rating, $sold, $themes] = $p;

            $description = sprintf($descTemplate[$catSlug], $name);
            $skinTypeCol = '|' . implode('|', $skinTypes) . '|';
            $themeCol    = '|' . implode('|', $themes) . '|';
            $isFeatured  = $badge === 'hot' ? 1 : 0;
            $isNew       = $badge === 'new' ? 1 : 0;

            $stmt->execute([
                $catId[$catSlug], $name, $slug, $image, $price, $priceSale, $badge, $description, $rating,
                $isFeatured, $isNew, $order, $brand, $skinTypeCol, $themeCol, $sold, '',
            ]);
            $order++;
        }
    }

    private function seedCoupons(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM coupons")->fetchColumn();
        if ($count > 0) return;
        $stmt = $this->pdo->prepare(
            "INSERT INTO coupons (code, type, value, min_order, max_uses, is_active) VALUES (?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute(['BEAUTY10', 'percent', 10, 300000, 100, 1]);
        $stmt->execute(['GIAM50K',  'fixed',   50000, 500000, 50,  1]);
    }
}
