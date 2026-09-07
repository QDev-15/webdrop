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
        $this->seedCategories();
        $this->seedPosts();
        $this->seedTestimonials();
        $this->seedFaqs();
    }

    // ─── Users ───────────────────────────────────────────────────────────────
    private function seedUsers(): void {
        if ($this->scalar("SELECT COUNT(*) FROM users") > 0) return;
        $this->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['Admin', 'sysadmin@admin.com', password_hash('123456', PASSWORD_BCRYPT), 'superadmin']
        );
    }

    // ─── Settings ────────────────────────────────────────────────────────────
    private function seedSettings(): void {
        if ($this->scalar("SELECT COUNT(*) FROM settings") > 0) return;
        $settings = [
            // ── Thông tin chung ──
            ['site_name', 'Cỏ Non Blog', 'general'],
            ['site_tagline', 'Nhật ký nuôi con từ trái tim một người mẹ', 'general'],
            ['site_description', 'Cỏ Non — blog cá nhân của mẹ Hạ Vy chia sẻ nhật ký nuôi con, kinh nghiệm chăm sóc trẻ sơ sinh, dinh dưỡng ăn dặm, giáo dục sớm và những câu chuyện chân thật của một người mẹ hai con.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hoptac@conon.blog', 'general'],
            ['site_phone', '0912 345 678', 'general'],
            ['site_address', '[Số nhà, tên đường], Hà Nội', 'general'],

            // ── SEO ──
            ['meta_title', 'Cỏ Non — Nhật Ký Nuôi Con Từ Trái Tim Một Người Mẹ', 'seo'],
            ['meta_description', 'Cỏ Non — blog cá nhân của mẹ Hạ Vy chia sẻ nhật ký nuôi con, kinh nghiệm chăm sóc trẻ sơ sinh, dinh dưỡng ăn dặm, giáo dục sớm và những câu chuyện chân thật của một người mẹ hai con.', 'seo'],
            ['meta_keywords', 'nuôi con, chăm sóc trẻ sơ sinh, ăn dặm, giáo dục sớm, mẹ và bé, nhật ký làm mẹ', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1200&q=80&auto=format&fit=crop', 'seo'],

            // ── Mạng xã hội ──
            ['facebook', 'https://facebook.com', 'social'],
            ['instagram', 'https://instagram.com', 'social'],
            ['youtube', 'https://youtube.com', 'social'],
            ['zalo_phone', '0912345678', 'social'],
            ['fb_group_name', 'Cỏ Non — Hội mẹ bỉm chia sẻ thật', 'social'],
            ['fb_group_members', '12.000+ thành viên', 'social'],

            // ── Footer ──
            ['footer_description', 'Nhật ký nuôi con của mẹ Hạ Vy — chia sẻ thật, không áp lực, đồng hành cùng mẹ và bé qua từng giai đoạn.', 'footer'],
            ['footer_copyright', '© 2026 Cỏ Non Blog · Viết bằng cả trái tim tại Hà Nội 🇻🇳', 'footer'],

            // ── Liên hệ / Bản đồ ──
            ['map_embed', 'https://maps.google.com/maps?q=21.0285,105.8542&hl=vi&z=15&output=embed', 'contact'],

            // ── Nội dung — Trang chủ ──
            ['home_stat1_number', '5', 'content'], ['home_stat1_suffix', '+', 'content'], ['home_stat1_label', 'Năm viết blog', 'content'],
            ['home_stat2_number', '260', 'content'], ['home_stat2_suffix', '+', 'content'], ['home_stat2_label', 'Bài viết đã đăng', 'content'],
            ['home_stat3_number', '48', 'content'], ['home_stat3_suffix', 'K', 'content'], ['home_stat3_label', 'Độc giả mỗi tháng', 'content'],
            ['home_stat4_number', '12', 'content'], ['home_stat4_suffix', 'K', 'content'], ['home_stat4_label', 'Thành viên nhóm kín', 'content'],
            ['home_featured_label', '🌟 Bài viết nổi bật', 'content'],
            ['home_featured_title', 'Đang được đọc nhiều nhất *tuần này*', 'content'],
            ['home_latest_label', '📝 Mới đăng', 'content'],
            ['home_latest_title', 'Bài viết mới nhất từ *Cỏ Non*', 'content'],
            ['home_feat_label', '🍃 Vì sao đọc Cỏ Non', 'content'],
            ['home_feat_title', 'Một blog viết bằng *sự thật*, không phải công thức', 'content'],
            ['home_feat1_icon', '✍️', 'content'], ['home_feat1_title', 'Chia sẻ thật', 'content'], ['home_feat1_text', 'Không tô vẽ, chỉ kể lại đúng những gì mình đã trải qua cùng Kem và Sữa.', 'content'],
            ['home_feat2_icon', '🔬', 'content'], ['home_feat2_title', 'Có căn cứ khoa học', 'content'], ['home_feat2_text', 'Tham khảo tài liệu y khoa, tư vấn bác sĩ nhi khoa trước khi đăng bài.', 'content'],
            ['home_feat3_icon', '👩‍👩‍👧‍👦', 'content'], ['home_feat3_title', 'Cộng đồng đồng cảm', 'content'], ['home_feat3_text', 'Hơn 12.000 mẹ bỉm cùng chia sẻ, hỏi đáp trong nhóm kín mỗi ngày.', 'content'],
            ['home_feat4_icon', '📬', 'content'], ['home_feat4_title', 'Cập nhật đều đặn', 'content'], ['home_feat4_text', '2 bài viết mới mỗi tuần, đúng hẹn thứ Ba và thứ Sáu.', 'content'],
            ['home_popular_label', '🔥 Được đọc nhiều nhất', 'content'],
            ['home_popular_title', 'Mẹ nào cũng nên đọc *ít nhất một lần*', 'content'],
            ['home_faq_label', '❓ Câu hỏi thường gặp', 'content'],
            ['home_faq_title', 'Mọi điều bạn cần biết về *Cỏ Non*', 'content'],
            ['newsletter_title', '💌 Đừng bỏ lỡ bài viết mới', 'content'],
            ['newsletter_text', 'Mỗi Chủ nhật, một email tổng hợp bài viết trong tuần — không spam, hủy đăng ký bất cứ lúc nào.', 'content'],

            // ── Nội dung — Trang Chuyên mục ──
            ['category_hero_title', 'Mọi chủ đề mẹ và bé, *tất cả tại đây*', 'content'],
            ['category_hero_sub', 'Từ mang thai, sơ sinh đến giáo dục sớm — chọn chuyên mục bạn quan tâm hoặc lướt qua tất cả bài viết mới nhất.', 'content'],

            // ── Nội dung — Trang Cẩm nang ──
            ['camnang_hero_title', 'Đồng hành cùng con qua *từng giai đoạn*', 'content'],
            ['camnang_hero_sub', 'Từ lúc chào đời đến khi vào lớp 1 — mốc phát triển, mẹo chăm sóc và dấu hiệu mẹ cần chú ý ở mỗi giai đoạn, tổng hợp từ kinh nghiệm nuôi hai bé của mình.', 'content'],
            ['camtl1_stage', '0 – 6 tháng', 'content'], ['camtl1_title', 'Làm quen với thế giới', 'content'],
            ['camtl1_text', 'Giai đoạn này bé chủ yếu ngủ, bú và làm quen với ánh sáng, âm thanh xung quanh. Các mốc thường gặp: biết lẫy khoảng tháng thứ 3–4, biết với tay lấy đồ vật, ngủ theo cữ 3–4 tiếng vào ban đêm từ tháng thứ 4. Mẹ nên theo dõi cân nặng theo biểu đồ tăng trưởng của WHO mỗi tháng và cho bé tắm nắng buổi sáng sớm 10–15 phút để hỗ trợ tổng hợp vitamin D. Nếu bé không phản ứng với âm thanh lớn hoặc không nhìn theo vật chuyển động sau tháng thứ 3, nên hỏi ý kiến bác sĩ nhi khoa sớm.', 'content'],
            ['camtl1_tags', 'sơ sinh,giấc ngủ,tiêm chủng', 'content'],
            ['camtl2_stage', '6 – 12 tháng', 'content'], ['camtl2_title', 'Ăn dặm & tập bò, tập đứng', 'content'],
            ['camtl2_text', 'Bé bắt đầu ăn dặm, mọc răng đầu tiên và vận động mạnh hơn: ngồi vững khoảng tháng thứ 7, bò khoảng tháng thứ 8–9, đứng vịn từ tháng thứ 10. Mẹ nên chọn ghế ăn dặm có dây an toàn, bịt các góc bàn/ổ điện khi bé bắt đầu bò khắp nhà, và luôn cắt nhỏ thức ăn đúng chuẩn an toàn khi tập ăn dặm tự chỉ huy. Đây cũng là giai đoạn cần theo sát lịch tiêm chủng mở rộng.', 'content'],
            ['camtl2_tags', 'ăn dặm,vận động,mọc răng', 'content'],
            ['camtl3_stage', '1 – 3 tuổi', 'content'], ['camtl3_title', 'Ngôn ngữ bùng nổ & khủng hoảng tuổi lên 2', 'content'],
            ['camtl3_text', 'Bé đi vững, vốn từ tăng nhanh và bắt đầu nói câu 2–3 từ, nhận biết màu sắc, hình khối cơ bản. Đây cũng là lúc "khủng hoảng tuổi lên 2" xuất hiện — bé ăn vạ, muốn tự làm mọi thứ, hay nói "không". Mẹo mình áp dụng: cho bé quyền lựa chọn trong giới hạn an toàn (ví dụ chọn 1 trong 2 bộ đồ), giữ bình tĩnh khi bé ăn vạ thay vì quát mắng, và duy trì lịch sinh hoạt cố định để bé có cảm giác an toàn.', 'content'],
            ['camtl3_tags', 'ngôn ngữ,tâm lý,tự lập', 'content'],
            ['camtl4_stage', '3 – 6 tuổi', 'content'], ['camtl4_title', 'Chuẩn bị vào lớp 1 & giáo dục cảm xúc', 'content'],
            ['camtl4_text', 'Bé dần tự lập trong sinh hoạt cá nhân (tự ăn, tự mặc quần áo, tự đi vệ sinh), phát triển kỹ năng xã hội qua chơi nhóm ở trường mầm non. Trước khi vào lớp 1, mẹ nên tập cho bé làm quen với việc ngồi tập trung 15–20 phút, cầm bút đúng cách và tự chuẩn bị đồ dùng học tập đơn giản. Song song đó, dạy bé gọi tên cảm xúc của mình ("con đang buồn", "con đang giận") giúp bé kiểm soát hành vi tốt hơn khi lớn.', 'content'],
            ['camtl4_tags', 'vào lớp 1,giáo dục cảm xúc,kỹ năng sống', 'content'],
            ['camnang_bento_label', '🧩 Cẩm nang theo chủ đề', 'content'],
            ['camnang_bento_title', 'Chọn đúng chủ đề *mẹ đang cần*', 'content'],
            ['bento1_title', 'Giấc ngủ của bé', 'content'], ['bento1_desc', 'Luyện ngủ, cữ ngủ theo tháng tuổi', 'content'], ['bento1_image', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80&auto=format&fit=crop', 'content'],
            ['bento2_title', 'Ăn uống & dinh dưỡng', 'content'], ['bento2_desc', 'Thực đơn theo độ tuổi', 'content'], ['bento2_image', 'https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?w=600&q=80&auto=format&fit=crop', 'content'],
            ['bento3_title', 'Sức khỏe & tiêm chủng', 'content'], ['bento3_desc', 'Lịch tiêm, dấu hiệu bất thường', 'content'], ['bento3_image', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80&auto=format&fit=crop', 'content'],
            ['bento4_title', 'Vui chơi & trí tuệ', 'content'], ['bento4_desc', 'Trò chơi phát triển theo tuổi', 'content'], ['bento4_image', 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=600&q=80&auto=format&fit=crop', 'content'],
            ['camnang_saved_label', '💾 Được lưu nhiều nhất', 'content'],
            ['camnang_saved_title', 'Cẩm nang mẹ nào cũng *lưu lại*', 'content'],

            // ── Nội dung — Trang Về tôi ──
            ['about_hero_title', 'Xin chào, mình là *Hạ Vy*', 'content'],
            ['about_hero_sub', 'Mẹ của Kem (5 tuổi) và Sữa (2 tuổi), sống tại Hà Nội — người viết Cỏ Non Blog từ năm 2021.', 'content'],
            ['about_start_eyebrow', '✍️ Khởi đầu', 'content'],
            ['about_start_title', 'Mình bắt đầu viết Cỏ Non *như thế nào*', 'content'],
            ['about_start_text', 'Cuối năm 2021, khi đang mang thai Kem, mình mở một trang blog nhỏ chỉ để ghi lại nhật ký thai kỳ cho riêng mình — không nghĩ sẽ có ai đọc. Nhưng càng viết, mình càng nhận ra có rất nhiều mẹ khác cũng đang loay hoay với những câu hỏi giống mình: ăn dặm sao cho đúng, làm sao để không stress khi con quấy khóc, làm sao để vừa làm mẹ vừa giữ được chính mình. Cỏ Non ra đời từ đó — không phải để dạy ai, mà để cùng nhau đi qua hành trình này.', 'content'],
            ['about_start_image', 'https://images.unsplash.com/photo-1516981879613-9f5da904015f?w=700&q=80&auto=format&fit=crop', 'content'],
            ['about_philosophy_eyebrow', '🌿 Triết lý', 'content'],
            ['about_philosophy_title', 'Triết lý nuôi con *của mình*', 'content'],
            ['about_philosophy_text', 'Mình tin rằng không có "công thức nuôi con hoàn hảo" — chỉ có sự lắng nghe. Lắng nghe con để hiểu bé cần gì thay vì áp đặt lịch trình cứng nhắc, và lắng nghe chính mình để biết khi nào cần nghỉ ngơi thay vì cố gắng làm mẹ "hoàn hảo" theo tiêu chuẩn của người khác. Mọi bài viết trên Cỏ Non đều xuất phát từ tinh thần đó — chia sẻ để đồng hành, không phải để phán xét.', 'content'],
            ['about_philosophy_image', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=700&q=80&auto=format&fit=crop', 'content'],
            ['about_life_eyebrow', '🏡 Ngoài trang viết', 'content'],
            ['about_life_title', 'Cuộc sống *ngoài trang viết*', 'content'],
            ['about_life_text', 'Trước khi viết blog toàn thời gian, mình từng làm marketing cho một công ty F&B tại Hà Nội gần 5 năm. Hiện tại mình dành phần lớn thời gian cho Kem, Sữa và Cỏ Non, thỉnh thoảng nhận tư vấn nội dung cho các thương hiệu mẹ và bé mà mình thực sự tin tưởng. Cuối tuần, cả nhà mình thường đưa nhau ra công viên gần nhà hoặc nấu ăn cùng nhau — những khoảnh khắc bình thường nhất lại là điều mình trân trọng nhất.', 'content'],
            ['about_life_image', 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=700&q=80&auto=format&fit=crop', 'content'],
            ['about_stat1_number', '2021', 'content'], ['about_stat1_suffix', '', 'content'], ['about_stat1_label', 'Năm bắt đầu viết', 'content'],
            ['about_stat2_number', '260', 'content'], ['about_stat2_suffix', '+', 'content'], ['about_stat2_label', 'Bài viết đã đăng', 'content'],
            ['about_stat3_number', '1', 'content'], ['about_stat3_suffix', '', 'content'], ['about_stat3_label', 'Cuốn sách đã xuất bản', 'content'],
            ['about_stat4_number', '15', 'content'], ['about_stat4_suffix', '+', 'content'], ['about_stat4_label', 'Buổi workshop offline', 'content'],
            ['milestone_label', '🗓 Cột mốc', 'content'],
            ['milestone_title', 'Những cột mốc của *Cỏ Non*', 'content'],
            ['milestone1_year', '2021', 'content'], ['milestone1_title', 'Bắt đầu viết blog cá nhân', 'content'], ['milestone1_text', 'Mở Cỏ Non khi đang mang thai Kem, ban đầu chỉ để ghi lại nhật ký thai kỳ cho riêng mình.', 'content'],
            ['milestone2_year', '2022', 'content'], ['milestone2_title', 'Đạt 10.000 lượt đọc/tháng', 'content'], ['milestone2_text', 'Lập nhóm Facebook kín đầu tiên để các mẹ có nơi trao đổi kinh nghiệm trực tiếp.', 'content'],
            ['milestone3_year', '2023', 'content'], ['milestone3_title', 'Xuất bản sách "Nhật Ký 9 Tháng 10 Ngày"', 'content'], ['milestone3_text', 'Tổng hợp những bài viết tâm đắc nhất về hành trình mang thai và sinh nở của mình.', 'content'],
            ['milestone4_year', '2024', 'content'], ['milestone4_title', 'Workshop offline đầu tiên', 'content'], ['milestone4_text', '200 mẹ bỉm tham dự buổi chia sẻ "Ăn dặm không nước mắt" tại Hà Nội.', 'content'],
            ['milestone5_year', '2026', 'content'], ['milestone5_title', 'Cỏ Non hiện tại', 'content'], ['milestone5_text', '48.000 độc giả mỗi tháng và hơn 12.000 thành viên trong nhóm kín — vẫn viết mỗi tuần như ngày đầu.', 'content'],
            ['about_feat_label', '💫 Giá trị cốt lõi', 'content'],
            ['about_feat_title', 'Những điều mình *luôn giữ*', 'content'],
            ['about_feat1_icon', '🤍', 'content'], ['about_feat1_title', 'Chân thật', 'content'], ['about_feat1_text', 'Chỉ viết những gì mình thực sự trải qua, kể cả những phần không hoàn hảo.', 'content'],
            ['about_feat2_icon', '🔬', 'content'], ['about_feat2_title', 'Khoa học', 'content'], ['about_feat2_text', 'Đối chiếu thông tin y khoa trước khi chia sẻ, không truyền tai mẹo dân gian chưa kiểm chứng.', 'content'],
            ['about_feat3_icon', '💛', 'content'], ['about_feat3_title', 'Đồng cảm', 'content'], ['about_feat3_text', 'Luôn đặt mình vào vị trí người đọc — một người mẹ cũng đang mệt mỏi và cần được lắng nghe.', 'content'],
            ['about_feat4_icon', '🌿', 'content'], ['about_feat4_title', 'Không phán xét', 'content'], ['about_feat4_text', 'Mỗi gia đình có một hoàn cảnh khác nhau — không có cách nuôi con nào là duy nhất đúng.', 'content'],
            ['about_testi_label', '💬 Độc giả nói gì', 'content'],
            ['about_testi_title', 'Cỏ Non trong mắt *độc giả*', 'content'],

            // ── Nội dung — Trang Liên hệ ──
            ['contact_hero_title', 'Mình luôn sẵn sàng *lắng nghe*', 'content'],
            ['contact_hero_sub', 'Có câu chuyện muốn chia sẻ, góp ý cho blog hay đề xuất hợp tác — điền form bên dưới, mình sẽ phản hồi trong 3–5 ngày làm việc.', 'content'],

            // ── Pháp lý ──
            ['legal_updated', '20/08/2026', 'legal'],
            ['privacy_content', "<h2>1. Thông tin chúng tôi thu thập</h2><p>Chúng tôi chỉ thu thập thông tin bạn chủ động cung cấp khi:</p><ul><li>Điền form liên hệ (họ tên, email, nội dung tin nhắn)</li><li>Đăng ký nhận bản tin (email)</li><li>Để lại bình luận trên bài viết (tên hiển thị, email — không công khai)</li><li>Gửi bài viết đóng góp hoặc câu chuyện chia sẻ</li></ul><p>Ngoài ra, chúng tôi có thể thu thập dữ liệu truy cập ẩn danh (trình duyệt, thời gian truy cập, trang được xem) thông qua công cụ phân tích để hiểu độc giả đọc nội dung nào nhiều nhất.</p><h2>2. Cách chúng tôi sử dụng thông tin</h2><ul><li>Phản hồi câu hỏi, tin nhắn liên hệ của bạn</li><li>Gửi bản tin hằng tuần nếu bạn đã đăng ký (có thể hủy bất cứ lúc nào)</li><li>Cải thiện nội dung dựa trên chủ đề độc giả quan tâm nhiều</li><li>Xét duyệt và phản hồi bài viết đóng góp/hợp tác</li></ul><p>Chúng tôi <strong>không bán, cho thuê hoặc chia sẻ</strong> thông tin cá nhân của bạn cho bên thứ ba vì mục đích thương mại.</p><h2>3. Cookie & công cụ bên thứ ba</h2><p>Blog sử dụng cookie cơ bản để ghi nhớ tùy chọn hiển thị và số liệu truy cập ẩn danh. Bản đồ nhúng ở footer (Google Maps) và các nút chia sẻ mạng xã hội có thể đặt cookie riêng theo chính sách của nhà cung cấp tương ứng — chúng tôi không kiểm soát cookie này.</p><h2>4. Trẻ em & hình ảnh chia sẻ</h2><p>Cỏ Non không thu thập thông tin cá nhân của trẻ em qua blog. Hình ảnh các bé (Kem, Sữa, hoặc con của độc giả gửi kèm bài chia sẻ) chỉ được đăng khi có sự đồng ý của phụ huynh/người giám hộ và không kèm thông tin định danh nhạy cảm.</p><h2>5. Quyền của bạn</h2><ul><li>Yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân đã cung cấp</li><li>Hủy đăng ký nhận bản tin bất cứ lúc nào qua link trong email</li><li>Yêu cầu gỡ bình luận hoặc bài chia sẻ có thông tin của bạn</li></ul><p>Mọi yêu cầu vui lòng gửi tới <strong>hoptac@conon.blog</strong>, chúng tôi phản hồi trong vòng 7 ngày làm việc.</p><h2>6. Thay đổi chính sách</h2><p>Chính sách này có thể được cập nhật theo thời gian. Mọi thay đổi quan trọng sẽ được thông báo qua bản tin hoặc hiển thị trên trang này.</p>", 'legal'],
            ['terms_content', "<h2>1. Bản quyền nội dung</h2><p>Toàn bộ bài viết, hình ảnh và thiết kế trên Cỏ Non Blog thuộc bản quyền của Hạ Vy, trừ khi có ghi chú nguồn khác. Bạn có thể trích dẫn tối đa 150 từ kèm link dẫn nguồn về bài viết gốc. Nghiêm cấm sao chép nguyên bài, dịch lại hoặc sử dụng cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản.</p><h2>2. Bài viết đóng góp & nội dung do người dùng gửi</h2><p>Khi gửi bài viết, câu chuyện hoặc hình ảnh cho Cỏ Non, bạn xác nhận đây là nội dung do chính mình tạo ra hoặc có quyền chia sẻ, và đồng ý cho phép Cỏ Non biên tập, đăng tải với ghi nhận tên tác giả (hoặc ẩn danh nếu bạn yêu cầu). Cỏ Non có quyền từ chối đăng bài không phù hợp với tinh thần chia sẻ chân thật, không phán xét của blog.</p><h2>3. Quy định bình luận</h2><ul><li>Khuyến khích bình luận chia sẻ kinh nghiệm, đặt câu hỏi mang tính xây dựng</li><li>Nghiêm cấm công kích cá nhân, ngôn từ thù ghét, spam link hoặc quảng cáo trái phép</li><li>Cỏ Non có quyền ẩn/xóa bình luận vi phạm mà không cần báo trước</li></ul><h2>4. Nội dung tài trợ & hợp tác quảng cáo</h2><p>Mọi bài viết có yếu tố tài trợ, quà tặng hoặc hợp tác thương mại đều được gắn nhãn \"Hợp tác\" rõ ràng ngay đầu bài. Cỏ Non chỉ nhận hợp tác với sản phẩm/dịch vụ đã qua kiểm định an toàn và phù hợp với đối tượng mẹ và bé.</p><h2>5. Miễn trừ trách nhiệm</h2><p>Nội dung trên Cỏ Non Blog mang tính chất chia sẻ kinh nghiệm cá nhân, tham khảo tài liệu y khoa công khai — <strong>không thay thế tư vấn, chẩn đoán hoặc điều trị y tế trực tiếp từ bác sĩ</strong>. Vui lòng tham khảo ý kiến chuyên gia y tế cho tình huống cụ thể của bé và gia đình bạn.</p><h2>6. Liên kết ngoài</h2><p>Blog có thể chứa liên kết tới website bên thứ ba (nguồn tham khảo, sản phẩm được nhắc tới). Cỏ Non không chịu trách nhiệm về nội dung hoặc chính sách bảo mật của các website này.</p><h2>7. Thay đổi điều khoản</h2><p>Điều khoản này có thể được cập nhật theo thời gian mà không cần báo trước. Việc tiếp tục sử dụng blog sau khi thay đổi đồng nghĩa bạn chấp nhận điều khoản mới.</p>", 'legal'],

            // ── SMTP ──
            ['smtp_host', '', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from_name', 'Cỏ Non Blog', 'smtp'],
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
        // subtitle format: "tag||desc||ghostBtnText||ghostBtnLink" — button_text/button_link (core columns)
        // dùng cho nút PRIMARY (nút thứ 1), vì template mỗi slide có 2 nút khác nhau (primary + ghost).
        $slides = [
            [
                'title' => 'Nhật ký nuôi con — *chân thật* đến từng khoảnh khắc nhỏ',
                'subtitle' => "🌱 Cỏ Non Blog||Mình là Hạ Vy, mẹ của Kem và Sữa. Đây là nơi mình ghi lại hành trình làm mẹ — không tô hồng, không áp lực, chỉ có những điều thật.||Về mình — Hạ Vy||/ve-toi",
                'button_text' => 'Khám phá chuyên mục',
                'button_link' => '/chuyen-muc',
                'image' => 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500&q=80&auto=format&fit=crop',
                'sort_order' => 1,
            ],
            [
                'title' => 'Ăn dặm không nước mắt — *cùng con* khám phá vị giác',
                'subtitle' => "🥣 Dinh dưỡng cho bé||Thực đơn, công thức và những bài học rút ra từ 2 năm cho hai bé ăn dặm — chia sẻ thật, không quảng cáo.||Đọc bài mới nhất||/chuyen-muc",
                'button_text' => 'Xem cẩm nang ăn dặm',
                'button_link' => '/cam-nang',
                'image' => 'https://images.unsplash.com/photo-1541692641319-981cc79ee10a?w=500&q=80&auto=format&fit=crop',
                'sort_order' => 2,
            ],
            [
                'title' => '9 tháng 10 ngày — *hành trình* không ai giống ai',
                'subtitle' => "🌷 Mang thai & sinh nở||Từ ốm nghén, khám thai đến ngày vượt cạn — những điều mình ước ai đó đã nói với mình sớm hơn.||Liên hệ chia sẻ||/lien-he",
                'button_text' => 'Đọc chuyên mục Mang thai',
                'button_link' => '/chuyen-muc',
                'image' => 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&q=80&auto=format&fit=crop',
                'sort_order' => 3,
            ],
            [
                'title' => 'Chơi cùng con mỗi ngày — *bài học* lớn nhất của mẹ',
                'subtitle' => "🧸 Giáo dục sớm||Những trò chơi đơn giản tại nhà giúp con phát triển ngôn ngữ, vận động và cảm xúc — không cần đồ chơi đắt tiền.||Theo dõi Cỏ Non||/#newsletter",
                'button_text' => 'Xem cẩm nang theo giai đoạn',
                'button_link' => '/cam-nang',
                'image' => 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&q=80&auto=format&fit=crop',
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

    // ─── Categories (chuyen-muc.html tabs) ──────────────────────────────────
    private function seedCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM categories") > 0) return;
        $cats = [
            ['Mang thai', 'mang-thai', 1],
            ['Sơ sinh', 'so-sinh', 2],
            ['Dinh dưỡng cho bé', 'dinh-duong', 3],
            ['Giáo dục sớm', 'giao-duc', 4],
            ['Góc của mẹ', 'goc-cua-me', 5],
        ];
        foreach ($cats as [$name, $slug, $order]) {
            $this->execute("INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)", [$name, $slug, $order]);
        }
    }

    // ─── Posts (index.html + chuyen-muc.html + bai-viet-chi-tiet.html + cam-nang.html hscroll) ──
    private function seedPosts(): void {
        if ($this->scalar("SELECT COUNT(*) FROM posts") > 0) return;

        $avatar = 'https://images.unsplash.com/photo-1516981879613-9f5da904015f?w=100&q=70&auto=format&fit=crop';

        // Bài viết có nội dung chi tiết đầy đủ từ bai-viet-chi-tiet.html — bài featured
        $fullContent = '<p>Khi Kem — con đầu của mình — bước sang tháng thứ 6, mình lao vào đọc đủ loại sách vở, hội nhóm để chọn phương pháp ăn dặm "đúng nhất". Ba năm sau, đến lượt Sữa, mình lại đổi hướng hoàn toàn. Bài viết này không phải để nói phương pháp nào tốt hơn — mà là những gì mình thực sự trải qua với cả hai, để mẹ nào đang phân vân có thêm một góc nhìn thật.</p>'
            . '<h2>Ăn dặm kiểu Nhật là gì?</h2>'
            . '<p>Đây là phương pháp mình áp dụng cho Kem. Thức ăn được chế biến riêng từng loại, nghiền mịn dần theo độ tuổi, nêm nhạt gần như không gia vị, và mẹ là người đút cho bé bằng thìa theo lượng tăng dần mỗi tuần. Điểm mình thích nhất là bé được làm quen với vị nguyên bản của từng loại thực phẩm trước khi trộn lẫn, giúp Kem ăn khá đa dạng ngay từ đầu.</p>'
            . '<ul><li>Kiểm soát được chính xác lượng ăn của bé mỗi bữa</li><li>Bé làm quen dần với độ thô, ít bị "sốc" kết cấu thức ăn</li><li>Tốn khá nhiều thời gian chuẩn bị — mình từng mất 40 phút mỗi tối để rây từng loại rau củ</li></ul>'
            . '<h2>Ăn dặm tự chỉ huy (BLW) là gì?</h2>'
            . '<p>Đến Sữa, mình chuyển sang BLW (Baby-Led Weaning) — bé tự cầm nắm thức ăn cắt miếng dài, tự đưa vào miệng, tự quyết định ăn bao nhiêu. Mẹ không đút, chỉ ngồi cùng và quan sát. Ba tuần đầu mình khá hoảng vì nhìn Sữa ọe liên tục — sau này mới biết đó là phản xạ đẩy thức ăn bình thường của bé, khác với hóc nghẹn thật sự.</p>'
            . '<div class="bmb-article-quote">"Điều mình học được lớn nhất không phải là chọn đúng phương pháp — mà là học cách phân biệt giữa lo lắng của bản thân và dấu hiệu nguy hiểm thật sự ở con."<span>Hạ Vy — Cỏ Non Blog</span></div>'
            . '<h2>Mình đã áp dụng thế nào với Kem và Sữa?</h2>'
            . '<p>Với Kem, mình theo sát lịch ăn dặm kiểu Nhật suốt 4 tháng đầu rồi mới cho làm quen bốc nhón dần từ tháng thứ 10. Với Sữa, mình cho tự bốc ngay từ ngày đầu ăn dặm nhưng vẫn giữ lại vài bữa đút thìa các món súp/cháo loãng khi bé mệt hoặc ốm — không cứng nhắc theo một trường phái duy nhất.</p>'
            . '<div class="bmb-article-img"><img src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&q=80&auto=format&fit=crop" alt="Bé tự cầm nắm thức ăn theo phương pháp ăn dặm tự chỉ huy" loading="lazy"></div>'
            . '<h2>So sánh thực tế — ưu và nhược điểm</h2>'
            . '<p>Sau khi trải qua cả hai, đây là điều mình rút ra được, hoàn toàn từ kinh nghiệm cá nhân chứ không phải lý thuyết sách vở:</p>'
            . '<ul><li><strong>Ăn dặm kiểu Nhật</strong> phù hợp nếu mẹ có nhiều thời gian chuẩn bị và muốn kiểm soát chặt lượng ăn — nhưng dễ khiến bé phụ thuộc vào việc được đút, chậm phát triển kỹ năng nhai của hàm.</li><li><strong>BLW</strong> giúp bé phát triển kỹ năng vận động tinh và nhai tốt hơn rõ rệt, nhưng bừa bộn hơn nhiều và mẹ cần thời gian đầu để "quen mắt" với việc bé ọe/nhè thức ăn.</li><li>Cả hai đều cần mẹ kiên nhẫn ít nhất 2-3 tuần đầu — giai đoạn nào cũng có lúc bé từ chối ăn, đừng vội kết luận phương pháp "không hợp".</li></ul>'
            . '<h2>Vậy nên chọn phương pháp nào?</h2>'
            . '<p>Thành thật thì mình nghĩ không có phương pháp "đúng tuyệt đối" — chỉ có phương pháp phù hợp với nhịp sống của mẹ và tính cách của bé. Nếu bé nhà bạn tò mò, thích tự khám phá — BLW có thể sẽ nhàn hơn cho mẹ về lâu dài. Nếu bé nhạy cảm, dễ giật mình với kết cấu thô — bắt đầu bằng ăn dặm kiểu Nhật rồi chuyển tiếp dần sẽ nhẹ nhàng hơn. Mình đã chọn kết hợp linh hoạt cả hai cho Sữa và thấy đó là lựa chọn phù hợp nhất với gia đình mình.</p>'
            . '<div class="bmb-article-img"><img src="https://images.unsplash.com/photo-1560421683-6856ea585c78?w=1200&q=80&auto=format&fit=crop" alt="Mẹ chuẩn bị bữa ăn dặm kết hợp cho bé" loading="lazy"></div>'
            . '<h2>Vài lưu ý an toàn mẹ cần nhớ</h2>'
            . '<ul><li>Luôn cho bé ngồi thẳng lưng trên ghế ăn, không cho ăn khi đang nằm hoặc di chuyển</li><li>Cắt thức ăn theo dạng thanh dài bằng ngón tay, tránh miếng tròn nhỏ dễ lọt vào khí quản (nho, cà chua bi cần bổ dọc)</li><li>Luôn có người lớn ngồi cạnh quan sát bé trong suốt bữa ăn, không rời mắt kể cả vài giây</li><li>Giới thiệu từng loại thực phẩm mới cách nhau 2-3 ngày để theo dõi dấu hiệu dị ứng</li><li>Nếu bé có tiền sử dị ứng gia đình, nên hỏi ý kiến bác sĩ nhi khoa trước khi cho ăn nhóm thực phẩm dễ dị ứng (trứng, hải sản, đậu phộng)</li></ul>'
            . '<p>Dù chọn phương pháp nào, điều quan trọng nhất mình học được là: đừng so sánh tốc độ ăn của con với "con nhà người ta". Mỗi bé có một nhịp độ riêng, và vai trò của mẹ là đồng hành chứ không phải ép buộc.</p>';

        $posts = [
            // ── Bài featured (bai-viet-chi-tiet.html) ──
            ['title'=>'Ăn dặm kiểu Nhật hay BLW? Mình đã thử cả hai và đây là điều rút ra','slug'=>'an-dam-kieu-nhat-hay-blw','category_slug'=>'dinh-duong',
             'excerpt'=>'Sau 2 năm cho hai bé ăn dặm bằng ăn dặm kiểu Nhật và ăn dặm tự chỉ huy (BLW), mẹ Hạ Vy chia sẻ trải nghiệm thật, ưu nhược điểm và cách chọn phương pháp phù hợp cho con.',
             'content'=>$fullContent,
             'thumbnail'=>'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1400&q=80&auto=format&fit=crop',
             'read_time'=>12,'tags'=>'ăn dặm,ăn dặm kiểu Nhật,BLW,dinh dưỡng cho bé,bé 6 tháng',
             'featured'=>1,'popular'=>0,'saved'=>0,'published_at'=>'2026-08-20 08:00:00'],

            // ── Bài mới đăng (index.html + chuyen-muc.html grid) ──
            ['title'=>'Set đồ sơ sinh cho bé mùa đông: Mua gì là đủ, đừng mua thừa','slug'=>'set-do-so-sinh-mua-dong','category_slug'=>'so-sinh',
             'excerpt'=>'Danh sách 12 món đồ thực sự cần thiết mình đúc kết sau 2 lần chuẩn bị đồ sơ sinh — tiết kiệm hơn 3 triệu so với lần đầu.',
             'content'=>'<p>Danh sách 12 món đồ thực sự cần thiết mình đúc kết sau 2 lần chuẩn bị đồ sơ sinh — tiết kiệm hơn 3 triệu so với lần đầu. Đừng để các mẹ bỉm khác hù mua sắm quá tay, bé sơ sinh lớn rất nhanh trong 3 tháng đầu.</p><p>Ưu tiên: bodysuit cotton (6-8 cái), khăn xô, mũ thóp, bao tay bao chân, chăn ủ, và một vài bộ áo liền quần giữ ấm. Những món "trông đẹp nhưng ít dùng": váy đầm cầu kỳ, giày tập đi (bé chưa cần đến khi biết đi).</p>',
             'thumbnail'=>'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=700&q=80&auto=format&fit=crop',
             'read_time'=>6,'tags'=>'sơ sinh,mùa đông,chuẩn bị đồ sơ sinh',
             'featured'=>0,'popular'=>0,'saved'=>0,'published_at'=>'2026-08-18 09:00:00'],

            ['title'=>'5 trò chơi giúp bé 18 tháng phát triển ngôn ngữ ngay tại nhà','slug'=>'5-tro-choi-phat-trien-ngon-ngu','category_slug'=>'giao-duc',
             'excerpt'=>'Không cần đồ chơi đắt tiền — chỉ cần 15 phút mỗi ngày với các trò chơi mình áp dụng cho cả Kem và Sữa.',
             'content'=>'<p>Không cần đồ chơi đắt tiền — chỉ cần 15 phút mỗi ngày với các trò chơi mình áp dụng cho cả Kem và Sữa: gọi tên đồ vật khi đi dạo, hát các bài đồng dao lặp từ, chơi trốn tìm gọi tên bộ phận cơ thể, đọc sách tranh lớn tiếng mỗi tối, và bắt chước âm thanh con vật.</p><p>Điều quan trọng nhất là kiên trì và không ép — bé sẽ bật nói khi đã sẵn sàng, mỗi bé có tốc độ khác nhau.</p>',
             'thumbnail'=>'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=700&q=80&auto=format&fit=crop',
             'read_time'=>7,'tags'=>'giáo dục sớm,ngôn ngữ,trò chơi',
             'featured'=>0,'popular'=>1,'saved'=>0,'published_at'=>'2026-08-15 09:00:00'],

            ['title'=>'Trầm cảm sau sinh không đáng xấu hổ — câu chuyện của mình','slug'=>'tram-cam-sau-sinh-khong-dang-xau-ho','category_slug'=>'goc-cua-me',
             'excerpt'=>'3 tháng đầu sau khi sinh Sữa, mình đã im lặng chịu đựng vì nghĩ "làm mẹ ai chẳng mệt". Đây là điều mình ước mình đã nói ra sớm hơn.',
             'content'=>'<p>3 tháng đầu sau khi sinh Sữa, mình đã im lặng chịu đựng vì nghĩ "làm mẹ ai chẳng mệt". Mất ngủ triền miên, khóc không rõ lý do, cảm giác không đủ tốt với con — mình cứ nghĩ đó là chuyện bình thường cho đến khi chồng mình nhận ra và đưa mình đi khám.</p><p>Bác sĩ chẩn đoán trầm cảm sau sinh mức độ nhẹ đến vừa. Sau 2 tháng điều trị kết hợp tư vấn tâm lý, mình đã ổn hơn rất nhiều. Nếu bạn đang cảm thấy tương tự — xin đừng chịu đựng một mình, hãy nói ra với người thân hoặc chuyên gia.</p>',
             'thumbnail'=>'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&q=80&auto=format&fit=crop',
             'read_time'=>9,'tags'=>'góc của mẹ,trầm cảm sau sinh,sức khỏe tinh thần',
             'featured'=>0,'popular'=>0,'saved'=>0,'published_at'=>'2026-08-11 09:00:00'],

            ['title'=>'Lịch tiêm chủng cho bé 0-24 tháng mẹ cần nhớ','slug'=>'lich-tiem-chung-cho-be-0-24-thang','category_slug'=>'so-sinh',
             'excerpt'=>'Bảng tổng hợp đầy đủ các mũi tiêm bắt buộc và khuyến khích theo khuyến cáo của Bộ Y tế, kèm mẹo giúp bé bớt quấy khóc khi tiêm.',
             'content'=>'<p>Bảng tổng hợp đầy đủ các mũi tiêm bắt buộc và khuyến khích theo khuyến cáo của Bộ Y tế, kèm mẹo giúp bé bớt quấy khóc khi tiêm: cho bé bú/ăn no trước khi tiêm 30 phút, ôm bé chặt tay khi tiêm, chườm mát chỗ tiêm sau 24h nếu sưng đau, và theo dõi sốt trong 48h đầu.</p><p>Lưu giữ sổ tiêm chủng cẩn thận — nhiều trường mầm non yêu cầu xuất trình khi nhập học.</p>',
             'thumbnail'=>'https://images.unsplash.com/photo-1543342384-1f1350e27861?w=700&q=80&auto=format&fit=crop',
             'read_time'=>8,'tags'=>'sơ sinh,tiêm chủng,sức khỏe',
             'featured'=>0,'popular'=>0,'saved'=>0,'published_at'=>'2026-08-08 09:00:00'],

            ['title'=>'Thực đơn ăn dặm 1 tuần cho bé 6 tháng tuổi (kèm công thức chi tiết)','slug'=>'thuc-don-an-dam-1-tuan-be-6-thang','category_slug'=>'dinh-duong',
             'excerpt'=>'7 ngày thực đơn chi tiết từng bữa, nguyên liệu dễ tìm, phù hợp cho mẹ mới bắt đầu cho bé ăn dặm.',
             'content'=>'<p>7 ngày thực đơn chi tiết từng bữa, nguyên liệu dễ tìm, phù hợp cho mẹ mới bắt đầu cho bé ăn dặm: bắt đầu từ bột gạo loãng, rồi tăng dần độ đặc và đa dạng rau củ nghiền (bí đỏ, cà rốt, khoai lang), sau đó thêm đạm (thịt gà, cá đồng) từ tuần thứ 2.</p><p>Nguyên tắc "3 ngày 1 món mới" giúp mẹ dễ theo dõi dấu hiệu dị ứng của bé.</p>',
             'thumbnail'=>'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=700&q=80&auto=format&fit=crop',
             'read_time'=>10,'tags'=>'dinh dưỡng cho bé,ăn dặm,thực đơn',
             'featured'=>0,'popular'=>1,'saved'=>0,'published_at'=>'2026-08-04 09:00:00'],

            ['title'=>'Đọc sách cho con từ 0 tuổi: Bắt đầu như thế nào?','slug'=>'doc-sach-cho-con-tu-0-tuoi','category_slug'=>'giao-duc',
             'excerpt'=>'Mình đã đọc sách cho Sữa từ lúc bé 2 tháng tuổi — đây là cách chọn sách và duy trì thói quen mà không tạo áp lực cho cả mẹ và con.',
             'content'=>'<p>Mình đã đọc sách cho Sữa từ lúc bé 2 tháng tuổi — đây là cách chọn sách và duy trì thói quen mà không tạo áp lực cho cả mẹ và con: chọn sách bìa cứng, hình ảnh tương phản cao cho bé dưới 6 tháng, sách lift-the-flap cho bé 1-2 tuổi, và luôn đọc vào một khung giờ cố định trước khi ngủ.</p><p>Không cần đọc hết cả cuốn mỗi lần — bé chán thì dừng, quan trọng là duy trì đều đặn.</p>',
             'thumbnail'=>'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=700&q=80&auto=format&fit=crop',
             'read_time'=>6,'tags'=>'giáo dục sớm,đọc sách,thói quen',
             'featured'=>0,'popular'=>0,'saved'=>0,'published_at'=>'2026-08-01 09:00:00'],

            // ── Bài chỉ xuất hiện ở chuyên mục (không ở home) ──
            ['title'=>'Ốm nghén 3 tháng đầu: 7 cách mình đã vượt qua mà không cần thuốc','slug'=>'om-nghen-3-thang-dau','category_slug'=>'mang-thai',
             'excerpt'=>'Những mẹo nhỏ mình áp dụng khi ốm nghén nặng đến mức không ăn nổi cơm suốt 6 tuần liền.',
             'content'=>'<p>Những mẹo nhỏ mình áp dụng khi ốm nghén nặng đến mức không ăn nổi cơm suốt 6 tuần liền: ăn bánh quy mặn ngay khi thức dậy trước khi rời giường, chia nhỏ 6-7 bữa/ngày thay vì 3 bữa lớn, ngửi vỏ chanh tươi khi buồn nôn, uống trà gừng ấm, và tránh mùi dầu mỡ nồng.</p><p>Nếu nôn quá 3 lần/ngày kèm sụt cân, nên đi khám để loại trừ nghén nặng (hyperemesis gravidarum).</p>',
             'thumbnail'=>'https://images.unsplash.com/photo-1590650046871-92c887180603?w=700&q=80&auto=format&fit=crop',
             'read_time'=>7,'tags'=>'mang thai,ốm nghén,tam cá nguyệt đầu',
             'featured'=>0,'popular'=>1,'saved'=>0,'published_at'=>'2026-07-22 09:00:00'],

            ['title'=>'Dấu hiệu chuyển dạ thật và giả — phân biệt thế nào?','slug'=>'dau-hieu-chuyen-da-that-va-gia','category_slug'=>'mang-thai',
             'excerpt'=>'Mình đã 2 lần nhầm lẫn cơn gò Braxton Hicks với chuyển dạ thật — đây là cách phân biệt chính xác.',
             'content'=>'<p>Mình đã 2 lần nhầm lẫn cơn gò Braxton Hicks với chuyển dạ thật — đây là cách phân biệt chính xác: chuyển dạ thật có cơn co đều đặn, tăng dần cường độ và khoảng cách ngắn lại theo thời gian, kèm ra dịch nhầy hồng hoặc vỡ ối. Braxton Hicks thường không đều, giảm khi đổi tư thế hoặc nghỉ ngơi.</p><p>Khi không chắc chắn, luôn gọi cho bác sĩ hoặc đến viện kiểm tra — an toàn vẫn hơn.</p>',
             'thumbnail'=>'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=700&q=80&auto=format&fit=crop',
             'read_time'=>8,'tags'=>'mang thai,chuyển dạ,sinh nở',
             'featured'=>0,'popular'=>1,'saved'=>0,'published_at'=>'2026-07-28 09:00:00'],

            ['title'=>'Cân bằng công việc và làm mẹ: mình đã học cách buông bỏ sự hoàn hảo','slug'=>'can-bang-cong-viec-va-lam-me','category_slug'=>'goc-cua-me',
             'excerpt'=>'Một năm đi làm lại sau sinh, mình đã học được rằng "đủ tốt" cũng là một dạng thành công.',
             'content'=>'<p>Một năm đi làm lại sau sinh, mình đã học được rằng "đủ tốt" cũng là một dạng thành công. Mình không còn cố làm mẹ hoàn hảo 10/10 mỗi ngày — có ngày bé ăn cơm với trứng chiên thay vì món cầu kỳ, có ngày mình để bé xem hoạt hình 30 phút để kịp deadline. Và điều đó hoàn toàn ổn.</p><p>Học cách nhờ giúp đỡ (ông bà, chồng, người giúp việc) không phải là thất bại — đó là cách để mình bền bỉ hơn trên hành trình dài.</p>',
             'thumbnail'=>'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=700&q=80&auto=format&fit=crop',
             'read_time'=>9,'tags'=>'góc của mẹ,cân bằng cuộc sống,đi làm lại sau sinh',
             'featured'=>0,'popular'=>1,'saved'=>0,'published_at'=>'2026-07-25 09:00:00'],

            // ── 5 bài "Được lưu nhiều nhất" (cam-nang.html hscroll) ──
            ['title'=>'Lịch sinh hoạt EASY cho bé 0-3 tháng — mẹ có thể áp dụng ngay','slug'=>'lich-sinh-hoat-easy-cho-be-0-3-thang','category_slug'=>'so-sinh',
             'excerpt'=>'Trình tự Eat - Activity - Sleep - Your time giúp bé ngủ sâu hơn và mẹ có thời gian nghỉ ngơi dự đoán được.',
             'content'=>'<p>Trình tự Eat - Activity - Sleep - Your time (EASY) giúp bé ngủ sâu hơn và mẹ có thời gian nghỉ ngơi dự đoán được. Áp dụng chu kỳ 3 tiếng cho bé sơ sinh: bú no → chơi/thức nhẹ nhàng 45-60 phút → ngủ → mẹ có thời gian riêng.</p><p>Lưu ý: đây là khung tham khảo, cần linh hoạt điều chỉnh theo nhịp sinh học riêng của từng bé, không nên ép cứng nhắc.</p>',
             'thumbnail'=>'https://images.unsplash.com/photo-1560785496-3c9d27877182?w=500&q=80&auto=format&fit=crop',
             'read_time'=>7,'tags'=>'sơ sinh,lịch sinh hoạt,EASY',
             'featured'=>0,'popular'=>0,'saved'=>1,'published_at'=>'2026-06-15 09:00:00'],

            ['title'=>'Bảng chiều cao — cân nặng chuẩn WHO cho bé 0-5 tuổi','slug'=>'bang-chieu-cao-can-nang-chuan-who','category_slug'=>'so-sinh',
             'excerpt'=>'Tổng hợp bảng chuẩn tăng trưởng của WHO giúp mẹ theo dõi bé có phát triển đúng mốc hay không.',
             'content'=>'<p>Tổng hợp bảng chuẩn tăng trưởng của WHO giúp mẹ theo dõi bé có phát triển đúng mốc hay không. Cân nặng và chiều cao trong khoảng ±2 độ lệch chuẩn (SD) đều được xem là bình thường — mẹ không cần quá lo lắng nếu bé hơi thấp/nhẹ hơn bạn cùng tuổi, miễn đường tăng trưởng đều đặn.</p><p>Nên cân đo bé định kỳ hàng tháng trong năm đầu, sau đó 3 tháng/lần.</p>',
             'thumbnail'=>'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=500&q=80&auto=format&fit=crop',
             'read_time'=>6,'tags'=>'sức khỏe,tăng trưởng,WHO',
             'featured'=>0,'popular'=>0,'saved'=>1,'published_at'=>'2026-06-10 09:00:00'],

            ['title'=>'Checklist đồ đi sinh đầy đủ nhất cho mẹ bầu 3 miền','slug'=>'checklist-do-di-sinh-day-du-nhat','category_slug'=>'mang-thai',
             'excerpt'=>'Danh sách chi tiết đồ cho mẹ và bé cần chuẩn bị trước ngày dự sinh, tránh thiếu sót phút chót.',
             'content'=>'<p>Danh sách chi tiết đồ cho mẹ và bé cần chuẩn bị trước ngày dự sinh, tránh thiếu sót phút chót: giấy tờ tùy thân + hồ sơ khám thai, đồ dùng cá nhân mẹ (băng vệ sinh sau sinh, quần lót giấy, áo cho con bú), đồ sơ sinh cho bé (bodysuit, khăn xô, tã), và một ít tiền mặt dự phòng.</p><p>Nên đóng gói sẵn từ tuần 36 để không bị động khi chuyển dạ bất ngờ.</p>',
             'thumbnail'=>'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&q=80&auto=format&fit=crop',
             'read_time'=>8,'tags'=>'mang thai,checklist,đồ đi sinh',
             'featured'=>0,'popular'=>0,'saved'=>1,'published_at'=>'2026-06-05 09:00:00'],

            ['title'=>'10 kỹ năng tự lập nên dạy con trước 6 tuổi','slug'=>'10-ky-nang-tu-lap-truoc-6-tuoi','category_slug'=>'giao-duc',
             'excerpt'=>'Từ tự xúc ăn đến tự dọn đồ chơi — những kỹ năng nhỏ giúp con tự tin hơn khi vào lớp 1.',
             'content'=>'<p>Từ tự xúc ăn đến tự dọn đồ chơi — những kỹ năng nhỏ giúp con tự tin hơn khi vào lớp 1: tự xúc ăn, tự mặc quần áo đơn giản, tự đi vệ sinh, tự dọn đồ chơi sau khi chơi xong, tự rửa tay đúng cách, tự đeo balo, và biết diễn đạt nhu cầu cơ bản bằng lời.</p><p>Dạy từng kỹ năng một, kiên nhẫn và khen ngợi đúng lúc — đừng làm thay con vì "làm nhanh hơn".</p>',
             'thumbnail'=>'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500&q=80&auto=format&fit=crop',
             'read_time'=>7,'tags'=>'giáo dục sớm,kỹ năng sống,tự lập',
             'featured'=>0,'popular'=>0,'saved'=>1,'published_at'=>'2026-05-28 09:00:00'],

            ['title'=>'Chuẩn bị tâm lý cho con vào lớp 1 — mẹ cần làm gì trước 3 tháng?','slug'=>'chuan-bi-tam-ly-vao-lop-1','category_slug'=>'giao-duc',
             'excerpt'=>'Từ việc làm quen giờ giấc đến rèn kỹ năng ngồi tập trung — lộ trình 3 tháng trước ngày khai giảng.',
             'content'=>'<p>Từ việc làm quen giờ giấc đến rèn kỹ năng ngồi tập trung — lộ trình 3 tháng trước ngày khai giảng: tháng đầu làm quen giờ giấc đi ngủ/thức dậy như lịch học, tháng thứ 2 tập ngồi tập trung 15-20 phút và cầm bút đúng cách, tháng cuối cùng đưa con đi thăm trường, làm quen đường đi và gặp gỡ bạn mới.</p><p>Quan trọng nhất là giữ tinh thần thoải mái, tránh tạo áp lực "phải giỏi ngay" cho con.</p>',
             'thumbnail'=>'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=500&q=80&auto=format&fit=crop',
             'read_time'=>8,'tags'=>'giáo dục sớm,vào lớp 1,tâm lý',
             'featured'=>0,'popular'=>0,'saved'=>1,'published_at'=>'2026-05-20 09:00:00'],
        ];

        foreach ($posts as $p) {
            $this->execute(
                "INSERT INTO posts (title, slug, excerpt, content, thumbnail, category_slug, author_name, author_avatar, author_role, read_time, tags, featured, popular, saved, status, published_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [
                    $p['title'], $p['slug'], $p['excerpt'], $p['content'], $p['thumbnail'], $p['category_slug'],
                    'Hạ Vy', $avatar, 'Mẹ của Kem & Sữa',
                    $p['read_time'], $p['tags'], $p['featured'], $p['popular'], $p['saved'], 'published', $p['published_at'],
                ]
            );
        }
    }

    // ─── Testimonials (ve-toi.html — "Độc giả nói gì", 3 mục) ──────────────
    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $items = [
            ['author_name'=>'Thu Trang','author_meta'=>'Mẹ bé Bống, 8 tháng tuổi',
             'author_avatar'=>'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=140&q=70&auto=format&fit=crop',
             'content'=>'Đọc bài ăn dặm của chị Vy mà mình bớt hẳn áp lực phải làm đúng 100% theo sách vở. Cảm ơn chị vì sự chân thành.',
             'sort_order'=>1],
            ['author_name'=>'Minh Ngọc','author_meta'=>'Mẹ bé Tôm, 4 tháng tuổi',
             'author_avatar'=>'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=140&q=70&auto=format&fit=crop',
             'content'=>'Bài viết về trầm cảm sau sinh giúp mình nhận ra mình không hề đơn độc. Mình đã dám đi khám và tốt hơn rất nhiều.',
             'sort_order'=>2],
            ['author_name'=>'Phương Anh','author_meta'=>'Mẹ 2 bé, TP.HCM',
             'author_avatar'=>'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=140&q=70&auto=format&fit=crop',
             'content'=>'Nhóm kín của Cỏ Non là nơi mình hỏi được nhiều câu ngại hỏi bác sĩ nhất. Các mẹ trong nhóm rất nhiệt tình và không phán xét.',
             'sort_order'=>3],
        ];
        foreach ($items as $t) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_avatar, author_meta, content, sort_order) VALUES (?,?,?,?,?)",
                [$t['author_name'], $t['author_avatar'], $t['author_meta'], $t['content'], $t['sort_order']]
            );
        }
    }

    // ─── FAQ (index.html — mục H, 7 câu) ────────────────────────────────────
    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $items = [
            ['q'=>'Làm sao để mình có thể chia sẻ câu chuyện nuôi con lên Cỏ Non?','a'=>'Gửi bài viết nháp (500–1500 từ) kèm 2–3 ảnh thật tới email hoptac@conon.blog hoặc điền form ở trang Liên hệ. Hạ Vy sẽ đọc và phản hồi trong 5–7 ngày làm việc, ưu tiên những câu chuyện có trải nghiệm thật, cụ thể.'],
            ['q'=>'Cỏ Non đăng bài mới với tần suất như thế nào?','a'=>'Mình cố gắng duy trì 2 bài viết mới mỗi tuần vào thứ Ba và thứ Sáu. Riêng chuyên mục Cẩm nang cập nhật theo quý khi có khuyến nghị mới từ Bộ Y tế hoặc các tổ chức nhi khoa uy tín.'],
            ['q'=>'Mình có thể sử dụng lại nội dung, hình ảnh trên blog không?','a'=>'Bạn có thể trích dẫn tối đa 150 từ kèm link dẫn nguồn về bài viết gốc. Vui lòng không sao chép nguyên bài hoặc dùng cho mục đích thương mại nếu chưa có sự đồng ý bằng văn bản — xem thêm ở trang Điều khoản sử dụng.'],
            ['q'=>'Cỏ Non có nhận hợp tác quảng cáo hoặc review sản phẩm mẹ và bé không?','a'=>'Có, nhưng mình chỉ nhận review những sản phẩm mình thực sự dùng cho Kem và Sữa. Mọi bài viết có yếu tố tài trợ đều được gắn nhãn "Hợp tác" rõ ràng ngay đầu bài — mình không nhận quảng cáo cho sản phẩm chưa qua kiểm định an toàn.'],
            ['q'=>'Làm sao để đăng ký nhận bản tin (newsletter) từ Cỏ Non?','a'=>'Điền email vào ô "Nhận bản tin" ở cuối trang chủ hoặc trang Liên hệ. Mỗi Chủ nhật mình gửi 1 email tổng hợp bài viết trong tuần, không spam, có thể hủy đăng ký bất cứ lúc nào.'],
            ['q'=>'Chính sách bình luận trên Cỏ Non như thế nào?','a'=>'Mình khuyến khích bình luận chia sẻ kinh nghiệm thật. Bình luận công kích cá nhân, spam link hoặc quảng cáo trái phép sẽ bị ẩn/xóa mà không cần báo trước, theo đúng Điều khoản sử dụng của blog.'],
            ['q'=>'Thông tin y khoa trên blog có được chuyên gia kiểm duyệt không?','a'=>'Các bài liên quan sức khỏe, dinh dưỡng, tiêm chủng đều được mình đối chiếu tài liệu của Bộ Y tế, WHO và tham khảo ý kiến bác sĩ nhi khoa quen biết trước khi đăng. Tuy nhiên nội dung mang tính chia sẻ kinh nghiệm cá nhân, không thay thế tư vấn y tế trực tiếp — vui lòng hỏi ý kiến bác sĩ cho tình huống cụ thể của bé.'],
        ];
        foreach ($items as $i => $f) {
            $this->execute(
                "INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)",
                [$f['q'], $f['a'], $i + 1]
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
