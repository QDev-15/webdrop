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
            ['site_name', 'MONO Coffee', 'general'],
            ['site_tagline', 'Cà Phê Hiện Đại, Tối Giản Cho Dân Công Sở & Startup', 'general'],
            ['site_description', 'MONO Coffee — quán cà phê hiện đại tối giản, chuyên specialty coffee pha máy espresso và syphon. Không gian yên tĩnh, wifi nhanh, ổ cắm mỗi bàn — nơi làm việc lý tưởng cho dân công sở và startup.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hello@monocoffee.vn', 'general'],
            ['site_phone', '0901 234 567', 'general'],
            ['site_address', '84 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM', 'general'],
            ['working_hours', '7:00 – 21:00 hàng ngày', 'general'],
            // ── SEO ──
            ['meta_title', 'MONO Coffee — Cà Phê Hiện Đại, Tối Giản Cho Dân Công Sở & Startup', 'seo'],
            ['meta_description', 'MONO Coffee — quán cà phê hiện đại tối giản, chuyên specialty coffee pha máy espresso và syphon. Không gian yên tĩnh, wifi nhanh, ổ cắm mỗi bàn.', 'seo'],
            ['meta_keywords', 'cafe hiện đại, specialty coffee, cafe làm việc, cafe wifi mạnh, cafe quận 1', 'seo'],
            // ── Mạng xã hội ──
            ['social_facebook', '#', 'social'],
            ['social_instagram', '#', 'social'],
            ['social_tiktok', '#', 'social'],
            ['zalo_phone', '0901234567', 'social'],
            // ── Footer ──
            ['footer_description', 'Cà phê hiện đại, tối giản — pha máy espresso và syphon chuẩn từng gram. Không gian yên tĩnh dành cho dân công sở và startup.', 'footer'],
            ['footer_copyright', '© 2026 MONO Coffee · Made in Vietnam 🇻🇳', 'footer'],
            // ── Liên hệ / Bản đồ ──
            ['map_embed', 'https://maps.google.com/maps?q=10.7826,106.6957&hl=vi&z=15&output=embed', 'contact'],
            // ── Tích hợp ──
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
            // ── Nội dung — Trang chủ ──
            ['home_features_eyebrow', 'Vì sao chọn MONO Coffee', 'content'],
            ['home_features_title', 'Bốn lý do dân công sở *chọn quay lại*', 'content'],
            ['home_features_sub', 'Không chỉ là cà phê ngon — mà là một nơi làm việc và gặp gỡ thực sự hiệu quả.', 'content'],
            ['home_menu_eyebrow', 'Thực đơn', 'content'],
            ['home_menu_title', 'Những ly *được gọi nhiều nhất*', 'content'],
            ['home_menu_sub', 'Từ espresso đậm đà đến cold brew mát lạnh — mỗi công thức đều được canh định lượng chính xác.', 'content'],
            ['home_story_badge', 'Triết lý pha chế', 'content'],
            ['home_story_title', 'Đơn giản hoá *ly cà phê ngon*', 'content'],
            ['home_story_text', 'Chúng tôi tin một quán cà phê hiện đại không cần quá nhiều lựa chọn — chỉ cần vài công thức được làm đúng, đều đặn, mỗi ngày. Đó là lý do menu của MONO Coffee gọn nhưng chất lượng đồng nhất từ ly đầu đến ly cuối trong ngày.', 'content'],
            ['home_story_list', "Định lượng bằng cân điện tử cho mọi shot espresso\nHạt rang mới mỗi tuần, ghi ngày rang trên bao bì\nBarista được đào tạo chuẩn hoá quy trình pha chế", 'content'],
            ['home_story_image', 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=700&q=80&auto=format&fit=crop', 'content'],
            ['home_space_eyebrow', 'Không gian quán', 'content'],
            ['home_space_title', 'Ba khu vực, *một tinh thần tối giản*', 'content'],
            ['home_space_sub', 'Từ quầy bar mở đến khu làm việc yên tĩnh — mỗi góc đều phục vụ một mục đích rõ ràng.', 'content'],
            ['home_testi_eyebrow', 'Khách nói gì', 'content'],
            ['home_testi_title', 'Được dân công sở *tin dùng*', 'content'],
            ['home_faq_eyebrow', 'Câu hỏi thường gặp', 'content'],
            ['home_faq_title', 'Giải đáp *nhanh cho bạn*', 'content'],
            ['home_cta_eyebrow', 'Đặt chỗ ngay', 'content'],
            ['home_cta_title', 'Ghé *MONO Coffee* hôm nay', 'content'],
            ['home_cta_text', 'Mở cửa từ 7:00 đến 21:00 mỗi ngày. Đặt bàn trước để đảm bảo có chỗ vào giờ cao điểm 8:00–10:00 và 14:00–16:00.', 'content'],
            ['home_cta_image1', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80&auto=format&fit=crop', 'content'],
            ['home_cta_image2', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&q=80&auto=format&fit=crop', 'content'],
            // ── Nội dung — Trang Thực đơn ──
            ['menu_page_title', 'Thực đơn', 'content'],
            ['menu_page_sub', 'Giá niêm yết rõ ràng — mỗi món ghi rõ phương pháp pha và nguồn gốc nguyên liệu.', 'content'],
            ['menu_beans_tag', 'Mua mang về', 'content'],
            ['menu_beans_title', 'Hạt cà phê specialty rang mới mỗi tuần', 'content'],
            ['menu_beans_text', 'Đóng gói 250g / 500g, ghi rõ ngày rang và vùng trồng (Cầu Đất, Khe Sanh). Đặt trực tiếp tại quầy hoặc qua Zalo — nhận trong ngày với đơn nội thành.', 'content'],
            ['menu_beans_image', 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80&auto=format&fit=crop', 'content'],
            // ── Nội dung — Trang Không gian ──
            ['space_page_title', 'Không gian', 'content'],
            ['space_page_sub', 'Thiết kế tối giản Bắc Âu — đường nét vuông vắn, gam màu trung tính, ánh sáng dịu nhẹ.', 'content'],
            ['space_area_eyebrow', 'Ba khu vực chính', 'content'],
            ['space_area_title', 'Mỗi góc, *một mục đích*', 'content'],
            ['space_area_sub', 'Từ xem barista pha chế đến tập trung làm việc hay họp nhóm kín đáo.', 'content'],
            ['amenity_eyebrow', 'Tiện ích', 'content'],
            ['amenity_title', 'Được trang bị *đầy đủ cho công việc*', 'content'],
            ['gallery_eyebrow', 'Hình ảnh thực tế', 'content'],
            ['gallery_title', 'Một góc nhìn *về MONO Coffee*', 'content'],
            ['space_cta_eyebrow', 'Đặt chỗ trước', 'content'],
            ['space_cta_title', 'Ghé thăm *không gian thật*', 'content'],
            ['space_cta_text', 'Cách tốt nhất để cảm nhận sự tối giản là ghé trực tiếp. Đặt trước phòng họp hoặc bàn nhóm để đảm bảo có chỗ vào giờ cao điểm.', 'content'],
            ['space_cta_image1', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80&auto=format&fit=crop', 'content'],
            ['space_cta_image2', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&q=80&auto=format&fit=crop', 'content'],
            // ── Nội dung — Trang Giới thiệu ──
            ['about_page_title', 'Giới thiệu', 'content'],
            ['about_page_sub', 'Câu chuyện thương hiệu, triết lý pha chế và đội ngũ đứng sau từng ly cà phê.', 'content'],
            ['about_story1_badge', 'Câu chuyện thương hiệu', 'content'],
            ['about_story1_title', 'Bắt đầu từ một *câu hỏi đơn giản*', 'content'],
            ['about_story1_text', "Năm 2019, người sáng lập MONO Coffee từng là một nhân viên văn phòng phải đi tìm quán cà phê mỗi ngày để làm việc — nhưng hầu hết đều quá ồn, thiếu ổ cắm, hoặc pha chế không ổn định giữa các lần gọi món.\n\nCâu hỏi đặt ra: nếu tự mở một quán, liệu có thể vừa giữ chất lượng cà phê chuẩn specialty, vừa thiết kế không gian thực sự phục vụ cho việc ngồi làm cả ngày? MONO Coffee ra đời từ câu hỏi đó — không cầu kỳ, không thừa thãi, chỉ tập trung vào điều cốt lõi.", 'content'],
            ['about_story1_image', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=700&q=80&auto=format&fit=crop', 'content'],
            ['about_story2_badge', 'Triết lý specialty coffee', 'content'],
            ['about_story2_title', 'Ít lựa chọn hơn, *chuẩn hơn*', 'content'],
            ['about_story2_text', 'Chúng tôi không chạy theo số lượng món trên menu. Mỗi công thức tại MONO Coffee đều được định lượng bằng cân điện tử, canh thời gian chiết xuất bằng đồng hồ bấm giờ — để ly cà phê bạn uống hôm nay và tuần sau đều giống nhau về hương vị.', 'content'],
            ['about_story2_list', "Hạt Arabica đơn giống từ Cầu Đất và Khe Sanh, rang mới mỗi tuần\nMáy espresso 3 nhóm kiểm soát áp suất và nhiệt độ chính xác\nBarista được đào tạo quy trình chuẩn hoá, không pha theo cảm tính", 'content'],
            ['about_story2_image', 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=700&q=80&auto=format&fit=crop', 'content'],
            ['about_values_eyebrow', 'Giá trị cốt lõi', 'content'],
            ['about_values_title', 'Ba nguyên tắc *không thay đổi*', 'content'],
            ['about_timeline_eyebrow', 'Hành trình', 'content'],
            ['about_timeline_title', 'Từ một quầy nhỏ *đến điểm đến quen thuộc*', 'content'],
            ['about_team_eyebrow', 'Đội ngũ', 'content'],
            ['about_team_title', 'Những người *đứng sau quầy bar*', 'content'],
            ['about_team_sub', 'Đội ngũ barista được đào tạo bài bản, hiểu rõ từng công thức và câu chuyện phía sau mỗi loại hạt.', 'content'],
            ['about_cta_eyebrow', 'Kết nối với chúng tôi', 'content'],
            ['about_cta_title', 'Muốn biết thêm về *MONO Coffee*?', 'content'],
            ['about_cta_text', 'Ghé quán trực tiếp để trò chuyện cùng đội ngũ barista, hoặc liên hệ nếu bạn muốn hợp tác/đặt tiệc công ty.', 'content'],
            ['about_cta_image1', 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&q=80&auto=format&fit=crop', 'content'],
            ['about_cta_image2', 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=500&q=80&auto=format&fit=crop', 'content'],
            // ── Nội dung — Trang Liên hệ ──
            ['contact_intro_title', 'Liên hệ với MONO Coffee', 'content'],
            ['contact_intro_text', 'Đặt chỗ nhóm, đặt tiệc công ty, giao cà phê văn phòng hoặc mua hạt cà phê rang mới mang về — chúng tôi phản hồi trong vòng 15 phút trong giờ mở cửa.', 'content'],
            // ── SMTP ──
            ['smtp_host', '', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from_name', 'MONO Coffee', 'smtp'],
            ['smtp_from_email', '', 'smtp'],
            // ── Nâng cao ──
            ['maintenance_mode', '0', 'system'],
            ['items_per_page', '20', 'system'],
            // ── Cloudinary ──
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key', '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
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
        // subtitle encode format: "label||description||secondaryBtnText||secondaryBtnLink"
        // (button_text/button_link cột core dùng cho nút primary)
        $slides = [
            [
                'title' => 'Cà phê ngon, *không gian gọn gàng*.',
                'subtitle' => 'Specialty Coffee · Tối giản||MONO Coffee pha chế bằng máy espresso chuyên nghiệp và syphon thủ công — phục vụ đúng gu người bận rộn: nhanh, chuẩn vị, không rườm rà.||Khám phá không gian||/khong-gian',
                'button_text' => 'Xem thực đơn',
                'button_link' => '/menu',
                'image' => 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=900&q=80&auto=format&fit=crop',
                'sort_order' => 1,
            ],
            [
                'title' => 'Espresso chuẩn *từng gram*.',
                'subtitle' => 'Máy móc chuyên nghiệp||Máy espresso 3 nhóm pha chuẩn áp suất, cân điện tử định lượng từng shot — mỗi ly ra quán đều đồng nhất về hương vị, không phụ thuộc cảm tính.||Triết lý pha chế||/gioi-thieu',
                'button_text' => 'Menu Espresso-based',
                'button_link' => '/menu',
                'image' => 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=900&q=80&auto=format&fit=crop',
                'sort_order' => 2,
            ],
            [
                'title' => 'Nơi làm việc *tập trung hơn*.',
                'subtitle' => 'Dành cho dân công sở||Ổ cắm ở mọi bàn, wifi tốc độ cao ổn định, ánh sáng tự nhiên và âm lượng vừa đủ — không gian được thiết kế để bạn ngồi làm việc cả buổi mà không mỏi.||Đặt phòng họp nhỏ||/lien-he',
                'button_text' => 'Xem khu làm việc',
                'button_link' => '/khong-gian',
                'image' => 'https://images.unsplash.com/photo-1522992319-0365e5f11656?w=900&q=80&auto=format&fit=crop',
                'sort_order' => 3,
            ],
            [
                'title' => 'Ít chi tiết, *nhiều cảm hứng*.',
                'subtitle' => 'Thiết kế tối giản Bắc Âu||Đường nét vuông vắn, gam màu trung tính, ánh sáng dịu — không gian được lược bỏ mọi chi tiết thừa để bạn tập trung vào việc đang làm và tách cà phê trước mặt.||Liên hệ đặt chỗ||/lien-he',
                'button_text' => 'Xem không gian',
                'button_link' => '/khong-gian',
                'image' => 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=900&q=80&auto=format&fit=crop',
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

    // ─── Extension seeds (cafe-hien-dai) ──────────────────────────────────────

    protected function seedExtensions(): void {
        $this->seedMenuCategories();
        $this->seedMenuItems();
        $this->seedGalleryItems();
        $this->seedTestimonials();
        $this->seedContentBlocks();
        $this->seedSpaces();
        $this->seedTeamMembers();
        $this->seedTimelineItems();
        $this->seedFaqs();
    }

    private function seedMenuCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_categories") > 0) return;
        $cats = [
            ['Espresso-based', 'espresso-based', 'Cà phê pha máy espresso — đậm đà, chuẩn định lượng.', 1],
            ['Pour Over / Syphon', 'pour-over-syphon', 'Rót tay, syphon thủ công — trong vị, tôn hương hạt.', 2],
            ['Cold Brew & Đá Xay', 'cold-brew-da-xay', 'Ủ lạnh 18 giờ, đá xay mát lạnh cho ngày nóng.', 3],
            ['Trà & Không Caffeine', 'tra-khong-caffeine', 'Trà, nước ép và soda cho người không dùng caffeine.', 4],
            ['Bánh & Snack', 'banh-snack', 'Bánh ngọt, sandwich ăn kèm cà phê.', 5],
        ];
        foreach ($cats as [$name, $slug, $desc, $order]) {
            $this->execute(
                "INSERT INTO menu_categories (name, slug, description, image, sort_order, status) VALUES (?, ?, ?, '', ?, 'published')",
                [$name, $slug, $desc, $order]
            );
        }
    }

    private function seedMenuItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_items") > 0) return;
        $catId = fn(string $slug) => (int)$this->scalar("SELECT id FROM menu_categories WHERE slug = ?", [$slug]);

        $espresso = $catId('espresso-based');
        $manual   = $catId('pour-over-syphon');
        $cold     = $catId('cold-brew-da-xay');
        $tea      = $catId('tra-khong-caffeine');
        $bakery   = $catId('banh-snack');

        // [category_id, name, description, price, image, badge, featured, sort_order]
        $items = [
            [$espresso, 'Espresso Signature', 'Blend Arabica Cầu Đất & Robusta, chiết xuất 25–28 giây, crema dày', 42000, '', '', 0, 1],
            [$espresso, 'Americano', 'Espresso pha loãng với nước nóng/lạnh, giữ trọn hương thơm', 45000, '', '', 0, 2],
            [$espresso, 'Cortado', 'Espresso và sữa hấp tỉ lệ 1:1, đậm nhưng không gắt', 48000,
                'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80&auto=format&fit=crop', 'Espresso-based', 1, 3],
            [$espresso, 'Flat White', 'Double shot, microfoam mịn, tỉ lệ chuẩn kiểu Úc', 52000,
                'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80&auto=format&fit=crop', 'Espresso-based', 1, 4],
            [$espresso, 'Cappuccino', 'Espresso, sữa hấp, lớp foam dày rắc bột cacao', 50000, '', '', 0, 5],
            [$espresso, 'Latte Sữa Tươi', 'Double shot, sữa tươi tiệt trùng, có thể vẽ latte art', 55000, '', '', 0, 6],
            [$espresso, 'Mocha', 'Espresso, socola nguyên chất, sữa hấp, kem tươi', 58000, '', '', 0, 7],

            [$manual, 'Pour Over V60 — Cầu Đất, Đà Lạt', 'Single origin, rót tay qua giấy lọc, hương hoa và cam quýt', 65000,
                'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&q=80&auto=format&fit=crop', 'Manual Brew', 1, 1],
            [$manual, 'Pour Over V60 — Khe Sanh, Quảng Trị', 'Single origin, body dày hơn, hậu vị caramel và hạt dẻ', 65000, '', '', 0, 2],
            [$manual, 'Syphon Thủ Công', 'Pha bằng đèn cồn và bình thủy tinh, chiết xuất sạch, trong vị', 75000, '', '', 0, 3],
            [$manual, 'Aeropress', 'Áp lực tay ép nhanh, vị đậm gọn, ít chua, uống nhanh gọn', 60000, '', '', 0, 4],
            [$manual, 'French Press', 'Ngâm 4 phút, ép pít-tông, giữ tinh dầu tự nhiên, body dày', 58000, '', '', 0, 5],

            [$cold, 'Cold Brew 18h', 'Ủ lạnh 18 giờ ở 4°C, vị mượt, ít acid, ngọt tự nhiên', 58000, '', '', 0, 1],
            [$cold, 'Cold Brew Nitro', 'Cold brew bơm nitro, bọt kem mịn như bia, uống lạnh trực tiếp', 62000,
                'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80&auto=format&fit=crop', 'Cold Brew', 1, 2],
            [$cold, 'Espresso Tonic', 'Espresso, tonic water, đá viên, lát cam — vị sảng khoái', 60000, '', '', 0, 3],
            [$cold, 'Cà Phê Đá Xay Caramel', 'Espresso xay đá, sốt caramel, kem tươi phủ trên', 62000, '', '', 0, 4],

            [$tea, 'Matcha Latte', 'Bột matcha Uji Nhật Bản, sữa tươi hấp, không đường', 55000, '', '', 0, 1],
            [$tea, 'Hồng Trà Đào', 'Hồng trà Sri Lanka ủ lạnh, đào ngâm, đá viên', 50000, '', '', 0, 2],
            [$tea, 'Trà Ô Long Sữa', 'Ô long Đài Loan, sữa béo nhẹ, topping thạch', 50000, '', '', 0, 3],
            [$tea, 'Nước Ép Táo Gừng', 'Táo Fuji ép tươi, gừng, mật ong — không caffeine', 48000, '', '', 0, 4],
            [$tea, 'Soda Chanh Sả', 'Chanh tươi, sả đập dập, soda lạnh — giải nhiệt giữa giờ họp', 42000, '', '', 0, 5],

            [$bakery, 'Croissant Bơ Pháp', 'Bơ AOP, lớp vỏ giòn, ruột mềm — phù hợp ăn kèm espresso', 38000, '', '', 0, 1],
            [$bakery, 'Bánh Mì Sandwich Kẹp', 'Bánh mì nướng giòn, trứng, phô mai, rau xanh — no bụng bữa sáng', 48000, '', '', 0, 2],
            [$bakery, 'Cheesecake New York', 'Cream cheese không nướng, mịn béo, ăn kèm espresso rất hợp', 55000, '', '', 0, 3],
            [$bakery, 'Cookie Bơ Hạnh Nhân', 'Giòn rụm, hạnh nhân lát mỏng, ít ngọt — snack giữa giờ làm việc', 28000, '', '', 0, 4],
        ];

        foreach ($items as [$cid, $name, $desc, $price, $image, $badge, $featured, $order]) {
            $this->execute(
                "INSERT INTO menu_items (category_id, name, slug, description, price, image, badge, featured, sort_order, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')",
                [$cid, $name, slugify($name), $desc, $price, $image, $badge, $featured, $order]
            );
        }
    }

    private function seedGalleryItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM gallery_items") > 0) return;
        $items = [
            ['Quầy bar mở', 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&q=80&auto=format&fit=crop'],
            ['Nội thất tối giản', 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600&q=80&auto=format&fit=crop'],
            ['Khu làm việc', 'https://images.unsplash.com/photo-1522992319-0365e5f11656?w=600&q=80&auto=format&fit=crop'],
            ['Phòng họp nhỏ', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80&auto=format&fit=crop'],
            ['Hạt cà phê trưng bày', 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80&auto=format&fit=crop'],
            ['Barista pha chế', 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80&auto=format&fit=crop'],
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
            ['Đặng Hoàng Nam', 'Product Manager, startup fintech',
                'Không gian đúng kiểu tối giản mình thích — không ồn, ổ cắm ở đâu cũng có, wifi nhanh. Mình hay đặt bàn làm việc cả buổi chiều ở đây, năng suất hơn hẳn ở nhà.',
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80&auto=format&fit=crop'],
            ['Vũ Thị Ngọc Anh', 'Trưởng nhóm marketing',
                'Flat White ở đây pha chuẩn vị nhất khu vực — foam mịn, không quá ngọt. Team mình hay họp nhóm nhỏ ở phòng riêng, giá thuê hợp lý mà không gian yên tĩnh.',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&auto=format&fit=crop'],
            ['Trần Gia Bảo', 'Kỹ sư phần mềm freelance',
                'Mua hạt cà phê mang về thường xuyên, chất lượng ổn định qua từng đợt. Đặt giao văn phòng cũng nhanh, đúng giờ. Rất recommend cho ai làm remote.',
                'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&q=80&auto=format&fit=crop'],
        ];
        foreach ($items as $i => [$name, $title, $content, $avatar]) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order, status)
                 VALUES (?, ?, ?, ?, 5, ?, 'published')",
                [$name, $title, $avatar, $content, $i + 1]
            );
        }
    }

    private function seedContentBlocks(): void {
        if ($this->scalar("SELECT COUNT(*) FROM content_blocks") > 0) return;
        $blocks = [
            // Vì sao chọn (why-us) — index.html
            ['why-us', '☕', 'Máy pha chuyên nghiệp', 'Máy espresso 3 nhóm + syphon thủ công, chiết xuất chuẩn áp suất và nhiệt độ cho từng loại hạt.', 1],
            ['why-us', '🌱', 'Hạt specialty chọn lọc', 'Nguồn hạt Arabica đơn giống từ Cầu Đất, Khe Sanh — rang mới mỗi tuần, ghi rõ ngày rang trên bao bì.', 2],
            ['why-us', '🔌', 'Ổ cắm mỗi bàn', '100% bàn có ổ cắm điện, wifi tốc độ cao ổn định — ngồi làm việc cả buổi không lo hết pin, rớt mạng.', 3],
            ['why-us', '🤫', 'Không gian yên tĩnh', 'Nhạc nền âm lượng thấp, cách âm tốt giữa các khu — phù hợp gọi video call hoặc tập trung sâu.', 4],
            // Giá trị cốt lõi (values) — gioi-thieu.html
            ['values', '⚖️', 'Chính xác', 'Mọi công thức đều có định lượng cụ thể — không "áng chừng". Đó là cách chúng tôi đảm bảo chất lượng đồng nhất.', 1],
            ['values', '◻️', 'Tối giản', 'Bỏ bớt những gì không cần thiết — cả trong thiết kế không gian lẫn số lượng món trên thực đơn.', 2],
            ['values', '🤝', 'Phục vụ đúng nhu cầu', 'Hiểu rằng khách hàng chính của chúng tôi cần một nơi để làm việc hiệu quả — không chỉ để uống cà phê.', 3],
            // Tiện ích (amenities) — khong-gian.html
            ['amenities', '🔌', 'Ổ cắm mỗi bàn', '', 1],
            ['amenities', '📶', 'Wifi tốc độ cao', '', 2],
            ['amenities', '☀️', 'Ánh sáng tự nhiên', '', 3],
            ['amenities', '🤫', 'Cách âm phòng họp', '', 4],
        ];
        foreach ($blocks as [$section, $icon, $title, $desc, $order]) {
            $this->execute(
                "INSERT INTO content_blocks (section, icon, title, description, sort_order, status) VALUES (?, ?, ?, ?, ?, 'published')",
                [$section, $icon, $title, $desc, $order]
            );
        }
    }

    private function seedSpaces(): void {
        if ($this->scalar("SELECT COUNT(*) FROM spaces") > 0) return;
        $items = [
            ['Quầy Bar Mở', 'Open Bar Counter', 'Xem barista pha chế trực tiếp',
                'Quầy pha chế đặt giữa không gian, khách có thể quan sát toàn bộ quy trình từ xay hạt, định lượng đến chiết xuất espresso và syphon.',
                'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=700&q=80&auto=format&fit=crop'],
            ['Khu Làm Việc', 'Co-working Corner', 'Bàn đơn, ổ cắm, ánh sáng tự nhiên',
                'Bàn đơn sát cửa sổ đón ánh sáng tự nhiên, mỗi chỗ ngồi có ổ cắm riêng — phù hợp làm việc cá nhân hoặc gọi video call ngắn.',
                'https://images.unsplash.com/photo-1522992319-0365e5f11656?w=700&q=80&auto=format&fit=crop'],
            ['Phòng Họp Nhỏ', 'Meeting Nook', 'Tối đa 6 người, đặt trước qua liên hệ',
                'Không gian kín đáo tối đa 6 người, cách âm tốt với khu ngoài — lý tưởng cho họp nhóm, phỏng vấn hoặc gọi video quan trọng.',
                'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=700&q=80&auto=format&fit=crop'],
        ];
        foreach ($items as $i => [$name, $caption, $overlay, $desc, $image]) {
            $this->execute(
                "INSERT INTO spaces (name, caption, overlay_text, description, image, sort_order, status)
                 VALUES (?, ?, ?, ?, ?, ?, 'published')",
                [$name, $caption, $overlay, $desc, $image, $i + 1]
            );
        }
    }

    private function seedTeamMembers(): void {
        if ($this->scalar("SELECT COUNT(*) FROM team_members") > 0) return;
        $items = [
            ['Nguyễn Minh Đức', 'Founder & Head Barista', '6 năm kinh nghiệm pha chế, chứng chỉ SCA Barista Skills, người xây dựng toàn bộ công thức tại quán.',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop'],
            ['Lê Thị Hoài An', 'Quản lý vận hành', 'Phụ trách chất lượng dịch vụ, xử lý đặt chỗ nhóm và tiệc công ty hàng ngày.',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop'],
            ['Trần Quốc Bảo', 'Barista chính', 'Chuyên trách pha chế syphon và pour over, phụ trách rang thử các mẻ hạt mới hàng tuần.',
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80&auto=format&fit=crop'],
            ['Phạm Ngọc Mai', 'Barista ca sáng', 'Phụ trách khung giờ cao điểm 7:00–10:00, thuộc lòng đơn quen của khách văn phòng thường xuyên.',
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80&auto=format&fit=crop'],
        ];
        foreach ($items as $i => [$name, $position, $bio, $avatar]) {
            $this->execute(
                "INSERT INTO team_members (name, position, bio, avatar, sort_order, status) VALUES (?, ?, ?, ?, ?, 'published')",
                [$name, $position, $bio, $avatar, $i + 1]
            );
        }
    }

    private function seedTimelineItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM timeline_items") > 0) return;
        $items = [
            ['2019', 'Khởi đầu', 'Mở quầy pha chế đầu tiên', 'MONO Coffee bắt đầu từ một không gian nhỏ chỉ 6 bàn, tập trung hoàn toàn vào chất lượng espresso và pour over.'],
            ['2021', 'Mở rộng', 'Thêm khu làm việc và phòng họp nhỏ', 'Nhận thấy nhu cầu của khách hàng văn phòng, chúng tôi cải tạo lại không gian với khu bàn đơn có ổ cắm và phòng họp riêng.'],
            ['2023', 'Chuẩn hoá', 'Xây dựng quy trình pha chế chuẩn hoá', 'Đầu tư máy espresso 3 nhóm và cân định lượng điện tử, xây dựng SOP pha chế để đảm bảo chất lượng đồng nhất ở mọi ca làm việc.'],
            ['2026', 'Hiện tại', 'Điểm đến quen thuộc của dân công sở', 'Phục vụ hơn 300 ly mỗi ngày, trở thành nơi làm việc và họp nhóm quen thuộc của nhiều startup và công ty quanh khu vực.'],
        ];
        foreach ($items as $i => [$year, $phase, $title, $desc]) {
            $this->execute(
                "INSERT INTO timeline_items (year, phase, title, description, sort_order, status) VALUES (?, ?, ?, ?, ?, 'published')",
                [$year, $phase, $title, $desc, $i + 1]
            );
        }
    }

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $items = [
            ['Tôi có thể đặt chỗ trước cho họp nhóm không?', 'Có. MONO Coffee có phòng họp nhỏ tối đa 6 người và khu bàn nhóm ở Tầng 1. Bạn có thể đặt trước qua trang Liên hệ hoặc gọi hotline, xác nhận trong vòng 15 phút. Phòng họp giữ chỗ miễn phí trong 20 phút đầu.'],
            ['Wifi và ổ cắm điện có sẵn ở mọi bàn không?', 'Có, 100% bàn tại quán đều có ổ cắm điện gần kề và phủ sóng wifi tốc độ cao ổn định. Mật khẩu wifi được in trên hóa đơn hoặc hỏi trực tiếp nhân viên quầy.'],
            ['Giá đồ uống ở MONO Coffee có đắt không?', 'Giá dao động 40.000đ – 70.000đ tùy loại thức uống — tương đương mặt bằng chung các quán specialty coffee. Chúng tôi ưu tiên chất lượng nguyên liệu và độ chuẩn xác trong pha chế hơn là cạnh tranh về giá thấp.'],
            ['Tôi có thể mua hạt cà phê rang sẵn mang về không?', 'Có. Quán bán hạt cà phê rang mới mỗi tuần theo túi 250g/500g, có ghi rõ ngày rang và vùng trồng. Bạn có thể mua trực tiếp tại quầy hoặc đặt qua Zalo, nhận trong ngày với đơn nội thành.'],
            ['Quán có giao cà phê đến văn phòng không?', 'Có, chúng tôi nhận đơn giao văn phòng từ 5 ly trở lên trong bán kính 3km, thời gian giao trung bình 20–30 phút. Đặt qua Zalo hoặc gọi trực tiếp trước 30 phút để đảm bảo nóng/lạnh đúng chuẩn khi đến nơi.'],
            ['Tôi muốn đặt tiệc nhỏ cho công ty thì liên hệ thế nào?', 'Với nhóm trên 15 người, vui lòng liên hệ trước ít nhất 1 ngày qua trang Liên hệ để được tư vấn set menu riêng, sắp xếp khu vực và giữ chỗ độc quyền theo khung giờ bạn cần.'],
            ['Quán có phục vụ đồ ăn nhẹ không, hay chỉ có đồ uống?', 'Có bánh ngọt, sandwich và snack nhẹ phục vụ kèm — xem chi tiết tại mục "Bánh & Snack" trong trang Thực đơn. Quán không phục vụ bữa chính đầy đủ như nhà hàng.'],
        ];
        foreach ($items as $i => [$q, $a]) {
            $this->execute(
                "INSERT INTO faqs (question, answer, sort_order, status) VALUES (?, ?, ?, 'published')",
                [$q, $a, $i + 1]
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
