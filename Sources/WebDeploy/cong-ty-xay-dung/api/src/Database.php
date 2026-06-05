<?php
declare(strict_types=1);

class Database
{
    private static ?Database $instance = null;
    private PDO $pdo;

    private function __construct()
    {
        if (DB_TYPE === 'sqlite') {
            if (!extension_loaded('pdo_sqlite')) {
                throw new \RuntimeException('pdo_sqlite extension is not enabled. Please enable it in your PHP configuration.');
            }
            $dir = dirname(DB_FILE);
            if (!is_dir($dir)) {
                if (!@mkdir($dir, 0755, true) && !is_dir($dir)) {
                    throw new \RuntimeException('Cannot create database directory: ' . $dir . '. Please set write permissions (chmod 755).');
                }
            }
            if (!is_writable($dir)) {
                throw new \RuntimeException('Database directory is not writable: ' . $dir . '. Please set write permissions (chmod 755).');
            }
            $this->pdo = new PDO('sqlite:' . DB_FILE);
            $this->pdo->exec('PRAGMA foreign_keys = ON');
            $this->pdo->exec('PRAGMA journal_mode = WAL');
            $this->pdo->exec('PRAGMA synchronous = NORMAL');
        } else {
            $dsn = DB_TYPE . ':host=' . DB_HOST . ';port=' . DB_PORT
                 . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS);
        }

        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        $this->migrate();
    }

    public static function getInstance(): Database
    {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    // â”€â”€ Query helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    public function query(string $sql, array $params = []): array
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function row(string $sql, array $params = []): ?array
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    public function scalar(string $sql, array $params = [])
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch(PDO::FETCH_NUM);
        return $row ? $row[0] : null;
    }

    public function execute(string $sql, array $params = [])
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $this->pdo->lastInsertId();
    }

    public function beginTransaction(): void { $this->pdo->beginTransaction(); }
    public function commit(): void           { $this->pdo->commit(); }
    public function rollback(): void         { $this->pdo->rollBack(); }

    // â”€â”€ Schema migration â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    private function migrate(): void
    {
        $schemaPath = realpath(__DIR__ . '/../schema.sql');
        if ($schemaPath === false || !file_exists($schemaPath)) {
            throw new \RuntimeException('schema.sql not found at: ' . __DIR__ . '/../schema.sql');
        }
        $schema = file_get_contents($schemaPath);
        if ($schema === false) {
            throw new \RuntimeException('Cannot read schema.sql');
        }
        $statements = array_filter(
            array_map('trim', explode(';', $schema)),
            fn($s) => $s !== ''
        );
        foreach ($statements as $stmt) {
            try {
                $this->pdo->exec($stmt);
            } catch (PDOException $e) {
                if (strpos($e->getMessage(), 'already exists') === false) {
                    throw $e;
                }
            }
        }

        $this->seedDefaultData();
    }

    // â”€â”€ Seed default data â€” láº¥y tá»« ná»™i dung template HTML â”€â”€

    private function seedDefaultData(): void
    {
        $this->seedAdmin();
        $this->seedSettings();
        $this->seedServices();
        $this->seedProjectCategories();
        $this->seedProjects();
        $this->seedTestimonials();
    }

    private function seedAdmin(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM users");
        if ($count > 0) return;

        $this->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['sysadmin', 'sysadmin@admin.com', password_hash('123456', PASSWORD_BCRYPT), 'superadmin']
        );
    }

    private function seedSettings(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM settings");
        if ($count > 0) return;

        $defaults = [
            // â”€â”€ general â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            ['site_name',        'CÃ´ng Ty XÃ¢y Dá»±ng',                  'general'],
            ['site_tagline',     'Tá»•ng Tháº§u XÃ¢y Dá»±ng Uy TÃ­n',         'general'],
            ['site_description', 'Tá»•ng tháº§u xÃ¢y dá»±ng uy tÃ­n hÃ ng Ä‘áº§u táº¡i Há»“ ChÃ­ Minh vá»›i hÆ¡n 18 nÄƒm kinh nghiá»‡m vÃ  hÆ¡n 350 cÃ´ng trÃ¬nh hoÃ n thÃ nh cháº¥t lÆ°á»£ng cao.', 'general'],
            ['site_logo',        '',                                   'general'],
            ['site_favicon',     '',                                   'general'],
            ['site_email',       'info@congtyxaydung.vn',             'general'],
            ['site_phone',       '0912 345 678',                      'general'],
            ['site_phone_2',     '',                                   'general'],
            ['site_address',     '123 Nguyá»…n VÄƒn Linh, Quáº­n 7, TP. Há»“ ChÃ­ Minh', 'general'],
            ['working_hours',    'Thá»© 2 â€“ Thá»© 6: 7:30â€“17:30 | Thá»© 7: 7:30â€“11:30', 'general'],
            ['site_city',        'Há»“ ChÃ­ Minh',                       'general'],
            ['site_mst',         '0123456789',                         'general'],
            ['site_zalo',        '0912345678',                         'general'],

            // â”€â”€ hero â€” ná»™i dung section hero trang chá»§ â”€â”€â”€â”€â”€â”€â”€â”€
            ['hero_badge',      'Tá»•ng Tháº§u XÃ¢y Dá»±ng Â· Uy TÃ­n HÆ¡n 18 NÄƒm', 'hero'],
            ['hero_line1',      'XÃ¢y dá»±ng',                           'hero'],
            ['hero_line2',      'táº§m nhÃ¬n',                           'hero'],
            ['hero_line3',      'cá»§a báº¡n.',                           'hero'],
            ['hero_sub',        'Tá»•ng tháº§u xÃ¢y dá»±ng uy tÃ­n táº¡i TP. Há»“ ChÃ­ Minh, chuyÃªn thi cÃ´ng dÃ¢n dá»¥ng, cÃ´ng nghiá»‡p vÃ  thiáº¿t káº¿ kiáº¿n trÃºc vá»›i Ä‘á»™i ngÅ© ká»¹ sÆ° kinh nghiá»‡m, Ä‘áº£m báº£o cháº¥t lÆ°á»£ng vÃ  tiáº¿n Ä‘á»™.', 'hero'],
            ['hero_image',      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80&auto=format&fit=crop', 'hero'],
            ['hero_btn1_text',  'Nháº­n bÃ¡o giÃ¡ ngay',                  'hero'],
            ['hero_btn2_text',  'Xem dá»± Ã¡n',                          'hero'],

            // â”€â”€ stats â€” thá»‘ng kÃª trang chá»§ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            ['stat1_num',    '350',               'stats'],
            ['stat1_suffix', '+',                 'stats'],
            ['stat1_label',  'CÃ´ng trÃ¬nh hoÃ n thÃ nh', 'stats'],
            ['stat2_num',    '18',                'stats'],
            ['stat2_suffix', '+',                 'stats'],
            ['stat2_label',  'NÄƒm kinh nghiá»‡m',  'stats'],
            ['stat3_num',    '280',               'stats'],
            ['stat3_suffix', '+',                 'stats'],
            ['stat3_label',  'NhÃ¢n sá»± chuyÃªn nghiá»‡p', 'stats'],
            ['stat4_num',    '24',                'stats'],
            ['stat4_suffix', '',                  'stats'],
            ['stat4_label',  'Tá»‰nh thÃ nh hoáº¡t Ä‘á»™ng', 'stats'],

            // â”€â”€ about â€” nÄƒng lá»±c Ä‘á»™i ngÅ© â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            ['about_team_title',     'Ká»¹ sÆ° giÃ u kinh nghiá»‡m',       'about'],
            ['about_team_sub',       'Äá»™i ngÅ© ká»¹ sÆ° xÃ¢y dá»±ng, kiáº¿n trÃºc sÆ° vÃ  chuyÃªn gia ká»¹ thuáº­t Ä‘Æ°á»£c Ä‘Ã o táº¡o bÃ i báº£n, nhiá»u nÄƒm thá»±c chiáº¿n trÃªn cÃ´ng trÆ°á»ng.', 'about'],
            ['about_team_badge',     '280+ Ká»¹ sÆ° & ChuyÃªn gia cÃ³ chá»©ng chá»‰ hÃ nh nghá»', 'about'],
            ['about_team_image',     'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80&auto=format&fit=crop', 'about'],
            ['about_equip_title',    'Thiáº¿t bá»‹ hiá»‡n Ä‘áº¡i',             'about'],
            ['about_equip_sub',      'Äáº§u tÆ° há»‡ thá»‘ng mÃ¡y mÃ³c, thiáº¿t bá»‹ thi cÃ´ng Ä‘á»“ng bá»™, hiá»‡n Ä‘áº¡i giÃºp Ä‘áº£m báº£o tiáº¿n Ä‘á»™ vÃ  cháº¥t lÆ°á»£ng cÃ´ng trÃ¬nh.', 'about'],
            ['about_equip_badge',    'MÃ¡y mÃ³c Ä‘áº¡t tiÃªu chuáº©n ISO, kiá»ƒm Ä‘á»‹nh Ä‘á»‹nh ká»³', 'about'],
            ['about_equip_image',    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&auto=format&fit=crop', 'about'],

            // â”€â”€ seo â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            ['meta_title',       'CÃ´ng Ty XÃ¢y Dá»±ng â€” Tá»•ng Tháº§u Uy TÃ­n Táº¡i TP. HCM', 'seo'],
            ['meta_description', 'Tá»•ng tháº§u xÃ¢y dá»±ng uy tÃ­n hÃ ng Ä‘áº§u táº¡i Há»“ ChÃ­ Minh vá»›i hÆ¡n 18 nÄƒm kinh nghiá»‡m vÃ  350+ cÃ´ng trÃ¬nh hoÃ n thÃ nh. Nháº­n bÃ¡o giÃ¡ miá»…n phÃ­ trong 24 giá».', 'seo'],
            ['meta_keywords',    'xÃ¢y dá»±ng, tá»•ng tháº§u, thi cÃ´ng dÃ¢n dá»¥ng, thi cÃ´ng cÃ´ng nghiá»‡p, thiáº¿t káº¿ kiáº¿n trÃºc, há»“ chÃ­ minh', 'seo'],
            ['og_image',         '',  'seo'],
            ['google_analytics_id', '', 'seo'],

            // â”€â”€ social â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            ['social_facebook',  '', 'social'],
            ['social_youtube',   '', 'social'],
            ['social_instagram', '', 'social'],
            ['social_tiktok',    '', 'social'],
            ['social_zalo',      '', 'social'],
            ['social_linkedin',  '', 'social'],

            // â”€â”€ footer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            ['footer_copyright',    'Â© 2024 CÃ´ng Ty XÃ¢y Dá»±ng. MÃ£ sá»‘ thuáº¿: 0123456789. Táº¥t cáº£ quyá»n Ä‘Æ°á»£c báº£o lÆ°u.', 'footer'],
            ['footer_description',  'Tá»•ng tháº§u xÃ¢y dá»±ng uy tÃ­n hÃ ng Ä‘áº§u Há»“ ChÃ­ Minh vá»›i hÆ¡n 18 nÄƒm kinh nghiá»‡m vÃ  hÆ¡n 350 cÃ´ng trÃ¬nh hoÃ n thÃ nh cháº¥t lÆ°á»£ng cao.', 'footer'],
            ['footer_show_social',  '1', 'footer'],

            // â”€â”€ contact â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            ['contact_form_enabled',   '1', 'contact'],
            ['contact_email_receiver', 'info@congtyxaydung.vn', 'contact'],
            ['google_map_embed',       'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125416.30085714786!2d106.62803715!3d10.8230989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292e8d3dd1%3A0xf15f5aad773c112b!2zSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2svn!4v1700000000000', 'contact'],

            // â”€â”€ smtp â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            ['smtp_host',       'smtp.gmail.com', 'smtp'],
            ['smtp_port',       '587',            'smtp'],
            ['smtp_user',       '',               'smtp'],
            ['smtp_password',   '',               'smtp'],
            ['smtp_from_name',  'CÃ´ng Ty XÃ¢y Dá»±ng', 'smtp'],
            ['smtp_from_email', '',               'smtp'],

            // â”€â”€ system â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            ['maintenance_mode',    '0', 'system'],
            ['maintenance_message', 'Website Ä‘ang báº£o trÃ¬, vui lÃ²ng quay láº¡i sau.', 'system'],
            ['custom_css',          '', 'system'],

            // â”€â”€ design â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            ['primary_color',   '#d84315', 'design'],
            ['secondary_color', '#bf360c', 'design'],
        ];

        foreach ($defaults as [$key, $value, $group]) {
            $this->execute(
                "INSERT OR IGNORE INTO settings (key, value, \"group\") VALUES (?, ?, ?)",
                [$key, $value, $group]
            );
        }
    }

    private function seedServices(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM services");
        if ($count > 0) return;

        // Dá»‹ch vá»¥ tá»« template HTML: 4 dá»‹ch vá»¥ chÃ­nh + 1 phá»¥
        $services = [
            [
                'name'        => 'Thi CÃ´ng DÃ¢n Dá»¥ng',
                'slug'        => 'thi-cong-dan-dung',
                'number'      => '01',
                'description' => 'XÃ¢y dá»±ng nhÃ  á»Ÿ, biá»‡t thá»±, chung cÆ°, vÄƒn phÃ²ng. Thi cÃ´ng trá»n gÃ³i tá»« mÃ³ng Ä‘áº¿n hoÃ n thiá»‡n ná»™i tháº¥t theo Ä‘Ãºng báº£n váº½ thiáº¿t káº¿.',
                'icon_svg'    => '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
                'anchor_id'   => 'dan-dung',
                'image'       => 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80&auto=format&fit=crop',
                'featured'    => 1,
                'sort_order'  => 1,
            ],
            [
                'name'        => 'Thi CÃ´ng CÃ´ng Nghiá»‡p',
                'slug'        => 'thi-cong-cong-nghiep',
                'number'      => '02',
                'description' => 'XÃ¢y dá»±ng nhÃ  xÆ°á»Ÿng, kho bÃ£i, khu cÃ´ng nghiá»‡p. Tá»‘i Æ°u hÃ³a khÃ´ng gian sáº£n xuáº¥t, Ä‘áº£m báº£o tiÃªu chuáº©n ká»¹ thuáº­t vÃ  an toÃ n lao Ä‘á»™ng.',
                'icon_svg'    => '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>',
                'anchor_id'   => 'cong-nghiep',
                'image'       => 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80&auto=format&fit=crop',
                'featured'    => 1,
                'sort_order'  => 2,
            ],
            [
                'name'        => 'Thiáº¿t Káº¿ Kiáº¿n TrÃºc',
                'slug'        => 'thiet-ke-kien-truc',
                'number'      => '03',
                'description' => 'TÆ° váº¥n vÃ  thiáº¿t káº¿ kiáº¿n trÃºc, káº¿t cáº¥u, ná»™i tháº¥t. Triá»ƒn khai há»“ sÆ¡ thiáº¿t káº¿ Ä‘áº§y Ä‘á»§ theo tiÃªu chuáº©n xÃ¢y dá»±ng Viá»‡t Nam vÃ  quá»‘c táº¿.',
                'icon_svg'    => '<path d="M2 20h20"/><path d="M4 20V8l8-4 8 4v12"/><rect x="9" y="14" width="6" height="6"/><path d="M9 10h.01M15 10h.01"/>',
                'anchor_id'   => 'kien-truc',
                'image'       => 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80&auto=format&fit=crop',
                'featured'    => 1,
                'sort_order'  => 3,
            ],
            [
                'name'        => 'TÆ° Váº¥n Dá»± Ãn',
                'slug'        => 'tu-van-du-an',
                'number'      => '04',
                'description' => 'TÆ° váº¥n láº­p dá»± Ã¡n Ä‘áº§u tÆ°, tháº©m tra thiáº¿t káº¿, giÃ¡m sÃ¡t thi cÃ´ng. Há»— trá»£ thá»§ tá»¥c phÃ¡p lÃ½, cáº¥p phÃ©p xÃ¢y dá»±ng tá»« A Ä‘áº¿n Z.',
                'icon_svg'    => '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
                'anchor_id'   => 'tu-van',
                'image'       => 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop',
                'featured'    => 1,
                'sort_order'  => 4,
            ],
            [
                'name'        => 'Cáº£i Táº¡o & Sá»­a Chá»¯a',
                'slug'        => 'cai-tao-sua-chua',
                'number'      => '05',
                'description' => 'Cáº£i táº¡o, nÃ¢ng cáº¥p cÃ¡c cÃ´ng trÃ¬nh hiá»‡n há»¯u. Sá»­a chá»¯a káº¿t cáº¥u, hoÃ n thiá»‡n ná»™i tháº¥t, nÃ¢ng cáº¥p há»‡ thá»‘ng Ä‘iá»‡n nÆ°á»›c theo yÃªu cáº§u.',
                'icon_svg'    => '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>',
                'anchor_id'   => '',
                'image'       => '',
                'featured'    => 0,
                'sort_order'  => 5,
            ],
        ];

        foreach ($services as $s) {
            $this->execute(
                "INSERT INTO services (name, slug, number, description, icon_svg, anchor_id, image, featured, sort_order, status)
                 VALUES (?,?,?,?,?,?,?,?,?,'published')",
                [$s['name'], $s['slug'], $s['number'], $s['description'], $s['icon_svg'], $s['anchor_id'], $s['image'], $s['featured'], $s['sort_order']]
            );
        }
    }

    private function seedProjectCategories(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM project_categories");
        if ($count > 0) return;

        // Danh má»¥c tá»« filter bar trong du-an.html
        $cats = [
            ['DÃ¢n dá»¥ng',   'dan-dung',   1],
            ['CÃ´ng nghiá»‡p','cong-nghiep', 2],
            ['Biá»‡t thá»±',   'biet-thu',   3],
            ['ThÆ°Æ¡ng máº¡i', 'thuong-mai', 4],
        ];
        foreach ($cats as [$name, $slug, $order]) {
            $this->execute(
                "INSERT INTO project_categories (name, slug, sort_order) VALUES (?,?,?)",
                [$name, $slug, $order]
            );
        }
    }

    private function seedProjects(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM projects");
        if ($count > 0) return;

        // Dá»± Ã¡n máº«u tá»« template du-an.html
        $projects = [
            [
                'title'      => 'TÃ²a NhÃ  VÄƒn PhÃ²ng Alpha Tower',
                'slug'       => 'toa-nha-van-phong-alpha-tower',
                'category'   => 'thuong-mai',
                'location'   => 'Quáº­n 1, TP. Há»“ ChÃ­ Minh',
                'floors'     => '18 táº§ng',
                'area'       => '12.000 mÂ²',
                'duration'   => '24 thÃ¡ng',
                'year'       => '2023',
                'description'=> 'TÃ²a nhÃ  vÄƒn phÃ²ng cao cáº¥p 18 táº§ng táº¡i trung tÃ¢m Quáº­n 1. Káº¿t cáº¥u khung thÃ©p bÃª tÃ´ng cá»‘t thÃ©p, máº·t dá»±ng kÃ­nh low-e hiá»‡n Ä‘áº¡i. GiÃ¡ trá»‹ há»£p Ä‘á»“ng 145 tá»· Ä‘á»“ng.',
                'image'      => 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80&auto=format&fit=crop',
                'featured'   => 1,
                'sort_order' => 1,
            ],
            [
                'title'      => 'Khu DÃ¢n CÆ° BÃ¬nh An',
                'slug'       => 'khu-dan-cu-binh-an',
                'category'   => 'dan-dung',
                'location'   => 'BÃ¬nh DÆ°Æ¡ng',
                'floors'     => '',
                'area'       => '5.200 mÂ²',
                'duration'   => '18 thÃ¡ng',
                'year'       => '2023',
                'description'=> 'Khu dÃ¢n cÆ° 120 cÄƒn nhÃ  phá»‘ liÃªn káº¿ táº¡i BÃ¬nh DÆ°Æ¡ng. Há»‡ thá»‘ng háº¡ táº§ng Ä‘á»“ng bá»™ gá»“m Ä‘iá»‡n, nÆ°á»›c, cÃ¢y xanh vÃ  Ä‘Æ°á»ng ná»™i bá»™.',
                'image'      => 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80&auto=format&fit=crop',
                'featured'   => 1,
                'sort_order' => 2,
            ],
            [
                'title'      => 'NhÃ  MÃ¡y Sáº£n Xuáº¥t Minh HÆ°ng',
                'slug'       => 'nha-may-san-xuat-minh-hung',
                'category'   => 'cong-nghiep',
                'location'   => 'KCN Minh HÆ°ng, BÃ¬nh PhÆ°á»›c',
                'floors'     => '1 táº§ng',
                'area'       => '8.500 mÂ²',
                'duration'   => '12 thÃ¡ng',
                'year'       => '2024',
                'description'=> 'NhÃ  mÃ¡y sáº£n xuáº¥t linh kiá»‡n Ä‘iá»‡n tá»­ 8.500mÂ² trong khu cÃ´ng nghiá»‡p Minh HÆ°ng. Káº¿t cáº¥u khung thÃ©p tiá»n cháº¿, mÃ¡i tÃ´n cÃ¡ch nhiá»‡t, Ä‘áº¡t tiÃªu chuáº©n PCCC vÃ  ATVSTP.',
                'image'      => 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80&auto=format&fit=crop',
                'featured'   => 1,
                'sort_order' => 3,
            ],
            [
                'title'      => 'Biá»‡t Thá»± VÆ°á»n PhÃº Má»¹ HÆ°ng',
                'slug'       => 'biet-thu-vuon-phu-my-hung',
                'category'   => 'biet-thu',
                'location'   => 'Quáº­n 7, TP. Há»“ ChÃ­ Minh',
                'floors'     => '3 táº§ng',
                'area'       => '420 mÂ²',
                'duration'   => '14 thÃ¡ng',
                'year'       => '2023',
                'description'=> 'Biá»‡t thá»± vÆ°á»n cao cáº¥p 3 táº§ng táº¡i PhÃº Má»¹ HÆ°ng. Thiáº¿t káº¿ hiá»‡n Ä‘áº¡i káº¿t há»£p yáº¿u tá»‘ nhiá»‡t Ä‘á»›i â€” sÃ¢n vÆ°á»n, há»“ bÆ¡i riÃªng, ná»™i tháº¥t nháº­p kháº©u.',
                'image'      => 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80&auto=format&fit=crop',
                'featured'   => 0,
                'sort_order' => 4,
            ],
            [
                'title'      => 'Trung TÃ¢m ThÆ°Æ¡ng Máº¡i Riverside',
                'slug'       => 'trung-tam-thuong-mai-riverside',
                'category'   => 'thuong-mai',
                'location'   => 'Quáº­n 2, TP. Há»“ ChÃ­ Minh',
                'floors'     => '5 táº§ng',
                'area'       => '22.000 mÂ²',
                'duration'   => '30 thÃ¡ng',
                'year'       => '2022',
                'description'=> 'Trung tÃ¢m thÆ°Æ¡ng máº¡i 5 táº§ng bÃªn sÃ´ng SÃ i GÃ²n. Diá»‡n tÃ­ch sÃ n 22.000mÂ², bao gá»“m khu mua sáº¯m, áº©m thá»±c vÃ  vÄƒn phÃ²ng cho thuÃª.',
                'image'      => 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop',
                'featured'   => 1,
                'sort_order' => 5,
            ],
            [
                'title'      => 'NhÃ  Phá»‘ LiÃªn Káº¿ Tháº£o Äiá»n',
                'slug'       => 'nha-pho-lien-ke-thao-dien',
                'category'   => 'dan-dung',
                'location'   => 'TP. Thá»§ Äá»©c, TP. Há»“ ChÃ­ Minh',
                'floors'     => '4 táº§ng',
                'area'       => '',
                'duration'   => '10 thÃ¡ng',
                'year'       => '2024',
                'description'=> 'NhÃ  phá»‘ liÃªn káº¿ 4 táº§ng khu Tháº£o Äiá»n. Thiáº¿t káº¿ tá»‘i giáº£n hiá»‡n Ä‘áº¡i, táº­n dá»¥ng Ã¡nh sÃ¡ng tá»± nhiÃªn, hoÃ n thiá»‡n ná»™i tháº¥t cao cáº¥p theo yÃªu cáº§u chá»§ Ä‘áº§u tÆ°.',
                'image'      => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&auto=format&fit=crop',
                'featured'   => 0,
                'sort_order' => 6,
            ],
            [
                'title'      => 'Kho Váº­n Logistics ICD PhÆ°á»›c Long',
                'slug'       => 'kho-van-logistics-icd-phuoc-long',
                'category'   => 'cong-nghiep',
                'location'   => 'Quáº­n 9, TP. Há»“ ChÃ­ Minh',
                'floors'     => '1 táº§ng',
                'area'       => '15.000 mÂ²',
                'duration'   => '16 thÃ¡ng',
                'year'       => '2022',
                'description'=> 'Kho váº­n logistics 15.000mÂ² tÃ­ch há»£p cáº£ng ICD. Há»‡ thá»‘ng kho láº¡nh, kho thÆ°á»ng, khu vá»±c vÄƒn phÃ²ng vÃ  sÃ¢n bÃ£i container tiÃªu chuáº©n quá»‘c táº¿.',
                'image'      => 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80&auto=format&fit=crop',
                'featured'   => 0,
                'sort_order' => 7,
            ],
            [
                'title'      => 'Resort Villa Nghá»‰ DÆ°á»¡ng Long Háº£i',
                'slug'       => 'resort-villa-nghi-duong-long-hai',
                'category'   => 'biet-thu',
                'location'   => 'Long Háº£i, BÃ  Rá»‹a â€“ VÅ©ng TÃ u',
                'floors'     => '2 táº§ng',
                'area'       => '',
                'duration'   => '20 thÃ¡ng',
                'year'       => '2023',
                'description'=> '18 cÄƒn resort villa nghá»‰ dÆ°á»¡ng ven biá»ƒn Long Háº£i. Kiáº¿n trÃºc Bali hiá»‡n Ä‘áº¡i, má»—i villa cÃ³ há»“ bÆ¡i riÃªng, vÆ°á»n nhiá»‡t Ä‘á»›i vÃ  táº§m nhÃ¬n ra biá»ƒn.',
                'image'      => 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80&auto=format&fit=crop',
                'featured'   => 0,
                'sort_order' => 8,
            ],
            [
                'title'      => 'Chung CÆ° The Green Tower',
                'slug'       => 'chung-cu-the-green-tower',
                'category'   => 'dan-dung',
                'location'   => 'BÃ¬nh Tháº¡nh, TP. Há»“ ChÃ­ Minh',
                'floors'     => '25 táº§ng / 320 cÄƒn',
                'area'       => '18.500 mÂ²',
                'duration'   => '36 thÃ¡ng',
                'year'       => '2022',
                'description'=> 'Chung cÆ° cao cáº¥p 25 táº§ng vá»›i 320 cÄƒn há»™ táº¡i BÃ¬nh Tháº¡nh. Káº¿t cáº¥u bÃª tÃ´ng cá»‘t thÃ©p hiá»‡n Ä‘áº¡i, Ä‘áº§y Ä‘á»§ tiá»‡n Ã­ch: há»“ bÆ¡i, gym, sky garden, bÃ£i giá»¯ xe táº§ng háº§m.',
                'image'      => 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80&auto=format&fit=crop',
                'featured'   => 1,
                'sort_order' => 9,
            ],
        ];

        foreach ($projects as $p) {
            // Láº¥y category_id tá»« slug
            $cat = $this->row("SELECT id FROM project_categories WHERE slug=?", [$p['category']]);
            $catId = $cat ? $cat['id'] : null;

            $this->execute(
                "INSERT INTO projects (category_id, title, slug, category, location, floors, area, duration, year, description, image, featured, sort_order, status)
                 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,'published')",
                [$catId, $p['title'], $p['slug'], $p['category'], $p['location'], $p['floors'], $p['area'], $p['duration'], $p['year'], $p['description'], $p['image'], $p['featured'], $p['sort_order']]
            );
        }
    }

    private function seedTestimonials(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM testimonials");
        if ($count > 0) return;

        // ÄÃ¡nh giÃ¡ tá»« template index.html â€” testimonials section
        $testimonials = [
            [
                'author_name'   => 'Nguyá»…n VÄƒn Minh',
                'author_title'  => 'GiÃ¡m Ä‘á»‘c, CÃ´ng Ty TNHH Sáº£n Xuáº¥t ThiÃªn PhÃ¡t',
                'author_avatar' => '',
                'content'       => 'ChÃºng tÃ´i Ä‘Ã£ giao phÃ³ toÃ n bá»™ háº¡ng má»¥c thi cÃ´ng nhÃ  xÆ°á»Ÿng 5.000mÂ² cho cÃ´ng ty. Káº¿t quáº£ vÆ°á»£t mong Ä‘á»£i â€” tiáº¿n Ä‘á»™ Ä‘Ãºng háº¹n, cháº¥t lÆ°á»£ng bÃª tÃ´ng Ä‘áº¡t chuáº©n, an toÃ n lao Ä‘á»™ng Ä‘Æ°á»£c Ä‘áº£m báº£o tuyá»‡t Ä‘á»‘i.',
                'rating'        => 5,
                'sort_order'    => 1,
            ],
            [
                'author_name'   => 'Tráº§n Thá»‹ Thu HÆ°Æ¡ng',
                'author_title'  => 'Chá»§ Ä‘áº§u tÆ°, Biá»‡t thá»± PhÃº Má»¹ HÆ°ng',
                'author_avatar' => '',
                'content'       => 'CÄƒn biá»‡t thá»± cá»§a gia Ä‘Ã¬nh tÃ´i Ä‘Æ°á»£c thi cÃ´ng bá»Ÿi Ä‘á»™i ngÅ© ráº¥t chuyÃªn nghiá»‡p. Tá»« khÃ¢u thiáº¿t káº¿ Ä‘áº¿n hoÃ n thiá»‡n, há» láº¯ng nghe Ã½ kiáº¿n vÃ  giáº£i thÃ­ch ká»¹ cÃ ng tá»«ng pháº§n ká»¹ thuáº­t.',
                'rating'        => 5,
                'sort_order'    => 2,
            ],
            [
                'author_name'   => 'Pháº¡m Äá»©c HÃ²a',
                'author_title'  => 'GiÃ¡m Ä‘á»‘c Ä‘áº§u tÆ°, CÃ´ng ty Äá»‹a á»c PhÆ°Æ¡ng Nam',
                'author_avatar' => '',
                'content'       => 'TÃ´i Ä‘Ã£ tham kháº£o 5 Ä‘Æ¡n vá»‹ thi cÃ´ng vÃ  chá»n há» vÃ¬ sá»± minh báº¡ch trong bÃ¡o giÃ¡ vÃ  cam káº¿t báº£o hÃ nh. Sau khi bÃ n giao, má»i váº¥n Ä‘á» nhá» Ä‘á»u Ä‘Æ°á»£c xá»­ lÃ½ nhanh chÃ³ng vÃ  khÃ´ng tÃ­nh phÃ­.',
                'rating'        => 5,
                'sort_order'    => 3,
            ],
        ];

        foreach ($testimonials as $t) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order, status)
                 VALUES (?,?,?,?,?,?,'published')",
                [$t['author_name'], $t['author_title'], $t['author_avatar'], $t['content'], $t['rating'], $t['sort_order']]
            );
        }
    }
}

