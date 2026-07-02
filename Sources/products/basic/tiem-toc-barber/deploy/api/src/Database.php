<?php
declare(strict_types=1);

class Database {
    private static ?PDO $pdo = null;

    public function __construct() {
        self::connect();
    }

    private static function connect(): void {
        if (self::$pdo !== null) return;

        $dbDir = dirname(DB_FILE);
        if (!is_dir($dbDir)) {
            if (!@mkdir($dbDir, 0755, true) && !is_dir($dbDir)) {
                throw new \RuntimeException('Không thể tạo thư mục database: ' . $dbDir);
            }
        }

        $needsMigrate = !file_exists(DB_FILE);

        self::$pdo = new PDO('sqlite:' . DB_FILE, null, null, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        self::$pdo->exec('PRAGMA foreign_keys = ON');
        self::$pdo->exec('PRAGMA journal_mode = WAL');

        if ($needsMigrate) {
            self::migrate();
        }
    }

    private static function migrate(): void {
        $sqlFile = __DIR__ . '/../schema.sql';
        $sql = file_get_contents($sqlFile);
        if ($sql === false) {
            throw new \RuntimeException('Cannot read schema.sql');
        }
        // Strip comments TRƯỚC khi split — tránh filter loại bỏ CREATE TABLE sau comment block
        $sql = preg_replace('/^\s*--.*$/m', '', $sql);
        $statements = array_filter(array_map('trim', explode(';', $sql)), fn($s) => $s !== '');
        foreach ($statements as $stmt) {
            self::$pdo->exec($stmt . ';');
        }

        self::seedData();
    }

    private static function seedData(): void {
        self::seedUsers();
        self::seedSettings();
        self::seedHeroSlides();
        self::seedServiceCategoriesAndServices();
        self::seedTeam();
        self::seedTestimonials();
        self::seedGallery();
    }

    private static function seedUsers(): void {
        $count = self::$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
        if ($count > 0) return;
        $hash = password_hash('123456', PASSWORD_DEFAULT);
        $stmt = self::$pdo->prepare(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
        );
        $stmt->execute(['Admin', 'sysadmin@admin.com', $hash, 'superadmin']);
    }

    private static function seedSettings(): void {
        $count = self::$pdo->query("SELECT COUNT(*) FROM settings")->fetchColumn();
        if ($count > 0) return;

        $rows = [
            // general
            ['site_name',        'Tiệm Tóc Barber',            'general'],
            ['site_tagline',     'Premium Barber Shop',          'general'],
            ['site_phone',       '0901 234 567',                 'general'],
            ['site_email',       'hello@tiemtoc.vn',             'general'],
            ['site_address',     'Số nhà, Tên đường, Phường, Quận, TP', 'general'],
            ['working_hours',    'Thứ 2 – Thứ 6: 8:00 – 20:00 | Thứ 7: 8:00 – 21:00 | Chủ nhật: 9:00 – 19:00', 'general'],
            ['working_hours_1',  'Thứ 2 – Thứ 6: 8:00 – 20:00',  'general'],
            ['working_hours_2',  'Thứ 7: 8:00 – 21:00',          'general'],
            ['working_hours_3',  'Chủ nhật: 9:00 – 19:00',       'general'],
            ['zalo_number',      '0901234567',                   'general'],
            // stat bar
            ['stat_customers',      '3000',  'general'],
            ['stat_years',          '8',     'general'],
            ['stat_stylists',       '5',     'general'],
            ['stat_satisfaction',   '98',    'general'],
            // hero
            ['hero_badge',       'Premium Barber Shop', 'general'],
            ['hero_title_1',     'PHONG CÁCH',           'general'],
            ['hero_title_em',    '& Đẳng cấp',           'general'],
            ['hero_subtitle',    'Nơi mỗi nhát kéo là một nghệ thuật. Chúng tôi mang đến trải nghiệm cắt tóc cao cấp theo phong cách barber Mỹ — chỉnh chu từng chi tiết, tôn vinh cá tính của bạn.', 'general'],
            ['hero_image',       'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&q=80&auto=format&fit=crop', 'general'],
            // booking policy
            ['booking_confirm_note', 'Chúng tôi xác nhận lịch hẹn qua Zalo trong vòng 15 phút. Hủy lịch miễn phí trước 2 tiếng.', 'booking'],
            ['booking_promo_code',   'NEWCUT', 'booking'],
            ['booking_promo_percent','15', 'booking'],
            ['booking_promo_desc',   'Giảm 15% cho lần đặt lịch đầu tiên. Nhập code NEWCUT trong phần ghi chú. Áp dụng cho dịch vụ từ 150.000đ trở lên.', 'booking'],
            // social
            ['facebook_url',  '', 'social'],
            ['instagram_url', '', 'social'],
            ['tiktok_url',    '', 'social'],
            ['zalo_url',      '', 'social'],
            // seo
            ['meta_title',       'Tiệm Tóc Barber — Barber Shop & Hair Salon', 'seo'],
            ['meta_description', 'Tiệm tóc phong cách, chuyên nghiệp. Cắt tóc, uốn nhuộm, cạo râu theo phong cách Mỹ/châu Âu.', 'seo'],
            // footer
            ['footer_tagline', 'Tiệm tóc phong cách barber Mỹ — nơi kỹ thuật gặp nghệ thuật. Đặt lịch hôm nay để trải nghiệm sự khác biệt.', 'footer'],
            // contact page
            ['map_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4607!2d106.6916!3d10.7753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzMxLjEiTiAxMDbCsDQxJzMwLjAiRQ!5e0!3m2!1svi!2svn!4v1234567890', 'contact'],
            ['map_embed_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4607!2d106.6916!3d10.7753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzMxLjEiTiAxMDbCsDQxJzMwLjAiRQ!5e0!3m2!1svi!2svn!4v1234567890', 'contact'],
            // smtp
            ['smtp_host', 'smtp.gmail.com', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            // system
            ['unsplash_access_key',   'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integration'],
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key',    '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
        ];

        $stmt = self::$pdo->prepare('INSERT OR IGNORE INTO settings (key, value, "group") VALUES (?, ?, ?)');
        foreach ($rows as [$k, $v, $g]) {
            $stmt->execute([$k, $v, $g]);
        }
    }

    private static function seedHeroSlides(): void {
        $count = self::$pdo->query("SELECT COUNT(*) FROM hero_slides")->fetchColumn();
        if ($count > 0) return;

        $stmt = self::$pdo->prepare(
            "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, 'published')"
        );
        $stmt->execute([
            'PHONG CÁCH & Đẳng cấp',
            'Nơi mỗi nhát kéo là một nghệ thuật. Chúng tôi mang đến trải nghiệm cắt tóc cao cấp theo phong cách barber Mỹ.',
            'Đặt lịch ngay', '/dat-lich',
            'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&q=80&auto=format&fit=crop',
            1,
        ]);
    }

    private static function seedServiceCategoriesAndServices(): void {
        $count = self::$pdo->query("SELECT COUNT(*) FROM service_categories")->fetchColumn();
        if ($count > 0) return;

        $catStmt = self::$pdo->prepare(
            "INSERT INTO service_categories (name, slug, icon, tag, sort_order) VALUES (?, ?, ?, ?, ?)"
        );
        $categories = [
            ['Cắt & Tạo kiểu Nam',        'cat-tao-kieu-nam',   '✂', 'Tóc Nam', 1],
            ['Cắt & Tạo kiểu Nữ',         'cat-tao-kieu-nu',    '✂', 'Tóc Nữ',  2],
            ['Cạo râu & Chăm sóc râu',    'cao-rau-cham-soc',   '🪒', 'Barber', 3],
            ['Uốn tóc',                   'uon-toc',            '💈', 'Hóa học', 4],
            ['Nhuộm tóc',                 'nhuom-toc',          '🎨', 'Hóa học', 5],
            ['Duỗi / Thẳng tóc',          'duoi-thang-toc',     '〰', 'Hóa học', 6],
            ['Chăm sóc & Dưỡng tóc',      'cham-soc-duong-toc', '✨', 'Chăm sóc', 7],
        ];
        $catIds = [];
        foreach ($categories as $c) {
            $catStmt->execute($c);
            $catIds[$c[1]] = (int) self::$pdo->lastInsertId();
        }

        $svcStmt = self::$pdo->prepare(
            "INSERT INTO services (category_id, name, note, description, price_text, image, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );

        // Featured services (hiển thị trang chủ) + đầy đủ bảng giá (trang dịch vụ)
        // Format mỗi dòng: [category_slug, name, note, description, price_text, image, is_featured, sort_order]
        $services = [
            // Cắt & Tạo kiểu Nam
            ['cat-tao-kieu-nam', 'Cắt tóc cơ bản', 'Wash + cắt + sấy', 'Cắt tạo kiểu, fade, undercut — chỉnh chu từng đường kéo theo khuôn mặt.', '100.000đ', 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80&auto=format&fit=crop', 1, 1],
            ['cat-tao-kieu-nam', 'Cắt + Tạo kiểu', 'Wash + cắt + wax/pomade tạo kiểu', '', '150.000đ', '', 0, 2],
            ['cat-tao-kieu-nam', 'Fade / Taper', 'Kỹ thuật fade chuyên sâu', '', '180.000đ', '', 0, 3],
            ['cat-tao-kieu-nam', 'Cắt + Fade + Cạo viền', 'Gói hoàn chỉnh cho nam', '', '250.000đ', '', 0, 4],
            ['cat-tao-kieu-nam', 'Undercut / Two-block', 'Phần trên để dài, phần dưới cạo ngắn', '', '200.000đ', '', 0, 5],

            // Cắt & Tạo kiểu Nữ
            ['cat-tao-kieu-nu', 'Cắt tóc nữ', '', 'Cắt layer, bob, tỉa tóc — phù hợp với từng khuôn mặt và phong cách.', '150.000đ', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80&auto=format&fit=crop', 1, 1],
            ['cat-tao-kieu-nu', 'Cắt tỉa đuôi', 'Giữ kiểu, tỉa nhẹ', '', '80.000đ', '', 0, 2],
            ['cat-tao-kieu-nu', 'Cắt layer / bob', 'Wash + cắt + sấy thẳng', '', '150.000đ', '', 0, 3],
            ['cat-tao-kieu-nu', 'Cắt + Tạo kiểu', 'Sấy tạo kiểu, uốn cúp đuôi', '', '200.000đ', '', 0, 4],
            ['cat-tao-kieu-nu', 'Gội đầu massage', 'Gội + massage da đầu + sấy', '', '100.000đ', '', 0, 5],
            ['cat-tao-kieu-nu', 'Bới tóc / Tết tóc', 'Tùy độ phức tạp', '', '150.000đ–350.000đ', '', 0, 6],

            // Cạo râu & Chăm sóc râu (Barber)
            ['cao-rau-cham-soc', 'Cạo Râu Hot Towel', 'Khăn nóng + dao thẳng + dưỡng da', 'Cạo râu truyền thống với dao thẳng, khăn nóng — trải nghiệm barber đích thực.', '120.000đ', 'https://plus.unsplash.com/premium_photo-1679430887821-ddbcff722424?w=600&q=80&auto=format&fit=crop', 1, 1],
            ['cao-rau-cham-soc', 'Cạo râu máy', 'Sửa râu, tạo đường viền', '', '60.000đ', '', 0, 2],
            ['cao-rau-cham-soc', 'Tạo kiểu râu', 'Cắt tỉa, định hình râu', '', '80.000đ', '', 0, 3],
            ['cao-rau-cham-soc', 'Combo: Cắt tóc + Cạo râu', 'Gói hoàn chỉnh cho quý ông', '', '280.000đ', '', 0, 4],

            // Uốn / Nhuộm / Duỗi (featured card gộp)
            ['uon-toc', 'Uốn / Nhuộm / Duỗi', 'Sản phẩm cao cấp, bảo vệ tóc', 'Sử dụng sản phẩm cao cấp, bảo vệ tóc và cho màu bền đẹp theo thời gian.', '500.000đ', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80&auto=format&fit=crop', 1, 1],
            ['uon-toc', 'Uốn xoăn thường', 'Tóc ngắn / trung bình', '', '350.000đ–550.000đ', '', 0, 2],
            ['uon-toc', 'Uốn xoăn tóc dài', 'Tùy độ dài và dày', '', '550.000đ–850.000đ', '', 0, 3],
            ['uon-toc', 'Uốn gốc tạo phồng', 'Phù hợp tóc mỏng, xẹp', '', '400.000đ–600.000đ', '', 0, 4],
            ['uon-toc', 'Uốn digital perm', 'Máy nhiệt chuyên dụng, xoăn tự nhiên', '', '700.000đ–1.200.000đ', '', 0, 5],

            // Nhuộm tóc
            ['nhuom-toc', 'Nhuộm màu đồng đều', 'Toàn đầu, không tẩy', '', '300.000đ–500.000đ', '', 0, 1],
            ['nhuom-toc', 'Nhuộm highlight', 'Sợi highlight nổi bật', '', '600.000đ–1.000.000đ', '', 0, 2],
            ['nhuom-toc', 'Balayage / Ombre', 'Màu chuyển tự nhiên, trendy', '', '800.000đ–1.500.000đ', '', 0, 3],
            ['nhuom-toc', 'Tẩy + Nhuộm màu pastel', 'Tùy tình trạng tóc', '', '1.200.000đ–2.500.000đ', '', 0, 4],

            // Duỗi / Thẳng tóc
            ['duoi-thang-toc', 'Duỗi nhiệt thường', 'Tóc ngắn / trung bình', '', '400.000đ–650.000đ', '', 0, 1],
            ['duoi-thang-toc', 'Duỗi tóc dài', 'Tùy độ dài, dày', '', '650.000đ–1.000.000đ', '', 0, 2],
            ['duoi-thang-toc', 'Keratin / Phục hồi thẳng', 'Dưỡng chất keratin, thẳng bền 4–6 tháng', '', '1.000.000đ–1.800.000đ', '', 0, 3],

            // Chăm sóc & Dưỡng tóc
            ['cham-soc-duong-toc', 'Ủ dầu dưỡng ẩm', 'Mask dưỡng ẩm chuyên sâu', '', '150.000đ–250.000đ', '', 0, 1],
            ['cham-soc-duong-toc', 'Phục hồi hư tổn', 'Liệu trình protein tóc', '', '300.000đ–500.000đ', '', 0, 2],
            ['cham-soc-duong-toc', 'Massage da đầu', 'Kích thích tuần hoàn, giảm rụng tóc', '', '120.000đ', '', 0, 3],
            ['cham-soc-duong-toc', 'Liệu trình tóc 3 buổi', 'Tiết kiệm 20% so với lẻ', '', '750.000đ', '', 0, 4],
        ];

        foreach ($services as $s) {
            [$catSlug, $name, $note, $desc, $price, $img, $featured, $sort] = $s;
            $svcStmt->execute([$catIds[$catSlug], $name, $note, $desc, $price, $img, $featured, $sort]);
        }
    }

    private static function seedTeam(): void {
        $count = self::$pdo->query("SELECT COUNT(*) FROM team")->fetchColumn();
        if ($count > 0) return;

        $stmt = self::$pdo->prepare(
            "INSERT INTO team (name, role, specialty, image, sort_order) VALUES (?, ?, ?, ?, ?)"
        );
        $team = [
            ['Nguyễn Minh Tuấn', 'Master Barber',    'Chuyên cắt fade, taper. 8 năm kinh nghiệm tại Mỹ & Việt Nam.', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80&auto=format&fit=crop', 1],
            ['Trần Hùng',        'Senior Stylist',   'Chuyên về uốn xoăn, nhuộm highlight, balayage.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop', 2],
            ['Lê Thảo',          'Color Specialist', 'Chuyên nhuộm màu, tẩy tóc, tóc nữ tạo kiểu.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80&auto=format&fit=crop', 3],
            ['Phạm Thị Lan',     'Junior Stylist',   'Cắt tóc nữ layer, dưỡng tóc, gội đầu massage thư giãn.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80&auto=format&fit=crop', 4],
        ];
        foreach ($team as $t) $stmt->execute($t);
    }

    private static function seedTestimonials(): void {
        $count = self::$pdo->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
        if ($count > 0) return;

        $stmt = self::$pdo->prepare(
            "INSERT INTO testimonials (customer_name, avatar, meta, rating, content, sort_order) VALUES (?, ?, ?, ?, ?, ?)"
        );
        $items = [
            ['Nguyễn Văn A', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&auto=format&fit=crop', 'Khách thường xuyên · 2 năm', 5,
             'Tìm được tiệm tóc ưng ý ở Việt Nam không dễ, nhưng ở đây tôi hoàn toàn hài lòng. Anh Tuấn cắt fade chuẩn như ở Mỹ, rất hiểu ý khách.', 1],
            ['Trần Thị B', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop', 'Google Reviews', 5,
             'Nhuộm tóc highlight xong đẹp hơn mình nghĩ rất nhiều. Chị Lan tư vấn màu rất nhiệt tình và chuyên nghiệp. Sẽ quay lại!', 2],
            ['Lê Minh C', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop', 'Facebook Review', 5,
             'Cạo râu hot towel lần đầu tiên trong đời — cảm giác thư giãn không tả được. Không gian tiệm thoải mái, nhạc hay, nhân viên vui vẻ.', 3],
        ];
        foreach ($items as $i) $stmt->execute($i);
    }

    private static function seedGallery(): void {
        $count = self::$pdo->query("SELECT COUNT(*) FROM gallery_items")->fetchColumn();
        if ($count > 0) return;

        $stmt = self::$pdo->prepare(
            "INSERT INTO gallery_items (image, alt_text, sort_order) VALUES (?, ?, ?)"
        );
        $items = [
            ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80&auto=format&fit=crop', 'Cắt tóc fade', 1],
            ['https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80&auto=format&fit=crop', 'Kiểu tóc nam đẹp', 2],
            ['https://images.unsplash.com/photo-1609675194742-63fd5c7aafbc?w=400&q=80&auto=format&fit=crop', 'Barber shop không gian', 3],
            ['https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&q=80&auto=format&fit=crop', 'Tóc nữ đẹp', 4],
            ['https://images.unsplash.com/photo-1500840216050-6ffa99d75160?w=400&q=80&auto=format&fit=crop', 'Nhuộm tóc màu đẹp', 5],
        ];
        foreach ($items as $i) $stmt->execute($i);
    }

    public function query(string $sql, array $params = []): array {
        $stmt = self::$pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $stmt = self::$pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function execute(string $sql, array $params = []): int {
        $stmt = self::$pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount();
    }

    public function lastInsertId(): int {
        return (int) self::$pdo->lastInsertId();
    }
}
