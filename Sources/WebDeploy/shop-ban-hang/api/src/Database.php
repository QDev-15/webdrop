<?php
declare(strict_types=1);

class Database {
    private static ?Database $instance = null;
    private PDO $pdo;

    private function __construct() {
        $dir = dirname(DB_FILE);
        if (!is_dir($dir)) { @mkdir($dir, 0755, true); }
        $this->pdo = new PDO('sqlite:' . DB_FILE, null, null, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->migrate();
    }

    public static function getInstance(): static {
        if (!self::$instance) { self::$instance = new static(); }
        return self::$instance;
    }

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

    public function lastInsertId(): string {
        return $this->pdo->lastInsertId();
    }

    private function migrate(): void {
        $sqlFile = __DIR__ . '/../schema.sql';
        $sql = file_get_contents($sqlFile);
        if ($sql === false) { throw new \RuntimeException('Cannot read schema.sql'); }
        // Strip comments BEFORE split — avoid filtering CREATE TABLE after comment block
        $sql = preg_replace('/^\s*--.*$/m', '', $sql);
        $statements = array_filter(array_map('trim', explode(';', $sql)), fn($s) => $s !== '');
        foreach ($statements as $stmt) { $this->pdo->exec($stmt . ';'); }
        $this->seedData();
    }

    private function seedData(): void {
        $this->seedUsers();
        $this->seedSettings();
        $this->seedHeroSlides();
        $this->seedProductCategories();
        $this->seedProducts();
        $this->seedTestimonials();
    }

    private function seedUsers(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
        if ($count > 0) return;
        $hash = password_hash('123456', PASSWORD_DEFAULT);
        $stmt = $this->pdo->prepare(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
        );
        $stmt->execute(['Admin', 'sysadmin@admin.com', $hash, 'superadmin']);
    }

    private function seedSettings(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM settings")->fetchColumn();
        if ($count > 0) return;
        $settings = [
            // General
            ['site_name',        'Tên Shop',                    'general'],
            ['site_email',       'hello@tenshop.vn',            'general'],
            ['site_phone',       '0900 000 000',                'general'],
            ['site_address',     '123 Đường Tự Nhiên, Q.1, TP.HCM', 'general'],
            ['working_hours',    '8:00 – 21:00 · Tất cả các ngày', 'general'],
            ['site_description', 'Cửa hàng phong cách tự nhiên — chọn lọc từ thiên nhiên, sống đúng với bản thân.', 'general'],
            // SEO
            ['seo_title',       'Tên Shop — Phong Cách Tự Nhiên',              'seo'],
            ['seo_description', 'Khám phá bộ sưu tập thời trang, phụ kiện và đồ dùng phong cách tự nhiên.', 'seo'],
            // Social
            ['facebook',        'https://www.facebook.com/tenshop',   'social'],
            ['instagram',       'https://www.instagram.com/tenshop',  'social'],
            ['tiktok',          'https://www.tiktok.com/@tenshop',    'social'],
            ['zalo',            'https://zalo.me/0900000000',         'social'],
            ['zalo_number',     '0900000000',                         'social'],
            // Footer
            ['footer_desc',     'Phong cách tự nhiên — sống đúng với bản thân. Chúng tôi mang đến những sản phẩm chất lượng, thân thiện với môi trường.', 'footer'],
            // Contact
            ['map_embed',       'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0962853684824!2d105.84372241493954!3d21.027763885995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2sHoan%20Kiem%20Lake!5e0!3m2!1sen!2s!4v1626123456789!5m2!1sen!2s', 'contact'],
            // Hero
            ['hero_tag',         'Thương hiệu được yêu thích năm 2025', 'hero'],
            ['hero_title_part1', 'Phong cách',                          'hero'],
            ['hero_title_part2', 'tự nhiên',                            'hero'],
            ['hero_title_line2', '— Sống đúng với bản thân',            'hero'],
            ['hero_subtitle',    'Chúng tôi mang đến những sản phẩm được chọn lọc kỹ lưỡng từ thiên nhiên — chất lượng, bền vững và phù hợp với phong cách sống hiện đại.', 'hero'],
            ['hero_note',        'Miễn phí giao hàng đơn từ 200.000đ · Đổi trả trong 30 ngày', 'hero'],
            // Stats
            ['stat_customers',  '15000',  'stats'],
            ['stat_products',   '500',    'stats'],
            ['stat_years',      '5',      'stats'],
            ['stat_provinces',  '63',     'stats'],
            // About/Story
            ['story1_badge',    'Câu chuyện thương hiệu',                         'about'],
            ['story1_title',    'Sinh ra từ tình yêu với thiên nhiên',             'about'],
            ['story1_text',     'Chúng tôi tin rằng phong cách sống tự nhiên không chỉ là lựa chọn về sản phẩm, mà là cách bạn kết nối với bản thân và thế giới xung quanh. Từ đó, chúng tôi tạo ra những sản phẩm mang giá trị thực, đẹp bền theo thời gian.', 'about'],
            ['story1_feat1',    'Nguyên liệu tự nhiên, thân thiện môi trường',     'about'],
            ['story1_feat2',    'Chất lượng được kiểm định bởi chuyên gia',        'about'],
            ['story1_feat3',    'Mỗi sản phẩm đều được làm với tâm huyết',        'about'],
            ['story2_badge',    'Cam kết của chúng tôi',                           'about'],
            ['story2_title',    'Mỗi sản phẩm là một tác phẩm',                   'about'],
            ['story2_text',     'Quy trình sản xuất của chúng tôi đặt chất lượng lên hàng đầu. Từng nguyên liệu được kiểm tra kỹ lưỡng, từng đường may được thực hiện tỉ mỉ — để mỗi sản phẩm bạn nhận được đều xứng đáng với sự tin tưởng của bạn.', 'about'],
            ['story2_feat1',    'Bảo hành 12 tháng cho mọi sản phẩm',             'about'],
            ['story2_feat2',    'Giao hàng toàn quốc trong 1–3 ngày',             'about'],
            // Promo
            ['promo_label',    'Ưu đãi có giới hạn',          'promo'],
            ['promo_title',    'Giảm đến 30% Bộ sưu tập mới', 'promo'],
            ['promo_subtitle', 'Ưu đãi đặc biệt cho bộ sưu tập hè — chất liệu nhẹ, thoáng mát, phù hợp phong cách tự nhiên hiện đại. Áp dụng đến hết tháng này.', 'promo'],
            // Shop policies
            ['free_shipping_min', '200000', 'shop'],
            ['return_days',       '30',     'shop'],
            ['warranty_months',   '12',     'shop'],
            // SMTP
            ['smtp_host',     '', 'smtp'],
            ['smtp_port',     '587', 'smtp'],
            ['smtp_user',     '', 'smtp'],
            ['smtp_pass',     '', 'smtp'],
            ['smtp_from',     '', 'smtp'],
            ['smtp_from_name','Tên Shop', 'smtp'],
            // System
            ['maintenance_mode', '0', 'system'],
            ['google_analytics', '', 'system'],
            // Cloudinary
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key',    '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            // Integrations
            ['unsplash_access_key', '', 'integrations'],
        ];
        $stmt = $this->pdo->prepare("INSERT OR IGNORE INTO settings (key, value, grp) VALUES (?, ?, ?)");
        foreach ($settings as $row) { $stmt->execute($row); }
    }

    private function seedHeroSlides(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM hero_slides")->fetchColumn();
        if ($count > 0) return;
        $slides = [
            [
                'Phong cách tự nhiên',
                'Sản phẩm được chọn lọc từ thiên nhiên — bền đẹp và thân thiện với môi trường',
                'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1200&auto=format&fit=crop&q=80',
                'Khám phá ngay', '/san-pham', 1, 1
            ],
            [
                'Bộ sưu tập hè mới',
                'Nhẹ nhàng, thoáng mát và đầy màu sắc — sẵn sàng cho mùa hè sôi động',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop&q=80',
                'Xem bộ sưu tập', '/san-pham', 2, 1
            ],
            [
                'Phụ kiện thủ công',
                'Mỗi chiếc túi, mỗi chiếc nón đều là một tác phẩm của nghệ nhân Việt Nam',
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80',
                'Mua ngay', '/san-pham', 3, 1
            ],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO hero_slides (title, subtitle, image, btn_text, btn_link, sort_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($slides as $s) { $stmt->execute($s); }
    }

    private function seedProductCategories(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM product_categories")->fetchColumn();
        if ($count > 0) return;
        $cats = [
            ['Thời Trang', 'thoi-trang', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80', 1],
            ['Phụ Kiện',   'phu-kien',   'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80', 2],
            ['Chăm Sóc',   'cham-soc',   'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&auto=format&fit=crop&q=80', 3],
            ['Nội Thất & Decor', 'noi-that-decor', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80', 4],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO product_categories (name, slug, image, sort_order) VALUES (?, ?, ?, ?)"
        );
        foreach ($cats as $c) { $stmt->execute($c); }
    }

    private function seedProducts(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
        if ($count > 0) return;
        $products = [
            // [category_id, name, slug, image, price, price_sale, badge, description, material, is_featured, is_new, sort_order]
            [1, 'Áo Linen Tự Nhiên', 'ao-linen-tu-nhien',
             'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&auto=format&fit=crop&q=80',
             280000, 350000, 'Bán chạy',
             'Áo linen tự nhiên với chất liệu 100% lanh hữu cơ, thoáng mát và thân thiện với da. Thiết kế tối giản, phù hợp mọi hoàn cảnh.',
             '100% Linen hữu cơ', 1, 0, 1],

            [1, 'Váy Organic Cotton', 'vay-organic-cotton',
             'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&auto=format&fit=crop&q=80',
             185000, null, 'Mới',
             'Váy cotton organic nhẹ nhàng, thoáng mát. Phù hợp cho những ngày hè nóng bức hoặc đi chơi dã ngoại cuối tuần.',
             '100% Cotton hữu cơ', 1, 1, 2],

            [1, 'Bộ Đồ Linen Set', 'bo-do-linen-set',
             'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
             320000, 400000, null,
             'Bộ đồ linen set gồm áo và quần, thiết kế đồng bộ sang trọng. Chất linen cao cấp co giãn tốt, không nhăn sau giặt.',
             'Linen cao cấp', 1, 0, 3],

            [2, 'Túi Tote Handmade', 'tui-tote-handmade',
             'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80',
             145000, null, null,
             'Túi tote làm thủ công từ vải canvas tự nhiên. Rộng rãi, chắc chắn — phù hợp đi chợ, đi học hoặc đi làm hàng ngày.',
             'Canvas tự nhiên', 0, 0, 4],

            [2, 'Mũ Cói Đan Tay', 'mu-coi-dan-tay',
             'https://images.unsplash.com/photo-1503342452485-86b5ded8e65a?w=800&auto=format&fit=crop&q=80',
             255000, 300000, '-15%',
             'Mũ cói đan tay từ cói thiên nhiên, nhẹ và thoáng khí. Bảo vệ khỏi nắng hè, phù hợp đi biển hoặc dã ngoại.',
             'Cói thiên nhiên', 1, 0, 5],

            [3, 'Nến Thơm Soy Wax', 'nen-thom-soy-wax',
             'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=800&auto=format&fit=crop&q=80',
             490000, null, 'Mới',
             'Nến thơm từ sáp đậu nành tự nhiên với tinh dầu nguyên chất. Cháy sạch không khói, mùi hương thư giãn và dễ chịu.',
             'Sáp đậu nành, tinh dầu thiên nhiên', 1, 1, 6],

            [4, 'Khung Tranh Bamboo', 'khung-tranh-bamboo',
             'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&auto=format&fit=crop&q=80',
             220000, null, null,
             'Khung tranh làm từ tre tự nhiên, thiết kế tối giản phù hợp phong cách Scandinavian hoặc Japandi.',
             'Tre tự nhiên', 0, 0, 7],

            [3, 'Dầu Dưỡng Tóc Argan', 'dau-duong-toc-argan',
             'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&auto=format&fit=crop&q=80',
             175000, 210000, null,
             'Dầu dưỡng tóc chiết xuất từ hạt argan Morocco. Phục hồi tóc hư tổn, làm bóng và mềm mượt từ sâu bên trong.',
             'Argan Oil, Vitamin E', 0, 0, 8],

            [2, 'Vòng Tay Đá Tự Nhiên', 'vong-tay-da-tu-nhien',
             'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
             580000, null, 'Bán chạy',
             'Vòng tay làm từ đá tự nhiên — mỗi viên đá là độc nhất. Được thiết kế bởi nghệ nhân thủ công Việt Nam.',
             'Đá tự nhiên, dây elastic cao cấp', 1, 0, 9],

            [4, 'Lẵng Cói Đan Tay', 'lang-coi-dan-tay',
             'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80',
             340000, null, null,
             'Lẵng cói đan tay đa năng — dùng đựng đồ, để trang trí góc nhà hoặc làm giỏ đi chợ. Sản phẩm thủ công của làng nghề truyền thống.',
             'Cói tự nhiên', 0, 0, 10],

            [4, 'Gương Khung Tre', 'guong-khung-tre',
             'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
             265000, null, 'Mới',
             'Gương trang điểm với khung tre tự nhiên, thiết kế tối giản. Phù hợp phòng ngủ hoặc phòng tắm phong cách organic.',
             'Tre tự nhiên, kính cường lực', 0, 1, 11],

            [1, 'Áo Khoác Linen Nhẹ', 'ao-khoac-linen-nhe',
             'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
             380000, 475000, '-20%',
             'Áo khoác linen mỏng nhẹ — perfect cho những ngày chuyển mùa. Thiết kế trẻ trung, mix&match dễ dàng với mọi outfit.',
             'Linen 70% / Cotton 30%', 1, 0, 12],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO products (category_id, name, slug, image, price, price_sale, badge, description, material, is_featured, is_new, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($products as $p) { $stmt->execute($p); }
    }

    private function seedTestimonials(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
        if ($count > 0) return;
        $reviews = [
            ['Nguyễn Thị Hoa', 'N', 'TP.HCM', 'Đây là sản phẩm tốt nhất mình từng dùng. Chất liệu cao cấp, bền đẹp và mùi thơm rất dễ chịu. Sẽ ủng hộ tiếp.', 5, 'Nến Thơm Soy Wax', 1, 1],
            ['Trần Minh Tuấn', 'T', 'Hà Nội', 'Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm y như hình, thậm chí đẹp hơn. Mình rất hài lòng với lần mua này.', 5, 'Áo Linen Tự Nhiên', 1, 2],
            ['Lê Thu Lan', 'L', 'Đà Nẵng', 'Shop tư vấn nhiệt tình, giúp mình chọn được size phù hợp. Hàng nhận được đúng như mong đợi, sẽ quay lại mua tiếp.', 5, 'Bộ Đồ Linen Set', 1, 3],
            ['Phạm Việt Dũng', 'P', 'Cần Thơ', 'Chất lượng tốt, giá cả hợp lý. Mình đã mua lần thứ ba rồi. Chỉ tiếc là hết size mình thích, nhưng nhìn chung rất ok.', 4, 'Váy Organic Cotton', 1, 4],
            ['Hoàng Phương Thảo', 'H', 'Bình Dương', 'Sản phẩm vượt kỳ vọng của mình. Mình đã giới thiệu cho cả nhóm bạn. Shop phục vụ chuyên nghiệp, cảm ơn nhiều nhé!', 5, 'Túi Tote Handmade', 1, 5],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO testimonials (author_name, author_avatar, author_location, content, stars, product_purchased, is_active, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($reviews as $r) { $stmt->execute($r); }
    }
}
