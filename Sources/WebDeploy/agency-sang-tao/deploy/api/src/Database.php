<?php
declare(strict_types=1);

class Database
{
    private static ?Database $instance = null;
    private PDO $pdo;

    private function __construct()
    {
        if (DB_TYPE === 'sqlite') {
            if (!extension_loaded('pdo_sqlite')) {
                throw new \RuntimeException('pdo_sqlite extension is not enabled. Please enable it in your PHP configuration.');
            }
            $dir = dirname(DB_FILE);
            if (!is_dir($dir)) {
                if (!@mkdir($dir, 0755, true) && !is_dir($dir)) {
                    throw new \RuntimeException('Cannot create database directory: ' . $dir . '. Please set write permissions (chmod 755).');
                }
            }
            if (!is_writable($dir)) {
                throw new \RuntimeException('Database directory is not writable: ' . $dir . '. Please set write permissions (chmod 755).');
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

    // â”€â”€ Query helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

    /** Alias of row() — same as queryOne in other DB helpers */
    public function queryOne(string $sql, array $params = []): ?array
    {
        return $this->row($sql, $params);
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

    // â”€â”€ Schema migration â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    private function migrate(): void
    {
        $schemaPath = realpath(__DIR__ . '/../schema.sql');
        if ($schemaPath === false || !file_exists($schemaPath)) {
            throw new \RuntimeException('schema.sql not found at: ' . __DIR__ . '/../schema.sql');
        }
        $schema = file_get_contents($schemaPath);
        if ($schema === false) {
            throw new \RuntimeException('Cannot read schema.sql');
        }
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

    // â”€â”€ Seed default data from template content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
            // general â€” thÃ´ng tin cÆ¡ báº£n cá»§a agency
            ['site_name', 'NOVA.', 'general'],
            ['site_tagline', 'Agency SÃ¡ng Táº¡o Â· Há»“ ChÃ­ Minh Â· Est. 2016', 'general'],
            ['site_description', 'Agency sÃ¡ng táº¡o chuyÃªn branding, thiáº¿t káº¿ vÃ  digital marketing. ChÃºng tÃ´i táº¡o ra nhá»¯ng thÆ°Æ¡ng hiá»‡u Ä‘Ã¡ng nhá»›.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hello@nova.vn', 'general'],
            ['site_phone', '0909 123 456', 'general'],
            ['site_phone_2', '', 'general'],
            ['site_address', '123 Nguyá»…n Huá»‡, Quáº­n 1, TP. Há»“ ChÃ­ Minh', 'general'],
            ['working_hours', 'Thá»© 2 â€“ Thá»© 6, 8:00 â€“ 18:00', 'general'],
            ['site_established', '2016', 'general'],
            ['site_city', 'Há»“ ChÃ­ Minh', 'general'],
            // hero â€” thÃ´ng tin trang chá»§ hero section
            ['hero_line1', 'WE BUILD', 'hero'],
            ['hero_line2', 'BRANDS', 'hero'],
            ['hero_line3', '& STORIES', 'hero'],
            ['hero_tagline', 'Agency SÃ¡ng Táº¡o Â· Há»“ ChÃ­ Minh Â· Est. 2016', 'hero'],
            ['hero_tagline_right', 'Branding Â· Design Â· Digital', 'hero'],
            ['hero_stat1_num', '120', 'hero'],
            ['hero_stat1_suffix', '+', 'hero'],
            ['hero_stat1_label', 'Dá»± Ã¡n hoÃ n thÃ nh', 'hero'],
            ['hero_stat2_num', '80', 'hero'],
            ['hero_stat2_suffix', '+', 'hero'],
            ['hero_stat2_label', 'KhÃ¡ch hÃ ng tin tÆ°á»Ÿng', 'hero'],
            ['hero_stat3_num', '8', 'hero'],
            ['hero_stat3_suffix', '', 'hero'],
            ['hero_stat3_label', 'NÄƒm kinh nghiá»‡m', 'hero'],
            // about â€” trang vá» chÃºng tÃ´i
            ['about_manifesto', 'ChÃºng tÃ´i tin ráº±ng má»i thÆ°Æ¡ng hiá»‡u Ä‘á»u cÃ³ má»™t cÃ¢u chuyá»‡n Ä‘Ã¡ng Ä‘Æ°á»£c ká»ƒ â€” vÃ  thiáº¿t káº¿ chÃ­nh lÃ  ngÃ´n ngá»¯ máº¡nh máº½ nháº¥t Ä‘á»ƒ ká»ƒ cÃ¢u chuyá»‡n Ä‘Ã³.', 'about'],
            ['about_story_title', 'Báº¯t Ä‘áº§u tá»« má»™t studio nhá»', 'about'],
            ['about_story_content', 'NOVA. Ä‘Æ°á»£c thÃ nh láº­p nÄƒm 2016 bá»Ÿi Nguyá»…n Minh QuÃ¢n â€” má»™t designer vá»›i niá»m tin ráº±ng thiáº¿t káº¿ khÃ´ng chá»‰ lÃ  nghá» mÃ  lÃ  sá»© má»‡nh.\n\nTá»« má»™t studio nhá» vá»›i 3 ngÆ°á»i, chÃºng tÃ´i Ä‘Ã£ phÃ¡t triá»ƒn thÃ nh agency 15 thÃ nh viÃªn vá»›i hÆ¡n 120 dá»± Ã¡n thÃ nh cÃ´ng. NhÆ°ng Ä‘iá»u khÃ´ng thay Ä‘á»•i lÃ  cam káº¿t táº¡o ra cÃ´ng viá»‡c xuáº¥t sáº¯c cho má»—i khÃ¡ch hÃ ng.', 'about'],
            ['about_approach_title', 'SÃ¡ng táº¡o cÃ³ má»¥c Ä‘Ã­ch', 'about'],
            ['about_image', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop', 'about'],
            ['about_team_photo', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop', 'about'],
            ['about_team_count', '15', 'about'],
            ['about_team_caption', 'Äá»™i ngÅ© Ä‘a dáº¡ng chuyÃªn mÃ´n â€” designer, strategist, copywriter, developer', 'about'],
            // stats
            ['stats_projects', '120+', 'stats'],
            ['stats_clients', '80+', 'stats'],
            ['stats_years', '8', 'stats'],
            ['stats_awards', '15', 'stats'],
            // cta
            ['cta_label', 'Sáºµn sÃ ng chÆ°a?', 'cta'],
            ['cta_title', "LET'S START YOUR\nNEXT PROJECT", 'cta'],
            ['cta_desc', 'Ká»ƒ cho chÃºng tÃ´i nghe vá» thÆ°Æ¡ng hiá»‡u vÃ  má»¥c tiÃªu cá»§a báº¡n. ChÃºng tÃ´i sáº½ lÃªn káº¿ hoáº¡ch sÃ¡ng táº¡o phÃ¹ há»£p nháº¥t trong vÃ²ng 24 giá».', 'cta'],
            // seo
            ['meta_title', 'NOVA. â€” Agency SÃ¡ng Táº¡o & Branding táº¡i TP. Há»“ ChÃ­ Minh', 'seo'],
            ['meta_description', 'Agency sÃ¡ng táº¡o chuyÃªn branding, thiáº¿t káº¿ vÃ  digital marketing. ChÃºng tÃ´i táº¡o ra nhá»¯ng thÆ°Æ¡ng hiá»‡u Ä‘Ã¡ng nhá»›.', 'seo'],
            ['meta_keywords', 'agency sÃ¡ng táº¡o, branding, thiáº¿t káº¿ thÆ°Æ¡ng hiá»‡u, digital design, campaign', 'seo'],
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
            ['footer_copyright', 'Â© 2026 NOVA. Agency. All rights reserved.', 'footer'],
            ['footer_description', 'Agency sÃ¡ng táº¡o chuyÃªn branding, thiáº¿t káº¿ vÃ  digital marketing. ChÃºng tÃ´i táº¡o ra nhá»¯ng thÆ°Æ¡ng hiá»‡u Ä‘Ã¡ng nhá»›.', 'footer'],
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
            ['maintenance_message', 'Website Ä‘ang báº£o trÃ¬, vui lÃ²ng quay láº¡i sau.', 'system'],
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

        // Dá»‹ch vá»¥ tá»« template: Brand Identity, Digital Design, Campaign & Content
        $services = [
            [
                'name'        => 'Brand Identity',
                'slug'        => 'brand-identity',
                'number'      => '01',
                'description' => 'XÃ¢y dá»±ng bá»™ nháº­n diá»‡n thÆ°Æ¡ng hiá»‡u toÃ n diá»‡n â€” tá»« logo, bá»™ mÃ u sáº¯c, typography Ä‘áº¿n toÃ n bá»™ brand guidelines. ChÃºng tÃ´i táº¡o ra thÆ°Æ¡ng hiá»‡u cÃ³ cÃ¡ tÃ­nh riÃªng vÃ  Ä‘Ã¡ng nhá»› lÃ¢u dÃ i.',
                'tags'        => 'Logo Design,Brand Guidelines,Visual Identity,Brand Strategy',
                'featured'    => 1,
                'sort_order'  => 1,
            ],
            [
                'name'        => 'Digital Design',
                'slug'        => 'digital-design',
                'number'      => '02',
                'description' => 'Thiáº¿t káº¿ giao diá»‡n website, á»©ng dá»¥ng vÃ  cÃ¡c tÃ i sáº£n ká»¹ thuáº­t sá»‘. Tá»« UI/UX research Ä‘áº¿n prototype hoÃ n chá»‰nh â€” má»—i pixel Ä‘á»u cÃ³ má»¥c Ä‘Ã­ch rÃµ rÃ ng vÃ  hÆ°á»›ng Ä‘áº¿n tráº£i nghiá»‡m ngÆ°á»i dÃ¹ng tá»‘i Æ°u.',
                'tags'        => 'UI/UX Design,Web Design,App Design,Prototype',
                'featured'    => 1,
                'sort_order'  => 2,
            ],
            [
                'name'        => 'Campaign & Content',
                'slug'        => 'campaign-content',
                'number'      => '03',
                'description' => 'LÃªn Ã½ tÆ°á»Ÿng vÃ  triá»ƒn khai chiáº¿n dá»‹ch truyá»n thÃ´ng sÃ¡ng táº¡o. Content strategy, social media, video concept â€” chÃºng tÃ´i táº¡o ra ná»™i dung cháº¡m Ä‘áº¿n cáº£m xÃºc vÃ  thÃºc Ä‘áº©y hÃ nh Ä‘á»™ng thá»±c táº¿.',
                'tags'        => 'Campaign Strategy,Content Creation,Social Media,Video Concept',
                'featured'    => 1,
                'sort_order'  => 3,
            ],
            // Sub-services tá»« trang dich-vu.html
            [
                'name'        => 'Logo & Visual Identity',
                'slug'        => 'logo-visual-identity',
                'number'      => '',
                'description' => 'Thiáº¿t káº¿ logo Ä‘á»™c Ä‘Ã¡o vÃ  há»‡ thá»‘ng nháº­n diá»‡n hÃ¬nh áº£nh nháº¥t quÃ¡n pháº£n Ã¡nh Ä‘Ãºng giÃ¡ trá»‹ vÃ  cÃ¡ tÃ­nh thÆ°Æ¡ng hiá»‡u.',
                'tags'        => 'Logo Design,Color Palette,Typography,Brand Usage',
                'featured'    => 0,
                'sort_order'  => 4,
            ],
            [
                'name'        => 'Brand Strategy',
                'slug'        => 'brand-strategy',
                'number'      => '',
                'description' => 'XÃ¢y dá»±ng ná»n táº£ng chiáº¿n lÆ°á»£c thÆ°Æ¡ng hiá»‡u vá»¯ng cháº¯c â€” Ä‘á»‹nh vá»‹, giÃ¡ trá»‹ cá»‘t lÃµi, brand voice vÃ  messaging framework.',
                'tags'        => 'Brand Positioning,Target Audience,Brand Personality,Competitive Analysis',
                'featured'    => 0,
                'sort_order'  => 5,
            ],
            [
                'name'        => 'Campaign Creative',
                'slug'        => 'campaign-creative',
                'number'      => '',
                'description' => 'LÃªn Ã½ tÆ°á»Ÿng vÃ  triá»ƒn khai chiáº¿n dá»‹ch truyá»n thÃ´ng sÃ¡ng táº¡o. Tá»« concept Ä‘áº¿n execution trÃªn má»i kÃªnh truyá»n thÃ´ng.',
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

        // CÃ¡c dá»± Ã¡n máº«u phÃ¹ há»£p vá»›i agency branding/design
        $projects = [
            [
                'title'       => 'Rebranding ThÆ°Æ¡ng Hiá»‡u F&B',
                'slug'        => 'rebranding-thuong-hieu-fb',
                'category'    => 'Brand Identity',
                'industry'    => 'F&B',
                'description' => 'XÃ¢y dá»±ng bá»™ nháº­n diá»‡n thÆ°Æ¡ng hiá»‡u toÃ n diá»‡n cho chuá»—i nhÃ  hÃ ng â€” logo, brand guideline, bá»™ áº¥n pháº©m vÃ  tÃ i liá»‡u truyá»n thÃ´ng.',
                'image'       => 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80&auto=format&fit=crop',
                'client'      => 'NhÃ  hÃ ng PhÆ°Æ¡ng Nam',
                'tags'        => 'Logo,Brand Guide,Stationery',
                'featured'    => 1,
                'sort_order'  => 1,
            ],
            [
                'title'       => 'Website & App UI â€” FinTech Startup',
                'slug'        => 'website-app-ui-fintech',
                'category'    => 'Digital Design',
                'industry'    => 'FinTech',
                'description' => 'Thiáº¿t káº¿ website vÃ  á»©ng dá»¥ng cho startup tÃ i chÃ­nh â€” UI/UX research, wireframe, prototype vÃ  design system hoÃ n chá»‰nh.',
                'image'       => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80&auto=format&fit=crop',
                'client'      => 'PayViet',
                'tags'        => 'UI/UX,Web Design,App',
                'featured'    => 1,
                'sort_order'  => 2,
            ],
            [
                'title'       => 'Campaign Táº¿t 2025',
                'slug'        => 'campaign-tet-2025',
                'category'    => 'Campaign',
                'industry'    => 'FMCG',
                'description' => 'Chiáº¿n dá»‹ch truyá»n thÃ´ng tÃ­ch há»£p mÃ¹a Táº¿t 2025 â€” concept sÃ¡ng táº¡o, key visual, bá»™ áº¥n pháº©m vÃ  social media assets.',
                'image'       => 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=800&q=80&auto=format&fit=crop',
                'client'      => 'Vinamilk',
                'tags'        => 'Campaign,Creative,Print',
                'featured'    => 1,
                'sort_order'  => 3,
            ],
            [
                'title'       => 'Social Media â€” Beauty Brand',
                'slug'        => 'social-media-beauty-brand',
                'category'    => 'Social Media',
                'industry'    => 'Beauty',
                'description' => 'XÃ¢y dá»±ng content strategy vÃ  visual identity cho social media trÃªn cÃ¡c ná»n táº£ng Facebook, Instagram, TikTok.',
                'image'       => 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80&auto=format&fit=crop',
                'client'      => 'BeautÃ© Studio',
                'tags'        => 'Social,Content,TikTok',
                'featured'    => 0,
                'sort_order'  => 4,
            ],
            [
                'title'       => 'Event Branding â€” Tech Summit',
                'slug'        => 'event-branding-tech-summit',
                'category'    => 'Event Branding',
                'industry'    => 'Technology',
                'description' => 'Thiáº¿t káº¿ toÃ n bá»™ branding cho sá»± kiá»‡n Tech Summit â€” backdrop, standee, name card, stage design vÃ  materials.',
                'image'       => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&auto=format&fit=crop',
                'client'      => 'VietTech',
                'tags'        => 'Event,Print,Stage',
                'featured'    => 0,
                'sort_order'  => 5,
            ],
            [
                'title'       => 'Full Brand Identity â€” Startup SaaS',
                'slug'        => 'full-brand-identity-saas',
                'category'    => 'Brand Identity',
                'industry'    => 'SaaS',
                'description' => 'TÃ¡i Ä‘á»‹nh vá»‹ vÃ  rebrand toÃ n diá»‡n cho startup SaaS â€” tá»« chiáº¿n lÆ°á»£c thÆ°Æ¡ng hiá»‡u Ä‘áº¿n toÃ n bá»™ há»‡ thá»‘ng visual identity má»›i.',
                'image'       => 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80&auto=format&fit=crop',
                'client'      => 'CloudStack VN',
                'tags'        => 'Rebranding,Strategy,Identity',
                'featured'    => 1,
                'sort_order'  => 6,
            ],
            [
                'title'       => 'Digital Marketing â€” E-commerce',
                'slug'        => 'digital-marketing-ecommerce',
                'category'    => 'Digital Marketing',
                'industry'    => 'E-commerce',
                'description' => 'Triá»ƒn khai chiáº¿n lÆ°á»£c marketing tá»•ng thá»ƒ â€” SEO, paid ads, content marketing vÃ  email automation.',
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

        // Äá»™i ngÅ© tá»« template (3 thÃ nh viÃªn chÃ­nh + 3 thÃ nh viÃªn phá»¥)
        $members = [
            [
                'name'       => 'Nguyá»…n Minh QuÃ¢n',
                'position'   => 'Founder & Creative Director',
                'experience' => '10 nÄƒm kinh nghiá»‡m Â· Brand Strategy',
                'avatar'     => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=face',
                'order'      => 1,
            ],
            [
                'name'       => 'Tráº§n Thá»‹ Báº£o ChÃ¢u',
                'position'   => 'Lead Visual Designer',
                'experience' => '7 nÄƒm kinh nghiá»‡m Â· Visual & UI',
                'avatar'     => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop&crop=face',
                'order'      => 2,
            ],
            [
                'name'       => 'LÃª HoÃ ng PhÃºc',
                'position'   => 'Digital & Campaign Lead',
                'experience' => '6 nÄƒm kinh nghiá»‡m Â· Marketing & Content',
                'avatar'     => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop&crop=face',
                'order'      => 3,
            ],
            [
                'name'       => 'Pháº¡m NhÆ° Quá»³nh',
                'position'   => 'Brand Designer',
                'experience' => '4 nÄƒm kinh nghiá»‡m',
                'avatar'     => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop&crop=face',
                'order'      => 4,
            ],
            [
                'name'       => 'Há»“ VÄƒn Khang',
                'position'   => 'UI/UX Designer',
                'experience' => '3 nÄƒm kinh nghiá»‡m',
                'avatar'     => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop&crop=face',
                'order'      => 5,
            ],
            [
                'name'       => 'VÅ© Thanh HÃ ',
                'position'   => 'Content Strategist',
                'experience' => '5 nÄƒm kinh nghiá»‡m',
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

        // Testimonials tá»« template (2 blockquotes lá»›n)
        $testimonials = [
            [
                'author_name'   => 'Tráº§n Quá»‘c Báº£o',
                'author_title'  => 'CEO Â· CÃ´ng ty Minh PhÃ¡t Group',
                'author_avatar' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80&auto=format&fit=crop&crop=face',
                'content'       => 'NOVA. Ä‘Ã£ hoÃ n toÃ n thay Ä‘á»•i cÃ¡ch thÆ°Æ¡ng hiá»‡u chÃºng tÃ´i Ä‘Æ°á»£c nhÃ¬n nháº­n trÃªn thá»‹ trÆ°á»ng. Tá»« má»™t brand má» nháº¡t, chÃºng tÃ´i trá»Ÿ thÃ nh cÃ¡i tÃªn má»i ngÆ°á»i nhá»› Ä‘áº¿n Ä‘áº§u tiÃªn trong ngÃ nh.',
                'rating'        => 5,
                'order'         => 1,
            ],
            [
                'author_name'   => 'Nguyá»…n Thá»‹ Lan PhÆ°Æ¡ng',
                'author_title'  => 'CMO Â· TechViet Corporation',
                'author_avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80&auto=format&fit=crop&crop=face',
                'content'       => 'Äá»™i ngÅ© NOVA. khÃ´ng chá»‰ thiáº¿t káº¿ Ä‘áº¹p â€” há» thá»±c sá»± hiá»ƒu business cá»§a chÃºng tÃ´i vÃ  táº¡o ra chiáº¿n lÆ°á»£c thÆ°Æ¡ng hiá»‡u dÃ i háº¡n mang láº¡i káº¿t quáº£ Ä‘o lÆ°á»ng Ä‘Æ°á»£c.',
                'rating'        => 5,
                'order'         => 2,
            ],
            [
                'author_name'   => 'Pháº¡m Äá»©c ToÃ n',
                'author_title'  => 'Founder Â· StartupX Vietnam',
                'author_avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80&auto=format&fit=crop&crop=face',
                'content'       => 'Quy trÃ¬nh lÃ m viá»‡c ráº¥t chuyÃªn nghiá»‡p vÃ  minh báº¡ch. Má»—i milestone Ä‘á»u Ä‘Æ°á»£c cáº­p nháº­t ká»‹p thá»i. Brand identity má»›i Ä‘Ã£ giÃºp chÃºng tÃ´i gá»i vá»‘n thÃ nh cÃ´ng Series A.',
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

        // Quy trÃ¬nh lÃ m viá»‡c tá»« template
        $steps = [
            ['01', 'Discovery', 'Láº¯ng nghe vÃ  phÃ¢n tÃ­ch sÃ¢u vá» thÆ°Æ¡ng hiá»‡u, thá»‹ trÆ°á»ng, Ä‘á»‘i thá»§ vÃ  má»¥c tiÃªu kinh doanh. Giai Ä‘oáº¡n ná»n táº£ng quyáº¿t Ä‘á»‹nh thÃ nh cÃ´ng cá»§a toÃ n bá»™ dá»± Ã¡n.', 1],
            ['02', 'Strategy', 'XÃ¢y dá»±ng chiáº¿n lÆ°á»£c thÆ°Æ¡ng hiá»‡u vÃ  Ä‘á»‹nh vá»‹ rÃµ rÃ ng. XÃ¡c Ä‘á»‹nh tone of voice, personality vÃ  hÆ°á»›ng thiáº¿t káº¿ phÃ¹ há»£p vá»›i má»¥c tiÃªu vÃ  Ä‘á»‘i tÆ°á»£ng má»¥c tiÃªu.', 2],
            ['03', 'Design', 'Hiá»‡n thá»±c hÃ³a chiáº¿n lÆ°á»£c thÃ nh hÃ¬nh áº£nh trá»±c quan sá»‘ng Ä‘á»™ng. Tá»« sketching Ä‘áº¿n polished design â€” luÃ´n song hÃ nh cÃ¹ng khÃ¡ch hÃ ng trong má»i bÆ°á»›c thiáº¿t káº¿.', 3],
            ['04', 'Launch & Scale', 'Triá»ƒn khai vÃ  há»— trá»£ Ä‘Æ°a thÆ°Æ¡ng hiá»‡u ra thá»‹ trÆ°á»ng. Theo dÃµi hiá»‡u quáº£ vÃ  tá»‘i Æ°u liÃªn tá»¥c Ä‘á»ƒ thÆ°Æ¡ng hiá»‡u ngÃ y cÃ ng máº¡nh hÆ¡n theo thá»i gian.', 4],
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
            ['2024', 'Best Branding Agency â€” Vietnam Creative Awards', 'Vietnam Creative Association', 1],
            ['2023', 'Gold Award â€” Brand Identity Campaign', 'ASEAN Design Awards', 2],
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

