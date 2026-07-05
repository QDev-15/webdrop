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
            ['site_name',        'Nu Cuoi Xua — Nha Khoa Phong Cach Retro',       'general'],
            ['site_tagline',     'Hien dai mang tam hon hoai co — tu 2003',        'general'],
            ['site_email',       'lienhe@nucuoixua.vn',                             'general'],
            ['site_phone',       '0901 234 567',                                    'general'],
            ['site_address',     '12 Duong Le Loi, Phuong Ben Nghe, Quan 1, TP.HCM', 'general'],
            ['working_hours',    'Thu 2 – Thu 7: 8:00 – 20:00 | Chu nhat: 8:00 – 17:00', 'general'],
            // seo
            ['meta_title',       'Nu Cuoi Xua — Nha Khoa Phong Cach Retro | Tu 2003', 'seo'],
            ['meta_description', 'Phong kham nha khoa hien dai mang phong cach vintage/retro doc dao, gan gui va ca tinh. Dat lich kham ngay hom nay.', 'seo'],
            // social
            ['facebook',         'https://facebook.com/nucuoixua.dental',          'social'],
            ['instagram',        'https://instagram.com/nucuoixua.dental',         'social'],
            ['youtube',          'https://youtube.com/@nucuoixua',                 'social'],
            ['tiktok',           'https://tiktok.com/@nucuoixua.dental',           'social'],
            ['zalo',             '0901234567',                                      'social'],
            // footer
            ['footer_copy',      '2026 Nu Cuoi Xua. Moi quyen duoc bao luu.',      'footer'],
            ['footer_cert',      'Giay phep hoat dong so XXX/BYT',                 'footer'],
            // contact
            ['map_embed',        '',                                                'contact'],
            ['zalo_number',      '0901234567',                                      'contact'],
            // smtp
            ['smtp_host',        '', 'smtp'],
            ['smtp_port',        '', 'smtp'],
            ['smtp_user',        '', 'smtp'],
            ['smtp_pass',        '', 'smtp'],
            // system
            ['maintenance_mode', '0', 'system'],
            // cloudinary
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key',    '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            // integrations
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
            // hero / stats
            ['hero_badge',          'Phong kham tu 2003',                           'hero'],
            ['hero_title',          'Nu Cuoi Xua & Nay',                            'hero'],
            ['hero_subtitle',       'Nha khoa hien dai mang tam hon hoai co — noi ky thuat so ket hop voi su an can kieu xua, de moi nu cuoi deu duoc cham chut nhu mot tac pham.', 'hero'],
            ['hero_image',          'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80&auto=format&fit=crop', 'hero'],
            ['stat_years',          '20+',     'stats'],
            ['stat_years_label',    'Nam hoat dong',      'stats'],
            ['stat_smiles',         '12.000+', 'stats'],
            ['stat_smiles_label',   'Nu cuoi hai long',   'stats'],
            ['stat_doctors',        '6',       'stats'],
            ['stat_doctors_label',  'Bac si chuyen khoa', 'stats'],
            ['stat_satisfaction',   '98%',     'stats'],
            ['stat_satisfaction_label', 'Hai long',       'stats'],
            // story
            ['story_year',          'Tu nam 2003',         'story'],
            ['story_title',         'Cau chuyen cua chung toi', 'story'],
            ['story_text',          'Bat dau tu mot phong kham nho trong con hem cu, Nu Cuoi Xua di qua hon hai thap ky voi mot niem tin khong doi: moi benh nhan deu xung dang duoc lang nghe nhu nguoi than trong nha.', 'story'],
            ['story_image',         'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80&auto=format&fit=crop', 'story'],
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
            'Nu Cuoi Xua & Nay',
            'Nha khoa hien dai mang tam hon hoai co — dat lich kham ngay hom nay.',
            'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1400&q=80&auto=format&fit=crop',
            'Dat lich ngay',
            '/dat-lich',
            1,
        ]);
    }

    private function seedServiceCategories(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM service_categories")->fetchColumn();
        if ((int)$count > 0) return;
        $cats = [
            ['Nha khoa tong quat', 'Kham dinh ky, phong ngua benh rang mieng', 1],
            ['Tieu phau', 'Nho rang khon, phau thuat rang an toan', 2],
            ['Dieu tri',  'Tram rang, dieu tri tuy, cham soc toan dien', 3],
            ['Tham my nha khoa', 'Tay trang, boc su, dan Veneer — nu cuoi dep', 4],
            ['Chinh nha & phuc hinh', 'Nieng rang, Implant phuc hoi toan dien', 5],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO service_categories (name, description, sort_order, is_active) VALUES (?, ?, ?, 1)"
        );
        foreach ($cats as $c) { $stmt->execute($c); }
    }

    private function seedServices(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM services")->fetchColumn();
        if ((int)$count > 0) return;

        $catRows = $this->pdo->query("SELECT id FROM service_categories ORDER BY sort_order")->fetchAll(\PDO::FETCH_ASSOC);
        $ids = array_column($catRows, 'id');
        [$c1, $c2, $c3, $c4, $c5] = array_pad($ids, 5, null);

        $services = [
            [$c1, 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80&auto=format&fit=crop', 'Tong quat', 'Kham & Tu Van', 'Kiem tra tong quat, chup X-quang, len ke hoach dieu tri ro rang, minh bach.', '150.000d', '/ luot', 1],
            [$c1, 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80&auto=format&fit=crop', 'Tong quat', 'Cao Voi Rang', 'Lam sach mang bam, voi rang bang may sieu am — ngua viem nuou hieu qua.', '200.000d', '/ luot', 2],
            [$c2, 'https://images.unsplash.com/photo-1609207825181-52d3214556dd?w=600&q=80&auto=format&fit=crop', 'Tieu phau', 'Nho Rang Khon', 'Tieu phau an toan voi gay te, ho tro may Piezotome giam dau, giam sung.', '800.000d', '/ rang', 1],
            [$c3, 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=80&auto=format&fit=crop', 'Dieu tri', 'Tram Rang Sau', 'Tram Composite tham my, phuc hoi hinh dang va chuc nang an nhai.', '300.000d', '/ rang', 1],
            [$c3, 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600&q=80&auto=format&fit=crop', 'Dieu tri', 'Dieu Tri Tuy', 'Ky thuat tram may hien dai, bao ton rang that toi da, it dau nhuc.', '1.000.000d', '/ rang', 2],
            [$c3, 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80&auto=format&fit=crop', 'Tre em', 'Nha Khoa Tre Em', 'Kham & dieu tri nhe nhang, kien nhan — giup be khong con so nha si.', '150.000d', '/ luot', 3],
            [$c4, 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=80&auto=format&fit=crop', 'Tham my', 'Tay Trang Rang', 'Cong nghe Laser Whitening — trang sang an toan, khong e buot.', '1.200.000d', '/ lieu trinh', 1],
            [$c4, 'https://images.unsplash.com/photo-1581585095522-f6b1e2ce4e4a?w=600&q=80&auto=format&fit=crop', 'Tham my', 'Boc Rang Su Zirconia', 'Rang su cao cap bao hanh 10 nam, mau sac tu nhien nhu rang that.', '4.500.000d', '/ rang', 2],
            [$c4, 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80&auto=format&fit=crop', 'Tham my', 'Dan Su Veneer', 'Khong mai rang, giu rang that — thay doi hinh dang, mau sac nhanh chong.', '6.000.000d', '/ rang', 3],
            [$c5, 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600&q=80&auto=format&fit=crop', 'Chinh nha', 'Nieng Rang', 'Mac cai kim loai, su hoac khay trong suot — phu hop moi do tuoi.', '18.000.000d', '/ lieu trinh', 1],
            [$c5, 'https://images.unsplash.com/photo-1581585095522-f6b1e2ce4e4a?w=600&q=80&auto=format&fit=crop', 'Phuc hinh', 'Cay Ghep Implant', 'Tru Implant chuan quoc te, phuc hoi rang mat ben vung lau dai.', '15.000.000d', '/ tru', 2],
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
            ['BS. Nguyen Van Khoa',   'Sang lap & Giam doc chuyen mon', 20, 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=80&auto=format&fit=crop', 'Nha khoa tong quat,Implant', 'Moi benh nhan deu xung dang duoc lang nghe nhu nguoi than trong nha.', 1],
            ['BS. Tran Thi Bich Ngoc','Chuyen khoa Chinh nha',          10, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=80&auto=format&fit=crop', 'Nieng rang,Khay trong suot', 'Nu cuoi deu dep mang lai su tu tin cho ca cuoc doi.', 2],
            ['BS. Le Minh Hoang',     'Chuyen khoa Implant',             12, 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=80&auto=format&fit=crop', 'Implant,Phau thuat', 'Chinh xac va an toan la uu tien hang dau trong tung ca cay ghep.', 3],
            ['BS. Pham Thi Mai',      'Chuyen khoa Tham my rang',         9, 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=500&q=80&auto=format&fit=crop', 'Veneer,Tay trang,Boc su', 'Tham my rang can tu nhien, hai hoa voi guong mat.', 4],
            ['BS. Hoang Van Duc',     'Chuyen khoa Nha nhi',              8, 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80&auto=format&fit=crop', 'Tre em,Phong ngua', 'Lam ban voi cac be truoc khi lam bac si cua cac be.', 5],
            ['BS. Do Thi Lan',        'Chuyen khoa Noi nha',              8, 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=80&auto=format&fit=crop', 'Dieu tri tuy,Noi nha', 'Cham soc rang mieng la hanh trinh dai — toi dong hanh cung ban suot hanh trinh do.', 6],
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
            ['Nguyen Van A',  'Khach hang 3 nam',   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=70&auto=format&fit=crop', 5, 'Khong gian phong kham lam toi nho tiem nha khoa cua ong toi ngay xua — nhung may moc thi hien dai khong kem benh vien lon. Bac si giai thich rat ky truoc khi lam.', 1],
            ['Tran Thi Bich', 'Google Reviews',     'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=70&auto=format&fit=crop', 5, 'Nieng rang o day gan 2 nam, bac si theo sat tung buoi tai kham, khong he qua loa. Gia ca ro rang ngay tu dau, khong phat sinh.', 2],
            ['Le Minh Cu',    'Facebook Review',    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=70&auto=format&fit=crop', 5, 'Con toi von so nha si nhung cac co chu o day rat kien nhan va nhe nhang. Khong gian am cung chu khong lanh leo nhu phong kham thong thuong.', 3],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO testimonials (author_name, author_meta, author_avatar, stars, quote, is_active, sort_order)
             VALUES (?, ?, ?, ?, ?, 1, ?)"
        );
        foreach ($items as $i) { $stmt->execute($i); }
    }
}
