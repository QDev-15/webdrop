<?php
declare(strict_types=1);

class Database
{
    private static ?Database $instance = null;
    public readonly \PDO $pdo;

    private function __construct()
    {
        $dbFile = DB_FILE;
        $dbDir  = dirname($dbFile);
        if (!is_dir($dbDir)) {
            mkdir($dbDir, 0755, true);
        }
        $needSeed = !file_exists($dbFile);
        $this->pdo = new \PDO('sqlite:' . $dbFile);
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->pdo->exec('PRAGMA journal_mode = WAL');
        if ($needSeed) {
            $this->migrate();
        }
    }

    public static function getInstance(): static
    {
        if (self::$instance === null) {
            self::$instance = new static();
        }
        return self::$instance;
    }

    public function query(string $sql, array $params = []): array
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): array|false
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetch();
    }

    public function execute(string $sql, array $params = []): \PDOStatement
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    public function lastInsertId(): string
    {
        return $this->pdo->lastInsertId();
    }

    // ─── MIGRATION ────────────────────────────────────────────────────────────

    private function migrate(): void
    {
        $sqlFile = __DIR__ . '/../schema.sql';
        $sql = file_get_contents($sqlFile);
        if ($sql === false) {
            throw new \RuntimeException('Cannot read schema.sql');
        }
        // Strip comments TRUOC khi split
        $sql = preg_replace('/^\s*--.*$/m', '', $sql);
        $statements = array_filter(array_map('trim', explode(';', $sql)), fn($s) => $s !== '');
        foreach ($statements as $stmt) {
            $this->pdo->exec($stmt . ';');
        }
        $this->seedData();
    }

    // ─── SEED ─────────────────────────────────────────────────────────────────

    private function seedData(): void
    {
        $this->seedUsers();
        $this->seedSettings();
        $this->seedHeroSlides();
        $this->seedServiceCategories();
        $this->seedServices();
        $this->seedTestimonials();
        $this->seedTeamMembers();
    }

    private function seedUsers(): void
    {
        $count = $this->pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
        if ($count > 0) return;
        $hash = password_hash('123456', PASSWORD_DEFAULT);
        $stmt = $this->pdo->prepare(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
        );
        $stmt->execute(['Admin', 'sysadmin@admin.com', $hash, 'superadmin']);
    }

    private function seedSettings(): void
    {
        $count = $this->pdo->query("SELECT COUNT(*) FROM settings")->fetchColumn();
        if ($count > 0) return;

        $settings = [
            // general
            ['site_name',        'SmileTech — Nha Khoa Công Nghệ Cao',                           'general'],
            ['site_tagline',     'Nụ cười hoàn hảo, được AI đồng hành từng bước',                'general'],
            ['site_email',       'hello@smiletech.vn',                                             'general'],
            ['site_phone',       '028 1234 5678',                                                  'general'],
            ['site_address',     '123 Đường Công Nghệ, Quận 1, TP.HCM',                           'general'],
            ['working_hours',    'Thứ 2 – Chủ nhật: 8:00 – 20:00 (kể cả ngày lễ)',               'general'],
            ['map_embed',        'https://www.google.com/maps?q=Ho+Chi+Minh+City&output=embed',    'general'],
            // seo
            ['meta_title',       'SmileTech — Nha Khoa Công Nghệ Cao | AI Chẩn Đoán & Số Hóa',  'seo'],
            ['meta_description', 'SmileTech ứng dụng AI chẩn đoán, scan 3D không đau, hồ sơ số bảo mật. Đặt lịch online 24/7.', 'seo'],
            ['meta_keywords',    'nha khoa công nghệ cao, AI chẩn đoán, invisalign, implant, scan 3D', 'seo'],
            // social
            ['facebook',         'https://facebook.com/[TRANG_FACEBOOK]',   'social'],
            ['instagram',        'https://instagram.com/[TRANG_INSTAGRAM]', 'social'],
            ['zalo',             'https://zalo.me/[SO_ZALO]',               'social'],
            ['youtube',          '',                                          'social'],
            ['tiktok',           '',                                          'social'],
            // footer
            ['footer_desc',      'Nha khoa công nghệ cao — ứng dụng AI chẩn đoán, scan 3D và số hóa toàn diện hành trình điều trị của bạn.', 'footer'],
            ['footer_copyright', '© 2026 SmileTech Dental. All rights reserved.',                 'footer'],
            // contact
            ['zalo_url',         'https://zalo.me/',                         'contact'],
            // smtp
            ['smtp_host',        'smtp.gmail.com',  'smtp'],
            ['smtp_port',        '587',             'smtp'],
            ['smtp_user',        '',                'smtp'],
            ['smtp_pass',        '',                'smtp'],
            // about (hero section info)
            ['hero_eyebrow',     'Nha khoa số hóa thế hệ mới',                                  'about'],
            ['hero_heading',     'Nụ cười hoàn hảo, được AI đồng hành từng bước',               'about'],
            ['hero_sub',         'SmileTech ứng dụng trí tuệ nhân tạo trong chẩn đoán, scan 3D không đau và quản lý hồ sơ số toàn diện — mang đến trải nghiệm nha khoa chính xác, minh bạch và hiện đại bậc nhất.', 'about'],
            ['stat_patients',    '12.500',          'about'],
            ['stat_accuracy',    '99.2%',           'about'],
            ['stat_years',       '8+',              'about'],
            ['stat_tech',        '15+',             'about'],
            // system
            ['maintenance_mode', '0',               'system'],
            ['app_env',          'production',      'system'],
            // cloudinary
            ['cloudinary_cloud_name', '',           'cloudinary'],
            ['cloudinary_api_key',    '',           'cloudinary'],
            ['cloudinary_api_secret', '',           'cloudinary'],
            // integrations
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO settings (key, value, group_name) VALUES (?, ?, ?)"
        );
        foreach ($settings as [$key, $value, $group]) {
            $stmt->execute([$key, $value, $group]);
        }
    }

    private function seedHeroSlides(): void
    {
        $count = $this->pdo->query("SELECT COUNT(*) FROM hero_slides")->fetchColumn();
        if ($count > 0) return;

        $slides = [
            [
                'title'     => 'Nụ cười hoàn hảo, được AI đồng hành từng bước',
                'subtitle'  => 'SmileTech ứng dụng trí tuệ nhân tạo trong chẩn đoán, scan 3D không đau và quản lý hồ sơ số toàn diện.',
                'image'     => 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1400&q=80&auto=format&fit=crop',
                'btn_text'  => 'Đặt lịch khám ngay',
                'btn_url'   => '/dat-lich',
                'sort_order' => 1,
            ],
            [
                'title'     => 'Scan 3D không đau — kết quả tức thì',
                'subtitle'  => 'Thay thế lấy dấu răng truyền thống bằng máy scan intraoral 3D, hiển thị mô hình ngay trên màn hình.',
                'image'     => 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1400&q=80&auto=format&fit=crop',
                'btn_text'  => 'Khám phá công nghệ',
                'btn_url'   => '/cong-nghe',
                'sort_order' => 2,
            ],
            [
                'title'     => 'Răng sứ CAD/CAM — hoàn thiện trong ngày',
                'subtitle'  => 'Thiết kế và phay răng sứ tại chỗ bằng công nghệ CAD/CAM, không cần lấy dấu, không hẹn nhiều lần.',
                'image'     => 'https://images.unsplash.com/photo-1516069677018-378515003435?w=1400&q=80&auto=format&fit=crop',
                'btn_text'  => 'Xem dịch vụ',
                'btn_url'   => '/dich-vu',
                'sort_order' => 3,
            ],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO hero_slides (title, subtitle, image, btn_text, btn_url, sort_order, is_active)
             VALUES (:title, :subtitle, :image, :btn_text, :btn_url, :sort_order, 1)"
        );
        foreach ($slides as $s) {
            $stmt->execute($s);
        }
    }

    private function seedServiceCategories(): void
    {
        $count = $this->pdo->query("SELECT COUNT(*) FROM service_categories")->fetchColumn();
        if ($count > 0) return;

        $categories = [
            ['name' => 'Chỉnh nha',  'slug' => 'chinh-nha',  'sort_order' => 1],
            ['name' => 'Cấy ghép',   'slug' => 'cay-ghep',   'sort_order' => 2],
            ['name' => 'Phục hình',  'slug' => 'phuc-hinh',  'sort_order' => 3],
            ['name' => 'Điều trị',   'slug' => 'dieu-tri',   'sort_order' => 4],
            ['name' => 'Chẩn đoán',  'slug' => 'chan-doan',  'sort_order' => 5],
            ['name' => 'Thẩm mỹ',   'slug' => 'tham-my',    'sort_order' => 6],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO service_categories (name, slug, sort_order) VALUES (:name, :slug, :sort_order)"
        );
        foreach ($categories as $c) {
            $stmt->execute($c);
        }
    }

    private function seedServices(): void
    {
        $count = $this->pdo->query("SELECT COUNT(*) FROM services")->fetchColumn();
        if ($count > 0) return;

        $services = [
            [
                'category_id' => 1,
                'name'        => 'Invisalign AI',
                'tag'         => 'Chỉnh nha',
                'description' => 'Phần mềm AI mô phỏng lộ trình di chuyển răng, dự đoán kết quả cuối cùng trước khi bắt đầu điều trị. Khay trong suốt, tháo lắp dễ dàng.',
                'image'       => 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=75&auto=format&fit=crop',
                'price'       => 'Từ 35.000.000đ',
                'sort_order'  => 1,
            ],
            [
                'category_id' => 2,
                'name'        => 'Implant định vị AI',
                'tag'         => 'Cấy ghép',
                'description' => 'Phần mềm định vị 3D dẫn hướng phẫu thuật, giảm sai số đến 0.1mm, rút ngắn thời gian hồi phục và tỷ lệ thành công cao.',
                'image'       => 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=75&auto=format&fit=crop',
                'price'       => 'Từ 18.000.000đ',
                'sort_order'  => 2,
            ],
            [
                'category_id' => 3,
                'name'        => 'Răng sứ CAD/CAM',
                'tag'         => 'Phục hình',
                'description' => 'Thiết kế và phay răng sứ ngay tại phòng khám bằng công nghệ CAD/CAM, hoàn thiện chỉ trong một buổi hẹn, không cần đợi xưởng.',
                'image'       => 'https://images.unsplash.com/photo-1516069677018-378515003435?w=600&q=75&auto=format&fit=crop',
                'price'       => 'Từ 4.500.000đ/răng',
                'sort_order'  => 3,
            ],
            [
                'category_id' => 4,
                'name'        => 'Trám răng Laser',
                'tag'         => 'Điều trị',
                'description' => 'Loại bỏ mô răng sâu bằng laser diode, không tiếng ồn, không rung, hạn chế ê buốt. Hồi phục nhanh hơn phương pháp truyền thống.',
                'image'       => 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=75&auto=format&fit=crop',
                'price'       => 'Từ 800.000đ/răng',
                'sort_order'  => 4,
            ],
            [
                'category_id' => 5,
                'name'        => 'Chụp CT Cone Beam 3D',
                'tag'         => 'Chẩn đoán',
                'description' => 'Dựng hình 3D toàn bộ cấu trúc hàm mặt, hỗ trợ chẩn đoán và lên kế hoạch điều trị chính xác. Liều tia thấp, an toàn cho bệnh nhân.',
                'image'       => 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=75&auto=format&fit=crop',
                'price'       => 'Từ 500.000đ',
                'sort_order'  => 5,
            ],
            [
                'category_id' => 6,
                'name'        => 'Tẩy trắng răng Plasma',
                'tag'         => 'Thẩm mỹ',
                'description' => 'Công nghệ ánh sáng lạnh Plasma kích hoạt gel tẩy trắng chuyên dụng, cho hiệu quả rõ rệt sau 45 phút, không ê buốt.',
                'image'       => 'https://images.unsplash.com/photo-1571772805064-207c8435df79?w=600&q=75&auto=format&fit=crop',
                'price'       => 'Từ 2.200.000đ',
                'sort_order'  => 6,
            ],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO services (category_id, name, tag, description, image, price, sort_order, is_active)
             VALUES (:category_id, :name, :tag, :description, :image, :price, :sort_order, 1)"
        );
        foreach ($services as $s) {
            $stmt->execute($s);
        }
    }

    private function seedTestimonials(): void
    {
        $count = $this->pdo->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
        if ($count > 0) return;

        $testimonials = [
            [
                'author_name'   => 'Nguyễn Thị Hoàng',
                'author_title'  => 'Niềng răng Invisalign AI',
                'author_avatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=70&auto=format&fit=crop',
                'content'       => 'Lần đầu tiên thấy hình ảnh scan răng của mình ngay trên màn hình, bác sĩ giải thích rõ ràng từng bước. Cảm giác rất yên tâm và tin tưởng vào phác đồ điều trị.',
                'rating'        => 5,
                'sort_order'    => 1,
            ],
            [
                'author_name'   => 'Trần Văn Khải',
                'author_title'  => 'Cấy ghép Implant định vị AI',
                'author_avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=70&auto=format&fit=crop',
                'content'       => 'Đặt lịch online cực nhanh, đúng giờ hẹn, không phải chờ đợi. Đội ngũ tư vấn qua ứng dụng rất chuyên nghiệp. Ca Implant không đau như tôi lo ngại.',
                'rating'        => 5,
                'sort_order'    => 2,
            ],
            [
                'author_name'   => 'Lê Thị Mai',
                'author_title'  => 'Răng sứ CAD/CAM',
                'author_avatar' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=70&auto=format&fit=crop',
                'content'       => 'Bọc răng sứ chỉ trong 1 buổi nhờ công nghệ CAD/CAM, không cần đợi làm ở xưởng như trước. Răng đẹp tự nhiên, khớp cắn hoàn hảo. Quá tiện lợi!',
                'rating'        => 5,
                'sort_order'    => 3,
            ],
            [
                'author_name'   => 'Phạm Đức Hùng',
                'author_title'  => 'Tẩy trắng răng Plasma',
                'author_avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=70&auto=format&fit=crop',
                'content'       => 'Chỉ 45 phút tẩy trắng với công nghệ Plasma, không ê buốt chút nào. Răng trắng hơn hẳn so với trước, rất hài lòng với kết quả. Sẽ giới thiệu cho bạn bè.',
                'rating'        => 5,
                'sort_order'    => 4,
            ],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order, is_active)
             VALUES (:author_name, :author_title, :author_avatar, :content, :rating, :sort_order, 1)"
        );
        foreach ($testimonials as $t) {
            $stmt->execute($t);
        }
    }

    private function seedTeamMembers(): void
    {
        $count = $this->pdo->query("SELECT COUNT(*) FROM team_members")->fetchColumn();
        if ($count > 0) return;

        $members = [
            [
                'name'       => 'BS. Nguyễn Minh Đức',
                'role'       => 'Chuyên khoa Implant & AI định vị',
                'bio'        => '12 năm kinh nghiệm, chứng chỉ quốc tế về cấy ghép Implant định vị bằng phần mềm AI.',
                'photo'      => 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=75&auto=format&fit=crop',
                'sort_order' => 1,
            ],
            [
                'name'       => 'BS. Trần Thị Lan Anh',
                'role'       => 'Chuyên khoa Chỉnh nha kỹ thuật số',
                'bio'        => 'Chứng nhận Invisalign Provider, chuyên sâu mô phỏng phác đồ niềng răng bằng AI.',
                'photo'      => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=75&auto=format&fit=crop',
                'sort_order' => 2,
            ],
            [
                'name'       => 'BS. Phạm Quốc Bảo',
                'role'       => 'Chuyên khoa Phục hình CAD/CAM',
                'bio'        => 'Chuyên gia thiết kế và phay răng sứ kỹ thuật số, hoàn thiện phục hình trong ngày.',
                'photo'      => 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=75&auto=format&fit=crop',
                'sort_order' => 3,
            ],
            [
                'name'       => 'BS. Đỗ Hoàng Yến',
                'role'       => 'Chuyên khoa Chẩn đoán hình ảnh AI',
                'bio'        => 'Phụ trách vận hành hệ thống AI Diagnostic Scan và đọc kết quả CT Cone Beam 3D.',
                'photo'      => 'https://images.unsplash.com/photo-1642844613096-31f1a1d5b3c7?w=500&q=75&auto=format&fit=crop',
                'sort_order' => 4,
            ],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO team_members (name, role, bio, photo, sort_order, is_active)
             VALUES (:name, :role, :bio, :photo, :sort_order, 1)"
        );
        foreach ($members as $m) {
            $stmt->execute($m);
        }
    }
}
