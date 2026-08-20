<?php
declare(strict_types=1);

class Database {
    private \PDO $pdo;
    private static ?Database $instance = null;

    private function __construct() {
        if (DB_TYPE === 'sqlite') {
            $dir = dirname(DB_FILE);
            if (!is_dir($dir)) {
                if (!mkdir($dir, 0755, true) && !is_dir($dir)) {
                    throw new \RuntimeException('Cannot create database directory: ' . $dir);
                }
            }
            if (!is_writable($dir)) {
                throw new \RuntimeException('Database directory is not writable: ' . $dir);
            }
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
        // ⚠️ PHẢI check false — nếu schema.sql thiếu, tables không được tạo
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
        $this->seedServices();
        $this->seedProjects();
        $this->seedTeamMembers();
        $this->seedTestimonials();
        $this->seedFaqs();
        $this->seedPricingPlans();
        $this->backfillProjectCaseStudy();
    }

    private function seedUsers(): void {
        if ($this->scalar("SELECT COUNT(*) FROM users") > 0) return;
        // ⚠️ Tài khoản mặc định cố định — KHÔNG thay đổi
        $this->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['sysadmin', 'sysadmin@admin.com', password_hash('123456', PASSWORD_BCRYPT), 'superadmin']
        );
    }

    private function seedSettings(): void {
        if ($this->scalar("SELECT COUNT(*) FROM settings") > 0) return;
        $rows = [
            // general
            ['site_name',        'Agency Sáng Tạo',                                   'general'],
            ['site_description', 'Agency sáng tạo chuyên branding, thiết kế, marketing và digital creative. Chúng tôi tạo ra những thương hiệu đáng nhớ.', 'general'],
            ['site_logo',        '',                                                     'general'],
            ['site_favicon',     '',                                                     'general'],
            ['site_email',       'hello@agencysangtao.vn',                               'general'],
            ['site_phone',       '0909 123 456',                                         'general'],
            ['site_phone_2',     '',                                                     'general'],
            ['site_address',     'Tầng 5, Tòa nhà Creative Hub, 123 Nguyễn Huệ, Quận 1, TP.HCM', 'general'],
            ['working_hours',    'Thứ 2 – Thứ 6: 8:30 – 18:00 | Thứ 7: 9:00 – 12:00', 'general'],
            // seo
            ['meta_title',       'Agency Sáng Tạo — Branding & Digital Creative',       'seo'],
            ['meta_description', 'Agency sáng tạo chuyên branding, thiết kế, marketing và digital creative tại TP.HCM. Chúng tôi tạo ra những thương hiệu đáng nhớ.', 'seo'],
            ['meta_keywords',    'agency, branding, thiết kế, digital marketing, creative, brand identity', 'seo'],
            ['og_image',         '',                                                     'seo'],
            ['google_analytics_id','',                                                   'seo'],
            // social
            ['social_facebook',  '',                                                     'social'],
            ['social_youtube',   '',                                                     'social'],
            ['social_instagram', '',                                                     'social'],
            ['social_tiktok',    '',                                                     'social'],
            ['social_zalo',      '',                                                     'social'],
            ['social_behance',   '',                                                     'social'],
            ['social_linkedin',  '',                                                     'social'],
            // design
            ['primary_color',    '#f59e0b',                                              'design'],
            ['secondary_color',  '#d97706',                                              'design'],
            // footer
            ['footer_copyright', '© 2024 Agency Sáng Tạo. All rights reserved.',        'footer'],
            ['footer_description','Agency sáng tạo chuyên branding, thiết kế và digital marketing. Chúng tôi tạo ra những thương hiệu đáng nhớ.', 'footer'],
            ['footer_show_social','1',                                                   'footer'],
            // contact
            ['contact_form_enabled', '1',                                                'contact'],
            ['contact_email_receiver','hello@agencysangtao.vn',                          'contact'],
            ['google_map_embed', '',                                                      'contact'],
            // smtp
            ['smtp_host',   'smtp.gmail.com',                                            'smtp'],
            ['smtp_port',   '587',                                                        'smtp'],
            ['smtp_user',   '',                                                           'smtp'],
            ['smtp_password','',                                                          'smtp'],
            ['smtp_from_name','Agency Sáng Tạo',                                         'smtp'],
            ['smtp_from_email','',                                                        'smtp'],
            // system
            ['maintenance_mode',    '0',                                                  'system'],
            ['maintenance_message', 'Website đang bảo trì. Vui lòng quay lại sau.',     'system'],
            // about / hero
            ['hero_tagline',     'Agency Sáng Tạo · TP.HCM · Est. 2016',                'hero'],
            ['hero_year',        'Branding · Design · Digital',                           'hero'],
            ['hero_line1',       'WE BUILD',                                              'hero'],
            ['hero_line2',       'BRANDS',                                                'hero'],
            ['hero_line3',       '& STORIES',                                             'hero'],
            ['stat_projects',    '120+',                                                  'stats'],
            ['stat_clients',     '80+',                                                   'stats'],
            ['stat_years',       '8',                                                     'stats'],
            ['stat_awards',      '15',                                                    'stats'],
            // about
            ['about_title',      'Chúng tôi là ai',                                      'about'],
            ['about_content',    'Agency Sáng Tạo là đội ngũ những người yêu thương hiệu, thiết kế và sáng tạo. Chúng tôi tin rằng một thương hiệu mạnh là nền tảng cho mọi thành công kinh doanh.', 'about'],
            ['about_image',      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop', 'about'],
            ['team_hero_title',  'The Team Behind The Work',                              'about'],
            ['team_hero_sub',    '15 chuyên gia sáng tạo với hơn 8 năm kinh nghiệm',     'about'],
            // cloudinary
            ['cloudinary_cloud_name', '',                                                  'cloudinary'],
            ['cloudinary_api_key',    '',                                                  'cloudinary'],
            ['cloudinary_api_secret', '',                                                  'cloudinary'],
            ['cloudinary_folder',     'agency-sang-tao',                                  'cloudinary'],
            // integrations
            ['unsplash_access_key',   'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY',    'integrations'],
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
                'title'       => 'WE BUILD BRANDS & STORIES',
                'subtitle'    => 'Agency sáng tạo chuyên branding, thiết kế và digital marketing. Chúng tôi tạo ra những thương hiệu đáng nhớ lâu dài.',
                'button_text' => 'Xem dự án',
                'button_link' => '/du-an',
                'image'       => 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&q=80&auto=format&fit=crop',
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

    private function seedServices(): void {
        if ($this->scalar("SELECT COUNT(*) FROM services") > 0) return;
        $services = [
            [
                'name'        => 'Brand Identity',
                'slug'        => 'brand-identity',
                'description' => 'Xây dựng bộ nhận diện thương hiệu toàn diện — từ logo, bộ màu sắc, typography đến toàn bộ brand guidelines. Chúng tôi tạo ra thương hiệu có cá tính riêng và đáng nhớ lâu dài.',
                'icon'        => '◆',
                'tags'        => 'Logo Design,Brand Guidelines,Visual Identity,Brand Strategy',
                'featured'    => 1,
                'sort_order'  => 1,
            ],
            [
                'name'        => 'Digital Design',
                'slug'        => 'digital-design',
                'description' => 'Thiết kế giao diện website, ứng dụng và các tài sản kỹ thuật số. Từ UI/UX research đến prototype hoàn chỉnh — mỗi pixel đều có mục đích rõ ràng và hướng đến trải nghiệm người dùng tối ưu.',
                'icon'        => '■',
                'tags'        => 'UI/UX Design,Web Design,App Design,Prototype',
                'featured'    => 1,
                'sort_order'  => 2,
            ],
            [
                'name'        => 'Campaign & Content',
                'slug'        => 'campaign-content',
                'description' => 'Lên ý tưởng và triển khai chiến dịch truyền thông sáng tạo. Content strategy, social media, video concept — chúng tôi tạo ra nội dung chạm đến cảm xúc và thúc đẩy hành động thực tế.',
                'icon'        => '▲',
                'tags'        => 'Campaign Strategy,Content Creation,Social Media,Video Concept',
                'featured'    => 1,
                'sort_order'  => 3,
            ],
            [
                'name'        => 'Brand Strategy',
                'slug'        => 'brand-strategy',
                'description' => 'Xây dựng nền tảng chiến lược thương hiệu vững chắc — định vị, giá trị cốt lõi, brand voice và messaging framework.',
                'icon'        => '◇',
                'tags'        => 'Brand Positioning,Target Audience,Brand Voice,Competitive Analysis',
                'featured'    => 0,
                'sort_order'  => 4,
            ],
            [
                'name'        => 'Brand Collateral',
                'slug'        => 'brand-collateral',
                'description' => 'Thiết kế toàn bộ ấn phẩm thương hiệu — từ name card, letterhead đến bao bì, catalog và POP materials.',
                'icon'        => '△',
                'tags'        => 'Business Card,Packaging Design,Catalog,Signage',
                'featured'    => 0,
                'sort_order'  => 5,
            ],
            [
                'name'        => 'Campaign Creative',
                'slug'        => 'campaign-creative',
                'description' => 'Lên ý tưởng và triển khai chiến dịch truyền thông sáng tạo. Từ concept đến execution trên mọi kênh truyền thông.',
                'icon'        => '▽',
                'tags'        => 'Campaign Concept,Key Visual,Multi-channel Assets,Performance Tracking',
                'featured'    => 0,
                'sort_order'  => 6,
            ],
        ];
        foreach ($services as $s) {
            $this->execute(
                "INSERT INTO services (name, slug, description, icon, tags, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [$s['name'], $s['slug'], $s['description'], $s['icon'], $s['tags'], $s['featured'], $s['sort_order']]
            );
        }
    }

    private function seedProjects(): void {
        if ($this->scalar("SELECT COUNT(*) FROM projects") > 0) return;
        $projects = [
            [
                'title'       => 'Rebrand Thương Hiệu Nhà Hàng Fusion',
                'slug'        => 'rebrand-nha-hang-fusion',
                'category'    => 'Brand Identity',
                'description' => 'Xây dựng bộ nhận diện thương hiệu toàn diện — logo, brand guideline, bộ ấn phẩm và tài liệu truyền thông.',
                'image'       => 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80&auto=format&fit=crop',
                'tags'        => 'Logo,Brand Guide,Stationery',
                'client_name' => 'Fusion Dining Group',
                'featured'    => 1,
                'sort_order'  => 1,
            ],
            [
                'title'       => 'Website & App Design cho Fintech Startup',
                'slug'        => 'website-app-design-fintech',
                'category'    => 'Digital Design',
                'description' => 'Thiết kế website và ứng dụng mobile — UI/UX research, wireframe, prototype và design system hoàn chỉnh.',
                'image'       => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80&auto=format&fit=crop',
                'tags'        => 'UI/UX,Web Design,App',
                'client_name' => 'PayFlow Vietnam',
                'featured'    => 1,
                'sort_order'  => 2,
            ],
            [
                'title'       => 'Chiến Dịch Ra Mắt Sản Phẩm FMCG',
                'slug'        => 'chien-dich-ra-mat-san-pham-fmcg',
                'category'    => 'Campaign',
                'description' => 'Chiến dịch truyền thông tích hợp — concept, creative assets và execution trên đa kênh truyền thông.',
                'image'       => 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=800&q=80&auto=format&fit=crop',
                'tags'        => 'Campaign,Creative,OOH',
                'client_name' => 'Thực phẩm Xanh',
                'featured'    => 1,
                'sort_order'  => 3,
            ],
            [
                'title'       => 'Social Media Branding Cho Fashion Brand',
                'slug'        => 'social-media-fashion-brand',
                'category'    => 'Social Media',
                'description' => 'Xây dựng content strategy và visual identity cho social media trên Facebook, Instagram, TikTok.',
                'image'       => 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80&auto=format&fit=crop',
                'tags'        => 'Social,Content,Strategy',
                'client_name' => 'MODO Fashion',
                'featured'    => 0,
                'sort_order'  => 4,
            ],
            [
                'title'       => 'Event Branding Hội Nghị Công Nghệ',
                'slug'        => 'event-branding-hoi-nghi-cong-nghe',
                'category'    => 'Event Branding',
                'description' => 'Thiết kế toàn bộ branding cho hội nghị — backdrop, standee, name card, stage design.',
                'image'       => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&auto=format&fit=crop',
                'tags'        => 'Event,Print,Stage',
                'client_name' => 'TechForum Vietnam',
                'featured'    => 0,
                'sort_order'  => 5,
            ],
            [
                'title'       => 'Digital Marketing Tổng Thể E-commerce',
                'slug'        => 'digital-marketing-ecommerce',
                'category'    => 'Digital Marketing',
                'description' => 'Triển khai chiến lược marketing tổng thể — SEO, paid ads, content marketing và automation.',
                'image'       => 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80&auto=format&fit=crop',
                'tags'        => 'SEO,Ads,Analytics',
                'client_name' => 'ShopViet Online',
                'featured'    => 0,
                'sort_order'  => 6,
            ],
        ];
        foreach ($projects as $p) {
            $this->execute(
                "INSERT INTO projects (title, slug, category, description, image, tags, client_name, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [$p['title'], $p['slug'], $p['category'], $p['description'], $p['image'], $p['tags'], $p['client_name'], $p['featured'], $p['sort_order']]
            );
        }
    }

    // ⚠️ Chạy độc lập với seedProjects() (không có guard COUNT>0) — đảm bảo các dự án
    // đã seed từ trước (trước khi có cột case-study) vẫn được điền dữ liệu mẫu cho
    // trang chi tiết /du-an/:slug. Chỉ điền khi year còn NULL — không ghi đè nội dung
    // khách đã tự chỉnh qua admin.
    private function backfillProjectCaseStudy(): void {
        $cases = [
            'rebrand-nha-hang-fusion' => [
                'year' => '2024',
                'duration' => '6 tuần',
                'scope_text' => 'Brand Strategy, Logo, Guidelines',
                'result_summary' => '+40% nhận diện thương hiệu',
                'challenge' => "Fusion Dining Group tìm đến chúng tôi sau 3 năm hoạt động với bộ nhận diện cũ không còn phản ánh đúng định vị và tham vọng mở rộng chuỗi nhà hàng. Logo thiếu tính nhận diện, bộ màu sử dụng không nhất quán giữa các chi nhánh, khiến khách hàng khó ghi nhớ thương hiệu giữa hàng loạt đối thủ F&B cùng phân khúc.\n\nBài toán đặt ra không chỉ là \"làm đẹp hơn\" — mà là xây dựng một hệ thống nhận diện đủ linh hoạt để nhân rộng sang các chi nhánh mới trong 3-5 năm tới, đồng thời giữ được sự liên kết với tệp khách hàng trung thành đã quen thuộc với thương hiệu cũ.",
                'solution' => "Chúng tôi triển khai theo quy trình 4 bước: audit toàn bộ tài sản thương hiệu hiện có, workshop chiến lược cùng ban lãnh đạo, phát triển 3 hướng concept song song, và tinh chỉnh dựa trên feedback trước khi hoàn thiện bộ guideline đầy đủ.\n\n- Audit & Discovery — đánh giá toàn bộ điểm chạm thương hiệu hiện tại, phỏng vấn đội ngũ nội bộ và khảo sát nhanh khách hàng thân thiết\n- Brand Strategy Workshop — thống nhất định vị, giá trị cốt lõi và tông giọng thương hiệu mới cùng ban lãnh đạo\n- Design Exploration — phát triển 3 hướng concept logo & màu sắc khác biệt, trình bày và lấy feedback\n- Refine & Rollout — hoàn thiện concept được chọn, xây dựng brand guideline chi tiết và bộ ấn phẩm triển khai thực tế cho từng chi nhánh",
                'gallery_images' => "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80&auto=format&fit=crop\nhttps://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80&auto=format&fit=crop\nhttps://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80&auto=format&fit=crop",
                'stats' => "40|%|Tăng nhận diện thương hiệu\n65|%|Tăng tương tác social\n120|+|Ấn phẩm được chuẩn hóa\n6| tuần|Thời gian hoàn thành",
                'testimonial_content' => 'Agency Sáng Tạo không chỉ mang đến một bộ logo đẹp — họ giúp chúng tôi hiểu rõ hơn về chính thương hiệu của mình. Bộ nhận diện mới đã trở thành nền tảng cho mọi hoạt động marketing sau này.',
                'testimonial_author' => 'Phạm Anh Tuấn',
                'testimonial_title' => 'CEO · Fusion Dining Group',
                'testimonial_avatar' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80&auto=format&fit=crop',
            ],
            'website-app-design-fintech' => [
                'year' => '2024',
                'duration' => '8 tuần',
                'scope_text' => 'UX Research, UI Design, Prototype',
                'result_summary' => '+55% tỷ lệ chuyển đổi',
                'challenge' => "Website cũ của PayFlow Vietnam được xây dựng đã hơn 5 năm, giao diện lỗi thời và không tối ưu trên di động — trong khi hơn 65% lượt truy cập đến từ điện thoại. Tỷ lệ khách rời trang ngay ở bước đầu (bounce rate) cao bất thường, và luồng thao tác từ trang sản phẩm đến bước đăng ký quá nhiều bước gây mất khách giữa chừng.\n\nĐội ngũ nội bộ của PayFlow cũng gặp khó khi cập nhật nội dung — mọi thay đổi nhỏ đều phải nhờ bên thứ ba can thiệp code, khiến chi phí vận hành website tăng cao theo thời gian.",
                'solution' => "Chúng tôi bắt đầu bằng UX audit và phỏng vấn người dùng thực tế để xác định đúng điểm nghẽn trong hành trình đăng ký, trước khi thiết kế lại toàn bộ information architecture và giao diện mobile-first.\n\n- UX Research & Audit — phân tích heatmap, phỏng vấn 12 người dùng thực tế và benchmark đối thủ cùng ngành fintech\n- Information Architecture — rút gọn luồng từ trang sản phẩm đến đăng ký từ 5 bước xuống còn 2 bước\n- UI Design — thiết kế mobile-first, xây dựng design system component tái sử dụng cho toàn bộ site\n- Prototype & Handoff — bàn giao prototype tương tác đầy đủ kèm tài liệu specs cho đội dev",
                'gallery_images' => "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80&auto=format&fit=crop\nhttps://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80&auto=format&fit=crop\nhttps://images.unsplash.com/photo-1559028006-448665bd7c7f?w=800&q=80&auto=format&fit=crop",
                'stats' => "55|%|Tăng tỷ lệ chuyển đổi\n42|%|Giảm tỷ lệ rời trang\n3|x|Tốc độ tải trang nhanh hơn\n8| tuần|Thời gian hoàn thành",
                'testimonial_content' => 'Đội ngũ Agency Sáng Tạo không chỉ làm đẹp giao diện — họ giúp chúng tôi hiểu được người dùng thực sự cần gì. Website mới giúp đội sale của chúng tôi chốt đơn nhanh hơn hẳn.',
                'testimonial_author' => 'Nguyễn Thu Hà',
                'testimonial_title' => 'CMO · PayFlow Vietnam',
                'testimonial_avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80&auto=format&fit=crop',
            ],
        ];
        foreach ($cases as $slug => $c) {
            $row = $this->queryOne("SELECT id, year FROM projects WHERE slug=?", [$slug]);
            if (!$row || $row['year'] !== null) continue;
            $this->execute(
                "UPDATE projects SET year=?, duration=?, scope_text=?, result_summary=?, challenge=?, solution=?, gallery_images=?, stats=?, testimonial_content=?, testimonial_author=?, testimonial_title=?, testimonial_avatar=? WHERE id=?",
                [$c['year'], $c['duration'], $c['scope_text'], $c['result_summary'], $c['challenge'], $c['solution'], $c['gallery_images'], $c['stats'], $c['testimonial_content'], $c['testimonial_author'], $c['testimonial_title'], $c['testimonial_avatar'], $row['id']]
            );
        }
    }

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $faqs = [
            ['Thời gian thực hiện một dự án brand identity là bao lâu?', 'Tùy thuộc vào scope của dự án. Một brand starter pack thường mất 2–3 tuần. Full brand identity mất 4–8 tuần. Chúng tôi luôn thống nhất timeline cụ thể trước khi bắt đầu.'],
            ['Quy trình thanh toán như thế nào?', 'Chúng tôi chia thanh toán thành 2–3 đợt: 50% khi ký hợp đồng, 50% còn lại khi bàn giao. Với dự án lớn có thể chia thêm đợt giữa theo milestone.'],
            ['Tôi có thể yêu cầu sửa đổi bao nhiêu lần?', 'Mỗi phase thiết kế bao gồm 2–3 vòng feedback/revision. Revision thêm ngoài phạm vi sẽ được tính phí theo giờ, đã thông báo rõ trong hợp đồng.'],
            ['Tôi có được nhận file gốc (source file) không?', 'Có — chúng tôi bàn giao đầy đủ file gốc (AI, PSD, Figma...) cùng file xuất (PDF, PNG, SVG) ở mọi kích thước cần thiết.'],
            ['Agency có hỗ trợ sau khi bàn giao dự án không?', 'Có — chúng tôi hỗ trợ miễn phí trong 30 ngày sau bàn giao cho các điều chỉnh nhỏ. Với nhu cầu dài hạn, chúng tôi có gói retainer hàng tháng.'],
            ['Tôi có thể chỉ thuê một phần dịch vụ, không cần trọn gói?', 'Có — chúng tôi nhận cả dự án lẻ (chỉ logo, chỉ website...) lẫn gói toàn diện. Báo giá sẽ được điều chỉnh theo đúng scope thực tế bạn cần.'],
            ['Agency có nhận dự án ở tỉnh khác hoặc khách hàng quốc tế không?', 'Có — phần lớn quy trình làm việc qua online (call, Figma, Google Meet) nên không giới hạn địa lý. Với khách tại TP.HCM chúng tôi luôn sẵn sàng gặp trực tiếp khi cần.'],
        ];
        $order = 1;
        foreach ($faqs as [$q, $a]) {
            $this->execute(
                "INSERT INTO faqs (question, answer, page, sort_order) VALUES (?, ?, 'dich-vu', ?)",
                [$q, $a, $order++]
            );
        }
    }

    private function seedPricingPlans(): void {
        if ($this->scalar("SELECT COUNT(*) FROM pricing_plans") > 0) return;
        $plans = [
            ['name' => 'Brand Starter Pack', 'price' => 'Từ 15 triệu', 'description' => 'Logo + màu sắc + font + name card. Phù hợp cho startup mới bắt đầu.', 'features' => "Logo design (primary + variations)\nColor palette & typography\nBusiness card & stationery\n1 vòng revision", 'is_featured' => 0, 'cta_text' => 'Tư vấn', 'sort_order' => 1],
            ['name' => 'Full Brand Identity', 'price' => 'Từ 45 triệu', 'description' => 'Bộ nhận diện đầy đủ + brand guideline + bộ ấn phẩm cơ bản. Dành cho SME.', 'features' => "Toàn bộ hạng mục gói Starter\nBrand strategy & positioning\nBrand guideline chi tiết\nBộ ấn phẩm marketing cơ bản\n3 vòng revision", 'is_featured' => 1, 'cta_text' => 'Tư vấn ngay', 'sort_order' => 2],
            ['name' => 'Brand + Digital + Campaign', 'price' => 'Liên hệ', 'description' => 'Giải pháp toàn diện — brand identity, website, campaign và nội dung. Dành cho doanh nghiệp.', 'features' => "Toàn bộ hạng mục gói Full Brand\nThiết kế & phát triển website\nChiến dịch ra mắt thương hiệu\nContent strategy 3 tháng đầu", 'is_featured' => 0, 'cta_text' => 'Tư vấn', 'sort_order' => 3],
        ];
        foreach ($plans as $pl) {
            $this->execute(
                "INSERT INTO pricing_plans (name, price, description, features, is_featured, cta_text, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [$pl['name'], $pl['price'], $pl['description'], $pl['features'], $pl['is_featured'], $pl['cta_text'], $pl['sort_order']]
            );
        }
    }

    private function seedTeamMembers(): void {
        if ($this->scalar("SELECT COUNT(*) FROM team_members") > 0) return;
        $members = [
            [
                'name'       => 'Nguyễn Minh Khoa',
                'position'   => 'Creative Director',
                'bio'        => 'Người đứng sau chiến lược thương hiệu và vision sáng tạo của mọi dự án.',
                'avatar'     => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&face',
                'experience' => '10 năm kinh nghiệm · Brand & Strategy',
                'sort_order' => 1,
            ],
            [
                'name'       => 'Trần Linh Anh',
                'position'   => 'Lead Designer',
                'bio'        => 'Chuyên gia về visual identity và UI/UX với con mắt thẩm mỹ xuất sắc.',
                'avatar'     => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop&face',
                'experience' => '7 năm kinh nghiệm · Visual & UI',
                'sort_order' => 2,
            ],
            [
                'name'       => 'Lê Trung Kiên',
                'position'   => 'Campaign Lead',
                'bio'        => 'Bộ não chiến lược đằng sau mọi chiến dịch truyền thông sáng tạo.',
                'avatar'     => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop&face',
                'experience' => '8 năm kinh nghiệm · Marketing & Content',
                'sort_order' => 3,
            ],
        ];
        foreach ($members as $m) {
            $this->execute(
                "INSERT INTO team_members (name, position, bio, avatar, experience, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                [$m['name'], $m['position'], $m['bio'], $m['avatar'], $m['experience'], $m['sort_order']]
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $testimonials = [
            [
                'author_name'   => 'Phạm Anh Tuấn',
                'author_title'  => 'CEO · Fusion Dining Group',
                'author_avatar' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80&auto=format&fit=crop',
                'content'       => 'Agency Sáng Tạo đã hoàn toàn thay đổi cách thương hiệu chúng tôi được nhìn nhận trên thị trường. Từ một brand mờ nhạt, chúng tôi trở thành cái tên mọi người nhớ đến đầu tiên trong ngành.',
                'rating'        => 5,
                'sort_order'    => 1,
            ],
            [
                'author_name'   => 'Nguyễn Thu Hà',
                'author_title'  => 'CMO · PayFlow Vietnam',
                'author_avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80&auto=format&fit=crop',
                'content'       => 'Đội ngũ Agency Sáng Tạo không chỉ thiết kế đẹp — họ thực sự hiểu business của chúng tôi và tạo ra chiến lược thương hiệu dài hạn mang lại kết quả đo lường được.',
                'rating'        => 5,
                'sort_order'    => 2,
            ],
        ];
        foreach ($testimonials as $t) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                [$t['author_name'], $t['author_title'], $t['author_avatar'], $t['content'], $t['rating'], $t['sort_order']]
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
