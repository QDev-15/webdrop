<?php
declare(strict_types=1);

class Database
{
    private static ?Database $instance = null;
    private PDO $pdo;

    private function __construct()
    {
        if (DB_TYPE === 'sqlite') {
            $dir = dirname(DB_FILE);
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
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

    // ── Query helpers ──────────────────────────────────────

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

    // ── Schema migration ───────────────────────────────────

    private function migrate(): void
    {
        $schema = file_get_contents(__DIR__ . '/../schema.sql');
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

    // ── Seed default data — lấy từ nội dung template HTML ──

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
            ['Administrator', 'admin@congtyxaydung.vn', password_hash('Admin@2026', PASSWORD_DEFAULT), 'superadmin']
        );
    }

    private function seedSettings(): void
    {
        $count = $this->scalar("SELECT COUNT(*) FROM settings");
        if ($count > 0) return;

        $defaults = [
            // ── general ───────────────────────────────────────
            ['site_name',        'Công Ty Xây Dựng',                  'general'],
            ['site_tagline',     'Tổng Thầu Xây Dựng Uy Tín',         'general'],
            ['site_description', 'Tổng thầu xây dựng uy tín hàng đầu tại Hồ Chí Minh với hơn 18 năm kinh nghiệm và hơn 350 công trình hoàn thành chất lượng cao.', 'general'],
            ['site_logo',        '',                                   'general'],
            ['site_favicon',     '',                                   'general'],
            ['site_email',       'info@congtyxaydung.vn',             'general'],
            ['site_phone',       '0912 345 678',                      'general'],
            ['site_phone_2',     '',                                   'general'],
            ['site_address',     '123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh', 'general'],
            ['working_hours',    'Thứ 2 – Thứ 6: 7:30–17:30 | Thứ 7: 7:30–11:30', 'general'],
            ['site_city',        'Hồ Chí Minh',                       'general'],
            ['site_mst',         '0123456789',                         'general'],
            ['site_zalo',        '0912345678',                         'general'],

            // ── hero — nội dung section hero trang chủ ────────
            ['hero_badge',      'Tổng Thầu Xây Dựng · Uy Tín Hơn 18 Năm', 'hero'],
            ['hero_line1',      'Xây dựng',                           'hero'],
            ['hero_line2',      'tầm nhìn',                           'hero'],
            ['hero_line3',      'của bạn.',                           'hero'],
            ['hero_sub',        'Tổng thầu xây dựng uy tín tại TP. Hồ Chí Minh, chuyên thi công dân dụng, công nghiệp và thiết kế kiến trúc với đội ngũ kỹ sư kinh nghiệm, đảm bảo chất lượng và tiến độ.', 'hero'],
            ['hero_image',      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80&auto=format&fit=crop', 'hero'],
            ['hero_btn1_text',  'Nhận báo giá ngay',                  'hero'],
            ['hero_btn2_text',  'Xem dự án',                          'hero'],

            // ── stats — thống kê trang chủ ────────────────────
            ['stat1_num',    '350',               'stats'],
            ['stat1_suffix', '+',                 'stats'],
            ['stat1_label',  'Công trình hoàn thành', 'stats'],
            ['stat2_num',    '18',                'stats'],
            ['stat2_suffix', '+',                 'stats'],
            ['stat2_label',  'Năm kinh nghiệm',  'stats'],
            ['stat3_num',    '280',               'stats'],
            ['stat3_suffix', '+',                 'stats'],
            ['stat3_label',  'Nhân sự chuyên nghiệp', 'stats'],
            ['stat4_num',    '24',                'stats'],
            ['stat4_suffix', '',                  'stats'],
            ['stat4_label',  'Tỉnh thành hoạt động', 'stats'],

            // ── about — năng lực đội ngũ ──────────────────────
            ['about_team_title',     'Kỹ sư giàu kinh nghiệm',       'about'],
            ['about_team_sub',       'Đội ngũ kỹ sư xây dựng, kiến trúc sư và chuyên gia kỹ thuật được đào tạo bài bản, nhiều năm thực chiến trên công trường.', 'about'],
            ['about_team_badge',     '280+ Kỹ sư & Chuyên gia có chứng chỉ hành nghề', 'about'],
            ['about_team_image',     'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80&auto=format&fit=crop', 'about'],
            ['about_equip_title',    'Thiết bị hiện đại',             'about'],
            ['about_equip_sub',      'Đầu tư hệ thống máy móc, thiết bị thi công đồng bộ, hiện đại giúp đảm bảo tiến độ và chất lượng công trình.', 'about'],
            ['about_equip_badge',    'Máy móc đạt tiêu chuẩn ISO, kiểm định định kỳ', 'about'],
            ['about_equip_image',    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&auto=format&fit=crop', 'about'],

            // ── seo ───────────────────────────────────────────
            ['meta_title',       'Công Ty Xây Dựng — Tổng Thầu Uy Tín Tại TP. HCM', 'seo'],
            ['meta_description', 'Tổng thầu xây dựng uy tín hàng đầu tại Hồ Chí Minh với hơn 18 năm kinh nghiệm và 350+ công trình hoàn thành. Nhận báo giá miễn phí trong 24 giờ.', 'seo'],
            ['meta_keywords',    'xây dựng, tổng thầu, thi công dân dụng, thi công công nghiệp, thiết kế kiến trúc, hồ chí minh', 'seo'],
            ['og_image',         '',  'seo'],
            ['google_analytics_id', '', 'seo'],

            // ── social ────────────────────────────────────────
            ['social_facebook',  '', 'social'],
            ['social_youtube',   '', 'social'],
            ['social_instagram', '', 'social'],
            ['social_tiktok',    '', 'social'],
            ['social_zalo',      '', 'social'],
            ['social_linkedin',  '', 'social'],

            // ── footer ────────────────────────────────────────
            ['footer_copyright',    '© 2024 Công Ty Xây Dựng. Mã số thuế: 0123456789. Tất cả quyền được bảo lưu.', 'footer'],
            ['footer_description',  'Tổng thầu xây dựng uy tín hàng đầu Hồ Chí Minh với hơn 18 năm kinh nghiệm và hơn 350 công trình hoàn thành chất lượng cao.', 'footer'],
            ['footer_show_social',  '1', 'footer'],

            // ── contact ───────────────────────────────────────
            ['contact_form_enabled',   '1', 'contact'],
            ['contact_email_receiver', 'info@congtyxaydung.vn', 'contact'],
            ['google_map_embed',       'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125416.30085714786!2d106.62803715!3d10.8230989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292e8d3dd1%3A0xf15f5aad773c112b!2zSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2svn!4v1700000000000', 'contact'],

            // ── smtp ──────────────────────────────────────────
            ['smtp_host',       'smtp.gmail.com', 'smtp'],
            ['smtp_port',       '587',            'smtp'],
            ['smtp_user',       '',               'smtp'],
            ['smtp_password',   '',               'smtp'],
            ['smtp_from_name',  'Công Ty Xây Dựng', 'smtp'],
            ['smtp_from_email', '',               'smtp'],

            // ── system ────────────────────────────────────────
            ['maintenance_mode',    '0', 'system'],
            ['maintenance_message', 'Website đang bảo trì, vui lòng quay lại sau.', 'system'],
            ['custom_css',          '', 'system'],

            // ── design ────────────────────────────────────────
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

        // Dịch vụ từ template HTML: 4 dịch vụ chính + 1 phụ
        $services = [
            [
                'name'        => 'Thi Công Dân Dụng',
                'slug'        => 'thi-cong-dan-dung',
                'number'      => '01',
                'description' => 'Xây dựng nhà ở, biệt thự, chung cư, văn phòng. Thi công trọn gói từ móng đến hoàn thiện nội thất theo đúng bản vẽ thiết kế.',
                'icon_svg'    => '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
                'anchor_id'   => 'dan-dung',
                'image'       => 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80&auto=format&fit=crop',
                'featured'    => 1,
                'sort_order'  => 1,
            ],
            [
                'name'        => 'Thi Công Công Nghiệp',
                'slug'        => 'thi-cong-cong-nghiep',
                'number'      => '02',
                'description' => 'Xây dựng nhà xưởng, kho bãi, khu công nghiệp. Tối ưu hóa không gian sản xuất, đảm bảo tiêu chuẩn kỹ thuật và an toàn lao động.',
                'icon_svg'    => '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>',
                'anchor_id'   => 'cong-nghiep',
                'image'       => 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80&auto=format&fit=crop',
                'featured'    => 1,
                'sort_order'  => 2,
            ],
            [
                'name'        => 'Thiết Kế Kiến Trúc',
                'slug'        => 'thiet-ke-kien-truc',
                'number'      => '03',
                'description' => 'Tư vấn và thiết kế kiến trúc, kết cấu, nội thất. Triển khai hồ sơ thiết kế đầy đủ theo tiêu chuẩn xây dựng Việt Nam và quốc tế.',
                'icon_svg'    => '<path d="M2 20h20"/><path d="M4 20V8l8-4 8 4v12"/><rect x="9" y="14" width="6" height="6"/><path d="M9 10h.01M15 10h.01"/>',
                'anchor_id'   => 'kien-truc',
                'image'       => 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80&auto=format&fit=crop',
                'featured'    => 1,
                'sort_order'  => 3,
            ],
            [
                'name'        => 'Tư Vấn Dự Án',
                'slug'        => 'tu-van-du-an',
                'number'      => '04',
                'description' => 'Tư vấn lập dự án đầu tư, thẩm tra thiết kế, giám sát thi công. Hỗ trợ thủ tục pháp lý, cấp phép xây dựng từ A đến Z.',
                'icon_svg'    => '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
                'anchor_id'   => 'tu-van',
                'image'       => 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop',
                'featured'    => 1,
                'sort_order'  => 4,
            ],
            [
                'name'        => 'Cải Tạo & Sửa Chữa',
                'slug'        => 'cai-tao-sua-chua',
                'number'      => '05',
                'description' => 'Cải tạo, nâng cấp các công trình hiện hữu. Sửa chữa kết cấu, hoàn thiện nội thất, nâng cấp hệ thống điện nước theo yêu cầu.',
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

        // Danh mục từ filter bar trong du-an.html
        $cats = [
            ['Dân dụng',   'dan-dung',   1],
            ['Công nghiệp','cong-nghiep', 2],
            ['Biệt thự',   'biet-thu',   3],
            ['Thương mại', 'thuong-mai', 4],
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

        // Dự án mẫu từ template du-an.html
        $projects = [
            [
                'title'      => 'Tòa Nhà Văn Phòng Alpha Tower',
                'slug'       => 'toa-nha-van-phong-alpha-tower',
                'category'   => 'thuong-mai',
                'location'   => 'Quận 1, TP. Hồ Chí Minh',
                'floors'     => '18 tầng',
                'area'       => '12.000 m²',
                'duration'   => '24 tháng',
                'year'       => '2023',
                'description'=> 'Tòa nhà văn phòng cao cấp 18 tầng tại trung tâm Quận 1. Kết cấu khung thép bê tông cốt thép, mặt dựng kính low-e hiện đại. Giá trị hợp đồng 145 tỷ đồng.',
                'image'      => 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80&auto=format&fit=crop',
                'featured'   => 1,
                'sort_order' => 1,
            ],
            [
                'title'      => 'Khu Dân Cư Bình An',
                'slug'       => 'khu-dan-cu-binh-an',
                'category'   => 'dan-dung',
                'location'   => 'Bình Dương',
                'floors'     => '',
                'area'       => '5.200 m²',
                'duration'   => '18 tháng',
                'year'       => '2023',
                'description'=> 'Khu dân cư 120 căn nhà phố liên kế tại Bình Dương. Hệ thống hạ tầng đồng bộ gồm điện, nước, cây xanh và đường nội bộ.',
                'image'      => 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80&auto=format&fit=crop',
                'featured'   => 1,
                'sort_order' => 2,
            ],
            [
                'title'      => 'Nhà Máy Sản Xuất Minh Hưng',
                'slug'       => 'nha-may-san-xuat-minh-hung',
                'category'   => 'cong-nghiep',
                'location'   => 'KCN Minh Hưng, Bình Phước',
                'floors'     => '1 tầng',
                'area'       => '8.500 m²',
                'duration'   => '12 tháng',
                'year'       => '2024',
                'description'=> 'Nhà máy sản xuất linh kiện điện tử 8.500m² trong khu công nghiệp Minh Hưng. Kết cấu khung thép tiền chế, mái tôn cách nhiệt, đạt tiêu chuẩn PCCC và ATVSTP.',
                'image'      => 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80&auto=format&fit=crop',
                'featured'   => 1,
                'sort_order' => 3,
            ],
            [
                'title'      => 'Biệt Thự Vườn Phú Mỹ Hưng',
                'slug'       => 'biet-thu-vuon-phu-my-hung',
                'category'   => 'biet-thu',
                'location'   => 'Quận 7, TP. Hồ Chí Minh',
                'floors'     => '3 tầng',
                'area'       => '420 m²',
                'duration'   => '14 tháng',
                'year'       => '2023',
                'description'=> 'Biệt thự vườn cao cấp 3 tầng tại Phú Mỹ Hưng. Thiết kế hiện đại kết hợp yếu tố nhiệt đới — sân vườn, hồ bơi riêng, nội thất nhập khẩu.',
                'image'      => 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80&auto=format&fit=crop',
                'featured'   => 0,
                'sort_order' => 4,
            ],
            [
                'title'      => 'Trung Tâm Thương Mại Riverside',
                'slug'       => 'trung-tam-thuong-mai-riverside',
                'category'   => 'thuong-mai',
                'location'   => 'Quận 2, TP. Hồ Chí Minh',
                'floors'     => '5 tầng',
                'area'       => '22.000 m²',
                'duration'   => '30 tháng',
                'year'       => '2022',
                'description'=> 'Trung tâm thương mại 5 tầng bên sông Sài Gòn. Diện tích sàn 22.000m², bao gồm khu mua sắm, ẩm thực và văn phòng cho thuê.',
                'image'      => 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop',
                'featured'   => 1,
                'sort_order' => 5,
            ],
            [
                'title'      => 'Nhà Phố Liên Kế Thảo Điền',
                'slug'       => 'nha-pho-lien-ke-thao-dien',
                'category'   => 'dan-dung',
                'location'   => 'TP. Thủ Đức, TP. Hồ Chí Minh',
                'floors'     => '4 tầng',
                'area'       => '',
                'duration'   => '10 tháng',
                'year'       => '2024',
                'description'=> 'Nhà phố liên kế 4 tầng khu Thảo Điền. Thiết kế tối giản hiện đại, tận dụng ánh sáng tự nhiên, hoàn thiện nội thất cao cấp theo yêu cầu chủ đầu tư.',
                'image'      => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&auto=format&fit=crop',
                'featured'   => 0,
                'sort_order' => 6,
            ],
            [
                'title'      => 'Kho Vận Logistics ICD Phước Long',
                'slug'       => 'kho-van-logistics-icd-phuoc-long',
                'category'   => 'cong-nghiep',
                'location'   => 'Quận 9, TP. Hồ Chí Minh',
                'floors'     => '1 tầng',
                'area'       => '15.000 m²',
                'duration'   => '16 tháng',
                'year'       => '2022',
                'description'=> 'Kho vận logistics 15.000m² tích hợp cảng ICD. Hệ thống kho lạnh, kho thường, khu vực văn phòng và sân bãi container tiêu chuẩn quốc tế.',
                'image'      => 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80&auto=format&fit=crop',
                'featured'   => 0,
                'sort_order' => 7,
            ],
            [
                'title'      => 'Resort Villa Nghỉ Dưỡng Long Hải',
                'slug'       => 'resort-villa-nghi-duong-long-hai',
                'category'   => 'biet-thu',
                'location'   => 'Long Hải, Bà Rịa – Vũng Tàu',
                'floors'     => '2 tầng',
                'area'       => '',
                'duration'   => '20 tháng',
                'year'       => '2023',
                'description'=> '18 căn resort villa nghỉ dưỡng ven biển Long Hải. Kiến trúc Bali hiện đại, mỗi villa có hồ bơi riêng, vườn nhiệt đới và tầm nhìn ra biển.',
                'image'      => 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80&auto=format&fit=crop',
                'featured'   => 0,
                'sort_order' => 8,
            ],
            [
                'title'      => 'Chung Cư The Green Tower',
                'slug'       => 'chung-cu-the-green-tower',
                'category'   => 'dan-dung',
                'location'   => 'Bình Thạnh, TP. Hồ Chí Minh',
                'floors'     => '25 tầng / 320 căn',
                'area'       => '18.500 m²',
                'duration'   => '36 tháng',
                'year'       => '2022',
                'description'=> 'Chung cư cao cấp 25 tầng với 320 căn hộ tại Bình Thạnh. Kết cấu bê tông cốt thép hiện đại, đầy đủ tiện ích: hồ bơi, gym, sky garden, bãi giữ xe tầng hầm.',
                'image'      => 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80&auto=format&fit=crop',
                'featured'   => 1,
                'sort_order' => 9,
            ],
        ];

        foreach ($projects as $p) {
            // Lấy category_id từ slug
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

        // Đánh giá từ template index.html — testimonials section
        $testimonials = [
            [
                'author_name'   => 'Nguyễn Văn Minh',
                'author_title'  => 'Giám đốc, Công Ty TNHH Sản Xuất Thiên Phát',
                'author_avatar' => '',
                'content'       => 'Chúng tôi đã giao phó toàn bộ hạng mục thi công nhà xưởng 5.000m² cho công ty. Kết quả vượt mong đợi — tiến độ đúng hẹn, chất lượng bê tông đạt chuẩn, an toàn lao động được đảm bảo tuyệt đối.',
                'rating'        => 5,
                'sort_order'    => 1,
            ],
            [
                'author_name'   => 'Trần Thị Thu Hương',
                'author_title'  => 'Chủ đầu tư, Biệt thự Phú Mỹ Hưng',
                'author_avatar' => '',
                'content'       => 'Căn biệt thự của gia đình tôi được thi công bởi đội ngũ rất chuyên nghiệp. Từ khâu thiết kế đến hoàn thiện, họ lắng nghe ý kiến và giải thích kỹ càng từng phần kỹ thuật.',
                'rating'        => 5,
                'sort_order'    => 2,
            ],
            [
                'author_name'   => 'Phạm Đức Hòa',
                'author_title'  => 'Giám đốc đầu tư, Công ty Địa Ốc Phương Nam',
                'author_avatar' => '',
                'content'       => 'Tôi đã tham khảo 5 đơn vị thi công và chọn họ vì sự minh bạch trong báo giá và cam kết bảo hành. Sau khi bàn giao, mọi vấn đề nhỏ đều được xử lý nhanh chóng và không tính phí.',
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
