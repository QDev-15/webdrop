<?php
declare(strict_types=1);

class Database {
    private static ?Database $instance = null;
    private PDO $pdo;

    private function __construct() {
        $type = defined('DB_TYPE') ? DB_TYPE : 'sqlite';

        if ($type === 'sqlite') {
            $dir = dirname(DB_FILE);
            if (!is_dir($dir)) { @mkdir($dir, 0755, true); }
            $this->pdo = new PDO('sqlite:' . DB_FILE);
            $this->pdo->exec('PRAGMA foreign_keys = ON');
            $this->pdo->exec('PRAGMA journal_mode = WAL');
        } else {
            $dsn = $type . ':host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS);
        }

        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        $this->migrate();
    }

    public static function getInstance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getPdo(): PDO { return $this->pdo; }

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

    public function count(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    // ─── Migration ────────────────────────────────────────────────────────────

    private function migrate(): void {
        $schemaFile = __DIR__ . '/../schema.sql';
        $sql = file_get_contents($schemaFile);
        if ($sql === false) {
            throw new RuntimeException('Khong doc duoc schema.sql — kiem tra file co ton tai khong.');
        }
        $this->pdo->exec($sql);
        $this->seedData();
    }

    // ─── Seed Orchestrator ────────────────────────────────────────────────────

    private function seedData(): void {
        $this->seedUsers();
        $this->seedSettings();
        $this->seedHeroSlides();
        $this->seedServiceCategories();
        $this->seedServices();
        $this->seedTeamMembers();
        $this->seedTestimonials();
        $this->seedGallery();
        $this->seedPromoCombos();
    }

    // ─── Seed Users ───────────────────────────────────────────────────────────

    private function seedUsers(): void {
        if ($this->count('SELECT COUNT(*) FROM users') > 0) return;
        $hash = password_hash('123456', PASSWORD_BCRYPT);
        $this->execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Administrator', 'sysadmin@admin.com', $hash, 'superadmin']
        );
    }

    // ─── Seed Settings ────────────────────────────────────────────────────────

    private function seedSettings(): void {
        if ($this->count('SELECT COUNT(*) FROM settings') > 0) return;

        $rows = [
            // general
            ['site_name',        'Glow Beauty Studio',                              'general'],
            ['site_tagline',     'Tóc · Nail · Makeup · Skincare chuyên nghiệp',   'general'],
            ['site_email',       'hello@glowbeautystudio.vn',                       'general'],
            ['site_phone',       '0901 234 567',                                    'general'],
            ['site_address',     '123 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP. HCM', 'general'],
            ['working_hours',    'Thứ 2 – Chủ Nhật: 8:30 – 20:30',                'general'],
            ['founded_year',     '2019',                                             'general'],
            ['city',             'TP. Hồ Chí Minh',                                'general'],
            // seo
            ['meta_title',       'Glow Beauty Studio — Tóc, Nail, Makeup, Skincare tại TP.HCM', 'seo'],
            ['meta_description', 'Beauty Studio tổng hợp: Tóc, Nail, Makeup, Skincare chuyên nghiệp. Phong cách trendy, Instagram-worthy tại TP. Hồ Chí Minh.', 'seo'],
            // social
            ['facebook',         'https://facebook.com/glowbeautystudio',           'social'],
            ['instagram',        'https://instagram.com/glowbeautystudio',          'social'],
            ['tiktok',           'https://tiktok.com/@glowbeautystudio',            'social'],
            ['youtube',          '',                                                 'social'],
            ['zalo',             'https://zalo.me/0901234567',                      'social'],
            // footer
            ['footer_tagline',   'Beauty Studio tổng hợp — Tóc, Nail, Makeup, Skincare chuyên nghiệp tại TP. Hồ Chí Minh.', 'footer'],
            ['footer_copyright', '© 2024 Glow Beauty Studio. All rights reserved.', 'footer'],
            // contact
            ['map_embed',        '',                                                 'contact'],
            ['map_url',          'https://maps.google.com/?q=123+Nguyen+Thi+Minh+Khai+HCM', 'contact'],
            ['hotline_2',        '0901 234 568',                                    'contact'],
            // smtp
            ['smtp_host',        '',                                                 'smtp'],
            ['smtp_port',        '587',                                              'smtp'],
            ['smtp_user',        '',                                                 'smtp'],
            ['smtp_pass',        '',                                                 'smtp'],
            ['smtp_from_name',   'Glow Beauty Studio',                              'smtp'],
            ['smtp_from_email',  'hello@glowbeautystudio.vn',                       'smtp'],
            // system
            ['maintenance_mode', '0',                                               'system'],
            ['items_per_page',   '20',                                              'system'],
            // cloudinary
            ['cloudinary_cloud_name', '',                                           'cloudinary'],
            ['cloudinary_api_key',    '',                                           'cloudinary'],
            ['cloudinary_api_secret', '',                                           'cloudinary'],
            // integrations
            ['unsplash_access_key',   'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
            // about
            ['about_title',      'Không gian làm đẹp đẳng cấp của TP.HCM',        'about'],
            ['about_description','Thành lập từ 2019, Glow Beauty Studio là điểm đến yêu thích của những ai yêu vẻ đẹp. Chúng tôi mang đến không gian hiện đại, đội ngũ chuyên nghiệp và sản phẩm cao cấp.', 'about'],
            ['about_image',      'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=700&q=80&auto=format&fit=crop', 'about'],
            ['stat_customers',   '500+',                                            'about'],
            ['stat_years',       '5+',                                              'about'],
            ['stat_stylists',    '10',                                              'about'],
            ['stat_rating',      '4.9',                                             'about'],
            // booking
            ['booking_note',     'Đặt lịch trước ít nhất 1 ngày để đảm bảo có stylist phù hợp. Dịch vụ Makeup cô dâu & Skincare chuyên sâu cần đặt trước 2–3 ngày.', 'booking'],
            ['booking_confirm_time','30',                                           'booking'],
            ['new_customer_discount','10',                                          'booking'],
        ];

        $stmt = $this->pdo->prepare('INSERT OR IGNORE INTO settings (key, value, grp) VALUES (?, ?, ?)');
        foreach ($rows as $r) {
            $stmt->execute($r);
        }
    }

    // ─── Seed Hero Slides ─────────────────────────────────────────────────────

    private function seedHeroSlides(): void {
        if ($this->count('SELECT COUNT(*) FROM hero_slides') > 0) return;
        $slides = [
            [
                'Vẻ đẹp của bạn, toả sáng.',
                'Không gian làm đẹp tổng hợp — Tóc, Nail, Makeup, Skincare. Phong cách trendy, chuyên nghiệp tại studio của chúng tôi.',
                'Đặt lịch ngay',
                '/dat-lich',
                'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1400&q=80&auto=format&fit=crop',
                1,
            ],
            [
                'Nail Art — Nghệ thuật trên đầu ngón tay',
                'Sơn gel, đắp acrylic, vẽ nail art 3D. Nghệ nhân khéo léo, bộ móng đẹp bền màu.',
                'Xem dịch vụ',
                '/dich-vu',
                'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1400&q=80&auto=format&fit=crop',
                2,
            ],
            [
                'Skincare & Facial chuyên sâu',
                'Chăm sóc da bằng công nghệ hiện đại. Làn da khoẻ đẹp từ bên trong.',
                'Đặt lịch skincare',
                '/dat-lich',
                'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1400&q=80&auto=format&fit=crop',
                3,
            ],
        ];
        $stmt = $this->pdo->prepare('INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order) VALUES (?,?,?,?,?,?)');
        foreach ($slides as $s) { $stmt->execute($s); }
    }

    // ─── Seed Service Categories ──────────────────────────────────────────────

    private function seedServiceCategories(): void {
        if ($this->count('SELECT COUNT(*) FROM service_categories') > 0) return;
        $cats = [
            ['Hair Styling', 'hair-styling', '✂', 'Đội ngũ stylist tóc nhiều năm kinh nghiệm, cập nhật xu hướng liên tục.', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80&auto=format&fit=crop', 1],
            ['Nail Art',     'nail-art',     '💅', 'Nghệ nhân nail với đôi tay khéo léo, tạo bộ móng art độc đáo.', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&auto=format&fit=crop', 2],
            ['Makeup Pro',   'makeup-pro',   '💄', 'Makeup artist giàu kinh nghiệm, phong cách đa dạng từ tự nhiên đến ấn tượng.', 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80&auto=format&fit=crop', 3],
            ['Skincare & Facial', 'skincare-facial', '✨', 'Chăm sóc da bằng công nghệ hiện đại và sản phẩm cao cấp.', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80&auto=format&fit=crop', 4],
        ];
        $stmt = $this->pdo->prepare('INSERT INTO service_categories (name,slug,icon,description,image,sort_order) VALUES (?,?,?,?,?,?)');
        foreach ($cats as $c) { $stmt->execute($c); }
    }

    // ─── Seed Services ────────────────────────────────────────────────────────

    private function seedServices(): void {
        if ($this->count('SELECT COUNT(*) FROM services') > 0) return;

        // cat IDs: hair=1, nail=2, makeup=3, skincare=4
        $services = [
            // Hair
            [1, 'Cắt tóc nữ',              'Cắt + blow dry cơ bản',                                       '150.000 – 250.000đ', '', '', 1, 1],
            [1, 'Cắt tóc nam',              'Cắt + sấy tạo kiểu',                                          '80.000 – 150.000đ',  '', '', 2, 0],
            [1, 'Nhuộm 1 màu',              'Bao gồm công + thuốc nhuộm',                                  '300.000 – 500.000đ', '', '', 3, 1],
            [1, 'Highlight / Balayage',     'Kỹ thuật sáng theo tầng',                                     '600.000 – 1.200.000đ','','',4, 1],
            [1, 'Nhuộm Fantasy Color',      'Màu cá tính: tím, xanh, hồng, bạch kim...',                   '700.000 – 1.500.000đ','','',5, 0],
            [1, 'Uốn xoăn',                'Uốn lạnh / nhiệt theo kiểu yêu cầu',                          '400.000 – 800.000đ', '', '', 6, 0],
            [1, 'Duỗi tóc',                'Duỗi thẳng / phồng chân tóc',                                 '400.000 – 900.000đ', '', '', 7, 0],
            [1, 'Phục hồi tóc hư tổn',     'Liệu trình protein + keratin + collagen',                      '250.000 – 500.000đ', '', '', 8, 0],
            // Nail
            [2, 'Sơn gel tay / chân',       'Gel màu cơ bản, bền màu 3–4 tuần',                            '80.000 – 150.000đ',  '', '', 1, 1],
            [2, 'Sơn gel + hoa / hình',     'Vẽ thêm nail art đơn giản',                                   '150.000 – 250.000đ', '', '', 2, 0],
            [2, 'Nail art 3D',              'Hoa nổi, đá đính, charm, piercing',                           '250.000 – 500.000đ', '', '', 3, 1],
            [2, 'Nail concept full set',    'Full bộ theo chủ đề (anime, floral, abstract...)',             '400.000 – 800.000đ', '', '', 4, 0],
            [2, 'Manicure cơ bản',          'Cắt, giũa, đẩy da + sơn thường',                             '80.000đ',            '', '', 5, 0],
            [2, 'Pedicure cơ bản',          'Ngâm chân, cắt, chà gót + sơn thường',                       '100.000đ',           '', '', 6, 0],
            // Makeup
            [3, 'Makeup ngày thường',       'Tự nhiên, nhẹ nhàng, tươi sáng',                              '200.000 – 300.000đ', '', '', 1, 1],
            [3, 'Makeup đi tiệc',           'Đẹp, sang trọng, bền suốt buổi tiệc',                        '300.000 – 500.000đ', '', '', 2, 0],
            [3, 'Makeup cô dâu',            'Trang điểm cô dâu chuyên nghiệp ngày cưới',                   '800.000 – 1.200.000đ','','',3, 1],
            [3, 'Makeup cô dâu + tóc',      'Trọn gói tóc + makeup đẹp',                                  '1.200.000 – 1.800.000đ','','',4, 0],
            [3, 'Nối mi classic',           'Mi tự nhiên, nhẹ nhàng',                                      '250.000 – 400.000đ', '', '', 5, 0],
            [3, 'Nối mi volume',            'Mi dày dặn, phồng đẹp',                                       '350.000 – 600.000đ', '', '', 6, 0],
            // Skincare
            [4, 'Facial cơ bản',            'Tẩy trang + rửa mặt + xông hơi + đắp mặt nạ',                '200.000 – 300.000đ', '', '', 1, 1],
            [4, 'Deep cleansing facial',    'Làm sạch sâu + nặn mụn đầu đen + mask',                      '300.000 – 450.000đ', '', '', 2, 1],
            [4, 'Facial sáng da',           'Vitamin C + niacinamide + LED ánh sáng',                      '350.000 – 550.000đ', '', '', 3, 0],
            [4, 'Điều trị mụn',             'Xử lý mụn viêm + dưỡng phục hồi + anti-bac',                 '400.000 – 700.000đ', '', '', 4, 0],
            [4, 'Laser trẻ hoá',            'Công nghệ laser làm đều màu da, se khít lỗ chân lông',        '700.000 – 1.500.000đ','','',5, 0],
            [4, 'RF Lifting',               'Nâng cơ, làm săn chắc da bằng sóng radio',                   '1.000.000 – 2.000.000đ','','',6, 0],
        ];
        $stmt = $this->pdo->prepare('INSERT INTO services (category_id,name,description,price,image,badge,sort_order,is_featured) VALUES (?,?,?,?,?,?,?,?)');
        foreach ($services as $s) { $stmt->execute($s); }
    }

    // ─── Seed Team Members ────────────────────────────────────────────────────

    private function seedTeamMembers(): void {
        if ($this->count('SELECT COUNT(*) FROM team_members') > 0) return;
        $members = [
            ['Nguyễn Hoa Linh', 'Senior Hair Stylist', '8 năm kinh nghiệm. Chuyên gia balayage, highlight và các kỹ thuật nhuộm Châu Âu.', 'https://images.unsplash.com/photo-1614528024382-90b1b3ef27e2?w=200&q=80&auto=format&fit=crop', 1],
            ['Trần Bích Thuỷ',  'Nail Art Specialist',  '6 năm kinh nghiệm. Chuyên nail art 3D, gel extension, thiết kế độc đáo theo yêu cầu.', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80&auto=format&fit=crop', 2],
            ['Lê Minh Châu',    'Makeup Artist',         '5 năm kinh nghiệm. Chuyên trang điểm cô dâu, sự kiện, concept editorial & commercial.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80&auto=format&fit=crop', 3],
            ['Phạm Thu Hằng',   'Skincare Therapist',    '7 năm kinh nghiệm. Chuyên điều trị da liễu, laser, RF lifting và chăm sóc da chuyên sâu.', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80&auto=format&fit=crop', 4],
        ];
        $stmt = $this->pdo->prepare('INSERT INTO team_members (name,role,bio,avatar,sort_order) VALUES (?,?,?,?,?)');
        foreach ($members as $m) { $stmt->execute($m); }
    }

    // ─── Seed Testimonials ────────────────────────────────────────────────────

    private function seedTestimonials(): void {
        if ($this->count('SELECT COUNT(*) FROM testimonials') > 0) return;
        $items = [
            ['Nguyễn Lan Anh',  'Khách hàng thân thiết', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80&auto=format&fit=crop', 'Mình đã đi rất nhiều tiệm nhưng tóc ở đây làm đẹp nhất! Stylist tư vấn rất kỹ, màu nhuộm đúng tone da và giữ màu lâu. Sẽ quay lại!', 5, 1],
            ['Trần Mỹ Duyên',   'Khách hàng thân thiết', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80&auto=format&fit=crop', 'Nail art ở đây cực đẹp! Bạn nail vẽ rất khéo, tỉ mỉ. Gel bền và không bị tróc sớm như nhiều chỗ khác. Không gian sạch sẽ, thoải mái.', 5, 2],
            ['Lê Thuỳ Linh',    'Khách hàng thân thiết', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80&auto=format&fit=crop', 'Skincare facial ở đây thật sự hiệu quả! Da mình vốn nhiều mụn nhưng sau 3 buổi đã cải thiện rõ rệt. Kỹ thuật viên chuyên nghiệp và tận tình.', 5, 3],
        ];
        $stmt = $this->pdo->prepare('INSERT INTO testimonials (author_name,author_title,author_avatar,content,rating,sort_order) VALUES (?,?,?,?,?,?)');
        foreach ($items as $i) { $stmt->execute($i); }
    }

    // ─── Seed Gallery ─────────────────────────────────────────────────────────

    private function seedGallery(): void {
        if ($this->count('SELECT COUNT(*) FROM gallery_items') > 0) return;
        $items = [
            ['https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80&auto=format&fit=crop',  'Balayage & Highlight',      'Tóc',    1],
            ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80&auto=format&fit=crop','Nail Art Hoa 3D',           'Nail',   2],
            ['https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&q=80&auto=format&fit=crop','Ombre Nail Gel',            'Nail',   3],
            ['https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80&auto=format&fit=crop','Bridal Makeup',             'Makeup', 4],
            ['https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80&auto=format&fit=crop','Deep Cleansing Facial',     'Skincare',5],
            ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80&auto=format&fit=crop','Layer Cut Trending',        'Tóc',    6],
        ];
        $stmt = $this->pdo->prepare('INSERT INTO gallery_items (image,title,category,sort_order) VALUES (?,?,?,?)');
        foreach ($items as $i) { $stmt->execute($i); }
    }

    // ─── Seed Promo Combos ────────────────────────────────────────────────────

    private function seedPromoCombos(): void {
        if ($this->count('SELECT COUNT(*) FROM promo_combos') > 0) return;
        $combos = [
            ['Hot Deal',        'Combo Tóc + Nail',         'Cắt + nhuộm 1 màu + phục hồi protein cơ bản + sơn gel tay 10 móng. Tiết kiệm 30%.', '590.000đ', '850.000đ',   1],
            ['Best Value',      'Combo Skincare Full Day',  'Deep cleansing facial + LED light therapy + đắp mask sáng da + massage mặt thư giãn.', '450.000đ', '620.000đ',  2],
            ['Glow Up',         'Combo Glow Up Full',       'Cắt + sấy tạo kiểu + makeup tự nhiên + nail gel tay chân + facial cấp ẩm cơ bản.', '780.000đ', '1.150.000đ', 3],
            ['Bride Package',   'Gói Cô Dâu Trọn Gói',    'Makeup cô dâu chuyên nghiệp + tóc cô dâu + nail tay gel + facial nhẹ sáng da.', '1.200.000đ', '1.800.000đ', 4],
        ];
        $stmt = $this->pdo->prepare('INSERT INTO promo_combos (tag,title,description,price_new,price_old,sort_order) VALUES (?,?,?,?,?,?)');
        foreach ($combos as $c) { $stmt->execute($c); }
    }
}
