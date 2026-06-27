<?php
declare(strict_types=1);

class Database {
    private static ?Database $instance = null;
    private \PDO $pdo;

    private function __construct() {
        $type = DB_TYPE ?? 'sqlite';

        if ($type === 'sqlite') {
            $dir = dirname(DB_FILE);
            if (!is_dir($dir)) mkdir($dir, 0755, true);
            $this->pdo = new \PDO('sqlite:' . DB_FILE);
            $this->pdo->exec('PRAGMA foreign_keys = ON');
            $this->pdo->exec('PRAGMA journal_mode = WAL');
        } elseif ($type === 'mysql') {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $this->pdo = new \PDO($dsn, DB_USER, DB_PASS);
        } elseif ($type === 'pgsql') {
            $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;
            $this->pdo = new \PDO($dsn, DB_USER, DB_PASS);
        } else {
            throw new \RuntimeException("Unsupported DB_TYPE: $type");
        }

        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
        $this->migrate();
    }

    public static function getInstance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function pdo(): \PDO { return $this->pdo; }

    public function query(string $sql, array $params = []): array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function execute(string $sql, array $params = []): \PDOStatement {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    public function lastInsertId(): string { return $this->pdo->lastInsertId(); }

    // ── Schema migration ──────────────────────────────────────────────────────

    private function migrate(): void {
        $sqlFile = __DIR__ . '/../schema.sql';
        $sql = file_get_contents($sqlFile);
        if ($sql === false) {
            throw new \RuntimeException('Cannot read schema.sql');
        }
        // Strip comments before split — avoid mismatches
        $sql = preg_replace('/^\s*--.*$/m', '', $sql);
        $statements = array_filter(array_map('trim', explode(';', $sql)), fn($s) => $s !== '');
        foreach ($statements as $stmt) {
            $this->pdo->exec($stmt . ';');
        }
        $this->seedData();
    }

    // ── Seed data ─────────────────────────────────────────────────────────────

    private function seedData(): void {
        $this->seedUsers();
        $this->seedSettings();
        $this->seedHeroSlides();
        $this->seedServiceCategories();
        $this->seedServices();
        $this->seedGallery();
        $this->seedTestimonials();
        $this->seedTeamMembers();
    }

    private function seedUsers(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
        if ($count > 0) return;
        $hash = password_hash('123456', PASSWORD_BCRYPT);
        $this->pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)")
            ->execute(['sysadmin', 'sysadmin@admin.com', $hash, 'superadmin']);
    }

    private function seedSettings(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM settings")->fetchColumn();
        if ($count > 0) return;

        $rows = [
            // general
            ['site_name',       'Bella Spa',                                                    'general'],
            ['site_tagline',    'Spa & Làm đẹp cao cấp',                                       'general'],
            ['site_phone',      '0901 234 567',                                                  'general'],
            ['site_email',      'hello@bellaspa.vn',                                            'general'],
            ['site_address',    '123 Đường Nguyễn Huệ, Quận 1, TP.HCM',                        'general'],
            ['working_hours',   '9:00 – 20:00 hàng ngày (kể cả thứ 7, CN)',                    'general'],
            // seo
            ['meta_title',      'Bella Spa — Spa & Làm đẹp cao cấp TP.HCM',                   'seo'],
            ['meta_description','Bella Spa — Nơi bạn được chăm sóc toàn diện. Dịch vụ spa, massage, chăm sóc da chuyên nghiệp tại TP.HCM.', 'seo'],
            ['meta_keywords',   'spa, massage, chăm sóc da, body treatment, làm đẹp, TP.HCM',  'seo'],
            // social
            ['facebook',        'https://facebook.com/bellaspa',    'social'],
            ['instagram',       'https://instagram.com/bellaspa',   'social'],
            ['tiktok',          'https://tiktok.com/@bellaspa',     'social'],
            ['zalo_number',     '0901234567',                        'social'],
            // hero
            ['hero_badge',      'Spa & Làm đẹp cao cấp',            'hero'],
            ['hero_title1',     'Không gian',                        'hero'],
            ['hero_title2',     'của thư giãn',                      'hero'],
            ['hero_title3',     '& làm đẹp.',                        'hero'],
            ['hero_sub',        'Mỗi lần đến với Bella Spa là một hành trình chăm sóc toàn diện — từ tâm hồn đến vẻ ngoài.', 'hero'],
            ['hero_cta_primary', 'Đặt lịch ngay',                   'hero'],
            ['hero_cta_secondary','Xem dịch vụ',                    'hero'],
            // stats
            ['stat_customers',  '500+',     'stats'],
            ['stat_years',      '5',        'stats'],
            ['stat_services',   '30+',      'stats'],
            ['stat_rating',     '4.9★',    'stats'],
            // about
            ['about_title',     'Không gian thiên đường giữa lòng thành phố',                  'about'],
            ['about_sub',       'Bella Spa được thành lập với triết lý rằng mọi người đều xứng đáng được chăm sóc và thư giãn đích thực. Chúng tôi kết hợp liệu pháp truyền thống và công nghệ hiện đại.', 'about'],
            ['about_image',     'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80&auto=format&fit=crop', 'about'],
            ['feature1_icon',   '🌿',                                'about'],
            ['feature1_title',  'Chuyên viên tận tâm',               'about'],
            ['feature1_desc',   'Đào tạo chuyên sâu, 5+ năm kinh nghiệm', 'about'],
            ['feature2_icon',   '✨',                                'about'],
            ['feature2_title',  'Sản phẩm cao cấp',                  'about'],
            ['feature2_desc',   'Thương hiệu organic nhập khẩu, an toàn', 'about'],
            ['feature3_icon',   '🧼',                                'about'],
            ['feature3_title',  'Không gian thư giãn',               'about'],
            ['feature3_desc',   'Thiết kế đẳng cấp, âm nhạc nhẹ nhàng', 'about'],
            ['feature4_icon',   '📱',                                'about'],
            ['feature4_title',  'Đặt lịch dễ dàng',                  'about'],
            ['feature4_desc',   'Online hoặc qua Zalo, xác nhận trong 15 phút', 'about'],
            // booking
            ['booking_note',    'Chúng tôi sẽ xác nhận qua Zalo trong 15 phút. Miễn phí hủy trước 2 giờ.', 'booking'],
            ['booking_promo1_title', 'Lần đầu tiên',                 'booking'],
            ['booking_promo1_desc',  'Giảm 20% tất cả dịch vụ cho khách mới', 'booking'],
            ['booking_promo2_title', 'Combo 5 buổi',                 'booking'],
            ['booking_promo2_desc',  'Thanh toán trước 5 buổi, tặng 1 buổi miễn phí', 'booking'],
            ['booking_promo3_title', 'Sinh nhật',                    'booking'],
            ['booking_promo3_desc',  'Miễn phí 1 dịch vụ massage 60 phút vào tháng sinh nhật', 'booking'],
            // contact
            ['map_embed',       'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4506968732424!2d106.70226231533419!3d10.776889692320065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc7%3A0x4db964d76bf2d292!2sDistrict%201%2C%20Ho%20Chi%20Minh%20City!5e0!3m2!1sen!2svn!4v1234567890', 'contact'],
            // footer
            ['footer_desc',     'Nơi bạn được chăm sóc, thư giãn và tìm lại chính mình.', 'footer'],
            ['footer_copyright','© 2026 Bella Spa. All rights reserved.',                  'footer'],
            // smtp
            ['smtp_host',       'smtp.gmail.com', 'smtp'],
            ['smtp_port',       '587',             'smtp'],
            ['smtp_user',       '',                'smtp'],
            ['smtp_pass',       '',                'smtp'],
            ['smtp_from_name',  'Bella Spa',       'smtp'],
            ['smtp_from_email', '',                'smtp'],
            // system
            ['maintenance_mode','0', 'system'],
            // cloudinary
            ['cloud_name',      '', 'cloudinary'],
            ['cloud_api_key',   '', 'cloudinary'],
            ['cloud_api_secret','', 'cloudinary'],
            // integrations
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];

        $stmt = $this->pdo->prepare("INSERT OR IGNORE INTO settings (key, value, grp) VALUES (?, ?, ?)");
        foreach ($rows as [$k, $v, $g]) {
            $stmt->execute([$k, $v, $g]);
        }
    }

    private function seedHeroSlides(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM hero_slides")->fetchColumn();
        if ($count > 0) return;
        $slides = [
            ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1400&q=70&auto=format&fit=crop', 'Không gian spa', 0],
            ['https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1400&q=70&auto=format&fit=crop', 'Massage thư giãn', 1],
            ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1400&q=70&auto=format&fit=crop', 'Chăm sóc da', 2],
            ['https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=1400&q=70&auto=format&fit=crop', 'Body treatment', 3],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO hero_slides (image, alt, sort_order) VALUES (?, ?, ?)");
        foreach ($slides as $s) $stmt->execute($s);
    }

    private function seedServiceCategories(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM service_categories")->fetchColumn();
        if ($count > 0) return;
        $cats = [
            ['Massage',         '💆', 0],
            ['Chăm sóc da',     '✨', 1],
            ['Body Treatment',  '🌿', 2],
            ['Nail & Lashes',   '💅', 3],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO service_categories (name, icon, sort_order) VALUES (?, ?, ?)");
        foreach ($cats as $c) $stmt->execute($c);
    }

    private function seedServices(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM services")->fetchColumn();
        if ($count > 0) return;

        $catIds = [];
        foreach ($this->pdo->query("SELECT id, name FROM service_categories")->fetchAll() as $r) {
            $catIds[$r['name']] = $r['id'];
        }
        $c1 = $catIds['Massage']        ?? 1;
        $c2 = $catIds['Chăm sóc da']    ?? 2;
        $c3 = $catIds['Body Treatment'] ?? 3;
        $c4 = $catIds['Nail & Lashes']  ?? 4;

        $services = [
            // Massage
            [$c1, 'Massage Thụy Điển',  'Phổ biến', 'Kỹ thuật cổ điển, cải thiện tuần hoàn, giảm căng thẳng cơ bắp.', 'Từ 350.000đ', '60 phút', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=70&auto=format&fit=crop', 1, 0],
            [$c1, 'Massage Đá Nóng',    'Hot',       'Đá bazan nóng kết hợp massage sâu, tan biến mọi đau nhức cơ bắp.', '550.000đ', '90 phút', 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&q=70&auto=format&fit=crop', 1, 1],
            [$c1, 'Massage Thái',        '',          'Kéo giãn cơ thể kết hợp massage áp lực điểm, năng lượng phục hồi hoàn toàn.', '450.000đ', '90 phút', 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=70&auto=format&fit=crop', 0, 2],
            // Chăm sóc da
            [$c2, 'Facial Cơ Bản',       'Phổ biến', 'Làm sạch, tẩy tế bào chết, mặt nạ dưỡng và massage mặt. Phù hợp mọi loại da.', '450.000đ', '75 phút', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=70&auto=format&fit=crop', 1, 3],
            [$c2, 'Điều Trị Chuyên Sâu','Cao cấp',   'Công nghệ RF, Ultrasound và serum active nồng độ cao cho da lão hóa, thâm nám và mụn.', '750.000đ', '90 phút', 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=70&auto=format&fit=crop', 1, 4],
            // Body Treatment
            [$c3, 'Tẩy Da Chết Toàn Thân','',        'Loại bỏ tế bào chết, da mềm mại và sáng tươi hơn ngay sau 1 lần.', '400.000đ', '45 phút', 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=70&auto=format&fit=crop', 0, 5],
            [$c3, 'Body Wrap',            'Thảo dược','Bọc cơ thể với hỗn hợp khoáng chất và thảo dược, dưỡng ẩm sâu và thải độc.', '650.000đ', '90 phút', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=70&auto=format&fit=crop', 0, 6],
            [$c3, 'Gói VIP Toàn Thân',   'VIP',       'Combo tẩy da chết + bọc body + massage thư giãn + chăm sóc mặt. Trải nghiệm spa đỉnh cao.', '1.200.000đ', '3 giờ', 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&q=70&auto=format&fit=crop', 1, 7],
            // Nail & Lashes
            [$c4, 'Nail Gel',            '',           'Nail gel bền màu, không bong tróc, giữ được 3–4 tuần. Đa dạng màu sắc và họa tiết.', 'Từ 150.000đ', '60 phút', '', 0, 8],
            [$c4, 'Nail Art',            'Nổi bật',   'Họa tiết thủ công tinh tế — từ hoa lá đơn giản đến thiết kế 3D độc đáo.', 'Từ 200.000đ', '90 phút', '', 0, 9],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO services (category_id, name, tag, description, price, duration, image, featured, sort_order) VALUES (?,?,?,?,?,?,?,?,?)");
        foreach ($services as $s) $stmt->execute($s);
    }

    private function seedGallery(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM gallery_items")->fetchColumn();
        if ($count > 0) return;
        $items = [
            ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&q=70&auto=format&fit=crop', 'Không gian spa 1', 0],
            ['https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=70&auto=format&fit=crop', 'Massage thư giãn', 1],
            ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&q=70&auto=format&fit=crop', 'Chăm sóc da', 2],
            ['https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=500&q=70&auto=format&fit=crop', 'Body care', 3],
            ['https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=500&q=70&auto=format&fit=crop', 'Không gian thư giãn', 4],
            ['https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&q=70&auto=format&fit=crop', 'Body wrap', 5],
            ['https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=500&q=70&auto=format&fit=crop', 'VIP treatment', 6],
            ['https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=500&q=70&auto=format&fit=crop', 'Massage đá nóng', 7],
            ['https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500&q=70&auto=format&fit=crop', 'Điều trị chuyên sâu', 8],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO gallery_items (image, title, sort_order) VALUES (?,?,?)");
        foreach ($items as $it) $stmt->execute($it);
    }

    private function seedTestimonials(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
        if ($count > 0) return;
        $rows = [
            ['Nguyễn Lan Anh',   'Quận 1, TP.HCM',   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=70&auto=format&fit=crop&crop=face', 'Không gian cực kỳ thư giãn, nhân viên rất nhiệt tình và chuyên nghiệp. Massage đá nóng tuyệt vời — sẽ quay lại ngay tuần tới!', 5, 0],
            ['Trần Bích Ngọc',   'Quận 3, TP.HCM',   'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=70&auto=format&fit=crop&crop=face', 'Chăm sóc da mặt tuyệt vời, da mình cải thiện rõ rệt sau 3 buổi. Chuyên viên tư vấn rất kỹ và tận tâm. Giá cả hợp lý.', 5, 1],
            ['Lê Phương Thảo',   'Bình Thạnh, TP.HCM','https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=70&auto=format&fit=crop&crop=face', 'Đặt lịch dễ dàng, không phải chờ đợi. Gói chăm sóc toàn thân rất xứng đáng. Sẽ giới thiệu cho bạn bè ngay.', 5, 2],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO testimonials (author_name, author_location, author_avatar, content, rating, sort_order) VALUES (?,?,?,?,?,?)");
        foreach ($rows as $r) $stmt->execute($r);
    }

    private function seedTeamMembers(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM team_members")->fetchColumn();
        if ($count > 0) return;
        $members = [
            ['Nguyễn Hoa Ly',  'Senior Therapist',      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=70&auto=format&fit=crop&crop=face', '8 năm kinh nghiệm', 'Massage Thụy Điển', 'Đá nóng', 0],
            ['Trần Minh Châu', 'Skincare Specialist',   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=70&auto=format&fit=crop&crop=face', '6 năm kinh nghiệm', 'Facial',           'Điều trị da', 1],
            ['Lê Thu Hà',      'Nail Artist',            'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=70&auto=format&fit=crop&crop=face', '5 năm kinh nghiệm', 'Nail Art',         'Gel', 2],
            ['Phạm Quỳnh Anh', 'Spa Manager',            'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&q=70&auto=format&fit=crop&crop=face', '10 năm kinh nghiệm','Quản lý',          'Body Treatment', 3],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO team_members (name, role, image, experience, specialty1, specialty2, sort_order) VALUES (?,?,?,?,?,?,?)");
        foreach ($members as $m) $stmt->execute($m);
    }
}
