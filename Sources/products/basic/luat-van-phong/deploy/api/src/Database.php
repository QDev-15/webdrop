<?php

class Database {
    private static ?Database $instance = null;
    private PDO $pdo;

    private function __construct() {
        if (DB_TYPE === 'sqlite') {
            $dir = dirname(DB_FILE);
            if (!is_dir($dir)) mkdir($dir, 0755, true);
            $this->pdo = new PDO('sqlite:' . DB_FILE);
            $this->pdo->exec('PRAGMA foreign_keys = ON');
            $this->pdo->exec('PRAGMA journal_mode = WAL');
            $this->pdo->exec('PRAGMA synchronous = NORMAL');
        } else {
            $dsn = DB_TYPE . ':host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS);
        }
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $this->migrate();
    }

    public static function getInstance(): Database {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function pdo(): PDO { return $this->pdo; }

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

    public function scalar(string $sql, array $params = []) {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch(PDO::FETCH_NUM);
        return $row ? $row[0] : null;
    }

    public function execute(string $sql, array $params = []) {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        if (stripos(trim($sql), 'INSERT') === 0) {
            return $this->pdo->lastInsertId();
        }
        return $stmt->rowCount();
    }

    private function migrate(): void {
        $schemaPath = __DIR__ . '/../schema.sql';
        $schema = file_get_contents($schemaPath);
        if ($schema === false) {
            throw new \RuntimeException('schema.sql not found at ' . $schemaPath);
        }
        foreach (array_filter(array_map('trim', explode(';', $schema))) as $stmt) {
            if ($stmt) {
                try { $this->pdo->exec($stmt); } catch (\PDOException $e) { /* ignore already-exists */ }
            }
        }
        $this->seedData();
    }
    private function seedData(): void {
        $this->seedUsers();
        $this->seedSettings();
        $this->seedHeroSlides();
        $this->seedServices();
        $this->seedLawyers();
        $this->seedCases();
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

        $settings = [
            // general
            ['site_name',          'Nguyá»…n & Äá»“ng Nghiá»‡p',              'general'],
            ['site_tagline',       'VÄƒn PhÃ²ng Luáº­t SÆ°',                  'general'],
            ['site_description',   'VÄƒn phÃ²ng luáº­t sÆ° uy tÃ­n táº¡i TP.HCM â€” cam káº¿t báº£o vá»‡ quyá»n lá»£i tá»‘i Ä‘a cho thÃ¢n chá»§ trong má»i lÄ©nh vá»±c phÃ¡p lÃ½.', 'general'],
            ['site_logo',          '',                                    'general'],
            ['site_favicon',       '',                                    'general'],
            ['site_email',         'info@luatvanphong.vn',               'general'],
            ['site_phone',         '0900 000 000',                       'general'],
            ['site_phone_2',       '0800 000 000',                       'general'],
            ['site_address',       'Táº§ng 12, TÃ²a nhÃ  Saigon Tower, 29 LÃª Duáº©n, PhÆ°á»ng Báº¿n NghÃ©, Quáº­n 1, TP. Há»“ ChÃ­ Minh', 'general'],
            ['working_hours',      "Thá»© Hai â€“ Thá»© SÃ¡u: 8:00 â€“ 17:30\nThá»© Báº£y: 8:00 â€“ 12:00\nChá»§ Nháº­t: Theo Ä‘áº·t háº¹n", 'general'],
            ['established_year',   '2009',                               'general'],
            // seo
            ['meta_title',         'Nguyá»…n & Äá»“ng Nghiá»‡p â€” TÆ° Váº¥n PhÃ¡p LÃ½ ChuyÃªn Nghiá»‡p', 'seo'],
            ['meta_description',   'VÄƒn phÃ²ng luáº­t sÆ° uy tÃ­n táº¡i TP.HCM â€” tÆ° váº¥n phÃ¡p lÃ½, tranh tá»¥ng, luáº­t doanh nghiá»‡p, lao Ä‘á»™ng vÃ  báº¥t Ä‘á»™ng sáº£n.', 'seo'],
            ['meta_keywords',      'luáº­t sÆ°, tÆ° váº¥n phÃ¡p lÃ½, tranh tá»¥ng, luáº­t doanh nghiá»‡p, luáº­t lao Ä‘á»™ng, báº¥t Ä‘á»™ng sáº£n', 'seo'],
            ['og_image',           '',                                    'seo'],
            ['google_analytics_id','',                                    'seo'],
            // social
            ['social_facebook',    '',                                    'social'],
            ['social_linkedin',    '',                                    'social'],
            ['social_zalo',        '',                                    'social'],
            ['social_youtube',     '',                                    'social'],
            // footer
            ['footer_copyright',   'Â© 2024 Nguyá»…n & Äá»“ng Nghiá»‡p. Báº£o lÆ°u má»i quyá»n.', 'footer'],
            ['footer_description', 'VÄƒn phÃ²ng luáº­t sÆ° uy tÃ­n táº¡i TP.HCM â€” cam káº¿t báº£o vá»‡ quyá»n lá»£i tá»‘i Ä‘a cho thÃ¢n chá»§ trong má»i lÄ©nh vá»±c phÃ¡p lÃ½.', 'footer'],
            ['footer_show_social', '1',                                   'footer'],
            // contact
            ['contact_form_enabled',    '1',                             'contact'],
            ['contact_email_receiver',  'tuvan@luatvanphong.vn',        'contact'],
            ['google_map_embed',        '',                              'contact'],
            // about / hero
            ['hero_kicker',        'VÄƒn PhÃ²ng Luáº­t SÆ° Â· ThÃ nh Láº­p 2009', 'about'],
            ['hero_heading',       "Báº£o vá»‡\nquyá»n lá»£i\ncá»§a báº¡n.",        'about'],
            ['hero_sub',           'HÆ¡n 15 nÄƒm kinh nghiá»‡m trong cÃ¡c lÄ©nh vá»±c luáº­t doanh nghiá»‡p, lao Ä‘á»™ng, báº¥t Ä‘á»™ng sáº£n vÃ  tranh tá»¥ng. ChÃºng tÃ´i cam káº¿t báº£o vá»‡ quyá»n lá»£i tá»‘i Ä‘a cho thÃ¢n chá»§ táº¡i má»i cáº¥p tÃ²a Ã¡n.', 'about'],
            ['hero_image',         'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80&auto=format&fit=crop', 'about'],
            ['stat_cases',         '500+',                               'about'],
            ['stat_years',         '15',                                 'about'],
            ['stat_lawyers',       '12',                                 'about'],
            ['stat_winrate',       '94%',                               'about'],
            // smtp
            ['smtp_host',          'smtp.gmail.com',                    'smtp'],
            ['smtp_port',          '587',                               'smtp'],
            ['smtp_user',          '',                                   'smtp'],
            ['smtp_password',      '',                                   'smtp'],
            ['smtp_from_name',     'VÄƒn PhÃ²ng Luáº­t SÆ°',                'smtp'],
            ['smtp_from_email',    '',                                   'smtp'],
            // system
            ['maintenance_mode',    '0',                                'system'],
            ['maintenance_message', 'Website Ä‘ang báº£o trÃ¬. Vui lÃ²ng quay láº¡i sau.', 'system'],
            // cloudinary
            ['cloudinary_cloud_name', '',        'cloudinary'],
            ['cloudinary_api_key',    '',        'cloudinary'],
            ['cloudinary_api_secret', '',        'cloudinary'],
            ['cloudinary_folder',     'webdrop', 'cloudinary'],
            // integrations
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];

        foreach ($settings as [$key, $value, $group]) {
            $this->execute(
                "INSERT OR IGNORE INTO settings (key, value, \"group\") VALUES (?, ?, ?)",
                [$key, $value, $group]
            );
        }
    }

    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        $slides = [
            [
                'title'       => 'Báº£o vá»‡ quyá»n lá»£i cá»§a báº¡n',
                'subtitle'    => 'HÆ¡n 15 nÄƒm kinh nghiá»‡m trong luáº­t doanh nghiá»‡p, lao Ä‘á»™ng, báº¥t Ä‘á»™ng sáº£n vÃ  tranh tá»¥ng.',
                'button_text' => 'TÆ° Váº¥n Miá»…n PhÃ­',
                'button_link' => '/lien-he',
                'image'       => 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1400&q=80&auto=format&fit=crop',
                'sort_order'  => 1,
            ],
            [
                'title'       => 'ChuyÃªn mÃ´n sÃ¢u, giáº£i phÃ¡p toÃ n diá»‡n',
                'subtitle'    => 'Äá»™i ngÅ© 12 luáº­t sÆ° chuyÃªn sÃ¢u trong 6 lÄ©nh vá»±c phÃ¡p lÃ½ trá»ng yáº¿u cá»§a ná»n kinh táº¿ Viá»‡t Nam.',
                'button_text' => 'LÄ©nh Vá»±c HÃ nh Nghá»',
                'button_link' => '/dich-vu',
                'image'       => 'https://images.unsplash.com/photo-1453945619913-79ec89a82c51?w=1400&q=80&auto=format&fit=crop',
                'sort_order'  => 2,
            ],
        ];
        foreach ($slides as $s) {
            $this->execute(
                "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?)",
                [$s['title'], $s['subtitle'], $s['button_text'], $s['button_link'], $s['image'], $s['sort_order']]
            );
        }
    }

    private function seedServices(): void {
        if ($this->scalar("SELECT COUNT(*) FROM services") > 0) return;
        $services = [
            [
                'name' => 'Luáº­t Doanh Nghiá»‡p & M&A',
                'slug' => 'luat-doanh-nghiep-ma',
                'tag'  => 'Corporate & M&A',
                'desc' => 'Há»— trá»£ doanh nghiá»‡p trong toÃ n bá»™ vÃ²ng Ä‘á»i phÃ¡p lÃ½ â€” tá»« thÃ nh láº­p, váº­n hÃ nh Ä‘áº¿n tÃ¡i cÆ¡ cáº¥u vÃ  thÃ¢u tÃ³m.',
                'items' => [
                    'ThÃ nh láº­p vÃ  tá»• chá»©c láº¡i doanh nghiá»‡p',
                    'TÆ° váº¥n vÃ  soáº¡n tháº£o há»£p Ä‘á»“ng thÆ°Æ¡ng máº¡i',
                    'Mua bÃ¡n, sÃ¡p nháº­p, thÃ¢u tÃ³m (M&A)',
                    'TÃ¡i cÆ¡ cáº¥u vÃ  giáº£i thá»ƒ doanh nghiá»‡p',
                    'Quáº£n trá»‹ cÃ´ng ty vÃ  tuÃ¢n thá»§ phÃ¡p luáº­t',
                    'Äáº§u tÆ° nÆ°á»›c ngoÃ i vÃ  liÃªn doanh',
                ],
                'order' => 1,
            ],
            [
                'name' => 'Luáº­t Lao Äá»™ng & Quan Há»‡ NgÆ°á»i Sá»­ Dá»¥ng',
                'slug' => 'luat-lao-dong',
                'tag'  => 'Labor Law',
                'desc' => 'Báº£o vá»‡ toÃ n diá»‡n quyá»n lá»£i cá»§a ngÆ°á»i lao Ä‘á»™ng láº«n doanh nghiá»‡p trong cÃ¡c váº¥n Ä‘á» lao Ä‘á»™ng phá»©c táº¡p.',
                'items' => [
                    'Soáº¡n tháº£o há»£p Ä‘á»“ng lao Ä‘á»™ng vÃ  ná»™i quy',
                    'Tranh cháº¥p lao Ä‘á»™ng vÃ  ká»· luáº­t sa tháº£i',
                    'Báº£o hiá»ƒm xÃ£ há»™i, báº£o hiá»ƒm tháº¥t nghiá»‡p',
                    'ThÆ°Æ¡ng lÆ°á»£ng táº­p thá»ƒ vÃ  Ä‘Ã¬nh cÃ´ng',
                    'Quáº¥y rá»‘i vÃ  phÃ¢n biá»‡t Ä‘á»‘i xá»­ táº¡i nÆ¡i lÃ m viá»‡c',
                    'Lao Ä‘á»™ng ngÆ°á»i nÆ°á»›c ngoÃ i',
                ],
                'order' => 2,
            ],
            [
                'name' => 'Luáº­t Báº¥t Äá»™ng Sáº£n & XÃ¢y Dá»±ng',
                'slug' => 'luat-bat-dong-san',
                'tag'  => 'Real Estate',
                'desc' => 'TÆ° váº¥n phÃ¡p lÃ½ toÃ n diá»‡n cho cÃ¡c giao dá»‹ch báº¥t Ä‘á»™ng sáº£n vÃ  dá»± Ã¡n xÃ¢y dá»±ng, tá»« tháº©m Ä‘á»‹nh Ä‘áº¿n hoÃ n cÃ´ng.',
                'items' => [
                    'Tháº©m Ä‘á»‹nh phÃ¡p lÃ½ dá»± Ã¡n báº¥t Ä‘á»™ng sáº£n',
                    'Soáº¡n tháº£o há»£p Ä‘á»“ng mua bÃ¡n, thuÃª mÆ°á»›n',
                    'Tranh cháº¥p Ä‘áº¥t Ä‘ai vÃ  quyá»n sá»­ dá»¥ng Ä‘áº¥t',
                    'Thá»§ tá»¥c cáº¥p phÃ©p xÃ¢y dá»±ng',
                    'Há»£p Ä‘á»“ng EPC vÃ  tá»•ng tháº§u xÃ¢y dá»±ng',
                    'Thu há»“i Ä‘áº¥t vÃ  bá»“i thÆ°á»ng giáº£i phÃ³ng máº·t báº±ng',
                ],
                'order' => 3,
            ],
            [
                'name' => 'Tranh Tá»¥ng & Giáº£i Quyáº¿t Tranh Cháº¥p',
                'slug' => 'tranh-tung',
                'tag'  => 'Litigation',
                'desc' => 'Äáº¡i diá»‡n máº¡nh máº½ cho thÃ¢n chá»§ táº¡i táº¥t cáº£ cÃ¡c cáº¥p tÃ²a Ã¡n, trong má»i loáº¡i tranh cháº¥p dÃ¢n sá»± vÃ  thÆ°Æ¡ng máº¡i.',
                'items' => [
                    'Tranh tá»¥ng dÃ¢n sá»± vÃ  thÆ°Æ¡ng máº¡i',
                    'Trá»ng tÃ i thÆ°Æ¡ng máº¡i trong nÆ°á»›c vÃ  quá»‘c táº¿',
                    'HÃ²a giáº£i vÃ  thÆ°Æ¡ng lÆ°á»£ng ngoÃ i tÃ²a Ã¡n',
                    'Khiáº¿u náº¡i hÃ nh chÃ­nh',
                    'Thi hÃ nh báº£n Ã¡n vÃ  phÃ¡n quyáº¿t',
                    'BÃ o chá»¯a hÃ¬nh sá»± kinh táº¿',
                ],
                'order' => 4,
            ],
            [
                'name' => 'Sá»Ÿ Há»¯u TrÃ­ Tuá»‡ & CÃ´ng Nghá»‡',
                'slug' => 'so-huu-tri-tue',
                'tag'  => 'IP & Tech',
                'desc' => 'Báº£o vá»‡ tÃ i sáº£n vÃ´ hÃ¬nh cá»§a doanh nghiá»‡p â€” tá»« nhÃ£n hiá»‡u, báº±ng sÃ¡ng cháº¿ Ä‘áº¿n báº£n quyá»n pháº§n má»m vÃ  dá»¯ liá»‡u.',
                'items' => [
                    'ÄÄƒng kÃ½ nhÃ£n hiá»‡u vÃ  thÆ°Æ¡ng hiá»‡u',
                    'Báº£o há»™ báº£n quyá»n vÃ  sÃ¡ng cháº¿',
                    'Há»£p Ä‘á»“ng li-xÄƒng vÃ  chuyá»ƒn nhÆ°á»£ng',
                    'Tranh cháº¥p xÃ¢m pháº¡m quyá»n SHTT',
                    'Báº£o vá»‡ dá»¯ liá»‡u cÃ¡ nhÃ¢n (PDPA)',
                    'Há»£p Ä‘á»“ng pháº§n má»m vÃ  SaaS',
                ],
                'order' => 5,
            ],
            [
                'name' => 'TÆ° Váº¥n CÃ¡ NhÃ¢n & Gia ÄÃ¬nh',
                'slug' => 'tu-van-ca-nhan-gia-dinh',
                'tag'  => 'Family Law',
                'desc' => 'Há»— trá»£ phÃ¡p lÃ½ cÃ¡ nhÃ¢n trong cÃ¡c váº¥n Ä‘á» hÃ´n nhÃ¢n gia Ä‘Ã¬nh, thá»«a káº¿ vÃ  cÃ¡c giao dá»‹ch dÃ¢n sá»± quan trá»ng.',
                'items' => [
                    'Ly hÃ´n vÃ  phÃ¢n chia tÃ i sáº£n',
                    'Quyá»n nuÃ´i con vÃ  cáº¥p dÆ°á»¡ng',
                    'Di chÃºc, thá»«a káº¿ vÃ  phÃ¢n chia di sáº£n',
                    'Nháº­n nuÃ´i con nuÃ´i trong vÃ  ngoÃ i nÆ°á»›c',
                    'HÃ´n nhÃ¢n cÃ³ yáº¿u tá»‘ nÆ°á»›c ngoÃ i',
                    'TÆ° váº¥n á»§y quyá»n vÃ  cÃ´ng chá»©ng',
                ],
                'order' => 6,
            ],
        ];

        foreach ($services as $s) {
            $id = $this->execute(
                "INSERT INTO services (name, slug, tag, description, sort_order) VALUES (?, ?, ?, ?, ?)",
                [$s['name'], $s['slug'], $s['tag'], $s['desc'], $s['order']]
            );
            foreach ($s['items'] as $i => $item) {
                $this->execute(
                    "INSERT INTO service_items (service_id, item, sort_order) VALUES (?, ?, ?)",
                    [$id, $item, $i + 1]
                );
            }
        }
    }

    private function seedLawyers(): void {
        if ($this->scalar("SELECT COUNT(*) FROM lawyers") > 0) return;
        $lawyers = [
            [
                'name'      => 'Luáº­t sÆ° Nguyá»…n VÄƒn Minh',
                'role'      => 'TrÆ°á»Ÿng VÄƒn PhÃ²ng & Luáº­t SÆ° SÃ¡ng Láº­p',
                'bio'       => 'CÃ³ hÆ¡n 18 nÄƒm kinh nghiá»‡m trong lÄ©nh vá»±c luáº­t doanh nghiá»‡p vÃ  M&A. Tá»«ng Ä‘áº¡i diá»‡n cho nhiá»u táº­p Ä‘oÃ n lá»›n trong vÃ  ngoÃ i nÆ°á»›c trong cÃ¡c thÆ°Æ¡ng vá»¥ mua bÃ¡n sÃ¡p nháº­p cÃ³ giÃ¡ trá»‹ hÃ ng nghÃ¬n tá»· Ä‘á»“ng. Tá»‘t nghiá»‡p Tháº¡c sÄ© Luáº­t, cÃ³ chá»©ng chá»‰ hÃ nh nghá» luáº­t sÆ° Viá»‡t Nam vÃ  chá»©ng chá»‰ trá»ng tÃ i viÃªn quá»‘c táº¿.',
                'spec'      => 'ChuyÃªn sÃ¢u luáº­t doanh nghiá»‡p & M&A Â· HÆ¡n 18 nÄƒm kinh nghiá»‡m',
                'avatar'    => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop',
                'tags'      => 'Luáº­t Doanh Nghiá»‡p,M&A,Trá»ng TÃ i Quá»‘c Táº¿,Äáº§u TÆ° NÆ°á»›c NgoÃ i',
                'partner'   => 1,
                'order'     => 1,
            ],
            [
                'name'      => 'Luáº­t sÆ° Tráº§n Thá»‹ BÃ­ch',
                'role'      => 'PhÃ³ TrÆ°á»Ÿng VÄƒn PhÃ²ng & TrÆ°á»Ÿng Bá»™ Pháº­n Tranh Tá»¥ng',
                'bio'       => 'ChuyÃªn gia hÃ ng Ä‘áº§u trong lÄ©nh vá»±c tranh tá»¥ng dÃ¢n sá»± vÃ  thÆ°Æ¡ng máº¡i vá»›i 14 nÄƒm kinh nghiá»‡m. Tá»· lá»‡ tháº¯ng kiá»‡n cÃ¡ nhÃ¢n Ä‘áº¡t trÃªn 96%. Tá»«ng lÃ  Tháº©m PhÃ¡n táº­p sá»± trÆ°á»›c khi chuyá»ƒn sang hÃ nh nghá» luáº­t sÆ°.',
                'spec'      => 'ChuyÃªn sÃ¢u tranh tá»¥ng dÃ¢n sá»± & thÆ°Æ¡ng máº¡i Â· 14 nÄƒm kinh nghiá»‡m',
                'avatar'    => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80&auto=format&fit=crop',
                'tags'      => 'Tranh Tá»¥ng DÃ¢n Sá»±,ThÆ°Æ¡ng Máº¡i,HÃ¬nh Sá»± Kinh Táº¿,PhÃºc Tháº©m',
                'partner'   => 1,
                'order'     => 2,
            ],
            [
                'name'      => 'Luáº­t sÆ° LÃª Minh CÆ°á»ng',
                'role'      => 'Luáº­t SÆ° ThÃ nh ViÃªn Cáº¥p Cao',
                'bio'       => 'ChuyÃªn sÃ¢u luáº­t lao Ä‘á»™ng vÃ  báº¥t Ä‘á»™ng sáº£n vá»›i 10 nÄƒm kinh nghiá»‡m thá»±c chiáº¿n.',
                'spec'      => 'Luáº­t Lao Äá»™ng & Báº¥t Äá»™ng Sáº£n Â· 10 nÄƒm kinh nghiá»‡m',
                'avatar'    => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80&auto=format&fit=crop',
                'tags'      => 'Luáº­t Lao Äá»™ng,Báº¥t Äá»™ng Sáº£n',
                'partner'   => 0,
                'order'     => 3,
            ],
            [
                'name'      => 'Luáº­t sÆ° Nguyá»…n Thá»‹ Dung',
                'role'      => 'Luáº­t SÆ° ThÃ nh ViÃªn',
                'bio'       => 'ChuyÃªn sÃ¢u sá»Ÿ há»¯u trÃ­ tuá»‡ vÃ  cÃ´ng nghá»‡ vá»›i 8 nÄƒm kinh nghiá»‡m.',
                'spec'      => 'Sá»Ÿ Há»¯u TrÃ­ Tuá»‡ & CÃ´ng Nghá»‡ Â· 8 nÄƒm kinh nghiá»‡m',
                'avatar'    => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80&auto=format&fit=crop',
                'tags'      => 'Sá»Ÿ Há»¯u TrÃ­ Tuá»‡,CÃ´ng Nghá»‡',
                'partner'   => 0,
                'order'     => 4,
            ],
            [
                'name'      => 'Luáº­t sÆ° Pháº¡m Quang Äá»©c',
                'role'      => 'Luáº­t SÆ° ThÃ nh ViÃªn',
                'bio'       => 'ChuyÃªn sÃ¢u luáº­t doanh nghiá»‡p vÃ  há»£p Ä‘á»“ng vá»›i 7 nÄƒm kinh nghiá»‡m.',
                'spec'      => 'Luáº­t Doanh Nghiá»‡p & Há»£p Äá»“ng Â· 7 nÄƒm kinh nghiá»‡m',
                'avatar'    => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&auto=format&fit=crop',
                'tags'      => 'Luáº­t Doanh Nghiá»‡p,Há»£p Äá»“ng',
                'partner'   => 0,
                'order'     => 5,
            ],
            [
                'name'      => 'Luáº­t sÆ° VÅ© Thá»‹ Hoa',
                'role'      => 'Luáº­t SÆ° ThÃ nh ViÃªn',
                'bio'       => 'ChuyÃªn sÃ¢u tranh tá»¥ng vÃ  hÃ²a giáº£i vá»›i 6 nÄƒm kinh nghiá»‡m.',
                'spec'      => 'Tranh Tá»¥ng & HÃ²a Giáº£i Â· 6 nÄƒm kinh nghiá»‡m',
                'avatar'    => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&auto=format&fit=crop',
                'tags'      => 'Tranh Tá»¥ng,HÃ²a Giáº£i',
                'partner'   => 0,
                'order'     => 6,
            ],
        ];

        foreach ($lawyers as $l) {
            $this->execute(
                "INSERT INTO lawyers (name, role, bio, speciality, avatar, tags, is_partner, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [$l['name'], $l['role'], $l['bio'], $l['spec'], $l['avatar'], $l['tags'], $l['partner'], $l['order']]
            );
        }
    }

    private function seedCases(): void {
        if ($this->scalar("SELECT COUNT(*) FROM cases") > 0) return;
        $cases = [
            [
                'title'    => 'ThÆ°Æ¡ng vá»¥ M&A táº­p Ä‘oÃ n bÃ¡n láº» â€” Báº£o vá»‡ quyá»n lá»£i cá»• Ä‘Ã´ng thiá»ƒu sá»‘ trÆ°á»›c thÃ¢u tÃ³m thÃ¹ Ä‘á»‹ch',
                'category' => 'Luáº­t Doanh Nghiá»‡p',
                'summary'  => 'ThÃ¢n chá»§ lÃ  nhÃ³m cá»• Ä‘Ã´ng thiá»ƒu sá»‘ náº¯m giá»¯ 23% cá»• pháº§n cá»§a má»™t táº­p Ä‘oÃ n bÃ¡n láº». TrÆ°á»›c káº¿ hoáº¡ch thÃ¢u tÃ³m Ã©p giÃ¡ tá»« cá»• Ä‘Ã´ng Ä‘a sá»‘, chÃºng tÃ´i Ä‘Ã£ xÃ¢y dá»±ng chiáº¿n lÆ°á»£c phÃ¡p lÃ½ toÃ n diá»‡n báº£o vá»‡ quyá»n lá»£i thÃ¢n chá»§, bao gá»“m yÃªu cáº§u Ä‘á»‹nh giÃ¡ Ä‘á»™c láº­p, cháº·n giao dá»‹ch táº¡i tÃ²a vÃ  Ä‘Ã m phÃ¡n láº¡i giÃ¡ mua cá»• pháº§n.',
                'outcome'  => 'Äáº¡t Ä‘Æ°á»£c má»©c giÃ¡ mua láº¡i cao hÆ¡n 40% so vá»›i Ä‘á» nghá»‹ ban Ä‘áº§u â€” thÃ¢n chá»§ thu vá» thÃªm Ä‘Ã¡ng ká»ƒ so vá»›i phÆ°Æ¡ng Ã¡n gá»‘c.',
                'year'     => 2023,
                'location' => 'TP. Há»“ ChÃ­ Minh',
                'order'    => 1,
            ],
            [
                'title'    => 'Tranh cháº¥p há»£p Ä‘á»“ng xÃ¢y dá»±ng EPC vá»›i nhÃ  tháº§u nÆ°á»›c ngoÃ i â€” Thu há»“i khoáº£n ná»£ Ä‘á»ng',
                'category' => 'Tranh Tá»¥ng',
                'summary'  => 'ThÃ¢n chá»§ lÃ  chá»§ Ä‘áº§u tÆ° dá»± Ã¡n khu cÃ´ng nghiá»‡p bá»‹ nhÃ  tháº§u EPC ngÆ°á»i HÃ n Quá»‘c tá»« chá»‘i thanh toÃ¡n pháº§n giá»¯ láº¡i sau khi hoÃ n cÃ´ng. ChÃºng tÃ´i Ä‘Ã£ Ä‘áº¡i diá»‡n thÃ¢n chá»§ trong toÃ n bá»™ quy trÃ¬nh trá»ng tÃ i VIAC kÃ©o dÃ i 14 thÃ¡ng.',
                'outcome'  => 'PhÃ¡n quyáº¿t trá»ng tÃ i cháº¥p nháº­n toÃ n bá»™ yÃªu cáº§u â€” thu há»“i toÃ n bá»™ gá»‘c cá»™ng lÃ£i suáº¥t vÃ  phÃ­ trá»ng tÃ i do bÃªn thua chá»‹u.',
                'year'     => 2023,
                'location' => 'Trá»ng tÃ i VIAC',
                'order'    => 2,
            ],
            [
                'title'    => 'Tranh cháº¥p quyá»n sá»­ dá»¥ng Ä‘áº¥t nÃ´ng nghiá»‡p 5.000mÂ² â€” Vá»¥ kiá»‡n kÃ©o dÃ i 7 nÄƒm',
                'category' => 'Báº¥t Äá»™ng Sáº£n',
                'summary'  => 'ThÃ¢n chá»§ lÃ  há»™ gia Ä‘Ã¬nh Ä‘Ã£ canh tÃ¡c vÃ  sá»­ dá»¥ng máº£nh Ä‘áº¥t 5.000mÂ² liÃªn tá»¥c nhÆ°ng khÃ´ng cÃ³ giáº¥y tá» phÃ¡p lÃ½ Ä‘áº§y Ä‘á»§. Äá»‘i tÃ¡c tranh cháº¥p cÃ³ báº±ng chá»©ng giáº£ máº¡o vá» quyá»n sá»Ÿ há»¯u. ChÃºng tÃ´i Ä‘Ã£ thu tháº­p hÃ ng chá»¥c chá»©ng cá»© lá»‹ch sá»­ Ä‘á»ƒ xÃ¢y dá»±ng há»“ sÆ¡ bÃ¡c bá» toÃ n bá»™ yÃªu cáº§u Ä‘á»‘i phÆ°Æ¡ng.',
                'outcome'  => 'TÃ²a phÃºc tháº©m xÃ¡c nháº­n quyá»n sá»­ dá»¥ng Ä‘áº¥t thuá»™c vá» thÃ¢n chá»§ â€” buá»™c Ä‘á»‘i phÆ°Æ¡ng bá»“i thÆ°á»ng thiá»‡t háº¡i vÃ  ná»™p pháº¡t do hÃ nh vi gian láº­n chá»©ng cá»©.',
                'year'     => 2022,
                'location' => 'TÃ²a Ã¡n TP.HCM',
                'order'    => 3,
            ],
            [
                'title'    => 'Sa tháº£i trÃ¡i phÃ©p â€” GiÃ¡m Ä‘á»‘c Ä‘iá»u hÃ nh bá»‹ cháº¥m dá»©t há»£p Ä‘á»“ng khÃ´ng cÃ³ lÃ½ do chÃ­nh Ä‘Ã¡ng',
                'category' => 'Luáº­t Lao Äá»™ng',
                'summary'  => 'ThÃ¢n chá»§ lÃ  GiÃ¡m Ä‘á»‘c Ä‘iá»u hÃ nh bá»‹ cháº¥m dá»©t há»£p Ä‘á»“ng lao Ä‘á»™ng Ä‘á»™t ngá»™t sau 8 nÄƒm gáº¯n bÃ³. ChÃºng tÃ´i Ä‘Ã£ chá»©ng minh sá»± vÃ´ lÃ½ cá»§a quyáº¿t Ä‘á»‹nh sa tháº£i vÃ  Ä‘Ã²i láº¡i toÃ n bá»™ quyá»n lá»£i bao gá»“m cá»• pháº§n theo ESOP.',
                'outcome'  => 'TÃ²a buá»™c cÃ´ng ty bá»“i thÆ°á»ng 36 thÃ¡ng lÆ°Æ¡ng, thanh toÃ¡n ESOP Ä‘áº§y Ä‘á»§ vÃ  bá»“i thÆ°á»ng tá»•n tháº¥t uy tÃ­n nghá» nghiá»‡p.',
                'year'     => 2022,
                'location' => 'TÃ²a Lao Äá»™ng TP.HCM',
                'order'    => 4,
            ],
            [
                'title'    => 'BÃ o chá»¯a vá»¥ Ã¡n gian láº­n há»£p Ä‘á»“ng thÆ°Æ¡ng máº¡i â€” VÃ´ tá»™i táº¡i phiÃªn phÃºc tháº©m',
                'category' => 'HÃ¬nh Sá»± Kinh Táº¿',
                'summary'  => 'ThÃ¢n chá»§ bá»‹ truy tá»‘ vá» tá»™i gian láº­n thÆ°Æ¡ng máº¡i dá»±a trÃªn báº±ng chá»©ng tá»« lá»i khai cá»§a má»™t nhÃ¢n chá»©ng duy nháº¥t. ChÃºng tÃ´i Ä‘Ã£ phÃ¢n tÃ­ch toÃ n bá»™ há»“ sÆ¡, phÃ¡t hiá»‡n mÃ¢u thuáº«n nghiÃªm trá»ng trong lá»i khai vÃ  chá»©ng minh thÃ¢n chá»§ khÃ´ng cÃ³ kháº£ nÄƒng thá»±c hiá»‡n hÃ nh vi bá»‹ cÃ¡o buá»™c.',
                'outcome'  => 'TÃ²a phÃºc tháº©m tuyÃªn vÃ´ tá»™i, bÃ£i bá» hoÃ n toÃ n báº£n Ã¡n sÆ¡ tháº©m 5 nÄƒm tÃ¹ â€” thÃ¢n chá»§ Ä‘Æ°á»£c tráº£ tá»± do ngay táº¡i phiÃªn tÃ²a vÃ  nháº­n bá»“i thÆ°á»ng oan sai.',
                'year'     => 2021,
                'location' => 'TÃ²a Ã¡n NhÃ¢n dÃ¢n Cáº¥p Cao',
                'order'    => 5,
            ],
            [
                'title'    => 'Báº£o vá»‡ thÆ°Æ¡ng hiá»‡u trÆ°á»›c hÃ nh vi xÃ¢m pháº¡m nhÃ£n hiá»‡u quy mÃ´ lá»›n â€” Chiáº¿n dá»‹ch phÃ¡p lÃ½ toÃ n diá»‡n',
                'category' => 'Sá»Ÿ Há»¯u TrÃ­ Tuá»‡',
                'summary'  => 'ThÃ¢n chá»§ lÃ  thÆ°Æ¡ng hiá»‡u thá»±c pháº©m Viá»‡t Nam bá»‹ Ä‘á»‘i thá»§ cáº¡nh tranh sao chÃ©p nhÃ£n hiá»‡u, bao bÃ¬ vÃ  tÃªn gá»i má»™t cÃ¡ch cÃ³ há»‡ thá»‘ng táº¡i 12 tá»‰nh thÃ nh. ChÃºng tÃ´i Ä‘Ã£ phá»‘i há»£p vá»›i Cá»¥c SHTT, lá»±c lÆ°á»£ng quáº£n lÃ½ thá»‹ trÆ°á»ng vÃ  tiáº¿n hÃ nh khá»Ÿi kiá»‡n dÃ¢n sá»± táº¡i tÃ²a Ã¡n cÃ¹ng lÃºc.',
                'outcome'  => 'Tá»‹ch thu vÃ  tiÃªu há»§y toÃ n bá»™ hÃ ng giáº£ â€” bá»“i thÆ°á»ng thiá»‡t háº¡i thÆ°Æ¡ng hiá»‡u Ä‘Ã¡ng ká»ƒ. Äá»‘i phÆ°Æ¡ng buá»™c pháº£i Ä‘Ã¬nh chá»‰ kinh doanh vÃ  xin lá»—i cÃ´ng khai.',
                'year'     => 2021,
                'location' => 'Cá»¥c SHTT & TÃ²a Ã¡n',
                'order'    => 6,
            ],
        ];

        foreach ($cases as $c) {
            $this->execute(
                "INSERT INTO cases (title, category, summary, outcome, year, location, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?, ?)",
                [$c['title'], $c['category'], $c['summary'], $c['outcome'], $c['year'], $c['location'], $c['order']]
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $items = [
            [
                'name'    => 'Nguyá»…n VÄƒn HÃ¹ng',
                'title'   => 'GiÃ¡m Ä‘á»‘c Ä‘iá»u hÃ nh, CÃ´ng ty CP ThÆ°Æ¡ng Máº¡i XYZ',
                'content' => 'VÄƒn phÃ²ng Ä‘Ã£ há»— trá»£ chÃºng tÃ´i qua toÃ n bá»™ thÆ°Æ¡ng vá»¥ M&A phá»©c táº¡p kÃ©o dÃ i 18 thÃ¡ng. Sá»± am hiá»ƒu phÃ¡p lÃ½ vÃ  tinh tháº§n trÃ¡ch nhiá»‡m cá»§a Ä‘á»™i ngÅ© thá»±c sá»± Ä‘Ã¡ng trÃ¢n trá»ng.',
                'case'    => 'Vá»¥ M&A',
                'order'   => 1,
            ],
            [
                'name'    => 'LÃª Thá»‹ Mai',
                'title'   => 'Chá»§ doanh nghiá»‡p, CÃ´ng ty TNHH Äá»‹a á»c ABC',
                'content' => 'Luáº­t sÆ° Tráº§n Thá»‹ BÃ­ch Ä‘Ã£ báº£o vá»‡ quyá»n lá»£i cá»§a tÃ´i trong vá»¥ tranh cháº¥p Ä‘áº¥t Ä‘ai tÆ°á»Ÿng chá»«ng khÃ´ng cÃ³ lá»‘i thoÃ¡t. ChuyÃªn mÃ´n xuáº¥t sáº¯c, táº­n tÃ¢m vá»›i tá»«ng chi tiáº¿t nhá» nháº¥t.',
                'case'    => 'Vá»¥ tranh cháº¥p Ä‘áº¥t Ä‘ai',
                'order'   => 2,
            ],
            [
                'name'    => 'Pháº¡m Tuáº¥n Anh',
                'title'   => 'CÃ¡ nhÃ¢n, vá»¥ tranh cháº¥p thÆ°Æ¡ng máº¡i',
                'content' => 'TÃ´i Ä‘Ã£ liÃªn há»‡ nhiá»u vÄƒn phÃ²ng luáº­t nhÆ°ng chá»‰ nÆ¡i nÃ y thá»±c sá»± láº¯ng nghe vÃ  Ä‘Æ°a ra chiáº¿n lÆ°á»£c rÃµ rÃ ng. Káº¿t quáº£ vÆ°á»£t ngoÃ i mong Ä‘á»£i â€” tháº¯ng kiá»‡n á»Ÿ cáº¥p phÃºc tháº©m.',
                'case'    => 'Tranh cháº¥p thÆ°Æ¡ng máº¡i',
                'order'   => 3,
            ],
        ];

        foreach ($items as $t) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, content, case_type, sort_order)
                 VALUES (?, ?, ?, ?, ?)",
                [$t['name'], $t['title'], $t['content'], $t['case'], $t['order']]
            );
        }
    }
}

