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

    // ── Schema migration ───────────────────────────────────────────────────

    private function migrate(): void {
        $sqlFile = __DIR__ . '/../schema.sql';
        $sql = file_get_contents($sqlFile);
        if ($sql === false) {
            throw new \RuntimeException('Cannot read schema.sql');
        }
        // Strip comments TRƯỚC khi split — tránh lọc nhầm CREATE TABLE sau comment
        $sql = preg_replace('/^\s*--.*$/m', '', $sql);
        $statements = array_filter(array_map('trim', explode(';', $sql)), fn($s) => $s !== '');
        foreach ($statements as $stmt) {
            $this->pdo->exec($stmt . ';');
        }
        $this->seedData();
    }

    // ── Seed data ─────────────────────────────────────────────────────────

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
            ['site_name',       'NAIL Studio',                                                  'general'],
            ['site_tagline',    'Nail Salon Chuyên Nghiệp',                                     'general'],
            ['site_phone',      '0901 234 567',                                                  'general'],
            ['site_email',      'nailstudio@gmail.com',                                         'general'],
            ['site_address',    '123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM',                   'general'],
            ['working_hours',   'Thứ 2 – CN: 8:00 – 20:00 (CN: 8:00 – 21:00)',                 'general'],
            // seo
            ['meta_title',      'NAIL Studio — Nail Salon Chuyên Nghiệp TP.HCM',               'seo'],
            ['meta_description','Tiệm nail chuyên nghiệp tại TP.HCM. Nail gel, nail art, pedicure, acrylic. Đặt lịch ngay hôm nay.', 'seo'],
            ['meta_keywords',   'nail salon, tiệm nail, nail gel, nail art, pedicure, TP.HCM', 'seo'],
            // social
            ['facebook',        'https://facebook.com/nailstudio',  'social'],
            ['instagram',       'https://instagram.com/nailstudio', 'social'],
            ['tiktok',          'https://tiktok.com/@nailstudio',   'social'],
            ['zalo_number',     '0901234567',                        'social'],
            // hero
            ['hero_badge',      'Nail Salon Chuyên Nghiệp',          'hero'],
            ['hero_title1',     'Đôi tay',                           'hero'],
            ['hero_title2',     'hoàn hảo,',                         'hero'],
            ['hero_title3',     'phong cách riêng.',                 'hero'],
            ['hero_sub',        'Chúng tôi mang đến trải nghiệm làm nail đẳng cấp — từ nail gel cơ bản đến nail art tinh tế, mỗi bộ móng là một tác phẩm nghệ thuật.', 'hero'],
            ['hero_cta_primary','Đặt lịch ngay',                     'hero'],
            ['hero_cta_secondary','Xem bảng giá',                    'hero'],
            // stats
            ['stat_customers',  '1.200+',    'stats'],
            ['stat_years',      '8',         'stats'],
            ['stat_patterns',   '50+',       'stats'],
            ['stat_rating',     '4.9★',     'stats'],
            // about
            ['about_title',     'Trải nghiệm làm nail khác biệt hoàn toàn',    'about'],
            ['about_sub',       'Không chỉ là làm nail — chúng tôi mang đến không gian thư giãn, sản phẩm an toàn và kết quả hoàn hảo mà bạn xứng đáng được hưởng.', 'about'],
            ['feature1_icon',   '💅',                                            'about'],
            ['feature1_title',  'Thợ lành nghề',                                'about'],
            ['feature1_desc',   'Đào tạo chuyên sâu, 5+ năm kinh nghiệm',      'about'],
            ['feature2_icon',   '✨',                                            'about'],
            ['feature2_title',  'Sản phẩm cao cấp',                             'about'],
            ['feature2_desc',   'Gel OPI, Shellac nhập khẩu, an toàn',          'about'],
            ['feature3_icon',   '🧼',                                            'about'],
            ['feature3_title',  'Vệ sinh chuẩn',                                'about'],
            ['feature3_desc',   'Dụng cụ khử khuẩn sau mỗi khách',             'about'],
            ['feature4_icon',   '📱',                                            'about'],
            ['feature4_title',  'Đặt lịch dễ dàng',                             'about'],
            ['feature4_desc',   'Online hoặc qua Zalo, không cần chờ lâu',      'about'],
            // contact
            ['map_embed',       'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4506968732424!2d106.70226231533419!3d10.776889692320065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc7%3A0x4db964d76bf2d292!2sDistric%201%2C%20Ho%20Chi%20Minh%20City!5e0!3m2!1sen!2svn!4v1234567890', 'contact'],
            ['payment_methods', 'Tiền mặt, chuyển khoản, Momo, ZaloPay', 'contact'],
            // footer
            ['footer_desc',     'Tiệm nail chuyên nghiệp — nơi mỗi bộ móng là một tác phẩm nghệ thuật dành riêng cho bạn.', 'footer'],
            ['footer_copyright','© 2025 NAIL Studio. All rights reserved.',     'footer'],
            // smtp
            ['smtp_host',       'smtp.gmail.com', 'smtp'],
            ['smtp_port',       '587',             'smtp'],
            ['smtp_user',       '',                'smtp'],
            ['smtp_pass',       '',                'smtp'],
            ['smtp_from_name',  'NAIL Studio',     'smtp'],
            ['smtp_from_email', '',                'smtp'],
            // system
            ['maintenance_mode','0', 'system'],
            // cloudinary
            ['cloud_name',  '', 'cloudinary'],
            ['cloud_api_key','', 'cloudinary'],
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
            ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=70&auto=format&fit=crop', 'Nail art đẹp', 0],
            ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=60&auto=format&fit=crop&crop=top', 'Nail gel', 1],
            ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=60&auto=format&fit=crop&crop=bottom', 'Nail dưỡng', 2],
            ['https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=400&q=60&auto=format&fit=crop', 'Không gian tiệm', 3],
            ['https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&q=60&auto=format&fit=crop', 'Pedicure', 4],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO hero_slides (image, alt, sort_order) VALUES (?, ?, ?)");
        foreach ($slides as $s) $stmt->execute($s);
    }

    private function seedServiceCategories(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM service_categories")->fetchColumn();
        if ($count > 0) return;
        $cats = [
            ['Nail Tay',           '💅', 0],
            ['Nail Chân & Pedicure','🦶', 1],
            ['Nail Art',           '🎨', 2],
            ['Acrylic & Đắp bột',  '🔮', 3],
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
        $c1 = $catIds['Nail Tay']            ?? 1;
        $c2 = $catIds['Nail Chân & Pedicure'] ?? 2;
        $c3 = $catIds['Nail Art']             ?? 3;
        $c4 = $catIds['Acrylic & Đắp bột']   ?? 4;

        $services = [
            [$c1, 'Nail Gel',           'Phổ biến',  'Gel trong bền màu, không bong tróc, giữ được 3–4 tuần. Đa dạng màu sắc và họa tiết.',            'Từ 150.000đ', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=65&auto=format&fit=crop', 1, 0],
            [$c1, 'Nail Art',           'Nổi bật',   'Họa tiết thủ công tinh tế — từ hoa lá đơn giản đến thiết kế 3D độc đáo theo yêu cầu.',             'Từ 200.000đ', 'https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=600&q=65&auto=format&fit=crop', 1, 1],
            [$c2, 'Pedicure',           'Thư giãn',  'Chăm sóc móng chân toàn diện — ngâm chân thảo dược, tẩy da chết, dưỡng ẩm sâu.',                  'Từ 180.000đ', 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&q=65&auto=format&fit=crop', 1, 2],
            [$c1, 'Nail Dưỡng & Repair','Chăm sóc', 'Phục hồi móng yếu, bong tróc. Dưỡng móng chuyên sâu giúp móng chắc khỏe tự nhiên.',               'Từ 120.000đ', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=65&auto=format&fit=crop&crop=entropy', 0, 3],
            [$c1, 'Manicure cơ bản',    '',          'Ngâm tay, tẩy da, cắt dũa, dưỡng, sơn.',                                                           '120.000đ',    '', 0, 4],
            [$c1, 'Nail Gel Ombre',     '',          '2 màu chuyển tiếp mượt mà.',                                                                         '180.000đ',    '', 0, 5],
            [$c1, 'Nail Gel Cat Eye',   '',          'Hiệu ứng mắt mèo huyền bí.',                                                                         '200.000đ',    '', 0, 6],
            [$c2, 'Pedicure nâng cao',  '',          'Tẩy chai, massage bàn chân 20 phút.',                                                                '250.000đ',    '', 0, 7],
            [$c2, 'Pedicure thảo dược', '',          'Ngâm thảo dược, tinh dầu, dưỡng sâu.',                                                              '320.000đ',    '', 0, 8],
            [$c3, 'Nail Art cả bộ 10 ngón','Hot',   'Thiết kế đồng bộ cả 2 tay.',                                                                         '200–350.000đ','', 0, 9],
            [$c3, 'Bridal Nail cưới',   '',          'Thiết kế sang trọng theo chủ đề cưới.',                                                              '500–800.000đ','', 0, 10],
            [$c4, 'Acrylic nail cơ bản','Hot',       'Acrylic trong + gel phủ màu.',                                                                        '350.000đ',    '', 0, 11],
            [$c4, 'Acrylic nail + Nail Art','',      'Acrylic kết hợp vẽ họa tiết theo yêu cầu.',                                                          '500–700.000đ','', 0, 12],
            [$c4, 'Nail gel builder (BIAB)','',      'Gel xây dựng, dày nhẹ tự nhiên.',                                                                    '280.000đ',    '', 0, 13],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO services (category_id, name, tag, description, price, image, featured, sort_order) VALUES (?,?,?,?,?,?,?,?)");
        foreach ($services as $s) $stmt->execute($s);
    }

    private function seedGallery(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM gallery_items")->fetchColumn();
        if ($count > 0) return;
        $items = [
            ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=70&auto=format&fit=crop',             'Nail art hoa',  0],
            ['https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=500&q=70&auto=format&fit=crop',             'Nail gel hồng', 1],
            ['https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&q=70&auto=format&fit=crop',             'Pedicure',      2],
            ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=70&auto=format&fit=crop&crop=top',    'Nail 3D',       3],
            ['https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=500&q=70&auto=format&fit=crop&crop=center','Nail nude',     4],
            ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=70&auto=format&fit=crop&crop=bottom','Nail acrylic',  5],
            ['https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&q=70&auto=format&fit=crop&crop=top',   'Nail vẽ tay',   6],
            ['https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=500&q=70&auto=format&fit=crop&crop=bottom','Nail đính đá',  7],
            ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=70&auto=format&fit=crop&crop=entropy','Nail ombre',   8],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO gallery_items (image, title, sort_order) VALUES (?,?,?)");
        foreach ($items as $it) $stmt->execute($it);
    }

    private function seedTestimonials(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
        if ($count > 0) return;
        $rows = [
            ['Nguyễn Thị An',   'Quận 1, TP.HCM',   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=70&auto=format&fit=crop&crop=face', 'Tiệm nail sạch sẽ, thợ làm rất tỉ mỉ và cẩn thận. Bộ nail art hoa của mình giữ được 3 tuần vẫn đẹp như mới. Nhất định sẽ quay lại!', 5, 0],
            ['Trần Thị Bảo',    'Quận 3, TP.HCM',   'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=70&auto=format&fit=crop&crop=face', 'Lần đầu làm pedicure ở đây, nhưng chắc chắn sẽ không phải lần cuối. Dịch vụ tuyệt vời, không gian thư giãn, thợ rất chuyên nghiệp và vui vẻ.', 5, 1],
            ['Lê Thị Châu',     'Bình Thạnh, TP.HCM','https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=70&auto=format&fit=crop&crop=face','Nail art 3D siêu đẹp, đúng như mẫu mình chọn. Đặt lịch qua Zalo rất tiện, không phải chờ. Giá cả hợp lý, chất lượng xứng đáng với tiền bỏ ra.', 5, 2],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO testimonials (author_name, author_location, author_avatar, content, rating, sort_order) VALUES (?,?,?,?,?,?)");
        foreach ($rows as $r) $stmt->execute($r);
    }

    private function seedTeamMembers(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM team_members")->fetchColumn();
        if ($count > 0) return;
        $members = [
            ['Linh Nguyễn',  'Nail Artist Cấp Senior',       'https://images.unsplash.com/photo-1598966739654-5e9a252d8c32?w=300&q=70&auto=format&fit=crop&crop=face', 'Nail Art 3D', 'Gel',      0],
            ['Mai Trần',     'Chuyên gia Pedicure',           'https://images.unsplash.com/photo-1601412436009-d964bd02edbc?w=300&q=70&auto=format&fit=crop&crop=face', 'Pedicure',    'Nail Dưỡng',1],
            ['Hoa Lê',       'Nail Artist — Ombre Specialist','https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&q=70&auto=format&fit=crop&crop=face',    'Ombre',       'Acrylic',  2],
            ['Châu Phạm',    'Quản lý & Nail Artist',         'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=70&auto=format&fit=crop&crop=face', 'Bridal Nail', '3D Art',   3],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO team_members (name, role, image, specialty1, specialty2, sort_order) VALUES (?,?,?,?,?,?)");
        foreach ($members as $m) $stmt->execute($m);
    }
}
