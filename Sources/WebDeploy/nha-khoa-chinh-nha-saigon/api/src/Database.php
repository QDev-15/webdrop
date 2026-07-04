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
            ['site_name',        'Nha Khoa Chinh Nha Sai Gon',           'general'],
            ['site_tagline',     'Chuyen khoa chinh nha — nieng rang cong nghe so, chinh xac tung milimet cho nu cuoi hoan hao.', 'general'],
            ['site_email',       'lienhe@chinhnhasaigon.vn',             'general'],
            ['site_phone',       '028 3822 0000',                        'general'],
            ['site_phone_hotline','0901 234 567',                        'general'],
            ['site_address',     '123 Duong Nguyen Van Troi, Phuong 12, Quan Phu Nhuan, TP. Ho Chi Minh', 'general'],
            ['working_hours',    'T2-T7: 8:00-20:00 · CN: 8:00-12:00', 'general'],
            ['zalo_number',      '0901234567',                           'general'],
            ['meta_title',       'Nha Khoa Chinh Nha Sai Gon - Nieng Rang Cong Nghe So', 'seo'],
            ['meta_description', 'Nha Khoa Chinh Nha Sai Gon — chuyen khoa nieng rang, chinh nha cong nghe so: mac cai kim loai, mac cai su, Invisalign. Chinh xac tung milimet, dat lich tu van mien phi.', 'seo'],
            ['meta_keywords',    'nieng rang, chinh nha, invisalign, mac cai su, mac cai kim loai, nha khoa saigon', 'seo'],
            ['facebook_url',     'https://facebook.com/chinhnhasaigon',  'social'],
            ['instagram_url',    'https://instagram.com/chinhnhasaigon', 'social'],
            ['youtube_url',      'https://youtube.com/chinhnhasaigon',   'social'],
            ['tiktok_url',       '',                                     'social'],
            ['zalo_url',         'https://zalo.me/0901234567',           'social'],
            ['stat_cases',       '4500',                                 'about'],
            ['stat_years',       '12',                                   'about'],
            ['stat_satisfaction','98',                                   'about'],
            ['stat_doctors',     '6',                                    'about'],
            ['hero_badge',       'Chinh nha ky thuat so chinh xac',      'about'],
            ['hero_title_1',     'Nu cuoi thang deu,',                   'about'],
            ['hero_title_em',    'do luong bang du lieu',                'about'],
            ['og_image',         '',                                     'seo'],
            ['notify_email',     '',                                     'smtp'],
            ['hero_subtitle',    'Nha Khoa Chinh Nha Sai Gon ung dung scan 3D va lap ke hoach dieu tri ky thuat so — theo doi tung milimet dich chuyen rang, rut ngan thoi gian nieng, ket qua du doan duoc ngay tu buoi tu van dau tien.', 'about'],
            ['map_embed',        '',                                     'contact'],
            ['footer_tagline',   'Chuyen khoa chinh nha — nieng rang cong nghe so, chinh xac tung milimet cho nu cuoi hoan hao.', 'footer'],
            ['footer_copy',      '2026 Nha Khoa Chinh Nha Sai Gon. All rights reserved.', 'footer'],
            ['smtp_host',        'smtp.gmail.com',                       'smtp'],
            ['smtp_port',        '587',                                  'smtp'],
            ['smtp_user',        '',                                     'smtp'],
            ['smtp_pass',        '',                                     'smtp'],
            ['smtp_from_name',   'Nha Khoa Chinh Nha Sai Gon',          'smtp'],
            ['smtp_from_email',  '',                                     'smtp'],
            ['cloudinary_cloud_name',     '',                            'cloudinary'],
            ['cloudinary_api_key',        '',                            'cloudinary'],
            ['cloudinary_api_secret',     '',                            'cloudinary'],
            ['cloudinary_upload_preset',  '',                            'cloudinary'],
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];

        $stmt = $this->pdo->prepare("INSERT OR IGNORE INTO settings (key, value, grp) VALUES (?, ?, ?)");
        foreach ($rows as $r) { $stmt->execute($r); }
    }

    private function seedHeroSlides(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM hero_slides")->fetchColumn();
        if ((int)$count > 0) return;
        $stmt = $this->pdo->prepare(
            "INSERT INTO hero_slides (title, subtitle, image, button_text, button_link, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        $slides = [
            [
                'Nu cuoi thang deu, do luong bang du lieu',
                'Nha Khoa Chinh Nha Sai Gon ung dung scan 3D va lap ke hoach dieu tri ky thuat so — theo doi tung milimet dich chuyen rang, rut ngan thoi gian nieng, ket qua du doan duoc ngay tu buoi tu van dau tien.',
                '',
                'Dat lich tu van mien phi',
                '/dat-lich',
                0, 'published',
            ],
            [
                'Cong nghe Invisalign chinh hang Hoa Ky',
                'Khay trong suot thao lap linh hoat, gan nhu vo hinh — ung dung scan 3D moi buoi tai kham de theo doi chinh xac tung milimet dich chuyen rang.',
                '',
                'Xem dich vu Invisalign',
                '/dich-vu',
                1, 'published',
            ],
            [
                'Doi ngu 6 bac si chuyen khoa chinh nha',
                'Moi ca chinh nha deu duoc mot bac si chuyen khoa theo doi xuyen suot tu buoi tu van dau tien den khi thao nieng — mien phi tai kham dinh ky.',
                '',
                'Gap go bac si',
                '/bac-si',
                2, 'published',
            ],
        ];
        foreach ($slides as $s) { $stmt->execute($s); }
    }

    private function seedServices(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM services")->fetchColumn();
        if ((int)$count > 0) return;
        $stmt = $this->pdo->prepare(
            "INSERT INTO services (number, name, description, duration, price, badge, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $services = [
            ['01', 'Mac cai kim loai',
             'Giai phap kinh dien voi hieu qua dieu chinh cao, xu ly duoc hau het cac ca sai lech khop can tu nhe den phuc tap. Chi phi hop ly nhat trong cac phuong phap.',
             '12-24 thang', 'tu 25.000.000d', 'Pho bien nhat', 1, 0],
            ['02', 'Mac cai su tham my',
             'Mau sac trong tep voi rang that, it lo khi giao tiep. Hieu qua dieu tri tuong duong mac cai kim loai nhung tham my hon.',
             '12-24 thang', 'tu 35.000.000d', '', 1, 1],
            ['03', 'Invisalign',
             'Khay trong suot thao lap linh hoat, gan nhu vo hinh, nhap khau chinh hang Hoa Ky — thay khay moi 1-2 tuan theo ke hoach 3D.',
             '9-18 thang', 'tu 80.000.000d', 'Cong nghe moi', 1, 2],
            ['04', 'Mac cai tu buoc',
             'Co che truot tu dong giam ma sat, han che so lan tai kham, rut ngan thoi gian moi lan tham kham.',
             '10-20 thang', 'tu 40.000.000d', '', 0, 3],
            ['05', 'Khay trong suot noi dia',
             'Lua chon tiet kiem hon cho cac ca sai lech nhe den trung binh — van ung dung cong nghe scan 3D va mo phong lo trinh dich chuyen rang truoc khi bat dau dieu tri.',
             '8-16 thang', 'tu 45.000.000d', '', 0, 4],
            ['06', 'Mac cai mat trong',
             'Gan phia sau rang, hoan toan khong lo khi giao tiep — phu hop khach hang co yeu cau tham my toi da.',
             '14-26 thang', 'tu 90.000.000d', '', 0, 5],
        ];
        foreach ($services as $s) { $stmt->execute($s); }
    }

    private function seedDoctors(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM doctors")->fetchColumn();
        if ((int)$count > 0) return;
        $stmt = $this->pdo->prepare(
            "INSERT INTO doctors (name, role, photo, description, experience_years, specialties, tag, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $doctors = [
            ['BS. Tran Minh Anh',
             'Chuyen khoa Chinh nha',
             'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80&auto=format&fit=crop',
             '15 nam kinh nghiem dieu tri cac ca sai lech khop can phuc tap. Chung chi Invisalign Diamond Provider.',
             15, 'Invisalign|Mac cai mat trong', 'Truong khoa', 0],
            ['BS. Nguyen Hai Dang',
             'Chuyen khoa Chinh nha',
             'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80&auto=format&fit=crop',
             '10 nam kinh nghiem, chuyen sau dieu tri chinh nha cho tre em va thanh thieu nien.',
             10, 'Chinh nha tre em|Mac cai su', '', 1],
            ['BS. Le Thao Vy',
             'Chuyen khoa Chinh nha',
             'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80&auto=format&fit=crop',
             '8 nam kinh nghiem, chuyen dieu tri khay trong suot va cac ca tham my rang phuc tap.',
             8, 'Invisalign|Khay trong suot', '', 2],
            ['BS. Pham Quoc Bao',
             'Chuyen khoa Chinh nha',
             'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&q=80&auto=format&fit=crop',
             '9 nam kinh nghiem dieu tri mac cai kim loai va mac cai tu buoc cho cac ca khop can phuc tap.',
             9, 'Mac cai kim loai|Mac cai tu buoc', '', 3],
            ['BS. Do Ngoc Mai',
             'Chuyen khoa Chinh nha',
             'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=600&q=80&auto=format&fit=crop',
             '7 nam kinh nghiem, phu trach lap ke hoach dieu tri 3D va theo doi tien do scan so hoa.',
             7, 'Scan 3D|Invisalign', '', 4],
            ['BS. Vu Thanh Trung',
             'Chuyen khoa Chinh nha',
             'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=600&q=80&auto=format&fit=crop',
             '11 nam kinh nghiem, chuyen cac ca chinh nha ket hop phau thuat ham mat.',
             11, 'Chinh nha - phau thuat|Mac cai mat trong', '', 5],
        ];
        foreach ($doctors as $d) { $stmt->execute($d); }
    }

    private function seedTestimonials(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
        if ((int)$count > 0) return;
        $stmt = $this->pdo->prepare(
            "INSERT INTO testimonials (author_name, author_role, content, rating, avatar_initial, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        $items = [
            ['Nguyen Thao', 'Khach hang Invisalign',
             'Minh nieng Invisalign gan 18 thang, bac si theo doi rat sat bang scan 3D moi lan tai kham nen biet chinh xac tien do. Ket qua vuot mong doi.',
             5, 'N', 1, 0],
            ['Le Minh Khoi', 'Khach hang mac cai su',
             'Doi ngu bac si giai thich ky tung buoc trong ke hoach dieu tri, khong giau diep chi phi phat sinh. Rat an tam khi dieu tri lau dai o day.',
             5, 'L', 1, 1],
            ['Pham Thu Ha', 'Phu huynh khach hang',
             'Con minh nieng rang tu nam lop 8, phong kham luon nhac lich tai kham va tu van tan tam cho phu huynh. Gio be da tu tin cuoi hon rat nhieu.',
             5, 'P', 1, 2],
        ];
        foreach ($items as $i) { $stmt->execute($i); }
    }
}
