<?php
declare(strict_types=1);

class Database {
    private \PDO $pdo;
    private static ?Database $instance = null;

    private function __construct() {
        if (!defined('DB_FILE')) {
            throw new \RuntimeException('DB_FILE is not defined.');
        }
        $dir = dirname(DB_FILE);
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        $this->pdo = new \PDO('sqlite:' . DB_FILE);
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->pdo->exec('PRAGMA journal_mode = WAL');
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
        $statements = array_filter(array_map('trim', explode(';', $schema)));
        foreach ($statements as $stmt) {
            if ($stmt) {
                try {
                    $this->pdo->exec($stmt);
                } catch (\PDOException $e) {
                    // Ignore "already exists" errors from IF NOT EXISTS
                }
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
        $this->seedGallery();
        $this->seedTestimonials();
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
        $defaults = [
            // general
            ['site_name',              'Fine Dining Cao Cap',                      'general'],
            ['site_description',       'Nha hang fine dining dang cap — noi moi bua an la mot ky niem.',  'general'],
            ['site_logo',              '',                                           'general'],
            ['site_favicon',           '',                                           'general'],
            ['site_email',             'info@finedining.vn',                        'general'],
            ['site_phone',             '0901 234 567',                              'general'],
            ['site_phone_2',           '',                                           'general'],
            ['site_address',           '15 Le Thanh Ton, Quan 1, TP. Ho Chi Minh',  'general'],
            ['working_hours',          'Thu Ba den Chu Nhat · 18:00 - 23:00 · Thu Hai nghi', 'general'],
            // seo
            ['meta_title',             'Fine Dining Cao Cap - Am Thuc Dang Cap Tai TP.HCM', 'seo'],
            ['meta_description',       'Nha hang fine dining dang cap tai TP.HCM. Tasting menu theo mua, sommelier rieng, khong gian sang trong.', 'seo'],
            ['meta_keywords',          'nha hang cao cap, fine dining, nha hang tphcm, tasting menu', 'seo'],
            ['og_image',               '',                                           'seo'],
            ['google_analytics_id',    '',                                           'seo'],
            // social
            ['social_facebook',        'https://facebook.com/finedining',            'social'],
            ['social_instagram',       'https://instagram.com/finedining',           'social'],
            ['social_youtube',         '',                                            'social'],
            ['social_tiktok',          '',                                            'social'],
            ['social_zalo',            'https://zalo.me/0901234567',                 'social'],
            // design
            ['primary_color',          '#92702a',                                    'design'],
            ['secondary_color',        '#0a0906',                                    'design'],
            // about
            ['about_title',            'Nghe thuat am thuc dinh cao',               'about'],
            ['about_content',          'Chung toi tin rang mot bua an tuyet voi khong chi la thuc an.',  'about'],
            ['about_image',            'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80&auto=format&fit=crop', 'about'],
            ['about_tagline',          'Am thuc cao cap · Tu 2018',                  'about'],
            // footer
            ['footer_copyright',       'Copyright 2026 Fine Dining Cao Cap',         'footer'],
            ['footer_description',     'Am thuc fine dining — noi moi bua an la mot trai nghiem khong the quen.', 'footer'],
            ['footer_show_social',     '1',                                           'footer'],
            // contact
            ['contact_form_enabled',   '1',                                           'contact'],
            ['contact_email_receiver', 'info@finedining.vn',                         'contact'],
            ['google_map_embed',       '',                                            'contact'],
            // reservation
            ['reservation_enabled',           '1',                                           'reservation'],
            ['reservation_section_subtitle', 'Không gian yên tĩnh, riêng tư — nơi mỗi bữa ăn trở thành ký ức đẹp không thể nào quên. Chúng tôi nhận tối đa 28 thực khách mỗi tối để đảm bảo chất lượng phục vụ tốt nhất.', 'reservation'],
            ['max_guests',             '6',                                           'reservation'],
            ['open_hours_text',        'Thu Ba den Chu Nhat · 18:00 - 23:00',        'reservation'],
            ['advance_booking_hours',  '24',                                          'reservation'],
            ['cancellation_policy',    'Huy truoc 4 gio mien phi. Huy muon hon phi 200k/nguoi.', 'reservation'],
            ['dress_code',             'Smart Casual. Khong nhan khach mac quan short, sandal xo ngon.', 'reservation'],
            // smtp
            ['smtp_host',              'smtp.gmail.com',                             'smtp'],
            ['smtp_port',              '587',                                         'smtp'],
            ['smtp_user',              '',                                            'smtp'],
            ['smtp_password',          '',                                            'smtp'],
            ['smtp_from_name',         'Fine Dining Cao Cap',                        'smtp'],
            ['smtp_from_email',        'info@finedining.vn',                         'smtp'],
            // system
            ['maintenance_mode',       '0',                                           'system'],
            ['maintenance_message',    'He thong dang nang cap. Vui long quay lai sau.', 'system'],
            // cloudinary
            ['cloudinary_cloud_name',  '',                                            'cloudinary'],
            ['cloudinary_api_key',     '',                                            'cloudinary'],
            ['cloudinary_api_secret',  '',                                            'cloudinary'],
            ['cloudinary_folder',      'nha-hang-cao-cap',                           'cloudinary'],
            // integrations
            ['unsplash_access_key',    '',                                            'integrations'],
        ];
        foreach ($defaults as $row) {
            $this->execute(
                "INSERT OR IGNORE INTO settings (key, value, \"group\") VALUES (?, ?, ?)",
                $row
            );
        }
    }

    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        $slides = [
            [
                'title'       => 'Noi moi bua an la mot ky niem',
                'subtitle'    => 'Tasting menu duoc thiet ke rieng theo mua, ket hop ky thuat nau an hien dai voi nguyen lieu dia phuong thuong hang.',
                'button_text' => 'Dat ban ngay',
                'button_link' => '/dat-ban',
                'image'       => 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=85&auto=format&fit=crop',
                'sort_order'  => 0,
                'status'      => 'published',
            ],
            [
                'title'       => 'Nghe thuat tren tung dia an',
                'subtitle'    => 'Moi mon an la tac pham duoc kien truc ti mi. Dau bep cua chung toi khong nau an, ho sang tac.',
                'button_text' => 'Kham pha thuc don',
                'button_link' => '/menu',
                'image'       => 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1400&q=85&auto=format&fit=crop',
                'sort_order'  => 1,
                'status'      => 'published',
            ],
            [
                'title'       => 'Nguyen lieu thuong hang theo mua',
                'subtitle'    => 'Chi su dung nhung nguyen lieu tuoi ngon nhat cua mua — rau trong huu co, hai san danh bat ngay.',
                'button_text' => 'Xem menu theo mua',
                'button_link' => '/menu',
                'image'       => 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1400&q=85&auto=format&fit=crop',
                'sort_order'  => 2,
                'status'      => 'published',
            ],
        ];
        foreach ($slides as $s) {
            $this->execute(
                "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [$s['title'], $s['subtitle'], $s['button_text'], $s['button_link'], $s['image'], $s['sort_order'], $s['status']]
            );
        }
    }

    private function seedMenuCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_categories") > 0) return;
        $cats = [
            ['Amuse-Bouche', 'amuse-bouche', 'Mot mieng an chao mung tu bep truong', 0],
            ['Entree',       'entree',       'Mon khai vi tinh te',                   1],
            ['Poisson',      'poisson',      'Mon ca va hai san cao cap',             2],
            ['Viande',       'viande',       'Mon thit dac sac',                       3],
            ['Fromage',      'fromage',      'Pho mai tuyen chon',                    4],
            ['Dessert',      'dessert',      'Trang mieng thu cong',                  5],
            ['Mignardise',   'mignardise',   'Ket thuc ngot ngao',                    6],
        ];
        foreach ($cats as $c) {
            $this->execute(
                "INSERT INTO menu_categories (name, slug, description, sort_order, status) VALUES (?, ?, ?, ?, 'published')",
                $c
            );
        }
    }

    private function seedMenuItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_items") > 0) return;
        $items = [
            // Amuse-Bouche (cat 1)
            [1, 'Mot mieng chao tu bep truong', 'mot-mieng-chao', 'Bit tet bach tuoc — ponzu — tinh dau mui tau, served on ceramic stone', null, '', '', 'Di ung: hai san', 0, 0],
            // Entree (cat 2)
            [2, 'So Diep Ap Chao', 'so-diep-ap-chao', 'So diep Ca Mau ap chao bo nau, gelee dua leo, dau hoa lai, roe cua ca sturgeon nhap khau', 320000, 'Chef Signature', '', 'Di ung: hai san, sua', 1, 0],
            [2, 'Foie Gras Tom Su', 'foie-gras-tom-su', 'Foie gras sot xi dau chua ngot kieu Hoi An, tom su nuong than, brioche nha lam tuoi nong', 385000, '', '', 'Di ung: gluten, sua, hai san', 0, 1],
            // Poisson (cat 3)
            [3, 'Ca Chem Nuong Muoi Ham', 'ca-chem-nuong-muoi-ham', 'Ca chem bien Phu Quoc nuong trong ham muoi dat set 45 phut, beurre blanc sa gung, rau mui tuoi', 450000, '', '', 'Di ung: ca, sua', 0, 0],
            [3, 'Cua Hoang De Alaska Hap Bia', 'cua-hoang-de-alaska', 'Cua Alaska thit trang ngot tu nhien, hap bia Bi, mayonnaise chanh day, banh mi sourdough nha lam', 520000, '', '', 'Di ung: hai san, gluten, trung', 0, 1],
            // Viande (cat 4)
            [4, 'Bo Wagyu A5 Nuong Charcoal', 'bo-wagyu-a5-nuong', 'Wagyu A5 Nhat Ban nuong than hoa 5 phut, jus thit bo gia 24 thang, cu cai ham ruou vang do, truffle den Perigord bao tuoi', 890000, 'Premium', '', 'Di ung: sua', 1, 0],
            [4, 'Vit Confit 48 Gio', 'vit-confit-48-gio', 'Dui vit uop muoi roi confit 48 gio o 68 do, da gion hoan hao, sauce orange cointreau, dau lens den Puy', 480000, '', '', 'Di ung: sua, ruou', 0, 1],
            // Fromage (cat 5)
            [5, 'Cheese Trolley', 'cheese-trolley', 'Tu chon 3-5 loai pho mai tu xe day: Brie, Camembert, Comte, Roquefort, Manchego kem mut man, mat ong va banh mi nuong gion', 280000, '', '', 'Di ung: sua, gluten', 0, 0],
            // Dessert (cat 6)
            [6, 'Souffle Socola Dang 72%', 'souffle-socola-dang', 'Souffle nong hoi tu Valrhona 72%, trung ga tuoi danh bong, kem vani bourbon Madagascar tu lam, manh vang la 24k', 195000, 'Phai dat truoc', '', 'Di ung: gluten, trung, sua', 1, 0],
            [6, 'Tarte Chanh Leo va Dua', 'tarte-chanh-leo-dua', 'Tart vo bo gion, curd chanh leo chua ngot hoan hao, dua nao nhe rang vang, meringue dot chay mat', 165000, '', '', 'Di ung: gluten, trung, sua', 0, 1],
            // Mignardise (cat 7)
            [7, 'Petit Four Tu Lam Hang Ngay', 'petit-four-tu-lam', 'Macarons, chocolate truffle, pate de fruit theo mua va vien keo mem caramel muoi bien tang kem cho tat ca thuc khach', null, '', '', '', 0, 0],
        ];
        foreach ($items as $item) {
            $this->execute(
                "INSERT INTO menu_items (category_id, name, slug, description, price, badge, image, allergens, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                $item
            );
        }
    }

    private function seedGallery(): void {
        if ($this->scalar("SELECT COUNT(*) FROM gallery_items") > 0) return;
        $items = [
            ['Khong gian nha hang',  'Noi that sang trong, anh sang am ap',              'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop', 'interior', 0],
            ['Nghe thuat am thuc',   'Mon an duoc trinh bay nhu tac pham nghe thuat',   'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80&auto=format&fit=crop', 'food',     1],
            ['Nguyen lieu tuoi ngon','Rau huu co va hai san tuoi tu bien Viet Nam',      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80&auto=format&fit=crop', 'kitchen',  2],
            ['Phong rieng tu Salon', 'Khong gian lang man voi anh nen lung linh',       'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80&auto=format&fit=crop',   'interior', 3],
            ['Ban tiec sang trong',  'Setup ban an hoan hao cho nhung dip dac biet',    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3df1?w=800&q=80&auto=format&fit=crop', 'interior', 4],
            ['Wine Collection',      'Ham ruou voi hon 300 loai wine tuyen chon',      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80&auto=format&fit=crop', 'wine',     5],
        ];
        foreach ($items as $g) {
            $this->execute(
                "INSERT INTO gallery_items (title, description, image, category, sort_order, status) VALUES (?, ?, ?, ?, ?, 'published')",
                $g
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $testimonials = [
            ['Minh Duc',              'Food Editor · Ngoisao.vn',              'Mot trong nhung bua toi dang nho nhat toi tung trai qua tai Viet Nam. Bep truong da tai hien am thuc A Dong qua ngon ngu fine dining theo cach khong ai lam duoc truoc day.', 5, 0],
            ['Linh Phuong',           'Travel & Food Writer · Luxuo Vietnam',  'Toi da den hon 200 nha hang fine dining tren the gioi. Nha hang khien toi ngac nhien boi su tinh te trong tung chi tiet — tu bo do an den cach trinh bay va cau chuyen dang sau moi mon.', 5, 1],
            ['Nguyen Thi Huong',      'Head of Corporate Affairs · VinGroup',  'Chung toi da su dung nha hang cho 3 gala dinner cua cong ty trong hai nam qua. Moi lan deu vuot moi ky vong — doi tac nuoc ngoai cua chung toi luon an tuong sau sac.', 5, 2],
            ['Tran Minh Khoa',        'Khach hang Private Dining',             'Ky niem 10 nam ngay cuoi cua chung toi duoc to chuc tai day. Tu cach ho sap xep hoa, am nhac den tung mon an — tat ca hoan hao den muc chung toi roi nuoc mat.', 5, 3],
            ['Le Quang Trung',        'CEO · TechStart Vietnam',               'Buoi meeting voi doi tac Singapore dien ra tai day la mot trong nhung quyet dinh dung dan nhat. Khong khi, am thuc va dich vu tao an tuong tot tu phut dau tien.', 5, 4],
        ];
        foreach ($testimonials as $t) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, content, rating, sort_order, status) VALUES (?, ?, ?, ?, ?, 'published')",
                $t
            );
        }
    }

    // ── Query helpers ─────────────────────────────────────────────────────────

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

    public function scalar(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $val = $stmt->fetchColumn();
        return (int)($val ?: 0);
    }
}
