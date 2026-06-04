<?php

class Database {
    private static ?Database $instance = null;
    private PDO $pdo;

    private function __construct() {
        if (DB_TYPE === 'sqlite') {
            $dir = dirname(DB_FILE);
            if (!is_dir($dir)) mkdir($dir, 0755, true);
            $this->pdo = new PDO('sqlite:' . DB_FILE);
            $this->pdo->exec('PRAGMA foreign_keys = ON');
            $this->pdo->exec('PRAGMA journal_mode = WAL');
            $this->pdo->exec('PRAGMA synchronous = NORMAL');
        } else {
            $dsn = DB_TYPE . ':host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS);
        }
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $this->migrate();
    }

    public static function getInstance(): Database {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function pdo(): PDO { return $this->pdo; }

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

    public function scalar(string $sql, array $params = []) {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch(PDO::FETCH_NUM);
        return $row ? $row[0] : null;
    }

    public function execute(string $sql, array $params = []) {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        if (stripos(trim($sql), 'INSERT') === 0) {
            return $this->pdo->lastInsertId();
        }
        return $stmt->rowCount();
    }

    private function migrate(): void {
        $schemaPath = __DIR__ . '/../schema.sql';
        $schema = file_get_contents($schemaPath);
        // ⚠️ PHẢI check false — nếu schema.sql thiếu, tables không được tạo
        //    nhưng seedData() vẫn chạy → PDOException "no such table" → 500 im lặng
        if ($schema === false) {
            throw new \RuntimeException('schema.sql not found at ' . $schemaPath);
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
        $this->seedFeatures();
        $this->seedPricingPlans();
        $this->seedTestimonials();
        $this->seedFaqs();
    }

    private function seedUsers(): void {
        if ($this->scalar("SELECT COUNT(*) FROM users") > 0) return;
        $this->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['sysadmin', 'sysadmin@admin.com', password_hash('123456', PASSWORD_BCRYPT), 'superadmin']
        );
    }

    private function seedSettings(): void {
        if ($this->scalar("SELECT COUNT(*) FROM settings") > 0) return;

        $settings = [
            // general
            ['site_name',          'TechFlow',                                          'general'],
            ['site_tagline',       'Nền tảng tự động hóa thông minh',                  'general'],
            ['site_description',   'TechFlow giúp doanh nghiệp Việt Nam tự động hóa quy trình, phân tích dữ liệu real-time và tăng hiệu suất vận hành lên tới 40%.', 'general'],
            ['site_logo',          '',                                                   'general'],
            ['site_favicon',       '',                                                   'general'],
            ['site_email',         'hello@techflow.vn',                                 'general'],
            ['site_phone',         '1900 1234',                                         'general'],
            ['site_phone_2',       '0901 234 567',                                      'general'],
            ['site_address',       'Tầng 10, Tòa nhà Landmark 81, TP. Hồ Chí Minh',   'general'],
            ['working_hours',      "Thứ Hai – Thứ Sáu: 8:00 – 18:00\nThứ Bảy: 9:00 – 12:00", 'general'],
            // seo
            ['meta_title',         'TechFlow — Nền tảng tự động hóa thông minh cho doanh nghiệp Việt Nam', 'seo'],
            ['meta_description',   'TechFlow giúp doanh nghiệp tự động hóa quy trình, phân tích dữ liệu real-time và đưa ra quyết định thông minh hơn. Dùng thử miễn phí 14 ngày.', 'seo'],
            ['meta_keywords',      'tự động hóa, phân tích dữ liệu, startup, SaaS, phần mềm quản lý doanh nghiệp', 'seo'],
            ['og_image',           '',                                                   'seo'],
            ['google_analytics_id','',                                                   'seo'],
            // social
            ['social_facebook',    '',                                                   'social'],
            ['social_linkedin',    '',                                                   'social'],
            ['social_youtube',     '',                                                   'social'],
            ['social_twitter',     '',                                                   'social'],
            ['social_zalo',        '',                                                   'social'],
            ['social_tiktok',      '',                                                   'social'],
            // design
            ['primary_color',      '#7c3aed',                                           'design'],
            ['secondary_color',    '#a855f7',                                           'design'],
            // footer
            ['footer_copyright',   '© 2024 TechFlow. Bản quyền được bảo lưu.',         'footer'],
            ['footer_description', 'Nền tảng tự động hóa thông minh giúp doanh nghiệp Việt Nam vận hành hiệu quả hơn mỗi ngày.', 'footer'],
            ['footer_show_social', '1',                                                  'footer'],
            // contact
            ['contact_form_enabled',   '1',                                             'contact'],
            ['contact_email_receiver', 'hello@techflow.vn',                            'contact'],
            ['google_map_embed',       '',                                               'contact'],
            // about / hero
            ['hero_badge',         'Ra mắt v2.0 — Thử nghiệm miễn phí 14 ngày',       'about'],
            ['hero_heading',       'Giải pháp tự động hóa cho doanh nghiệp Việt Nam.', 'about'],
            ['hero_sub',           'TechFlow giúp đội ngũ của bạn tự động hóa quy trình, phân tích dữ liệu real-time và đưa ra quyết định thông minh hơn — không cần kiến thức kỹ thuật phức tạp.', 'about'],
            ['stat_customers',     '500+',                                              'about'],
            ['stat_uptime',        '99.9%',                                             'about'],
            ['stat_integrations',  '100+',                                              'about'],
            ['stat_support',       '24/7',                                              'about'],
            ['trusted_by',        'Shopee,Grab,Tiki,MoMo,VNG Corp,Zalo',              'about'],
            // smtp
            ['smtp_host',          'smtp.gmail.com',                                    'smtp'],
            ['smtp_port',          '587',                                               'smtp'],
            ['smtp_user',          '',                                                   'smtp'],
            ['smtp_password',      '',                                                   'smtp'],
            ['smtp_from_name',     'TechFlow',                                          'smtp'],
            ['smtp_from_email',    '',                                                   'smtp'],
            // system
            ['maintenance_mode',    '0',                                                'system'],
            ['maintenance_message', 'Website đang bảo trì. Vui lòng quay lại sau.',   'system'],
        ];

        foreach ($settings as [$key, $value, $group]) {
            $this->execute(
                "INSERT OR IGNORE INTO settings (key, value, \"group\") VALUES (?, ?, ?)",
                [$key, $value, $group]
            );
        }
    }

    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        $slides = [
            [
                'title'       => 'Giải pháp tự động hóa thông minh cho doanh nghiệp Việt Nam',
                'subtitle'    => 'TechFlow giúp đội ngũ tự động hóa quy trình, phân tích dữ liệu real-time và đưa ra quyết định thông minh hơn — không cần kiến thức kỹ thuật.',
                'button_text' => 'Dùng thử miễn phí',
                'button_link' => '/bang-gia',
                'image'       => '',
                'sort_order'  => 1,
            ],
            [
                'title'       => 'Tự động hóa quy trình — Tiết kiệm 40% thời gian vận hành',
                'subtitle'    => 'Kéo thả để tạo luồng công việc tự động. 100+ template sẵn có. Không cần kiến thức lập trình.',
                'button_text' => 'Khám phá tính năng',
                'button_link' => '/san-pham',
                'image'       => '',
                'sort_order'  => 2,
            ],
            [
                'title'       => 'Phân tích dữ liệu AI-powered — Hiểu rõ doanh nghiệp mọi lúc',
                'subtitle'    => 'Dashboard thông minh cập nhật real-time. AI tự động phát hiện bất thường và đưa ra gợi ý hành động cụ thể.',
                'button_text' => 'Xem demo',
                'button_link' => '/lien-he',
                'image'       => '',
                'sort_order'  => 3,
            ],
        ];
        foreach ($slides as $s) {
            $this->execute(
                "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?)",
                [$s['title'], $s['subtitle'], $s['button_text'], $s['button_link'], $s['image'], $s['sort_order']]
            );
        }
    }

    private function seedFeatures(): void {
        if ($this->scalar("SELECT COUNT(*) FROM features") > 0) return;
        $features = [
            [
                'name'    => 'Tự động hóa quy trình thông minh',
                'slug'    => 'tu-dong-hoa-quy-trinh',
                'tag'     => 'Automation',
                'icon'    => '⚡',
                'desc'    => 'Thiết lập luồng công việc tự động không cần code. Kéo thả quy trình, cài điều kiện và để hệ thống tự chạy 24/7 — tiết kiệm 40% thời gian vận hành.',
                'content' => "Kéo thả để tạo quy trình — không cần kiến thức lập trình\nHơn 100 template quy trình sẵn có cho các ngành\nLên lịch tự động theo thời gian hoặc điều kiện kích hoạt\nTheo dõi và debug quy trình theo thời gian thực\nRollback tức thì nếu phát hiện lỗi",
                'featured'=> 1,
                'order'   => 1,
            ],
            [
                'name'    => 'Phân tích dữ liệu real-time',
                'slug'    => 'phan-tich-du-lieu-real-time',
                'tag'     => 'Analytics',
                'icon'    => '📊',
                'desc'    => 'Dashboard trực quan cập nhật tức thì. Theo dõi KPI, xu hướng và báo cáo tự động — mọi quyết định đều có dữ liệu hỗ trợ.',
                'content' => "Cập nhật real-time không cần refresh trang\nAI tự động phát hiện bất thường và cảnh báo\nTùy chỉnh dashboard theo vai trò từng nhóm\nXuất báo cáo PDF, Excel tự động hàng ngày/tuần/tháng\nSo sánh hiệu suất theo giai đoạn, kênh, sản phẩm",
                'featured'=> 1,
                'order'   => 2,
            ],
            [
                'name'    => 'Tích hợp 100+ ứng dụng',
                'slug'    => 'tich-hop-ung-dung',
                'tag'     => 'Integrations',
                'icon'    => '🔗',
                'desc'    => 'Kết nối liền mạch với CRM, ERP, email, Zalo, Slack và hàng trăm ứng dụng khác qua API mở.',
                'content' => "Kết nối 100+ ứng dụng phổ biến trong 5 phút\nĐồng bộ dữ liệu hai chiều real-time\nAPI RESTful và Webhook sẵn sàng sử dụng\nHỗ trợ tích hợp tùy chỉnh qua Enterprise plan\nKhông cần kiến thức kỹ thuật để cài đặt",
                'featured'=> 1,
                'order'   => 3,
            ],
            [
                'name'    => 'Bảo mật doanh nghiệp',
                'slug'    => 'bao-mat-doanh-nghiep',
                'tag'     => 'Security',
                'icon'    => '🔒',
                'desc'    => 'Mã hóa end-to-end, tuân thủ ISO 27001, xác thực 2 yếu tố và kiểm soát quyền truy cập theo vai trò.',
                'content' => "Mã hóa AES-256 cho dữ liệu lưu trữ và truyền tải\nXác thực 2 yếu tố (2FA) bắt buộc\nKiểm soát quyền truy cập theo vai trò (RBAC)\nNhật ký hoạt động đầy đủ, theo dõi mọi thay đổi\nTuân thủ tiêu chuẩn ISO 27001 và GDPR\nBackup tự động mỗi 6 giờ, lưu trữ 90 ngày",
                'featured'=> 0,
                'order'   => 4,
            ],
            [
                'name'    => 'API mở & Webhook',
                'slug'    => 'api-webhook',
                'tag'     => 'API',
                'icon'    => '🤖',
                'desc'    => 'Tài liệu API đầy đủ, SDK cho nhiều ngôn ngữ, webhook theo thời gian thực — dễ tùy chỉnh không giới hạn.',
                'content' => "Tài liệu API đầy đủ với sandbox để thử nghiệm\nSDK cho JavaScript, Python, PHP, Java\nWebhook gửi event theo thời gian thực\nRate limit linh hoạt theo gói sử dụng\nVersioning API đảm bảo tương thích ngược",
                'featured'=> 0,
                'order'   => 5,
            ],
            [
                'name'    => 'Hỗ trợ 24/7 tiếng Việt',
                'slug'    => 'ho-tro-247',
                'tag'     => 'Support',
                'icon'    => '💬',
                'desc'    => 'Đội ngũ kỹ thuật Việt Nam hỗ trợ qua Zalo, email, live chat. Phản hồi trong vòng 2 giờ làm việc.',
                'content' => "Hỗ trợ qua Zalo, email và live chat\nPhản hồi trong 2 giờ trong ngày làm việc\nTài liệu hướng dẫn tiếng Việt đầy đủ\nVideo tutorial cho từng tính năng\nCộng đồng người dùng TechFlow trên Zalo Group",
                'featured'=> 0,
                'order'   => 6,
            ],
        ];

        foreach ($features as $f) {
            $this->execute(
                "INSERT INTO features (name, slug, tag, description, content, icon, featured, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [$f['name'], $f['slug'], $f['tag'], $f['desc'], $f['content'], $f['icon'], $f['featured'], $f['order']]
            );
        }
    }

    private function seedPricingPlans(): void {
        if ($this->scalar("SELECT COUNT(*) FROM pricing_plans") > 0) return;

        $plans = [
            [
                'name'           => 'Starter',
                'slug'           => 'starter',
                'desc'           => 'Phù hợp cho cá nhân và startup nhỏ mới bắt đầu với tự động hóa.',
                'price_monthly'  => 0,
                'price_yearly'   => 0,
                'is_featured'    => 0,
                'is_free'        => 1,
                'cta_text'       => 'Bắt đầu miễn phí',
                'cta_link'       => '/lien-he',
                'order'          => 1,
                'items'          => [
                    ['item' => '5 quy trình tự động',          'available' => 1],
                    ['item' => '3 người dùng',                  'available' => 1],
                    ['item' => 'Phân tích cơ bản (30 ngày)',    'available' => 1],
                    ['item' => '10 tích hợp cơ bản',            'available' => 1],
                    ['item' => '1 GB lưu trữ',                  'available' => 1],
                    ['item' => 'Hỗ trợ qua email',              'available' => 1],
                    ['item' => 'AI Assistant',                   'available' => 0],
                    ['item' => 'API access nâng cao',            'available' => 0],
                    ['item' => 'Custom branding',                'available' => 0],
                ],
            ],
            [
                'name'           => 'Professional',
                'slug'           => 'professional',
                'desc'           => 'Lý tưởng cho doanh nghiệp SME muốn tối ưu toàn diện quy trình vận hành.',
                'price_monthly'  => 1990000,
                'price_yearly'   => 1592000,
                'is_featured'    => 1,
                'is_free'        => 0,
                'cta_text'       => 'Dùng thử 14 ngày miễn phí',
                'cta_link'       => '/lien-he',
                'order'          => 2,
                'items'          => [
                    ['item' => 'Không giới hạn quy trình tự động','available' => 1],
                    ['item' => '20 người dùng',                   'available' => 1],
                    ['item' => 'Phân tích AI nâng cao (12 tháng)','available' => 1],
                    ['item' => '100+ tích hợp',                   'available' => 1],
                    ['item' => '50 GB lưu trữ',                   'available' => 1],
                    ['item' => 'AI Assistant đầy đủ',             'available' => 1],
                    ['item' => 'API RESTful + Webhook',            'available' => 1],
                    ['item' => 'Hỗ trợ Zalo + Email ưu tiên',    'available' => 1],
                    ['item' => 'On-premise deployment',           'available' => 0],
                    ['item' => 'SLA cam kết hợp đồng',           'available' => 0],
                ],
            ],
            [
                'name'           => 'Enterprise',
                'slug'           => 'enterprise',
                'desc'           => 'Giải pháp toàn diện cho tập đoàn và tổ chức quy mô lớn với yêu cầu bảo mật và tùy chỉnh cao.',
                'price_monthly'  => 0,
                'price_yearly'   => 0,
                'is_featured'    => 0,
                'is_free'        => 0,
                'cta_text'       => 'Liên hệ tư vấn',
                'cta_link'       => '/lien-he',
                'order'          => 3,
                'items'          => [
                    ['item' => 'Tất cả tính năng Professional',  'available' => 1],
                    ['item' => 'Không giới hạn người dùng',       'available' => 1],
                    ['item' => 'On-premise hoặc private cloud',   'available' => 1],
                    ['item' => 'Tích hợp hệ thống theo yêu cầu', 'available' => 1],
                    ['item' => 'Không giới hạn lưu trữ',         'available' => 1],
                    ['item' => 'SLA 99.9% cam kết hợp đồng',     'available' => 1],
                    ['item' => 'Hỗ trợ 24/7 có dedicated manager','available' => 1],
                    ['item' => 'Đào tạo nhân sự tận nơi',        'available' => 1],
                    ['item' => 'Custom branding & white-label',   'available' => 1],
                ],
            ],
        ];

        foreach ($plans as $p) {
            $planId = $this->execute(
                "INSERT INTO pricing_plans (name, slug, description, price_monthly, price_yearly, is_featured, is_free, cta_text, cta_link, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [$p['name'], $p['slug'], $p['desc'], $p['price_monthly'], $p['price_yearly'],
                 $p['is_featured'], $p['is_free'], $p['cta_text'], $p['cta_link'], $p['order']]
            );
            foreach ($p['items'] as $i => $item) {
                $this->execute(
                    "INSERT INTO pricing_plan_items (plan_id, item, available, sort_order) VALUES (?, ?, ?, ?)",
                    [$planId, $item['item'], $item['available'], $i + 1]
                );
            }
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $items = [
            [
                'name'    => 'Nguyễn Văn Hùng',
                'title'   => 'CEO · Công ty CP Thương Mại XYZ',
                'content' => 'TechFlow đã giúp chúng tôi giảm 45% thời gian xử lý đơn hàng và tăng 30% doanh thu chỉ trong 3 tháng đầu sử dụng. Đây là khoản đầu tư đáng giá nhất năm nay.',
                'rating'  => 5,
                'avatar'  => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
                'order'   => 1,
            ],
            [
                'name'    => 'Trần Thị Bích',
                'title'   => 'COO · Công ty TNHH Logistics ABC',
                'content' => 'Tích hợp với hệ thống hiện có của công ty rất nhanh, đội hỗ trợ tiếng Việt phản hồi trong vài phút. Giao diện trực quan — nhân viên không cần đào tạo nhiều đã dùng được ngay.',
                'rating'  => 5,
                'avatar'  => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
                'order'   => 2,
            ],
            [
                'name'    => 'Lê Minh Quân',
                'title'   => 'CTO · Startup Fintech DEF',
                'content' => 'Dashboard analytics real-time giúp tôi nắm bắt tình hình kinh doanh mọi lúc mọi nơi. Báo cáo tự động gửi mỗi sáng — tiết kiệm ít nhất 10 tiếng làm việc mỗi tuần.',
                'rating'  => 5,
                'avatar'  => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
                'order'   => 3,
            ],
        ];

        foreach ($items as $t) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?)",
                [$t['name'], $t['title'], $t['avatar'], $t['content'], $t['rating'], $t['order']]
            );
        }
    }

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $faqs = [
            [
                'q' => 'Tôi có thể dùng thử miễn phí bao lâu?',
                'a' => 'Bạn có thể dùng thử gói Professional đầy đủ tính năng trong 14 ngày hoàn toàn miễn phí, không cần thẻ tín dụng. Sau 14 ngày, nếu không nâng cấp, tài khoản sẽ tự động chuyển về gói Starter miễn phí và bạn vẫn giữ được dữ liệu đã tạo.',
                'order' => 1,
            ],
            [
                'q' => 'Tôi có thể thay đổi gói sau khi đăng ký không?',
                'a' => 'Có, bạn có thể nâng cấp hoặc hạ cấp gói bất cứ lúc nào. Khi nâng cấp, bạn chỉ trả thêm phần chênh lệch tính theo ngày còn lại trong chu kỳ hiện tại. Khi hạ cấp, thay đổi sẽ có hiệu lực vào đầu chu kỳ thanh toán tiếp theo.',
                'order' => 2,
            ],
            [
                'q' => 'Dữ liệu của tôi có được bảo mật không?',
                'a' => 'Tất cả dữ liệu được mã hóa AES-256 khi lưu trữ và SSL/TLS khi truyền tải. Chúng tôi tuân thủ tiêu chuẩn ISO 27001 và không bao giờ chia sẻ dữ liệu của bạn với bên thứ ba. Backup tự động mỗi 6 giờ, lưu trữ tối thiểu 90 ngày.',
                'order' => 3,
            ],
            [
                'q' => 'Tôi có thể xuất dữ liệu không nếu muốn chuyển đi?',
                'a' => 'Hoàn toàn có thể. Bạn có thể xuất toàn bộ dữ liệu ở định dạng CSV, JSON hoặc Excel bất cứ lúc nào. Chúng tôi cam kết không giữ dữ liệu làm con tin — dữ liệu của bạn luôn là của bạn.',
                'order' => 4,
            ],
            [
                'q' => 'Gói Enterprise có thể triển khai tại máy chủ riêng không?',
                'a' => 'Có, gói Enterprise hỗ trợ triển khai on-premise trên hạ tầng của doanh nghiệp bạn hoặc private cloud riêng. Đội kỹ thuật của chúng tôi sẽ hỗ trợ toàn bộ quá trình cài đặt, cấu hình và bàn giao vận hành.',
                'order' => 5,
            ],
            [
                'q' => 'Có hỗ trợ thanh toán bằng chuyển khoản ngân hàng không?',
                'a' => 'Có, chúng tôi hỗ trợ thanh toán qua chuyển khoản ngân hàng, MoMo, VNPay và thẻ Visa/Mastercard. Doanh nghiệp có thể xuất hóa đơn VAT theo yêu cầu cho mọi giao dịch.',
                'order' => 6,
            ],
        ];

        foreach ($faqs as $f) {
            $this->execute(
                "INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)",
                [$f['q'], $f['a'], $f['order']]
            );
        }
    }
}
