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
        if ($count > 0) {
            $this->pdo->exec("INSERT OR IGNORE INTO settings (key, value, grp) VALUES ('site_theme', 'warm-artisan', 'design')");
            return;
        }
        $settings = [
            // General
            ['site_name',        'Shop Đồ Gia Dụng',             'general'],
            ['site_email',       'hello@shopgiadadung.vn',       'general'],
            ['site_phone',       '0900 888 666',                 'general'],
            ['site_address',     '456 Nguyễn Huệ, Q.1, TP.HCM',  'general'],
            ['working_hours',    '9:00 – 20:00 · Tất cả các ngày', 'general'],
            ['site_description', 'Cửa hàng đồ gia dụng chất lượng cao với giá hợp lý - mang đến sự tiện nghi cho gia đình Việt.', 'general'],
            // SEO
            ['meta_title',       'Shop Đồ Gia Dụng – Chất Lượng & Giá Tốt',  'seo'],
            ['meta_description', 'Khám phá bộ sưu tập đồ gia dụng, nội thất, trang trí nhà cửa với chất lượng cao và giá cạnh tranh.', 'seo'],
            // Social
            ['facebook',        'https://www.facebook.com/shopgiadadung',   'social'],
            ['instagram',       'https://www.instagram.com/shopgiadadung',  'social'],
            ['tiktok',          'https://www.tiktok.com/@shopgiadadung',    'social'],
            ['zalo',            'https://zalo.me/0900888666',               'social'],
            ['zalo_number',     '0900888666',                               'social'],
            // Theme
            ['site_theme',      'warm-artisan',                  'design'],
            // Footer
            ['footer_desc',     'Chúng tôi mang đến những sản phẩm đồ gia dụng chất lượng cao, được kiểm tra kỹ lưỡng để phục vụ gia đình Việt.', 'footer'],
            // Contact
            ['map_embed',       'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.5!2d106.6!3d10.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1', 'contact'],
            // Hero
            ['hero_tag',         'Thiết Bị Gia Đình Tốt Nhất 2025',      'hero'],
            ['hero_title_part1', 'Đồ Gia Dụng',                          'hero'],
            ['hero_title_part2', 'Chất Lượng',                            'hero'],
            ['hero_title_line2', '– Chăm Sóc Gia Đình Bạn',              'hero'],
            ['hero_subtitle',    'Tất cả những gì bạn cần để tạo một ngôi nhà ấm cúng, tiện nghi và đầy đủ tiện ích hiện đại.', 'hero'],
            ['hero_note',        'Giao hàng miễn phí từ 500.000đ · Đảm bảo chất lượng',  'hero'],
            // Stats
            ['stat_customers',  '8000',   'stats'],
            ['stat_products',   '400',    'stats'],
            ['stat_years',      '3',      'stats'],
            ['stat_provinces',  '63',     'stats'],
            // Shop policies
            ['shipping_fee',           '50000',  'shop'],
            ['free_shipping_threshold','500000', 'shop'],
            ['return_days',            '30',     'shop'],
            ['warranty_months',        '12',     'shop'],
            // Payment methods
            ['payment_cod_enabled',    '1', 'payment'],
            ['payment_sepay_enabled',  '0', 'payment'],
            ['sepay_bank_code',        '',  'payment'],
            ['sepay_account_number',   '',  'payment'],
            ['sepay_account_name',     '',  'payment'],
            ['sepay_webhook_secret',   '',  'payment'],
            // SMTP
            ['smtp_host',     '', 'smtp'],
            ['smtp_port',     '587', 'smtp'],
            ['smtp_user',     '', 'smtp'],
            ['smtp_pass',     '', 'smtp'],
            ['smtp_from',     '', 'smtp'],
            ['smtp_from_name','Shop Đồ Gia Dụng', 'smtp'],
            // System
            ['maintenance_mode', '0', 'system'],
            ['google_analytics', '', 'system'],
            // Cloudinary
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key',    '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            // Integrations
            // unsplash_access_key: để trống để dùng fallback $UNSPLASH_API_KEY env var (default từ webdrop.store),
            // hoặc điền thủ công trong admin → Cài đặt → Tích hợp để override
            ['unsplash_access_key', '', 'integrations'],
            ['fb_pixel_id', '', 'integrations'],
            ['zalo_oa_id',  '', 'integrations'],
        ];
        $stmt = $this->pdo->prepare("INSERT OR IGNORE INTO settings (key, value, grp) VALUES (?, ?, ?)");
        foreach ($settings as $row) { $stmt->execute($row); }
    }

    private function seedHeroSlides(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM hero_slides")->fetchColumn();
        if ($count > 0) return;
        $slides = [
            [
                'Đồ Gia Dụng Chất Lượng',
                'Sản phẩm được chọn lọc kỹ lưỡng từ các nhà cung cấp uy tín – bền, đẹp và tiết kiệm điện năng',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop&q=80',
                'Mua sắm ngay', '/san-pham', 1, 'published'
            ],
            [
                'Bộ Sưu Tập Nước Ngoài',
                'Thiết bị nhập khẩu từ châu Âu và Nhật Bản – công nghệ tiên tiến, thiết kế thời trang',
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop&q=80',
                'Xem bộ sưu tập', '/san-pham', 2, 'published'
            ],
            [
                'Khuyến Mãi Đặc Biệt',
                'Giảm đến 35% cho các sản phẩm nhà bếp và trang trí – chỉ áp dụng trong tháng này',
                'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=1200&auto=format&fit=crop&q=80',
                'Tìm hiểu thêm', '/san-pham', 3, 'published'
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
            ['Nhà Bếp',         'nha-bep',         'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop&q=80', 1],
            ['Trang Trí',       'trang-tri',       'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&auto=format&fit=crop&q=80', 2],
            ['Phòng Tắm',       'phong-tam',       'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&auto=format&fit=crop&q=80', 3],
            ['Nội Thất Nhỏ',    'noi-that-nho',    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80', 4],
            ['Đèn & Chiếu Sáng','den-chieu-sang',  'https://images.unsplash.com/photo-1762098801378-26bc46ae6306?w=600&auto=format&fit=crop&q=80', 5],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO product_categories (name, slug, image, sort_order) VALUES (?, ?, ?, ?)"
        );
        foreach ($cats as $c) { $stmt->execute($c); }
    }

    private function seedProducts(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
        if ($count > 0) return;

        $colorWarm = 'Terracotta:#b5651d|Sage:#87a06b';

        $products = [
            // Nhà Bếp (8 products)
            [1, 'Bộ Nồi Nấu Ăn 5 Chiếc', 'bo-noi-nau-an-5-chiec',
             'https://images.unsplash.com/photo-1584990347193-6bebebfeaeee?w=800&auto=format&fit=crop&q=80',
             1290000, 1050000, '-19%',
             'Bộ nồi nấu ăn 5 chiếc với đáy lòng chảy nhiệt đều đặn, nắp kính bền bỏng. Tiết kiệm điện năng 30% so với nồi thường. Thép không gỉ, đáy tù.',
             $colorWarm, 4.8, 1, 1, 0, 1],

            [1, 'Bản Cắt Thịt Gỗ Tự Nhiên', 'ban-cat-thot-go-tu-nhien',
             'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&auto=format&fit=crop&q=80',
             185000, null, '',
             'Thớt gỗ tự nhiên được sơn quế an toàn thực phẩm. Không mặc, không cong, dễ vệ sinh sau mỗi lần sử dụng. Gỗ sơn lót thiên nhiên.',
             $colorWarm, 4.6, 1, 0, 1, 2],

            [1, 'Tủ Bếp Modular 3 Tầng', 'tu-bep-modular-3-tang',
             'https://images.unsplash.com/photo-1708358977332-84e95c0083a6?w=800&auto=format&fit=crop&q=80',
             2480000, 1990000, '-20%',
             'Tủ bếp module có thể ghép nối tùy ý, chứa tới 60 loại dụng cụ nấu nướng. Khung thép sơn tĩnh điện bền bỉ.',
             $colorWarm, 4.9, 1, 1, 0, 3],

            [1, 'Giá Để Gia Vị Dùng Tự', 'gia-de-gia-vi-dung-tu',
             'https://images.unsplash.com/photo-1715758583410-ca01efec6548?w=800&auto=format&fit=crop&q=80',
             285000, null, '',
             'Giá để gia vị dùng tự, cơ cấu đóng mở tự động. Lắp ráp trong 10 phút, không cần khoan. Thép mạ kẽm + tự tính.',
             $colorWarm, 4.5, 1, 0, 0, 4],

            [1, 'Quạt Hút Mùi Bếp Thông Minh', 'quat-hut-mui-bep-thong-minh',
             'https://images.unsplash.com/photo-1642979430180-e676c2235ce2?w=800&auto=format&fit=crop&q=80',
             1680000, 1380000, '-18%',
             'Quạt hút mùi thông minh tự động bật/tắt theo độ ẩm, tiếng ồn chỉ 50dB. Lọc carbon sạch sẽ tới 6 tháng. Nhôm anode, motor không chổi.',
             $colorWarm, 4.7, 1, 1, 0, 5],

            [1, 'Bục Rửa Bát Kéo Dài', 'buc-rua-bat-keo-dai',
             'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop&q=80',
             425000, 349000, '-18%',
             'Bục rửa bát có vòi kéo dài 1.5m, van cắt nước áp tắt tự động. Đáy chống trơn trượt, bảo hành 3 năm. Đồng mạ nickel, vòi bằng thép.',
             $colorWarm, 4.6, 1, 0, 0, 6],

            [1, 'Khay Cắt Cơm Kép Có Nắp', 'khay-cat-com-kep-co-nap',
             'https://images.unsplash.com/photo-1665387075827-81bdc0aa7ca5?w=800&auto=format&fit=crop&q=80',
             195000, null, 'Mới',
             'Khay cắt cơm kép có nắp hộp kín, giữ thực phẩm tươi sống 3 ngày. Không ngấm nước, dễ vệ sinh. Nhựa PP cao cấp.',
             $colorWarm, 4.4, 1, 0, 1, 7],

            [1, 'Giải Pháp Chặn Mùi Thùng Rác', 'giai-phap-chan-mui-thung-rac',
             'https://images.unsplash.com/photo-1643213399445-842d8f6b9a45?w=800&auto=format&fit=crop&q=80',
             125000, 89000, '-29%',
             'Bộ xử lý mùi rác thải với nhân hoạt tính, công suất khử mùi 99%. Lắp vào thùng rác bất kỳ trong 5 giây. Hoạt tính, composite an toàn.',
             $colorWarm, 4.5, 1, 1, 0, 8],

            // Trang Trí (8 products)
            [2, 'Bảng Treo Tường Gỗ Phơi Trắng', 'bang-treo-tuong-go-phoi-trang',
             'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&auto=format&fit=crop&q=80',
             450000, 380000, '-16%',
             'Bảng treo tường gỗ sồi phơi sơn trắng, khung ảnh dễ thay đổi. Phù hợp phong cách Scandinavian hiện đại. Gỗ sồi + sơn polyurethane.',
             $colorWarm, 4.7, 1, 1, 0, 9],

            [2, 'Hộp Trang Trí Treo Gỗ Veneer', 'hop-trang-tri-treo-go-veneer',
             'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
             380000, null, '',
             'Hộp treo tường gỗ veneer 3 compartment, thiết kế tối giản. Đặt đồ trang trí, sách, hay nhạc lụa trang nhã. Gỗ veneer, kính tempered.',
             $colorWarm, 4.6, 1, 0, 0, 10],

            [2, 'Tranh Vải Canvas Trang Trí 3 Tấm', 'tranh-vai-canvas-trang-tri-3-tam',
             'https://images.unsplash.com/photo-1602172691871-49e231a20dbc?w=800&auto=format&fit=crop&q=80',
             320000, 259000, '-19%',
             'Bộ tranh vải canvas 3 tấm với họa tiết hoa lá tropical, khung gỗ nhẹ. Tạo điểm nhấn cho phòng khách. Vải canvas, khung gỗ plywood.',
             $colorWarm, 4.5, 1, 0, 1, 11],

            [2, 'Bình Gốm Sứ Cao Cấp Hoa', 'binh-gom-su-cao-cap-hoa',
             'https://images.unsplash.com/photo-1614175154640-f965c6323d21?w=800&auto=format&fit=crop&q=80',
             285000, 219000, '-23%',
             'Bình gốm sứ cao cấp được nạo quế tuyệt đẹp, phù hợp cắm hoa tươi hoặc hoa giả. Thiết kế vạn năng. Gốm sứ cao cấp.',
             $colorWarm, 4.4, 1, 1, 0, 12],

            [2, 'Chiếc Tấm Thảm Treo Tường', 'chiec-tam-tham-treo-tuong',
             'https://images.unsplash.com/photo-1661034494973-ed878468e23f?w=800&auto=format&fit=crop&q=80',
             520000, 445000, '-14%',
             'Thảm treo tường kích thước 1.5m x 2m, họa tiết bohemian đa sắc. Xử lý kháng khuẩn tự nhiên. Vải cotton/polyester blend.',
             $colorWarm, 4.8, 1, 1, 0, 13],

            [2, 'Nến Thơm Trong Nồi Ceramic', 'nen-thom-trong-noi-ceramic',
             'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=800&auto=format&fit=crop&q=80',
             165000, null, 'Mới',
             'Nến thơm trong nồi ceramic với hương tinh dầu thiên nhiên 100%. Chảy 40 giờ liên tục, an toàn cho trẻ em. Sáp soy thiên nhiên, tinh dầu.',
             $colorWarm, 4.6, 1, 0, 1, 14],

            [2, 'Chân Để Tường Trang Trí Đồng', 'chan-de-tuong-trang-tri-dong',
             'https://images.unsplash.com/photo-1614175154640-f965c6323d21?w=800&auto=format&fit=crop&q=80',
             240000, 189000, '-21%',
             'Chân để tường trang trí bằng đồng nguyên khối, cao 30cm. Tăng thêm sự sang trọng cho góc nhà của bạn. Đồng nguyên khối, bóng cao.',
             $colorWarm, 4.5, 1, 0, 0, 15],

            [2, 'Khung Ảnh 4 Khoang Wood Veneer', 'khung-anh-4-khoang-wood-veneer',
             'https://images.unsplash.com/photo-1614175154640-f965c6323d21?w=800&auto=format&fit=crop&q=80',
             185000, 145000, '-22%',
             'Khung ảnh gỗ veneer 4 khoang cạnh nhau, chứa 4 ảnh 15x15cm. Lắp tường hoặc để bàn đều được. Gỗ veneer, kính cường lực.',
             $colorWarm, 4.3, 1, 1, 0, 16],

            // Phòng Tắm (8 products)
            [3, 'Tủ Treo Phòng Tắm Tiết Kiệm Chỗ', 'tu-treo-phong-tam-tiet-kiem-cho',
             'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=80',
             680000, 545000, '-20%',
             'Tủ treo phòng tắm chứa 8 khoang, khung nhôm chống gỉ. Lắp trên bình nước nóng tiết kiệm 60% không gian. Nhôm anode sơn, cửa kính tempered.',
             $colorWarm, 4.7, 1, 1, 0, 17],

            [3, 'Bàn Phòng Tắm Với Tủ Chứa', 'ban-phong-tam-voi-tu-chua',
             'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=80',
             1380000, 1150000, '-17%',
             'Bàn phòng tắm kết hợp tủ chứa dưới, mặt bàn từ đá tạo tác nhân tạo chịu mòi mỏn. Tương thích với nước chuẩn. MFC E1, đá nhân tạo, sơn PU.',
             $colorWarm, 4.8, 1, 0, 0, 18],

            [3, 'Giá Để Khăn Phòng Tắm Chiều Cao', 'gia-de-khan-phong-tam-chieu-cao',
             'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=80',
             245000, 189000, '-23%',
             'Giá để khăn chiều cao sơn tĩnh điện, chứa được 4 chiếc khăn tắm cỡ lớn. Lắp tường trong 15 phút. Thép sơn tĩnh điện.',
             $colorWarm, 4.5, 1, 0, 1, 19],

            [3, 'Vòi Tắm Mưa Có Đèn LED', 'voi-tam-mua-co-den-led',
             'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=80',
             890000, 720000, '-19%',
             'Vòi tắm mưa 40cm có đèn LED 7 màu tự động, điều chỉnh nhiệt độ nước chính xác 0.5°C. Tiết kiệm nước 40%. Đồng mạ nickel, LED RGB, sensor nhiệt.',
             $colorWarm, 4.9, 1, 1, 0, 20],

            [3, 'Thảm Phòng Tắm Chống Trơn', 'tham-phong-tam-chong-tron',
             'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=80',
             180000, 145000, '-19%',
             'Thảm phòng tắm PVC chống trơn với hút nước mạnh, kích thước 60x40cm. Dễ giặt máy, khô nhanh. PVC + cotton backing.',
             $colorWarm, 4.6, 1, 0, 0, 21],

            [3, 'Tắt Giữ Vòi Nước Phòng Tắm', 'tat-giu-voi-nuoc-phong-tam',
             'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=80',
             95000, 75000, '-21%',
             'Tắt giữ vòi nước phòng tắm bằng stainless, tiết kiệm nước 50%. Lắp dễ dàng, tương thích mọi vòi. Stainless 304, cao su chịu nhiệt.',
             $colorWarm, 4.4, 1, 1, 0, 22],

            [3, 'Hộc Để Sản Phẩm Phòng Tắm Treo', 'hoc-de-san-pham-phong-tam-treo',
             'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=80',
             125000, 98000, '-22%',
             'Hộc treo phòng tắm nhôm anode, chứa sữa tắm, dầu gội, cạo râu. Thoáng khí tự nhiên không bị mốc. Nhôm anode + lưới stainless.',
             $colorWarm, 4.5, 1, 0, 1, 23],

            // Nội Thất Nhỏ (8 products)
            [4, 'Tủ Để Giày Gỗ 5 Tầng', 'tu-de-giay-go-5-tang',
             'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
             580000, 475000, '-18%',
             'Tủ để giày gỗ công nghiệp 5 tầng, chứa được 15 đôi giày. Khung sắt chắc chắn, chân chống ẩm. Gỗ MDF phủ PVC, khung sắt.',
             $colorWarm, 4.7, 1, 1, 0, 24],

            [4, 'Giá Sách Dạng Cuộn Scroll', 'gia-sach-dang-cuon-scroll',
             'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
             320000, 249000, '-22%',
             'Giá sách cuộn scroll trang trí, có bánh xe di động. Chứa 50 cuốn sách, tìm sách trong 2 giây. Gỗ sồi, bánh xe cao su.',
             $colorWarm, 4.6, 1, 0, 0, 25],

            [4, 'Bàn Trang Điểm Nho Nhỏ Có Tủ', 'ban-trang-diem-nho-nho-co-tu',
             'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
             790000, 640000, '-19%',
             'Bàn trang điểm gỗ công nghiệp 1m x 0.5m, có tủ chứa 6 ngăn kéo. Gương LED 3 sắc độ ánh sáng. Gỗ MDF sơn, gương LED, tay cầm nhôm.',
             $colorWarm, 4.8, 1, 1, 0, 26],

            [4, 'Kệ Góc Cuộn Xoay', 'ke-goc-cuon-xoay',
             'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
             680000, 545000, '-20%',
             'Kệ góc xoay 4 tầng, tận dụng không gian góc tường hiệu quả. Chứa cả đồ vật nặng và nhẹ. Thép sơn tĩnh điện, kính cường lực.',
             $colorWarm, 4.5, 1, 1, 0, 27],

            [4, 'Ghế Ngồi Lưu Trữ Hộp', 'ghe-ngoi-luu-tru-hop',
             'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
             480000, 385000, '-20%',
             'Ghế ngồi kép với hộp chứa trong, nệm polyurethane cao cấp. Bền 5 năm cho gia đình 4 người. Gỗ plywood, vải bò, nệm PU.',
             $colorWarm, 4.6, 1, 0, 1, 28],

            [4, 'Tủ Để Cháu Cây Có Bánh Xe', 'tu-de-chau-cay-co-banh-xe',
             'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
             295000, 235000, '-20%',
             'Tủ để cháu cây với bánh xe di động, chứa 8 cháu cây. Mặt bàn có lỗ thoáng nước. Gỗ tần bì, bánh xe cao su.',
             $colorWarm, 4.4, 1, 1, 0, 29],

            [4, 'Bàn Gập Tường Tiết Kiệm Chỗ', 'ban-gap-tuong-tiet-kiem-cho',
             'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
             340000, 270000, '-21%',
             'Bàn gập tường 1m x 0.5m, khi gập chiều cao chỉ 5cm. Cơ chế an toàn giữ lực tối đa 50kg. Gỗ MDF, ống sắt đúc, lò xo khí.',
             $colorWarm, 4.7, 1, 1, 0, 30],

            // Đèn & Chiếu Sáng (8 products)
            [5, 'Đèn Bàn LED Tích Điện', 'den-ban-led-tich-dien',
             'https://images.unsplash.com/photo-1762098801378-26bc46ae6306?w=800&auto=format&fit=crop&q=80',
             285000, 225000, '-21%',
             'Đèn bàn LED tích điện 3 mức sáng, thời gian hoạt động 12 giờ một lần sạc. Bảo hành 2 năm. Nhôm anode, LED SMD, pin lithium.',
             $colorWarm, 4.8, 1, 1, 0, 31],

            [5, 'Đèn Sán Vòng Tròn Đứng', 'den-san-vong-tron-dung',
             'https://images.unsplash.com/photo-1762098801378-26bc46ae6306?w=800&auto=format&fit=crop&q=80',
             890000, 720000, '-19%',
             'Đèn sán vòng tròn LED điều chỉnh độ sáng 0-100%, 5 nhiệt độ màu từ 2700K-6500K. Tiết kiệm điện 80%. Nhôm đúc, vòng LED, điều khiển từ xa.',
             $colorWarm, 4.9, 1, 1, 0, 32],

            [5, 'Bóng Đèn Thông Minh WiFi', 'bong-den-thong-minh-wifi',
             'https://images.unsplash.com/photo-1762098801378-26bc46ae6306?w=800&auto=format&fit=crop&q=80',
             180000, 145000, '-19%',
             'Bóng đèn thông minh WiFi 9W, điều khiển qua điện thoại, 16 triệu màu, tương thích Home App. LED COB, driver PFC, base E27.',
             $colorWarm, 4.6, 1, 0, 1, 33],

            [5, 'Đèn Hang Thả Bóng Vintage', 'den-hang-tha-bong-vintage',
             'https://images.unsplash.com/photo-1762098801378-26bc46ae6306?w=800&auto=format&fit=crop&q=80',
             340000, 270000, '-21%',
             'Đèn thả bóng vintage với cáp dù đan kết, chiều dài dây có thể điều chỉnh. Phù hợp phong cách loft. Thép sơn, dây vải, bóng Edison.',
             $colorWarm, 4.5, 1, 1, 0, 34],

            [5, 'Đèn Treo Tường Cầu Kiến Trúc', 'den-treo-tuong-cau-kien-truc',
             'https://images.unsplash.com/photo-1762098801378-26bc46ae6306?w=800&auto=format&fit=crop&q=80',
             560000, 450000, '-20%',
             'Đèn treo tường kiến trúc chiều dài 50cm, có khe để ảnh hoặc thực vật. Giãng cách độ bóng tự nhiên. Thép cán lạnh, kính mờ.',
             $colorWarm, 4.7, 1, 1, 0, 35],

            [5, 'Lampe Bàn Góc Cong', 'lampe-ban-goc-cong',
             'https://images.unsplash.com/photo-1762098801378-26bc46ae6306?w=800&auto=format&fit=crop&q=80',
             420000, 335000, '-20%',
             'Lampe bàn cong độ được góc phát sáng 120 độ, chân cân bằng không bị lật. Bảo hành 3 năm motor. Thép sơn, kính diffuser, LED.',
             $colorWarm, 4.6, 1, 0, 0, 36],

            [5, 'Dây Đèn LED Chớp Trang Trí', 'day-den-led-chop-trang-tri',
             'https://images.unsplash.com/photo-1762098801378-26bc46ae6306?w=800&auto=format&fit=crop&q=80',
             185000, 145000, '-22%',
             'Dây đèn LED chớp trang trí 10m, chế độ chớp 8 màu, chống nước IP65, tiết kiệm điện. Dây PVC, LED SMD, plugin PFC.',
             $colorWarm, 4.4, 1, 0, 1, 37],

            [5, 'Đèn Xông Tinh Dầu Có Ánh Sáng', 'den-xong-tinh-dau-co-anh-sang',
             'https://images.unsplash.com/photo-1762098801378-26bc46ae6306?w=800&auto=format&fit=crop&q=80',
             240000, 190000, '-21%',
             'Đèn xông tinh dầu cùng ánh sáng LED 7 màu, dùng sóng siêu âm 3 chế độ. Dung tích 400ml. Ceramic phun, LED RGB, motor siêu âm.',
             $colorWarm, 4.5, 1, 1, 0, 38],
        ];

        // theme + sold — được đối chiếu lại từ products-data.js gốc của template tĩnh
        // (Sources/templates/web/Shops/shop-do-gia-dung/assets/js/products-data.js):
        // - theme: suy ra TRỰC TIẾP từ is_featured/is_new/price_sale đã có sẵn ở mỗi hàng phía trên
        //   (is_featured=1 → 'ban-chay', is_new=1 → 'moi-ve', có price_sale → 'giam-gia') — không bịa,
        //   khớp đúng 3 section trang chủ "Bán chạy nhất"/"Hàng mới về"/"Đang giảm giá".
        // - sold: lấy đúng số liệu "đã bán" thật của template, theo thứ tự trong từng danh mục tương ứng
        //   (Nhà Bếp/Trang Trí/Phòng Tắm/Nội Thất Nhỏ/Đèn & Chiếu Sáng) — categories 8/8/7/7/8 sản phẩm
        //   khớp số lượng thật với 10/8/7/8/7 của template (dư/thiếu thì lấy theo thứ tự xuất hiện,
        //   Đèn & Chiếu Sáng thiếu 1 nên lặp lại giá trị đầu tiên của mục đó).
        $themeSold = [
            // Nhà Bếp (8)
            ['ban-chay,giam-gia', 245], ['moi-ve', 183], ['ban-chay,giam-gia', 312], ['', 97],
            ['ban-chay,giam-gia', 176], ['giam-gia', 54], ['moi-ve', 128], ['ban-chay,giam-gia', 66],
            // Trang Trí (8)
            ['ban-chay,giam-gia', 74], ['', 41], ['moi-ve,giam-gia', 55], ['ban-chay,giam-gia', 162],
            ['ban-chay,giam-gia', 38], ['moi-ve', 92], ['giam-gia', 29], ['ban-chay,giam-gia', 203],
            // Phòng Tắm (7)
            ['ban-chay,giam-gia', 187], ['giam-gia', 73], ['moi-ve,giam-gia', 58], ['ban-chay,giam-gia', 33],
            ['giam-gia', 82], ['ban-chay,giam-gia', 44], ['moi-ve,giam-gia', 115],
            // Nội Thất Nhỏ (7)
            ['ban-chay,giam-gia', 148], ['giam-gia', 89], ['ban-chay,giam-gia', 37], ['ban-chay,giam-gia', 64],
            ['moi-ve,giam-gia', 52], ['ban-chay,giam-gia', 48], ['ban-chay,giam-gia', 27],
            // Đèn & Chiếu Sáng (8, template chỉ có 7 nên lặp lại giá trị đầu ở vị trí cuối)
            ['ban-chay,giam-gia', 63], ['ban-chay,giam-gia', 196], ['moi-ve,giam-gia', 118], ['ban-chay,giam-gia', 31],
            ['ban-chay,giam-gia', 143], ['giam-gia', 47], ['moi-ve,giam-gia', 22], ['ban-chay,giam-gia', 63],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO products (category_id, name, slug, image, price, price_sale, badge, description, colors, rating, in_stock, is_featured, is_new, sort_order, theme, sold)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($products as $i => $p) {
            [$theme, $sold] = $themeSold[$i];
            $stmt->execute([...$p, $theme, $sold]);
        }
    }
}
