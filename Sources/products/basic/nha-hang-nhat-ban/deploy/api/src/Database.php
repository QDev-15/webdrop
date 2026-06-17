<?php
declare(strict_types=1);

class Database {
    private PDO $pdo;
    private static ?Database $instance = null;

    public static function getInstance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $dir = dirname(DB_FILE);
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        $this->pdo = new PDO('sqlite:' . DB_FILE);
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->pdo->exec('PRAGMA journal_mode = WAL');
        $this->migrate();
    }

    private function migrate(): void {
        $schemaPath = __DIR__ . '/../schema.sql';
        $schema = file_get_contents($schemaPath);
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
            ['site_name', 'Nhà Hàng Nhật Bản Omakase & Sushi', 'general'],
            ['site_description', 'Nhà hàng Nhật Bản chính thống — Omakase, Sushi, Ramen cao cấp. Trải nghiệm ẩm thực Nhật đích thực.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'info@nhahangnhat.vn', 'general'],
            ['site_phone', '0901 234 567', 'general'],
            ['site_phone_2', '', 'general'],
            ['site_address', 'Số nhà, Đường, Quận, TP.HCM', 'general'],
            ['working_hours', 'Thứ Ba – Thứ Sáu: 11:30–14:00 / 17:30–22:00 | Thứ Bảy – Chủ Nhật: 11:00–14:30 / 17:00–22:30 | Thứ Hai: Nghỉ', 'general'],
            // seo
            ['meta_title', 'Nhà Hàng Nhật Bản Omakase & Sushi — Ẩm thực Nhật chính thống', 'seo'],
            ['meta_description', 'Nhà hàng Nhật Bản chính thống với Omakase, Sushi, Ramen cao cấp. Bếp trưởng 15 năm kinh nghiệm tại Tokyo.', 'seo'],
            ['meta_keywords', 'nhà hàng nhật bản, omakase, sushi, sashimi, ramen, teppanyaki', 'seo'],
            ['og_image', '', 'seo'],
            ['google_analytics_id', '', 'seo'],
            // social
            ['social_facebook', 'https://facebook.com/', 'social'],
            ['social_instagram', 'https://instagram.com/', 'social'],
            ['social_youtube', '', 'social'],
            ['social_tiktok', '', 'social'],
            ['social_zalo', '0901234567', 'social'],
            // design
            ['primary_color', '#dc2626', 'design'],
            ['secondary_color', '#1a1a1a', 'design'],
            // footer
            ['footer_copyright', '© 2024 Nhà Hàng Nhật Bản · Made in Vietnam', 'footer'],
            ['footer_description', 'Nhà hàng Nhật Bản chính thống — nơi nghệ thuật ẩm thực và triết lý thiền định gặp nhau trên từng đĩa thức ăn.', 'footer'],
            ['footer_show_social', '1', 'footer'],
            // contact
            ['contact_form_enabled', '1', 'contact'],
            ['contact_email_receiver', 'info@nhahangnhat.vn', 'contact'],
            ['google_map_embed', '', 'contact'],
            // smtp
            ['smtp_host', 'smtp.gmail.com', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_password', '', 'smtp'],
            ['smtp_from_name', 'Nhà Hàng Nhật Bản', 'smtp'],
            ['smtp_from_email', '', 'smtp'],
            // system
            ['maintenance_mode', '0', 'system'],
            ['maintenance_message', 'Website đang bảo trì. Vui lòng quay lại sau.', 'system'],
            // about
            ['about_title', 'Người đứng sau mỗi món ăn', 'about'],
            ['about_content', 'Bếp trưởng có hơn 15 năm học nghề và làm việc tại Tokyo — từ nhà hàng izakaya nhỏ ở Shinjuku đến nhà hàng 2 sao Michelin ở Ginza. Mang triết lý "mỗi nguyên liệu là một câu chuyện" về Việt Nam, xây dựng nhà hàng như một không gian thiền định qua ẩm thực.', 'about'],
            ['about_image', 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=700&q=80&auto=format&fit=crop&crop=faces,center', 'about'],
            ['about_tagline', 'Bếp trưởng 15 năm kinh nghiệm tại Tokyo', 'about'],
            // reservation
            ['reservation_enabled', '1', 'reservation'],
            ['reservation_deposit_note', 'Gói Omakase yêu cầu đặt cọc 30% giá trị để xác nhận chỗ. Hủy trước 48 giờ: hoàn cọc 100%.', 'reservation'],
            ['sushi_bar_seats', '8', 'reservation'],
            // cloudinary
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key', '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            ['cloudinary_upload_folder', 'nha-hang-nhat-ban', 'cloudinary'],
            // integrations
            ['unsplash_access_key', '', 'integrations'],
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
                'title' => 'Nghệ thuật omakase đích thực.',
                'subtitle' => 'Mỗi bữa ăn là một hành trình — nơi bếp trưởng kinh nghiệm 15 năm tại Tokyo sáng tạo thực đơn theo nguyên liệu tươi nhất trong ngày.',
                'button_text' => 'Đặt bàn Omakase',
                'button_link' => '/dat-ban',
                'image' => 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=900&q=80&auto=format&fit=crop',
                'sort_order' => 0,
            ],
            [
                'title' => 'Sushi Bar Counter — 8 ghế độc quyền',
                'subtitle' => 'Ngồi trực tiếp tại quầy — quan sát bếp trưởng sáng tạo từng miếng sushi, tương tác và hỏi về từng nguyên liệu.',
                'button_text' => 'Trải nghiệm Sushi Bar',
                'button_link' => '/sushi-bar',
                'image' => 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=900&q=80&auto=format&fit=crop',
                'sort_order' => 1,
            ],
        ];
        foreach ($slides as $s) {
            $this->execute(
                "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                [$s['title'], $s['subtitle'], $s['button_text'], $s['button_link'], $s['image'], $s['sort_order']]
            );
        }
    }

    private function seedMenuCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_categories") > 0) return;
        $cats = [
            ['Sashimi', 'sashimi', 'Sashimi tươi từ cá nguyên liệu nhập Nhật mỗi ngày', 1],
            ['Sushi & Maki Roll', 'sushi-maki', 'Nigiri, maki roll đặc biệt từ bàn tay bếp trưởng', 2],
            ['Ramen & Udon', 'ramen-udon', 'Ramen Hakata, Shoyu và Udon truyền thống Nhật', 3],
            ['Teppanyaki', 'teppanyaki', 'Wagyu A5 và hải sản nướng teppan trực tiếp trước mặt thực khách', 4],
            ['Set Cơm Nhật', 'set-com', 'Set ăn trưa và tối chuẩn Nhật — teishoku', 5],
            ['Tráng miệng & Đồ uống', 'trang-miem', 'Matcha parfait, sake, shochu và trà Nhật thượng hạng', 6],
        ];
        foreach ($cats as [$name, $slug, $desc, $sort]) {
            $this->execute(
                "INSERT INTO menu_categories (name, slug, description, sort_order) VALUES (?, ?, ?, ?)",
                [$name, $slug, $desc, $sort]
            );
        }
    }

    private function seedMenuItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_items") > 0) return;
        $catIds = [];
        foreach ($this->query("SELECT id, slug FROM menu_categories") as $c) {
            $catIds[$c['slug']] = $c['id'];
        }
        $items = [
            // Sashimi
            [$catIds['sashimi'] ?? null, 'Sake Sashimi — 5 lát cá hồi', 'sake-sashimi', 'Cá hồi Nauy loại A1, thịt đỏ tươi, béo tự nhiên, tan trong miệng. Phục vụ kèm wasabi tươi và gừng ngâm.', 280000, null, 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=70&auto=format&fit=crop', 1, null, 1],
            [$catIds['sashimi'] ?? null, 'Sashimi Đặc Tuyển — 9 loại cá', 'sashimi-dac-tuyen', 'Đĩa sashimi 9 loại theo mùa: cá hồi, cá ngừ, bạch tuộc, tôm ngọt, sò điệp, cua, cá tráp đỏ, nhím biển và cá kiếm.', 680000, null, 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&q=70&auto=format&fit=crop', 1, 'Bestseller', 2],
            [$catIds['sashimi'] ?? null, 'Maguro Sashimi — Cá ngừ đỏ', 'maguro-sashimi', 'Cá ngừ vây xanh (Bluefin Tuna) nhập Nhật, thịt đỏ thẫm, vị umami đậm, kết cấu mềm mịn khác biệt hoàn toàn cá ngừ thường.', 380000, null, 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&q=70&auto=format&fit=crop', 0, null, 3],
            // Sushi & Maki
            [$catIds['sushi-maki'] ?? null, 'Otoro Nigiri — Cá ngừ bụng béo', 'otoro-nigiri', 'Miếng sushi tinh hoa — cá ngừ phần bụng béo nhất, marbling trắng, tan chảy ngay khi đặt vào miệng.', 450000, null, 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&q=70&auto=format&fit=crop', 1, 'Signature', 1],
            [$catIds['sushi-maki'] ?? null, 'Uni Nigiri — Nhím Biển Hokkaido', 'uni-nigiri', 'Nhím biển vàng Hokkaido tươi sống đặt trên cơm sushi ấm — vị ngọt biển tự nhiên, béo mịn, không tanh.', 420000, null, 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=70&auto=format&fit=crop', 1, 'Limited', 2],
            [$catIds['sushi-maki'] ?? null, 'Dragon Roll — Cuộn Rồng', 'dragon-roll', 'Tôm tempura, phô mai kem, dưa leo cuộn trong cơm sushi, phủ lát bơ mỏng xếp như vảy rồng. Sốt teriyaki ngọt và spicy mayo.', 320000, null, 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=70&auto=format&fit=crop', 0, null, 3],
            // Ramen & Udon
            [$catIds['ramen-udon'] ?? null, 'Hakata Ramen — Đặc Sản Fukuoka', 'hakata-ramen', 'Nước dùng tonkotsu hầm 18 tiếng từ xương heo Nhật, mì sợi mỏng Hakata, chashu nướng, trứng luộc marinate và bơ tỏi đen.', 195000, null, 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&q=70&auto=format&fit=crop', 1, 'Bestseller', 1],
            [$catIds['ramen-udon'] ?? null, 'Shoyu Ramen — Vị Tương Nhật', 'shoyu-ramen', 'Nước dùng gà trong vắt với tương shoyu Nhật, mì xoăn vàng, chashu lợn, bamboo, nori và hành lá. Vị thanh, đậm umami.', 175000, null, 'https://images.unsplash.com/photo-1540648639573-8c848de23f0a?w=400&q=70&auto=format&fit=crop', 0, null, 2],
            [$catIds['ramen-udon'] ?? null, 'Niku Udon — Udon Thịt Bò', 'niku-udon', 'Sợi udon dày mềm dẻo trong nước dùng dashi-tsuyu trong, phủ thịt bò mỏng xào teriyaki nhẹ, hành tây caramel và tempura tôm.', 185000, null, 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=70&auto=format&fit=crop', 0, null, 3],
            // Teppanyaki
            [$catIds['teppanyaki'] ?? null, 'Wagyu A5 Teppanyaki', 'wagyu-a5-teppanyaki', 'Thịt bò Wagyu A5 Miyazaki nướng trực tiếp trên bàn teppan trước mặt thực khách. Marbling hoàn hảo, không cần gia vị thêm.', 650000, null, 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&q=70&auto=format&fit=crop', 1, 'Signature', 1],
            [$catIds['teppanyaki'] ?? null, 'Tôm Hùm Teppanyaki', 'tom-hum-teppanyaki', 'Tôm hùm Canada tươi sống bổ đôi nướng teppan với bơ tỏi, sake và muối biển Okinawa. Kèm cơm trắng Nhật và súp miso.', 780000, null, 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=70&auto=format&fit=crop', 0, null, 2],
            // Set cơm
            [$catIds['set-com'] ?? null, 'Set Cá Hồi Nướng Muối', 'set-ca-hoi-nuong-muoi', 'Cá hồi nướng muối giòn da, kèm cơm trắng Nhật, súp miso truyền thống, salad rau trộn, dưa tsukemono và tráng miệng nhỏ.', 245000, null, 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=70&auto=format&fit=crop', 0, 'Lunch Set', 1],
            [$catIds['set-com'] ?? null, 'Uni Don — Cơm Nhím Biển Hokkaido', 'uni-don', 'Nhím biển vàng Hokkaido phủ đầy trên cơm sushi, kèm trứng cá hồi, rong biển và shoyu Nhật. Số lượng giới hạn mỗi ngày.', 480000, null, 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&q=70&auto=format&fit=crop', 1, 'Limited / Ngày', 2],
            // Tráng miệng
            [$catIds['trang-miem'] ?? null, 'Matcha Parfait Kyoto', 'matcha-parfait', 'Kem matcha Uji, mochi mềm, đậu đỏ azuki, crumble trà xanh, kem tươi Hokkaido đánh bông. Kết thúc hoàn hảo cho bữa ăn.', 125000, null, 'https://images.unsplash.com/photo-1540648639573-8c848de23f0a?w=400&q=70&auto=format&fit=crop', 1, null, 1],
            [$catIds['trang-miem'] ?? null, 'Dassai 23 — Junmai Daiginjo', 'dassai-23', 'Sake hàng đầu Nhật Bản từ Yamaguchi — gạo xay tới 23%, hương hoa đào tinh tế, vị ngọt thanh, finish dài và sạch.', 280000, null, 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=70&auto=format&fit=crop', 0, null, 2],
        ];
        foreach ($items as [$catId, $name, $slug, $desc, $price, $priceSale, $image, $featured, $badge, $sort]) {
            $this->execute(
                "INSERT INTO menu_items (category_id, name, slug, description, price, price_sale, image, featured, badge, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [$catId, $name, $slug, $desc, $price, $priceSale, $image, $featured, $badge, $sort]
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $data = [
            ['Nguyễn Thanh Hà', 'Giám đốc điều hành · TP.HCM', 5, 'Tôi đã ăn omakase ở nhiều nơi trên thế giới, nhưng bữa ăn tại đây là một trong những trải nghiệm đáng nhớ nhất. Bếp trưởng giải thích tỉ mỉ từng nguyên liệu, cách kết hợp hương vị — cảm giác như đang học một lớp ẩm thực cao cấp. Otoro tan ngay khi vừa đặt vào miệng.', 1],
            ['David Chen', 'Doanh nhân · Singapore', 5, 'Không gian tối giản nhưng rất tinh tế — ánh sáng, âm nhạc, từng chi tiết đều được tính toán để không làm phân tán khỏi món ăn. Uni don là món tôi sẽ quay lại chỉ vì nó. Dịch vụ hoàn hảo từ đầu đến cuối.', 2],
            ['Trần Minh Khải', 'Food blogger · Hà Nội', 5, 'Hakata Ramen ở đây chuẩn Fukuoka hơn nhiều nhà hàng tôi từng thử tại Nhật. Nước dùng đặc, béo, thơm mà không ngán. Mì đúng độ dai. Nhân viên phục vụ thân thiện và hiểu biết về món ăn — có thể tư vấn sake phù hợp với từng món rất chuyên nghiệp.', 3],
        ];
        foreach ($data as [$name, $title, $rating, $content, $sort]) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, rating, content, sort_order) VALUES (?, ?, ?, ?, ?)",
                [$name, $title, $rating, $content, $sort]
            );
        }
    }

    private function seedGallery(): void {
        if ($this->scalar("SELECT COUNT(*) FROM gallery_items") > 0) return;
        $items = [
            ['Sashimi đặc tuyển', 'Đĩa sashimi 9 loại tươi nhất trong ngày', 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80&auto=format&fit=crop', 'sashimi', 1],
            ['Otoro Nigiri', 'Cá ngừ bụng béo — tinh hoa của sushi', 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&q=80&auto=format&fit=crop', 'sushi', 2],
            ['Hakata Ramen', 'Tonkotsu đặc sệt hầm 18 tiếng', 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80&auto=format&fit=crop', 'ramen', 3],
            ['Sake Collection', 'Bộ sưu tập hơn 40 loại sake Nhật', 'https://images.unsplash.com/photo-1540648639573-8c848de23f0a?w=600&q=80&auto=format&fit=crop', 'sake', 4],
            ['Dragon Roll', 'Maki roll đặc biệt phủ bơ nguyên lát', 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80&auto=format&fit=crop', 'sushi', 5],
            ['Matcha Parfait', 'Tráng miệng matcha Kyoto chính gốc', 'https://images.unsplash.com/photo-1540648639573-8c848de23f0a?w=600&q=80&auto=format&fit=crop', 'dessert', 6],
        ];
        foreach ($items as [$title, $desc, $image, $cat, $sort]) {
            $this->execute(
                "INSERT INTO gallery_items (title, description, image, category, sort_order) VALUES (?, ?, ?, ?, ?)",
                [$title, $desc, $image, $cat, $sort]
            );
        }
    }

    // ── Query helpers ───────────────────────────────────────────────────────────
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
