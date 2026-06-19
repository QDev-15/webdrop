<?php
declare(strict_types=1);

class Database {
    private static ?Database $instance = null;
    private PDO $pdo;

    private function __construct() {
        $dir = dirname(DB_FILE);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        $isNew = !file_exists(DB_FILE);
        $this->pdo = new PDO('sqlite:' . DB_FILE);
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->pdo->exec('PRAGMA journal_mode = WAL');
        if ($isNew) {
            $this->migrate();
        }
    }

    public static function getInstance(): self {
        if (self::$instance === null) {
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
                try {
                    $this->pdo->exec($stmt);
                } catch (\PDOException $e) {
                    // ignore IF NOT EXISTS errors
                }
            }
        }
        $this->seedData();
    }

    private function seedData(): void {
        $this->seedUsers();
        $this->seedSettings();
        $this->seedHeroSlides();
        $this->seedMenuCategories();
        $this->seedMenuItems();
        $this->seedTestimonials();
        $this->seedGallery();
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
        $rows = [
            // general
            ['site_name',           'Quán Ăn Phở Bình Dân',                                    'general'],
            ['site_description',    'Quán ăn bình dân, phở ngon, cơm bụi, street food Việt chính gốc. Mở cửa từ 6:00 sáng đến 22:00 tối hàng ngày.', 'general'],
            ['site_logo',           '',                                                          'general'],
            ['site_favicon',        '',                                                          'general'],
            ['site_email',          'contact@quananphobian.vn',                                 'general'],
            ['site_phone',          '0901 234 567',                                             'general'],
            ['site_phone_2',        '',                                                          'general'],
            ['site_address',        '123 Đường Nguyễn Trãi, Phường 2, Quận 5, TP. Hồ Chí Minh', 'general'],
            ['working_hours',       'Thứ Hai – Thứ Sáu: 6:00 – 22:00 | Thứ Bảy: 6:00 – 22:30 | Chủ Nhật: 6:00 – 21:00', 'general'],
            // seo
            ['meta_title',          'Quán Ăn Phở Bình Dân — Ngon, Rẻ, Nhanh',                 'seo'],
            ['meta_description',    'Phở, cơm tấm, bún bò, bánh mì và nhiều món Việt ngon từ 20.000đ. Mở cửa 6:00 – 22:00 hàng ngày.', 'seo'],
            ['meta_keywords',       'phở bình dân, cơm bụi, bún bò huế, bánh mì, quán ăn rẻ',  'seo'],
            ['og_image',            '',                                                           'seo'],
            ['google_analytics_id', '',                                                           'seo'],
            // social
            ['social_facebook',     '',                                                           'social'],
            ['social_youtube',      '',                                                           'social'],
            ['social_instagram',    '',                                                           'social'],
            ['social_tiktok',       '',                                                           'social'],
            ['social_zalo',         '0901234567',                                                 'social'],
            // design
            ['primary_color',       '#d97706',                                                    'design'],
            ['secondary_color',     '#1a1809',                                                    'design'],
            // footer
            ['footer_copyright',    '© 2026 Quán Ăn Phở Bình Dân · Made in Vietnam',           'footer'],
            ['footer_description',  'Ăn ngon, giá bình dân — nấu từ tâm mỗi ngày từ 6 giờ sáng.', 'footer'],
            ['footer_show_social',  '1',                                                          'footer'],
            // contact
            ['contact_form_enabled',    '1',                                                      'contact'],
            ['contact_email_receiver',  'contact@quananphobian.vn',                              'contact'],
            ['google_map_embed',        '',                                                        'contact'],
            ['google_map_link',         'https://maps.google.com/?q=123+Nguyen+Trai+Ho+Chi+Minh', 'contact'],
            ['delivery_radius',         '3km',                                                    'contact'],
            ['delivery_fee',            'từ 10.000đ',                                            'contact'],
            // about (câu chuyện quán)
            ['about_tagline',       'Yêu thích của cả xóm từ năm 2001',                         'about'],
            ['about_title',         'Từ một gánh hàng đến quán quen cả xóm.',                   'about'],
            ['about_content',       "Bà Nguyễn Thị Hoa bắt đầu bán phở từ năm 2001 — ban đầu chỉ là một gánh hàng rong trước cổng trường tiểu học. Sáng sớm 5 giờ đã dậy ninh xương, 6 giờ bắt đầu bán, đến 9 giờ là hết veo.\n\nHơn 20 năm sau, gánh hàng nhỏ đó đã trở thành quán ăn quen thuộc của cả phường. Công thức nước dùng vẫn giữ nguyên — nồi xương heo bò ninh từ 4 giờ sáng, không bột ngọt, không phụ gia. Ăn một lần là nhớ mãi.", 'about'],
            ['about_years',         '20+',                                                        'about'],
            ['about_customers',     '200+',                                                       'about'],
            ['about_rating',        '4.8',                                                        'about'],
            ['about_image',         'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80&auto=format&fit=crop', 'about'],
            // smtp
            ['smtp_host',           'smtp.gmail.com',                                             'smtp'],
            ['smtp_port',           '587',                                                         'smtp'],
            ['smtp_user',           '',                                                            'smtp'],
            ['smtp_password',       '',                                                            'smtp'],
            ['smtp_from_name',      'Quán Ăn Phở Bình Dân',                                      'smtp'],
            ['smtp_from_email',     '',                                                            'smtp'],
            // system
            ['maintenance_mode',    '0',                                                           'system'],
            ['maintenance_message', 'Website đang bảo trì. Vui lòng quay lại sau.',              'system'],
            // cloudinary
            ['cloudinary_cloud_name',    '',                                                       'cloudinary'],
            ['cloudinary_api_key',       '',                                                       'cloudinary'],
            ['cloudinary_api_secret',    '',                                                       'cloudinary'],
            ['cloudinary_upload_folder', 'quan-an-pho-bien',                                      'cloudinary'],
            // integrations
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY',              'integrations'],
        ];
        foreach ($rows as $row) {
            $this->execute(
                "INSERT OR IGNORE INTO settings (key, value, \"group\") VALUES (?, ?, ?)",
                $row
            );
        }
    }

    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        $slides = [
            [
                'title'       => 'Ngon bình dân — No bụng.',
                'subtitle'    => 'Bữa ăn ngon không cần đắt tiền — cần thật thà và làm bằng tấm lòng. Chúng tôi giữ điều đó từ ngày đầu tiên.',
                'button_text' => 'Xem thực đơn',
                'button_link' => '/thuc-don',
                'image'       => 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=1200&q=80&auto=format&fit=crop',
                'sort_order'  => 0,
                'status'      => 'published',
            ],
        ];
        foreach ($slides as $slide) {
            $this->execute(
                "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [$slide['title'], $slide['subtitle'], $slide['button_text'], $slide['button_link'], $slide['image'], $slide['sort_order'], $slide['status']]
            );
        }
    }

    private function seedMenuCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_categories") > 0) return;
        $cats = [
            ['Món Sáng',         'mon-sang',    'Các món ăn sáng từ 6:00 đến 10:00',       '🌅', 0],
            ['Món Trưa & Tối',   'mon-chinh',   'Cơm, bún, mì từ 10:00 đến 22:00',         '🍚', 1],
            ['Đồ Uống',          'do-uong',     'Nước mía, cà phê, trà sữa và nhiều hơn',  '🥤', 2],
            ['Tráng Miệng',      'trang-miem',  'Chè, chuối chiên, khoai chiên',            '🍡', 3],
        ];
        foreach ($cats as $c) {
            $this->execute(
                "INSERT INTO menu_categories (name, slug, description, icon, sort_order, status) VALUES (?, ?, ?, ?, ?, 'published')",
                $c
            );
        }
    }

    private function seedMenuItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_items") > 0) return;
        // Get category IDs
        $catSang   = $this->scalar("SELECT id FROM menu_categories WHERE slug='mon-sang'");
        $catChinh  = $this->scalar("SELECT id FROM menu_categories WHERE slug='mon-chinh'");
        $catUong   = $this->scalar("SELECT id FROM menu_categories WHERE slug='do-uong'");
        $catTrang  = $this->scalar("SELECT id FROM menu_categories WHERE slug='trang-miem'");

        $items = [
            // Món Sáng
            [$catSang, 'Phở Bò Tái Chín', 'pho-bo-tai-chin', 'Thịt bò tái và chín, gân bò, nước dùng xương bò ninh 8 tiếng', 45000, 55000, 'Giá tô thường / tô lớn', 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80', 'HOT', 1, 0],
            [$catSang, 'Phở Gà Ta', 'pho-ga-ta', 'Gà ta luộc xé phay, nước dùng thanh trong, thơm gừng', 40000, 50000, 'Giá tô thường / tô lớn', '', '', 0, 1],
            [$catSang, 'Phở Chay', 'pho-chay', 'Đậu hũ, nấm, rau, nước dùng rau củ thơm ngọt tự nhiên', 35000, 45000, 'Giá tô thường / tô lớn', '', '', 0, 2],
            [$catSang, 'Bánh Mì Thịt Đặc Biệt', 'banh-mi-thit-dac-biet', 'Chả lụa, pa-tê, dưa leo, hành, tương ớt, ớt xanh', 25000, null, '', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80', 'HOT', 1, 3],
            [$catSang, 'Bánh Mì Trứng Ốp La', 'banh-mi-trung-op-la', 'Trứng chiên, pa-tê, xì dầu, hành lá thơm', 20000, null, '', '', '', 0, 4],
            [$catSang, 'Xôi Gà / Xôi Lạp Xưởng', 'xoi-ga-xoi-lap-xuong', 'Xôi dẻo, gà xé hoặc lạp xưởng nướng, hành phi vàng thơm', 25000, 30000, 'Tùy loại', '', '', 0, 5],
            // Món Trưa & Tối
            [$catChinh, 'Cơm Tấm Sườn Bì Chả', 'com-tam-suon-bi-cha', 'Sườn nướng than, bì sợi giòn, chả trứng mỡ hành', 45000, 55000, 'Giá cơm thường / phần lớn', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80', 'HOT', 1, 0],
            [$catChinh, 'Cơm Tấm Gà Nướng', 'com-tam-ga-nuong', 'Gà nướng lá chanh, cơm tấm, đồ chua, nước mắm chua ngọt', 42000, 52000, 'Giá cơm thường / phần lớn', '', '', 0, 1],
            [$catChinh, 'Cơm Bụi 2 Món + Canh', 'com-bui-2-mon-canh', 'Cơm trắng + 2 món mặn (đổi mỗi ngày) + canh — no đủ', 40000, 50000, 'Tùy món', '', '', 0, 2],
            [$catChinh, 'Bún Bò Huế', 'bun-bo-hue', 'Sả mắc khén, chả Huế, thịt bò bắp hầm mềm, tiết cây', 45000, 55000, 'Giá tô thường / tô lớn', 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&q=80', '🌶', 1, 3],
            [$catChinh, 'Bún Riêu Cua Đồng', 'bun-rieu-cua-dong', 'Cua đồng xay, đậu hũ chiên, mọc, cà chua, rau sống', 45000, 55000, 'Giá tô thường / tô lớn', 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80', '🦀', 0, 4],
            [$catChinh, 'Bún Thịt Nướng + Chả Giò', 'bun-thit-nuong-cha-gio', 'Thịt heo nướng, chả giò giòn, bún bạch, rau sống, tương đậu', 45000, 52000, 'Giá tô thường / tô lớn', '', '', 0, 5],
            [$catChinh, 'Mì Quảng Gà / Tôm', 'mi-quang-ga-tom', 'Mì Quảng truyền thống, nước nhưn sệt thơm ngon, đậu phộng rang', 45000, 55000, 'Giá tô thường / tô lớn', '', '', 0, 6],
            [$catChinh, 'Lẩu Thái Hải Sản (2 người)', 'lau-thai-hai-san', 'Tôm tươi, mực, nấm, rau, chua cay kiểu Thái, bún tươi kèm', 180000, null, 'Cho 2 người', '', '', 0, 7],
            [$catChinh, 'Lẩu Gà Lá Giang', 'lau-ga-la-giang', 'Gà ta chặt miếng, lá giang chua thanh, rau rừng, bún/mì', 160000, null, 'Cho 2 người', '', '', 0, 8],
            // Đồ Uống
            [$catUong, 'Nước Mía Tươi', 'nuoc-mia-tuoi', 'Mía cây ép tại chỗ, không pha nước, có thêm tắc / gừng', 15000, null, '', '', '', 0, 0],
            [$catUong, 'Trà Sữa Trân Châu', 'tra-sua-tran-chau', 'Trà đen / trà xanh, sữa tươi, trân châu đen mềm dẻo', 25000, null, '', '', '', 0, 1],
            [$catUong, 'Cà Phê Đá / Nóng', 'ca-phe-da-nong', 'Cà phê phin truyền thống, pha với sữa đặc', 15000, 20000, 'Đá / Nóng', '', '', 0, 2],
            [$catUong, 'Nước Chanh / Cam Tươi', 'nuoc-chanh-cam-tuoi', 'Cam / chanh vắt tại chỗ, đường thốt nốt, ít đá', 18000, null, '', '', '', 0, 3],
            [$catUong, 'Trà Đá', 'tra-da', 'Trà đá miễn phí khi ăn tại quán', 0, null, 'Free', '', '', 0, 4],
            // Tráng Miệng
            [$catTrang, 'Chè Đậu Đen / Đậu Xanh', 'che-dau-den-dau-xanh', 'Nước cốt dừa béo ngậy, đá bào mịn, ngọt vừa', 15000, null, '', '', '', 0, 0],
            [$catTrang, 'Chè Ba Màu', 'che-ba-mau', 'Đậu đỏ, thạch pandan, đậu xanh, nước cốt dừa, đá bào', 18000, null, '', '', '', 0, 1],
            [$catTrang, 'Chuối Chiên / Khoai Chiên', 'chuoi-chien-khoai-chien', 'Giòn nóng, rắc muối vừng, ăn kèm nước cốt dừa', 10000, null, '', '', '', 0, 2],
        ];
        foreach ($items as $it) {
            $this->execute(
                "INSERT INTO menu_items (category_id, name, slug, description, price, price_sale, price_note, image, badge, featured, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')",
                $it
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $items = [
            [
                'author_name'   => 'Nguyễn Văn Hùng',
                'author_title'  => 'Đánh giá Google · 2 tháng trước',
                'author_avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop&crop=face',
                'content'       => 'Phở tái chín ngon không chê vào đâu được. Nước dùng đậm vị, thịt tươi mềm, giá lại rẻ. Sáng nào tôi cũng ghé trước khi đi làm.',
                'rating'        => 5,
                'source'        => 'Google Maps',
                'sort_order'    => 0,
            ],
            [
                'author_name'   => 'Trần Thị Lan',
                'author_title'  => 'Đánh giá Google · 1 tháng trước',
                'author_avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop&crop=face',
                'content'       => 'Cơm bụi trưa ở đây cực ngon, nhiều món lại rẻ. Bà chủ thân thiện, phục vụ nhanh. Giờ cao điểm 12h trưa nhưng vẫn ra nhanh lắm.',
                'rating'        => 5,
                'source'        => 'Google Maps',
                'sort_order'    => 1,
            ],
            [
                'author_name'   => 'Lê Minh Tuấn',
                'author_title'  => 'Đánh giá Google · 3 tuần trước',
                'author_avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face',
                'content'       => 'Quán nhỏ nhưng sạch sẽ, thoáng mát. Bún bò Huế đúng chuẩn, cay vừa phải. Đặt ship về nhà nhanh, đóng gói cẩn thận.',
                'rating'        => 5,
                'source'        => 'Google Maps',
                'sort_order'    => 2,
            ],
        ];
        foreach ($items as $it) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, source, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'published')",
                [$it['author_name'], $it['author_title'], $it['author_avatar'], $it['content'], $it['rating'], $it['source'], $it['sort_order']]
            );
        }
    }

    private function seedGallery(): void {
        if ($this->scalar("SELECT COUNT(*) FROM gallery_items") > 0) return;
        $items = [
            ['Quán ăn bình dân',    'Không gian quán ăn sạch sẽ, thoáng mát',    'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80', 'Không gian', 0],
            ['Món ăn ngon',         'Các món ăn được nấu tươi mỗi ngày',          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', 'Món ăn', 1],
            ['Bún bò Huế',          'Bún bò Huế chuẩn vị miền Trung',            'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=600&q=80', 'Món ăn', 2],
            ['Bánh mì thịt',        'Bánh mì thịt đặc biệt nổi tiếng',           'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80', 'Món ăn', 3],
            ['Bún riêu cua',        'Bún riêu cua đồng tươi ngon',               'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80', 'Món ăn', 4],
            ['Không gian quán',     'Bãi đậu xe rộng rãi, miễn phí cho khách',   'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80', 'Không gian', 5],
        ];
        foreach ($items as $it) {
            $this->execute(
                "INSERT INTO gallery_items (title, description, image, category, sort_order, status) VALUES (?, ?, ?, ?, ?, 'published')",
                $it
            );
        }
    }

    // ── Query helpers ─────────────────────────────────────────────────────────

    public function query(string $sql, array $params = []): array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function execute(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (int) $this->pdo->lastInsertId();
    }

    public function scalar(string $sql, array $params = []): mixed {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $val = $stmt->fetchColumn();
        return $val;
    }
}
