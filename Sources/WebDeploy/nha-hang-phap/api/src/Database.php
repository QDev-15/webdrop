<?php
declare(strict_types=1);

class Database {
    private static ?Database $instance = null;
    private PDO $pdo;

    private function __construct() {
        $dir = dirname(DB_FILE);
        if (!is_dir($dir)) { mkdir($dir, 0755, true); }

        $dsn = 'sqlite:' . DB_FILE;
        $this->pdo = new PDO($dsn, null, null, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->pdo->exec('PRAGMA journal_mode = WAL');
        $this->migrate();
    }

    public static function getInstance(): self {
        if (self::$instance === null) { self::$instance = new self(); }
        return self::$instance;
    }

    public function getPdo(): PDO { return $this->pdo; }

    public function query(string $sql, array $params = []): array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $rows = $this->query($sql, $params);
        return $rows[0] ?? null;
    }

    public function execute(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (int)$this->pdo->lastInsertId();
    }

    private function migrate(): void {
        $schemaFile = __DIR__ . '/../schema.sql';
        $sql = file_get_contents($schemaFile);
        if ($sql === false) {
            throw new RuntimeException('Không đọc được schema.sql — file bị thiếu hoặc không có quyền đọc.');
        }
        // Execute each statement
        foreach (array_filter(array_map('trim', explode(';', $sql))) as $stmt) {
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
        $count = (int)($this->queryOne('SELECT COUNT(*) as c FROM users')['c'] ?? 0);
        if ($count > 0) return;
        $hash = password_hash('123456', PASSWORD_BCRYPT);
        $this->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['Quản trị viên', 'sysadmin@admin.com', $hash, 'superadmin']
        );
    }

    private function seedSettings(): void {
        $count = (int)($this->queryOne('SELECT COUNT(*) as c FROM settings')['c'] ?? 0);
        if ($count > 0) return;

        $settings = [
            // general
            ['site_name',        'Le Bistro Français',                               'general'],
            ['site_tagline',     'L\'art de la cuisine française au cœur de Việt Nam', 'general'],
            ['site_email',       'contact@lebistro.vn',                              'general'],
            ['site_phone',       '0901 234 567',                                     'general'],
            ['site_address',     '15 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',         'general'],
            ['working_hours',    'Thứ 3–5: 18:00–22:30 | Thứ 6–7: 18:00–23:00 | CN: 12:00–22:30 | Thứ 2: Nghỉ', 'general'],
            ['zalo_phone',       '0901234567',                                        'general'],
            ['since_year',       '2018',                                              'general'],
            ['city',             'TP. Hồ Chí Minh',                                  'general'],
            // seo
            ['meta_title',       'Le Bistro Français — Nhà hàng Pháp tại TP.HCM',   'seo'],
            ['meta_description', 'Ẩm thực Pháp tinh tế, không gian lãng mạn, rượu vang chọn lọc. Đặt bàn ngay tại Le Bistro Français.', 'seo'],
            ['meta_keywords',    'nhà hàng pháp, ẩm thực pháp, bistro, hcm, rượu vang pháp', 'seo'],
            // social
            ['facebook',         'https://facebook.com/lebistro',                    'social'],
            ['instagram',        'https://instagram.com/lebistro',                   'social'],
            ['youtube',          '',                                                  'social'],
            ['tiktok',           '',                                                  'social'],
            ['zalo',             'https://zalo.me/0901234567',                        'social'],
            // footer
            ['footer_tagline',   'Nghệ thuật ẩm thực Pháp — mỗi buổi tối là một kỷ niệm.', 'footer'],
            ['footer_copyright', '© 2026 Le Bistro Français · La cuisine française au Việt Nam', 'footer'],
            // contact
            ['contact_map_embed', '',                                                 'contact'],
            ['contact_address',   '15 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',        'contact'],
            // smtp
            ['smtp_host',        'smtp.gmail.com',                                   'smtp'],
            ['smtp_port',        '587',                                               'smtp'],
            ['smtp_user',        '',                                                  'smtp'],
            ['smtp_pass',        '',                                                  'smtp'],
            ['smtp_from_name',   'Le Bistro Français',                               'smtp'],
            ['smtp_from_email',  'contact@lebistro.vn',                              'smtp'],
            // system
            ['maintenance_mode', '0',                                                 'system'],
            ['analytics_id',     '',                                                  'system'],
            // about section
            ['about_title',      'Nghệ thuật tiếp đón của chúng tôi',               'about'],
            ['about_description', 'Mỗi buổi tối tại Le Bistro là một hành trình — từ ly khai vị đến chén rượu tiêu tán, được chăm chút từng chi tiết nhỏ.', 'about'],
            // chef section
            ['chef_name',        'Chef Antoine Moreau',                              'chef'],
            ['chef_title',       'Bếp trưởng điều hành · Le Bistro Français',       'chef'],
            ['chef_image',       'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80&auto=format&fit=crop', 'chef'],
            ['chef_bio_1',       'Được đào tạo tại École Ferrandi, Paris, Chef Antoine đã trải qua hơn 15 năm làm việc tại các nhà hàng Michelin ở Paris, Lyon và Bordeaux trước khi đem ẩm thực Pháp đích thực về Việt Nam.', 'chef'],
            ['chef_bio_2',       '"Món ăn ngon nhất là món ăn được làm từ nguyên liệu tươi nhất, với kỹ thuật đúng nhất và tình yêu chân thật nhất." — Chef Antoine', 'chef'],
            ['chef_years_exp',   '15',                                               'chef'],
            ['chef_awards',      '8',                                                 'chef'],
            ['chef_signature_dishes', '40',                                           'chef'],
            // wine section
            ['wine_description', 'Hơn 80 nhãn rượu vang từ các vùng nổi tiếng của Pháp — Bordeaux, Bourgogne, Champagne và Rhône — được sommelière tuyển chọn tỉ mỉ.', 'wine'],
            // reservation section
            ['reservation_note', 'Vui lòng đặt bàn trước tối thiểu 24 giờ. Bàn được giữ trong 15 phút sau giờ đặt.', 'reservation'],
            ['degustation_price', '1.850.000',                                       'reservation'],
            // cloudinary
            ['cloudinary_cloud_name', '',                                             'cloudinary'],
            ['cloudinary_api_key',    '',                                             'cloudinary'],
            ['cloudinary_api_secret', '',                                             'cloudinary'],
            ['cloudinary_upload_preset', '',                                          'cloudinary'],
            // integrations
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];

        $stmt = $this->pdo->prepare('INSERT INTO settings (key, value, grp) VALUES (?, ?, ?)');
        foreach ($settings as [$key, $value, $grp]) {
            $stmt->execute([$key, $value, $grp]);
        }
    }

    private function seedHeroSlides(): void {
        $count = (int)($this->queryOne('SELECT COUNT(*) as c FROM hero_slides')['c'] ?? 0);
        if ($count > 0) return;

        $slides = [
            [
                'title'      => "L'art de la\ncuisine française\nau cœur de Việt Nam.",
                'subtitle'   => 'Nghệ thuật ẩm thực Pháp — từng món ăn là một trải nghiệm, từng buổi tối là một kỷ niệm không quên.',
                'image'      => 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=60&auto=format&fit=crop',
                'badge'      => 'Depuis 2018 · TP. Hồ Chí Minh, Việt Nam',
                'cta_text'   => 'Réserver une table',
                'cta_url'    => '/reservation',
                'sort_order' => 0,
            ],
        ];

        $stmt = $this->pdo->prepare(
            'INSERT INTO hero_slides (title, subtitle, image, badge, cta_text, cta_url, sort_order, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );
        foreach ($slides as $s) {
            $stmt->execute([$s['title'], $s['subtitle'], $s['image'], $s['badge'], $s['cta_text'], $s['cta_url'], $s['sort_order'], 'published']);
        }
    }

    private function seedMenuCategories(): void {
        $count = (int)($this->queryOne('SELECT COUNT(*) as c FROM menu_categories')['c'] ?? 0);
        if ($count > 0) return;

        $cats = [
            ['Entrées · Khai vị',           'Entrees',           'entrees',          'Những món khai vị tinh tế mở đầu cho bữa tối Pháp', 0],
            ['Poissons · Cá & Hải sản',     'Poissons',          'poissons',         'Hải sản tươi chế biến theo phong cách Địa Trung Hải', 1],
            ['Viandes · Món thịt',          'Viandes',           'viandes',          'Thịt bò Úc, vịt, gà ta nấu theo công thức Pháp cổ điển', 2],
            ['Fromages · Phô mai',          'Fromages',          'fromages',         'Bảng phô mai chín tuyển chọn từ các vùng nước Pháp', 3],
            ['Desserts · Tráng miệng',      'Desserts',          'desserts',         'Kết thúc hoàn hảo cho bữa tối lãng mạn', 4],
        ];

        $stmt = $this->pdo->prepare(
            'INSERT INTO menu_categories (name, name_fr, slug, description, sort_order) VALUES (?, ?, ?, ?, ?)'
        );
        foreach ($cats as $c) {
            $stmt->execute($c);
        }
    }

    private function seedMenuItems(): void {
        $count = (int)($this->queryOne('SELECT COUNT(*) as c FROM menu_items')['c'] ?? 0);
        if ($count > 0) return;

        // Get category IDs
        $catMap = [];
        foreach ($this->query('SELECT id, slug FROM menu_categories') as $row) {
            $catMap[$row['slug']] = (int)$row['id'];
        }

        $items = [
            // Entrées
            [$catMap['entrees'] ?? null, 'Gan ngỗng chiên bơ', 'Foie Gras Poêlé', 'Gan ngỗng chiên bơ, táo Pháp caramel, brioche nướng, sốt Porto đỏ. Kết cấu kem mịn, vị ngọt từ táo và đắng nhẹ từ sốt Porto tạo nên sự cân bằng hoàn hảo.', 385000, null, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80&auto=format&fit=crop', 'Chef Signature', '', 1, 0],
            [$catMap['entrees'] ?? null, 'Súp kem tôm hùm', 'Bisque de Homard', 'Súp kem tôm hùm Bretagne, saffron, lá thyme, bánh baguette nướng bơ. Mỗi muỗng là một trải nghiệm về biển cả miền Bretagne.', 245000, null, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80&auto=format&fit=crop', '', '', 0, 1],
            [$catMap['entrees'] ?? null, 'Salad cá ngừ kiểu Nice', 'Salade Niçoise Classique', 'Salad cá ngừ tươi áp chảo, olive đen Niçoise, trứng luộc, cà chua cherry, đậu que Pháp. Sốt vinaigrette mù tạt.', 195000, null, null, '', '', 0, 2],
            [$catMap['entrees'] ?? null, 'Bánh soufflé phô mai', 'Soufflé au Fromage', 'Bánh soufflé phô mai Gruyère và Emmental, hành tây caramel. Phải được phục vụ ngay khi ra lò — xốp nhẹ, thơm phô mai, lòng kem mịn. Đặt trước 15 phút.', 215000, null, null, 'Cần đặt trước', '', 0, 3],
            // Poissons
            [$catMap['poissons'] ?? null, 'Cá bơn chiên bơ', 'Sole Meunière', 'Cá bơn chiên bơ nguyên con, capers, chanh vàng Pháp, rau mùi tây. Da giòn, thịt trắng mịn, bơ nâu thơm lừng. Julia Child từng nói đây là món Pháp yêu thích nhất của bà.', 545000, null, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&q=80&auto=format&fit=crop', 'Kinh điển', '', 1, 0],
            [$catMap['poissons'] ?? null, 'Súp hải sản Marseille', 'Bouillabaisse Provençale', 'Súp hải sản Marseille — tôm, mực, trai, cá trắng, cà chua, saffron, rouille. Hương vị Địa Trung Hải đích thực, pha với rouille và bánh baguette cứng.', 685000, null, null, 'Đặc sản', '', 0, 1],
            // Viandes
            [$catMap['viandes'] ?? null, 'Ức vịt áp chảo', 'Magret de Canard à l\'Orange', 'Ức vịt áp chảo, sốt cam caramel, rau củ nướng, khoai tây sarladaise. Vịt medium-rare, da giòn vàng, thịt hồng mềm mướt.', 485000, null, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80&auto=format&fit=crop', '', '', 1, 0],
            [$catMap['viandes'] ?? null, 'Phi lê bò sốt truffle', 'Filet de Bœuf Rossini', 'Phi lê bò Úc, foie gras áp chảo, sốt Périgueux nấm truffle đen. Bản nâng cấp của Tournedos Rossini — phong phú, sang trọng và đẳng cấp nhất trong menu.', 895000, null, 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80&auto=format&fit=crop', 'Premium', '', 1, 1],
            [$catMap['viandes'] ?? null, 'Gà ta ninh rượu vang', 'Coq au Vin', 'Gà ta ninh rượu vang đỏ Bourgogne, nấm, lard, hành trân châu nhỏ. Comfort food Pháp cổ điển — gà mềm rụng xương, sốt vang sánh đậm.', 365000, null, null, '', '', 0, 2],
            // Fromages
            [$catMap['fromages'] ?? null, 'Bảng 5 loại phô mai chín', 'Plateau de Fromages Affinés', 'Bảng 5 loại phô mai chín — Brie, Comté, Roquefort, Chèvre, Époisses. Mật ong hoa thyme, mứt cherry, quả nho đỏ, bánh mì nướng mỏng.', 285000, null, null, '', '', 0, 0],
            // Desserts
            [$catMap['desserts'] ?? null, 'Kem trứng caramel cháy', 'Crème Brûlée à la Vanille', 'Kem trứng vani Madagascar, đường caramel cháy, quả mâm xôi tươi. Vani Madagascar — loại vani ngon nhất thế giới — trong kem mịn mà nặng hương thơm.', 145000, null, 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=500&q=80&auto=format&fit=crop', 'Best seller', '', 1, 0],
            [$catMap['desserts'] ?? null, 'Bánh táo lật ngược', 'Tarte Tatin aux Pommes', 'Bánh táo lật ngược kiểu Sologne, kem tươi crème fraîche, caramel bơ muối Bretagne. Nóng hổi, táo mềm đậm vị caramel, đế bánh bơ giòn tan.', 155000, null, null, '', '', 0, 1],
            [$catMap['desserts'] ?? null, 'Mousse socola đen', 'Mousse au Chocolat Noir', 'Mousse socola đen 70% Valrhona, coulis dâu tây, praline hạnh nhân. Nhẹ như không khí, đắng dịu nhẹ từ socola Valrhona hảo hạng.', 135000, null, null, '', '', 0, 2],
            [$catMap['desserts'] ?? null, 'Bánh su kem socola', 'Profiteroles au Chocolat', 'Ba chiếc profiteroles nhỏ, kem mát lạnh bên trong — rưới sốt socola nóng ngay tại bàn để tạo hiệu ứng thú vị.', 125000, null, null, '', '', 0, 3],
        ];

        $stmt = $this->pdo->prepare(
            'INSERT INTO menu_items (category_id, name, name_fr, description, price, price_sale, image, badge, allergens, featured, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        foreach ($items as $item) {
            $stmt->execute($item);
        }
    }

    private function seedGallery(): void {
        $count = (int)($this->queryOne('SELECT COUNT(*) as c FROM gallery_items')['c'] ?? 0);
        if ($count > 0) return;

        $items = [
            ['Không gian bistro lãng mạn', 'Nội thất nhà hàng mang phong cách Pháp cổ điển', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop', 'interior', 0],
            ['Foie Gras Poêlé', 'Gan ngỗng chiên bơ — món khai vị tinh tế', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop', 'food', 1],
            ['Hầm rượu vang', 'Hơn 80 nhãn rượu từ các vùng nổi tiếng nước Pháp', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80&auto=format&fit=crop', 'wine', 2],
            ['Crème Brûlée', 'Tráng miệng kinh điển với vani Madagascar', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80&auto=format&fit=crop', 'food', 3],
            ['Chef Antoine tại bếp', 'Bếp trưởng điều hành Chef Antoine Moreau', 'https://images.unsplash.com/photo-1559181567-c3190ca9d5db?w=800&q=80&auto=format&fit=crop', 'kitchen', 4],
            ['Bàn tiệc kỷ niệm', 'Trang trí đặc biệt cho các dịp quan trọng', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop', 'event', 5],
        ];

        $stmt = $this->pdo->prepare(
            'INSERT INTO gallery_items (title, description, image, category, sort_order) VALUES (?, ?, ?, ?, ?)'
        );
        foreach ($items as $item) {
            $stmt->execute($item);
        }
    }

    private function seedTestimonials(): void {
        $count = (int)($this->queryOne('SELECT COUNT(*) as c FROM testimonials')['c'] ?? 0);
        if ($count > 0) return;

        $items = [
            ['Nguyễn Phương Linh', 'Food Critic · Hà Nội', '', '"Trải nghiệm ăn tối Pháp chân thực nhất mà tôi từng có ở Việt Nam. Không gian đẹp, đồ ăn tinh tế, và dịch vụ thực sự tuyệt vời — như đang ngồi ở một bistro tại Paris vậy."', 5, 0],
            ['Thomas Beaumont', 'Chef Consultant · Paris & Hà Nội', '', '"Crème Brûlée ở đây là ngon nhất tôi từng ăn ngoài Paris. Chef thực sự hiểu ẩm thực Pháp — không phải phiên bản \'Việt hoá\' mà là bản gốc đích thực."', 5, 1],
            ['Trần Đức Minh', 'Khách hàng thường xuyên', '', '"Tôi đặt bàn kỷ niệm 10 năm ngày cưới. Nhà hàng trang trí bàn đặc biệt theo yêu cầu, thực đơn được thiết kế riêng. Vợ tôi xúc động mãi đến tận hôm nay."', 5, 2],
        ];

        $stmt = $this->pdo->prepare(
            'INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
        );
        foreach ($items as $item) {
            $stmt->execute($item);
        }
    }
}
