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
        // Strip comment lines TRƯỚC khi split theo ';' — tránh vỡ statement nếu comment chứa dấu ';'
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

    private function seedUsers(): void {
        if ($this->scalar("SELECT COUNT(*) FROM users") > 0) return;
        $this->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['sysadmin', 'sysadmin@admin.com', password_hash('123456', PASSWORD_BCRYPT), 'superadmin']
        );
    }

    private function seedSettings(): void {
        if ($this->scalar("SELECT COUNT(*) FROM settings") > 0) return;
        $settings = [
            // ── Chung ──
            ['site_name', 'Rosette Bakery & Cafe', 'general'],
            ['site_tagline', 'Bánh Ngọt Thủ Công & Cà Phê Specialty', 'general'],
            ['site_description', 'Rosette Bakery & Cafe — tiệm bánh ngọt thủ công kết hợp cà phê specialty, không gian hồng pastel ấm cúng, lý tưởng cho hẹn hò, chụp ảnh và tụ tập bạn bè. Nhận đặt bánh sinh nhật, tiệc nhỏ.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hello@rosettebakery.vn', 'general'],
            ['site_phone', '0901 234 567', 'general'],
            ['site_address', '45 Mạc Thị Bưởi, Phường Bến Nghé, Quận 1, TP.HCM', 'general'],
            ['working_hours', '7:30 – 21:30 hàng ngày', 'general'],
            // ── SEO ──
            ['meta_title', 'Rosette Bakery & Cafe — Bánh Ngọt Thủ Công & Cà Phê Specialty', 'seo'],
            ['meta_description', 'Rosette Bakery & Cafe — tiệm bánh ngọt thủ công kết hợp cà phê specialty, không gian hồng pastel ấm cúng. Nhận đặt bánh sinh nhật, tiệc nhỏ.', 'seo'],
            ['meta_keywords', 'bánh ngọt, bánh kem, cà phê specialty, tiệm bánh, đặt bánh sinh nhật, cafe hồng pastel', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1200&q=80&auto=format&fit=crop', 'seo'],
            // ── Mạng xã hội ──
            ['zalo_phone', '0901234567', 'social'],
            ['facebook_url', 'https://facebook.com', 'social'],
            ['instagram_url', 'https://instagram.com', 'social'],
            ['tiktok_url', 'https://tiktok.com', 'social'],
            // ── Footer ──
            ['footer_copyright', '© 2026 Rosette Bakery & Cafe · Made in Vietnam 🇻🇳', 'footer'],
            ['footer_description', 'Tiệm bánh ngọt thủ công & cà phê specialty với không gian hồng pastel ấm cúng — nơi mỗi khoảnh khắc đều đáng được lưu giữ.', 'footer'],
            // ── Liên hệ / bản đồ ──
            ['map_embed', 'https://maps.google.com/maps?q=10.7769,106.7009&hl=vi&z=15&output=embed', 'contact'],
            // ── SMTP ──
            ['smtp_host', '', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from_name', 'Rosette Bakery & Cafe', 'smtp'],
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

            // ══ NỘI DUNG TRANG — Trang chủ ══
            ['home_feat_eyebrow', 'Vì sao chọn Rosette', 'content'],
            ['home_feat_title', 'Ba điều làm nên *một Rosette dễ thương*', 'content'],
            ['home_feat_desc', 'Không chỉ là bánh ngon — đó còn là trải nghiệm nhỏ xinh mà chúng mình muốn dành tặng mỗi khách ghé qua.', 'content'],
            ['home_feat1_icon', '🧁', 'content'],
            ['home_feat1_title', 'Bánh làm mới mỗi ngày', 'content'],
            ['home_feat1_desc', 'Không bảo quản qua đêm — mỗi mẻ bánh đều được nướng và trang trí ngay trong ngày để đảm bảo độ tươi ngon.', 'content'],
            ['home_feat2_icon', '☕', 'content'],
            ['home_feat2_title', 'Cà phê specialty tuyển chọn', 'content'],
            ['home_feat2_desc', 'Hạt cà phê từ Cầu Đất, Đà Lạt, rang mỗi tuần với hồ sơ hương vị được barista trưởng kiểm định kỹ.', 'content'],
            ['home_feat3_icon', '📷', 'content'],
            ['home_feat3_title', 'Không gian đẹp để lưu giữ', 'content'],
            ['home_feat3_desc', 'Tông hồng pastel ấm áp, góc tường hoa, ánh sáng tự nhiên — lý tưởng cho hẹn hò và tụ tập bạn bè.', 'content'],

            ['home_product_eyebrow', 'Món được yêu thích', 'content'],
            ['home_product_title', 'Bánh & đồ uống *khách hay gọi nhất*', 'content'],
            ['home_product_desc', 'Những món "signature" mà khách quay lại Rosette lần nào cũng gọi thêm.', 'content'],

            ['home_story_eyebrow', 'Câu chuyện Rosette', 'content'],
            ['home_story_title', 'Từ bếp bánh nhỏ *đến tiệm bánh trong mơ*', 'content'],
            ['home_story_text', 'Rosette bắt đầu từ một bếp bánh gia đình nhỏ, nơi mỗi chiếc bánh kem đều được nặn tay như một bông hoa hồng. Sau 5 năm, Rosette trở thành điểm hẹn quen thuộc của những ai yêu bánh ngọt và cà phê nhẹ nhàng.', 'content'],
            ['home_story_stat1_num', '5', 'content'],
            ['home_story_stat1_label', 'Năm hoạt động', 'content'],
            ['home_story_stat2_num', '300+', 'content'],
            ['home_story_stat2_label', 'Bánh sinh nhật/tháng', 'content'],
            ['home_story_stat3_num', '4.9★', 'content'],
            ['home_story_stat3_label', 'Đánh giá khách hàng', 'content'],
            ['home_story_img1', 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600&q=80&auto=format&fit=crop', 'content'],
            ['home_story_img2', 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=600&q=80&auto=format&fit=crop', 'content'],
            ['home_story_img3', 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=600&q=80&auto=format&fit=crop', 'content'],

            ['home_space_eyebrow', 'Không gian quán', 'content'],
            ['home_space_title', 'Ba góc nhỏ, *một cảm giác ấm áp*', 'content'],
            ['home_space_desc', 'Dù bạn muốn ngồi làm việc yên tĩnh, hẹn hò hay chụp ảnh cùng hội bạn — Rosette đều có góc dành riêng cho bạn.', 'content'],

            ['home_menu_eyebrow', 'Thực đơn', 'content'],
            ['home_menu_title', 'Menu *hôm nay*', 'content'],
            ['home_menu_desc', 'Danh sách bánh và đồ uống được yêu thích nhất — cập nhật theo mùa để luôn có món mới cho bạn khám phá.', 'content'],

            ['home_faq_eyebrow', 'Câu hỏi thường gặp', 'content'],
            ['home_faq_title', 'Những điều bạn *hay thắc mắc*', 'content'],
            ['home_faq_desc', 'Chưa tìm thấy câu trả lời? Liên hệ trực tiếp qua Zalo hoặc hotline, Rosette luôn sẵn sàng giải đáp.', 'content'],
            ['faq1_q', 'Đặt bánh sinh nhật cần đặt trước bao lâu?', 'content'],
            ['faq1_a', 'Với bánh kem thiết kế theo yêu cầu, quán cần đặt trước tối thiểu 48 giờ để chuẩn bị nguyên liệu và trang trí. Với các mẫu bánh có sẵn, bạn có thể đặt trước 24 giờ hoặc ghé mua trực tiếp tại quầy nếu còn hàng.', 'content'],
            ['faq2_q', 'Quán có giao bánh tận nơi không?', 'content'],
            ['faq2_a', 'Có. Rosette giao bánh trong bán kính 8km nội thành, phí giao dao động 20.000đ – 40.000đ tùy khoảng cách. Đơn hàng từ 500.000đ trở lên được miễn phí giao hàng.', 'content'],
            ['faq3_q', 'Bánh kem giữ được bao lâu và bảo quản thế nào?', 'content'],
            ['faq3_a', 'Bánh kem tươi nên dùng trong vòng 24–48 giờ để đảm bảo hương vị tốt nhất. Bảo quản trong ngăn mát tủ lạnh 2–5°C, tránh để bánh ở nhiệt độ phòng quá 2 giờ, đặc biệt vào mùa nóng.', 'content'],
            ['faq4_q', 'Rosette có nhận đặt tiệc trà cho nhóm hoặc sự kiện nhỏ không?', 'content'],
            ['faq4_a', 'Có. Quán nhận đặt bàn cho nhóm từ 6 người trở lên và tổ chức tiệc trà sinh nhật quy mô nhỏ. Vui lòng liên hệ trước ít nhất 3 ngày để đội ngũ chuẩn bị bàn, bánh và trang trí phù hợp.', 'content'],
            ['faq5_q', 'Giá bánh kem thiết kế theo yêu cầu được tính như thế nào?', 'content'],
            ['faq5_a', 'Giá phụ thuộc vào kích thước, loại nhân bánh và độ phức tạp của phần trang trí, thường dao động từ 350.000đ đến 1.200.000đ cho bánh 1–2kg. Nhân viên sẽ tư vấn và báo giá cụ thể sau khi trao đổi ý tưởng cùng bạn.', 'content'],
            ['faq6_q', 'Bánh có nguyên liệu gây dị ứng không? Có bánh dành cho người ăn kiêng không?', 'content'],
            ['faq6_a', 'Đa số bánh tại Rosette có chứa gluten, trứng, sữa và một số loại có thể chứa hạt (hạnh nhân, óc chó). Quán có 2–3 loại bánh ít đường phù hợp người ăn kiêng — vui lòng báo trước với nhân viên nếu bạn có dị ứng thực phẩm đặc biệt.', 'content'],
            ['faq7_q', 'Có thể đặt bánh online và thanh toán trước không?', 'content'],
            ['faq7_a', 'Bạn có thể đặt qua Zalo hoặc hotline của quán. Với bánh thiết kế riêng, Rosette thu trước 50% giá trị đơn hàng qua chuyển khoản, phần còn lại thanh toán khi nhận bánh.', 'content'],

            ['home_testi_eyebrow', 'Đánh giá từ khách', 'content'],
            ['home_testi_title', 'Họ nói gì về *Rosette*', 'content'],

            ['home_cta_title', 'Sẵn sàng cho *chiếc bánh của bạn*?', 'content'],
            ['home_cta_desc', 'Đặt bánh sinh nhật, tiệc nhỏ hoặc giữ chỗ trước cho nhóm bạn — Rosette xác nhận trong vòng 15 phút.', 'content'],

            ['home_booking_eyebrow', 'Đặt chỗ trước', 'content'],
            ['home_booking_title', 'Giữ bàn cho *buổi hẹn ngọt ngào*', 'content'],
            ['home_booking_desc', 'Đặt trước để đảm bảo có chỗ — đặc biệt vào cuối tuần. Chúng mình xác nhận qua điện thoại hoặc Zalo trong vòng 15 phút.', 'content'],
            ['home_booking_feat1', 'Phản hồi xác nhận nhanh', 'content'],
            ['home_booking_feat2', 'Giữ bàn 20 phút sau giờ đặt', 'content'],
            ['home_booking_feat3', 'Hỗ trợ tư vấn bánh sinh nhật miễn phí', 'content'],

            // ══ NỘI DUNG TRANG — Không gian ══
            ['space_hero_title', 'Mỗi góc nhỏ *đều đáng để lưu giữ*', 'content'],
            ['space_hero_desc', 'Tông hồng pastel ấm áp, ánh sáng tự nhiên và những chi tiết hoa lá nhỏ xinh — Rosette được thiết kế để bạn vừa thưởng thức bánh vừa có những tấm ảnh đẹp.', 'content'],
            ['space_areas_eyebrow', 'Khu vực nổi bật', 'content'],
            ['space_areas_title', 'Ba khu vực, *một bầu không khí ngọt ngào*', 'content'],
            ['space_areas_desc', 'Chọn góc phù hợp với nhu cầu của bạn — làm việc, hẹn hò hay tụ tập nhóm bạn.', 'content'],
            ['area1_name', 'Quầy Bày Bánh', 'content'],
            ['area1_caption', 'Tủ kính mát · Bánh mới mỗi ngày', 'content'],
            ['area1_desc', 'Khu trưng bày chính với tủ kính mát giữ độ tươi cho bánh kem, tart và bánh mảnh — bạn có thể ngắm và chọn trực tiếp trước khi gọi.', 'content'],
            ['area1_image', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=700&q=80&auto=format&fit=crop', 'content'],
            ['area2_name', 'Góc Tường Hoa', 'content'],
            ['area2_caption', 'Check-in · Ánh sáng tự nhiên buổi sáng', 'content'],
            ['area2_desc', 'Góc tường trang trí hoa khô và pastel là điểm chụp ảnh được yêu thích nhất, đặc biệt đẹp vào khung giờ 9–11h sáng.', 'content'],
            ['area2_image', 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?w=700&q=80&auto=format&fit=crop', 'content'],
            ['area3_name', 'Ban Công Nhỏ', 'content'],
            ['area3_caption', 'Ngoài trời · Tối đa 6 người', 'content'],
            ['area3_desc', 'Ban công nhỏ nhiều cây xanh, phù hợp cho nhóm bạn 4–6 người muốn ngồi ngoài trời tận hưởng không khí thoáng đãng.', 'content'],
            ['area3_image', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=700&q=80&auto=format&fit=crop', 'content'],
            ['gallery_eyebrow', 'Thư viện ảnh', 'content'],
            ['gallery_title', 'Rosette qua *từng khung hình*', 'content'],
            ['gallery_desc', 'Một vài khoảnh khắc từ quán — nơi mỗi góc đều được chăm chút tỉ mỉ như một chiếc bánh.', 'content'],
            ['space_cta_title', 'Muốn ghé thăm *không gian này*?', 'content'],
            ['space_cta_desc', 'Đặt bàn trước cho nhóm bạn hoặc buổi hẹn của bạn — Rosette luôn có một góc phù hợp đang chờ.', 'content'],

            // ══ NỘI DUNG TRANG — Giới thiệu ══
            ['about_hero_title', 'Câu chuyện *của Rosette*', 'content'],
            ['about_hero_desc', 'Từ một bếp bánh gia đình nhỏ đến tiệm bánh & cà phê được nhiều người yêu thích — đây là hành trình 5 năm của chúng mình.', 'content'],
            ['about_story_eyebrow', 'Từ đâu chúng mình bắt đầu', 'content'],
            ['about_story_title', 'Một bông hồng bơ, *một cái tên*', 'content'],
            ['about_story_text1', 'Rosette bắt đầu vào năm 2021 từ căn bếp nhỏ của chị Hồng Nhung — người đã học cách nặn hoa hồng bơ (rosette) trên bánh kem như một sở thích cuối tuần. Chiếc bánh đầu tiên chị làm tặng bạn thân nhận được phản hồi tốt đến mức đơn đặt hàng dần kín cả tháng.', 'content'],
            ['about_story_text2', 'Từ một góc bếp gia đình, Rosette mở cửa hàng đầu tiên vào năm 2021 tại một con hẻm nhỏ, rồi chuyển đến địa điểm hiện tại năm 2023 với không gian rộng hơn, đủ chỗ cho khách ngồi lại thưởng thức thay vì chỉ mua mang về. Cái tên "Rosette" được giữ nguyên như một lời nhắc — mọi thứ ở đây đều bắt đầu từ một bông hoa nhỏ được làm bằng tay, thật chậm rãi và tỉ mỉ.', 'content'],
            ['about_story_img1', 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600&q=80&auto=format&fit=crop', 'content'],
            ['about_story_img2', 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=80&auto=format&fit=crop', 'content'],
            ['about_story_img3', 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=600&q=80&auto=format&fit=crop', 'content'],
            ['about_stat1_num', '5', 'content'],
            ['about_stat1_label', 'Năm hoạt động', 'content'],
            ['about_stat2_num', '300+', 'content'],
            ['about_stat2_label', 'Bánh sinh nhật/tháng', 'content'],
            ['about_stat3_num', '15.000+', 'content'],
            ['about_stat3_label', 'Khách hàng đã phục vụ', 'content'],
            ['about_stat4_num', '4.9★', 'content'],
            ['about_stat4_label', 'Đánh giá trung bình', 'content'],
            ['team_eyebrow', 'Đội ngũ Rosette', 'content'],
            ['team_title', 'Những người *làm nên vị ngọt này*', 'content'],
            ['team_desc', 'Mỗi chiếc bánh và mỗi ly cà phê đều đi qua bàn tay của một đội ngũ nhỏ nhưng tận tâm.', 'content'],
            ['team1_name', 'Hồng Nhung', 'content'],
            ['team1_role', 'Founder & Creative Director', 'content'],
            ['team1_desc', 'Người sáng lập Rosette, phụ trách định hướng thiết kế bánh và không gian quán từ những ngày đầu tiên.', 'content'],
            ['team1_avatar', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80&auto=format&fit=crop', 'content'],
            ['team2_name', 'Lan Chi', 'content'],
            ['team2_role', 'Bếp Trưởng Bánh', 'content'],
            ['team2_desc', 'Tu nghiệp làm bánh Pháp, phụ trách công thức và trang trí toàn bộ bánh kem, tart tại Rosette.', 'content'],
            ['team2_avatar', 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&q=80&auto=format&fit=crop', 'content'],
            ['team3_name', 'Minh Khang', 'content'],
            ['team3_role', 'Barista Trưởng', 'content'],
            ['team3_desc', 'Chứng chỉ Q-grader, phụ trách tuyển chọn hạt cà phê và xây dựng công thức pha chế của quán.', 'content'],
            ['team3_avatar', 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=500&q=80&auto=format&fit=crop', 'content'],
            ['ing_eyebrow', 'Nguyên liệu', 'content'],
            ['ing_title', 'Chọn kỹ *từng nguyên liệu*', 'content'],
            ['ing_desc', 'Rosette tin rằng một chiếc bánh ngon bắt đầu từ nguyên liệu tốt. Chúng mình ưu tiên nguồn nguyên liệu có nguồn gốc rõ ràng, hạn chế phụ gia không cần thiết trong mọi công thức.', 'content'],
            ['ing1_icon', '🧈', 'content'],
            ['ing1_title', 'Bơ Pháp Isigny AOP', 'content'],
            ['ing1_desc', 'Dùng cho toàn bộ croissant và lớp kem bơ nặn hoa — béo thơm tự nhiên, không dùng bơ thực vật.', 'content'],
            ['ing2_icon', '🍫', 'content'],
            ['ing2_title', 'Socola Bỉ Callebaut', 'content'],
            ['ing2_desc', 'Nguyên liệu chính cho ganache và bánh kem socola, hàm lượng cacao cao, vị đắng nhẹ cân bằng.', 'content'],
            ['ing3_icon', '🍓', 'content'],
            ['ing3_title', 'Trái cây tươi theo mùa', 'content'],
            ['ing3_desc', 'Dâu Đà Lạt, xoài Cát Chu, việt quất nhập khẩu — luôn chọn lô hàng tươi nhất trong ngày.', 'content'],
            ['ing4_icon', '☕', 'content'],
            ['ing4_title', 'Cà phê specialty Cầu Đất', 'content'],
            ['ing4_desc', 'Hạt cà phê từ Đà Lạt, rang mới mỗi tuần để giữ trọn hương vị đặc trưng vùng trồng.', 'content'],
            ['about_cta_title', 'Đến thử một *chiếc bánh của chúng mình*', 'content'],
            ['about_cta_desc', 'Mở cửa mỗi ngày từ 7:30 đến 21:30 — luôn có bánh mới chờ bạn ghé qua.', 'content'],

            // ══ NỘI DUNG TRANG — Thực đơn ══
            ['menu_hero_title', 'Bánh ngọt & đồ uống *của Rosette*', 'content'],
            ['menu_hero_desc', 'Từ bánh kem sinh nhật đến ly cà phê buổi sáng — mỗi món đều được làm mới mỗi ngày với nguyên liệu tuyển chọn.', 'content'],
            ['menu_note_eyebrow', 'Đặt bánh theo yêu cầu', 'content'],
            ['menu_note_title', 'Cần bánh *thiết kế riêng*?', 'content'],
            ['menu_note_desc', 'Ngoài menu có sẵn, Rosette nhận đặt bánh kem sinh nhật, bánh sự kiện theo concept riêng của bạn — giá từ 350.000đ tùy kích thước và độ phức tạp trang trí.', 'content'],

            // ══ NỘI DUNG TRANG — Liên hệ ══
            ['contact_hero_title', 'Nhắn Rosette *một tin nhé*', 'content'],
            ['contact_hero_desc', 'Đặt bánh sinh nhật, giữ bàn trước hay chỉ đơn giản muốn hỏi thăm về menu — chúng mình luôn sẵn sàng phản hồi nhanh.', 'content'],
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
        // subtitle format: "tag||mô tả" — tag hiển thị như eyebrow nhỏ phía trên tiêu đề (cbn-slide-tag)
        // title dùng *chữ* để render <em> nhấn màu accent (xem website/src/utils/text.tsx renderTitle())
        // Nút phụ (ghost) hardcode theo index trong HeroSlider.tsx — nút chính (accent) lấy từ button_text/button_link
        $slides = [
            [
                'title' => 'Ngọt ngào *từ từng lớp bánh*',
                'subtitle' => 'Bánh ngọt thủ công mỗi ngày||Rosette là tiệm bánh & cà phê nhỏ xinh, nơi mỗi chiếc bánh kem đều được nặn tay tỉ mỉ như một bông hoa — ngọt vừa đủ, đẹp vừa mắt.',
                'button_text' => 'Xem thực đơn',
                'button_link' => '/menu',
                'image' => 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=500&q=80&auto=format&fit=crop',
                'sort_order' => 1,
            ],
            [
                'title' => 'Một tách cà phê, *một khoảnh khắc dịu êm*',
                'subtitle' => 'Cà phê specialty||Hạt cà phê specialty rang mới mỗi tuần, kết hợp cùng những công thức pha chế nhẹ nhàng như latte lavender, cappuccino hoa hồng.',
                'button_text' => 'Khám phá đồ uống',
                'button_link' => '/menu',
                'image' => 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=500&q=80&auto=format&fit=crop',
                'sort_order' => 2,
            ],
            [
                'title' => 'Góc nhỏ xinh *cho những tấm hình đẹp*',
                'subtitle' => 'Không gian check-in||Tông hồng pastel ấm áp, góc tường hoa và ánh sáng tự nhiên — mỗi góc trong Rosette đều sẵn sàng cho một bức ảnh đẹp.',
                'button_text' => 'Xem không gian',
                'button_link' => '/khong-gian',
                'image' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&q=80&auto=format&fit=crop',
                'sort_order' => 3,
            ],
            [
                'title' => 'Bánh sinh nhật, *tiệc nhỏ, kỷ niệm lớn*',
                'subtitle' => 'Đặt bánh sự kiện||Từ bánh kem thiết kế riêng đến set tiệc trà cho nhóm bạn — Rosette đồng hành cùng những dịp đặc biệt của bạn.',
                'button_text' => 'Đặt bánh ngay',
                'button_link' => '/lien-he',
                'image' => 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=500&q=80&auto=format&fit=crop',
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

    protected function seedExtensions(): void {
        $this->seedMenuCategories();
        $this->seedMenuItems();
        $this->seedGalleryItems();
        $this->seedTestimonials();
    }

    private function seedMenuCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_categories") > 0) return;
        $cats = [
            ['🎂 Bánh Kem', '', 1],
            ['🥧 Tart & Bánh Mảnh', '', 2],
            ['🍪 Bánh Quy & Macaron', '', 3],
            ['🥐 Croissant & Bánh Mì Ngọt', '', 4],
            ['☕ Cà Phê', '', 5],
            ['🍹 Trà & Đồ Uống Khác', '', 6],
        ];
        foreach ($cats as [$name, $desc, $order]) {
            $this->execute(
                "INSERT INTO menu_categories (name, slug, description, image, sort_order, status) VALUES (?, ?, ?, '', ?, 'published')",
                [$name, slugify($name), $desc, $order]
            );
        }
    }

    private function seedMenuItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_items") > 0) return;
        $catId = function (string $slug) {
            $row = $this->queryOne("SELECT id FROM menu_categories WHERE slug = ?", [$slug]);
            return $row ? (int)$row['id'] : null;
        };
        $banhKem   = $catId('banh-kem');
        $tart      = $catId('tart-banh-manh');
        $macaron   = $catId('banh-quy-macaron');
        $croissant = $catId('croissant-banh-mi-ngot');
        $caPhe     = $catId('ca-phe');
        $tra       = $catId('tra-do-uong-khac');

        // [category_id, name, description, price, image, badge, featured, sort_order]
        $items = [
            // Bánh kem
            [$banhKem, 'Bánh Kem Hoa Hồng Bơ', 'Cốt bông lan mềm, kem bơ nặn hoa hồng thủ công, ngọt thanh', 320000, 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=440&q=80&auto=format&fit=crop', 'Best-seller', 1, 1],
            [$banhKem, 'Bánh Kem Dâu Tươi', 'Kem tươi, dâu tây Đà Lạt theo mùa, cốt bông lan mềm', 285000, 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=440&q=80&auto=format&fit=crop', '', 0, 2],
            [$banhKem, 'Bánh Kem Socola Bỉ', 'Cốt cacao, ganache socola Callebaut đậm đà', 265000, 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=440&q=80&auto=format&fit=crop', '', 0, 3],
            [$banhKem, 'Bánh Kem Trà Xanh Matcha', 'Matcha Uji nguyên chất, vị đắng nhẹ cân bằng ngọt', 275000, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=440&q=80&auto=format&fit=crop', '', 0, 4],
            [$banhKem, 'Bánh Kem Trái Cây Nhiệt Đới', 'Xoài, kiwi, thanh long trang trí tươi mỗi ngày', 295000, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=440&q=80&auto=format&fit=crop', '', 0, 5],
            [$banhKem, 'Red Velvet Cream Cheese', 'Cốt red velvet mềm ẩm, kem phô mai tươi mịn', 260000, 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=440&q=80&auto=format&fit=crop', '', 0, 6],
            // Tart & bánh mảnh
            [$tart, 'Tart Trứng Bồ Đào Nha', 'Vỏ giòn nhiều lớp, nhân trứng nướng caramen mặt', 35000, 'https://images.unsplash.com/photo-1517705008128-361805f42e07?w=440&q=80&auto=format&fit=crop', '', 0, 1],
            [$tart, 'Tart Chanh Dây', 'Lemon curd chua thanh, lớp meringue phủ mặt', 42000, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=440&q=80&auto=format&fit=crop', '', 0, 2],
            [$tart, 'Tart Táo Caramel', 'Táo nướng caramen, quế thơm, vỏ bơ giòn', 45000, 'https://images.unsplash.com/photo-1541599468348-e96984315921?w=440&q=80&auto=format&fit=crop', '', 0, 3],
            [$tart, 'Tart Việt Quất Phô Mai', 'Phô mai kem béo mịn, việt quất tươi phủ mặt', 48000, 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=440&q=80&auto=format&fit=crop', '', 0, 4],
            // Bánh quy & macaron
            [$macaron, 'Macaron Pháp (hộp 6)', 'Vỏ giòn nhẹ, nhân kem bơ mềm mịn, 6 vị pastel', 120000, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=440&q=80&auto=format&fit=crop', 'Mới', 1, 1],
            [$macaron, 'Cookie Bơ Chocolate Chip', 'Giòn rìa, mềm tâm, socola chip đậm đà', 25000, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=440&q=80&auto=format&fit=crop', '', 0, 2],
            [$macaron, 'Cookie Yến Mạch Nho Khô', 'Yến mạch cán dẹt, nho khô, mật ong tự nhiên', 22000, 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=440&q=80&auto=format&fit=crop', '', 0, 3],
            [$macaron, 'Financier Hạnh Nhân', 'Bánh bơ hạnh nhân Pháp, mềm ẩm, thơm bơ nâu', 28000, 'https://images.unsplash.com/photo-1428515613728-6b4607e44363?w=440&q=80&auto=format&fit=crop', '', 0, 4],
            // Croissant & bánh mì ngọt
            [$croissant, 'Croissant Bơ Pháp', 'Bơ Isigny AOP, ủ 3 lớp, vỏ giòn tan ruột mềm', 42000, 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=440&q=80&auto=format&fit=crop', 'Signature', 1, 1],
            [$croissant, 'Pain Au Chocolat', 'Vỏ bơ giòn, 2 thanh socola đen bên trong', 45000, 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=440&q=80&auto=format&fit=crop', '', 0, 2],
            [$croissant, 'Cinnamon Roll Phô Mai Kem', 'Cuộn quế nướng, phủ kem phô mai béo nhẹ', 48000, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=440&q=80&auto=format&fit=crop', '', 0, 3],
            [$croissant, 'Bánh Mì Chuối Yến Mạch', 'Chuối chín, yến mạch cán, không dùng đường tinh', 38000, 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=440&q=80&auto=format&fit=crop', '', 0, 4],
            // Cà phê
            [$caPhe, 'Espresso', 'Arabica & Robusta blend, crema dày, hậu vị ngọt nhẹ', 39000, 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=440&q=80&auto=format&fit=crop', '', 0, 1],
            [$caPhe, 'Cappuccino Hoa Hồng', 'Espresso, sữa hấp foam mịn, syrup hoa hồng nhẹ', 55000, 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=440&q=80&auto=format&fit=crop', 'Đồ uống', 1, 2],
            [$caPhe, 'Latte Lavender', 'Sữa tươi tiệt trùng, syrup oải hương thơm nhẹ', 58000, 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=440&q=80&auto=format&fit=crop', '', 0, 3],
            [$caPhe, 'Cold Brew Đào', 'Cà phê ngâm lạnh 20 giờ, syrup đào tự nhiên', 62000, 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=440&q=80&auto=format&fit=crop', '', 0, 4],
            [$caPhe, 'Americano', 'Espresso pha loãng, uống nóng hoặc đá đều ngon', 42000, 'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?w=440&q=80&auto=format&fit=crop', '', 0, 5],
            // Trà & khác
            [$tra, 'Trà Đào Cam Sả', 'Hồng trà, đào ngâm, cam tươi, sả thơm dịu', 55000, 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=440&q=80&auto=format&fit=crop', '', 0, 1],
            [$tra, 'Matcha Latte Đá Xay', 'Matcha Uji, sữa tươi, đá xay mịn', 62000, 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?w=440&q=80&auto=format&fit=crop', '', 0, 2],
            [$tra, 'Soda Việt Quất Bạc Hà', 'Soda chanh, siro việt quất, lá bạc hà tươi', 52000, 'https://images.unsplash.com/photo-1541599468348-e96984315921?w=440&q=80&auto=format&fit=crop', '', 0, 3],
            [$tra, 'Sữa Chua Hoa Quả', 'Sữa chua nhà làm, topping trái cây theo mùa', 48000, 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=440&q=80&auto=format&fit=crop', '', 0, 4],
            [$tra, 'Chocolate Nóng Marshmallow', 'Socola Bỉ tan chảy, phủ marshmallow béo ngậy', 58000, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=440&q=80&auto=format&fit=crop', '', 0, 5],
        ];
        foreach ($items as [$categoryId, $name, $desc, $price, $image, $badge, $featured, $order]) {
            $slug = slugify($name);
            $exists = $this->queryOne("SELECT id FROM menu_items WHERE slug = ?", [$slug]);
            if ($exists) $slug .= '-' . $order;
            $this->execute(
                "INSERT INTO menu_items (category_id, name, slug, description, price, price_sale, image, badge, allergens, featured, sort_order, status)
                 VALUES (?, ?, ?, ?, ?, NULL, ?, ?, '', ?, ?, 'published')",
                [$categoryId, $name, $slug, $desc, $price, $image, $badge, $featured, $order]
            );
        }
    }

    private function seedGalleryItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM gallery_items") > 0) return;
        $items = [
            ['Quầy bánh Rosette nhìn tổng quan', 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600&q=80&auto=format&fit=crop'],
            ['Kệ trưng bày bánh nhiều tầng', 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=600&q=80&auto=format&fit=crop'],
            ['Không gian ngồi trong quán', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80&auto=format&fit=crop'],
            ['Góc bàn cạnh cửa sổ nhiều ánh sáng', 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?w=600&q=80&auto=format&fit=crop'],
            ['Bàn bánh trang trí hoa tươi', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80&auto=format&fit=crop'],
            ['Nguyên liệu làm bánh trên bàn bếp', 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=600&q=80&auto=format&fit=crop'],
            ['Góc chụp ảnh với bánh và hoa', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80&auto=format&fit=crop'],
            ['Chi tiết trang trí quán màu pastel', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80&auto=format&fit=crop'],
            ['Ly cà phê đặt trên bàn gỗ', 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=600&q=80&auto=format&fit=crop'],
        ];
        foreach ($items as $i => [$title, $image]) {
            $this->execute(
                "INSERT INTO gallery_items (title, description, image, category, sort_order, status) VALUES (?, '', ?, '', ?, 'published')",
                [$title, $image, $i + 1]
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $items = [
            ['Đặng Thảo Vy', 'Food blogger · TP.HCM', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80&auto=format&fit=crop', '"Bánh kem hoa hồng bơ đẹp như tiệm bánh Hàn Quốc, vị ngọt vừa phải không ngán. Không gian màu hồng pastel chụp ảnh cực xinh, tọa độ sống ảo mới của mình!"', 5],
            ['Ngô Bảo Trâm', 'Khách hàng thân thiết', 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=80&q=80&auto=format&fit=crop', '"Đặt bánh sinh nhật cho con gái, nhân viên tư vấn nhiệt tình, bánh giao đúng giờ và đẹp hơn cả hình mẫu mình gửi. Chắc chắn sẽ quay lại đặt lần sau!"', 5],
            ['Trịnh Anh Duy', 'Content creator · Hà Nội', 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=80&q=80&auto=format&fit=crop', '"Croissant ở đây giòn xốp đúng chuẩn Pháp, latte lavender thơm nhẹ nhàng dễ chịu. Chỗ ngồi làm việc buổi sáng rất yên tĩnh và dễ chịu."', 5],
        ];
        foreach ($items as $i => [$name, $title, $avatar, $content, $rating]) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, 'published')",
                [$name, $title, $avatar, $content, $rating, $i + 1]
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
