<?php
declare(strict_types=1);

class Database {
    private static ?Database $instance = null;
    private PDO $pdo;

    private function __construct() {
        $dsn = 'sqlite:' . DB_FILE;
        $this->pdo = new PDO($dsn, null, null, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->pdo->exec('PRAGMA journal_mode = WAL');
        $this->migrate();
    }

    public static function getInstance(): self {
        if (self::$instance === null) {
            $dir = dirname(DB_FILE);
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function migrate(): void {
        $schemaPath = __DIR__ . '/../schema.sql';
        $schema = file_get_contents($schemaPath);
        // ⚠️  PHẢI check false — nếu schema.sql thiếu, tables không được tạo nhưng không có lỗi rõ ràng
        if ($schema === false) {
            throw new \RuntimeException('schema.sql not found: ' . $schemaPath);
        }
        $statements = array_filter(array_map('trim', explode(';', $schema)));
        foreach ($statements as $stmt) {
            if ($stmt) {
                try {
                    $this->pdo->exec($stmt);
                } catch (\PDOException $e) {
                    // ignore "already exists" from IF NOT EXISTS
                }
            }
        }
        $this->seedData();
    }

    private function seedData(): void {
        $this->seedUsers();
        $this->seedSettings();
        $this->seedHeroSlides();
        $this->seedServices();
        $this->seedProjects();
        $this->seedTeam();
        $this->seedTestimonials();
    }

    private function seedUsers(): void {
        if ($this->scalar("SELECT COUNT(*) FROM users") > 0) return;
        // Tài khoản mặc định cố định
        $this->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['sysadmin', 'sysadmin@admin.com', password_hash('123456', PASSWORD_BCRYPT), 'superadmin']
        );
    }

    private function seedSettings(): void {
        if ($this->scalar("SELECT COUNT(*) FROM settings") > 0) return;
        $defaults = [
            // general
            ['site_name',          'Agency Web',                                              'general'],
            ['site_description',   'Thiết kế web & Dịch vụ số chuyên nghiệp',               'general'],
            ['site_logo',          '',                                                         'general'],
            ['site_favicon',       '',                                                         'general'],
            ['site_email',         'hello@company.vn',                                        'general'],
            ['site_phone',         '0901 234 567',                                            'general'],
            ['site_phone_2',       '',                                                         'general'],
            ['site_address',       'Hà Nội, Việt Nam',                                       'general'],
            ['working_hours',      'Thứ 2 – Thứ 7, 8:00 – 18:00',                           'general'],
            // seo
            ['meta_title',         'Agency Web — Thiết kế web & Dịch vụ số chuyên nghiệp',  'seo'],
            ['meta_description',   'Đối tác thiết kế web và dịch vụ số hàng đầu. Giải pháp sáng tạo, triển khai nhanh, hiệu quả bền vững.', 'seo'],
            ['meta_keywords',      'thiết kế web, agency, dịch vụ số, marketing',            'seo'],
            ['og_image',           '',                                                         'seo'],
            ['google_analytics_id','',                                                         'seo'],
            // social
            ['social_facebook',    '',                                                         'social'],
            ['social_youtube',     '',                                                         'social'],
            ['social_instagram',   '',                                                         'social'],
            ['social_tiktok',      '',                                                         'social'],
            ['social_zalo',        '',                                                         'social'],
            // design
            ['primary_color',      '#1a6b52',                                                 'design'],
            ['secondary_color',    '#141210',                                                  'design'],
            // footer
            ['footer_copyright',   '© 2026 Agency Web · Made in Vietnam',                   'footer'],
            ['footer_description', 'Đối tác thiết kế web và dịch vụ số đáng tin cậy cho doanh nghiệp Việt Nam.', 'footer'],
            ['footer_show_social', '1',                                                        'footer'],
            // contact
            ['contact_form_enabled',    '1',                                                   'contact'],
            ['contact_email_receiver',  'hello@company.vn',                                   'contact'],
            ['google_map_embed',        '',                                                     'contact'],
            // about
            ['about_title',        'Bắt đầu từ niềm đam mê',                                 'about'],
            ['about_content',      '[TÊN CÔNG TY] được thành lập năm 2016 với một mục tiêu đơn giản: giúp doanh nghiệp Việt Nam tận dụng tối đa sức mạnh của công nghệ số. Từ một nhóm 3 người, chúng tôi đã phát triển thành đội ngũ 25+ chuyên gia với đa dạng kỹ năng.', 'about'],
            ['about_image',        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop', 'about'],
            ['about_tagline',      'Đối tác chiến lược của doanh nghiệp',                    'about'],
            ['stat_projects',      '120+',                                                     'about'],
            ['stat_years',         '8 năm',                                                   'about'],
            ['stat_satisfaction',  '98%',                                                      'about'],
            ['stat_clients',       '50+',                                                      'about'],
            // smtp
            ['smtp_host',          'smtp.gmail.com',  'smtp'],
            ['smtp_port',          '587',             'smtp'],
            ['smtp_user',          '',                'smtp'],
            ['smtp_password',      '',                'smtp'],
            ['smtp_from_name',     'Agency Web',      'smtp'],
            ['smtp_from_email',    '',                'smtp'],
            // system
            ['maintenance_mode',    '0',               'system'],
            ['maintenance_message', 'Website đang bảo trì. Vui lòng quay lại sau.', 'system'],
        ];
        $stmt = $this->pdo->prepare("INSERT OR IGNORE INTO settings (key, value, \"group\") VALUES (?, ?, ?)");
        foreach ($defaults as $row) {
            $stmt->execute($row);
        }
    }

    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        $slides = [
            [
                'title'       => 'Chúng tôi tạo ra kết quả thực sự.',
                'subtitle'    => 'Từ chiến lược đến thực thi — Agency Web đồng hành cùng doanh nghiệp trong hành trình chuyển đổi số toàn diện, bền vững.',
                'button_text' => 'Khám phá dịch vụ',
                'button_link' => '/dich-vu',
                'image'       => 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1400&q=80&auto=format&fit=crop',
                'sort_order'  => 0,
            ],
            [
                'title'       => 'Thiết kế website chuyên nghiệp',
                'subtitle'    => 'Website responsive, tốc độ cao, SEO chuẩn — từ landing page đến hệ thống phức tạp, chúng tôi xây dựng giải pháp phù hợp ngân sách của bạn.',
                'button_text' => 'Xem dự án',
                'button_link' => '/du-an',
                'image'       => 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=60&auto=format&fit=crop',
                'sort_order'  => 1,
            ],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)"
        );
        foreach ($slides as $s) {
            $stmt->execute([$s['title'], $s['subtitle'], $s['button_text'], $s['button_link'], $s['image'], $s['sort_order']]);
        }
    }

    private function seedServices(): void {
        if ($this->scalar("SELECT COUNT(*) FROM services") > 0) return;
        $services = [
            ['Thiết kế Website',      'thiet-ke-website',     'Website đẹp, responsive, tối ưu tốc độ và SEO. Từ landing page đến hệ thống phức tạp.',     '🖥️', 1, 0],
            ['Ứng dụng Di động',      'ung-dung-di-dong',     'App iOS và Android native hoặc cross-platform. UX mượt mà, trải nghiệm người dùng tối ưu.',  '📱', 1, 1],
            ['Marketing Số',           'marketing-so',          'SEO, Google Ads, Facebook Ads, Email Marketing — chiến lược đa kênh tối ưu ROI.',            '📈', 0, 2],
            ['Thiết kế Thương hiệu',  'thiet-ke-thuong-hieu', 'Logo, bộ nhận diện thương hiệu, brand guideline nhất quán trên mọi điểm chạm.',              '🎨', 0, 3],
            ['Hệ thống Quản lý',      'he-thong-quan-ly',     'CRM, ERP, phần mềm nội bộ tuỳ chỉnh theo quy trình nghiệp vụ riêng của doanh nghiệp.',       '⚙️', 0, 4],
            ['Bảo trì & Hỗ trợ',     'bao-tri-ho-tro',       'Gói bảo trì hàng tháng, cập nhật nội dung, giám sát uptime, hỗ trợ kỹ thuật 24/7.',          '🛡️', 0, 5],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO services (name, slug, description, icon, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?)"
        );
        foreach ($services as $s) {
            $stmt->execute($s);
        }
    }

    private function seedProjects(): void {
        if ($this->scalar("SELECT COUNT(*) FROM projects") > 0) return;
        $projects = [
            ['Hệ thống Website BĐS — VinGroup',           'bds-vingroup',      'Portal bất động sản với hơn 10.000 sản phẩm, tích hợp bản đồ, tìm kiếm nâng cao, CMS quản lý nội dung.',             'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80&auto=format&fit=crop', 'VinGroup', 'web',   1, 0],
            ['App đặt bàn & delivery — Nhà hàng Sen',     'app-nha-hang-sen',  'App iOS & Android với tính năng đặt bàn online, gọi món, tracking đơn hàng. 10.000+ downloads tháng đầu.',            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format&fit=crop', 'Nhà hàng Sen', 'app', 1, 1],
            ['Website Spa Lavender',                       'spa-lavender',      'Landing page đặt lịch online, gallery dịch vụ, tích hợp Zalo OA.',                                                    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80&auto=format&fit=crop', 'Spa Lavender', 'web',  0, 2],
            ['Brand Identity — TechStartupX',             'brand-techstartupx','Logo, brand guideline, bộ ấn phẩm, pitch deck cho vòng gọi vốn Series A.',                                             'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=80&auto=format&fit=crop', 'TechStartupX', 'brand',0, 3],
            ['Nền tảng học trực tuyến EduViet',           'eduviet',           'Website + App học online với 500+ khóa học, live stream, thi trực tuyến, payment gateway VNPay & Momo.',              'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&auto=format&fit=crop', 'EduViet', 'web',   0, 4],
            ['App quản lý vận tải — FastShip',            'fastship',          'App tài xế + khách hàng + dispatcher. Real-time tracking, route optimization, hóa đơn tự động.',                      'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&q=80&auto=format&fit=crop', 'FastShip', 'app',  0, 5],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO projects (title, slug, description, image, client, category, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($projects as $p) {
            $stmt->execute($p);
        }
    }

    private function seedTeam(): void {
        if ($this->scalar("SELECT COUNT(*) FROM team_members") > 0) return;
        $team = [
            ['Nguyễn Văn An',  'CEO & Co-founder',      'Hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ và khởi nghiệp.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop&crop=face', 0],
            ['Trần Thu Hà',    'Lead Designer',          'Chuyên gia UI/UX với hơn 7 năm kinh nghiệm thiết kế sản phẩm kỹ thuật số.',                        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop&crop=face', 1],
            ['Phạm Minh Tuấn', 'CTO & Lead Developer',  'Full-stack engineer với chuyên môn về hệ thống phân tán và tối ưu hiệu suất.',                       'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80&auto=format&fit=crop&crop=face', 2],
            ['Lê Ngọc Mai',    'Head of Marketing',     'Chiến lược gia digital marketing với track record tăng trưởng 40%+ cho nhiều thương hiệu.',           'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80&auto=format&fit=crop&crop=face', 3],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO team_members (name, position, bio, avatar, sort_order) VALUES (?, ?, ?, ?, ?)"
        );
        foreach ($team as $t) {
            $stmt->execute($t);
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $testimonials = [
            [
                'Trần Minh Hoàng',
                'CEO · Công ty BĐS Minh Phát',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop&crop=face',
                '"Đội ngũ chuyên nghiệp, hiểu sâu về yêu cầu kinh doanh. Website mới tăng 40% tỷ lệ chuyển đổi sau 3 tháng."',
                5, 0,
            ],
            [
                'Nguyễn Lan Anh',
                'Giám đốc Marketing · FoodChain VN',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop&crop=face',
                '"Bàn giao đúng hạn, không phát sinh chi phí. Tiến độ minh bạch, luôn cập nhật tiến độ qua Zalo mỗi ngày."',
                5, 1,
            ],
            [
                'Phạm Đức Toàn',
                'CTO · StartupX',
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face',
                '"App iOS chạy mượt, UI đẹp. User review 4.8* trên App Store ngay tháng đầu ra mắt. Rất ấn tượng."',
                5, 2,
            ],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order) VALUES (?, ?, ?, ?, ?, ?)"
        );
        foreach ($testimonials as $t) {
            $stmt->execute($t);
        }
    }

    // ─── QUERY HELPERS ────────────────────────────────────────────────────────

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

    public function scalar(string $sql, array $params = []): mixed {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchColumn();
    }

    public function execute(string $sql, array $params = []): int|string {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        if (str_starts_with(strtoupper(ltrim($sql)), 'INSERT')) {
            return $this->pdo->lastInsertId();
        }
        return $stmt->rowCount();
    }
}
