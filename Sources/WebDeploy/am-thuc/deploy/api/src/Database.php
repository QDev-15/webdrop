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
        // PHẢI check false — nếu schema.sql thiếu, tables không được tạo
        if ($schema === false) {
            throw new \RuntimeException('schema.sql not found: ' . $schemaPath);
        }
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
        $this->seedMenuCategories();
        $this->seedMenuItems();
        $this->seedTestimonials();
        $this->seedGallery();
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
            ['site_name', 'Nhà Hàng Ẩm Thực', 'general'],
            ['site_tagline', 'Ẩm thực Việt Nam truyền thống', 'general'],
            ['site_description', 'Nhà hàng phục vụ ẩm thực Việt Nam truyền thống. Mỗi món ăn là một câu chuyện — được nấu từ nguyên liệu tươi sạch, công thức gia truyền và tấm lòng người đầu bếp.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hello@restaurant.vn', 'general'],
            ['site_phone', '0901 234 567', 'general'],
            ['site_phone_2', '0912 345 678', 'general'],
            ['site_address', 'Số nhà, Tên đường, Phường, Quận, TP. Hồ Chí Minh', 'general'],
            ['working_hours', 'Trưa: 10:00 – 14:00 | Tối: 17:30 – 22:00 | Hàng ngày kể cả ngày lễ', 'general'],
            // seo
            ['meta_title', 'Nhà Hàng Ẩm Thực — Hương vị đích thực Việt Nam', 'seo'],
            ['meta_description', 'Nhà hàng phục vụ ẩm thực Việt Nam truyền thống với hơn 60 món ăn. Đặt bàn ngay hôm nay.', 'seo'],
            ['meta_keywords', 'nhà hàng, ẩm thực việt nam, đặt bàn, phở bò, bún bò huế', 'seo'],
            ['og_image', '', 'seo'],
            ['google_analytics_id', '', 'seo'],
            // social
            ['social_facebook', '#', 'social'],
            ['social_youtube', '#', 'social'],
            ['social_instagram', '#', 'social'],
            ['social_tiktok', '', 'social'],
            ['social_zalo', '#', 'social'],
            // design
            ['primary_color', '#b45309', 'design'],
            ['secondary_color', '#1a1309', 'design'],
            // footer
            ['footer_copyright', '© 2026 Nhà Hàng Ẩm Thực · Made in Vietnam', 'footer'],
            ['footer_description', 'Ẩm thực Việt Nam truyền thống, nấu từ tâm — ăn bằng cảm xúc.', 'footer'],
            ['footer_show_social', '1', 'footer'],
            // contact
            ['contact_form_enabled', '1', 'contact'],
            ['contact_email_receiver', 'hello@restaurant.vn', 'contact'],
            ['google_map_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724!2d105.836!3d21.066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2sTay%20Ho%2C%20Hanoi!5e0!3m2!1sen!2svn!4v1234567890', 'contact'],
            // about
            ['about_title', '15 năm gìn giữ hương vị truyền thống', 'about'],
            ['about_content', 'Từ năm 2009, Nhà Hàng Ẩm Thực đã trở thành điểm đến quen thuộc của người yêu ẩm thực Việt. Mỗi công thức đều được lưu giữ và hoàn thiện qua nhiều thế hệ. Nguyên liệu được tuyển chọn mỗi sáng từ chợ đầu mối. Đầu bếp nấu theo trái tim — không bột ngọt, không chất bảo quản.', 'about'],
            ['about_image_1', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80&auto=format&fit=crop', 'about'],
            ['about_image_2', 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&q=80&auto=format&fit=crop', 'about'],
            ['about_image_3', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80&auto=format&fit=crop', 'about'],
            ['about_years', '15+', 'about'],
            ['about_dishes', '60+', 'about'],
            ['about_reviews', '380+', 'about'],
            // reservation
            ['reservation_enabled', '1', 'reservation'],
            ['reservation_confirm_note', 'Xác nhận qua điện thoại trong 30 phút · Miễn phí hủy trước 2 giờ', 'reservation'],
            ['parking_info', 'Miễn phí · 50 chỗ · Có bảo vệ', 'reservation'],
            // smtp
            ['smtp_host', 'smtp.gmail.com', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_password', '', 'smtp'],
            ['smtp_from_name', 'Nhà Hàng Ẩm Thực', 'smtp'],
            ['smtp_from_email', '', 'smtp'],
            // system
            ['maintenance_mode', '0', 'system'],
            ['maintenance_message', 'Website đang bảo trì. Vui lòng quay lại sau.', 'system'],
            // integrations
            ['unsplash_access_key', '', 'integrations'],
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key', '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            ['cloudinary_upload_folder', 'am-thuc', 'cloudinary'],
        ];
        foreach ($settings as [$key, $value, $group]) {
            $this->execute(
                "INSERT OR IGNORE INTO settings (key, value, \"group\") VALUES (?, ?, ?)",
                [$key, $value, $group]
            );
        }
    }

    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        $slides = [
            [
                'title' => 'Hương vị đích thực Việt Nam',
                'subtitle' => 'Mỗi món ăn là một câu chuyện — được nấu từ nguyên liệu tươi sạch, công thức gia truyền và tấm lòng người đầu bếp.',
                'button_text' => 'Đặt bàn ngay',
                'button_link' => '/dat-ban',
                'image' => 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=60&auto=format&fit=crop',
                'sort_order' => 1,
            ],
        ];
        foreach ($slides as $slide) {
            $this->execute(
                "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                [$slide['title'], $slide['subtitle'], $slide['button_text'], $slide['button_link'], $slide['image'], $slide['sort_order']]
            );
        }
    }

    private function seedMenuCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_categories") > 0) return;
        $cats = [
            ['Khai vị', 'khai-vi', 'Các món khai vị ngon miệng', 1],
            ['Món chính', 'mon-chinh', 'Các món ăn chính đặc trưng', 2],
            ['Canh & Lẩu', 'canh-lau', 'Canh và các loại lẩu', 3],
            ['Tráng miệng', 'trang-miem', 'Các món tráng miệng ngọt ngào', 4],
            ['Đồ uống', 'do-uong', 'Nước uống và đồ giải khát', 5],
        ];
        foreach ($cats as [$name, $slug, $desc, $order]) {
            $this->execute(
                "INSERT INTO menu_categories (name, slug, description, sort_order) VALUES (?, ?, ?, ?)",
                [$name, $slug, $desc, $order]
            );
        }
    }

    private function seedMenuItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_items") > 0) return;
        $catIds = [];
        $cats = $this->query("SELECT id, slug FROM menu_categories");
        foreach ($cats as $cat) {
            $catIds[$cat['slug']] = $cat['id'];
        }
        $items = [
            // Khai vị
            ['khai-vi', 'Chả Giò Sài Gòn', 'cha-gio-sai-gon', 'Vỏ giòn, nhân thịt heo, miến, mộc nhĩ · 6 cái', 65000, 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=600&q=80&auto=format&fit=crop', 1, 1],
            ['khai-vi', 'Gỏi Cuốn Tôm Thịt', 'goi-cuon-tom-thit', 'Tôm sú, thịt heo, rau thơm, bánh tráng · 4 cuốn', 70000, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80&auto=format&fit=crop', 0, 2],
            ['khai-vi', 'Bánh Xèo', 'banh-xeo', 'Giòn rụm, nhân tôm thịt giá đỗ, ăn kèm rau sống', 75000, 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80&auto=format&fit=crop', 0, 3],
            ['khai-vi', 'Gỏi Xoài Tôm', 'goi-xoai-tom', 'Xoài xanh giòn, tôm luộc, đậu phộng rang, nước chấm đặc biệt', 80000, 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&q=80&auto=format&fit=crop', 0, 4],
            // Món chính
            ['mon-chinh', 'Phở Bò Đặc Biệt', 'pho-bo-dac-biet', 'Tái + chín + gầu + nước dùng ninh 12 giờ', 85000, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80&auto=format&fit=crop', 1, 1],
            ['mon-chinh', 'Bún Bò Huế', 'bun-bo-hue', 'Sả, mắm ruốc, chả lụa, thịt bò bắp hầm mềm', 75000, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80&auto=format&fit=crop', 0, 2],
            ['mon-chinh', 'Cơm Tấm Sườn Bì', 'com-tam-suon-bi', 'Sườn nướng, bì, chả trứng, nước mắm đặc biệt', 80000, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80&auto=format&fit=crop', 0, 3],
            ['mon-chinh', 'Mì Quảng Đặc Biệt', 'mi-quang-dac-biet', 'Mì vàng, tôm thịt, trứng cút, bánh tráng mè', 80000, 'https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=600&q=80&auto=format&fit=crop', 0, 4],
            ['mon-chinh', 'Bún Chả Hà Nội', 'bun-cha-ha-noi', 'Chả viên + chả miếng nướng than, bún tươi, rau thơm', 85000, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80&auto=format&fit=crop', 0, 5],
            // Canh & Lẩu
            ['canh-lau', 'Lẩu Thái Hải Sản', 'lau-thai-hai-san', 'Tôm, mực, nghêu, nấm, chua ngọt cay đặc trưng · 2 người', 350000, 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80&auto=format&fit=crop', 1, 1],
            ['canh-lau', 'Lẩu Bò Nhúng Dấm', 'lau-bo-nhung-dam', 'Bò Mỹ, rau cuốn, bánh tráng, nước lẩu chua ngọt · 2 người', 380000, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80&auto=format&fit=crop', 0, 2],
            ['canh-lau', 'Canh Chua Cá Lóc', 'canh-chua-ca-loc', 'Cá lóc, cà chua, thơm, me chua ngọt · 2-3 người', 180000, 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80&auto=format&fit=crop', 0, 3],
            // Tráng miệng
            ['trang-miem', 'Chè Ba Màu Đặc Biệt', 'che-ba-mau-dac-biet', 'Đậu xanh, đậu đỏ, thạch lá dứa, nước cốt dừa béo', 45000, 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80&auto=format&fit=crop', 0, 1],
            ['trang-miem', 'Bánh Flan Caramel', 'banh-flan-caramel', 'Mềm mịn, caramel thơm, ăn lạnh cực ngon', 35000, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80&auto=format&fit=crop', 0, 2],
            // Đồ uống
            ['do-uong', 'Cà Phê Sữa Đá', 'ca-phe-sua-da', 'Cà phê phin truyền thống, sữa đặc, đá', 35000, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80&auto=format&fit=crop', 0, 1],
            ['do-uong', 'Sinh Tố Trái Cây Tươi', 'sinh-to-trai-cay-tuoi', 'Xoài, bơ, dâu, chuối, dứa — theo mùa', 45000, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80&auto=format&fit=crop', 0, 2],
            ['do-uong', 'Nước Ép Rau Củ', 'nuoc-ep-rau-cu', 'Cà rốt + gừng, cần tây + táo, dưa hấu ép', 50000, 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&q=80&auto=format&fit=crop', 0, 3],
        ];
        foreach ($items as [$catSlug, $name, $slug, $desc, $price, $image, $featured, $order]) {
            $catId = $catIds[$catSlug] ?? null;
            $this->execute(
                "INSERT INTO menu_items (category_id, name, slug, description, price, image, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [$catId, $name, $slug, $desc, $price, $image, $featured, $order]
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $items = [
            ['Nguyễn Văn Hùng', 'Food Blogger · Hà Nội', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop&crop=face', 'Phở bò ngon nhất Hà Nội tôi từng ăn. Nước dùng đậm đà, thịt tươi mềm. Không gian ấm cúng, phục vụ chu đáo.', 5, 1],
            ['Trần Minh Anh', 'Khách hàng thường xuyên', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop&crop=face', 'Đặt bàn dễ dàng, không phải chờ. Bún bò Huế chuẩn vị, ngon hơn cả ngoài Huế. Sẽ quay lại ngay tuần tới!', 5, 2],
            ['Phạm Quang Minh', 'Du khách quốc tế', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face', 'Không gian đẹp, sạch sẽ. Nhân viên thân thiện. Đưa khách nước ngoài đến ăn, ai cũng khen nức nở.', 5, 3],
        ];
        foreach ($items as [$name, $title, $avatar, $content, $rating, $order]) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                [$name, $title, $avatar, $content, $rating, $order]
            );
        }
    }

    private function seedGallery(): void {
        if ($this->scalar("SELECT COUNT(*) FROM gallery_items") > 0) return;
        $items = [
            ['Không gian nhà hàng', 'Không gian ấm cúng và sang trọng', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop', 'interior', 1],
            ['Phở Bò Đặc Biệt', 'Món phở nổi tiếng của nhà hàng', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80&auto=format&fit=crop', 'food', 2],
            ['Bếp truyền thống', 'Đầu bếp nấu theo công thức gia truyền', 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80&auto=format&fit=crop', 'kitchen', 3],
            ['Chả Giò Sài Gòn', 'Món khai vị được yêu thích nhất', 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&q=80&auto=format&fit=crop', 'food', 4],
            ['Lẩu Thái Hải Sản', 'Lẩu phong phú và đa dạng', 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80&auto=format&fit=crop', 'food', 5],
            ['Không gian ngoài trời', 'Sân vườn xanh mát', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80&auto=format&fit=crop', 'interior', 6],
        ];
        foreach ($items as [$title, $desc, $image, $cat, $order]) {
            $this->execute(
                "INSERT INTO gallery_items (title, description, image, category, sort_order) VALUES (?, ?, ?, ?, ?)",
                [$title, $desc, $image, $cat, $order]
            );
        }
    }

    // ─── Query helpers ─────────────────────────────────────────────────────────

    public function query(string $sql, array $params = []): array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        return $row ?: null;
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
