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
            ['site_name', 'Tuấn Đặng Studio', 'general'],
            ['site_tagline', 'Architecture Studio', 'general'],
            ['site_description', 'Tuấn Đặng Studio — văn phòng kiến trúc độc lập tại Hà Nội, chuyên thiết kế nhà ở dân dụng tối giản và cải tạo công trình cũ. 15 năm kinh nghiệm, 62+ công trình.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hello@tuandang.studio', 'general'],
            ['site_phone', '0912 345 678', 'general'],
            ['site_address', 'Ngõ 12 Đặng Thai Mai, Tây Hồ, Hà Nội', 'general'],
            ['working_hours', 'Thứ 2 – Thứ 7, 8:30 – 18:00', 'general'],

            // ── SEO ──
            ['meta_title', 'Tuấn Đặng Studio — Kiến trúc sư độc lập | Nhà ở dân dụng & Cải tạo công trình cũ tại Hà Nội', 'seo'],
            ['meta_description', 'Tuấn Đặng Studio — văn phòng kiến trúc độc lập tại Hà Nội, chuyên thiết kế nhà ở dân dụng tối giản và cải tạo công trình cũ. 15 năm kinh nghiệm, 62+ công trình.', 'seo'],
            ['meta_keywords', 'kiến trúc sư Hà Nội, thiết kế nhà ở dân dụng, cải tạo nhà cũ, kiến trúc tối giản, thiết kế nội thất', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format&fit=crop', 'seo'],

            // ── Mạng xã hội ──
            ['zalo_phone', '0912345678', 'social'],

            // ── Footer ──
            ['footer_description', 'Văn phòng kiến trúc độc lập tại Hà Nội, chuyên thiết kế nhà ở dân dụng tối giản và cải tạo công trình cũ — nơi kiến trúc phục vụ cách sống thật của gia chủ.', 'footer'],
            ['footer_copyright', '© 2026 Tuấn Đặng Studio. Bản quyền thuộc về Tuấn Đặng Studio.', 'footer'],

            // ── Liên hệ / Bản đồ ──
            ['map_embed', 'https://maps.google.com/maps?q=21.0285,105.8542&hl=vi&z=15&output=embed', 'contact'],

            // ── Nội dung trang — Trang chủ ──
            ['home_intro_eyebrow', 'Chuyên môn', 'content'],
            ['home_intro_title', 'Hai hướng đi, *một triết lý*', 'content'],
            ['home_intro_sub', 'Tuấn Đặng Studio không nhận mọi loại công trình. Chúng tôi tập trung vào hai chuyên môn để làm thật sâu, thật kỹ — thay vì làm rộng mà nông.', 'content'],
            ['home_list1_title', 'Nhà ở dân dụng tối giản', 'content'],
            ['home_list1_desc', 'Nhà phố, biệt thự nhỏ, nhà vườn — thiết kế mới hoàn toàn từ khu đất trống.', 'content'],
            ['home_list2_title', 'Cải tạo công trình cũ', 'content'],
            ['home_list2_desc', 'Nhà ống phố cổ, tập thể cũ, nhà cấp 4 xuống cấp — hồi sinh không gian sống.', 'content'],
            ['home_list3_title', 'Thiết kế nội thất đi kèm', 'content'],
            ['home_list3_desc', 'Bố trí công năng, vật liệu, ánh sáng — đồng bộ với kiến trúc tổng thể.', 'content'],
            ['home_list4_title', 'Giám sát tác giả', 'content'],
            ['home_list4_desc', 'Đồng hành tại công trường để bản vẽ được thi công đúng như thiết kế.', 'content'],
            ['home_projects_eyebrow', 'Dự án nổi bật', 'content'],
            ['home_projects_title', 'Một vài công trình *gần đây*', 'content'],
            ['home_projects_sub', 'Mỗi công trình là một bài toán riêng — về đất, về ánh sáng, về cách gia chủ muốn sống.', 'content'],
            ['stat1_number', '15', 'content'], ['stat1_suffix', '+', 'content'], ['stat1_label', 'Năm kinh nghiệm', 'content'],
            ['stat2_number', '62', 'content'], ['stat2_suffix', '', 'content'], ['stat2_label', 'Công trình hoàn thành', 'content'],
            ['stat3_number', '45', 'content'], ['stat3_suffix', '+', 'content'], ['stat3_label', 'Khách hàng tin tưởng', 'content'],
            ['stat4_number', '6', 'content'], ['stat4_suffix', '', 'content'], ['stat4_label', 'Giải thưởng & bài viết chuyên môn', 'content'],
            ['home_strip_eyebrow', 'Cách chúng tôi làm việc', 'content'],
            ['home_strip_title', 'Lắng nghe trước, *vẽ sau*', 'content'],
            ['home_strip_text1', 'Trước khi đặt bút phác thảo, chúng tôi dành ít nhất 2 buổi làm việc trực tiếp với gia chủ — hỏi về thói quen sống, số lượng thành viên, ngân sách thật, và cả những điều họ ngại nói ra ban đầu.', 'content'],
            ['home_strip_text2', 'Một bản thiết kế tốt không bắt đầu từ hình khối đẹp, mà từ việc hiểu đúng ai sẽ sống trong đó.', 'content'],
            ['home_strip_image', 'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=800&q=80&auto=format&fit=crop', 'content'],
            ['home_testi_eyebrow', 'Khách hàng nói gì', 'content'],
            ['home_testi_quote', 'Anh Tuấn không thiết kế theo ý mình muốn, mà thiết kế theo cách nhà tôi thực sự sống. Đó là điều tôi trân trọng nhất sau khi làm việc cùng studio.', 'content'],
            ['home_testi_name', 'Anh Hoàng', 'content'],
            ['home_testi_role', 'Chủ nhà — Nhà Phố Tối Giản, Long Biên', 'content'],
            ['cta_home_eyebrow', 'Bắt đầu dự án của bạn', 'content'],
            ['cta_home_title', 'Bạn đang có một khu đất, *hay một ngôi nhà cần cải tạo?*', 'content'],

            // ── Nội dung trang — Dự án ──
            ['projects_hero_title', 'Những công trình *chúng tôi tự hào*', 'content'],
            ['projects_hero_sub', '10 công trình tiêu biểu trong hành trình 15 năm — từ nhà ở dân dụng xây mới đến cải tạo công trình cũ tại Hà Nội và các tỉnh lân cận.', 'content'],
            ['cta_projects_eyebrow', 'Dự án tiếp theo, có thể là của bạn', 'content'],
            ['cta_projects_title', 'Kể cho chúng tôi nghe *về ngôi nhà bạn đang nghĩ tới*', 'content'],

            // ── Nội dung trang — Dịch vụ ──
            ['services_hero_title', 'Ba gói dịch vụ, *một cam kết*', 'content'],
            ['services_hero_sub', 'Tùy vào mức độ đồng hành bạn cần — từ bản vẽ thiết kế đến bàn giao chìa khóa trao tay — chọn gói phù hợp với dự án của mình.', 'content'],
            ['process1_title', 'Khảo sát & lắng nghe', 'content'],
            ['process1_desc', 'Khảo sát hiện trạng đất/công trình, trao đổi trực tiếp về nhu cầu, ngân sách và mong muốn sống của gia chủ.', 'content'],
            ['process2_title', 'Thiết kế & hoàn thiện hồ sơ', 'content'],
            ['process2_desc', 'Phát triển concept, lấy ý kiến điều chỉnh, hoàn thiện hồ sơ bản vẽ kỹ thuật đủ điều kiện xin phép và thi công.', 'content'],
            ['process3_title', 'Thi công & bàn giao', 'content'],
            ['process3_desc', 'Giám sát tác giả hoặc quản lý thi công trọn gói (tùy dịch vụ), nghiệm thu và bàn giao công trình.', 'content'],
            ['pricing_sub', 'Giá tham khảo, được điều chỉnh chính xác sau buổi khảo sát thực tế theo quy mô và độ phức tạp công trình.', 'content'],
            ['cta_services_eyebrow', 'Vẫn còn băn khoăn?', 'content'],
            ['cta_services_title', 'Đặt một buổi *tư vấn miễn phí 30 phút*', 'content'],

            // ── Nội dung trang — Về tôi ──
            ['about_hero_title', 'Đặng Minh Tuấn\n*Kiến trúc sư độc lập*', 'content'],
            ['about_hero_sub', '15 năm hành nghề, 62 công trình — luôn tin rằng kiến trúc tốt nhất là kiến trúc phục vụ đúng cách sống của người ở, không phải phô diễn cái tôi của người thiết kế.', 'content'],
            ['about_bio_eyebrow', 'Đôi nét về tôi', 'content'],
            ['about_bio_title', 'Từ văn phòng lớn *đến studio của riêng mình*', 'content'],
            ['about_bio_text1', 'Tôi tốt nghiệp Đại học Kiến trúc Hà Nội năm 2009, sau đó làm việc 5 năm tại một văn phòng kiến trúc lớn — nơi tôi học được kỷ luật trong hồ sơ kỹ thuật, nhưng cũng nhận ra mình muốn làm việc trực tiếp với từng gia chủ thay vì chỉ là một mắt xích trong quy trình lớn.', 'content'],
            ['about_bio_text2', 'Năm 2018, tôi thành lập Tuấn Đặng Studio — một văn phòng nhỏ, chủ đích không mở rộng quá mức, để mỗi dự án đều có thể do chính tôi trực tiếp thiết kế và giám sát từ đầu đến cuối.', 'content'],
            ['about_bio_image', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80&auto=format&fit=crop', 'content'],
            ['philosophy_eyebrow', 'Triết lý thiết kế', 'content'],
            ['philosophy_title', 'Kiến trúc phục vụ *cách sống,*\nkhông phải ngược lại', 'content'],
            ['philosophy1_title', 'Tối giản có chủ đích', 'content'],
            ['philosophy1_text', 'Tối giản không phải để đẹp trong ảnh, mà để loại bỏ những gì không phục vụ cách sống thật của gia chủ — từng đường nét đều có lý do tồn tại.', 'content'],
            ['philosophy2_title', 'Tôn trọng công trình cũ', 'content'],
            ['philosophy2_text', 'Một công trình cũ mang theo ký ức. Cải tạo không phải xóa bỏ, mà là đối thoại giữa cái cũ và nhu cầu sống mới.', 'content'],
            ['philosophy3_title', 'Minh bạch từng quyết định', 'content'],
            ['philosophy3_text', 'Gia chủ luôn hiểu vì sao một hạng mục được thiết kế như vậy, và đang trả tiền cho điều gì — không có "hộp đen" trong quy trình làm việc.', 'content'],
            ['timeline_eyebrow', 'Hành trình', 'content'],
            ['timeline_title', '15 năm *làm nghề*', 'content'],
            ['testi_full_eyebrow', 'Khách hàng nói gì', 'content'],
            ['testi_full_title', 'Những nhận xét *tôi trân trọng nhất*', 'content'],
            ['cta_about_eyebrow', 'Cùng làm việc', 'content'],
            ['cta_about_title', 'Kể cho tôi nghe *về ngôi nhà bạn đang nghĩ tới*', 'content'],

            // ── Nội dung trang — Liên hệ ──
            ['contact_hero_title', 'Kể cho chúng tôi nghe *về dự án của bạn*', 'content'],
            ['contact_hero_sub', 'Buổi tư vấn đầu tiên hoàn toàn miễn phí — 30 phút để hiểu về khu đất, ngân sách và mong muốn của bạn.', 'content'],
            ['cta_project_title', 'Bắt đầu dự án *của bạn*', 'content'],

            // ── Pháp lý ──
            ['legal_updated', '01/07/2026', 'legal'],
            ['privacy_content', "<h4>1. Thông tin chúng tôi thu thập</h4><p>Khi bạn liên hệ qua form trên website hoặc đặt lịch tư vấn, Tuấn Đặng Studio thu thập các thông tin bạn chủ động cung cấp: họ tên, số điện thoại, email, địa chỉ dự án và mô tả nhu cầu thiết kế/cải tạo.</p><h4>2. Mục đích sử dụng thông tin</h4><p>Thông tin được sử dụng để liên hệ tư vấn, lập báo giá, soạn thảo hợp đồng dịch vụ và trao đổi trong suốt quá trình thực hiện dự án. Chúng tôi không sử dụng thông tin khách hàng cho mục đích quảng cáo bên thứ ba.</p><h4>3. Bảo mật thông tin</h4><p>Thông tin khách hàng được lưu trữ nội bộ, chỉ những cá nhân trực tiếp phụ trách dự án của bạn mới có quyền truy cập. Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của khách hàng cho bên thứ ba khi chưa có sự đồng ý.</p><h4>4. Hình ảnh công trình</h4><p>Với các dự án đã hoàn thành, chúng tôi có thể sử dụng hình ảnh công trình (đã được sự đồng ý của gia chủ) cho mục đích giới thiệu portfolio trên website và mạng xã hội. Chúng tôi luôn xin phép trước khi công khai bất kỳ hình ảnh nào liên quan đến không gian sống riêng tư của khách hàng.</p><h4>5. Quyền của khách hàng</h4><p>Bạn có quyền yêu cầu chúng tôi cung cấp, chỉnh sửa hoặc xóa thông tin cá nhân đã cung cấp bất kỳ lúc nào bằng cách liên hệ qua email hello@tuandang.studio.</p><h4>6. Liên hệ</h4><p>Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ hello@tuandang.studio hoặc 0912 345 678.</p>", 'legal'],
            ['terms_content', "<h4>1. Phạm vi dịch vụ</h4><p>Tuấn Đặng Studio cung cấp dịch vụ tư vấn thiết kế kiến trúc, giám sát tác giả và quản lý thi công theo 3 gói dịch vụ được công bố tại trang Dịch vụ. Phạm vi công việc cụ thể của từng dự án được quy định chi tiết trong hợp đồng ký kết giữa hai bên, không mặc nhiên áp dụng nội dung mô tả trên website.</p><h4>2. Bảng giá tham khảo</h4><p>Mức giá công bố trên website (180.000 – 380.000đ/m² và các mức phí quản lý dự án) là giá tham khảo, có thể thay đổi tùy theo quy mô, độ phức tạp và hiện trạng thực tế của công trình sau khảo sát. Báo giá chính thức được xác nhận bằng văn bản/hợp đồng trước khi triển khai.</p><h4>3. Quyền sở hữu trí tuệ</h4><p>Bản vẽ thiết kế, phối cảnh 3D và hồ sơ kỹ thuật do studio thực hiện thuộc quyền sở hữu trí tuệ của Tuấn Đặng Studio cho đến khi khách hàng hoàn tất nghĩa vụ thanh toán theo hợp đồng. Khách hàng không được sử dụng hồ sơ thiết kế cho công trình khác hoặc chuyển giao cho bên thứ ba khi chưa có sự đồng ý bằng văn bản.</p><h4>4. Thay đổi & phát sinh thiết kế</h4><p>Mọi thay đổi thiết kế sau khi đã chốt phương án (concept) có thể phát sinh chi phí và thời gian bổ sung, được hai bên thống nhất bằng phụ lục hợp đồng trước khi thực hiện.</p><h4>5. Trách nhiệm các bên</h4><p>Studio cam kết thực hiện đúng phạm vi công việc, tiến độ và chất lượng theo hợp đồng. Khách hàng có trách nhiệm cung cấp thông tin hiện trạng đất/công trình chính xác và thanh toán đúng tiến độ đã thỏa thuận.</p><h4>6. Liên hệ</h4><p>Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ hello@tuandang.studio hoặc 0912 345 678.</p>", 'legal'],

            // ── SMTP ──
            ['smtp_host', '', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from_name', 'Tuấn Đặng Studio', 'smtp'],
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

    // ─── Hero Slides ───────────────────────────────────────────────────────────

    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        // title dùng cú pháp *từ* -> in nghiêng màu accent (parse ở HeroSlider.tsx).
        // subtitle format: "<nhãn eyebrow>||<đoạn mô tả>".
        // button_text/button_link lưu nút ACCENT chính (đổi theo từng slide) — nút phụ (ghost, luôn là
        // link nội bộ cố định) được hardcode theo index slide trong HeroSlider.tsx, đúng như thiết kế gốc.
        $slides = [
            [
                'title' => 'Kiến trúc cho *cuộc sống tối giản*',
                'subtitle' => 'Tuấn Đặng Studio — Hà Nội||Chúng tôi thiết kế những ngôi nhà nơi ánh sáng, không gian và vật liệu phục vụ đúng cách sống của gia chủ — không thừa, không thiếu.',
                'image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80&auto=format&fit=crop',
                'button_text' => 'Xem dự án',
                'button_link' => '/du-an',
                'sort_order' => 1,
            ],
            [
                'title' => 'Giữ hồn công trình cũ, *thổi hơi thở mới*',
                'subtitle' => 'Chuyên môn cải tạo||Từ nhà ống phố cổ đến tập thể cũ — chúng tôi cải tạo công trình xuống cấp thành không gian sống hiện đại mà vẫn giữ trọn ký ức kiến trúc.',
                'image' => 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80&auto=format&fit=crop',
                'button_text' => 'Xem case study cải tạo',
                'button_link' => '/du-an/cai-tao-nha-cu-hoan-kiem',
                'sort_order' => 2,
            ],
            [
                'title' => 'Từ *ý tưởng* đến hiện thực',
                'subtitle' => 'Nhà ở dân dụng||Đồng hành cùng gia chủ suốt hành trình — từ bản vẽ concept đầu tiên đến ngày nhận nhà, minh bạch từng giai đoạn, từng hạng mục chi phí.',
                'image' => 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80&auto=format&fit=crop',
                'button_text' => 'Quy trình làm việc',
                'button_link' => '/dich-vu',
                'sort_order' => 3,
            ],
            [
                'title' => '62 công trình tại *Hà Nội* và vùng lân cận',
                'subtitle' => '15 năm hành nghề||Một studio kiến trúc độc lập, quy mô nhỏ, làm việc trực tiếp với từng gia chủ — không qua trung gian, không rập khuôn thiết kế.',
                'image' => 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80&auto=format&fit=crop',
                'button_text' => 'Hành trình của tôi',
                'button_link' => '/ve-toi',
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

        // ── Case study 1 — Nhà Phố Tối Giản, Long Biên ──
        $challenge1 = "Anh Hoàng tìm đến studio với một lô đất hình thang khá đặc biệt: mặt tiền chỉ rộng 4,2m, sâu 22m, mở rộng dần về phía sau. Gia đình có hai con nhỏ dưới 6 tuổi, mong muốn một không gian sinh hoạt chung mở, nhiều ánh sáng tự nhiên — nhưng ngân sách xây dựng bị giới hạn ở mức 2,8 tỷ, thấp hơn khá nhiều so với mặt bằng chung của khu vực cho diện tích 4 tầng.\n\nThách thức lớn nhất không nằm ở hình khối, mà ở việc lô đất hẹp khiến ánh sáng tự nhiên khó xuyên vào các phòng giữa nhà — bài toán kinh điển của nhà ống Hà Nội. Ngoài ra, cầu thang bố trí theo lối cũ (một bên hông, chạy suốt 4 tầng) đang chiếm gần 12% diện tích sử dụng mà gia chủ ban đầu đề xuất.";
        $solutionItems1 = implode("\n", [
            'Concept::Toàn bộ công trình được tổ chức quanh một giếng trời trung tâm xuyên suốt 4 tầng, đặt lệch về phía sau nhà — vừa lấy sáng, vừa lấy gió, vừa là điểm nhấn thị giác khi di chuyển giữa các tầng.',
            'Vật liệu::Bê tông mài cho sàn tầng 1 và cầu thang — bền, dễ vệ sinh, chi phí hợp lý. Gỗ sồi tự nhiên cho nội thất và lan can — tạo điểm ấm trong tổng thể tông màu trung tính.',
            'Công năng::Tầng 1: không gian sinh hoạt chung mở (bếp, ăn, khách liên thông). Tầng 2–3: phòng ngủ, mỗi phòng đều tiếp xúc trực tiếp với giếng trời hoặc mặt thoáng. Tầng 4: sân thượng vườn, giặt phơi kín đáo.',
            'Cầu thang::Bố trí lại cầu thang áp sát giếng trời thay vì chạy dọc hông nhà — thu hẹp bản thang, tận dụng chiếu nghỉ làm góc đọc sách, giải phóng diện tích cho các phòng chức năng.',
        ]);
        $gallery1 = implode("\n", [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80&auto=format&fit=crop|Mặt tiền nhà phố Long Biên|g1',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80&auto=format&fit=crop|Không gian sinh hoạt chung tầng 1|g2',
            'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=700&q=80&auto=format&fit=crop|Giếng trời trung tâm|g3',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80&auto=format&fit=crop|Cầu thang gỗ sồi bên giếng trời|g2',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=700&q=80&auto=format&fit=crop|Phòng ngủ tầng 2|g3',
        ]);
        $results1 = implode("\n", [
            '30|%|Tiết kiệm điện chiếu sáng ban ngày nhờ giếng trời lấy sáng tự nhiên',
            '25|%|Tăng diện tích sử dụng hiệu quả nhờ bố trí lại vị trí cầu thang',
            '8||Tháng thi công — hoàn thành đúng tiến độ cam kết ban đầu',
        ]);

        // ── Case study 2 — Cải Tạo Nhà Cũ, Hoàn Kiếm ──
        $challenge2 = "Chị Lan thừa kế căn nhà cấp 4 nằm sâu trong một ngõ nhỏ khu phố cổ, xây dựng từ những năm 1960. Tường gạch đã xuống cấp nghiêm trọng, mái ngói dột nhiều vị trí, hệ thống điện nước cũ không còn an toàn. Gia đình muốn cải tạo thành không gian sống hiện đại cho 3 thế hệ, nhưng khu vực này nằm trong ranh giới bảo tồn phố cổ Hà Nội — mọi thay đổi mặt tiền đều phải xin phép và tuân thủ quy định giữ nguyên hình thức kiến trúc gốc.\n\nBài toán đặt ra: vừa phải gia cố kết cấu đủ an toàn để nâng cấp công năng, vừa phải giữ nguyên gần như toàn bộ mặt tiền gạch cũ theo yêu cầu của phường, trong khi ngân sách chỉ bằng khoảng 60% chi phí xây mới cùng diện tích.";
        $solutionItems2 = implode("\n", [
            'Khảo sát & gia cố kết cấu::Gia cố móng và hệ tường chịu lực bằng khung thép nhẹ ẩn trong tường, không làm thay đổi độ dày mặt ngoài.',
            'Bảo tồn mặt tiền gạch cũ::Giữ nguyên lớp gạch mặt tiền theo đúng yêu cầu bảo tồn, chỉ xử lý chống thấm và phục hồi mạch vữa.',
            'Mở thông không gian nội thất::Phá bỏ vách ngăn cũ không chịu lực, tổ chức lại công năng theo hướng mở, thông tầng khu bếp — khách.',
            'Thêm giếng trời phía sau::Đục thông một khoảng nhỏ phía sau nhà làm giếng trời — giải quyết bài toán thiếu sáng của nhà ống sâu.',
            'Tái sử dụng vật liệu gốc::Gạch cũ tháo dỡ từ vách trong được làm sạch, ốp lại làm điểm nhấn tường phòng khách.',
        ]);
        $gallery2 = implode("\n", [
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80&auto=format&fit=crop|Mặt tiền gạch cũ được bảo tồn|g1',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=700&q=80&auto=format&fit=crop|Không gian bếp khách mở thông|g2',
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=700&q=80&auto=format&fit=crop|Giếng trời phía sau nhà|g3',
            'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=700&q=80&auto=format&fit=crop|Tường ốp gạch cũ tái sử dụng|g2',
            'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=700&q=80&auto=format&fit=crop|Phòng ngủ tầng lửng|g3',
        ]);
        $results2 = implode("\n", [
            '70|%|Vật liệu gốc (gạch, một phần khung mái) được giữ lại và tái sử dụng',
            '40|%|Tiết kiệm chi phí so với phương án phá dỡ xây mới hoàn toàn',
            '5||Tháng thi công — hoàn thành đúng dịp Tết theo mong muốn gia đình',
        ]);

        $projects = [
            [
                'title' => 'Nhà Phố Tối Giản', 'slug' => 'nha-pho-toi-gian-long-bien', 'category' => 'Nhà ở dân dụng',
                'image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop',
                'location' => 'Long Biên, Hà Nội', 'year' => '2024', 'has_case_study' => 1,
                'client_name' => 'Anh Hoàng & gia đình', 'area' => '120m² đất · 4 tầng', 'duration' => '8 tháng', 'budget' => '~2,8 tỷ VNĐ',
                'cover_image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80&auto=format&fit=crop',
                'challenge_title' => 'Đất hình thang hẹp, *hai con nhỏ, ngân sách có hạn*',
                'challenge_body' => $challenge1,
                'solution_title' => 'Khối hộp xuyên sáng, *giếng trời làm trung tâm*',
                'solution_layout' => 'grid', 'solution_items' => $solutionItems1,
                'gallery_images' => $gallery1,
                'results_title' => 'Đo lường được, *không chỉ đẹp trên bản vẽ*', 'results_items' => $results1,
                'testimonial_content' => 'Điều tôi bất ngờ nhất là căn nhà 4,2m mặt tiền lại không hề có cảm giác bí bách. Giếng trời khiến cả nhà lúc nào cũng sáng, kể cả tầng 2 là nơi tôi lo nhất ban đầu. Anh Tuấn giải thích rất rõ từng quyết định thiết kế, tôi luôn hiểu vì sao mình đang trả tiền cho hạng mục đó.',
                'testimonial_author' => 'Anh Hoàng', 'testimonial_role' => 'Chủ nhà — Nhà Phố Tối Giản, Long Biên',
                'featured' => 1, 'sort_order' => 1,
            ],
            [
                'title' => 'Cải Tạo Nhà Cũ Phố Cổ', 'slug' => 'cai-tao-nha-cu-hoan-kiem', 'category' => 'Cải tạo công trình cũ',
                'image' => 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80&auto=format&fit=crop',
                'location' => 'Hoàn Kiếm, Hà Nội', 'year' => '2023', 'has_case_study' => 1,
                'client_name' => 'Chị Lan', 'area' => '45m² · Nhà 60 năm tuổi', 'duration' => '5 tháng', 'budget' => '~1,1 tỷ VNĐ',
                'cover_image' => 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80&auto=format&fit=crop',
                'challenge_title' => 'Nhà cấp 4 xuống cấp, *ràng buộc bảo tồn mặt tiền*',
                'challenge_body' => $challenge2,
                'solution_title' => 'Gia cố từ bên trong, *giữ nguyên từ bên ngoài*',
                'solution_layout' => 'list', 'solution_items' => $solutionItems2,
                'gallery_images' => $gallery2,
                'results_title' => 'Giữ ký ức, *giảm chi phí, đúng hẹn*', 'results_items' => $results2,
                'testimonial_content' => 'Tôi từng nghĩ sẽ phải đập hết đi xây lại. Nhưng khi thấy bản vẽ giữ nguyên mặt tiền gạch cũ — nơi tôi lớn lên — tôi đã khóc. Studio không chỉ cải tạo một căn nhà, họ giữ lại một phần ký ức gia đình tôi.',
                'testimonial_author' => 'Chị Lan', 'testimonial_role' => 'Chủ nhà — Cải Tạo Nhà Cũ, Hoàn Kiếm',
                'featured' => 1, 'sort_order' => 2,
            ],
            [
                'title' => 'Biệt Thự Vườn', 'slug' => 'biet-thu-vuon-gia-lam', 'category' => 'Nhà ở dân dụng',
                'image' => 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80&auto=format&fit=crop',
                'location' => 'Gia Lâm, Hà Nội', 'year' => '2023', 'has_case_study' => 0,
                'featured' => 1, 'sort_order' => 3,
            ],
            [
                'title' => 'Căn Hộ Tập Thể Cải Tạo', 'slug' => 'can-ho-tap-the-thanh-cong', 'category' => 'Cải tạo công trình cũ',
                'image' => 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80&auto=format&fit=crop',
                'location' => 'Thành Công, Hà Nội', 'year' => '2023', 'has_case_study' => 0,
                'sort_order' => 4,
            ],
            [
                'title' => 'Nhà Ống 4 Tầng', 'slug' => 'nha-ong-4-tang-cau-giay', 'category' => 'Nhà ở dân dụng',
                'image' => 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80&auto=format&fit=crop',
                'location' => 'Cầu Giấy, Hà Nội', 'year' => '2022', 'has_case_study' => 0,
                'sort_order' => 5,
            ],
            [
                'title' => 'Xưởng Gốm Cải Tạo Thành Nhà Ở', 'slug' => 'xuong-gom-bat-trang', 'category' => 'Cải tạo công trình cũ',
                'image' => 'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=800&q=80&auto=format&fit=crop',
                'location' => 'Bát Tràng, Hà Nội', 'year' => '2022', 'has_case_study' => 0,
                'sort_order' => 6,
            ],
            [
                'title' => 'Nhà Vườn Ngoại Ô', 'slug' => 'nha-vuon-dong-anh', 'category' => 'Nhà ở dân dụng',
                'image' => 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80&auto=format&fit=crop',
                'location' => 'Đông Anh, Hà Nội', 'year' => '2021', 'has_case_study' => 0,
                'sort_order' => 7,
            ],
            [
                'title' => 'Nhà Cấp 4 Cải Tạo Thêm Tầng', 'slug' => 'nha-cap-4-dong-da', 'category' => 'Cải tạo công trình cũ',
                'image' => 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80&auto=format&fit=crop',
                'location' => 'Đống Đa, Hà Nội', 'year' => '2021', 'has_case_study' => 0,
                'sort_order' => 8,
            ],
            [
                'title' => 'Villa Nghỉ Dưỡng Ven Hồ', 'slug' => 'villa-nghi-duong-hoa-binh', 'category' => 'Nhà ở dân dụng',
                'image' => 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80&auto=format&fit=crop',
                'location' => 'Hòa Bình', 'year' => '2020', 'has_case_study' => 0,
                'sort_order' => 9,
            ],
            [
                'title' => 'Nhà Phố Mặt Tiền Hẹp Cải Tạo', 'slug' => 'nha-pho-hai-ba-trung', 'category' => 'Cải tạo công trình cũ',
                'image' => 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&q=80&auto=format&fit=crop',
                'location' => 'Hai Bà Trưng, Hà Nội', 'year' => '2020', 'has_case_study' => 0,
                'sort_order' => 10,
            ],
        ];

        foreach ($projects as $p) {
            $this->execute(
                "INSERT INTO projects (title, slug, category, image, location, year, has_case_study, client_name, area, duration, budget, cover_image, challenge_title, challenge_body, solution_title, solution_layout, solution_items, gallery_images, results_title, results_items, testimonial_content, testimonial_author, testimonial_role, featured, sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [
                    $p['title'], $p['slug'], $p['category'], $p['image'], $p['location'], $p['year'], $p['has_case_study'] ?? 0,
                    $p['client_name'] ?? '', $p['area'] ?? '', $p['duration'] ?? '', $p['budget'] ?? '',
                    $p['cover_image'] ?? '', $p['challenge_title'] ?? '', $p['challenge_body'] ?? '',
                    $p['solution_title'] ?? '', $p['solution_layout'] ?? 'grid', $p['solution_items'] ?? '',
                    $p['gallery_images'] ?? '', $p['results_title'] ?? '', $p['results_items'] ?? '',
                    $p['testimonial_content'] ?? '', $p['testimonial_author'] ?? '', $p['testimonial_role'] ?? '',
                    $p['featured'] ?? 0, $p['sort_order'] ?? 0,
                ]
            );
        }
    }

    // ─── Testimonials (ve-toi.html grid) ─────────────────────────────────────────

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $items = [
            ['author_name' => 'Anh Hoàng', 'author_title' => 'Chủ nhà, Nhà Phố Tối Giản, Long Biên',
             'content' => 'Điều tôi bất ngờ nhất là căn nhà 4,2m mặt tiền lại không hề có cảm giác bí bách. Anh Tuấn giải thích rất rõ từng quyết định thiết kế.', 'sort_order' => 1],
            ['author_name' => 'Chị Lan', 'author_title' => 'Chủ nhà, Cải Tạo Nhà Cũ, Hoàn Kiếm',
             'content' => 'Tôi từng nghĩ sẽ phải đập hết đi xây lại. Studio không chỉ cải tạo một căn nhà, họ giữ lại một phần ký ức gia đình tôi.', 'sort_order' => 2],
            ['author_name' => 'Anh Dũng & chị Mai', 'author_title' => 'Chủ nhà, Biệt Thự Vườn, Gia Lâm',
             'content' => 'Ngân sách của chúng tôi không lớn, nhưng chưa từng cảm thấy bị \'giản lược\' về mặt thẩm mỹ. Mỗi góc nhà đều được tính toán kỹ.', 'sort_order' => 3],
            ['author_name' => 'Chị Hương', 'author_title' => 'Chủ nhà, Căn Hộ Tập Thể Cải Tạo, Thành Công',
             'content' => 'Căn hộ tập thể cũ 50m² của tôi giờ có cảm giác rộng gấp rưỡi. Đội thi công làm việc rất gọn gàng, đúng tiến độ cam kết.', 'sort_order' => 4],
        ];
        foreach ($items as $t) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, content, rating, sort_order) VALUES (?,?,?,?,?)",
                [$t['author_name'], $t['author_title'], $t['content'], 5, $t['sort_order']]
            );
        }
    }

    // ─── FAQs (dich-vu.html) ──────────────────────────────────────────────────

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $items = [
            ['q' => 'Chi phí thiết kế kiến trúc được tính như thế nào?',
             'a' => 'Chi phí thiết kế tính theo m² sàn xây dựng, dao động 180.000 – 380.000đ/m² tùy gói dịch vụ và độ phức tạp công trình (nhà mới thường thấp hơn cải tạo do khối lượng khảo sát kết cấu nhiều hơn). Sau buổi khảo sát thực tế, studio gửi báo giá chi tiết trước khi ký hợp đồng.'],
            ['q' => 'Quy trình làm việc từ concept đến thi công diễn ra như thế nào?',
             'a' => 'Quy trình gồm 3 giai đoạn chính: (1) Khảo sát & lên concept — 2-3 phương án ý tưởng dựa trên nhu cầu thực tế; (2) Phát triển hồ sơ kỹ thuật — hoàn thiện bản vẽ kiến trúc, kết cấu, điện nước sau khi gia chủ chốt phương án; (3) Thi công — giám sát tác giả hoặc quản lý trọn gói tùy dịch vụ đã chọn, đến khi nghiệm thu bàn giao.'],
            ['q' => 'Một dự án thiết kế nhà ở thường mất bao lâu?',
             'a' => 'Giai đoạn thiết kế (concept đến hồ sơ kỹ thuật hoàn chỉnh) thường mất 4-8 tuần tùy quy mô. Thời gian thi công dao động 5-10 tháng — nhà cải tạo thường ngắn hơn nhà xây mới cùng diện tích do không phải làm lại phần móng hoàn toàn.'],
            ['q' => 'Studio có giám sát thi công tại công trường không?',
             'a' => 'Có, với Gói Thiết Kế + Giám Sát và Gói Trọn Gói Thi Công. Kiến trúc sư đến công trường tối thiểu 2 lần/tuần để kiểm tra thi công đúng bản vẽ, xử lý phát sinh và nghiệm thu từng hạng mục. Gói Tư Vấn Thiết Kế cơ bản không bao gồm giám sát, chỉ hỗ trợ giải đáp từ xa.'],
            ['q' => 'Thanh toán được chia theo giai đoạn như thế nào?',
             'a' => 'Thông thường chia làm 4 đợt: 30% khi ký hợp đồng và chốt concept, 30% khi bàn giao hồ sơ bản vẽ kỹ thuật hoàn chỉnh, 30% trong giai đoạn giám sát thi công (chia theo tiến độ nếu thời gian thi công kéo dài), và 10% còn lại khi nghiệm thu bàn giao. Chi tiết cụ thể được ghi rõ trong hợp đồng.'],
            ['q' => 'Với nhà cũ, studio có khảo sát kết cấu trước khi thiết kế không?',
             'a' => 'Bắt buộc. Với mọi dự án cải tạo, studio luôn khảo sát hiện trạng kết cấu (móng, tường chịu lực, mái) trước khi lên phương án thiết kế, đôi khi phối hợp cùng kỹ sư kết cấu để đánh giá khả năng chịu tải trước khi quyết định phương án cải tạo cụ thể — tránh rủi ro trong thi công.'],
            ['q' => 'Studio có hỗ trợ xin phép xây dựng không?',
             'a' => 'Có. Hồ sơ bản vẽ kỹ thuật của studio được chuẩn bị đủ điều kiện để nộp xin phép xây dựng, và studio hỗ trợ tư vấn thủ tục hành chính liên quan. Với các công trình trong khu vực bảo tồn (như phố cổ), studio có kinh nghiệm làm việc với quy định giữ nguyên hình thức mặt tiền.'],
        ];
        foreach ($items as $i => $f) {
            $this->execute(
                "INSERT INTO faqs (question, answer, page, sort_order) VALUES (?, ?, 'dich-vu', ?)",
                [$f['q'], $f['a'], $i + 1]
            );
        }
    }

    // ─── Pricing Plans (dich-vu.html — 3 tiers) ─────────────────────────────────

    private function seedPricingPlans(): void {
        if ($this->scalar("SELECT COUNT(*) FROM pricing_plans") > 0) return;
        $plans = [
            ['name' => 'Tư Vấn Thiết Kế', 'tag' => 'Gói cơ bản', 'price' => '180.000 – 250.000', 'unit' => 'đ/m²',
             'features' => "Khảo sát hiện trạng đất/công trình\n3 phương án concept thiết kế\nHồ sơ bản vẽ kỹ thuật thi công đầy đủ\nPhối cảnh 3D minh họa\nBản vẽ kết cấu sơ bộ, điện nước\nHỗ trợ giải đáp qua email/điện thoại",
             'is_featured' => 0, 'sort_order' => 1],
            ['name' => 'Thiết Kế + Giám Sát', 'tag' => 'Phổ biến nhất', 'price' => '280.000 – 380.000', 'unit' => 'đ/m²',
             'features' => "Toàn bộ hạng mục của Gói Tư Vấn Thiết Kế\nGiám sát tác giả 2 lần/tuần tại công trường\nXử lý phát sinh thiết kế trong quá trình thi công\nNghiệm thu từng hạng mục theo tiến độ\nHỗ trợ làm việc trực tiếp với nhà thầu\nBáo cáo tiến độ định kỳ cho gia chủ",
             'is_featured' => 1, 'sort_order' => 2],
            ['name' => 'Thi Công Trọn Gói', 'tag' => 'Trọn gói', 'price' => 'Báo giá riêng', 'unit' => 'theo hạng mục',
             'features' => "Toàn bộ hạng mục của Gói Thiết Kế + Giám Sát\nStudio trực tiếp quản lý đội thi công\nPhí quản lý dự án ~8–12% giá trị công trình\nCam kết tiến độ & chất lượng bằng hợp đồng\nBảo hành công trình 24 tháng\nBàn giao chìa khóa trao tay",
             'is_featured' => 0, 'sort_order' => 3],
        ];
        foreach ($plans as $pl) {
            $this->execute(
                "INSERT INTO pricing_plans (name, tag, price, unit, features, is_featured, cta_text, cta_link, sort_order) VALUES (?,?,?,?,?,?,'Chọn gói này','/lien-he',?)",
                [$pl['name'], $pl['tag'], $pl['price'], $pl['unit'], $pl['features'], $pl['is_featured'], $pl['sort_order']]
            );
        }
    }

    // ─── Timeline Items (ve-toi.html — hành trình 15 năm) ───────────────────────

    private function seedTimelineItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM timeline_items") > 0) return;
        $items = [
            ['year' => '2009', 'title' => 'Tốt nghiệp Đại học Kiến trúc Hà Nội',
             'description' => 'Chuyên ngành Kiến trúc công trình dân dụng, đồ án tốt nghiệp về nhà ở tiết kiệm năng lượng trong đô thị nén.'],
            ['year' => '2010–2015', 'title' => 'Kiến trúc sư tại Văn phòng Kiến trúc Vũ Hoàng',
             'description' => 'Tham gia thiết kế hơn 20 công trình nhà ở và biệt thự, phụ trách triển khai hồ sơ kỹ thuật thi công.'],
            ['year' => '2016', 'title' => 'Tu nghiệp một năm tại Kyoto, Nhật Bản',
             'description' => 'Nghiên cứu kiến trúc truyền thống Nhật Bản và tinh thần tối giản (wabi-sabi) — ảnh hưởng trực tiếp đến phong cách thiết kế sau này.'],
            ['year' => '2018', 'title' => 'Thành lập Tuấn Đặng Studio',
             'description' => 'Mở văn phòng kiến trúc độc lập quy mô nhỏ tại Tây Hồ, Hà Nội, tập trung vào nhà ở dân dụng và cải tạo công trình cũ.'],
            ['year' => '2018–nay', 'title' => '62 công trình tại Hà Nội và vùng lân cận',
             'description' => 'Từ nhà phố, biệt thự vườn đến cải tạo nhà cũ phố cổ và tập thể — mỗi dự án là một bài toán riêng về đất, ánh sáng và cách sống.'],
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
