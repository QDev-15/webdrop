<?php
declare(strict_types=1);

class Database {
    private static ?Database $instance = null;
    private PDO $pdo;
    private string $dbPath;

    private function __construct() {
        $dbDir = __DIR__ . '/../database';
        if (!is_dir($dbDir)) { mkdir($dbDir, 0755, true); }
        $this->dbPath = $dbDir . '/quan-bbq-lua.db';
        $this->pdo = new PDO('sqlite:' . $this->dbPath);
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->pdo->exec('PRAGMA journal_mode = WAL');
        $this->migrate();
    }

    public static function getInstance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function migrate(): void {
        $schemaFile = __DIR__ . '/../schema.sql';
        $sql = file_get_contents($schemaFile);
        if ($sql === false) {
            throw new RuntimeException('Khong doc duoc schema.sql — kiem tra file ton tai va quyen doc.');
        }
        // Execute each statement
        $statements = array_filter(array_map('trim', explode(';', $sql)));
        foreach ($statements as $stmt) {
            if ($stmt !== '') {
                $this->pdo->exec($stmt);
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
        $this->seedGallery();
        $this->seedTestimonials();
    }

    private function seedUsers(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
        if ($count > 0) return;
        $hash = password_hash('123456', PASSWORD_BCRYPT);
        $this->pdo->prepare(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
        )->execute(['Quản trị viên', 'sysadmin@admin.com', $hash, 'superadmin']);
    }

    private function seedSettings(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM settings")->fetchColumn();
        if ($count > 0) return;

        $settings = [
            // general
            ['site_name',       'BBQ Lửa Hồng',                           'general'],
            ['site_tagline',    'Thịt nướng than hoa tươi ngon, không gian sôi động', 'general'],
            ['site_email',      'info@bbqluahong.vn',                      'general'],
            ['site_phone',      '0901 234 567',                            'general'],
            ['site_address',    '123 Đường BBQ, Phường 5, Quận 3, TP.HCM', 'general'],
            ['working_hours',   'T2–T6: 17:00–23:00 | T7: 11:00–23:00 | CN: 11:00–22:00', 'general'],
            ['zalo_number',     '0901234567',                              'general'],
            // seo
            ['meta_title',      'BBQ Lửa Hồng — Thịt Nướng Than Hoa Đích Thực',  'seo'],
            ['meta_description','Thịt tươi chọn lọc mỗi sáng, than hoa âm ỉ, gia vị ướp bí truyền — mỗi bữa BBQ là một buổi tụ họp đáng nhớ.', 'seo'],
            ['meta_keywords',   'bbq, thịt nướng, than hoa, hải sản nướng, combo bbq, đặt bàn bbq', 'seo'],
            // social
            ['facebook',        'https://facebook.com/bbqluahong',         'social'],
            ['instagram',       'https://instagram.com/bbqluahong',        'social'],
            ['tiktok',          'https://tiktok.com/@bbqluahong',          'social'],
            ['zalo',            'https://zalo.me/0901234567',              'social'],
            // footer
            ['footer_desc',     'Thịt nướng than hoa tươi ngon, không gian sôi động, ẩm thực BBQ đích thực.', 'footer'],
            ['footer_copy',     '© 2026 BBQ Lửa Hồng · Made in Vietnam 🇻🇳', 'footer'],
            // contact
            ['map_embed',       '',                                        'contact'],
            ['contact_note',    'Cuối tuần và ngày lễ đặt trước ít nhất 1 ngày để đảm bảo có bàn.',  'contact'],
            // smtp
            ['smtp_host',       '',                                        'smtp'],
            ['smtp_port',       '587',                                     'smtp'],
            ['smtp_user',       '',                                        'smtp'],
            ['smtp_pass',       '',                                        'smtp'],
            ['smtp_from',       'info@bbqluahong.vn',                     'smtp'],
            // system
            ['maintenance_mode','0',                                       'system'],
            ['allow_register',  '0',                                       'system'],
            // bbq-specific
            ['stat_meats',      '60',                                      'bbq'],
            ['stat_seats',      '200',                                     'bbq'],
            ['stat_years',      '8',                                       'bbq'],
            ['stat_rating',     '4.9',                                     'bbq'],
            ['hero_badge',      'Than hoa thật — Hương vị thật',           'bbq'],
            ['hero_title',      'Nướng cùng lửa hồng, no cùng bạn bè.',  'bbq'],
            ['hero_sub',        'Thịt tươi chọn lọc mỗi sáng, than hoa âm ỉ, gia vị ướp bí truyền — mỗi bữa BBQ là một buổi tụ họp đáng nhớ.', 'bbq'],
            ['about_title',     '8 năm than hoa — chưa một lần thỏa hiệp chất lượng', 'bbq'],
            ['about_desc',      'Mở cửa từ 2016, BBQ Lửa Hồng trở thành địa điểm quen thuộc của hàng nghìn gia đình và nhóm bạn Sài Gòn. Mỗi ngày chúng tôi nhập thịt mới, ướp theo công thức bí truyền, nướng trên than hoa thật sự.', 'bbq'],
            ['cta_title',       'Sẵn sàng cho bữa BBQ hoàn hảo?',         'bbq'],
            ['cta_sub',         'Đặt bàn ngay hôm nay — đặc biệt cuối tuần và ngày lễ nên đặt sớm để có bàn đẹp nhất.', 'bbq'],
            // cloudinary
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_upload_preset', '', 'cloudinary'],
            ['cloudinary_api_key', '', 'cloudinary'],
            // integrations
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];

        $stmt = $this->pdo->prepare("INSERT OR IGNORE INTO settings (key, value, grp) VALUES (?, ?, ?)");
        foreach ($settings as [$key, $value, $grp]) {
            $stmt->execute([$key, $value, $grp]);
        }
    }

    private function seedHeroSlides(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM hero_slides")->fetchColumn();
        if ($count > 0) return;

        $slides = [
            [
                'Nướng cùng lửa hồng, no cùng bạn bè.',
                'Thịt tươi chọn lọc mỗi sáng, than hoa âm ỉ, gia vị ướp bí truyền — mỗi bữa BBQ là một buổi tụ họp đáng nhớ.',
                'https://images.unsplash.com/photo-1544025162-d76538977abd?w=1600&q=60&auto=format&fit=crop',
                'Than hoa thật — Hương vị thật',
                'Đặt bàn ngay', '/dat-ban', 0,
            ],
            [
                'Hơn 60 loại thịt & hải sản tươi',
                'Thịt bò Wagyu, bò ribeye Mỹ, tôm sú tươi sống, cá hồi Na Uy — đến và chọn theo khẩu vị của bạn.',
                'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=1600&q=60&auto=format&fit=crop',
                'Nguyên liệu nhập mỗi sáng',
                'Xem thực đơn', '/thuc-don', 1,
            ],
            [
                'Phòng VIP — không gian riêng tư hoàn hảo',
                '4 phòng VIP cách âm, điều hòa riêng — lý tưởng cho sinh nhật, tiệc doanh nghiệp, họp mặt gia đình.',
                'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=1600&q=60&auto=format&fit=crop',
                'Phòng VIP từ 6–20 người',
                'Đặt phòng VIP', '/dat-ban', 2,
            ],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO hero_slides (title, subtitle, image, badge, btn_text, btn_link, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'published')"
        );
        foreach ($slides as $s) {
            $stmt->execute($s);
        }
    }

    private function seedMenuCategories(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM menu_categories")->fetchColumn();
        if ($count > 0) return;

        $cats = [
            ['Thịt Bò', 'thit-bo', 'Bò ribeye Mỹ, Wagyu Nhật, bò thăn nội địa — đa dạng độ ngon và ngân sách', '', 0],
            ['Thịt Heo & Gà', 'thit-heo-ga', 'Ba chỉ, cổ heo, sườn mật ong, cánh gà sa tế — quen thuộc mà không ngán', '', 1],
            ['Hải Sản Tươi', 'hai-san-tuoi', 'Tôm sú sống, mực ống, sò điệp bơ tỏi, cá hồi Na Uy — vị biển trên than hoa', '', 2],
            ['Rau, Nấm & Đồ Phụ', 'rau-nam-do-phu', 'Rau sống cuộn thịt, nấm hỗn hợp nướng mỡ hành, cơm lá sen, bánh mì bơ tỏi', '', 3],
            ['Combo Set', 'combo-set', 'Combo tiết kiệm cho 2–8 người — gọi 1 lần, ăn no đủ loại thịt yêu thích', '', 4],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO menu_categories (name, slug, description, image, sort_order, status) VALUES (?, ?, ?, ?, ?, 'published')"
        );
        foreach ($cats as $c) {
            $stmt->execute($c);
        }
    }

    private function seedMenuItems(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM menu_items")->fetchColumn();
        if ($count > 0) return;

        // Get category IDs
        $catMap = [];
        $rows = $this->pdo->query("SELECT id, slug FROM menu_categories")->fetchAll();
        foreach ($rows as $r) { $catMap[$r['slug']] = $r['id']; }

        $items = [
            // Thịt Bò
            ['thit-bo', 'Bò Ribeye Mỹ', 'bo-ribeye-my', 'Thịt bò nhập khẩu, vân mỡ đẹp, thái mỏng. Nướng 2 phút mỗi mặt là hoàn hảo.', 89000, null, '/100g', '', 'HOT', '', 1, 0],
            ['thit-bo', 'Bò Wagyu A5 Nhật', 'bo-wagyu-a5-nhat', 'Wagyu chính hãng, mỡ xen mịn, tan chảy ngay trên lưỡi. Trải nghiệm thịt bò cao cấp nhất.', 199000, null, '/100g', '', 'PREMIUM', '', 1, 1],
            ['thit-bo', 'Bò Thăn Nội', 'bo-than-noi', 'Thăn bò trong nước, nạc mềm, ít mỡ. Thích hợp cho người ăn kiêng và trẻ em.', 69000, null, '/100g', '', '', '', 0, 2],
            ['thit-bo', 'Bò Nướng Sa Tế', 'bo-nuong-sa-te', 'Bò thăn ướp sa tế đặc biệt, cay thơm vừa phải, màu đẹp khi nướng vàng.', 75000, null, '/100g', '', '', '', 0, 3],
            ['thit-bo', 'Bò Cuốn Mỡ Chài', 'bo-cuon-mo-chai', 'Thịt bò cuộn trong mỡ chài mỏng, khi nướng mỡ chảy thấm vào thịt, béo ngậy cực kỳ.', 85000, null, '/100g', '', '', '', 0, 4],
            // Thịt Heo & Gà
            ['thit-heo-ga', 'Ba Chỉ Heo Ướp Sả', 'ba-chi-heo-uop-sa', 'Ba chỉ tươi, mỡ nạc đan xen, ướp sả gừng thơm lừng. Nướng vàng giòn cạnh.', 49000, null, '/100g', '', 'HOT', '', 1, 0],
            ['thit-heo-ga', 'Cổ Heo Muối Xả', 'co-heo-muoi-xa', 'Cổ heo chắc thịt, muối xả chanh, nướng lâu lửa nhỏ cho chín đều từ trong ra ngoài.', 45000, null, '/100g', '', '', '', 0, 1],
            ['thit-heo-ga', 'Sườn Heo Mật Ong', 'suon-heo-mat-ong', 'Sườn cốt lết ướp mật ong, tỏi, tiêu đen. Nướng xém cạnh, ngọt bùi không thể dừng.', 55000, null, '/100g', '', 'NEW', '', 0, 2],
            ['thit-heo-ga', 'Cánh Gà Sa Tế', 'canh-ga-sa-te', 'Cánh gà ta chắc thịt, ướp sa tế hoặc mật ong chanh theo sở thích.', 35000, null, '/100g', '', '', '', 0, 3],
            ['thit-heo-ga', 'Heo Rừng Nướng Muối', 'heo-rung-nuong-muoi', 'Heo rừng nuôi tự nhiên, thịt chắc và thơm hơn heo thường, chỉ cần muối tiêu là đủ.', 65000, null, '/100g', '', '', '', 0, 4],
            // Hải Sản
            ['hai-san-tuoi', 'Tôm Sú Tươi Sống', 'tom-su-tuoi-song', 'Tôm sú sống, size 6–8 con/kg. Nướng than hoa giữ vị ngọt tự nhiên, chấm muối tiêu chanh.', 59000, null, '/con', '', 'HOT', '', 1, 0],
            ['hai-san-tuoi', 'Mực Ống Tươi', 'muc-ong-tuoi', 'Mực ống loại 1, làm sạch, xẻ cánh hoa. Nướng than vàng, chấm mù tạt cực ngon.', 75000, null, '/100g', '', '', '', 0, 1],
            ['hai-san-tuoi', 'Sò Điệp Bơ Tỏi', 'so-diep-bo-toi', 'Sò điệp nhập khẩu, thịt béo ngậy, nướng bơ tỏi xốt phomai. Thêm một cái thôi không được!', 45000, null, '/con', '', 'NEW', '', 0, 2],
            ['hai-san-tuoi', 'Cá Hồi Na Uy', 'ca-hoi-na-uy', 'Cá hồi phi lê tươi, thái miếng dày, nướng vừa tới — da giòn, thịt chín hồng bên trong.', 85000, null, '/100g', '', '', '', 0, 3],
            ['hai-san-tuoi', 'Ghẹ Biển Hấp/Nướng', 'ghe-bien-hap-nuong', 'Ghẹ tươi sống, gạch nhiều, chế biến theo yêu cầu: hấp sả hoặc nướng muối ớt.', null, null, 'Theo kg', '', '', '', 0, 4],
            // Rau & Đồ Phụ
            ['rau-nam-do-phu', 'Rổ Rau Sống Đặc Biệt', 'ro-rau-song-dac-biet', 'Xà lách, tía tô, húng quế, giá đỗ, dưa leo. Cuộn thịt nướng — không thể thiếu.', 39000, null, '/rổ', '', '', '', 0, 0],
            ['rau-nam-do-phu', 'Nấm Hỗn Hợp', 'nam-hon-hop', 'Kim châm, nấm đùi gà, nấm portobello, nấm hương. Nướng mỡ hành thơm lừng.', 45000, null, '/đĩa', '', '', '', 0, 1],
            ['rau-nam-do-phu', 'Cơm Lá Sen', 'com-la-sen', 'Cơm nấu lá sen thơm ngát, ăn kèm thịt nướng cực hợp. 1 suất vừa đủ no.', 25000, null, '/suất', '', '', '', 0, 2],
            ['rau-nam-do-phu', 'Bánh Mì Nướng Bơ Tỏi', 'banh-mi-nuong-bo-toi', 'Bánh mì đặc ruột, phết bơ tỏi, nướng giòn. Ăn cuộn thịt hoặc ăn riêng đều ngon.', 15000, null, '/cái', '', '', '', 0, 3],
            // Combo Set
            ['combo-set', 'Combo Lửa Đỏ (2 người)', 'combo-lua-do', 'Bò ribeye 200g + ba chỉ heo 200g + cổ heo 150g + rau sống + nước chấm. Tiết kiệm hơn gọi riêng.', 249000, 299000, '/set', '', 'BEST SELLER', '', 1, 0],
            ['combo-set', 'Combo Biển Lửa (2 người)', 'combo-bien-lua', 'Tôm sú 4 con + mực ống 200g + sò điệp 6 con + cá hồi 150g + bơ tỏi.', 319000, null, '/set', '', 'NEW', '', 0, 1],
            ['combo-set', 'Combo Hoàng Gia (4 người)', 'combo-hoang-gia', 'Wagyu 200g + tôm sú 6 con + sườn heo 400g + cánh gà 8 cái + nấm rau + 4 lon nước.', 599000, 699000, '/set', '', 'VIP', '', 1, 2],
            ['combo-set', 'Combo Tiệc Gia Đình (6–8 người)', 'combo-tiec-gia-dinh', 'Đặt trước ít nhất 1 ngày. Thực đơn tùy chọn, phục vụ tại bàn. Bao gồm 2 bếp nướng.', 1200000, null, '/set', '', '', '', 0, 3],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO menu_items (category_id, name, slug, description, price, price_sale, price_unit, image, badge, allergens, featured, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')"
        );
        foreach ($items as $item) {
            $catSlug = $item[0];
            $catId = $catMap[$catSlug] ?? null;
            $stmt->execute([
                $catId, $item[1], $item[2], $item[3],
                $item[4], $item[5], $item[6], $item[7],
                $item[8], $item[9], $item[10], $item[11],
            ]);
        }
    }

    private function seedGallery(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM gallery_items")->fetchColumn();
        if ($count > 0) return;

        $items = [
            ['Sảnh chính — 150 chỗ ngồi', 'Khu vực sảnh chính rộng rãi với bàn nướng than hoa riêng từng bàn', 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=700&q=80&auto=format&fit=crop', 'Không gian', 0],
            ['Bàn nướng than hoa riêng', 'Mỗi bàn có bếp than hoa inox hiện đại, hệ thống hút khói inline', 'https://images.unsplash.com/photo-1544025162-d76538977abd?w=500&q=80&auto=format&fit=crop', 'Không gian', 1],
            ['Phòng VIP cách âm', 'Phòng VIP riêng tư, điều hòa độc lập, phù hợp tiệc sinh nhật và họp mặt', 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&q=80&auto=format&fit=crop', 'Không gian', 2],
            ['Khu nướng ngoài trời', 'Khu nướng ngoài trời thoáng mát, lý tưởng buổi tối mát mẻ', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80&auto=format&fit=crop', 'Không gian', 3],
            ['Quầy bar thức uống', 'Quầy bar phục vụ đồ uống tươi, nước ngọt, bia, cocktail trái cây', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=700&q=80&auto=format&fit=crop', 'Không gian', 4],
            ['Bò Ribeye nướng than', 'Bò ribeye Mỹ thái mỏng, nướng vừa lửa — mỡ xen tan chảy', 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=700&q=80&auto=format&fit=crop', 'Món ăn', 5],
            ['Combo Hoàng Gia', 'Combo 4 người với đầy đủ bò Wagyu, tôm sú, sườn heo, cánh gà', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=700&q=80&auto=format&fit=crop', 'Món ăn', 6],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO gallery_items (title, description, image, category, sort_order, status) VALUES (?, ?, ?, ?, ?, 'published')"
        );
        foreach ($items as $i) { $stmt->execute($i); }
    }

    private function seedTestimonials(): void {
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
        if ($count > 0) return;

        $items = [
            [
                'Nguyễn Đức Thắng',
                'Food Blogger · TP.HCM',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop&crop=face',
                'Bò ribeye nướng than hoa ngon khỏi phải bàn. Thịt tươi, ướp đậm đà, nhân viên hướng dẫn nướng tận tình. Sẽ còn quay lại nhiều lần!',
                5, 0,
            ],
            [
                'Lê Thị Bích Ngọc',
                'Khách hàng thường xuyên',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop&crop=face',
                'Đặt tiệc sinh nhật cho nhóm 12 người. Phòng VIP rộng rãi, nhân viên chuyên nghiệp. Combo Hoàng Gia rất xứng đáng giá tiền, ai cũng khen.',
                5, 1,
            ],
            [
                'Trần Quang Huy',
                'Khách đặt tiệc doanh nghiệp',
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face',
                'Hệ thống hút khói tốt, không bị ám mùi áo. Bò Wagyu chảy tan trong miệng. Không gian rộng, âm nhạc vừa phải — hoàn hảo cho buổi tụ họp cuối tuần.',
                5, 2,
            ],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, 'published')"
        );
        foreach ($items as $i) { $stmt->execute($i); }
    }

    // --- Query helpers ---

    public function query(string $sql, array $params = []): array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    public function execute(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (int)$this->pdo->lastInsertId();
    }

    public function getPdo(): PDO {
        return $this->pdo;
    }
}
