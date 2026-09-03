<?php
declare(strict_types=1);

// Database.php — file TỰ VIẾT HOÀN CHỈNH cho shop-noi-that (không dùng bản "extends \Database"
// mà scaffolder.mjs copy vào cho type=shop — bản đó bị THIẾU class cha thật sự (base scaffold
// _scaffold/api/src/Database.php bị GHI ĐÈ mất khi copy shop-specific stub) và seedSettings() gốc
// insert nhầm cột "group" thay vì "grp" thật trong schema.sql — cả 2 lỗi khiến MỌI request 500 ngay
// từ lần bootstrap đầu tiên. Đây là fix trong phạm vi site này (không đụng _scaffold/scaffolder.mjs).
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
        $this->seedCollections();
        $this->seedProducts();
        $this->seedTestimonials();
        $this->seedCoupons();
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
            ['site_name', 'MỘC AN', 'general'],
            ['site_tagline', 'Nội thất tối giản cho không gian sống chậm', 'general'],
            ['site_phone', '028 3636 5858', 'general'],
            ['site_email', 'hello@mocan.vn', 'general'],
            ['site_address', '58 Đường số 8, Phường Tăng Nhơn Phú, TP. Thủ Đức, TP.HCM', 'general'],
            ['working_hours', 'Thứ 2 – Chủ nhật: 8:30 – 20:00', 'general'],
            ['zalo_number', '0283636585', 'general'],
            ['map_embed_url', 'https://maps.google.com/maps?q=10.7769,106.7009&hl=vi&z=15&output=embed', 'general'],

            // ── Topbar (3 dòng chạy trên thanh thông báo — khớp .nt-topbar) ─────────
            ['hero_topbar_1', 'Miễn phí giao hàng nội thành cho đơn từ 5.000.000₫', 'hero'],
            ['hero_topbar_2', 'Bảo hành 24 tháng', 'hero'],
            ['hero_topbar_3', 'Lắp đặt tận nơi toàn quốc', 'hero'],

            // ── SEO ──────────────────────────────────────────────────────────────
            ['meta_title', 'MỘC AN — Nội thất tối giản cho không gian sống chậm', 'seo'],
            ['meta_description', 'MỘC AN — nội thất gỗ tối giản: sofa, bàn ghế, tủ kệ, đèn trang trí. Chất liệu gỗ tự nhiên, bảo hành 24 tháng, giao hàng & lắp đặt tận nơi toàn quốc.', 'seo'],

            // ── Social (Facebook / Instagram / Pinterest — khớp footer template) ──
            ['facebook', '', 'social'],
            ['instagram', '', 'social'],
            ['pinterest', '', 'social'],

            // ── Footer ───────────────────────────────────────────────────────────
            ['footer_about', 'Nội thất tối giản cho không gian sống chậm — chất liệu gỗ tự nhiên, thiết kế bền vững, đồng hành cùng tổ ấm Việt.', 'footer'],

            // ── Payment (COD + SePay — bắt buộc theo rule shop) ─────────────────────
            ['payment_cod_enabled', '1', 'payment'],
            ['payment_sepay_enabled', '0', 'payment'],
            ['sepay_webhook_secret', '', 'payment'],
            ['sepay_bank_code', '', 'payment'],
            ['sepay_account_number', '', 'payment'],
            ['sepay_account_name', '', 'payment'],

            // ── Shop — phí ship khớp đúng logic cart trong template gốc main.js
            // (shipping = 0 nếu subtotal >= 5.000.000đ, ngược lại 200.000đ) ─────────
            ['shipping_fee', '200000', 'shop'],
            ['free_shipping_threshold', '5000000', 'shop'],

            // ── SMTP ─────────────────────────────────────────────────────────────
            ['smtp_host', '', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from', '', 'smtp'],
            ['smtp_from_name', 'MỘC AN', 'smtp'],

            // ── System ───────────────────────────────────────────────────────────
            ['maintenance_mode', '0', 'system'],

            // ── Cloudinary (tùy chọn) ────────────────────────────────────────────
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key', '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            ['cloudinary_folder', 'shop-noi-that', 'cloudinary'],

            // ── Integrations ─────────────────────────────────────────────────────
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];

        $stmt = $this->pdo->prepare("INSERT INTO settings (key, value, grp) VALUES (?, ?, ?)");
        foreach ($settings as [$key, $value, $group]) {
            $stmt->execute([$key, $value, $group]);
        }
    }

    private function seedHeroSlides(): void {
        // Template gốc dùng "BANNER MỎNG" (Mode A) thay vì hero fullscreen — không có carousel
        // hero_slides trên trang chủ. Vẫn seed 1 slide để bảng hero_slides + trang quản trị
        // "Hero Slides" (scaffold) có dữ liệu mẫu hữu ích, phòng khi sau này đổi sang carousel.
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        $this->execute(
            "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
            [
                'Nội thất tối giản cho không gian sống chậm',
                'Hơn 500 mẫu sofa, bàn ghế, tủ kệ và phụ kiện trang trí — chất liệu gỗ tự nhiên, thiết kế bền vững theo thời gian.',
                'Khám phá sản phẩm',
                '/',
                'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1400&auto=format&fit=crop&q=80',
                1,
            ]
        );
    }

    private function seedProductCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM product_categories") > 0) return;
        $categories = [
            ['Sofa & ghế bành', 'sofa', 1],
            ['Bàn', 'ban', 2],
            ['Ghế', 'ghe', 3],
            ['Tủ & kệ', 'tu-ke', 4],
            ['Giường ngủ', 'giuong', 5],
            ['Đèn trang trí', 'den', 6],
            ['Đồ trang trí', 'trang-tri', 7],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO product_categories (name, slug, sort_order) VALUES (?, ?, ?)");
        foreach ($categories as [$name, $slug, $order]) {
            $stmt->execute([$name, $slug, $order]);
        }
    }

    private function seedCollections(): void {
        if ($this->scalar("SELECT COUNT(*) FROM collections") > 0) return;
        $collections = [
            ['Bắc Âu tối giản', 'scandinavian', 'Đường nét thanh gọn, gỗ sáng màu và tông trung tính — cảm hứng từ nội thất Scandinavia.', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&auto=format&fit=crop&q=80', 1],
            ['Nhật Bản Zen', 'nhat-ban-zen', 'Không gian sống chậm, chi tiết mộc mạc và sự cân bằng của triết lý Wabi-sabi.', 'https://images.unsplash.com/photo-1618219944342-824e40a13285?w=900&auto=format&fit=crop&q=80', 2],
            ['Công nghiệp mộc mạc', 'industrial', 'Kim loại thô, gam màu trầm và cấu trúc khỏe khoắn cho không gian cá tính.', 'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=900&auto=format&fit=crop&q=80', 3],
            ['Hoài cổ Vintage', 'vintage', 'Chất liệu da, nhung và gỗ tối màu gợi nhắc vẻ đẹp cổ điển sang trọng.', 'https://images.unsplash.com/photo-1699901530443-bfda8755f66a?w=900&auto=format&fit=crop&q=80', 4],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO collections (name, slug, description, image, sort_order) VALUES (?, ?, ?, ?, ?)");
        foreach ($collections as [$name, $slug, $desc, $image, $order]) {
            $stmt->execute([$name, $slug, $desc, $image, $order]);
        }
    }

    // Danh sách 6 màu chuẩn của template (slug tạm dùng để build "Name:#hex", KHÔNG lưu slug vào DB —
    // cột products.colors lưu đúng 1 phần tử "Tên:#hex" khớp định dạng chung của hạ tầng shop).
    private const COLOR_MAP = [
        'nau-go'     => ['Nâu gỗ', '#8b5e3c'],
        'trang-kem'  => ['Trắng kem', '#f3ece1'],
        'den'        => ['Đen', '#242424'],
        'xam'        => ['Xám', '#9a9691'],
        'be'         => ['Be', '#d8c7ac'],
        'xanh-rem'   => ['Xanh rêu', '#5c6b4f'],
    ];

    private const MATERIAL_LABEL = [
        'go-tu-nhien'     => 'gỗ tự nhiên',
        'go-cong-nghiep'  => 'gỗ công nghiệp',
        'kim-loai'        => 'kim loại',
        'vai-boc'         => 'vải bọc',
        'da'              => 'da',
        'may-tre'         => 'mây tre đan',
        'khac'            => 'chất liệu cao cấp',
    ];

    private const ROOM_LABEL = [
        'phong-khach'          => 'phòng khách',
        'phong-an'             => 'phòng ăn',
        'phong-ngu'            => 'phòng ngủ',
        'phong-lam-viec'       => 'phòng làm việc',
        'ban-cong-san-vuon'    => 'ban công & sân vườn',
    ];

    private function seedProducts(): void {
        if ($this->scalar("SELECT COUNT(*) FROM products") > 0) return;

        $categories = [];
        foreach ($this->query("SELECT id, slug FROM product_categories") as $c) { $categories[$c['slug']] = (int)$c['id']; }
        $collections = [];
        foreach ($this->query("SELECT id, slug FROM collections") as $c) { $collections[$c['slug']] = (int)$c['id']; }

        $stmt = $this->pdo->prepare(
            "INSERT INTO products
                (category_id, collection_id, name, slug, image, price, price_sale, badge, description,
                 colors, rating, in_stock, is_featured, is_new, status, sort_order, material, room, sold)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?)"
        );

        $sort = 0;
        foreach ($this->getProductSeedData() as $p) {
            $sort++;
            $colorInfo = self::COLOR_MAP[$p['color']] ?? [$p['color'], '#8b5e3c'];
            $colors    = $colorInfo[0] . ':' . $colorInfo[1];
            $matLabel  = self::MATERIAL_LABEL[$p['material']] ?? $p['material'];
            $roomLabel = self::ROOM_LABEL[$p['room']] ?? $p['room'];
            $description = "{$p['name']} — chất liệu {$matLabel}, màu {$colorInfo[0]}, phù hợp {$roomLabel}. "
                . "Sản xuất tại xưởng MỘC AN, kiểm định 3 vòng trước khi đóng gói, bảo hành 24 tháng.";
            $isNew      = $p['badge'] === 'new' ? 1 : 0;
            $isFeatured = $p['badge'] === 'hot' ? 1 : 0;

            $stmt->execute([
                $categories[$p['category']] ?? null,
                $collections[$p['collection']] ?? null,
                $p['name'],
                $p['slug'],
                $p['image'],
                $p['price'],
                $p['salePrice'],
                $p['badge'],
                $description,
                $colors,
                $p['rating'],
                1,
                $isFeatured,
                $isNew,
                $sort,
                $p['material'],
                $p['room'],
                $p['sold'],
            ]);
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $rows = [
            ['Ngọc Hân', 'TP. Thủ Đức', 'https://images.unsplash.com/photo-1773899337978-b8d83bd9b783?w=140&auto=format&fit=crop&q=80',
                'Sofa văng gỗ sồi Nordic mua từ MỘC AN sau 2 năm vẫn chắc chắn như mới. Đội giao hàng lắp đặt rất cẩn thận, không để lại vết trầy nào trên sàn nhà.', 1],
            ['Minh Tuấn', 'Quận 7, TP.HCM', 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=140&auto=format&fit=crop&q=80',
                'Đặt bộ bàn ăn 6 ghế qua điện thoại, được tư vấn khá kỹ về kích thước phù hợp phòng ăn 12m². Hàng đúng như hình, màu gỗ đẹp hơn cả mong đợi.', 2],
            ['Thu Trang', 'Hà Nội', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=140&auto=format&fit=crop&q=80',
                'Mình mua liên tiếp 3 lần rồi — từ đèn bàn, tủ đầu giường đến kệ sách. Chất lượng ổn định, chính sách đổi trả rõ ràng nên rất yên tâm.', 3],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO testimonials (author_name, author_location, author_avatar, content, sort_order) VALUES (?, ?, ?, ?, ?)");
        foreach ($rows as [$name, $loc, $avatar, $content, $order]) {
            $stmt->execute([$name, $loc, $avatar, $content, $order]);
        }
    }

    private function seedCoupons(): void {
        if ($this->scalar("SELECT COUNT(*) FROM coupons") > 0) return;
        $rows = [
            ['MOCAN10', 'Giảm 10% cho đơn từ 2.000.000₫', 1],
            ['MOCAN20', 'Giảm 20% cho đơn từ 5.000.000₫', 2],
            ['FREESHIP', 'Miễn phí vận chuyển toàn quốc', 3],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO coupons (code, description, sort_order) VALUES (?, ?, ?)");
        foreach ($rows as [$code, $desc, $order]) {
            $stmt->execute([$code, $desc, $order]);
        }
    }

    // 44 sản phẩm — copy nguyên nội dung thực từ template tĩnh
    // Sources/templates/web/Shops/shop-noi-that/assets/js/products-data.js (KHÔNG bịa dữ liệu).
    private function getProductSeedData(): array {
        return [
            // ── SOFA & GHẾ BÀNH (7) ──
            ['name' => 'Sofa băng vải bố 3 chỗ ngồi Rustic', 'slug' => 'sofa-bang-vai-bo-3-cho-rustic', 'price' => 8900000, 'salePrice' => 7490000, 'category' => 'sofa', 'collection' => 'scandinavian', 'material' => 'vai-boc', 'color' => 'be', 'room' => 'phong-khach', 'rating' => 4.7, 'sold' => 186, 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1759722665629-29df6ee4f9a5?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Sofa góc chữ L da PU cao cấp Oslo', 'slug' => 'sofa-goc-chu-l-da-pu-oslo', 'price' => 15900000, 'salePrice' => null, 'category' => 'sofa', 'collection' => 'vintage', 'material' => 'da', 'color' => 'den', 'room' => 'phong-khach', 'rating' => 4.8, 'sold' => 94, 'badge' => 'hot', 'image' => 'https://images.unsplash.com/photo-1723470917218-c21e7b3e87d4?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Sofa đơn armchair bọc vải nỉ Tulip', 'slug' => 'sofa-don-armchair-vai-ni-tulip', 'price' => 3200000, 'salePrice' => null, 'category' => 'sofa', 'collection' => 'scandinavian', 'material' => 'vai-boc', 'color' => 'xanh-rem', 'room' => 'phong-khach', 'rating' => 4.6, 'sold' => 152, 'badge' => 'new', 'image' => 'https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Sofa giường đa năng gấp gọn Multi', 'slug' => 'sofa-giuong-da-nang-multi', 'price' => 6500000, 'salePrice' => null, 'category' => 'sofa', 'collection' => 'industrial', 'material' => 'vai-boc', 'color' => 'xam', 'room' => 'phong-khach', 'rating' => 4.4, 'sold' => 71, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1646615760570-30a38e4ba704?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Sofa văng gỗ tự nhiên khung sồi Nordic', 'slug' => 'sofa-vang-go-soi-nordic', 'price' => 11200000, 'salePrice' => null, 'category' => 'sofa', 'collection' => 'scandinavian', 'material' => 'go-tu-nhien', 'color' => 'nau-go', 'room' => 'phong-khach', 'rating' => 4.9, 'sold' => 63, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1759722667581-16853f1ddcd0?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Sofa mây tre đan phong cách Bali', 'slug' => 'sofa-may-tre-dan-bali', 'price' => 4800000, 'salePrice' => null, 'category' => 'sofa', 'collection' => 'nhat-ban-zen', 'material' => 'may-tre', 'color' => 'nau-go', 'room' => 'ban-cong-san-vuon', 'rating' => 4.5, 'sold' => 48, 'badge' => 'new', 'image' => 'https://images.unsplash.com/photo-1577421759415-bba870669383?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Sofa 2 chỗ ngồi vải nhung Emerald Velvet', 'slug' => 'sofa-2-cho-vai-nhung-emerald', 'price' => 5600000, 'salePrice' => 4750000, 'category' => 'sofa', 'collection' => 'vintage', 'material' => 'vai-boc', 'color' => 'xanh-rem', 'room' => 'phong-khach', 'rating' => 4.7, 'sold' => 109, 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1763827513396-5917fc6c84f3?w=700&auto=format&fit=crop&q=80'],

            // ── BÀN (7) ──
            ['name' => 'Bàn ăn gỗ sồi 6 ghế Skandi', 'slug' => 'ban-an-go-soi-6-ghe-skandi', 'price' => 14500000, 'salePrice' => null, 'category' => 'ban', 'collection' => 'scandinavian', 'material' => 'go-tu-nhien', 'color' => 'nau-go', 'room' => 'phong-an', 'rating' => 4.8, 'sold' => 57, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1615920606214-6428b3324c74?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Bàn trà mặt kính chân kim loại Orbit', 'slug' => 'ban-tra-mat-kinh-orbit', 'price' => 2450000, 'salePrice' => null, 'category' => 'ban', 'collection' => 'industrial', 'material' => 'kim-loai', 'color' => 'den', 'room' => 'phong-khach', 'rating' => 4.5, 'sold' => 133, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1499955085172-a104c9463ece?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Bàn làm việc gỗ công nghiệp Minimo', 'slug' => 'ban-lam-viec-go-cn-minimo', 'price' => 1890000, 'salePrice' => null, 'category' => 'ban', 'collection' => 'scandinavian', 'material' => 'go-cong-nghiep', 'color' => 'trang-kem', 'room' => 'phong-lam-viec', 'rating' => 4.6, 'sold' => 214, 'badge' => 'new', 'image' => 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Bàn console phòng khách chân gỗ Slim', 'slug' => 'ban-console-chan-go-slim', 'price' => 3100000, 'salePrice' => null, 'category' => 'ban', 'collection' => 'nhat-ban-zen', 'material' => 'go-tu-nhien', 'color' => 'nau-go', 'room' => 'phong-khach', 'rating' => 4.4, 'sold' => 39, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1609879938030-31acdeded104?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Bàn ăn tròn mở rộng Extendo 4–6 người', 'slug' => 'ban-an-tron-mo-rong-extendo', 'price' => 6700000, 'salePrice' => null, 'category' => 'ban', 'collection' => 'scandinavian', 'material' => 'go-cong-nghiep', 'color' => 'be', 'room' => 'phong-an', 'rating' => 4.7, 'sold' => 88, 'badge' => 'hot', 'image' => 'https://images.unsplash.com/photo-1599327286062-40b0a7f2b305?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Bàn bar quầy bếp cao Counter Oak', 'slug' => 'ban-bar-counter-oak', 'price' => 4300000, 'salePrice' => null, 'category' => 'ban', 'collection' => 'industrial', 'material' => 'go-tu-nhien', 'color' => 'nau-go', 'room' => 'phong-an', 'rating' => 4.3, 'sold' => 27, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1772016127953-19bb88908950?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Bàn học sinh chống gù có kệ sách Study Pro', 'slug' => 'ban-hoc-chong-gu-study-pro', 'price' => 2150000, 'salePrice' => 1790000, 'category' => 'ban', 'collection' => 'scandinavian', 'material' => 'go-cong-nghiep', 'color' => 'trang-kem', 'room' => 'phong-lam-viec', 'rating' => 4.6, 'sold' => 176, 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1766245205527-7de4de05e95f?w=700&auto=format&fit=crop&q=80'],

            // ── GHẾ (7) ──
            ['name' => 'Ghế ăn bọc nệm chân gỗ Tulip Dining', 'slug' => 'ghe-an-boc-nem-tulip', 'price' => 890000, 'salePrice' => null, 'category' => 'ghe', 'collection' => 'scandinavian', 'material' => 'go-tu-nhien', 'color' => 'be', 'room' => 'phong-an', 'rating' => 4.5, 'sold' => 302, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Ghế văn phòng công thái học ErgoFlex', 'slug' => 'ghe-van-phong-ergoflex', 'price' => 3450000, 'salePrice' => null, 'category' => 'ghe', 'collection' => 'industrial', 'material' => 'kim-loai', 'color' => 'den', 'room' => 'phong-lam-viec', 'rating' => 4.8, 'sold' => 241, 'badge' => 'hot', 'image' => 'https://images.unsplash.com/photo-1681418659069-eef28d44aeab?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Ghế bar chân kim loại Nordic Stool', 'slug' => 'ghe-bar-nordic-stool', 'price' => 750000, 'salePrice' => null, 'category' => 'ghe', 'collection' => 'industrial', 'material' => 'kim-loai', 'color' => 'xam', 'room' => 'phong-an', 'rating' => 4.3, 'sold' => 118, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1552324190-9e86fa095c4a?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Ghế bành thư giãn bọc da Lounge Chair', 'slug' => 'ghe-banh-lounge-chair-da', 'price' => 5900000, 'salePrice' => null, 'category' => 'ghe', 'collection' => 'vintage', 'material' => 'da', 'color' => 'nau-go', 'room' => 'phong-khach', 'rating' => 4.9, 'sold' => 66, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1650167202574-d8448576292a?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Ghế ăn mây tự nhiên đan tay Rattan Weave', 'slug' => 'ghe-an-may-rattan-weave', 'price' => 1250000, 'salePrice' => null, 'category' => 'ghe', 'collection' => 'nhat-ban-zen', 'material' => 'may-tre', 'color' => 'nau-go', 'room' => 'phong-an', 'rating' => 4.6, 'sold' => 84, 'badge' => 'new', 'image' => 'https://images.unsplash.com/photo-1686806372785-fcfe9efa9b70?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Ghế xoay làm việc lưng lưới Mesh Comfort', 'slug' => 'ghe-xoay-mesh-comfort', 'price' => 1680000, 'salePrice' => 1390000, 'category' => 'ghe', 'collection' => 'industrial', 'material' => 'kim-loai', 'color' => 'xam', 'room' => 'phong-lam-viec', 'rating' => 4.5, 'sold' => 197, 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1688578735427-994ecdea3ea4?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Ghế đôn gỗ tròn đa năng Stool Wood', 'slug' => 'ghe-don-go-tron-stool-wood', 'price' => 590000, 'salePrice' => null, 'category' => 'ghe', 'collection' => 'nhat-ban-zen', 'material' => 'go-tu-nhien', 'color' => 'nau-go', 'room' => 'phong-khach', 'rating' => 4.4, 'sold' => 143, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1540809799-5da9372c3f64?w=700&auto=format&fit=crop&q=80'],

            // ── TỦ & KỆ (8) ──
            ['name' => 'Tủ quần áo 3 cánh gỗ công nghiệp Wardrobe MDF', 'slug' => 'tu-quan-ao-3-canh-wardrobe-mdf', 'price' => 7200000, 'salePrice' => null, 'category' => 'tu-ke', 'collection' => 'scandinavian', 'material' => 'go-cong-nghiep', 'color' => 'trang-kem', 'room' => 'phong-ngu', 'rating' => 4.6, 'sold' => 71, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1662454419622-a41092ecd245?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Kệ tivi treo tường gỗ óc chó Walnut TV Console', 'slug' => 'ke-tivi-walnut-tv-console', 'price' => 4600000, 'salePrice' => null, 'category' => 'tu-ke', 'collection' => 'nhat-ban-zen', 'material' => 'go-tu-nhien', 'color' => 'nau-go', 'room' => 'phong-khach', 'rating' => 4.7, 'sold' => 59, 'badge' => 'hot', 'image' => 'https://images.unsplash.com/photo-1617229538605-7d9054d75104?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Kệ sách 5 tầng khung thép Industrial Shelf', 'slug' => 'ke-sach-5-tang-industrial-shelf', 'price' => 2300000, 'salePrice' => null, 'category' => 'tu-ke', 'collection' => 'industrial', 'material' => 'kim-loai', 'color' => 'den', 'room' => 'phong-lam-viec', 'rating' => 4.5, 'sold' => 122, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1668584086736-852b7b5a4260?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Tủ giày thông minh cửa lật Shoe Cabinet', 'slug' => 'tu-giay-cua-lat-shoe-cabinet', 'price' => 1950000, 'salePrice' => null, 'category' => 'tu-ke', 'collection' => 'scandinavian', 'material' => 'go-cong-nghiep', 'color' => 'trang-kem', 'room' => 'phong-khach', 'rating' => 4.4, 'sold' => 165, 'badge' => 'new', 'image' => 'https://images.unsplash.com/photo-1593720947007-8d77fe2733a7?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Tủ đầu giường 2 ngăn kéo Nightstand Oak', 'slug' => 'tu-dau-giuong-nightstand-oak', 'price' => 1350000, 'salePrice' => null, 'category' => 'tu-ke', 'collection' => 'nhat-ban-zen', 'material' => 'go-tu-nhien', 'color' => 'nau-go', 'room' => 'phong-ngu', 'rating' => 4.6, 'sold' => 208, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1630835016348-ba2854bbf78b?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Kệ góc trang trí đa năng Corner Shelf', 'slug' => 'ke-goc-da-nang-corner-shelf', 'price' => 890000, 'salePrice' => 690000, 'category' => 'tu-ke', 'collection' => 'scandinavian', 'material' => 'go-cong-nghiep', 'color' => 'be', 'room' => 'phong-khach', 'rating' => 4.3, 'sold' => 97, 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1572060728039-748cba8c3c75?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Tủ bếp treo tường mở Kitchen Open Shelf', 'slug' => 'tu-bep-treo-tuong-open-shelf', 'price' => 2750000, 'salePrice' => null, 'category' => 'tu-ke', 'collection' => 'scandinavian', 'material' => 'go-cong-nghiep', 'color' => 'trang-kem', 'room' => 'phong-an', 'rating' => 4.4, 'sold' => 44, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1647021453272-dd4fa8dea8b2?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Tủ hồ sơ văn phòng khóa an toàn Office Cabinet', 'slug' => 'tu-ho-so-office-cabinet', 'price' => 3100000, 'salePrice' => null, 'category' => 'tu-ke', 'collection' => 'industrial', 'material' => 'kim-loai', 'color' => 'xam', 'room' => 'phong-lam-viec', 'rating' => 4.2, 'sold' => 33, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1707185792575-5c4afd1ff186?w=700&auto=format&fit=crop&q=80'],

            // ── ĐÈN TRANG TRÍ (6) ──
            ['name' => 'Đèn cây đứng chân gỗ chao vải Floor Lamp Linen', 'slug' => 'den-cay-dung-floor-lamp-linen', 'price' => 1450000, 'salePrice' => null, 'category' => 'den', 'collection' => 'nhat-ban-zen', 'material' => 'go-tu-nhien', 'color' => 'nau-go', 'room' => 'phong-khach', 'rating' => 4.6, 'sold' => 78, 'badge' => 'new', 'image' => 'https://images.unsplash.com/photo-1561664701-5b89dafffdd5?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Đèn bàn làm việc điều chỉnh góc LED Desk Lamp', 'slug' => 'den-ban-lam-viec-led-desk-lamp', 'price' => 590000, 'salePrice' => null, 'category' => 'den', 'collection' => 'industrial', 'material' => 'kim-loai', 'color' => 'den', 'room' => 'phong-lam-viec', 'rating' => 4.5, 'sold' => 261, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1543512214-4f76e81f8bfc?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Đèn trần thả pha lê hiện đại Chandelier Crystal', 'slug' => 'den-tran-tha-chandelier-crystal', 'price' => 3900000, 'salePrice' => null, 'category' => 'den', 'collection' => 'vintage', 'material' => 'kim-loai', 'color' => 'trang-kem', 'room' => 'phong-khach', 'rating' => 4.7, 'sold' => 52, 'badge' => 'hot', 'image' => 'https://images.unsplash.com/photo-1698577289907-3a32072c386e?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Đèn ngủ đầu giường cảm ứng chạm Touch Night Lamp', 'slug' => 'den-ngu-cam-ung-touch-night-lamp', 'price' => 420000, 'salePrice' => 350000, 'category' => 'den', 'collection' => 'scandinavian', 'material' => 'go-cong-nghiep', 'color' => 'be', 'room' => 'phong-ngu', 'rating' => 4.4, 'sold' => 189, 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1517862774645-dd398fbfaffa?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Đèn treo tường trang trí Wall Sconce Brass', 'slug' => 'den-treo-tuong-wall-sconce-brass', 'price' => 680000, 'salePrice' => null, 'category' => 'den', 'collection' => 'vintage', 'material' => 'kim-loai', 'color' => 'nau-go', 'room' => 'phong-khach', 'rating' => 4.3, 'sold' => 61, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1659100171587-a8a5e9d9417a?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Đèn thả bàn ăn dây treo điều chỉnh Pendant Rattan', 'slug' => 'den-tha-ban-an-pendant-rattan', 'price' => 990000, 'salePrice' => null, 'category' => 'den', 'collection' => 'nhat-ban-zen', 'material' => 'may-tre', 'color' => 'nau-go', 'room' => 'phong-an', 'rating' => 4.6, 'sold' => 87, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1564586880927-99376cbf0f4f?w=700&auto=format&fit=crop&q=80'],

            // ── ĐỒ TRANG TRÍ (6) ──
            ['name' => 'Gương tròn viền gỗ trang trí Round Mirror Oak', 'slug' => 'guong-tron-vien-go-round-mirror', 'price' => 780000, 'salePrice' => null, 'category' => 'trang-tri', 'collection' => 'nhat-ban-zen', 'material' => 'go-tu-nhien', 'color' => 'nau-go', 'room' => 'phong-khach', 'rating' => 4.7, 'sold' => 134, 'badge' => 'new', 'image' => 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Thảm trải sàn lông ngắn Soft Rug Beige', 'slug' => 'tham-trai-san-soft-rug-beige', 'price' => 1250000, 'salePrice' => null, 'category' => 'trang-tri', 'collection' => 'scandinavian', 'material' => 'vai-boc', 'color' => 'be', 'room' => 'phong-khach', 'rating' => 4.5, 'sold' => 96, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1620230757457-772a4712a926?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Tranh treo tường canvas trừu tượng Abstract Canvas', 'slug' => 'tranh-canvas-abstract', 'price' => 650000, 'salePrice' => null, 'category' => 'trang-tri', 'collection' => 'industrial', 'material' => 'khac', 'color' => 'be', 'room' => 'phong-khach', 'rating' => 4.4, 'sold' => 58, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1598240087583-2f610faf1eaf?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Bình hoa gốm trang trí để bàn Ceramic Vase', 'slug' => 'binh-hoa-gom-ceramic-vase', 'price' => 320000, 'salePrice' => 260000, 'category' => 'trang-tri', 'collection' => 'nhat-ban-zen', 'material' => 'khac', 'color' => 'trang-kem', 'room' => 'phong-khach', 'rating' => 4.6, 'sold' => 221, 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Gối tựa lưng sofa họa tiết Cushion Cover Set', 'slug' => 'goi-tua-cushion-cover-set', 'price' => 280000, 'salePrice' => null, 'category' => 'trang-tri', 'collection' => 'vintage', 'material' => 'vai-boc', 'color' => 'xanh-rem', 'room' => 'phong-khach', 'rating' => 4.3, 'sold' => 312, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1591456196771-c6d35c4e2683?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Rèm cửa vải lanh chống nắng Linen Curtain', 'slug' => 'rem-cua-vai-lanh-linen-curtain', 'price' => 890000, 'salePrice' => null, 'category' => 'trang-tri', 'collection' => 'scandinavian', 'material' => 'vai-boc', 'color' => 'be', 'room' => 'phong-khach', 'rating' => 4.4, 'sold' => 73, 'badge' => 'new', 'image' => 'https://images.unsplash.com/photo-1578500467296-441a11d5d55a?w=700&auto=format&fit=crop&q=80'],

            // ── GIƯỜNG NGỦ (3) ──
            ['name' => 'Giường ngủ gỗ tự nhiên khung sồi Oak Bed Frame 1m8', 'slug' => 'giuong-ngu-oak-bed-frame-1m8', 'price' => 12500000, 'salePrice' => null, 'category' => 'giuong', 'collection' => 'nhat-ban-zen', 'material' => 'go-tu-nhien', 'color' => 'nau-go', 'room' => 'phong-ngu', 'rating' => 4.8, 'sold' => 46, 'badge' => 'hot', 'image' => 'https://images.unsplash.com/photo-1663337049364-5c6ba8ba1e78?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Giường tầng trẻ em an toàn Kids Bunk Bed', 'slug' => 'giuong-tang-tre-em-bunk-bed', 'price' => 8900000, 'salePrice' => null, 'category' => 'giuong', 'collection' => 'scandinavian', 'material' => 'go-cong-nghiep', 'color' => 'trang-kem', 'room' => 'phong-ngu', 'rating' => 4.6, 'sold' => 29, 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1588939349575-7ab15c8bd1ef?w=700&auto=format&fit=crop&q=80'],
            ['name' => 'Giường bọc nệm da cao cấp Upholstered Bed 1m6', 'slug' => 'giuong-boc-da-upholstered-bed-1m6', 'price' => 16900000, 'salePrice' => 14500000, 'category' => 'giuong', 'collection' => 'vintage', 'material' => 'da', 'color' => 'xam', 'room' => 'phong-ngu', 'rating' => 4.9, 'sold' => 21, 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1580948516270-b914bd6bccf3?w=700&auto=format&fit=crop&q=80'],
        ];
    }
}
