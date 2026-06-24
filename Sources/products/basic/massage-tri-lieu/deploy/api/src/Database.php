<?php
declare(strict_types=1);

class Database {
    private static ?Database $instance = null;
    public readonly PDO $pdo;

    private function __construct() {
        if (DB_TYPE === 'sqlite') {
            $dir = dirname(DB_FILE);
            if (!is_dir($dir)) { @mkdir($dir, 0755, true); }
            $this->pdo = new PDO('sqlite:' . DB_FILE, null, null, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            $this->pdo->exec('PRAGMA foreign_keys = ON');
            $this->pdo->exec('PRAGMA journal_mode = WAL');
        } else {
            $dsn = DB_TYPE . ':host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        }
        $this->migrate();
    }

    public static function getInstance(): static {
        if (!self::$instance) self::$instance = new static();
        return self::$instance;
    }

    private function migrate(): void {
        $sqlFile = __DIR__ . '/../schema.sql';
        $sql = file_get_contents($sqlFile);
        if ($sql === false) {
            throw new \RuntimeException('Cannot read schema.sql — file missing or not readable');
        }
        // Strip comments TRUOC khi split de tranh filter loai bo CREATE TABLE sau comment block
        $sql = preg_replace('/^\s*--.*$/m', '', $sql);
        $statements = array_filter(array_map('trim', explode(';', $sql)), fn($s) => $s !== '');
        foreach ($statements as $stmt) {
            $this->pdo->exec($stmt . ';');
        }
        $this->seedData();
    }

    private function seedData(): void {
        $this->seedUsers();
        $this->seedSettings();
        $this->seedHeroSlides();
        $this->seedServiceCategories();
        $this->seedServices();
        $this->seedServicePackages();
        $this->seedTherapists();
        $this->seedTestimonials();
    }

    private function seedUsers(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
        if ($count > 0) return;
        $hash = password_hash('123456', PASSWORD_BCRYPT);
        $this->pdo->prepare(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
        )->execute(['Quản trị viên', 'sysadmin@admin.com', $hash, 'superadmin']);
    }

    private function seedSettings(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM settings")->fetchColumn();
        if ($count > 0) return;
        $settings = [
            ['site_name',        'Tâm Thư Massage',                    'general'],
            ['site_email',       'info@tamthumassage.vn',              'general'],
            ['site_phone',       '0901 234 567',                       'general'],
            ['site_address',     '123 Nguyễn Trãi, Phường 2, Quận 5, TP.HCM', 'general'],
            ['working_hours',    'T2-T6: 9:00-21:00 | T7-CN: 8:00-22:00', 'general'],
            ['zalo_number',      '0901234567',                         'general'],
            ['logo_url',         '',                                   'general'],
            ['meta_title',       'Tâm Thư Massage - Trị Liệu Chuyên Nghiệp TP.HCM', 'seo'],
            ['meta_description', 'Trung tâm massage trị liệu Tâm Thư - Massage Thái, Đá Nóng, Bấm Huyệt. Đội ngũ 12 chuyên viên, 8 năm kinh nghiệm.', 'seo'],
            ['meta_keywords',    'massage trị liệu, massage thái, đá nóng, bấm huyệt, spa TPHCM', 'seo'],
            ['facebook',         'https://facebook.com/tamthumassage', 'social'],
            ['instagram',        '',                                   'social'],
            ['youtube',          '',                                   'social'],
            ['tiktok',           '',                                   'social'],
            ['zalo',             'https://zalo.me/0901234567',         'social'],
            ['footer_desc',      'Trung tâm massage trị liệu chuyên nghiệp - nơi cơ thể và tâm trí được phục hồi toàn diện.', 'footer'],
            ['footer_copy',      '2025 Tâm Thư Massage. Bảo lưu mọi quyền.',  'footer'],
            ['map_embed',        '',                                   'contact'],
            ['phone2',           '',                                   'contact'],
            ['hours_weekday',    '9:00 - 21:00',                      'contact'],
            ['hours_weekend',    '8:00 - 22:00',                      'contact'],
            ['hours_holiday',    '9:00 - 20:00',                      'contact'],
            ['smtp_host',        'smtp.gmail.com',                    'smtp'],
            ['smtp_port',        '587',                               'smtp'],
            ['smtp_user',        '',                                   'smtp'],
            ['smtp_pass',        '',                                   'smtp'],
            ['smtp_from_name',   'Tâm Thư Massage',                   'smtp'],
            ['smtp_from_email',  '',                                   'smtp'],
            ['maintenance_mode', '0',                                  'system'],
            ['items_per_page',   '20',                                 'system'],
            ['about_title',      'Hành trình trải nghiệm của bạn',    'about'],
            ['about_desc',       'Mỗi buổi trị liệu được thiết kế cẩn thận từ bước đón tiếp đến khi bạn rời đi.', 'about'],
            ['stat_clients',     '1200',                               'about'],
            ['stat_years',       '8',                                  'about'],
            ['stat_therapists',  '12',                                 'about'],
            ['stat_return_rate', '98',                                 'about'],
            ['booking_confirm_time', '30',                            'booking'],
            ['booking_cancel_policy', 'Hủy miễn phí trước 4 tiếng. Đổi lịch không giới hạn, báo trước ít nhất 2 tiếng.', 'booking'],
            ['cloudinary_cloud_name', '',                              'cloudinary'],
            ['cloudinary_api_key',    '',                              'cloudinary'],
            ['cloudinary_api_secret', '',                              'cloudinary'],
            ['cloudinary_upload_preset', '',                           'cloudinary'],
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
            ['google_analytics',    '',                               'integrations'],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT OR IGNORE INTO settings (key, value, \"group\") VALUES (?, ?, ?)"
        );
        foreach ($settings as $s) {
            $stmt->execute($s);
        }
    }

    private function seedHeroSlides(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM hero_slides")->fetchColumn();
        if ($count > 0) return;
        $slides = [
            [
                'title'      => 'Phục hồi cơ thể — Tĩnh tâm trí não.',
                'subtitle'   => 'Trung tâm massage trị liệu',
                'description'=> 'Chúng tôi mang đến liệu trình massage trị liệu chuyên sâu - kết hợp kỹ thuật Thái, đá nóng và bấm huyệt truyền thống để phục hồi thể chất và tinh thần toàn diện.',
                'image'      => 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1000&q=75&auto=format&fit=crop',
                'cta_text'   => 'Đặt lịch trải nghiệm',
                'cta_url'    => '/dat-lich',
                'sort_order' => 0,
                'active'     => 1,
            ],
            [
                'title'      => 'Massage Đá Nóng — Thư Giãn Sâu Tận Gốc',
                'subtitle'   => 'Liệu trình nổi bật',
                'description'=> 'Đá bazan tự nhiên làm nóng đến 50-55 độ C đặt lên các huyệt đạo chính - nhiệt năng thấm sâu giải phóng cơ bắp căng cứng, cải thiện giấc ngủ.',
                'image'      => 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1000&q=75&auto=format&fit=crop',
                'cta_text'   => 'Xem dịch vụ & giá',
                'cta_url'    => '/dich-vu',
                'sort_order' => 1,
                'active'     => 1,
            ],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO hero_slides (title, subtitle, description, image, cta_text, cta_url, sort_order, active)
             VALUES (:title, :subtitle, :description, :image, :cta_text, :cta_url, :sort_order, :active)"
        );
        foreach ($slides as $s) { $stmt->execute($s); }
    }

    private function seedServiceCategories(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM service_categories")->fetchColumn();
        if ($count > 0) return;
        $cats = [
            ['name' => 'Massage toàn thân',    'slug' => 'massage-toan-than',   'description' => 'Phù hợp cho mọi đối tượng',            'sort_order' => 0],
            ['name' => 'Massage đá nóng',      'slug' => 'massage-da-nong',     'description' => 'Đá bazan tự nhiên, kiểm soát nhiệt độ', 'sort_order' => 1],
            ['name' => 'Bấm huyệt trị liệu',   'slug' => 'bam-huyet-tri-lieu',  'description' => 'Y học cổ truyền, không xâm lấn',        'sort_order' => 2],
            ['name' => 'Massage mặt & đầu',    'slug' => 'massage-mat-dau',     'description' => 'Kết hợp ấn huyệt & dưỡng da',           'sort_order' => 3],
            ['name' => 'Massage lưng vai gáy', 'slug' => 'massage-lung-vai-gay','description' => 'Phù hợp cho dân văn phòng',             'sort_order' => 4],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO service_categories (name, slug, description, sort_order, active) VALUES (:name, :slug, :description, :sort_order, 1)"
        );
        foreach ($cats as $c) { $stmt->execute($c); }
    }

    private function seedServices(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM services")->fetchColumn();
        if ($count > 0) return;
        $services = [
            [
                'category_id' => 1,
                'name'        => 'Massage Thái Cổ Truyền',
                'tag'         => 'Truyền thống',
                'description' => 'Kỹ thuật massage toàn thân kết hợp căng giãn cơ theo phong cách Thái Lan - giải phóng năng lượng tắc nghẽn, tăng độ linh hoạt cơ thể.',
                'image'       => 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=75&auto=format&fit=crop',
                'price_from'  => 350000,
                'duration'    => '60 - 120 phút',
                'sort_order'  => 0,
                'featured'    => 1,
            ],
            [
                'category_id' => 2,
                'name'        => 'Massage Đá Nóng',
                'tag'         => 'Nổi bật',
                'description' => 'Đá bazan tự nhiên được làm nóng đặt lên các điểm huyệt đạo chính - nhiệt năng thấm sâu vào cơ bắp, tan biến mọi căng thẳng.',
                'image'       => 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=75&auto=format&fit=crop',
                'price_from'  => 450000,
                'duration'    => '90 - 120 phút',
                'sort_order'  => 1,
                'featured'    => 1,
            ],
            [
                'category_id' => 3,
                'name'        => 'Bấm Huyệt Trị Liệu',
                'tag'         => 'Trị liệu',
                'description' => 'Kỹ thuật bấm huyệt theo y học cổ truyền - tác động vào các huyệt vị để cân bằng khí huyết, giảm đau nhức và tăng cường miễn dịch.',
                'image'       => 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=75&auto=format&fit=crop',
                'price_from'  => 300000,
                'duration'    => '60 - 90 phút',
                'sort_order'  => 2,
                'featured'    => 1,
            ],
            [
                'category_id' => 4,
                'name'        => 'Massage Mặt & Đầu',
                'tag'         => 'Làm đẹp',
                'description' => 'Liệu trình massage mặt kết hợp ấn huyệt vùng đầu - kích thích tuần hoàn, giảm căng thẳng và làm sáng da tự nhiên.',
                'image'       => 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=75&auto=format&fit=crop',
                'price_from'  => 250000,
                'duration'    => '45 - 60 phút',
                'sort_order'  => 3,
                'featured'    => 0,
            ],
            [
                'category_id' => 1,
                'name'        => 'Thư Giãn Toàn Thân',
                'tag'         => 'Thư giãn',
                'description' => 'Kết hợp các kỹ thuật xoa bóp nhẹ nhàng và tinh dầu thảo mộc - liệu trình lý tưởng để xả stress sau ngày dài làm việc.',
                'image'       => 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=75&auto=format&fit=crop',
                'price_from'  => 280000,
                'duration'    => '60 - 90 phút',
                'sort_order'  => 4,
                'featured'    => 1,
            ],
            [
                'category_id' => 5,
                'name'        => 'Massage Lưng Vai Gáy',
                'tag'         => 'Chuyên sâu',
                'description' => 'Tập trung vào vùng lưng - vai - gáy, tác động sâu vào cơ bắp căng cứng do ngồi lâu, phù hợp cho dân văn phòng.',
                'image'       => 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=75&auto=format&fit=crop',
                'price_from'  => 200000,
                'duration'    => '30 - 60 phút',
                'sort_order'  => 5,
                'featured'    => 0,
            ],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO services (category_id, name, tag, description, image, price_from, duration, sort_order, featured, active)
             VALUES (:category_id, :name, :tag, :description, :image, :price_from, :duration, :sort_order, :featured, 1)"
        );
        foreach ($services as $s) { $stmt->execute($s); }
    }

    private function seedServicePackages(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM service_packages")->fetchColumn();
        if ($count > 0) return;
        $packages = [
            [
                'name'           => 'Gói Thư Giãn',
                'tagline'        => 'Lý tưởng cho buổi trải nghiệm đầu tiên - thư giãn trọn vẹn trong 90 phút.',
                'price'          => 490000,
                'price_original' => 580000,
                'items'          => "Massage thư giãn toàn thân (60 phút)\nMassage đầu & cổ vai (20 phút)\nTrà thảo mộc & nghỉ ngơi (15 phút)\nKhăn nóng thảo dược",
                'featured'       => 0,
                'sort_order'     => 0,
            ],
            [
                'name'           => 'Gói Trị Liệu Sâu',
                'tagline'        => 'Phục hồi toàn diện - kết hợp bấm huyệt, đá nóng và thư giãn.',
                'price'          => 790000,
                'price_original' => 980000,
                'items'          => "Tư vấn sức khỏe chuyên sâu (15 phút)\nBấm huyệt trị liệu (30 phút)\nMassage đá nóng toàn thân (60 phút)\nMassage mặt & đầu (20 phút)\nTrà & nghỉ ngơi phòng riêng",
                'featured'       => 1,
                'sort_order'     => 1,
            ],
            [
                'name'           => 'Gói VIP Trọn Ngày',
                'tagline'        => 'Trải nghiệm spa trọn vẹn nhất - hoàn hảo cho ngày cuối tuần.',
                'price'          => 1490000,
                'price_original' => 1980000,
                'items'          => "Tư vấn & thiết kế lịch trình cá nhân\nMassage Thái cổ truyền (90 phút)\nĐá nóng & aromatherapy (60 phút)\nChăm sóc da mặt (45 phút)\nBữa nhẹ lành mạnh & thảo mộc\nPhòng nghỉ riêng sau trị liệu",
                'featured'       => 0,
                'sort_order'     => 2,
            ],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO service_packages (name, tagline, price, price_original, items, featured, sort_order, active)
             VALUES (:name, :tagline, :price, :price_original, :items, :featured, :sort_order, 1)"
        );
        foreach ($packages as $p) { $stmt->execute($p); }
    }

    private function seedTherapists(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM therapists")->fetchColumn();
        if ($count > 0) return;
        $therapists = [
            ['name' => 'Nguyễn Thị Lan',  'specialty' => 'Massage Thái & Bấm huyệt',       'experience' => '10 năm kinh nghiệm', 'image' => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80&auto=format&fit=crop', 'sort_order' => 0],
            ['name' => 'Trần Minh Tuấn',  'specialty' => 'Massage đá nóng & Aromatherapy', 'experience' => '8 năm kinh nghiệm',  'image' => 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=200&q=80&auto=format&fit=crop', 'sort_order' => 1],
            ['name' => 'Lê Thị Hoa',     'specialty' => 'Trị liệu phục hồi & Thể thao',   'experience' => '6 năm kinh nghiệm',  'image' => 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&q=80&auto=format&fit=crop', 'sort_order' => 2],
            ['name' => 'Phạm Văn Đức',   'specialty' => 'Massage mặt & Dưỡng da',          'experience' => '5 năm kinh nghiệm',  'image' => 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&q=80&auto=format&fit=crop', 'sort_order' => 3],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO therapists (name, specialty, experience, image, sort_order, active)
             VALUES (:name, :specialty, :experience, :image, :sort_order, 1)"
        );
        foreach ($therapists as $t) { $stmt->execute($t); }
    }

    private function seedTestimonials(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
        if ($count > 0) return;
        $testimonials = [
            [
                'author_name'   => 'Nguyễn Văn Thành',
                'author_info'   => 'Kỹ sư phần mềm, TP.HCM',
                'author_avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=72&q=80&auto=format&fit=crop',
                'content'       => 'Tôi bị đau lưng kinh niên suốt 3 năm - sau 4 buổi bấm huyệt tại đây, cơn đau giảm hẳn 70%. Chuyên viên rất am hiểu và tận tâm, không tạo áp lực mua thêm dịch vụ.',
                'rating'        => 5,
                'sort_order'    => 0,
            ],
            [
                'author_name'   => 'Trần Thị Mai Anh',
                'author_info'   => 'Giám đốc marketing, Hà Nội',
                'author_avatar' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=72&q=80&auto=format&fit=crop',
                'content'       => 'Gói VIP Trọn Ngày xứng đáng từng đồng. Không gian phòng trị liệu cực kỳ sạch sẽ và riêng tư. Sau buổi đá nóng, tôi ngủ ngon nhất trong nhiều tháng qua.',
                'rating'        => 5,
                'sort_order'    => 1,
            ],
            [
                'author_name'   => 'Lê Quốc Bảo',
                'author_info'   => 'Vận động viên, TP.HCM',
                'author_avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=72&q=80&auto=format&fit=crop',
                'content'       => 'Đặt lịch online rất tiện, tới nơi không phải chờ. Massage Thái ở đây chuẩn kỹ thuật hơn nhiều chỗ khác. Đã là khách thường xuyên được 2 năm rồi.',
                'rating'        => 5,
                'sort_order'    => 2,
            ],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO testimonials (author_name, author_info, author_avatar, content, rating, sort_order, active)
             VALUES (:author_name, :author_info, :author_avatar, :content, :rating, :sort_order, 1)"
        );
        foreach ($testimonials as $t) { $stmt->execute($t); }
    }

    public function query(string $sql, array $params = []): array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function execute(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (int)$this->pdo->lastInsertId();
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $rows = $this->query($sql, $params);
        return $rows[0] ?? null;
    }
}
