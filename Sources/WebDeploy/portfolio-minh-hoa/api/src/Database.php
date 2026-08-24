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
        // Strip comment lines TRƯỚC khi split — tránh filter loại bỏ CREATE TABLE nằm sau comment block
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
        $this->seedProjects();
        $this->seedTestimonials();
        $this->seedFaqs();
        $this->seedPricingPlans();
    }

    // ─── Users ───────────────────────────────────────────────────────────────
    private function seedUsers(): void {
        if ($this->scalar("SELECT COUNT(*) FROM users") > 0) return;
        $this->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['sysadmin', 'sysadmin@admin.com', password_hash('123456', PASSWORD_BCRYPT), 'superadmin']
        );
    }

    // ─── Settings ────────────────────────────────────────────────────────────
    private function seedSettings(): void {
        if ($this->scalar("SELECT COUNT(*) FROM settings") > 0) return;
        $settings = [
            // ── Thông tin chung ──
            ['site_name', 'Lam Trúc Illustration', 'general'],
            ['site_tagline', 'Character Design & Minh họa Sách Thiếu Nhi', 'general'],
            ['site_description', 'Lam Trúc — họa sĩ minh họa tự do chuyên character design, minh họa sách thiếu nhi và editorial illustration cho tạp chí. Xem dự án và nhận tư vấn hợp tác.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hello@lamtruc-illustration.vn', 'general'],
            ['site_phone', '0987 654 321', 'general'],
            ['site_address', 'Hà Nội, Việt Nam', 'general'],
            ['working_hours', '', 'general'],
            ['service_area', 'Hà Nội, Việt Nam — nhận dự án từ xa toàn quốc & quốc tế', 'general'],

            // ── SEO ──
            ['meta_title', 'Lam Trúc Illustration — Character Design & Minh họa Sách Thiếu Nhi', 'seo'],
            ['meta_description', 'Lam Trúc — họa sĩ minh họa tự do chuyên character design, minh họa sách thiếu nhi và editorial illustration cho tạp chí. Xem dự án và nhận tư vấn hợp tác.', 'seo'],
            ['meta_keywords', 'họa sĩ minh họa, character design, minh họa sách thiếu nhi, editorial illustration, illustrator Việt Nam', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&q=80&auto=format&fit=crop', 'seo'],

            // ── Mạng xã hội ──
            ['facebook', '#', 'social'],
            ['instagram', '#', 'social'],
            ['behance', '#', 'social'],
            ['zalo_phone', '0987654321', 'social'],

            // ── Footer ──
            ['footer_description', 'Họa sĩ minh họa tự do — character design, minh họa sách thiếu nhi & editorial illustration cho tạp chí.', 'footer'],
            ['footer_copyright', '© 2026 Lam Trúc Illustration Studio. All rights reserved.', 'footer'],

            // ── Liên hệ / Bản đồ ──
            ['map_embed', 'https://maps.google.com/maps?q=21.0285,105.8542&hl=vi&z=15&output=embed', 'contact'],

            // ── Nội dung — Trang chủ ──
            ['home_intro_label', 'Xin chào', 'content'],
            ['home_intro_title', 'Mình là Lam Trúc — vẽ nhân vật, *vẽ cả câu chuyện*', 'content'],
            ['home_intro_text', 'Suốt 8 năm qua, mình tập trung vào hai mảng: thiết kế nhân vật & minh họa cho sách tranh thiếu nhi, và editorial illustration cho các tạp chí cần một hình ảnh có chiều sâu hơn ảnh chụp thông thường.', 'content'],
            ['feature1_icon', '✎', 'content'], ['feature1_title', 'Character Design', 'content'],
            ['feature1_text', 'Xây dựng nhân vật từ concept sketch đến character sheet hoàn chỉnh, sẵn sàng cho sách, app hoặc merchandise.', 'content'],
            ['feature2_icon', '✦', 'content'], ['feature2_title', 'Sách tranh thiếu nhi', 'content'],
            ['feature2_text', 'Minh họa trọn bộ từ 16–40 trang, phối hợp cùng biên tập viên NXB xuyên suốt quá trình dàn trang, in ấn.', 'content'],
            ['feature3_icon', '◈', 'content'], ['feature3_title', 'Editorial Tạp chí', 'content'],
            ['feature3_text', 'Minh họa spot art, bìa chuyên đề cho các bài viết cần ẩn dụ hình ảnh — không phải ảnh chụp trực tiếp.', 'content'],
            ['stat1_number', '120', 'content'], ['stat1_suffix', '+', 'content'], ['stat1_label', 'Dự án hoàn thành', 'content'],
            ['stat2_number', '8', 'content'], ['stat2_suffix', ' năm', 'content'], ['stat2_label', 'Kinh nghiệm', 'content'],
            ['stat3_number', '15', 'content'], ['stat3_suffix', '+', 'content'], ['stat3_label', 'Đầu sách xuất bản', 'content'],
            ['stat4_number', '20', 'content'], ['stat4_suffix', '+', 'content'], ['stat4_label', 'Tòa soạn hợp tác', 'content'],
            ['home_testi_label', 'Khách hàng nói gì', 'content'],
            ['home_testi_title', 'Được tin tưởng bởi *biên tập viên & art director*', 'content'],
            ['home_cta_title', 'Có một câu chuyện cần một nhân vật?', 'content'],
            ['home_cta_text', 'Kể mình nghe ý tưởng của bạn — cùng nhau biến nó thành hình ảnh có sức sống riêng.', 'content'],

            // ── Nội dung — Trang Dự án ──
            ['projects_hero_title', 'Dự án đã *thực hiện*', 'content'],
            ['projects_hero_sub', '12 dự án tiêu biểu trong mảng character design, minh họa sách tranh thiếu nhi và editorial illustration cho tạp chí — bấm vào từng dự án để xem case study chi tiết.', 'content'],
            ['projects_cta_title', 'Chưa thấy đúng phong cách bạn cần?', 'content'],
            ['projects_cta_text', 'Mỗi dự án đều được điều chỉnh riêng theo brief — cứ kể mình nghe ý tưởng của bạn.', 'content'],

            // ── Nội dung — Trang Dịch vụ ──
            ['services_hero_title', 'Dịch vụ & *Bảng giá*', 'content'],
            ['services_hero_sub', '3 gói dịch vụ chính — từ một tranh minh họa lẻ đến trọn bộ một cuốn sách tranh thiếu nhi. Báo giá cụ thể luôn dựa trên brief thực tế của bạn.', 'content'],
            ['services_feat_label', 'Cam kết', 'content'],
            ['services_feat_title', 'Điều bạn *luôn nhận được*', 'content'],
            ['service_feature1_icon', '◆', 'content'], ['service_feature1_title', 'File nguồn chất lượng cao', 'content'],
            ['service_feature1_text', 'JPG/PNG độ phân giải in ấn, kèm file nguồn AI hoặc PSD theo gói.', 'content'],
            ['service_feature2_icon', '☺', 'content'], ['service_feature2_title', 'Character sheet đầy đủ', 'content'],
            ['service_feature2_text', '3 góc nhìn, bảng biểu cảm và style guide màu cho các gói có nhân vật.', 'content'],
            ['service_feature3_icon', '©', 'content'], ['service_feature3_title', 'Quyền sử dụng rõ ràng', 'content'],
            ['service_feature3_text', 'Ghi rõ phạm vi sử dụng thương mại trong hợp đồng, không mập mờ.', 'content'],
            ['service_feature4_icon', '✉', 'content'], ['service_feature4_title', 'Hỗ trợ sau bàn giao', 'content'],
            ['service_feature4_text', 'Giải đáp thắc mắc kỹ thuật file, hỗ trợ xuất thêm định dạng khi cần.', 'content'],
            ['process_label', 'Quy trình', 'content'],
            ['process_title', '5 bước *làm việc chung*', 'content'],
            ['process1_title', 'Trao đổi & báo giá', 'content'], ['process1_text', 'Gửi brief, tài liệu tham khảo — nhận báo giá và timeline dự kiến trong 24-48h.', 'content'], ['process1_time', '1–2 ngày', 'content'],
            ['process2_title', 'Ký hợp đồng & đặt cọc', 'content'], ['process2_text', 'Xác nhận phạm vi công việc, đặt cọc 50% để bắt đầu lên lịch sản xuất.', 'content'], ['process2_time', '1 ngày', 'content'],
            ['process3_title', 'Sketch & duyệt concept', 'content'], ['process3_text', 'Gửi bản phác thảo để bạn góp ý trước khi đi vào vẽ màu chi tiết.', 'content'], ['process3_time', 'Tùy gói', 'content'],
            ['process4_title', 'Vẽ màu & hoàn thiện', 'content'], ['process4_text', 'Hoàn thiện theo bảng màu đã duyệt, tối đa 2–3 vòng chỉnh sửa tùy gói.', 'content'], ['process4_time', 'Tùy gói', 'content'],
            ['process5_title', 'Bàn giao & thanh toán', 'content'], ['process5_text', 'Gửi file final đầy đủ định dạng, thanh toán 50% còn lại và hỗ trợ sau bàn giao.', 'content'], ['process5_time', '1 ngày', 'content'],
            ['pricing_label', 'Bảng giá', 'content'],
            ['pricing_title', 'Chọn gói *phù hợp với bạn*', 'content'],
            ['pricing_sub', 'Giá tham khảo — báo giá chính xác phụ thuộc độ phức tạp và số lượng cụ thể của từng dự án.', 'content'],
            ['faq_label', 'Câu hỏi thường gặp', 'content'],
            ['faq_title', 'Trước khi *bắt đầu dự án*', 'content'],
            ['services_cta_title', 'Vẫn chưa chắc nên chọn gói nào?', 'content'],
            ['services_cta_text', 'Gửi mình ý tưởng và ngân sách dự kiến — mình sẽ tư vấn gói phù hợp nhất.', 'content'],

            // ── Nội dung — Trang Về tôi ──
            ['about_hero_title', 'Xin chào, mình là *Lam Trúc*', 'content'],
            ['about_hero_sub', 'Họa sĩ minh họa tự do sống và làm việc tại Hà Nội — 8 năm gắn bó với character design, sách tranh thiếu nhi và editorial illustration.', 'content'],
            ['about_bio_label', 'Xin chào', 'content'],
            ['about_bio_title', 'Một người kể chuyện bằng tranh', 'content'],
            ['about_bio_text1', 'Mình tốt nghiệp chuyên ngành Đồ họa tại một trường Mỹ thuật Công nghiệp năm 2016, và mất khoảng 2 năm "đi lạc" giữa thiết kế thương hiệu trước khi nhận ra điều mình thật sự muốn làm: vẽ nhân vật và kể chuyện cho trẻ em.', 'content'],
            ['about_bio_text2', 'Từ 2019 đến nay, mình tập trung gần như toàn thời gian vào hai mảng — minh họa sách tranh thiếu nhi cho các nhà xuất bản, và editorial illustration cho những tòa soạn cần một hình ảnh "biết ẩn dụ" thay vì một tấm ảnh chụp thông thường.', 'content'],
            ['about_bio_image', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=700&q=80&auto=format&fit=crop', 'content'],
            ['timeline_label', 'Hành trình', 'content'],
            ['timeline_title', '8 năm *làm nghề*', 'content'],
            ['timeline1_year', '2016', 'content'], ['timeline1_title', 'Tốt nghiệp chuyên ngành Đồ họa', 'content'], ['timeline1_text', 'Tốt nghiệp Mỹ thuật Công nghiệp, bắt đầu đi làm thiết kế thương hiệu toàn thời gian.', 'content'],
            ['timeline2_year', '2017', 'content'], ['timeline2_title', 'Dự án minh họa freelance đầu tiên', 'content'], ['timeline2_text', 'Nhận vẽ minh họa cho một tạp chí sinh viên — bắt đầu nhận ra mình thích vẽ hơn thiết kế logo.', 'content'],
            ['timeline3_year', '2019', 'content'], ['timeline3_title', 'Xuất bản cuốn sách tranh đầu tay', 'content'], ['timeline3_text', 'Ra mắt [Tên sách đầu tay] — cuốn sách tranh đầu tiên mình vừa viết vừa minh họa toàn bộ.', 'content'],
            ['timeline4_year', '2021', 'content'], ['timeline4_title', 'Chuyển hẳn sang character design cho sách thiếu nhi', 'content'], ['timeline4_text', 'Ngừng nhận dự án thiết kế thương hiệu, tập trung 100% vào minh họa sách tranh và character design.', 'content'],
            ['timeline5_year', '2023', 'content'], ['timeline5_title', 'Hợp tác dài hạn cùng lúc với 3 nhà xuất bản', 'content'], ['timeline5_text', 'Ký hợp đồng minh họa định kỳ với 3 NXB, mỗi năm nhận 4–6 đầu sách mới.', 'content'],
            ['timeline6_year', '2025', 'content'], ['timeline6_title', 'Mở rộng nhận dự án editorial quốc tế', 'content'], ['timeline6_text', 'Bắt đầu nhận thêm các dự án editorial illustration từ khách hàng nước ngoài qua Behance.', 'content'],
            ['style_label', 'Phong cách', 'content'],
            ['style_title', 'Ấm áp, gần gũi, nhưng không "ngọt" quá mức', 'content'],
            ['style_text1', 'Mình theo đuổi nét vẽ tay được số hóa, giữ lại sự "lệch" tự nhiên của đường nét thay vì làm phẳng hoàn toàn. Bảng màu chủ đạo là pastel-earthy — ấm nhưng không chói, chịu ảnh hưởng nhiều từ minh họa sách thiếu nhi Bắc Âu và tranh dân gian Việt Nam.', 'content'],
            ['style_text2', 'Với mình, một nhân vật đẹp không nhất thiết phải hoàn hảo — nó cần có "linh hồn" đủ để một đứa trẻ 5 tuổi nhớ được sau khi gấp sách lại.', 'content'],
            ['style_image', 'https://images.unsplash.com/photo-1596496181848-3091d4878b24?w=700&q=80&auto=format&fit=crop', 'content'],
            ['tools_label', 'Công cụ', 'content'],
            ['tools_title', 'Từ bút chì 2B đến Procreate', 'content'],
            ['tools_text1', 'Mọi dự án đều bắt đầu bằng phác thảo tay bằng bút chì 2B trên giấy — mình tin bố cục và cảm xúc nhân vật "ra" tốt nhất khi chưa bị công cụ số chi phối. Sau khi chốt thumbnail, mình số hóa và vẽ màu hoàn thiện trên Procreate (iPad).', 'content'],
            ['tools_text2', 'Với các dự án cần bộ nhận diện nhân vật dùng lâu dài (app, merchandise), mình dựng thêm bản vector trên Adobe Illustrator và chỉnh màu cuối trên Photoshop.', 'content'],
            ['tools_image', 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=700&q=80&auto=format&fit=crop', 'content'],
            ['about_testi_label', 'Nhận xét', 'content'],
            ['about_testi_title', 'Khách hàng & đối tác *đã hợp tác*', 'content'],
            ['about_cta_title', 'Muốn làm việc cùng nhau?', 'content'],
            ['about_cta_text', 'Mình luôn sẵn sàng nghe về dự án tiếp theo của bạn.', 'content'],

            // ── Nội dung — Trang Liên hệ ──
            ['contact_hero_title', 'Kể mình nghe *ý tưởng của bạn*', 'content'],
            ['contact_hero_sub', 'Điền thông tin dự án bên dưới, hoặc liên hệ trực tiếp qua email/Zalo — mình phản hồi trong vòng 24-48h.', 'content'],

            // ── Pháp lý ──
            ['legal_updated', '20/08/2026', 'legal'],
            ['privacy_content', "<h2>1. Thông tin chúng tôi thu thập</h2><ul><li>Họ tên, email, số điện thoại khi bạn điền form liên hệ</li><li>Nội dung mô tả dự án, ngân sách dự kiến bạn cung cấp</li><li>Thông tin trao đổi qua email hoặc Zalo trong quá trình làm việc</li></ul><h2>2. Mục đích sử dụng thông tin</h2><ul><li>Phản hồi yêu cầu tư vấn và báo giá dự án</li><li>Trao đổi tiến độ, gửi bản nháp và file bàn giao dự án</li><li>Xuất hóa đơn, hợp đồng khi dự án được xác nhận</li></ul><h2>3. Chia sẻ thông tin với bên thứ ba</h2><p>Chúng tôi không bán, cho thuê hay chia sẻ thông tin cá nhân của bạn cho bên thứ ba vì mục đích quảng cáo. Thông tin chỉ được chia sẻ khi có yêu cầu pháp lý hợp lệ từ cơ quan chức năng.</p><h2>4. Bảo mật dữ liệu</h2><p>Thông tin liên hệ và tài liệu dự án được lưu trữ trên các nền tảng có xác thực (email, dịch vụ lưu trữ file có mật khẩu). Chúng tôi áp dụng các biện pháp hợp lý để ngăn chặn truy cập trái phép.</p><h2>5. Quyền của bạn</h2><p>Bạn có quyền yêu cầu chúng tôi cung cấp, chỉnh sửa hoặc xóa thông tin cá nhân đã cung cấp bất kỳ lúc nào bằng cách liên hệ qua email.</p><h2>6. Thay đổi chính sách</h2><p>Chính sách này có thể được cập nhật theo thời gian. Mọi thay đổi sẽ được đăng tải trên trang này kèm ngày cập nhật mới nhất.</p><h2>7. Liên hệ</h2><p>Nếu có bất kỳ câu hỏi nào về chính sách bảo mật, vui lòng liên hệ qua email hoặc số điện thoại tại trang Liên hệ.</p>", 'legal'],
            ['terms_content', "<h2>1. Phạm vi dịch vụ</h2><p>Chúng tôi cung cấp dịch vụ minh họa gồm: character design, minh họa sách tranh thiếu nhi và editorial illustration cho tạp chí, theo các gói dịch vụ được mô tả tại trang Dịch vụ. Phạm vi công việc cụ thể được thống nhất bằng văn bản (email hoặc hợp đồng) trước khi bắt đầu sản xuất.</p><h2>2. Báo giá & thanh toán</h2><ul><li>Báo giá được lập dựa trên brief cụ thể của khách hàng, có hiệu lực trong 14 ngày kể từ ngày gửi</li><li>Đặt cọc 50% giá trị hợp đồng trước khi bắt đầu sản xuất, thanh toán 50% còn lại khi bàn giao file final</li><li>Dự án bị hủy sau khi đã đặt cọc: tiền cọc không hoàn lại cho phần công việc đã thực hiện</li></ul><h2>3. Số vòng chỉnh sửa</h2><p>Mỗi gói dịch vụ đi kèm số vòng chỉnh sửa cụ thể (2–3 vòng tùy gói, xem chi tiết tại trang Dịch vụ). Yêu cầu chỉnh sửa vượt số vòng đã bao gồm sẽ được báo giá bổ sung theo giờ trước khi thực hiện.</p><h2>4. Quyền sở hữu & sử dụng tác phẩm</h2><ul><li>Lam Trúc giữ bản quyền tác giả đối với mọi tác phẩm minh họa theo Luật Sở hữu trí tuệ Việt Nam</li><li>Khách hàng được cấp quyền sử dụng theo phạm vi đã thỏa thuận trong hợp đồng (1 lần đăng, hoặc toàn phần tùy gói)</li><li>Lam Trúc có quyền đăng tải tác phẩm vào portfolio cá nhân, trừ khi khách hàng yêu cầu bảo mật bằng văn bản</li></ul><h2>5. Thời gian thực hiện</h2><p>Timeline dự án được thống nhất trước khi ký hợp đồng. Trường hợp khách hàng phản hồi chậm quá 7 ngày ở bất kỳ giai đoạn nào, timeline bàn giao sẽ được điều chỉnh tương ứng.</p><h2>6. Trách nhiệm khách hàng</h2><p>Khách hàng chịu trách nhiệm cung cấp brief, tài liệu tham khảo và phản hồi góp ý đầy đủ, chính xác trong quá trình hợp tác để đảm bảo tiến độ dự án.</p><h2>7. Thay đổi điều khoản</h2><p>Điều khoản này có thể được cập nhật theo thời gian. Phiên bản mới nhất luôn được đăng tải tại trang này.</p><h2>8. Liên hệ</h2><p>Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ qua email hello@lamtruc-illustration.vn.</p>", 'legal'],

            // ── SMTP ──
            ['smtp_host', '', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from_name', 'Lam Trúc Illustration', 'smtp'],
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

    // ─── Hero Slides ─────────────────────────────────────────────────────────
    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        // subtitle format: "tag||desc||primaryBtnText||primaryBtnLink" — button_text/button_link (core columns)
        // dùng cho nút OUTLINE (nút thứ 2), vì template mỗi slide có 2 nút khác nhau (primary + outline).
        $slides = [
            [
                'title' => 'Nhân vật bước ra *từ trang sách*',
                'subtitle' => "Character Design||Mình là Lam Trúc — họa sĩ minh họa tự do, chuyên thiết kế nhân vật và minh họa sách tranh thiếu nhi cho các nhà xuất bản trong nước.||Xem dự án||/du-an",
                'button_text' => 'Đặt lịch tư vấn',
                'button_link' => '/lien-he',
                'image' => 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=700&q=80&auto=format&fit=crop',
                'sort_order' => 1,
            ],
            [
                'title' => 'Kể chuyện bằng *từng nét màu*',
                'subtitle' => "Book Illustration||Từ sketch tay đến tô màu digital — mỗi trang sách là một hành trình xây dựng thế giới riêng cho từng câu chuyện nhỏ.||Case study sách tranh||/du-an-chi-tiet-1",
                'button_text' => 'Xem bảng giá',
                'button_link' => '/dich-vu',
                'image' => 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=700&q=80&auto=format&fit=crop',
                'sort_order' => 2,
            ],
            [
                'title' => 'Một góc nhìn *cho trang tạp chí*',
                'subtitle' => "Editorial Art||Hợp tác dài hạn với các tòa soạn — minh họa editorial cho chuyên đề, bìa số đặc biệt và bài viết cần một hình ảnh biết kể chuyện.||Case study tạp chí||/du-an-chi-tiet-2",
                'button_text' => 'Toàn bộ dự án',
                'button_link' => '/du-an',
                'image' => 'https://images.unsplash.com/photo-1499892477393-f675706cbe6e?w=700&q=80&auto=format&fit=crop',
                'sort_order' => 3,
            ],
            [
                'title' => '8 năm vẽ nên *những câu chuyện*',
                'subtitle' => "Studio Lam Trúc||120+ dự án, 15 đầu sách đã xuất bản, hơn 20 tòa soạn đã hợp tác. Luôn còn chỗ cho một câu chuyện mới của bạn.||Về Lam Trúc||/ve-toi",
                'button_text' => 'Liên hệ ngay',
                'button_link' => '/lien-he',
                'image' => 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=700&q=80&auto=format&fit=crop',
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

    // ─── Projects (case study minh họa) ─────────────────────────────────────
    private function seedProjects(): void {
        if ($this->scalar("SELECT COUNT(*) FROM projects") > 0) return;

        $challenge1 = "[Nhà xuất bản Sách Thiếu Nhi] tìm đến mình với một bản thảo chưa có hình ảnh: câu chuyện về Bống — bé gái 6 tuổi tự khám phá khu vườn sau nhà và làm quen với những \"người bạn\" nhỏ bé sống ở đó. Yêu cầu ban đầu khá cụ thể: nhân vật phải dễ thương, gần gũi với trẻ mầm non nhưng không quá \"trẻ con\" đến mức phụ huynh thấy nhàm; đồng thời thiết kế phải đủ đơn giản để có thể tái sử dụng làm merchandise (sticker, vở, túi vải) sau khi sách phát hành.\n\nCái khó nằm ở thời gian: chỉ 10 tuần cho toàn bộ 34 illustration, trong khi bảng màu bắt buộc phải tươi sáng nhưng vẫn lên đúng tông khi in offset 4 màu chi phí thấp — một giới hạn kỹ thuật cần tính toán ngay từ bước phác thảo màu, không thể để đến khi in mới phát hiện lệch tông.";

        $process1 = implode("\n", [
            'Thumbnail sketch toàn bộ 34 trang|Phác thảo bố cục nhanh cho cả cuốn sách trong 1 tuần đầu, xác định nhịp kể chuyện trước khi đi sâu vào từng nhân vật.',
            'Character sheet cho Bống & 3 nhân vật phụ|3 vòng feedback với biên tập viên để chốt tạo hình — từ tỉ lệ đầu/thân đến bảng biểu cảm khuôn mặt.',
            'Line art chi tiết từng trang|Vẽ line cho toàn bộ 34 trang dựa trên thumbnail đã duyệt, giữ nhất quán tỉ lệ nhân vật xuyên suốt.',
            'Tô màu digital theo bảng màu đã test in thử|Vẽ màu trên Procreate với bảng màu đã được test in offset trước, tránh sai lệch tông khi lên bản in thật.',
            'Final export & chỉnh sửa theo layout dàn trang|Phối hợp với bộ phận dàn trang để canh khoảng trống chữ, xuất file theo đúng chuẩn in ấn của nhà xuất bản.',
        ]);

        $gallery1 = implode("\n", [
            'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=700&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1596496181848-3091d4878b24?w=700&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1583468982228-19f19164aee2?w=700&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&q=80&auto=format&fit=crop',
        ]);

        $challenge2 = "Ban biên tập [Tạp chí Con & Mẹ] cần minh họa cho một chuyên đề đặc biệt về giáo dục cảm xúc trẻ em — chủ đề khá trừu tượng: làm sao vẽ được \"sự giận dữ\", \"nỗi sợ hãi\" hay \"niềm vui\" của một đứa trẻ mà không biến chúng thành hình ảnh đáng sợ hoặc quá trẻ con. Yêu cầu là phong cách phải gần gũi, ấm áp, phù hợp để phụ huynh đọc cùng con.\n\nThời gian là thách thức lớn nhất: chỉ 3 tuần cho 8 tranh minh họa và 1 bìa, trong khi phải làm việc song song với 2 cây viết khác nhau — nội dung một số bài chưa chốt hoàn toàn ở thời điểm bắt đầu vẽ, buộc phải vừa phác thảo ý tưởng vừa theo sát bản thảo cập nhật liên tục từ tòa soạn.";

        $process2 = implode("\n", [
            'Nhận outline bài viết từ 2 cây viết|Đọc nhanh outline từng bài để nắm ý chính, chủ động hỏi lại những đoạn nội dung chưa rõ ẩn dụ hình ảnh.',
            'Sketch ý tưởng ẩn dụ cho từng cảm xúc|Mỗi cảm xúc gắn với một hình ảnh cụ thể — ví dụ "giận dữ" là một đám mây nhỏ đang mưa trong lồng ngực nhân vật, thay vì gương mặt cau có.',
            'Chọn bảng màu theo mood từng bài|Từng minh họa có bảng màu riêng phù hợp sắc thái bài viết, nhưng vẫn giữ nhất quán tổng thể chuyên đề.',
            'Làm việc trực tiếp với art director|Canh bố cục chừa khoảng trống cho tiêu đề, pull-quote và số trang ngay trong file minh họa gốc.',
        ]);

        $gallery2 = implode("\n", [
            'https://images.unsplash.com/photo-1499892477393-f675706cbe6e?w=1200&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=700&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1596496181848-3091d4878b24?w=700&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=700&q=80&auto=format&fit=crop',
        ]);

        $projects = [
            // ── 2 project có đầy đủ case study ──
            ['title'=>'Chuyến Phiêu Lưu Của Bống','slug'=>'chuyen-phieu-luu-cua-bong','category'=>'Sách thiếu nhi',
             'description'=>'Character design & minh họa trọn bộ 34 tranh cho một cuốn sách tranh thiếu nhi kể về hành trình khám phá khu vườn sau nhà của bé Bống.',
             'image'=>'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=700&q=80&auto=format&fit=crop','year'=>'2025',
             'client_name'=>'[Nhà xuất bản Sách Thiếu Nhi]','role_text'=>'Character Design + Illustration',
             'publication_type'=>'Sách tranh 32 trang, khổ 21×21cm','duration'=>'10 tuần','illustration_count'=>'34 tranh + bìa',
             'challenge'=>$challenge1,'process_heading'=>'Quy trình *sáng tác*','process_steps'=>$process1,
             'gallery_images'=>$gallery1,
             'result_summary'=>'Toàn bộ 34 illustration hoàn thành đúng hạn 10 tuần, không trễ deadline in. Sách phát hành với 5.000 bản in đầu tiên, tái bản lần 2 chỉ sau 4 tháng. Nhân vật Bống sau đó được nhà xuất bản dùng làm mascot cho fanpage giáo dục của họ.',
             'result_stats'=>"34||Illustration hoàn thành đúng hạn\n5000|+|Bản in đầu phát hành\n4| tháng|Đến khi tái bản lần 2",
             'testimonial_content'=>'Lam Trúc nắm bắt tinh thần nhân vật cực nhanh — chỉ sau 2 vòng phác thảo là chốt được hình ảnh Bống mà cả ban biên tập đều thích. Deadline gấp nhưng chưa từng phải nhắc tiến độ.',
             'testimonial_author'=>'[Tên Biên tập viên]','testimonial_role'=>'Biên tập viên, [Nhà xuất bản Sách Thiếu Nhi]',
             'testimonial_avatar'=>'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80&auto=format&fit=crop',
             'featured'=>1,'sort_order'=>1],

            ['title'=>'Chuyên Đề Giáo Dục Cảm Xúc','slug'=>'chuyen-de-giao-duc-cam-xuc','category'=>'Editorial',
             'description'=>'8 minh họa editorial + 1 bìa chuyên đề, ẩn dụ hóa các trạng thái cảm xúc trẻ em cho một số đặc biệt của tạp chí gia đình.',
             'image'=>'https://images.unsplash.com/photo-1596496181848-3091d4878b24?w=700&q=80&auto=format&fit=crop','year'=>'2024',
             'client_name'=>'[Tạp chí Con & Mẹ]','role_text'=>'Editorial Illustration',
             'publication_type'=>'Chuyên đề 12 trang, in + bản online','duration'=>'3 tuần','illustration_count'=>'8 tranh + 1 bìa chuyên đề',
             'challenge'=>$challenge2,'process_heading'=>'Cách *tiếp cận*','process_steps'=>$process2,
             'gallery_images'=>$gallery2,
             'result_summary'=>'Chuyên đề bán hết 8.000 bản in trong tuần đầu phát hành. Bài viết kèm minh họa có lượng chia sẻ online cao nhất chuyên mục tháng đó, và ban biên tập đã mời hợp tác dài hạn thêm 6 số tiếp theo ngay sau khi chuyên đề ra mắt.',
             'result_stats'=>"8000|+|Bản in bán hết tuần đầu\n1||Chuyên mục có lượt chia sẻ cao nhất tháng\n6| số|Được mời hợp tác tiếp theo",
             'testimonial_content'=>'Deadline gấp 3 tuần cho cả chuyên đề nhưng chất lượng minh họa vẫn giữ nguyên độ chi tiết, không hề vội vàng. Đó là lý do chúng tôi mời hợp tác thêm 6 số tiếp theo.',
             'testimonial_author'=>'[Tên Art Director]','testimonial_role'=>'Art Director, [Tạp chí Con & Mẹ]',
             'testimonial_avatar'=>'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80&auto=format&fit=crop',
             'featured'=>1,'sort_order'=>2],

            // ── 10 project card-only (không có case study đầy đủ) ──
            ['title'=>'Rừng Xanh Kể Chuyện','slug'=>'rung-xanh-ke-chuyen','category'=>'Sách thiếu nhi',
             'description'=>'Bộ nhân vật động vật rừng xanh cho một cuốn sách giáo dục về bảo vệ môi trường dành cho học sinh tiểu học.',
             'image'=>'https://images.unsplash.com/photo-1583468982228-19f19164aee2?w=600&q=80&auto=format&fit=crop','year'=>'2024','featured'=>1,'sort_order'=>3],

            ['title'=>'Thành Phố Không Ngủ','slug'=>'thanh-pho-khong-ngu','category'=>'Editorial',
             'description'=>'Minh họa bìa cho số đặc biệt về nhịp sống đô thị về đêm của một tạp chí văn hóa.',
             'image'=>'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&q=80&auto=format&fit=crop','year'=>'2023','featured'=>1,'sort_order'=>4],

            ['title'=>'Đứa Trẻ Và Vầng Trăng','slug'=>'dua-tre-va-vang-trang','category'=>'Sách thiếu nhi',
             'description'=>'Câu chuyện cổ tích hiện đại về một đứa trẻ đi tìm vầng trăng bị lạc mất, minh họa toàn bộ 28 trang.',
             'image'=>'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80&auto=format&fit=crop','year'=>'2023','sort_order'=>5],

            ['title'=>'Cô Bé Quàng Khăn Đỏ (Bản Mới)','slug'=>'co-be-quang-khan-do-ban-moi','category'=>'Sách thiếu nhi',
             'description'=>'Phiên bản minh họa lại truyện cổ tích kinh điển với tạo hình nhân vật gần gũi trẻ em Việt Nam.',
             'image'=>'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=600&q=80&auto=format&fit=crop','year'=>'2022','sort_order'=>6],

            ['title'=>'Hành Trình Của Sóc Nâu','slug'=>'hanh-trinh-cua-soc-nau','category'=>'Character Design',
             'description'=>'Series nhân vật chú sóc nâu phiêu lưu qua bốn mùa, dùng cho bộ sách giáo dục kỹ năng sống.',
             'image'=>'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=600&q=80&auto=format&fit=crop','year'=>'2022','sort_order'=>7],

            ['title'=>'Ẩm Thực Việt Qua Nét Vẽ','slug'=>'am-thuc-viet-qua-net-ve','category'=>'Editorial',
             'description'=>'Series minh họa các món ăn truyền thống Việt Nam cho chuyên mục ẩm thực dài kỳ của một tạp chí.',
             'image'=>'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80&auto=format&fit=crop','year'=>'2022','sort_order'=>8],

            ['title'=>'Vương Quốc Của Những Đám Mây','slug'=>'vuong-quoc-cua-nhung-dam-may','category'=>'Sách thiếu nhi',
             'description'=>'Thế giới tưởng tượng trên những đám mây, minh họa cho một câu chuyện về ước mơ bay cao của trẻ nhỏ.',
             'image'=>'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&q=80&auto=format&fit=crop','year'=>'2021','sort_order'=>9],

            ['title'=>'Bộ Nhân Vật Trường Học Vui Vẻ','slug'=>'bo-nhan-vat-truong-hoc-vui-ve','category'=>'Character Design',
             'description'=>'Bộ nhân vật thiết kế riêng cho một ứng dụng học tiếng Anh dành cho trẻ em tiểu học.',
             'image'=>'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=600&q=80&auto=format&fit=crop','year'=>'2021','sort_order'=>10],

            ['title'=>'Đại Dương Bí Ẩn','slug'=>'dai-duong-bi-an','category'=>'Sách thiếu nhi',
             'description'=>'Hành trình khám phá đáy đại dương cùng những sinh vật biển kỳ lạ, minh họa cho sách giáo dục thiếu nhi.',
             'image'=>'https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?w=600&q=80&auto=format&fit=crop','year'=>'2020','sort_order'=>11],

            ['title'=>'Chuyên Đề Mùa Thu Yêu Thương','slug'=>'chuyen-de-mua-thu-yeu-thuong','category'=>'Editorial',
             'description'=>'Minh họa bìa ấm áp cho chuyên đề mùa thu của một tạp chí gia đình.',
             'image'=>'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=600&q=80&auto=format&fit=crop','year'=>'2020','sort_order'=>12],
        ];

        foreach ($projects as $p) {
            $this->execute(
                "INSERT INTO projects (title, slug, category, description, image, year, client_name, role_text, publication_type, duration, illustration_count, challenge, process_heading, process_steps, gallery_images, result_summary, result_stats, testimonial_content, testimonial_author, testimonial_role, testimonial_avatar, featured, sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [
                    $p['title'], $p['slug'], $p['category'], $p['description'], $p['image'], $p['year'] ?? '',
                    $p['client_name'] ?? '', $p['role_text'] ?? '', $p['publication_type'] ?? '', $p['duration'] ?? '', $p['illustration_count'] ?? '',
                    $p['challenge'] ?? '', $p['process_heading'] ?? '', $p['process_steps'] ?? '',
                    $p['gallery_images'] ?? '', $p['result_summary'] ?? '', $p['result_stats'] ?? '',
                    $p['testimonial_content'] ?? '', $p['testimonial_author'] ?? '', $p['testimonial_role'] ?? '', $p['testimonial_avatar'] ?? '',
                    $p['featured'] ?? 0, $p['sort_order'] ?? 0,
                ]
            );
        }
    }

    // ─── Testimonials (ve-toi.html — 4 mục, tên là placeholder ngoặc vuông ĐÚNG như template gốc) ──
    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $items = [
            ['author_name'=>'[Tên Biên tập viên]','author_title'=>'[Nhà xuất bản Sách Thiếu Nhi]',
             'author_avatar'=>'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80&auto=format&fit=crop',
             'content'=>'"Lam Trúc nắm bắt tinh thần nhân vật cực nhanh — chỉ sau 2 vòng phác thảo là chốt được hình ảnh mà cả ban biên tập đều thích."',
             'sort_order'=>1],
            ['author_name'=>'[Tên Art Director]','author_title'=>'[Tạp chí Con & Mẹ]',
             'author_avatar'=>'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80&auto=format&fit=crop',
             'content'=>'"Deadline gấp 3 tuần nhưng chất lượng minh họa vẫn giữ nguyên độ chi tiết. Đã mời hợp tác thêm 6 số tiếp theo."',
             'sort_order'=>2],
            ['author_name'=>'[Tên Chủ biên]','author_title'=>'[NXB Giáo dục & Kỹ năng]',
             'author_avatar'=>'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80&auto=format&fit=crop',
             'content'=>'"Phong cách màu ấm, gần gũi mà vẫn giữ được nét riêng — đúng thứ chúng tôi cần cho một bộ sách giáo dục dài kỳ."',
             'sort_order'=>3],
            ['author_name'=>'[Tên Quản lý dự án]','author_title'=>'[App học tiếng Anh cho trẻ em]',
             'author_avatar'=>'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80&auto=format&fit=crop',
             'content'=>'"Giao tiếp rõ ràng, luôn cập nhật tiến độ chủ động — hiếm khi gặp một freelancer chỉn chu như vậy."',
             'sort_order'=>4],
        ];
        foreach ($items as $t) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order) VALUES (?,?,?,?,?,?)",
                [$t['author_name'], $t['author_title'], $t['author_avatar'], $t['content'], 5, $t['sort_order']]
            );
        }
    }

    // ─── FAQ (dich-vu.html — 7 câu) ──────────────────────────────────────────
    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $items = [
            ['q'=>'Giá minh họa được tính như thế nào?','a'=>'Giá phụ thuộc vào số lượng tranh, độ phức tạp của nhân vật/bối cảnh (đơn giản, chi tiết, nhiều nhân vật trong 1 khung) và mục đích sử dụng — cá nhân, thương mại hay xuất bản. Mình luôn báo giá cụ thể sau khi trao đổi brief chi tiết, không báo giá chung chung qua tin nhắn ngắn.'],
            ['q'=>'Quy trình làm việc gồm những bước nào?','a'=>'5 bước: trao đổi & báo giá → ký hợp đồng & đặt cọc 50% → sketch & duyệt concept → vẽ màu & hoàn thiện → bàn giao file & thanh toán phần còn lại. Chi tiết xem mục "Quy trình" phía trên.'],
            ['q'=>'Thời gian hoàn thành một dự án là bao lâu?','a'=>'Tùy quy mô: minh họa đơn 5–7 ngày làm việc, bộ nhân vật 3–4 tuần, sách tranh trọn bộ 8–12 tuần tùy số trang. Timeline chính xác sẽ chốt cùng báo giá.'],
            ['q'=>'Tôi được chỉnh sửa bao nhiêu vòng?','a'=>'2 vòng cho gói Minh Họa Đơn, 3 vòng cho gói Bộ Nhân Vật và Trọn Dự Án Sách — đã tính trong báo giá ban đầu. Chỉnh sửa vượt số vòng sẽ tính phí bổ sung theo giờ, báo trước khi thực hiện.'],
            ['q'=>'Sau khi hoàn thành, tôi có toàn quyền sử dụng thương mại không?','a'=>'Tùy gói: Gói Minh Họa Đơn cấp quyền sử dụng cho 1 lần đăng/xuất bản cụ thể. Gói Bộ Nhân Vật và Trọn Dự Án Sách cấp quyền sử dụng thương mại toàn phần kèm file nguồn, ghi rõ trong hợp đồng trước khi bắt đầu.'],
            ['q'=>'Hình thức thanh toán như thế nào?','a'=>'Đặt cọc 50% trước khi bắt đầu sản xuất, 50% còn lại thanh toán khi bàn giao file final. Nhận chuyển khoản ngân hàng, thông tin gửi kèm hợp đồng.'],
            ['q'=>'Có thể nhận dự án gấp (rush) không?','a'=>'Có, tùy lịch làm việc hiện tại. Dự án rush sẽ phụ thu 30–50% trên báo giá gốc tùy mức độ gấp, cần xác nhận khả năng nhận trước khi ký hợp đồng.'],
        ];
        foreach ($items as $i => $f) {
            $this->execute(
                "INSERT INTO faqs (question, answer, page, sort_order) VALUES (?, ?, 'dich-vu', ?)",
                [$f['q'], $f['a'], $i + 1]
            );
        }
    }

    // ─── Pricing plans (dich-vu.html — 3 gói) ──────────────────────────────
    private function seedPricingPlans(): void {
        if ($this->scalar("SELECT COUNT(*) FROM pricing_plans") > 0) return;
        $plans = [
            ['name'=>'Gói Minh Họa Đơn','description'=>'1 tranh minh họa độc lập, phù hợp spot illustration hoặc bìa số báo','price'=>'1.5tr – 3.5tr₫','unit'=>'/ tranh minh họa',
             'features'=>"1 tranh minh họa độc lập (spot illustration, bìa số báo...)\n1 concept sketch trước khi vẽ màu\n2 vòng chỉnh sửa\nFile JPG + PNG độ phân giải in ấn\nGiao trong 5–7 ngày làm việc\nQuyền sử dụng thương mại 1 lần đăng",
             'is_featured'=>0,'sort_order'=>1],
            ['name'=>'Gói Bộ Nhân Vật','description'=>'Character design 3–5 nhân vật kèm character sheet đầy đủ','price'=>'6tr – 12tr₫','unit'=>'/ bộ 3–5 nhân vật',
             'features'=>"Character design 3–5 nhân vật\nCharacter sheet 3 góc nhìn + bảng biểu cảm\nStyle guide màu sắc đi kèm\n3 vòng chỉnh sửa\nFile nguồn AI/PSD\nGiao trong 3–4 tuần\nQuyền sử dụng thương mại toàn phần",
             'is_featured'=>1,'sort_order'=>2],
            ['name'=>'Gói Trọn Dự Án Sách','description'=>'Minh họa trọn bộ một cuốn sách tranh thiếu nhi 20–40 trang','price'=>'Từ 25tr₫','unit'=>'/ dự án 20–40 trang',
             'features'=>"Character design đầy đủ cho toàn bộ nhân vật\nMinh họa trọn bộ trang sách\nPhối hợp trực tiếp cùng NXB trong dàn trang\n3 vòng chỉnh sửa mỗi giai đoạn\nFile chuẩn in ấn theo yêu cầu NXB\nHỗ trợ khi tái bản\nGiao trong 8–12 tuần",
             'is_featured'=>0,'sort_order'=>3],
        ];
        foreach ($plans as $pl) {
            $this->execute(
                "INSERT INTO pricing_plans (name, description, price, unit, features, is_featured, badge_text, cta_text, cta_link, sort_order) VALUES (?,?,?,?,?,?,'Phổ biến nhất','Chọn gói này','/lien-he',?)",
                [$pl['name'], $pl['description'], $pl['price'], $pl['unit'], $pl['features'], $pl['is_featured'], $pl['sort_order']]
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
