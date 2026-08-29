<?php
declare(strict_types=1);

class Database {
    private \PDO $pdo;
    private static ?Database $instance = null;

    private function __construct() {
        $dbDir = dirname(DB_FILE);
        if (!is_dir($dbDir)) {
            mkdir($dbDir, 0755, true);
        }
        $this->pdo = new \PDO('sqlite:' . DB_FILE);
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->pdo->exec('PRAGMA journal_mode = WAL');
        $this->migrate();
    }

    public static function getInstance(): self {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function migrate(): void {
        $schemaPath = __DIR__ . '/../schema.sql';
        $schema = file_get_contents($schemaPath);
        if ($schema === false) {
            throw new \RuntimeException('schema.sql not found: ' . $schemaPath);
        }
        // Strip comments TRƯỚC khi split — tránh filter loại bỏ CREATE TABLE sau comment block
        $schema = preg_replace('/^\s*--.*$/m', '', $schema);
        foreach (array_filter(array_map('trim', explode(';', $schema))) as $stmt) {
            if ($stmt) {
                try { $this->pdo->exec($stmt); } catch (\PDOException $e) { /* ignore IF NOT EXISTS */ }
            }
        }
        $this->seedData();
    }

    private function seedData(): void {
        $this->seedUsers();
        $this->seedSettings();
        $this->seedHeroSlides();
        $this->seedExtensions();
    }

    // ─── Bất động sản (Loại hình A — sàn giao dịch tổng hợp, 1 agency quản lý qua admin) ──
    protected function seedExtensions(): void {
        $this->seedAgents();
        $this->seedProperties();
        $this->seedProjects();
        $this->seedTestimonials();
        $this->seedFaqs();
    }

    private function seedUsers(): void {
        if ($this->scalar("SELECT COUNT(*) FROM users") > 0) return;
        $this->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['Admin', 'sysadmin@admin.com', password_hash('123456', PASSWORD_DEFAULT), 'superadmin']
        );
    }

    private function seedSettings(): void {
        if ($this->scalar("SELECT COUNT(*) FROM settings") > 0) return;
        $settings = [
            // ── Thông tin chung ──
            ['site_name', 'Nhà Đất Việt', 'general'],
            ['site_tagline', 'Sàn giao dịch bất động sản TP.HCM', 'general'],
            ['site_description', 'Sàn giao dịch bất động sản tổng hợp tại TP.HCM — nhà phố, căn hộ, đất nền, biệt thự, shophouse. Tư vấn tận tâm, pháp lý minh bạch, đồng hành cùng khách hàng từ tìm kiếm đến bàn giao.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hotro@nhadatviet.vn', 'general'],
            ['site_phone', '1900 6789', 'general'],
            ['site_phone2', '0909 888 777', 'general'],
            ['site_address', '88 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM', 'general'],
            ['working_hours', 'Thứ 2 - Chủ nhật: 8:00 - 20:00', 'general'],

            // ── SEO ──
            ['meta_title', 'Nhà Đất Việt — Sàn giao dịch bất động sản TP.HCM | Mua bán, cho thuê nhà đất', 'seo'],
            ['meta_description', 'Nhà Đất Việt — sàn môi giới bất động sản tổng hợp TP.HCM: căn hộ, nhà phố, đất nền, biệt thự, shophouse. Tìm đúng nhà, an cư lạc nghiệp cùng đội ngũ tư vấn tận tâm.', 'seo'],
            ['meta_keywords', 'nhà đất việt, bất động sản tp.hcm, mua bán nhà đất, cho thuê căn hộ, môi giới bất động sản', 'seo'],

            // ── Mạng xã hội ──
            ['social_facebook', '', 'social'],
            ['social_youtube', '', 'social'],
            ['zalo_phone', '0909888777', 'social'],

            // ── Footer ──
            ['footer_description', 'Sàn giao dịch bất động sản tổng hợp tại TP.HCM — nhà phố, căn hộ, đất nền, biệt thự, shophouse. Tư vấn tận tâm, pháp lý minh bạch, đồng hành cùng khách hàng từ tìm kiếm đến bàn giao.', 'footer'],
            ['footer_copyright', '© 2026 Nhà Đất Việt. Đã đăng ký bản quyền.', 'footer'],

            // ── Liên hệ ──
            ['contact_map_lat', '10.7756', 'contact'],
            ['contact_map_lng', '106.7019', 'contact'],

            // ── Thống kê (stat-bar trang chủ + giới thiệu) ──
            ['stat_listings', '1250', 'stats'],
            ['stat_deals', '860', 'stats'],
            ['stat_experience_years', '9', 'stats'],
            ['stat_satisfaction_percent', '98', 'stats'],
            ['stat_agents_count', '20', 'stats'],

            // ── Giới thiệu (câu chuyện — trang Giới thiệu) ──
            ['about_story_title', 'Hơn 9 năm đồng hành cùng thị trường bất động sản TP.HCM', 'about'],
            ['about_story_text1', 'Thành lập từ năm 2017, Nhà Đất Việt bắt đầu là một nhóm môi giới nhỏ tại Quận 1 với mong muốn mang lại trải nghiệm giao dịch bất động sản minh bạch hơn cho khách hàng. Đến nay, chúng tôi đã mở rộng thành đội ngũ hơn 20 chuyên viên tư vấn, phục vụ đa dạng loại hình từ căn hộ, nhà phố đến đất nền, biệt thự và shophouse trên khắp các quận huyện TP.HCM.', 'about'],
            ['about_story_text2', 'Chúng tôi tin rằng mỗi giao dịch bất động sản không chỉ là con số, mà là một quyết định quan trọng ảnh hưởng đến cuộc sống của khách hàng — vì vậy sự minh bạch về pháp lý và tận tâm trong tư vấn luôn là ưu tiên hàng đầu.', 'about'],
            ['about_story_image', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80', 'about'],

            // ── Ảnh banner đầu trang (page header — trang con không dùng carousel) ──
            ['banner_properties', 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=1600&auto=format&fit=crop&q=80', 'design'],
            ['banner_projects', 'https://images.unsplash.com/photo-1618221469555-7f3ad97540d6?w=1600&auto=format&fit=crop&q=80', 'design'],
            ['banner_about', 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=1600&auto=format&fit=crop&q=80', 'design'],
            ['banner_contact', 'https://images.unsplash.com/photo-1621293954908-907159247fc8?w=1600&auto=format&fit=crop&q=80', 'design'],
            ['banner_privacy', 'https://images.unsplash.com/photo-1580041065738-e72023775cdc?w=1600&auto=format&fit=crop&q=80', 'design'],
            ['banner_terms', 'https://images.unsplash.com/photo-1524230659092-07f99a75c013?w=1600&auto=format&fit=crop&q=80', 'design'],

            // ── SMTP ──
            ['smtp_host', 'smtp.gmail.com', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from_name', 'Nhà Đất Việt', 'smtp'],
            ['smtp_from_email', '', 'smtp'],

            // ── Nâng cao ──
            ['ga_id', '', 'system'],
            ['custom_scripts', '', 'system'],

            // ── Cloudinary ──
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key', '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            ['cloudinary_folder', 'nha-dat-viet', 'cloudinary'],

            // ── Tích hợp ──
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];
        foreach ($settings as [$key, $value, $group]) {
            $this->execute(
                "INSERT OR IGNORE INTO settings (key, value, grp) VALUES (?, ?, ?)",
                [$key, $value, $group]
            );
        }
    }

    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        // subtitle format: "label||mô tả" — label là eyebrow hiển thị phía trên tiêu đề slide,
        // "*...*" trong title đánh dấu cụm từ tô màu accent (tương đương <em> trong template gốc).
        $slides = [
            [
                'title' => 'Tìm đúng *ngôi nhà* bạn đang tìm kiếm',
                'subtitle' => 'Sàn giao dịch bất động sản TP.HCM||Hơn 40 tin đăng chọn lọc: căn hộ, nhà phố, đất nền, biệt thự, shophouse — pháp lý minh bạch, tư vấn tận tâm từ đội ngũ môi giới giàu kinh nghiệm.',
                'button_text' => 'Xem tất cả bất động sản',
                'button_link' => '/bat-dong-san',
                'image' => 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1800&auto=format&fit=crop&q=80',
                'sort_order' => 1,
            ],
            [
                'title' => 'Sở hữu nhà phố, *căn hộ* với pháp lý rõ ràng',
                'subtitle' => 'Mua bán nhà đất||Mọi tin đăng đều được kiểm tra tình trạng pháp lý — sổ đỏ, sổ hồng, hợp đồng mua bán — trước khi giới thiệu đến khách hàng.',
                'button_text' => 'Nhà đất đang bán',
                'button_link' => '/bat-dong-san?listingType=ban',
                'image' => 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1800&auto=format&fit=crop&q=80',
                'sort_order' => 2,
            ],
            [
                'title' => 'Căn hộ dịch vụ, nhà phố cho thuê *đa dạng*',
                'subtitle' => 'Cho thuê nhanh chóng||Từ căn hộ dịch vụ 25m² đến nhà phố nguyên căn làm văn phòng — đầy đủ lựa chọn theo ngân sách và nhu cầu của bạn.',
                'button_text' => 'Nhà đất cho thuê',
                'button_link' => '/bat-dong-san?listingType=cho-thue',
                'image' => 'https://images.unsplash.com/photo-1512699355324-f07e3106dae5?w=1800&auto=format&fit=crop&q=80',
                'sort_order' => 3,
            ],
            [
                'title' => 'An tâm với công cụ *tính vay trả góp*',
                'subtitle' => 'Hỗ trợ tài chính||Ước tính khoản vay và số tiền trả góp hàng tháng ngay trên trang chi tiết mỗi bất động sản — chủ động kế hoạch tài chính.',
                'button_text' => 'Khám phá ngay',
                'button_link' => '/bat-dong-san',
                'image' => 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1800&auto=format&fit=crop&q=80',
                'sort_order' => 4,
            ],
        ];
        foreach ($slides as $slide) {
            $this->execute(
                "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                [$slide['title'], $slide['subtitle'], $slide['button_text'], $slide['button_link'], $slide['image'], $slide['sort_order']]
            );
        }
    }

    private function seedAgents(): void {
        if ($this->scalar("SELECT COUNT(*) FROM agents") > 0) return;
        $items = [
            ['Nguyễn Minh Khôi', 'Trưởng phòng kinh doanh', '0909 123 456', '0909123456',
                'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=300&auto=format&fit=crop&q=80'],
            ['Trần Thị Ngọc Hân', 'Chuyên viên tư vấn cấp cao', '0918 234 567', '0918234567',
                'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80'],
            ['Lê Hoàng Phúc', 'Chuyên viên tư vấn', '0933 345 678', '0933345678',
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80'],
            ['Phạm Thu Trang', 'Chuyên viên tư vấn', '0977 456 789', '0977456789',
                'https://images.unsplash.com/photo-1502764613149-7f1d229e230f?w=300&auto=format&fit=crop&q=80'],
            ['Đỗ Anh Tuấn', 'Chuyên viên tư vấn', '0966 567 890', '0966567890',
                'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80'],
            ['Vũ Thị Mai Anh', 'Chuyên viên tư vấn', '0988 678 901', '0988678901',
                'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80'],
        ];
        $sort = 0;
        foreach ($items as [$name, $title, $phone, $zalo, $avatar]) {
            $this->execute(
                "INSERT INTO agents (name, title, phone, zalo, avatar, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                [$name, $title, $phone, $zalo, $avatar, $sort++]
            );
        }
    }

    // Kho ảnh Unsplash đã verify HTTP 200 trong template gốc (nhà/căn hộ/nội thất)
    private const PROPERTY_IMAGE_POOL = [
        '1560448204-e02f11c3d0e2','1568605114967-8130f3a36994','1570129477492-45c003edd2be',
        '1512917774080-9991f1c4c750','1600585154340-be6161a56a0c','1600596542815-ffad4c1539a9',
        '1600607687939-ce8a6c25118c','1600566753086-00f18fb6b3ea','1600585152220-90363fe7e115',
        '1613977257363-707ba9348227','1600047509807-ba8f99d2cdde','1600210492486-724fe5c67fb0',
        '1600585154363-67eb9e2e2099','1600566753190-17f0baa2a6c3','1600607688969-a5bfcd646154',
        '1580587771525-78b9dba3b914','1583608205776-bfd35f0d9f83','1613490493576-7fde63acd811',
        '1502005229762-cf1b2da7c5d6','1449844908441-8829872d2607','1522708323590-d24dbb6b0267',
        '1484154218962-a197022b5858','1523192193543-6e7296d960e4','1505873242700-f289a29e1e0f',
        '1580216643062-cf460548a66a','1554995207-c18c203602cb','1616137466211-f939a420be84',
        '1600210491892-03d54c0aaf87','1600210492493-0946911123ea','1592595896616-c37162298647',
        '1560184897-ae75f418493e','1600585152915-d208bec867a1','1600607687920-4e2a09cf159d',
        '1600566752355-35792bedcfea','1600585154526-990dced4db0d','1600585154084-4e5fe7c39198',
        '1560448204-603b3fc33ddc','1615874959474-d609969a20ed','1615529182904-14819c35db37',
        '1615873968403-89e068629265','1600880292203-757bb62b4baf','1489171078254-c3365d6e359f',
        '1544984243-ec57ea16fe25','1544198365-f5d60b6d8190','1521791136064-7986c2920216',
        '1524758631624-e2822e304c36','1502672260266-1c1ef2d93688','1494203484021-3c454daf695d',
        '1509644851169-2acc08aa25b5','1600880292089-90a7e086ee0c','1567016376408-0226e4d0c1ea',
        '1567016432779-094069958ea5','1615875605825-5eb9bb5d52ac','1616486338812-3dadae4b4ace',
        '1616594039964-ae9021a400a0','1560518883-ce09059eeffa',
    ];

    // Toạ độ trung tâm gần đúng từng quận/huyện TP.HCM — dùng để jitter lat/lng mỗi tin đăng
    private const DISTRICTS = [
        'quan-1'     => [10.7756, 106.7019],
        'quan-3'     => [10.7843, 106.6907],
        'quan-4'     => [10.7590, 106.7020],
        'quan-7'     => [10.7326, 106.7218],
        'quan-8'     => [10.7411, 106.6558],
        'quan-10'    => [10.7729, 106.6674],
        'quan-12'    => [10.8672, 106.6413],
        'binh-thanh' => [10.8106, 106.7091],
        'phu-nhuan'  => [10.7991, 106.6805],
        'tan-binh'   => [10.8014, 106.6528],
        'go-vap'     => [10.8386, 106.6653],
        'nha-be'     => [10.6959, 106.7378],
        'thu-duc'    => [10.8494, 106.7537],
        'binh-chanh' => [10.6957, 106.5954],
        'cu-chi'     => [10.9738, 106.4900],
    ];

    private function pickImages(int $seed, int $count): string {
        $pool = self::PROPERTY_IMAGE_POOL;
        $n = count($pool);
        $start = ($seed * 7) % $n;
        $out = [];
        for ($k = 0; $k < $count; $k++) {
            $out[] = 'https://images.unsplash.com/photo-' . $pool[($start + $k) % $n] . '?w=1200&auto=format&fit=crop&q=80';
        }
        return implode('|', $out);
    }

    // 42 tin đăng thực từ template gốc (properties-data.js RAW_LISTINGS) — copy nguyên nội dung,
    // không bịa thêm/bớt. Cột thứ tự: title, listingType, propertyType, price, priceUnit, area,
    // bedrooms, bathrooms, direction, legalStatus, furnishing, district, street, badge, postedDate,
    // agentIdx (0-5, khớp thứ tự seedAgents), description, features (pipe-separated)
    private function rawListings(): array {
        return [
            ['Căn hộ 2PN The Sun Avenue view sông Sài Gòn','ban','chung-cu',4300000000,'tỷ',72,2,2,'dong-nam','so-hong','day-du','thu-duc','Mai Chí Thọ','hot','2026-08-05',0,
                'Căn hộ tầng 15 dự án The Sun Avenue, view trọn sông Sài Gòn và Quận 1, ban công rộng đón gió mát quanh năm. Nội thất cao cấp đã setup sẵn, có thể dọn vào ở ngay. Cư dân được sử dụng hồ bơi, gym, khu BBQ và an ninh 24/7.',
                'View sông trực diện|Hồ bơi & gym nội khu|An ninh 24/7|Gần Metro số 1'],
            ['Chung cư 3PN Vinhomes Central Park, full nội thất','ban','chung-cu',7800000000,'tỷ',108,3,2,'tay-nam','so-hong','day-du','binh-thanh','Nguyễn Hữu Cảnh','moi','2026-08-15',1,
                'Căn hộ 3 phòng ngủ tại Landmark 81, nội thất nhập khẩu đồng bộ, sàn gỗ ấm cúng. Không gian sống xanh với công viên trung tâm rộng 14ha ngay dưới chân tòa nhà. Phù hợp gia đình có trẻ nhỏ, gần trường quốc tế và trung tâm thương mại Vincom.',
                'Công viên trung tâm 14ha|Trường quốc tế trong khuôn viên|Bãi đỗ xe hầm|View Landmark 81'],
            ['Cho thuê căn hộ 1PN Masteri Thảo Điền, đầy đủ nội thất','cho-thue','chung-cu',12000000,'triệu/tháng',52,1,1,'dong','so-hong','day-du','thu-duc','Xa lộ Hà Nội','','2026-07-20',2,
                'Căn hộ 1 phòng ngủ setup nội thất châu Âu, bếp riêng, máy giặt máy sấy đầy đủ. Khu Thảo Điền gần nhiều trường quốc tế, nhà hàng, phù hợp chuyên gia nước ngoài. Hợp đồng thuê tối thiểu 6 tháng, hồ sơ pháp lý minh bạch.',
                'Gần trường quốc tế|Bếp + máy giặt riêng|Hồ bơi vô cực|Cho thuê dài hạn'],
            ['Căn hộ 2PN Sunrise City, hướng Đông Nam thoáng mát','ban','chung-cu',3900000000,'tỷ',78,2,2,'dong-nam','so-hong','co-ban','quan-7','Nguyễn Hữu Thọ','','2026-06-28',3,
                'Căn hộ tầng trung, hướng Đông Nam đón gió tự nhiên, không bị nắng chiều gắt. Khu Sunrise City nội khu có hồ bơi, siêu thị, trường mầm non ngay tầng trệt. Phù hợp gia đình trẻ tại khu Nam Sài Gòn, gần Phú Mỹ Hưng.',
                'Gần Phú Mỹ Hưng|Trường mầm non nội khu|Siêu thị tầng trệt|Sổ hồng riêng từng căn'],
            ['Cho thuê căn hộ 2PN Vinhomes Grand Park giá tốt','cho-thue','chung-cu',9000000,'triệu/tháng',65,2,2,'tay','so-hong','day-du','thu-duc','Nguyễn Xiển','moi','2026-08-12',4,
                'Căn hộ mới bàn giao, nội thất cơ bản đầy đủ tủ bếp, điều hòa, nóng lạnh. Đại đô thị Vinhomes Grand Park có công viên, trường học, bệnh viện ngay trong nội khu. Thích hợp gia đình trẻ hoặc người đi làm khu vực phía Đông thành phố.',
                'Đại đô thị khép kín|Công viên & hồ cảnh quan|Trường học liên cấp|Giá thuê tốt'],
            ['Bán căn hộ Studio Millennium, trung tâm Quận 4','ban','chung-cu',3100000000,'tỷ',45,1,1,'bac','so-hong','day-du','quan-4','Bến Vân Đồn','da-ban','2026-07-02',5,
                'Căn hộ Studio thiết kế thông minh, tối ưu diện tích sử dụng, view thành phố về đêm lung linh. Chỉ 5 phút di chuyển sang Quận 1, thuận tiện cho người độc thân hoặc đầu tư cho thuê. Cư dân văn minh, quản lý chuyên nghiệp.',
                'Cách Quận 1 5 phút|Thiết kế studio tối ưu|View thành phố|Tiềm năng cho thuê tốt'],
            ['Chung cư 3PN Botanica Premier, Tân Bình','ban','chung-cu',5600000000,'tỷ',95,3,2,'dong-bac','so-hong','day-du','tan-binh','Hồng Hà','hot','2026-08-01',0,
                'Căn hộ 3 phòng ngủ gần sân bay Tân Sơn Nhất, thiết kế ban công rộng trồng cây xanh. Khu Botanica Premier an ninh khép kín, có khu vui chơi trẻ em và phòng gym riêng biệt từng block. Phù hợp gia đình đông người cần không gian rộng rãi.',
                'Gần sân bay Tân Sơn Nhất|Ban công trồng cây|Khu vui chơi trẻ em|Diện tích rộng 95m²'],
            ['Cho thuê căn hộ 1PN De Capella, Thủ Đức','cho-thue','chung-cu',8500000,'triệu/tháng',48,1,1,'nam','so-hong','co-ban','thu-duc','Song Hành','','2026-07-25',1,
                'Căn hộ mới 100%, gần Đại học Quốc gia và khu công nghệ cao, phù hợp sinh viên hoặc kỹ sư trẻ. Nội thất cơ bản gồm tủ bếp, điều hòa, có thể tự trang bị thêm theo nhu cầu. Tuyến Metro số 1 chỉ cách 5 phút đi bộ.',
                'Gần Metro số 1|Gần khu công nghệ cao|Nội thất cơ bản|Giá thuê sinh viên/kỹ sư'],
            ['Bán căn hộ 2PN Celadon City, gần Gò Vấp','ban','chung-cu',3400000000,'tỷ',70,2,2,'tay-bac','so-hong','day-du','go-vap','Tân Thới Hiệp','da-ban','2026-06-15',2,
                'Căn hộ trong khu đô thị Celadon City rộng hơn 16.000m² mảng xanh, hồ điều hòa lớn. Căn góc 2 mặt thoáng, không bị chắn tầm nhìn bởi tòa nhà đối diện. Tiện ích nội khu đầy đủ trường học, gần Aeon Mall Tân Phú.',
                'Gần Aeon Mall Tân Phú|Căn góc 2 mặt thoáng|Mảng xanh rộng|Hồ điều hòa lớn'],
            ['Cho thuê căn hộ 3PN Hà Đô Centrosa, Quận 10','cho-thue','chung-cu',16000000,'triệu/tháng',98,3,2,'dong-nam','so-hong','day-du','quan-10','Ba Tháng Hai','moi','2026-08-18',3,
                'Căn hộ cao cấp trung tâm Quận 10, gần Kỳ Hòa và các bệnh viện lớn của thành phố. Nội thất gỗ tự nhiên, bếp mở hiện đại, phù hợp gia đình có con đi học các trường lân cận. Bảo vệ 24/7, có hầm giữ xe ô tô riêng.',
                'Gần bệnh viện trung tâm|Nội thất gỗ tự nhiên|Hầm giữ xe ô tô|Bảo vệ 24/7'],

            ['Nhà phố 1 trệt 3 lầu mặt tiền Phan Xích Long','ban','nha-pho',15500000000,'tỷ',80,4,4,'dong-nam','so-hong','co-ban','phu-nhuan','Phan Xích Long','hot','2026-08-08',4,
                'Nhà mặt tiền đường Phan Xích Long sầm uất, kinh doanh buôn bán thuận lợi, gần chợ và nhiều quán cà phê nổi tiếng. Nhà xây kiên cố 1 trệt 3 lầu, có thang máy, phù hợp vừa ở vừa cho thuê mặt bằng tầng trệt. Hẻm xe hơi vào tận nhà.',
                'Mặt tiền kinh doanh|Có thang máy|Hẻm xe hơi|Sổ hồng riêng'],
            ['Nhà phố hẻm xe hơi đường Nguyễn Văn Trỗi','ban','nha-pho',8900000000,'tỷ',64,3,3,'tay','so-hong','tho','phu-nhuan','Nguyễn Văn Trỗi','','2026-07-10',5,
                'Nhà thô đang xây dở, chủ nhà cần bán gấp để chuyển công tác, khách mua có thể tự hoàn thiện theo ý thích. Hẻm rộng 6m xe hơi tránh nhau thoải mái, cách trục đường Nguyễn Văn Trỗi 50m. Khu dân cư an ninh, gần trường tiểu học.',
                'Hẻm 6m xe hơi tránh nhau|Gần trường tiểu học|Đang xây, tự hoàn thiện|Giá thương lượng'],
            ['Nhà phố mới xây đường Lê Văn Lương, Nhà Bè','ban','nha-pho',6200000000,'tỷ',90,4,3,'nam','so-hong','day-du','nha-be','Lê Văn Lương','moi','2026-08-14',0,
                'Nhà mới xây hoàn thiện 100%, nội thất cơ bản đã lắp đặt sẵn tủ bếp và đèn trang trí. Khu vực Nhà Bè đang phát triển hạ tầng nhanh, gần cầu Phú Xuân kết nối trực tiếp Quận 7. Phù hợp gia đình trẻ muốn sở hữu nhà riêng.',
                'Nhà mới 100%|Gần cầu Phú Xuân|Giá vừa túi tiền|Kết nối nhanh Quận 7'],
            ['Nhà phố 2 mặt tiền hẻm góc Gò Vấp','ban','nha-pho',7500000000,'tỷ',72,3,3,'dong-bac','so-hong','co-ban','go-vap','Nguyễn Oanh','','2026-06-30',1,
                'Căn nhà 2 mặt tiền hẻm thông thoáng, ánh sáng tự nhiên tràn vào mọi phòng. Vị trí gần chợ Gò Vấp và bệnh viện quận, tiện di chuyển vào trung tâm qua đường Nguyễn Kiệm. Có thể cải tạo thành nhà cho thuê phòng trọ.',
                '2 mặt tiền hẻm|Ánh sáng tự nhiên tốt|Gần chợ & bệnh viện|Tiềm năng cho thuê phòng'],
            ['Cho thuê nguyên căn nhà phố Thảo Điền làm văn phòng','cho-thue','nha-pho',45000000,'triệu/tháng',150,5,5,'dong-nam','so-hong','day-du','thu-duc','Trần Não','hot','2026-08-10',2,
                'Nhà phố phong cách hiện đại, sân vườn nhỏ phía trước, phù hợp làm văn phòng công ty hoặc homestay cao cấp. Khu Thảo Điền quy tụ nhiều chuyên gia nước ngoài sinh sống, an ninh tốt, đường nội khu rộng rãi.',
                'Sân vườn riêng|Phù hợp văn phòng/homestay|Khu chuyên gia nước ngoài|Hợp đồng dài hạn'],
            ['Nhà phố góc 2 mặt tiền Quốc lộ 1A, Quận 12','ban','nha-pho',5400000000,'tỷ',100,3,2,'tay-nam','hop-dong-mua-ban','tho','quan-12','Quốc lộ 1A','','2026-07-05',3,
                'Nhà nằm ngay mặt tiền Quốc lộ 1A, lưu lượng xe qua lại đông đúc, rất thích hợp kinh doanh cửa hàng hoặc showroom. Đất đã có hợp đồng mua bán công chứng, đang hoàn tất thủ tục sang tên sổ hồng. Chủ nhà hỗ trợ pháp lý trọn gói.',
                'Mặt tiền Quốc lộ 1A|Phù hợp kinh doanh showroom|Hỗ trợ pháp lý trọn gói|Lưu lượng xe đông'],
            ['Nhà phố kiểu Pháp cổ điển đường Trần Quốc Thảo','ban','nha-pho',22000000000,'tỷ',110,5,5,'dong','so-do','day-du','quan-3','Trần Quốc Thảo','hot','2026-08-03',4,
                'Ngôi nhà mang kiến trúc Pháp cổ điển hiếm có giữa trung tâm Quận 3, đã được cải tạo giữ nguyên nét hoài cổ kết hợp tiện nghi hiện đại. Sân trước rộng trồng cây cổ thụ, không gian sống yên tĩnh nhưng chỉ cách chợ Bến Thành 10 phút.',
                'Kiến trúc Pháp cổ điển|Sân vườn cây cổ thụ|Gần trung tâm Quận 1|Sổ đỏ chính chủ'],
            ['Nhà phố liền kề khu dân cư Trung Sơn','ban','nha-pho',9800000000,'tỷ',84,4,4,'dong-nam','so-hong','day-du','binh-chanh','Trung Sơn','','2026-07-18',5,
                'Nhà liền kề trong khu dân cư quy hoạch bài bản Trung Sơn, đường nội bộ rộng 12m, vỉa hè trồng cây xanh. Cư dân văn minh, an ninh khép kín có bảo vệ tuần tra 24/24. Gần trường quốc tế và bệnh viện Trung Sơn.',
                'Khu dân cư quy hoạch|Đường nội bộ 12m|An ninh khép kín|Gần trường quốc tế'],

            ['Đất nền thổ cư Nhà Bè, gần khu đô thị Phú Xuân','ban','dat-nen',3200000000,'tỷ',100,0,0,'dong-nam','so-do','tho','nha-be','Phú Xuân','moi','2026-08-16',0,
                'Lô đất thổ cư 100% nằm trong khu dân cư hiện hữu, đường trước nhà rộng 8m, đã có điện nước đầy đủ. Vị trí gần khu đô thị Phú Xuân đang phát triển hạ tầng cầu đường mạnh mẽ. Phù hợp xây nhà ở hoặc đầu tư chờ tăng giá.',
                'Thổ cư 100%|Đường trước nhà 8m|Điện nước đầy đủ|Tiềm năng tăng giá'],
            ['Đất nền dự án Bình Chánh, sổ riêng từng nền','ban','dat-nen',2600000000,'tỷ',120,0,0,'dong','so-hong','tho','binh-chanh','Trần Văn Giàu','','2026-06-20',1,
                'Nền đất trong dự án khu dân cư đã hoàn thiện hạ tầng đường nhựa, vỉa hè, cây xanh. Mỗi nền đã tách sổ hồng riêng, pháp lý minh bạch, công chứng sang tên trong ngày. Khu vực đang được đầu tư tuyến metro kết nối trung tâm.',
                'Sổ riêng từng nền|Hạ tầng hoàn thiện|Gần tuyến Metro|Công chứng trong ngày'],
            ['Đất nền view sông Củ Chi, phù hợp làm homestay','ban','dat-nen',3800000000,'tỷ',500,0,0,'tay-bac','so-do','tho','cu-chi','Tỉnh lộ 8','','2026-07-22',2,
                'Lô đất rộng ven sông Sài Gòn, không khí trong lành, phù hợp làm nhà vườn nghỉ dưỡng hoặc homestay sinh thái. Đường vào bằng bê tông rộng 4m, cách trung tâm Củ Chi khoảng 5km. Sổ đỏ đầy đủ, không dính quy hoạch.',
                'View sông Sài Gòn|Phù hợp homestay sinh thái|Không dính quy hoạch|Đường bê tông vào tận nơi'],
            ['Đất nền góc 2 mặt tiền hẻm Quận 12','ban','dat-nen',2100000000,'tỷ',80,0,0,'dong-nam','so-do','tho','quan-12','Nguyễn Ảnh Thủ','','2026-06-25',3,
                'Đất nền vuông vắn, vị trí góc 2 mặt tiền hẻm thông thoáng, tiện xây nhà theo nhiều hướng thiết kế. Khu vực dân cư đông đúc, gần chợ và trường học cấp 1, cấp 2. Giá tốt phù hợp người mua để ở lâu dài hoặc đầu tư nhỏ lẻ.',
                'Đất vuông vắn|Góc 2 mặt tiền hẻm|Gần chợ & trường học|Giá tốt đầu tư'],
            ['Đất nền dự án ven sông Nhà Bè, đầu tư sinh lời','ban','dat-nen',5500000000,'tỷ',150,0,0,'dong','so-hong','tho','nha-be','Nguyễn Bình','hot','2026-08-11',4,
                'Dự án khu đô thị ven sông với cảnh quan xanh mát, tiện ích công viên và bến du thuyền nội khu. Nền đất diện tích lớn phù hợp xây biệt thự sân vườn hoặc giữ đầu tư đón đầu quy hoạch. Chủ đầu tư uy tín, pháp lý hoàn chỉnh.',
                'Cảnh quan ven sông|Tiện ích bến du thuyền|Đón đầu quy hoạch hạ tầng|Chủ đầu tư uy tín'],
            ['Đất thổ cư mặt tiền đường lớn khu vực Củ Chi','ban','dat-nen',4200000000,'tỷ',200,0,0,'nam','so-do','tho','cu-chi','Nguyễn Thị Rành','','2026-07-08',5,
                'Lô đất mặt tiền đường nhựa 12m, xe tải lớn ra vào dễ dàng, thích hợp kinh doanh kho bãi hoặc xưởng nhỏ. Khu vực đang thu hút nhiều nhà đầu tư nhờ giá đất còn mềm so với các quận trung tâm. Sổ đỏ thổ cư toàn bộ diện tích.',
                'Mặt tiền đường 12m|Phù hợp kho bãi/xưởng nhỏ|Không vướng quy hoạch treo|Giá đất còn mềm'],
            ['Đất nền khu quy hoạch, TP. Thủ Đức','ban','dat-nen',6800000000,'tỷ',90,0,0,'dong-nam','so-hong','tho','thu-duc','Nguyễn Xiển','moi','2026-08-17',0,
                'Nền đất trong khu quy hoạch 1/500 đã được phê duyệt, hạ tầng điện ngầm, cấp thoát nước hoàn chỉnh. Vị trí gần khu công nghệ cao và các trường đại học lớn của TP Thủ Đức. Phù hợp xây nhà ở hoặc phòng trọ cho thuê.',
                'Quy hoạch 1/500 đã duyệt|Điện ngầm, hạ tầng hoàn chỉnh|Gần khu công nghệ cao|Tiềm năng cho thuê trọ'],
            ['Đất vườn sinh thái ven kênh, Bình Chánh','ban','dat-nen',8500000000,'tỷ',1000,0,0,'tay','so-do','tho','binh-chanh','Nguyễn Văn Linh nối dài','','2026-06-12',1,
                'Khu đất vườn rộng ven kênh rạch, nhiều cây ăn trái lâu năm, không khí trong lành xa khói bụi thành phố. Phù hợp làm trang trại nghỉ dưỡng cuối tuần hoặc chia lô đầu tư dài hạn. Đường vào xe tải nhỏ.',
                'Vườn cây ăn trái lâu năm|Ven kênh rạch mát mẻ|Phù hợp trang trại nghỉ dưỡng|Tiềm năng chia lô'],

            ['Biệt thự song lập Thảo Điền, sân vườn hồ bơi riêng','ban','biet-thu',38000000000,'tỷ',350,5,6,'dong-nam','so-hong','day-du','thu-duc','Nguyễn Cơ Thạch','hot','2026-08-06',2,
                'Biệt thự phong cách hiện đại với hồ bơi riêng và sân vườn rộng rợp bóng cây, nằm trong khu compound an ninh khép kín Thảo Điền. Nội thất nhập khẩu cao cấp, hệ thống nhà thông minh điều khiển từ xa.',
                'Hồ bơi riêng|Nhà thông minh|Compound an ninh khép kín|Nội thất nhập khẩu'],
            ['Biệt thự vườn Gò Vấp, không gian xanh mát','ban','biet-thu',19500000000,'tỷ',280,4,4,'tay-bac','so-hong','co-ban','go-vap','Quang Trung','','2026-07-14',3,
                'Biệt thự sân vườn rộng rãi với nhiều cây xanh lâu năm, không gian sống thoáng đãng hiếm có giữa thành phố. Kiến trúc mái Thái cổ điển, phòng khách thông tầng cao 6m sang trọng.',
                'Sân vườn cây lâu năm|Phòng khách thông tầng|Kiến trúc mái Thái|Gần đường Phạm Văn Đồng'],
            ['Biệt thự đơn lập Phú Mỹ Hưng, Quận 7','ban','biet-thu',42000000000,'tỷ',300,5,5,'nam','so-hong','day-du','quan-7','Nguyễn Lương Bằng','hot','2026-08-09',4,
                'Biệt thự đơn lập trong khu đô thị kiểu mẫu Phú Mỹ Hưng, thiết kế tân cổ điển sang trọng với thang máy gia đình. Khuôn viên riêng biệt 4 mặt thoáng, sân để được 3-4 xe ô tô.',
                'Khu đô thị kiểu mẫu|Thang máy gia đình|Sân đỗ 3-4 ô tô|Gần bệnh viện quốc tế'],
            ['Biệt thự nghỉ dưỡng ven sông Nhà Bè','ban','biet-thu',25000000000,'tỷ',400,4,5,'dong','so-hong','co-ban','nha-be','Nguyễn Bình','','2026-07-01',5,
                'Biệt thự phong cách resort với bến du thuyền riêng, view sông thoáng đãng đón gió mát quanh năm. Không gian sân vườn rộng phù hợp tổ chức tiệc gia đình hoặc nghỉ dưỡng cuối tuần.',
                'Bến du thuyền riêng|View sông thoáng đãng|Sân vườn rộng tổ chức tiệc|Cách Quận 7 15 phút'],
            ['Biệt thự mini 1 trệt 2 lầu Củ Chi, giá đầu tư','ban','biet-thu',9500000000,'tỷ',200,4,4,'tay-nam','so-do','tho','cu-chi','Tỉnh lộ 8','','2026-06-18',0,
                'Biệt thự mini xây thô hoàn thiện mặt ngoài, khách mua tự hoàn thiện nội thất theo phong cách riêng. Khuôn viên rộng có sân trước trồng cây cảnh, phù hợp làm nhà vườn nghỉ dưỡng cuối tuần.',
                'Khuôn viên rộng|Sân vườn trồng cây cảnh|Giá đầu tư hấp dẫn|Tự hoàn thiện nội thất'],
            ['Biệt thự song lập Bình Thạnh, view thành phố','ban','biet-thu',31000000000,'tỷ',260,5,5,'dong-bac','so-hong','day-du','binh-thanh','Xô Viết Nghệ Tĩnh','moi','2026-08-19',1,
                'Biệt thự song lập nằm trên cao, tầm nhìn bao quát toàn cảnh thành phố về đêm lung linh ánh đèn. Thiết kế 3 tầng với sân thượng rộng làm khu vườn trên mái, gần cầu Sài Gòn.',
                'View toàn cảnh thành phố|Sân thượng vườn trên mái|Gần cầu Sài Gòn|3 tầng thiết kế mở'],

            ['Shophouse mặt tiền Nguyễn Văn Linh, Quận 7','ban','shophouse',18000000000,'tỷ',100,4,4,'dong-nam','so-hong','tho','quan-7','Nguyễn Văn Linh','hot','2026-08-04',2,
                'Shophouse 1 trệt 4 lầu mặt tiền đại lộ Nguyễn Văn Linh, lưu lượng giao thông cực lớn, phù hợp mở ngân hàng, showroom hoặc chuỗi cửa hàng thương hiệu. Mặt tiền rộng 5m, tầng trệt thông suốt không cột giữa.',
                'Mặt tiền đại lộ lớn|Tầng trệt không cột giữa|Phù hợp chuỗi thương hiệu|Dân cư thu nhập cao'],
            ['Cho thuê shophouse Vinhomes Grand Park kinh doanh F&B','cho-thue','shophouse',55000000,'triệu/tháng',90,3,3,'tay','so-hong','co-ban','thu-duc','Nguyễn Xiển','','2026-07-27',3,
                'Shophouse mặt tiền trục đường chính trong đại đô thị Vinhomes Grand Park, lượng cư dân nội khu hơn 20.000 người là khách hàng tiềm năng. Không gian phù hợp mở quán cà phê, nhà hàng hoặc phòng khám.',
                '20.000+ cư dân nội khu|Phù hợp F&B/phòng khám|Hỗ trợ pháp lý kinh doanh|Mặt tiền trục chính'],
            ['Shophouse góc 2 mặt tiền Tân Bình, gần sân bay','ban','shophouse',21000000000,'tỷ',110,5,5,'dong','so-hong','co-ban','tan-binh','Cộng Hòa','da-ban','2026-06-22',4,
                'Shophouse góc 2 mặt tiền ngay khu vực gần sân bay Tân Sơn Nhất, tiềm năng kinh doanh dịch vụ lưu trú, ăn uống cho khách công tác. Diện tích sử dụng rộng rãi 5 tầng, thang máy riêng biệt.',
                'Góc 2 mặt tiền|Gần sân bay Tân Sơn Nhất|Thang máy riêng|Tiềm năng lưu trú/F&B'],
            ['Shophouse compound ven sông Quận 8','ban','shophouse',12500000000,'tỷ',84,3,3,'nam','so-hong','tho','quan-8','Phạm Thế Hiển','moi','2026-08-13',5,
                'Shophouse trong compound ven sông mới bàn giao, thiết kế hiện đại với sân trước rộng để xe và bày hàng hóa. Khu vực Quận 8 đang được đầu tư mạnh hạ tầng cầu mới kết nối Quận 1.',
                'Compound ven sông|Sân trước để xe/bày hàng|Đón đầu hạ tầng cầu mới|Giá tốt đầu tư'],
            ['Shophouse trung tâm thương mại Quận 12','cho-thue','shophouse',30000000,'triệu/tháng',70,2,2,'dong-nam','so-hong','co-ban','quan-12','Nguyễn Ảnh Thủ','','2026-07-15',0,
                'Mặt bằng shophouse nằm trong khu trung tâm thương mại sầm uất Quận 12, lượng khách qua lại ổn định mỗi ngày. Phù hợp kinh doanh thời trang, mỹ phẩm hoặc cửa hàng tiện lợi. Có sẵn biển hiệu mặt tiền.',
                'Trong khu TTTM sầm uất|Lượng khách ổn định|Có sẵn biển hiệu mặt tiền|Bàn giao ngay'],

            ['Căn hộ dịch vụ full nội thất Quận 1, cho thuê ngắn hạn','cho-thue','can-ho-dich-vu',11000000,'triệu/tháng',35,1,1,'dong','so-hong','day-du','quan-1','Đồng Khởi','hot','2026-08-07',1,
                'Căn hộ dịch vụ ngay trung tâm Quận 1, đi bộ đến phố đi bộ Nguyễn Huệ chỉ 5 phút. Nội thất đầy đủ tiện nghi khách sạn, dọn phòng và thay ga giường hàng tuần. Phù hợp chuyên gia nước ngoài hoặc khách thuê ngắn hạn.',
                'Trung tâm Quận 1|Dịch vụ dọn phòng hàng tuần|Cho thuê linh hoạt theo tháng|Gần phố đi bộ Nguyễn Huệ'],
            ['Căn hộ dịch vụ mini Phú Nhuận cho thuê người độc thân','cho-thue','can-ho-dich-vu',7000000,'triệu/tháng',28,1,1,'tay','so-hong','day-du','phu-nhuan','Nguyễn Văn Trỗi','','2026-06-29',2,
                'Căn hộ mini diện tích tối ưu dành cho người độc thân hoặc cặp đôi trẻ, gồm gác lửng ngủ riêng biệt. Khu vực Phú Nhuận yên tĩnh nhưng gần chợ, quán ăn và các tuyến xe buýt trung tâm.',
                'Gác lửng riêng biệt|Giá đã gồm phí quản lý|Khu vực yên tĩnh|Gần chợ & tuyến bus'],
            ['Căn hộ dịch vụ cao cấp Thảo Điền, view Landmark','cho-thue','can-ho-dich-vu',18000000,'triệu/tháng',55,1,1,'dong-nam','so-hong','day-du','thu-duc','Trần Não','moi','2026-08-20',3,
                'Căn hộ dịch vụ hạng sang view thẳng Landmark 81, nội thất thiết kế theo phong cách khách sạn 5 sao. Có hồ bơi vô cực tầng thượng và phòng gym riêng cho cư dân toà nhà dịch vụ.',
                'View Landmark 81|Hồ bơi vô cực tầng thượng|Nội thất phong cách khách sạn|Khách thuê chuyên gia cấp cao'],
            ['Căn hộ dịch vụ giá rẻ Gò Vấp cho sinh viên','cho-thue','can-ho-dich-vu',4500000,'triệu/tháng',25,1,1,'bac','so-hong','co-ban','go-vap','Nguyễn Oanh','','2026-07-03',4,
                'Căn hộ dịch vụ nhỏ gọn giá rẻ, phù hợp sinh viên hoặc người mới đi làm ngân sách hạn chế. Khu vực Gò Vấp gần nhiều trường đại học, cao đẳng và chợ sinh viên giá bình dân.',
                'Giá rẻ phù hợp sinh viên|Gần nhiều trường đại học|Có thang máy & bảo vệ|An toàn cho người ở một mình'],
            ['Căn hộ dịch vụ 2PN Bình Thạnh cho gia đình nhỏ','cho-thue','can-ho-dich-vu',13500000,'triệu/tháng',60,2,1,'tay-nam','so-hong','day-du','binh-thanh','Điện Biên Phủ','dang-giao-dich','2026-07-30',5,
                'Căn hộ dịch vụ 2 phòng ngủ phù hợp gia đình nhỏ có 1-2 con, gần trường tiểu học và công viên Gia Định. Nội thất đầy đủ máy giặt, tủ lạnh, bếp riêng biệt không dùng chung.',
                'Phù hợp gia đình nhỏ|Gần công viên Gia Định|Bếp & máy giặt riêng|Chủ nhà hỗ trợ linh hoạt'],
        ];
    }

    private function seedProperties(): void {
        if ($this->scalar("SELECT COUNT(*) FROM properties") > 0) return;
        $agentIds = array_column($this->query("SELECT id FROM agents ORDER BY sort_order, id"), 'id');
        $id = 0;
        foreach ($this->rawListings() as $r) {
            [$title, $listingType, $propertyType, $price, $priceUnit, $area, $bedrooms, $bathrooms,
             $direction, $legalStatus, $furnishing, $district, $street, $badge, $postedDate, $agentIdx,
             $description, $features] = $r;
            $id++;
            $slug = slugify($title) . '-' . $id;
            [$baseLat, $baseLng] = self::DISTRICTS[$district] ?? [10.7756, 106.7019];
            $lat = $baseLat + (($id % 7) - 3) * 0.0015;
            $lng = $baseLng + (($id % 5) - 2) * 0.0015;
            $agentId = $agentIds[$agentIdx] ?? null;
            $images = $this->pickImages($id, 6);
            $this->execute(
                "INSERT INTO properties (title, slug, listing_type, property_type, price, price_unit, area, bedrooms, bathrooms,
                    direction, legal_status, furnishing, district, street, lat, lng, badge, posted_date, agent_id,
                    description, features, images)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [$title, $slug, $listingType, $propertyType, $price, $priceUnit, $area, $bedrooms, $bathrooms,
                 $direction, $legalStatus, $furnishing, $district, $street, $lat, $lng, $badge, $postedDate, $agentId,
                 $description, $features, $images]
            );
        }
    }

    private function seedProjects(): void {
        if ($this->scalar("SELECT COUNT(*) FROM projects") > 0) return;
        $items = [
            ['Vinhomes Grand Park — Phân khu The Beverly',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
                'Đang mở bán',
                'Đại đô thị khép kín tại TP. Thủ Đức với công viên trung tâm, trường học, bệnh viện nội khu. Căn hộ 1-3 phòng ngủ, bàn giao nội thất cơ bản.',
                'Vinhomes', 'Giá từ 2.6 tỷ', 'TP. Thủ Đức'],
            ['Celadon City — Phân khu Emerald',
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
                'Đang mở bán',
                'Khu đô thị xanh với hơn 16.000m² mảng xanh và hồ điều hòa lớn, gần Aeon Mall Tân Phú. Căn hộ 2-3 phòng ngủ, nhiều căn view hồ.',
                'Gamuda Land', 'Giá từ 3.2 tỷ', 'Gò Vấp — Tân Phú'],
            ['The Sun Avenue — Giai đoạn 2',
                'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=80',
                'Sắp bàn giao',
                'Căn hộ view sông Sài Gòn tại TP. Thủ Đức, dự kiến bàn giao quý IV/2026. Tiện ích hồ bơi, gym, khu BBQ ngoài trời cho cư dân.',
                'Novaland', 'Giá từ 4.1 tỷ', 'TP. Thủ Đức'],
            ['Phú Mỹ Hưng Midtown — Block M3',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
                'Đang mở bán',
                'Nằm trong khu đô thị kiểu mẫu Phú Mỹ Hưng, gần trường quốc tế và bệnh viện FV. Căn hộ 2-4 phòng ngủ, thiết kế tân cổ điển.',
                'Phú Mỹ Hưng', 'Giá từ 6.8 tỷ', 'Quận 7'],
        ];
        $sort = 0;
        foreach ($items as [$title, $image, $status, $desc, $investor, $priceLabel, $areaLabel]) {
            $this->execute(
                "INSERT INTO projects (title, image, status_label, description, investor, price_label, area_label, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [$title, $image, $status, $desc, $investor, $priceLabel, $areaLabel, $sort++]
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $items = [
            ['https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
                'Nguyễn Ngọc Anh', 'Khách mua căn hộ tại Quận 7',
                'Mình tìm được căn hộ 2PN ở Quận 7 chỉ sau 3 lần xem nhà. Môi giới tư vấn rất kỹ về pháp lý, không giấu diếm gì cả, thủ tục sang tên cũng nhanh gọn.'],
            ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
                'Trần Quốc Bảo', 'Khách bán nhà phố tại Phú Nhuận',
                'Tôi cần bán gấp nhà phố để chuyển công tác, đội ngũ Nhà Đất Việt hỗ trợ định giá hợp lý và tìm được khách mua chỉ trong 3 tuần. Rất chuyên nghiệp.'],
            ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
                'Lê Thảo My', 'Khách thuê căn hộ dịch vụ Quận 1',
                'Công cụ tính vay trên trang chi tiết giúp mình chủ động biết số tiền trả góp hàng tháng trước khi liên hệ, không mất thời gian hỏi qua hỏi lại nhiều lần.'],
        ];
        $sort = 0;
        foreach ($items as [$avatar, $name, $role, $content]) {
            $this->execute(
                "INSERT INTO testimonials (avatar, name, role, content, sort_order) VALUES (?, ?, ?, ?, ?)",
                [$avatar, $name, $role, $content, $sort++]
            );
        }
    }

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $items = [
            ['Phí môi giới khi mua/bán/thuê nhà qua Nhà Đất Việt là bao nhiêu?',
             'Với người mua/thuê, Nhà Đất Việt không thu bất kỳ khoản phí nào. Phí môi giới được tính cho bên bán/cho thuê, thường 1-2% giá trị giao dịch với bán và tương đương nửa tháng đến 1 tháng tiền thuê đầu tiên với cho thuê — mức phí cụ thể được thống nhất bằng văn bản trước khi ký gửi.'],
            ['Quy trình đặt cọc mua bán bất động sản diễn ra như thế nào?',
             'Sau khi hai bên thống nhất giá, Nhà Đất Việt hỗ trợ soạn hợp đồng đặt cọc ghi rõ số tiền cọc (thường 5-10% giá trị BĐS), thời hạn ra công chứng và điều khoản xử lý nếu một bên vi phạm. Hợp đồng đặt cọc có thể lập vi bằng hoặc công chứng tùy thỏa thuận để tăng tính pháp lý.'],
            ['Nhà Đất Việt có hỗ trợ vay ngân hàng không?',
             'Có. Chúng tôi kết nối sẵn với nhiều ngân hàng đối tác, hỗ trợ khách hàng chuẩn bị hồ sơ vay, thẩm định tài sản và làm việc trực tiếp với chuyên viên tín dụng. Bạn cũng có thể dùng công cụ tính vay trả góp ngay trên trang chi tiết mỗi bất động sản để ước tính trước.'],
            ['Thời gian sang tên sổ đỏ/sổ hồng mất bao lâu?',
             'Thông thường từ 15-30 ngày làm việc kể từ khi nộp đủ hồ sơ tại Văn phòng đăng ký đất đai, tùy từng quận/huyện và tình trạng hồ sơ gốc. Với các trường hợp đất đang chờ tách sổ hoặc vướng quy hoạch, thời gian có thể kéo dài hơn — Nhà Đất Việt sẽ thông báo minh bạch tình trạng cụ thể ngay từ đầu.'],
            ['Làm sao biết bất động sản có pháp lý rõ ràng, không dính tranh chấp/quy hoạch?',
             'Mỗi tin đăng trên hệ thống đều được đội ngũ pháp lý kiểm tra thông tin quy hoạch, tranh chấp, thế chấp tại cơ quan chức năng trước khi công bố. Khách hàng cũng có thể yêu cầu bản sao sổ đỏ/sổ hồng và tự tra cứu thông tin quy hoạch tại Văn phòng đăng ký đất đai trước khi đặt cọc.'],
            ['Nếu đặt cọc rồi muốn hủy giao dịch thì có lấy lại tiền cọc không?',
             'Tùy điều khoản trong hợp đồng đặt cọc đã ký. Theo quy định phổ biến: nếu bên mua đơn phương hủy sẽ mất tiền cọc, nếu bên bán đơn phương hủy sẽ phải hoàn trả gấp đôi số tiền cọc. Nhà Đất Việt luôn tư vấn ghi rõ điều khoản này trong hợp đồng để tránh tranh chấp về sau.'],
            ['Tôi có thể xem nhà trực tiếp trước khi quyết định không?',
             'Chắc chắn có. Nhà Đất Việt khuyến khích khách hàng xem nhà thực tế trước khi đặt cọc. Bạn có thể đặt lịch hẹn ngay trên trang chi tiết từng bất động sản, môi giới phụ trách sẽ sắp xếp thời gian phù hợp và đồng hành cùng bạn trong buổi xem nhà.'],
            ['Nhà Đất Việt có nhận ký gửi bán/cho thuê bất động sản không?',
             'Có. Chúng tôi nhận ký gửi mọi loại hình: căn hộ, nhà phố, đất nền, biệt thự, shophouse. Đội ngũ hỗ trợ định giá miễn phí, chụp ảnh chuyên nghiệp, đăng tin trên nhiều kênh và tìm khách phù hợp. Liên hệ mục "Đăng tin ký gửi" ở đầu trang để bắt đầu.'],
        ];
        $sort = 0;
        foreach ($items as [$q, $a]) {
            $this->execute(
                "INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)",
                [$q, $a, $sort++]
            );
        }
    }

    // ─── Query helpers ─────────────────────────────────────────────────────────

    public function query(string $sql, array $params = []): array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $rows = $this->query($sql, $params);
        return $rows[0] ?? null;
    }

    public function scalar(string $sql, array $params = []): mixed {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchColumn();
    }

    public function execute(string $sql, array $params = []): int|string {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $this->pdo->lastInsertId();
    }

    // UPDATE atomic có điều kiện (vd trừ số dư có guard) — trả về true nếu có row bị ảnh hưởng.
    public function executeAffected(string $sql, array $params = []): bool {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount() > 0;
    }

    public function getPdo(): \PDO {
        return $this->pdo;
    }
}

// Helper functions
function bodyJson(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function slugify(string $text): string {
    $text = mb_strtolower($text, 'UTF-8');
    $map = [
        'à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a',
        'ă'=>'a','ắ'=>'a','ặ'=>'a','ằ'=>'a','ẳ'=>'a','ẵ'=>'a',
        'â'=>'a','ấ'=>'a','ầ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a',
        'è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e',
        'ê'=>'e','ế'=>'e','ề'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e',
        'ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i',
        'ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o',
        'ô'=>'o','ố'=>'o','ồ'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o',
        'ơ'=>'o','ớ'=>'o','ờ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o',
        'ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u',
        'ư'=>'u','ứ'=>'u','ừ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u',
        'ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y',
        'đ'=>'d',
    ];
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', trim($text));
    return trim($text, '-');
}
