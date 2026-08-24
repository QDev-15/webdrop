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
        $sql = file_get_contents($schemaPath);
        if ($sql === false) {
            throw new \RuntimeException('Cannot read schema.sql: ' . $schemaPath);
        }
        // Strip comment lines TRƯỚC khi split — tránh filter loại bỏ CREATE TABLE sau comment block
        $sql = preg_replace('/^\s*--.*$/m', '', $sql);
        $statements = array_filter(array_map('trim', explode(';', $sql)), fn($s) => $s !== '');
        foreach ($statements as $stmt) {
            $this->pdo->exec($stmt . ';');
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
        $this->seedProjects();
        $this->seedTestimonials();
        $this->seedFaqs();
        $this->seedPricingPlans();
        $this->seedTimelineItems();
    }

    // ─── Users ─────────────────────────────────────────────────────────────────

    private function seedUsers(): void {
        if ($this->scalar("SELECT COUNT(*) FROM users") > 0) return;
        $hash = password_hash('123456', PASSWORD_DEFAULT);
        $this->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['Admin', 'sysadmin@admin.com', $hash, 'superadmin']
        );
    }

    // ─── Settings ──────────────────────────────────────────────────────────────

    private function seedSettings(): void {
        if ($this->scalar("SELECT COUNT(*) FROM settings") > 0) return;
        $settings = [
            // ── Thông tin chung ──
            ['site_name', 'Đỗ Khánh Linh', 'general'],
            ['nav_logo_name', 'Khánh Linh', 'general'],
            ['site_tagline', 'Product Designer', 'general'],
            ['site_description', 'Đỗ Khánh Linh — Senior Product Designer chuyên thiết kế UX/UI cho ứng dụng mobile fintech/e-commerce, dashboard SaaS B2B và design system. 6 năm kinh nghiệm, TP.HCM.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hello@khanhlinh.design', 'general'],
            ['site_phone', '+84 90 234 5678', 'general'],
            ['site_address', 'Quận 1, TP. Hồ Chí Minh', 'general'],
            ['availability_status', 'Đang nhận dự án mới cho Q4/2026', 'general'],

            // ── SEO ──
            ['meta_title', 'Đỗ Khánh Linh — Product Designer | UX cho Mobile App & SaaS Dashboard', 'seo'],
            ['meta_description', 'Đỗ Khánh Linh — Senior Product Designer chuyên thiết kế UX/UI cho ứng dụng mobile fintech/e-commerce, dashboard SaaS B2B và design system. 6 năm kinh nghiệm, TP.HCM.', 'seo'],
            ['meta_keywords', 'product designer, UX designer TP.HCM, thiết kế UX/UI mobile app, SaaS dashboard design, design system', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=1200&q=80&auto=format&fit=crop', 'seo'],

            // ── Mạng xã hội ──
            ['zalo_phone', '0902345678', 'social'],
            ['social_linkedin', 'https://linkedin.com', 'social'],
            ['social_behance', 'https://behance.net', 'social'],
            ['social_dribbble', 'https://dribbble.com', 'social'],
            ['social_facebook', 'https://facebook.com', 'social'],

            // ── Footer ──
            ['footer_description', 'Product Designer chuyên UX/UI cho ứng dụng mobile fintech, e-commerce và dashboard SaaS B2B. Nhận dự án freelance & tư vấn tại TP.HCM.', 'footer'],
            ['footer_copyright', '© 2026 Đỗ Khánh Linh Design Studio. All rights reserved.', 'footer'],
            ['footer_tagline', 'Made with care in Vietnam.', 'footer'],

            // ── Liên hệ / Bản đồ ──
            ['map_embed', 'https://maps.google.com/maps?q=10.7769,106.7009&hl=vi&z=15&output=embed', 'contact'],

            // ── Nội dung trang — Trang chủ ──
            ['home_intro_eyebrow', 'Giới thiệu', 'content'],
            ['home_intro_title', 'Từ nghiên cứu người dùng đến *giao diện production-ready.*', 'content'],
            ['home_intro_text1', 'Tôi là Khánh Linh — Senior Product Designer với 6 năm làm việc tại 2 startup fintech và 1 agency công nghệ tại TP.HCM. Hiện tại tôi nhận tư vấn và thiết kế UX/UI theo dự án cho các startup và doanh nghiệp SaaS đang mở rộng sản phẩm.', 'content'],
            ['home_intro_text2', 'Thế mạnh của tôi là biến những luồng nghiệp vụ phức tạp — thanh toán, KYC, báo cáo vận hành — thành trải nghiệm đơn giản, đo lường được bằng số liệu thật chứ không chỉ "trông đẹp hơn".', 'content'],
            ['home_intro_image', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=700&q=80&auto=format&fit=crop', 'content'],
            ['home_intro_tags', "Mobile App UX\nSaaS Dashboard\nDesign System\nUX Research", 'content'],
            ['home_projects_eyebrow', 'Dự án nổi bật', 'content'],
            ['home_projects_title', 'Một vài công việc *gần đây.*', 'content'],
            ['stat1_number', '38', 'content'], ['stat1_suffix', '+', 'content'], ['stat1_label', 'Dự án đã hoàn thành', 'content'],
            ['stat2_number', '6', 'content'], ['stat2_suffix', ' năm', 'content'], ['stat2_label', 'Kinh nghiệm ngành', 'content'],
            ['stat3_number', '21', 'content'], ['stat3_suffix', '+', 'content'], ['stat3_label', 'Khách hàng & startup', 'content'],
            ['stat4_number', '94', 'content'], ['stat4_suffix', '%', 'content'], ['stat4_label', 'Khách quay lại hợp tác', 'content'],
            ['home_testi_eyebrow', 'Khách hàng nói gì', 'content'],
            ['home_testi_title', 'Được tin tưởng bởi *đội ngũ sản phẩm.*', 'content'],

            // ── Nội dung trang — Dự án ──
            ['projects_hero_eyebrow', 'Portfolio', 'content'],
            ['projects_hero_title', 'Dự án UX/UI cho *mobile app & sản phẩm SaaS.*', 'content'],
            ['projects_hero_sub', '12 dự án tiêu biểu trải dài từ ứng dụng fintech, e-commerce, sức khỏe đến dashboard quản trị B2B và bộ design system dùng nội bộ.', 'content'],

            // ── Nội dung trang — Dịch vụ ──
            ['services_hero_eyebrow', 'Dịch vụ', 'content'],
            ['services_hero_title', 'Từ audit nhanh đến *thiết kế sản phẩm trọn gói.*', 'content'],
            ['services_hero_sub', 'Tôi làm việc theo dự án hoặc theo giai đoạn — phù hợp cho startup cần audit nhanh lẫn doanh nghiệp cần đội ngũ thiết kế đồng hành dài hạn.', 'content'],
            ['feat1_icon', '🔍', 'content'], ['feat1_title', 'UX Research', 'content'], ['feat1_desc', 'Phỏng vấn người dùng, phân tích funnel/analytics, usability testing — tìm đúng vấn đề trước khi thiết kế.', 'content'],
            ['feat2_icon', '📱', 'content'], ['feat2_title', 'Mobile App UX/UI', 'content'], ['feat2_desc', 'Thiết kế app iOS/Android cho fintech, e-commerce — từ wireframe đến file handoff production-ready.', 'content'],
            ['feat3_icon', '📊', 'content'], ['feat3_title', 'SaaS Dashboard Design', 'content'], ['feat3_desc', 'Thiết kế dashboard quản trị B2B — trực quan hóa dữ liệu phức tạp thành giao diện dễ thao tác.', 'content'],
            ['feat4_icon', '🧩', 'content'], ['feat4_title', 'Design System', 'content'], ['feat4_desc', 'Xây bộ component, design token, tài liệu dùng chung — đồng bộ trải nghiệm, tăng tốc độ ship.', 'content'],
            ['feat5_icon', '🧪', 'content'], ['feat5_title', 'Usability Testing', 'content'], ['feat5_desc', 'Kiểm thử prototype với người dùng thật, đo task success rate và time-on-task trước khi ra mắt.', 'content'],
            ['feat6_icon', '🤝', 'content'], ['feat6_title', 'Tư vấn Product Design', 'content'], ['feat6_desc', 'Đồng hành cùng team nội bộ theo giờ/tháng — review thiết kế, mentor designer junior, định hướng UX.', 'content'],
            ['pricing_sub', 'Giá tham khảo — điều chỉnh theo độ phức tạp thực tế, luôn được báo giá chính thức bằng văn bản trước khi bắt đầu.', 'content'],
            ['faq_eyebrow', 'Câu hỏi thường gặp', 'content'],
            ['faq_title', 'Còn thắc mắc? *Xem giải đáp bên dưới.*', 'content'],
            ['faq_sub', 'Không tìm thấy câu trả lời bạn cần? Liên hệ trực tiếp — tôi phản hồi trong vòng 24 giờ.', 'content'],
            ['cta_services_eyebrow', 'Bắt đầu dự án', 'content'],
            ['cta_services_title', 'Sẵn sàng thiết kế lại *trải nghiệm sản phẩm của bạn?*', 'content'],
            ['cta_services_sub', 'Đặt lịch trao đổi 30 phút miễn phí — tôi sẽ giúp bạn xác định gói dịch vụ phù hợp nhất với giai đoạn hiện tại.', 'content'],

            // ── Nội dung trang — Về tôi ──
            ['about_hero_eyebrow', 'Về tôi', 'content'],
            ['about_hero_title', '6 năm theo đuổi *trải nghiệm sản phẩm tốt hơn.*', 'content'],
            ['about_hero_sub', 'Từ UI Designer tại agency đến Senior Product Designer dẫn dắt redesign core app cho startup fintech — giờ đây tôi đồng hành cùng nhiều đội sản phẩm với vai trò tư vấn độc lập.', 'content'],
            ['about_bio_eyebrow', 'Giới thiệu', 'content'],
            ['about_bio_title', 'Tôi tin thiết kế tốt phải *đo lường được, không chỉ đẹp hơn.*', 'content'],
            ['about_bio_text1', 'Tôi là Đỗ Khánh Linh, Senior Product Designer với 6 năm kinh nghiệm chuyên sâu vào thiết kế UX/UI cho ứng dụng mobile (fintech, e-commerce) và dashboard SaaS B2B. Tôi từng làm việc tại 2 startup fintech và 1 agency công nghệ tại TP.HCM trước khi chuyển sang nhận dự án tư vấn độc lập.', 'content'],
            ['about_bio_text2', 'Cách tiếp cận của tôi luôn bắt đầu từ dữ liệu và hành vi người dùng thật — không thiết kế theo cảm tính. Mỗi dự án tôi làm đều đi kèm một chỉ số cụ thể để đo thành công: conversion, task success rate, retention hoặc thời gian thao tác.', 'content'],
            ['about_bio_image', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=700&q=80&auto=format&fit=crop', 'content'],
            ['about_bio_badge_number', '6 năm', 'content'],
            ['about_bio_badge_label', 'Kinh nghiệm ngành', 'content'],
            ['about_tags', "Human-centered\nData-informed\nDetail-obsessed", 'content'],
            ['about_cv_link', 'https://drive.google.com', 'content'],
            ['timeline_eyebrow', 'Hành trình', 'content'],
            ['timeline_title', 'Từ UI Designer đến *Product Designer độc lập.*', 'content'],
            ['skills_eyebrow', 'Kỹ năng', 'content'],
            ['skills_title', 'Công cụ & *phương pháp.*', 'content'],
            ['skills_desc', 'Bộ công cụ tôi dùng xuyên suốt quy trình — từ nghiên cứu, thiết kế đến kiểm thử và bàn giao.', 'content'],
            ['skillgroup1_label', 'Thiết kế', 'content'],
            ['skillgroup1_items', "Figma\nFigJam\nFramer\nAdobe Illustrator\nPrinciple", 'content'],
            ['skillgroup2_label', 'Nghiên cứu & kiểm thử', 'content'],
            ['skillgroup2_items', "Maze\nUserTesting\nHotjar\nGoogle Analytics\nLookback", 'content'],
            ['skillgroup3_label', 'Cộng tác & quản lý', 'content'],
            ['skillgroup3_items', "Notion\nSlack\nJira\nZeplin\nLoom", 'content'],
            ['testi_full_eyebrow', 'Khách hàng nói gì', 'content'],
            ['testi_full_title', 'Phản hồi từ *những người đã hợp tác.*', 'content'],

            // ── Nội dung trang — Liên hệ ──
            ['contact_hero_eyebrow', 'Liên hệ', 'content'],
            ['contact_hero_title', 'Cùng thiết kế *bước tiếp theo cho sản phẩm.*', 'content'],
            ['contact_hero_sub', 'Điền form bên dưới hoặc nhắn trực tiếp qua Zalo/email — tôi phản hồi trong vòng 24 giờ làm việc.', 'content'],
            ['contact_info_title', 'Chọn cách *bạn thấy tiện nhất.*', 'content'],
            ['map_section_eyebrow', 'Vị trí', 'content'],
            ['map_section_title', 'Làm việc tại *TP. Hồ Chí Minh,* nhận dự án từ xa toàn quốc.', 'content'],

            // ── Nội dung trang — Case study CTA cuối ──
            ['cta_project_title', 'Bạn có dự án tương tự? Liên hệ tôi', 'content'],

            // ── Pháp lý ──
            ['legal_updated', '01/08/2026', 'legal'],
            ['privacy_content', "<h4>1. Thông tin thu thập</h4><p>Khi bạn liên hệ qua form trên website, tôi thu thập các thông tin bạn chủ động cung cấp: họ tên, email, số điện thoại (nếu có), loại dự án và mô tả nhu cầu. Tôi không thu thập thông tin nhạy cảm hoặc dữ liệu vượt quá mục đích tư vấn dự án.</p><h4>2. Mục đích sử dụng thông tin</h4><p>Thông tin bạn cung cấp chỉ được dùng để: (a) phản hồi yêu cầu tư vấn của bạn, (b) trao đổi báo giá và phạm vi dự án, (c) gửi tài liệu liên quan đến dự án đã ký kết. Tôi không bán, cho thuê hay chia sẻ thông tin liên hệ của bạn cho bên thứ ba vì mục đích thương mại.</p><h4>3. Bảo mật dữ liệu dự án</h4><p>Mọi tài liệu, dữ liệu nghiên cứu người dùng và thông tin nghiệp vụ khách hàng cung cấp trong quá trình hợp tác được lưu trữ trong không gian làm việc riêng (Figma, Notion) có kiểm soát quyền truy cập. Với dự án yêu cầu bảo mật cao, tôi sẵn sàng ký thỏa thuận bảo mật (NDA) riêng theo yêu cầu.</p><h4>4. Cookie & công cụ phân tích</h4><p>Website này không sử dụng cookie theo dõi quảng cáo. Có thể sử dụng công cụ phân tích lượt truy cập cơ bản (ẩn danh) để hiểu hành vi khách truy cập nhằm cải thiện nội dung portfolio.</p><h4>5. Quyền của bạn</h4><p>Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân đã cung cấp bất kỳ lúc nào bằng cách liên hệ trực tiếp qua email hello@khanhlinh.design. Yêu cầu sẽ được xử lý trong vòng 7 ngày làm việc.</p><h4>6. Thay đổi chính sách</h4><p>Chính sách bảo mật này có thể được cập nhật theo thời gian. Phiên bản mới nhất luôn được đăng tải tại trang này.</p>", 'legal'],
            ['terms_content', "<h4>1. Phạm vi dịch vụ</h4><p>Đỗ Khánh Linh cung cấp dịch vụ tư vấn và thiết kế UX/UI theo 3 gói dịch vụ được công bố tại trang Dịch vụ. Phạm vi công việc cụ thể của từng dự án được quy định chi tiết trong hợp đồng/báo giá xác nhận giữa hai bên, không mặc nhiên áp dụng nội dung mô tả trên website.</p><h4>2. Bảng giá tham khảo</h4><p>Mức giá công bố trên website là giá tham khảo, có thể thay đổi tùy theo quy mô, độ phức tạp nghiệp vụ và số lượng màn hình thực tế sau buổi trao đổi đầu tiên. Báo giá chính thức được xác nhận bằng văn bản trước khi triển khai.</p><h4>3. Quyền sở hữu trí tuệ</h4><p>File thiết kế Figma và tài liệu bàn giao thuộc quyền sở hữu trí tuệ của Đỗ Khánh Linh cho đến khi khách hàng hoàn tất nghĩa vụ thanh toán theo thỏa thuận. Sau khi thanh toán đầy đủ, khách hàng nhận toàn quyền sử dụng và chỉnh sửa file thiết kế.</p><h4>4. Thay đổi & phát sinh phạm vi</h4><p>Mọi thay đổi phạm vi công việc sau khi đã chốt (ví dụ thêm màn hình, đổi luồng nghiệp vụ) có thể phát sinh chi phí và thời gian bổ sung, được hai bên thống nhất trước khi thực hiện.</p><h4>5. Trách nhiệm các bên</h4><p>Tôi cam kết thực hiện đúng phạm vi công việc, tiến độ và chất lượng theo thỏa thuận. Khách hàng có trách nhiệm cung cấp thông tin nghiệp vụ, dữ liệu người dùng (nếu có) chính xác và phản hồi góp ý đúng thời hạn để đảm bảo tiến độ dự án.</p><h4>6. Liên hệ</h4><p>Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ hello@khanhlinh.design hoặc +84 90 234 5678.</p>", 'legal'],

            // ── SMTP ──
            ['smtp_host', '', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from_name', 'Đỗ Khánh Linh', 'smtp'],
            ['smtp_from_email', '', 'smtp'],

            // ── Nâng cao ──
            ['maintenance_mode', '0', 'system'],
            ['items_per_page', '20', 'system'],

            // ── Cloudinary ──
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key', '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],

            // ── Tích hợp ──
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];
        foreach ($settings as [$key, $value, $group]) {
            $this->execute(
                "INSERT OR IGNORE INTO settings (key, value, grp) VALUES (?, ?, ?)",
                [$key, $value, $group]
            );
        }
    }

    // ─── Hero Slides (index.html — carousel H2 Split 45/55, 4 slide) ────────────

    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        // title dùng cú pháp *từ* -> in nghiêng gradient (parse ở HeroSlider.tsx).
        // subtitle format: "<nhãn eyebrow>||<đoạn mô tả>".
        // button_text/button_link lưu nút ACCENT chính — nút phụ (ghost) hardcode theo index slide
        // trong HeroSlider.tsx, đúng như thiết kế gốc (giống pattern portfolio-kien-truc-su).
        $slides = [
            [
                'title' => 'Tôi thiết kế sản phẩm số mà *người dùng thực sự muốn dùng.*',
                'subtitle' => 'Product Designer · TP.HCM||6 năm chuyên sâu UX/UI cho app mobile fintech, e-commerce và dashboard SaaS B2B — từ nghiên cứu người dùng đến giao diện production-ready.',
                'image' => 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=1000&q=80&auto=format&fit=crop',
                'button_text' => 'Xem dự án',
                'button_link' => '/du-an',
                'sort_order' => 1,
            ],
            [
                'title' => 'Ứng dụng *fintech & e-commerce* dễ dùng ngay lần chạm đầu tiên.',
                'subtitle' => 'Chuyên môn · Mobile App UX||Tối ưu luồng onboarding, thanh toán và checkout — giảm tỉ lệ bỏ giữa chừng, tăng tỉ lệ hoàn tất giao dịch cho app iOS/Android.',
                'image' => 'https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=1000&q=80&auto=format&fit=crop',
                'button_text' => 'Case study FinPay',
                'button_link' => '/du-an/redesign-app-vi-dien-tu-finpay',
                'sort_order' => 2,
            ],
            [
                'title' => 'Dashboard B2B *rõ ràng, nhanh thao tác,* ít gây quá tải.',
                'subtitle' => 'Chuyên môn · SaaS Dashboard||Thiết kế thông tin phức tạp thành giao diện dễ đọc — cho đội vận hành, sales và quản lý ra quyết định nhanh hơn mỗi ngày.',
                'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=80&auto=format&fit=crop',
                'button_text' => 'Case study Dashboard',
                'button_link' => '/du-an/dashboard-lotrack-logistics',
                'sort_order' => 3,
            ],
            [
                'title' => 'Design system *nhất quán* giúp team ship nhanh hơn.',
                'subtitle' => 'Chuyên môn · Design System||Xây bộ component, design token và tài liệu dùng chung — giảm thời gian thiết kế lặp lại, đồng bộ trải nghiệm trên mọi sản phẩm.',
                'image' => 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&q=80&auto=format&fit=crop',
                'button_text' => 'Xem dự án',
                'button_link' => '/du-an',
                'sort_order' => 4,
            ],
        ];
        foreach ($slides as $slide) {
            $this->execute(
                "INSERT INTO hero_slides (title, subtitle, image, button_text, button_link, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                [$slide['title'], $slide['subtitle'], $slide['image'], $slide['button_text'], $slide['button_link'], $slide['sort_order']]
            );
        }
    }

    // ─── Projects (du-an.html + du-an-chi-tiet-1/2.html) ────────────────────────

    private function seedProjects(): void {
        if ($this->scalar("SELECT COUNT(*) FROM projects") > 0) return;

        // ── Case study 1 — Redesign app ví điện tử FinPay ──
        $challengeIntro1 = 'FinPay là ví điện tử với 1.2 triệu người dùng, nhưng dữ liệu funnel cho thấy 41% người dùng thoát ra ngay tại màn hình xác nhận nạp tiền — bước quan trọng nhất của luồng thanh toán. Đội ngũ vận hành nhận trung bình 340 ticket hỗ trợ/tháng liên quan đến "không hiểu vì sao giao dịch bị treo" hoặc "không tìm thấy nút xác nhận".';
        $challengeDetails1 = "Giao diện cũ được xây dựng từ 2021, tích lũy nhiều tính năng chồng chéo qua thời gian — mỗi màn hình trung bình có 14 phần tử tương tác, không phân cấp rõ thông tin quan trọng (số tiền, phí giao dịch, thời gian xử lý) khỏi thông tin phụ. Người dùng lớn tuổi và người dùng lần đầu là hai nhóm bị ảnh hưởng nặng nhất theo dữ liệu phỏng vấn.\n\nMục tiêu đặt ra: giảm tỉ lệ bỏ giữa chừng xuống dưới 15%, đồng thời không làm chậm tốc độ xử lý giao dịch của backend hiện có.";
        $solutionItems1 = implode("\n", [
            '01 · UX Research|https://images.unsplash.com/photo-1553877522-43269d4ea984?w=700&q=80&auto=format&fit=crop|Phỏng vấn 18 người dùng + phân tích funnel analytics|Phỏng vấn bán cấu trúc 18 người dùng thuộc 3 nhóm hành vi (thường xuyên/thỉnh thoảng/lần đầu), kết hợp phân tích heatmap và funnel drop-off trên 30 ngày dữ liệu thật để xác định chính xác điểm gãy trải nghiệm.',
            '02 · Wireframe|https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=700&q=80&auto=format&fit=crop|Tái cấu trúc luồng nạp tiền từ 6 bước xuống 3 bước|Vẽ lại information architecture, gộp các bước xác thực trùng lặp, tách rõ vùng "thông tin cần xác nhận" khỏi "tùy chọn nâng cao" — kiểm tra logic luồng bằng low-fidelity wireframe trước khi lên UI.',
            '03 · UI Design|https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=700&q=80&auto=format&fit=crop|Thiết kế lại visual hierarchy và design token|Xây bộ token màu/typography riêng cho trạng thái giao dịch (đang xử lý/thành công/lỗi), tăng kích thước số tiền và nút xác nhận chính, giảm mật độ phần tử trên mỗi màn hình từ 14 xuống còn 6-8.',
            '04 · Usability Testing|https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=700&q=80&auto=format&fit=crop|2 vòng kiểm thử với 12 người dùng thật|Kiểm thử moderated qua prototype Figma với 12 người dùng (6 người/vòng), đo task success rate và time-on-task, tinh chỉnh copy + vị trí nút bấm dựa trên hành vi thật trước khi bàn giao cho đội kỹ thuật.',
        ]);
        $gallery1 = implode("\n", [
            'https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=900&q=80&auto=format&fit=crop|Màn hình chính app FinPay sau redesign|g-tall',
            'https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=700&q=80&auto=format&fit=crop|Màn hình nạp tiền app FinPay|g2',
            'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=700&q=80&auto=format&fit=crop|Màn hình xác nhận giao dịch app FinPay|g3',
        ]);
        $resultsItems1 = implode("\n", [
            '32|%|Tăng conversion nạp tiền',
            '45|%|Tăng task success rate',
            '18|%|Tăng retention 30 ngày',
            '25|%|Giảm ticket hỗ trợ',
        ]);
        $resultsNote1 = 'Task success rate của luồng nạp tiền tăng từ 58% lên 84% sau 2 vòng usability testing; thời gian trung bình để hoàn tất một giao dịch giảm từ 96 giây xuống còn 41 giây.';

        // ── Case study 2 — Dashboard LoTrack Logistics ──
        $challengeIntro2 = 'LoTrack vận hành nền tảng logistics cho hơn 200 điều phối viên trên toàn quốc. Dashboard cũ hiển thị mọi đơn hàng trong một bảng dữ liệu phẳng — không phân biệt đơn cần xử lý gấp với đơn đang chạy bình thường, khiến điều phối viên phải tự lọc thủ công và thường xuyên bỏ sót đơn trễ hạn.';
        $challengeDetails2 = "Thời gian trung bình để xử lý xong 1 đơn hàng (từ lúc mở dashboard đến khi cập nhật trạng thái) là 3 phút 40 giây — quá chậm so với khối lượng 400-600 đơn/ngày mỗi điều phối viên phải xử lý trong giờ cao điểm. Đội vận hành ghi nhận nhiều lỗi cập nhật sai trạng thái do giao diện dễ gây nhầm lẫn.\n\nMục tiêu: giảm thời gian thao tác trung bình, giảm lỗi cập nhật trạng thái, và giúp điều phối viên mới làm quen hệ thống nhanh hơn trong tuần đầu onboarding.";
        $solutionItems2 = implode("\n", [
            '01 · UX Research|https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&q=80&auto=format&fit=crop|Contextual inquiry tại 2 trung tâm điều phối|Quan sát trực tiếp 9 điều phối viên làm việc tại 2 trung tâm vận hành trong ca cao điểm, ghi nhận thao tác thật, số lần chuyển tab và các "workaround" họ tự tạo ra để bù đắp thiếu sót của hệ thống cũ.',
            '02 · Information Architecture|https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&q=80&auto=format&fit=crop|Nhóm đơn hàng theo mức độ ưu tiên xử lý|Thiết kế lại cấu trúc điều hướng theo 3 nhóm: "Cần xử lý ngay", "Đang chạy" và "Đã hoàn tất" — thay vì một bảng phẳng duy nhất, giúp điều phối viên nhìn thấy việc cần ưu tiên trong vòng 3 giây đầu.',
            '03 · UI Design|https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80&auto=format&fit=crop|Data visualization + hệ màu trạng thái đơn hàng|Xây hệ thống màu và icon nhất quán cho từng trạng thái đơn (trễ hạn, đang giao, hoàn tất), thêm bảng tổng quan số liệu đầu trang giúp quản lý ca nắm tình hình mà không cần lọc thủ công.',
            '04 · Usability Testing|https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&q=80&auto=format&fit=crop|Đo thời gian xử lý thật trên prototype tương tác|Kiểm thử với 10 điều phối viên trên prototype có dữ liệu mô phỏng thật, đo time-on-task cho 5 kịch bản phổ biến nhất, tinh chỉnh vị trí nút cập nhật trạng thái theo kết quả đo được trước khi bàn giao.',
        ]);
        $gallery2 = implode("\n", [
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop|Màn hình tổng quan dashboard LoTrack sau redesign|g-tall',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80&auto=format&fit=crop|Màn hình danh sách đơn hàng ưu tiên LoTrack|g2',
            'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=700&q=80&auto=format&fit=crop|Màn hình chi tiết đơn hàng LoTrack|g3',
        ]);
        $resultsItems2 = implode("\n", [
            '40|%|Giảm thời gian thao tác',
            '25|%|Giảm ticket hỗ trợ nội bộ',
            '20| điểm|Tăng điểm NPS nội bộ',
            '52|%|Tăng task success rate',
        ]);
        $resultsNote2 = 'Thời gian xử lý trung bình mỗi đơn giảm từ 3 phút 40 giây xuống còn 2 phút 12 giây; thời gian onboarding điều phối viên mới rút ngắn từ 5 ngày còn 2 ngày.';

        $projects = [
            [
                'title' => 'Redesign app ví điện tử FinPay', 'slug' => 'redesign-app-vi-dien-tu-finpay', 'category' => 'Mobile App · Fintech',
                'image' => 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=700&q=80&auto=format&fit=crop',
                'short_desc' => 'Thiết kế lại luồng nạp/rút tiền và thanh toán QR — tăng tỉ lệ hoàn tất giao dịch 32%.',
                'year' => '2025', 'has_case_study' => 1,
                'client_name' => 'FinPay Technologies',
                'hero_desc' => 'Thiết kế lại luồng nạp/rút tiền và thanh toán QR cho ứng dụng ví điện tử với 1.2 triệu người dùng — giải quyết tình trạng bỏ giữa chừng cao tại bước xác nhận giao dịch.',
                'industry' => 'Fintech · Ví điện tử', 'duration' => '10 tuần', 'services_provided' => 'UX Research · UI Design · Usability Testing',
                'key_result' => '+32% conversion nạp tiền',
                'challenge_title' => 'Người dùng bỏ giữa chừng ngay tại *bước xác nhận giao dịch.*',
                'challenge_intro' => $challengeIntro1, 'challenge_details' => $challengeDetails1,
                'solution_items' => $solutionItems1,
                'gallery_images' => $gallery1,
                'results_items' => $resultsItems1, 'results_note' => $resultsNote1,
                'testimonial_content' => 'Linh không chỉ làm đẹp giao diện — bạn ấy đào sâu vào dữ liệu funnel thật của tụi mình để tìm đúng vấn đề trước khi vẽ bất kỳ màn hình nào. Kết quả vượt cả kỳ vọng ban đầu của team.',
                'testimonial_author' => 'Nguyễn Hoàng Phúc', 'testimonial_role' => 'Chief Product Officer, FinPay Technologies',
                'featured' => 1, 'sort_order' => 1,
            ],
            [
                'title' => 'Dashboard LoTrack Logistics', 'slug' => 'dashboard-lotrack-logistics', 'category' => 'SaaS Dashboard · Logistics',
                'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80&auto=format&fit=crop',
                'short_desc' => 'Thiết kế lại dashboard vận hành đơn hàng cho 200+ điều phối viên — giảm 40% thời gian thao tác.',
                'year' => '2025', 'has_case_study' => 1,
                'client_name' => 'LoTrack Logistics',
                'hero_desc' => 'Thiết kế lại dashboard điều phối đơn hàng cho hơn 200 nhân sự vận hành — chuyển từ bảng dữ liệu quá tải sang giao diện phân cấp theo mức độ ưu tiên xử lý.',
                'industry' => 'Logistics SaaS · B2B', 'duration' => '12 tuần', 'services_provided' => 'UX Research · IA · UI Design · Usability Testing',
                'key_result' => '-40% thời gian thao tác',
                'challenge_title' => 'Điều phối viên phải mở *4-5 tab để xử lý một đơn hàng.*',
                'challenge_intro' => $challengeIntro2, 'challenge_details' => $challengeDetails2,
                'solution_items' => $solutionItems2,
                'gallery_images' => $gallery2,
                'results_items' => $resultsItems2, 'results_note' => $resultsNote2,
                'testimonial_content' => 'Linh dành hẳn 1 tuần ngồi cùng điều phối viên của tụi mình tại trung tâm vận hành trước khi vẽ bất kỳ wireframe nào. Đó là lý do giải pháp cuối cùng thực sự khớp với cách team mình làm việc, không phải chỉ đẹp trên giấy.',
                'testimonial_author' => 'Trần Thu Hà', 'testimonial_role' => 'Product Lead, LoTrack Logistics',
                'featured' => 1, 'sort_order' => 2,
            ],
            [
                'title' => 'App mua sắm ShopNow', 'slug' => 'app-mua-sam-shopnow', 'category' => 'Mobile App · E-commerce',
                'image' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=80&auto=format&fit=crop',
                'short_desc' => 'Tối ưu luồng tìm kiếm và giỏ hàng — rút ngắn hành trình mua từ 7 bước xuống còn 4 bước.',
                'year' => '2024', 'has_case_study' => 0, 'featured' => 1, 'sort_order' => 3,
            ],
            [
                'title' => 'Helio UI Kit', 'slug' => 'helio-ui-kit', 'category' => 'Design System',
                'image' => 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=700&q=80&auto=format&fit=crop',
                'short_desc' => 'Bộ component + design token dùng chung cho 4 sản phẩm nội bộ — giảm 45% thời gian design mới.',
                'year' => '2024', 'has_case_study' => 0, 'featured' => 1, 'sort_order' => 4,
            ],
            [
                'title' => 'App đầu tư chứng khoán VinaInvest', 'slug' => 'app-dau-tu-vinainvest', 'category' => 'Mobile App · Fintech',
                'image' => 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=700&q=80&auto=format&fit=crop',
                'short_desc' => 'Thiết kế trải nghiệm đặt lệnh và biểu đồ giá cho nhà đầu tư mới — giảm thao tác nhầm lệnh 28%.',
                'year' => '2024', 'has_case_study' => 0, 'sort_order' => 5,
            ],
            [
                'title' => 'CRM Dashboard SalesPro', 'slug' => 'crm-dashboard-salespro', 'category' => 'SaaS Dashboard · CRM',
                'image' => 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=700&q=80&auto=format&fit=crop',
                'short_desc' => 'Redesign pipeline bán hàng và báo cáo doanh số — team sales tiết kiệm 5 giờ/tuần thao tác thủ công.',
                'year' => '2023', 'has_case_study' => 0, 'sort_order' => 6,
            ],
            [
                'title' => 'App đặt đồ ăn QuickBite', 'slug' => 'app-dat-do-an-quickbite', 'category' => 'Mobile App · F&B',
                'image' => 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=700&q=80&auto=format&fit=crop',
                'short_desc' => 'Thiết kế lại luồng đặt món nhóm và theo dõi tài xế thời gian thực — tăng đơn lặp lại 22%.',
                'year' => '2023', 'has_case_study' => 0, 'sort_order' => 7,
            ],
            [
                'title' => 'Admin Panel CloudStaff HR', 'slug' => 'admin-panel-cloudstaff-hr', 'category' => 'SaaS Dashboard · HR Tech',
                'image' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&q=80&auto=format&fit=crop',
                'short_desc' => 'Thiết kế module chấm công và duyệt nghỉ phép cho 500+ nhân sự — giảm 60% ticket hỏi hỗ trợ.',
                'year' => '2023', 'has_case_study' => 0, 'sort_order' => 8,
            ],
            [
                'title' => 'Onboarding app ngân hàng số NovaBank', 'slug' => 'onboarding-novabank', 'category' => 'Mobile App · Digital Banking',
                'image' => 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=700&q=80&auto=format&fit=crop',
                'short_desc' => 'Thiết kế lại luồng mở tài khoản eKYC — rút ngắn thời gian đăng ký từ 9 phút xuống 3 phút.',
                'year' => '2023', 'has_case_study' => 0, 'sort_order' => 9,
            ],
            [
                'title' => 'Design System NovaPay Group', 'slug' => 'design-system-novapay-group', 'category' => 'Design System · Fintech',
                'image' => 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=700&q=80&auto=format&fit=crop',
                'short_desc' => 'Chuẩn hóa token màu, spacing và component cho 3 sản phẩm con trong hệ sinh thái NovaPay.',
                'year' => '2022', 'has_case_study' => 0, 'sort_order' => 10,
            ],
            [
                'title' => 'App theo dõi sức khỏe FitTrack', 'slug' => 'app-suc-khoe-fittrack', 'category' => 'Mobile App · Health',
                'image' => 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=80&auto=format&fit=crop',
                'short_desc' => 'Thiết kế trải nghiệm ghi nhận chỉ số sức khỏe hàng ngày — tăng tỉ lệ dùng lại sau 30 ngày 18%.',
                'year' => '2022', 'has_case_study' => 0, 'sort_order' => 11,
            ],
            [
                'title' => 'Analytics Dashboard AdInsight', 'slug' => 'analytics-dashboard-adinsight', 'category' => 'SaaS Dashboard · Marketing',
                'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80&auto=format&fit=crop',
                'short_desc' => 'Trực quan hóa dữ liệu quảng cáo đa kênh cho marketer — rút ngắn thời gian ra báo cáo còn 1/3.',
                'year' => '2022', 'has_case_study' => 0, 'sort_order' => 12,
            ],
        ];

        foreach ($projects as $p) {
            $this->execute(
                "INSERT INTO projects (title, slug, category, image, short_desc, year, has_case_study, client_name, hero_desc, industry, duration, services_provided, key_result, challenge_title, challenge_intro, challenge_details, solution_items, gallery_images, results_note, results_items, testimonial_content, testimonial_author, testimonial_role, featured, sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [
                    $p['title'], $p['slug'], $p['category'], $p['image'], $p['short_desc'] ?? '', $p['year'] ?? '', $p['has_case_study'] ?? 0,
                    $p['client_name'] ?? '', $p['hero_desc'] ?? '', $p['industry'] ?? '', $p['duration'] ?? '', $p['services_provided'] ?? '', $p['key_result'] ?? '',
                    $p['challenge_title'] ?? '', $p['challenge_intro'] ?? '', $p['challenge_details'] ?? '',
                    $p['solution_items'] ?? '', $p['gallery_images'] ?? '', $p['results_note'] ?? '', $p['results_items'] ?? '',
                    $p['testimonial_content'] ?? '', $p['testimonial_author'] ?? '', $p['testimonial_role'] ?? '',
                    $p['featured'] ?? 0, $p['sort_order'] ?? 0,
                ]
            );
        }
    }

    // ─── Testimonials (trang chủ teaser + ve-toi.html hscroll) ─────────────────

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $items = [
            ['author_name' => 'Nguyễn Hoàng Phúc', 'author_title' => 'CPO, FinPay Technologies',
             'author_avatar' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80&auto=format&fit=crop',
             'content' => 'Linh hiểu rất nhanh bài toán fintech phức tạp của tụi mình. Conversion màn hình nạp tiền tăng rõ rệt chỉ sau 1 sprint.', 'sort_order' => 1],
            ['author_name' => 'Trần Thu Hà', 'author_title' => 'Product Lead, LoTrack',
             'author_avatar' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80&auto=format&fit=crop',
             'content' => 'Dashboard mới giúp team vận hành của mình đọc số liệu nhanh hơn hẳn. Số ticket hỏi "cái này ở đâu" giảm đáng kể.', 'sort_order' => 2],
            ['author_name' => 'Lê Minh Quân', 'author_title' => 'CTO, ShopNow',
             'author_avatar' => 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80&auto=format&fit=crop',
             'content' => 'Design system Linh xây giúp team dev + design của tụi mình ship tính năng mới nhanh hơn gần một nửa thời gian.', 'sort_order' => 3],
            ['author_name' => 'Phạm Đức Anh', 'author_title' => 'Founder, CloudStaff HR',
             'author_avatar' => 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&q=80&auto=format&fit=crop',
             'content' => 'Điều mình thích nhất là Linh luôn giải thích được "vì sao" đằng sau mỗi quyết định thiết kế bằng số liệu, không chỉ gu thẩm mỹ cá nhân.', 'sort_order' => 4],
            ['author_name' => 'Vũ Thị Ngọc Mai', 'author_title' => 'Marketing Director, AdInsight',
             'author_avatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80&auto=format&fit=crop',
             'content' => 'Làm việc từ xa với Linh vẫn rất suôn sẻ — mỗi tuần đều có bản cập nhật rõ ràng, không cần nhắc lịch.', 'sort_order' => 5],
        ];
        foreach ($items as $t) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order) VALUES (?,?,?,?,?,?)",
                [$t['author_name'], $t['author_title'], $t['author_avatar'], $t['content'], 5, $t['sort_order']]
            );
        }
    }

    // ─── FAQs (dich-vu.html) ──────────────────────────────────────────────────

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $items = [
            ['q' => 'Chi phí một dự án thiết kế UX/UI là bao nhiêu?',
             'a' => 'Tùy phạm vi: Gói UX Audit từ 8-15 triệu, Full Product Design từ 35-90 triệu tùy số lượng màn hình và độ phức tạp nghiệp vụ, Design System từ 25-60 triệu. Sau buổi trao đổi đầu tiên (miễn phí), tôi gửi báo giá cụ thể bằng văn bản trong 48 giờ.'],
            ['q' => 'Quy trình làm việc diễn ra như thế nào?',
             'a' => '4 bước cố định cho mọi dự án Full Product Design: UX Research (phỏng vấn + phân tích dữ liệu) → Wireframe (cấu trúc luồng, duyệt logic) → UI Design (thiết kế visual, 2 vòng revision) → Usability Testing (kiểm thử với người dùng thật trước khi bàn giao). Cập nhật tiến độ hàng tuần qua Slack hoặc Zalo.'],
            ['q' => 'Thời gian hoàn thành một dự án mất bao lâu?',
             'a' => 'UX Audit: 1-2 tuần. Full Product Design cho app mobile hoặc dashboard vừa: 6-10 tuần. Dự án lớn nhiều module (trên 40 màn hình): 10-16 tuần. Design System: 4-8 tuần tùy số lượng component. Timeline chi tiết được thống nhất trước khi ký hợp đồng.'],
            ['q' => 'Công cụ thiết kế sử dụng là gì?',
             'a' => 'Figma là công cụ chính cho toàn bộ quy trình — từ wireframe, UI design đến prototype tương tác và design system. Ngoài ra tôi dùng Maze/UserTesting cho usability testing từ xa, FigJam cho workshop cùng team, và Notion để quản lý tài liệu bàn giao.'],
            ['q' => 'Tôi có nhận được file Figma gốc khi bàn giao không?',
             'a' => 'Có. Mọi dự án đều bàn giao file Figma đầy đủ (đã tổ chức layer, component và design token rõ ràng) kèm quyền chỉnh sửa vĩnh viễn cho khách hàng — không giữ lại bản quyền file thiết kế sau khi thanh toán đầy đủ.'],
            ['q' => 'Hình thức thanh toán như thế nào?',
             'a' => 'Thông thường chia 3 đợt: 30% đặt cọc khi ký hợp đồng, 40% khi hoàn tất wireframe/UI draft đầu tiên, 30% còn lại khi bàn giao file cuối. Với gói UX Audit, thanh toán 100% trước khi bắt đầu do thời gian thực hiện ngắn.'],
            ['q' => 'Sau khi bàn giao, có hỗ trợ chỉnh sửa hay tư vấn thêm không?',
             'a' => 'Gói Full Product Design bao gồm 2 vòng chỉnh sửa miễn phí trong 30 ngày sau bàn giao. Ngoài ra tôi có gói tư vấn Product Design theo giờ/tháng cho team muốn có designer đồng hành lâu dài mà chưa cần tuyển full-time.'],
        ];
        foreach ($items as $i => $f) {
            $this->execute(
                "INSERT INTO faqs (question, answer, page, sort_order) VALUES (?, ?, 'dich-vu', ?)",
                [$f['q'], $f['a'], $i + 1]
            );
        }
    }

    // ─── Pricing Plans (dich-vu.html — 3 gói) ───────────────────────────────────

    private function seedPricingPlans(): void {
        if ($this->scalar("SELECT COUNT(*) FROM pricing_plans") > 0) return;
        $plans = [
            ['name' => 'UX Audit', 'tag' => '', 'price' => '8 – 15 triệu', 'unit' => '/ dự án',
             'features' => "Heuristic evaluation toàn bộ luồng chính\nPhỏng vấn nhanh 5-6 người dùng\nPhân tích funnel/drop-off (nếu có dữ liệu)\nBáo cáo khuyến nghị ưu tiên sửa\n1 buổi trình bày trực tiếp với team",
             'is_featured' => 0, 'cta_text' => 'Bắt đầu Audit', 'sort_order' => 1],
            ['name' => 'Full Product Design', 'tag' => 'Phổ biến nhất', 'price' => '35 – 90 triệu', 'unit' => '/ dự án',
             'features' => "UX Research + phân tích funnel đầy đủ\nInformation architecture + wireframe\nUI Design toàn bộ luồng (đến 40 màn hình)\n2 vòng usability testing với người dùng thật\nFile Figma handoff + design spec cho dev\n2 vòng chỉnh sửa sau bàn giao",
             'is_featured' => 1, 'cta_text' => 'Nhận báo giá chi tiết', 'sort_order' => 2],
            ['name' => 'Design System / Design Ops', 'tag' => '', 'price' => '25 – 60 triệu', 'unit' => '/ dự án',
             'features' => "Design token (màu, typography, spacing)\nComponent library trong Figma (30-60 component)\nTài liệu hướng dẫn sử dụng cho dev & designer\nAudit tính nhất quán sản phẩm hiện có\nTùy chọn: gói đồng hành hàng tháng (Design Ops)",
             'is_featured' => 0, 'cta_text' => 'Trao đổi thêm', 'sort_order' => 3],
        ];
        foreach ($plans as $pl) {
            $this->execute(
                "INSERT INTO pricing_plans (name, tag, price, unit, features, is_featured, cta_text, cta_link, sort_order) VALUES (?,?,?,?,?,?,?,'/lien-he',?)",
                [$pl['name'], $pl['tag'], $pl['price'], $pl['unit'], $pl['features'], $pl['is_featured'], $pl['cta_text'], $pl['sort_order']]
            );
        }
    }

    // ─── Timeline Items (ve-toi.html — hành trình sự nghiệp) ────────────────────

    private function seedTimelineItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM timeline_items") > 0) return;
        $items = [
            ['year' => '2019', 'title' => 'UI Designer tại Agency Digital Craft',
             'description' => 'Bắt đầu sự nghiệp thiết kế giao diện cho các dự án website và landing page thương mại điện tử. Học cách làm việc với brief khách hàng thực tế.'],
            ['year' => '2020 — 2021', 'title' => 'UI/UX Designer tại startup ví điện tử PayVN',
             'description' => 'Chuyển hướng chuyên sâu vào UX — bắt đầu học và áp dụng user research, usability testing cho luồng thanh toán trong ứng dụng fintech đầu tiên.'],
            ['year' => '2022 — 2023', 'title' => 'Senior Product Designer tại FinPay Technologies',
             'description' => 'Dẫn dắt dự án redesign toàn bộ app ví điện tử FinPay — từ nghiên cứu đến ra mắt, quản lý 1 designer junior.'],
            ['year' => '2023 — 2024', 'title' => 'Product Design Lead tại agency công nghệ Orbit Digital',
             'description' => 'Phụ trách mảng thiết kế SaaS dashboard cho nhiều khách hàng B2B — logistics, HR tech, marketing analytics.'],
            ['year' => '2024 — nay', 'title' => 'Product Designer tư vấn độc lập',
             'description' => 'Nhận dự án freelance và tư vấn dài hạn cho startup, doanh nghiệp SaaS đang mở rộng sản phẩm — 21+ khách hàng đã hợp tác.'],
        ];
        foreach ($items as $i => $t) {
            $this->execute(
                "INSERT INTO timeline_items (year, title, description, sort_order) VALUES (?, ?, ?, ?)",
                [$t['year'], $t['title'], $t['description'], $i + 1]
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
