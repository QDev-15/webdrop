<?php
declare(strict_types=1);

class Database {
    private \PDO $pdo;
    private static ?Database $instance = null;

    private function __construct() {
        $dbDir = dirname(DB_FILE);
        if (!is_dir($dbDir)) {
            mkdir($dbDir, 0755, true);
        }
        $this->pdo = new \PDO('sqlite:' . DB_FILE);
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->pdo->exec('PRAGMA journal_mode = WAL');
        $this->migrate();
    }

    public static function getInstance(): self {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function migrate(): void {
        $schemaPath = __DIR__ . '/../schema.sql';
        $schema = file_get_contents($schemaPath);
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
        $this->seedExtensions();
    }

    protected function seedExtensions(): void {
        $this->seedServices();
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

        $privacyContent = <<<HTML
<h2>1. Dữ liệu chúng tôi thu thập</h2>
<p>Chúng tôi thu thập tên, email, số điện thoại, địa chỉ công ty, lĩnh vực kinh doanh để cung cấp dịch vụ.</p>
<h2>2. Cách chúng tôi sử dụng</h2>
<p>Dữ liệu của bạn dùng để cung cấp dịch vụ, liên lạc, cải thiện sản phẩm, tuân thủ pháp luật.</p>
<h2>3. Bảo vệ dữ liệu</h2>
<p>Chúng tôi sử dụng encryption, firewall, access controls để bảo vệ dữ liệu của bạn.</p>
<h2>4. Quyền của bạn</h2>
<p>Bạn có quyền truy cập, sửa đổi, hoặc xóa thông tin. Liên hệ: hello@digital-innovation.vn</p>
HTML;

        $termsContent = <<<HTML
<h2>1. Chấp nhận Điều khoản</h2>
<p>Bằng cách sử dụng website này, bạn đồng ý tuân thủ các điều khoản dưới đây.</p>
<h2>2. Giới hạn Trách nhiệm</h2>
<p>Digital Innovation không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp hoặc hậu quả phát sinh từ sử dụng website này.</p>
<h2>3. Quyền Sở hữu Trí tuệ</h2>
<p>Toàn bộ nội dung trên website là tài sản của Digital Innovation. Không được sao chép mà không có sự cho phép bằng văn bản.</p>
<h2>4. Điều Luật Áp dụng</h2>
<p>Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam.</p>
HTML;

        $settings = [
            // ── Chung ──────────────────────────────────────────────
            ['site_name', 'Digital Innovation', 'general'],
            ['site_logo_text', 'Digital', 'general'],
            ['site_tagline', 'Giải pháp Công nghệ & Marketing số', 'general'],
            ['site_description', 'Công ty chuyên về công nghệ digital, marketing automation, AI, và transformation cho doanh nghiệp.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hello@digital-innovation.vn', 'general'],
            ['site_phone', '+84 (123) 456-789', 'general'],
            ['site_address', '', 'general'],
            ['working_hours', '', 'general'],

            // ── SEO ────────────────────────────────────────────────
            ['meta_title', 'Digital Innovation — Giải pháp Công nghệ & Marketing số', 'seo'],
            ['meta_description', 'Công ty chuyên về công nghệ digital, marketing automation, AI, và transformation cho doanh nghiệp.', 'seo'],
            ['meta_keywords', 'digital innovation, AI, marketing automation, chuyển đổi số', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1535224206399-a3fc77abdee2?w=1200&h=800&fit=crop', 'seo'],

            // ── Mạng xã hội ────────────────────────────────────────
            ['facebook', '#', 'social'],
            ['twitter', '#', 'social'],
            ['linkedin', '#', 'social'],
            ['zalo', '0987654321', 'social'],

            // ── Footer ─────────────────────────────────────────────
            ['footer_copyright', '© 2024 Digital Innovation. All rights reserved.', 'footer'],
            ['footer_description', 'Công ty công nghệ chuyên về AI, Automation, và Digital Transformation cho doanh nghiệp hiện đại.', 'footer'],

            // ── Liên hệ ────────────────────────────────────────────
            ['map_embed', 'https://maps.google.com/maps?q=10.7769,106.7009&hl=vi&z=15&output=embed', 'contact'],

            // ── Thống kê trang chủ ─────────────────────────────────
            ['stat1_number', '200', 'stats'],
            ['stat1_suffix', '', 'stats'],
            ['stat1_label', 'Dự án deploy', 'stats'],
            ['stat2_number', '50', 'stats'],
            ['stat2_suffix', 'K', 'stats'],
            ['stat2_label', 'Người dùng active', 'stats'],
            ['stat3_number', '99', 'stats'],
            ['stat3_suffix', '.9%', 'stats'],
            ['stat3_label', 'Uptime SLA', 'stats'],
            ['stat4_number', '24', 'stats'],
            ['stat4_suffix', '', 'stats'],
            ['stat4_label', 'Giờ hỗ trợ', 'stats'],

            // ── Nội dung trang (hero/CTA theo từng trang) ──────────
            ['home_services_eyebrow', 'Giải pháp lõi', 'content'],
            ['home_services_title', 'Công nghệ <em>Tiên tiến</em>', 'content'],
            ['home_services_sub', 'Cung cấp các giải pháp công nghệ tích hợp giúp tối ưu hóa quy trình kinh doanh.', 'content'],
            ['home_cta_title', 'Sẵn sàng chuyển đổi công ty bạn?', 'content'],
            ['home_cta_sub', 'Yêu cầu demo miễn phí và tìm hiểu cách công nghệ có thể tăng tốc độ doanh nghiệp của bạn.', 'content'],
            ['home_cta_button', 'Bắt đầu hôm nay', 'content'],

            ['about_hero_eyebrow', 'Câu chuyện', 'content'],
            ['about_hero_title', 'Về <em>Digital Innovation</em>', 'content'],
            ['about_hero_sub', 'Công ty công nghệ lãnh đạo trong AI, Automation, và Digital Transformation.', 'content'],
            ['about_mission_text', 'Chúng tôi giúp doanh nghiệp hiện đại chuyển đổi số và gia tăng hiệu suất bằng công nghệ AI, tự động hóa, và dữ liệu. Mục tiêu: doanh nghiệp toàn cầu không ai bị bỏ lại trong cuộc cách mạng số.', 'content'],
            ['why_us_1_title', 'Chuyên gia hàng đầu', 'content'],
            ['why_us_1_desc', 'Đội ngũ cây chuối từ Google, Meta, Microsoft, Grab với kinh nghiệm 10+ năm.', 'content'],
            ['why_us_2_title', 'Công nghệ tiên tiến', 'content'],
            ['why_us_2_desc', 'Sử dụng latest AI models, cloud infrastructure, và best practices toàn cầu.', 'content'],
            ['why_us_3_title', 'Hỗ trợ toàn bộ hành trình', 'content'],
            ['why_us_3_desc', 'Từ strategy, implementation, đến training và ongoing support.', 'content'],
            ['about_cta_title', 'Sẵn sàng bắt đầu?', 'content'],
            ['about_cta_sub', 'Hãy liên hệ với chúng tôi để tìm hiểu cách công nghệ có thể giúp doanh nghiệp bạn.', 'content'],
            ['about_cta_button', 'Yêu cầu tư vấn', 'content'],

            ['services_hero_eyebrow', 'Các dịch vụ', 'content'],
            ['services_hero_title', 'Giải pháp <em>Công nghệ</em> toàn diện', 'content'],
            ['services_hero_sub', 'AI, Automation, Analytics, Integration — tất cả những gì bạn cần để chuyển đổi số.', 'content'],
            ['services_cta_title', 'Tìm giải pháp phù hợp', 'content'],
            ['services_cta_sub', 'Demo miễn phí với technical experts. Không có cam kết.', 'content'],
            ['services_cta_button', 'Yêu cầu demo', 'content'],

            ['contact_hero_eyebrow', 'Liên hệ', 'content'],
            ['contact_hero_title', 'Hãy <em>Nói chuyện</em> với chúng tôi', 'content'],
            ['contact_hero_sub', 'Gửi tin nhắn và chúng tôi sẽ phản hồi trong 24h.', 'content'],

            // ── Pháp lý ────────────────────────────────────────────
            ['privacy_content', $privacyContent, 'legal'],
            ['terms_content', $termsContent, 'legal'],

            // ── SMTP ───────────────────────────────────────────────
            ['smtp_host', 'smtp.gmail.com', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from_name', 'Digital Innovation', 'smtp'],
            ['smtp_from_email', '', 'smtp'],

            // ── Nâng cao ───────────────────────────────────────────
            ['maintenance_mode', '0', 'system'],
            ['items_per_page', '20', 'system'],

            // ── Cloudinary ─────────────────────────────────────────
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key', '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],

            // ── Tích hợp ───────────────────────────────────────────
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];
        foreach ($settings as [$key, $value, $group]) {
            $this->execute(
                "INSERT OR IGNORE INTO settings (key, value, grp) VALUES (?, ?, ?)",
                [$key, $value, $group]
            );
        }
    }

    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        // Ghi chú: cột "subtitle" lưu 2 dòng — dòng 1 = nhãn nhỏ phía trên (di-carousel-label),
        // các dòng còn lại = đoạn mô tả (di-carousel-sub). HeroSlider.tsx tách bằng ký tự xuống dòng đầu tiên.
        // Nút phụ ("Tìm hiểu thêm" → /ve-chung-toi) dùng chung cho mọi slide (khớp template — cả 4 slide đều trỏ về about.html).
        $slides = [
            [
                'title' => 'Biến đổi <em>Doanh nghiệp</em> bằng AI',
                'subtitle' => "Công nghệ Digital Tiên tiến\nAI-powered solutions giúp tối ưu hóa quy trình, tăng tốc độ ra quyết định, và unlock revenue streams mới.",
                'button_text' => 'Yêu cầu demo',
                'button_link' => '/lien-he',
                'image' => 'https://images.unsplash.com/photo-1535224206399-a3fc77abdee2?w=1200&h=800&fit=crop',
                'sort_order' => 1,
            ],
            [
                'title' => 'AUTOMATION PLATFORM: <em>3X ROI</em>',
                'subtitle' => "Marketing Automation\nSaaS company tripled campaign ROI trong 6 tháng bằng cách tự động hóa email marketing, lead scoring, segmentation.",
                'button_text' => 'Demo ngay',
                'button_link' => '/lien-he',
                'image' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop',
                'sort_order' => 2,
            ],
            [
                'title' => 'DATA POWER: Quyết định nhanh <em>hơn</em>',
                'subtitle' => "Advanced Analytics\nReal-time dashboard + predictive analytics giúp executives quyết định trong phút thay vì ngày.",
                'button_text' => 'Khám phá',
                'button_link' => '/lien-he',
                'image' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop',
                'sort_order' => 3,
            ],
            [
                'title' => 'INFRASTRUCTURE: Scalable & Secure',
                'subtitle' => "Cloud Integration\nCloud-native architecture tối ưu cho performance, scalability, và security. Deploy trong minutes, không hours.",
                'button_text' => 'Tìm hiểu',
                'button_link' => '/lien-he',
                'image' => 'https://images.unsplash.com/photo-1460925895917-aeb19be489c7?w=1200&h=800&fit=crop',
                'sort_order' => 4,
            ],
        ];
        foreach ($slides as $slide) {
            $this->execute(
                "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                [$slide['title'], $slide['subtitle'], $slide['button_text'], $slide['button_link'], $slide['image'], $slide['sort_order']]
            );
        }
    }

    // ─── Extensions (Services) ───────────────────────────────────────────────

    private function seedServices(): void {
        if ($this->scalar("SELECT COUNT(*) FROM services") > 0) return;
        $services = [
            ['🤖', 'AI SOLUTIONS', 'Predictive models, recommendation engines, chatbots, computer vision. AI tùy chỉnh cho bussines case của bạn.', 1],
            ['⚙️', 'AUTOMATION', 'Workflow automation, RPA, process mining. Tiết kiệm 60% thời gian làm việc lặp lại.', 2],
            ['📊', 'ANALYTICS', 'Business intelligence, data warehousing, real-time dashboards cho quyết định nhanh.', 3],
            ['🔗', 'INTEGRATION', 'API-first architecture, microservices, cloud migration. Kết nối tất cả hệ thống.', 4],
            ['🛡️', 'SECURITY', 'Enterprise-grade security, compliance, data governance cho yên tâm.', 5],
            ['📚', 'TRAINING', 'Upskill team của bạn. Workshops, certification programs, ongoing support.', 6],
        ];
        foreach ($services as [$icon, $title, $desc, $order]) {
            $this->execute(
                "INSERT INTO services (icon, title, description, sort_order, status) VALUES (?, ?, ?, ?, 'published')",
                [$icon, $title, $desc, $order]
            );
        }
    }

    // ─── Query helpers ─────────────────────────────────────────────────────────

    public function query(string $sql, array $params = []): array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $rows = $this->query($sql, $params);
        return $rows[0] ?? null;
    }

    public function scalar(string $sql, array $params = []): mixed {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchColumn();
    }

    public function execute(string $sql, array $params = []): int|string {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $this->pdo->lastInsertId();
    }

    public function getPdo(): \PDO {
        return $this->pdo;
    }
}

// Helper functions
function bodyJson(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function slugify(string $text): string {
    $text = mb_strtolower($text, 'UTF-8');
    $map = [
        'à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a',
        'ă'=>'a','ắ'=>'a','ặ'=>'a','ằ'=>'a','ẳ'=>'a','ẵ'=>'a',
        'â'=>'a','ấ'=>'a','ầ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a',
        'è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e',
        'ê'=>'e','ế'=>'e','ề'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e',
        'ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i',
        'ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o',
        'ô'=>'o','ố'=>'o','ồ'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o',
        'ơ'=>'o','ớ'=>'o','ờ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o',
        'ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u',
        'ư'=>'u','ứ'=>'u','ừ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u',
        'ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y',
        'đ'=>'d',
    ];
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', trim($text));
    return trim($text, '-');
}
?>
