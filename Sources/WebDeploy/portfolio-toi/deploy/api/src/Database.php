<?php
declare(strict_types=1);

class Database {
    private \PDO $pdo;
    private static ?Database $instance = null;

    private function __construct() {
        if (DB_TYPE === 'sqlite') {
            $dir = dirname(DB_FILE);
            if (!is_dir($dir)) mkdir($dir, 0755, true);
            $this->pdo = new \PDO('sqlite:' . DB_FILE);
            $this->pdo->exec('PRAGMA foreign_keys = ON');
            $this->pdo->exec('PRAGMA journal_mode = WAL');
        } else {
            $dsn = DB_TYPE . ':host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            $this->pdo = new \PDO($dsn, DB_USER, DB_PASS);
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

    private function migrate(): void {
        $schemaPath = __DIR__ . '/../schema.sql';
        $schema = file_get_contents($schemaPath);
        // ⚠️  PHẢI check false — nếu schema.sql thiếu, tables không được tạo
        if ($schema === false) {
            throw new \RuntimeException('schema.sql not found: ' . $schemaPath);
        }
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
        $this->seedProjects();
        $this->seedSkillGroups();
        $this->seedSkills();
        $this->seedTestimonials();
    }

    private function seedUsers(): void {
        if ($this->scalar("SELECT COUNT(*) FROM users") > 0) return;
        // ⚠️  Tài khoản mặc định cố định
        $this->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['sysadmin', 'sysadmin@admin.com', password_hash('123456', PASSWORD_BCRYPT), 'superadmin']
        );
    }

    private function seedSettings(): void {
        if ($this->scalar("SELECT COUNT(*) FROM settings") > 0) return;
        $rows = [
            // general
            ['site_name',        'Portfolio Tôi',                                        'general'],
            ['site_description', 'Portfolio cá nhân — UI/UX Designer & Developer. Xem các dự án và liên hệ hợp tác.', 'general'],
            ['site_logo',        '',                                                      'general'],
            ['site_favicon',     '',                                                      'general'],
            ['site_email',       'hello@youremail.com',                                   'general'],
            ['site_phone',       '',                                                      'general'],
            ['site_phone_2',     '',                                                      'general'],
            ['site_address',     'TP. Hồ Chí Minh, Việt Nam',                            'general'],
            ['working_hours',    '',                                                      'general'],
            // seo
            ['meta_title',       'Portfolio Tôi — UI/UX Designer & Developer',           'seo'],
            ['meta_description', 'Portfolio cá nhân — thiết kế và xây dựng sản phẩm số đẹp, nhanh, trải nghiệm xuất sắc.', 'seo'],
            ['meta_keywords',    'portfolio, ui ux designer, frontend developer, react, figma', 'seo'],
            ['og_image',         '',                                                      'seo'],
            ['google_analytics_id','',                                                   'seo'],
            // social
            ['social_facebook',  '',                                                     'social'],
            ['social_youtube',   '',                                                     'social'],
            ['social_instagram', '',                                                     'social'],
            ['social_tiktok',    '',                                                     'social'],
            ['social_zalo',      '',                                                     'social'],
            ['social_linkedin',  '',                                                     'social'],
            ['social_github',    'https://github.com',                                   'social'],
            ['social_behance',   '',                                                     'social'],
            ['social_dribbble',  '',                                                     'social'],
            // design
            ['primary_color',    '#1a6b52',                                              'design'],
            ['secondary_color',  '#2d9b73',                                              'design'],
            // footer
            ['footer_copyright', '© 2025 Portfolio Tôi. Made with ♥ in Vietnam.',       'footer'],
            ['footer_description','UI/UX Designer & Developer tại TP. Hồ Chí Minh.',    'footer'],
            ['footer_show_social','1',                                                   'footer'],
            // contact
            ['contact_form_enabled', '1',                                                'contact'],
            ['contact_email_receiver','hello@youremail.com',                             'contact'],
            ['google_map_embed', '',                                                     'contact'],
            // smtp
            ['smtp_host',   'smtp.gmail.com',                                            'smtp'],
            ['smtp_port',   '587',                                                       'smtp'],
            ['smtp_user',   '',                                                          'smtp'],
            ['smtp_password','',                                                         'smtp'],
            ['smtp_from_name','Portfolio Tôi',                                           'smtp'],
            ['smtp_from_email','',                                                       'smtp'],
            // system
            ['maintenance_mode',    '0',                                                 'system'],
            ['maintenance_message', 'Website đang bảo trì. Vui lòng quay lại sau.',    'system'],
            // about / hero info
            ['about_name',         'Họ Tên',                                            'about'],
            ['about_role',         'UI/UX Designer & Developer',                         'about'],
            ['about_bio',          'Tôi thiết kế và xây dựng những sản phẩm số đẹp, nhanh và có trải nghiệm người dùng xuất sắc. Từ wireframe đến production — một mình tôi lo được.', 'about'],
            ['about_bio_2',        'Khi không ngồi thiết kế, tôi viết blog về UI/UX, đóng góp open source và chụp ảnh đường phố.', 'about'],
            ['about_image',        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=700&q=80&auto=format&fit=crop', 'about'],
            ['about_avatar',       'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop', 'about'],
            ['about_years_exp',    '5',                                                  'about'],
            ['about_projects_count','40+',                                               'about'],
            ['about_clients_count','15+',                                                'about'],
            ['about_cv_url',       'https://drive.google.com',                           'about'],
            ['about_status',       'Sẵn sàng nhận dự án mới',                           'about'],
            // cloudinary
            ['cloudinary_cloud_name', '',                                                'cloudinary'],
            ['cloudinary_api_key',    '',                                                'cloudinary'],
            ['cloudinary_api_secret', '',                                                'cloudinary'],
            ['cloudinary_folder',     'portfolio-toi',                                  'cloudinary'],
            // integrations
            ['unsplash_access_key',   '',                                                'integrations'],
        ];
        $stmt = $this->pdo->prepare("INSERT OR IGNORE INTO settings (key, value, \"group\") VALUES (?, ?, ?)");
        foreach ($rows as $r) {
            $stmt->execute($r);
        }
    }

    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        $slides = [
            [
                'title'       => 'Xin chào, tôi là Designer & Developer',
                'subtitle'    => 'Tôi thiết kế và xây dựng những sản phẩm số đẹp, nhanh và có trải nghiệm người dùng xuất sắc.',
                'button_text' => 'Xem dự án',
                'button_link' => '#du-an',
                'image'       => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80&auto=format&fit=crop',
                'sort_order'  => 1,
                'status'      => 'published',
            ],
        ];
        foreach ($slides as $s) {
            $this->execute(
                "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [$s['title'], $s['subtitle'], $s['button_text'], $s['button_link'], $s['image'], $s['sort_order'], $s['status']]
            );
        }
    }

    private function seedProjects(): void {
        if ($this->scalar("SELECT COUNT(*) FROM projects") > 0) return;
        $projects = [
            [
                'title'       => 'Ứng dụng quản lý tài chính cá nhân',
                'slug'        => 'quan-ly-tai-chinh-ca-nhan',
                'category'    => 'UI/UX Design · Mobile',
                'description' => 'Thiết kế toàn bộ UI cho app iOS/Android từ wireframe đến handoff. 80,000+ người dùng sau 3 tháng.',
                'image'       => 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80&auto=format&fit=crop',
                'tags'        => 'Figma,React Native,iOS,Android',
                'project_url' => '',
                'github_url'  => '',
                'featured'    => 1,
                'sort_order'  => 1,
            ],
            [
                'title'       => 'Hệ thống CRM cho doanh nghiệp vừa',
                'slug'        => 'he-thong-crm-doanh-nghiep',
                'category'    => 'Web Design · Dashboard',
                'description' => 'Thiết kế và phát triển dashboard quản lý khách hàng, đơn hàng và báo cáo doanh thu thời gian thực.',
                'image'       => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop',
                'tags'        => 'Next.js,TypeScript,Prisma,Charts',
                'project_url' => '',
                'github_url'  => '',
                'featured'    => 1,
                'sort_order'  => 2,
            ],
            [
                'title'       => 'Rebranding cho startup F&B',
                'slug'        => 'rebranding-startup-fb',
                'category'    => 'Branding · Web',
                'description' => 'Logo, brand identity và landing page cho chuỗi cà phê mới tại TP.HCM.',
                'image'       => 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&q=80&auto=format&fit=crop',
                'tags'        => 'Branding,HTML/CSS',
                'project_url' => '',
                'github_url'  => '',
                'featured'    => 0,
                'sort_order'  => 3,
            ],
            [
                'title'       => 'Nền tảng học trực tuyến B2B',
                'slug'        => 'nen-tang-hoc-truc-tuyen-b2b',
                'category'    => 'UX Research · Web App',
                'description' => 'UX research, thiết kế lại luồng onboarding — tăng conversion 34%.',
                'image'       => 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80&auto=format&fit=crop',
                'tags'        => 'UX Research,Figma',
                'project_url' => '',
                'github_url'  => '',
                'featured'    => 0,
                'sort_order'  => 4,
            ],
            [
                'title'       => 'Cửa hàng thời trang online',
                'slug'        => 'cua-hang-thoi-trang-online',
                'category'    => 'E-commerce · Shopify',
                'description' => 'Custom Shopify theme, tối ưu mobile checkout — doanh thu tăng 2x.',
                'image'       => 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=600&q=80&auto=format&fit=crop',
                'tags'        => 'Shopify,Liquid,CSS',
                'project_url' => '',
                'github_url'  => '',
                'featured'    => 0,
                'sort_order'  => 5,
            ],
        ];
        foreach ($projects as $p) {
            $this->execute(
                "INSERT INTO projects (title, slug, category, description, image, tags, project_url, github_url, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [$p['title'], $p['slug'], $p['category'], $p['description'], $p['image'], $p['tags'], $p['project_url'], $p['github_url'], $p['featured'], $p['sort_order']]
            );
        }
    }

    private function seedSkillGroups(): void {
        if ($this->scalar("SELECT COUNT(*) FROM skill_groups") > 0) return;
        $groups = [
            ['Design', 1],
            ['Frontend', 2],
            ['Khác', 3],
        ];
        foreach ($groups as $g) {
            $this->execute("INSERT INTO skill_groups (name, sort_order) VALUES (?, ?)", $g);
        }
    }

    private function seedSkills(): void {
        if ($this->scalar("SELECT COUNT(*) FROM skills") > 0) return;
        // Get group IDs
        $groupMap = [];
        $rows = $this->query("SELECT id, name FROM skill_groups");
        foreach ($rows as $r) { $groupMap[$r['name']] = (int)$r['id']; }

        $skills = [
            // Design
            [$groupMap['Design'] ?? null, 'Figma', 1],
            [$groupMap['Design'] ?? null, 'Adobe XD', 2],
            [$groupMap['Design'] ?? null, 'Illustrator', 3],
            [$groupMap['Design'] ?? null, 'Photoshop', 4],
            [$groupMap['Design'] ?? null, 'Framer', 5],
            // Frontend
            [$groupMap['Frontend'] ?? null, 'HTML / CSS', 1],
            [$groupMap['Frontend'] ?? null, 'JavaScript', 2],
            [$groupMap['Frontend'] ?? null, 'React', 3],
            [$groupMap['Frontend'] ?? null, 'Next.js', 4],
            [$groupMap['Frontend'] ?? null, 'TypeScript', 5],
            [$groupMap['Frontend'] ?? null, 'Bootstrap', 6],
            // Khác
            [$groupMap['Khác'] ?? null, 'Git / GitHub', 1],
            [$groupMap['Khác'] ?? null, 'Node.js', 2],
            [$groupMap['Khác'] ?? null, 'Prisma', 3],
            [$groupMap['Khác'] ?? null, 'Vercel', 4],
            [$groupMap['Khác'] ?? null, 'Notion', 5],
        ];
        foreach ($skills as $s) {
            $this->execute(
                "INSERT INTO skills (group_id, name, sort_order) VALUES (?, ?, ?)",
                $s
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $testimonials = [
            ['Nguyễn Minh Tuấn', 'CEO · Startup FinTech', '', 'Anh ấy làm việc rất chuyên nghiệp và hiểu rõ yêu cầu của chúng tôi. App sau khi redesign đạt 80,000 users chỉ sau 3 tháng ra mắt. Thực sự ấn tượng!', 5, 1],
            ['Lê Thu Hương', 'Marketing Manager · Agency', '', 'Không chỉ thiết kế đẹp mà còn chú trọng UX thực sự. Dashboard CRM của chúng tôi sau khi được thiết kế lại, team sale tăng hiệu quả làm việc lên 40%.', 5, 2],
            ['Trần Bảo Khánh', 'Founder · F&B Brand', '', 'Dự án rebranding và landing page được hoàn thành đúng deadline, chất lượng vượt mong đợi. Tôi sẽ tiếp tục hợp tác cho các dự án tiếp theo.', 5, 3],
        ];
        foreach ($testimonials as $t) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                $t
            );
        }
    }

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

    public function execute(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (int)$this->pdo->lastInsertId();
    }

    public function scalar(string $sql, array $params = []): mixed {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $val = $stmt->fetchColumn();
        return $val === false ? null : $val;
    }
}
