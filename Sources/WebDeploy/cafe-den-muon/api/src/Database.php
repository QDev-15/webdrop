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
        $this->seedMenuCategories();
        $this->seedMenuItems();
        $this->seedGalleryItems();
        $this->seedTestimonials();
        $this->seedFaqs();
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
            // ── Chung ──────────────────────────────────────────────────────────
            ['site_name', 'NOX Coffee', 'general'],
            ['site_tagline', 'Thành phố ngủ, NOX vẫn sáng đèn', 'general'],
            ['site_description', 'NOX — quán cà phê mở đến 2 giờ sáng dành cho dân văn phòng làm việc muộn, sinh viên ôn thi và những ai không muốn dừng lại khi thành phố đã ngủ.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hello@noxcoffee.vn', 'general'],
            ['site_phone', '0901 234 567', 'general'],
            ['site_address', '184 Nguyễn Thị Minh Khai, Phường Võ Thị Sáu, Quận 3, TP.HCM', 'general'],
            ['working_hours', '18:00 – 02:00 hằng ngày', 'general'],

            // ── Trang chủ (home) ──────────────────────────────────────────────
            ['home_stats', "18:00–02:00|Giờ hoạt động mỗi ngày\n100%|Bàn có ổ cắm riêng\n300Mbps|Wifi tốc độ cao\n80|Chỗ ngồi, 3 khu vực", 'home'],
            ['home_features', "💻|Dân văn phòng tăng ca|Bàn riêng, ổ cắm, đèn không chói mắt — làm việc đến khuya vẫn thoải mái như ở nhà.\n📖|Sinh viên ôn thi|Khu học nhóm yên tĩnh, combo giá sinh viên sau 22h, wifi ổn định xuyên đêm.\n🎨|Người làm sáng tạo|Không gian yên tĩnh sau nửa đêm, nhạc lo-fi nhẹ nhàng, không gian riêng tư để tập trung.", 'home'],

            // ── Thực đơn (menu) ───────────────────────────────────────────────
            ['menu_section_note', '🌙 Sau 22:00, mọi món giảm 10% cho khách xuất trình thẻ sinh viên', 'menu'],

            // ── Giới thiệu (about) ────────────────────────────────────────────
            ['about_eyebrow', 'Khởi nguồn', 'about'],
            ['about_year', '2021', 'about'],
            ['about_desc1', 'NOX ra đời năm 2021 từ một quan sát đơn giản: thành phố đóng cửa lúc 22h, nhưng công việc của rất nhiều người thì không. Dân thiết kế, lập trình viên, sinh viên ôn thi — tất cả đều cần một nơi để ở lại, không phải để "chill" mà để hoàn thành việc dở dang.', 'about'],
            ['about_desc2', 'Chúng tôi xây NOX theo đúng nhu cầu đó: ổ cắm ở mọi bàn, ánh sáng không gây mỏi mắt lúc 1 giờ sáng, và một menu caffeine được tính toán riêng cho những ca làm việc dài.', 'about'],
            ['about_image1', 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80&auto=format&fit=crop', 'about'],
            ['about_image2', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80&auto=format&fit=crop', 'about'],
            ['about_image3', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80&auto=format&fit=crop', 'about'],
            ['hours_stats', "18:00|Giờ mở cửa mỗi ngày\n02:00|Giờ đóng cửa (T2–CN)\n24h|Xuyên đêm tuần thi cử\n7|Ngày/tuần hoạt động", 'about'],
            ['hours_note', '* Vào tuần thi cuối kỳ (theo lịch các trường đại học lân cận), NOX mở cửa 24 giờ — theo dõi fanpage để cập nhật lịch cụ thể.', 'about'],
            ['audience_features', "💻|Người làm việc từ xa & tăng ca|Cần một nơi yên tĩnh sau giờ hành chính, có ổ cắm, wifi ổn định và không bị giục về khi ngồi lâu.\n🎓|Sinh viên mùa thi|Cần không gian học nhóm, giá cả phải chăng, và caffeine đủ mạnh để trụ qua ca ôn bài thâu đêm.\n🌙|Cú đêm & người làm sáng tạo|Múi giờ sáng tạo lệch pha với số đông — NOX là nơi để họ làm việc đúng nhịp sinh học của mình.", 'about'],

            // ── SEO ────────────────────────────────────────────────────────────
            ['meta_title', 'NOX Coffee — Cà Phê Đêm Muộn', 'seo'],
            ['meta_description', 'NOX — quán cà phê mở đến 2 giờ sáng dành cho dân văn phòng làm việc muộn, sinh viên ôn thi và những ai không muốn dừng lại khi thành phố đã ngủ.', 'seo'],
            ['meta_keywords', 'cà phê đêm muộn, quán cà phê mở xuyên đêm, cà phê 24h, cafe sinh viên ôn thi, NOX Coffee', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80&auto=format&fit=crop', 'seo'],

            // ── Mạng xã hội ────────────────────────────────────────────────────
            ['social_facebook', 'https://facebook.com/noxcoffee', 'social'],
            ['social_instagram', 'https://instagram.com/noxcoffee', 'social'],
            ['social_zalo', '0901234567', 'social'],
            ['social_tiktok', 'https://tiktok.com/@noxcoffee', 'social'],

            // ── Footer ─────────────────────────────────────────────────────────
            ['footer_copyright', '© 2026 NOX Coffee · Made in Vietnam 🇻🇳', 'footer'],
            ['footer_description', 'Espresso bar mở đến 2 giờ sáng — nơi thành phố ngủ nhưng công việc, bài vở và ý tưởng của bạn thì chưa xong.', 'footer'],

            // ── Liên hệ ────────────────────────────────────────────────────────
            ['map_lat', '10.7847', 'contact'],
            ['map_lng', '106.6917', 'contact'],

            // ── Pháp lý ────────────────────────────────────────────────────────
            ['legal_updated', '01/01/2026', 'legal'],
            ['privacy_content', '<h2>1. Thông tin chúng tôi thu thập</h2><p>Khi bạn đặt bàn qua website, nhắn Zalo hoặc điền form liên hệ, NOX Coffee thu thập các thông tin bạn chủ động cung cấp: họ tên, số điện thoại, email, ngày giờ đến quán và ghi chú yêu cầu (nếu có).</p><h2>2. Mục đích sử dụng thông tin</h2><p>Thông tin được sử dụng để xác nhận đặt bàn, liên hệ khi có thay đổi lịch, và gửi thông báo về chương trình ưu đãi nếu bạn đồng ý nhận tin. Chúng tôi không sử dụng thông tin khách hàng cho mục đích quảng cáo bên thứ ba.</p><h2>3. Bảo mật thông tin</h2><p>Thông tin khách hàng được lưu trữ nội bộ, chỉ nhân viên phụ trách đặt bàn và chăm sóc khách hàng mới có quyền truy cập. Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của khách hàng cho bên thứ ba khi chưa có sự đồng ý.</p><h2>4. Camera an ninh</h2><p>NOX có lắp đặt camera an ninh tại khu vực chung nhằm đảm bảo an toàn cho khách hàng và tài sản. Hình ảnh ghi lại chỉ được sử dụng cho mục đích an ninh nội bộ, không công khai trừ khi có yêu cầu từ cơ quan chức năng.</p><h2>5. Quyền của khách hàng</h2><p>Bạn có quyền yêu cầu chúng tôi cung cấp, chỉnh sửa hoặc xóa thông tin cá nhân đã cung cấp bất kỳ lúc nào bằng cách liên hệ qua email <strong>hello@noxcoffee.vn</strong>.</p><h2>6. Thay đổi chính sách</h2><p>Chính sách này có thể được cập nhật theo thời gian. Phiên bản mới nhất luôn được đăng tải tại trang này kèm ngày cập nhật.</p><h2>7. Liên hệ</h2><p>Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ <strong>hello@noxcoffee.vn</strong> hoặc <strong>0901 234 567</strong>.</p>', 'legal'],
            ['terms_content', '<h2>1. Phạm vi áp dụng</h2><p>Điều khoản này áp dụng cho mọi khách hàng sử dụng dịch vụ tại NOX Coffee, bao gồm đặt bàn qua website, Zalo, điện thoại hoặc đến trực tiếp quán.</p><h2>2. Đặt bàn & giữ chỗ</h2><ul><li>Đặt bàn được xác nhận qua Zalo hoặc điện thoại trong vòng 15 phút kể từ khi gửi yêu cầu.</li><li>Bàn được giữ tối đa 20 phút sau giờ đặt; quá thời gian này quán có quyền xếp bàn cho khách khác.</li><li>Phòng Học Nhóm yêu cầu đặt trước ít nhất 3 tiếng, hủy miễn phí nếu báo trước 1 tiếng.</li></ul><h2>3. Quy định sử dụng không gian</h2><ul><li>Khách được khuyến khích gọi tối thiểu 1 món mỗi 3 tiếng khi ngồi làm việc lâu.</li><li>Vui lòng giữ âm lượng vừa phải để không ảnh hưởng khách xung quanh, đặc biệt tại khu Coding Corner.</li><li>Không mang đồ ăn thức uống từ bên ngoài vào quán, trừ trường hợp đã trao đổi trước với nhân viên.</li></ul><h2>4. Chương trình ưu đãi</h2><p>Ưu đãi giảm 10% cho sinh viên sau 22:00 áp dụng khi xuất trình thẻ sinh viên còn hiệu lực, không cộng dồn với các chương trình khuyến mãi khác trừ khi có thông báo riêng.</p><h2>5. Trách nhiệm về tài sản cá nhân</h2><p>NOX không chịu trách nhiệm với tài sản cá nhân (laptop, điện thoại, ví...) bị thất lạc trong quán. Khách vui lòng tự bảo quản đồ đạc, đặc biệt khi rời bàn trong thời gian dài.</p><h2>6. Thay đổi điều khoản</h2><p>NOX có quyền cập nhật điều khoản sử dụng theo thời gian để phù hợp với tình hình vận hành thực tế. Phiên bản mới nhất luôn được đăng tải tại trang này.</p>', 'legal'],

            // ── SMTP ───────────────────────────────────────────────────────────
            ['smtp_host', '', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_password', '', 'smtp'],
            ['smtp_from_name', 'NOX Coffee', 'smtp'],
            ['smtp_from_email', 'no-reply@noxcoffee.vn', 'smtp'],

            // ── Hệ thống ───────────────────────────────────────────────────────
            ['maintenance_mode', '0', 'system'],
            ['maintenance_message', 'Website đang bảo trì. Vui lòng quay lại sau.', 'system'],

            // ── Cloudinary ─────────────────────────────────────────────────────
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_folder', 'cafe-den-muon', 'cloudinary'],
            ['cloudinary_api_key', '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],

            // ── Tích hợp ───────────────────────────────────────────────────────
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
        $slides = [
            [
                'title'       => 'Thành phố ngủ,\n*NOX vẫn sáng đèn*.',
                'subtitle'    => 'Mở cửa đến 2 giờ sáng||Không gian espresso bar dành cho những ai chưa muốn kết thúc một ngày — dân văn phòng tăng ca, freelancer deadline gấp, sinh viên ôn thi thâu đêm.',
                'button_text' => 'Xem thực đơn ☕',
                'button_link' => '/thuc-don',
                'image'       => '',
                'sort_order'  => 1,
            ],
            [
                'title'       => 'Deadline không đợi,\n*cà phê thì có*.',
                'subtitle'    => 'Góc làm việc đêm||Mỗi bàn một ổ cắm, wifi 300Mbps, đèn bàn ánh sáng ấm dịu mắt. Ngồi bao lâu cũng không ai giục — đó là nguyên tắc của NOX.',
                'button_text' => 'Xem góc làm việc',
                'button_link' => '/khong-gian',
                'image'       => '',
                'sort_order'  => 2,
            ],
            [
                'title'       => 'Ôn thi thâu đêm,\n*NOX lo phần caffeine*.',
                'subtitle'    => 'Mùa thi đến rồi||Combo sinh viên: 1 espresso đúp + 1 bánh mặn, giá mềm sau 22h. Khu vực yên tĩnh riêng cho nhóm học bài từ 4–8 người.',
                'button_text' => 'Xem combo sinh viên',
                'button_link' => '/thuc-don',
                'image'       => '',
                'sort_order'  => 3,
            ],
            [
                'title'       => 'Espresso đậm,\n*tỉnh táo trọn đêm*.',
                'subtitle'    => 'Năng lượng không ngủ||Hạt rang đậm riêng cho khung giờ khuya — caffeine cao hơn 20% so với menu ban ngày, vị đắng nhẹ hậu ngọt, không gắt.',
                'button_text' => 'Xem menu đêm',
                'button_link' => '/thuc-don',
                'image'       => '',
                'sort_order'  => 4,
            ],
        ];
        foreach ($slides as $slide) {
            $this->execute(
                "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                [$slide['title'], $slide['subtitle'], $slide['button_text'], $slide['button_link'], $slide['image'], $slide['sort_order']]
            );
        }
    }

    // ─── Extension seeds — cafe-den-muon ──────────────────────────────────────

    private function seedMenuCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_categories") > 0) return;
        $cats = [
            ['Espresso-based', 'espresso', 1],
            ['Cold Brew đặc biệt', 'coldbrew', 2],
            ['Trà & Đá xay', 'tra', 3],
            ['Đồ ăn nhẹ đêm', 'an', 4],
        ];
        foreach ($cats as [$name, $slug, $order]) {
            $this->execute(
                "INSERT INTO menu_categories (name, slug, sort_order) VALUES (?, ?, ?)",
                [$name, $slug, $order]
            );
        }
    }

    private function seedMenuItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_items") > 0) return;
        $catIds = [];
        foreach ($this->query("SELECT id, slug FROM menu_categories") as $c) { $catIds[$c['slug']] = $c['id']; }

        $items = [
            // Espresso-based
            ['espresso', 'Double Shot Đêm', 'Espresso đúp rang đậm, hậu vị ca cao — dòng chủ lực buổi tối', 49000, 1],
            ['espresso', 'Americano Rang Đậm', 'Espresso pha loãng với nước nóng, caffeine cao, ít calo', 42000, 2],
            ['espresso', 'Cappuccino Đêm', 'Espresso, sữa hấp foam dày, rắc bột ca cao đắng nhẹ', 52000, 3],
            ['espresso', 'Bạc Xỉu Năng Lượng', 'Sữa đặc, espresso đậm, thêm 1 shot caffeine tùy chọn', 52000, 4],
            ['espresso', 'Latte Muối Biển', 'Sữa tươi, foam muối biển nhẹ, cân bằng vị đắng-mặn', 58000, 5],
            ['espresso', 'Flat White Đúp', 'Tỉ lệ sữa/espresso cô đặc, uống nhanh tỉnh táo tức thì', 55000, 6],
            // Cold Brew đặc biệt
            ['coldbrew', 'Nitro Cold Brew', 'Ủ lạnh 20 giờ, bơm nitro tạo bọt kem mịn như bia đen', 65000, 1],
            ['coldbrew', 'Cold Brew Tonic', 'Cold brew pha nước tonic, vị sảng khoái, ga nhẹ', 62000, 2],
            ['coldbrew', 'Dirty Cold Brew', 'Sữa tươi đổ trước, cold brew rót lên tạo lớp — trend "dirty"', 60000, 3],
            ['coldbrew', 'Cold Brew Cam Sả', 'Cold brew, nước cam tươi, sả đập dập — vị lạ, tỉnh táo', 65000, 4],
            ['coldbrew', 'Cold Brew Đen Đá', 'Nguyên chất không thêm gì, caffeine cao nhất trong menu', 55000, 5],
            ['coldbrew', 'Cold Brew Dừa', 'Cold brew, nước cốt dừa béo nhẹ, đá bào mịn', 62000, 6],
            // Trà & Đá xay
            ['tra', 'Hồng Trà Đào Đêm', 'Hồng trà, đào ngâm, ít đường — tỉnh táo nhẹ không gắt bụng', 58000, 1],
            ['tra', 'Trà Ô Long Sữa', 'Ô long đậm, sữa béo, topping trân châu đường đen', 56000, 2],
            ['tra', 'Matcha Đá Xay', 'Matcha Nhật, sữa tươi, đá xay mịn — caffeine vừa phải', 62000, 3],
            ['tra', 'Mocha Đá Xay', 'Espresso, chocolate, đá xay, kem tươi — ngọt đậm cho đêm dài', 65000, 4],
            ['tra', 'Trà Chanh Sả Gừng', 'Trà đen, chanh, sả, gừng — không caffeine cao, dễ uống', 45000, 5],
            ['tra', 'Việt Quất Đá Xay', 'Việt quất, sữa chua, không caffeine — dành cho ai cần nghỉ ngơi mắt', 60000, 6],
            // Đồ ăn nhẹ đêm
            ['an', 'Bánh Mì Que Pate', 'Bánh mì que giòn, pate béo, dễ ăn khi tập trung làm việc', 35000, 1],
            ['an', 'Sandwich Gà Nướng', 'Ức gà nướng, rau sống, sốt mù tạt mật ong', 55000, 2],
            ['an', 'Croissant Trứng Muối', 'Croissant bơ, nhân trứng muối tan chảy — món hot buổi tối', 48000, 3],
            ['an', 'Mì Ý Sốt Kem Nấm', 'Phần vừa, ăn nhẹ bụng, phù hợp bữa khuya trước khi về', 62000, 4],
            ['an', 'Snack Khoai Tây Phô Mai', 'Ăn kèm khi làm việc nhóm, chia sẻ được 2–3 người', 45000, 5],
            ['an', 'Tiramisu Espresso', 'Mascarpone, espresso đậm, cacao — vừa tráng miệng vừa tỉnh táo', 58000, 6],
        ];

        // Badge cho 4 món nổi bật trên trang chủ
        $badges = [
            'Double Shot Đêm'      => 'Best seller',
            'Nitro Cold Brew'      => 'Mát lạnh',
            'Bạc Xỉu Năng Lượng'   => 'Dịu nhẹ',
            'Hồng Trà Đào Đêm'     => 'Không caffeine cao',
        ];
        $images = [
            'Double Shot Đêm'    => 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=500&q=80&auto=format&fit=crop',
            'Nitro Cold Brew'    => 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80&auto=format&fit=crop',
            'Bạc Xỉu Năng Lượng' => 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&q=80&auto=format&fit=crop',
            'Hồng Trà Đào Đêm'   => 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80&auto=format&fit=crop',
        ];
        $featuredNames = array_keys($badges);

        foreach ($items as [$catSlug, $name, $desc, $price, $order]) {
            $slug = $this->uniqueSlug($name, 'menu_items');
            $this->execute(
                "INSERT INTO menu_items (category_id, name, slug, description, price, image, badge, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    $catIds[$catSlug] ?? null,
                    $name,
                    $slug,
                    $desc,
                    $price,
                    $images[$name] ?? '',
                    $badges[$name] ?? '',
                    in_array($name, $featuredNames, true) ? 1 : 0,
                    $order,
                ]
            );
        }
    }

    private function seedGalleryItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM gallery_items") > 0) return;

        // 4 khu vực (area cards — khong-gian.html)
        $areas = [
            ['Coding Corner', 'Bàn đơn · Ổ cắm 100% · Đèn bàn riêng', 'Dành cho làm việc một mình đến khuya — mỗi bàn có ổ cắm, đèn ánh sáng ấm không chói mắt, ghế công thái học.', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80&auto=format&fit=crop', 1],
            ['Phòng Học Nhóm', '4–8 người · Đặt trước · Cách âm nhẹ', 'Không gian riêng cho nhóm ôn thi hoặc họp dự án — bảng trắng, ổ cắm quanh bàn, âm lượng được cách ly khỏi khu chung.', 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80&auto=format&fit=crop', 2],
            ['Quầy Bar Espresso', 'Ghế cao · Xem pha chế trực tiếp', 'Ngồi sát quầy, xem barista rang xay và pha espresso trực tiếp — phù hợp khách một mình muốn trò chuyện nhẹ.', 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80&auto=format&fit=crop', 3],
            ['Góc Sofa Thư Giãn', '2–4 người · Ánh sáng ấm · Nhạc lo-fi', 'Dành cho những cuộc trò chuyện chậm rãi cuối ngày, hoặc đơn giản là ngồi đọc sách với một ly trà ấm.', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80&auto=format&fit=crop', 4],
        ];
        foreach ($areas as [$name, $tag, $desc, $img, $order]) {
            $this->execute(
                "INSERT INTO gallery_items (title, description, image, category, sort_order) VALUES (?, ?, ?, 'khu-vuc', ?)",
                [$name, $tag . "\n" . $desc, $img, $order]
            );
        }

        // 9 ảnh masonry (khong-gian.html — thư viện ảnh)
        $photos = [
            ['Không gian quán về đêm', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80&auto=format&fit=crop'],
            ['Barista pha chế espresso', 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80&auto=format&fit=crop'],
            ['Hạt cà phê rang đậm', 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80&auto=format&fit=crop'],
            ['Góc làm việc ánh đèn neon', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80&auto=format&fit=crop'],
            ['Phòng học nhóm ban đêm', 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80&auto=format&fit=crop'],
            ['Quầy bar espresso', 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&q=80&auto=format&fit=crop'],
            ['Góc sofa thư giãn', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80&auto=format&fit=crop'],
            ['Latte art dưới ánh đèn', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80&auto=format&fit=crop'],
            ['Cold brew nitro đêm khuya', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80&auto=format&fit=crop'],
        ];
        foreach ($photos as $i => [$title, $img]) {
            $this->execute(
                "INSERT INTO gallery_items (title, image, category, sort_order) VALUES (?, ?, '', ?)",
                [$title, $img, $i + 1]
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $items = [
            ['Phạm Đức Anh', 'Lập trình viên · TP.HCM', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&auto=format&fit=crop',
                'Làm dev, hay code đến 1–2 giờ sáng. NOX là chỗ duy nhất tôi tìm được có ổ cắm ở mọi bàn và không ai giục về. Espresso đêm cũng đậm hơn hẳn quán khác.', 5, 1],
            ['Nguyễn Thảo Vy', 'Sinh viên năm 3 · Hà Nội', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80&auto=format&fit=crop',
                'Mùa thi năm nào cả nhóm cũng đặt phòng học nhóm ở đây. Yên tĩnh, giá combo sinh viên hợp lý, nhân viên dễ chịu dù mình ngồi tới gần 1 giờ sáng.', 5, 2],
            ['Trần Minh Khuê', 'Illustrator freelance · Đà Nẵng', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80&auto=format&fit=crop',
                'Không gian ánh đèn neon dịu, không quá tối cũng không quá sáng, ngồi vẽ minh họa cả buổi tối vẫn thoải mái. Nitro cold brew là món tôi order mỗi lần ghé.', 5, 3],
        ];
        foreach ($items as [$name, $title, $avatar, $content, $rating, $order]) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                [$name, $title, $avatar, $content, $rating, $order]
            );
        }
    }

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $items = [
            ['NOX mở cửa đến mấy giờ?', 'Từ 18:00 đến 2:00 sáng hôm sau, tất cả các ngày trong tuần. Vào tuần thi cuối kỳ của các trường đại học lân cận, NOX mở cửa 24 giờ — lịch cụ thể được cập nhật trên fanpage mỗi kỳ.'],
            ['Quán có chỗ đậu xe không?', 'Có bãi giữ xe máy miễn phí ngay trước quán, sức chứa khoảng 40 xe. Với ô tô, có bãi đỗ công cộng cách quán khoảng 100m, gửi xe theo giờ.'],
            ['Wifi và ổ cắm điện thế nào?', 'Wifi tốc độ 300Mbps phủ toàn bộ quán, mật khẩu in trên hóa đơn. 100% bàn đều có ổ cắm riêng — khu Coding Corner còn có thêm cổng sạc USB-C tại chỗ.'],
            ['Tôi muốn đặt chỗ cho nhóm 6–8 người, đặt trước thế nào?', 'Liên hệ qua trang Liên hệ hoặc nhắn Zalo trước ít nhất 3 tiếng để giữ Phòng Học Nhóm. Giữ chỗ miễn phí, chỉ cần huỷ trước 1 tiếng nếu đổi kế hoạch.'],
            ['Giá cả ở NOX có đắt hơn quán cà phê ban ngày không?', 'Giá menu tương đương các quán cà phê tầm trung khác, dao động 42.000đ–65.000đ/món. Sau 22:00, khách xuất trình thẻ sinh viên được giảm 10% toàn bộ hoá đơn.'],
            ['Có đồ ăn kèm cho bữa khuya không?', 'Có — mục "Đồ ăn nhẹ đêm" trong thực đơn gồm sandwich, mì Ý, bánh mì que, snack và tráng miệng nhẹ, đủ để lót dạ mà không quá no trước khi tiếp tục làm việc.'],
            ['Ngồi một mình lâu có bị nhắc nhở không?', 'Không. NOX sinh ra để bạn ở lại lâu — miễn gọi tối thiểu 1 món mỗi 3 tiếng là hoàn toàn thoải mái ngồi làm việc xuyên đêm.'],
        ];
        foreach ($items as $i => [$q, $a]) {
            $this->execute(
                "INSERT INTO faqs (question, answer, page, sort_order) VALUES (?, ?, 'gioi-thieu', ?)",
                [$q, $a, $i + 1]
            );
        }
    }

    private function uniqueSlug(string $name, string $table): string {
        $slug = slugify($name);
        $existing = $this->queryOne("SELECT id FROM {$table} WHERE slug = ?", [$slug]);
        if ($existing) $slug .= '-' . uniqid();
        return $slug;
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
