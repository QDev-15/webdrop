<?php
declare(strict_types=1);

// Database.php — file TỰ VIẾT HOÀN CHỈNH cho shop-trang-suc (KHÔNG dùng bản "extends \Database"
// mà scaffolder.mjs copy vào cho type=shop — bản đó thiếu class cha thật vì base scaffold
// Database.php bị ghi đè mất khi copy shop-specific stub, và seedSettings() gốc dùng sai tên cột
// "group" thay vì "grp" thật của schema.sql). Theo đúng fix đã áp dụng ở shop-ruou-vang/shop-dong-ho/shop-noi-that.
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
            ['site_name', 'VIOLETTE', 'general'],
            ['site_tagline', 'Trang sức tinh xảo, chế tác từ trái tim', 'general'],
            ['site_phone', '1900 2726', 'general'],
            ['site_email', 'hello@violette.vn', 'general'],
            ['site_address', '25 Đồng Khởi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', 'general'],
            ['site_address_hn', '15 Tràng Tiền, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội', 'general'],
            ['working_hours', 'Thứ 2 – Chủ nhật: 9:00 – 20:00', 'general'],
            ['zalo_number', '0901234567', 'general'],
            ['map_embed_url', 'https://maps.google.com/maps?q=10.7769,106.7009&hl=vi&z=15&output=embed', 'general'],

            // ── SEO ──────────────────────────────────────────────────────────────
            ['meta_title', 'VIOLETTE — Trang sức tinh xảo, chế tác từ trái tim', 'seo'],
            ['meta_description', 'VIOLETTE Fine Jewelry — nhẫn, dây chuyền, bông tai, lắc tay bạc 925, vàng 18K/24K và đá quý tự nhiên. Thiết kế tinh xảo, bảo hành trọn đời, kiểm định rõ ràng.', 'seo'],

            // ── Social ───────────────────────────────────────────────────────────
            ['facebook', '', 'social'],
            ['instagram', '', 'social'],
            ['youtube', '', 'social'],

            // ── Footer ───────────────────────────────────────────────────────────
            ['footer_about', 'Trang sức bạc 925, vàng 18K/24K và đá quý tự nhiên — chế tác tỉ mỉ, kiểm định rõ ràng, bảo hành trọn đời.', 'footer'],

            // ── Payment (COD + SePay — bắt buộc theo rule shop) ─────────────────────
            ['payment_cod_enabled', '1', 'payment'],
            ['payment_sepay_enabled', '0', 'payment'],
            ['sepay_webhook_secret', '', 'payment'],
            ['sepay_bank_code', '', 'payment'],
            ['sepay_account_number', '', 'payment'],
            ['sepay_account_name', '', 'payment'],

            // ── Shop — miễn phí ship + phí ship mặc định ────────────────────────
            ['shipping_fee', '30000', 'shop'],
            ['free_shipping_threshold', '2000000', 'shop'],

            // ── SMTP ─────────────────────────────────────────────────────────────
            ['smtp_host', '', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from', '', 'smtp'],
            ['smtp_from_name', 'VIOLETTE', 'smtp'],

            // ── System ───────────────────────────────────────────────────────────
            ['maintenance_mode', '0', 'system'],

            // ── Cloudinary (tùy chọn) ────────────────────────────────────────────
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key', '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            ['cloudinary_folder', 'shop-trang-suc', 'cloudinary'],

            // ── Integrations ─────────────────────────────────────────────────────
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];

        $stmt = $this->pdo->prepare("INSERT INTO settings (key, value, grp) VALUES (?, ?, ?)");
        foreach ($settings as [$key, $value, $group]) {
            $stmt->execute([$key, $value, $group]);
        }
    }

    private function seedHeroSlides(): void {
        // Template gốc dùng carousel hero 4 slide riêng (H5 Bold Typography), mỗi slide có 2 nút CTA
        // khác nhau — vượt quá schema hero_slides 1-nút/1-link, nên hardcode trực tiếp trong
        // HeroSlider.tsx (giống nguyên văn index.html gốc). Vẫn seed 1 dòng để trang quản trị
        // "Hero Slides" (module core scaffold) có dữ liệu mẫu, không rỗng.
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        $this->execute(
            "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
            [
                'Ánh Sáng Của Sự Tinh Tế',
                'Trang sức bạc 925, vàng 18K/24K và đá quý tự nhiên — chế tác tỉ mỉ cho những khoảnh khắc đáng nhớ nhất của bạn.',
                'Khám phá bộ sưu tập',
                '/san-pham',
                'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=1400&auto=format&fit=crop&q=80',
                1,
            ]
        );
    }

    private function seedProductCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM product_categories") > 0) return;
        $categories = [
            ['Nhẫn', 'nhan', 'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=500&auto=format&fit=crop&q=80', 1],
            ['Dây chuyền', 'day-chuyen', 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&auto=format&fit=crop&q=80', 2],
            ['Bông tai', 'bong-tai', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=80', 3],
            ['Lắc tay', 'lac-tay', 'https://images.unsplash.com/photo-1633810543462-77c4a3b13f07?w=500&auto=format&fit=crop&q=80', 4],
            ['Bộ trang sức', 'bo-trang-suc', 'https://images.unsplash.com/photo-1585960622850-ed33c41d6418?w=500&auto=format&fit=crop&q=80', 5],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO product_categories (name, slug, image, sort_order) VALUES (?, ?, ?, ?)");
        foreach ($categories as [$name, $slug, $image, $order]) {
            $stmt->execute([$name, $slug, $image, $order]);
        }
    }

    private const MATERIAL_LABEL = [
        'bac-925' => 'Bạc 925', 'vang-18k' => 'Vàng 18K', 'vang-24k' => 'Vàng 24K',
        'da-quy' => 'Đá quý tự nhiên', 'dinh-da' => 'Đính đá CZ',
    ];
    private const TONE_LABEL = ['vang' => 'Vàng', 'bac' => 'Bạc', 'hong-vang' => 'Vàng hồng'];
    private const OCCASION_LABEL = [
        'hang-ngay' => 'Hàng ngày', 'du-tiec' => 'Dự tiệc', 'cuoi-hoi' => 'Cưới hỏi', 'qua-tang' => 'Quà tặng',
    ];
    private const CATEGORY_LABEL = [
        'nhan' => 'nhẫn', 'day-chuyen' => 'dây chuyền', 'bong-tai' => 'bông tai',
        'lac-tay' => 'lắc tay', 'bo-trang-suc' => 'bộ trang sức',
    ];

    // 45 sản phẩm — copy nguyên nội dung thực (tên/slug/ảnh/giá/giá sale/badge/danh mục/chất liệu/
    // tông màu/dịp sử dụng/theme/đánh giá/đã bán/tồn kho) từ
    // Sources/templates/web/Shops/shop-trang-suc/assets/js/products-data.js (PRODUCTS). KHÔNG bịa dữ liệu.
    // Cột "theme" (CSV) phục vụ 4 khối THEMED-SECTIONS ở trang chủ (moi-ve/ban-chay/uu-dai/qua-tang).
    private function getJewelrySeedData(): array {
        return [
            // [name, slug, image, price, priceSale, badge, category, material, tone, occasion, theme(csv), rating, sold, stock]
            ['Nhẫn Bạc 925 Solitaire Tối Giản', 'nhan-bac-925-solitaire-toi-gian', 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?w=600&auto=format&fit=crop&q=80', 590000, null, 'new', 'nhan', 'bac-925', 'bac', 'hang-ngay', 'moi-ve', 4.7, 320, 1],
            ['Nhẫn Vàng 18K Đính Kim Cương Nhân Tạo 5 Ly', 'nhan-vang-18k-dinh-kim-cuong-nhan-tao-5-ly', 'https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?w=600&auto=format&fit=crop&q=80', 4850000, null, 'hot', 'nhan', 'vang-18k', 'vang', 'du-tiec', 'ban-chay', 4.9, 214, 1],
            ['Nhẫn Vàng 24K Trơn Truyền Thống', 'nhan-vang-24k-tron-truyen-thong', 'https://images.unsplash.com/photo-1611107683227-e9060eccd846?w=600&auto=format&fit=crop&q=80', 12500000, null, '', 'nhan', 'vang-24k', 'vang', 'cuoi-hoi', '', 4.8, 96, 1],
            ['Nhẫn Đá Thạch Anh Tím Tự Nhiên', 'nhan-da-thach-anh-tim-tu-nhien', 'https://images.unsplash.com/photo-1713950920412-97799efdf870?w=600&auto=format&fit=crop&q=80', 1290000, null, 'new', 'nhan', 'da-quy', 'bac', 'hang-ngay', 'moi-ve', 4.6, 154, 1],
            ['Nhẫn Đính Đá CZ Xoắn Ốc Bạc 925', 'nhan-dinh-da-cz-xoan-oc-bac-925', 'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=600&auto=format&fit=crop&q=80', 720000, 590000, 'sale', 'nhan', 'dinh-da', 'bac', 'du-tiec', 'uu-dai', 4.5, 410, 1],
            ['Nhẫn Cặp Đôi Vàng 18K Khắc Tên', 'nhan-cap-doi-vang-18k-khac-ten', 'https://images.unsplash.com/photo-1631982690223-8aa4be0a2497?w=600&auto=format&fit=crop&q=80', 6900000, null, '', 'nhan', 'vang-18k', 'vang', 'cuoi-hoi', 'qua-tang', 4.9, 187, 1],
            ['Nhẫn Vàng Hồng 18K Đính Đá Sapphire', 'nhan-vang-hong-18k-dinh-da-sapphire', 'https://images.unsplash.com/photo-1685970731194-e27b477e87ba?w=600&auto=format&fit=crop&q=80', 8250000, null, '', 'nhan', 'vang-18k', 'hong-vang', 'du-tiec', 'ban-chay', 4.8, 132, 1],
            ['Nhẫn Bạc 925 Mặt Trăng Ngôi Sao', 'nhan-bac-925-mat-trang-ngoi-sao', 'https://images.unsplash.com/photo-1603561596973-8166e9e089d1?w=600&auto=format&fit=crop&q=80', 450000, 380000, 'sale', 'nhan', 'bac-925', 'bac', 'hang-ngay', 'moi-ve,uu-dai', 4.6, 505, 1],
            ['Nhẫn Vàng 24K Hình Rồng Phong Thủy', 'nhan-vang-24k-hinh-rong-phong-thuy', 'https://images.unsplash.com/photo-1633934542430-0905ccb5f050?w=600&auto=format&fit=crop&q=80', 15800000, null, '', 'nhan', 'vang-24k', 'vang', 'qua-tang', 'qua-tang', 4.7, 58, 1],
            ['Nhẫn Đá Ruby Tự Nhiên Dáng Ovan', 'nhan-da-ruby-tu-nhien-dang-ovan', 'https://images.unsplash.com/photo-1628926379972-9843ad139a8c?w=600&auto=format&fit=crop&q=80', 18500000, null, 'hot', 'nhan', 'da-quy', 'vang', 'du-tiec', 'ban-chay', 4.9, 41, 1],

            ['Dây Chuyền Bạc 925 Mặt Trái Tim', 'day-chuyen-bac-925-mat-trai-tim', 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&auto=format&fit=crop&q=80', 690000, null, 'new', 'day-chuyen', 'bac-925', 'bac', 'hang-ngay', 'moi-ve', 4.6, 288, 1],
            ['Dây Chuyền Vàng 18K Mặt Chữ Cái', 'day-chuyen-vang-18k-mat-chu-cai', 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&auto=format&fit=crop&q=80', 3200000, null, '', 'day-chuyen', 'vang-18k', 'vang', 'qua-tang', 'qua-tang', 4.8, 245, 1],
            ['Dây Chuyền Vàng 24K Kiềng Trơn', 'day-chuyen-vang-24k-kieng-tron', 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&auto=format&fit=crop&q=80', 22000000, null, '', 'day-chuyen', 'vang-24k', 'vang', 'cuoi-hoi', '', 4.9, 34, 1],
            ['Dây Chuyền Đính Đá CZ Hoa Văn', 'day-chuyen-dinh-da-cz-hoa-van', 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600&auto=format&fit=crop&q=80', 890000, 750000, 'sale', 'day-chuyen', 'dinh-da', 'bac', 'du-tiec', 'uu-dai', 4.5, 366, 1],
            ['Dây Chuyền Đá Ngọc Bích Tự Nhiên', 'day-chuyen-da-ngoc-bich-tu-nhien', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80', 2450000, null, 'new', 'day-chuyen', 'da-quy', 'vang', 'hang-ngay', 'moi-ve', 4.7, 121, 1],
            ['Dây Chuyền Vàng Hồng 18K Mặt Cầu', 'day-chuyen-vang-hong-18k-mat-cau', 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&auto=format&fit=crop&q=80', 5600000, null, 'hot', 'day-chuyen', 'vang-18k', 'hong-vang', 'du-tiec', 'ban-chay', 4.8, 176, 1],
            ['Dây Chuyền Bạc 925 Đôi Basic', 'day-chuyen-bac-925-doi-basic', 'https://images.unsplash.com/photo-1685970731571-72ede0cb26ea?w=600&auto=format&fit=crop&q=80', 520000, null, '', 'day-chuyen', 'bac-925', 'bac', 'hang-ngay', '', 4.4, 298, 1],
            ['Dây Chuyền Vàng 18K Mặt Phật Bản Mệnh', 'day-chuyen-vang-18k-mat-phat-ban-menh', 'https://images.unsplash.com/photo-1616837874254-8d5aaa63e273?w=600&auto=format&fit=crop&q=80', 7400000, null, '', 'day-chuyen', 'vang-18k', 'vang', 'qua-tang', 'qua-tang', 4.9, 88, 1],
            ['Dây Chuyền Đính Đá Kim Cương Nhân Tạo Layer', 'day-chuyen-dinh-da-kim-cuong-nhan-tao-layer', 'https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=600&auto=format&fit=crop&q=80', 1150000, null, '', 'day-chuyen', 'dinh-da', 'bac', 'du-tiec', 'ban-chay', 4.6, 340, 1],
            ['Dây Chuyền Đá Thạch Anh Hồng Tình Yêu', 'day-chuyen-da-thach-anh-hong-tinh-yeu', 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600&auto=format&fit=crop&q=80', 980000, 850000, 'sale', 'day-chuyen', 'da-quy', 'hong-vang', 'qua-tang', 'uu-dai,qua-tang', 4.7, 202, 1],

            ['Bông Tai Bạc 925 Ngọc Trai Nước Ngọt', 'bong-tai-bac-925-ngoc-trai-nuoc-ngot', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80', 480000, null, 'new', 'bong-tai', 'bac-925', 'bac', 'hang-ngay', 'moi-ve', 4.7, 412, 1],
            ['Bông Tai Vàng 18K Đính Đá Sapphire Nhỏ', 'bong-tai-vang-18k-dinh-da-sapphire-nho', 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=600&auto=format&fit=crop&q=80', 3850000, null, '', 'bong-tai', 'vang-18k', 'vang', 'du-tiec', 'ban-chay', 4.8, 156, 1],
            ['Bông Tai Vàng 24K Bản To Truyền Thống', 'bong-tai-vang-24k-ban-to-truyen-thong', 'https://images.unsplash.com/photo-1590166223826-12dee1677420?w=600&auto=format&fit=crop&q=80', 9600000, null, '', 'bong-tai', 'vang-24k', 'vang', 'cuoi-hoi', '', 4.8, 47, 1],
            ['Bông Tai Đính Đá CZ Vòng Tròn', 'bong-tai-dinh-da-cz-vong-tron', 'https://images.unsplash.com/photo-1615655114865-4cc1bda5901e?w=600&auto=format&fit=crop&q=80', 350000, 290000, 'sale', 'bong-tai', 'dinh-da', 'bac', 'hang-ngay', 'uu-dai', 4.5, 588, 1],
            ['Bông Tai Đá Opal Tự Nhiên', 'bong-tai-da-opal-tu-nhien', 'https://images.unsplash.com/photo-1693212793204-bcea856c75fe?w=600&auto=format&fit=crop&q=80', 2150000, null, '', 'bong-tai', 'da-quy', 'bac', 'du-tiec', 'ban-chay', 4.7, 98, 1],
            ['Bông Tai Vàng Hồng 18K Hình Lá', 'bong-tai-vang-hong-18k-hinh-la', 'https://images.unsplash.com/photo-1652766540048-de0a878a3266?w=600&auto=format&fit=crop&q=80', 2900000, null, 'new', 'bong-tai', 'vang-18k', 'hong-vang', 'hang-ngay', 'moi-ve', 4.6, 143, 1],
            ['Bông Tai Bạc 925 Dạng Khoen Basic', 'bong-tai-bac-925-dang-khoen-basic', 'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=600&auto=format&fit=crop&q=80', 320000, null, '', 'bong-tai', 'bac-925', 'bac', 'hang-ngay', '', 4.4, 320, 1],
            ['Bông Tai Vàng 18K Rủ Dài Dự Tiệc', 'bong-tai-vang-18k-ru-dai-du-tiec', 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80', 5100000, null, 'hot', 'bong-tai', 'vang-18k', 'vang', 'du-tiec', 'ban-chay', 4.9, 87, 1],
            ['Bông Tai Đính Đá Kim Cương Nhân Tạo Hình Bướm', 'bong-tai-dinh-da-kim-cuong-nhan-tao-hinh-buom', 'https://images.unsplash.com/photo-1655255114527-d0a834d9a774?w=600&auto=format&fit=crop&q=80', 610000, null, '', 'bong-tai', 'dinh-da', 'bac', 'qua-tang', 'qua-tang', 4.6, 234, 1],

            ['Lắc Tay Bạc 925 Charm Trái Tim', 'lac-tay-bac-925-charm-trai-tim', 'https://images.unsplash.com/photo-1633810543462-77c4a3b13f07?w=600&auto=format&fit=crop&q=80', 550000, null, '', 'lac-tay', 'bac-925', 'bac', 'qua-tang', 'qua-tang', 4.6, 267, 1],
            ['Lắc Tay Vàng 18K Mắt Xích Cuban', 'lac-tay-vang-18k-mat-xich-cuban', 'https://images.unsplash.com/photo-1619119069152-a2b331eb392a?w=600&auto=format&fit=crop&q=80', 6800000, null, 'hot', 'lac-tay', 'vang-18k', 'vang', 'du-tiec', 'ban-chay', 4.8, 112, 1],
            ['Lắc Tay Vàng 24K Trơn Cổ Điển', 'lac-tay-vang-24k-tron-co-dien', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop&q=80', 14200000, null, '', 'lac-tay', 'vang-24k', 'vang', 'cuoi-hoi', '', 4.8, 39, 1],
            ['Lắc Tay Đính Đá CZ Tennis', 'lac-tay-dinh-da-cz-tennis', 'https://images.unsplash.com/photo-1721206624492-3d05631471ea?w=600&auto=format&fit=crop&q=80', 1350000, 1090000, 'sale', 'lac-tay', 'dinh-da', 'bac', 'du-tiec', 'uu-dai', 4.7, 198, 1],
            ['Lắc Tay Đá Thạch Anh Vàng Phong Thủy', 'lac-tay-da-thach-anh-vang-phong-thuy', 'https://images.unsplash.com/photo-1717605383946-96c6884c36b4?w=600&auto=format&fit=crop&q=80', 890000, null, 'new', 'lac-tay', 'da-quy', 'vang', 'hang-ngay', 'moi-ve', 4.6, 176, 1],
            ['Lắc Tay Vàng Hồng 18K Charm Ngôi Sao', 'lac-tay-vang-hong-18k-charm-ngoi-sao', 'https://images.unsplash.com/photo-1676291055501-286c48bb186f?w=600&auto=format&fit=crop&q=80', 4100000, null, '', 'lac-tay', 'vang-18k', 'hong-vang', 'qua-tang', 'qua-tang', 4.7, 95, 1],
            ['Lắc Tay Bạc 925 Basic Trơn', 'lac-tay-bac-925-basic-tron', 'https://images.unsplash.com/photo-1708221235482-a6e2a807198f?w=600&auto=format&fit=crop&q=80', 380000, null, '', 'lac-tay', 'bac-925', 'bac', 'hang-ngay', '', 4.4, 289, 1],
            ['Lắc Tay Đính Đá Kim Cương Nhân Tạo Vòng Đôi', 'lac-tay-dinh-da-kim-cuong-nhan-tao-vong-doi', 'https://images.unsplash.com/photo-1728646998199-127b357a464d?w=600&auto=format&fit=crop&q=80', 1780000, null, '', 'lac-tay', 'dinh-da', 'bac', 'du-tiec', 'ban-chay', 4.6, 164, 1],

            ['Bộ Trang Sức Bạc 925 Ngọc Trai (Dây + Bông Tai)', 'bo-trang-suc-bac-925-ngoc-trai', 'https://images.unsplash.com/photo-1585960622850-ed33c41d6418?w=600&auto=format&fit=crop&q=80', 1450000, null, 'new', 'bo-trang-suc', 'bac-925', 'bac', 'cuoi-hoi', 'moi-ve', 4.7, 143, 1],
            ['Bộ Trang Sức Vàng 18K Đính Đá Sapphire (3 Món)', 'bo-trang-suc-vang-18k-dinh-da-sapphire-3-mon', 'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=600&auto=format&fit=crop&q=80', 15600000, null, 'hot', 'bo-trang-suc', 'vang-18k', 'vang', 'cuoi-hoi', 'ban-chay', 4.9, 62, 1],
            ['Bộ Trang Sức Vàng 24K Cô Dâu Truyền Thống', 'bo-trang-suc-vang-24k-co-dau-truyen-thong', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80', 32000000, null, '', 'bo-trang-suc', 'vang-24k', 'vang', 'cuoi-hoi', '', 4.9, 21, 1],
            ['Bộ Trang Sức Đính Đá CZ Cao Cấp (4 Món)', 'bo-trang-suc-dinh-da-cz-cao-cap-4-mon', 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&auto=format&fit=crop&q=80', 2450000, 1990000, 'sale', 'bo-trang-suc', 'dinh-da', 'bac', 'du-tiec', 'uu-dai', 4.6, 108, 1],
            ['Bộ Trang Sức Đá Ruby Tự Nhiên (2 Món)', 'bo-trang-suc-da-ruby-tu-nhien-2-mon', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80', 24500000, null, '', 'bo-trang-suc', 'da-quy', 'vang', 'du-tiec', 'ban-chay', 4.9, 18, 1],
            ['Bộ Trang Sức Vàng Hồng 18K Tối Giản (2 Món)', 'bo-trang-suc-vang-hong-18k-toi-gian-2-mon', 'https://images.unsplash.com/photo-1592317295760-5c1f677dfc78?w=600&auto=format&fit=crop&q=80', 8900000, null, '', 'bo-trang-suc', 'vang-18k', 'hong-vang', 'qua-tang', 'qua-tang', 4.8, 74, 1],
            ['Bộ Trang Sức Bạc 925 Cưới Hỏi Cơ Bản', 'bo-trang-suc-bac-925-cuoi-hoi-co-ban', 'https://images.unsplash.com/photo-1671642883395-0ab89c3ac890?w=600&auto=format&fit=crop&q=80', 1150000, null, '', 'bo-trang-suc', 'bac-925', 'bac', 'cuoi-hoi', '', 4.5, 190, 1],
            ['Bộ Trang Sức Đính Đá Kim Cương Nhân Tạo Full (5 Món)', 'bo-trang-suc-dinh-da-kim-cuong-nhan-tao-full-5-mon', 'https://images.unsplash.com/photo-1610214354095-684029c14300?w=600&auto=format&fit=crop&q=80', 3600000, null, '', 'bo-trang-suc', 'dinh-da', 'bac', 'du-tiec', 'ban-chay', 4.7, 133, 1],
        ];
    }

    private function seedProducts(): void {
        if ($this->scalar("SELECT COUNT(*) FROM products") > 0) return;

        $categories = [];
        foreach ($this->query("SELECT id, slug FROM product_categories") as $c) { $categories[$c['slug']] = (int)$c['id']; }

        $stmt = $this->pdo->prepare(
            "INSERT INTO products
                (category_id, name, slug, image, price, price_sale, badge, description, colors, rating,
                 in_stock, is_featured, is_new, status, sort_order, material, tone, occasion, sold, theme)
             VALUES (?,?,?,?,?,?,?,?,'',?,?,?,?,'published',?,?,?,?,?,?)"
        );

        $sort = 0;
        foreach ($this->getJewelrySeedData() as $row) {
            [$name, $slug, $image, $price, $priceSale, $badge, $category, $material, $tone, $occasion, $theme, $rating, $sold, $stock] = $row;
            $sort++;
            $isFeatured  = $badge === 'hot' ? 1 : 0;
            $isNew       = $badge === 'new' ? 1 : 0;
            $matLabel    = self::MATERIAL_LABEL[$material] ?? $material;
            $toneLabel   = self::TONE_LABEL[$tone] ?? $tone;
            $occLabel    = self::OCCASION_LABEL[$occasion] ?? $occasion;
            $catLabel    = self::CATEGORY_LABEL[$category] ?? str_replace('-', ' ', $category);
            $description = "{$name} thuộc dòng {$catLabel} chất liệu " . mb_strtolower($matLabel) . ", tông màu " . mb_strtolower($toneLabel)
                . ", phù hợp cho dịp " . mb_strtolower($occLabel) . ". Sản phẩm được chế tác thủ công tỉ mỉ, đánh bóng hoàn thiện đạt tiêu chuẩn cao cấp, "
                . "đi kèm hộp quà sang trọng và giấy kiểm định.";

            $stmt->execute([
                $categories[$category] ?? null,
                $name, $slug, $image, $price, $priceSale, $badge, $description, $rating,
                $stock, $isFeatured, $isNew, $sort,
                $material, $tone, $occasion, $sold, $theme,
            ]);
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $rows = [
            ['Minh Anh', 'Khách hàng tại TP.HCM', 'https://images.unsplash.com/photo-1557053908-94f31a224f8f?w=200&auto=format&fit=crop&q=80',
                'Chiếc nhẫn cầu hôn mua tại VIOLETTE khiến bạn gái tôi bật khóc vì hạnh phúc. Đá quý sáng đẹp, giấy kiểm định đầy đủ, dịch vụ tư vấn cực kỳ tận tâm.', 5, 1],
            ['Thu Trang', 'Khách hàng tại Hà Nội', 'https://images.unsplash.com/photo-1654765437547-6b572f52ee1a?w=200&auto=format&fit=crop&q=80',
                'Mình đã mua 3 bộ trang sức làm quà tặng cho mẹ và chị gái. Đóng gói sang trọng, giao hàng đúng hẹn, chất lượng vượt mong đợi so với mức giá.', 5, 2],
            ['Hoàng Long', 'Khách hàng tại Đà Nẵng', 'https://images.unsplash.com/photo-1779398970350-14a7222482eb?w=200&auto=format&fit=crop&q=80',
                'Chính sách bảo hành trọn đời và đổi size miễn phí trong 30 ngày khiến tôi hoàn toàn yên tâm khi mua online. Sẽ tiếp tục ủng hộ VIOLETTE.', 5, 3],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO testimonials (author_name, author_role, author_avatar, content, rating, sort_order) VALUES (?, ?, ?, ?, ?, ?)");
        foreach ($rows as [$name, $role, $avatar, $content, $rating, $order]) {
            $stmt->execute([$name, $role, $avatar, $content, $rating, $order]);
        }
    }
}
