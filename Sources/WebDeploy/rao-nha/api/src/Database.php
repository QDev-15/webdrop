<?php
declare(strict_types=1);

class Database {
    private \PDO $pdo;
    private static ?Database $instance = null;

    private function __construct() {
        $dbDir = dirname(DB_FILE);
        if (!is_dir($dbDir)) {
            mkdir($dbDir, 0755, true);
        }
        $this->pdo = new \PDO('sqlite:' . DB_FILE);
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->pdo->exec('PRAGMA journal_mode = WAL');
        $this->migrate();
    }

    public static function getInstance(): self {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function migrate(): void {
        $schemaPath = __DIR__ . '/../schema.sql';
        $schema = file_get_contents($schemaPath);
        if ($schema === false) {
            throw new \RuntimeException('schema.sql not found: ' . $schemaPath);
        }
        // Strip toàn bộ comment "--" (cả dòng riêng lẫn comment cuối dòng) TRƯỚC khi split theo ';'
        // — bắt buộc vì 1 số comment cuối dòng trong schema.sql có chứa dấu ';' (vd giải thích cột),
        // nếu không strip trước sẽ làm split(';') cắt nhầm giữa câu lệnh CREATE TABLE.
        $schema = preg_replace('/--.*$/m', '', $schema);
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
        $this->seedExtensions();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Core seeds
    // ─────────────────────────────────────────────────────────────────────────

    private function seedUsers(): void {
        if ($this->scalar("SELECT COUNT(*) FROM users") > 0) return;
        $this->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['Admin', 'sysadmin@admin.com', password_hash('123456', PASSWORD_BCRYPT), 'superadmin']
        );
    }

    private function seedSettings(): void {
        if ($this->scalar("SELECT COUNT(*) FROM settings") > 0) return;
        $settings = [
            // general
            ['site_name', 'RaoNhà', 'general'],
            ['site_tagline', 'Sàn giao dịch bất động sản trực tuyến', 'general'],
            ['site_description', 'RaoNhà — nền tảng đăng tin và tìm kiếm bất động sản trực tuyến: chung cư, nhà phố, đất nền, biệt thự, shophouse tại Hà Nội, TP.HCM, Đà Nẵng. Đăng tin miễn phí, kết nối trực tiếp người mua - người bán.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hotro@raonha.vn', 'general'],
            ['site_phone', '1900 6789', 'general'],
            ['site_address', 'Tầng 8, Tòa nhà Sunrise, Đường Xuân Thủy, Cầu Giấy, Hà Nội', 'general'],
            ['working_hours', '7:30 - 21:00 hằng ngày', 'general'],
            // seo
            ['meta_title', 'RaoNhà — Sàn giao dịch bất động sản trực tuyến', 'seo'],
            ['meta_description', 'Tìm mua, tìm thuê hoặc đăng tin bán/cho thuê chung cư, nhà phố, đất nền, biệt thự, shophouse tại Hà Nội, TP.HCM, Đà Nẵng.', 'seo'],
            ['meta_keywords', 'bất động sản, mua bán nhà đất, cho thuê nhà, chung cư, đất nền, RaoNhà', 'seo'],
            // social
            ['social_facebook', '#', 'social'],
            ['social_zalo', 'https://zalo.me/19006789', 'social'],
            ['social_youtube', '#', 'social'],
            // footer
            ['footer_copyright', '© 2026 RaoNhà. Mọi quyền được bảo lưu.', 'footer'],
            ['footer_description', 'Sàn giao dịch bất động sản trực tuyến — kết nối trực tiếp người mua, người thuê với chính chủ, môi giới tự do và công ty môi giới trên khắp Việt Nam.', 'footer'],
            ['footer_office', 'Văn phòng đại diện: Cầu Giấy, Hà Nội', 'footer'],
            ['footer_map_embed', 'https://maps.google.com/maps?q=21.0308,105.7988&hl=vi&z=15&output=embed', 'footer'],
            // contact
            ['contact_hotline', '1900 6789', 'contact'],
            ['contact_email', 'hotro@raonha.vn', 'contact'],
            ['contact_address', 'Tầng 8, Tòa nhà Sunrise, Đường Xuân Thủy, Cầu Giấy, Hà Nội', 'contact'],
            // shop (số liệu bằng số cho stat-bar)
            ['stat_listings', '12500', 'about'],
            ['stat_members', '3200', 'about'],
            ['stat_areas', '15', 'about'],
            ['stat_visits', '850', 'about'],
            // payment — SePay + chuyển khoản thủ công cho nạp credit
            ['payment_sepay_enabled', '0', 'payment'],
            ['payment_manual_enabled', '1', 'payment'],
            ['sepay_bank_code', 'VCB', 'payment'],
            ['sepay_bank_name', 'Vietcombank — CN Cầu Giấy', 'payment'],
            ['sepay_account_number', '0071000123456', 'payment'],
            ['sepay_account_name', 'CTY TNHH RAONHA VIET NAM', 'payment'],
            ['sepay_webhook_secret', 'change-this-webhook-secret', 'payment'],
            // smtp / cloudinary / integrations — để trống, khách tự điền khi cần
            ['smtp_host', '', 'smtp'], ['smtp_port', '587', 'smtp'], ['smtp_user', '', 'smtp'], ['smtp_pass', '', 'smtp'],
            ['cloudinary_cloud_name', '', 'cloudinary'], ['cloudinary_api_key', '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'], ['cloudinary_folder', 'rao-nha', 'cloudinary'],
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];
        foreach ($settings as [$key, $value, $group]) {
            $this->execute(
                "INSERT OR IGNORE INTO settings (key, value, grp) VALUES (?, ?, ?)",
                [$key, $value, $group]
            );
        }
    }

    /**
     * Hero slides — encode thêm dữ liệu vào 2 cột core sẵn có (không đổi schema core):
     *   subtitle = "label||mô tả"  (label hiển thị nhỏ phía trên tiêu đề)
     *   image    = 3 URL cách nhau bằng xuống dòng (khớp đúng .rn-hero-grid 3 ảnh/slide của template gốc)
     * Tiêu đề dùng cú pháp *chữ*  để in nghiêng màu accent (giống <em> trong HTML gốc) — HeroSlider.tsx tự parse.
     */
    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        $slides = [
            [
                'title' => 'Tìm nhà đất nhanh chóng — *giao dịch an tâm* cùng RaoNhà',
                'label' => 'Sàn giao dịch bất động sản trực tuyến',
                'desc' => 'Hàng nghìn tin đăng từ chính chủ, môi giới tự do và công ty môi giới trên khắp Hà Nội, TP.HCM, Đà Nẵng — cập nhật mỗi ngày, kiểm duyệt trước khi hiển thị.',
                'button_text' => 'Xem tất cả tin đăng',
                'button_link' => '/bat-dong-san',
                'images' => ['1518780664697-55e3ad937233,700', '1600596542815-ffad4c1539a9,500', '1600585154340-be6161a56a0c,500'],
                'sort_order' => 1,
            ],
            [
                'title' => 'Chung cư, nhà phố, đất nền, biệt thự, *shophouse*',
                'label' => 'Đa dạng loại hình',
                'desc' => 'Dù bạn tìm căn hộ đầu tiên, nhà phố an cư hay đất nền đầu tư, RaoNhà đều có bộ lọc chi tiết theo giá, diện tích, hướng nhà và pháp lý.',
                'button_text' => 'Khám phá ngay',
                'button_link' => '/bat-dong-san',
                'images' => ['1512917774080-9991f1c4c750,700', '1580587771525-78b9dba3b914,500', '1449844908441-8829872d2607,500'],
                'sort_order' => 2,
            ],
            [
                'title' => 'Hà Nội — TP.HCM — *Đà Nẵng*',
                'label' => 'Phủ khắp 3 thành phố lớn',
                'desc' => 'Hơn 12.500 tin đăng đang hoạt động tại 15 khu vực trọng điểm — lọc theo đúng quận/thành phố bạn quan tâm chỉ trong vài giây.',
                'button_text' => 'Xem theo khu vực',
                'button_link' => '/bat-dong-san',
                'images' => ['1583417319070-4a69db38a482,700', '1555431189-0fabf2667795,500', '1470004914212-05527e49370b,500'],
                'sort_order' => 3,
            ],
            [
                'title' => 'Đăng tin miễn phí — *nâng cấp VIP* khi cần bán nhanh',
                'label' => 'Dành cho người bán & môi giới',
                'desc' => 'Chọn gói Tin thường miễn phí hoặc nâng cấp VIP Bạc/Vàng/Kim Cương để tin đăng luôn ở vị trí ưu tiên, tiếp cận nhiều người mua hơn.',
                'button_text' => 'Đăng tin ngay',
                'button_link' => '/dang-tin',
                'images' => ['1523217582562-09d0def993a6,700', '1560448204-e02f11c3d0e2,500', '1613490493576-7fde63acd811,500'],
                'sort_order' => 4,
            ],
        ];
        foreach ($slides as $slide) {
            $imgUrls = array_map(function ($spec) {
                [$id, $w] = explode(',', $spec);
                return self::unsplash($id, (int)$w);
            }, $slide['images']);
            $this->execute(
                "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                [$slide['title'], $slide['label'] . '||' . $slide['desc'], $slide['button_text'], $slide['button_link'], implode("\n", $imgUrls), $slide['sort_order']]
            );
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Extension seeds — accounts / listings / listing_packages / faqs / articles / testimonials
    // ─────────────────────────────────────────────────────────────────────────

    protected function seedExtensions(): void {
        $accountIds = $this->seedAccounts();
        $this->seedListingPackages();
        $this->seedListings($accountIds);
        $this->seedWalletTransactions($accountIds);
        $this->seedFaqs();
        $this->seedArticles();
        $this->seedTestimonials();
    }

    /** @return array<int,int> map poster-index(0-based) => accounts.id thật trong DB */
    private function seedAccounts(): array {
        if ($this->scalar("SELECT COUNT(*) FROM accounts") > 0) {
            $rows = $this->query("SELECT id FROM accounts ORDER BY id");
            return array_map(fn($r) => (int)$r['id'], $rows);
        }
        $posters = self::posters();
        $hash = password_hash('123456', PASSWORD_BCRYPT);
        $ids = [];
        foreach ($posters as $i => $p) {
            $email = slugify($p['name']) . '@demo.vn';
            $credit = 100000 + (($i * 53) % 8) * 50000; // 100k .. 450k, xen kẽ
            $id = $this->execute(
                "INSERT INTO accounts (name, email, phone, password, role, avatar, credit_balance, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'active')",
                [$p['name'], $email, $p['phone'], $hash, $p['role'], $p['avatar'], $credit]
            );
            $ids[] = (int)$id;
        }
        return $ids;
    }

    private function seedListingPackages(): void {
        if ($this->scalar("SELECT COUNT(*) FROM listing_packages") > 0) return;
        $rows = [
            ['thuong', 'Tin thường', 0, 30, ['Hiển thị 30 ngày', 'Xếp theo thời gian đăng', '1 lần làm mới/ngày', 'Không có badge ưu tiên'], 1],
            ['vip-bac', 'VIP Bạc', 99000, 15, ['Ưu tiên hiển thị nhóm 2', 'Badge "VIP Bạc"', '3 lần làm mới/ngày', 'Thống kê lượt xem cơ bản'], 2],
            ['vip-vang', 'VIP Vàng', 299000, 15, ['Ưu tiên hiển thị nhóm 1', 'Badge "VIP Vàng" nổi bật', '5 lần làm mới/ngày', 'Xuất hiện luân phiên trang chủ'], 3],
            ['vip-kim-cuong', 'VIP Kim Cương', 699000, 15, ['Luôn ở vị trí đầu danh sách', 'Badge "VIP Kim Cương" đặc biệt', 'Làm mới không giới hạn', 'Ưu tiên khối "Tin nổi bật" trang chủ'], 4],
        ];
        foreach ($rows as [$tier, $label, $price, $days, $benefits, $sort]) {
            $this->execute(
                "INSERT INTO listing_packages (tier, label, price, duration_days, benefits, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                [$tier, $label, $price, $days, implode('|', $benefits), $sort]
            );
        }
    }

    private function seedWalletTransactions(array $accountIds): void {
        if (!$accountIds) return;
        if ($this->scalar("SELECT COUNT(*) FROM wallet_transactions") > 0) return;
        $accId = $accountIds[0];
        $rows = [
            [$this->daysAgo(18), 'nap', 200000, 'chuyen-khoan-thu-cong', 'Nạp credit vào ví', 'completed'],
            [$this->daysAgo(18), 'tru', 99000, 'he-thong', 'Mua gói VIP Bạc cho 1 tin đăng', 'completed'],
            [$this->daysAgo(10), 'nap', 300000, 'chuyen-khoan-thu-cong', 'Nạp credit vào ví', 'completed'],
            [$this->daysAgo(10), 'tru', 299000, 'he-thong', 'Mua gói VIP Vàng cho 1 tin đăng', 'completed'],
        ];
        foreach ($rows as [$date, $type, $amount, $method, $note, $status]) {
            $this->execute(
                "INSERT INTO wallet_transactions (account_id, type, amount, method, note, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [$accId, $type, $amount, $method, $note, $status, $date]
            );
        }
    }

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $rows = [
            ['Tìm kiếm và liên hệ người bán trên RaoNhà có mất phí không?', 'Hoàn toàn miễn phí. Người mua/thuê có thể tìm kiếm, lọc tin đăng và xem thông tin liên hệ (số điện thoại, Zalo) của người đăng tin mà không phải trả bất kỳ khoản phí nào cho RaoNhà.'],
            ['Làm sao biết tin đăng là thật, không phải lừa đảo?', 'Mọi tin đăng đều được đội ngũ RaoNhà kiểm duyệt nội dung và xác minh số điện thoại người đăng trước khi hiển thị công khai. Tuy vậy, người mua vẫn nên kiểm tra trực tiếp giấy tờ pháp lý và gặp mặt trước khi đặt cọc.'],
            ['Gói tin VIP khác gì tin thường?', 'Tin VIP (Bạc/Vàng/Kim Cương) được ưu tiên hiển thị ở vị trí đầu danh sách và trang chủ, có badge nổi bật, kèm số lần làm mới tin tự động — giúp tiếp cận nhiều người mua/thuê hơn so với Tin thường hiển thị theo thứ tự thời gian đăng.'],
            ['Tôi có thể đăng tin miễn phí không?', 'Có. Gói Tin thường hoàn toàn miễn phí và không giới hạn số lượng tin đăng cơ bản. Bạn chỉ trả phí nếu muốn nâng cấp lên các gói VIP để tăng khả năng tiếp cận.'],
            ['RaoNhà có hỗ trợ tính toán vay ngân hàng không?', 'Có. Mỗi trang chi tiết bất động sản đều có công cụ ước tính khoản trả góp hàng tháng dựa trên giá nhà, tỷ lệ vay, lãi suất và thời hạn vay bạn nhập vào — mang tính tham khảo, vui lòng liên hệ ngân hàng để biết mức lãi suất chính xác.'],
            ['Làm sao liên hệ trực tiếp với người đăng tin?', 'Trên mỗi trang chi tiết bất động sản đều có thẻ "Người đăng tin" hiển thị tên, vai trò (chính chủ/môi giới tự do/công ty môi giới), số điện thoại và nút gọi/Zalo trực tiếp — không qua tổng đài trung gian.'],
            ['Tôi phát hiện tin đăng sai thông tin, báo cáo ở đâu?', 'Bạn có thể liên hệ qua trang Liên hệ hoặc hotline 1900 6789 để báo cáo tin đăng có dấu hiệu sai lệch thông tin hoặc lừa đảo — đội ngũ kiểm duyệt sẽ xác minh và xử lý trong 24 giờ.'],
            ['RaoNhà hiện có mặt ở những khu vực nào?', 'Hiện tại RaoNhà tập trung tại 15 khu vực thuộc Hà Nội, TP.HCM và Đà Nẵng, và đang tiếp tục mở rộng sang các tỉnh thành khác trong thời gian tới.'],
        ];
        foreach ($rows as $i => [$q, $a]) {
            $this->execute("INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)", [$q, $a, $i + 1]);
        }
    }

    private function seedArticles(): void {
        if ($this->scalar("SELECT COUNT(*) FROM articles") > 0) return;
        foreach (self::articles() as $a) {
            $this->execute(
                "INSERT INTO articles (title, slug, category, thumbnail, excerpt, content, author, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [$a['title'], $a['slug'], $a['category'], $a['thumb'], $a['excerpt'], $a['content'], $a['author'], $a['date'] . ' 08:00:00']
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $rows = [
            ['Nguyễn Thu Hằng', 'Người mua nhà tại Cầu Giấy, Hà Nội', $this->unsplash('1500917293891-ef795e70e1f6', 200),
                '"Tôi lọc theo đúng khoảng giá và khu vực Cầu Giấy, tìm được căn hộ ưng ý chỉ sau 3 ngày. Bộ lọc pháp lý/hướng nhà rất chi tiết, đúng thứ tôi cần khi mua nhà lần đầu."'],
            ['Trần Quốc Huy', 'Chủ nhà đăng tin bán tại Quận 7, TP.HCM', $this->unsplash('1607746882042-944635dfe10e', 200),
                '"Đăng tin gói VIP Vàng chưa đầy một tuần đã có hơn 20 cuộc gọi hỏi mua. Trước đó đăng tin thường mãi không ai liên hệ, nâng gói là quyết định đúng đắn."'],
            ['Lê Minh Tuấn', 'Môi giới tự do', $this->unsplash('1522075469751-3a6694fb2f61', 200),
                '"Là môi giới tự do, RaoNhà giúp tôi quản lý nhiều tin đăng cùng lúc và tiếp cận khách hàng ở cả 3 thành phố mà không cần văn phòng riêng."'],
            ['Phạm Thu Hà', 'Chính chủ cho thuê tại Tây Hồ, Hà Nội', $this->unsplash('1487412720507-e7ab37603c6f', 200),
                '"Cho thuê căn hộ dịch vụ của mình chỉ sau 5 ngày đăng tin, người thuê liên hệ trực tiếp qua số điện thoại hiển thị, không mất phí môi giới trung gian."'],
            ['Đặng Thị Lan', 'Chính chủ bán căn hộ tại Hà Đông', $this->unsplash('1519345182560-3f2917c472ef', 200),
                '"Sau 2 tuần đăng tin gói VIP Bạc, tôi bán được căn hộ ở Hà Đông đúng giá mong muốn, người mua liên hệ trực tiếp qua số điện thoại hiển thị trên tin."'],
            ['Võ Thành Đạt', 'Nhà đầu tư đất nền tại TP. Thủ Đức', $this->unsplash('1506794778202-cad84cf45f1d', 200),
                '"Tôi dùng bộ lọc pháp lý và diện tích để tìm đất nền ở Thủ Đức, tiết kiệm rất nhiều thời gian so với đi xem thực tế từng lô như trước."'],
            ['Huỳnh Ngọc Bích', 'Người thuê căn hộ dịch vụ tại Hải Châu, Đà Nẵng', $this->unsplash('1508214751196-bcfd4ca60f91', 200),
                '"Thuê được căn hộ dịch vụ ở Đà Nẵng chỉ trong 3 ngày, làm việc trực tiếp với chủ nhà qua Zalo, không mất phí môi giới trung gian."'],
        ];
        foreach ($rows as $i => [$name, $role, $avatar, $content]) {
            $this->execute(
                "INSERT INTO testimonials (name, role, avatar, content, rating, sort_order) VALUES (?, ?, ?, ?, 5, ?)",
                [$name, $role, $avatar, $content, $i + 1]
            );
        }
    }

    /**
     * Sinh 44 tin đăng theo đúng công thức của template gốc (assets/js/properties-data.js)
     * — cùng seed formula (i=0..43) để giữ đúng phân bố loại hình/khu vực/giá/tier như bản HTML tĩnh.
     */
    private function seedListings(array $accountIds): void {
        if (!$accountIds) return;
        if ($this->scalar("SELECT COUNT(*) FROM listings") > 0) return;

        $areas = self::areas();
        $streets = self::streets();
        $typeKeys = array_keys(self::typeLabels());
        $directionKeys = array_keys(self::directionLabels());
        $legalKeys = array_keys(self::legalLabels());
        $furnishKeys = array_keys(self::furnishingLabels());
        $tierDuration = self::tierDurationDays();
        $today = new \DateTimeImmutable('now'); // "hôm nay" = ngày build/seed thật của site

        for ($i = 0; $i < 44; $i++) {
            $area = $areas[$i % count($areas)];
            $type = $typeKeys[$i % count($typeKeys)];
            $need = self::needFor($i, $type);
            $s = self::specsFor($type, $i);
            $direction = $directionKeys[$i % count($directionKeys)];
            $legal = $type === 'dat-nen' ? 'so-do' : $legalKeys[$i % count($legalKeys)];
            $furnishing = $type === 'dat-nen' ? 'tho' : $furnishKeys[$i % count($furnishKeys)];
            $tier = self::tierFor($i);
            $daysAgo = ($i * 3 + 1) % 60;
            $price = self::calcRawPrice($type, $need, $s['area'], $area['city']);
            $title = self::buildTitle($type, $need, $s, $area['label']);
            $posted = $today->modify("-{$daysAgo} days");
            $duration = $tierDuration[$tier] ?? 30;
            $expires = $posted->modify("+{$duration} days");
            $street = $streets[$area['city']][$i % count($streets[$area['city']])];
            $features = [];
            for ($k = 0; $k < 4; $k++) {
                $pool = self::featurePool()[$type];
                $features[] = $pool[($i + $k) % count($pool)];
            }
            $images = self::pickImages($i, 6);
            $description = self::buildDescription($type, $need, $s, $direction, $legal, $furnishing, $area['label']);

            $slugBase = slugify($title);
            $slug = $slugBase . '-' . ($i + 1);

            $accountId = $accountIds[$i % count($accountIds)];

            $this->execute(
                "INSERT INTO listings
                    (account_id, title, slug, listing_type, property_type, price, area, bedrooms, bathrooms,
                     direction, legal_status, furnishing, district, city, address, lat, lng, description,
                     features, images, tier, status, posted_at, expires_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?, ?)",
                [
                    $accountId, $title, $slug, $need, $type, $price, $s['area'], $s['bedrooms'], $s['bathrooms'],
                    $direction, $legal, $furnishing, $area['label'], $area['city'],
                    "Đường {$street}, {$area['label']}, {$area['city']}",
                    $area['lat'] + (($i % 7) - 3) * 0.0035,
                    $area['lng'] + (($i % 5) - 2) * 0.0035,
                    $description, implode('|', $features), implode('|', $images), $tier,
                    $posted->format('Y-m-d H:i:s'), $expires->format('Y-m-d H:i:s'),
                ]
            );
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Dữ liệu tham chiếu — port 1:1 từ assets/js/properties-data.js (template gốc)
    // ─────────────────────────────────────────────────────────────────────────

    public static function typeLabels(): array {
        return [
            'chung-cu' => 'Chung cư', 'nha-pho' => 'Nhà phố', 'dat-nen' => 'Đất nền',
            'biet-thu' => 'Biệt thự', 'shophouse' => 'Shophouse', 'can-ho-dich-vu' => 'Căn hộ dịch vụ',
        ];
    }
    public static function directionLabels(): array {
        return [
            'dong' => 'Đông', 'tay' => 'Tây', 'nam' => 'Nam', 'bac' => 'Bắc',
            'dong-nam' => 'Đông Nam', 'dong-bac' => 'Đông Bắc', 'tay-nam' => 'Tây Nam', 'tay-bac' => 'Tây Bắc',
        ];
    }
    public static function legalLabels(): array {
        return [
            'so-do' => 'Sổ đỏ', 'so-hong' => 'Sổ hồng',
            'hop-dong-mua-ban' => 'Hợp đồng mua bán', 'dang-cho-so' => 'Đang chờ sổ',
        ];
    }
    public static function furnishingLabels(): array {
        return ['day-du' => 'Đầy đủ nội thất', 'co-ban' => 'Nội thất cơ bản', 'tho' => 'Nhà thô'];
    }
    public static function roleLabels(): array {
        return ['moi-gioi-tu-do' => 'Môi giới tự do', 'chinh-chu' => 'Chính chủ', 'cong-ty-moi-gioi' => 'Công ty môi giới'];
    }
    public static function tierLabels(): array {
        return ['thuong' => 'Tin thường', 'vip-bac' => 'VIP Bạc', 'vip-vang' => 'VIP Vàng', 'vip-kim-cuong' => 'VIP Kim Cương'];
    }
    public static function tierOrder(): array {
        return ['vip-kim-cuong' => 0, 'vip-vang' => 1, 'vip-bac' => 2, 'thuong' => 3];
    }
    public static function tierDurationDays(): array {
        return ['thuong' => 30, 'vip-bac' => 15, 'vip-vang' => 15, 'vip-kim-cuong' => 15];
    }

    private static function areas(): array {
        return [
            ['slug' => 'cau-giay-ha-noi', 'label' => 'Cầu Giấy', 'city' => 'Hà Nội', 'lat' => 21.0308, 'lng' => 105.7988],
            ['slug' => 'dong-da-ha-noi', 'label' => 'Đống Đa', 'city' => 'Hà Nội', 'lat' => 21.0136, 'lng' => 105.8258],
            ['slug' => 'hai-ba-trung-ha-noi', 'label' => 'Hai Bà Trưng', 'city' => 'Hà Nội', 'lat' => 21.0075, 'lng' => 105.8567],
            ['slug' => 'tay-ho-ha-noi', 'label' => 'Tây Hồ', 'city' => 'Hà Nội', 'lat' => 21.0687, 'lng' => 105.8194],
            ['slug' => 'long-bien-ha-noi', 'label' => 'Long Biên', 'city' => 'Hà Nội', 'lat' => 21.0473, 'lng' => 105.8890],
            ['slug' => 'ha-dong-ha-noi', 'label' => 'Hà Đông', 'city' => 'Hà Nội', 'lat' => 20.9715, 'lng' => 105.7783],
            ['slug' => 'nam-tu-liem-ha-noi', 'label' => 'Nam Từ Liêm', 'city' => 'Hà Nội', 'lat' => 21.0138, 'lng' => 105.7615],
            ['slug' => 'quan-1-hcm', 'label' => 'Quận 1', 'city' => 'TP.HCM', 'lat' => 10.7769, 'lng' => 106.7009],
            ['slug' => 'quan-7-hcm', 'label' => 'Quận 7', 'city' => 'TP.HCM', 'lat' => 10.7329, 'lng' => 106.7218],
            ['slug' => 'binh-thanh-hcm', 'label' => 'Bình Thạnh', 'city' => 'TP.HCM', 'lat' => 10.8106, 'lng' => 106.7091],
            ['slug' => 'thu-duc-hcm', 'label' => 'TP. Thủ Đức', 'city' => 'TP.HCM', 'lat' => 10.8494, 'lng' => 106.7537],
            ['slug' => 'tan-binh-hcm', 'label' => 'Tân Bình', 'city' => 'TP.HCM', 'lat' => 10.8014, 'lng' => 106.6528],
            ['slug' => 'hai-chau-da-nang', 'label' => 'Hải Châu', 'city' => 'Đà Nẵng', 'lat' => 16.0544, 'lng' => 108.2208],
            ['slug' => 'son-tra-da-nang', 'label' => 'Sơn Trà', 'city' => 'Đà Nẵng', 'lat' => 16.0730, 'lng' => 108.2450],
            ['slug' => 'ngu-hanh-son-da-nang', 'label' => 'Ngũ Hành Sơn', 'city' => 'Đà Nẵng', 'lat' => 15.9980, 'lng' => 108.2540],
        ];
    }

    private static function streets(): array {
        return [
            'Hà Nội' => ['Nguyễn Trãi', 'Trần Duy Hưng', 'Xuân Thủy', 'Kim Mã', 'Láng Hạ', 'Nguyễn Chí Thanh', 'Hoàng Quốc Việt', 'Lạc Long Quân'],
            'TP.HCM' => ['Nguyễn Văn Linh', 'Lê Văn Lương', 'Nguyễn Hữu Thọ', 'Phạm Văn Đồng', 'Nguyễn Thị Thập', 'Huỳnh Tấn Phát', 'Cách Mạng Tháng Tám'],
            'Đà Nẵng' => ['Bạch Đằng', 'Võ Nguyên Giáp', 'Nguyễn Văn Thoại', 'Trần Hưng Đạo', 'Ngô Quyền'],
        ];
    }

    private static function propertyImageIds(): array {
        return [
            '1518780664697-55e3ad937233','1613977257363-707ba9348227','1570129477492-45c003edd2be',
            '1600585154340-be6161a56a0c','1600596542815-ffad4c1539a9','1600607687939-ce8a6c25118c',
            '1600607687920-4e2a09cf159d','1600566753086-00f18fb6b3ea','1600585154526-990dced4db0d',
            '1600047509807-ba8f99d2cdde','1600566752355-35792bedcfea','1600585152915-d208bec867a1',
            '1512917774080-9991f1c4c750','1493809842364-78817add7ffb','1449844908441-8829872d2607',
            '1502672260266-1c1ef2d93688','1523217582562-09d0def993a6','1484154218962-a197022b5858',
            '1560448204-e02f11c3d0e2','1560184611-ff3e53f00e8f','1560185007-c5ca9d2c014d',
            '1560185127-6ed189bf02f4','1571055107559-3e67626fa8be','1574362848149-11496d93a7c7',
            '1600121848594-d8644e57abab','1600573472550-8090b5e0745e','1613490493576-7fde63acd811',
            '1580587771525-78b9dba3b914','1568605114967-8130f3a36994','1554995207-c18c203602cb',
            '1600566753151-384129cf4e3e','1523755231516-e43fd2e8dca5','1494526585095-c41746248156',
            '1512918728675-ed5a9ecdebfd','1615529182904-14819c35db37','1522708323590-d24dbb6b0267',
            '1560518883-ce09059eeffa','1616486338812-3dadae4b4ace','1615873968403-89e068629265',
            '1583608205776-bfd35f0d9f83','1615874959474-d609969a20ed',
        ];
    }
    private static function portraitImageIds(): array {
        return [
            '1507003211169-0a1dd7228f2d','1500648767791-00dcc994a43e','1519085360753-af0119f7cbe7',
            '1494790108377-be9c29b29330','1560250097-0b93528c311a','1517841905240-472988babdf9',
            '1531123897727-8f129e1688ce','1544005313-94ddf0286df2','1552058544-f2b08422138a',
            '1573496359142-b8d87734a5a2','1580489944761-15a19d654956','1544725176-7c40e5a71c5e',
            '1500917293891-ef795e70e1f6','1607746882042-944635dfe10e','1522075469751-3a6694fb2f61',
            '1487412720507-e7ab37603c6f','1519345182560-3f2917c472ef','1506794778202-cad84cf45f1d',
            '1508214751196-bcfd4ca60f91','1541823709867-1b206113eafd','1601412436009-d964bd02edbc',
            '1544168190-79c17527004f',
        ];
    }

    private static function unsplash(string $id, int $w = 1200): string {
        return "https://images.unsplash.com/photo-{$id}?w={$w}&auto=format&fit=crop&q=80";
    }
    private static function pickImages(int $seed, int $n): array {
        $ids = self::propertyImageIds();
        $out = [];
        for ($k = 0; $k < $n; $k++) { $out[] = self::unsplash($ids[($seed * 6 + $k) % count($ids)], 1200); }
        return $out;
    }
    private static function pickPortrait(int $seed): string {
        $ids = self::portraitImageIds();
        return self::unsplash($ids[$seed % count($ids)], 300);
    }

    private static function posters(): array {
        $raw = [
            ['name' => 'Nguyễn Văn Hùng', 'role' => 'moi-gioi-tu-do', 'phone' => '0912 345 678'],
            ['name' => 'Trần Thị Mai', 'role' => 'chinh-chu', 'phone' => '0987 654 321'],
            ['name' => 'Lê Minh Tuấn', 'role' => 'moi-gioi-tu-do', 'phone' => '0933 221 456'],
            ['name' => 'Phạm Thu Hà', 'role' => 'chinh-chu', 'phone' => '0977 112 233'],
            ['name' => 'Địa Ốc Phú Gia', 'role' => 'cong-ty-moi-gioi', 'phone' => '0286 273 8899'],
            ['name' => 'Hoàng Đức Thịnh', 'role' => 'moi-gioi-tu-do', 'phone' => '0967 890 123'],
            ['name' => 'Vũ Thị Ngọc', 'role' => 'chinh-chu', 'phone' => '0918 456 789'],
            ['name' => 'Bất Động Sản Kim Long', 'role' => 'cong-ty-moi-gioi', 'phone' => '0243 998 7766'],
            ['name' => 'Đặng Quốc Bảo', 'role' => 'moi-gioi-tu-do', 'phone' => '0932 567 890'],
            ['name' => 'Ngô Thị Thu Trang', 'role' => 'chinh-chu', 'phone' => '0909 334 556'],
            ['name' => 'Công ty CP Nhà Đất An Cư', 'role' => 'cong-ty-moi-gioi', 'phone' => '0236 384 5567'],
            ['name' => 'Bùi Văn Long', 'role' => 'moi-gioi-tu-do', 'phone' => '0356 778 990'],
            ['name' => 'Trịnh Thị Kim Anh', 'role' => 'chinh-chu', 'phone' => '0794 223 118'],
            ['name' => 'Phan Đình Nam', 'role' => 'moi-gioi-tu-do', 'phone' => '0813 667 245'],
        ];
        foreach ($raw as $i => &$p) { $p['avatar'] = self::pickPortrait($i); }
        return $raw;
    }

    private static function salePriceM2(): array {
        return [
            'chung-cu' => ['Hà Nội' => 46, 'TP.HCM' => 52, 'Đà Nẵng' => 33],
            'nha-pho' => ['Hà Nội' => 125, 'TP.HCM' => 148, 'Đà Nẵng' => 88],
            'dat-nen' => ['Hà Nội' => 58, 'TP.HCM' => 68, 'Đà Nẵng' => 38],
            'biet-thu' => ['Hà Nội' => 52, 'TP.HCM' => 62, 'Đà Nẵng' => 36],
            'shophouse' => ['Hà Nội' => 135, 'TP.HCM' => 158, 'Đà Nẵng' => 92],
            'can-ho-dich-vu' => ['Hà Nội' => 50, 'TP.HCM' => 58, 'Đà Nẵng' => 34],
        ];
    }
    private static function rentPriceM2(): array {
        return [
            'chung-cu' => ['Hà Nội' => 170, 'TP.HCM' => 190, 'Đà Nẵng' => 120],
            'nha-pho' => ['Hà Nội' => 210, 'TP.HCM' => 240, 'Đà Nẵng' => 150],
            'biet-thu' => ['Hà Nội' => 260, 'TP.HCM' => 300, 'Đà Nẵng' => 190],
            'shophouse' => ['Hà Nội' => 330, 'TP.HCM' => 380, 'Đà Nẵng' => 240],
            'can-ho-dich-vu' => ['Hà Nội' => 240, 'TP.HCM' => 270, 'Đà Nẵng' => 170],
        ];
    }

    public static function featurePool(): array {
        return [
            'chung-cu' => ['Hồ bơi nội khu', 'Gần trường quốc tế', 'An ninh 24/7', 'Có chỗ để ô tô', 'Ban công thoáng mát', 'Gần siêu thị', 'Thang máy riêng biệt'],
            'nha-pho' => ['Hẻm xe hơi ra vào', 'Gần chợ dân sinh', 'Đã hoàn công đầy đủ', 'Gần trường học', 'Khu dân cư yên tĩnh', 'Sân trước để xe'],
            'dat-nen' => ['Sổ đỏ riêng từng lô', 'Đường nhựa trước đất', 'Quy hoạch 1/500 rõ ràng', 'Gần khu công nghiệp', 'Đất thổ cư 100%', 'Không vướng quy hoạch'],
            'biet-thu' => ['Sân vườn rộng', 'Hồ bơi riêng', 'An ninh khép kín 24/7', 'Gần sân golf', 'Gara ô tô rộng', 'Thiết kế biệt lập'],
            'shophouse' => ['Mặt tiền kinh doanh sầm uất', 'Lưu lượng người qua lại cao', 'Phù hợp mở cửa hàng/văn phòng', 'Có gác lửng', 'Vỉa hè rộng để xe'],
            'can-ho-dich-vu' => ['Dịch vụ dọn phòng hàng tuần', 'Đầy đủ nội thất cao cấp', 'Gần khu văn phòng', 'Bảo vệ 24/7', 'Có gym & hồ bơi chung cư'],
        ];
    }

    public static function tierFor(int $i): string {
        if (in_array($i, [3, 27], true)) return 'vip-kim-cuong';
        if (in_array($i, [7, 15, 23, 35], true)) return 'vip-vang';
        if (in_array($i, [1, 9, 13, 19, 25, 31, 37, 41], true)) return 'vip-bac';
        return 'thuong';
    }
    public static function specsFor(string $type, int $i): array {
        switch ($type) {
            case 'chung-cu': return ['bedrooms' => 1 + $i % 3, 'bathrooms' => 1 + $i % 2, 'area' => 45 + ($i % 6) * 9];
            case 'nha-pho': return ['bedrooms' => 3 + $i % 3, 'bathrooms' => 2 + $i % 3, 'area' => 60 + ($i % 8) * 13, 'floors' => 2 + $i % 4];
            case 'dat-nen': return ['bedrooms' => 0, 'bathrooms' => 0, 'area' => 80 + ($i % 10) * 22];
            case 'biet-thu': return ['bedrooms' => 4 + $i % 3, 'bathrooms' => 3 + $i % 3, 'area' => 200 + ($i % 6) * 42, 'floors' => 2 + $i % 3];
            case 'shophouse': return ['bedrooms' => 2 + $i % 3, 'bathrooms' => 2 + $i % 2, 'area' => 80 + ($i % 6) * 12, 'floors' => 3 + $i % 3];
            case 'can-ho-dich-vu': return ['bedrooms' => 1 + $i % 2, 'bathrooms' => 1 + $i % 2, 'area' => 35 + ($i % 5) * 8];
        }
        return ['bedrooms' => 0, 'bathrooms' => 0, 'area' => 50];
    }
    public static function needFor(int $i, string $type): string {
        if ($type === 'dat-nen') return 'ban';
        if ($type === 'can-ho-dich-vu') return 'cho-thue';
        return ($i % 4 === 2) ? 'cho-thue' : 'ban';
    }
    public static function calcRawPrice(string $type, string $need, float $area, string $city): int {
        if ($need === 'ban') {
            $perM2 = self::salePriceM2()[$type][$city] ?? 50;
            return (int) (round(($perM2 * $area * 1e6) / 1e8) * 1e8);
        }
        $perM2 = self::rentPriceM2()[$type][$city] ?? 180;
        return (int) (round(($perM2 * 1000 * $area) / 5e5) * 5e5);
    }
    public static function buildTitle(string $type, string $need, array $s, string $areaLabel): string {
        $labels = self::typeLabels();
        switch ($type) {
            case 'chung-cu': $t = "Căn hộ {$s['bedrooms']} phòng ngủ {$s['area']}m² tại {$areaLabel}"; break;
            case 'nha-pho': $t = "Nhà phố {$s['floors']} tầng {$s['area']}m² mặt tiền {$areaLabel}"; break;
            case 'dat-nen': $t = "Đất nền thổ cư {$s['area']}m² tại {$areaLabel}"; break;
            case 'biet-thu': $t = "Biệt thự sân vườn {$s['area']}m² tại {$areaLabel}"; break;
            case 'shophouse': $t = "Shophouse {$s['floors']} tầng mặt tiền kinh doanh tại {$areaLabel}"; break;
            case 'can-ho-dich-vu': $t = "Căn hộ dịch vụ {$s['bedrooms']} phòng ngủ đầy đủ nội thất tại {$areaLabel}"; break;
            default: $t = "{$labels[$type]} tại {$areaLabel}";
        }
        return $need === 'cho-thue' ? "{$t} - cho thuê" : $t;
    }
    public static function buildDescription(string $type, string $need, array $s, string $direction, string $legal, string $furnishing, string $areaLabel): string {
        $typeLabel = mb_strtolower(self::typeLabels()[$type], 'UTF-8');
        $roomPart = $s['bedrooms'] > 0
            ? "thiết kế {$s['bedrooms']} phòng ngủ, {$s['bathrooms']} phòng tắm"
            : 'phù hợp xây dựng tự do theo quy hoạch được duyệt';
        $purpose = $need === 'ban' ? 'an cư lâu dài hoặc đầu tư sinh lời' : 'thuê ở ngay hoặc kinh doanh';
        $directionLabel = mb_strtolower(self::directionLabels()[$direction], 'UTF-8');
        $legalLabel = mb_strtolower(self::legalLabels()[$legal], 'UTF-8');
        $furnishLabel = mb_strtolower(self::furnishingLabels()[$furnishing], 'UTF-8');
        return self::typeLabels()[$type] . " tọa lạc tại khu vực {$areaLabel}, diện tích {$s['area']}m², {$roomPart}, hướng {$directionLabel} đón gió mát quanh năm. "
            . "Tình trạng pháp lý {$legalLabel}, {$furnishLabel}, sẵn sàng bàn giao ngay khi hoàn tất thủ tục. "
            . "Khu vực xung quanh tiện ích đầy đủ — gần trường học, chợ/siêu thị, giao thông thuận tiện kết nối trung tâm — phù hợp cho nhu cầu {$purpose}.";
    }

    private static function articles(): array {
        return [
            ['id' => 1, 'slug' => 'kinh-nghiem-dat-coc-mua-nha-an-toan', 'title' => 'Kinh nghiệm đặt cọc mua nhà an toàn, tránh rủi ro pháp lý',
                'category' => 'Kinh nghiệm', 'date' => '2026-08-18', 'author' => 'Đội ngũ biên tập RaoNhà', 'thumb' => self::unsplash('1583417319070-4a69db38a482', 1600),
                'excerpt' => 'Đặt cọc là bước quan trọng nhưng cũng tiềm ẩn nhiều rủi ro nhất trong giao dịch mua bán nhà đất. Dưới đây là những điều người mua cần kiểm tra kỹ trước khi đặt bút ký.',
                'content' => "Đặt cọc là bước ràng buộc đầu tiên giữa người mua và người bán trước khi ra công chứng, vì vậy đây cũng là giai đoạn xảy ra tranh chấp nhiều nhất trên thị trường bất động sản. Trước khi đặt cọc, người mua cần yêu cầu xem bản gốc sổ đỏ/sổ hồng, đối chiếu thông tin thửa đất, diện tích, tên chủ sở hữu trên sổ với thông tin thực tế và với căn cước công dân của người bán.\n\nThứ hai, cần kiểm tra tài sản có đang bị thế chấp ngân hàng, kê biên thi hành án hay tranh chấp thừa kế hay không bằng cách tra cứu tại văn phòng đăng ký đất đai hoặc nhờ luật sư, công chứng viên hỗ trợ xác minh. Nhiều trường hợp người mua mất cọc oan vì tài sản đang thế chấp mà bên bán cố tình giấu thông tin.\n\nThứ ba, hợp đồng đặt cọc cần ghi rõ: số tiền cọc, thời hạn ra công chứng, điều khoản phạt cọc hai chiều (không chỉ phạt người mua bỏ cọc mà cả người bán nếu đổi ý không bán), và phương án xử lý nếu phát sinh tranh chấp về diện tích/quy hoạch sau khi đo đạc thực tế. Mức cọc phổ biến hiện nay dao động 50-100 triệu đồng hoặc 5-10% giá trị giao dịch, tùy thỏa thuận.\n\nCuối cùng, nên đặt cọc thông qua chuyển khoản ngân hàng thay vì tiền mặt để có chứng từ rõ ràng, và nếu giá trị giao dịch lớn, nên cân nhắc đặt cọc tại văn phòng công chứng hoặc có bên thứ ba (môi giới, luật sư) làm chứng ký tên trong hợp đồng cọc. Một khoản cọc được chuẩn bị kỹ lưỡng sẽ giúp cả hai bên yên tâm tiến tới bước công chứng và sang tên mà không phát sinh tranh cãi."],
            ['id' => 2, 'slug' => 'phan-biet-so-do-so-hong-hop-dong-mua-ban', 'title' => 'Phân biệt Sổ đỏ, Sổ hồng và Hợp đồng mua bán — người mua nhà cần biết',
                'category' => 'Pháp lý', 'date' => '2026-08-14', 'author' => 'Đội ngũ biên tập RaoNhà', 'thumb' => self::unsplash('1555431189-0fabf2667795', 1600),
                'excerpt' => 'Ba loại giấy tờ pháp lý này quyết định trực tiếp đến quyền lợi và độ an toàn của người mua. Bài viết giải thích rõ sự khác biệt và mức độ rủi ro tương ứng.',
                'content' => "\"Sổ đỏ\" là tên gọi quen thuộc của Giấy chứng nhận quyền sử dụng đất, thường cấp cho đất ở, đất nông nghiệp, đất chưa có tài sản gắn liền. \"Sổ hồng\" là Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở và tài sản khác gắn liền với đất — áp dụng phổ biến cho nhà phố, căn hộ chung cư đã hoàn công. Từ năm 2009, hai loại giấy tờ này về cơ bản đã được hợp nhất thành một mẫu chung do Bộ Tài nguyên và Môi trường (nay thuộc Bộ Nông nghiệp và Môi trường) phát hành, nhưng người dân vẫn quen gọi theo tên cũ dựa trên loại tài sản.\n\n\"Hợp đồng mua bán\" là trường hợp phổ biến với căn hộ chung cư hình thành trong tương lai hoặc dự án đang chờ cấp sổ — người mua chưa có sổ riêng mà chỉ có hợp đồng ký với chủ đầu tư, kèm theo biên bản bàn giao, hóa đơn thanh toán. Đây là loại giấy tờ có độ rủi ro cao hơn hai loại trên vì phụ thuộc vào tiến độ pháp lý và uy tín của chủ đầu tư — cần kiểm tra dự án đã được cấp phép xây dựng, đã hoàn thành nghĩa vụ tài chính với Nhà nước hay chưa trước khi mua lại qua hình thức chuyển nhượng hợp đồng.\n\nKhi xem tin đăng, người mua nên ưu tiên các bất động sản đã có sổ riêng (đỏ/hồng) đứng tên chính chủ để giảm thiểu rủi ro, hoặc nếu chấp nhận mua dạng hợp đồng mua bán/đang chờ sổ thì cần yêu cầu bên bán cung cấp đầy đủ hồ sơ pháp lý dự án và tốt nhất nên có luật sư tư vấn trước khi đặt cọc."],
            ['id' => 3, 'slug' => 'xu-huong-gia-chung-cu-noi-thanh-2026', 'title' => 'Xu hướng giá chung cư nội thành Hà Nội và TP.HCM nửa cuối 2026',
                'category' => 'Thị trường', 'date' => '2026-08-10', 'author' => 'Đội ngũ biên tập RaoNhà', 'thumb' => self::unsplash('1512453979798-5ea266f8880c', 1600),
                'excerpt' => 'Giá căn hộ tại các quận trung tâm tiếp tục neo ở vùng cao do nguồn cung mới hạn chế. Bài viết tổng hợp diễn biến giá theo khu vực và dự báo ngắn hạn.',
                'content' => "Trong nửa đầu năm 2026, mặt bằng giá căn hộ chung cư tại các quận trung tâm Hà Nội (Cầu Giấy, Đống Đa, Tây Hồ) và TP.HCM (Quận 1, Quận 7, Bình Thạnh) tiếp tục duy trì xu hướng tăng nhẹ so với cùng kỳ, chủ yếu do nguồn cung dự án mới hạn chế trong khi nhu cầu ở thực và đầu tư vẫn cao. Các căn hộ 2 phòng ngủ diện tích 60-70m² tại khu vực nội thành hiện phổ biến ở mức 2,8 - 4,5 tỷ đồng tùy vị trí và chất lượng bàn giao.\n\nNgược lại, phân khúc vùng ven và các đô thị vệ tinh như Hà Đông, Nam Từ Liêm, Thủ Đức, Tân Bình ghi nhận mức giá dễ tiếp cận hơn, dao động 1,8 - 3 tỷ đồng cho căn 2 phòng ngủ, phù hợp với nhóm khách hàng trẻ mua nhà lần đầu. Đây cũng là khu vực có lượng tin đăng và lượt tìm kiếm tăng mạnh nhất trên các nền tảng giao dịch trực tuyến trong quý vừa qua.\n\nTại Đà Nẵng, giá căn hộ khu vực Hải Châu và Sơn Trà tương đối ổn định, dao động 1,5 - 2,8 tỷ đồng cho căn 2 phòng ngủ view gần biển, thu hút cả người mua ở thực lẫn nhà đầu tư cho thuê ngắn hạn phục vụ khách du lịch.\n\nDự báo trong các quý tới, mặt bằng giá khó có khả năng giảm sâu do chi phí xây dựng và tiền sử dụng đất vẫn ở mức cao, nhưng tốc độ tăng sẽ chậm lại khi nguồn cung mới từ các dự án đang triển khai dần được đưa ra thị trường vào cuối năm."],
            ['id' => 4, 'slug' => 'thu-tuc-sang-ten-so-do-can-giay-to-gi', 'title' => 'Thủ tục sang tên Sổ đỏ/Sổ hồng cần chuẩn bị những giấy tờ gì?',
                'category' => 'Pháp lý', 'date' => '2026-08-05', 'author' => 'Đội ngũ biên tập RaoNhà', 'thumb' => self::unsplash('1470770903676-69b98201ea1c', 1600),
                'excerpt' => 'Sang tên là bước cuối cùng hoàn tất giao dịch. Danh sách giấy tờ và trình tự các bước công chứng - kê khai thuế - đăng bộ giúp người mua chủ động thời gian.',
                'content' => "Sau khi hai bên đã thống nhất giá và đặt cọc, bước tiếp theo là ký hợp đồng chuyển nhượng tại văn phòng công chứng. Hồ sơ cần chuẩn bị gồm: bản gốc Giấy chứng nhận quyền sử dụng đất/quyền sở hữu nhà, căn cước công dân và sổ hộ khẩu (hoặc giấy xác nhận cư trú) của cả bên mua và bên bán, giấy chứng nhận tình trạng hôn nhân (nếu tài sản chung vợ chồng cần cả hai cùng ký), và hợp đồng đặt cọc (nếu có) để đối chiếu điều khoản.\n\nSau khi công chứng hợp đồng chuyển nhượng, các bên tiến hành kê khai nghĩa vụ tài chính tại Chi cục Thuế nơi có bất động sản, bao gồm thuế thu nhập cá nhân (thường 2% giá trị chuyển nhượng, bên bán nộp) và lệ phí trước bạ (thường 0,5% giá trị, bên mua nộp) — có thể thỏa thuận khác trong hợp đồng. Thời gian xử lý hồ sơ thuế thường 10-15 ngày làm việc.\n\nBước cuối cùng là nộp hồ sơ đăng ký biến động đất đai tại Văn phòng đăng ký đất đai cấp quận/huyện để được cấp Giấy chứng nhận đứng tên chủ mới, thời gian xử lý theo quy định thường không quá 10 ngày làm việc kể từ khi nhận đủ hồ sơ hợp lệ. Người mua nên giữ lại toàn bộ biên lai nộp thuế, phí và bản sao hợp đồng công chứng để đối chiếu khi cần thiết trong tương lai."],
            ['id' => 5, 'slug' => 'kinh-nghiem-thue-nha-nguyen-can-lan-dau', 'title' => 'Kinh nghiệm thuê nhà nguyên căn lần đầu — tránh mất cọc oan',
                'category' => 'Kinh nghiệm', 'date' => '2026-07-30', 'author' => 'Đội ngũ biên tập RaoNhà', 'thumb' => self::unsplash('1493397212122-2b85dda8106b', 1600),
                'excerpt' => 'Người thuê nhà lần đầu thường bỏ qua nhiều chi tiết quan trọng trong hợp đồng thuê. Bài viết chỉ ra các điều khoản cần đọc kỹ trước khi đặt cọc.',
                'content' => "Khi thuê nhà nguyên căn hoặc căn hộ dịch vụ, người thuê cần yêu cầu chủ nhà xuất trình giấy tờ chứng minh quyền sở hữu hoặc quyền cho thuê hợp pháp (sổ đỏ/sổ hồng đứng tên hoặc giấy ủy quyền cho thuê nếu người ký hợp đồng không phải chủ sở hữu). Đây là bước nhiều người thuê bỏ qua nhưng lại quan trọng để tránh trường hợp thuê lại từ người không có quyền cho thuê.\n\nHợp đồng thuê nhà cần ghi rõ: thời hạn thuê, giá thuê và chu kỳ tăng giá (nếu có, thường không quá 10%/năm), số tiền đặt cọc (phổ biến 1-3 tháng tiền thuê) và điều kiện hoàn/không hoàn cọc, ai chịu trách nhiệm sửa chữa hư hỏng phát sinh trong quá trình sử dụng, và điều khoản chấm dứt hợp đồng trước hạn — bên nào vi phạm sẽ mất cọc hoặc phải bồi thường ra sao.\n\nTrước khi nhận nhà, nên cùng chủ nhà lập biên bản bàn giao tài sản, ghi chú tình trạng nội thất, chỉ số điện nước ban đầu, có chụp ảnh làm bằng chứng — điều này giúp tránh tranh chấp khi trả nhà về sau. Nếu thuê qua môi giới, cần xác minh môi giới có được chủ nhà ủy quyền thật sự hay không trước khi chuyển tiền cọc, tránh trường hợp lừa đảo cọc giữ chỗ nhà không có thật."],
            ['id' => 6, 'slug' => 'dau-tu-dat-nen-vung-ven-can-luu-y-gi', 'title' => 'Đầu tư đất nền vùng ven: cơ hội và những rủi ro cần lưu ý',
                'category' => 'Đầu tư', 'date' => '2026-07-22', 'author' => 'Đội ngũ biên tập RaoNhà', 'thumb' => self::unsplash('1493246507139-91e8fad9978e', 1600),
                'excerpt' => 'Đất nền vùng ven vẫn hấp dẫn nhà đầu tư nhờ biên độ tăng giá theo hạ tầng, nhưng đi kèm rủi ro quy hoạch và thanh khoản chậm hơn khu trung tâm.',
                'content' => "Đất nền tại các khu vực vùng ven như Hà Đông, Thủ Đức hay các huyện lân cận Đà Nẵng vẫn thu hút dòng tiền đầu tư nhờ mức giá còn tương đối \"mềm\" so với khu trung tâm và tiềm năng tăng giá khi hạ tầng giao thông (đường vành đai, cầu, metro) được hoàn thiện. Tuy nhiên, nhà đầu tư cần lưu ý ba rủi ro chính trước khi xuống tiền.\n\nThứ nhất là rủi ro quy hoạch: cần tra cứu thông tin quy hoạch sử dụng đất tại phòng Tài nguyên và Môi trường hoặc trên cổng thông tin quy hoạch của địa phương để chắc chắn thửa đất không nằm trong diện quy hoạch treo, lộ giới mở đường, hoặc đất công trình công cộng. Thứ hai là tính thanh khoản — đất nền vùng ven thường mất nhiều thời gian hơn để bán lại so với căn hộ hoặc nhà phố nội thành, nên phù hợp với dòng vốn trung-dài hạn hơn là lướt sóng ngắn hạn.\n\nThứ ba, cần kiểm tra kỹ pháp lý phân lô: đất đã tách thửa, có sổ đỏ riêng từng lô hay chưa, dự án phân lô có được cơ quan có thẩm quyền phê duyệt 1/500 hay không — tránh mua đất nền tự phân lô trái phép vốn tiềm ẩn nguy cơ không được cấp phép xây dựng sau này. Nhà đầu tư nên ưu tiên các lô đất đã có sổ đỏ riêng, vị trí gần trục đường chính đang hoặc sắp được nâng cấp, và có quy hoạch rõ ràng để giảm thiểu rủi ro pháp lý về lâu dài."],
            ['id' => 7, 'slug' => 'goi-tin-vip-khac-gi-tin-thuong', 'title' => 'Gói tin VIP khác gì tin thường? Nên chọn gói nào khi đăng tin bán nhà',
                'category' => 'Hướng dẫn', 'date' => '2026-07-15', 'author' => 'Đội ngũ biên tập RaoNhà', 'thumb' => self::unsplash('1449034446853-66c86144b0ad', 1600),
                'excerpt' => 'Với hàng chục nghìn tin đăng mới mỗi ngày, vị trí hiển thị quyết định phần lớn khả năng tiếp cận người mua. Bài viết so sánh chi tiết 4 gói tin trên RaoNhà.',
                'content' => "Trên các sàn giao dịch bất động sản trực tuyến, số lượng tin đăng mới mỗi ngày có thể lên tới hàng nghìn tin, vì vậy vị trí hiển thị của tin đăng ảnh hưởng trực tiếp đến số lượt xem và số cuộc gọi liên hệ mà người bán/môi giới nhận được. RaoNhà cung cấp 4 mức gói tin để người đăng lựa chọn theo nhu cầu và ngân sách.\n\nGói Tin thường miễn phí, phù hợp với người bán chính chủ đăng thử hoặc bất động sản có mức giá cạnh tranh sẵn, tin hiển thị theo thứ tự thời gian đăng, không có vị trí ưu tiên. Gói VIP Bạc và VIP Vàng có mức phí vừa phải, giúp tin được đẩy lên vị trí ưu tiên trong danh sách và trang chủ, có thêm số lần làm mới tin tự động trong tuần để duy trì thứ hạng. Gói VIP Kim Cương là mức cao nhất, tin luôn ở vị trí đầu bảng danh sách kết quả tìm kiếm, hiển thị badge nổi bật và được ưu tiên trong các khối \"Tin nổi bật\" trên trang chủ.\n\nKinh nghiệm thực tế cho thấy các bất động sản có mức giá cao hoặc cần bán/cho thuê gấp nên cân nhắc gói VIP Vàng hoặc Kim Cương để rút ngắn thời gian tìm được người mua/thuê phù hợp, trong khi tin đăng phổ thông vẫn có thể tiếp cận khách hàng tốt với gói Bạc kết hợp làm mới tin đều đặn."],
            ['id' => 8, 'slug' => 'phan-tich-khu-vuc-thu-duc-tiem-nang-2026', 'title' => 'Phân tích khu vực TP. Thủ Đức: tiềm năng tăng giá bất động sản đến 2027',
                'category' => 'Thị trường', 'date' => '2026-07-08', 'author' => 'Đội ngũ biên tập RaoNhà', 'thumb' => self::unsplash('1466442929976-97f336a657be', 1600),
                'excerpt' => 'TP. Thủ Đức tiếp tục là điểm sáng thu hút dòng vốn nhờ hạ tầng giao thông và quy hoạch đô thị sáng tạo. Bài viết điểm qua các yếu tố tác động đến giá đất khu vực.',
                'content' => "TP. Thủ Đức, được thành lập trên cơ sở sáp nhập Quận 2, Quận 9 và Quận Thủ Đức cũ, tiếp tục là một trong những khu vực được giới đầu tư bất động sản quan tâm nhiều nhất tại TP.HCM nhờ định hướng phát triển thành đô thị sáng tạo, tương tác cao phía Đông thành phố. Các tuyến hạ tầng trọng điểm như tuyến Metro số 1 (Bến Thành - Suối Tiên) đã đi vào vận hành, cùng các dự án mở rộng đường Vành đai 3 đang triển khai, góp phần cải thiện đáng kể khả năng kết nối với khu trung tâm.\n\nPhân khúc căn hộ chung cư tại khu vực gần các nhà ga metro và trục đường Nguyễn Thị Thập, Nguyễn Hữu Thọ ghi nhận mức độ quan tâm tìm kiếm tăng cao trong các quý gần đây, đặc biệt ở nhóm căn 2-3 phòng ngủ diện tích 60-90m² phù hợp gia đình trẻ. Đất nền và nhà phố tại các phường ven sông cũng duy trì sức hút với nhà đầu tư dài hạn nhờ quỹ đất còn tương đối dồi dào so với khu trung tâm truyền thống.\n\nTuy nhiên, người mua cần lưu ý một số khu vực vẫn đang trong giai đoạn hoàn thiện hạ tầng, tiện ích xã hội (trường học, bệnh viện, chợ) chưa đồng bộ ở tất cả các phường, nên cần khảo sát thực địa kỹ trước khi quyết định, đặc biệt với mục đích ở thực thay vì chỉ đầu tư chờ tăng giá."],
        ];
    }

    private function daysAgo(int $n): string {
        return (new \DateTimeImmutable("-{$n} days"))->format('Y-m-d H:i:s');
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

    public function execute(string $sql, array $params = []): int|string {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $this->pdo->lastInsertId();
    }

    /**
     * Như execute() nhưng trả về số dòng thực sự bị ảnh hưởng — dùng cho các UPDATE có điều kiện
     * (vd trừ credit_balance) để phát hiện race condition: nếu 0 dòng bị ảnh hưởng nghĩa là điều
     * kiện WHERE không còn đúng nữa tại thời điểm ghi (số dư đã thay đổi giữa lúc kiểm tra và lúc trừ).
     */
    public function executeAffected(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount();
    }

    public function getPdo(): \PDO {
        return $this->pdo;
    }
}

// Helper functions
function bodyJson(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function slugify(string $text): string {
    $text = mb_strtolower($text, 'UTF-8');
    $map = [
        'à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a',
        'ă'=>'a','ắ'=>'a','ặ'=>'a','ằ'=>'a','ẳ'=>'a','ẵ'=>'a',
        'â'=>'a','ấ'=>'a','ầ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a',
        'è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e',
        'ê'=>'e','ế'=>'e','ề'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e',
        'ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i',
        'ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o',
        'ô'=>'o','ố'=>'o','ồ'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o',
        'ơ'=>'o','ớ'=>'o','ờ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o',
        'ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u',
        'ư'=>'u','ứ'=>'u','ừ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u',
        'ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y',
        'đ'=>'d',
    ];
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', trim($text));
    return trim($text, '-');
}
?>
