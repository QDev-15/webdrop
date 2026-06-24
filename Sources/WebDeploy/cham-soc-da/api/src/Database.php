<?php
declare(strict_types=1);

class Database {
    private static ?Database $instance = null;
    private PDO $pdo;

    private function __construct() {
        if (DB_TYPE === 'sqlite') {
            $dbDir = dirname(DB_FILE);
            if (!is_dir($dbDir)) { @mkdir($dbDir, 0755, true); }
            $this->pdo = new PDO('sqlite:' . DB_FILE);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->pdo->exec('PRAGMA foreign_keys = ON;');
            $this->pdo->exec('PRAGMA journal_mode = WAL;');
        } else {
            $dsn = DB_TYPE . ':host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        $this->migrate();
    }

    public static function getInstance(): static {
        if (self::$instance === null) {
            self::$instance = new static();
        }
        return self::$instance;
    }

    public function pdo(): PDO { return $this->pdo; }

    public function query(string $sql, array $params = []): array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $rows = $this->query($sql, $params);
        return $rows[0] ?? null;
    }

    public function execute(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (int) $this->pdo->lastInsertId();
    }

    public function count(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    // ── Migration ──────────────────────────────────────────────────────────────
    private function migrate(): void {
        $sqlFile = __DIR__ . '/../schema.sql';
        $sql = file_get_contents($sqlFile);
        if ($sql === false) {
            throw new \RuntimeException('Khong doc duoc schema.sql — kiem tra file ton tai tai: ' . $sqlFile);
        }
        // Strip single-line comments BEFORE splitting so comment blocks before CREATE TABLE
        // don't cause those statements to be filtered out
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

    // ── Seed data ──────────────────────────────────────────────────────────────
    private function seedData(): void {
        $this->seedUsers();
        $this->seedSettings();
        $this->seedHeroSlides();
        $this->seedServiceCategories();
        $this->seedServices();
        $this->seedTeamMembers();
        $this->seedTestimonials();
    }

    private function seedUsers(): void {
        $count = $this->count('SELECT COUNT(*) FROM users');
        if ($count > 0) return;
        $hash = password_hash('123456', PASSWORD_BCRYPT);
        $this->execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Quản trị viên', 'sysadmin@admin.com', $hash, 'superadmin']
        );
    }

    private function seedSettings(): void {
        $count = $this->count('SELECT COUNT(*) FROM settings');
        if ($count > 0) return;

        $defaults = [
            // general
            ['site_name',       'DermaCare Clinic',                           'general'],
            ['site_tagline',    'Phong kham Da lieu Chuyen sau',              'general'],
            ['site_email',      'info@dermacare.vn',                          'general'],
            ['site_phone',      '0901 234 567',                               'general'],
            ['site_address',    '123 Nguyen Hue, P. Ben Nghe, Q.1, TP.HCM',  'general'],
            ['working_hours',   'Thu 2 – Thu 7: 8:00 – 18:00 | CN: 8:00 – 12:00', 'general'],
            ['zalo_number',     '0901234567',                                  'general'],
            // seo
            ['meta_title',      'DermaCare Clinic — Phong kham Da lieu & Skincare', 'seo'],
            ['meta_description','Phong kham da lieu chuyen sau. Dieu tri mun, nam, lao hoa voi cong nghe Laser, IPL, Microneedling hien dai.', 'seo'],
            // social
            ['facebook',        '',                                            'social'],
            ['instagram',       '',                                            'social'],
            ['youtube',         '',                                            'social'],
            ['tiktok',          '',                                            'social'],
            // footer
            ['footer_desc',     'Phong kham da lieu chuyen sau — dieu tri bang khoa hoc, cham soc bang tam huyet.', 'footer'],
            ['footer_copy',     '© 2026 DermaCare Clinic · Phong kham Da lieu & Skincare', 'footer'],
            // contact
            ['map_embed',       '',                                            'contact'],
            ['map_link',        'https://maps.google.com',                    'contact'],
            // smtp
            ['smtp_host',       '',                                            'smtp'],
            ['smtp_port',       '587',                                         'smtp'],
            ['smtp_user',       '',                                            'smtp'],
            ['smtp_pass',       '',                                            'smtp'],
            // system
            ['maintenance_mode','0',                                           'system'],
            // cloudinary
            ['cloudinary_cloud_name', '',                                      'cloudinary'],
            ['cloudinary_api_key',    '',                                      'cloudinary'],
            ['cloudinary_api_secret', '',                                      'cloudinary'],
            // integrations
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
            // about section
            ['about_title',     'Da khoe manh tu nen tang khoa hoc',          'about'],
            ['about_subtitle',  'Phong kham Da lieu Chuyen sau',              'about'],
            ['about_desc',      'Chung toi ket hop tham quyen y khoa va cong nghe tien tien de dieu tri moi van de ve da — tu mun, nam den lao hoa. Ket qua thuc te, an toan co kiem chung.', 'about'],
            ['stat_cases',      '3000+',                                       'about'],
            ['stat_doctors',    '8 BS',                                        'about'],
            ['stat_satisfied',  '98%',                                         'about'],
            ['stat_years',      '10 nam',                                      'about'],
            // clinic
            ['hero_badge_percent', '98%',                                      'clinic'],
            ['hero_badge_label',   'Ty le hai long cua benh nhan',             'clinic'],
        ];

        $stmt = $this->pdo->prepare('INSERT OR IGNORE INTO settings (key, value, grp) VALUES (?, ?, ?)');
        foreach ($defaults as [$key, $value, $grp]) {
            $stmt->execute([$key, $value, $grp]);
        }
    }

    private function seedHeroSlides(): void {
        $count = $this->count('SELECT COUNT(*) FROM hero_slides');
        if ($count > 0) return;

        $slides = [
            [
                'title'      => 'Da khoe manh tu nen tang khoa hoc.',
                'subtitle'   => 'Chung toi ket hop tham quyen y khoa va cong nghe tien tien de dieu tri moi van de ve da — tu mun, nam den lao hoa. Ket qua thuc te, an toan co kiem chung.',
                'image'      => 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80&auto=format&fit=crop',
                'badge_text' => 'Phong kham Da lieu Chuyen sau',
                'btn_label'  => 'Dat lich tu van',
                'btn_url'    => '/dat-lich',
                'sort_order' => 1,
            ],
        ];

        $stmt = $this->pdo->prepare(
            'INSERT INTO hero_slides (title, subtitle, image, badge_text, btn_label, btn_url, sort_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, 1)'
        );
        foreach ($slides as $s) {
            $stmt->execute([$s['title'], $s['subtitle'], $s['image'], $s['badge_text'], $s['btn_label'], $s['btn_url'], $s['sort_order']]);
        }
    }

    private function seedServiceCategories(): void {
        $count = $this->count('SELECT COUNT(*) FROM service_categories');
        if ($count > 0) return;

        $cats = [
            ['Dieu tri mun', 'dieu-tri-mun', 'Cac phuong phap dieu tri mun trung ca chuyen sau', '🔴', 1],
            ['Nam & Sac to', 'nam-sac-to',   'Dieu tri nam, tan nhang va roi loan sac to',       '🟤', 2],
            ['Lao hoa',      'lao-hoa',       'Tre hoa va chong lao hoa da khong phau thuat',     '⏳', 3],
            ['Seo & Ro',     'seo-ro',        'Tai tao be mat da — seo mo, da min',               '⚡', 4],
            ['Khac',         'khac',          'Cac dich vu cham soc da khac',                     '🌸', 5],
        ];
        $stmt = $this->pdo->prepare(
            'INSERT INTO service_categories (name, slug, description, icon, sort_order) VALUES (?, ?, ?, ?, ?)'
        );
        foreach ($cats as $c) {
            $stmt->execute($c);
        }
    }

    private function seedServices(): void {
        $count = $this->count('SELECT COUNT(*) FROM services');
        if ($count > 0) return;

        // Get category IDs
        $catMap = [];
        foreach ($this->query('SELECT id, slug FROM service_categories') as $row) {
            $catMap[$row['slug']] = $row['id'];
        }

        $services = [
            // Dieu tri mun
            [
                'category_id'    => $catMap['dieu-tri-mun'] ?? null,
                'name'           => 'LED Blue Light — Diet khuan mun',
                'slug'           => 'led-blue-light',
                'image'          => 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80&auto=format&fit=crop',
                'category_label' => 'LED Light Therapy',
                'description'    => 'Anh sang xanh 415nm tieu diet vi khuan P.acnes truc tiep, giam viem, kiem soat dau. Phu hop da mun nhe den trung binh.',
                'price'          => '350.000d / buoi',
                'duration'       => '30 phut · 6–10 buoi',
                'sort_order'     => 1,
            ],
            [
                'category_id'    => $catMap['dieu-tri-mun'] ?? null,
                'name'           => 'Salicylic Acid Peel (BHA)',
                'slug'           => 'bha-peel',
                'image'          => 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80&auto=format&fit=crop',
                'category_label' => 'Chemical Peel',
                'description'    => 'Peel BHA 20–30% tham nhap vao lo chan long, loai bo ba nhon, mun dau den va dieu chinh tiet dau. Giam tham sau mun.',
                'price'          => '550.000d / buoi',
                'duration'       => '45 phut · 4–6 buoi',
                'sort_order'     => 2,
            ],
            [
                'category_id'    => $catMap['dieu-tri-mun'] ?? null,
                'name'           => 'Laser Diode 1450nm',
                'slug'           => 'laser-diode-1450nm',
                'image'          => 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80&auto=format&fit=crop',
                'category_label' => 'Laser Therapy',
                'description'    => 'Laser tac dong truc tiep vao tuyen ba nhon, giam tiet dau vinh vien. Hieu qua voi mun nang, mun boc tai phat nhieu lan.',
                'price'          => '900.000d / buoi',
                'duration'       => '40 phut · 3–6 buoi',
                'sort_order'     => 3,
            ],
            // Nam & Sac to
            [
                'category_id'    => $catMap['nam-sac-to'] ?? null,
                'name'           => 'Laser YAG Q-Switched',
                'slug'           => 'laser-yag-q-switched',
                'image'          => 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80&auto=format&fit=crop',
                'category_label' => 'Laser',
                'description'    => 'Xung laser cuc ngan pha vo melanin sac to, co the tu thai ra ngoai. Hieu qua voi nam nong, tan nhang, dom nau.',
                'price'          => '1.200.000d / buoi',
                'duration'       => '30 phut · 6–10 buoi',
                'sort_order'     => 1,
            ],
            [
                'category_id'    => $catMap['nam-sac-to'] ?? null,
                'name'           => 'IPL Intense Pulsed Light',
                'slug'           => 'ipl-intense-pulsed-light',
                'image'          => 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80&auto=format&fit=crop',
                'category_label' => 'IPL Technology',
                'description'    => 'Anh sang xung manh da buoc song — dieu tri nam, dom sac to, mao mach do. Khong xam lan, khong thoi gian nghi phuc hoi.',
                'price'          => '1.500.000d / buoi',
                'duration'       => '45 phut · 4–6 buoi',
                'sort_order'     => 2,
            ],
            [
                'category_id'    => $catMap['nam-sac-to'] ?? null,
                'name'           => 'Mandelic Acid Peel',
                'slug'           => 'mandelic-acid-peel',
                'image'          => 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80&auto=format&fit=crop',
                'category_label' => 'Chemical Peel',
                'description'    => 'AHA phan tu lon, nhe diu voi da nhay cam. Tay te bao chet sau, uc che melanin, lam deu mau da. Phu hop tone da toi.',
                'price'          => '650.000d / buoi',
                'duration'       => '40 phut · 6–8 buoi',
                'sort_order'     => 3,
            ],
            // Lao hoa
            [
                'category_id'    => $catMap['lao-hoa'] ?? null,
                'name'           => 'Laser Fractional CO2',
                'slug'           => 'laser-fractional-co2',
                'image'          => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80&auto=format&fit=crop',
                'category_label' => 'Fractional Laser',
                'description'    => 'Laser tao cot vi nhiet trong da, kich thich collagen va elastin moi. Xoa nhan, tai tao cau truc da toan dien.',
                'price'          => '3.500.000d / buoi',
                'duration'       => '60 phut · 1–3 buoi',
                'sort_order'     => 1,
            ],
            [
                'category_id'    => $catMap['lao-hoa'] ?? null,
                'name'           => 'Microneedling RF',
                'slug'           => 'microneedling-rf',
                'image'          => 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80&auto=format&fit=crop',
                'category_label' => 'RF Microneedling',
                'description'    => 'Kim sieu nho + song Radio Frequency — kich thich collagen o nhieu do sau khac nhau. Nang co, cang da, giam nhan.',
                'price'          => '2.800.000d / buoi',
                'duration'       => '60 phut · 3–4 buoi',
                'sort_order'     => 2,
            ],
            [
                'category_id'    => $catMap['lao-hoa'] ?? null,
                'name'           => 'HIFU Nang co mat',
                'slug'           => 'hifu-nang-co-mat',
                'image'          => 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80&auto=format&fit=crop',
                'category_label' => 'HIFU Ultrasound',
                'description'    => 'Sieu am hoi tu cuong do cao tac dong vao lop SMAS — nang co, gon ham, xoa chay xe. Hieu qua 6–18 thang.',
                'price'          => '5.500.000d / buoi',
                'duration'       => '90 phut · 1–2 buoi/nam',
                'sort_order'     => 3,
            ],
            // Seo & Ro
            [
                'category_id'    => $catMap['seo-ro'] ?? null,
                'name'           => 'Microneedling + PRP (Huyet tuong giau tieu cau)',
                'slug'           => 'microneedling-prp',
                'image'          => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80&auto=format&fit=crop',
                'category_label' => 'Regenerative Therapy',
                'description'    => 'Ket hop microneedling voi PRP tu than — tieu cau kich thich tai sinh mo manh me, lam day seo ro tu ben trong. Ket qua an tuong sau 3–5 buoi.',
                'price'          => '2.200.000d / buoi',
                'duration'       => '75 phut · 4–6 buoi',
                'sort_order'     => 1,
            ],
            [
                'category_id'    => $catMap['seo-ro'] ?? null,
                'name'           => 'Laser Fractional Er:YAG',
                'slug'           => 'laser-fractional-er-yag',
                'image'          => 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80&auto=format&fit=crop',
                'category_label' => 'Fractional Ablative',
                'description'    => 'Laser bao da chinh xac tung lop — tai cau truc be mat seo ro, thu nho lo chan long. It ton thuong mo xung quanh hon CO2.',
                'price'          => '2.800.000d / buoi',
                'duration'       => '60 phut · 2–4 buoi',
                'sort_order'     => 2,
            ],
        ];

        $stmt = $this->pdo->prepare(
            'INSERT INTO services (category_id, name, slug, image, category_label, description, price, duration, sort_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)'
        );
        foreach ($services as $s) {
            $stmt->execute([
                $s['category_id'], $s['name'], $s['slug'], $s['image'],
                $s['category_label'], $s['description'], $s['price'], $s['duration'], $s['sort_order'],
            ]);
        }
    }

    private function seedTeamMembers(): void {
        $count = $this->count('SELECT COUNT(*) FROM team_members');
        if ($count > 0) return;

        $doctors = [
            [
                'BS. Nguyen Minh Tu',
                'Bac si Da lieu CKI',
                'Dieu tri mun & nam',
                '12 nam kinh nghiem',
                'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80&auto=format&fit=crop&crop=faces',
                1,
            ],
            [
                'BS. Tran Thi Lan Anh',
                'Bac si Tham my Da',
                'Laser & Cong nghe cao',
                '9 nam kinh nghiem',
                'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80&auto=format&fit=crop&crop=faces',
                2,
            ],
            [
                'BS. Pham Thanh Hai',
                'Bac si Da lieu CKII',
                'Lao hoa & Tai tao da',
                '15 nam kinh nghiem',
                'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80&auto=format&fit=crop&crop=faces',
                3,
            ],
            [
                'BS. Le Ngoc Huong',
                'Bac si Skincare',
                'Da nhay cam & Seo',
                '7 nam kinh nghiem',
                'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400&q=80&auto=format&fit=crop&crop=faces',
                4,
            ],
        ];

        $stmt = $this->pdo->prepare(
            'INSERT INTO team_members (name, role, speciality, experience, image, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)'
        );
        foreach ($doctors as $d) {
            $stmt->execute($d);
        }
    }

    private function seedTestimonials(): void {
        $count = $this->count('SELECT COUNT(*) FROM testimonials');
        if ($count > 0) return;

        $reviews = [
            [
                'Nguyen Thi Bich Ngoc',
                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80&auto=format&fit=crop&crop=face',
                'Dieu tri mun',
                'Minh da thu rat nhieu noi nhung khong hieu qua. Sau 3 thang dieu tri tai day, da sach mun han. Bac si giai thich rat ky, khong hoi thuc mua them goi.',
                5, 1,
            ],
            [
                'Tran Hoang Anh',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop&crop=face',
                'Dieu tri nam',
                'Nam cua minh rat nang sau sinh, dieu tri o nhieu spa khong khoi. Sau 6 thang tai day, nam mo den 80%. Bac si Lan Anh rat tan tam va hieu benh.',
                5, 2,
            ],
            [
                'Le Thu Huong',
                'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80&auto=format&fit=crop&crop=face',
                'Tre hoa da',
                'Minh 45 tuoi va da da cai thien ro ret sau 4 buoi laser fractional. Nep nhan mo, da cang hon nhieu. Phong kham sach se, quy trinh rat chuyen nghiep.',
                5, 3,
            ],
        ];

        $stmt = $this->pdo->prepare(
            'INSERT INTO testimonials (author_name, author_avatar, condition, content, rating, sort_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?, 1)'
        );
        foreach ($reviews as $r) {
            $stmt->execute($r);
        }
    }
}
