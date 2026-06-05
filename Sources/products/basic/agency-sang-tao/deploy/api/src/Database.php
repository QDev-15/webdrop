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
        $statements = array_filter(
            array_map('trim', explode(';', $schema)),
            fn($s) => $s !== ''
        );
        foreach ($statements as $stmt) {
            try {
                $this->pdo->exec($stmt);
            } catch (PDOException $e) {
                if (strpos($e->getMessage(), 'already exists') === false) {
                    throw $e;
                }
            }
        }

        $this->seedDefaultData();
    }

    // ── Seed default data from template content ────────────

    private function seedDefaultData(): void
    {
        $this->seedAdmin();
        $this->seedSettings();
        $this->seedServices();
        $this->seedProjects();
        $this->seedTeam();
        $this->seedTestimonials();
        $this->seedProcessSteps();
        $this->seedAwards();
    }

    private function seedAdmin(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM users");
        if ($count > 0) return;

        $this->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['sysadmin', 'sysadmin@admin.com', password_hash('123456', PASSWORD_BCRYPT), 'superadmin']
        );
    }

    private function seedSettings(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM settings");
        if ($count > 0) return;

        $defaults = [
            // general — thông tin cơ bản của agency
            ['site_name', 'NOVA.', 'general'],
            ['site_tagline', 'Agency Sáng Tạo · Hồ Chí Minh · Est. 2016', 'general'],
            ['site_description', 'Agency sáng tạo chuyên branding, thiết kế và digital marketing. Chúng tôi tạo ra những thương hiệu đáng nhớ.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hello@nova.vn', 'general'],
            ['site_phone', '0909 123 456', 'general'],
            ['site_phone_2', '', 'general'],
            ['site_address', '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', 'general'],
            ['working_hours', 'Thứ 2 – Thứ 6, 8:00 – 18:00', 'general'],
            ['site_established', '2016', 'general'],
            ['site_city', 'Hồ Chí Minh', 'general'],
            // hero — thông tin trang chủ hero section
            ['hero_line1', 'WE BUILD', 'hero'],
            ['hero_line2', 'BRANDS', 'hero'],
            ['hero_line3', '& STORIES', 'hero'],
            ['hero_tagline', 'Agency Sáng Tạo · Hồ Chí Minh · Est. 2016', 'hero'],
            ['hero_tagline_right', 'Branding · Design · Digital', 'hero'],
            ['hero_stat1_num', '120', 'hero'],
            ['hero_stat1_suffix', '+', 'hero'],
            ['hero_stat1_label', 'Dự án hoàn thành', 'hero'],
            ['hero_stat2_num', '80', 'hero'],
            ['hero_stat2_suffix', '+', 'hero'],
            ['hero_stat2_label', 'Khách hàng tin tưởng', 'hero'],
            ['hero_stat3_num', '8', 'hero'],
            ['hero_stat3_suffix', '', 'hero'],
            ['hero_stat3_label', 'Năm kinh nghiệm', 'hero'],
            // about — trang về chúng tôi
            ['about_manifesto', 'Chúng tôi tin rằng mọi thương hiệu đều có một câu chuyện đáng được kể — và thiết kế chính là ngôn ngữ mạnh mẽ nhất để kể câu chuyện đó.', 'about'],
            ['about_story_title', 'Bắt đầu từ một studio nhỏ', 'about'],
            ['about_story_content', 'NOVA. được thành lập năm 2016 bởi Nguyễn Minh Quân — một designer với niềm tin rằng thiết kế không chỉ là nghề mà là sứ mệnh.\n\nTừ một studio nhỏ với 3 người, chúng tôi đã phát triển thành agency 15 thành viên với hơn 120 dự án thành công. Nhưng điều không thay đổi là cam kết tạo ra công việc xuất sắc cho mỗi khách hàng.', 'about'],
            ['about_approach_title', 'Sáng tạo có mục đích', 'about'],
            ['about_image', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop', 'about'],
            ['about_team_photo', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop', 'about'],
            ['about_team_count', '15', 'about'],
            ['about_team_caption', 'Đội ngũ đa dạng chuyên môn — designer, strategist, copywriter, developer', 'about'],
            // stats
            ['stats_projects', '120+', 'stats'],
            ['stats_clients', '80+', 'stats'],
            ['stats_years', '8', 'stats'],
            ['stats_awards', '15', 'stats'],
            // cta
            ['cta_label', 'Sẵn sàng chưa?', 'cta'],
            ['cta_title', "LET'S START YOUR\nNEXT PROJECT", 'cta'],
            ['cta_desc', 'Kể cho chúng tôi nghe về thương hiệu và mục tiêu của bạn. Chúng tôi sẽ lên kế hoạch sáng tạo phù hợp nhất trong vòng 24 giờ.', 'cta'],
            // seo
            ['meta_title', 'NOVA. — Agency Sáng Tạo & Branding tại TP. Hồ Chí Minh', 'seo'],
            ['meta_description', 'Agency sáng tạo chuyên branding, thiết kế và digital marketing. Chúng tôi tạo ra những thương hiệu đáng nhớ.', 'seo'],
            ['meta_keywords', 'agency sáng tạo, branding, thiết kế thương hiệu, digital design, campaign', 'seo'],
            ['og_image', '', 'seo'],
            ['google_analytics_id', '', 'seo'],
            // social
            ['social_facebook', '', 'social'],
            ['social_instagram', '', 'social'],
            ['social_behance', '', 'social'],
            ['social_linkedin', '', 'social'],
            ['social_youtube', '', 'social'],
            ['social_zalo', '', 'social'],
            // footer
            ['footer_copyright', '© 2026 NOVA. Agency. All rights reserved.', 'footer'],
            ['footer_description', 'Agency sáng tạo chuyên branding, thiết kế và digital marketing. Chúng tôi tạo ra những thương hiệu đáng nhớ.', 'footer'],
            ['footer_show_social', '1', 'footer'],
            // contact
            ['contact_form_enabled', '1', 'contact'],
            ['contact_email_receiver', 'hello@nova.vn', 'contact'],
            ['google_map_embed', '', 'contact'],
            // smtp
            ['smtp_host', 'smtp.gmail.com', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_password', '', 'smtp'],
            ['smtp_from_name', 'NOVA. Agency', 'smtp'],
            ['smtp_from_email', '', 'smtp'],
            // system
            ['maintenance_mode', '0', 'system'],
            ['maintenance_message', 'Website đang bảo trì, vui lòng quay lại sau.', 'system'],
            ['custom_css', '', 'system'],
            // design
            ['primary_color', '#f59e0b', 'design'],
            ['secondary_color', '#d97706', 'design'],
        ];

        foreach ($defaults as [$key, $value, $group]) {
            $this->execute(
                "INSERT OR IGNORE INTO settings (key, value, \"group\") VALUES (?, ?, ?)",
                [$key, $value, $group]
            );
        }
    }

    private function seedServices(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM services");
        if ($count > 0) return;

        // Dịch vụ từ template: Brand Identity, Digital Design, Campaign & Content
        $services = [
            [
                'name'        => 'Brand Identity',
                'slug'        => 'brand-identity',
                'number'      => '01',
                'description' => 'Xây dựng bộ nhận diện thương hiệu toàn diện — từ logo, bộ màu sắc, typography đến toàn bộ brand guidelines. Chúng tôi tạo ra thương hiệu có cá tính riêng và đáng nhớ lâu dài.',
                'tags'        => 'Logo Design,Brand Guidelines,Visual Identity,Brand Strategy',
                'featured'    => 1,
                'sort_order'  => 1,
            ],
            [
                'name'        => 'Digital Design',
                'slug'        => 'digital-design',
                'number'      => '02',
                'description' => 'Thiết kế giao diện website, ứng dụng và các tài sản kỹ thuật số. Từ UI/UX research đến prototype hoàn chỉnh — mỗi pixel đều có mục đích rõ ràng và hướng đến trải nghiệm người dùng tối ưu.',
                'tags'        => 'UI/UX Design,Web Design,App Design,Prototype',
                'featured'    => 1,
                'sort_order'  => 2,
            ],
            [
                'name'        => 'Campaign & Content',
                'slug'        => 'campaign-content',
                'number'      => '03',
                'description' => 'Lên ý tưởng và triển khai chiến dịch truyền thông sáng tạo. Content strategy, social media, video concept — chúng tôi tạo ra nội dung chạm đến cảm xúc và thúc đẩy hành động thực tế.',
                'tags'        => 'Campaign Strategy,Content Creation,Social Media,Video Concept',
                'featured'    => 1,
                'sort_order'  => 3,
            ],
            // Sub-services từ trang dich-vu.html
            [
                'name'        => 'Logo & Visual Identity',
                'slug'        => 'logo-visual-identity',
                'number'      => '',
                'description' => 'Thiết kế logo độc đáo và hệ thống nhận diện hình ảnh nhất quán phản ánh đúng giá trị và cá tính thương hiệu.',
                'tags'        => 'Logo Design,Color Palette,Typography,Brand Usage',
                'featured'    => 0,
                'sort_order'  => 4,
            ],
            [
                'name'        => 'Brand Strategy',
                'slug'        => 'brand-strategy',
                'number'      => '',
                'description' => 'Xây dựng nền tảng chiến lược thương hiệu vững chắc — định vị, giá trị cốt lõi, brand voice và messaging framework.',
                'tags'        => 'Brand Positioning,Target Audience,Brand Personality,Competitive Analysis',
                'featured'    => 0,
                'sort_order'  => 5,
            ],
            [
                'name'        => 'Campaign Creative',
                'slug'        => 'campaign-creative',
                'number'      => '',
                'description' => 'Lên ý tưởng và triển khai chiến dịch truyền thông sáng tạo. Từ concept đến execution trên mọi kênh truyền thông.',
                'tags'        => 'Campaign Concept,Key Visual,Multi-channel,Performance Tracking',
                'featured'    => 0,
                'sort_order'  => 6,
            ],
        ];

        foreach ($services as $s) {
            $this->execute(
                "INSERT INTO services (name, slug, number, description, tags, featured, sort_order, status)
                 VALUES (?,?,?,?,?,?,?,'published')",
                [$s['name'], $s['slug'], $s['number'], $s['description'], $s['tags'], $s['featured'], $s['sort_order']]
            );
        }
    }

    private function seedProjects(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM projects");
        if ($count > 0) return;

        // Các dự án mẫu phù hợp với agency branding/design
        $projects = [
            [
                'title'       => 'Rebranding Thương Hiệu F&B',
                'slug'        => 'rebranding-thuong-hieu-fb',
                'category'    => 'Brand Identity',
                'industry'    => 'F&B',
                'description' => 'Xây dựng bộ nhận diện thương hiệu toàn diện cho chuỗi nhà hàng — logo, brand guideline, bộ ấn phẩm và tài liệu truyền thông.',
                'image'       => 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80&auto=format&fit=crop',
                'client'      => 'Nhà hàng Phương Nam',
                'tags'        => 'Logo,Brand Guide,Stationery',
                'featured'    => 1,
                'sort_order'  => 1,
            ],
            [
                'title'       => 'Website & App UI — FinTech Startup',
                'slug'        => 'website-app-ui-fintech',
                'category'    => 'Digital Design',
                'industry'    => 'FinTech',
                'description' => 'Thiết kế website và ứng dụng cho startup tài chính — UI/UX research, wireframe, prototype và design system hoàn chỉnh.',
                'image'       => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80&auto=format&fit=crop',
                'client'      => 'PayViet',
                'tags'        => 'UI/UX,Web Design,App',
                'featured'    => 1,
                'sort_order'  => 2,
            ],
            [
                'title'       => 'Campaign Tết 2025',
                'slug'        => 'campaign-tet-2025',
                'category'    => 'Campaign',
                'industry'    => 'FMCG',
                'description' => 'Chiến dịch truyền thông tích hợp mùa Tết 2025 — concept sáng tạo, key visual, bộ ấn phẩm và social media assets.',
                'image'       => 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=800&q=80&auto=format&fit=crop',
                'client'      => 'Vinamilk',
                'tags'        => 'Campaign,Creative,Print',
                'featured'    => 1,
                'sort_order'  => 3,
            ],
            [
                'title'       => 'Social Media — Beauty Brand',
                'slug'        => 'social-media-beauty-brand',
                'category'    => 'Social Media',
                'industry'    => 'Beauty',
                'description' => 'Xây dựng content strategy và visual identity cho social media trên các nền tảng Facebook, Instagram, TikTok.',
                'image'       => 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80&auto=format&fit=crop',
                'client'      => 'Beauté Studio',
                'tags'        => 'Social,Content,TikTok',
                'featured'    => 0,
                'sort_order'  => 4,
            ],
            [
                'title'       => 'Event Branding — Tech Summit',
                'slug'        => 'event-branding-tech-summit',
                'category'    => 'Event Branding',
                'industry'    => 'Technology',
                'description' => 'Thiết kế toàn bộ branding cho sự kiện Tech Summit — backdrop, standee, name card, stage design và materials.',
                'image'       => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&auto=format&fit=crop',
                'client'      => 'VietTech',
                'tags'        => 'Event,Print,Stage',
                'featured'    => 0,
                'sort_order'  => 5,
            ],
            [
                'title'       => 'Full Brand Identity — Startup SaaS',
                'slug'        => 'full-brand-identity-saas',
                'category'    => 'Brand Identity',
                'industry'    => 'SaaS',
                'description' => 'Tái định vị và rebrand toàn diện cho startup SaaS — từ chiến lược thương hiệu đến toàn bộ hệ thống visual identity mới.',
                'image'       => 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80&auto=format&fit=crop',
                'client'      => 'CloudStack VN',
                'tags'        => 'Rebranding,Strategy,Identity',
                'featured'    => 1,
                'sort_order'  => 6,
            ],
            [
                'title'       => 'Digital Marketing — E-commerce',
                'slug'        => 'digital-marketing-ecommerce',
                'category'    => 'Digital Marketing',
                'industry'    => 'E-commerce',
                'description' => 'Triển khai chiến lược marketing tổng thể — SEO, paid ads, content marketing và email automation.',
                'image'       => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80&auto=format&fit=crop',
                'client'      => 'ShopNow.vn',
                'tags'        => 'SEO,Ads,Analytics',
                'featured'    => 0,
                'sort_order'  => 7,
            ],
        ];

        foreach ($projects as $p) {
            $this->execute(
                "INSERT INTO projects (title, slug, category, industry, description, image, client, tags, featured, sort_order, status)
                 VALUES (?,?,?,?,?,?,?,?,?,?,'published')",
                [$p['title'], $p['slug'], $p['category'], $p['industry'], $p['description'], $p['image'], $p['client'], $p['tags'], $p['featured'], $p['sort_order']]
            );
        }
    }

    private function seedTeam(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM team_members");
        if ($count > 0) return;

        // Đội ngũ từ template (3 thành viên chính + 3 thành viên phụ)
        $members = [
            [
                'name'       => 'Nguyễn Minh Quân',
                'position'   => 'Founder & Creative Director',
                'experience' => '10 năm kinh nghiệm · Brand Strategy',
                'avatar'     => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=face',
                'order'      => 1,
            ],
            [
                'name'       => 'Trần Thị Bảo Châu',
                'position'   => 'Lead Visual Designer',
                'experience' => '7 năm kinh nghiệm · Visual & UI',
                'avatar'     => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop&crop=face',
                'order'      => 2,
            ],
            [
                'name'       => 'Lê Hoàng Phúc',
                'position'   => 'Digital & Campaign Lead',
                'experience' => '6 năm kinh nghiệm · Marketing & Content',
                'avatar'     => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop&crop=face',
                'order'      => 3,
            ],
            [
                'name'       => 'Phạm Như Quỳnh',
                'position'   => 'Brand Designer',
                'experience' => '4 năm kinh nghiệm',
                'avatar'     => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop&crop=face',
                'order'      => 4,
            ],
            [
                'name'       => 'Hồ Văn Khang',
                'position'   => 'UI/UX Designer',
                'experience' => '3 năm kinh nghiệm',
                'avatar'     => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop&crop=face',
                'order'      => 5,
            ],
            [
                'name'       => 'Vũ Thanh Hà',
                'position'   => 'Content Strategist',
                'experience' => '5 năm kinh nghiệm',
                'avatar'     => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format&fit=crop&crop=face',
                'order'      => 6,
            ],
        ];

        foreach ($members as $m) {
            $this->execute(
                "INSERT INTO team_members (name, position, experience, avatar, sort_order, status)
                 VALUES (?,?,?,?,?,'published')",
                [$m['name'], $m['position'], $m['experience'], $m['avatar'], $m['order']]
            );
        }
    }

    private function seedTestimonials(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM testimonials");
        if ($count > 0) return;

        // Testimonials từ template (2 blockquotes lớn)
        $testimonials = [
            [
                'author_name'   => 'Trần Quốc Bảo',
                'author_title'  => 'CEO · Công ty Minh Phát Group',
                'author_avatar' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80&auto=format&fit=crop&crop=face',
                'content'       => 'NOVA. đã hoàn toàn thay đổi cách thương hiệu chúng tôi được nhìn nhận trên thị trường. Từ một brand mờ nhạt, chúng tôi trở thành cái tên mọi người nhớ đến đầu tiên trong ngành.',
                'rating'        => 5,
                'order'         => 1,
            ],
            [
                'author_name'   => 'Nguyễn Thị Lan Phương',
                'author_title'  => 'CMO · TechViet Corporation',
                'author_avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80&auto=format&fit=crop&crop=face',
                'content'       => 'Đội ngũ NOVA. không chỉ thiết kế đẹp — họ thực sự hiểu business của chúng tôi và tạo ra chiến lược thương hiệu dài hạn mang lại kết quả đo lường được.',
                'rating'        => 5,
                'order'         => 2,
            ],
            [
                'author_name'   => 'Phạm Đức Toàn',
                'author_title'  => 'Founder · StartupX Vietnam',
                'author_avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80&auto=format&fit=crop&crop=face',
                'content'       => 'Quy trình làm việc rất chuyên nghiệp và minh bạch. Mỗi milestone đều được cập nhật kịp thời. Brand identity mới đã giúp chúng tôi gọi vốn thành công Series A.',
                'rating'        => 5,
                'order'         => 3,
            ],
        ];

        foreach ($testimonials as $t) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order, status)
                 VALUES (?,?,?,?,?,?,'published')",
                [$t['author_name'], $t['author_title'], $t['author_avatar'], $t['content'], $t['rating'], $t['order']]
            );
        }
    }

    private function seedProcessSteps(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM process_steps");
        if ($count > 0) return;

        // Quy trình làm việc từ template
        $steps = [
            ['01', 'Discovery', 'Lắng nghe và phân tích sâu về thương hiệu, thị trường, đối thủ và mục tiêu kinh doanh. Giai đoạn nền tảng quyết định thành công của toàn bộ dự án.', 1],
            ['02', 'Strategy', 'Xây dựng chiến lược thương hiệu và định vị rõ ràng. Xác định tone of voice, personality và hướng thiết kế phù hợp với mục tiêu và đối tượng mục tiêu.', 2],
            ['03', 'Design', 'Hiện thực hóa chiến lược thành hình ảnh trực quan sống động. Từ sketching đến polished design — luôn song hành cùng khách hàng trong mọi bước thiết kế.', 3],
            ['04', 'Launch & Scale', 'Triển khai và hỗ trợ đưa thương hiệu ra thị trường. Theo dõi hiệu quả và tối ưu liên tục để thương hiệu ngày càng mạnh hơn theo thời gian.', 4],
        ];

        foreach ($steps as [$num, $name, $desc, $order]) {
            $this->execute(
                "INSERT INTO process_steps (number, name, description, sort_order, status) VALUES (?,?,?,?,'published')",
                [$num, $name, $desc, $order]
            );
        }
    }

    private function seedAwards(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM awards");
        if ($count > 0) return;

        $awards = [
            ['2024', 'Best Branding Agency — Vietnam Creative Awards', 'Vietnam Creative Association', 1],
            ['2023', 'Gold Award — Brand Identity Campaign', 'ASEAN Design Awards', 2],
            ['2022', 'Top 10 Creative Agencies Vietnam', 'Forbes Vietnam', 3],
        ];

        foreach ($awards as [$year, $title, $org, $order]) {
            $this->execute(
                "INSERT INTO awards (year, title, organization, sort_order) VALUES (?,?,?,?)",
                [$year, $title, $org, $order]
            );
        }
    }
}
