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
        $this->seedMenuCategories();
        $this->seedMenuItems();
        $this->seedGallery();
        $this->seedTestimonials();
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
            ['site_name',           'Nhà Hàng Ẩm Thực Truyền Thống',       'general'],
            ['site_description',    'Ẩm thực Việt Nam truyền thống, nấu từ tâm — thưởng thức bằng cảm xúc. Hơn 20 năm giữ lửa hương vị.',  'general'],
            ['site_logo',           '',                                       'general'],
            ['site_favicon',        '',                                       'general'],
            ['site_email',          'info@nhahangtruyen.vn',                 'general'],
            ['site_phone',          '0901 234 567',                          'general'],
            ['site_phone_2',        '028 1234 5678',                         'general'],
            ['site_address',        '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', 'general'],
            ['working_hours',       '10:00 – 22:00 hàng ngày (Thứ Hai – Chủ Nhật)', 'general'],
            // seo
            ['meta_title',          'Nhà Hàng Ẩm Thực Truyền Thống — Hương Vị Gia Truyền',  'seo'],
            ['meta_description',    'Nhà hàng ẩm thực Việt Nam truyền thống. Hương vị gia truyền, nguyên liệu tươi sạch, không gian ấm cúng. Đặt bàn ngay hôm nay.', 'seo'],
            ['meta_keywords',       'nhà hàng, ẩm thực, việt nam, truyền thống, phở, bún bò huế',  'seo'],
            ['og_image',            '',                                       'seo'],
            ['google_analytics_id', '',                                       'seo'],
            // social
            ['social_facebook',     'https://facebook.com/',                  'social'],
            ['social_youtube',      '',                                       'social'],
            ['social_instagram',    '',                                       'social'],
            ['social_tiktok',       '',                                       'social'],
            ['social_zalo',         'https://zalo.me/0901234567',             'social'],
            // design
            ['primary_color',       '#b45309',                                'design'],
            ['secondary_color',     '#d97706',                                'design'],
            // footer
            ['footer_copyright',    '© 2026 Nhà Hàng Ẩm Thực Truyền Thống · Made in Vietnam',  'footer'],
            ['footer_description',  'Ẩm thực Việt Nam truyền thống, nấu từ tâm — thưởng thức bằng cảm xúc. Hơn 20 năm giữ lửa hương vị.', 'footer'],
            ['footer_show_social',  '1',                                      'footer'],
            // contact
            ['contact_form_enabled',   '1',                                   'contact'],
            ['contact_email_receiver', 'info@nhahangtruyen.vn',               'contact'],
            ['google_map_embed',       '',                                    'contact'],
            // smtp
            ['smtp_host',          'smtp.gmail.com',                          'smtp'],
            ['smtp_port',          '587',                                     'smtp'],
            ['smtp_user',          '',                                        'smtp'],
            ['smtp_password',      '',                                        'smtp'],
            ['smtp_from_name',     'Nhà Hàng Truyền Thống',                  'smtp'],
            ['smtp_from_email',    'info@nhahangtruyen.vn',                   'smtp'],
            // system
            ['maintenance_mode',    '0',                                      'system'],
            ['maintenance_message', 'Website đang bảo trì. Vui lòng quay lại sau.', 'system'],
            // about
            ['about_title',         'Hơn 20 năm gìn giữ hương vị',           'about'],
            ['about_content',       'Từ năm 2004, nhà hàng đã trở thành điểm hẹn ẩm thực của bao thế hệ gia đình. Chúng tôi không nấu để kiếm sống — chúng tôi nấu để giữ lại những hương vị mà người Việt không bao giờ muốn quên. Nguyên liệu được tuyển chọn từ 5 giờ sáng tại chợ đầu mối. Công thức gia truyền không bao giờ dùng bột ngọt, không chất bảo quản. Mỗi nồi nước dùng được ninh tối thiểu 12 giờ.', 'about'],
            ['about_image',         'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop', 'about'],
            ['about_tagline',       'Nhà hàng ẩm thực truyền thống từ 2004', 'about'],
            ['about_stat_years',    '20+',                                    'about'],
            ['about_stat_dishes',   '70+',                                    'about'],
            ['about_stat_reviews',  '450+',                                   'about'],
            // reservation
            ['reservation_enabled', '1',                                      'reservation'],
            ['reservation_note',    'Đặt bàn trước để có chỗ ngồi đẹp nhất — đặc biệt vào cuối tuần và dịp lễ Tết.', 'reservation'],
            ['open_hours_text',     '10:00 – 22:00 (Thứ Hai – Chủ Nhật)',    'reservation'],
            ['parking_info',        'Miễn phí, bãi đỗ riêng 50 xe',          'reservation'],
            // cloudinary
            ['cloudinary_cloud_name', '',                                     'cloudinary'],
            ['cloudinary_api_key',    '',                                     'cloudinary'],
            ['cloudinary_api_secret', '',                                     'cloudinary'],
            ['cloudinary_upload_folder', 'nha-hang-truyen-thong',             'cloudinary'],
            // integrations
            ['unsplash_access_key',  'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
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
                'Hương vị gia truyền đích thực',
                'Mỗi món ăn là một hành trình về ký ức — được nấu từ công thức gia truyền, nguyên liệu tươi sạch tuyển chọn mỗi sáng và trái tim người đầu bếp.',
                'Xem thực đơn',
                '/thuc-don',
                'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=60&auto=format&fit=crop',
                1,
            ],
            [
                'Không gian ấm cúng như ngôi nhà thứ hai',
                'Thiết kế theo phong cách truyền thống Việt Nam — mộc mạc, gần gũi, thân thuộc. Phòng riêng cho gia đình và nhóm bạn.',
                'Đặt bàn ngay',
                '/dat-ban',
                'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1400&q=60&auto=format&fit=crop',
                2,
            ],
            [
                'Hơn 70 món ăn chế biến mỗi ngày',
                'Từ khai vị đến tráng miệng, mỗi món đều được chuẩn bị tươi mới từ nguyên liệu sạch, không bột ngọt, không chất bảo quản.',
                'Xem thực đơn',
                '/thuc-don',
                'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1400&q=60&auto=format&fit=crop',
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

    private function seedMenuCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_categories") > 0) return;
        $cats = [
            ['Khai Vị', 'khai-vi', 'Các món khai vị tươi mát và chiên giòn', '🥗', 1],
            ['Món Chính', 'mon-chinh', 'Phở, bún, cơm — các món chính đặc sắc', '🍜', 2],
            ['Tráng Miệng', 'trang-miem', 'Chè, bánh ngọt và các món tráng miệng', '🍮', 3],
            ['Đồ Uống', 'do-uong', 'Cà phê, nước ép và đồ uống giải khát', '🥤', 4],
        ];
        foreach ($cats as $c) {
            $this->execute(
                "INSERT INTO menu_categories (name, slug, description, icon, sort_order) VALUES (?, ?, ?, ?, ?)",
                $c
            );
        }
    }

    private function seedMenuItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_items") > 0) return;

        $catIds = [];
        $cats = $this->query("SELECT id, slug FROM menu_categories");
        foreach ($cats as $c) {
            $catIds[$c['slug']] = $c['id'];
        }

        $items = [
            // Khai vị — [category_id, name, slug, description, price, price_sale, image, badge, featured, sort_order]
            [$catIds['khai-vi'] ?? null, 'Chả Giò Sài Gòn', 'cha-gio-sai-gon', 'Vỏ giòn rụm, nhân thịt heo, miến mộc nhĩ thơm ngậy. Chấm kèm tương ớt đặc biệt của nhà hàng.', 68000, null, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80&auto=format&fit=crop', 'PHẢI THỬ', 1, 1],
            [$catIds['khai-vi'] ?? null, 'Gỏi Cuốn Tôm Thịt', 'goi-cuon-tom-thit', 'Bánh tráng mỏng cuộn tôm, thịt ba chỉ, rau thơm và bún. Chấm tương hoisin thơm béo.', 55000, null, 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80&auto=format&fit=crop', '', 1, 2],
            [$catIds['khai-vi'] ?? null, 'Gỏi Bắp Chuối Tôm Thịt', 'goi-bap-chuoi', 'Bắp chuối thái mỏng, tôm luộc, thịt ba chỉ thái sợi. Rắc đậu phộng, nước trộn chua ngọt.', 72000, null, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80&auto=format&fit=crop', '', 0, 3],
            [$catIds['khai-vi'] ?? null, 'Bánh Xèo Miền Trung', 'banh-xeo-mien-trung', 'Bánh giòn vàng nhân tôm thịt giá đỗ, ăn kèm rau sống và nước chấm pha chuẩn vị.', 85000, null, 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80&auto=format&fit=crop', '', 0, 4],
            [$catIds['khai-vi'] ?? null, 'Súp Cua Bắp Non', 'sup-cua-bap-non', 'Thịt cua tươi, bắp non, trứng đánh tan. Nước dùng trong ngọt tự nhiên, thêm tiêu trắng thơm.', 62000, null, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80&auto=format&fit=crop', '', 0, 5],
            [$catIds['khai-vi'] ?? null, 'Nem Rán Hà Nội', 'nem-ran-ha-noi', 'Nem rán kiểu Hà Nội, nhỏ vừa miệng, vỏ giòn nhân thịt giò. Chấm nước mắm chua ngọt truyền thống.', 58000, null, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format&fit=crop', '', 0, 6],
            // Món chính
            [$catIds['mon-chinh'] ?? null, 'Phở Bò Đặc Biệt', 'pho-bo-dac-biet', 'Nước dùng ninh 14 giờ từ xương ống, thịt bò Úc tươi, bánh phở dai mềm. Hương vị không thể quên.', 89000, null, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80&auto=format&fit=crop', 'BEST', 1, 7],
            [$catIds['mon-chinh'] ?? null, 'Bún Bò Huế Chuẩn Vị', 'bun-bo-hue', 'Sả mắm ruốc thơm nồng, chả lụa tự làm, thịt bò bắp hầm mềm rục. Chuẩn hương vị xứ Huế thật sự.', 78000, null, 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80&auto=format&fit=crop', '', 1, 8],
            [$catIds['mon-chinh'] ?? null, 'Cơm Tấm Sườn Bì Chả', 'com-tam-suon-bi-cha', 'Sườn nướng mật ong, bì sợi dai thơm, chả trứng hấp béo. Ăn kèm nước mắm chua ngọt đặc chế.', 79000, null, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format&fit=crop', '', 1, 9],
            [$catIds['mon-chinh'] ?? null, 'Bún Chả Hà Nội', 'bun-cha-ha-noi', 'Chả viên và thịt ba chỉ nướng than hoa thơm lừng. Ăn kèm bún trắng, rau sống, nước chấm đặc biệt.', 82000, null, 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80&auto=format&fit=crop', '', 0, 10],
            [$catIds['mon-chinh'] ?? null, 'Cá Kho Tộ Nam Bộ', 'ca-kho-to', 'Cá thu kho tộ đất nung, nước màu caramel sánh, gừng sả thơm. Ăn kèm cơm trắng dẻo tơi.', 95000, null, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80&auto=format&fit=crop', '', 0, 11],
            [$catIds['mon-chinh'] ?? null, 'Phở Gà Ta Truyền Thống', 'pho-ga-ta', 'Gà ta thả vườn ninh ngọt thanh tự nhiên. Hành hoa, gừng nướng thơm. Bánh phở mềm dai vừa phải.', 75000, null, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80&auto=format&fit=crop', '', 0, 12],
            // Tráng miệng
            [$catIds['trang-miem'] ?? null, 'Chè Ba Màu Sài Gòn', 'che-ba-mau', 'Đậu xanh bột khoai dẻo, thạch sương sáo mát, nước cốt dừa béo ngậy. Mát lạnh, ngọt thanh.', 38000, null, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80&auto=format&fit=crop', 'YÊU THÍCH', 1, 13],
            [$catIds['trang-miem'] ?? null, 'Bánh Flan Cà Phê', 'banh-flan-ca-phe', 'Flan mịn béo từ trứng gà tươi, thêm cà phê đắng nhẹ. Caramel vàng óng. Bảo đảm tự làm hằng ngày.', 32000, null, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format&fit=crop', '', 0, 14],
            [$catIds['trang-miem'] ?? null, 'Xôi Xoài Nước Cốt Dừa', 'xoi-xoai', 'Xôi nếp dẻo thơm, xoài chín thái mỏng ngọt chua, chan nước cốt dừa béo rắc mè rang vàng.', 42000, null, 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80&auto=format&fit=crop', '', 0, 15],
            // Đồ uống
            [$catIds['do-uong'] ?? null, 'Cà Phê Sữa Đá Truyền Thống', 'ca-phe-sua-da', 'Cà phê phin nhỏ giọt, pha với sữa đặc Ông Thọ, đá viên. Đậm đà, ngọt ngào theo kiểu Sài Gòn xưa.', 28000, null, 'https://images.unsplash.com/photo-1559181567-c3190ca9be43?w=600&q=80&auto=format&fit=crop', '', 0, 16],
            [$catIds['do-uong'] ?? null, 'Nước Chanh Sả Gừng', 'nuoc-chanh-sa-gung', 'Chanh vắt tươi, sả đập nhẹ, gừng non thái sợi. Đường phèn tan từ từ. Mát lạnh, giải nhiệt cực tốt.', 32000, null, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80&auto=format&fit=crop', '', 0, 17],
            [$catIds['do-uong'] ?? null, 'Trà Đào Cam Sả', 'tra-dao-cam-sa', 'Trà đen ủ lạnh, đào tươi thái mỏng, cam vắt, sả đập. Thơm nhẹ tự nhiên, không hương nhân tạo.', 35000, null, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80&auto=format&fit=crop', '', 0, 18],
        ];

        foreach ($items as $item) {
            $this->execute(
                "INSERT INTO menu_items (category_id, name, slug, description, price, price_sale, image, badge, featured, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')",
                $item
            );
        }
    }

    private function seedGallery(): void {
        if ($this->scalar("SELECT COUNT(*) FROM gallery_items") > 0) return;
        $items = [
            ['Không gian chính', 'Phòng ăn chính rộng rãi, trang trí theo phong cách Việt Nam cổ điển', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop', 'khong-gian', 1],
            ['Góc bếp', 'Bếp mở để thực khách có thể ngắm nhìn quá trình chế biến', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80&auto=format&fit=crop', 'khong-gian', 2],
            ['Bàn ăn gia đình', 'Bàn tròn lý tưởng cho bữa ăn gia đình ấm cúng', 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80&auto=format&fit=crop', 'khong-gian', 3],
            ['Góc trang trí', 'Chi tiết trang trí mang đậm bản sắc Việt Nam', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80&auto=format&fit=crop', 'khong-gian', 4],
            ['Phòng riêng', 'Phòng riêng thoải mái cho nhóm 8–20 người', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80&auto=format&fit=crop', 'khong-gian', 5],
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
            ['Nguyễn Văn Hùng', 'Food Blogger · Hà Nội', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop&crop=face', 'Phở bò ngon nhất tôi từng ăn ở Hà Nội. Nước dùng đậm đà, ngọt thanh tự nhiên. Thịt bò tươi mềm tan trong miệng. Không gian ấm cúng như bữa cơm nhà.', 5, 1],
            ['Trần Minh Anh', 'Khách hàng thường xuyên', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop&crop=face', 'Đặt bàn online dễ dàng, chỉ 5 phút. Bún bò Huế chuẩn vị hơn cả ngoài Huế. Chả lụa tự làm ngon lắm. Giá cả rất hợp lý cho chất lượng này.', 5, 2],
            ['Phạm Quang Minh', 'Hướng dẫn viên du lịch', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face', 'Đưa đoàn khách nước ngoài đến ăn, ai cũng trầm trồ. Không gian đậm chất Việt, món ăn chính gốc. Đây chắc chắn là địa chỉ tôi giới thiệu mỗi khi có khách từ xa đến.', 5, 3],
        ];
        foreach ($items as $i) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                $i
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
