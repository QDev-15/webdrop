<?php
declare(strict_types=1);

class Database {
    private \PDO $pdo;
    private static ?Database $instance = null;

    private function __construct() {
        $this->pdo = new \PDO('sqlite:' . DB_FILE);
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
        $this->pdo->exec('PRAGMA journal_mode=WAL');
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->migrate();
    }

    public static function getInstance(): self {
        if (!self::$instance) self::$instance = new self();
        return self::$instance;
    }

    private function migrate(): void {
        $schemaPath = __DIR__ . '/../schema.sql';
        $schema = file_get_contents($schemaPath);
        if ($schema === false) {
            throw new \RuntimeException('schema.sql not found: ' . $schemaPath);
        }
        foreach (array_filter(array_map('trim', explode(';', $schema))) as $stmt) {
            if ($stmt) {
                try { $this->pdo->exec($stmt); } catch (\PDOException $e) { /* ignore IF NOT EXISTS */ }
            }
        }
        $this->seedData();
    }

    private function seedData(): void {
        $this->seedUsers();
        $this->seedSettings();
        $this->seedHeroSlides();
        $this->seedServices();
        $this->seedProjects();
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
            ['site_name',         'Công Ty Xây Dựng Hoàng Gia',      'general'],
            ['site_description',  'Tổng thầu xây dựng uy tín hàng đầu TP.HCM với hơn 18 năm kinh nghiệm và hơn 350 công trình hoàn thành chất lượng cao.', 'general'],
            ['site_logo',         '',                                  'general'],
            ['site_favicon',      '',                                  'general'],
            ['site_email',        'info@hoanggiaxaydung.vn',           'general'],
            ['site_phone',        '0912 345 678',                      'general'],
            ['site_phone_2',      '0938 123 456',                      'general'],
            ['site_address',      '123 Đinh Tiên Hoàng, Phường 3, Quận Bình Thạnh, TP.HCM', 'general'],
            ['working_hours',     'Thứ 2–6: 7:30–17:30 | Thứ 7: 7:30–11:30', 'general'],
            // seo
            ['meta_title',        'Công Ty Xây Dựng Hoàng Gia — Tổng Thầu Uy Tín TP.HCM', 'seo'],
            ['meta_description',  'Tổng thầu xây dựng dân dụng, công nghiệp, thiết kế kiến trúc tại TP.HCM. Hơn 18 năm kinh nghiệm, hơn 350 công trình hoàn thành.', 'seo'],
            ['meta_keywords',     'xây dựng, tổng thầu, thi công, thiết kế kiến trúc, nhà ở, biệt thự, nhà xưởng', 'seo'],
            ['og_image',          '',                                  'seo'],
            ['google_analytics_id', '',                                'seo'],
            // social
            ['social_facebook',   'https://facebook.com/',             'social'],
            ['social_youtube',    '',                                   'social'],
            ['social_instagram',  '',                                   'social'],
            ['social_tiktok',     '',                                   'social'],
            ['social_zalo',       '0912345678',                        'social'],
            ['social_linkedin',   '',                                   'social'],
            // design
            ['primary_color',     '#d84315',                           'design'],
            ['secondary_color',   '#1a1a16',                           'design'],
            // footer
            ['footer_copyright',  '© 2025 Công Ty Xây Dựng Hoàng Gia. Mã số thuế: 0123456789. Tất cả quyền được bảo lưu.', 'footer'],
            ['footer_description', 'Tổng thầu xây dựng uy tín hàng đầu TP.HCM với hơn 18 năm kinh nghiệm.', 'footer'],
            ['footer_show_social', '1',                                'footer'],
            // contact
            ['contact_form_enabled', '1',                              'contact'],
            ['contact_email_receiver', 'info@hoanggiaxaydung.vn',     'contact'],
            ['google_map_embed',  '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125416.30085714786!2d106.62803715!3d10.8230989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292e8d3dd1%3A0xf15f5aad773c112b!2zSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2svn!4v1700000000000" width="100%" height="320" style="border:0;" allowfullscreen="" loading="lazy"></iframe>', 'contact'],
            // smtp
            ['smtp_host',         'smtp.gmail.com',                    'smtp'],
            ['smtp_port',         '587',                               'smtp'],
            ['smtp_user',         '',                                   'smtp'],
            ['smtp_password',     '',                                   'smtp'],
            ['smtp_from_name',    'Công Ty Xây Dựng Hoàng Gia',       'smtp'],
            ['smtp_from_email',   '',                                   'smtp'],
            // system
            ['maintenance_mode',  '0',                                  'system'],
            ['maintenance_message', 'Website đang bảo trì. Vui lòng quay lại sau.', 'system'],
            // about
            ['about_title',       'Kỹ sư giàu kinh nghiệm',           'about'],
            ['about_content',     'Đội ngũ kỹ sư xây dựng, kiến trúc sư và chuyên gia kỹ thuật được đào tạo bài bản, nhiều năm thực chiến trên công trường. Hơn 280 nhân sự chuyên nghiệp, 18 năm kinh nghiệm, 350+ công trình hoàn thành trên 24 tỉnh thành.', 'about'],
            ['about_image',       'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80&auto=format&fit=crop', 'about'],
            // stats
            ['stat_projects',     '350',                               'stats'],
            ['stat_years',        '18',                                 'stats'],
            ['stat_staff',        '280',                               'stats'],
            ['stat_provinces',    '24',                                 'stats'],
            // cloudinary
            ['cloudinary_cloud_name', '',                              'cloudinary'],
            ['cloudinary_api_key',    '',                              'cloudinary'],
            ['cloudinary_api_secret', '',                              'cloudinary'],
            ['cloudinary_folder',     'cong-ty-xay-dung',             'cloudinary'],
            // integrations
            ['unsplash_access_key',  '',                               'integrations'],
        ];
        foreach ($defaults as [$key, $value, $group]) {
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
                'title'       => 'Xây dựng tầm nhìn của bạn.',
                'subtitle'    => 'Công Ty Xây Dựng Hoàng Gia là đơn vị tổng thầu xây dựng uy tín tại TP.HCM, chuyên thi công dân dụng, công nghiệp và thiết kế kiến trúc với đội ngũ kỹ sư kinh nghiệm.',
                'button_text' => 'Nhận báo giá ngay',
                'button_link' => '/lien-he',
                'image'       => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80&auto=format&fit=crop',
                'sort_order'  => 0,
            ],
        ];
        foreach ($slides as $slide) {
            $this->execute(
                "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?)",
                [$slide['title'], $slide['subtitle'], $slide['button_text'], $slide['button_link'], $slide['image'], $slide['sort_order']]
            );
        }
    }

    private function seedServices(): void {
        if ($this->scalar("SELECT COUNT(*) FROM services") > 0) return;
        $services = [
            ['Thi Công Dân Dụng', 'thi-cong-dan-dung', 'Xây dựng nhà ở, biệt thự, chung cư, văn phòng. Thi công trọn gói từ móng đến hoàn thiện nội thất theo đúng bản vẽ thiết kế.', 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80&auto=format&fit=crop', 1, 1],
            ['Thi Công Công Nghiệp', 'thi-cong-cong-nghiep', 'Xây dựng nhà xưởng, kho bãi, khu công nghiệp. Tối ưu hóa không gian sản xuất, đảm bảo tiêu chuẩn kỹ thuật và an toàn lao động.', 'M2 20h20 M4 20V8l8-4 8 4v12 M9 14h6v6H9z', 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80&auto=format&fit=crop', 2, 1],
            ['Thiết Kế Kiến Trúc', 'thiet-ke-kien-truc', 'Tư vấn và thiết kế kiến trúc, kết cấu, nội thất. Triển khai hồ sơ thiết kế đầy đủ theo tiêu chuẩn xây dựng Việt Nam và quốc tế.', 'M2 20h20 M4 20V8l8-4 8 4v12 M9 10h.01M15 10h.01', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80&auto=format&fit=crop', 3, 1],
            ['Tư Vấn Dự Án', 'tu-van-du-an', 'Tư vấn lập dự án đầu tư, thẩm tra thiết kế, giám sát thi công. Hỗ trợ thủ tục pháp lý, cấp phép xây dựng từ A đến Z.', 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop', 4, 1],
            ['Cải Tạo & Sửa Chữa', 'cai-tao-sua-chua', 'Cải tạo và nâng cấp công trình cũ, sửa chữa dân dụng và công nghiệp, nội thất và hoàn thiện theo yêu cầu.', 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&auto=format&fit=crop', 5, 0],
        ];
        foreach ($services as [$name, $slug, $desc, $icon, $image, $sort, $featured]) {
            $this->execute(
                "INSERT INTO services (name, slug, description, icon, image, sort_order, featured) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [$name, $slug, $desc, $icon, $image, $sort, $featured]
            );
        }
    }

    private function seedProjects(): void {
        if ($this->scalar("SELECT COUNT(*) FROM projects") > 0) return;
        $projects = [
            ['Tòa Nhà Văn Phòng Sunrise Tower', 'sunrise-tower', 'thuong-mai', 'Tòa nhà văn phòng hạng A 22 tầng tại trung tâm quận 1, với thiết kế hiện đại và hệ thống thông minh BMS.', 'Quận 1, TP.HCM', '2023', '18.500 m²', '22 tầng', '18 tháng', '85 tỷ', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80&auto=format&fit=crop', 1, 1],
            ['Khu Dân Cư Hoàng Long', 'khu-dan-cu-hoang-long', 'dan-dung', 'Khu dân cư 120 căn nhà phố liên kế, hoàn thiện trọn gói, bàn giao tiêu chuẩn cao cấp.', 'Quận 9, TP.HCM', '2022', '24.000 m²', '4 tầng', '24 tháng', '120 tỷ', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80&auto=format&fit=crop', 1, 2],
            ['Nhà Máy Sản Xuất TechPro', 'nha-may-techpro', 'cong-nghiep', 'Nhà xưởng khung thép tiền chế 5.000m² tại KCN Long Hậu, đáp ứng tiêu chuẩn ISO và PCCC nghiêm ngặt.', 'Long An', '2023', '5.000 m²', '1 tầng', '6 tháng', '22 tỷ', 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80&auto=format&fit=crop', 1, 3],
            ['Biệt Thự Verdana Villas', 'biet-thu-verdana', 'biet-thu', 'Khu biệt thự cao cấp 15 căn ven sông, thiết kế kiến trúc Châu Âu, nội thất cao cấp nhập khẩu.', 'Quận 2, TP.HCM', '2022', '6.200 m²', '3 tầng', '18 tháng', '75 tỷ', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80&auto=format&fit=crop', 1, 4],
            ['TTTM Horizon Plaza', 'horizon-plaza', 'thuong-mai', 'Trung tâm thương mại 8 tầng với 200 gian hàng, khu ẩm thực và giải trí hiện đại.', 'Bình Dương', '2021', '32.000 m²', '8 tầng', '30 tháng', '180 tỷ', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop', 0, 5],
            ['Nhà Phố Phú Mỹ Residence', 'nha-pho-phu-my', 'dan-dung', 'Dự án 80 căn nhà phố liên kế tại khu đô thị Phú Mỹ, hoàn thiện nội thất theo tiêu chuẩn cao.', 'Quận 7, TP.HCM', '2023', '15.200 m²', '5 tầng', '20 tháng', '95 tỷ', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&auto=format&fit=crop', 0, 6],
            ['Kho Vận Logistics Plus', 'kho-van-logistics-plus', 'cong-nghiep', 'Kho bãi logistics 10.000m² với hệ thống dây chuyền tự động, phòng lạnh và hệ thống PCCC hiện đại.', 'Đồng Nai', '2022', '10.000 m²', '1 tầng', '8 tháng', '35 tỷ', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80&auto=format&fit=crop', 0, 7],
            ['Resort Villa Đà Lạt', 'resort-villa-da-lat', 'biet-thu', 'Khu nghỉ dưỡng 8 biệt thự cao cấp giữa rừng thông Đà Lạt, thiết kế hòa hợp với thiên nhiên.', 'Đà Lạt, Lâm Đồng', '2023', '4.800 m²', '2 tầng', '14 tháng', '48 tỷ', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80&auto=format&fit=crop', 0, 8],
            ['Chung Cư Minh Phát Tower', 'chung-cu-minh-phat', 'dan-dung', 'Tòa chung cư 25 tầng, 300 căn hộ, với tiện ích đầy đủ: hồ bơi, gym, sân chơi trẻ em.', 'Thủ Đức, TP.HCM', '2021', '28.000 m²', '25 tầng', '36 tháng', '280 tỷ', 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80&auto=format&fit=crop', 0, 9],
        ];
        foreach ($projects as [$name, $slug, $category, $description, $location, $year, $area, $floors, $duration, $value, $image, $featured, $sort]) {
            $this->execute(
                "INSERT INTO projects (name, slug, category, description, location, year_completed, area, floors, duration, value, image, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [$name, $slug, $category, $description, $location, $year, $area, $floors, $duration, $value, $image, $featured, $sort]
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $testimonials = [
            ['Nguyễn Văn Hùng', 'Giám đốc, Công Ty TNHH TechPro VN', '', 'Chúng tôi đã giao phó toàn bộ hạng mục thi công nhà xưởng 5.000m² cho Hoàng Gia. Kết quả vượt mong đợi — tiến độ đúng hẹn, chất lượng bê tông đạt chuẩn, an toàn lao động được đảm bảo tuyệt đối.', 5, 1],
            ['Trần Thị Minh', 'Chủ đầu tư biệt thự Verdana', '', 'Căn biệt thự của gia đình tôi được thi công bởi Hoàng Gia. Từ khâu thiết kế đến hoàn thiện, đội ngũ rất chuyên nghiệp, lắng nghe ý kiến và giải thích kỹ càng từng phần kỹ thuật.', 5, 2],
            ['Hoàng Đức Thắng', 'Trưởng phòng Dự án, Horizon Group', '', 'Tôi đã tham khảo 5 đơn vị thi công và chọn Hoàng Gia vì sự minh bạch trong báo giá và cam kết bảo hành. Sau khi bàn giao, mọi vấn đề nhỏ đều được xử lý nhanh chóng và không tính phí.', 5, 3],
        ];
        foreach ($testimonials as [$name, $title, $avatar, $content, $rating, $sort]) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                [$name, $title, $avatar, $content, $rating, $sort]
            );
        }
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
        return $row ?: null;
    }

    public function execute(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (int)$this->pdo->lastInsertId();
    }

    public function scalar(string $sql, array $params = []): mixed {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch(\PDO::FETCH_NUM);
        return $row ? $row[0] : null;
    }
}
