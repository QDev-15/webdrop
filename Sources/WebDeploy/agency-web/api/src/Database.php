<?php
declare(strict_types=1);

class Database
{
    private static ?Database $instance = null;
    private PDO $pdo;

    private function __construct()
    {
        if (DB_TYPE === 'sqlite') {
            $dir = dirname(DB_FILE);
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }
            $this->pdo = new PDO('sqlite:' . DB_FILE);
            $this->pdo->exec('PRAGMA foreign_keys = ON');
            $this->pdo->exec('PRAGMA journal_mode = WAL');
            $this->pdo->exec('PRAGMA synchronous = NORMAL');
        } else {
            $dsn = DB_TYPE . ':host=' . DB_HOST . ';port=' . DB_PORT
                 . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS);
        }

        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        $this->migrate();
    }

    public static function getInstance(): Database
    {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    // ── Query helpers ──────────────────────────────────────

    public function query(string $sql, array $params = []): array
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function row(string $sql, array $params = []): ?array
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    public function scalar(string $sql, array $params = []): mixed
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch(PDO::FETCH_NUM);
        return $row ? $row[0] : null;
    }

    public function execute(string $sql, array $params = []): int|string
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $this->pdo->lastInsertId();
    }

    public function beginTransaction(): void { $this->pdo->beginTransaction(); }
    public function commit(): void { $this->pdo->commit(); }
    public function rollback(): void { $this->pdo->rollBack(); }

    // ── Schema migration ───────────────────────────────────

    private function migrate(): void
    {
        $schema = file_get_contents(__DIR__ . '/../schema.sql');
        // Split on semicolons but keep PRAGMA statements
        $statements = array_filter(
            array_map('trim', explode(';', $schema)),
            fn($s) => $s !== ''
        );
        foreach ($statements as $stmt) {
            try {
                $this->pdo->exec($stmt);
            } catch (PDOException $e) {
                // Ignore "already exists" errors during migration
                if (strpos($e->getMessage(), 'already exists') === false) {
                    throw $e;
                }
            }
        }

        $this->seedDefaultData();
    }

    // ── Seed default data from template ───────────────────

    private function seedDefaultData(): void
    {
        $this->seedAdmin();
        $this->seedSettings();
        $this->seedHeroSlides();
        $this->seedServices();
        $this->seedProjects();
        $this->seedTeam();
        $this->seedTestimonials();
    }

    private function seedAdmin(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM users");
        if ($count > 0) return;

        $this->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['Administrator', 'admin@company.vn', password_hash('Admin@2026', PASSWORD_DEFAULT), 'superadmin']
        );
    }

    private function seedSettings(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM settings");
        if ($count > 0) return;

        $defaults = [
            // general
            ['site_name', 'Agency Web', 'general'],
            ['site_tagline', 'Thiết kế web & Dịch vụ số chuyên nghiệp', 'general'],
            ['site_description', 'Đối tác thiết kế web và dịch vụ số hàng đầu. Giải pháp sáng tạo, triển khai nhanh, hiệu quả bền vững.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hello@company.vn', 'general'],
            ['site_phone', '0901 234 567', 'general'],
            ['site_phone_2', '', 'general'],
            ['site_address', 'Hà Nội, Việt Nam', 'general'],
            ['working_hours', 'Thứ 2 – Thứ 7, 8:00 – 18:00', 'general'],
            // about
            ['about_title', 'Bắt đầu từ niềm đam mê', 'about'],
            ['about_tagline', 'Câu chuyện của chúng tôi', 'about'],
            ['about_content', '[TÊN CÔNG TY] được thành lập năm 2016 với một mục tiêu đơn giản: giúp doanh nghiệp Việt Nam tận dụng tối đa sức mạnh của công nghệ số.\n\nTừ một nhóm 3 người, chúng tôi đã phát triển thành đội ngũ 25+ chuyên gia với đa dạng kỹ năng: từ thiết kế UI/UX đến backend engineering, từ SEO đến digital marketing.', 'about'],
            ['about_image', '', 'about'],
            ['about_stat1_num', '120+', 'about'],
            ['about_stat1_label', 'Dự án hoàn thành', 'about'],
            ['about_stat2_num', '8 năm', 'about'],
            ['about_stat2_label', 'Kinh nghiệm', 'about'],
            ['about_stat3_num', '98%', 'about'],
            ['about_stat3_label', 'Khách hàng hài lòng', 'about'],
            ['about_members_count', '25+', 'about'],
            // stats section
            ['stats_projects', '120+', 'stats'],
            ['stats_clients', '50+', 'stats'],
            ['stats_years', '8 năm', 'stats'],
            ['stats_rating', '4.9 ★', 'stats'],
            // cta
            ['cta_title', 'Bắt đầu dự án của bạn', 'cta'],
            ['cta_subtitle', 'Tư vấn miễn phí. Báo giá trong 24 giờ. Không ràng buộc.', 'cta'],
            ['cta_button_text', 'Liên hệ tư vấn →', 'cta'],
            // seo
            ['meta_title', 'Agency Web — Thiết kế web & Dịch vụ số chuyên nghiệp', 'seo'],
            ['meta_description', 'Đối tác thiết kế web và dịch vụ số hàng đầu. Giải pháp sáng tạo, triển khai nhanh, hiệu quả bền vững.', 'seo'],
            ['meta_keywords', 'thiết kế web, ứng dụng di động, marketing số, agency web', 'seo'],
            ['og_image', '', 'seo'],
            ['google_analytics_id', '', 'seo'],
            // social
            ['social_facebook', '', 'social'],
            ['social_youtube', '', 'social'],
            ['social_instagram', '', 'social'],
            ['social_tiktok', '', 'social'],
            ['social_zalo', '', 'social'],
            ['social_linkedin', '', 'social'],
            // footer
            ['footer_copyright', '© 2026 Agency Web · Made in Vietnam', 'footer'],
            ['footer_description', 'Đối tác thiết kế web và dịch vụ số đáng tin cậy cho doanh nghiệp Việt Nam.', 'footer'],
            ['footer_show_social', '1', 'footer'],
            // contact
            ['contact_form_enabled', '1', 'contact'],
            ['contact_email_receiver', 'hello@company.vn', 'contact'],
            ['google_map_embed', '', 'contact'],
            // smtp
            ['smtp_host', 'smtp.gmail.com', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_password', '', 'smtp'],
            ['smtp_from_name', 'Agency Web', 'smtp'],
            ['smtp_from_email', '', 'smtp'],
            // system
            ['maintenance_mode', '0', 'system'],
            ['maintenance_message', 'Website đang bảo trì, vui lòng quay lại sau.', 'system'],
            ['custom_css', '', 'system'],
            // design
            ['primary_color', '#1a6b52', 'design'],
            ['secondary_color', '#2d9b73', 'design'],
        ];

        foreach ($defaults as [$key, $value, $group]) {
            $this->execute(
                "INSERT OR IGNORE INTO settings (key, value, \"group\") VALUES (?, ?, ?)",
                [$key, $value, $group]
            );
        }
    }

    private function seedHeroSlides(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM hero_slides");
        if ($count > 0) return;

        $slides = [
            [
                'title'       => 'Chúng tôi tạo ra <em>kết quả</em> thực sự.',
                'subtitle'    => 'Từ chiến lược đến thực thi — Agency Web đồng hành cùng doanh nghiệp trong hành trình chuyển đổi số toàn diện, bền vững.',
                'badge_text'  => 'Đối tác chiến lược của doanh nghiệp',
                'button_text' => 'Khám phá dịch vụ →',
                'button_link' => '/dich-vu',
                'button2_text' => 'Xem dự án',
                'button2_link' => '/du-an',
                'image'       => 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=60&auto=format&fit=crop',
                'stat1_num'   => '120+',
                'stat1_label' => 'Dự án hoàn thành',
                'stat2_num'   => '8 năm',
                'stat2_label' => 'Kinh nghiệm',
                'stat3_num'   => '98%',
                'stat3_label' => 'Khách hàng hài lòng',
                'sort_order'  => 0,
                'status'      => 'published',
            ],
        ];

        foreach ($slides as $s) {
            $this->execute(
                "INSERT INTO hero_slides
                    (title, subtitle, badge_text, button_text, button_link, button2_text, button2_link,
                     image, stat1_num, stat1_label, stat2_num, stat2_label, stat3_num, stat3_label,
                     sort_order, status)
                 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [
                    $s['title'], $s['subtitle'], $s['badge_text'],
                    $s['button_text'], $s['button_link'], $s['button2_text'], $s['button2_link'],
                    $s['image'],
                    $s['stat1_num'], $s['stat1_label'], $s['stat2_num'], $s['stat2_label'],
                    $s['stat3_num'], $s['stat3_label'],
                    $s['sort_order'], $s['status'],
                ]
            );
        }
    }

    private function seedServices(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM services");
        if ($count > 0) return;

        $services = [
            [
                'name'        => 'Thiết kế & Phát triển Website',
                'slug'        => 'thiet-ke-website',
                'description' => 'Website responsive, tốc độ cao, SEO chuẩn. Từ landing page đơn giản đến portal phức tạp, chúng tôi xây dựng giải pháp web phù hợp ngân sách và mục tiêu kinh doanh.',
                'icon'        => '🖥️',
                'price_text'  => 'Từ 15.000.000đ',
                'features'    => '["Landing page, multi-page website","Tích hợp CMS quản lý nội dung","PageSpeed 90+, Core Web Vitals đạt chuẩn"]',
                'featured'    => 1,
                'sort_order'  => 1,
            ],
            [
                'name'        => 'Phát triển Ứng dụng Di động',
                'slug'        => 'ung-dung-di-dong',
                'description' => 'App iOS và Android native hoặc cross-platform React Native. UI/UX thiết kế theo chuẩn Material và Human Interface Guidelines của Google và Apple.',
                'icon'        => '📱',
                'price_text'  => 'Liên hệ báo giá',
                'features'    => '["iOS, Android, cross-platform","Tích hợp API, payment gateway","Publish lên App Store & CH Play"]',
                'featured'    => 1,
                'sort_order'  => 2,
            ],
            [
                'name'        => 'Marketing Số',
                'slug'        => 'marketing-so',
                'description' => 'SEO, Google Ads, Facebook/TikTok Ads, Email Marketing tối ưu chi phí và ROI. Báo cáo minh bạch hàng tháng.',
                'icon'        => '📈',
                'price_text'  => 'Từ 5.000.000đ/tháng',
                'features'    => '["SEO on-page & off-page","Google Ads, Facebook Ads","Báo cáo hàng tháng chi tiết"]',
                'featured'    => 0,
                'sort_order'  => 3,
            ],
            [
                'name'        => 'Thiết kế Thương hiệu',
                'slug'        => 'thiet-ke-thuong-hieu',
                'description' => 'Logo, brand identity, brand guideline nhất quán. Từ concept đến bộ ấn phẩm hoàn chỉnh.',
                'icon'        => '🎨',
                'price_text'  => 'Từ 8.000.000đ',
                'features'    => '["Logo & brand identity","Brand guideline","Bộ ấn phẩm đầy đủ"]',
                'featured'    => 0,
                'sort_order'  => 4,
            ],
            [
                'name'        => 'Hệ thống Nội bộ',
                'slug'        => 'he-thong-noi-bo',
                'description' => 'CRM, ERP, phần mềm quản lý kho, nhân sự, bán hàng tuỳ chỉnh theo nghiệp vụ doanh nghiệp.',
                'icon'        => '⚙️',
                'price_text'  => 'Liên hệ báo giá',
                'features'    => '["CRM, ERP tùy chỉnh","Quản lý kho, nhân sự","Tích hợp quy trình nghiệp vụ"]',
                'featured'    => 0,
                'sort_order'  => 5,
            ],
            [
                'name'        => 'Bảo trì & Hỗ trợ',
                'slug'        => 'bao-tri-ho-tro',
                'description' => 'Gói bảo trì hàng tháng, cập nhật nội dung, giám sát uptime, hỗ trợ kỹ thuật 24/7.',
                'icon'        => '🛡️',
                'price_text'  => 'Từ 1.000.000đ/tháng',
                'features'    => '["Cập nhật nội dung không giới hạn","Giám sát uptime 24/7","Hỗ trợ kỹ thuật ưu tiên"]',
                'featured'    => 0,
                'sort_order'  => 6,
            ],
        ];

        foreach ($services as $s) {
            $this->execute(
                "INSERT INTO services (name, slug, description, icon, price_text, features, featured, sort_order, status)
                 VALUES (?,?,?,?,?,?,?,?,'published')",
                [$s['name'], $s['slug'], $s['description'], $s['icon'], $s['price_text'], $s['features'], $s['featured'], $s['sort_order']]
            );
        }
    }

    private function seedProjects(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM projects");
        if ($count > 0) return;

        $projects = [
            [
                'title'       => 'Hệ thống Website BĐS — VinGroup',
                'slug'        => 'website-bds-vingroup',
                'category'    => 'web',
                'industry'    => 'Bất động sản',
                'description' => 'Portal bất động sản với hơn 10.000 sản phẩm, tích hợp bản đồ, tìm kiếm nâng cao, CMS quản lý nội dung.',
                'image'       => 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80&auto=format&fit=crop',
                'client'      => 'VinGroup',
                'featured'    => 1,
                'sort_order'  => 1,
            ],
            [
                'title'       => 'App đặt bàn & delivery — Nhà hàng Sen',
                'slug'        => 'app-dat-ban-nha-hang-sen',
                'category'    => 'app',
                'industry'    => 'F&B',
                'description' => 'App iOS & Android với tính năng đặt bàn online, gọi món, tracking đơn hàng. 10.000+ downloads tháng đầu.',
                'image'       => 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format&fit=crop',
                'client'      => 'Nhà hàng Sen',
                'featured'    => 1,
                'sort_order'  => 2,
            ],
            [
                'title'       => 'Website Spa Lavender',
                'slug'        => 'website-spa-lavender',
                'category'    => 'web',
                'industry'    => 'Beauty & Spa',
                'description' => 'Landing page đặt lịch online, gallery dịch vụ, tích hợp Zalo OA.',
                'image'       => 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80&auto=format&fit=crop',
                'client'      => 'Spa Lavender',
                'featured'    => 1,
                'sort_order'  => 3,
            ],
            [
                'title'       => 'Brand Identity — TechStartupX',
                'slug'        => 'brand-identity-techstartupx',
                'category'    => 'brand',
                'industry'    => 'Startup',
                'description' => 'Logo, brand guideline, bộ ấn phẩm, pitch deck cho vòng gọi vốn Series A.',
                'image'       => 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=80&auto=format&fit=crop',
                'client'      => 'TechStartupX',
                'featured'    => 0,
                'sort_order'  => 4,
            ],
            [
                'title'       => 'Trang tin tức TechDaily.vn',
                'slug'        => 'trang-tin-tuc-techdaily',
                'category'    => 'web',
                'industry'    => 'Blog / Media',
                'description' => 'News portal 50.000+ bài viết, CMS tùy chỉnh, tốc độ tải < 1.5s.',
                'image'       => 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80&auto=format&fit=crop',
                'client'      => 'TechDaily.vn',
                'featured'    => 0,
                'sort_order'  => 5,
            ],
            [
                'title'       => 'Nền tảng học trực tuyến EduViet',
                'slug'        => 'nen-tang-hoc-truc-tuyen-eduviet',
                'category'    => 'web',
                'industry'    => 'Giáo dục',
                'description' => 'Website + App học online với 500+ khóa học, live stream, thi trực tuyến, payment gateway VNPay & Momo.',
                'image'       => 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&auto=format&fit=crop',
                'client'      => 'EduViet',
                'featured'    => 1,
                'sort_order'  => 6,
            ],
            [
                'title'       => 'App quản lý vận tải — FastShip',
                'slug'        => 'app-quan-ly-van-tai-fastship',
                'category'    => 'app',
                'industry'    => 'Logistics',
                'description' => 'App tài xế + khách hàng + dispatcher. Real-time tracking, route optimization, hóa đơn tự động.',
                'image'       => 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&q=80&auto=format&fit=crop',
                'client'      => 'FastShip',
                'featured'    => 0,
                'sort_order'  => 7,
            ],
        ];

        foreach ($projects as $p) {
            $this->execute(
                "INSERT INTO projects (title, slug, category, industry, description, image, client, featured, sort_order, status)
                 VALUES (?,?,?,?,?,?,?,?,?,'published')",
                [$p['title'], $p['slug'], $p['category'], $p['industry'], $p['description'], $p['image'], $p['client'], $p['featured'], $p['sort_order']]
            );
        }
    }

    private function seedTeam(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM team_members");
        if ($count > 0) return;

        $members = [
            ['Nguyễn Văn An', 'CEO & Co-founder', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop&crop=face', 1],
            ['Trần Thu Hà', 'Lead Designer', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop&crop=face', 2],
            ['Phạm Minh Tuấn', 'CTO & Lead Developer', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80&auto=format&fit=crop&crop=face', 3],
            ['Lê Ngọc Mai', 'Head of Marketing', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80&auto=format&fit=crop&crop=face', 4],
        ];

        foreach ($members as [$name, $position, $avatar, $order]) {
            $this->execute(
                "INSERT INTO team_members (name, position, avatar, sort_order, status) VALUES (?,?,?,?,'published')",
                [$name, $position, $avatar, $order]
            );
        }
    }

    private function seedTestimonials(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM testimonials");
        if ($count > 0) return;

        $testimonials = [
            [
                'author_name'  => 'Trần Minh Hoàng',
                'author_title' => 'CEO · Công ty BĐS Minh Phát',
                'author_avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop&crop=face',
                'content'      => 'Đội ngũ chuyên nghiệp, hiểu sâu về yêu cầu kinh doanh. Website mới tăng 40% tỷ lệ chuyển đổi sau 3 tháng.',
                'rating'       => 5,
                'sort_order'   => 1,
            ],
            [
                'author_name'  => 'Nguyễn Lan Anh',
                'author_title' => 'Giám đốc Marketing · FoodChain VN',
                'author_avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop&crop=face',
                'content'      => 'Bàn giao đúng hạn, không phát sinh chi phí. Tiến độ minh bạch, luôn cập nhật tiến độ qua Zalo mỗi ngày.',
                'rating'       => 5,
                'sort_order'   => 2,
            ],
            [
                'author_name'  => 'Phạm Đức Toàn',
                'author_title' => 'CTO · StartupX',
                'author_avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face',
                'content'      => 'App iOS chạy mượt, UI đẹp. User review 4.8* trên App Store ngay tháng đầu ra mắt. Rất ấn tượng.',
                'rating'       => 5,
                'sort_order'   => 3,
            ],
        ];

        foreach ($testimonials as $t) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order, status)
                 VALUES (?,?,?,?,?,?,'published')",
                [$t['author_name'], $t['author_title'], $t['author_avatar'], $t['content'], $t['rating'], $t['sort_order']]
            );
        }
    }
}
