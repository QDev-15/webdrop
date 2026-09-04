<?php
declare(strict_types=1);

// Database.php — file TỰ VIẾT HOÀN CHỈNH cho shop-thu-cung (không dùng bản "extends \Database" mà
// scaffolder.mjs copy vào cho type=shop — bản đó thiếu class cha thật vì base scaffold Database.php
// bị ghi đè mất khi copy shop-specific stub). Theo đúng fix đã áp dụng ở shop-dong-ho / shop-ruou-vang.
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
            ['site_name', 'Pet Haus', 'general'],
            ['site_tagline', 'Cửa hàng thú cưng chính hãng cho chó & mèo', 'general'],
            ['site_phone', '1900 636 963', 'general'],
            ['site_email', 'hello@pethaus.vn', 'general'],
            ['site_address', '52 Nguyễn Văn Trỗi, Phường 15, Quận Phú Nhuận, TP. Hồ Chí Minh', 'general'],
            ['working_hours', 'Thứ 2 – Chủ nhật: 8:00 – 20:00', 'general'],
            ['zalo_number', '0900000000', 'general'],
            ['map_embed_url', 'https://maps.google.com/maps?q=10.7769,106.7009&hl=vi&z=15&output=embed', 'general'],

            // ── SEO ──────────────────────────────────────────────────────────────
            ['meta_title', 'Pet Haus — Cửa hàng thú cưng chính hãng cho chó & mèo', 'seo'],
            ['meta_description', 'Pet Haus — 42 sản phẩm thú cưng chính hãng: thức ăn, phụ kiện, đồ chơi, chuồng nhà & chăm sóc cho chó mèo. Nguồn gốc rõ ràng, giao hàng toàn quốc.', 'seo'],

            // ── Social ───────────────────────────────────────────────────────────
            ['facebook', '', 'social'],
            ['instagram', '', 'social'],
            ['youtube', '', 'social'],

            // ── Footer ───────────────────────────────────────────────────────────
            ['footer_about', 'Cửa hàng thú cưng chính hãng — thức ăn, phụ kiện, đồ chơi, chuồng nhà & chăm sóc cho chó mèo. Nguồn gốc rõ ràng, kiểm định trước khi bán.', 'footer'],

            // ── Payment (COD + SePay — bắt buộc theo rule shop) ─────────────────────
            ['payment_cod_enabled', '1', 'payment'],
            ['payment_sepay_enabled', '0', 'payment'],
            ['sepay_webhook_secret', '', 'payment'],
            ['sepay_bank_code', '', 'payment'],
            ['sepay_account_number', '', 'payment'],
            ['sepay_account_name', '', 'payment'],

            // ── Shop — miễn phí ship từ 400.000đ (khớp tc-topbar template gốc) ──────
            ['shipping_fee', '25000', 'shop'],
            ['free_shipping_threshold', '400000', 'shop'],

            // ── SMTP ─────────────────────────────────────────────────────────────
            ['smtp_host', '', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from', '', 'smtp'],
            ['smtp_from_name', 'Pet Haus', 'smtp'],

            // ── System ───────────────────────────────────────────────────────────
            ['maintenance_mode', '0', 'system'],

            // ── Cloudinary (tùy chọn) ────────────────────────────────────────────
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key', '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            ['cloudinary_folder', 'shop-thu-cung', 'cloudinary'],

            // ── Integrations ─────────────────────────────────────────────────────
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];

        $stmt = $this->pdo->prepare("INSERT INTO settings (key, value, grp) VALUES (?, ?, ?)");
        foreach ($settings as [$key, $value, $group]) {
            $stmt->execute([$key, $value, $group]);
        }
    }

    private function seedHeroSlides(): void {
        // Template gốc dùng "THIN BANNER" tĩnh (Mode A CATALOG-UNIFIED — KHÔNG có carousel/hero
        // fullscreen), chỉ 1 khối nội dung cố định. Seed 1 record để trang quản trị "Hero Slides"
        // (module core scaffold) có dữ liệu mẫu — Banner.tsx đọc title/subtitle từ record này.
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        $this->execute(
            "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
            [
                'Mọi thứ boss cưng cần, một nơi mua đủ',
                'Thức ăn, phụ kiện, đồ chơi, chuồng nhà & chăm sóc cho chó mèo — 42 sản phẩm nguồn gốc rõ ràng, kiểm định an toàn trước khi lên kệ.',
                'Khám phá ngay',
                '/',
                '',
                1,
            ]
        );
    }

    private function seedProductCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM product_categories") > 0) return;
        $categories = [
            ['Thức ăn', 'thuc-an', 1],
            ['Phụ kiện', 'phu-kien', 2],
            ['Đồ chơi', 'do-choi', 3],
            ['Chuồng & Nhà ở', 'chuong-nha', 4],
            ['Chăm sóc & Vệ sinh', 'cham-soc', 5],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO product_categories (name, slug, sort_order) VALUES (?, ?, ?)");
        foreach ($categories as [$name, $slug, $order]) {
            $stmt->execute([$name, $slug, $order]);
        }
    }

    private const PET_LABEL = ['cho' => 'Chó', 'meo' => 'Mèo', 'ca-hai' => 'Chó & Mèo'];

    // 42 sản phẩm — copy nguyên nội dung thực (tên/giá/giá sale/badge/danh mục/loại thú cưng/thương
    // hiệu/kích cỡ/đánh giá/đã bán) từ
    // Sources/templates/web/Shops/shop-thu-cung/assets/js/products-data.js (RAW → PRODUCTS). KHÔNG bịa dữ liệu.
    // Cấu trúc mỗi dòng: [tên, category, petType, brandIdx, giá, cóGiảmGiá, sizes[], rating, sold, badge]
    private function getPetSeedData(): array {
        return [
        ['Hạt khô cho chó trưởng thành vị gà 3kg', 'thuc-an', 'cho', 0, 285000, false, [], 4.8, 412, 'hot'],
        ['Pate mèo con vị cá ngừ 400g', 'thuc-an', 'meo', 2, 42000, true, [], 4.6, 530, 'sale'],
        ['Hạt khô mèo trưởng thành vị cá hồi 2kg', 'thuc-an', 'meo', 0, 255000, false, [], 4.7, 298, ''],
        ['Thức ăn ướt cho chó vị bò 400g', 'thuc-an', 'cho', 3, 38000, false, [], 4.5, 187, 'new'],
        ['Hạt khô chó con vị gà & sữa 1.5kg', 'thuc-an', 'cho', 0, 175000, false, [], 4.9, 264, ''],
        ['Snack thưởng cho chó vị phô mai 100g', 'thuc-an', 'cho', 4, 35000, true, [], 4.4, 610, 'sale'],
        ['Pate cao cấp cho mèo vị gà tây 200g', 'thuc-an', 'meo', 2, 48000, false, [], 4.7, 145, 'new'],
        ['Hạt khô mèo kiểm soát cân nặng 2kg', 'thuc-an', 'meo', 0, 268000, false, [], 4.6, 92, ''],
        ['Thức ăn hạt cho chó giống nhỏ 2kg', 'thuc-an', 'cho', 4, 198000, false, [], 4.5, 176, ''],
        ['Súp thưởng cho mèo vị sò điệp 60g', 'thuc-an', 'meo', 2, 22000, false, [], 4.8, 341, 'hot'],

        ['Dây dắt chó phản quang cao cấp', 'phu-kien', 'cho', 1, 129000, false, ['S', 'M', 'L'], 4.6, 203, ''],
        ['Vòng cổ da thật cho chó', 'phu-kien', 'cho', 1, 159000, true, ['S', 'M', 'L'], 4.7, 167, 'sale'],
        ['Áo len giữ ấm cho chó mùa đông', 'phu-kien', 'cho', 5, 145000, false, ['S', 'M', 'L'], 4.5, 289, 'new'],
        ['Bát ăn inox chống trượt cho thú cưng', 'phu-kien', 'ca-hai', 6, 89000, false, ['S', 'M'], 4.8, 455, 'hot'],
        ['Balo vận chuyển mèo thoáng khí', 'phu-kien', 'meo', 5, 420000, false, ['M', 'L'], 4.6, 88, ''],
        ['Đai yếm ăn chống bẩn cho chó', 'phu-kien', 'cho', 1, 65000, false, ['S', 'M', 'L'], 4.3, 120, ''],
        ['Rọ mõm êm ái cho chó', 'phu-kien', 'cho', 6, 95000, true, ['S', 'M', 'L'], 4.4, 76, 'sale'],
        ['Túi đựng phân vệ sinh cho chó (cuộn 15 túi)', 'phu-kien', 'cho', 7, 28000, false, [], 4.7, 512, ''],
        ['Nơ cổ thời trang cho mèo (set 5 cái)', 'phu-kien', 'meo', 5, 49000, false, ['S'], 4.5, 198, 'new'],
        ['Áo mưa chống thấm cho chó', 'phu-kien', 'cho', 1, 119000, false, ['S', 'M', 'L'], 4.4, 64, ''],

        ['Bóng cao su phát nhạc cho chó', 'do-choi', 'cho', 7, 79000, false, [], 4.6, 377, ''],
        ['Cần câu lông vũ cho mèo', 'do-choi', 'meo', 3, 55000, true, [], 4.8, 624, 'sale'],
        ['Chuột nhồi bông có catnip (set 3 cái)', 'do-choi', 'meo', 3, 45000, false, [], 4.7, 289, ''],
        ['Đồ chơi gặm nhấm hình xương cao su', 'do-choi', 'cho', 7, 69000, false, [], 4.5, 156, 'new'],
        ['Cầu trèo kết hợp trụ cào cho mèo', 'do-choi', 'meo', 5, 890000, false, [], 4.9, 74, 'hot'],
        ['Dây kéo co vải dù cho chó', 'do-choi', 'cho', 7, 59000, false, [], 4.4, 203, ''],
        ['Đĩa ném frisbee mềm cho chó', 'do-choi', 'cho', 4, 45000, false, [], 4.3, 98, ''],
        ['Bóng lăn phát thức ăn thông minh', 'do-choi', 'ca-hai', 6, 135000, true, [], 4.7, 167, 'sale'],

        ['Chuồng sắt gấp gọn cho chó', 'chuong-nha', 'cho', 1, 890000, false, ['M', 'L'], 4.6, 142, ''],
        ['Nệm ấm áp cho chó mèo mùa đông', 'chuong-nha', 'ca-hai', 6, 225000, false, ['S', 'M', 'L'], 4.7, 208, 'new'],
        ['Nhà gỗ hai tầng cho mèo', 'chuong-nha', 'meo', 5, 1250000, false, ['L'], 4.8, 56, 'hot'],
        ['Lồng vận chuyển nhựa cho thú cưng', 'chuong-nha', 'ca-hai', 6, 385000, true, ['M', 'L'], 4.5, 133, 'sale'],
        ['Giường võng treo cho mèo', 'chuong-nha', 'meo', 3, 165000, false, ['S', 'M'], 4.6, 187, ''],
        ['Chuồng lưới quây sân chơi cho chó con', 'chuong-nha', 'cho', 1, 650000, false, ['M'], 4.4, 64, ''],
        ['Đệm sofa mini cho thú cưng', 'chuong-nha', 'ca-hai', 5, 295000, false, ['S', 'M', 'L'], 4.7, 229, ''],
        ['Lều vải gấp gọn cho mèo', 'chuong-nha', 'meo', 3, 215000, false, ['S', 'M'], 4.5, 95, 'new'],

        ['Sữa tắm dịu nhẹ cho chó lông dài', 'cham-soc', 'cho', 4, 89000, false, [], 4.6, 321, ''],
        ['Cát vệ sinh mèo khử mùi vón cục 10kg', 'cham-soc', 'meo', 2, 175000, false, [], 4.8, 489, 'hot'],
        ['Vitamin tổng hợp hỗ trợ tiêu hóa', 'cham-soc', 'ca-hai', 4, 145000, true, [], 4.5, 142, 'sale'],
        ['Lược chải lông chống rụng', 'cham-soc', 'ca-hai', 6, 69000, false, [], 4.7, 276, ''],
        ['Nước súc miệng khử mùi cho chó', 'cham-soc', 'cho', 4, 55000, false, [], 4.4, 98, 'new'],
        ['Kem dưỡng ẩm mũi & chân cho thú cưng', 'cham-soc', 'ca-hai', 4, 79000, false, [], 4.6, 113, ''],
        ];
    }

    private function seedProducts(): void {
        if ($this->scalar("SELECT COUNT(*) FROM products") > 0) return;

        $categories = [];
        foreach ($this->query("SELECT id, slug FROM product_categories") as $c) { $categories[$c['slug']] = (int)$c['id']; }

        $BRANDS = ['PawFresh', 'PetKing', 'MeowMart', "Buddy's Choice", 'VetCare Pro', 'FurNest', 'PurePaw', 'Happy Tail'];
        // Ảnh Unsplash — cùng bộ ID đã verify HTTP 200 trong products-data.js gốc, cycle theo pet type.
        $IMG_DOG = ['1583337130417-3346a1be7dee', '1543466835-00a7907e9de1', '1552053831-71594a27632d', '1601758228041-f3b2795255f1', '1587300003388-59208cc962cb', '1560807707-8cc77767d783', '1548199973-03cce0bbc87b', '1618335829737-2228915674e0'];
        $IMG_CAT = ['1514888286974-6c03e2ca1dba', '1533738363-b7f9aef128ce', '1495360010541-f48722b34f7d', '1601979031925-424e53b6caaa', '1526336024174-e58f5cdd8e13', '1592194996308-7b43878e84a6', '1571566882372-1598d88abd90', '1548247416-ec66f4900b2e'];
        $IMG_GENERIC = ['1450778869180-41d0601e046e', '1596492784531-6e6eb5ea9993', '1583511655857-d19b40a7a54e', '1594149929911-78975a43d4f5', '1516371535707-512a1e83bb9a', '1583512603805-3cc6b41f3edb', '1591946614720-90a587da4a36', '1425082661705-1834bfd09dca', '1560743641-3914f2c45636', '1548681528-6a5c45b66b42', '1444212477490-ca407925329e', '1541364983171-a8ba01e95cfc', '1587764379873-97837921fd44', '1598133894008-61f7fdb8cc3a', '1548767797-d8c844163c4c', '1517423440428-a5a00ad493e8', '1541599468348-e96984315921', '1583468982228-19f19164aee2', '1516734212186-a967f81ad0d7', '1567016432779-094069958ea5', '1598214886806-c87b84b7078b', '1573497019940-1c28c88b4f3e', '1543852786-1cf6624b9987', '1544568100-847a948585b9', '1546975490-e8b92a360b24', '1601758003122-53c40e686a19', '1573865526739-10659fec78a5', '1620331311520-246422fd82f9', '1500462918059-b1a0cb512f1d'];

        $pickImage = function (string $petType, int $idx) use ($IMG_DOG, $IMG_CAT, $IMG_GENERIC): string {
            $pool = $petType === 'cho' ? $IMG_DOG : ($petType === 'meo' ? $IMG_CAT : $IMG_GENERIC);
            $id = $pool[$idx % count($pool)];
            return "https://images.unsplash.com/photo-{$id}?w=700&auto=format&fit=crop&q=80";
        };

        $stmt = $this->pdo->prepare(
            "INSERT INTO products
                (category_id, name, slug, image, price, price_sale, badge, description, colors, rating,
                 in_stock, is_featured, is_new, status, sort_order,
                 pet_type, brand, size, sold, gallery)
             VALUES (?,?,?,?,?,?,?,?,'',?,1,?,?,'published',?,?,?,?,?,?)"
        );

        $rows = $this->getPetSeedData();
        $sort = 0;
        foreach ($rows as $r) {
            [$name, $category, $petType, $brandIdx, $price, $hasSale, $sizes, $rating, $sold, $badge] = $r;
            $sort++;
            $id          = $sort;
            $slug        = slugify($name) . '-' . $id;
            $priceSale   = $hasSale ? (int)round($price * 0.8 / 1000) * 1000 : null;
            $brand       = $BRANDS[$brandIdx];
            $sizeCsv     = implode(',', $sizes);
            $isFeatured  = $badge === 'hot' ? 1 : 0;
            $isNew       = $badge === 'new' ? 1 : 0;
            $petLabel    = self::PET_LABEL[$petType] ?? $petType;
            $image       = $pickImage($petType, $sort - 1);
            $gallery     = implode('|', [
                $pickImage($petType, $sort - 1),
                $pickImage($petType, $sort - 1 + 7),
                $pickImage($petType === 'cho' ? 'meo' : 'cho', $sort - 1 + 3),
            ]);
            $description = "{$name} dành cho {$petLabel}, thương hiệu {$brand}. Sản phẩm được Pet Haus tuyển chọn kỹ về nguồn gốc, kiểm định an toàn trước khi lên kệ, phù hợp sử dụng hằng ngày cho bé cưng.";

            $stmt->execute([
                $categories[$category] ?? null,
                $name, $slug, $image, $price, $priceSale, $badge, $description, $rating,
                $isFeatured, $isNew, $sort,
                $petType, $brand, $sizeCsv, $sold, $gallery,
            ]);
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $rows = [
            ['Thu Hà', 'Khách hàng tại TP.HCM', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&auto=format&fit=crop&q=80',
                'Hạt khô ở đây bé nhà mình ăn rất hợp, lông mượt hẳn sau 2 tuần. Giao hàng cũng nhanh nữa.', 5, 1],
            ['Minh Quân', 'Khách hàng tại Hà Nội', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
                'Mua chuồng cho mèo, đóng gói chắc chắn, tư vấn kích cỡ rất kỹ trước khi đặt. Rất hài lòng!', 5, 2],
            ['Bảo Ngọc', 'Khách hàng tại Đà Nẵng', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
                'Đồ chơi bền, cún nhà mình cắn cả tháng chưa hỏng. Giá lại hợp lý so với chất lượng.', 4, 3],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO testimonials (author_name, author_role, author_avatar, content, rating, sort_order) VALUES (?, ?, ?, ?, ?, ?)");
        foreach ($rows as [$name, $role, $avatar, $content, $rating, $order]) {
            $stmt->execute([$name, $role, $avatar, $content, $rating, $order]);
        }
    }
}
