<?php
declare(strict_types=1);

// Database.php — file TỰ VIẾT HOÀN CHỈNH cho shop-dong-ho (không dùng bản "extends \Database" mà
// scaffolder.mjs copy vào cho type=shop — bản đó thiếu class cha thật (base scaffold Database.php bị
// ghi đè mất khi copy shop-specific stub). Theo đúng fix đã áp dụng ở shop-noi-that.
class Database {
    private static ?Database $instance = null;
    private \PDO $pdo;

    private function __construct() {
        $dir = dirname(DB_FILE);
        if (!is_dir($dir)) { @mkdir($dir, 0755, true); }
        $this->pdo = new \PDO('sqlite:' . DB_FILE, null, null, [
            \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
            \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
        ]);
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->pdo->exec('PRAGMA journal_mode = WAL');
        $this->migrate();
    }

    public static function getInstance(): static {
        if (!self::$instance) { self::$instance = new static(); }
        return self::$instance;
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

    public function execute(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        if (stripos(ltrim($sql), 'INSERT') === 0) {
            return (int)$this->pdo->lastInsertId();
        }
        return $stmt->rowCount();
    }

    public function lastInsertId(): string {
        return $this->pdo->lastInsertId();
    }

    public function getPdo(): \PDO {
        return $this->pdo;
    }

    // ─── Migrate + seed ──────────────────────────────────────────────────────────
    private function migrate(): void {
        $sqlFile = __DIR__ . '/../schema.sql';
        $sql = file_get_contents($sqlFile);
        if ($sql === false) { throw new \RuntimeException('Cannot read schema.sql'); }
        // Strip comments TRƯỚC khi split — tránh filter loại bỏ CREATE TABLE nằm sau comment block
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
        if ($this->scalar("SELECT COUNT(*) FROM users") > 0) return;
        $hash = password_hash('123456', PASSWORD_DEFAULT);
        $this->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['Admin', 'sysadmin@admin.com', $hash, 'superadmin']
        );
    }

    private function seedSettings(): void {
        if ($this->scalar("SELECT COUNT(*) FROM settings") > 0) return;

        $settings = [
            // ── General ──────────────────────────────────────────────────────────
            ['site_name', 'MERIDIAN', 'general'],
            ['site_tagline', 'Đồng hồ chính hãng đa thương hiệu', 'general'],
            ['site_phone', '028 3822 9090', 'general'],
            ['site_email', 'hello@meridianwatch.vn', 'general'],
            ['site_address', '120 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM', 'general'],
            ['working_hours', 'Thứ 2 – Chủ nhật: 8:00 – 21:00', 'general'],
            ['zalo_number', '0283822909', 'general'],
            ['map_embed_url', 'https://maps.google.com/maps?q=10.7769,106.7009&hl=vi&z=15&output=embed', 'general'],

            // ── SEO ──────────────────────────────────────────────────────────────
            ['meta_title', 'MERIDIAN — Đồng hồ chính hãng đa thương hiệu', 'seo'],
            ['meta_description', 'MERIDIAN — đồng hồ nam nữ chính hãng đa thương hiệu: CASIO, SEIKO, CITIZEN, TISSOT, LONGINES... Bảo hành chính hãng, giao hàng toàn quốc, đổi trả 30 ngày.', 'seo'],

            // ── Social ───────────────────────────────────────────────────────────
            ['facebook', '', 'social'],
            ['instagram', '', 'social'],
            ['youtube', '', 'social'],

            // ── Footer ───────────────────────────────────────────────────────────
            ['footer_about', 'Đồng hồ chính hãng đa thương hiệu — cam kết nguồn gốc rõ ràng, bảo hành đầy đủ, giao hàng toàn quốc.', 'footer'],

            // ── Payment (COD + SePay — bắt buộc theo rule shop) ─────────────────────
            ['payment_cod_enabled', '1', 'payment'],
            ['payment_sepay_enabled', '0', 'payment'],
            ['sepay_webhook_secret', '', 'payment'],
            ['sepay_bank_code', '', 'payment'],
            ['sepay_account_number', '', 'payment'],
            ['sepay_account_name', '', 'payment'],

            // ── Shop — miễn phí ship từ 2.000.000đ (khớp gio-hang.html gốc) ──────────
            ['shipping_fee', '30000', 'shop'],
            ['free_shipping_threshold', '2000000', 'shop'],

            // ── SMTP ─────────────────────────────────────────────────────────────
            ['smtp_host', '', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from', '', 'smtp'],
            ['smtp_from_name', 'MERIDIAN', 'smtp'],

            // ── System ───────────────────────────────────────────────────────────
            ['maintenance_mode', '0', 'system'],

            // ── Cloudinary (tùy chọn) ────────────────────────────────────────────
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key', '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            ['cloudinary_folder', 'shop-dong-ho', 'cloudinary'],

            // ── Integrations ─────────────────────────────────────────────────────
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];

        $stmt = $this->pdo->prepare("INSERT INTO settings (key, value, grp) VALUES (?, ?, ?)");
        foreach ($settings as [$key, $value, $group]) {
            $stmt->execute([$key, $value, $group]);
        }
    }

    private function seedHeroSlides(): void {
        // Template gốc dùng carousel hero 4 slide riêng (H2 Split 45/55) render tĩnh trong index.html,
        // không đọc từ hero_slides — vẫn seed để trang quản trị "Hero Slides" (scaffold) có dữ liệu mẫu.
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        $this->execute(
            "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
            [
                'Đồng hồ chính hãng đa thương hiệu',
                'Hơn 40 mẫu đồng hồ nam nữ từ CASIO, SEIKO, CITIZEN, TISSOT, LONGINES... nguồn gốc rõ ràng, bảo hành đầy đủ toàn quốc.',
                'Khám phá ngay',
                '/san-pham',
                'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1400&auto=format&fit=crop&q=80',
                1,
            ]
        );
    }

    private function seedProductCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM product_categories") > 0) return;
        $categories = [
            ['Đồng hồ Nam', 'nam', 1],
            ['Đồng hồ Nữ', 'nu', 2],
            ['Unisex', 'unisex', 3],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO product_categories (name, slug, sort_order) VALUES (?, ?, ?)");
        foreach ($categories as [$name, $slug, $order]) {
            $stmt->execute([$name, $slug, $order]);
        }
    }

    // Pool ảnh đồng hồ (57 ảnh) — copy nguyên từ template tĩnh
    // Sources/templates/web/Shops/shop-dong-ho/assets/js/products-data.js (WATCH_IMAGE_IDS).
    private const WATCH_IMAGE_IDS = [
        '1507679252487-e3db58b1642e', '1600003014755-ba31aa59c4b6', '1670177257750-9b47927f68eb',
        '1618215650148-e8e61eae521c', '1670404160620-a3a86428560e', '1600003014637-ff82a275e191',
        '1600003014608-c2ccc1570a65', '1730757679771-b53e798846cf', '1524805444758-089113d48a6d',
        '1620625515032-6ed0c1790c75', '1604242692760-2f7b0c26856d', '1587925358603-c2eea5305bbc',
        '1634140704051-58a787556cd1', '1636639818651-d97365346a5c', '1548171916-c0dea7f94ca6',
        '1524592094714-0f0654e20314', '1506193095-80bc749473f2', '1618215649872-6e3143a716ec',
        '1579171931975-97962e46be2d', '1602752975366-5520991f958d', '1689287428096-7e1dcc705a5c',
        '1623998021450-85c29c644e0d', '1506796684999-9fa2770af9c3', '1451477334999-a9321157a431',
        '1590995505834-e5380bba1865', '1516461240763-822a87484851', '1625139109729-3611f838306d',
        '1584208124193-df98a65afaf6', '1490915785914-0af2806c22b6', '1526648856597-c2b6745ad7bd',
        '1580287017488-706e4d7598a1', '1605143185597-9fe1a8065fbb', '1605143185672-f4f5c892dda4',
        '1582043568252-63501953afcc', '1582043568452-86590c15107d', '1582043568328-69ce6fea1a7b',
        '1582043568773-a7a2b57239f5', '1766306285696-5469242d8085', '1770216533493-a25ce4224123',
        '1690729125175-fcda275386e4', '1783878081616-fc4a978a68e5', '1581409767632-6be2fff574a0',
        '1768062251809-739d987a42fe', '1772354318482-9caa5a429320', '1546868871-7041f2a55e12',
        '1508685096489-7aacd43bd3b1', '1660844817855-3ecc7ef21f12', '1637160151663-a410315e4e75',
        '1544117519-31a4b719223d', '1632794716789-42d9995fb5b6', '1696688713460-de12ac76ebc6',
        '1434494571168-ab162bce2813', '1631863552122-3072cf599a46', '1639575003095-d55df63b97be',
        '1598516802414-50a01bee818d', '1434494878577-86c23bcb06b9', '1596236100223-f3c656de3038',
    ];

    private function watchImg(int $idx, int $w = 700): string {
        $id = self::WATCH_IMAGE_IDS[$idx % count(self::WATCH_IMAGE_IDS)];
        return "https://images.unsplash.com/photo-{$id}?w={$w}&auto=format&fit=crop&q=80";
    }

    // 44 sản phẩm — copy nguyên nội dung thực (tên/brand/category/material/style/giá/đã bán/limited) từ
    // Sources/templates/web/Shops/shop-dong-ho/assets/js/products-data.js (RAW_WATCHES). KHÔNG bịa dữ liệu.
    private function getWatchSeedData(): array {
        return [
            ['CASIO Edifice Chronograph EFR-556', 'CASIO', 'nam', 'kim-loai', 'the-thao', 3290000, 412, false],
            ['CASIO G-Shock GA-2100 Casioak', 'CASIO', 'nam', 'cao-su', 'the-thao', 2590000, 588, false],
            ['CASIO Sheen Crystal SHE-4057', 'CASIO', 'nu', 'kim-loai', 'sang-trong', 3890000, 156, false],
            ['CASIO Vintage A168 Retro', 'CASIO', 'unisex', 'kim-loai', 'the-thao', 1290000, 674, false],
            ['SEIKO Presage Cocktail Time', 'SEIKO', 'nam', 'kim-loai', 'co-dien', 8900000, 203, false],
            ['SEIKO 5 Sports Automatic SRPD', 'SEIKO', 'nam', 'kim-loai', 'the-thao', 5490000, 341, false],
            ['SEIKO Lukia Diamond Ladies', 'SEIKO', 'nu', 'kim-loai', 'sang-trong', 9900000, 87, true],
            ['SEIKO Chronograph SSB Series', 'SEIKO', 'nam', 'da', 'co-dien', 6200000, 128, false],
            ['CITIZEN Eco-Drive Promaster Diver', 'CITIZEN', 'nam', 'kim-loai', 'the-thao', 11500000, 176, false],
            ['CITIZEN Eco-Drive Elegance Ladies', 'CITIZEN', 'nu', 'kim-loai', 'sang-trong', 7900000, 142, false],
            ['CITIZEN Automatic Open Heart', 'CITIZEN', 'nam', 'da', 'co-dien', 8400000, 98, false],
            ['CITIZEN L Ladies Crystal', 'CITIZEN', 'nu', 'kim-loai', 'sang-trong', 6900000, 119, false],
            ['ORIENT Bambino Classic V4', 'ORIENT', 'nam', 'da', 'co-dien', 5200000, 264, false],
            ['ORIENT Star Ladies Elegant', 'ORIENT', 'nu', 'kim-loai', 'sang-trong', 12900000, 54, true],
            ['ORIENT Mako II Automatic Diver', 'ORIENT', 'nam', 'kim-loai', 'the-thao', 6800000, 187, false],
            ['ORIENT Contemporary Sun & Moon', 'ORIENT', 'nam', 'da', 'co-dien', 7400000, 76, false],
            ['TISSOT PRX Powermatic 80', 'TISSOT', 'unisex', 'kim-loai', 'co-dien', 24900000, 231, false],
            ['TISSOT T-Classic Le Locle', 'TISSOT', 'nam', 'da', 'sang-trong', 18500000, 92, false],
            ['TISSOT Lovely Square Ladies', 'TISSOT', 'nu', 'kim-loai', 'sang-trong', 15900000, 68, false],
            ['TISSOT Seastar Chronograph', 'TISSOT', 'nam', 'kim-loai', 'the-thao', 21500000, 61, false],
            ['FOSSIL Grant Chronograph', 'FOSSIL', 'nam', 'da', 'co-dien', 3900000, 298, false],
            ['FOSSIL Jacqueline Ladies', 'FOSSIL', 'nu', 'kim-loai', 'sang-trong', 4200000, 214, false],
            ['FOSSIL Gen 6 Smartwatch', 'FOSSIL', 'unisex', 'cao-su', 'smartwatch', 5900000, 189, false],
            ['FOSSIL Nate Leather Casual', 'FOSSIL', 'nam', 'da', 'the-thao', 3400000, 167, false],
            ['MVMT Classic Blacktop', 'MVMT', 'nam', 'kim-loai', 'the-thao', 2900000, 356, false],
            ['MVMT Bloom Ladies Rose Gold', 'MVMT', 'nu', 'da', 'sang-trong', 3200000, 245, false],
            ['MVMT Voyager GMT', 'MVMT', 'nam', 'kim-loai', 'the-thao', 4500000, 108, false],
            ['TIMEX Weekender Chrono', 'TIMEX', 'unisex', 'vai', 'the-thao', 1590000, 421, false],
            ['TIMEX Marlin Automatic Reissue', 'TIMEX', 'nam', 'da', 'co-dien', 4900000, 133, false],
            ['TIMEX Fairfield Ladies', 'TIMEX', 'nu', 'kim-loai', 'co-dien', 2200000, 187, false],
            ['LONGINES Master Collection', 'LONGINES', 'nam', 'da', 'sang-trong', 42000000, 34, true],
            ['LONGINES DolceVita Ladies', 'LONGINES', 'nu', 'kim-loai', 'sang-trong', 38500000, 29, true],
            ['LONGINES Conquest Chronograph', 'LONGINES', 'nam', 'kim-loai', 'the-thao', 45000000, 22, true],
            ['DANIEL WELLINGTON Classic Petite', 'DANIEL WELLINGTON', 'nu', 'da', 'co-dien', 2490000, 389, false],
            ['DANIEL WELLINGTON Iconic Link', 'DANIEL WELLINGTON', 'nu', 'kim-loai', 'sang-trong', 3600000, 276, false],
            ['DANIEL WELLINGTON Classic Cornwall', 'DANIEL WELLINGTON', 'nam', 'da', 'co-dien', 2690000, 198, false],
            ['CASIO Baby-G Shock Resistant', 'CASIO', 'nu', 'cao-su', 'the-thao', 2100000, 312, false],
            ['SEIKO Astron GPS Solar', 'SEIKO', 'nam', 'kim-loai', 'sang-trong', 32000000, 18, true],
            ['CITIZEN CZ Smart Wearable', 'CITIZEN', 'unisex', 'cao-su', 'smartwatch', 6900000, 96, false],
            ['ORIENT Kamasu Automatic Diver', 'ORIENT', 'nam', 'kim-loai', 'the-thao', 7900000, 71, false],
            ['TISSOT Everytime Ladies Slim', 'TISSOT', 'nu', 'da', 'co-dien', 12500000, 47, false],
            ['FOSSIL Townsman Automatic', 'FOSSIL', 'nam', 'da', 'sang-trong', 5400000, 84, false],
            ['MVMT Chrono Steel Sport', 'MVMT', 'nam', 'kim-loai', 'the-thao', 3700000, 143, false],
            ['TIMEX Q Reissue Retro', 'TIMEX', 'unisex', 'kim-loai', 'co-dien', 3200000, 92, false],
        ];
    }

    private function seedProducts(): void {
        if ($this->scalar("SELECT COUNT(*) FROM products") > 0) return;

        $categories = [];
        foreach ($this->query("SELECT id, slug FROM product_categories") as $c) { $categories[$c['slug']] = (int)$c['id']; }

        $materialLabel = ['da' => 'dây da', 'kim-loai' => 'dây kim loại', 'cao-su' => 'dây cao su', 'vai' => 'dây vải (NATO)'];
        $styleLabel    = ['co-dien' => 'cổ điển', 'the-thao' => 'thể thao', 'sang-trong' => 'sang trọng', 'smartwatch' => 'smartwatch'];
        $categoryLabel = ['nam' => 'đồng hồ nam', 'nu' => 'đồng hồ nữ', 'unisex' => 'unisex'];

        $stmt = $this->pdo->prepare(
            "INSERT INTO products
                (category_id, name, slug, image, price, price_sale, badge, description, colors, rating,
                 in_stock, is_featured, is_new, status, sort_order,
                 brand, material, style, warranty, movement, water_resist, diameter, sold, limited, gallery)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,'published',?,?,?,?,?,?,?,?,?,?,?)"
        );

        $sort = 0;
        foreach ($this->getWatchSeedData() as $i => $row) {
            [$name, $brand, $category, $material, $style, $price, $sold, $limited] = $row;
            $sort++;
            $id        = $i + 1;
            $slug      = slugify("{$name}-{$id}");
            $onSale    = ($i % 3 === 1);
            $priceSale = $onSale ? (int)(round($price * 0.85 / 10000) * 10000) : null;
            $isNew     = ($i % 5 === 0) ? 1 : 0;
            $badge     = $limited ? 'hot' : ($onSale ? 'sale' : ($isNew ? 'new' : ''));
            $rating    = round((4 + (($i * 7) % 10) / 10) * 10) / 10;
            $stock     = ($i % 17 !== 0) ? 1 : 0;
            $warranty  = $limited ? '5 năm chính hãng' : '2 năm chính hãng';
            $isEvenIdx = ($i % 2 === 0);
            $movement  = $style === 'smartwatch'
                ? 'Smart OS'
                : ((($style === 'co-dien' || $style === 'sang-trong') && $isEvenIdx) ? 'Automatic (Cơ tự động)' : 'Quartz (Pin)');
            $waterResist = $style === 'the-thao' ? '100-200m' : ($style === 'smartwatch' ? '50m' : '30-50m');
            $diameter    = 34 + ($i % 8);
            $description = "{$name} — thiết kế {$styleLabel[$style]} dành cho {$categoryLabel[$category]}, {$materialLabel[$material]}, "
                . "bảo hành chính hãng " . ($limited ? '5 năm' : '2 năm') . " tại MERIDIAN.";
            $image   = $this->watchImg($id * 3, 700);
            $gallery = $this->watchImg($id * 3 + 1, 900) . '|' . $this->watchImg($id * 3 + 2, 900);

            $stmt->execute([
                $categories[$category] ?? null,
                $name, $slug, $image, $price, $priceSale, $badge, $description, '', $rating,
                $stock, 0, $isNew, $sort,
                $brand, $material, $style, $warranty, $movement, $waterResist, $diameter, $sold, $limited ? 1 : 0, $gallery,
            ]);
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $rows = [
            ['Minh Quân', 'TP. Hồ Chí Minh', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=140&auto=format&fit=crop&q=80',
                'Mua chiếc SEIKO Presage ở đây, kiểm tra tem chính hãng kỹ trước khi nhận hàng. Đóng gói cẩn thận, có đầy đủ giấy bảo hành.', 1],
            ['Thu Hà', 'Hà Nội', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=140&auto=format&fit=crop&q=80',
                'Đổi trả rất dễ dàng, mình đổi size dây sau 1 tuần không mất phí. Nhân viên tư vấn nhiệt tình, không ép mua.', 2],
            ['Đức Anh', 'Đà Nẵng', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=140&auto=format&fit=crop&q=80',
                'Đặt chiếc TISSOT PRX làm quà sinh nhật, giao hàng đúng hẹn, hộp quà sang trọng. Chắc chắn sẽ quay lại mua thêm.', 3],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO testimonials (author_name, author_location, author_avatar, content, sort_order) VALUES (?, ?, ?, ?, ?)");
        foreach ($rows as [$name, $loc, $avatar, $content, $order]) {
            $stmt->execute([$name, $loc, $avatar, $content, $order]);
        }
    }
}
