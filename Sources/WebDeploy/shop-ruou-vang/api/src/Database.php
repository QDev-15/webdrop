<?php
declare(strict_types=1);

// Database.php — file TỰ VIẾT HOÀN CHỈNH cho shop-ruou-vang (không dùng bản "extends \Database" mà
// scaffolder.mjs copy vào cho type=shop — bản đó thiếu class cha thật vì base scaffold Database.php
// bị ghi đè mất khi copy shop-specific stub, và seedSettings() gốc dùng sai tên cột "group" thay vì
// "grp" thật của schema.sql). Theo đúng fix đã áp dụng ở shop-dong-ho / shop-noi-that.
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
            ['site_name', 'Mộc Vang', 'general'],
            ['site_tagline', 'Rượu vang nhập khẩu chính hãng', 'general'],
            ['site_phone', '1900 6868', 'general'],
            ['site_email', 'hello@mocvang.vn', 'general'],
            ['site_address', '88 Đường Đồng Khởi, Quận 1, TP. Hồ Chí Minh', 'general'],
            ['working_hours', 'Thứ 2 – Chủ nhật: 9:00 – 21:00', 'general'],
            ['zalo_number', '0900000000', 'general'],
            ['map_embed_url', 'https://maps.google.com/maps?q=10.7769,106.7009&hl=vi&z=15&output=embed', 'general'],
            ['license_number', 'Giấy phép kinh doanh rượu số [XXXX/GP-KDR] · TP. Hồ Chí Minh', 'general'],

            // ── SEO ──────────────────────────────────────────────────────────────
            ['meta_title', 'Mộc Vang — Rượu Vang Nhập Khẩu Chính Hãng', 'seo'],
            ['meta_description', 'Mộc Vang — cửa hàng rượu vang nhập khẩu chính hãng: vang đỏ, vang trắng, vang sủi, vang hồng & set quà tặng từ Pháp, Ý, Chile, Tây Ban Nha, Úc, Argentina, Mỹ.', 'seo'],

            // ── Social ───────────────────────────────────────────────────────────
            ['facebook', '', 'social'],
            ['instagram', '', 'social'],
            ['youtube', '', 'social'],

            // ── Footer ───────────────────────────────────────────────────────────
            ['footer_about', 'Nhà nhập khẩu & phân phối rượu vang chính hãng — hơn 200 nhãn hiệu từ Pháp, Ý, Chile, Tây Ban Nha, Úc, Argentina, Mỹ. Bảo quản kho lạnh chuẩn 16°C, giao hàng toàn quốc.', 'footer'],

            // ── Payment (COD + SePay — bắt buộc theo rule shop) ─────────────────────
            ['payment_cod_enabled', '1', 'payment'],
            ['payment_sepay_enabled', '0', 'payment'],
            ['sepay_webhook_secret', '', 'payment'],
            ['sepay_bank_code', '', 'payment'],
            ['sepay_account_number', '', 'payment'],
            ['sepay_account_name', '', 'payment'],

            // ── Shop — miễn phí ship từ 1.000.000đ + đếm ngược khuyến mãi (khớp khuyen-mai.html gốc) ──
            ['shipping_fee', '30000', 'shop'],
            ['free_shipping_threshold', '1000000', 'shop'],
            ['sale_countdown_end', '2026-09-30T23:59:59', 'shop'],

            // ── SMTP ─────────────────────────────────────────────────────────────
            ['smtp_host', '', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from', '', 'smtp'],
            ['smtp_from_name', 'Mộc Vang', 'smtp'],

            // ── System ───────────────────────────────────────────────────────────
            ['maintenance_mode', '0', 'system'],

            // ── Cloudinary (tùy chọn) ────────────────────────────────────────────
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key', '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            ['cloudinary_folder', 'shop-ruou-vang', 'cloudinary'],

            // ── Integrations ─────────────────────────────────────────────────────
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];

        $stmt = $this->pdo->prepare("INSERT INTO settings (key, value, grp) VALUES (?, ?, ?)");
        foreach ($settings as [$key, $value, $group]) {
            $stmt->execute([$key, $value, $group]);
        }
    }

    private function seedHeroSlides(): void {
        // Template gốc dùng banner carousel 3 slide riêng (Mode A — banner mỏng, KHÔNG hero fullscreen)
        // render tĩnh/hardcode trong HeroSlider.tsx (mỗi slide có 2 nút CTA khác nhau — vượt quá
        // schema hero_slides 1-nút), không đọc từ bảng này — vẫn seed để trang quản trị "Hero Slides"
        // (module core scaffold) có dữ liệu mẫu, không rỗng.
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        $this->execute(
            "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
            [
                'Rượu vang tuyển chọn từ 7 vùng đất danh tiếng',
                'Hơn 200 nhãn hiệu vang đỏ, trắng, sủi & rosé từ Pháp, Ý, Chile, Tây Ban Nha, Úc, Argentina & Mỹ — bảo quản kho lạnh chuẩn 16°C.',
                'Khám phá bộ sưu tập',
                '/',
                'https://images.unsplash.com/photo-1543418219-44e30b057fea?w=1400&auto=format&fit=crop&q=80',
                1,
            ]
        );
    }

    private function seedProductCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM product_categories") > 0) return;
        $categories = [
            ['Vang đỏ', 'vang-do', 1],
            ['Vang trắng', 'vang-trang', 2],
            ['Vang sủi', 'vang-sui', 3],
            ['Vang hồng', 'vang-hong', 4],
            ['Set quà tặng', 'qua-tang-set', 5],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO product_categories (name, slug, sort_order) VALUES (?, ?, ?)");
        foreach ($categories as [$name, $slug, $order]) {
            $stmt->execute([$name, $slug, $order]);
        }
    }

    private const ORIGIN_LABEL = [
        'phap' => 'Pháp', 'y' => 'Ý', 'chile' => 'Chile', 'tay-ban-nha' => 'Tây Ban Nha',
        'argentina' => 'Argentina', 'uc' => 'Úc', 'my' => 'Mỹ', 'duc' => 'Đức', 'nam-phi' => 'Nam Phi',
    ];

    // 48 sản phẩm — copy nguyên nội dung thực (tên/slug/ảnh/giá/giá sale/badge/danh mục/xuất xứ/nồng độ
    // cồn/dung tích/dịp dùng/đánh giá/đã bán/tồn kho) từ
    // Sources/templates/web/Shops/shop-ruou-vang/assets/js/products-data.js (PRODUCTS). KHÔNG bịa dữ liệu.
    private function getWineSeedData(): array {
        return [
        ['Château Rousillon Bordeaux 2018', 'chateau-rousillon-bordeaux-2018-1', 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=600&auto=format&fit=crop&q=80', 620000, null, '', 'vang-do', 'phap', 13.5, 750, 'qua-tang,tiec-tung', 4.3, 29, 1],
        ['Domaine Lefèvre Pinot Noir 2020', 'domaine-lefevre-pinot-noir-2020-2', 'https://images.unsplash.com/photo-1562601579-599dec564e06?w=600&auto=format&fit=crop&q=80', 540000, 459000, 'sale', 'vang-do', 'phap', 13, 750, 'khai-vi,hang-ngay', 4, 66, 1],
        ['Château Maubec Saint-Émilion Grand Cru 2017', 'chateau-maubec-saint-emilion-grand-cru-2017-3', 'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=600&auto=format&fit=crop&q=80', 1850000, null, '', 'vang-do', 'phap', 14, 750, 'suu-tam,qua-tang', 4.7, 103, 1],
        ['Domaine Charnier Côtes du Rhône 2019', 'domaine-charnier-cotes-du-rhone-2019-4', 'https://images.unsplash.com/photo-1610631787813-9eeb1a2386cc?w=600&auto=format&fit=crop&q=80', 385000, null, '', 'vang-do', 'phap', 13.5, 750, 'hang-ngay', 4.4, 140, 1],
        ['Château Vasseur Médoc 2016', 'chateau-vasseur-medoc-2016-5', 'https://images.unsplash.com/photo-1611575189074-9dfbbceb258a?w=600&auto=format&fit=crop&q=80', 1450000, null, '', 'vang-do', 'phap', 13.5, 750, 'suu-tam,qua-tang', 4.1, 177, 1],
        ['Domaine Bellevue Bourgogne Rouge 2021', 'domaine-bellevue-bourgogne-rouge-2021-6', 'https://images.unsplash.com/photo-1600320183466-7198f22d3c8a?w=600&auto=format&fit=crop&q=80', 610000, 519000, 'sale', 'vang-do', 'phap', 13, 750, 'tiec-tung', 4.8, 214, 1],
        ['Château Delacroix Margaux 2015', 'chateau-delacroix-margaux-2015-7', 'https://images.unsplash.com/photo-1592119748016-a61c40a44320?w=600&auto=format&fit=crop&q=80', 3200000, null, '', 'vang-do', 'phap', 14, 750, 'suu-tam', 4.5, 251, 1],
        ['Domaine Fontenay Beaujolais 2022', 'domaine-fontenay-beaujolais-2022-8', 'https://images.unsplash.com/photo-1697115355209-46e7bce340fb?w=600&auto=format&fit=crop&q=80', 345000, null, 'new', 'vang-do', 'phap', 12.5, 750, 'hang-ngay', 4.2, 288, 1],
        ['Villa Rosso Chianti Classico Riserva 2018', 'villa-rosso-chianti-classico-riserva-2018-9', 'https://images.unsplash.com/photo-1611571940159-425a28706d6f?w=600&auto=format&fit=crop&q=80', 580000, null, '', 'vang-do', 'y', 13.5, 750, 'tiec-tung,qua-tang', 4.9, 325, 1],
        ['Casa Toscana Brunello di Montalcino 2017', 'casa-toscana-brunello-di-montalcino-2017-10', 'https://images.unsplash.com/photo-1632928945607-e4f8c7524707?w=600&auto=format&fit=crop&q=80', 1980000, 1683000, 'sale', 'vang-do', 'y', 14, 750, 'suu-tam,qua-tang', 4.6, 362, 1],
        ['Tenuta Alba Barolo 2016', 'tenuta-alba-barolo-2016-11', 'https://images.unsplash.com/photo-1592845148519-b0d41df97ac2?w=600&auto=format&fit=crop&q=80', 2350000, null, 'hot', 'vang-do', 'y', 14, 750, 'suu-tam', 4.3, 399, 1],
        ['Cantina Verona Amarone della Valpolicella 2019', 'cantina-verona-amarone-della-valpolicella-2019-12', 'https://images.unsplash.com/photo-1638186095900-179bc805de09?w=600&auto=format&fit=crop&q=80', 1690000, null, 'hot', 'vang-do', 'y', 15, 750, 'suu-tam,qua-tang', 4, 436, 1],
        ['Borgo Antico Nero d’Avola 2021', 'borgo-antico-nero-davola-2021-13', 'https://images.unsplash.com/photo-1700893417209-18dc88c989a0?w=600&auto=format&fit=crop&q=80', 395000, null, '', 'vang-do', 'y', 13, 750, 'hang-ngay', 4.7, 43, 1],
        ['Villa Marchetti Montepulciano d’Abruzzo 2020', 'villa-marchetti-montepulciano-dabruzzo-2020-14', 'https://images.unsplash.com/photo-1628187832510-94b4d90445af?w=600&auto=format&fit=crop&q=80', 420000, 357000, 'sale', 'vang-do', 'y', 13, 750, 'hang-ngay,khai-vi', 4.4, 80, 1],
        ['Viña del Sol Cabernet Sauvignon Reserva 2021', 'vina-del-sol-cabernet-sauvignon-reserva-2021-15', 'https://images.unsplash.com/photo-1695634580213-c384a6201eee?w=600&auto=format&fit=crop&q=80', 455000, null, '', 'vang-do', 'chile', 13.5, 750, 'tiec-tung', 4.1, 117, 1],
        ['Viña Andina Carmenère 2020', 'vina-andina-carmenere-2020-16', 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=600&auto=format&fit=crop&q=80', 410000, null, 'new', 'vang-do', 'chile', 13, 750, 'hang-ngay', 4.8, 154, 1],
        ['Bodega Cordillera Merlot 2022', 'bodega-cordillera-merlot-2022-17', 'https://images.unsplash.com/photo-1642340828763-822a676c1da3?w=600&auto=format&fit=crop&q=80', 320000, null, '', 'vang-do', 'chile', 13, 750, 'hang-ngay', 4.5, 191, 1],
        ['Viña Pacífico Cabernet Sauvignon 2019', 'vina-pacifico-cabernet-sauvignon-2019-18', 'https://images.unsplash.com/photo-1534655882117-f9eff36a1574?w=600&auto=format&fit=crop&q=80', 289000, 246000, 'sale', 'vang-do', 'chile', 13.5, 750, 'hang-ngay', 4.2, 228, 1],
        ['Bodega del Rey Rioja Reserva 2018', 'bodega-del-rey-rioja-reserva-2018-19', 'https://images.unsplash.com/photo-1536583308396-5e8dd8dff017?w=600&auto=format&fit=crop&q=80', 495000, null, '', 'vang-do', 'tay-ban-nha', 13.5, 750, 'tiec-tung,qua-tang', 4.9, 265, 1],
        ['Finca Real Ribera del Duero 2019', 'finca-real-ribera-del-duero-2019-20', 'https://images.unsplash.com/photo-1609238000857-303bf54099b1?w=600&auto=format&fit=crop&q=80', 660000, null, '', 'vang-do', 'tay-ban-nha', 14, 750, 'qua-tang', 4.6, 302, 1],
        ['Finca Andina Malbec Reserva 2020', 'finca-andina-malbec-reserva-2020-21', 'https://images.unsplash.com/photo-1529060532150-a0c935a6d6e5?w=600&auto=format&fit=crop&q=80', 470000, null, '', 'vang-do', 'argentina', 14, 750, 'tiec-tung', 4.3, 339, 1],
        ['Barossa Peak Shiraz 2019', 'barossa-peak-shiraz-2019-22', 'https://images.unsplash.com/photo-1615780324244-29b71ae12f7d?w=600&auto=format&fit=crop&q=80', 585000, 497000, 'sale', 'vang-do', 'uc', 14.5, 750, 'tiec-tung,qua-tang', 4, 376, 1],
        ['Domaine Clairvaux Chablis 2021', 'domaine-clairvaux-chablis-2021-23', 'https://images.unsplash.com/photo-1516154767575-2146adebdf32?w=600&auto=format&fit=crop&q=80', 590000, null, 'new', 'vang-trang', 'phap', 12.5, 750, 'khai-vi', 4.7, 413, 1],
        ['Château Sauvage Sauvignon Blanc 2022', 'chateau-sauvage-sauvignon-blanc-2022-24', 'https://images.unsplash.com/photo-1561955147-e9083536e573?w=600&auto=format&fit=crop&q=80', 365000, null, '', 'vang-trang', 'phap', 12.5, 750, 'hang-ngay', 4.4, 20, 1],
        ['Villa Chiara Pinot Grigio 2022', 'villa-chiara-pinot-grigio-2022-25', 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=600&auto=format&fit=crop&q=80', 335000, null, '', 'vang-trang', 'y', 12, 750, 'khai-vi,hang-ngay', 4.1, 57, 1],
        ['Casa Toscana Vermentino 2021', 'casa-toscana-vermentino-2021-26', 'https://images.unsplash.com/photo-1562601579-599dec564e06?w=600&auto=format&fit=crop&q=80', 355000, 302000, 'sale', 'vang-trang', 'y', 12.5, 750, 'hang-ngay', 4.8, 94, 1],
        ['Viña del Sol Sauvignon Blanc 2022', 'vina-del-sol-sauvignon-blanc-2022-27', 'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=600&auto=format&fit=crop&q=80', 275000, null, '', 'vang-trang', 'chile', 12.5, 750, 'khai-vi', 4.5, 131, 1],
        ['Viña Andina Chardonnay 2021', 'vina-andina-chardonnay-2021-28', 'https://images.unsplash.com/photo-1610631787813-9eeb1a2386cc?w=600&auto=format&fit=crop&q=80', 310000, null, 'new', 'vang-trang', 'chile', 13, 750, 'tiec-tung', 4.2, 168, 1],
        ['Barossa Peak Riesling 2021', 'barossa-peak-riesling-2021-29', 'https://images.unsplash.com/photo-1611575189074-9dfbbceb258a?w=600&auto=format&fit=crop&q=80', 420000, null, '', 'vang-trang', 'uc', 11.5, 750, 'khai-vi', 4.9, 205, 1],
        ['Bodega del Rey Albariño 2022', 'bodega-del-rey-albarino-2022-30', 'https://images.unsplash.com/photo-1600320183466-7198f22d3c8a?w=600&auto=format&fit=crop&q=80', 380000, 323000, 'sale', 'vang-trang', 'tay-ban-nha', 12.5, 750, 'khai-vi', 4.6, 242, 1],
        ['Weingut Rhein Riesling Kabinett 2021', 'weingut-rhein-riesling-kabinett-2021-31', 'https://images.unsplash.com/photo-1592119748016-a61c40a44320?w=600&auto=format&fit=crop&q=80', 530000, null, '', 'vang-trang', 'duc', 9.5, 750, 'khai-vi,qua-tang', 4.3, 279, 1],
        ['Finca Andina Torrontés 2022', 'finca-andina-torrontes-2022-32', 'https://images.unsplash.com/photo-1697115355209-46e7bce340fb?w=600&auto=format&fit=crop&q=80', 295000, null, '', 'vang-trang', 'argentina', 13, 750, 'hang-ngay', 4, 316, 1],
        ['Sonoma Ridge Chardonnay 2020', 'sonoma-ridge-chardonnay-2020-33', 'https://images.unsplash.com/photo-1611571940159-425a28706d6f?w=600&auto=format&fit=crop&q=80', 640000, null, '', 'vang-trang', 'my', 13.5, 750, 'tiec-tung,qua-tang', 4.7, 353, 1],
        ['Cape Winelands Chenin Blanc 2021', 'cape-winelands-chenin-blanc-2021-34', 'https://images.unsplash.com/photo-1632928945607-e4f8c7524707?w=600&auto=format&fit=crop&q=80', 285000, 242000, 'sale', 'vang-trang', 'nam-phi', 12.5, 750, 'hang-ngay', 4.4, 390, 1],
        ['Maison Dubois Champagne Brut', 'maison-dubois-champagne-brut-35', 'https://images.unsplash.com/photo-1580657274234-7339717f4541?w=600&auto=format&fit=crop&q=80', 1250000, null, 'hot', 'vang-sui', 'phap', 12, 750, 'tiec-tung,qua-tang', 4.1, 427, 1],
        ['Maison Dubois Champagne Rosé Brut', 'maison-dubois-champagne-rose-brut-36', 'https://images.unsplash.com/photo-1588138678946-fae725e0b6e1?w=600&auto=format&fit=crop&q=80', 1450000, null, '', 'vang-sui', 'phap', 12, 750, 'tiec-tung,qua-tang', 4.8, 34, 1],
        ['Château Rousillon Crémant de Bourgogne', 'chateau-rousillon-cremant-de-bourgogne-37', 'https://images.unsplash.com/photo-1628336707631-68131ca720c3?w=600&auto=format&fit=crop&q=80', 495000, null, 'new', 'vang-sui', 'phap', 12, 750, 'tiec-tung', 4.5, 71, 1],
        ['Villa Rosso Prosecco Extra Dry', 'villa-rosso-prosecco-extra-dry-38', 'https://images.unsplash.com/photo-1580657264608-44775e61c0a1?w=600&auto=format&fit=crop&q=80', 295000, 251000, 'sale', 'vang-sui', 'y', 11, 750, 'tiec-tung,hang-ngay', 4.2, 108, 1],
        ['Casa Toscana Prosecco Rosé', 'casa-toscana-prosecco-rose-39', 'https://images.unsplash.com/photo-1597075759290-5c29a23c8a16?w=600&auto=format&fit=crop&q=80', 320000, null, 'new', 'vang-sui', 'y', 11.5, 750, 'tiec-tung', 4.9, 145, 1],
        ['Bodega del Rey Cava Brut Nature', 'bodega-del-rey-cava-brut-nature-40', 'https://images.unsplash.com/photo-1546567075-d7113bee3c4a?w=600&auto=format&fit=crop&q=80', 265000, null, '', 'vang-sui', 'tay-ban-nha', 11.5, 750, 'tiec-tung', 4.6, 182, 1],
        ['Sonoma Ridge Sparkling Brut', 'sonoma-ridge-sparkling-brut-41', 'https://images.unsplash.com/photo-1669067166035-7e37abaecec8?w=600&auto=format&fit=crop&q=80', 540000, null, '', 'vang-sui', 'my', 12, 750, 'tiec-tung,qua-tang', 4.3, 219, 1],
        ['Viña del Sol Espumante Brut', 'vina-del-sol-espumante-brut-42', 'https://images.unsplash.com/photo-1643618829236-a23857519fb6?w=600&auto=format&fit=crop&q=80', 245000, 208000, 'sale', 'vang-sui', 'chile', 11.5, 750, 'hang-ngay,tiec-tung', 4, 256, 1],
        ['Château Provence Rosé 2022', 'chateau-provence-rose-2022-43', 'https://images.unsplash.com/photo-1592845148519-b0d41df97ac2?w=600&auto=format&fit=crop&q=80', 450000, null, '', 'vang-hong', 'phap', 12.5, 750, 'tiec-tung,khai-vi', 4.7, 293, 1],
        ['Villa Rosso Rosé di Puglia 2022', 'villa-rosso-rose-di-puglia-2022-44', 'https://images.unsplash.com/photo-1638186095900-179bc805de09?w=600&auto=format&fit=crop&q=80', 310000, null, '', 'vang-hong', 'y', 12, 750, 'khai-vi', 4.4, 330, 1],
        ['Viña Andina Rosé 2022', 'vina-andina-rose-2022-45', 'https://images.unsplash.com/photo-1700893417209-18dc88c989a0?w=600&auto=format&fit=crop&q=80', 265000, null, '', 'vang-hong', 'chile', 12, 750, 'hang-ngay', 4.1, 367, 1],
        ['Bodega del Rey Rosado 2022', 'bodega-del-rey-rosado-2022-46', 'https://images.unsplash.com/photo-1628187832510-94b4d90445af?w=600&auto=format&fit=crop&q=80', 290000, 247000, 'sale', 'vang-hong', 'tay-ban-nha', 12.5, 750, 'tiec-tung', 4.8, 404, 1],
        ['Set quà tặng Vang Đỏ Pháp – Hộp gỗ 2 chai', 'set-qua-tang-vang-do-phap-hop-go-2-chai-47', 'https://images.unsplash.com/photo-1592903297149-37fb25202dfa?w=600&auto=format&fit=crop&q=80', 1350000, null, 'hot', 'qua-tang-set', 'phap', 13.5, 1500, 'qua-tang', 4.5, 441, 1],
        ['Hộp quà Sưu tầm Vang Ý – 3 chai cao cấp', 'hop-qua-suu-tam-vang-y-3-chai-cao-cap-48', 'https://images.unsplash.com/photo-1625552186152-668cd2f0b707?w=600&auto=format&fit=crop&q=80', 2450000, null, '', 'qua-tang-set', 'y', 13.5, 2250, 'qua-tang,suu-tam', 4.2, 48, 1],
        ];
    }

    private function seedProducts(): void {
        if ($this->scalar("SELECT COUNT(*) FROM products") > 0) return;

        $categories = [];
        foreach ($this->query("SELECT id, slug FROM product_categories") as $c) { $categories[$c['slug']] = (int)$c['id']; }

        $stmt = $this->pdo->prepare(
            "INSERT INTO products
                (category_id, name, slug, image, price, price_sale, badge, description, colors, rating,
                 in_stock, is_featured, is_new, status, sort_order,
                 origin, abv, volume, occasion, sold)
             VALUES (?,?,?,?,?,?,?,?,'',?,?,?,?,'published',?,?,?,?,?,?)"
        );

        $sort = 0;
        foreach ($this->getWineSeedData() as $row) {
            [$name, $slug, $image, $price, $priceSale, $badge, $category, $origin, $abv, $volume, $occasion, $rating, $sold, $stock] = $row;
            $sort++;
            $isFeatured = $badge === 'hot' ? 1 : 0;
            $isNew      = $badge === 'new' ? 1 : 0;
            $volumeLabel = $category === 'qua-tang-set' ? ('Bộ ' . ($volume / 750) . ' chai') : ($volume . 'ml');
            $originLabel = self::ORIGIN_LABEL[$origin] ?? $origin;
            $description = "{$name} — nhập khẩu chính hãng từ {$originLabel}, nồng độ cồn {$abv}%, dung tích {$volumeLabel}. "
                . "Hương vị cân bằng, phù hợp thưởng thức cùng bạn bè, gia đình hoặc làm quà tặng ý nghĩa.";

            $stmt->execute([
                $categories[$category] ?? null,
                $name, $slug, $image, $price, $priceSale, $badge, $description, $rating,
                $stock, $isFeatured, $isNew, $sort,
                $origin, $abv, $volume, $occasion, $sold,
            ]);
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $rows = [
            ['Minh Anh', 'Giám đốc kinh doanh, TP.HCM', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
                'Đặt set quà tặng cho đối tác dịp Tết, đóng gói rất sang, vang Bordeaux uống mềm mượt. Giao đúng hẹn dù đặt gấp.', 5, 1],
            ['Hoàng Long', 'Khách hàng thân thiết, Hà Nội', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=80',
                'Thích nhất là được tư vấn theo món ăn trước khi mua — chọn đúng chai Chianti hợp với bữa tiệc sinh nhật, cả nhà đều khen.', 5, 2],
            ['Thu Trang', 'Cô dâu, Đà Nẵng', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
                'Mua vang sủi cho tiệc cưới, giá tốt hơn hẳn ngoài cửa hàng mà vẫn chính hãng có tem phụ đầy đủ. Sẽ quay lại mua tiếp.', 5, 3],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO testimonials (author_name, author_role, author_avatar, content, rating, sort_order) VALUES (?, ?, ?, ?, ?, ?)");
        foreach ($rows as [$name, $role, $avatar, $content, $rating, $order]) {
            $stmt->execute([$name, $role, $avatar, $content, $rating, $order]);
        }
    }

    private function seedCoupons(): void {
        if ($this->scalar("SELECT COUNT(*) FROM coupons") > 0) return;
        $rows = [
            ['VANG50', 'Giảm 50.000₫ cho đơn hàng từ 500.000₫', 1],
            ['FREESHIP', 'Miễn phí vận chuyển toàn quốc, không giới hạn giá trị đơn', 2],
            ['VIP10', 'Giảm thêm 10% khi mua set quà tặng cao cấp', 3],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO coupons (code, description, sort_order) VALUES (?, ?, ?)");
        foreach ($rows as [$code, $desc, $order]) {
            $stmt->execute([$code, $desc, $order]);
        }
    }
}
