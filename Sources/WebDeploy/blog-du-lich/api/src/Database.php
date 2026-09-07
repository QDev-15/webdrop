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
        $this->seedPostCategories();
        $this->seedPosts();
        $this->seedDestinations();
        $this->seedFaqs();
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
            ['site_name', 'Xê Dịch — Travel Journal', 'general'],
            ['site_tagline', 'Nhật ký hành trình, kinh nghiệm du lịch thực tế', 'general'],
            ['site_description', 'Xê Dịch — blog du lịch chia sẻ kinh nghiệm thực tế, điểm đến trong nước & quốc tế, mẹo du lịch tiết kiệm và review lưu trú từ những hành trình có thật.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hello@xedich.vn', 'general'],
            ['site_phone', '0909 123 456', 'general'],
            ['site_address', 'Phường 8, TP. Đà Lạt, tỉnh Lâm Đồng', 'general'],
            ['working_hours', 'Phản hồi email/Zalo trong vòng 24-48h', 'general'],

            // ── SEO ──
            ['meta_title', 'Xê Dịch — Travel Journal | Blog Du Lịch Kinh Nghiệm Thực Tế', 'seo'],
            ['meta_description', 'Xê Dịch — blog du lịch chia sẻ kinh nghiệm thực tế, điểm đến trong nước & quốc tế, mẹo du lịch tiết kiệm và review lưu trú từ những hành trình có thật.', 'seo'],
            ['meta_keywords', 'blog du lịch, kinh nghiệm du lịch, điểm đến trong nước, điểm đến quốc tế, mẹo du lịch tiết kiệm, review lưu trú', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80&auto=format&fit=crop', 'seo'],

            // ── Mạng xã hội ──
            ['facebook', '#', 'social'],
            ['instagram', '#', 'social'],
            ['youtube', '#', 'social'],
            ['zalo_phone', '0909123456', 'social'],

            // ── Footer ──
            ['footer_description', 'Nhật ký hành trình, kinh nghiệm thực tế và những khoảnh khắc đáng nhớ từ khắp các nẻo đường — viết bởi [Lam Trang], một người thích xê dịch hơn là đứng yên.', 'footer'],
            ['footer_copyright', '© 2026 Xê Dịch Travel Journal. Bản quyền thuộc về [Lam Trang].', 'footer'],
            ['footer_newsletter_text', 'Mẹo du lịch & điểm đến mới mỗi tuần, gửi thẳng vào hộp thư của bạn.', 'footer'],

            // ── Tác giả (site-wide — mọi bài viết đều cùng 1 tác giả) ──
            ['author_name', 'Lam Trang', 'author'],
            ['author_avatar', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80&auto=format&fit=crop', 'author'],
            ['author_bio', 'Người sáng lập Xê Dịch — đã đặt chân đến hơn 27 quốc gia và toàn bộ 63 tỉnh thành Việt Nam. Chuyên viết về du lịch bụi, phượt xe máy và du lịch tiết kiệm.', 'author'],

            // ── Liên hệ / Bản đồ ──
            ['map_embed', 'https://maps.google.com/maps?q=11.9404,108.4583&hl=vi&z=14&output=embed', 'contact'],
            ['contact_hero_sub', 'Có câu hỏi, muốn đóng góp bài viết hay đề xuất hợp tác quảng cáo? Gửi tin nhắn cho tôi qua form bên dưới hoặc các kênh liên hệ trực tiếp.', 'contact'],
            ['contact_collab_note', 'Chọn chủ đề "Đề xuất hợp tác" ở form bên cạnh, tôi sẽ phản hồi trong vòng 3-5 ngày làm việc kèm bảng giá.', 'contact'],

            // ── Nội dung — Trang chủ ──
            ['hero_ticker', 'HÀ GIANG · VN|BALI · ID|HỘI AN · VN|KYOTO · JP|SA PA · VN|SANTORINI · GR', 'content'],
            ['home_bento_label', 'Được độc giả yêu thích nhất', 'content'],
            ['home_bento_title', 'Điểm đến *đáng ghi vào sổ tay*', 'content'],
            ['home_bento_sub', '5 điểm đến được nhắc đến nhiều nhất trong hộp thư độc giả gửi về cho Xê Dịch trong năm qua.', 'content'],
            ['home_guide_label', 'Cẩm nang du lịch', 'content'],
            ['home_guide_title', 'Đọc trước khi *xách balo lên đường*', 'content'],
            ['home_guide1_title', 'Chuẩn bị visa & giấy tờ trước chuyến đi', 'content'],
            ['home_guide1_desc', 'Những loại giấy tờ cần photo công chứng, thời gian xin visa tối thiểu.', 'content'],
            ['home_guide1_time', '5 phút đọc', 'content'],
            ['home_guide2_title', 'Cách đặt vé máy bay giá tốt không cần công cụ trả phí', 'content'],
            ['home_guide2_desc', '3 thời điểm trong tuần vé rẻ nhất và mẹo dùng ẩn danh trình duyệt.', 'content'],
            ['home_guide2_time', '7 phút đọc', 'content'],
            ['home_guide3_title', 'Checklist đóng gói hành lý gọn nhẹ', 'content'],
            ['home_guide3_desc', 'Danh sách vật dụng cần thiết cho chuyến đi ngắn ngày lẫn dài ngày.', 'content'],
            ['home_guide3_time', '6 phút đọc', 'content'],
            ['home_guide4_title', 'Bảo hiểm du lịch — mua loại nào, khi nào cần?', 'content'],
            ['home_guide4_desc', 'So sánh các gói bảo hiểm phổ biến và tình huống nên mua thêm.', 'content'],
            ['home_guide4_time', '8 phút đọc', 'content'],
            ['home_guide5_title', 'An toàn khi du lịch một mình dành cho phái nữ', 'content'],
            ['home_guide5_desc', 'Kinh nghiệm thực tế sau hơn 20 chuyến đi solo của tác giả.', 'content'],
            ['home_guide5_time', '9 phút đọc', 'content'],
            ['home_stat1_number', '27', 'content'], ['home_stat1_suffix', '+', 'content'], ['home_stat1_label', 'Quốc gia đã đặt chân', 'content'],
            ['home_stat2_number', '184', 'content'], ['home_stat2_suffix', '', 'content'], ['home_stat2_label', 'Bài viết đã xuất bản', 'content'],
            ['home_stat3_number', '6', 'content'], ['home_stat3_suffix', '', 'content'], ['home_stat3_label', 'Năm cầm bút viết blog', 'content'],
            ['home_stat4_number', '42', 'content'], ['home_stat4_suffix', 'K', 'content'], ['home_stat4_label', 'Độc giả nhận bản tin', 'content'],
            ['home_newsletter_title', 'Đừng bỏ lỡ *hành trình tiếp theo*', 'content'],
            ['home_newsletter_sub', 'Đăng ký nhận bản tin để cập nhật bài viết mới, mẹo du lịch độc quyền và ưu đãi từ các đối tác lữ hành của Xê Dịch.', 'content'],

            // ── Nội dung — Trang Chuyên mục ──
            ['categories_hero_sub', 'Duyệt bài viết theo từng chủ đề — điểm đến trong nước, quốc tế, mẹo du lịch, review lưu trú và ẩm thực vùng miền.', 'content'],

            // ── Nội dung — Trang Cẩm nang du lịch ──
            ['guide_hero_sub', 'Toàn bộ kinh nghiệm được đúc kết từ hàng trăm chuyến đi thực tế — từ chuẩn bị giấy tờ, đóng gói hành lý đến cách tiết kiệm chi phí và giữ an toàn cho bản thân.', 'content'],
            ['guide_feature1_icon', '🛂', 'content'], ['guide_feature1_title', 'Chuẩn bị visa & giấy tờ', 'content'],
            ['guide_feature1_text', 'Kiểm tra hạn hộ chiếu (còn ít nhất 6 tháng), tra cứu chính sách visa của điểm đến và chuẩn bị hồ sơ tối thiểu 4-6 tuần trước ngày bay.', 'content'],
            ['guide_feature2_icon', '🎟️', 'content'], ['guide_feature2_title', 'Đặt vé & chỗ ở', 'content'],
            ['guide_feature2_text', 'Đặt vé máy bay trước 6-8 tuần để có giá tốt, đặt chỗ ở có chính sách huỷ miễn phí để linh hoạt thay đổi lịch trình.', 'content'],
            ['guide_feature3_icon', '🎒', 'content'], ['guide_feature3_title', 'Đóng gói hành lý', 'content'],
            ['guide_feature3_text', 'Ưu tiên quần áo đa năng, mặc được nhiều lớp. Balo 40L là đủ cho hầu hết chuyến đi dưới 2 tuần dù đi bất kỳ mùa nào.', 'content'],
            ['guide_feature4_icon', '🛡️', 'content'], ['guide_feature4_title', 'Bảo hiểm du lịch', 'content'],
            ['guide_feature4_text', 'Bắt buộc với các nước yêu cầu (khối Schengen), nên có với mọi chuyến đi xa để phòng rủi ro y tế và huỷ chuyến bất khả kháng.', 'content'],
            ['guide_strip1_label', 'Ngân sách chuyến đi', 'content'],
            ['guide_strip1_title', 'Mẹo tiết kiệm chi phí khi du lịch bụi', 'content'],
            ['guide_strip1_text1', 'Đặt vé máy bay vào khung giờ đêm hoặc sáng sớm thường rẻ hơn 15-20%. Ăn tại quán ăn địa phương thay vì khu du lịch giúp giảm một nửa chi phí ăn uống. Nếu đi nhóm từ 3 người trở lên, thuê căn hộ nguyên căn qua các nền tảng đặt phòng thường rẻ hơn đặt riêng từng phòng khách sạn.', 'content'],
            ['guide_strip1_text2', 'Một mẹo ít người để ý: đổi tiền tại quầy trong sân bay luôn có tỷ giá kém nhất — chỉ nên đổi một khoản nhỏ đủ dùng cho vài giờ đầu, phần còn lại đổi tại tiệm vàng hoặc rút ATM tại trung tâm thành phố.', 'content'],
            ['guide_strip1_image', 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=700&q=80&auto=format&fit=crop', 'content'],
            ['guide_strip2_label', 'Chọn chỗ ở', 'content'],
            ['guide_strip2_title', 'Cách chọn chỗ ở phù hợp với từng kiểu chuyến đi', 'content'],
            ['guide_strip2_text1', 'Đi một mình muốn giao lưu — chọn hostel có khu sinh hoạt chung. Đi cùng gia đình có trẻ nhỏ — ưu tiên homestay/căn hộ có bếp riêng. Đi nghỉ dưỡng thuần tuý — resort xa trung tâm thường yên tĩnh hơn nhưng cần tính thêm chi phí di chuyển.', 'content'],
            ['guide_strip2_text2', 'Luôn đọc ít nhất 10 đánh giá gần nhất (không chỉ đánh giá 5 sao) và chú ý các bình luận nhắc đến vị trí thực tế, tiếng ồn và wifi — ba yếu tố hay bị mô tả sai lệch trong ảnh quảng cáo.', 'content'],
            ['guide_strip2_image', 'https://images.unsplash.com/photo-1541417904950-b855846fe074?w=700&q=80&auto=format&fit=crop', 'content'],
            ['guide_strip3_label', 'An toàn', 'content'],
            ['guide_strip3_title', 'An toàn khi du lịch một mình dành cho phái nữ', 'content'],
            ['guide_strip3_text1', 'Luôn chia sẻ lịch trình chi tiết (địa chỉ chỗ ở, giờ di chuyển) cho ít nhất một người thân qua tin nhắn định kỳ mỗi ngày. Tránh di chuyển một mình vào ban đêm ở khu vực chưa quen thuộc, ưu tiên gọi xe qua ứng dụng thay vì bắt xe ngoài đường.', 'content'],
            ['guide_strip3_text2', 'Mang theo bản photo hộ chiếu để riêng với bản gốc, lưu số hotline đại sứ quán Việt Nam tại nước sở tại trong điện thoại trước khi khởi hành — đây là việc nhỏ nhưng cứu bạn rất nhiều trong tình huống khẩn cấp.', 'content'],
            ['guide_strip3_image', 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=700&q=80&auto=format&fit=crop', 'content'],
            ['guide_timeline1_label', 'Bước 1 · 2-3 tháng trước', 'content'],
            ['guide_timeline1_title', 'Chọn điểm đến & xác định ngân sách', 'content'],
            ['guide_timeline1_text', 'Liệt kê 2-3 điểm đến mong muốn, so sánh chi phí sinh hoạt trung bình và chọn ra điểm phù hợp nhất với ngân sách hiện có.', 'content'],
            ['guide_timeline2_label', 'Bước 2 · 6-8 tuần trước', 'content'],
            ['guide_timeline2_title', 'Đặt vé máy bay & xin visa (nếu cần)', 'content'],
            ['guide_timeline2_text', 'Đây là hai việc tốn thời gian xử lý nhất, nên làm sớm để tránh giá vé tăng và kịp thời gian xét duyệt visa.', 'content'],
            ['guide_timeline3_label', 'Bước 3 · 4-6 tuần trước', 'content'],
            ['guide_timeline3_title', 'Đặt chỗ ở & phương tiện di chuyển', 'content'],
            ['guide_timeline3_text', 'Ưu tiên chỗ ở có chính sách huỷ linh hoạt. Đặt trước thuê xe/tàu xe cho những chặng di chuyển giữa các thành phố.', 'content'],
            ['guide_timeline4_label', 'Bước 4 · 2-3 tuần trước', 'content'],
            ['guide_timeline4_title', 'Lên lịch trình chi tiết từng ngày', 'content'],
            ['guide_timeline4_text', 'Không cần kín lịch từng giờ, nhưng nên xác định các điểm tham quan chính và mua vé trước cho những nơi hay hết chỗ.', 'content'],
            ['guide_timeline5_label', 'Bước 5 · 1 tuần trước', 'content'],
            ['guide_timeline5_title', 'Đóng gói hành lý & chuẩn bị giấy tờ', 'content'],
            ['guide_timeline5_text', 'Kiểm tra lại toàn bộ checklist hành lý, in/lưu offline vé máy bay, xác nhận đặt phòng và bảo hiểm du lịch.', 'content'],
            ['guide_timeline6_label', 'Bước 6 · Trong chuyến đi', 'content'],
            ['guide_timeline6_title', 'Linh hoạt điều chỉnh theo thực tế', 'content'],
            ['guide_timeline6_text', 'Lịch trình chỉ là khung tham khảo — luôn dành thời gian trống để phản ứng với thời tiết, sức khoẻ hoặc những khám phá bất ngờ dọc đường.', 'content'],
            ['guide_cta_title', 'Nhận cẩm nang du lịch *mới mỗi tuần*', 'content'],
            ['guide_cta_text', 'Đăng ký để nhận thêm những mẹo du lịch chuyên sâu không đăng công khai trên blog, gửi thẳng vào email của bạn.', 'content'],

            // ── Nội dung — Trang Về tôi ──
            ['about_hero_sub', 'Người viết ra từng dòng nhật ký trên Xê Dịch — không phải một công ty du lịch, chỉ là một người thích đi hơn là đứng yên.', 'content'],
            ['about_strip_label', 'Xin chào, tôi là Lam Trang', 'content'],
            ['about_strip_title', 'Từ nhân viên văn phòng đến người viết blog toàn thời gian', 'content'],
            ['about_strip_text1', 'Tôi từng là nhân viên marketing tại một công ty ở TP.HCM, sống đúng nhịp "sáng đi làm, tối về nhà" như bao người. Mọi thứ thay đổi sau chuyến phượt Hà Giang đầu tiên vào năm 2019 — lần đầu tiên tôi hiểu cảm giác đứng trước một điều gì đó lớn hơn cả những deadline và họp hành.', 'content'],
            ['about_strip_text2', 'Năm 2020, tôi quyết định nghỉ việc, dùng khoản tiết kiệm ít ỏi để bắt đầu Xê Dịch — nơi tôi ghi lại từng chuyến đi, từng bài học, và cả những lần lạc đường không hề có trong kế hoạch.', 'content'],
            ['about_strip_image', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=700&q=80&auto=format&fit=crop', 'content'],
            ['about_stat1_number', '27', 'content'], ['about_stat1_suffix', '+', 'content'], ['about_stat1_label', 'Quốc gia đã đặt chân', 'content'],
            ['about_stat2_number', '63', 'content'], ['about_stat2_suffix', '', 'content'], ['about_stat2_label', 'Tỉnh thành Việt Nam', 'content'],
            ['about_stat3_number', '6', 'content'], ['about_stat3_suffix', '', 'content'], ['about_stat3_label', 'Năm viết blog toàn thời gian', 'content'],
            ['about_stat4_number', '184', 'content'], ['about_stat4_suffix', '', 'content'], ['about_stat4_label', 'Bài viết đã xuất bản', 'content'],
            ['about_timeline1_year', '2019', 'content'], ['about_timeline1_title', 'Chuyến phượt Hà Giang đầu tiên', 'content'],
            ['about_timeline1_text', 'Chuyến đi thay đổi cách tôi nhìn về công việc và cuộc sống — điểm khởi đầu cho mọi thứ sau này.', 'content'],
            ['about_timeline2_year', '2020', 'content'], ['about_timeline2_title', 'Nghỉ việc, sáng lập blog Xê Dịch', 'content'],
            ['about_timeline2_text', 'Ra mắt bài viết đầu tiên với vỏn vẹn 12 lượt xem — không ai ngờ 6 năm sau nó trở thành công việc chính.', 'content'],
            ['about_timeline3_year', '2021', 'content'], ['about_timeline3_title', 'Chuyến đi quốc tế đầu tiên — Thái Lan', 'content'],
            ['about_timeline3_text', 'Chuyến xuất ngoại đầu tiên với ngân sách chỉ 6 triệu đồng cho 5 ngày, viết thành loạt bài "du lịch tiết kiệm" được chia sẻ nhiều nhất năm đó.', 'content'],
            ['about_timeline4_year', '2023', 'content'], ['about_timeline4_title', 'Đạt mốc 20 quốc gia', 'content'],
            ['about_timeline4_text', 'Xê Dịch bắt đầu nhận được những lời mời hợp tác đầu tiên từ các thương hiệu lữ hành và bảo hiểm du lịch.', 'content'],
            ['about_timeline5_year', '2026', 'content'], ['about_timeline5_title', 'Hiện tại — 27 quốc gia, 184 bài viết', 'content'],
            ['about_timeline5_text', 'Vẫn tiếp tục đi, tiếp tục viết — và vẫn đang tìm câu trả lời cho câu hỏi "chuyến đi tiếp theo sẽ ở đâu?"', 'content'],
            ['about_gear1_name', 'Máy ảnh Fujifilm X-T30', 'content'], ['about_gear1_desc', 'Nhỏ gọn, màu film mô phỏng đẹp, đủ dùng cho ảnh blog và video ngắn.', 'content'], ['about_gear1_meta', 'Từ 2020', 'content'],
            ['about_gear2_name', 'Balo Osprey Farpoint 40L', 'content'], ['about_gear2_desc', 'Vừa đủ mang xách tay lên máy bay, không phải ký gửi hành lý.', 'content'], ['about_gear2_meta', 'Từ 2019', 'content'],
            ['about_gear3_name', 'MacBook Air M1', 'content'], ['about_gear3_desc', 'Viết bài, dựng ảnh ngay trên đường đi, pin đủ dùng cả ngày không cần sạc.', 'content'], ['about_gear3_meta', 'Từ 2021', 'content'],
            ['about_gear4_name', 'Giày trekking Salomon', 'content'], ['about_gear4_desc', 'Bám đường tốt cho những cung đường đèo trơn trượt và trekking dài ngày.', 'content'], ['about_gear4_meta', 'Từ 2022', 'content'],
            ['about_gear5_name', 'Ổ cứng di động 2TB', 'content'], ['about_gear5_desc', 'Backup ảnh/video ngay trong chuyến đi, tránh mất dữ liệu nếu hỏng thẻ nhớ.', 'content'], ['about_gear5_meta', 'Từ 2020', 'content'],
            ['about_cta_title', 'Có câu chuyện muốn *chia sẻ cùng tôi?*', 'content'],
            ['about_cta_text', 'Dù là góp ý bài viết, đề xuất hợp tác hay chỉ đơn giản là muốn hỏi đường — tôi luôn sẵn sàng lắng nghe.', 'content'],

            // ── Pháp lý ──
            ['legal_updated', '20/08/2026', 'legal'],
            ['privacy_content', "<h2>1. Thông tin chúng tôi thu thập</h2><p>Khi bạn đăng ký nhận bản tin, để lại bình luận hoặc gửi tin nhắn qua form liên hệ, chúng tôi thu thập các thông tin bạn chủ động cung cấp: họ tên, địa chỉ email, nội dung tin nhắn. Chúng tôi cũng thu thập dữ liệu truy cập ẩn danh (trang được xem, thời gian truy cập, trình duyệt) thông qua công cụ phân tích website để cải thiện trải nghiệm đọc.</p><h2>2. Mục đích sử dụng thông tin</h2><ul><li>Gửi bản tin email theo đúng tần suất đã thông báo (tối đa 1 email/tuần).</li><li>Phản hồi câu hỏi, góp ý hoặc đề xuất hợp tác gửi qua form liên hệ.</li><li>Phân tích lượng truy cập để cải thiện nội dung và trải nghiệm đọc bài.</li></ul><h2>3. Chia sẻ thông tin với bên thứ ba</h2><p>Chúng tôi không bán, cho thuê hoặc trao đổi thông tin cá nhân của độc giả cho bất kỳ bên thứ ba nào vì mục đích thương mại. Thông tin chỉ được chia sẻ với đối tác kỹ thuật (nền tảng gửi email, lưu trữ website) ở mức cần thiết để vận hành dịch vụ, và các đối tác này đều có cam kết bảo mật riêng.</p><h2>4. Cookie</h2><p>Website sử dụng cookie cơ bản để ghi nhớ trạng thái đăng ký bản tin và thống kê lượt truy cập ẩn danh. Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy nhiên một số tính năng của trang có thể không hoạt động đầy đủ.</p><h2>5. Quyền của độc giả</h2><p>Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xoá thông tin cá nhân của mình bất kỳ lúc nào bằng cách gửi yêu cầu qua trang Liên hệ. Với bản tin email, bạn có thể huỷ đăng ký ngay trong email nhận được chỉ với 1 cú click, không cần liên hệ thêm.</p><h2>6. Bảo mật dữ liệu</h2><p>Chúng tôi áp dụng các biện pháp kỹ thuật hợp lý để bảo vệ thông tin cá nhân khỏi truy cập trái phép. Tuy nhiên không có phương thức truyền tải dữ liệu qua internet nào an toàn tuyệt đối 100%.</p><h2>7. Liên hệ về chính sách bảo mật</h2><p>Nếu có bất kỳ thắc mắc nào về chính sách này, vui lòng liên hệ qua email <strong>hello@xedich.vn</strong> hoặc trang Liên hệ.</p>", 'legal'],
            ['terms_content', "<h2>1. Chấp nhận điều khoản</h2><p>Bằng việc truy cập và sử dụng website Xê Dịch Travel Journal, bạn đồng ý tuân thủ các điều khoản sử dụng được nêu dưới đây. Nếu không đồng ý, vui lòng ngừng sử dụng website.</p><h2>2. Bản quyền nội dung</h2><p>Toàn bộ bài viết, hình ảnh, video trên website (trừ khi có ghi chú nguồn khác) thuộc bản quyền của Xê Dịch Travel Journal và tác giả Lam Trang. Nghiêm cấm sao chép, đăng tải lại toàn bộ bài viết dưới bất kỳ hình thức nào mà không có sự cho phép bằng văn bản.</p><ul><li>Được phép trích dẫn một đoạn ngắn (dưới 100 từ) kèm liên kết dẫn về bài viết gốc.</li><li>Việc sử dụng hình ảnh cho mục đích thương mại cần liên hệ xin phép trước.</li><li>Vi phạm bản quyền sẽ bị yêu cầu gỡ bỏ nội dung và có thể bị xử lý theo quy định pháp luật hiện hành.</li></ul><h2>3. Tính chính xác của thông tin</h2><p>Thông tin về giá vé, chi phí, lịch trình trong các bài viết được ghi nhận tại thời điểm tác giả trải nghiệm thực tế và có thể thay đổi theo thời gian. Xê Dịch không chịu trách nhiệm về sai lệch phát sinh do giá cả, chính sách của bên thứ ba (hãng bay, khách sạn, đơn vị lữ hành) thay đổi sau thời điểm bài viết được xuất bản.</p><h2>4. Nội dung hợp tác/tài trợ</h2><p>Mọi bài viết có yếu tố hợp tác thương mại hoặc nhận tài trợ đều được gắn nhãn \"Nội dung hợp tác\" rõ ràng ngay đầu bài. Quan điểm, đánh giá trong các bài viết này vẫn phản ánh trải nghiệm và ý kiến cá nhân trung thực của tác giả.</p><h2>5. Bình luận của độc giả</h2><p>Độc giả chịu trách nhiệm về nội dung bình luận do mình đăng tải. Xê Dịch có quyền xoá bỏ bình luận chứa nội dung spam, quảng cáo trái phép, ngôn từ phản cảm hoặc vi phạm pháp luật mà không cần thông báo trước.</p><h2>6. Giới hạn trách nhiệm</h2><p>Xê Dịch cung cấp thông tin mang tính chất tham khảo dựa trên trải nghiệm cá nhân, không phải lời khuyên chuyên môn thay thế cho tư vấn của cơ quan lãnh sự, hãng bảo hiểm hoặc đơn vị lữ hành chính thức. Độc giả tự chịu trách nhiệm khi áp dụng thông tin vào chuyến đi thực tế của mình.</p><h2>7. Thay đổi điều khoản</h2><p>Xê Dịch có quyền cập nhật, thay đổi các điều khoản này bất kỳ lúc nào mà không cần báo trước. Phiên bản mới nhất luôn được đăng tải tại trang này kèm ngày cập nhật.</p>", 'legal'],

            // ── SMTP ──
            ['smtp_host', '', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from_name', 'Xê Dịch Travel Journal', 'smtp'],
            ['smtp_from_email', '', 'smtp'],

            // ── Nâng cao ──
            ['maintenance_mode', '0', 'system'],
            ['items_per_page', '12', 'system'],

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

    // ─── Hero Slides (4 slide — H11 Full-Width Text) ────────────────────────
    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        // subtitle format: "label||desc||primaryText||primaryLink||tone"
        // button_text/button_link (core columns) = nút OUTLINE thứ 2 của mỗi slide.
        $slides = [
            [
                'title' => 'Những Miền Đất *Chưa Kể*',
                'subtitle' => 'Travel Journal Việt Nam||Nhật ký hành trình, kinh nghiệm thực tế và những khoảnh khắc đáng nhớ từ khắp các nẻo đường — từ cao nguyên đá phía Bắc đến đồng bằng miền Tây sông nước.||Khám phá bài viết||/chuyen-muc||forest',
                'button_text' => 'Cẩm nang du lịch',
                'button_link' => '/cam-nang-du-lich',
                'image' => '',
                'sort_order' => 1,
            ],
            [
                'title' => 'Xách Ba Lô Ra *Thế Giới*',
                'subtitle' => 'Điểm đến quốc tế||Từ ruộng bậc thang Bali đến những con phố cổ Kyoto — mỗi hành trình là một câu chuyện đáng để kể lại, kèm chi phí thực tế cho từng chặng.||Xem điểm đến quốc tế||/chuyen-muc?cat=quoc-te||temple',
                'button_text' => 'Đọc cẩm nang visa',
                'button_link' => '/cam-nang-du-lich',
                'image' => '',
                'sort_order' => 2,
            ],
            [
                'title' => 'Đi Xa Nhưng *Không Lo Cháy Túi*',
                'subtitle' => 'Mẹo du lịch||Bí quyết săn vé máy bay giá tốt, chọn chỗ ở tiết kiệm và lên lịch trình hợp lý cho mọi chuyến đi — dù ngân sách của bạn là bao nhiêu.||Xem mẹo du lịch||/cam-nang-du-lich||trail',
                'button_text' => 'Đọc bài viết liên quan',
                'button_link' => '/chuyen-muc?cat=meo-du-lich',
                'image' => '',
                'sort_order' => 3,
            ],
            [
                'title' => 'Ở Đâu Cho *Trọn Vẹn Chuyến Đi*',
                'subtitle' => 'Review lưu trú||Review thật từ homestay vùng cao đến resort ven biển — chọn đúng chỗ ở, chuyến đi mới thực sự trọn vẹn.||Xem review lưu trú||/chuyen-muc?cat=review-luu-tru||lantern',
                'button_text' => 'Gợi ý cho tôi chỗ ở',
                'button_link' => '/lien-he',
                'image' => '',
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

    // ─── Post Categories (5 chuyên mục) ─────────────────────────────────────
    private function seedPostCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM post_categories") > 0) return;
        $cats = [
            ['name' => 'Điểm đến trong nước', 'slug' => 'trong-nuoc',      'icon' => '🏔️', 'tag_class' => 'domestic', 'sort_order' => 1],
            ['name' => 'Điểm đến quốc tế',    'slug' => 'quoc-te',         'icon' => '🌏', 'tag_class' => 'intl',     'sort_order' => 2],
            ['name' => 'Mẹo du lịch',         'slug' => 'meo-du-lich',     'icon' => '🎒', 'tag_class' => 'tips',     'sort_order' => 3],
            ['name' => 'Review lưu trú',      'slug' => 'review-luu-tru',  'icon' => '🏡', 'tag_class' => 'stay',     'sort_order' => 4],
            ['name' => 'Ẩm thực vùng miền',   'slug' => 'am-thuc',         'icon' => '🍜', 'tag_class' => 'food',     'sort_order' => 5],
        ];
        foreach ($cats as $c) {
            $this->execute(
                "INSERT INTO post_categories (name, slug, icon, tag_class, sort_order) VALUES (?, ?, ?, ?, ?)",
                [$c['name'], $c['slug'], $c['icon'], $c['tag_class'], $c['sort_order']]
            );
        }
    }

    // ─── Posts (15 bài — 3 bài/chuyên mục, nội dung thực từ template) ───────
    private function seedPosts(): void {
        if ($this->scalar("SELECT COUNT(*) FROM posts") > 0) return;

        $catId = [];
        foreach ($this->query("SELECT id, slug FROM post_categories") as $r) { $catId[$r['slug']] = $r['id']; }

        $dongVanContent = <<<HTML
<p>Hà Giang loop không phải là cung đường dễ đi — nhưng chính vì vậy nó luôn nằm trong danh sách "phải đi một lần trong đời" của dân phượt Việt Nam. Sau ba lần quay lại vùng đất cao nguyên đá này, tôi quyết định gói ghém toàn bộ kinh nghiệm vào một lịch trình 7 ngày mà bất kỳ ai — kể cả người mới lái xe máy đường đèo lần đầu — cũng có thể theo được, miễn là chuẩn bị kỹ.</p>
<h2>Vì sao Hà Giang loop luôn nằm đầu danh sách</h2>
<p>Khác với những điểm đến du lịch đã "thương mại hoá", Hà Giang vẫn giữ được vẻ hoang sơ gần như nguyên vẹn. Những thửa ruộng bậc thang xen giữa vách đá tai mèo, những phiên chợ vùng cao họp mỗi tuần một lần, và những khúc cua tay áo nhìn xuống vực sâu hàng trăm mét — tất cả tạo nên một trải nghiệm mà không cung đường nào khác ở Việt Nam có được.</p>
<blockquote>"Đi Hà Giang không phải để check-in. Đi Hà Giang là để tự hỏi mình nhỏ bé đến nhường nào trước thiên nhiên."</blockquote>
<h2>Lịch trình chi tiết 7 ngày</h2>
<ol>
<li><strong>Ngày 1 — Hà Nội → TP. Hà Giang:</strong> Xe khách giường nằm khởi hành lúc 21h-22h từ bến xe Mỹ Đình, tới nơi khoảng 5h sáng. Nghỉ ngơi, thuê xe máy, làm quen với xe trước khi lên đường.</li>
<li><strong>Ngày 2 — TP. Hà Giang → Đồng Văn (qua Quản Bạ, Yên Minh):</strong> Dừng chân ở Cổng Trời Quản Bạ ngắm Núi Đôi, ăn trưa tại Yên Minh, chiều tối đến phố cổ Đồng Văn.</li>
<li><strong>Ngày 3 — Đồng Văn → Lũng Cú → Đồng Văn:</strong> Sáng sớm chinh phục cột cờ Lũng Cú — điểm cực Bắc của Tổ quốc, chiều dạo phố cổ Đồng Văn, thưởng thức thắng cố và rượu ngô.</li>
<li><strong>Ngày 4 — Đồng Văn → Mèo Vạc (qua đèo Mã Pí Lèng):</strong> Cung đường đẹp và nguy hiểm nhất hành trình. Dừng lại ở mỏm đá Mã Pí Lèng Panorama để ngắm toàn cảnh sông Nho Quế uốn lượn dưới hẻm vực Tu Sản.</li>
<li><strong>Ngày 5 — Mèo Vạc → Du Già:</strong> Cung đường ít khách du lịch hơn, xuyên qua những bản làng người Mông, cảnh sắc yên bình hơn hẳn.</li>
<li><strong>Ngày 6 — Du Già → Sủng Là → TP. Hà Giang:</strong> Ghé thăm ngôi nhà cổ trong phim "Chuyện của Pao" tại Sủng Là trước khi quay về thành phố trả xe.</li>
<li><strong>Ngày 7 — TP. Hà Giang → Hà Nội:</strong> Bắt xe khách buổi tối, kết thúc hành trình.</li>
</ol>
<figure><img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80&auto=format&fit=crop" alt="Cung đường đèo Mã Pí Lèng nhìn xuống hẻm vực sông Nho Quế"><figcaption>Đèo Mã Pí Lèng nhìn xuống hẻm vực Tu Sản — một trong tứ đại đỉnh đèo của Việt Nam</figcaption></figure>
<h2>Chi phí thực tế cho chuyến đi</h2>
<p>Đây là bảng chi phí tôi thực chi cho chuyến đi gần nhất (2 người, đi xe máy, ở homestay):</p>
<ul>
<li>Xe khách giường nằm khứ hồi Hà Nội – Hà Giang: <strong>~700.000đ/người</strong></li>
<li>Thuê xe máy số 7 ngày (bao xăng tự đổ): <strong>~900.000đ/xe</strong></li>
<li>Chỗ ở (homestay/nhà nghỉ, trung bình 5 đêm): <strong>~1.500.000đ/người</strong></li>
<li>Ăn uống dọc đường: <strong>~1.200.000đ/người</strong></li>
<li>Vé tham quan (Cột cờ Lũng Cú, một số điểm dừng): <strong>~150.000đ/người</strong></li>
</ul>
<p>Tổng cộng khoảng <strong>4,5 triệu đồng/người</strong> cho hành trình 7 ngày — mức chi phí có thể thấp hơn nếu bạn đi nhóm đông và ở dorm thay vì phòng riêng.</p>
<h2>Những lưu ý quan trọng khi tự lái xe máy</h2>
<ul>
<li>Kiểm tra phanh và lốp xe kỹ trước khi khởi hành — cung đường có nhiều đoạn dốc dài và cua gấp liên tục.</li>
<li>Không chạy xe vào buổi tối muộn hoặc khi trời có sương mù dày — tầm nhìn trên đèo rất hạn chế.</li>
<li>Luôn đổ đầy bình xăng mỗi khi có trạm — một số đoạn giữa các thị trấn không có cây xăng trong bán kính 40-50km.</li>
<li>Mang theo áo mưa, áo ấm dù đi vào mùa hè — nhiệt độ trên cao nguyên đá chênh lệch rất lớn giữa ngày và đêm.</li>
<li>Xin giấy phép vào khu vực biên giới (nếu có) tại trạm kiểm soát trên đường đến Lũng Cú.</li>
</ul>
HTML;
        $dongVanGallery = implode('|', [
            'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1520962880247-cfaf541c8724?w=600&q=80&auto=format&fit=crop',
        ]);

        $posts = [
            // ── trong-nuoc ──
            ['cat' => 'trong-nuoc', 'title' => '7 Ngày Khám Phá Cao Nguyên Đá Đồng Văn — Cung Đường Hà Giang Trọn Vẹn Nhất',
             'slug' => '7-ngay-cao-nguyen-da-dong-van', 'thumbnail' => 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&q=80&auto=format&fit=crop',
             'excerpt' => 'Từ đèo Mã Pí Lèng đến cột cờ Lũng Cú, đây là lịch trình chi tiết 7 ngày kèm chi phí thực tế, chỗ nghỉ và những lưu ý sống còn khi tự lái xe máy qua cung đường hiểm trở nhất Việt Nam.',
             'content' => $dongVanContent, 'gallery' => $dongVanGallery,
             'tags' => 'Hà Giang|Phượt xe máy|Điểm đến trong nước|Lịch trình chi tiết|Miền núi phía Bắc',
             'read_time' => 12, 'date' => '2026-08-18', 'updated' => '20/08/2026', 'featured' => 1],

            ['cat' => 'trong-nuoc', 'title' => 'Kinh Nghiệm Du Thuyền Ngủ Đêm Trên Vịnh Hạ Long',
             'slug' => 'du-thuyen-ngu-dem-vinh-ha-long', 'thumbnail' => 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=700&q=80&auto=format&fit=crop',
             'excerpt' => 'Nên chọn du thuyền hạng nào, đặt trước bao lâu và lịch trình 2 ngày 1 đêm chuẩn nhất.',
             'content' => "<p>Ngủ đêm trên vịnh Hạ Long là trải nghiệm khác hẳn việc đi tour trong ngày — bạn được đón bình minh giữa hàng nghìn hòn đảo đá vôi, chèo kayak vào những hang động chỉ tàu nhỏ mới vào được, và ăn tối trên boong tàu khi mặt trời lặn phía sau những dãy núi đá. Nhưng chọn sai du thuyền cũng có thể biến chuyến đi thành một trải nghiệm cưỡi 'tàu chợ' đông đúc, ồn ào.</p><h2>Nên chọn hạng du thuyền nào</h2><p>Du thuyền ở Hạ Long chia làm 3 phân khúc rõ rệt: hạng phổ thông (1.5-2.5 triệu/người/2N1Đ, phòng đơn giản, phù hợp ngân sách sinh viên), hạng trung (3-5 triệu, phòng có ban công riêng, chất lượng đồ ăn tốt hơn) và hạng cao cấp/du thuyền 5 sao (trên 6 triệu, có bồn tắm, spa trên tàu). Với đa số du khách lần đầu, hạng trung là lựa chọn cân bằng nhất giữa trải nghiệm và chi phí.</p><h2>Đặt trước bao lâu là hợp lý</h2><p>Nên đặt trước tối thiểu 2-3 tuần vào mùa cao điểm (tháng 3-4 và 9-11), vì các du thuyền có ban công đẹp thường hết chỗ rất nhanh. Vào mùa thấp điểm (tháng 6-8, dù là hè nhưng lại là mùa mưa bão ở vịnh), bạn có thể đặt sát ngày và thường được giảm giá 15-20%.</p><h2>Lịch trình 2 ngày 1 đêm chuẩn</h2><p>Ngày 1: lên tàu buổi trưa, ăn trưa trên tàu, tham quan hang Sửng Sốt hoặc hang Luồn, chèo kayak, ăn tối và ngắm hoàng hôn. Ngày 2: dậy sớm tập Thái Cực Quyền trên boong, ăn sáng, ghé đảo Ti Tốp hoặc làng chài Cửa Vạn, ăn trưa và về bờ trước 12h trưa. Một số du thuyền cao cấp có thêm lớp học nấu ăn hoặc câu mực đêm — hỏi kỹ trước khi đặt nếu bạn quan tâm đến các hoạt động này.</p>",
             'gallery' => '', 'tags' => 'Vịnh Hạ Long|Du thuyền|Điểm đến trong nước|Review lưu trú',
             'read_time' => 8, 'date' => '2026-07-22', 'updated' => '', 'featured' => 0],

            ['cat' => 'trong-nuoc', 'title' => 'Phú Quốc Mùa Nào Đẹp Nhất — Đi Tháng Mấy Để Tránh Mưa?',
             'slug' => 'phu-quoc-mua-nao-dep-nhat', 'thumbnail' => 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=700&q=80&auto=format&fit=crop',
             'excerpt' => 'Phân tích thời tiết theo tháng và gợi ý lịch trình 4 ngày 3 đêm tiết kiệm.',
             'content' => "<p>Phú Quốc có 2 mùa rõ rệt: mùa khô (tháng 11 đến tháng 4) và mùa mưa (tháng 5 đến tháng 10). Nếu mục tiêu của bạn là biển xanh cát trắng nắng đẹp xuyên suốt chuyến đi, mùa khô — đặc biệt là từ tháng 12 đến tháng 3 — là lựa chọn an toàn nhất, biển lặng, thuận lợi cho việc ra các đảo nhỏ lặn ngắm san hô.</p><h2>Mùa mưa có đáng tránh hoàn toàn không</h2><p>Không hẳn. Mùa mưa ở Phú Quốc thường mưa rào buổi chiều rồi tạnh, sáng vẫn nắng đẹp để tắm biển. Đổi lại, giá phòng giảm 30-40% so với mùa cao điểm, các bãi biển vắng khách hơn hẳn — phù hợp nếu bạn ưu tiên tiết kiệm chi phí và không ngại thay đổi lịch trình linh hoạt theo thời tiết.</p><h2>Lịch trình 4 ngày 3 đêm tiết kiệm</h2><p>Ngày 1: nhận phòng, dạo chợ đêm Dinh Cậu. Ngày 2: tour 4 đảo lặn ngắm san hô (400-600k/người trọn gói). Ngày 3: thuê xe máy khám phá Bãi Sao, Bãi Khem, ghé Vinpearl Safari nếu đi cùng trẻ nhỏ. Ngày 4: cáp treo Hòn Thơm trước khi ra sân bay. Tổng chi phí cho 4 ngày (không tính vé máy bay) rơi vào khoảng 2.5-3.5 triệu/người nếu đi nhóm 4 người share phòng.</p>",
             'gallery' => '', 'tags' => 'Phú Quốc|Điểm đến trong nước|Lịch trình chi tiết|Mẹo du lịch',
             'read_time' => 7, 'date' => '2026-07-05', 'updated' => '', 'featured' => 0],

            // ── quoc-te ──
            ['cat' => 'quoc-te', 'title' => 'Cappadocia — Ngồi Khinh Khí Cầu Ngắm Bình Minh Có Đắt Không?',
             'slug' => 'cappadocia-khinh-khi-cau-binh-minh', 'thumbnail' => 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=700&q=80&auto=format&fit=crop',
             'excerpt' => 'So sánh giá các hãng khinh khí cầu, thời điểm bay đẹp nhất và cách đặt vé không qua trung gian.',
             'content' => "<p>Bay khinh khí cầu ngắm bình minh trên thung lũng đá Cappadocia là trải nghiệm 'must-do' nổi tiếng nhất Thổ Nhĩ Kỳ — nhưng giá vé dao động rất lớn tuỳ hãng và tuỳ cách bạn đặt. Sau chuyến đi thực tế, tôi tổng hợp lại toàn bộ chi phí và mẹo để không bị mua đắt hơn giá gốc.</p><h2>Giá vé thực tế theo từng hạng</h2><p>Vé khinh khí cầu tiêu chuẩn (16-20 người/giỏ) dao động 180-220 USD/người. Vé hạng sang (giỏ nhỏ 4-8 người, bay lâu hơn, có champagne sau khi hạ cánh) từ 280-350 USD/người. Đặt qua khách sạn hoặc tour trung gian ở Việt Nam thường bị đội giá thêm 20-30% so với đặt trực tiếp qua website chính thức của hãng bay.</p><h2>Thời điểm bay đẹp nhất</h2><p>Mùa xuân (tháng 4-5) và mùa thu (tháng 9-10) có tỷ lệ bay thành công cao nhất (thời tiết ổn định), đồng thời nhiệt độ không quá nóng hoặc quá lạnh vào sáng sớm. Cần lưu ý: khinh khí cầu phụ thuộc hoàn toàn vào thời tiết, có thể bị huỷ vào phút chót nếu gió quá mạnh — nên dự phòng ít nhất 2-3 sáng ở Cappadocia để tăng cơ hội bay được.</p><h2>Cách đặt không qua trung gian</h2><p>Tìm trực tiếp tên hãng bay uy tín (Royal Balloon, Butterfly Balloons, Voyager Balloons...) và đặt qua website hoặc email chính thức của họ, thanh toán bằng thẻ tín dụng để được bảo vệ khi có tranh chấp hoàn tiền do huỷ chuyến vì thời tiết.</p>",
             'gallery' => '', 'tags' => 'Cappadocia|Thổ Nhĩ Kỳ|Điểm đến quốc tế|Mẹo du lịch',
             'read_time' => 10, 'date' => '2026-08-05', 'updated' => '', 'featured' => 0],

            ['cat' => 'quoc-te', 'title' => 'Bali 6 Ngày Tự Túc — Ruộng Bậc Thang, Đền Cổ Và Biển Hoàng Hôn',
             'slug' => 'bali-6-ngay-tu-tuc', 'thumbnail' => 'https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=700&q=80&auto=format&fit=crop',
             'excerpt' => 'Lịch trình chi tiết Ubud - Canggu - Uluwatu kèm chi phí sinh hoạt thực tế.',
             'content' => "<p>Bali đủ rộng để chia thành 3 vùng trải nghiệm hoàn toàn khác nhau: Ubud tĩnh lặng với ruộng bậc thang và văn hoá tâm linh, Canggu sôi động với quán cà phê view lướt sóng, và Uluwatu hùng vĩ với vách đá cao nhìn ra biển. 6 ngày là vừa đủ để nếm trải cả ba mà không bị cuống cuồng di chuyển.</p><h2>Lịch trình 6 ngày</h2><p>Ngày 1-2: Ubud — ruộng bậc thang Tegallalang, rừng khỉ thiêng, đền nước Tirta Empul. Ngày 3-4: Canggu — lướt sóng, cà phê ven biển, chợ đêm Love Anchor. Ngày 5-6: Uluwatu — đền Uluwatu xem múa Kecak lúc hoàng hôn, các bãi biển ẩn như Padang Padang và Bingin.</p><h2>Chi phí sinh hoạt thực tế</h2><p>Villa/homestay có hồ bơi riêng: 400-700k VNĐ/đêm nếu đặt sớm. Thuê xe máy: khoảng 70k VNĐ/ngày. Ăn uống tại warung địa phương: 30-50k VNĐ/bữa, quán Tây ở Canggu đắt hơn nhiều (150-250k/bữa). Vé vào các đền/điểm tham quan: 20-50k VNĐ/điểm. Tổng chi phí sinh hoạt (không kể vé máy bay) cho 6 ngày khoảng 3.5-4.5 triệu VNĐ/người nếu đi 2 người share phòng.</p>",
             'gallery' => '', 'tags' => 'Bali|Indonesia|Điểm đến quốc tế|Lịch trình chi tiết',
             'read_time' => 11, 'date' => '2026-06-30', 'updated' => '', 'featured' => 0],

            ['cat' => 'quoc-te', 'title' => 'Santorini Không Hề Đắt Như Bạn Nghĩ — Đây Là Cách Tôi Tiết Kiệm 40%',
             'slug' => 'santorini-tiet-kiem-40-phan-tram', 'thumbnail' => 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=700&q=80&auto=format&fit=crop',
             'excerpt' => 'Chọn mùa thấp điểm, ở đảo lân cận và mẹo đặt phà rẻ hơn máy bay nội địa.',
             'content' => "<p>Santorini nổi tiếng là điểm đến 'đốt tiền' của Hy Lạp — phòng view biển Oia có thể lên tới 300-500 USD/đêm vào mùa cao điểm. Nhưng với vài điều chỉnh trong cách lên kế hoạch, tôi đã giảm được gần 40% tổng chi phí mà trải nghiệm không hề giảm sút.</p><h2>Chọn mùa thấp điểm</h2><p>Tránh tháng 7-8 (cao điểm, giá gấp 2-3 lần). Đi vào cuối tháng 5, tháng 6 hoặc tháng 9 vẫn có nắng đẹp, biển ấm, nhưng giá phòng giảm đáng kể và ít khách du lịch chen chúc hơn ở các điểm ngắm hoàng hôn nổi tiếng.</p><h2>Ở đảo lân cận thay vì Santorini</h2><p>Đảo Ios hoặc Naxos gần đó có phà chỉ 30-45 phút sang Santorini, giá phòng chỉ bằng 1/3 nhưng vẫn cho phép bạn dành trọn ngày ở Oia ngắm hoàng hôn rồi về đảo khác ngủ.</p><h2>Đặt phà thay vì máy bay nội địa</h2><p>Máy bay từ Athens đến Santorini vào mùa cao điểm có thể đắt hơn 2-3 lần phà cao tốc, trong khi thời gian di chuyển chỉ chênh nhau khoảng 4 tiếng. Đặt phà qua Ferryhopper trước ít nhất 2 tuần để có giá tốt nhất.</p>",
             'gallery' => '', 'tags' => 'Santorini|Hy Lạp|Điểm đến quốc tế|Mẹo du lịch',
             'read_time' => 9, 'date' => '2026-06-12', 'updated' => '', 'featured' => 0],

            // ── meo-du-lich ──
            ['cat' => 'meo-du-lich', 'title' => 'Kinh Nghiệm Xin Visa Nhật Bản Tự Túc Cho Người Mới',
             'slug' => 'kinh-nghiem-xin-visa-nhat-ban', 'thumbnail' => 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=700&q=80&auto=format&fit=crop',
             'excerpt' => 'Hồ sơ cần chuẩn bị, lịch trình mẫu và những lỗi thường gặp khiến hồ sơ visa bị từ chối.',
             'content' => "<p>Xin visa du lịch Nhật Bản tự túc không khó như nhiều người nghĩ, miễn là bạn chuẩn bị hồ sơ đầy đủ và trung thực. Đây là kinh nghiệm sau 2 lần xin visa Nhật thành công của tôi.</p><h2>Hồ sơ cần chuẩn bị</h2><ul><li>Hộ chiếu còn hạn ít nhất 6 tháng</li><li>Ảnh thẻ nền trắng 4.5x4.5cm chụp trong 6 tháng gần nhất</li><li>Đơn xin visa điền đầy đủ theo mẫu của Đại sứ quán</li><li>Lịch trình chi tiết từng ngày kèm đặt phòng, vé máy bay khứ hồi (chưa cần thanh toán)</li><li>Sao kê ngân hàng 3-6 tháng gần nhất, số dư khuyến nghị tối thiểu 100 triệu VNĐ</li><li>Giấy tờ chứng minh công việc/thu nhập (hợp đồng lao động, giấy xác nhận lương)</li></ul><h2>Lịch trình mẫu nên chuẩn bị</h2><p>Lịch trình càng chi tiết, cụ thể theo giờ càng tăng độ tin cậy. Ví dụ: 'Ngày 3: 9h tham quan đền Fushimi Inari, 13h ăn trưa tại khu Gion, 15h tham quan lâu đài Nijo' — thay vì chỉ ghi chung chung 'tham quan Kyoto'.</p><h2>Lỗi thường gặp khiến hồ sơ bị từ chối</h2><ul><li>Số dư tài khoản quá thấp hoặc mới phát sinh đột ngột ngay trước ngày nộp hồ sơ</li><li>Lịch trình sơ sài, thiếu logic về mặt di chuyển giữa các thành phố</li><li>Thông tin công việc không khớp với sao kê lương ngân hàng</li><li>Nộp hồ sơ qua trung tâm không uy tín, hồ sơ bị làm sai lệch mà người xin visa không biết</li></ul>",
             'gallery' => '', 'tags' => 'Visa|Nhật Bản|Mẹo du lịch|Giấy tờ chuẩn bị',
             'read_time' => 8, 'date' => '2026-08-14', 'updated' => '', 'featured' => 0],

            ['cat' => 'meo-du-lich', 'title' => 'Checklist Đóng Gói Hành Lý Cho Chuyến Đi 10 Ngày Gọn Trong 1 Balo',
             'slug' => 'checklist-dong-goi-hanh-ly-10-ngay', 'thumbnail' => 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=700&q=80&auto=format&fit=crop',
             'excerpt' => 'Danh sách đầy đủ những món cần mang theo và những thứ bạn hoàn toàn có thể bỏ lại ở nhà.',
             'content' => "<p>Sau hàng chục chuyến đi dài ngày chỉ với 1 balo 40L xách tay, đây là checklist tôi luôn dùng lại cho mọi chuyến đi 7-10 ngày, bất kể mùa nào hay điểm đến nào.</p><h2>Quần áo — nguyên tắc 'lớp mỏng, đa năng'</h2><p>4-5 áo thun/áo sơ mi mỏng có thể phối nhiều cách, 1 áo khoác gió nhẹ chống nước, 2 quần (1 dài 1 short/váy), đủ đồ lót và tất cho 3-4 ngày (giặt tay dọc đường), 1 bộ đồ ngủ mỏng. Tránh mang quần áo dày cồng kềnh — thà mặc lớp mỏng chồng lên nhau còn hơn 1 áo khoác dày chiếm nửa balo.</p><h2>Đồ điện tử & giấy tờ</h2><p>Sạc dự phòng, cáp sạc đa năng, adapter chuyển đổi ổ cắm (nếu đi nước ngoài), bản photo hộ chiếu để riêng với bản gốc, thẻ ngân hàng dự phòng để ở túi khác với ví chính.</p><h2>Những thứ bạn KHÔNG cần mang</h2><ul><li>Sách giấy dày — dùng ebook/app đọc sách trên điện thoại</li><li>Nhiều hơn 1 đôi giày ngoài giày đang đi (trừ khi có hoạt động đặc thù như trekking)</li><li>Đồ dùng cá nhân cỡ lớn — mua chai du lịch 100ml chiết ra từ chai lớn ở nhà</li><li>Quần áo 'phòng khi cần' — nếu 10 ngày không mặc tới thì 90% là không cần mang</li></ul>",
             'gallery' => '', 'tags' => 'Đóng gói hành lý|Mẹo du lịch|Balo du lịch|Checklist',
             'read_time' => 9, 'date' => '2026-07-28', 'updated' => '', 'featured' => 0],

            ['cat' => 'meo-du-lich', 'title' => '3 Thời Điểm Trong Tuần Vé Máy Bay Rẻ Nhất — Đã Test Suốt 1 Năm',
             'slug' => '3-thoi-diem-ve-may-bay-re-nhat', 'thumbnail' => 'https://images.unsplash.com/photo-1502472584811-0a2f2feb8968?w=700&q=80&auto=format&fit=crop',
             'excerpt' => 'Dữ liệu thực tế từ 50+ lần đặt vé cho thấy quy luật giá vé không hề ngẫu nhiên.',
             'content' => "<p>Sau khi theo dõi và ghi lại giá vé của hơn 50 lần đặt vé trong suốt 1 năm, tôi nhận ra giá vé máy bay không hề ngẫu nhiên như nhiều người nghĩ — có những quy luật khá rõ ràng nếu bạn để ý kỹ.</p><h2>Thứ Ba và thứ Tư luôn rẻ hơn</h2><p>Hầu hết các hãng tung khuyến mãi vào tối Chủ Nhật/sáng thứ Hai, khiến thứ Ba và thứ Tư là thời điểm giá vé ổn định thấp nhất trong tuần — trước khi các hãng khác điều chỉnh giá theo vào cuối tuần.</p><h2>Đặt vé lúc nửa đêm hoặc sáng sớm</h2><p>Một số hệ thống đặt vé cập nhật giá theo mốc giờ cố định (thường là 0h hoặc 6h sáng theo giờ hệ thống), và đây cũng là lúc ít người săn vé nhất — tỷ lệ 'bắt' được giá vé mới tung ra hoặc còn sót hạng ghế rẻ cao hơn.</p><h2>Đặt trước 6-8 tuần cho chuyến quốc tế, 3-4 tuần cho nội địa</h2><p>Dữ liệu của tôi cho thấy giá vé quốc tế bắt đầu tăng mạnh sau mốc 6 tuần trước ngày bay, còn vé nội địa thường có đợt tăng giá rõ rệt trong 2 tuần cuối trước ngày khởi hành. Ngoài ra, xoá cookie hoặc dùng trình duyệt ẩn danh khi tìm vé nhiều lần cũng giúp tránh tình trạng giá bị 'đội' lên do thuật toán theo dõi hành vi tìm kiếm.</p>",
             'gallery' => '', 'tags' => 'Vé máy bay|Mẹo du lịch|Tiết kiệm chi phí',
             'read_time' => 6, 'date' => '2026-06-15', 'updated' => '', 'featured' => 0],

            // ── review-luu-tru ──
            ['cat' => 'review-luu-tru', 'title' => 'Review Homestay View Ruộng Bậc Thang Ở Sa Pa',
             'slug' => 'review-homestay-sa-pa', 'thumbnail' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700&q=80&auto=format&fit=crop',
             'excerpt' => 'Giá phòng, tiện nghi thực tế và lý do đây là chỗ nghỉ đáng đồng tiền nhất tôi từng ở tại Sa Pa.',
             'content' => "<p>Trong số hơn chục homestay tôi từng ở tại Sa Pa, đây là căn duy nhất khiến tôi ở lại thêm 1 đêm ngoài kế hoạch — chỉ vì không muốn rời khỏi ban công nhìn thẳng ra thung lũng Mường Hoa.</p><h2>Giá phòng & đặt phòng</h2><p>Phòng đôi có ban công riêng: 450.000đ/đêm (đã bao gồm ăn sáng kiểu bản địa). Phòng dorm 6 giường: 150.000đ/giường. Giá tăng khoảng 20% vào cuối tuần và mùa lúa chín (tháng 9-10).</p><h2>Tiện nghi thực tế</h2><p>Phòng làm bằng gỗ pơ mu, có lò sưởi nhỏ (cần thiết vào mùa đông, Sa Pa có thể xuống dưới 10°C), nước nóng ổn định cả ngày, wifi chỉ mạnh ở khu vực sảnh chung. Chủ nhà là người H'Mông bản địa, nấu ăn tối theo yêu cầu với giá rất phải chăng (khoảng 100.000đ/người cho set cơm bản địa).</p><h2>Vì sao đáng đồng tiền nhất</h2><p>Không phải vì tiện nghi cao cấp — mà vì vị trí. Từ ban công phòng, bạn nhìn thẳng xuống ruộng bậc thang mà không có công trình nào chắn tầm nhìn, đặc biệt đẹp lúc bình minh khi sương còn phủ trên thung lũng. Đây là điều khó tìm được ở các homestay gần trung tâm thị trấn Sa Pa hơn.</p>",
             'gallery' => '', 'tags' => 'Sa Pa|Homestay|Review lưu trú|Điểm đến trong nước',
             'read_time' => 6, 'date' => '2026-08-10', 'updated' => '', 'featured' => 0],

            ['cat' => 'review-luu-tru', 'title' => 'Resort 4 Sao Ở Phú Quốc — Có Đáng Số Tiền Bỏ Ra?',
             'slug' => 'resort-4-sao-phu-quoc', 'thumbnail' => 'https://images.unsplash.com/photo-1541417904950-b855846fe074?w=700&q=80&auto=format&fit=crop',
             'excerpt' => 'Review chi tiết phòng ốc, dịch vụ và bữa sáng buffet sau 3 đêm trải nghiệm thực tế.',
             'content' => "<p>Với mức giá khoảng 2.2 triệu/đêm cho phòng garden view, tôi đã dành 3 đêm ở một resort 4 sao tại Bãi Trường, Phú Quốc để đánh giá xem liệu mức giá này có thực sự tương xứng.</p><h2>Phòng ốc</h2><p>Phòng rộng khoảng 32m², decor phong cách nhiệt đới, ban công riêng nhưng view chỉ nhìn ra khu vườn (không phải biển — muốn view biển phải trả thêm khoảng 800.000đ/đêm). Nệm êm, điều hoà mát nhanh, phòng tắm có bồn tắm riêng — điểm cộng lớn so với các homestay/khách sạn 3 sao cùng khu vực.</p><h2>Dịch vụ</h2><p>Hồ bơi vô cực khá đẹp nhưng luôn đông vào buổi chiều. Nhân viên lễ tân nhiệt tình, xử lý yêu cầu đổi phòng nhanh. Có xe shuttle miễn phí ra trung tâm thị trấn 3 chuyến/ngày — cần đặt chỗ trước vì hay hết chỗ vào giờ cao điểm.</p><h2>Bữa sáng buffet</h2><p>Đa dạng cả món Á lẫn Âu, hải sản tươi (có ốc, tôm hấp vào một số ngày), khu vực làm phở/bún nước riêng khá đông khách. Đây là điểm mạnh nhất của resort này so với mặt bằng chung cùng phân khúc.</p><h2>Kết luận</h2><p>Với mức giá này, resort đáng tiền nếu bạn ưu tiên hồ bơi đẹp và bữa sáng chất lượng hơn là view biển trực tiếp từ phòng. Nếu ngân sách hạn chế, nên cân nhắc phòng garden view thay vì trả thêm cho ocean view.</p>",
             'gallery' => '', 'tags' => 'Phú Quốc|Resort|Review lưu trú',
             'read_time' => 7, 'date' => '2026-07-20', 'updated' => '', 'featured' => 0],

            ['cat' => 'review-luu-tru', 'title' => 'Ở Đâu Tiết Kiệm Nhất Khi Du Lịch Kyoto — Hostel Hay Ryokan?',
             'slug' => 'o-dau-tiet-kiem-nhat-kyoto', 'thumbnail' => 'https://images.unsplash.com/photo-1548013146-72479768bada?w=700&q=80&auto=format&fit=crop',
             'excerpt' => 'So sánh trải nghiệm và mức giá giữa 2 loại hình lưu trú phổ biến nhất tại Kyoto.',
             'content' => "<p>Kyoto có 2 loại hình lưu trú đặc trưng mà du khách hay phân vân: hostel hiện đại giá rẻ, và ryokan — nhà trọ truyền thống Nhật Bản với chiếu tatami và bồn tắm onsen. Sau khi thử cả hai trong cùng 1 chuyến đi, đây là so sánh thực tế của tôi.</p><h2>Hostel — lựa chọn ngân sách</h2><p>Giá trung bình 800.000-1.200.000đ/đêm cho giường dorm (đã quy đổi), phòng riêng từ 1.5-2.5 triệu/đêm. Ưu điểm: vị trí thường gần ga tàu, dễ giao lưu với khách quốc tế khác, có bếp chung để tự nấu ăn tiết kiệm. Nhược điểm: không gian nhỏ, một số hostel không có thang máy nếu ở tầng cao.</p><h2>Ryokan — trải nghiệm văn hoá</h2><p>Giá từ 2.5-6 triệu/đêm/2 người, thường đã bao gồm bữa tối kaiseki và bữa sáng kiểu Nhật. Trải nghiệm mặc yukata, ngâm onsen riêng hoặc onsen chung, ngủ trên futon trải chiếu tatami là điều không thể có ở khách sạn thông thường. Tuy nhiên đa số ryokan có giờ giới nghiêm buổi tối và quy tắc ứng xử khá nghiêm ngặt.</p><h2>Nên chọn loại nào</h2><p>Nếu ngân sách hạn chế và ưu tiên di chuyển linh hoạt, chọn hostel gần ga JR hoặc tàu điện ngầm. Nếu muốn trải nghiệm văn hoá trọn vẹn và có ngân sách thoải mái hơn, dành ít nhất 1 đêm ở ryokan — đáng để chi thêm cho một trải nghiệm khó lặp lại.</p>",
             'gallery' => '', 'tags' => 'Kyoto|Nhật Bản|Review lưu trú|Điểm đến quốc tế',
             'read_time' => 7, 'date' => '2026-06-02', 'updated' => '', 'featured' => 0],

            // ── am-thuc ──
            ['cat' => 'am-thuc', 'title' => '10 Món Ăn Đường Phố Không Thể Bỏ Lỡ Khi Đến Hội An',
             'slug' => '10-mon-an-duong-pho-hoi-an', 'thumbnail' => 'https://images.unsplash.com/photo-1528127269322-539801943592?w=700&q=80&auto=format&fit=crop',
             'excerpt' => 'Từ cao lầu, bánh mì Phượng đến chè bắp — danh sách quán ăn được dân địa phương tin dùng.',
             'content' => "<p>Phố cổ Hội An không chỉ đẹp về kiến trúc mà còn là thiên đường ẩm thực đường phố. Đây là 10 món tôi luôn quay lại ăn mỗi lần ghé thăm, kèm gợi ý quán được người địa phương tin dùng thay vì các quán chỉ đông khách du lịch.</p><h2>1. Cao lầu</h2><p>Món trứ danh chỉ có đúng vị tại Hội An do dùng nước giếng Bá Lễ đặc trưng. Sợi mì dày, dai, ăn kèm thịt xá xíu, tôm và rau sống, rắc thêm bánh đa giòn.</p><h2>2. Bánh mì Phượng</h2><p>Nổi tiếng đến mức từng được đầu bếp nổi tiếng thế giới ghé ăn. Điểm khác biệt nằm ở nước sốt đặc trưng và sự kết hợp nhiều loại pate, chả, rau thơm trong 1 ổ bánh.</p><h2>3. Cơm gà Hội An</h2><p>Cơm được nấu bằng nước luộc gà và nghệ nên có màu vàng đặc trưng, ăn kèm gà xé và đu đủ chua ngọt.</p><h2>4-10. Danh sách nhanh</h2><ul><li>Chè bắp — món chè ngọt thanh làm từ bắp non trồng ở Cẩm Nam</li><li>Bánh bao bánh vạc (bánh hoa hồng trắng) — món ăn có xuất xứ cung đình xưa</li><li>Hoành thánh chiên — đặc sản gốc Hoa được Việt hoá</li><li>Bánh xèo Hội An — nhỏ hơn bánh xèo miền Nam, ăn kèm nem lụi</li><li>Bánh đập — hến xào ăn kèm bánh tráng nướng đập giòn</li><li>Chí mà phù — chè mè đen của người Hoa gốc</li><li>Nước mót — loại nước giải khát dân dã chỉ có ở Hội An</li></ul><p>Mẹo nhỏ: nên ăn vào các quán vỉa hè trong khu chợ Hội An thay vì các quán mặt tiền phố đi bộ — giá rẻ hơn 30-40% và hương vị thường 'chuẩn' hơn vì phục vụ chính người dân địa phương.</p>",
             'gallery' => '', 'tags' => 'Hội An|Ẩm thực vùng miền|Điểm đến trong nước|Món ăn đường phố',
             'read_time' => 7, 'date' => '2026-08-01', 'updated' => '', 'featured' => 0],

            ['cat' => 'am-thuc', 'title' => 'Về Miền Tây Ăn Gì? 8 Đặc Sản Sông Nước Dân Dã Nhất',
             'slug' => 've-mien-tay-an-gi', 'thumbnail' => 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=700&q=80&auto=format&fit=crop',
             'excerpt' => 'Lẩu mắm, cá lóc nướng trui, bún nước lèo — hương vị miền sông nước qua từng món ăn.',
             'content' => "<p>Ẩm thực miền Tây Nam Bộ mang đậm chất sông nước — nguyên liệu tươi từ kênh rạch, cách chế biến mộc mạc nhưng đậm đà. Đây là 8 món tôi cho là đại diện rõ nét nhất cho vùng đất này.</p><h2>1. Lẩu mắm</h2><p>Linh hồn của ẩm thực miền Tây — nước lẩu nấu từ mắm cá linh hoặc mắm sặc, ăn kèm hơn chục loại rau đồng như bông súng, kèo nèo, rau đắng.</p><h2>2. Cá lóc nướng trui</h2><p>Cá lóc để nguyên vảy, xiên que rơm nướng trực tiếp trên lửa, cuốn bánh tráng với rau sống và nước mắm me.</p><h2>3. Bún nước lèo</h2><p>Đặc sản gốc Sóc Trăng, nước dùng nấu từ mắm bò hóc kết hợp ngải bún, ăn kèm cá lóc, tôm, thịt heo quay.</p><h2>4-8. Các món khác nên thử</h2><ul><li>Hủ tiếu Mỹ Tho — sợi hủ tiếu dai đặc trưng khác hẳn hủ tiếu Nam Vang</li><li>Bánh xèo miền Tây — to bằng cả cái mâm, nhân tôm thịt giá đỗ</li><li>Chuột đồng nướng lu — món ăn dân dã mùa nước nổi</li><li>Ốc len xào dừa — đặc sản vùng Bến Tre, Cà Mau</li><li>Bánh tét lá cẩm Cần Thơ — món quà đặc trưng mang về</li></ul><p>Nên ăn ở các chợ nổi hoặc quán ven kênh thay vì nhà hàng trong thành phố lớn để cảm nhận đúng không khí và hương vị nguyên bản của miền sông nước.</p>",
             'gallery' => '', 'tags' => 'Miền Tây|Ẩm thực vùng miền|Đặc sản|Điểm đến trong nước',
             'read_time' => 6, 'date' => '2026-07-18', 'updated' => '', 'featured' => 0],

            ['cat' => 'am-thuc', 'title' => 'Đến Đà Lạt Nhớ Ăn Gì — 6 Món Vặt Chỉ Có Ở Xứ Lạnh',
             'slug' => 'den-da-lat-nho-an-gi', 'thumbnail' => 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=700&q=80&auto=format&fit=crop',
             'excerpt' => 'Bánh tráng nướng, sữa đậu nành nóng, lẩu gà lá é — ăn gì cho đúng chất Đà Lạt.',
             'content' => "<p>Khí hậu se lạnh quanh năm khiến ẩm thực Đà Lạt có một chất riêng — ấm nóng, đậm vị, và luôn ngon hơn khi ăn giữa cái lạnh của phố núi. Đây là 6 món vặt tôi luôn tìm ăn ngay khi vừa đặt chân đến Đà Lạt.</p><h2>1. Bánh tráng nướng</h2><p>Được mệnh danh 'pizza Đà Lạt', bánh tráng nướng giòn với trứng, hành lá, mỡ hành và tuỳ chọn thêm xúc xích, bò khô, phô mai.</p><h2>2. Sữa đậu nành nóng</h2><p>Quán ven đường, gánh hàng rong bán sữa đậu nành nóng hổi là hình ảnh quen thuộc mỗi tối ở Đà Lạt — uống cùng bánh tiêu hoặc bánh giò nóng.</p><h2>3. Lẩu gà lá é</h2><p>Món đặc sản trứ danh với lá é the đặc trưng chỉ mọc ở vùng cao nguyên, ăn cùng gà ta và nấm rừng.</p><h2>4-6. Danh sách nên thử thêm</h2><ul><li>Kem bơ Thanh Thảo — kem bơ béo ngậy trộn cùng đá bào</li><li>Bánh căn Đà Lạt — nhỏ xinh, ăn kèm nước chấm xíu mại đặc trưng</li><li>Ốc bươu nhồi thịt hấp lá gừng — món nhậu vặt được dân địa phương yêu thích</li></ul><p>Buổi tối lạnh là thời điểm lý tưởng nhất để thưởng thức trọn vẹn các món này — cảm giác vừa xuýt xoa vì nóng vừa ấm bụng giữa cái se lạnh của Đà Lạt là trải nghiệm khó quên.</p>",
             'gallery' => '', 'tags' => 'Đà Lạt|Ẩm thực vùng miền|Món ăn vặt|Điểm đến trong nước',
             'read_time' => 5, 'date' => '2026-07-03', 'updated' => '', 'featured' => 0],
        ];

        foreach ($posts as $i => $p) {
            $this->execute(
                "INSERT INTO posts (category_id, title, slug, thumbnail, excerpt, content, tags, gallery_images, read_time, published_date, updated_date, featured, sort_order, status)
                 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,'published')",
                [
                    $catId[$p['cat']] ?? null, $p['title'], $p['slug'], $p['thumbnail'], $p['excerpt'], $p['content'],
                    $p['tags'], $p['gallery'], $p['read_time'], $p['date'], $p['updated'], $p['featured'], $i + 1,
                ]
            );
        }
    }

    // ─── Destinations (bento "Điểm đến được yêu thích" — 5 mục) ─────────────
    private function seedDestinations(): void {
        if ($this->scalar("SELECT COUNT(*) FROM destinations") > 0) return;
        $items = [
            ['name' => 'Bali, Indonesia',      'category_label' => 'Điểm đến quốc tế',    'image' => 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=80&auto=format&fit=crop', 'sort_order' => 1],
            ['name' => 'Santorini, Hy Lạp',    'category_label' => 'Điểm đến quốc tế',    'image' => 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=700&q=80&auto=format&fit=crop', 'sort_order' => 2],
            ['name' => 'Vịnh Hạ Long',         'category_label' => 'Điểm đến trong nước', 'image' => 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=700&q=80&auto=format&fit=crop', 'sort_order' => 3],
            ['name' => 'Kyoto, Nhật Bản',      'category_label' => 'Điểm đến quốc tế',    'image' => 'https://images.unsplash.com/photo-1548013146-72479768bada?w=900&q=80&auto=format&fit=crop', 'sort_order' => 4],
            ['name' => 'Sa mạc Sahara, Morocco', 'category_label' => 'Điểm đến quốc tế',  'image' => 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=700&q=80&auto=format&fit=crop', 'sort_order' => 5],
        ];
        foreach ($items as $d) {
            $this->execute(
                "INSERT INTO destinations (name, category_label, image, sort_order) VALUES (?, ?, ?, ?)",
                [$d['name'], $d['category_label'], $d['image'], $d['sort_order']]
            );
        }
    }

    // ─── FAQ (index.html — 7 câu) ────────────────────────────────────────────
    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $items = [
            ['q' => 'Làm sao để đóng góp bài viết cho blog Xê Dịch?', 'a' => 'Rất hoan nghênh! Gửi bài viết kèm ảnh chụp thực tế (không dùng ảnh mạng) qua form ở trang Liên hệ, ghi rõ tiêu đề "Đóng góp bài viết". Bài phù hợp sẽ được biên tập lại và đăng kèm tên tác giả, có phản hồi trong vòng 5-7 ngày làm việc.'],
            ['q' => 'Blog đăng bài mới với tần suất như thế nào?', 'a' => 'Trung bình 2-3 bài viết mới mỗi tuần, thường vào thứ Ba và thứ Sáu. Vào mùa cao điểm du lịch (hè, dịp Tết) tần suất có thể tăng lên 4 bài/tuần. Đăng ký bản tin ở footer để không bỏ lỡ bài mới.'],
            ['q' => 'Mình có thể sử dụng lại nội dung hoặc hình ảnh trên blog không?', 'a' => 'Bạn có thể trích dẫn một phần nội dung kèm liên kết dẫn nguồn về bài viết gốc. Việc đăng lại toàn bộ bài viết hoặc sử dụng ảnh cho mục đích thương mại cần liên hệ xin phép trước qua email ở trang Liên hệ.'],
            ['q' => 'Blog có nhận hợp tác quảng cáo hoặc bài viết tài trợ không?', 'a' => 'Có. Xê Dịch nhận hợp tác với các thương hiệu du lịch, khách sạn, hãng lữ hành phù hợp với tệp độc giả của blog. Mọi bài viết tài trợ đều được gắn nhãn "Nội dung hợp tác" rõ ràng để đảm bảo minh bạch với độc giả. Liên hệ qua trang Liên hệ để nhận bảng giá.'],
            ['q' => 'Làm sao để đăng ký nhận bản tin qua email?', 'a' => 'Điền email vào ô đăng ký ở cuối trang chủ hoặc trong footer của bất kỳ trang nào. Bản tin gửi 1 lần/tuần, tổng hợp bài viết mới và mẹo du lịch độc quyền không đăng trên blog. Bạn có thể hủy đăng ký bất cứ lúc nào chỉ với 1 cú click.'],
            ['q' => 'Chính sách bình luận trên blog như thế nào?', 'a' => 'Mọi bình luận được kiểm duyệt trước khi hiển thị để tránh spam. Khuyến khích bình luận chia sẻ kinh nghiệm thực tế, câu hỏi liên quan đến bài viết. Bình luận quảng cáo, spam liên kết hoặc ngôn từ không phù hợp sẽ bị xoá mà không cần thông báo trước.'],
            ['q' => 'Thông tin giá cả, lịch trình trong bài viết có được cập nhật thường xuyên không?', 'a' => 'Các bài viết có ghi rõ ngày xuất bản/cập nhật ở đầu bài. Giá vé, giá phòng có thể thay đổi theo thời gian và mùa vụ — luôn kiểm tra lại thông tin mới nhất trực tiếp với nhà cung cấp dịch vụ trước khi đặt.'],
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

    public function executeAffected(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount();
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
