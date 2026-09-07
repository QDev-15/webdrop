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
        $this->seedMenuCategories();
        $this->seedMenuItems();
        $this->seedGalleryItems();
        $this->seedTestimonials();
        $this->seedFaqs();
        $this->seedExtensions();
    }

    protected function seedExtensions(): void {
        // Override trong type-specific Database classes (shop, cafe, etc.)
        // hoặc để trống cho generic sites
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
            // General
            ['site_name', 'Lặng Trang', 'general'],
            ['site_tagline', 'Cà Phê Sách Yên Tĩnh', 'general'],
            ['site_description', 'Lặng Trang — quán cà phê sách yên tĩnh, không gian đọc sách và làm việc tập trung giữa lòng thành phố. Mượn sách miễn phí, đồ uống nhẹ nhàng, wifi và ổ điện đầy đủ.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hello@langtrang.cafe', 'general'],
            ['site_phone', '0912 345 678', 'general'],
            ['site_address', 'Số nhà, Ngõ nhỏ, Quận Hoàn Kiếm, Hà Nội', 'general'],
            ['working_hours', '7:30 – 21:30 hàng ngày', 'general'],
            ['zalo_phone', '0912345678', 'general'],
            // SEO
            ['meta_title', 'Lặng Trang — Cà Phê Sách Yên Tĩnh', 'seo'],
            ['meta_description', 'Lặng Trang — quán cà phê sách yên tĩnh, không gian đọc sách và làm việc tập trung giữa lòng thành phố. Mượn sách miễn phí, đồ uống nhẹ nhàng, wifi và ổ điện đầy đủ.', 'seo'],
            ['meta_keywords', 'cà phê sách, quán cà phê yên tĩnh, không gian đọc sách, cafe làm việc Hà Nội, thư viện mini', 'seo'],
            // Social
            ['facebook', '', 'social'],
            ['instagram', '', 'social'],
            ['youtube', '', 'social'],
            ['tiktok', '', 'social'],
            ['zalo', 'https://zalo.me/0912345678', 'social'],
            // Footer
            ['footer_description', 'Không gian cà phê sách yên tĩnh — nơi bạn có thể đọc, làm việc và chậm lại giữa một ngày bận rộn. Mượn sách miễn phí, đồ uống nhẹ nhàng, luôn giữ sự tĩnh lặng cần thiết.', 'footer'],
            ['footer_copyright', '© 2026 Lặng Trang. Tất cả các quyền được bảo lưu.', 'footer'],
            // Contact
            ['contact_address', 'Số nhà, Ngõ nhỏ, Quận Hoàn Kiếm, Hà Nội', 'contact'],
            ['contact_map_embed', 'https://maps.google.com/maps?q=21.0285,105.8542&hl=vi&z=15&output=embed', 'contact'],
            // About (nội dung trang Giới thiệu)
            ['about_story_eyebrow', 'Câu chuyện của chúng tôi', 'about'],
            ['about_story_title', 'Bắt đầu từ một kệ sách nhỏ', 'about'],
            ['about_story_text_1', 'Lặng Trang ra đời năm 2019, từ một kệ sách nhỏ đặt trong góc một quán cà phê thuê lại. Người sáng lập vốn là một biên tập viên, luôn tìm một nơi đủ yên tĩnh để đọc bản thảo mà không phải ngồi ở nhà một mình.', 'about'],
            ['about_story_text_2', 'Từ vài chục cuốn sách cũ ban đầu, kệ sách lớn dần thành thư viện mini hơn 1.500 đầu sách hôm nay — được chọn lọc thủ công, không chạy theo số lượng.', 'about'],
            ['about_story_image', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80&auto=format&fit=crop', 'about'],
            ['about_philosophy_eyebrow', 'Triết lý không gian', 'about'],
            ['about_philosophy_title', 'Tri thức cần sự tĩnh lặng', 'about'],
            ['about_philosophy_text_1', 'Chúng tôi tin rằng đọc sách và làm việc tập trung đều cần một điều kiện cơ bản: sự yên tĩnh. Vì vậy Lặng Trang không mở nhạc lớn, không tổ chức sự kiện ồn ào vào giờ cao điểm đọc sách.', 'about'],
            ['about_philosophy_text_2', 'Mỗi chi tiết trong không gian — từ ánh sáng, chất liệu ghế đến khoảng cách giữa các bàn — đều được cân nhắc để giảm thiểu sự xao động, giúp bạn ở lại lâu hơn với những gì mình đang đọc hoặc viết.', 'about'],
            ['about_philosophy_image', 'https://images.unsplash.com/photo-1524578271613-d550eede1f5a?w=800&q=80&auto=format&fit=crop', 'about'],
            ['quote_content', 'Tri thức cần một không gian đủ tĩnh để lắng nghe chính nó — Lặng Trang được dựng lên để giữ cho sự tĩnh lặng ấy không bị đánh mất giữa phố xá.', 'about'],
            ['quote_author', 'Người sáng lập Lặng Trang', 'about'],
            ['quote_role', '2019 — nay', 'about'],
            ['stat_founded_year', '2019', 'about'],
            ['stat_books_count', '1500', 'about'],
            ['stat_years_active', '6', 'about'],
            ['stat_hours_per_day', '12', 'about'],
            ['stat_seats_count', '40', 'about'],
            ['stat_club_sessions_per_year', '12', 'about'],
            // System / SMTP / Cloudinary / Integrations
            ['maintenance_mode', '0', 'system'],
            ['analytics_id', '', 'system'],
            ['smtp_host', 'smtp.gmail.com', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from_name', 'Lặng Trang', 'smtp'],
            ['smtp_from_email', '', 'smtp'],
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key', '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            ['cloudinary_upload_preset', '', 'cloudinary'],
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
                'title' => 'Nơi trang sách gặp tách cà phê',
                'subtitle' => 'Một góc nhỏ giữa thành phố ồn ào — nơi bạn có thể ngồi lại, đọc hết một chương sách và uống cạn một tách trà mà không ai giục giã.',
                'button_text' => 'Xem thực đơn',
                'button_link' => '/menu',
                'image' => 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&q=80&auto=format&fit=crop',
                'sort_order' => 1,
            ],
            [
                'title' => 'Một góc nhỏ để chậm lại',
                'subtitle' => 'Kệ sách cao chạm trần, ánh sáng tự nhiên từ cửa sổ lớn, và những chiếc ghế đơn dành riêng cho một người muốn ở một mình cùng trang sách.',
                'button_text' => 'Xem thư viện',
                'button_link' => '/khong-gian',
                'image' => 'https://images.unsplash.com/photo-1524578271613-d550eede1f5a?w=1400&q=80&auto=format&fit=crop',
                'sort_order' => 2,
            ],
            [
                'title' => 'Vị nhẹ nhàng cho tâm trí tĩnh',
                'subtitle' => 'Từ trà hoa cúc đến cà phê nhạt vị, ca cao ấm không caffeine cho buổi tối — mỗi thức uống đều được chọn để đồng hành cùng một buổi đọc dài mà không làm bạn mất ngủ.',
                'button_text' => 'Xem đồ uống',
                'button_link' => '/menu',
                'image' => 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1400&q=80&auto=format&fit=crop',
                'sort_order' => 3,
            ],
            [
                'title' => 'Cộng đồng của những người yêu sách',
                'subtitle' => 'Buổi trao đổi sách cuối tuần, góc viết tay dành cho nhật ký, và những người bạn mới quen qua một cuốn sách để trên bàn chung.',
                'button_text' => 'Câu chuyện của chúng tôi',
                'button_link' => '/gioi-thieu',
                'image' => 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1400&q=80&auto=format&fit=crop',
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

    private function seedMenuCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_categories") > 0) return;
        $cats = [
            ['name' => 'Trà', 'description' => 'Trà thảo mộc và trà truyền thống, thanh nhẹ cho một buổi đọc dài.', 'sort_order' => 1],
            ['name' => 'Cà Phê Nhẹ', 'description' => 'Cà phê pha loãng, êm dịu, vẫn tỉnh táo mà không mất tập trung.', 'sort_order' => 2],
            ['name' => 'Buổi Tối Không Caffein', 'description' => 'Đồ uống ấm, không caffeine, dành cho phiên đọc muộn.', 'sort_order' => 3],
            ['name' => 'Bánh & Snack', 'description' => 'Bánh nhẹ đi kèm, không dính tay khi lật sách.', 'sort_order' => 4],
        ];
        $ids = [];
        foreach ($cats as $c) {
            $slug = slugify($c['name']);
            $id = $this->execute(
                "INSERT INTO menu_categories (name, slug, description, sort_order) VALUES (?, ?, ?, ?)",
                [$c['name'], $slug, $c['description'], $c['sort_order']]
            );
            $ids[$c['name']] = $id;
        }
        $this->menuCategoryIds = $ids;
    }

    /** @var array<string,int> */
    private array $menuCategoryIds = [];

    private function seedMenuItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_items") > 0) return;
        if (empty($this->menuCategoryIds)) {
            $rows = $this->query("SELECT id, name FROM menu_categories");
            foreach ($rows as $r) { $this->menuCategoryIds[$r['name']] = $r['id']; }
        }
        $cat = $this->menuCategoryIds;

        $items = [
            // Trà
            ['category' => 'Trà', 'name' => 'Trà Ô Long Truyền Thống', 'description' => 'Ô long Bảo Lộc ủ nóng, vị chát dịu hậu ngọt, uống được nhiều lượt nước.', 'price' => 45000, 'badge' => '', 'featured' => 0],
            ['category' => 'Trà', 'name' => 'Trà Hoa Cúc Mật Ong', 'description' => 'Cúc trắng Đà Lạt, mật ong rừng, thanh mát dịu nhẹ — hợp cho buổi chiều đọc dài.', 'price' => 42000, 'badge' => 'Không caffein', 'featured' => 1],
            ['category' => 'Trà', 'name' => 'Trà Bạc Hà Chanh', 'description' => 'Lá bạc hà tươi, chanh vàng, đá viên — tỉnh táo nhẹ nhàng, không gắt.', 'price' => 45000, 'badge' => '', 'featured' => 0],
            ['category' => 'Trà', 'name' => 'Trà Atiso Đỏ', 'description' => 'Hoa atiso đỏ, vị chua thanh nhẹ, giàu vitamin C.', 'price' => 42000, 'badge' => 'Không caffein', 'featured' => 0],
            ['category' => 'Trà', 'name' => 'Trà Sen Trắng', 'description' => 'Trà xanh ướp sen, hương thơm dịu, phù hợp buổi chiều đọc sách.', 'price' => 48000, 'badge' => '', 'featured' => 0],
            ['category' => 'Trà', 'name' => 'Trà Gừng Mật Ong Ấm', 'description' => 'Gừng tươi, mật ong, ấm bụng những ngày mưa.', 'price' => 42000, 'badge' => 'Không caffein', 'featured' => 0],
            // Cà Phê Nhẹ
            ['category' => 'Cà Phê Nhẹ', 'name' => 'Cà Phê Sữa Nhạt', 'description' => 'Robusta pha loãng, sữa đặc ít, êm dịu không gắt — vẫn tỉnh táo mà không mất tập trung.', 'price' => 42000, 'badge' => '', 'featured' => 1],
            ['category' => 'Cà Phê Nhẹ', 'name' => 'Latte Yến Mạch', 'description' => 'Espresso single shot, sữa yến mạch, foam mịn, vị béo nhẹ.', 'price' => 55000, 'badge' => '', 'featured' => 0],
            ['category' => 'Cà Phê Nhẹ', 'name' => 'Cà Phê Muối Nhẹ', 'description' => 'Espresso, lớp kem muối mỏng, vị mặn ngọt cân bằng.', 'price' => 48000, 'badge' => '', 'featured' => 0],
            ['category' => 'Cà Phê Nhẹ', 'name' => 'Americano Nhạt', 'description' => 'Espresso pha loãng gấp đôi nước, thanh nhẹ, uống được cả ngày.', 'price' => 40000, 'badge' => '', 'featured' => 0],
            ['category' => 'Cà Phê Nhẹ', 'name' => 'Cappuccino Decaf', 'description' => 'Cà phê khử phần lớn caffeine, phù hợp uống vào buổi chiều muộn.', 'price' => 52000, 'badge' => 'Ít caffein', 'featured' => 0],
            ['category' => 'Cà Phê Nhẹ', 'name' => 'Cold Brew Loãng', 'description' => 'Ủ lạnh 12 giờ, pha loãng hơn thường lệ, ít đắng, uống mát dễ chịu.', 'price' => 50000, 'badge' => '', 'featured' => 0],
            // Buổi Tối Không Caffein
            ['category' => 'Buổi Tối Không Caffein', 'name' => 'Sữa Hạt Óc Chó', 'description' => 'Óc chó rang, không đường, béo nhẹ tự nhiên.', 'price' => 48000, 'badge' => 'Không caffein', 'featured' => 0],
            ['category' => 'Buổi Tối Không Caffein', 'name' => 'Cacao Nóng Nguyên Chất', 'description' => 'Bột cacao 70%, sữa tươi, vị đậm nhưng dịu, không caffeine.', 'price' => 50000, 'badge' => 'Không caffein', 'featured' => 0],
            ['category' => 'Buổi Tối Không Caffein', 'name' => 'Trà Thảo Mộc Ngủ Ngon', 'description' => 'Hoa oải hương, cúc la mã, hỗ trợ thư giãn trước giờ ngủ.', 'price' => 42000, 'badge' => 'Không caffein', 'featured' => 0],
            ['category' => 'Buổi Tối Không Caffein', 'name' => 'Sữa Nghệ Ấm (Golden Milk)', 'description' => 'Nghệ tươi, mật ong, chút tiêu đen, ấm dịu.', 'price' => 48000, 'badge' => 'Buổi tối', 'featured' => 1],
            ['category' => 'Buổi Tối Không Caffein', 'name' => 'Chocolate Trắng Ấm', 'description' => 'Chocolate trắng Bỉ, sữa tươi, ngọt nhẹ êm dịu.', 'price' => 52000, 'badge' => 'Không caffein', 'featured' => 0],
            ['category' => 'Buổi Tối Không Caffein', 'name' => 'Trà Táo Quế', 'description' => 'Táo sấy, quế, thơm ấm áp, phù hợp buổi tối se lạnh.', 'price' => 45000, 'badge' => 'Không caffein', 'featured' => 0],
            // Bánh & Snack
            ['category' => 'Bánh & Snack', 'name' => 'Bánh Quy Bơ Yến Mạch', 'description' => 'Yến mạch, bơ lạt, giòn nhẹ không quá ngọt — món ăn kèm không làm dính tay khi lật sách.', 'price' => 35000, 'badge' => '', 'featured' => 1],
            ['category' => 'Bánh & Snack', 'name' => 'Financier Hạnh Nhân', 'description' => 'Bánh Pháp bơ hạnh nhân, ẩm mềm bên trong, thơm bơ.', 'price' => 38000, 'badge' => '', 'featured' => 0],
            ['category' => 'Bánh & Snack', 'name' => 'Bánh Mì Nướng Phô Mai', 'description' => 'Phô mai Mozzarella, bơ tỏi, nướng giòn — món mặn nhẹ đi kèm.', 'price' => 45000, 'badge' => '', 'featured' => 0],
            ['category' => 'Bánh & Snack', 'name' => 'Cookie Chocolate Chip', 'description' => 'Bột mì nguyên cám, chocolate 55%, giòn rìa mềm giữa.', 'price' => 35000, 'badge' => '', 'featured' => 0],
            ['category' => 'Bánh & Snack', 'name' => 'Bánh Chuối Yến Mạch', 'description' => 'Chuối chín, yến mạch, không dùng đường tinh luyện.', 'price' => 40000, 'badge' => '', 'featured' => 0],
            ['category' => 'Bánh & Snack', 'name' => 'Panna Cotta Trà Xanh', 'description' => 'Kem sữa tươi, matcha Nhật, vị béo thanh mát.', 'price' => 48000, 'badge' => '', 'featured' => 0],
        ];

        $imageMap = [
            'Trà' => 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80&auto=format&fit=crop',
            'Cà Phê Nhẹ' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80&auto=format&fit=crop',
            'Buổi Tối Không Caffein' => 'https://images.unsplash.com/photo-1517959105821-eaf2591984ca?w=600&q=80&auto=format&fit=crop',
            'Bánh & Snack' => 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&q=80&auto=format&fit=crop',
        ];

        $sort = 0;
        foreach ($items as $it) {
            $sort++;
            $slug = slugify($it['name']);
            $existing = $this->queryOne("SELECT id FROM menu_items WHERE slug = ?", [$slug]);
            if ($existing) { $slug .= '-' . $sort; }
            $this->execute(
                "INSERT INTO menu_items (category_id, name, slug, description, price, image, badge, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    $cat[$it['category']] ?? null,
                    $it['name'],
                    $slug,
                    $it['description'],
                    $it['price'],
                    $imageMap[$it['category']],
                    $it['badge'],
                    $it['featured'],
                    $sort,
                ]
            );
        }
    }

    private function seedGalleryItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM gallery_items") > 0) return;

        // Các khu vực đọc — hiển thị đầy đủ tại /khong-gian, 3 mục đầu dùng làm "Góc đọc nổi bật" ở trang chủ
        $corners = [
            ['title' => 'Thư Viện Mini', 'description' => 'Hơn 1.500 đầu sách văn học, tản văn và sách nghệ thuật, mượn đọc tại chỗ hoàn toàn miễn phí.', 'image' => 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80&auto=format&fit=crop'],
            ['title' => 'Góc Cửa Sổ', 'description' => 'Bàn đơn cho một người, ánh sáng tự nhiên suốt cả ngày — chỗ ngồi được yêu thích nhất vào buổi sáng.', 'image' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80&auto=format&fit=crop'],
            ['title' => 'Góc Đọc Riêng Tư', 'description' => 'Ghế bành bọc vải, đèn đọc sách riêng, tách biệt khỏi lối đi chính — dành cho ai muốn ở một mình.', 'image' => 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80&auto=format&fit=crop'],
            ['title' => 'Bàn Dài Chung', 'description' => 'Không gian làm việc yên tĩnh, ổ cắm điện tại mỗi ghế, phù hợp học nhóm nhỏ hoặc làm việc cá nhân.', 'image' => 'https://images.unsplash.com/photo-1524578271613-d550eede1f5a?w=700&q=80&auto=format&fit=crop'],
            ['title' => 'Sân Trong Nhỏ', 'description' => 'Cây xanh, tiếng nước chảy nhẹ, có mái che — không gian ngoài trời cho những ngày muốn hít thở khí trời.', 'image' => 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&q=80&auto=format&fit=crop'],
            ['title' => 'Kệ Sách Cao', 'description' => 'Sưu tập văn học kinh điển và sách nghệ thuật, sắp xếp theo chủ đề để dễ tìm.', 'image' => 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=700&q=80&auto=format&fit=crop'],
        ];
        $sort = 0;
        foreach ($corners as $c) {
            $sort++;
            $this->execute(
                "INSERT INTO gallery_items (title, description, image, category, sort_order) VALUES (?, ?, ?, ?, ?)",
                [$c['title'], $c['description'], $c['image'], 'khong-gian', $sort]
            );
        }

        // Khoảnh khắc — gallery masonry tại /khong-gian
        $moments = [
            ['caption' => 'Góc bàn quen thuộc buổi sáng', 'image' => 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=700&q=80&auto=format&fit=crop'],
            ['caption' => 'Ánh sáng tự nhiên xuyên suốt ngày', 'image' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80&auto=format&fit=crop'],
            ['caption' => 'Kệ sách chạm trần — hơn 1.500 đầu sách', 'image' => 'https://images.unsplash.com/photo-1524578271613-d550eede1f5a?w=700&q=80&auto=format&fit=crop'],
            ['caption' => 'Một tách trà, một trang sách', 'image' => 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=700&q=80&auto=format&fit=crop'],
            ['caption' => 'Góc đọc riêng tư yên tĩnh', 'image' => 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80&auto=format&fit=crop'],
            ['caption' => 'Sân trong — không gian ngoài trời', 'image' => 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&q=80&auto=format&fit=crop'],
            ['caption' => 'Buổi trao đổi sách cuối tuần', 'image' => 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=700&q=80&auto=format&fit=crop'],
            ['caption' => 'Kệ văn học kinh điển', 'image' => 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=700&q=80&auto=format&fit=crop'],
            ['caption' => 'Bàn dài chung — mỗi ghế một ổ điện', 'image' => 'https://images.unsplash.com/photo-1521123845560-14093637aa7d?w=700&q=80&auto=format&fit=crop'],
        ];
        $sort = 0;
        foreach ($moments as $m) {
            $sort++;
            $this->execute(
                "INSERT INTO gallery_items (title, description, image, category, sort_order) VALUES (?, ?, ?, ?, ?)",
                ['', $m['caption'], $m['image'], 'khoanh-khac', $sort]
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $items = [
            [
                'author_name' => 'Đặng Thảo Vy',
                'author_title' => 'Biên tập viên tự do',
                'content' => 'Tôi hay mang laptop đến làm việc buổi sáng — bàn dài có ổ điện, wifi ổn định, và quan trọng nhất là không ai nói chuyện to. Cà phê sữa nhạt ở đây cũng vừa miệng, không quá gắt như chỗ khác.',
                'rating' => 5,
            ],
            [
                'author_name' => 'Nguyễn Hải Đăng',
                'author_title' => 'Sinh viên năm cuối',
                'content' => 'Thư viện mini là điểm cộng lớn nhất. Tôi đọc hết một cuốn tiểu thuyết trong 3 buổi chiều cuối tuần liên tiếp mà không cần mang sách theo. Góc đọc riêng tư có ghế bành rất êm.',
                'rating' => 5,
            ],
        ];
        $sort = 0;
        foreach ($items as $t) {
            $sort++;
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, content, rating, sort_order) VALUES (?, ?, ?, ?, ?)",
                [$t['author_name'], $t['author_title'], $t['content'], $t['rating'], $sort]
            );
        }
    }

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $items = [
            ['q' => 'Mượn sách ở đây có mất phí không?', 'a' => 'Hoàn toàn miễn phí khi đọc tại chỗ. Bạn chỉ cần đăng ký mượn tại quầy nếu muốn mang sách ra ngoài khu vực quán trong ngày, và trả đúng vị trí trên kệ sau khi đọc xong để người khác dễ tìm.'],
            ['q' => 'Quán mở cửa giờ nào?', 'a' => 'Lặng Trang mở cửa 7:30 – 21:30 hàng ngày, kể cả cuối tuần và ngày lễ. Khu vực thư viện mini đóng cửa sớm hơn 30 phút để sắp xếp lại sách.'],
            ['q' => 'Tôi có thể đặt chỗ ngồi yên tĩnh riêng không?', 'a' => 'Có. Góc đọc riêng tư và một số bàn cạnh cửa sổ có thể đặt trước qua trang Liên hệ hoặc Zalo, đặc biệt nên đặt trước vào cuối tuần vì số lượng chỗ có hạn.'],
            ['q' => 'Mang laptop đến làm việc có được không? Có ổ cắm điện không?', 'a' => 'Rất hoan nghênh. Khu vực bàn dài chung có ổ cắm điện tại mỗi ghế và wifi tốc độ cao miễn phí, phù hợp cho làm việc hoặc học tập tập trung nhiều giờ.'],
            ['q' => 'Giá đồ uống trung bình bao nhiêu?', 'a' => 'Trung bình 35.000 – 55.000đ cho một thức uống, và 35.000 – 48.000đ cho bánh nhẹ đi kèm. Xem chi tiết tại trang Thực đơn.'],
            ['q' => 'Quán có quy định gì về giữ trật tự không?', 'a' => 'Có — Lặng Trang là không gian ưu tiên sự yên tĩnh: giữ âm lượng nói chuyện ở mức thì thầm, điện thoại để chế độ rung, hạn chế gọi điện trong khu vực đọc chính. Toàn bộ quy định được liệt kê tại trang Giới thiệu.'],
            ['q' => 'Tôi có thể mang sách riêng của mình đến đọc không?', 'a' => 'Được. Bạn có thể mang sách riêng, tuy nhiên vẫn cần gọi tối thiểu một thức uống để giữ chỗ ngồi, đúng như tinh thần một quán cà phê sách.'],
        ];
        $sort = 0;
        foreach ($items as $f) {
            $sort++;
            $this->execute(
                "INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)",
                [$f['q'], $f['a'], $sort]
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
