<?php
declare(strict_types=1);

class Database {
    private static ?Database $instance = null;
    private PDO $pdo;

    private function __construct() {
        $dsn = 'sqlite:' . DB_FILE;
        $dir = dirname(DB_FILE);
        if (!is_dir($dir)) @mkdir($dir, 0755, true);

        $this->pdo = new PDO($dsn, null, null, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->pdo->exec('PRAGMA journal_mode = WAL');
        $this->migrate();
    }

    public static function getInstance(): self {
        if (!self::$instance) self::$instance = new self();
        return self::$instance;
    }

    public function pdo(): PDO { return $this->pdo; }

    // ── Migration ──────────────────────────────────────────────────────────────
    private function migrate(): void {
        $sql = file_get_contents(__DIR__ . '/../schema.sql');
        if ($sql === false) {
            error_log('[Database::migrate] schema.sql not found — skipping migration');
            return;
        }
        try {
            $this->pdo->exec($sql);
        } catch (PDOException $e) {
            error_log('[Database::migrate] ' . $e->getMessage());
        }
        $this->seedData();
    }

    // ── Seed ───────────────────────────────────────────────────────────────────
    private function seedData(): void {
        // Only seed when tables are empty
        $count = (int) $this->pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
        if ($count > 0) return;

        // Default admin
        $this->pdo->prepare(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
        )->execute(['Quản trị viên', 'sysadmin@admin.com', password_hash('123456', PASSWORD_DEFAULT), 'superadmin']);

        // Settings
        $settings = [
            // general
            ['site_name',        'Balance Pilates Studio',                          'general'],
            ['site_tagline',     'Studio Pilates & Fitness Hiện Đại',               'general'],
            ['site_description', 'Lớp pilates chuyên nghiệp, reformer, mat pilates và clinical pilates. Cải thiện sức khỏe cột sống, core strength và tư thế đúng.', 'general'],
            ['site_phone',       '0901 234 567',                                    'general'],
            ['site_email',       'info@balancepilates.vn',                          'general'],
            ['site_address',     '123 Nguyễn Đình Chiểu, Phường 6, Quận 3, TP.HCM','general'],
            ['site_logo',        '',                                                'general'],
            ['working_hours',    'T2–T7: 6:30 – 21:00 | CN: 7:00 – 17:00',        'general'],
            // seo
            ['meta_title',       'Balance Pilates Studio — Pilates & Fitness Hiện Đại', 'seo'],
            ['meta_description', 'Lớp pilates chuyên nghiệp, reformer, mat pilates và clinical pilates tại TP.HCM.', 'seo'],
            // social
            ['social_facebook',  'https://facebook.com/',                           'social'],
            ['social_instagram', 'https://instagram.com/',                          'social'],
            ['social_youtube',   '',                                                'social'],
            ['social_zalo',      '0901234567',                                      'social'],
            // contact
            ['google_maps_url',  '',                                                'contact'],
            // design
            ['footer_description', 'Studio pilates chuyên nghiệp — nơi sức khỏe, sự cân bằng và vẻ đẹp gặp nhau.', 'design'],
            // integration
            ['unsplash_access_key', '', 'system'],
            ['cloudinary_cloud_name', '', 'system'],
            ['cloudinary_api_key', '', 'system'],
            ['cloudinary_api_secret', '', 'system'],
        ];
        $stmt = $this->pdo->prepare("INSERT OR IGNORE INTO settings (key, value, grp) VALUES (?,?,?)");
        foreach ($settings as [$k, $v, $g]) $stmt->execute([$k, $v, $g]);

        // Hero slides
        $slides = [
            [
                'Tìm lại sự cân bằng trong cơ thể.',
                'Pilates không chỉ là bài tập — đó là hành trình kết nối tâm trí và cơ thể. Tăng cường sức mạnh core, cải thiện tư thế và linh hoạt toàn diện.',
                'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1600&q=80&auto=format&fit=crop',
                'Đăng ký dùng thử', '/dat-lich', 0,
            ],
            [
                'Reformer Pilates — Hiệu quả vượt trội.',
                'Sử dụng máy Reformer chuyên nghiệp với hệ thống lò xo đa mức kháng lực, mang lại kết quả rõ rệt chỉ sau 8 buổi.',
                'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1600&q=80&auto=format&fit=crop',
                'Xem các lớp', '/dich-vu', 1,
            ],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO hero_slides (title,subtitle,image_url,cta_text,cta_link,sort_order) VALUES (?,?,?,?,?,?)"
        );
        foreach ($slides as $s) $stmt->execute($s);

        // Service categories
        $cats = [
            ['mat-pilates',      'Mat Pilates',      'Lớp pilates trên thảm — nền tảng cơ bản cho mọi học viên.',                     0],
            ['reformer-pilates', 'Reformer Pilates', 'Sử dụng máy Reformer chuyên nghiệp với hệ thống lò xo và dây đai.',             1],
            ['clinical-pilates', 'Clinical Pilates', 'Thiết kế riêng cho người có vấn đề cơ xương khớp, sau chấn thương.',            2],
            ['prenatal-pilates', 'Prenatal Pilates', 'Chương trình chuyên biệt cho phụ nữ mang thai và sau sinh.',                    3],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO service_categories (slug,name,description,sort_order) VALUES (?,?,?,?)"
        );
        foreach ($cats as $c) $stmt->execute($c);

        $catIds = [];
        $rows = $this->pdo->query("SELECT id, slug FROM service_categories")->fetchAll();
        foreach ($rows as $r) $catIds[$r['slug']] = $r['id'];

        // Services
        $services = [
            [
                $catIds['mat-pilates'],
                'Mat Pilates',
                'mat-pilates',
                'Lớp pilates trên thảm — nền tảng cơ bản cho mọi học viên. Tập trung vào kiểm soát hơi thở, căn chỉnh tư thế và xây dựng sức mạnh core từ bên trong. Phù hợp với tất cả mọi đối tượng từ người mới bắt đầu đến học viên có kinh nghiệm.',
                60, 10, 'Tất cả', 180000,
                'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80&auto=format&fit=crop',
                'Phổ biến nhất', 1, 0,
            ],
            [
                $catIds['reformer-pilates'],
                'Reformer Pilates',
                'reformer-pilates',
                'Sử dụng máy Reformer với hệ thống lò xo có thể điều chỉnh kháng lực, dây đai và thang ngang. Cho phép thực hiện hàng trăm bài tập đa dạng ở nhiều tư thế khác nhau. Lớp nhỏ 6 người giúp giảng viên chú ý sát từng học viên.',
                55, 6, 'Trung cấp+', 280000,
                'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80&auto=format&fit=crop',
                'Thiết bị chuyên nghiệp', 1, 1,
            ],
            [
                $catIds['clinical-pilates'],
                'Clinical Pilates',
                'clinical-pilates',
                'Clinical Pilates được thiết kế riêng cho người có vấn đề cơ xương khớp, sau chấn thương hoặc phẫu thuật. Kết hợp kiến thức vật lý trị liệu và pilates, bài tập được cá nhân hóa hoàn toàn. Phù hợp: đau lưng mãn tính, thoát vị đĩa đệm, sau mổ thay khớp, chấn thương thể thao.',
                60, 1, 'Cá nhân hóa', 450000,
                'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop',
                'Phục hồi chức năng', 0, 2,
            ],
            [
                $catIds['prenatal-pilates'],
                'Prenatal Pilates',
                'prenatal-pilates',
                'Chương trình pilates được thiết kế chuyên biệt cho phụ nữ mang thai và sau sinh. Giúp giảm đau lưng, tăng cường sàn chậu, cải thiện tư thế và chuẩn bị cơ thể cho quá trình sinh nở. Giảng viên có chứng chỉ chuyên biệt về prenatal/postnatal fitness.',
                60, 8, 'Nhẹ nhàng', 220000,
                'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80&auto=format&fit=crop',
                'Mẹ bầu & sau sinh', 0, 3,
            ],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO services (category_id,name,slug,description,duration_min,max_students,level,price_per_session,image_url,tag,is_featured,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
        );
        foreach ($services as $s) $stmt->execute($s);

        // Testimonials
        $testimonials = [
            [
                'Nguyễn Thanh Mai',
                'Học viên 6 tháng · Dân văn phòng',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop&crop=face',
                'Sau 3 tháng tập pilates tại đây, lưng tôi không còn đau nữa. HLV Lan Anh rất tận tâm, điều chỉnh từng động tác cho đúng kỹ thuật. Không gian studio rất sạch và hiện đại.',
                5, 1, 0,
            ],
            [
                'Lê Bích Ngọc',
                'Học viên 1 năm · Kiến trúc sư',
                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80&auto=format&fit=crop&crop=face',
                'Reformer Pilates thay đổi hoàn toàn cách tôi nhìn nhận về việc tập luyện. Hiệu quả vượt trội so với gym thông thường, cơ thể cân đối và linh hoạt hơn nhiều.',
                5, 1, 1,
            ],
            [
                'Trần Phương Anh',
                'Học viên 8 tháng · Mẹ bầu',
                'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80&auto=format&fit=crop&crop=face',
                'Tôi bắt đầu prenatal pilates từ tháng thứ 4. Giúp giảm đau lưng khi mang thai rõ rệt và hồi phục sau sinh rất nhanh. Rất cảm ơn đội ngũ tận tâm ở đây!',
                5, 1, 2,
            ],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO testimonials (name,role,avatar_url,content,rating,is_active,sort_order) VALUES (?,?,?,?,?,?,?)"
        );
        foreach ($testimonials as $t) $stmt->execute($t);

        // Team
        $team = [
            [
                'Nguyễn Lan Anh',
                'Head Instructor — Mat & Reformer',
                'STOTT Pilates® Certified',
                'Hơn 10 năm giảng dạy pilates, chuyên gia phục hồi chức năng cột sống và đào tạo pilates cho người mang thai. Học viên tại STOTT Pilates Canada và Body Arts Science International.',
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&auto=format&fit=crop',
                'Mat Pilates,Prenatal,Spine Rehab',
                0, 1,
            ],
            [
                'Trần Minh Đức',
                'Reformer Specialist',
                'Balanced Body® Certified',
                'Chuyên gia Reformer Pilates với 8 năm kinh nghiệm. Từng là vận động viên thể dục dụng cụ, anh kết hợp nền tảng thể thao với pilates để tối ưu hiệu suất và phòng ngừa chấn thương.',
                'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&q=80&auto=format&fit=crop',
                'Reformer,Athletic Performance,Injury Prevention',
                1, 1,
            ],
            [
                'Lê Quỳnh Chi',
                'Clinical Pilates Specialist',
                'DMA Clinical Pilates® Certified',
                'Chuyên về clinical pilates và phục hồi chức năng, với nền tảng vật lý trị liệu 7 năm. Giúp hàng trăm học viên phục hồi sau chấn thương và bệnh lý cột sống.',
                'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&q=80&auto=format&fit=crop',
                'Clinical Pilates,Spine Rehab,Physical Therapy',
                2, 1,
            ],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO team (name,role,cert,bio,image_url,tags,sort_order,is_active) VALUES (?,?,?,?,?,?,?,?)"
        );
        foreach ($team as $t) $stmt->execute($t);
    }

    // ── Helpers ────────────────────────────────────────────────────────────────
    public function query(string $sql, array $params = []): array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $result = $this->query($sql, $params);
        return $result[0] ?? null;
    }

    public function execute(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (int) $this->pdo->lastInsertId();
    }

    public function run(string $sql, array $params = []): void {
        $this->pdo->prepare($sql)->execute($params);
    }
}
