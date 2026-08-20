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
        $this->seedFaqs();
        $this->seedPricingPlans();
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

            // ── Hình thức hợp tác (mục I — thay bảng giá cố định), trang /dich-vu ──
            ['pricing_eyebrow', 'Hình thức hợp tác', 'content'],
            ['pricing_title', 'Cách <em>đồng hành</em> cùng bạn', 'content'],
            ['pricing_sub', 'Mỗi doanh nghiệp có bối cảnh và quy mô bài toán khác nhau — chúng tôi không áp một bảng giá cố định, mà thiết kế phạm vi hợp tác phù hợp với đúng nhu cầu của bạn.', 'content'],
            ['pricing_footnote', 'Chi phí cụ thể được thống nhất sau buổi trao đổi ban đầu, dựa trên đúng phạm vi và quy mô bài toán của doanh nghiệp bạn.', 'content'],

            // ── FAQ (mục H), trang /dich-vu ─────────────────────────────────
            ['faq_eyebrow', 'Câu hỏi thường gặp', 'content'],
            ['faq_title', 'Giải đáp <em>Thắc mắc</em>', 'content'],

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

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $faqs = [
            ['Một dự án tư vấn chiến lược điển hình kéo dài bao lâu?', 'Tùy phạm vi hợp tác: workshop 1 buổi cho kết quả ngay trong ngày, dự án chẩn đoán + xây dựng roadmap thường kéo dài 4–8 tuần, còn hình thức retainer là hợp tác liên tục theo tháng/quý, không có mốc kết thúc cố định.', 1],
            ['Chi phí tư vấn được tính như thế nào?', 'Chúng tôi không áp bảng giá cố định vì mỗi doanh nghiệp có quy mô và bài toán khác nhau. Chi phí tính theo phạm vi dự án (project-based) hoặc theo tháng (retainer), được thống nhất cụ thể sau buổi trao đổi ban đầu để hiểu đúng nhu cầu của bạn.', 2],
            ['Ai là người trực tiếp phụ trách dự án của chúng tôi?', 'Mỗi dự án có một lead consultant phụ trách xuyên suốt từ đầu đến khi bàn giao, không đổi người giữa các giai đoạn — đảm bảo hiểu bối cảnh doanh nghiệp liền mạch và nhất quán.', 3],
            ['Thông tin doanh nghiệp của chúng tôi có được bảo mật không?', 'Có. Chúng tôi ký thỏa thuận bảo mật (NDA) trước khi trao đổi thông tin chi tiết. Dữ liệu chỉ được sử dụng trong phạm vi dự án và không chia sẻ với bất kỳ bên thứ ba nào, kể cả các doanh nghiệp khác cùng ngành.', 4],
            ['Chúng tôi nhận được gì khi kết thúc — chỉ là báo cáo hay có hỗ trợ triển khai?', 'Tùy hình thức hợp tác. Gói theo dự án bàn giao báo cáo chiến lược cùng buổi workshop trình bày với ban lãnh đạo; nếu cần đồng hành triển khai thực tế, gói retainer cho phép chúng tôi theo sát và điều chỉnh cùng đội ngũ của bạn theo thời gian.', 5],
            ['Doanh nghiệp quy mô nhỏ có phù hợp làm việc với chúng tôi không?', 'Có — chúng tôi nhận cả doanh nghiệp vừa và nhỏ lẫn tập đoàn lớn. Với doanh nghiệp nhỏ, chúng tôi thường bắt đầu bằng workshop 1 buổi hoặc một gói tư vấn thu gọn phạm vi thay vì dự án dài hạn, để phù hợp với nguồn lực thực tế.', 6],
            ['Nếu chiến lược đề xuất không phù hợp với thực tế vận hành thì sao?', 'Chiến lược luôn được điều chỉnh theo phản hồi thực tế trong quá trình triển khai. Hình thức retainer đặc biệt phù hợp cho việc này — cho phép theo dõi và tinh chỉnh định kỳ theo quý, thay vì bàn giao một lần rồi kết thúc hợp tác.', 7],
        ];
        foreach ($faqs as [$question, $answer, $order]) {
            $this->execute(
                "INSERT INTO faqs (question, answer, page, sort_order, status) VALUES (?, ?, 'dich-vu', ?, 'published')",
                [$question, $answer, $order]
            );
        }
    }

    // Ghi chú: site này không có bảng giá cố định — "pricing_plans" seed lại từ nội dung
    // gốc "Hình thức hợp tác" (engagement models) trong services.html. Cột "price" giữ
    // nhịp độ hợp tác (Theo dự án/Hàng tháng/1 buổi) thay vì số tiền, is_featured=0 cho
    // cả 3 vì thiết kế gốc không có card nổi bật (3 hình thức ngang hàng nhau).
    private function seedPricingPlans(): void {
        if ($this->scalar("SELECT COUNT(*) FROM pricing_plans") > 0) return;
        $plans = [
            [
                'Tư vấn theo Dự án', 'Theo dự án',
                'Phù hợp khi doanh nghiệp có một bài toán chiến lược rõ ràng, có điểm bắt đầu và điểm kết thúc cụ thể.',
                "Discovery & chẩn đoán hiện trạng\nXây dựng chiến lược + roadmap triển khai\nTrình bày & bàn giao báo cáo điều hành",
                'Trao đổi về dự án của bạn', 1,
            ],
            [
                'Retainer Đồng hành', 'Hàng tháng',
                'Phù hợp khi doanh nghiệp cần một cố vấn chiến lược liên tục, theo sát biến động thị trường theo thời gian.',
                "Buổi review chiến lược định kỳ hàng tháng\nTư vấn nhanh qua kênh riêng khi cần quyết định gấp\nTheo dõi KPI & điều chỉnh chiến lược theo quý",
                'Tìm hiểu gói đồng hành', 2,
            ],
            [
                'Workshop Chiến lược', '1 buổi',
                'Phù hợp khi đội ngũ lãnh đạo cần thống nhất định hướng nhanh trong một khoảng thời gian ngắn.',
                "Buổi làm việc tập trung 1 ngày cùng ban lãnh đạo\nFramework phân tích & bản đồ chiến lược thực hiện tại chỗ\nBản tóm tắt hành động ngay sau workshop",
                'Đặt lịch workshop', 3,
            ],
        ];
        foreach ($plans as [$name, $price, $desc, $features, $ctaText, $order]) {
            $this->execute(
                "INSERT INTO pricing_plans (name, price, description, features, is_featured, cta_text, cta_link, sort_order, status) VALUES (?, ?, ?, ?, 0, ?, '/lien-he', ?, 'published')",
                [$name, $price, $desc, $features, $ctaText, $order]
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
