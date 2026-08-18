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
        // Strip comments TRƯỚC khi split — tránh filter loại bỏ CREATE TABLE sau comment block
        $schema = preg_replace('/^\s*--.*$/m', '', $schema);
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
            ['Admin', 'sysadmin@admin.com', password_hash('123456', PASSWORD_DEFAULT), 'superadmin']
        );
    }

    private function seedSettings(): void {
        if ($this->scalar("SELECT COUNT(*) FROM settings") > 0) return;

        $privacyContent = <<<HTML
<h2>1. Dữ liệu chúng tôi thu thập</h2>
<p>Chúng tôi thu thập tên, email, số điện thoại, công ty, vị trí để cung cấp dịch vụ tư vấn.</p>
<h2>2. Cách sử dụng</h2>
<p>Dữ liệu được sử dụng để cung cấp dịch vụ, liên lạc, cải thiện sản phẩm, và tuân thủ pháp luật.</p>
<h2>3. Bảo vệ dữ liệu</h2>
<p>Chúng tôi sử dụng encryption, access controls, và các biện pháp bảo mật tiên tiến.</p>
<h2>4. Quyền của bạn</h2>
<p>Bạn có quyền truy cập, sửa đổi, hoặc xóa dữ liệu. Liên hệ: hello@strategy-consulting.vn</p>
HTML;

        $termsContent = <<<HTML
<h2>1. Chấp nhận Điều khoản</h2>
<p>Bằng cách sử dụng website này, bạn đồng ý tuân thủ các điều khoản dưới đây.</p>
<h2>2. Giới hạn Trách nhiệm</h2>
<p>Strategy Consulting không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp hoặc gián tiếp phát sinh từ sử dụng website này.</p>
<h2>3. Quyền Sở hữu Trí tuệ</h2>
<p>Toàn bộ nội dung là tài sản của Strategy Consulting. Không được sao chép mà không có sự cho phép bằng văn bản.</p>
<h2>4. Điều Luật Áp dụng</h2>
<p>Các điều khoản này được điều chỉnh bởi pháp luật Cộng hòa Xã hội chủ nghĩa Việt Nam.</p>
HTML;

        $settings = [
            // ── Chung ──────────────────────────────────────────────
            ['site_name', 'Strategy & Co', 'general'],
            ['site_logo_text', 'Strategy', 'general'],
            ['site_tagline', 'Tư vấn Chiến lược Kinh doanh', 'general'],
            ['site_description', 'Công ty tư vấn chiến lược kinh doanh, giúp doanh nghiệp xác định hướng phát triển bền vững và hiệu quả.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hello@strategy-consulting.vn', 'general'],
            ['site_phone', '+84 (123) 456-789', 'general'],
            ['site_address', '', 'general'],
            ['working_hours', "Thứ Hai - Thứ Sáu: 8:00 - 18:00\nThứ Bảy: 9:00 - 12:00", 'general'],

            // ── SEO ────────────────────────────────────────────────
            ['meta_title', 'Strategy Consulting — Tư vấn Chiến lược Kinh doanh', 'seo'],
            ['meta_description', 'Công ty tư vấn chiến lược kinh doanh, giúp doanh nghiệp xác định hướng phát triển bền vững và hiệu quả.', 'seo'],
            ['meta_keywords', 'tư vấn chiến lược, tư vấn kinh doanh, tái cấu trúc, M&A, growth strategy', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop', 'seo'],

            // ── Mạng xã hội ────────────────────────────────────────
            ['zalo', '0908765432', 'social'],

            // ── Footer ─────────────────────────────────────────────
            ['footer_copyright', '© 2024 Strategy Consulting. All rights reserved.', 'footer'],
            ['footer_description', 'Công ty tư vấn chiến lược kinh doanh hàng đầu, giúp các doanh nghiệp xác định hướng đi và đạt tăng trưởng bền vững.', 'footer'],

            // ── Liên hệ ────────────────────────────────────────────
            ['map_embed', 'https://maps.google.com/maps?q=21.0285,105.8542&hl=vi&z=15&output=embed', 'contact'],

            // ── Thống kê trang chủ ─────────────────────────────────
            ['stat1_number', '120', 'stats'],
            ['stat1_suffix', '', 'stats'],
            ['stat1_label', 'Dự án thành công', 'stats'],
            ['stat2_number', '25', 'stats'],
            ['stat2_suffix', '%', 'stats'],
            ['stat2_label', 'Tăng trưởng doanh thu', 'stats'],
            ['stat3_number', '15', 'stats'],
            ['stat3_suffix', '', 'stats'],
            ['stat3_label', 'Năm kinh nghiệm', 'stats'],
            ['stat4_number', '98', 'stats'],
            ['stat4_suffix', '%', 'stats'],
            ['stat4_label', 'Độ hài lòng khách hàng', 'stats'],

            // ── Nội dung trang (hero/CTA theo từng trang) ──────────
            ['home_services_eyebrow', 'Dịch vụ chính', 'content'],
            ['home_services_title', 'Giải pháp <em>Toàn diện</em>', 'content'],
            ['home_services_sub', 'Chúng tôi cung cấp tư vấn chiến lược từ mức độ CEO đến thực hiện cấp tác vụ.', 'content'],
            ['home_cta_title', 'Sẵn sàng định hình tương lai của doanh nghiệp?', 'content'],
            ['home_cta_sub', 'Liên hệ với chúng tôi để nhận tư vấn chiến lược miễn phí và thảo luận cơ hội phát triển của bạn.', 'content'],
            ['home_cta_button', 'Yêu cầu tư vấn', 'content'],

            ['about_hero_eyebrow', 'Câu chuyện', 'content'],
            ['about_hero_title', 'Về <em>Strategy & Co</em>', 'content'],
            ['about_hero_sub', '15 năm hành trình giúp hàng trăm doanh nghiệp tìm thấy chiến lược phát triển bền vững.', 'content'],
            ['about_mission_text', 'Chúng tôi tin rằng mọi doanh nghiệp đều có khả năng tìm thấy chiến lược tăng trưởng phù hợp với hoàn cảnh thị trường của mình. Sứ mệnh của chúng tôi là hỗ trợ các lãnh đạo kinh doanh khám phá cơ hội, xác định hướng đi, và triển khai hiệu quả để đạt tăng trưởng bền vững.', 'content'],
            ['why_us_1_icon', '👥', 'content'],
            ['why_us_1_title', 'Chuyên gia hàng đầu', 'content'],
            ['why_us_1_desc', 'Đội ngũ có kinh nghiệm từ McKinsey, BCG, Deloitte và các công ty lớn khác.', 'content'],
            ['why_us_2_icon', '🎯', 'content'],
            ['why_us_2_title', 'Phương pháp đã chứng minh', 'content'],
            ['why_us_2_desc', 'Sử dụng các framework chiến lược hiệu quả nhất được kiểm chứng trong thực tế.', 'content'],
            ['why_us_3_icon', '📈', 'content'],
            ['why_us_3_title', 'Kết quả cụ thể', 'content'],
            ['why_us_3_desc', '120+ dự án thành công, tăng trưởng doanh thu trung bình 25% sau tư vấn.', 'content'],
            ['about_cta_title', 'Sẵn sàng bắt đầu cuộc hành trình?', 'content'],
            ['about_cta_sub', 'Hãy liên hệ với chúng tôi để nhận tư vấn chiến lược miễn phí.', 'content'],
            ['about_cta_button', 'Yêu cầu tư vấn', 'content'],

            ['services_hero_eyebrow', 'Các dịch vụ', 'content'],
            ['services_hero_title', 'Giải pháp <em>Chiến lược</em> toàn diện', 'content'],
            ['services_hero_sub', 'Từ định hướng chiến lược đến triển khai và tối ưu liên tục.', 'content'],
            ['services_cta_title', 'Không chắc chọn dịch vụ nào?', 'content'],
            ['services_cta_sub', 'Hãy liên hệ với chúng tôi để tìm hiểu giải pháp phù hợp nhất cho doanh nghiệp của bạn.', 'content'],
            ['services_cta_button', 'Liên hệ', 'content'],

            ['contact_hero_eyebrow', 'Liên hệ', 'content'],
            ['contact_hero_title', 'Hãy nói chuyện <em>với chúng tôi</em>', 'content'],
            ['contact_hero_sub', 'Gửi tin nhắn và chúng tôi sẽ phản hồi trong 24h.', 'content'],

            // ── Pháp lý ────────────────────────────────────────────
            ['privacy_content', $privacyContent, 'legal'],
            ['terms_content', $termsContent, 'legal'],

            // ── SMTP ───────────────────────────────────────────────
            ['smtp_host', 'smtp.gmail.com', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from_name', 'Strategy & Co', 'smtp'],
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
        // Ghi chú: cột "subtitle" lưu 2 dòng — dòng 1 = nhãn nhỏ phía trên (sc-carousel-label),
        // các dòng còn lại = đoạn mô tả (sc-carousel-sub). HeroSlider.tsx tách bằng ký tự xuống dòng đầu tiên.
        // Nút phụ ("Tìm hiểu thêm" → /ve-chung-toi) dùng chung cho mọi slide (khớp template — cả 4 slide đều trỏ về about.html,
        // wording khác nhau "Case study"/"Chi tiết"/"Xem chi tiết" chỉ là biến thể câu chữ của cùng 1 hành động).
        $slides = [
            [
                'title' => 'Hướng dẫn doanh nghiệp <em>phát triển</em> bền vững',
                'subtitle' => "Tư vấn Chiến lược\nChiến lược kinh doanh hiệu quả, dựa trên phân tích sâu sắc thị trường và năng lực nội bộ của bạn.",
                'button_text' => 'Bắt đầu tư vấn',
                'button_link' => '/lien-he',
                'image' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop',
                'sort_order' => 1,
            ],
            [
                'title' => 'Tăng lợi nhuận <em>35%</em> qua Restructuring',
                'subtitle' => "Tái Cấu Trúc\nManufacturing firm thoát khỏi các thị trường kém hiệu quả, tập trung vào lĩnh vực mạnh, đạt 35% margin improvement.",
                'button_text' => 'Tư vấn ngay',
                'button_link' => '/lien-he',
                'image' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop',
                'sort_order' => 2,
            ],
            [
                'title' => 'Làm chủ Phát triển <em>Bền vững</em>',
                'subtitle' => "M&A Strategy\nTừ xác định target tới integration, chúng tôi giúp bạn tạo \$100M deal và \$25M synergies thực tế.",
                'button_text' => 'Yêu cầu tư vấn',
                'button_link' => '/lien-he',
                'image' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop',
                'sort_order' => 3,
            ],
            [
                'title' => 'Tăng trưởng <em>Nhanh</em> & Bền vững',
                'subtitle' => "Growth Strategy\nChiến lược mở rộng thị trường, phát triển sản phẩm, và xây dựng năng lực cạnh tranh lâu dài.",
                'button_text' => 'Tư vấn ngay',
                'button_link' => '/lien-he',
                'image' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=800&fit=crop',
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
            ['🎯', 'Định hướng Chiến lược', 'Xác định mục tiêu 3-5 năm, hướng đi thị trường, và vị trí cạnh tranh của bạn.', 1],
            ['📊', 'Phân tích Thị trường', 'Nghiên cứu chi tiết ngành, đối thủ, xu hướng tiêu dùng, và cơ hội tăng trưởng.', 2],
            ['💼', 'Tái cấu trúc Tổ chức', 'Tối ưu hóa cơ cấu tổ chức, quy trình, và năng lực để thực hiện chiến lược.', 3],
            ['🚀', 'Triển khai & Kết quả', 'Giám sát implementation, đo lường KPI, điều chỉnh linh hoạt theo từng giai đoạn.', 4],
            ['👥', 'Phát triển Đội ngũ', 'Training lãnh đạo, xây dựng culture tổ chức, và phát triển tài năng nội bộ.', 5],
            ['🔄', 'Tối ưu Liên tục', 'Coaching định kỳ, review tiến độ, và điều chỉnh chiến lược theo tình hình thực tế.', 6],
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
