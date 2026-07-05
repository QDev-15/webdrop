<?php
declare(strict_types=1);

class Database {
    private PDO $pdo;
    private static ?Database $instance = null;

    private function __construct(string $dbFile) {
        $dsn = "sqlite:{$dbFile}";
        $this->pdo = new PDO($dsn, null, null, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $this->pdo->exec("PRAGMA foreign_keys = ON");
        $this->pdo->exec("PRAGMA journal_mode = WAL");
    }

    public static function getInstance(): self {
        if (!self::$instance) {
            $dbFile = defined('DB_FILE') ? DB_FILE : __DIR__ . '/../data/vietduc.db';
            $dir = dirname($dbFile);
            if (!is_dir($dir)) { mkdir($dir, 0755, true); }
            self::$instance = new self($dbFile);
        }
        return self::$instance;
    }

    public function migrate(): void {
        $sql = file_get_contents(__DIR__ . '/../schema.sql');
        if ($sql === false) return;
        $sql        = preg_replace('/^\s*--.*$/m', '', $sql);
        $statements = array_filter(array_map('trim', explode(';', $sql)), fn($s) => $s !== '');
        foreach ($statements as $stmt) {
            $this->pdo->exec($stmt);
        }
    }

    public function seed(): void {
        $count = (int) $this->queryOne(
            "SELECT COUNT(*) as c FROM users",
            []
        )['c'];
        if ($count > 0) return;
        $this->seedUsers();
        $this->seedSettings();
        $this->seedHeroSlides();
        $this->seedServiceCategories();
        $this->seedServices();
        $this->seedDoctors();
        $this->seedTestimonials();
    }

    private function seedUsers(): void {
        $hash = password_hash('123456', PASSWORD_BCRYPT);
        $this->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['Administrator', 'sysadmin@admin.com', $hash, 'superadmin']
        );
    }

    private function seedSettings(): void {
        $rows = [
            // general
            ['site_name',          'Nha Khoa Quốc Tế Việt Đức',                      'general'],
            ['site_tagline',       'Chuẩn Quốc Tế — Chuyên Nghiệp — Tận Tâm',       'general'],
            ['site_phone',         '1900 1234',                                        'general'],
            ['site_email',         'contact@vietduc.vn',                               'general'],
            ['site_address',       '123 Nguyễn Huệ, Quận 1, TP.HCM',                 'general'],
            ['working_hours',      'T2-T7: 8:00-20:00 | CN: 8:00-17:00',             'general'],
            ['footer_copy',        '© 2025 Nha Khoa Quốc Tế Việt Đức',               'general'],
            ['footer_cert',        'DMCA Protected | ISO 9001 Certified',              'general'],
            // seo
            ['meta_title',         'Nha Khoa Quốc Tế Việt Đức — Chuẩn Quốc Tế',     'seo'],
            ['meta_description',   'Hệ thống nha khoa quốc tế với đội ngũ bác sĩ đa quốc gia, trang thiết bị hiện đại chuẩn quốc tế.', 'seo'],
            ['og_image',           '',                                                  'seo'],
            // social
            ['facebook',           'https://facebook.com/nhakhoavietduc',              'social'],
            ['youtube',            'https://youtube.com/@nhakhoavietduc',              'social'],
            ['zalo',               '1900 1234',                                        'social'],
            // hero
            ['hero_badge',         'Hệ Thống 12 Chi Nhánh',                           'hero'],
            ['hero_title',         'Nha Khoa Tiêu Chuẩn Quốc Tế',                    'hero'],
            ['hero_subtitle',      'Đội Ngũ Bác Sĩ Đa Quốc Gia',                     'hero'],
            ['hero_lead',          'Công nghệ hiện đại, đội ngũ bác sĩ đa quốc gia, chuẩn quốc tế trong từng chi tiết điều trị.', 'hero'],
            ['hero_image',         'https://images.unsplash.com/photo-1588776814546-1ffedbe47425?w=1200', 'hero'],
            ['hero_cta_primary',   'Đặt Lịch Khám Ngay',                              'hero'],
            ['hero_cta_secondary', 'Xem Dịch Vụ',                                     'hero'],
            // stats
            ['stat_branches',         '12',            'stats'],
            ['stat_branches_label',   'Chi Nhánh',     'stats'],
            ['stat_doctors',          '85+',           'stats'],
            ['stat_doctors_label',    'Bác Sĩ',        'stats'],
            ['stat_patients',         '120K+',         'stats'],
            ['stat_patients_label',   'Bệnh Nhân',     'stats'],
            ['stat_satisfaction',     '98%',           'stats'],
            ['stat_satisfaction_label','Hài Lòng',     'stats'],
            // contact
            ['contact_form_title', 'Liên Hệ Với Chúng Tôi',                          'contact'],
            ['map_embed',          '',                                                  'contact'],
            // branch info
            ['branch_hcm_address',   '123 Nguyễn Huệ, Q.1, TP.HCM',                 'branch'],
            ['branch_hcm_phone',     '028 1234 5678',                                  'branch'],
            ['branch_hn_address',    '456 Phan Chu Trinh, Hoàn Kiếm, Hà Nội',        'branch'],
            ['branch_hn_phone',      '024 1234 5678',                                  'branch'],
            ['branch_dn_address',    '789 Trần Phú, Hải Châu, Đà Nẵng',              'branch'],
            ['branch_dn_phone',      '0236 1234 567',                                  'branch'],
            ['branch_ct_address',    '321 Nguyễn An Ninh, Ninh Kiều, Cần Thơ',       'branch'],
            ['branch_ct_phone',      '0292 1234 567',                                  'branch'],
            ['branch_nt_address',    '654 Trần Phú, Nha Trang, Khánh Hòa',           'branch'],
            ['branch_nt_phone',      '0258 1234 567',                                  'branch'],
            // cloudinary
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_upload_preset', '', 'cloudinary'],
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'cloudinary'],
            // integrations
            ['google_analytics',   '',                                                 'integrations'],
            ['facebook_pixel',     '',                                                 'integrations'],
            ['chat_widget',        '',                                                 'integrations'],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT OR IGNORE INTO settings (key, value, grp) VALUES (?, ?, ?)"
        );
        foreach ($rows as $r) { $stmt->execute($r); }
    }

    private function seedHeroSlides(): void {
        $slides = [
            [
                'title'       => 'Nha Khoa Tiêu Chuẩn Quốc Tế',
                'subtitle'    => 'Hệ Thống 12 Chi Nhánh Toàn Quốc',
                'image'       => 'https://images.unsplash.com/photo-1588776814546-1ffedbe47425?w=1400',
                'button_text' => 'Đặt Lịch Khám',
                'button_link' => '/dat-lich',
                'sort_order'  => 1,
            ],
            [
                'title'       => 'Đội Ngũ Bác Sĩ Đa Quốc Gia',
                'subtitle'    => '85+ Chuyên Gia Trong và Ngoài Nước',
                'image'       => 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1400',
                'button_text' => 'Gặp Đội Ngũ',
                'button_link' => '/bac-si',
                'sort_order'  => 2,
            ],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO hero_slides (title, subtitle, image, button_text, button_link, sort_order)
             VALUES (:title, :subtitle, :image, :button_text, :button_link, :sort_order)"
        );
        foreach ($slides as $s) { $stmt->execute($s); }
    }

    private function seedServiceCategories(): void {
        $cats = [
            ['Khám Tổng Quát',         'Khám và phân tích tình trạng răng miệng tổng thể.', 1],
            ['Implant Nha Khoa',       'Cấy ghép răng Implant chuẩn quốc tế, bảo hành trọn đời.', 2],
            ['Chỉnh Nha',              'Niềng răng và chỉnh hình răng chuyên sâu.', 3],
            ['Răng Sứ Thẩm Mỹ',       'Bọc sứ, dán sứ và phục hình răng thẩm mỹ.', 4],
            ['Tẩy Trắng Răng',         'Làm trắng răng chuyên nghiệp an toàn hiệu quả.', 5],
            ['Răng Trẻ Em',            'Điều trị răng cho trẻ em chuyên nghiệp và nhẹ nhàng.', 6],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO service_categories (name, description, sort_order) VALUES (?, ?, ?)"
        );
        foreach ($cats as $c) { $stmt->execute($c); }
    }

    private function seedServices(): void {
        $services = [
            // Khám Tổng Quát (cat 1)
            [1, '', 'Cơ Bản',     'Khám tổng quát',         'Kiểm tra toàn diện tình trạng răng miệng, chụp X-quang 2D, lập kế hoạch điều trị.', '200.000', 'VND/lần', 1],
            [1, '', 'Nâng Cao',   'Khám chuyên sâu',        'Khám chuyên sâu với CT Cone Beam 3D, phân tích khớp cắn, tư vấn toàn diện.', '500.000', 'VND/lần', 2],
            // Implant (cat 2)
            [2, '', 'Tiêu Chuẩn', 'Implant cơ bản',         'Cấy ghép Implant cơ bản với trụ Titanium cao cấp, bảo hành 10 năm.', 'Từ 15.000.000', 'VND/răng', 3],
            [2, '', 'Cao Cấp',    'Implant All-on-4',        'Phục hồi nguyên hàm mất răng với 4 trụ Implant, tiết kiệm tối đa.', 'Từ 80.000.000', 'VND/hàm', 4],
            // Chỉnh Nha (cat 3)
            [3, '', 'Phổ Biến',   'Mắc cài kim loại',       'Niềng răng mắc cài kim loại truyền thống, hiệu quả cao, giá hợp lý.', 'Từ 25.000.000', 'VND/liệu trình', 5],
            [3, '', 'Thẩm Mỹ',    'Mắc cài sứ trong suốt',  'Niềng răng mắc cài sứ, thẩm mỹ hơn mắc cài kim loại.', 'Từ 35.000.000', 'VND/liệu trình', 6],
            [3, '', 'Hiện Đại',   'Invisalign niềng trong',  'Niềng răng trong suốt khay tháo lắp, tiện lợi và thẩm mỹ tuyệt đối.', 'Từ 55.000.000', 'VND/liệu trình', 7],
            // Răng Sứ (cat 4)
            [4, '', 'Kinh Tế',    'Sứ Zirconia cơ bản',     'Bọc sứ Zirconia trắng tự nhiên, độ bền cao, bảo hành 5 năm.', 'Từ 3.500.000', 'VND/răng', 8],
            [4, '', 'Cao Cấp',    'Veneer sứ dán răng',      'Dán sứ mỏng lên mặt răng, giữ tối đa men răng tự nhiên.', 'Từ 5.000.000', 'VND/răng', 9],
            // Tẩy Trắng (cat 5)
            [5, '', 'Nhanh',      'Tẩy trắng Laser',         'Tẩy trắng bằng công nghệ Laser Biolase, an toàn hiệu quả chỉ sau 1 giờ.', '3.500.000', 'VND/lần', 10],
            // Răng Trẻ Em (cat 6)
            [6, '', 'Phòng Ngừa', 'Trám răng sữa',           'Trám và điều trị răng sữa cho bé, hạn chế đau đớn tối đa.', 'Từ 300.000', 'VND/răng', 11],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO services (category_id, image, tag, name, description, price, price_unit, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($services as $s) { $stmt->execute($s); }
    }

    private function seedDoctors(): void {
        $doctors = [
            // Trong nuoc
            ['BS. Nguyễn Văn Minh',   'Giám Đốc Chuyên Môn',        'Trong nuoc', 18, '', 'Implant|Phẫu thuật hàm mặt', 'Tiến sĩ Nha khoa ĐH Y Hà Nội, nguyên chuyên viên WHO. 18 năm kinh nghiệm phẫu thuật Implant.', 1],
            ['BS. Trần Thị Lan',      'Trưởng Khoa Chỉnh Nha',      'Trong nuoc', 14, '', 'Chỉnh nha|Invisalign', 'Thạc sĩ Chỉnh nha ĐH Y Dược TP.HCM, chứng chỉ Invisalign Diamond Provider.', 2],
            ['BS. Lê Hoàng Phước',    'Chuyên Gia Răng Sứ',          'Trong nuoc', 12, '', 'Răng sứ|Thẩm mỹ', 'Thạc sĩ Nha khoa thẩm mỹ, đào tạo tại Pháp, chuyên gia Veneer và Full-arch phục hồi.', 3],
            ['BS. Phạm Thị Thu Hương','Chuyên Khoa Răng Trẻ Em',    'Trong nuoc',  9, '', 'Răng trẻ em|Dự phòng', 'Thạc sĩ Nha khoa trẻ em, chuyên viên điều trị răng cho bé từ 1 tuổi trở lên.', 4],
            // Quoc te
            ['Dr. James Patterson',   'International Implant Expert','Quoc te',    22, '', 'Implant|Bone graft', 'DDS from UCLA, Fellow of International Congress of Oral Implantologists. 22 years experience.', 5],
            ['Dr. Sophie Bernard',    'Orthodontics Specialist',     'Quoc te',    15, '', 'Chỉnh nha|Invisalign|Lingual', 'DDS Paris Descartes, certified Lingual orthodontist. Speaker at international conferences.', 6],
            ['Dr. Chen Wei',          'Prosthodontics & Aesthetics', 'Quoc te',    17, '', 'Răng sứ|All-on-4|Smile design', 'PhD Peking University, specialist in full-arch rehabilitation and digital smile design.', 7],
            ['Dr. Kim Soo-Young',     'Periodontology Expert',       'Quoc te',    11, '', 'Nha chu|Laser|Implant', 'DDS Seoul National University, specialist in laser periodontal therapy and Implant placement.', 8],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO doctors (name, role, flag, experience_years, photo, tags, description, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($doctors as $d) { $stmt->execute($d); }
    }

    private function seedTestimonials(): void {
        $testimonials = [
            ['Nguyễn Thị Hoa', 'Khách hàng — Cấy Implant', '', 5, 'Đã nhiều năm e ngại vì mất răng nhưng sau khi cấy Implant tại đây, răng đẹp và chắc như răng thật. Bác sĩ tận tình, phòng khám sạch sẽ chuẩn Mỹ.', 1],
            ['Trần Văn Nam',   'Khách hàng — Niềng răng',  '', 5, 'Tư vấn kỹ lưỡng, quá trình niềng răng thoải mái hơn mong đợi. Sau 18 tháng kết quả tuyệt vời, răng đều đẹp hơn nhiều.', 2],
            ['Lê Bích Ngọc',   'Khách hàng — Răng sứ',     '', 5, 'Bác sĩ tư vấn nhiệt tình, kỹ thuật bọc sứ Zirconia rất chính xác. Răng mới trắng tự nhiên không khác gì răng thật.', 3],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO testimonials (author_name, author_role, author_avatar, stars, content, sort_order)
             VALUES (?, ?, ?, ?, ?, ?)"
        );
        foreach ($testimonials as $i => $t) {
            $t[] = $i + 1;
            $stmt->execute($t);
        }
    }

    // ---- Query helpers ----

    public function query(string $sql, array $params = []): array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        return $row !== false ? $row : null;
    }

    public function execute(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (int) $this->pdo->lastInsertId();
    }
}
