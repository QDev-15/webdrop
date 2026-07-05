<?php
declare(strict_types=1);

class Database {
    private static ?self $instance = null;
    public readonly \PDO $pdo;

    private function __construct() {
        $dbFile = DB_FILE;
        $dbDir  = dirname($dbFile);
        if (!is_dir($dbDir)) { @mkdir($dbDir, 0755, true); }

        $isNew = !file_exists($dbFile);
        $this->pdo = new \PDO('sqlite:' . $dbFile);
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->pdo->exec('PRAGMA journal_mode = WAL');

        if ($isNew) { $this->migrate(); }
    }

    public static function getInstance(): self {
        if (self::$instance === null) { self::$instance = new self(); }
        return self::$instance;
    }

    public function query(string $sql, array $params = []): array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    public function execute(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (int)$this->pdo->lastInsertId();
    }

    private function migrate(): void {
        $sqlFile = __DIR__ . '/../schema.sql';
        $sql = file_get_contents($sqlFile);
        if ($sql === false) { throw new \RuntimeException('Cannot read schema.sql'); }
        $sql = preg_replace('/^\s*--.*$/m', '', $sql);
        $statements = array_filter(array_map('trim', explode(';', $sql)), fn($s) => $s !== '');
        foreach ($statements as $stmt) { $this->pdo->exec($stmt . ';'); }
        $this->seedData();
    }

    private function seedData(): void {
        $this->seedUsers();
        $this->seedSettings();
        $this->seedHeroSlides();
        $this->seedServiceCategories();
        $this->seedServices();
        $this->seedDoctors();
        $this->seedTestimonials();
    }

    private function seedUsers(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
        if ((int)$count > 0) return;
        $hash = password_hash('123456', PASSWORD_DEFAULT);
        $stmt = $this->pdo->prepare(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
        );
        $stmt->execute(['Admin', 'sysadmin@admin.com', $hash, 'superadmin']);
    }

    private function seedSettings(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM settings")->fetchColumn();
        if ((int)$count > 0) return;

        $rows = [
            // general
            ['site_name',        'Sunrise — Nha Khoa Gia Đình',                'general'],
            ['site_tagline',     'Nụ cười khoẻ mạnh cho cả gia đình bạn',      'general'],
            ['site_email',       'contact@sunrise-dental.vn',                  'general'],
            ['site_phone',       '0900 000 000',                               'general'],
            ['site_address',     '123 Đường Gia Đình, Quận 1, TP.HCM',         'general'],
            ['working_hours',    'Thứ 2 - Chủ nhật: 8:00 - 20:00',             'general'],
            // seo
            ['meta_title',       'Sunrise — Nha Khoa Gia Đình | Chăm sóc răng miệng cho cả nhà', 'seo'],
            ['meta_description', 'Sunrise Nha Khoa Gia Đình: phòng khám nha khoa thân thiện, ấm áp, phù hợp mọi lứa tuổi.', 'seo'],
            // social
            ['facebook',         'https://facebook.com/sunrise.dental',        'social'],
            ['instagram',        'https://instagram.com/sunrise.dental',       'social'],
            ['youtube',          'https://youtube.com/@sunrise.dental',        'social'],
            ['tiktok',           'https://tiktok.com/@sunrise.dental',         'social'],
            ['zalo',             '0900000000',                                  'social'],
            // footer
            ['footer_copy',      '© 2026 Sunrise — Nha Khoa Gia Đình. Bảo lưu mọi quyền.', 'footer'],
            ['footer_cert',      'Giấy phép hoạt động số XXX/BYT',             'footer'],
            // contact
            ['map_embed',        '',                                            'contact'],
            ['zalo_number',      '0900000000',                                  'contact'],
            // smtp
            ['smtp_host',        '',  'smtp'],
            ['smtp_port',        '',  'smtp'],
            ['smtp_user',        '',  'smtp'],
            ['smtp_pass',        '',  'smtp'],
            // system
            ['maintenance_mode', '0', 'system'],
            // cloudinary
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key',    '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            // integrations
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
            // hero
            ['hero_badge',       'Nha khoa gia đình thân thiện',               'hero'],
            ['hero_title',       'Nụ cười khoẻ mạnh cho cả gia đình bạn',      'hero'],
            ['hero_subtitle',    'Sunrise đồng hành cùng mọi thành viên trong gia đình — từ bé nhỏ đến ông bà — với dịch vụ nha khoa tận tâm, nhẹ nhàng và an toàn.', 'hero'],
            ['hero_image',       'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=900&q=80&auto=format&fit=crop', 'hero'],
            ['hero_float_years', '10 năm',                                     'hero'],
            ['hero_float_label', 'Đồng hành cùng gia đình Việt',               'hero'],
            ['hero_meta_families', '1.200+ gia đình tin tưởng',                'hero'],
            ['hero_meta_rating',   '4.9/5 từ khách hàng',                      'hero'],
            // about
            ['about_strip1_title', 'Không gian ấm áp, thân thiện như ở nhà',   'about'],
            ['about_strip1_text',  'Sunrise được xây dựng với mong muốn xoá bỏ nỗi lo "sợ đi nha sĩ" — không gian sáng, thoáng, thân thiện với trẻ nhỏ và người lớn tuổi.', 'about'],
            ['about_strip1_badge_num',   '15.000+',              'about'],
            ['about_strip1_badge_label', 'Lượt khám mỗi năm',   'about'],
            ['about_strip1_image', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80&auto=format&fit=crop', 'about'],
            ['about_strip2_title', 'Chăm sóc tận tâm, minh bạch chi phí',      'about'],
            ['about_strip2_text',  'Mọi phác đồ điều trị đều được tư vấn kỹ, giải thích rõ chi phí trước khi thực hiện — không phát sinh bất ngờ.', 'about'],
            ['about_strip2_badge_num',   '98%',                  'about'],
            ['about_strip2_badge_label', 'Khách hàng hài lòng',  'about'],
            ['about_strip2_image', 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80&auto=format&fit=crop', 'about'],
            // stats
            ['stat_years',            '10 năm',   'stats'],
            ['stat_years_label',      'Kinh nghiệm hoạt động', 'stats'],
            ['stat_families',         '1200+',    'stats'],
            ['stat_families_label',   'Gia đình tin tưởng',    'stats'],
            ['stat_staff',            '12+',      'stats'],
            ['stat_staff_label',      'Bác sĩ & nhân viên',    'stats'],
            ['stat_satisfaction',     '98%',      'stats'],
            ['stat_satisfaction_label', 'Khách hàng hài lòng', 'stats'],
        ];

        $stmt = $this->pdo->prepare("INSERT INTO settings (key, value, grp) VALUES (?, ?, ?)");
        foreach ($rows as $row) { $stmt->execute($row); }
    }

    private function seedHeroSlides(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM hero_slides")->fetchColumn();
        if ((int)$count > 0) return;
        $stmt = $this->pdo->prepare(
            "INSERT INTO hero_slides (title, subtitle, image, button_text, button_link, sort_order, status)
             VALUES (?, ?, ?, ?, ?, ?, 'published')"
        );
        $stmt->execute([
            'Nụ cười khoẻ mạnh cho cả gia đình',
            'Sunrise đồng hành cùng mọi thành viên trong gia đình với dịch vụ nha khoa tận tâm, nhẹ nhàng và an toàn.',
            'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1400&q=80&auto=format&fit=crop',
            'Đặt lịch khám ngay',
            '/dat-lich',
            1,
        ]);
    }

    private function seedServiceCategories(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM service_categories")->fetchColumn();
        if ((int)$count > 0) return;
        $cats = [
            ['Khám tổng quát & phòng ngừa', 'Kiểm tra định kỳ giúp phát hiện sớm vấn đề răng miệng', 1],
            ['Nha khoa trẻ em',              'Chăm sóc nhẹ nhàng, thân thiện dành riêng cho bé',       2],
            ['Nha khoa người lớn',           'Điều trị sâu răng, tủy răng và các vấn đề thường gặp',   3],
            ['Nha chu & phục hồi',           'Điều trị nướu và phục hình răng đã mất',                  4],
            ['Thẩm mỹ nha khoa',             'Nụ cười tự tin hơn với các dịch vụ thẩm mỹ răng',         5],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO service_categories (name, description, sort_order, is_active) VALUES (?, ?, ?, 1)"
        );
        foreach ($cats as $c) { $stmt->execute($c); }
    }

    private function seedServices(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM services")->fetchColumn();
        if ((int)$count > 0) return;

        $catRows = $this->pdo->query("SELECT id, name FROM service_categories ORDER BY sort_order")->fetchAll(\PDO::FETCH_ASSOC);
        $ids = array_column($catRows, 'id');

        // category ids by index: 0=kham, 1=tre-em, 2=nguoi-lon, 3=nha-chu, 4=tham-my
        [$c1, $c2, $c3, $c4, $c5] = array_pad($ids, 5, null);

        $services = [
            // Khám tổng quát
            [$c1, 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80&auto=format&fit=crop', 'Phòng ngừa', 'Khám & tư vấn tổng quát', 'Kiểm tra toàn diện tình trạng răng miệng, tư vấn kế hoạch chăm sóc phù hợp.', '150.000đ', '/ lượt', 1],
            [$c1, 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=80&auto=format&fit=crop', 'Phòng ngừa', 'Cạo vôi răng & đánh bóng', 'Loại bỏ mảng bám, vôi răng, giúp răng sạch khoẻ và hơi thở thơm mát.', '250.000đ', '/ lượt', 2],
            [$c1, 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80&auto=format&fit=crop', 'Chẩn đoán', 'Chụp X-quang kỹ thuật số', 'Phát hiện sớm sâu răng ẩn, tổn thương xương hàm bằng công nghệ hiện đại.', '120.000đ', '/ phim', 3],
            // Nha khoa trẻ em
            [$c2, 'https://images.unsplash.com/photo-1519457851262-eee5b2b93fe4?w=600&q=80&auto=format&fit=crop', 'Trẻ em', 'Khám răng cho bé', 'Khám nhẹ nhàng, làm quen với phòng nha giúp bé không còn sợ hãi.', '150.000đ', '/ lượt', 1],
            [$c2, 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600&q=80&auto=format&fit=crop', 'Trẻ em', 'Trám răng sữa', 'Xử lý sâu răng sữa bằng vật liệu an toàn, không đau cho trẻ nhỏ.', '300.000đ', '/ răng', 2],
            [$c2, 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80&auto=format&fit=crop', 'Trẻ em', 'Bôi Fluor & trám bít hố rãnh', 'Phòng ngừa sâu răng chủ động cho răng vĩnh viễn mới mọc của bé.', '200.000đ', '/ răng', 3],
            // Nha khoa người lớn
            [$c3, 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=80&auto=format&fit=crop', 'Điều trị', 'Trám răng Composite', 'Trám thẩm mỹ màu răng tự nhiên, phục hồi hình dạng và chức năng ăn nhai.', '400.000đ', '/ răng', 1],
            [$c3, 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80&auto=format&fit=crop', 'Điều trị', 'Điều trị tủy răng', 'Lấy tủy răng viêm bằng máy trâm xoay hiện đại, giảm đau tối đa.', '1.200.000đ', '/ răng', 2],
            [$c3, 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=600&q=80&auto=format&fit=crop', 'Điều trị', 'Nhổ răng khôn', 'Nhổ răng khôn an toàn với máy siêu âm Piezotome, ít sưng đau, hồi phục nhanh.', '800.000đ', '/ răng', 3],
            // Nha chu & phục hồi
            [$c4, 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=80&auto=format&fit=crop', 'Nha chu', 'Điều trị viêm nha chu', 'Điều trị viêm nướu, tụt lợi bằng phác đồ chuyên sâu, ngăn ngừa mất răng.', 'Từ 500.000đ', '/ liệu trình', 1],
            [$c4, 'https://images.unsplash.com/photo-1519457851262-eee5b2b93fe4?w=600&q=80&auto=format&fit=crop', 'Phục hồi', 'Cấy ghép Implant', 'Trồng răng Implant chuẩn quốc tế, phục hồi chức năng ăn nhai như răng thật.', 'Từ 15.000.000đ', '/ trụ', 2],
            [$c4, 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600&q=80&auto=format&fit=crop', 'Phục hồi', 'Bọc răng sứ thẩm mỹ', 'Phục hình răng sứ cao cấp, bền chắc, màu sắc tự nhiên như răng thật.', 'Từ 2.500.000đ', '/ răng', 3],
            // Thẩm mỹ
            [$c5, 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80&auto=format&fit=crop', 'Thẩm mỹ', 'Tẩy trắng răng Laser Whitening', 'Công nghệ tẩy trắng an toàn, cho nụ cười sáng khoẻ chỉ sau một liệu trình.', '1.800.000đ', '/ liệu trình', 1],
            [$c5, 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80&auto=format&fit=crop', 'Thẩm mỹ', 'Dán sứ Veneer', 'Cải thiện hình dạng, màu sắc răng nhanh chóng mà không cần mài nhiều răng thật.', 'Từ 4.000.000đ', '/ răng', 2],
            [$c5, 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&q=80&auto=format&fit=crop', 'Thẩm mỹ', 'Niềng răng khay trong suốt', 'Chỉnh nha thẩm mỹ, gần như vô hình, phù hợp cho người đi làm và học sinh.', 'Từ 35.000.000đ', '/ liệu trình', 3],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT INTO services (category_id, image, tag, name, description, price, price_unit, sort_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)"
        );
        foreach ($services as $s) { $stmt->execute($s); }
    }

    private function seedDoctors(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM doctors")->fetchColumn();
        if ((int)$count > 0) return;
        $doctors = [
            ['BS. Nguyễn Thị Lan Anh', 'Trưởng phòng khám',       14, 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=80&auto=format&fit=crop', 'Nha khoa tổng quát,Implant',  'Mọi nụ cười khoẻ mạnh đều bắt đầu từ sự thấu hiểu và kiên nhẫn.',         1],
            ['BS. Trần Minh Khôi',     'Chuyên khoa nha nhi',      9, 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=80&auto=format&fit=crop', 'Trẻ em,Phòng ngừa',          'Làm bạn với các bé trước khi làm bác sĩ của các bé.',                       2],
            ['BS. Phạm Thu Hà',        'Chuyên khoa chỉnh nha',    11, 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80&auto=format&fit=crop', 'Niềng răng,Thẩm mỹ',         'Nụ cười đều đẹp mang lại sự tự tin cho cả cuộc đời.',                       3],
            ['BS. Lê Hoàng Long',      'Chuyên khoa nha chu',       8, 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=500&q=80&auto=format&fit=crop', 'Nha chu,Phục hồi',           'Nướu khoẻ là nền tảng của một hàm răng bền vững.',                          4],
            ['BS. Đỗ Bảo Ngọc',        'Chuyên khoa Implant',      10, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=80&auto=format&fit=crop', 'Implant,Phẫu thuật',          'An toàn và chính xác là ưu tiên hàng đầu trong từng ca cấy ghép.',         5],
            ['BS. Vũ Thị Mai Anh',     'Chuyên khoa thẩm mỹ răng',  7, 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=500&q=80&auto=format&fit=crop', 'Veneer,Tẩy trắng',           'Thẩm mỹ răng miệng cần tự nhiên, hài hoà với gương mặt.',                   6],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO doctors (name, role, experience_years, photo, tags, quote, sort_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, 1)"
        );
        foreach ($doctors as $d) { $stmt->execute($d); }
    }

    private function seedTestimonials(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
        if ((int)$count > 0) return;
        $items = [
            ['Chị Thu Hằng',  'Phụ huynh bé Bông',    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=70&auto=format&fit=crop', 5, 'Bé nhà mình rất sợ nha sĩ nhưng đến Sunrise thì hết sợ luôn, bác sĩ nói chuyện với bé rất nhẹ nhàng.', 1],
            ['Anh Quốc Bảo',  'Khách hàng thân thiết', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=70&auto=format&fit=crop', 5, 'Bố mẹ tôi lớn tuổi nhưng vẫn thoải mái khi khám ở đây, ghế ngồi êm, bác sĩ giải thích rất kỹ.', 2],
            ['Chị Minh Ngọc', 'Khách hàng mới',        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=70&auto=format&fit=crop', 5, 'Đặt lịch online rất tiện, không phải chờ lâu. Chi phí được tư vấn rõ ràng ngay từ đầu.', 3],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO testimonials (author_name, author_meta, author_avatar, stars, quote, is_active, sort_order)
             VALUES (?, ?, ?, ?, ?, 1, ?)"
        );
        foreach ($items as $i) { $stmt->execute($i); }
    }
}
