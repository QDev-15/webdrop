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
        $this->seedToolsSkills();
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
            ['site_name', 'KHOA Design Studio', 'general'],
            ['nav_logo_name', 'KHOA', 'general'],
            ['site_tagline', 'Thiết kế Nhận diện Thương hiệu & Bao bì', 'general'],
            ['site_description', 'Trần Minh Khoa — Nhà thiết kế đồ họa tự do chuyên Brand Identity & Packaging Design. Xem dự án, dịch vụ và liên hệ nhận báo giá.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hello@khoadesign.vn', 'general'],
            ['site_phone', '0909123456', 'general'],
            ['zalo_phone', '0909123456', 'general'],
            ['site_address', '123 Nguyễn Đình Chiểu, Quận 3, TP. Hồ Chí Minh', 'general'],
            ['footer_address', 'Q.3, TP. Hồ Chí Minh', 'general'],
            ['working_hours', 'Thứ 2 – Thứ 7, 9:00 – 18:00', 'general'],

            // ── SEO ──
            ['meta_title', 'KHOA Design Studio — Thiết kế Nhận diện Thương hiệu & Bao bì', 'seo'],
            ['meta_description', 'Trần Minh Khoa — Nhà thiết kế đồ họa tự do chuyên Brand Identity & Packaging Design. Xem dự án, dịch vụ và liên hệ nhận báo giá.', 'seo'],
            ['meta_keywords', 'thiết kế logo, brand identity, thiết kế bao bì, packaging design, thiết kế đồ họa tự do', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=80&auto=format&fit=crop', 'seo'],

            // ── Mạng xã hội ──
            ['social_instagram', 'https://instagram.com', 'social'],
            ['social_behance', 'https://behance.net', 'social'],
            ['social_facebook', 'https://facebook.com', 'social'],

            // ── Footer ──
            ['footer_description', 'Thiết kế nhận diện thương hiệu & bao bì sản phẩm cho local brand F&B, mỹ phẩm, bán lẻ tại Việt Nam.', 'footer'],
            ['footer_copyright', '© 2026 KHOA Design Studio. All rights reserved.', 'footer'],

            // ── Liên hệ / Bản đồ ──
            ['map_embed', 'https://maps.google.com/maps?q=10.7829,106.6934&hl=vi&z=15&output=embed', 'contact'],

            // ── Nội dung — Trang chủ ──
            ['home_feat1_title', 'Brand Identity', 'content'],
            ['home_feat1_desc', 'Logo, hệ thống màu sắc, typography, brand guideline hoàn chỉnh cho thương hiệu mới hoặc rebrand.', 'content'],
            ['home_feat2_title', 'Packaging Design', 'content'],
            ['home_feat2_desc', 'Thiết kế bao bì túi, hộp, nhãn chai — làm việc trực tiếp với xưởng in từ file đến thành phẩm.', 'content'],
            ['home_feat3_title', 'Print & Editorial', 'content'],
            ['home_feat3_desc', 'Catalogue, brand book, ấn phẩm marketing — layout in ấn chuẩn màu, chuẩn kích thước.', 'content'],
            ['home_bento_eyebrow', 'Dự án nổi bật', 'content'],
            ['home_bento_title', "Vài lát cắt\ntrong *portfolio.*", 'content'],
            ['home_bento_sub', 'Một số dự án thương hiệu & bao bì tiêu biểu — bấm vào từng dự án để xem chi tiết quá trình thực hiện.', 'content'],
            ['stat1_number', '128', 'content'], ['stat1_suffix', '+', 'content'], ['stat1_label', 'Dự án hoàn thành', 'content'],
            ['stat2_number', '11', 'content'], ['stat2_suffix', ' năm', 'content'], ['stat2_label', 'Kinh nghiệm thiết kế', 'content'],
            ['stat3_number', '94', 'content'], ['stat3_suffix', '+', 'content'], ['stat3_label', 'Khách hàng đã hợp tác', 'content'],
            ['stat4_number', '4', 'content'], ['stat4_suffix', '.9/5', 'content'], ['stat4_label', 'Đánh giá trung bình', 'content'],
            ['home_testi_eyebrow', 'Khách hàng nói gì', 'content'],
            ['home_testi_title', "Họ tin tưởng\ngiao *thương hiệu*\ncho tôi.", 'content'],
            ['home_testi_link_text', 'Xem tất cả đánh giá', 'content'],
            ['cta_home_title', "Sẵn sàng làm\nmới thương hiệu?", 'content'],
            ['cta_home_button', 'Nhận báo giá miễn phí', 'content'],

            // ── Nội dung — Dự án ──
            ['projects_hero_title', "Portfolio *dự án.*", 'content'],
            ['projects_hero_sub', '12 dự án thiết kế thương hiệu, bao bì và ấn phẩm in — bấm vào từng dự án để xem chi tiết bối cảnh, giải pháp và kết quả.', 'content'],
            ['cta_projects_title', "Có ý tưởng\ncho dự án mới?", 'content'],
            ['cta_projects_button', 'Nhận báo giá miễn phí', 'content'],

            // ── Nội dung — Dịch vụ ──
            ['services_hero_title', "Dịch vụ &\n*bảng giá.*", 'content'],
            ['services_hero_sub', '4 mảng dịch vụ chính, 3 gói giá rõ ràng — không báo giá mập mờ, không phát sinh ẩn.', 'content'],
            ['services_eyebrow', 'Mảng dịch vụ', 'content'],
            ['services_title', "Tôi có thể\ngiúp gì cho *thương hiệu bạn.*", 'content'],
            ['svc1_title', 'Brand Identity Design', 'content'],
            ['svc1_desc', 'Logo, bảng màu, hệ thống typography, brand guideline hoàn chỉnh cho thương hiệu mới hoặc rebrand.', 'content'],
            ['svc2_title', 'Packaging Design', 'content'],
            ['svc2_desc', 'Túi, hộp, nhãn chai — thiết kế bao bì làm việc trực tiếp với xưởng in đến khi ra thành phẩm đúng màu.', 'content'],
            ['svc3_title', 'Print & Editorial Design', 'content'],
            ['svc3_desc', 'Catalogue, brand book, ấn phẩm sự kiện, name card — layout chuẩn kích thước và chuẩn màu in offset.', 'content'],
            ['svc4_title', 'Brand Refresh / Tư vấn', 'content'],
            ['svc4_desc', 'Đánh giá lại bộ nhận diện hiện có, đề xuất điều chỉnh mà không phá vỡ nhận diện khách hàng đã quen thuộc.', 'content'],
            ['pricing_eyebrow', 'Bảng giá', 'content'],
            ['pricing_title', "Chọn gói\nphù hợp *quy mô.*", 'content'],
            ['pricing_note', 'Dự án lớn hơn (nhiều SKU, đa ngôn ngữ, hệ thống ấn phẩm mở rộng)?', 'content'],
            ['pricing_note_link', 'Liên hệ để nhận báo giá riêng.', 'content'],
            ['faq_eyebrow', 'Câu hỏi thường gặp', 'content'],
            ['faq_title', "Trước khi\nbắt đầu *dự án.*", 'content'],
            ['cta_services_title', "Còn thắc mắc về\ngói dịch vụ?", 'content'],
            ['cta_services_button', 'Nhắn tin cho tôi', 'content'],

            // ── Nội dung — Về tôi ──
            ['about_hero_title', "Xin chào,\ntôi là *Khoa.*", 'content'],
            ['about_hero_sub', 'Nhà thiết kế đồ họa tự do — 11 năm làm nghề, hơn 120 dự án nhận diện thương hiệu và bao bì đã hoàn thành.', 'content'],
            ['about_bio_eyebrow', 'Giới thiệu', 'content'],
            ['about_bio_title', "Thiết kế phải\n*bán được hàng.*", 'content'],
            ['about_bio_text1', 'Mình là Khoa, tốt nghiệp Thiết kế Đồ họa tại Đại học Kiến trúc TP.HCM năm 2014. Sau 6 năm làm việc tại các agency quảng cáo — phụ trách nhận diện thương hiệu và bao bì cho các nhãn hàng FMCG — mình quyết định ra làm freelance độc lập từ năm 2020, tập trung sâu vào 2 mảng: Brand Identity và Packaging Design cho các doanh nghiệp vừa và nhỏ.', 'content'],
            ['about_bio_text2', 'Với mình, một bộ nhận diện đẹp thôi chưa đủ — nó phải giúp khách hàng của bạn nhận ra sản phẩm trong 3 giây trên kệ hàng, và giúp đội ngũ vận hành áp dụng nhất quán mà không cần hỏi lại designer mỗi lần làm ấn phẩm mới.', 'content'],
            ['about_bio_image', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80&auto=format&fit=crop', 'content'],
            ['timeline_eyebrow', 'Hành trình làm nghề', 'content'],
            ['timeline_title', "11 năm với\n*từng nét vẽ.*", 'content'],
            ['skills_eyebrow', 'Công cụ & kỹ năng', 'content'],
            ['skills_title', "Bộ công cụ\nmình *dùng hằng ngày.*", 'content'],
            ['testi_full_eyebrow', 'Khách hàng nói gì', 'content'],
            ['testi_full_title', "Đánh giá từ\n*người đã hợp tác.*", 'content'],
            ['cta_about_title', "Muốn làm việc\ncùng tôi?", 'content'],
            ['cta_about_button', 'Nhận báo giá miễn phí', 'content'],

            // ── Nội dung — Liên hệ ──
            ['contact_hero_title', "Kể tôi nghe\nvề *dự án của bạn.*", 'content'],
            ['contact_hero_sub', 'Điền form bên dưới hoặc nhắn trực tiếp — mình phản hồi trong vòng 24 giờ làm việc.', 'content'],
            ['contact_form_eyebrow', 'Gửi yêu cầu', 'content'],
            ['contact_form_title', "Bắt đầu\nbằng *vài dòng.*", 'content'],
            ['contact_info_eyebrow', 'Thông tin liên hệ', 'content'],
            ['contact_info_title', "Hoặc nhắn\n*trực tiếp.*", 'content'],

            // ── Pháp lý ──
            ['legal_updated', '22/08/2026', 'legal'],
            ['privacy_content', "<h2 class=\"ptk-title\" style=\"font-size:clamp(22px,3vw,30px);margin-top:0;\">1. Thông tin thu thập</h2><p class=\"ptk-sub\" style=\"max-width:none;margin-bottom:32px;\">Khi bạn gửi yêu cầu qua form liên hệ, KHOA Design Studio thu thập họ tên, số điện thoại, email và nội dung mô tả dự án bạn cung cấp. Chúng tôi không thu thập dữ liệu ngoài phạm vi cần thiết để tư vấn và báo giá dịch vụ.</p><h2 class=\"ptk-title\" style=\"font-size:clamp(22px,3vw,30px);\">2. Mục đích sử dụng</h2><p class=\"ptk-sub\" style=\"max-width:none;margin-bottom:32px;\">Thông tin được sử dụng để liên hệ tư vấn, gửi báo giá, trao đổi tiến độ dự án và chăm sóc khách hàng sau bàn giao. Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba ngoài mục đích trên.</p><h2 class=\"ptk-title\" style=\"font-size:clamp(22px,3vw,30px);\">3. Bảo mật thông tin</h2><p class=\"ptk-sub\" style=\"max-width:none;margin-bottom:32px;\">Mọi thông tin trao đổi trong quá trình hợp tác (brief thương hiệu, tài liệu nội bộ, file thiết kế) được bảo mật tuyệt đối và chỉ phục vụ cho dự án của bạn. Yêu cầu ký NDA (thỏa thuận bảo mật) trước khi bắt đầu dự án sẽ được đáp ứng nếu khách hàng cần.</p><h2 class=\"ptk-title\" style=\"font-size:clamp(22px,3vw,30px);\">4. Quyền của khách hàng</h2><p class=\"ptk-sub\" style=\"max-width:none;margin-bottom:32px;\">Bạn có quyền yêu cầu chỉnh sửa, cập nhật hoặc xoá thông tin cá nhân đã cung cấp bất kỳ lúc nào bằng cách liên hệ qua email hello@khoadesign.vn.</p><h2 class=\"ptk-title\" style=\"font-size:clamp(22px,3vw,30px);\">5. Liên hệ</h2><p class=\"ptk-sub\" style=\"max-width:none;\">Nếu có bất kỳ thắc mắc nào về chính sách bảo mật này, vui lòng liên hệ qua trang Liên hệ.</p>", 'legal'],
            ['terms_content', "<h2 class=\"ptk-title\" style=\"font-size:clamp(22px,3vw,30px);margin-top:0;\">1. Phạm vi hợp tác</h2><p class=\"ptk-sub\" style=\"max-width:none;margin-bottom:32px;\">Phạm vi công việc, số lượng hạng mục thiết kế và số vòng chỉnh sửa được thống nhất theo gói dịch vụ đã chọn (xem trang Dịch vụ) hoặc theo báo giá riêng đã gửi bằng văn bản trước khi bắt đầu dự án.</p><h2 class=\"ptk-title\" style=\"font-size:clamp(22px,3vw,30px);\">2. Đặt cọc &amp; thanh toán</h2><p class=\"ptk-sub\" style=\"max-width:none;margin-bottom:32px;\">Khách hàng đặt cọc 50% giá trị dự án trước khi bắt đầu thiết kế. 50% còn lại thanh toán khi bàn giao file gốc cuối cùng. Dự án sẽ tạm dừng nếu quá 7 ngày chưa nhận được khoản thanh toán đến hạn.</p><h2 class=\"ptk-title\" style=\"font-size:clamp(22px,3vw,30px);\">3. Chỉnh sửa &amp; phát sinh</h2><p class=\"ptk-sub\" style=\"max-width:none;margin-bottom:32px;\">Số vòng chỉnh sửa nằm trong phạm vi gói đã chọn. Yêu cầu chỉnh sửa vượt quá số vòng quy định hoặc thay đổi định hướng thiết kế ban đầu (khác brief đã duyệt) sẽ được báo giá bổ sung theo giờ thiết kế trước khi thực hiện.</p><h2 class=\"ptk-title\" style=\"font-size:clamp(22px,3vw,30px);\">4. Bản quyền thiết kế</h2><p class=\"ptk-sub\" style=\"max-width:none;margin-bottom:32px;\">Toàn quyền sử dụng thương mại đối với thiết kế cuối cùng được chuyển giao cho khách hàng sau khi thanh toán đầy đủ. KHOA Design Studio giữ quyền trưng bày dự án trong portfolio cá nhân (trang Dự án, mạng xã hội) trừ khi khách hàng yêu cầu bảo mật bằng văn bản.</p><h2 class=\"ptk-title\" style=\"font-size:clamp(22px,3vw,30px);\">5. Huỷ dự án</h2><p class=\"ptk-sub\" style=\"max-width:none;margin-bottom:32px;\">Nếu khách hàng huỷ dự án sau khi đã đặt cọc, khoản cọc không được hoàn lại nhằm bù đắp thời gian nghiên cứu và concept đã thực hiện. Các hạng mục đã hoàn thành đến thời điểm huỷ sẽ được bàn giao tương ứng với giá trị đã thanh toán.</p><h2 class=\"ptk-title\" style=\"font-size:clamp(22px,3vw,30px);\">6. Liên hệ</h2><p class=\"ptk-sub\" style=\"max-width:none;\">Mọi thắc mắc về điều khoản dịch vụ, vui lòng liên hệ qua trang Liên hệ.</p>", 'legal'],

            // ── SMTP ──
            ['smtp_host', '', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from_name', 'KHOA Design Studio', 'smtp'],
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

    // ─── Hero Slides (index.html — carousel H5 Bold Typography, 4 slide) ────────

    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        // subtitle format: "<tone>||<nhãn label>||<đoạn mô tả>" — tone quyết định gradient/màu swatch
        // trong HeroSlider.tsx (red/mustard/ink/forest, khớp data-tone trong template gốc).
        // button_text/button_link lưu nút ACCENT chính (ptk-btn-red) — nút phụ (ghost trắng)
        // hardcode theo index slide trong HeroSlider.tsx, đúng thiết kế gốc.
        $slides = [
            [
                'title' => "Thiết kế\nthương hiệu *có hồn.*",
                'subtitle' => 'red||Brand Identity Designer||Mình là Khoa — thiết kế hệ thống nhận diện thương hiệu và bao bì cho các local brand F&B, mỹ phẩm tại Việt Nam. Không chỉ đẹp — phải bán được hàng.',
                'image' => '',
                'button_text' => 'Xem dự án',
                'button_link' => '/du-an',
                'sort_order' => 1,
            ],
            [
                'title' => "Bao bì *kể chuyện*\nsản phẩm.",
                'subtitle' => 'mustard||Packaging Specialist||Từ túi cà phê, hộp mỹ phẩm đến nhãn chai — mỗi chi tiết in ấn đều được tính toán để sản phẩm nổi bật ngay trên kệ hàng.',
                'image' => '',
                'button_text' => 'Xem dự án bao bì',
                'button_link' => '/du-an',
                'sort_order' => 2,
            ],
            [
                'title' => "In ấn chỉn chu\n*từng chi tiết.*",
                'subtitle' => 'ink||Print & Editorial Design||Catalogue, brand book, ấn phẩm sự kiện — mình làm việc trực tiếp với xưởng in để đảm bảo màu sắc ra đúng như file thiết kế.',
                'image' => '',
                'button_text' => 'Xem ấn phẩm',
                'button_link' => '/du-an',
                'sort_order' => 3,
            ],
            [
                'title' => "Thiết kế là\n*ngôn ngữ* của tôi.",
                'subtitle' => 'forest||10+ Năm kinh nghiệm||Hơn 120 dự án nhận diện thương hiệu đã hoàn thành cho các doanh nghiệp vừa và nhỏ trên khắp cả nước. Sẵn sàng cho dự án tiếp theo của bạn.',
                'image' => '',
                'button_text' => 'Xem toàn bộ dự án',
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

    // ─── Projects (du-an.html 12 thẻ + du-an-chi-tiet-1/2.html case study) ──────

    private function seedProjects(): void {
        if ($this->scalar("SELECT COUNT(*) FROM projects") > 0) return;

        // ── Case study 1 — Mộc Coffee ──
        $challengeDetails1 = "Mộc Coffee là xưởng rang xay nhỏ ở Bảo Lộc, trước đó dùng logo tự làm trên Canva và bao bì túi kraft dán nhãn in đen trắng tại nhà. Khi chủ xưởng quyết định đưa 5 dòng sản phẩm (Robusta, Arabica, Blend, Cold Brew, Trà) vào chuỗi cà phê specialty và một số cửa hàng tiện lợi, vấn đề lộ rõ: khách hàng không phân biệt được dòng nào với dòng nào chỉ bằng cách nhìn túi, và bao bì thiếu điểm nhấn thị giác so với các thương hiệu cà phê đã có hệ thống bài bản đứng cạnh trên cùng một kệ.\n\nYêu cầu đặt ra: giữ tinh thần thủ công, mộc mạc của xưởng rang nhỏ — nhưng bao bì phải đủ chuyên nghiệp để cạnh tranh sòng phẳng ở kênh bán lẻ hiện đại.";
        $solutionItems1 = implode("\n", [
            'Audit & Research|Khảo sát 15 thương hiệu cà phê cùng phân khúc, phỏng vấn chủ xưởng để tìm ra câu chuyện thương hiệu thật — vùng nguyên liệu Bảo Lộc, cách rang thủ công từng mẻ nhỏ.',
            'Hệ thống nhận diện|Logo wordmark tối giản lấy cảm hứng từ hình dáng hạt cà phê rang; bảng màu đất nung + kem chia theo 5 dòng sản phẩm để nhận biết nhanh.',
            'Thiết kế bao bì|Túi zipper có cửa sổ hở hiển thị hạt cà phê thật, nhãn dán mã màu theo dòng, thông tin ngày rang in rõ ràng ngay mặt trước.',
            'Làm việc với xưởng in|Test in offset 3 lần để đảm bảo màu đất nung lên đúng file thiết kế, bàn giao brand guideline để xưởng tự triển khai ấn phẩm sau này.',
        ]);
        $gallery1 = implode("\n", [
            'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=700&q=80&auto=format&fit=crop|Bao bì túi cà phê Robusta Mộc Coffee',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=700&q=80&auto=format&fit=crop|Bàn làm việc thiết kế bao bì cà phê Mộc Coffee',
            'https://images.unsplash.com/photo-1587734195503-904fca47e0b9?w=700&q=80&auto=format&fit=crop|Ly cà phê và nhãn dán thương hiệu Mộc Coffee',
            'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=700&q=80&auto=format&fit=crop|Hạt cà phê rang xay Mộc Coffee',
            'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=700&q=80&auto=format&fit=crop|Trưng bày sản phẩm Mộc Coffee tại điểm bán',
        ]);
        $resultsItems1 = implode("\n", [
            '42|%|Tăng nhận diện tại điểm bán',
            '12||Điểm bán mới trong 3 tháng đầu',
            '5|/5|Dòng sản phẩm phân biệt rõ ràng',
            '3|s|Thời gian nhận diện thương hiệu trên kệ',
        ]);

        // ── Case study 2 — Nef App ──
        $challengeDetails2 = "Nef là ứng dụng quản lý tài chính cá nhân do 2 kỹ sư founder xây dựng. Ban đầu app chỉ có 1 icon tự vẽ trên Figma, không có style guide nào — mỗi màn hình trong 8 tính năng chính lại dùng một tông màu, cỡ chữ và bo góc khác nhau do đội dev tự chọn theo cảm tính khi code.\n\nTrước vòng gọi vốn seed, nhà đầu tư góp ý thẳng: sản phẩm giải quyết đúng vấn đề nhưng \"trông không giống một công ty nghiêm túc để rót tiền vào\". Founder cần một bộ nhận diện đủ chuyên nghiệp để đưa vào pitch deck và chuẩn hoá lại toàn bộ giao diện app trong thời gian ngắn.";
        $solutionItems2 = implode("\n", [
            'Workshop định vị|Làm việc trực tiếp với 2 founder để chọn ra 3 tính từ thương hiệu: đáng tin, gọn gàng, chủ động — làm kim chỉ nam cho mọi quyết định thiết kế sau đó.',
            'Thiết kế logo|Monogram chữ N cách điệu từ đường biểu đồ tăng trưởng tài chính — vừa là logo app, vừa dùng được làm favicon và app icon.',
            'Icon system|Xây dựng hơn 40 icon đồng bộ về stroke-width, bo góc, kích thước cho toàn bộ 8 tính năng chính trong app.',
            'UI Style Guide|Soạn tài liệu màu sắc, type scale, spacing, trạng thái component (default/hover/disabled) để đội dev tự áp dụng không cần hỏi lại designer từng màn hình.',
        ]);
        $gallery2 = implode("\n", [
            'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=80&auto=format&fit=crop|Bộ nhận diện thương hiệu ứng dụng Nef',
            'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=700&q=80&auto=format&fit=crop|Icon system 40 biểu tượng ứng dụng Nef',
            'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=700&q=80&auto=format&fit=crop|UI style guide bảng màu và type scale Nef',
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80&auto=format&fit=crop|Màn hình ứng dụng Nef sau khi áp dụng nhận diện mới',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80&auto=format&fit=crop|Founder Nef trình bày pitch deck với nhận diện mới',
        ]);
        $resultsItems2 = implode("\n", [
            '250|K$|Gọi vốn seed thành công',
            '40|+|Icon trong hệ thống',
            '60|%|Giảm thời gian bàn giao cho dev',
            '8|/8|Tính năng dùng chung 1 style guide',
        ]);

        $projects = [
            [
                'title' => 'Mộc Coffee', 'slug' => 'moc-coffee', 'category' => 'Brand + Packaging',
                'image' => 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=700&q=80&auto=format&fit=crop',
                'year' => '2025', 'client_name' => 'Mộc Coffee', 'has_case_study' => 1,
                'industry' => 'F&B — Cà phê rang xay', 'duration' => '6 tuần',
                'services_provided' => 'Logo, Brand Guideline, Packaging', 'key_result' => '+42% nhận diện tại điểm bán',
                'challenge_title' => "Sản phẩm ngon\nnhưng *chìm* trên kệ.",
                'challenge_details' => $challengeDetails1,
                'solution_heading' => "4 bước xây dựng\nhệ thống *nhận diện.*",
                'solution_items' => $solutionItems1,
                'solution_image' => 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80&auto=format&fit=crop',
                'gallery_images' => $gallery1,
                'results_items' => $resultsItems1,
                'testimonial_content' => 'Khoa hiểu rất nhanh tinh thần thương hiệu tụi mình muốn — bộ bao bì mới giúp Mộc Coffee tăng nhận diện rõ rệt trên kệ siêu thị chỉ sau 2 tháng ra mắt, khách quen còn nhắn hỏi mua online vì thấy bao bì đẹp trên story.',
                'testimonial_author' => 'Nguyễn Thảo Nguyên', 'testimonial_role' => 'Sáng lập, Mộc Coffee',
                'testimonial_avatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80&auto=format&fit=crop',
                'cta_title' => "Có sản phẩm cần\nbao bì ấn tượng hơn?",
                'featured' => 1, 'sort_order' => 1,
            ],
            [
                'title' => 'Nef App', 'slug' => 'nef-app', 'category' => 'Brand Identity',
                'image' => 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=80&auto=format&fit=crop',
                'year' => '2025', 'client_name' => 'Nef (Fintech Startup)', 'has_case_study' => 1,
                'industry' => 'Fintech — Quản lý tài chính cá nhân', 'duration' => '5 tuần',
                'services_provided' => 'Logo, Icon System, UI Style Guide', 'key_result' => 'Gọi vốn seed thành công 250K$',
                'challenge_title' => "Sản phẩm tốt nhưng\n*trông chưa đủ tin.*",
                'challenge_details' => $challengeDetails2,
                'solution_heading' => "4 bước chuẩn hoá\nnhận diện *trước gọi vốn.*",
                'solution_items' => $solutionItems2,
                'solution_image' => 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80&auto=format&fit=crop',
                'gallery_images' => $gallery2,
                'results_items' => $resultsItems2,
                'testimonial_content' => 'Trước đây tụi mình cứ mỗi màn hình mới lại tự chọn màu theo cảm tính. Style guide Khoa làm giúp cả team dev tự tin thiết kế UI mà không cần hỏi lại — quan trọng hơn, nhà đầu tư nhìn pitch deck là gật đầu ngay phần thương hiệu.',
                'testimonial_author' => 'Đỗ Anh Kiệt', 'testimonial_role' => 'Đồng sáng lập & CEO, Nef',
                'testimonial_avatar' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&q=80&auto=format&fit=crop',
                'cta_title' => "Startup của bạn cần\nnhận diện đủ tin cậy?",
                'featured' => 1, 'sort_order' => 2,
            ],
            [
                'title' => 'Lụa Atelier', 'slug' => 'lua-atelier', 'category' => 'Logo Design',
                'image' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=700&q=80&auto=format&fit=crop',
                'year' => '2024', 'has_case_study' => 0, 'featured' => 1, 'sort_order' => 3,
            ],
            [
                'title' => 'Xanh Tea', 'slug' => 'xanh-tea', 'category' => 'Packaging',
                'image' => 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=700&q=80&auto=format&fit=crop',
                'year' => '2024', 'has_case_study' => 0, 'featured' => 1, 'sort_order' => 4,
            ],
            [
                'title' => 'Rạng Đông Bakery', 'slug' => 'rang-dong-bakery', 'category' => 'Brand + Packaging',
                'image' => 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=700&q=80&auto=format&fit=crop',
                'year' => '2024', 'has_case_study' => 0, 'sort_order' => 5,
            ],
            [
                'title' => 'Fintrack', 'slug' => 'fintrack', 'category' => 'Brand Identity',
                'image' => 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=700&q=80&auto=format&fit=crop',
                'year' => '2023', 'has_case_study' => 0, 'sort_order' => 6,
            ],
            [
                'title' => 'Chỉn Chu Studio', 'slug' => 'chin-chu-studio', 'category' => 'Print / Editorial',
                'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80&auto=format&fit=crop',
                'year' => '2023', 'has_case_study' => 0, 'sort_order' => 7,
            ],
            [
                'title' => 'Hạt Dẻ Snacks', 'slug' => 'hat-de-snacks', 'category' => 'Packaging',
                'image' => 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=700&q=80&auto=format&fit=crop',
                'year' => '2023', 'has_case_study' => 0, 'sort_order' => 8,
            ],
            [
                'title' => 'Vườn Nhà Mình', 'slug' => 'vuon-nha-minh', 'category' => 'Brand Identity',
                'image' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80&auto=format&fit=crop',
                'year' => '2022', 'has_case_study' => 0, 'sort_order' => 9,
            ],
            [
                'title' => 'Local Fest 2025', 'slug' => 'local-fest-2025', 'category' => 'Print / Event',
                'image' => 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=700&q=80&auto=format&fit=crop',
                'year' => '2025', 'has_case_study' => 0, 'sort_order' => 10,
            ],
            [
                'title' => 'Sen Cosmetics', 'slug' => 'sen-cosmetics', 'category' => 'Packaging',
                'image' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&q=80&auto=format&fit=crop',
                'year' => '2022', 'has_case_study' => 0, 'sort_order' => 11,
            ],
            [
                'title' => 'BeeWork Coworking', 'slug' => 'beework-coworking', 'category' => 'Brand Identity',
                'image' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=700&q=80&auto=format&fit=crop',
                'year' => '2022', 'has_case_study' => 0, 'sort_order' => 12,
            ],
        ];

        foreach ($projects as $p) {
            $this->execute(
                "INSERT INTO projects (title, slug, category, image, year, client_name, has_case_study, industry, duration, services_provided, key_result, challenge_title, challenge_details, solution_heading, solution_items, solution_image, gallery_images, results_items, testimonial_content, testimonial_author, testimonial_role, testimonial_avatar, cta_title, featured, sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [
                    $p['title'], $p['slug'], $p['category'], $p['image'], $p['year'] ?? '', $p['client_name'] ?? '', $p['has_case_study'] ?? 0,
                    $p['industry'] ?? '', $p['duration'] ?? '', $p['services_provided'] ?? '', $p['key_result'] ?? '',
                    $p['challenge_title'] ?? '', $p['challenge_details'] ?? '',
                    $p['solution_heading'] ?? '', $p['solution_items'] ?? '', $p['solution_image'] ?? '',
                    $p['gallery_images'] ?? '', $p['results_items'] ?? '',
                    $p['testimonial_content'] ?? '', $p['testimonial_author'] ?? '', $p['testimonial_role'] ?? '', $p['testimonial_avatar'] ?? '',
                    $p['cta_title'] ?? '', $p['featured'] ?? 0, $p['sort_order'] ?? 0,
                ]
            );
        }
    }

    // ─── Testimonials (teaser trang chủ + grid đầy đủ ve-toi.html) ──────────────

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $items = [
            ['author_name' => 'Đặng Gia Bảo', 'author_title' => 'Sáng lập, Lụa Atelier',
             'author_avatar' => 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=120&q=80&auto=format&fit=crop',
             'content' => 'Khoa là kiểu người hỏi rất kỹ trước khi vẽ — nhờ vậy logo và bảng màu Lụa Atelier ra đúng chất liệu lụa tơ tằm mà tụi mình theo đuổi, không sến cũng không quá hiện đại.', 'sort_order' => 1],
            ['author_name' => 'Vũ Đăng Khôi', 'author_title' => 'Sáng lập, Rạng Đông Bakery',
             'author_avatar' => 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=120&q=80&auto=format&fit=crop',
             'content' => 'Khoa làm việc rất có nguyên tắc — brief rõ ràng, deadline đúng hẹn. Bao bì hộp bánh mới giúp Rạng Đông trông chuyên nghiệp hơn hẳn so với trước, khách đặt quà tặng tăng thấy rõ dịp Tết vừa rồi.', 'sort_order' => 2],
            ['author_name' => 'Trịnh Bảo Châu', 'author_title' => 'Marketing Manager, Hạt Dẻ Snacks',
             'author_avatar' => 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=120&q=80&auto=format&fit=crop',
             'content' => 'Bao bì snack mới không chỉ đẹp mà còn tính toán kỹ diện tích in bắt buộc theo quy định — Khoa chủ động nhắc tụi mình những điều mà bên thiết kế khác chưa từng để ý.', 'sort_order' => 3],
            ['author_name' => 'Lê Minh Thư', 'author_title' => 'Quản lý vận hành, BeeWork Coworking',
             'author_avatar' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=120&q=80&auto=format&fit=crop',
             'content' => 'Không gian coworking của tụi mình cần một nhận diện vừa chuyên nghiệp vừa gần gũi — Khoa cân bằng được cả hai trong cùng một bộ logo và bảng màu.', 'sort_order' => 4],
            ['author_name' => 'Phạm Nhật Anh', 'author_title' => 'Sáng lập, Sen Cosmetics',
             'author_avatar' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&q=80&auto=format&fit=crop',
             'content' => 'Mình từng đổi 2 designer trước khi gặp Khoa. Điểm khác biệt là Khoa hỏi rất kỹ về thành phần, đối tượng khách hàng trước khi vẽ — bao bì mỹ phẩm ra đúng cảm giác "thiên nhiên, an toàn" tụi mình muốn truyền tải.', 'sort_order' => 5],
        ];
        foreach ($items as $t) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order) VALUES (?,?,?,?,?,?)",
                [$t['author_name'], $t['author_title'], $t['author_avatar'], $t['content'], 5, $t['sort_order']]
            );
        }
    }

    // ─── FAQs (dich-vu.html — 7 câu) ─────────────────────────────────────────────

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $items = [
            ['q' => 'Chi phí thiết kế logo/brand identity dao động bao nhiêu?',
             'a' => 'Tuỳ quy mô: Gói Logo từ 3.5 triệu, Gói Brand Identity từ 12 triệu, Gói Trọn Gói (kèm bao bì) từ 25 triệu. Với dự án nhiều SKU hoặc yêu cầu đặc biệt, mình báo giá riêng sau khi trao đổi cụ thể.'],
            ['q' => 'Quy trình làm việc diễn ra như thế nào?',
             'a' => '4 bước: (1) Trao đổi brief & ký hợp đồng, (2) Research + đề xuất concept, (3) Thiết kế & các vòng chỉnh sửa theo gói, (4) Bàn giao file & hướng dẫn sử dụng. Mọi mốc thời gian được thống nhất rõ trước khi bắt đầu.'],
            ['q' => 'Một dự án thường mất bao lâu để hoàn thành?',
             'a' => 'Gói Logo: 5–7 ngày làm việc. Gói Brand Identity: 10–14 ngày. Gói Trọn Gói (kèm bao bì, làm việc với xưởng in): 3–4 tuần. Thời gian có thể thay đổi tuỳ tốc độ phản hồi và số vòng chỉnh sửa thực tế.'],
            ['q' => 'Tôi được chỉnh sửa bao nhiêu lần?',
             'a' => 'Số vòng chỉnh sửa nằm trong gói: 2 vòng (Gói Logo), 3 vòng (Gói Brand Identity), 5 vòng (Gói Trọn Gói). Chỉnh sửa phát sinh ngoài phạm vi brief ban đầu sẽ được báo giá thêm theo giờ thiết kế.'],
            ['q' => 'Sau khi hoàn thành tôi nhận được những file gì?',
             'a' => 'File nguồn AI/EPS, file xuất PNG/SVG nền trong suốt, file PDF brand guideline (nếu thuộc gói), và file in ấn chuẩn CMYK sẵn sàng gửi xưởng in đối với hạng mục bao bì/ấn phẩm.'],
            ['q' => 'Hình thức thanh toán như thế nào?',
             'a' => 'Đặt cọc 50% khi bắt đầu dự án, 50% còn lại thanh toán khi bàn giao file gốc. Chuyển khoản ngân hàng, xuất hoá đơn/biên nhận đầy đủ theo yêu cầu.'],
            ['q' => 'Không ở TP.HCM có làm việc từ xa được không?',
             'a' => 'Hoàn toàn được. Phần lớn khách hàng của mình làm việc qua email, Zalo và video call. File thiết kế và tài liệu đều gửi online, chỉ cần gặp trực tiếp khi cần test màu in tại xưởng.'],
        ];
        foreach ($items as $i => $f) {
            $this->execute(
                "INSERT INTO faqs (question, answer, page, sort_order) VALUES (?, ?, 'dich-vu', ?)",
                [$f['q'], $f['a'], $i + 1]
            );
        }
    }

    // ─── Pricing Plans (dich-vu.html — 3 gói) ────────────────────────────────────

    private function seedPricingPlans(): void {
        if ($this->scalar("SELECT COUNT(*) FROM pricing_plans") > 0) return;
        $plans = [
            ['name' => 'Gói Logo', 'price' => '3.500.000đ', 'note' => 'Dành cho brand mới bắt đầu, cần logo chuyên nghiệp',
             'features' => "3 concept logo ban đầu\n2 vòng chỉnh sửa\nFile AI / EPS / PNG / SVG\nHướng dẫn sử dụng logo cơ bản\nThời gian: 5–7 ngày làm việc",
             'is_featured' => 0, 'cta_text' => 'Chọn gói Logo', 'sort_order' => 1],
            ['name' => 'Gói Brand Identity', 'price' => '12.000.000đ', 'note' => 'Trọn bộ nhận diện cho thương hiệu cần ra mắt bài bản',
             'features' => "Toàn bộ hạng mục Gói Logo\nBảng màu & hệ thống typography\nName card, letterhead, social media kit\nBrand guideline 10–15 trang\n3 vòng chỉnh sửa\nThời gian: 10–14 ngày làm việc",
             'is_featured' => 1, 'badge_text' => 'Được chọn nhiều nhất', 'cta_text' => 'Chọn gói Brand Identity', 'sort_order' => 2],
            ['name' => 'Gói Trọn Gói', 'price' => '25.000.000đ', 'note' => 'Brand Identity + Packaging cho sản phẩm ra kệ bán lẻ',
             'features' => "Toàn bộ hạng mục Gói Brand Identity\nThiết kế bao bì tối đa 3 SKU\nLàm việc trực tiếp với xưởng in, test màu\nBrand guideline đầy đủ 25+ trang\n5 vòng chỉnh sửa\nThời gian: 3–4 tuần",
             'is_featured' => 0, 'cta_text' => 'Chọn gói Trọn Gói', 'sort_order' => 3],
        ];
        foreach ($plans as $pl) {
            $this->execute(
                "INSERT INTO pricing_plans (name, price, note, features, is_featured, badge_text, cta_text, cta_link, sort_order) VALUES (?,?,?,?,?,?,?,'/lien-he',?)",
                [$pl['name'], $pl['price'], $pl['note'], $pl['features'], $pl['is_featured'], $pl['badge_text'] ?? 'Được chọn nhiều nhất', $pl['cta_text'], $pl['sort_order']]
            );
        }
    }

    // ─── Timeline Items (ve-toi.html — hành trình làm nghề) ──────────────────────

    private function seedTimelineItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM timeline_items") > 0) return;
        $items = [
            ['year' => '2014', 'title' => 'Tốt nghiệp Thiết kế Đồ họa',
             'description' => 'Tốt nghiệp Đại học Kiến trúc TP.HCM, bắt đầu đi làm với vị trí Junior Designer tại một agency quảng cáo.'],
            ['year' => '2014 – 2017', 'title' => 'Junior Designer, Agency FMCG',
             'description' => 'Làm ấn phẩm in-house cho các nhãn hàng tiêu dùng nhanh — học cách làm việc với xưởng in và kiểm soát màu sắc thực tế.'],
            ['year' => '2017 – 2020', 'title' => 'Senior Brand Designer',
             'description' => 'Phụ trách packaging cho nhóm khách hàng ngành thực phẩm tại một creative agency, dẫn dắt 3 dự án rebrand lớn.'],
            ['year' => '2020', 'title' => 'Ra làm freelance độc lập',
             'description' => 'Thành lập studio riêng, tập trung phục vụ SME và startup cần bộ nhận diện thương hiệu bài bản với ngân sách hợp lý.'],
            ['year' => '2022', 'title' => 'Vượt mốc 50 dự án',
             'description' => 'Mở rộng thêm mảng Print & Editorial Design, bắt đầu hợp tác cố định với 2 xưởng in offset tại TP.HCM.'],
            ['year' => '2025', 'title' => '120+ dự án trên khắp cả nước',
             'description' => 'Làm việc từ xa với khách hàng từ Hà Nội đến Cần Thơ, tiếp tục theo đuổi triết lý "thiết kế phải bán được hàng".'],
        ];
        foreach ($items as $i => $t) {
            $this->execute(
                "INSERT INTO timeline_items (year, title, description, sort_order) VALUES (?, ?, ?, ?)",
                [$t['year'], $t['title'], $t['description'], $i + 1]
            );
        }
    }

    // ─── Tools/Skills (ve-toi.html — "Công cụ & kỹ năng" hscroll) ────────────────

    private function seedToolsSkills(): void {
        if ($this->scalar("SELECT COUNT(*) FROM tools_skills") > 0) return;
        $items = [
            ['name' => 'Illustrator', 'level_label' => 'Thành thạo', 'level_percent' => 95],
            ['name' => 'Photoshop', 'level_label' => 'Thành thạo', 'level_percent' => 90],
            ['name' => 'InDesign', 'level_label' => 'Thành thạo', 'level_percent' => 88],
            ['name' => 'Figma', 'level_label' => 'Khá', 'level_percent' => 85],
            ['name' => 'Procreate', 'level_label' => 'Khá', 'level_percent' => 70],
            ['name' => 'Print Production', 'level_label' => 'Thành thạo', 'level_percent' => 92],
        ];
        foreach ($items as $i => $s) {
            $this->execute(
                "INSERT INTO tools_skills (name, level_label, level_percent, sort_order) VALUES (?, ?, ?, ?)",
                [$s['name'], $s['level_label'], $s['level_percent'], $i + 1]
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
