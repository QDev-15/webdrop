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
        $this->seedTeamMembers();
        $this->seedTestimonials();
        $this->seedFaqs();
        $this->seedPricingPlans();
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
<h2>1. Thông tin chúng tôi thu thập</h2>
<p>Chúng tôi thu thập các thông tin cần thiết để cung cấp dịch vụ tốt nhất cho bạn, bao gồm: tên, email, số điện thoại, địa chỉ công ty, lĩnh vực kinh doanh, và các thông tin khác mà bạn tự nguyện cung cấp.</p>
<h2>2. Cách chúng tôi sử dụng thông tin</h2>
<p>Thông tin của bạn được sử dụng để: gửi tư vấn và báo giá, liên lạc về các dịch vụ mới, cải thiện dịch vụ của chúng tôi, và tuân thủ các yêu cầu pháp lý.</p>
<h2>3. Bảo vệ dữ liệu</h2>
<p>Chúng tôi sử dụng các biện pháp bảo mật tiên tiến để bảo vệ dữ liệu cá nhân của bạn khỏi truy cập trái phép, thay đổi hoặc phổ biến.</p>
<h2>4. Chia sẻ thông tin</h2>
<p>Chúng tôi không bao giờ chia sẻ thông tin cá nhân của bạn với bên thứ ba mà không có sự đồng ý của bạn, ngoại trừ trường hợp yêu cầu của pháp luật.</p>
<h2>5. Cookies</h2>
<p>Website của chúng tôi sử dụng cookies để cải thiện trải nghiệm người dùng. Bạn có thể tắt cookies trong cài đặt trình duyệt của mình.</p>
<h2>6. Quyền của bạn</h2>
<p>Bạn có quyền truy cập, sửa đổi hoặc xóa thông tin cá nhân của mình. Vui lòng liên hệ với chúng tôi để thực hiện các yêu cầu này.</p>
<h2>7. Liên hệ</h2>
<p>Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật của chúng tôi, vui lòng liên hệ: hello@markco.vn</p>
HTML;

        $termsContent = <<<HTML
<h2>1. Chấp nhận Điều khoản</h2>
<p>Bằng cách sử dụng website này, bạn đồng ý tuân thủ tất cả các điều khoản và điều kiện được nêu dưới đây. Nếu bạn không đồng ý, vui lòng không sử dụng website này.</p>
<h2>2. Giới hạn Trách nhiệm</h2>
<p>Marketing Consultancy không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp, gián tiếp, hoặc hậu quả nào phát sinh từ việc sử dụng website này, bao gồm nhưng không giới hạn trong việc mất dữ liệu, mất lợi nhuận, hoặc gián đoạn kinh doanh.</p>
<h2>3. Quyền Sở hữu Trí tuệ</h2>
<p>Toàn bộ nội dung trên website này, bao gồm văn bản, hình ảnh, logo, là tài sản của Marketing Consultancy. Bạn không được sao chép, phân phối, hoặc sử dụng bất kỳ nội dung nào mà không có sự cho phép bằng văn bản từ chúng tôi.</p>
<h2>4. Liên kết Bên ngoài</h2>
<p>Website của chúng tôi có thể chứa các liên kết đến các trang web bên ngoài. Chúng tôi không chịu trách nhiệm cho nội dung của các trang web này. Vui lòng xem xét các điều khoản sử dụng của họ trước khi truy cập.</p>
<h2>5. Thay đổi Dịch vụ</h2>
<p>Marketing Consultancy có quyền thay đổi, tạm dừng, hoặc chấm dứt dịch vụ mà không cần thông báo trước. Chúng tôi sẽ cố gắng cung cấp thông báo hợp lý nếu có thể.</p>
<h2>6. Điều Luật Áp dụng</h2>
<p>Các điều khoản này được điều chỉnh bởi pháp luật của Cộng hòa Xã hội chủ nghĩa Việt Nam. Bất kỳ tranh chấp nào phát sinh từ các điều khoản này sẽ được giải quyết bởi các tòa án có thẩm quyền tại TP.HCM, Việt Nam.</p>
<h2>7. Liên hệ</h2>
<p>Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ: hello@markco.vn</p>
HTML;

        $settings = [
            // ── Chung ──────────────────────────────────────────────
            ['site_name', 'Markco', 'general'],
            ['site_logo_prefix', 'Mark', 'general'],
            ['site_logo_suffix', 'co', 'general'],
            ['site_tagline', 'Tư vấn Marketing Toàn Diện', 'general'],
            ['site_description', 'Công ty tư vấn marketing hàng đầu. Chiến lược marketing, content, social media, SEO cho doanh nghiệp.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hello@markco.vn', 'general'],
            ['site_phone', '+84 (123) 456-789', 'general'],
            ['site_address', "Tòa nhà A, Tầng 10\nSố 123 Đường Nguyễn Huệ\nQuận 1, TP.HCM, Việt Nam", 'general'],
            ['working_hours', "Thứ Hai — Thứ Sáu: 8:00 — 18:00\nThứ Bảy: 9:00 — 12:00\nChủ Nhật: Nghỉ", 'general'],

            // ── SEO ────────────────────────────────────────────────
            ['meta_title', 'Marketing Consultancy — Chiến lược & Giải pháp Marketing', 'seo'],
            ['meta_description', 'Công ty tư vấn marketing hàng đầu. Chiến lược marketing, content, social media, SEO cho doanh nghiệp.', 'seo'],
            ['meta_keywords', 'tư vấn marketing, chiến lược marketing, content marketing, SEO, social media', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop', 'seo'],

            // ── Mạng xã hội ────────────────────────────────────────
            ['facebook', '#', 'social'],
            ['twitter', '#', 'social'],
            ['linkedin', '#', 'social'],
            ['zalo', '0123456789', 'social'],

            // ── Footer ─────────────────────────────────────────────
            ['footer_copyright', '© 2024 Marketing Consultancy. All rights reserved.', 'footer'],
            ['footer_description', 'Công ty tư vấn marketing toàn diện, giúp doanh nghiệp tăng trưởng bền vững thông qua chiến lược và công nghệ.', 'footer'],

            // ── Liên hệ ────────────────────────────────────────────
            ['map_embed', 'https://maps.google.com/maps?q=21.0285,105.8542&hl=vi&z=15&output=embed', 'contact'],

            // ── Thống kê (dùng chung Trang chủ + Về chúng tôi) ─────
            ['stat1_number', '150', 'stats'],
            ['stat1_suffix', '', 'stats'],
            ['stat1_label', 'Dự án thành công', 'stats'],
            ['stat2_number', '85', 'stats'],
            ['stat2_suffix', '%', 'stats'],
            ['stat2_label', 'Tăng trưởng trung bình', 'stats'],
            ['stat3_number', '45', 'stats'],
            ['stat3_suffix', '', 'stats'],
            ['stat3_label', 'Đội tư vấn viên', 'stats'],
            ['stat4_number', '12', 'stats'],
            ['stat4_suffix', '+', 'stats'],
            ['stat4_label', 'Năm kinh nghiệm', 'stats'],

            // ── Nội dung — Trang chủ ────────────────────────────────
            ['home_services_eyebrow', 'Dịch vụ chính', 'content'],
            ['home_services_title', 'Giải pháp Marketing <em>Toàn Diện</em>', 'content'],
            ['home_services_sub', 'Từ xây dựng chiến lược đến thực hiện, chúng tôi đồng hành cùng bạn tại mỗi bước.', 'content'],
            ['home_process_eyebrow', 'Quy trình làm việc', 'content'],
            ['home_process_title', 'Cách chúng tôi <em>hợp tác</em>', 'content'],
            ['home_process_sub', 'Bốn bước đơn giản để biến thương hiệu bạn trở thành lực mạnh trên thị trường.', 'content'],
            ['home_testimonials_eyebrow', 'Đánh giá từ khách hàng', 'content'],
            ['home_testimonials_title', 'Khách hàng tin tưởng <em>chúng tôi</em>', 'content'],
            ['home_cta_title', 'Sẵn sàng phát triển doanh nghiệp?', 'content'],
            ['home_cta_sub', 'Hãy liên hệ với chúng tôi để nhận tư vấn chiến lược marketing miễn phí.', 'content'],
            ['home_cta_button', 'Yêu cầu tư vấn ngay', 'content'],

            // ── Nội dung — Quy trình làm việc (4 bước cố định) ─────
            ['process1_title', 'Tìm hiểu', 'content'],
            ['process1_desc', 'Phỏng vấn chi tiết, phân tích đối thủ, xác định thử thách chính của doanh nghiệp bạn.', 'content'],
            ['process2_title', 'Lên kế hoạch', 'content'],
            ['process2_desc', 'Xây dựng chiến lược tùy chỉnh, đặt mục tiêu rõ ràng và lộ trình thực hiện chi tiết.', 'content'],
            ['process3_title', 'Thực hiện', 'content'],
            ['process3_desc', 'Chạy các chiến dịch marketing, tạo nội dung, quản lý quảng cáo với sự giám sát chặt chẽ.', 'content'],
            ['process4_title', 'Tối ưu', 'content'],
            ['process4_desc', 'Đo lường kết quả, phân tích dữ liệu, tinh chỉnh chiến lược để đạt ROI tối đa.', 'content'],

            // ── Nội dung — Trang Về chúng tôi ───────────────────────
            ['about_hero_eyebrow', 'Câu chuyện của chúng tôi', 'content'],
            ['about_hero_title', 'Về <em>Markco</em>', 'content'],
            ['about_hero_sub', '12 năm dẫn dắt doanh nghiệp Việt Nam thành công trên thị trường digital.', 'content'],

            ['about_story1_label', 'Khởi nguồn', 'content'],
            ['about_story1_title', 'Bắt đầu từ niềm đam mê', 'content'],
            ['about_story1_desc', "Vào năm 2012, các founder của Markco nhận ra rằng nhiều doanh nghiệp Việt Nam thiếu hiểu biết về marketing digital. Chúng tôi quyết định thành lập Markco để truyền đạt những chiến lược tiên tiến này.\n\nTừ một nhóm 5 người tư vấn viên, chúng tôi đã phát triển thành công ty có 45 chuyên gia đa lĩnh vực.", 'content'],
            ['about_story1_image', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80&auto=format&fit=crop', 'content'],

            ['about_story2_label', 'Sứ mệnh', 'content'],
            ['about_story2_title', 'Trao quyền cho doanh nghiệp', 'content'],
            ['about_story2_desc', 'Sứ mệnh của Markco là giúp các doanh nghiệp hiểu rõ khách hàng của mình và xây dựng chiến lược marketing hiệu quả. Chúng tôi tin rằng với chiến lược đúng đắn, bất kỳ doanh nghiệp nào cũng có thể đạt được tăng trưởng bền vững.', 'content'],
            ['about_story2_image', 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&q=80&auto=format&fit=crop', 'content'],

            ['about_values_eyebrow', 'Giá trị cốt lõi', 'content'],
            ['about_values_title', 'Những giá trị <em>dẫn dắt</em> chúng tôi', 'content'],
            ['value1_icon', '💡', 'content'],
            ['value1_title', 'Đổi mới', 'content'],
            ['value1_desc', 'Luôn tìm kiếm các cách tiếp cận mới trong marketing, không sợ thử nghiệm và học hỏi.', 'content'],
            ['value2_icon', '🤝', 'content'],
            ['value2_title', 'Sự tin tưởng', 'content'],
            ['value2_desc', 'Xây dựng mối quan hệ dài hạn với khách hàng dựa trên tính minh bạch và trách nhiệm.', 'content'],
            ['value3_icon', '📊', 'content'],
            ['value3_title', 'Dữ liệu', 'content'],
            ['value3_desc', 'Mọi quyết định đều dựa trên dữ liệu thực tế, không phải dự đoán hay intuition.', 'content'],
            ['value4_icon', '🚀', 'content'],
            ['value4_title', 'Phát triển', 'content'],
            ['value4_desc', 'Giúp khách hàng phát triển, từ startup cho đến doanh nghiệp lớn, chúng tôi đồng hành.', 'content'],

            ['about_cta_title', 'Sẵn sàng hợp tác?', 'content'],
            ['about_cta_sub', 'Liên hệ với chúng tôi ngay để nhận tư vấn chiến lược marketing miễn phí.', 'content'],
            ['about_cta_button', 'Bắt đầu hôm nay', 'content'],

            // ── Nội dung — Trang Dịch vụ ─────────────────────────────
            ['services_hero_eyebrow', 'Các dịch vụ chính', 'content'],
            ['services_hero_title', 'Giải pháp Marketing <em>Toàn Diện</em>', 'content'],
            ['services_hero_sub', 'Từ chiến lược đến thực hiện, tối ưu hóa kết quả — chúng tôi chăm sóc toàn bộ nhu cầu marketing của bạn.', 'content'],

            ['pricing_eyebrow', 'Gói dịch vụ', 'content'],
            ['pricing_title', 'Chọn gói phù hợp <em>cho doanh nghiệp</em> của bạn', 'content'],
            ['pricing_pkg1_name', 'Gói Startup', 'content'],
            ['pricing_pkg1_price', '5tr/tháng', 'content'],
            ['pricing_pkg1_desc', 'Dành cho startup hoặc doanh nghiệp vừa bắt đầu.', 'content'],
            ['pricing_pkg1_features', "Chiến lược marketing cơ bản\nQuản lý 2 kênh social media\n4 bài blog/tháng\n1 báo cáo/tháng", 'content'],
            ['pricing_pkg2_name', 'Gói Standard', 'content'],
            ['pricing_pkg2_badge', 'Phổ biến', 'content'],
            ['pricing_pkg2_price', '12tr/tháng', 'content'],
            ['pricing_pkg2_desc', 'Dành cho doanh nghiệp vừa và nhỏ.', 'content'],
            ['pricing_pkg2_features', "Chiến lược marketing toàn diện\nQuản lý 4 kênh social media\n8 bài blog/tháng\nQuảng cáo Google/Facebook\n2 báo cáo/tháng", 'content'],
            ['pricing_pkg3_name', 'Gói Premium', 'content'],
            ['pricing_pkg3_price', '25tr+/tháng', 'content'],
            ['pricing_pkg3_desc', 'Dành cho doanh nghiệp lớn và tập đoàn.', 'content'],
            ['pricing_pkg3_features', "Chiến lược marketing tùy chỉnh\nQuản lý toàn bộ kênh\nKhông giới hạn nội dung\nChuyên gia riêng biệt\nTư vấn hàng tuần\nBáo cáo thời gian thực", 'content'],

            ['services_cta_title', 'Không chắc chọn gói nào?', 'content'],
            ['services_cta_sub', 'Hãy liên hệ với chúng tôi để nhận tư vấn miễn phí về giải pháp tốt nhất cho doanh nghiệp của bạn.', 'content'],
            ['services_cta_button', 'Yêu cầu tư vấn', 'content'],

            // ── Nội dung — Trang Đội ngũ ─────────────────────────────
            ['team_hero_eyebrow', 'Gặp đội ngũ', 'content'],
            ['team_hero_title', 'Chuyên gia Marketing <em>Hàng đầu</em>', 'content'],
            ['team_hero_sub', 'Các tư vấn viên có kinh nghiệm nhiều năm, luôn cập nhật xu hướng marketing mới nhất.', 'content'],
            ['team_leadership_eyebrow', 'Lãnh đạo công ty', 'content'],
            ['team_leadership_title', 'Ban <em>Lãnh đạo</em>', 'content'],
            ['team_consultants_eyebrow', 'Đội tư vấn', 'content'],
            ['team_consultants_title', 'Chuyên gia <em>Tư vấn</em>', 'content'],
            ['team_cta_title', 'Sẵn sàng làm việc cùng đội ngũ của chúng tôi?', 'content'],
            ['team_cta_sub', 'Hãy liên hệ với chúng tôi để nhận tư vấn miễn phí từ các chuyên gia.', 'content'],
            ['team_cta_button', 'Bắt đầu hôm nay', 'content'],

            // ── Nội dung — Trang Liên hệ ─────────────────────────────
            ['contact_hero_eyebrow', 'Hãy liên hệ', 'content'],
            ['contact_hero_title', 'Chúng tôi sẵn sàng <em>giúp bạn</em>', 'content'],
            ['contact_hero_sub', 'Gửi tin nhắn cho chúng tôi và chúng tôi sẽ liên lạc lại trong 24h.', 'content'],
            ['contact_free_consult_title', '🎁 Tư vấn miễn phí', 'content'],
            ['contact_free_consult_desc', 'Liên hệ với chúng tôi hôm nay để nhận buổi tư vấn marketing miễn phí trị giá 5 triệu đồng.', 'content'],
            ['contact_free_consult_button', 'Đặt lịch ngay →', 'content'],

            // ── Pháp lý ────────────────────────────────────────────
            ['privacy_content', $privacyContent, 'legal'],
            ['terms_content', $termsContent, 'legal'],

            // ── SMTP ───────────────────────────────────────────────
            ['smtp_host', 'smtp.gmail.com', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from_name', 'Markco', 'smtp'],
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
        // Ghi chú: cột "subtitle" lưu 2 dòng — dòng 1 = nhãn nhỏ phía trên (mc-carousel-label),
        // các dòng còn lại = đoạn mô tả (mc-carousel-sub). HeroSlider.tsx tách bằng ký tự xuống dòng đầu tiên.
        // Nút phụ ("Tìm hiểu thêm" → /ve-chung-toi) dùng chung cho mọi slide (khớp hero_slides core schema
        // chỉ hỗ trợ 1 cặp nút — nút phụ trong template trỏ về about.html ở cả 4 slide).
        $slides = [
            [
                'title' => 'Phát triển thương hiệu với <em>chiến lược Marketing</em> thông minh',
                'subtitle' => "Tư vấn Marketing Toàn Diện\nChúng tôi giúp doanh nghiệp hiểu rõ khách hàng, xây dựng chiến lược marketing mạnh mẽ và đạt được tăng trưởng bền vững.",
                'button_text' => 'Bắt đầu tư vấn',
                'button_link' => '/lien-he',
                'image' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop',
                'sort_order' => 1,
            ],
            [
                'title' => 'Tăng traffic organic và <em>doanh thu</em> bền vững',
                'subtitle' => "Giải pháp SEO\nChiến lược SEO được tối ưu hóa, giúp startup công nghệ tăng traffic gấp 3 lần trong 6 tháng.",
                'button_text' => 'Tư vấn SEO',
                'button_link' => '/lien-he',
                'image' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop',
                'sort_order' => 2,
            ],
            [
                'title' => 'Xây dựng <em>brand story</em> mạnh mẽ',
                'subtitle' => "Content Marketing\nKết hợp blog, video, social media để tạo kết nối sâu sắc với khách hàng tiềm năng.",
                'button_text' => 'Bắt đầu ngay',
                'button_link' => '/lien-he',
                'image' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=800&fit=crop',
                'sort_order' => 3,
            ],
            [
                'title' => 'Chuyển đổi số để <em>cạnh tranh</em> mạnh',
                'subtitle' => "Digital Transformation\nTích hợp các công cụ marketing tự động, CRM, analytics để tăng hiệu suất và giảm chi phí vận hành.",
                'button_text' => 'Tư vấn ngay',
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

    // ─── Extensions (Services / Team / Testimonials) ─────────────────────────

    private function seedServices(): void {
        if ($this->scalar("SELECT COUNT(*) FROM services") > 0) return;
        $services = [
            ['📊', 'Chiến lược Marketing',
                'Phân tích thị trường, xác định target audience, xây dựng roadmap chi tiết cho 6-12 tháng tới.',
                'Phân tích chi tiết thị trường, đối thủ cạnh tranh, xác định target audience và xây dựng roadmap marketing chi tiết cho 6-12 tháng tới. Chúng tôi sử dụng các framework như STP, SWOT, Porter 5 Forces để đảm bảo chiến lược của bạn có cơ sở vững chắc.',
                1],
            ['✍️', 'Content Marketing',
                'Sáng tạo nội dung hấp dẫn, SEO-friendly trên blog, video, infographic để thu hút khách hàng.',
                'Sáng tạo nội dung hấp dẫn, SEO-friendly trên blog, video, infographic. Chúng tôi tạo lịch nội dung, viết bài chất lượng cao, tối ưu hóa cho công cụ tìm kiếm để thu hút khách hàng tiềm năng.',
                2],
            ['📱', 'Social Media',
                'Quản lý toàn bộ kênh social, lên lịch đăng bài, tăng engagement và xây dựng cộng đồng.',
                'Quản lý toàn bộ kênh social media của bạn: Facebook, Instagram, TikTok, LinkedIn. Chúng tôi lên lịch đăng bài, tương tác với cộng đồng, chạy quảng cáo social để tăng engagement và xây dựng một cộng đồng trung thành.',
                3],
            ['🎯', 'Quảng cáo Số',
                'Chạy chiến dịch Google Ads, Facebook Ads với ROI tối ưu. Phân tích, tối ưu hóa liên tục.',
                'Chạy các chiến dịch quảng cáo trả tiền trên Google Search, Display, YouTube và Facebook/Instagram. Chúng tôi xây dựng chiến lược bidding tối ưu, tối ưu hóa landing page, và theo dõi từng metric để đảm bảo ROI cao nhất.',
                4],
            ['🔍', 'SEO & SEM',
                'Tối ưu hóa trang web cho Google, tăng traffic hữu cơ và chuyển đổi khách hàng tiềm năng.',
                'Tối ưu hóa trang web cho Google (on-page SEO, technical SEO, link building). Chúng tôi nghiên cứu từ khóa, tạo chiến lược nội dung, cải thiện tốc độ trang, và xây dựng profile backlink chất lượng cao.',
                5],
            ['📈', 'Phân tích & Report',
                'Theo dõi mỗi chỉ số KPI, cung cấp báo cáo chi tiết, đề xuất cải thiện theo dữ liệu thực tế.',
                'Theo dõi mỗi chỉ số KPI quan trọng bằng Google Analytics 4, Data Studio. Cung cấp báo cáo chi tiết hàng tháng, đề xuất cải thiện dựa trên dữ liệu thực tế, và giúp bạn hiểu rõ ROI của mỗi khoản đầu tư marketing.',
                6],
        ];
        foreach ($services as [$icon, $title, $shortDesc, $longDesc, $order]) {
            $this->execute(
                "INSERT INTO services (icon, title, short_desc, long_desc, sort_order, status) VALUES (?, ?, ?, ?, ?, 'published')",
                [$icon, $title, $shortDesc, $longDesc, $order]
            );
        }
    }

    private function seedTeamMembers(): void {
        if ($this->scalar("SELECT COUNT(*) FROM team_members") > 0) return;
        $team = [
            // Ban lãnh đạo
            ['Nguyễn Hoàng Minh', 'CEO & Founder', '12 năm kinh nghiệm, chuyên gia chiến lược marketing toàn cầu. Đã tư vấn cho 150+ doanh nghiệp.', '👨', 'leadership', 1],
            ['Trần Thị Hương', 'Chief Strategy Officer', '8 năm trong digital marketing, giám sát toàn bộ chiến lược cho các dự án lớn.', '👩', 'leadership', 2],
            ['Lê Quốc Huy', 'Chief Technology Officer', '10 năm về analytics và data science. Chuyên gia tối ưu hóa chiến dịch quảng cáo.', '👨', 'leadership', 3],
            // Đội tư vấn
            ['Phạm Linh Đan', 'Content Strategist', '6 năm viết nội dung, tạo chiến lược content cho các thương hiệu lớn.', '👩', 'consultant', 1],
            ['Đỗ Minh Hải', 'SEO Specialist', '7 năm tối ưu hóa SEO. Đã giúp 80+ website đạt top 1-3 Google.', '👨', 'consultant', 2],
            ['Cao Mỹ Linh', 'Paid Ads Manager', '5 năm quản lý Google Ads và Facebook Ads. Tổng ngân sách quản lý: 100M+.', '👩', 'consultant', 3],
            ['Vũ Thanh Hùng', 'Social Media Manager', '6 năm quản lý social media, xây dựng cộng đồng 500k+ followers.', '👨', 'consultant', 4],
            ['Nguyễn Yên Nhi', 'Analytics Expert', '4 năm phân tích dữ liệu, thiết lập GA4, tạo dashboard tracking KPI.', '👩', 'consultant', 5],
            ['Trần Việt Anh', 'Brand Consultant', '8 năm tư vấn branding. Đã giúp 50+ doanh nghiệp xây dựng brand mạnh.', '👨', 'consultant', 6],
        ];
        foreach ($team as [$name, $position, $bio, $avatar, $tier, $order]) {
            $this->execute(
                "INSERT INTO team_members (name, position, bio, avatar, tier, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, 'published')",
                [$name, $position, $bio, $avatar, $tier, $order]
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $testimonials = [
            ['Trần Thu Hà', 'CEO, E-commerce Store', '👩', '"Công ty tư vấn marketing tuyệt vời. Chỉ trong 3 tháng, doanh thu đã tăng 60%. Đội ngũ chuyên nghiệp, tận tâm."', 5, 1],
            ['Lê Minh Tuấn', 'Quản lý Marketing, F&B', '👨', '"Không chỉ lên chiến lược tốt, Markco còn giải thích rõ ràng từng bước. Có thể theo dõi kết quả mọi lúc qua dashboard."', 5, 2],
            ['Nguyễn Kiều Anh', 'Giám đốc Marketing, SaaS', '👩', '"Sau 6 tháng hợp tác, website traffic tăng gấp 3, conversion rate cũng tăng đáng kể. Rất hài lòng với kết quả."', 5, 3],
        ];
        foreach ($testimonials as [$name, $title, $avatar, $content, $rating, $order]) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, 'published')",
                [$name, $title, $avatar, $content, $rating, $order]
            );
        }
    }

    // ─── Extensions (FAQs — mục H, trang /dich-vu) ───────────────────────────

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $faqs = [
            ['Bao lâu thì thấy kết quả từ chiến dịch marketing?', 'Tùy kênh triển khai: quảng cáo trả phí (Google/Facebook Ads) thường có số liệu đầu tiên sau 1–2 tuần, trong khi SEO và content marketing cần 2–4 tháng để thấy chuyển biến rõ rệt về thứ hạng và traffic tự nhiên. Chúng tôi luôn thống nhất mốc thời gian kỳ vọng cụ thể trước khi bắt đầu.'],
            ['Ngân sách tối thiểu để bắt đầu là bao nhiêu?', 'Gói Startup khởi điểm từ 5 triệu/tháng, phù hợp doanh nghiệp mới bắt đầu làm marketing bài bản. Với ngân sách quảng cáo (ads spend), chúng tôi tư vấn riêng dựa trên ngành hàng và mục tiêu tăng trưởng cụ thể của bạn.'],
            ['Quy trình báo cáo hiệu quả chiến dịch diễn ra như thế nào?', 'Chúng tôi gửi báo cáo định kỳ (1–2 lần/tháng tùy gói) qua Google Data Studio với đầy đủ chỉ số: reach, engagement, traffic, chi phí trên mỗi kết quả (CPA/CPL) và ROI. Kèm theo là nhận định và đề xuất tối ưu cho giai đoạn tiếp theo, không chỉ là con số thô.'],
            ['Markco có cam kết KPI cụ thể không?', 'Có — KPI (số lượng lead, traffic, tỷ lệ chuyển đổi...) được thống nhất bằng văn bản trong hợp đồng dựa trên khảo sát thực tế ngành hàng và ngân sách. Nếu không đạt KPI cam kết do lỗi từ phía chúng tôi, bạn sẽ được bù đắp theo điều khoản đã ký.'],
            ['Hợp đồng tính theo tháng hay theo dự án?', 'Cả hai — dịch vụ retainer (chiến lược, social, content, ads dài hạn) tính theo tháng với cam kết tối thiểu 3 tháng để đảm bảo hiệu quả. Các hạng mục độc lập như SEO audit, thiết kế chiến dịch một lần có thể ký theo dự án.'],
            ['Tôi có được làm việc trực tiếp với account phụ trách không?', 'Có — mỗi khách hàng được gán 1 account manager cố định làm đầu mối liên lạc xuyên suốt hợp đồng, cùng đội chuyên môn (content, ads, SEO) hỗ trợ phía sau. Bạn không phải làm việc qua nhiều người khác nhau ở mỗi giai đoạn.'],
            ['Tôi có thể dừng hoặc điều chỉnh hợp đồng giữa chừng không?', 'Có — sau giai đoạn cam kết tối thiểu, hợp đồng gia hạn theo tháng và có thể điều chỉnh phạm vi dịch vụ hoặc dừng lại với thông báo trước 30 ngày, theo đúng điều khoản đã ký.'],
        ];
        foreach ($faqs as $i => [$question, $answer]) {
            $this->execute(
                "INSERT INTO faqs (question, answer, page, sort_order, status) VALUES (?, ?, 'dich-vu', ?, 'published')",
                [$question, $answer, $i + 1]
            );
        }
    }

    // ─── Extensions (Pricing Plans — mục I, trang /dich-vu) ──────────────────

    private function seedPricingPlans(): void {
        if ($this->scalar("SELECT COUNT(*) FROM pricing_plans") > 0) return;
        $plans = [
            [
                'name' => 'Gói Startup', 'price' => '5tr/tháng',
                'description' => 'Dành cho startup hoặc doanh nghiệp vừa bắt đầu.',
                'features' => "Chiến lược marketing cơ bản\nQuản lý 2 kênh social media\n4 bài blog/tháng\n1 báo cáo/tháng",
                'is_featured' => 0, 'cta_text' => 'Chọn gói Startup', 'cta_link' => '/lien-he', 'sort_order' => 1,
            ],
            [
                'name' => 'Gói Standard', 'price' => '12tr/tháng',
                'description' => 'Dành cho doanh nghiệp vừa và nhỏ.',
                'features' => "Chiến lược marketing toàn diện\nQuản lý 4 kênh social media\n8 bài blog/tháng\nQuảng cáo Google/Facebook\n2 báo cáo/tháng",
                'is_featured' => 1, 'cta_text' => 'Chọn gói Standard', 'cta_link' => '/lien-he', 'sort_order' => 2,
            ],
            [
                'name' => 'Gói Premium', 'price' => '25tr+/tháng',
                'description' => 'Dành cho doanh nghiệp lớn và tập đoàn.',
                'features' => "Chiến lược marketing tùy chỉnh\nQuản lý toàn bộ kênh\nKhông giới hạn nội dung\nChuyên gia riêng biệt\nTư vấn hàng tuần\nBáo cáo thời gian thực",
                'is_featured' => 0, 'cta_text' => 'Liên hệ tư vấn', 'cta_link' => '/lien-he', 'sort_order' => 3,
            ],
        ];
        foreach ($plans as $plan) {
            $this->execute(
                "INSERT INTO pricing_plans (name, price, description, features, is_featured, cta_text, cta_link, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published')",
                [$plan['name'], $plan['price'], $plan['description'], $plan['features'], $plan['is_featured'], $plan['cta_text'], $plan['cta_link'], $plan['sort_order']]
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
