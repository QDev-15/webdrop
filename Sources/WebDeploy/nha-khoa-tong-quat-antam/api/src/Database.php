<?php
declare(strict_types=1);

class Database {
    private \PDO $pdo;
    private static ?Database $instance = null;

    public function __construct() {
        $dbFile = DB_FILE;
        $dbDir  = dirname($dbFile);
        if (!is_dir($dbDir)) { @mkdir($dbDir, 0755, true); }

        $this->pdo = new \PDO('sqlite:' . $dbFile);
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE,            \PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->pdo->exec('PRAGMA journal_mode = WAL');

        $this->migrate();
    }

    public static function getInstance(): self {
        if (!self::$instance) self::$instance = new self();
        return self::$instance;
    }

    // ── Migration ──────────────────────────────────────────────────────────
    private function migrate(): void {
        $sqlFile = __DIR__ . '/../schema.sql';
        $sql = file_get_contents($sqlFile);
        if ($sql === false) {
            throw new \RuntimeException('Cannot read schema.sql — file missing or unreadable.');
        }
        // Strip comments before splitting by semicolon
        $sql = preg_replace('/^\s*--.*$/m', '', $sql);
        $statements = array_filter(
            array_map('trim', explode(';', $sql)),
            fn($s) => $s !== ''
        );
        foreach ($statements as $stmt) {
            $this->pdo->exec($stmt . ';');
        }
        $this->seedData();
    }

    // ── Seed ──────────────────────────────────────────────────────────────
    private function seedData(): void {
        // Only seed when tables are empty
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM settings")->fetchColumn();
        if ($count > 0) return;

        $this->seedUsers();
        $this->seedSettings();
        $this->seedServiceCategories();
        $this->seedServices();
        $this->seedDoctors();
        $this->seedTestimonials();
    }

    private function seedUsers(): void {
        $this->pdo->prepare(
            "INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
        )->execute([
            'Admin',
            'sysadmin@admin.com',
            password_hash('123456', PASSWORD_BCRYPT),
            'superadmin',
        ]);
    }

    private function seedSettings(): void {
        $settings = [
            // general
            ['site_name',       'Nha Khoa An Tâm',                               'general'],
            ['site_tagline',    'Nha khoa tổng quát — Không gian yên tĩnh',       'general'],
            ['site_email',      'lienhe@nhakhoaantam.vn',                          'general'],
            ['site_phone',      '028 1234 5678',                                   'general'],
            ['site_address',    '123 Đường Nguyễn Đình Chiểu, Quận 3, TP.HCM',    'general'],
            ['working_hours',   'Thứ 2 – Chủ nhật · 8:00 – 20:00',                'general'],
            ['zalo_number',     '0281234567',                                       'general'],
            // seo
            ['meta_title',      'Nha Khoa An Tâm — Nha Khoa Tổng Quát, Không Gian Yên Tĩnh', 'seo'],
            ['meta_description','Phòng khám nha khoa tổng quát với không gian yên tĩnh, tối giản — nơi mọi lo âu được lắng nghe trước khi điều trị.',  'seo'],
            ['meta_keywords',   'nha khoa tổng quát, nha khoa an tâm, khám răng, trám răng, nha chu', 'seo'],
            // social
            ['facebook',        'https://facebook.com/nhakhoaantam',               'social'],
            ['instagram',       'https://instagram.com/nhakhoaantam',              'social'],
            ['youtube',         '',                                                 'social'],
            ['tiktok',          '',                                                 'social'],
            ['zalo',            'https://zalo.me/0281234567',                       'social'],
            // footer
            ['footer_desc',     'Phòng khám nha khoa tổng quát với không gian tối giản, yên tĩnh — nơi mọi lo âu được lắng nghe trước khi điều trị.', 'footer'],
            ['footer_copyright','© 2026 Nha Khoa An Tâm. Mọi quyền được bảo lưu.', 'footer'],
            // contact
            ['map_embed',       'https://www.google.com/maps?q=Ho+Chi+Minh+City,+Vietnam&output=embed', 'contact'],
            ['parking_note',    'Có chỗ đậu xe cho khách hàng',                   'contact'],
            // smtp
            ['smtp_host',       '',                                                 'smtp'],
            ['smtp_port',       '587',                                              'smtp'],
            ['smtp_user',       '',                                                 'smtp'],
            ['smtp_pass',       '',                                                 'smtp'],
            ['smtp_from_name',  'Nha Khoa An Tâm',                                 'smtp'],
            ['smtp_from_email', 'lienhe@nhakhoaantam.vn',                           'smtp'],
            // stats
            ['stat_patients',   '10.000+',                                          'stats'],
            ['stat_years',      '12',                                               'stats'],
            ['stat_satisfaction','98%',                                             'stats'],
            ['stat_pressure',   '0',                                                'stats'],
            // about / philosophy
            ['calm_quote',      'Chúng tôi tin rằng sự an tâm bắt đầu từ một không gian yên tĩnh — nơi mọi lo lắng được lắng nghe trước khi điều trị.', 'about'],
            ['calm_attr_name',  'BS. Nguyễn Thị Minh Anh',                         'about'],
            ['calm_attr_role',  'Sáng lập Nha Khoa An Tâm',                        'about'],
            // system
            ['app_version',     '1.0.0',                                            'system'],
            ['timezone',        'Asia/Ho_Chi_Minh',                                 'system'],
            // cloudinary
            ['cloudinary_cloud_name', '',                                            'cloudinary'],
            ['cloudinary_api_key',    '',                                            'cloudinary'],
            ['cloudinary_api_secret', '',                                            'cloudinary'],
            ['cloudinary_upload_preset', '',                                         'cloudinary'],
            // integrations
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT OR IGNORE INTO settings (key, value, \"group\") VALUES (?, ?, ?)"
        );
        foreach ($settings as [$key, $value, $group]) {
            $stmt->execute([$key, $value, $group]);
        }
    }

    private function seedServiceCategories(): void {
        $cats = [
            ['Khám & phòng ngừa', 'kham-phong-ngua', 1],
            ['Điều trị',          'dieu-tri',         2],
            ['Thẩm mỹ răng',      'tham-my-rang',     3],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT OR IGNORE INTO service_categories (name, slug, sort_order) VALUES (?, ?, ?)"
        );
        foreach ($cats as [$name, $slug, $order]) {
            $stmt->execute([$name, $slug, $order]);
        }
    }

    private function seedServices(): void {
        // category IDs from seeded categories
        $catId = fn(string $slug) => (int)$this->pdo->prepare(
            "SELECT id FROM service_categories WHERE slug = ?"
        )->execute([$slug]) ? $this->pdo->query("SELECT id FROM service_categories WHERE slug = '$slug'")->fetchColumn() : null;

        $c1 = $catId('kham-phong-ngua');
        $c2 = $catId('dieu-tri');
        $c3 = $catId('tham-my-rang');

        $services = [
            [$c1, '01', 'Khám tổng quát & tư vấn',           'Kiểm tra tổng thể sức khỏe răng miệng, chụp X-quang nếu cần, tư vấn lộ trình điều trị phù hợp.',         '200.000đ',      '/ lượt khám', 1, 1],
            [$c1, '02', 'Cạo vôi răng & đánh bóng',          'Lấy cao răng bằng máy siêu âm, đánh bóng bề mặt, phòng ngừa viêm nướu và hôi miệng.',                    '300.000đ',      '/ lượt',       1, 2],
            [$c1, '03', 'Chụp X-quang răng',                  'Chụp phim kỹ thuật số hỗ trợ chẩn đoán chính xác trước khi điều trị.',                                   '100.000đ',      '/ phim',       0, 3],
            [$c1, '04', 'Trám bít hố rãnh phòng sâu răng',   'Phòng ngừa sâu răng cho răng hàm, đặc biệt phù hợp với trẻ em và người mới mọc răng khôn.',               '150.000đ',      '/ răng',       0, 4],
            [$c2, '05', 'Trám răng thẩm mỹ (Composite)',     'Trám khít sát, đúng màu răng thật, phục hồi hình dáng và chức năng ăn nhai tự nhiên.',                     'Từ 350.000đ',   '/ răng',       1, 5],
            [$c2, '06', 'Điều trị tủy răng',                  'Lấy tủy viêm, làm sạch và trám kín ống tủy — giữ lại răng thật, hạn chế nhổ bỏ.',                        'Từ 1.200.000đ', '/ răng',       0, 6],
            [$c2, '07', 'Nhổ răng nhẹ nhàng',                 'Kỹ thuật gây tê êm ái, thao tác nhanh gọn, hướng dẫn chăm sóc phục hồi sau nhổ.',                        'Từ 500.000đ',   '/ răng',       1, 7],
            [$c2, '08', 'Nhổ răng khôn',                      'Đánh giá bằng phim X-quang, nhổ răng khôn mọc lệch, mọc ngầm bằng kỹ thuật hiện đại.',                   'Từ 1.000.000đ', '/ răng',       0, 8],
            [$c2, '09', 'Điều trị nha chu',                   'Chăm sóc chuyên sâu nướu và mô nha chu, ngăn ngừa tụt lợi, lung lay và mất răng sớm.',                   'Từ 800.000đ',   '/ liệu trình', 1, 9],
            [$c3, '10', 'Tẩy trắng răng',                     'Công nghệ ánh sáng lạnh, an toàn cho men răng, hiệu quả rõ rệt sau một lần thực hiện.',                   'Từ 1.500.000đ', '/ hàm',        1, 10],
            [$c3, '11', 'Bọc răng sứ thẩm mỹ',               'Phục hình răng sứ cao cấp, đúng tỷ lệ khuôn mặt, độ bền cao và tự nhiên như răng thật.',                  'Từ 2.500.000đ', '/ răng',       0, 11],
            [$c3, '12', 'Niềng răng chỉnh nha',               'Tư vấn phác đồ chỉnh nha phù hợp, đồng hành trong suốt quá trình điều trị dài hạn.',                     'Liên hệ',       'tư vấn miễn phí', 0, 12],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT OR IGNORE INTO services (category_id, number, name, description, price, price_unit, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($services as $s) {
            $stmt->execute($s);
        }
    }

    private function seedDoctors(): void {
        $doctors = [
            [
                'BS. Nguyễn Thị Minh Anh',
                'Trưởng khoa Tổng quát',
                'Với hơn 12 năm kinh nghiệm, bác sĩ Minh Anh chuyên về nha khoa tổng quát và nha chu, luôn ưu tiên phương pháp điều trị nhẹ nhàng, ít xâm lấn.',
                'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=600&q=75&auto=format&fit=crop',
                12,
                '12 năm kinh nghiệm|Chuyên nha chu|ĐH Y Dược TP.HCM',
                1, 1,
            ],
            [
                'BS. Trần Quốc Bảo',
                'Bác sĩ Răng Hàm Mặt',
                'Chuyên sâu về phục hình và thẩm mỹ răng, bác sĩ Bảo luôn giải thích rõ ràng từng bước điều trị để bệnh nhân hoàn toàn an tâm.',
                'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=75&auto=format&fit=crop',
                9,
                '9 năm kinh nghiệm|Chuyên phục hình|ĐH Y Khoa Phạm Ngọc Thạch',
                2, 1,
            ],
            [
                'BS. Lê Hoàng Yến',
                'Bác sĩ Chỉnh nha',
                '7 năm kinh nghiệm chỉnh nha, tận tâm với các ca niềng răng phức tạp và trẻ em.',
                'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=600&q=75&auto=format&fit=crop',
                7,
                '7 năm kinh nghiệm|Chuyên chỉnh nha|ĐH Y Dược TP.HCM',
                3, 1,
            ],
            [
                'BS. Phạm Anh Duy',
                'Bác sĩ Nha khoa Trẻ em',
                'Chuyên chăm sóc răng miệng trẻ em, tạo tâm lý thoải mái cho các bé từ lần khám đầu tiên.',
                'https://images.unsplash.com/photo-1637059824899-a441006a6875?w=600&q=75&auto=format&fit=crop',
                5,
                '5 năm kinh nghiệm|Chuyên nha khoa trẻ em|ĐH Y Khoa Phạm Ngọc Thạch',
                4, 1,
            ],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT OR IGNORE INTO doctors (name, role, bio, photo, experience_years, specialties, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($doctors as $d) {
            $stmt->execute($d);
        }
    }

    private function seedTestimonials(): void {
        $testimonials = [
            [
                'Lê Thị Hồng', 'Nhân viên văn phòng',
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80&auto=format&fit=crop&crop=face',
                '"Lần đầu tiên tôi đi khám răng mà không thấy sợ. Không gian yên tĩnh, bác sĩ giải thích rất kỹ trước khi làm gì."',
                5, 1, 1,
            ],
            [
                'Phạm Văn Đức', 'Kỹ sư phần mềm',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80&auto=format&fit=crop&crop=face',
                '"Giá cả rõ ràng ngay từ đầu, không phát sinh gì thêm. Đội ngũ nhẹ nhàng, chuyên nghiệp và rất kiên nhẫn."',
                5, 1, 2,
            ],
            [
                'Ngô Thị Bích', 'Nội trợ',
                'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&q=80&auto=format&fit=crop&crop=face',
                '"Con tôi vốn rất sợ nha sĩ nhưng ở đây bé thoải mái hẳn. Cảm ơn đội ngũ đã kiên nhẫn với các bé."',
                5, 1, 3,
            ],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT OR IGNORE INTO testimonials (author_name, author_role, author_avatar, content, rating, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($testimonials as $t) {
            $stmt->execute($t);
        }
    }

    // ── Query helpers ──────────────────────────────────────────────────────
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

    public function lastInsertId(): int {
        return (int)$this->pdo->lastInsertId();
    }
}

function bodyJson(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return $_POST;
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : $_POST;
}
