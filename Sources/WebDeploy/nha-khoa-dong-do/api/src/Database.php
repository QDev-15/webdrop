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
            ['site_name',        'Nha Khoa Dong Do',              'general'],
            ['site_tagline',     'Dental Clinic',                  'general'],
            ['site_email',       'lienhe@nhakhoaDongDo.vn',        'general'],
            ['site_phone',       '028 3900 0000',                   'general'],
            ['site_phone_hotline','0901 888 999',                   'general'],
            ['site_address',     '45 Duong Tran Duy Hung, Phuong Trung Hoa, Quan Cau Giay, Ha Noi', 'general'],
            ['working_hours',    'T2-CN: 08:00 - 20:00',           'general'],
            ['zalo_number',      '0901888999',                     'general'],
            ['meta_title',       'Nha Khoa Dong Do - Nha Khoa Cao Cap, Dich Vu Tron Goi', 'seo'],
            ['meta_description', 'Nha Khoa Dong Do - phong kham nha khoa cao cap danh cho khach hang thanh dat. Trong rang Implant, boc su tham my, chinh nha Invisalign cung doi ngu bac si chuyen khoa va cong nghe hien dai.', 'seo'],
            ['meta_keywords',    'nha khoa cao cap, trong rang implant, boc su tham my, invisalign, nha khoa dong do', 'seo'],
            ['facebook_url',     'https://facebook.com/nhakhoaDongDo',   'social'],
            ['instagram_url',    'https://instagram.com/nhakhoaDongDo',  'social'],
            ['youtube_url',      '',                                       'social'],
            ['tiktok_url',       '',                                       'social'],
            ['zalo_url',         'https://zalo.me/0901888999',            'social'],
            ['stat_years',       '15',                                     'about'],
            ['stat_cases',       '12000',                                  'about'],
            ['stat_doctors',     '20',                                     'about'],
            ['stat_satisfaction','98',                                     'about'],
            ['hero_title_main',  'Nu cuoi dang cap, tron ven niem tin',    'about'],
            ['hero_subtitle',    'Nha Khoa Dong Do kien tao trai nghiem nha khoa cao cap tron goi — noi hoi tu doi ngu chuyen gia hang dau va cong nghe hien dai bac nhat, danh rieng cho khach hang thanh dat.', 'about'],
            ['og_image',         '',                                       'seo'],
            ['notify_email',     '',                                       'smtp'],
            ['map_embed',        '',                                       'contact'],
            ['footer_copy',      '© 2026 Nha Khoa Đông Đô. Bảo lưu mọi quyền.', 'footer'],
            ['smtp_host',        'smtp.gmail.com',                         'smtp'],
            ['smtp_port',        '587',                                    'smtp'],
            ['smtp_user',        '',                                       'smtp'],
            ['smtp_pass',        '',                                       'smtp'],
            ['smtp_from_name',   'Nha Khoa Dong Do',                       'smtp'],
            ['smtp_from_email',  '',                                       'smtp'],
            ['cloudinary_cloud_name',    '',                               'cloudinary'],
            ['cloudinary_api_key',       '',                               'cloudinary'],
            ['cloudinary_api_secret',    '',                               'cloudinary'],
            ['cloudinary_upload_preset', '',                               'cloudinary'],
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
                'Nu cuoi dang cap, tron ven niem tin',
                'Nha Khoa Dong Do kien tao trai nghiem nha khoa cao cap tron goi — noi hoi tu doi ngu chuyen gia hang dau va cong nghe hien dai bac nhat, danh rieng cho khach hang thanh dat.',
                'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=78&auto=format&fit=crop',
                'Dat lich tu van',
                '/dat-lich',
                0, 'published',
            ],
        ];
        foreach ($slides as $s) { $stmt->execute($s); }
    }

    private function seedServices(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM services")->fetchColumn();
        if ((int)$count > 0) return;
        $stmt = $this->pdo->prepare(
            "INSERT INTO services (number, name, description, features, price, image, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $services = [
            ['01', 'Trong rang Implant',
             'Phuc hinh rang mat bang tru Implant chuan quoc te — tich hop xuong chac chan, phuc hoi chuc nang an nhai va tham my nhu rang that, do ben vinh vien.',
             'Tru Implant nhap khau, bao hanh dai han|Dinh vi 3D chinh xac tuyet doi',
             'Lien he de bao gia',
             'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=700&q=76&auto=format&fit=crop',
             1, 0],
            ['02', 'Boc su & Veneer tham my',
             'Thiet ke nu cuoi ca nhan hoa theo ty le khuon mat — su cao cap cho do trong tu nhien, mau sac ben vung theo thoi gian.',
             'Thiet ke Digital Smile Design (DSD)|Su khong kim loai, khong den vien nuou',
             'Lien he de bao gia',
             'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=700&q=76&auto=format&fit=crop',
             1, 1],
            ['03', 'Tay trang rang Laser Whitening',
             'Cong nghe tay trang bang Laser cho hieu qua tuc thi, an toan voi men rang — nu cuoi trang sang chi trong mot buoi hen.',
             'Ket qua duy tri den 2 nam|Khong e buot, khong ton thuong nuou',
             'Lien he de bao gia',
             'https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=700&q=76&auto=format&fit=crop',
             1, 2],
            ['04', 'Dieu tri nha chu chuyen sau',
             'Chan doan va dieu tri cac benh ly nuou, viem nha chu — phuc hoi nen tang rang mieng vung chac, ngan ngua bien chung lau dai.',
             'Cao voi, xu ly mat goc rang chuyen sau|Ghep vat nuou, tai tao xuong o rang',
             'Lien he de bao gia',
             'https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?w=700&q=76&auto=format&fit=crop',
             0, 3],
            ['05', 'Nieng rang trong suot Invisalign',
             'Giai phap chinh nha kin dao danh rieng cho nguoi ban ron — khay nieng trong suot thao lap linh hoat, dong hanh cung cong viec va cuoc song.',
             'Mo phong ket qua 3D truoc dieu tri|Bac si chung chi Invisalign quoc te',
             'Lien he de bao gia',
             'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=700&q=76&auto=format&fit=crop',
             1, 4],
            ['06', 'Nho rang khon Piezotome',
             'Cong nghe song sieu am Piezotome giup loai bo rang khon nhe nhang — giam sung dau, rut ngan thoi gian hoi phuc dang ke.',
             'Vo cam em diu, theo doi sat sau phau thuat|Hoi phuc nhanh, han che bien chung',
             'Lien he de bao gia',
             'https://images.unsplash.com/photo-1609207825181-52d3214556dd?w=700&q=76&auto=format&fit=crop',
             0, 5],
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
            ['BS. Nguyen Minh Duc',
             'Giam doc chuyen mon · Implant',
             'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=700&q=78&auto=format&fit=crop',
             'Hon 18 nam kinh nghiem trong linh vuc Implant nha khoa, tung tu nghiep chuyen sau tai Han Quoc va Duc. Truc tiep thuc hien hon 5.000 ca cay ghep Implant thanh cong.',
             18, 'Implant nha khoa|Phuc hinh toan ham|Tu nghiep Han Quoc', 'Giam doc chuyen mon', 0],
            ['BS. Tran Thi Bao Ngoc',
             'Truong khoa · Tham my rang su',
             'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=700&q=78&auto=format&fit=crop',
             'Chuyen gia thiet ke nu cuoi Digital Smile Design voi hon 12 nam kinh nghiem. Duoc dao tao bai ban ve su tham my tai Nhat Ban, noi bat voi gu tham my tinh te.',
             12, 'Veneer su|Digital Smile Design|Tu nghiep Nhat Ban', '', 1],
            ['BS. Le Hoang Phuc',
             'Chuyen gia · Chinh nha Invisalign',
             'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=700&q=78&auto=format&fit=crop',
             'So huu chung chi Invisalign Diamond Provider — top bac si chinh nha trong suot tai Viet Nam. Hon 1.200 ca chinh nha Invisalign thanh cong.',
             10, 'Invisalign|Chinh nha nguoi truong thanh|Diamond Provider', '', 2],
            ['BS. Vu Thanh Tam',
             'Chuyen khoa · Nha chu',
             'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=700&q=78&auto=format&fit=crop',
             'Bac si chuyen khoa nha chu voi hon 10 nam kinh nghiem dieu tri cac benh ly nuou va phau thuat nha chu phuc tap.',
             10, 'Nha chu|Ghep nuou|Tai tao xuong', '', 3],
            ['BS. Do Ngoc Anh Thu',
             'Chuyen khoa · Rang tre em',
             'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=700&q=78&auto=format&fit=crop',
             'Bac si chuyen khoa rang tre em, ton tam dong hanh cung tre trong cac buoi kham va dieu tri nhe nhang.',
             8, 'Rang tre em|Phong ngua sau rang|Nieng rang som', '', 4],
            ['BS. Phan Quang Huy',
             'Chuyen khoa · Phau thuat ham mat',
             'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=700&q=78&auto=format&fit=crop',
             'Chuyen gia phau thuat ham mat voi kinh nghiem xu ly cac ca phuc tap — nho rang khon, chinh hinh xuong ham, ghep xuong nha khoa.',
             14, 'Phau thuat ham mat|Nho rang khon|Ghep xuong', '', 5],
        ];
        foreach ($doctors as $d) { $stmt->execute($d); }
    }

    private function seedTestimonials(): void {
        $count = $this->pdo->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
        if ((int)$count > 0) return;
        $stmt = $this->pdo->prepare(
            "INSERT INTO testimonials (author_name, author_role, content, rating, avatar_url, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        $items = [
            ['Dang Quoc Viet', 'Doanh nhan, Ha Noi',
             'Dong Do mang lai trai nghiem nha khoa hoan toan khac biet — kin dao, chuyen nghiep, va ket qua trong Implant vuot ca ky vong cua toi.',
             5, 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&q=78&auto=format&fit=crop&crop=face', 1, 0],
            ['Pham Thu Ha', 'Giam doc marketing',
             'Doi ngu bac si tu van rat ky, quy trinh boc su tham my chinh xac tung chi tiet. Nu cuoi tu nhien den muc khong ai nhan ra toi vua lam rang.',
             5, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&q=78&auto=format&fit=crop&crop=face', 1, 1],
            ['Nguyen Thanh Long', 'Luat su dieu hanh',
             'Chinh nha Invisalign tai day giup toi tu tin trong cong viec suot qua trinh dieu tri — gan nhu khong ai biet toi dang nieng rang.',
             5, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&q=78&auto=format&fit=crop&crop=face', 1, 2],
        ];
        foreach ($items as $i) { $stmt->execute($i); }
    }
}
