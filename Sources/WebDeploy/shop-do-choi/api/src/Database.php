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
            ['site_name',        'KidZone',                                           'general'],
            ['site_slogan',      'Shop Đồ Chơi Trẻ Em An Toàn, Chất Lượng Cao',        'general'],
            ['site_email',       'hello@kidzone.vn',                                  'general'],
            ['site_phone',       '0901 234 567',                                      'general'],
            ['site_address',     '123 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh',          'general'],
            ['working_hours',    '9:00 – 21:00 · Tất cả các ngày trong tuần',          'general'],
            ['site_description', 'KidZone — shop đồ chơi trẻ em chất lượng cao, an toàn. Hơn 500 sản phẩm giáo dục, Lego, búp bê, xe mô hình cho bé từ 0–12 tuổi.', 'general'],
            ['site_logo',        '', 'general'],
            ['site_favicon',     '', 'general'],
            ['zalo_number',      '0901234567', 'general'],

            ['meta_title',       'KidZone — Shop Đồ Chơi Trẻ Em Chất Lượng Cao', 'seo'],
            ['meta_description', 'Khám phá hơn 500 loại đồ chơi an toàn, chất lượng cho bé từ 0–12 tuổi. Giáo dục, Lego, búp bê, xe, ngoài trời. Miễn phí ship từ 300K.', 'seo'],
            ['og_image', '', 'seo'],
            ['ga_id',    '', 'seo'],
            ['gtm_id',   '', 'seo'],

            ['facebook',  'https://www.facebook.com/kidzone',  'social'],
            ['instagram', 'https://www.instagram.com/kidzone', 'social'],
            ['tiktok',    'https://www.tiktok.com/@kidzone',   'social'],
            ['zalo',      'https://zalo.me/0901234567',        'social'],

            ['hero_tag',           'Tìm đồ chơi hoàn hảo cho bé yêu', 'hero'],
            ['hero_stat1_num',     '500', 'hero'], ['hero_stat1_suffix', '+',   'hero'], ['hero_stat1_label', 'Sản phẩm', 'hero'],
            ['hero_stat2_num',     '50000', 'hero'], ['hero_stat2_suffix', '+', 'hero'], ['hero_stat2_label', 'Khách hàng', 'hero'],
            ['hero_stat3_num',     '4', 'hero'], ['hero_stat3_suffix', '.8★', 'hero'], ['hero_stat3_label', 'Đánh giá trung bình', 'hero'],

            ['value1_icon',  'patch-check-fill', 'values'],
            ['value1_title', 'An toàn 100%',            'values'],
            ['value1_desc',  'Tất cả sản phẩm được kiểm định đạt tiêu chuẩn an toàn quốc tế cho trẻ em', 'values'],
            ['value2_icon',  'arrow-repeat',  'values'],
            ['value2_title', 'Đổi trả trong 30 ngày',        'values'],
            ['value2_desc',  'Không hài lòng? Đổi hoặc hoàn tiền 100%, không cần lý do', 'values'],
            ['value3_icon',  'truck',         'values'],
            ['value3_title', 'Miễn phí ship từ 300K',             'values'],
            ['value3_desc',  'Giao hàng toàn quốc, gói cẩn thận, không lo móp hộp', 'values'],
            ['value4_icon',  'headset',       'values'],
            ['value4_title', 'Tư vấn miễn phí 24/7',               'values'],
            ['value4_desc',  'Đội ngũ tư vấn viên sẽ giúp bạn chọn đồ chơi phù hợp lứa tuổi bé', 'values'],

            ['reviews_avg',      '4.8', 'reviews'],
            ['reviews_count',    '2.500+', 'reviews'],
            ['review1_name',     'Mẹ Hà Nội', 'reviews'],
            ['review1_location', 'Hà Nội · Tháng 6/2025', 'reviews'],
            ['review1_content',  'Bé mình rất thích các đồ chơi từ KidZone. An toàn, chất lượng và giá hợp lý. Sẽ ủng hộ tiếp!', 'reviews'],
            ['review1_rating',   '5', 'reviews'],
            ['review2_name',     'Anh Đức', 'reviews'],
            ['review2_location', 'TP.HCM · Tháng 5/2025', 'reviews'],
            ['review2_content',  'Giao nhanh, đóng gói cẩn thận. Bé 3 tuổi của mình chơi Lego cả ngày không chán. Tuyệt!', 'reviews'],
            ['review2_rating',   '5', 'reviews'],
            ['review3_name',     'Chị Mai', 'reviews'],
            ['review3_location', 'Đà Nẵng · Tháng 5/2025', 'reviews'],
            ['review3_content',  'Sản phẩm giáo dục rất hữu ích cho sự phát triển của trẻ. Mình mua lần 2 rồi đây.', 'reviews'],
            ['review3_rating',   '5', 'reviews'],
            ['review4_name',     'Ông Hùng', 'reviews'],
            ['review4_location', 'Cần Thơ · Tháng 4/2025', 'reviews'],
            ['review4_content',  'Giá không rẻ nhưng chất lượng xứng đáng. Bé trai mình thích chơi các xe mô hình này.', 'reviews'],
            ['review4_rating',   '4', 'reviews'],

            ['stat1_num', '50000', 'stats'], ['stat1_suffix', '+', 'stats'], ['stat1_label', 'Khách hàng hài lòng', 'stats'],
            ['stat2_num', '500',   'stats'], ['stat2_suffix', '+', 'stats'], ['stat2_label', 'Sản phẩm', 'stats'],
            ['stat3_num', '2',     'stats'], ['stat3_suffix', ' năm', 'stats'], ['stat3_label', 'Kinh nghiệm', 'stats'],
            ['stat4_num', '63',    'stats'], ['stat4_suffix', ' tỉnh', 'stats'], ['stat4_label', 'Giao hàng toàn quốc', 'stats'],

            ['newsletter_title', 'Đăng ký nhận tin khuyến mãi', 'newsletter'],
            ['newsletter_desc',  'Nhận thông báo hàng mới, ưu đãi độc quyền và mã giảm giá đặc biệt cho bé yêu', 'newsletter'],

            ['footer_desc', 'KidZone — thương hiệu đồ chơi trẻ em uy tín, chất lượng cao, an toàn và giáo dục. Đồng hành cùng sự phát triển của bé từ 0–12 tuổi.', 'footer'],

            ['contact_intro', 'Nếu có thắc mắc về sản phẩm hoặc bé của bạn, đội ngũ tư vấn viên của KidZone luôn sẵn sàng hỗ trợ', 'contact'],
            ['map_embed',     'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0962853684824!2d105.84372241493954!3d21.027763885995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2sHoan%20Kiem%20Lake!5e0!3m2!1sen!2s!4v1626123456789!5m2!1sen!2s', 'contact'],

            ['return_days', '30', 'shop'],

            ['payment_cod_enabled',      '1', 'payment'],
            ['payment_sepay_enabled',    '0', 'payment'],
            ['sepay_bank_code',          '',  'payment'],
            ['sepay_account_number',     '',  'payment'],
            ['sepay_account_name',       '',  'payment'],
            ['sepay_webhook_secret',     '',  'payment'],
            ['shipping_fee',             '30000',  'payment'],
            ['free_shipping_threshold',  '300000', 'payment'],

            ['smtp_host',      '', 'smtp'],
            ['smtp_port',      '587', 'smtp'],
            ['smtp_user',      '', 'smtp'],
            ['smtp_pass',      '', 'smtp'],
            ['smtp_from',      '', 'smtp'],
            ['smtp_from_name', 'KidZone', 'smtp'],

            ['maintenance_mode', '0', 'system'],

            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key',    '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            ['cloudinary_folder',     '', 'cloudinary'],

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
                'Tìm đồ chơi hoàn hảo cho bé',
                'Hơn 500 sản phẩm an toàn, chất lượng cao từ 0–12 tuổi. Giáo dục, vui nhộn, phát triển tài năng.',
                'https://images.unsplash.com/photo-1631810481842-fd5b15243399?w=1600&auto=format&fit=crop&q=80',
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
            ['Đồ chơi giáo dục',  'do-choi-giao-duc',  'https://images.unsplash.com/photo-1633569762417-a4d25b60cb6b?w=500&auto=format&fit=crop&q=80', 1],
            ['Xe & Mô hình',      'xe-mo-hinh',        'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&auto=format&fit=crop&q=80', 2],
            ['Búp bê & Thú bông', 'bup-be-thu-bong',   'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop&q=80', 3],
            ['Đồ chơi ngoài trời', 'do-choi-ngoai-troi','https://images.unsplash.com/photo-1596515714384-4e32bedb98b0?w=500&auto=format&fit=crop&q=80', 4],
            ['Lego & Xếp hình',   'lego-xep-hinh',     'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&auto=format&fit=crop&q=80', 5],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO product_categories (name, slug, image, sort_order) VALUES (?, ?, ?, ?)"
        );
        foreach ($cats as $c) { $stmt->execute($c); }
    }

    private function seedProducts(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
        if ($count > 0) return;

        $colBlue   = 'Sky Blue:#7ec8e3';
        $colYellow = 'Sunny Yellow:#ffd66b';
        $colCoral  = 'Coral:#ff6b6b';

        $products = [
            // Đồ chơi giáo dục (7)
            [1, 'Bộ xếp hình học thông minh', 'bo-xep-hinh-hoc-thong-minh',
             'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=700&auto=format&fit=crop&q=80',
             280000, null, 'Bán chạy', 'Bộ xếp hình học phát triển kỹ năng toán học cho bé 3-5 tuổi.', "$colBlue", 4.8, 1, 1, 0, 1],
            [1, 'Bảng chữ cái nam châm 26 chữ', 'bang-chu-cai-nam-cham',
             'https://images.unsplash.com/photo-1633469924738-52101af51d87?w=700&auto=format&fit=crop&q=80',
             195000, null, '', 'Bảng chữ cái Nam châm giúp bé học tiếng Việt vui nhộn.', "$colYellow", 4.6, 1, 0, 0, 2],
            [1, 'Đồ chơi thả hình khối màu sắc', 'do-choi-tha-hinh-khoi',
             'https://images.unsplash.com/photo-1516641051054-9df6a1aad654?w=700&auto=format&fit=crop&q=80',
             320000, null, 'Mới', 'Đồ chơi thả hình khối phát triển khả năng nhận biết màu sắc cho bé 0-2 tuổi.', "$colBlue|$colYellow", 4.7, 1, 0, 1, 3],
            [1, 'Bộ thí nghiệm khoa học mini', 'bo-thi-nghiem-khoa-hoc-mini',
             'https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?w=700&auto=format&fit=crop&q=80',
             580000, null, '', 'Bộ thí nghiệm khoa học STEM giúp bé tò mò khám phá thế giới.', "$colCoral", 4.9, 1, 1, 0, 4],
            [1, 'Trò chơi ghép tranh 100 miếng', 'tro-choi-ghep-tranh-100',
             'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=700&auto=format&fit=crop&q=80',
             150000, 120000, 'Giảm', 'Ghép tranh 100 miếng rèn luyện tập trung và kiên nhẫn cho bé 6-8 tuổi.', "$colBlue", 4.4, 1, 0, 0, 5],
            [1, 'Bảng vẽ ma thuật LCD không bẩn', 'bang-ve-ma-thuat-lcd',
             'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=700&auto=format&fit=crop&q=80',
             245000, null, 'Mới', 'Bảng vẽ LCD phát triển sáng tạo của bé, nét vẽ sắc nét và rõ ràng.', "$colYellow", 4.5, 1, 0, 1, 6],
            [1, 'Bộ nhạc cụ thu nhỏ cho bé', 'bo-nhac-cu-thu-nho',
             'https://images.unsplash.com/photo-1600978398568-48175fd97cce?w=700&auto=format&fit=crop&q=80',
             350000, null, 'Bán chạy', 'Nhạc cụ giáo dục phát triển thính giác và khả năng âm nhạc cho bé.', "$colCoral", 4.7, 1, 1, 0, 7],

            // Xe & Mô hình (7)
            [2, 'Xe ô tô điều khiển từ xa tốc độ cao', 'xe-o-to-dieu-khien-tu-xa',
             'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?w=700&auto=format&fit=crop&q=80',
             550000, null, 'Bán chạy', 'Xe điều khiển từ xa tốc độ cao 60km/h, phù hợp bé 6-8 tuổi trở lên.', "$colBlue", 4.7, 1, 1, 0, 8],
            [2, 'Bộ đường ray tàu hỏa điện đầy đủ', 'bo-duong-ray-tau-hoa-dien',
             'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&auto=format&fit=crop&q=80',
             680000, null, '', 'Bộ đường ray tàu hỏa điện với nhiều chi tiết phong cảnh chi tiết.', "$colYellow", 4.8, 1, 0, 0, 9],
            [2, 'Xe mô hình kim loại die-cast 1:36', 'xe-mo-hinh-kim-loai-die-cast',
             'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=700&auto=format&fit=crop&q=80',
             145000, 99000, 'Giảm', 'Xe mô hình kim loại chất lượng cao, chi tiết sắc sảo.', "$colCoral", 4.3, 1, 0, 0, 10],
            [2, 'Máy bay điều khiển từ xa 4 kênh', 'may-bay-dieu-khien-tu-xa',
             'https://images.unsplash.com/photo-1597534458220-9fb4969f2df5?w=700&auto=format&fit=crop&q=80',
             890000, null, 'Mới', 'Máy bay điều khiển từ xa với công nghệ 4 kênh ổn định bay.', "$colBlue", 4.6, 1, 0, 1, 11],
            [2, 'Xe ben xây dựng đồ chơi cỡ lớn', 'xe-ben-xay-dung-do-choi',
             'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=700&auto=format&fit=crop&q=80',
             280000, null, '', 'Xe ben xây dựng cỡ lớn với thùng chứa kéo được, phù hợp bé 3-5 tuổi.', "$colYellow", 4.4, 1, 0, 0, 12],
            [2, 'Xe đua mô hình 4WD tốc độ 35km/h', 'xe-dua-mo-hinh-4wd',
             'https://images.unsplash.com/photo-1561049933-c8fbef47b329?w=700&auto=format&fit=crop&q=80',
             720000, null, 'Bán chạy', 'Xe đua 4WD tốc độ cao, pin lâu chơi, phù hợp bé 9+ tuổi.', "$colBlue", 4.8, 1, 1, 0, 13],
            [2, 'Xe cứu thương có đèn và âm thanh', 'xe-cuu-thuong-den-am-thanh',
             'https://images.unsplash.com/photo-1626187429639-7a77bfad0523?w=700&auto=format&fit=crop&q=80',
             380000, null, 'Mới', 'Xe cứu thương với âm thanh siren thực tế, đèn nhấp nháy, bé 3-5 tuổi.', "$colCoral", 4.6, 1, 0, 1, 14],

            // Búp bê & Thú bông (7)
            [3, 'Gấu bông lớn 60cm siêu mềm', 'gau-bong-lon-60cm',
             'https://images.unsplash.com/photo-1602734846297-9299fc2d4703?w=700&auto=format&fit=crop&q=80',
             450000, null, 'Bán chạy', 'Gấu bông khổng lồ 60cm siêu mềm, an toàn cho trẻ mọi lứa tuổi.', "$colBlue", 4.9, 1, 1, 0, 15],
            [3, 'Búp bê thay trang phục 12 bộ', 'bup-be-thay-trang-phuc',
             'https://images.unsplash.com/photo-1562040506-a9b32cb51b94?w=700&auto=format&fit=crop&q=80',
             380000, 290000, 'Giảm', 'Búp bê với 12 bộ trang phục đổi, phát triển sáng tạo và ý thức thời trang.', "$colYellow", 4.5, 1, 0, 0, 16],
            [3, 'Thú nhồi bông công chúa dễ thương', 'thu-nhoibong-cong-chua',
             'https://images.unsplash.com/photo-1648311203209-da34f7d0d800?w=700&auto=format&fit=crop&q=80',
             290000, null, '', 'Thú bông công chúa mềm mại, dễ thương, an toàn cho bé 3-5 tuổi.', "$colCoral", 4.6, 1, 0, 0, 17],
            [3, 'Gấu bông Totoro 45cm chính hãng', 'gau-bong-totoro-45cm',
             'https://images.unsplash.com/photo-1556012018-50c5c0da73bf?w=700&auto=format&fit=crop&q=80',
             350000, null, 'Mới', 'Gấu bông Totoro chính hãng, thiết kế đáng yêu, bé yêu sẽ thích mê.', "$colBlue", 4.9, 1, 0, 1, 18],
            [3, 'Thú bông unicorn phát sáng ban đêm', 'thu-bong-unicorn-phat-sang',
             'https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=700&auto=format&fit=crop&q=80',
             420000, 320000, 'Giảm', 'Unicorn bông phát sáng ban đêm, êm mềm, rất được trẻ em yêu thích.', "$colYellow", 4.7, 1, 0, 0, 19],
            [3, 'Búp bê tắm tương tác có nước', 'bup-be-tam-tuong-tac',
             'https://images.unsplash.com/photo-1588090644556-14707d0e886a?w=700&auto=format&fit=crop&q=80',
             520000, null, 'Mới', 'Búp bê tắm tương tác với chức năng phun nước, vui chơi trong bồn tắm.', "$colCoral", 4.8, 1, 0, 1, 20],
            [3, 'Thú nhồi bông khủng long T-Rex', 'thu-nhoibong-khung-long',
             'https://images.unsplash.com/photo-1543886151-3bc2b944c718?w=700&auto=format&fit=crop&q=80',
             180000, null, '', 'Thú bông khủng long T-Rex to lớn, bé yêu sẽ thích chơi trò phiêu lưu.', "$colBlue", 4.4, 1, 0, 0, 21],

            // Đồ chơi ngoài trời (7)
            [4, 'Nhà banh bi lắp ghép cho bé', 'nha-banh-bi-lap-ghep',
             'https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=700&auto=format&fit=crop&q=80',
             1200000, null, 'Bán chạy', 'Nhà banh bi lắp ghép, an toàn, vui nhộn cho bé 0-2 tuổi vận động.', "$colYellow", 4.8, 1, 1, 0, 22],
            [4, 'Cát động học vui nhộn 1kg + khuôn', 'cat-dong-hoc-vui-nhon',
             'https://images.unsplash.com/photo-1725297952113-36be1c7cefb4?w=700&auto=format&fit=crop&q=80',
             280000, 220000, 'Giảm', 'Cát động học không độc hại, tạo hình được, vui chơi trong nhà.', "$colBlue", 4.6, 1, 0, 0, 23],
            [4, 'Xe chòi chân hình thú ngộ nghĩnh', 'xe-choi-chan-hinh-thu',
             'https://images.unsplash.com/photo-1615486363973-f79d875780cf?w=700&auto=format&fit=crop&q=80',
             650000, null, '', 'Xe chòi chân hình thú vui nhộn, rèn luyện sự cân bằng cho bé.', "$colCoral", 4.7, 1, 0, 0, 24],
            [4, 'Hồ bơi phao tròn gia đình cỡ 120cm', 'ho-boi-phao-tron-gia-dinh',
             'https://images.unsplash.com/photo-1615486364134-62a4c72c822d?w=700&auto=format&fit=crop&q=80',
             350000, 280000, 'Giảm', 'Hồ bơi phao tròn cho gia đình, an toàn và vui chơi nước mát.', "$colBlue", 4.5, 1, 0, 0, 25],
            [4, 'Bộ tennis mini vợt mềm cho bé', 'bo-tennis-mini-vot-mem',
             'https://images.unsplash.com/photo-1600987608520-29713f8cc23e?w=700&auto=format&fit=crop&q=80',
             180000, null, 'Mới', 'Bộ tennis mini với vợt mềm, phát triển kỹ năng thể thao cho bé.', "$colYellow", 4.3, 1, 0, 1, 26],
            [4, 'Xe đạp 3 bánh có mái che bé yêu', 'xe-dap-3-banh-mai-che',
             'https://images.unsplash.com/photo-1741389544696-0750a7ac6bbb?w=700&auto=format&fit=crop&q=80',
             850000, null, 'Mới', 'Xe đạp 3 bánh có mái che chống nắng, an toàn cho bé 0-2 tuổi.', "$colCoral", 4.8, 1, 0, 1, 27],
            [4, 'Vòng nhảy đèn LED âm nhạc 8 chế độ', 'vong-nhay-den-led-am-nhac',
             'https://images.unsplash.com/photo-1655087751207-1020c89f7eee?w=700&auto=format&fit=crop&q=80',
             220000, 180000, 'Giảm', 'Vòng nhảy LED phát sáng, có nhạc, rèn luyện sức khỏe cho bé.', "$colBlue", 4.5, 1, 0, 0, 28],

            // Lego & Xếp hình (8)
            [5, 'LEGO Classic Sáng tạo 200 miếng', 'lego-classic-sang-tao-200',
             'https://images.unsplash.com/photo-1631106256072-54c89defe828?w=700&auto=format&fit=crop&q=80',
             480000, null, 'Bán chạy', 'LEGO Classic 200 miếng, không giới hạn sáng tạo, phát triển trí tưởng tượng.', "$colYellow", 4.9, 1, 1, 0, 29],
            [5, 'Bộ xếp hình Lâu đài Công chúa 450 miếng', 'bo-xep-hinh-lau-dai-cong-chua',
             'https://images.unsplash.com/photo-1557774394-de53f40ccb02?w=700&auto=format&fit=crop&q=80',
             650000, null, '', 'Lâu đài công chúa 450 miếng, chi tiết sắc sảo, phù hợp bé 6-8 tuổi.', "$colBlue", 4.8, 1, 0, 0, 30],
            [5, 'LEGO City Đội cảnh sát 500 miếng', 'lego-city-doi-canh-sat',
             'https://images.unsplash.com/photo-1631106254201-ffbee2305c5b?w=700&auto=format&fit=crop&q=80',
             890000, null, 'Mới', 'LEGO City cảnh sát 500 miếng, hàm lượng chi tiết cao, mô phỏng chân thực.', "$colCoral", 4.9, 1, 0, 1, 31],
            [5, 'LEGO DUPLO dành cho bé nhỏ 0-5 tuổi', 'lego-duplo-be-nho',
             'https://images.unsplash.com/photo-1646995477167-a344548ce6b9?w=700&auto=format&fit=crop&q=80',
             320000, null, 'Bán chạy', 'LEGO DUPLO kích thước to, an toàn cho bé 0-5 tuổi, không sặc.', "$colBlue", 4.8, 1, 1, 0, 32],
            [5, 'Xếp hình robot biến hình 320 miếng', 'xep-hinh-robot-bien-hinh',
             'https://images.unsplash.com/photo-1652501595862-1d06fe543544?w=700&auto=format&fit=crop&q=80',
             380000, 290000, 'Giảm', 'Robot biến hình xếp hình 320 miếng, phát triển tư duy không gian.', "$colYellow", 4.6, 1, 0, 0, 33],
            [5, 'Bộ xếp hình nông trại vui vẻ 180 miếng', 'bo-xep-hinh-nong-trai',
             'https://images.unsplash.com/photo-1659883718058-e03d7ec598ca?w=700&auto=format&fit=crop&q=80',
             280000, 220000, 'Giảm', 'Nông trại xếp hình 180 miếng, vui chơi và học về nông nghiệp.', "$colCoral", 4.5, 1, 0, 0, 34],
            [5, 'LEGO Architecture Tháp Eiffel 648 miếng', 'lego-architecture-thap-eiffel',
             'https://images.unsplash.com/photo-1644175897056-50f4d3a9a827?w=700&auto=format&fit=crop&q=80',
             1200000, null, 'Mới', 'Tháp Eiffel LEGO Architecture 648 miếng, sưu tập cao cấp cho bé 9+.', "$colBlue", 4.9, 1, 0, 1, 35],
            [5, 'Bộ xếp hình nhà gỗ 3D lắp ráp', 'bo-xep-hinh-nha-go-3d',
             'https://images.unsplash.com/photo-1560961911-ba7ef651a56c?w=700&auto=format&fit=crop&q=80',
             420000, null, '', 'Nhà gỗ 3D xếp hình lắp ráp, phát triển kỹ năng xây dựng của bé.', "$colYellow", 4.6, 1, 0, 0, 36],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO products
                (category_id, name, slug, image, price, price_sale, badge, description, colors, rating, in_stock, is_featured, is_new, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($products as $p) { $stmt->execute($p); }
    }
}
