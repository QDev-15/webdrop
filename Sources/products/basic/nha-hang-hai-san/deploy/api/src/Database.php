<?php
declare(strict_types=1);

class Database {
    private \PDO $pdo;
    private static ?Database $instance = null;

    private function __construct() {
        if (DB_TYPE === 'sqlite') {
            $dir = dirname(DB_FILE);
            if (!is_dir($dir)) { mkdir($dir, 0755, true); }
            $this->pdo = new \PDO('sqlite:' . DB_FILE);
            $this->pdo->exec('PRAGMA foreign_keys = ON');
            $this->pdo->exec('PRAGMA journal_mode = WAL');
        } else {
            $dsn = DB_TYPE . ':host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            $this->pdo = new \PDO($dsn, DB_USER, DB_PASS);
        }
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
        $this->migrate();
    }

    public static function getInstance(): self {
        if (self::$instance === null) {
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
            ['site_name',           'Vị Biển Hải Sản',                           'general'],
            ['site_description',    'Nhà hàng hải sản tươi sống nhập mỗi ngày từ ngư dân — từ biển đến bàn ăn của bạn.', 'general'],
            ['site_logo',           '',                                            'general'],
            ['site_favicon',        '',                                            'general'],
            ['site_email',          'contact@vibienhaiSAN.vn',                    'general'],
            ['site_phone',          '0901 234 567',                               'general'],
            ['site_phone_2',        '',                                            'general'],
            ['site_address',        '123 Đường Nguyễn Trãi, Phường Bến Thành, Quận 1, TP.HCM', 'general'],
            ['working_hours',       'Thứ 2–Thứ 6: 10:00–22:00 | Thứ 7–CN: 9:30–22:30', 'general'],
            // seo
            ['meta_title',          'Vị Biển Hải Sản — Tươi Sống Nhập Mỗi Ngày', 'seo'],
            ['meta_description',    'Nhà hàng hải sản tươi sống Vị Biển — tôm, cua, ghẹ, mực nhập từ ngư dân địa phương. Đặt bàn ngay!', 'seo'],
            ['meta_keywords',       'nhà hàng hải sản, hải sản tươi sống, tôm cua ghẹ, đặt bàn hải sản', 'seo'],
            ['og_image',            '',                                            'seo'],
            ['google_analytics_id', '',                                            'seo'],
            // social
            ['social_facebook',     'https://facebook.com/vibienhaiSAN',          'social'],
            ['social_youtube',      '',                                            'social'],
            ['social_instagram',    'https://instagram.com/vibienhaiSAN',         'social'],
            ['social_tiktok',       '',                                            'social'],
            ['social_zalo',         '0901234567',                                  'social'],
            // design
            ['primary_color',       '#0369a1',                                    'design'],
            ['secondary_color',     '#0c1720',                                    'design'],
            // footer
            ['footer_copyright',    '© 2025 Vị Biển Hải Sản · Made in Vietnam 🇻🇳', 'footer'],
            ['footer_description',  'Hải sản tươi sống nhập mỗi ngày — từ biển đến bàn ăn của bạn, không ướp lạnh lâu.', 'footer'],
            ['footer_show_social',  '1',                                           'footer'],
            // contact
            ['contact_form_enabled','1',                                           'contact'],
            ['contact_email_receiver','contact@vibienhaiSAN.vn',                  'contact'],
            ['google_map_embed',    '',                                            'contact'],
            // smtp
            ['smtp_host',           'smtp.gmail.com',                             'smtp'],
            ['smtp_port',           '587',                                         'smtp'],
            ['smtp_user',           '',                                            'smtp'],
            ['smtp_password',       '',                                            'smtp'],
            ['smtp_from_name',      'Vị Biển Hải Sản',                           'smtp'],
            ['smtp_from_email',     'contact@vibienhaiSAN.vn',                   'smtp'],
            // system
            ['maintenance_mode',    '0',                                           'system'],
            ['maintenance_message', 'Website đang bảo trì. Vui lòng quay lại sau.', 'system'],
            // about
            ['about_title',         'Câu chuyện tươi sống',                      'about'],
            ['about_content',       'Hành trình từ biển đến bàn ăn của bạn chỉ trong vài tiếng đồng hồ. Chúng tôi liên kết trực tiếp với 5 gia đình ngư dân địa phương, hải sản được vận chuyển về nhà hàng trước 8 giờ sáng hàng ngày.', 'about'],
            ['about_image',         'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=700&q=80&auto=format&fit=crop', 'about'],
            ['about_tagline',       'Từ biển đến bàn — không ướp lạnh lâu',      'about'],
            // reservation
            ['reservation_enabled', '1',                                           'reservation'],
            ['reservation_note',    'Đặt trước ít nhất 2 tiếng để được ưu đãi đĩa sashimi miễn phí (bàn từ 4 người).', 'reservation'],
            ['open_hours_text',     '10:00 – 22:00 hàng ngày (Thứ 7, CN mở từ 9:30)', 'reservation'],
            // cloudinary
            ['cloudinary_cloud_name', '',                                          'cloudinary'],
            ['cloudinary_api_key',    '',                                          'cloudinary'],
            ['cloudinary_api_secret', '',                                          'cloudinary'],
            ['cloudinary_folder',     'nha-hang-hai-san',                         'cloudinary'],
            // integrations
            ['unsplash_access_key',   '',                                          'integrations'],
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
                'title'       => 'Vị biển trên bàn ăn',
                'subtitle'    => 'Mỗi con tôm, mỗi con cua — đều được đưa thẳng từ biển về bàn của bạn trong ngày. Không qua cấp đông, không ướp lạnh lâu.',
                'button_text' => 'Xem thực đơn',
                'button_link' => '/menu',
                'image'       => 'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=1400&q=60&auto=format&fit=crop',
                'sort_order'  => 1,
            ],
            [
                'title'       => 'Hải sản tươi sống mỗi ngày',
                'subtitle'    => 'Nhập hải sản trực tiếp từ ngư dân địa phương mỗi buổi sáng. Tôm, cua, ghẹ, mực — luôn có đầy đủ trong bể sống.',
                'button_text' => 'Đặt bàn ngay',
                'button_link' => '/dat-ban',
                'image'       => 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1400&q=60&auto=format&fit=crop',
                'sort_order'  => 2,
            ],
        ];
        foreach ($slides as $slide) {
            $this->execute(
                "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order, status) VALUES (?,?,?,?,?,?,?)",
                [$slide['title'], $slide['subtitle'], $slide['button_text'], $slide['button_link'], $slide['image'], $slide['sort_order'], 'published']
            );
        }
    }

    private function seedMenuCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_categories") > 0) return;
        $categories = [
            ['Tôm',              'tom',           'Tôm sú và tôm thẻ tươi sống',           1],
            ['Cua & Ghẹ',        'cua-ghe',       'Cua biển và ghẹ xanh tươi sống',        2],
            ['Mực & Bạch Tuộc',  'muc-bach-tuoc', 'Mực ống, mực lá và bạch tuộc tươi sống', 3],
            ['Cá Biển',          'ca-bien',       'Cá mú, cá chẽm, cá hồng tươi sống',    4],
            ['Lẩu Hải Sản',      'lau-hai-san',   'Các loại lẩu hải sản đặc sắc',          5],
            ['Cơm & Ăn Kèm',    'com-an-kem',    'Cơm trắng, bánh mì và đồ uống',         6],
        ];
        foreach ($categories as [$name, $slug, $desc, $order]) {
            $this->execute(
                "INSERT INTO menu_categories (name, slug, description, sort_order, status) VALUES (?,?,?,?,?)",
                [$name, $slug, $desc, $order, 'published']
            );
        }
    }

    private function seedMenuItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_items") > 0) return;
        $catId = fn(string $slug) => (int)$this->scalar("SELECT id FROM menu_categories WHERE slug=?", [$slug]);

        $items = [
            // Tôm
            [$catId('tom'), 'Tôm Sú Hấp Sả', 'tom-su-hap-sa',
             'Tôm sú lớn hấp sả và gừng, chấm muối ớt chanh. Ngọt thịt, thơm sả, ăn là ghiền.',
             280000, null, 'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=300&q=80&auto=format&fit=crop', 'Tươi Sống', 1, 1],
            [$catId('tom'), 'Tôm Thẻ Nướng Muối Ớt', 'tom-the-nuong-muoi-ot',
             'Tôm thẻ nướng than, ướp muối ớt đặc trưng, thơm giòn vỏ, ngọt thịt bên trong.',
             250000, null, 'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=300&q=80&auto=format&fit=crop', 'Tươi Sống', 1, 2],
            [$catId('tom'), 'Tôm Sú Chiên Bơ Tỏi', 'tom-su-chien-bo-toi',
             'Chiên ngập bơ, tỏi phi vàng giòn, thơm lừng. Ăn kèm bánh mì hoặc cơm trắng.',
             300000, null, '', '', 0, 3],
            // Cua & Ghẹ
            [$catId('cua-ghe'), 'Cua Biển Rang Me', 'cua-bien-rang-me',
             'Best seller! Cua thịt chắc, rang với sốt me chua ngọt đặc biệt, thêm ớt sừng và hành lá.',
             450000, null, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&q=80&auto=format&fit=crop', 'Tươi Sống', 1, 1],
            [$catId('cua-ghe'), 'Cua Biển Hấp Bia', 'cua-bien-hap-bia',
             'Hấp với bia, sả, gừng — giữ nguyên vị ngọt tự nhiên của cua. Chấm muối tiêu chanh.',
             450000, null, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&q=80&auto=format&fit=crop', 'Tươi Sống', 0, 2],
            [$catId('cua-ghe'), 'Ghẹ Xanh Hấp Nước Dừa', 'ghe-xanh-hap-nuoc-dua',
             'Ghẹ vỏ mỏng, thịt ngọt, hấp nước dừa tươi, thơm béo. Phù hợp cả trẻ em lẫn người lớn.',
             220000, null, 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=300&q=80&auto=format&fit=crop', 'Tươi Sống', 0, 3],
            [$catId('cua-ghe'), 'Ghẹ Đỏ Nướng Muối Sả Ớt', 'ghe-do-nuong-muoi-sa-ot',
             'Nướng than hoa, ướp muối sả ớt thơm lừng. Ăn kèm bánh tráng, rau sống, mắm nêm.',
             240000, null, 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=300&q=80&auto=format&fit=crop', 'Tươi Sống', 0, 4],
            // Mực & Bạch Tuộc
            [$catId('muc-bach-tuoc'), 'Mực Lá Hấp Gừng', 'muc-la-hap-gung',
             'Mực lá to, thịt dày, hấp gừng giữ vị tươi ngọt. Chấm nước chấm gừng tỏi cực ngon.',
             220000, null, 'https://images.unsplash.com/photo-1513557234616-d3c6874e36d7?w=300&q=80&auto=format&fit=crop', 'Tươi Sống', 1, 1],
            [$catId('muc-bach-tuoc'), 'Mực Ống Nướng Sa Tế', 'muc-ong-nuong-sa-te',
             'Nướng than, ướp sa tế đặc trưng, cay vừa, thơm khói. Ăn với bánh mì hoặc cơm.',
             180000, null, 'https://images.unsplash.com/photo-1513557234616-d3c6874e36d7?w=300&q=80&auto=format&fit=crop', 'Tươi Sống', 0, 2],
            [$catId('muc-bach-tuoc'), 'Bạch Tuộc Baby Xào Bơ Tỏi', 'bach-tuoc-baby-xao-bo-toi',
             'Bạch tuộc baby nguyên con, xào bơ tỏi và rau thơm. Dai giòn, thơm bơ, ăn một lần là nhớ mãi.',
             200000, null, 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=300&q=80&auto=format&fit=crop', 'Tươi Sống', 0, 3],
            // Cá Biển
            [$catId('ca-bien'), 'Cá Mú Hấp Xì Dầu', 'ca-mu-hap-xi-dau',
             'Cá mú còn sống, hấp xì dầu kiểu Hồng Kông. Thịt trắng, ngọt, mềm — đỉnh cao của sự tươi ngon.',
             null, null, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&q=80&auto=format&fit=crop', 'Tươi Sống', 1, 1],
            [$catId('ca-bien'), 'Cá Chẽm Chiên Giòn Sốt Tỏi Ớt', 'ca-chem-chien-gion',
             'Chiên nguyên con, da giòn, thịt mềm, ăn kèm sốt tỏi ớt chua ngọt và rau thơm.',
             null, null, 'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=300&q=80&auto=format&fit=crop', 'Tươi Sống', 0, 2],
            // Lẩu Hải Sản
            [$catId('lau-hai-san'), 'Lẩu Thái Hải Sản Thập Cẩm', 'lau-thai-hai-san',
             'Nước dùng thái chua cay, combo tôm + cua + mực + cá + nấm + rau. Ăn cùng mì hoặc bún tươi.',
             280000, null, 'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=300&q=80&auto=format&fit=crop', '', 1, 1],
            [$catId('lau-hai-san'), 'Lẩu Mắm Hải Sản Miền Tây', 'lau-mam-hai-san',
             'Nước lẩu mắm đậm đà, thơm mắm cá, ăn kèm bông súng, rau đắng, hải sản tươi theo mùa.',
             320000, null, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&q=80&auto=format&fit=crop', '', 0, 2],
            [$catId('lau-hai-san'), 'Lẩu Cua Đồng Riêu Cà Chua', 'lau-cua-dong-rieu',
             'Nước dùng cua đồng ngọt thanh, cà chua, đậu phụ, rau muống. Ăn cùng bún tươi hoặc cơm.',
             350000, null, 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=300&q=80&auto=format&fit=crop', '', 0, 3],
            // Cơm & Ăn Kèm
            [$catId('com-an-kem'), 'Cơm Trắng', 'com-trang',
             '', 15000, null, '', '', 0, 1],
            [$catId('com-an-kem'), 'Bánh Mì Nướng Bơ Tỏi', 'banh-mi-nuong-bo-toi',
             '', 25000, null, '', '', 0, 2],
            [$catId('com-an-kem'), 'Đĩa Rau Sống', 'dia-rau-song',
             'Xà lách, dưa leo, cà chua, rau thơm các loại', 30000, null, '', '', 0, 3],
            [$catId('com-an-kem'), 'Bia Tiger / Heineken / 333', 'bia',
             '', 25000, null, '', '', 0, 4],
            [$catId('com-an-kem'), 'Nước Ngọt Lon', 'nuoc-ngot-lon',
             '', 18000, null, '', '', 0, 5],
            [$catId('com-an-kem'), 'Nước Dừa Tươi', 'nuoc-dua-tuoi',
             '', 35000, null, '', '', 0, 6],
        ];
        foreach ($items as [$catId, $name, $slug, $desc, $price, $priceSale, $img, $badge, $featured, $order]) {
            $this->execute(
                "INSERT OR IGNORE INTO menu_items (category_id, name, slug, description, price, price_sale, image, badge, featured, sort_order, status) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                [$catId, $name, $slug, $desc, $price, $priceSale, $img, $badge, $featured, $order, 'published']
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $items = [
            ['Phạm Minh Tuấn', 'Kỹ sư · TP.HCM', 5,
             'Cua rang me ở đây là tuyệt nhất tôi từng ăn. Cua tươi rõ ràng, thịt chắc và ngọt, sốt me vừa miệng không ngán. Gia đình 6 người ăn no nê, tốn chưa đến 1 triệu — giá rất hợp lý!', 1],
            ['Nguyễn Thanh Hoa', 'Giáo viên · Đà Nẵng', 5,
             'Tôm sú hấp sả ở đây cỡ to kinh, mỗi con gần 200g. Nhân viên tư vấn nhiệt tình, cho tự chọn con trong bể — cảm giác đó rất đặc biệt. Nhà hàng rộng rãi, đỗ xe dễ.', 2],
            ['Lê Văn Đức', 'Doanh nhân · Hà Nội', 5,
             'Đã ăn hải sản nhiều nơi nhưng ở đây độ tươi khác hẳn. Mực nướng sa tế thơm, dai giòn đúng điệu. Đặt bàn online dễ, có xác nhận nhanh. Sẽ giới thiệu cho bạn bè!', 3],
        ];
        foreach ($items as [$name, $title, $rating, $content, $order]) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, rating, content, sort_order, status) VALUES (?,?,?,?,?,?)",
                [$name, $title, $rating, $content, $order, 'published']
            );
        }
    }

    private function seedGallery(): void {
        if ($this->scalar("SELECT COUNT(*) FROM gallery_items") > 0) return;
        $items = [
            ['Tôm sú tươi sống', 'Tôm sú lớn từ biển về trong ngày', 'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=600&q=80&auto=format&fit=crop', 'hai-san', 1],
            ['Cua biển tươi', 'Cua biển thịt chắc, gạch nhiều', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80&auto=format&fit=crop', 'hai-san', 2],
            ['Ghẹ xanh', 'Ghẹ xanh vỏ mỏng thịt ngọt', 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=600&q=80&auto=format&fit=crop', 'hai-san', 3],
            ['Mực ống tươi', 'Mực ống tươi sống chế biến ngay', 'https://images.unsplash.com/photo-1513557234616-d3c6874e36d7?w=600&q=80&auto=format&fit=crop', 'hai-san', 4],
            ['Bạch tuộc', 'Bạch tuộc baby tươi ngon', 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600&q=80&auto=format&fit=crop', 'hai-san', 5],
            ['Không gian nhà hàng', 'Không gian rộng rãi, thoáng mát', 'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=600&q=80&auto=format&fit=crop', 'nha-hang', 6],
        ];
        foreach ($items as [$title, $desc, $img, $cat, $order]) {
            $this->execute(
                "INSERT INTO gallery_items (title, description, image, category, sort_order, status) VALUES (?,?,?,?,?,?)",
                [$title, $desc, $img, $cat, $order, 'published']
            );
        }
    }

    // ── Query helpers ──────────────────────────────────────────────────────────

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

    public function execute(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (int)$this->pdo->lastInsertId();
    }

    public function scalar(string $sql, array $params = []): mixed {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $val = $stmt->fetchColumn();
        return $val === false ? 0 : $val;
    }
}
