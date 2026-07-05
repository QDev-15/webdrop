<?php
declare(strict_types=1);

class Database {
    private \PDO $pdo;

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
        $count = (int)$this->pdo->query("SELECT COUNT(*) FROM settings")->fetchColumn();
        if ($count > 0) return;

        $this->seedUsers();
        $this->seedSettings();
        $this->seedServiceCategories();
        $this->seedServices();
        $this->seedDoctors();
        $this->seedTestimonials();
        $this->seedArticles();
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
            ['site_name',       'KidSmile — Nha Khoa Trẻ Em',                         'general'],
            ['site_tagline',    'Nha khoa chuyên biệt cho trẻ em — Không đáng sợ, chỉ có niềm vui', 'general'],
            ['site_email',      'hello@kidsmile.vn',                                    'general'],
            ['site_phone',      '028 9999 8888',                                         'general'],
            ['site_address',    '123 Đường Nguyễn Thị Minh Khai, Quận 3, TP.HCM',       'general'],
            ['working_hours',   'Thứ 2 — Chủ nhật · 8:00 — 20:00',                     'general'],
            ['zalo_number',     '0289999888',                                             'general'],
            // seo
            ['meta_title',      'KidSmile — Nha Khoa Trẻ Em | Chăm sóc răng miệng vui tươi cho bé', 'seo'],
            ['meta_description','KidSmile là nha khoa chuyên biệt cho trẻ em — không gian như công viên, bác sĩ nhẹ nhàng, kỹ thuật không đau. Bé sẽ mong chờ được đến khám lần sau!', 'seo'],
            ['meta_keywords',   'nha khoa trẻ em, nha khoa nhi, khám răng cho bé, sealant, trám răng sữa, kidsmile', 'seo'],
            // social
            ['facebook',        'https://facebook.com/kidsmile',                          'social'],
            ['instagram',       'https://instagram.com/kidsmile',                         'social'],
            ['youtube',         'https://youtube.com/@kidsmile',                          'social'],
            ['tiktok',          '',                                                        'social'],
            ['zalo',            'https://zalo.me/0289999888',                              'social'],
            // footer
            ['footer_desc',     'Nha khoa chuyên biệt cho trẻ em — nơi mỗi buổi khám răng là một trải nghiệm vui vẻ, an toàn và không đáng sợ.', 'footer'],
            ['footer_copyright','© 2026 KidSmile — Nha Khoa Trẻ Em. Mọi quyền được bảo lưu.', 'footer'],
            ['footer_tagline',  'Made with 💜 for happy smiles',                           'footer'],
            // contact
            ['map_embed',       'https://www.google.com/maps?q=Ho+Chi+Minh+City,+Vietnam&output=embed', 'contact'],
            ['parking_note',    'Có chỗ đậu xe miễn phí cho khách hàng',                  'contact'],
            // smtp
            ['smtp_host',       '',                                                         'smtp'],
            ['smtp_port',       '587',                                                      'smtp'],
            ['smtp_user',       '',                                                         'smtp'],
            ['smtp_pass',       '',                                                         'smtp'],
            ['smtp_from_name',  'KidSmile Nha Khoa Trẻ Em',                               'smtp'],
            ['smtp_from_email', 'hello@kidsmile.vn',                                        'smtp'],
            // stats
            ['stat_patients',   '8.000+',                                                   'stats'],
            ['stat_years',      '9',                                                         'stats'],
            ['stat_satisfaction','98%',                                                      'stats'],
            ['stat_doctors',    '12',                                                         'stats'],
            // hero
            ['hero_eyebrow',    '😊 Phòng khám chuyên Nhi #1 khu vực',                     'hero'],
            ['hero_title',      'Khám răng cho bé không còn đáng sợ, chỉ có niềm vui',     'hero'],
            ['hero_subtitle',   'KidSmile là nha khoa chuyên biệt cho trẻ em — không gian như công viên, bác sĩ nhẹ nhàng, kỹ thuật không đau.', 'hero'],
            // system
            ['app_version',     '1.0.0',                                                    'system'],
            ['timezone',        'Asia/Ho_Chi_Minh',                                         'system'],
            // cloudinary
            ['cloudinary_cloud_name',     '',                                               'cloudinary'],
            ['cloudinary_api_key',        '',                                               'cloudinary'],
            ['cloudinary_api_secret',     '',                                               'cloudinary'],
            ['cloudinary_upload_preset',  '',                                               'cloudinary'],
            // integrations
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY',        'integrations'],
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
            ['Khám & phòng ngừa',     'kham-phong-ngua',      1],
            ['Điều trị',               'dieu-tri',              2],
            ['Phát triển hàm răng',    'phat-trien-ham-rang',   3],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT OR IGNORE INTO service_categories (name, slug, sort_order) VALUES (?, ?, ?)"
        );
        foreach ($cats as [$name, $slug, $order]) {
            $stmt->execute([$name, $slug, $order]);
        }
    }

    private function seedServices(): void {
        $catId = function(string $slug): int {
            $stmt = $this->pdo->prepare("SELECT id FROM service_categories WHERE slug = ?");
            $stmt->execute([$slug]);
            $row = $stmt->fetchColumn();
            return $row !== false ? (int)$row : 1;
        };

        $c1 = $catId('kham-phong-ngua');
        $c2 = $catId('dieu-tri');
        $c3 = $catId('phat-trien-ham-rang');

        $services = [
            [$c1, 'Khám định kỳ',               'Kiểm tra tổng quát răng miệng mỗi 6 tháng, phát hiện sớm sâu răng, tư vấn vệ sinh răng miệng đúng cách theo độ tuổi.', '🔍', '6 tháng/lần|20 phút', 'Từ 150.000đ', '/ lần', 1, 1],
            [$c1, 'Trám bít hố rãnh (Sealant)', 'Phủ lớp bảo vệ chuyên dụng lên mặt nhai răng hàm sữa và răng hàm vĩnh viễn mới mọc, ngăn ngừa sâu răng đến 80%.', '🛡️', 'Phòng ngừa|15 phút/răng', 'Từ 250.000đ', '/ răng', 1, 2],
            [$c1, 'Bôi Fluor phòng ngừa',       'Tăng cường men răng, giảm nguy cơ sâu răng ở trẻ có cơ địa răng yếu hoặc chế độ ăn nhiều đường.', '🧴', '10 phút|Không đau', 'Từ 100.000đ', '/ lần', 0, 3],
            [$c2, 'Trám răng sữa',               'Trám răng sữa bị sâu bằng vật liệu composite an toàn, màu sắc tự nhiên như răng thật, giữ chức năng ăn nhai cho bé.', '🦷', '30 phút|Composite', 'Từ 300.000đ', '/ răng', 1, 4],
            [$c2, 'Điều trị tủy răng sữa',       'Xử lý viêm tủy răng sữa, bảo tồn răng đến tuổi thay răng tự nhiên, tránh biến chứng nhiễm trùng lan rộng.', '🧵', '2 buổi hẹn|Chuyên sâu', 'Từ 800.000đ', '/ răng', 0, 5],
            [$c2, 'Nhổ răng sữa',                'Nhổ răng sữa lung lay hoặc răng cần nhường chỗ cho răng vĩnh viễn, kỹ thuật nhẹ nhàng, gây tê tại chỗ.', '😌', 'Gây tê nhẹ|15 phút', 'Từ 200.000đ', '/ răng', 1, 6],
            [$c3, 'Chỉnh nha sớm (từ 6 tuổi)',  'Tư vấn và can thiệp sớm các lệch lạc răng hàm, khí cụ tháo lắp giúp định hướng phát triển hàm đúng cách.', '😁', 'Từ 6 tuổi|Theo dõi dài hạn', 'Tư vấn miễn phí', '', 1, 7],
            [$c3, 'Khám răng cho bé dưới 3 tuổi','Kiểm tra mọc răng, hướng dẫn vệ sinh răng miệng cho bé sơ sinh và trẻ nhỏ, phát hiện sớm bất thường.', '👶', 'Nhẹ nhàng|Có phụ huynh đi cùng', 'Từ 100.000đ', '/ lần', 0, 8],
            [$c3, 'Giáo dục vệ sinh răng miệng', 'Buổi hướng dẫn chải răng đúng cách, chế độ ăn tốt cho răng — dành cho bé và phụ huynh cùng tham gia.', '🎓', '30 phút|Có mô hình minh họa', 'Miễn phí kèm khám', '', 0, 9],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT OR IGNORE INTO services (category_id, name, description, icon, tags, price, price_unit, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($services as $s) {
            $stmt->execute($s);
        }
    }

    private function seedDoctors(): void {
        $doctors = [
            [
                'BS. Nguyễn Thị Mai Anh',
                'Trưởng khoa Nha Nhi',
                'Hơn 10 năm kinh nghiệm điều trị nha khoa trẻ em, được đào tạo chuyên sâu về tâm lý và giao tiếp với trẻ nhỏ. Cô luôn biến mỗi buổi khám thành một trải nghiệm vui vẻ cho bé.',
                'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=75&auto=format&fit=crop',
                10,
                'Chuyên khoa Răng Hàm Mặt - Nhi|Chứng chỉ Nha Nhi Quốc tế|10+ năm KN',
                1, 1,
            ],
            [
                'BS. Trần Minh Khoa',
                'Bác sĩ Nha khoa trẻ em',
                'Chuyên gia về chỉnh nha sớm và điều trị tủy răng sữa. Phong cách nhẹ nhàng, kiên nhẫn giúp cả những bé sợ nha sĩ nhất cũng cảm thấy an tâm.',
                'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=75&auto=format&fit=crop',
                7,
                'Chỉnh nha sớm|Tâm lý trẻ em|7 năm KN',
                2, 1,
            ],
            [
                'BS. Phạm Thu Hà',
                'Bác sĩ Nha khoa trẻ em',
                'Chuyên điều trị sâu răng, trám răng thẩm mỹ cho răng sữa. Giọng nói nhẹ nhàng giúp bé dễ hợp tác trong suốt buổi khám.',
                'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=75&auto=format&fit=crop',
                6,
                'Trám thẩm mỹ|Điều trị sâu răng|6 năm KN',
                3, 1,
            ],
            [
                'BS. Lê Hoàng Nam',
                'Bác sĩ Nha khoa trẻ em',
                'Chuyên xử lý các ca sợ nha sĩ nặng, có kinh nghiệm làm việc với trẻ tự kỷ và trẻ đặc biệt. Kiên nhẫn và tận tâm là phương châm của anh.',
                'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=75&auto=format&fit=crop',
                8,
                'Tâm lý trẻ em|Trẻ đặc biệt|8 năm KN',
                4, 1,
            ],
            [
                'BS. Đỗ Ngọc Linh',
                'Bác sĩ Nha khoa trẻ em',
                'Chuyên khám và tư vấn cho bé dưới 3 tuổi, hướng dẫn phụ huynh chăm sóc răng miệng từ sớm để xây dựng nền tảng răng khỏe mạnh.',
                'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&q=75&auto=format&fit=crop',
                5,
                'Nhũ nhi|Tư vấn phụ huynh|5 năm KN',
                5, 1,
            ],
            [
                'BS. Vũ Thị Kim Oanh',
                'Bác sĩ Nha khoa trẻ em',
                'Chuyên sealant và phòng ngừa sâu răng. Yêu thích tổ chức hoạt động giáo dục vệ sinh răng miệng cho bé tại phòng khám.',
                'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=75&auto=format&fit=crop',
                4,
                'Phòng ngừa|Sealant|Giáo dục sức khỏe|4 năm KN',
                6, 1,
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
                'Lê Thị Hồng Nhung', 'Mẹ bé Bảo An, 5 tuổi',
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80&auto=format&fit=crop&crop=face',
                '"Con mình vốn rất sợ đi khám răng, nhưng từ khi đến KidSmile bé lại đòi đi khám vì thích khu vui chơi và các cô chú ở đây. Thật sự bất ngờ!"',
                5, 1, 1,
            ],
            [
                'Phạm Văn Đức', 'Bố bé Gia Hân, 7 tuổi',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80&auto=format&fit=crop&crop=face',
                '"Bác sĩ giải thích rất kỹ, thao tác nhẹ nhàng, bé nhà mình trám răng mà không hề khóc. Nhân viên cũng cực kỳ thân thiện với trẻ con."',
                5, 1, 2,
            ],
            [
                'Ngô Thị Thanh Thảo', 'Mẹ bé Minh Khang, 4 tuổi',
                'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80&auto=format&fit=crop&crop=face',
                '"Đặt lịch dễ dàng, đúng giờ, không phải chờ đợi lâu. Sau buổi khám bé còn được nhận huy hiệu \'chiến binh dũng cảm\' — con vui cả tuần luôn."',
                5, 1, 3,
            ],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT OR IGNORE INTO testimonials (author_name, author_meta, author_avatar, content, rating, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($testimonials as $t) {
            $stmt->execute($t);
        }
    }

    private function seedArticles(): void {
        $articles = [
            [
                'Khi nào nên đưa bé đi khám răng lần đầu?',
                'khi-nao-nen-dua-be-di-kham-rang-lan-dau',
                'Thời điểm vàng để bé làm quen với nha sĩ là ngay khi chiếc răng sữa đầu tiên mọc — thường trong khoảng 6-12 tháng tuổi.',
                'Hầu hết các bậc cha mẹ thắc mắc không biết khi nào nên đưa bé đi khám răng lần đầu. Theo khuyến nghị của Hiệp hội Nha khoa Nhi Hoa Kỳ, bé nên được đưa đi khám trong vòng 6 tháng kể từ khi mọc chiếc răng sữa đầu tiên, và không muộn hơn sinh nhật đầu tiên.',
                'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&q=75&auto=format&fit=crop',
                'Khám lần đầu',
                '5 phút đọc',
                'published', 1,
            ],
            [
                'Cách chải răng đúng cho bé theo từng độ tuổi',
                'cach-chai-rang-dung-cho-be-theo-tung-do-tuoi',
                'Trẻ dưới 3 tuổi cần phụ huynh chải giúp, trẻ 3-6 tuổi bắt đầu tập chải nhưng vẫn cần kiểm tra — hướng dẫn chi tiết từ bác sĩ KidSmile.',
                'Chải răng đúng cách là kỹ năng quan trọng cần được dạy từ sớm. Đối với bé sơ sinh, phụ huynh dùng gạc mềm lau nướu. Khi răng sữa mọc, dùng bàn chải mềm nhỏ với lượng kem đánh răng bằng hạt gạo. Trẻ 3-6 tuổi có thể bắt đầu học tự chải nhưng cần phụ huynh kiểm tra lại.',
                'https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?w=500&q=75&auto=format&fit=crop',
                'Vệ sinh răng miệng',
                '4 phút đọc',
                'published', 2,
            ],
            [
                '5 mẹo giúp bé không sợ đi khám răng',
                '5-meo-giup-be-khong-so-di-kham-rang',
                'Nỗi sợ nha sĩ rất phổ biến ở trẻ nhỏ. Với 5 mẹo đơn giản này, cha mẹ có thể giúp bé cảm thấy tự tin và thoải mái hơn trước mỗi lần đến phòng khám.',
                'Sợ nha sĩ là tâm lý bình thường ở trẻ em. Cách tốt nhất là bắt đầu sớm, tạo ấn tượng tích cực ngay từ lần khám đầu. Hãy kể chuyện về "bác sĩ bạn thân của bé", đọc sách về nha sĩ, và cho bé biết trước những gì sẽ xảy ra để bé không bị bất ngờ.',
                'https://images.unsplash.com/photo-1543342384-1f1350e27861?w=500&q=75&auto=format&fit=crop',
                'Tâm lý trẻ em',
                '6 phút đọc',
                'published', 3,
            ],
        ];

        $stmt = $this->pdo->prepare(
            "INSERT OR IGNORE INTO articles (title, slug, excerpt, content, thumbnail, tag, read_time, status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        foreach ($articles as $a) {
            $stmt->execute($a);
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
