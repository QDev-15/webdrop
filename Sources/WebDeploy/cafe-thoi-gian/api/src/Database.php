<?php
declare(strict_types=1);

class Database {
    private \PDO $pdo;
    private static ?Database $instance = null;

    private function __construct() {
        if (DB_TYPE === 'sqlite') {
            $dir = dirname(DB_FILE);
            if (!is_dir($dir)) mkdir($dir, 0755, true);
            $this->pdo = new \PDO('sqlite:' . DB_FILE);
            $this->pdo->exec('PRAGMA foreign_keys = ON');
            $this->pdo->exec('PRAGMA journal_mode = WAL');
        } else {
            $dsn = DB_TYPE . ':host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            $this->pdo = new \PDO($dsn, DB_USER, DB_PASS);
        }
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
        $this->migrate();
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
        // ⚠️  PHẢI check false — nếu schema.sql thiếu, tables không được tạo
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
        $this->seedGallery();
        $this->seedTestimonials();
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
            ['site_name',        'Cà Phê Thời Gian',                               'general'],
            ['site_description', 'Không gian cà phê ấm cúng, rang xay thủ công. Nơi thời gian chậm lại và mỗi tách là một trải nghiệm.', 'general'],
            ['site_logo',        '',                                                 'general'],
            ['site_favicon',     '',                                                 'general'],
            ['site_email',       'hello@caphethogian.vn',                            'general'],
            ['site_phone',       '0901 234 567',                                     'general'],
            ['site_phone_2',     '',                                                 'general'],
            ['site_address',     'Số nhà, Tên đường, Phường/Xã, Quận/Huyện, TP.HCM','general'],
            ['working_hours',    'Thứ 2 – Thứ 6: 7:00 – 22:00 | Thứ 7 – CN: 6:30 – 23:00 | Không nghỉ lễ', 'general'],
            // seo
            ['meta_title',       'Cà Phê Thời Gian — Rang Xay Thủ Công',            'seo'],
            ['meta_description', 'Quán cà phê phong cách, không gian ấm cúng. Thưởng thức cà phê rang xay thủ công và những khoảnh khắc chậm lại giữa lòng thành phố.', 'seo'],
            ['meta_keywords',    'cà phê, cafe, rang xay thủ công, cold brew, pour over, espresso', 'seo'],
            ['og_image',         '',                                                 'seo'],
            ['google_analytics_id','',                                               'seo'],
            // social
            ['social_facebook',  '',                                                 'social'],
            ['social_youtube',   '',                                                 'social'],
            ['social_instagram', '',                                                 'social'],
            ['social_tiktok',    '',                                                 'social'],
            ['social_zalo',      '',                                                 'social'],
            // design
            ['primary_color',    '#78350f',                                          'design'],
            ['secondary_color',  '#92400e',                                          'design'],
            // footer
            ['footer_copyright', '© 2024 Cà Phê Thời Gian · Made in Vietnam',       'footer'],
            ['footer_description','Không gian cà phê ấm cúng, rang xay thủ công. Nơi thời gian chậm lại.', 'footer'],
            ['footer_show_social','1',                                               'footer'],
            // contact
            ['contact_form_enabled', '1',                                            'contact'],
            ['contact_email_receiver','hello@caphethogian.vn',                       'contact'],
            ['google_map_embed', '',                                                  'contact'],
            // smtp
            ['smtp_host',   'smtp.gmail.com',                                        'smtp'],
            ['smtp_port',   '587',                                                    'smtp'],
            ['smtp_user',   '',                                                       'smtp'],
            ['smtp_password','',                                                      'smtp'],
            ['smtp_from_name','Cà Phê Thời Gian',                                    'smtp'],
            ['smtp_from_email','',                                                    'smtp'],
            // system
            ['maintenance_mode',    '0',                                              'system'],
            ['maintenance_message', 'Website đang bảo trì. Vui lòng quay lại sau.', 'system'],
            // about / cafe info
            ['about_title',    'Hành trình từ hạt đến ly',                           'about'],
            ['about_content',  'Mỗi hạt cà phê đều được chúng tôi chọn lọc trực tiếp từ các nông trại uy tín tại Tây Nguyên và Đà Lạt. Rang trong nhà mỗi tuần 2 lần để đảm bảo độ tươi tối đa.', 'about'],
            ['about_tagline',  'Mỗi tách là một khoảnh khắc',                        'about'],
            ['about_image',    'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80&auto=format&fit=crop', 'about'],
            ['stat_regions',   '3',                                                   'about'],
            ['stat_years',     '8+',                                                  'about'],
            ['stat_cups_day',  '200',                                                 'about'],
            // reservation settings
            ['reservation_enabled', '1',                                              'reservation'],
            ['reservation_note',    'Phản hồi xác nhận trong vòng 15 phút trong giờ mở cửa.', 'reservation'],
            ['reservation_hold_minutes', '20',                                        'reservation'],
        ];
        $stmt = $this->pdo->prepare("INSERT OR IGNORE INTO settings (key, value, \"group\") VALUES (?, ?, ?)");
        foreach ($rows as $r) {
            $stmt->execute($r);
        }
    }

    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        $slides = [
            [
                'title'       => 'Mỗi tách là một khoảnh khắc.',
                'subtitle'    => 'Chúng tôi tin rằng một tách cà phê ngon không chỉ về hương vị — mà còn là không gian, nhịp sống và cảm giác được trân trọng từng giây phút.',
                'button_text' => 'Xem thực đơn',
                'button_link' => '/menu',
                'image'       => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80&auto=format&fit=crop',
                'sort_order'  => 1,
                'status'      => 'published',
            ],
        ];
        foreach ($slides as $s) {
            $this->execute(
                "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [$s['title'], $s['subtitle'], $s['button_text'], $s['button_link'], $s['image'], $s['sort_order'], $s['status']]
            );
        }
    }

    private function seedMenuCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_categories") > 0) return;
        $cats = [
            ['Espresso Based',        'espresso-based',     'Các thức uống cà phê pha chế bằng máy espresso áp suất cao.',   '☕', 1],
            ['Cold Brew & Pour Over', 'cold-brew-pour-over','Ngâm lạnh và pha thủ công — hương vị tinh tế, trong sáng.',      '🧊', 2],
            ['Trà & Nước Ép',         'tra-nuoc-ep',        'Trà thượng hạng, nước ép tươi và các loại đồ uống không cà phê.','🍵', 3],
            ['Bánh Ngọt & Ăn Nhẹ',   'banh-ngot-an-nhe',   'Croissant, cheesecake, tiramisu và các món ăn nhẹ.',             '🥐', 4],
            ['Cà Phê Hạt Mang Về',   'ca-phe-hat',         'Cà phê hạt rang tươi, đóng gói mang về pha tại nhà.',           '☕', 5],
        ];
        foreach ($cats as $c) {
            $this->execute(
                "INSERT INTO menu_categories (name, slug, description, icon, sort_order) VALUES (?, ?, ?, ?, ?)",
                $c
            );
        }
    }

    private function seedMenuItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_items") > 0) return;
        // Get category IDs
        $catMap = [];
        $rows = $this->query("SELECT id, slug FROM menu_categories");
        foreach ($rows as $r) { $catMap[$r['slug']] = (int)$r['id']; }

        $items = [
            // Espresso Based
            [$catMap['espresso-based'] ?? null, 'Espresso Signature',  'espresso-signature',    'Blend Arabica & Robusta, chiết xuất 28 giây, crema dày vàng óng.',          45000, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80&auto=format&fit=crop', 1, 1],
            [$catMap['espresso-based'] ?? null, 'Latte Sữa Tươi',      'latte-sua-tuoi',        'Double shot, sữa tươi tiệt trùng hấp nóng 65°C, latte art.',                55000, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80&auto=format&fit=crop', 1, 2],
            [$catMap['espresso-based'] ?? null, 'Cappuccino',           'cappuccino',            'Espresso, sữa hấp, foam khô đặc theo kiểu Italy truyền thống.',              55000, 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&q=80&auto=format&fit=crop', 0, 3],
            [$catMap['espresso-based'] ?? null, 'Americano',            'americano',             'Espresso pha loãng với nước nóng. Uống nóng hoặc iced đều ngon.',            45000, 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&q=80&auto=format&fit=crop', 0, 4],
            [$catMap['espresso-based'] ?? null, 'Flat White',           'flat-white',            'Ristretto double shot, sữa vi foam siêu mịn, đậm hơn latte.',                60000, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80&auto=format&fit=crop', 0, 5],
            [$catMap['espresso-based'] ?? null, 'Mocha Socola',         'mocha-socola',          'Espresso, sốt socola đắng, sữa hấp, whipped cream tươi.',                   65000, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80&auto=format&fit=crop', 0, 6],
            // Cold Brew & Pour Over
            [$catMap['cold-brew-pour-over'] ?? null, 'Cold Brew Classic',      'cold-brew-classic',     'Ngâm lạnh 24 giờ, vị mượt mà, không đắng, uống đá.', 60000, 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&q=80&auto=format&fit=crop', 1, 1],
            [$catMap['cold-brew-pour-over'] ?? null, 'Cold Brew + Sữa Đặc',    'cold-brew-sua-dac',     'Cold brew đặc + sữa đặc ngọt, thêm đá viên to.', 65000, '', 0, 2],
            [$catMap['cold-brew-pour-over'] ?? null, 'Cold Brew + Tonic',       'cold-brew-tonic',       'Cold brew + Fever-Tree tonic, vị chua nhẹ, sảng khoái.', 70000, '', 0, 3],
            [$catMap['cold-brew-pour-over'] ?? null, 'Pour Over Đà Lạt',        'pour-over-da-lat',      'Single origin Đà Lạt, hương hoa dại và cherry tươi.', 65000, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80&auto=format&fit=crop', 1, 4],
            [$catMap['cold-brew-pour-over'] ?? null, 'Pour Over Ethiopia',       'pour-over-ethiopia',    'Yirgacheffe, blueberry, hoa nhài, body nhẹ.', 75000, '', 0, 5],
            [$catMap['cold-brew-pour-over'] ?? null, 'French Press',             'french-press',          'Ngâm 4 phút, body dày, tinh dầu tự nhiên, classic.', 55000, '', 0, 6],
            // Trà & Nước Ép
            [$catMap['tra-nuoc-ep'] ?? null, 'Trà Ô Long Sữa',    'tra-o-long-sua',    'Ô long Đài Loan, sữa béo, trân châu đen / trắng.', 55000, '', 0, 1],
            [$catMap['tra-nuoc-ep'] ?? null, 'Hồng Trà Đào',      'hong-tra-dao',      'Hồng trà Sri Lanka, đào ngâm, đá viên, thơm ngọt.', 60000, '', 0, 2],
            [$catMap['tra-nuoc-ep'] ?? null, 'Matcha Latte',       'matcha-latte',      'Matcha Nhật premium, sữa tươi, có thể dùng sữa hạt.', 65000, '', 0, 3],
            [$catMap['tra-nuoc-ep'] ?? null, 'Trà Sen Vàng',       'tra-sen-vang',      'Trà mộc ướp sen, pha ấm, hương thơm dịu nhẹ.', 45000, '', 0, 4],
            [$catMap['tra-nuoc-ep'] ?? null, 'Nước Ép Cam Gừng',   'nuoc-ep-cam-gung',  'Cam tươi vắt, gừng tươi, mật ong, vitamin C cao.', 55000, '', 0, 5],
            [$catMap['tra-nuoc-ep'] ?? null, 'Sinh Tố Bơ Sữa',     'sinh-to-bo-sua',    'Bơ chín, sữa đặc, đá xay, béo ngậy.', 65000, '', 0, 6],
            // Bánh Ngọt
            [$catMap['banh-ngot-an-nhe'] ?? null, 'Croissant Bơ Pháp',   'croissant-bo-phap',  'Bơ AOP, xốp giòn, thơm tầng lớp.', 45000, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80&auto=format&fit=crop', 1, 1],
            [$catMap['banh-ngot-an-nhe'] ?? null, 'Cheesecake New York',  'cheesecake-ny',      'Cream cheese, không nướng, mịn béo.', 65000, '', 0, 2],
            [$catMap['banh-ngot-an-nhe'] ?? null, 'Tiramisu Espresso',    'tiramisu-espresso',  'Mascarpone, espresso, biscuit Savoiardi.', 70000, '', 1, 3],
            [$catMap['banh-ngot-an-nhe'] ?? null, 'Waffle Bơ Chuối',      'waffle-bo-chuoi',    'Waffle nóng, bơ, chuối tươi, mật ong.', 75000, '', 0, 4],
            [$catMap['banh-ngot-an-nhe'] ?? null, 'Bánh Mì Sandwich',     'banh-mi-sandwich',   'Baguette, trứng ốp, dăm bông, rau sống, xốt mayonnaise.', 55000, '', 0, 5],
            [$catMap['banh-ngot-an-nhe'] ?? null, 'Muffin Việt Quất',     'muffin-viet-quat',   'Muffin mềm, việt quất tươi, đường thô phủ mặt.', 40000, '', 0, 6],
            [$catMap['banh-ngot-an-nhe'] ?? null, 'Brownie Socola Đen',   'brownie-socola-den', 'Socola đắng 70%, texture fudgy, ít đường.', 55000, '', 0, 7],
            // Cà Phê Hạt
            [$catMap['ca-phe-hat'] ?? null, 'Blend House 250g',              'blend-house-250g',    'Arabica & Robusta, rang medium, phù hợp mọi phương pháp.', 180000, '', 0, 1],
            [$catMap['ca-phe-hat'] ?? null, 'Single Origin Đà Lạt 200g',     'single-origin-da-lat','Arabica Cầu Đất, rang light-medium, hương hoa nhẹ.', 240000, '', 0, 2],
            [$catMap['ca-phe-hat'] ?? null, 'Ethiopia Yirgacheffe 200g',      'ethiopia-yirgacheffe','Rang light, blueberry, hoa nhài, body thanh.', 320000, '', 0, 3],
            [$catMap['ca-phe-hat'] ?? null, 'Cold Brew Concentrate 500ml',    'cold-brew-concentrate','Chai đặc pha sẵn, pha với nước hoặc sữa 1:3.', 150000, '', 0, 4],
        ];
        foreach ($items as $item) {
            $this->execute(
                "INSERT OR IGNORE INTO menu_items (category_id, name, slug, description, price, image, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                $item
            );
        }
    }

    private function seedGallery(): void {
        if ($this->scalar("SELECT COUNT(*) FROM gallery_items") > 0) return;
        $images = [
            ['Không gian chính', 'Tầng 1 Main Hall', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80&auto=format&fit=crop', 'khong-gian', 1],
            ['Latte Art', 'Nghệ thuật latte tại quầy bar', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=700&q=80&auto=format&fit=crop', 'do-uong', 2],
            ['Barista', 'Barista pha chế tỉ mỉ', 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=700&q=80&auto=format&fit=crop', 'con-nguoi', 3],
            ['Hạt Cà Phê', 'Cà phê hạt rang tươi', 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=700&q=80&auto=format&fit=crop', 'san-pham', 4],
            ['Góc Cafe', 'Góc ngồi ấm cúng', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=700&q=80&auto=format&fit=crop', 'khong-gian', 5],
            ['Sân Vườn', 'Sân vườn cây xanh', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80&auto=format&fit=crop', 'khong-gian', 6],
        ];
        foreach ($images as $img) {
            $this->execute(
                "INSERT INTO gallery_items (title, description, image, category, sort_order) VALUES (?, ?, ?, ?, ?)",
                $img
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $testimonials = [
            ['Nguyễn Minh Thư', 'Freelancer · Đà Nẵng', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80&auto=format&fit=crop', 'Quán không gian cực kỳ dễ chịu, nhạc nhẹ nhàng, cà phê ngon. Tôi hay đến một mình để làm việc, mấy tiếng trôi qua lúc nào không hay. Cold Brew ở đây là best tôi từng uống!', 5, 1],
            ['Trần Phúc Bảo', 'Nhiếp ảnh gia · TP.HCM', 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=80&q=80&auto=format&fit=crop', 'Cappuccino pha đúng chuẩn — foam mịn, nhiệt độ vừa, không quá nhạt không quá đắng. Sân vườn đẹp lắm, chụp ảnh ra rất xịn. Nhân viên friendly và am hiểu về cà phê.', 5, 2],
            ['Lê Hương Giang', 'Giáo viên · Hà Nội', 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=80&q=80&auto=format&fit=crop', 'Phòng riêng đặt trước rất tiện, họp nhóm nhỏ cực ổn. Tiramisu ngon và không quá ngọt. Không gian đúng chất "thời gian ngừng trôi" — cứ muốn ngồi mãi không về!', 5, 3],
        ];
        foreach ($testimonials as $t) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                $t
            );
        }
    }

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
        return (int)$this->pdo->lastInsertId();
    }

    public function scalar(string $sql, array $params = []): mixed {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $val = $stmt->fetchColumn();
        return $val === false ? null : $val;
    }
}
