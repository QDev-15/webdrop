<?php
declare(strict_types=1);

class Database {
    private static ?Database $instance = null;
    private PDO $pdo;

    private function __construct() {
        $dir = dirname(DB_FILE);
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }

        $dsn = 'sqlite:' . DB_FILE;
        $this->pdo = new PDO($dsn, null, null, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->pdo->exec('PRAGMA journal_mode = WAL');
        $this->migrate();
    }

    public static function getInstance(): Database {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    private function migrate(): void {
        $schemaPath = __DIR__ . '/../schema.sql';
        $schema = file_get_contents($schemaPath);
        if ($schema === false) {
            throw new \RuntimeException('schema.sql not found: ' . $schemaPath);
        }
        $stmts = array_filter(array_map('trim', explode(';', $schema)));
        foreach ($stmts as $stmt) {
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
        $this->seedProductCategories();
        $this->seedProducts();
        $this->seedGallery();
        $this->seedTestimonials();
        $this->seedFlavors();
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
            // general
            ['site_name',           'La Douceur Patisserie',                  'general'],
            ['site_description',    'Tiệm bánh thủ công cao cấp — làm từ tình yêu và nguyên liệu tốt nhất. Bánh kem đặt theo yêu cầu, macaron, croissant và pastry tươi mỗi ngày.', 'general'],
            ['site_logo',           '',                                        'general'],
            ['site_favicon',        '',                                        'general'],
            ['site_email',          'order@ladouceur.vn',                      'general'],
            ['site_phone',          '0901 234 567',                            'general'],
            ['site_phone_2',        '',                                        'general'],
            ['site_address',        '15 Đường Hoa Lan, Phường 2, Quận Phú Nhuận, TP. Hồ Chí Minh', 'general'],
            ['working_hours',       'Thứ 2–6: 8:00–21:00 | Thứ 7: 7:30–21:30 | CN: 8:00–20:00', 'general'],
            // seo
            ['meta_title',          'La Douceur Patisserie — Bánh Ngọt Thủ Công Cao Cấp',   'seo'],
            ['meta_description',    'Tiệm bánh thủ công cao cấp tại TP.HCM. Bánh kem sinh nhật, macaron Pháp, croissant bơ — làm tươi mỗi ngày từ nguyên liệu nhập khẩu.', 'seo'],
            ['meta_keywords',       'tiệm bánh, bánh ngọt, macaron, croissant, bánh kem sinh nhật, bánh cưới, patisserie', 'seo'],
            ['og_image',            '',                                        'seo'],
            ['google_analytics_id', '',                                        'seo'],
            // social
            ['social_facebook',     'https://facebook.com/',                   'social'],
            ['social_youtube',      '',                                        'social'],
            ['social_instagram',    'https://instagram.com/',                  'social'],
            ['social_tiktok',       '',                                        'social'],
            ['social_zalo',         'https://zalo.me/0901234567',              'social'],
            // design
            ['primary_color',       '#db2777',                                 'design'],
            ['secondary_color',     '#ec4899',                                 'design'],
            // footer
            ['footer_copyright',    '© 2026 La Douceur Patisserie · Handcrafted with love 💕', 'footer'],
            ['footer_description',  'Bánh thủ công cao cấp — làm từ tình yêu và nguyên liệu tốt nhất.', 'footer'],
            ['footer_show_social',  '1',                                       'footer'],
            // contact
            ['contact_form_enabled',   '1',                                    'contact'],
            ['contact_email_receiver', 'order@ladouceur.vn',                   'contact'],
            ['google_map_embed',       '',                                     'contact'],
            // smtp
            ['smtp_host',          'smtp.gmail.com',                           'smtp'],
            ['smtp_port',          '587',                                      'smtp'],
            ['smtp_user',          '',                                         'smtp'],
            ['smtp_password',      '',                                         'smtp'],
            ['smtp_from_name',     'La Douceur Patisserie',                    'smtp'],
            ['smtp_from_email',    'order@ladouceur.vn',                       'smtp'],
            // system
            ['maintenance_mode',    '0',                                       'system'],
            ['maintenance_message', 'Website đang bảo trì. Vui lòng quay lại sau.', 'system'],
            // about
            ['about_title',         'Làm từ tình yêu & niềm đam mê',          'about'],
            ['about_content',       'La Douceur được thành lập năm 2018 bởi Chef Lan Anh — người đã học làm bánh tại Paris và mang những công thức tinh tế về Việt Nam. Chúng tôi tin rằng mỗi chiếc bánh không chỉ là thức ăn — mà là kỷ niệm, là cảm xúc, là tình yêu. Vì vậy mỗi ngày chúng tôi đều làm bánh như lần đầu tiên.', 'about'],
            ['about_image',         'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80&auto=format&fit=crop', 'about'],
            ['about_tagline',       'Tiệm bánh thủ công từ 2018',             'about'],
            ['about_stat_years',    '6+',                                      'about'],
            ['about_stat_products', '200+',                                    'about'],
            ['about_stat_orders',   '3K+',                                     'about'],
            // order (bakery custom order)
            ['order_enabled',       '1',                                       'order'],
            ['order_min_days',      '3',                                       'order'],
            ['order_note',          'Đặt trước tối thiểu 3–5 ngày với bánh thường; 7–14 ngày với bánh cưới nhiều tầng.', 'order'],
            ['delivery_enabled',    '1',                                       'order'],
            ['delivery_radius',     '10',                                      'order'],
            // cloudinary
            ['cloudinary_cloud_name',    '',                                   'cloudinary'],
            ['cloudinary_api_key',       '',                                   'cloudinary'],
            ['cloudinary_api_secret',    '',                                   'cloudinary'],
            ['cloudinary_upload_folder', 'tiem-banh-ngot',                    'cloudinary'],
            // integrations
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];
        $stmt = $this->pdo->prepare("INSERT OR IGNORE INTO settings (key, value, \"group\") VALUES (?, ?, ?)");
        foreach ($settings as $s) {
            $stmt->execute($s);
        }
    }

    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        $slides = [
            [
                'Ngọt ngào từng khoảnh khắc',
                'Mỗi chiếc bánh là một tác phẩm nghệ thuật — được làm từ nguyên liệu cao cấp, công thức Pháp, và tình yêu của người thợ làm bánh.',
                'Xem sản phẩm',
                '/san-pham',
                'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1400&q=60&auto=format&fit=crop',
                1,
            ],
            [
                'Bánh kem theo yêu cầu của bạn',
                'Sinh nhật, đám cưới, kỷ niệm — chúng tôi tạo ra chiếc bánh hoàn hảo cho khoảnh khắc đặc biệt của bạn.',
                'Đặt bánh ngay',
                '/dat-hang',
                'https://images.unsplash.com/photo-1465014925804-7b9ede58d0d7?w=1400&q=60&auto=format&fit=crop',
                2,
            ],
            [
                'Macaron Pháp — 12 hương vị',
                'Vỏ hạnh nhân giòn nhẹ, nhân ganache béo mịn — 12 hương vị theo mùa. Đóng gói đẹp, lý tưởng làm quà tặng.',
                'Xem sản phẩm',
                '/san-pham',
                'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1400&q=60&auto=format&fit=crop',
                3,
            ],
        ];
        foreach ($slides as $s) {
            $this->execute(
                "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                $s
            );
        }
    }

    private function seedProductCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM product_categories") > 0) return;
        $cats = [
            ['Bánh Kem', 'banh-kem', 'Bánh kem sinh nhật, bánh cưới và bánh kem theo yêu cầu', '🎂', null, 1],
            ['Macaron', 'macaron', 'Macaron Pháp chuẩn vị với nhiều hương vị theo mùa', '🌸', null, 2],
            ['Croissant & Pastry', 'croissant-pastry', 'Croissant bơ AOP Pháp, pain au chocolat và các loại viennoiserie', '🥐', null, 3],
            ['Tart & Muffin', 'tart-muffin', 'Tart trái cây tươi, muffin artisan và cupcake', '🍰', null, 4],
            ['Đặc Biệt Theo Mùa', 'dac-biet', 'Sản phẩm đặc biệt theo mùa và dịp lễ', '✨', null, 5],
        ];
        foreach ($cats as $c) {
            $this->execute(
                "INSERT INTO product_categories (name, slug, description, icon, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                $c
            );
        }
    }

    private function seedProducts(): void {
        if ($this->scalar("SELECT COUNT(*) FROM products") > 0) return;

        $catIds = [];
        $cats = $this->query("SELECT id, slug FROM product_categories");
        foreach ($cats as $c) {
            $catIds[$c['slug']] = $c['id'];
        }

        $items = [
            // Bánh kem
            [$catIds['banh-kem'] ?? null, 'Bánh Kem Vani Pháp', 'banh-kem-vani-phap', 'Bông lan vani, kem bơ Swiss meringue, trang trí hoa kem nghệ thuật.', 350000, 'từ 350.000đ', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80&auto=format&fit=crop', 'bestseller', 1, 1],
            [$catIds['banh-kem'] ?? null, 'Bánh Kem Matcha Dâu', 'banh-kem-matcha-dau', 'Matcha Uji, mousse dâu tươi, mirror glaze gradient xanh-hồng.', 420000, 'từ 420.000đ', 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80&auto=format&fit=crop', 'new', 1, 2],
            [$catIds['banh-kem'] ?? null, 'Bánh Kem Chocolate Bỉ', 'banh-kem-chocolate-bi', 'Sponge chocolate đậm, ganache 70% Valrhona, trang trí chocolate shard.', 380000, 'từ 380.000đ', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80&auto=format&fit=crop', 'bestseller', 1, 3],
            [$catIds['banh-kem'] ?? null, 'Bánh Kem Theo Yêu Cầu', 'banh-kem-theo-yeu-cau', 'Thiết kế hoàn toàn theo ý bạn — hình dạng, màu sắc, hương vị tự chọn.', 0, 'Liên hệ báo giá', 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&q=80&auto=format&fit=crop', 'custom', 0, 4],
            // Macaron
            [$catIds['macaron'] ?? null, 'Macaron Hộp Hỗn Hợp 12', 'macaron-hop-hon-hop-12', '12 cái, 6 hương vị theo mùa: dâu, vani, caramel mặn, matcha, chocolate, chanh leo.', 280000, '280.000đ/hộp', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&q=80&auto=format&fit=crop', 'bestseller', 1, 5],
            [$catIds['macaron'] ?? null, 'Macaron Đơn Lẻ', 'macaron-don-le', 'Chọn hương vị yêu thích từ menu 12 hương vị. Tối thiểu 4 cái.', 45000, '45.000đ/cái', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80&auto=format&fit=crop', 'new', 0, 6],
            // Croissant & Pastry
            [$catIds['croissant-pastry'] ?? null, 'Croissant Bơ AOP', 'croissant-bo-aop', '27 lớp bột mỏng, bơ Pháp AOP, nướng mỗi sáng — giòn xốp không thể chối từ.', 38000, '38.000đ/cái', 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80&auto=format&fit=crop', 'bestseller', 1, 7],
            [$catIds['croissant-pastry'] ?? null, 'Pain au Chocolat', 'pain-au-chocolat', 'Vỏ giòn, nhân 2 thanh chocolate Valrhona — ăn nóng với cà phê sáng.', 42000, '42.000đ/cái', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80&auto=format&fit=crop', 'new', 0, 8],
            // Tart & Muffin
            [$catIds['tart-muffin'] ?? null, 'Tart Trái Cây Tươi', 'tart-trai-cay-tuoi', 'Vỏ tart giòn tan, custard vani, trang trí trái cây tươi nhập khẩu đẹp mắt.', 120000, '120.000đ', 'https://images.unsplash.com/photo-1465014925804-7b9ede58d0d7?w=500&q=80&auto=format&fit=crop', 'bestseller', 1, 9],
            [$catIds['tart-muffin'] ?? null, 'Cupcake Artisan', 'cupcake-artisan', 'Cupcake mini với kem bơ Swiss meringue, trang trí edible flower tươi.', 55000, '55.000đ/cái', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80&auto=format&fit=crop', 'bestseller', 0, 10],
            // Đặc biệt
            [$catIds['dac-biet'] ?? null, 'Bánh Mousse Matcha', 'banh-mousse-matcha', 'Mousse matcha Nhật Bản, thạch đào đỏ, đế bánh hạnh nhân — thanh mát dịu.', 185000, '185.000đ', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80&auto=format&fit=crop', 'new', 1, 11],
        ];

        foreach ($items as $item) {
            $this->execute(
                "INSERT INTO products (category_id, name, slug, description, price, price_note, image, tag, featured, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')",
                $item
            );
        }
    }

    private function seedGallery(): void {
        if ($this->scalar("SELECT COUNT(*) FROM gallery_items") > 0) return;
        $items = [
            ['Bánh kem đặc biệt', 'Bánh kem sinh nhật nhiều tầng, trang trí hoa tươi', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=80&auto=format&fit=crop', 'banh-kem', 1],
            ['Macaron đầy màu sắc', 'Bộ sưu tập macaron 12 hương vị theo mùa', 'https://images.unsplash.com/photo-1465014925804-7b9ede58d0d7?w=400&q=80&auto=format&fit=crop', 'macaron', 2],
            ['Tart trái cây tươi', 'Tart vỏ giòn với custard vani và trái cây nhập khẩu', 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&q=80&auto=format&fit=crop', 'tart', 3],
            ['Pastry thơm ngon', 'Pain au chocolat nướng nóng giòn', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format&fit=crop', 'pastry', 4],
            ['Croissant bơ Pháp', 'Croissant AOP nướng mỗi sáng — 27 lớp bột giòn xốp', 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=700&q=80&auto=format&fit=crop', 'croissant', 5],
        ];
        foreach ($items as $i) {
            $this->execute(
                "INSERT INTO gallery_items (title, description, image, category, sort_order) VALUES (?, ?, ?, ?, ?)",
                $i
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $items = [
            ['Nguyễn Thị Lan', 'Khách hàng thường xuyên · Hà Nội', '', '"Bánh kem sinh nhật cho con gái tôi đẹp hơn cả mong đợi! Kem tươi ngon, trang trí tinh tế. Gia đình ai cũng khen. Sẽ đặt lại cho năm sau!"', 5, '💖', 1],
            ['Trần Minh Châu', 'Food Blogger · TP.HCM', '', '"Macaron ở đây ngon nhất tôi từng ăn ở Việt Nam. Vỏ giòn, nhân mịn, hương vị đậm. Giao hàng đúng giờ, đóng gói rất đẹp. Strongly recommend!"', 5, '🎂', 2],
            ['Phạm Hương Giang', 'Cô dâu · Đà Nẵng', '', '"Đặt bánh cưới tại đây — tất cả khách mời đều ấn tượng. Thiết kế theo đúng yêu cầu, giao trước giờ tiệc 2 tiếng. Dịch vụ chuyên nghiệp, tận tâm."', 5, '🌸', 3],
        ];
        foreach ($items as $i) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, emoji, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
                $i
            );
        }
    }

    private function seedFlavors(): void {
        if ($this->scalar("SELECT COUNT(*) FROM flavors") > 0) return;
        $flavors = [
            ['Dâu tây & Hoa hồng', '🌸', 'Vị nhẹ nhàng, ngọt dịu, floral', 'Nhẹ nhàng,Ngọt dịu,Floral', '#fce7f3', 1],
            ['Matcha Uji Nhật Bản', '🍵', 'Đắng nhẹ, thanh mát, umami', 'Đắng nhẹ,Thanh mát,Umami', '#dcfce7', 2],
            ['Cà phê & Caramel mặn', '☕', 'Đậm đà, caramel, bold', 'Đậm đà,Caramel,Bold', '#fff7ed', 3],
            ['Chanh leo & Vani Pháp', '🍋', 'Chua nhẹ, tươi mát, tropical', 'Chua nhẹ,Tươi mát,Tropical', '#f0fdf4', 4],
            ['Chocolate Bỉ 70%', '🍫', 'Đậm sô cô la, intense, rich', 'Đậm sô cô la,Intense,Rich', '#fef9c3', 5],
            ['Việt quất & Cream cheese', '🫐', 'Chua ngọt, tangy, creamy', 'Chua ngọt,Tangy,Creamy', '#fdf4ff', 6],
        ];
        foreach ($flavors as $f) {
            $this->execute(
                "INSERT INTO flavors (name, icon, description, tags, bg_color, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                $f
            );
        }
    }

    // ── Query helpers ─────────────────────────────────────────────────────────

    public function query(string $sql, array $params = []): array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): array|false {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetch();
    }

    public function execute(string $sql, array $params = []): int|string {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $this->pdo->lastInsertId();
    }

    public function scalar(string $sql, array $params = []): mixed {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchColumn();
    }

    public function getPdo(): PDO {
        return $this->pdo;
    }
}
