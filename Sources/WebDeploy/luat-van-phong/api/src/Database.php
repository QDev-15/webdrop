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
        $this->backfillCaseSlugs();
        $this->seedFaqs();
        $this->seedPricingPlans();
        $this->backfillCaseStudy();
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
            ['site_name',          'Nguyễn & Đồng Nghiệp',              'general'],
            ['site_tagline',       'Văn Phòng Luật Sư',                  'general'],
            ['site_description',   'Văn phòng luật sư uy tín tại TP.HCM — cam kết bảo vệ quyền lợi tối đa cho thân chủ trong mọi lĩnh vực pháp lý.', 'general'],
            ['site_logo',          '',                                    'general'],
            ['site_favicon',       '',                                    'general'],
            ['site_email',         'info@luatvanphong.vn',               'general'],
            ['site_phone',         '0900 000 000',                       'general'],
            ['site_phone_2',       '0800 000 000',                       'general'],
            ['site_address',       'Tầng 12, Tòa nhà Saigon Tower, 29 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', 'general'],
            ['working_hours',      "Thứ Hai – Thứ Sáu: 8:00 – 17:30\nThứ Bảy: 8:00 – 12:00\nChủ Nhật: Theo đặt hẹn", 'general'],
            ['established_year',   '2009',                               'general'],
            // seo
            ['meta_title',         'Nguyễn & Đồng Nghiệp — Tư Vấn Pháp Lý Chuyên Nghiệp', 'seo'],
            ['meta_description',   'Văn phòng luật sư uy tín tại TP.HCM — tư vấn pháp lý, tranh tụng, luật doanh nghiệp, lao động và bất động sản.', 'seo'],
            ['meta_keywords',      'luật sư, tư vấn pháp lý, tranh tụng, luật doanh nghiệp, luật lao động, bất động sản', 'seo'],
            ['og_image',           '',                                    'seo'],
            ['google_analytics_id','',                                    'seo'],
            // social
            ['social_facebook',    '',                                    'social'],
            ['social_linkedin',    '',                                    'social'],
            ['social_zalo',        '',                                    'social'],
            ['social_youtube',     '',                                    'social'],
            // footer
            ['footer_copyright',   '© 2024 Nguyễn & Đồng Nghiệp. Bảo lưu mọi quyền.', 'footer'],
            ['footer_description', 'Văn phòng luật sư uy tín tại TP.HCM — cam kết bảo vệ quyền lợi tối đa cho thân chủ trong mọi lĩnh vực pháp lý.', 'footer'],
            ['footer_show_social', '1',                                   'footer'],
            // contact
            ['contact_form_enabled',    '1',                             'contact'],
            ['contact_email_receiver',  'tuvan@luatvanphong.vn',        'contact'],
            ['google_map_embed',        '',                              'contact'],
            // about / hero
            ['hero_kicker',        'Văn Phòng Luật Sư · Thành Lập 2009', 'about'],
            ['hero_heading',       "Bảo vệ\nquyền lợi\ncủa bạn.",        'about'],
            ['hero_sub',           'Hơn 15 năm kinh nghiệm trong các lĩnh vực luật doanh nghiệp, lao động, bất động sản và tranh tụng. Chúng tôi cam kết bảo vệ quyền lợi tối đa cho thân chủ tại mọi cấp tòa án.', 'about'],
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
            ['smtp_from_name',     'Văn Phòng Luật Sư',                'smtp'],
            ['smtp_from_email',    '',                                   'smtp'],
            // system
            ['maintenance_mode',    '0',                                'system'],
            ['maintenance_message', 'Website đang bảo trì. Vui lòng quay lại sau.', 'system'],
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
                'title'       => 'Bảo vệ quyền lợi của bạn',
                'subtitle'    => 'Hơn 15 năm kinh nghiệm trong luật doanh nghiệp, lao động, bất động sản và tranh tụng.',
                'button_text' => 'Tư Vấn Miễn Phí',
                'button_link' => '/lien-he',
                'image'       => 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1400&q=80&auto=format&fit=crop',
                'sort_order'  => 1,
            ],
            [
                'title'       => 'Chuyên môn sâu, giải pháp toàn diện',
                'subtitle'    => 'Đội ngũ 12 luật sư chuyên sâu trong 6 lĩnh vực pháp lý trọng yếu của nền kinh tế Việt Nam.',
                'button_text' => 'Lĩnh Vực Hành Nghề',
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
                'name' => 'Luật Doanh Nghiệp & M&A',
                'slug' => 'luat-doanh-nghiep-ma',
                'tag'  => 'Corporate & M&A',
                'desc' => 'Hỗ trợ doanh nghiệp trong toàn bộ vòng đời pháp lý — từ thành lập, vận hành đến tái cơ cấu và thâu tóm.',
                'items' => [
                    'Thành lập và tổ chức lại doanh nghiệp',
                    'Tư vấn và soạn thảo hợp đồng thương mại',
                    'Mua bán, sáp nhập, thâu tóm (M&A)',
                    'Tái cơ cấu và giải thể doanh nghiệp',
                    'Quản trị công ty và tuân thủ pháp luật',
                    'Đầu tư nước ngoài và liên doanh',
                ],
                'order' => 1,
            ],
            [
                'name' => 'Luật Lao Động & Quan Hệ Người Sử Dụng',
                'slug' => 'luat-lao-dong',
                'tag'  => 'Labor Law',
                'desc' => 'Bảo vệ toàn diện quyền lợi của người lao động lẫn doanh nghiệp trong các vấn đề lao động phức tạp.',
                'items' => [
                    'Soạn thảo hợp đồng lao động và nội quy',
                    'Tranh chấp lao động và kỷ luật sa thải',
                    'Bảo hiểm xã hội, bảo hiểm thất nghiệp',
                    'Thương lượng tập thể và đình công',
                    'Quấy rối và phân biệt đối xử tại nơi làm việc',
                    'Lao động người nước ngoài',
                ],
                'order' => 2,
            ],
            [
                'name' => 'Luật Bất Động Sản & Xây Dựng',
                'slug' => 'luat-bat-dong-san',
                'tag'  => 'Real Estate',
                'desc' => 'Tư vấn pháp lý toàn diện cho các giao dịch bất động sản và dự án xây dựng, từ thẩm định đến hoàn công.',
                'items' => [
                    'Thẩm định pháp lý dự án bất động sản',
                    'Soạn thảo hợp đồng mua bán, thuê mướn',
                    'Tranh chấp đất đai và quyền sử dụng đất',
                    'Thủ tục cấp phép xây dựng',
                    'Hợp đồng EPC và tổng thầu xây dựng',
                    'Thu hồi đất và bồi thường giải phóng mặt bằng',
                ],
                'order' => 3,
            ],
            [
                'name' => 'Tranh Tụng & Giải Quyết Tranh Chấp',
                'slug' => 'tranh-tung',
                'tag'  => 'Litigation',
                'desc' => 'Đại diện mạnh mẽ cho thân chủ tại tất cả các cấp tòa án, trong mọi loại tranh chấp dân sự và thương mại.',
                'items' => [
                    'Tranh tụng dân sự và thương mại',
                    'Trọng tài thương mại trong nước và quốc tế',
                    'Hòa giải và thương lượng ngoài tòa án',
                    'Khiếu nại hành chính',
                    'Thi hành bản án và phán quyết',
                    'Bào chữa hình sự kinh tế',
                ],
                'order' => 4,
            ],
            [
                'name' => 'Sở Hữu Trí Tuệ & Công Nghệ',
                'slug' => 'so-huu-tri-tue',
                'tag'  => 'IP & Tech',
                'desc' => 'Bảo vệ tài sản vô hình của doanh nghiệp — từ nhãn hiệu, bằng sáng chế đến bản quyền phần mềm và dữ liệu.',
                'items' => [
                    'Đăng ký nhãn hiệu và thương hiệu',
                    'Bảo hộ bản quyền và sáng chế',
                    'Hợp đồng li-xăng và chuyển nhượng',
                    'Tranh chấp xâm phạm quyền SHTT',
                    'Bảo vệ dữ liệu cá nhân (PDPA)',
                    'Hợp đồng phần mềm và SaaS',
                ],
                'order' => 5,
            ],
            [
                'name' => 'Tư Vấn Cá Nhân & Gia Đình',
                'slug' => 'tu-van-ca-nhan-gia-dinh',
                'tag'  => 'Family Law',
                'desc' => 'Hỗ trợ pháp lý cá nhân trong các vấn đề hôn nhân gia đình, thừa kế và các giao dịch dân sự quan trọng.',
                'items' => [
                    'Ly hôn và phân chia tài sản',
                    'Quyền nuôi con và cấp dưỡng',
                    'Di chúc, thừa kế và phân chia di sản',
                    'Nhận nuôi con nuôi trong và ngoài nước',
                    'Hôn nhân có yếu tố nước ngoài',
                    'Tư vấn ủy quyền và công chứng',
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
                'name'      => 'Luật sư Nguyễn Văn Minh',
                'role'      => 'Trưởng Văn Phòng & Luật Sư Sáng Lập',
                'bio'       => 'Có hơn 18 năm kinh nghiệm trong lĩnh vực luật doanh nghiệp và M&A. Từng đại diện cho nhiều tập đoàn lớn trong và ngoài nước trong các thương vụ mua bán sáp nhập có giá trị hàng nghìn tỷ đồng. Tốt nghiệp Thạc sĩ Luật, có chứng chỉ hành nghề luật sư Việt Nam và chứng chỉ trọng tài viên quốc tế.',
                'spec'      => 'Chuyên sâu luật doanh nghiệp & M&A · Hơn 18 năm kinh nghiệm',
                'avatar'    => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop',
                'tags'      => 'Luật Doanh Nghiệp,M&A,Trọng Tài Quốc Tế,Đầu Tư Nước Ngoài',
                'partner'   => 1,
                'order'     => 1,
            ],
            [
                'name'      => 'Luật sư Trần Thị Bích',
                'role'      => 'Phó Trưởng Văn Phòng & Trưởng Bộ Phận Tranh Tụng',
                'bio'       => 'Chuyên gia hàng đầu trong lĩnh vực tranh tụng dân sự và thương mại với 14 năm kinh nghiệm. Tỷ lệ thắng kiện cá nhân đạt trên 96%. Từng là Thẩm Phán tập sự trước khi chuyển sang hành nghề luật sư.',
                'spec'      => 'Chuyên sâu tranh tụng dân sự & thương mại · 14 năm kinh nghiệm',
                'avatar'    => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80&auto=format&fit=crop',
                'tags'      => 'Tranh Tụng Dân Sự,Thương Mại,Hình Sự Kinh Tế,Phúc Thẩm',
                'partner'   => 1,
                'order'     => 2,
            ],
            [
                'name'      => 'Luật sư Lê Minh Cường',
                'role'      => 'Luật Sư Thành Viên Cấp Cao',
                'bio'       => 'Chuyên sâu luật lao động và bất động sản với 10 năm kinh nghiệm thực chiến.',
                'spec'      => 'Luật Lao Động & Bất Động Sản · 10 năm kinh nghiệm',
                'avatar'    => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80&auto=format&fit=crop',
                'tags'      => 'Luật Lao Động,Bất Động Sản',
                'partner'   => 0,
                'order'     => 3,
            ],
            [
                'name'      => 'Luật sư Nguyễn Thị Dung',
                'role'      => 'Luật Sư Thành Viên',
                'bio'       => 'Chuyên sâu sở hữu trí tuệ và công nghệ với 8 năm kinh nghiệm.',
                'spec'      => 'Sở Hữu Trí Tuệ & Công Nghệ · 8 năm kinh nghiệm',
                'avatar'    => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80&auto=format&fit=crop',
                'tags'      => 'Sở Hữu Trí Tuệ,Công Nghệ',
                'partner'   => 0,
                'order'     => 4,
            ],
            [
                'name'      => 'Luật sư Phạm Quang Đức',
                'role'      => 'Luật Sư Thành Viên',
                'bio'       => 'Chuyên sâu luật doanh nghiệp và hợp đồng với 7 năm kinh nghiệm.',
                'spec'      => 'Luật Doanh Nghiệp & Hợp Đồng · 7 năm kinh nghiệm',
                'avatar'    => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&auto=format&fit=crop',
                'tags'      => 'Luật Doanh Nghiệp,Hợp Đồng',
                'partner'   => 0,
                'order'     => 5,
            ],
            [
                'name'      => 'Luật sư Vũ Thị Hoa',
                'role'      => 'Luật Sư Thành Viên',
                'bio'       => 'Chuyên sâu tranh tụng và hòa giải với 6 năm kinh nghiệm.',
                'spec'      => 'Tranh Tụng & Hòa Giải · 6 năm kinh nghiệm',
                'avatar'    => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&auto=format&fit=crop',
                'tags'      => 'Tranh Tụng,Hòa Giải',
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
                'title'    => 'Thương vụ M&A tập đoàn bán lẻ — Bảo vệ quyền lợi cổ đông thiểu số trước thâu tóm thù địch',
                'category' => 'Luật Doanh Nghiệp',
                'summary'  => 'Thân chủ là nhóm cổ đông thiểu số nắm giữ 23% cổ phần của một tập đoàn bán lẻ. Trước kế hoạch thâu tóm ép giá từ cổ đông đa số, chúng tôi đã xây dựng chiến lược pháp lý toàn diện bảo vệ quyền lợi thân chủ, bao gồm yêu cầu định giá độc lập, chặn giao dịch tại tòa và đàm phán lại giá mua cổ phần.',
                'outcome'  => 'Đạt được mức giá mua lại cao hơn 40% so với đề nghị ban đầu — thân chủ thu về thêm đáng kể so với phương án gốc.',
                'year'     => 2023,
                'location' => 'TP. Hồ Chí Minh',
                'order'    => 1,
            ],
            [
                'title'    => 'Tranh chấp hợp đồng xây dựng EPC với nhà thầu nước ngoài — Thu hồi khoản nợ đọng',
                'category' => 'Tranh Tụng',
                'summary'  => 'Thân chủ là chủ đầu tư dự án khu công nghiệp bị nhà thầu EPC người Hàn Quốc từ chối thanh toán phần giữ lại sau khi hoàn công. Chúng tôi đã đại diện thân chủ trong toàn bộ quy trình trọng tài VIAC kéo dài 14 tháng.',
                'outcome'  => 'Phán quyết trọng tài chấp nhận toàn bộ yêu cầu — thu hồi toàn bộ gốc cộng lãi suất và phí trọng tài do bên thua chịu.',
                'year'     => 2023,
                'location' => 'Trọng tài VIAC',
                'order'    => 2,
            ],
            [
                'title'    => 'Tranh chấp quyền sử dụng đất nông nghiệp 5.000m² — Vụ kiện kéo dài 7 năm',
                'category' => 'Bất Động Sản',
                'summary'  => 'Thân chủ là hộ gia đình đã canh tác và sử dụng mảnh đất 5.000m² liên tục nhưng không có giấy tờ pháp lý đầy đủ. Đối tác tranh chấp có bằng chứng giả mạo về quyền sở hữu. Chúng tôi đã thu thập hàng chục chứng cứ lịch sử để xây dựng hồ sơ bác bỏ toàn bộ yêu cầu đối phương.',
                'outcome'  => 'Tòa phúc thẩm xác nhận quyền sử dụng đất thuộc về thân chủ — buộc đối phương bồi thường thiệt hại và nộp phạt do hành vi gian lận chứng cứ.',
                'year'     => 2022,
                'location' => 'Tòa án TP.HCM',
                'order'    => 3,
            ],
            [
                'title'    => 'Sa thải trái phép — Giám đốc điều hành bị chấm dứt hợp đồng không có lý do chính đáng',
                'category' => 'Luật Lao Động',
                'summary'  => 'Thân chủ là Giám đốc điều hành bị chấm dứt hợp đồng lao động đột ngột sau 8 năm gắn bó. Chúng tôi đã chứng minh sự vô lý của quyết định sa thải và đòi lại toàn bộ quyền lợi bao gồm cổ phần theo ESOP.',
                'outcome'  => 'Tòa buộc công ty bồi thường 36 tháng lương, thanh toán ESOP đầy đủ và bồi thường tổn thất uy tín nghề nghiệp.',
                'year'     => 2022,
                'location' => 'Tòa Lao Động TP.HCM',
                'order'    => 4,
            ],
            [
                'title'    => 'Bào chữa vụ án gian lận hợp đồng thương mại — Vô tội tại phiên phúc thẩm',
                'category' => 'Hình Sự Kinh Tế',
                'summary'  => 'Thân chủ bị truy tố về tội gian lận thương mại dựa trên bằng chứng từ lời khai của một nhân chứng duy nhất. Chúng tôi đã phân tích toàn bộ hồ sơ, phát hiện mâu thuẫn nghiêm trọng trong lời khai và chứng minh thân chủ không có khả năng thực hiện hành vi bị cáo buộc.',
                'outcome'  => 'Tòa phúc thẩm tuyên vô tội, bãi bỏ hoàn toàn bản án sơ thẩm 5 năm tù — thân chủ được trả tự do ngay tại phiên tòa và nhận bồi thường oan sai.',
                'year'     => 2021,
                'location' => 'Tòa án Nhân dân Cấp Cao',
                'order'    => 5,
            ],
            [
                'title'    => 'Bảo vệ thương hiệu trước hành vi xâm phạm nhãn hiệu quy mô lớn — Chiến dịch pháp lý toàn diện',
                'category' => 'Sở Hữu Trí Tuệ',
                'summary'  => 'Thân chủ là thương hiệu thực phẩm Việt Nam bị đối thủ cạnh tranh sao chép nhãn hiệu, bao bì và tên gọi một cách có hệ thống tại 12 tỉnh thành. Chúng tôi đã phối hợp với Cục SHTT, lực lượng quản lý thị trường và tiến hành khởi kiện dân sự tại tòa án cùng lúc.',
                'outcome'  => 'Tịch thu và tiêu hủy toàn bộ hàng giả — bồi thường thiệt hại thương hiệu đáng kể. Đối phương buộc phải đình chỉ kinh doanh và xin lỗi công khai.',
                'year'     => 2021,
                'location' => 'Cục SHTT & Tòa án',
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
                'name'    => 'Nguyễn Văn Hùng',
                'title'   => 'Giám đốc điều hành, Công ty CP Thương Mại XYZ',
                'content' => 'Văn phòng đã hỗ trợ chúng tôi qua toàn bộ thương vụ M&A phức tạp kéo dài 18 tháng. Sự am hiểu pháp lý và tinh thần trách nhiệm của đội ngũ thực sự đáng trân trọng.',
                'case'    => 'Vụ M&A',
                'order'   => 1,
            ],
            [
                'name'    => 'Lê Thị Mai',
                'title'   => 'Chủ doanh nghiệp, Công ty TNHH Địa Ốc ABC',
                'content' => 'Luật sư Trần Thị Bích đã bảo vệ quyền lợi của tôi trong vụ tranh chấp đất đai tưởng chừng không có lối thoát. Chuyên môn xuất sắc, tận tâm với từng chi tiết nhỏ nhất.',
                'case'    => 'Vụ tranh chấp đất đai',
                'order'   => 2,
            ],
            [
                'name'    => 'Phạm Tuấn Anh',
                'title'   => 'Cá nhân, vụ tranh chấp thương mại',
                'content' => 'Tôi đã liên hệ nhiều văn phòng luật nhưng chỉ nơi này thực sự lắng nghe và đưa ra chiến lược rõ ràng. Kết quả vượt ngoài mong đợi — thắng kiện ở cấp phúc thẩm.',
                'case'    => 'Tranh chấp thương mại',
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

    // Cột slug được thêm sau khi bảng cases đã tồn tại (ALTER TABLE) — mọi case cũ (kể cả case
    // admin đã tự thêm trước khi có cột này) có slug NULL. Hàm này tự sinh slug từ title cho
    // MỌI case đang thiếu slug, đảm bảo duy nhất (thêm hậu tố -2, -3... nếu trùng) — CHỈ chạy
    // cho case chưa có slug, không đụng slug đã có (kể cả khi admin sửa title sau đó, slug giữ nguyên).
    private function backfillCaseSlugs(): void {
        $rows = $this->query("SELECT id, title FROM cases WHERE slug IS NULL OR slug = ''");
        if (!$rows) return;
        $existing = array_column(
            $this->query("SELECT slug FROM cases WHERE slug IS NOT NULL AND slug != ''"),
            'slug'
        );
        foreach ($rows as $row) {
            $base = slugify($row['title']);
            if ($base === '') $base = 'vu-viec-' . $row['id'];
            $slug = $base;
            $n = 2;
            while (in_array($slug, $existing, true)) {
                $slug = $base . '-' . $n;
                $n++;
            }
            $this->execute("UPDATE cases SET slug=? WHERE id=?", [$slug, $row['id']]);
            $existing[] = $slug;
        }
    }

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $faqs = [
            ['Chi phí thù lao luật sư được tính như thế nào?', 'Tùy vào tính chất vụ việc, chúng tôi áp dụng phí theo giờ, phí trọn gói theo vụ việc, hoặc gói tư vấn thường xuyên hàng tháng. Mức phí cụ thể luôn được thống nhất bằng văn bản trước khi ký hợp đồng dịch vụ — không phát sinh chi phí ẩn.'],
            ['Quy trình làm việc với văn phòng diễn ra như thế nào?', 'Bắt đầu bằng buổi tư vấn ban đầu miễn phí để đánh giá vụ việc, sau đó chúng tôi phân tích hồ sơ và đề xuất chiến lược pháp lý kèm báo giá minh bạch. Khi thân chủ đồng ý, luật sư phụ trách sẽ trực tiếp triển khai và cập nhật tiến độ thường xuyên.'],
            ['Thời gian xử lý một vụ việc thường mất bao lâu?', 'Tùy độ phức tạp — tư vấn hợp đồng đơn giản có thể hoàn thành trong vài ngày, trong khi tranh tụng tại tòa án hoặc trọng tài thường kéo dài từ vài tháng đến hơn một năm. Chúng tôi luôn đưa ra ước tính thời gian cụ thể ngay từ buổi tư vấn đầu tiên.'],
            ['Thông tin và hồ sơ của tôi có được bảo mật tuyệt đối không?', 'Có. Nghĩa vụ bảo mật thông tin thân chủ là nguyên tắc đạo đức nghề nghiệp cao nhất của luật sư theo Luật Luật Sư 2012 — mọi hồ sơ, trao đổi đều được bảo vệ tuyệt đối và chỉ phục vụ cho vụ việc của chính thân chủ.'],
            ['Văn phòng chấp nhận những hình thức thanh toán nào?', 'Chúng tôi nhận thanh toán qua chuyển khoản ngân hàng doanh nghiệp, có xuất hóa đơn VAT đầy đủ. Với vụ việc trọn gói, phí có thể chia thành nhiều đợt theo giai đoạn hoặc milestone đã thống nhất trong hợp đồng.'],
            ['Tôi có được làm việc trực tiếp với luật sư phụ trách vụ việc không?', 'Có — mỗi thân chủ đều có một luật sư phụ trách cố định, trực tiếp trao đổi và chịu trách nhiệm xuyên suốt vụ việc, không chuyển giao qua nhiều người khác nhau. Luật sư phụ trách cam kết phản hồi trong vòng 24 giờ làm việc.'],
            ['Nếu tôi ở tỉnh khác thì có thể sử dụng dịch vụ được không?', 'Được — phần lớn quy trình tư vấn ban đầu và trao đổi hồ sơ có thể thực hiện trực tuyến qua điện thoại, email hoặc video call. Với các phiên tòa hoặc thủ tục yêu cầu có mặt trực tiếp, luật sư sẽ thu xếp lịch trình phù hợp.'],
        ];
        $order = 1;
        foreach ($faqs as [$q, $a]) {
            $this->execute(
                "INSERT INTO faqs (question, answer, page, sort_order) VALUES (?, ?, 'dich-vu', ?)",
                [$q, $a, $order++]
            );
        }
    }

    private function seedPricingPlans(): void {
        if ($this->scalar("SELECT COUNT(*) FROM pricing_plans") > 0) return;
        $plans = [
            [
                'name' => 'Tư Vấn Theo Giờ',
                'price' => 'Từ 800.000đ /giờ',
                'description' => 'Phù hợp cho câu hỏi pháp lý đơn lẻ, rà soát hợp đồng ngắn hoặc nhu cầu tư vấn không thường xuyên.',
                'features' => "Tư vấn trực tiếp hoặc trực tuyến\nRà soát văn bản, hợp đồng đơn giản\nGiải đáp thắc mắc pháp lý theo vụ việc\nKhông ràng buộc hợp đồng dài hạn",
                'is_featured' => 0, 'cta_text' => 'Đặt Lịch Tư Vấn', 'sort_order' => 1,
            ],
            [
                'name' => 'Tư Vấn Thường Xuyên',
                'price' => 'Từ 15.000.000đ /tháng',
                'description' => 'Gói retainer hàng tháng dành cho doanh nghiệp cần hỗ trợ pháp lý liên tục — luật sư riêng theo dõi sát hoạt động kinh doanh.',
                'features' => "Luật sư phụ trách cố định, phản hồi trong 24h\nSoạn thảo & rà soát hợp đồng không giới hạn số lượng\nTư vấn tuân thủ pháp luật định kỳ\nƯu tiên xử lý khi có vụ việc phát sinh\nBáo cáo pháp lý hàng tháng",
                'is_featured' => 1, 'cta_text' => 'Đăng Ký Gói Đồng Hành', 'sort_order' => 2,
            ],
            [
                'name' => 'Xử Lý Vụ Việc Trọn Gói',
                'price' => 'Báo giá theo vụ việc',
                'description' => 'Dành cho tranh tụng, M&A, hoặc vụ việc phức tạp cần chiến lược pháp lý toàn trình từ đầu đến khi có kết quả cuối cùng.',
                'features' => "Khảo sát hồ sơ & xây dựng chiến lược riêng\nĐại diện tố tụng tại mọi cấp tòa án / trọng tài\nĐội ngũ luật sư chuyên trách theo vụ việc\nCập nhật tiến độ thường xuyên, minh bạch\nPhí có thể chia theo giai đoạn/milestone",
                'is_featured' => 0, 'cta_text' => 'Nhận Báo Giá', 'sort_order' => 3,
            ],
        ];
        foreach ($plans as $pl) {
            $this->execute(
                "INSERT INTO pricing_plans (name, price, description, features, is_featured, cta_text, cta_link, sort_order) VALUES (?, ?, ?, ?, ?, ?, '/lien-he', ?)",
                [$pl['name'], $pl['price'], $pl['description'], $pl['features'], $pl['is_featured'], $pl['cta_text'], $pl['sort_order']]
            );
        }
    }

    // ⚠️ Chạy độc lập với seedCases() (không có guard COUNT>0) — đảm bảo 2 vụ việc đã seed từ
    // trước (trước khi có các cột case-study) vẫn được điền dữ liệu mẫu cho trang chi tiết
    // /vu-viec/:slug. Match theo title (không theo slug — slug được sinh runtime bởi
    // backfillCaseSlugs() ở trên nên literal ở đây sẽ không khớp được). Chỉ điền khi challenge
    // còn NULL — không ghi đè nội dung admin đã tự chỉnh qua form. Nội dung lấy từ 2 case study
    // tĩnh tại Sources/templates/web/Companies/luat-van-phong/vu-viec-chi-tiet-{1,2}.html.
    private function backfillCaseStudy(): void {
        $cases = [
            'Thương vụ M&A tập đoàn bán lẻ — Bảo vệ quyền lợi cổ đông thiểu số trước thâu tóm thù địch' => [
                'client_name'     => 'Nhóm cổ đông thiểu số — Doanh nghiệp bán lẻ (giấu tên theo bảo mật nghề nghiệp)',
                'practice_area'   => 'M&A & Quản trị doanh nghiệp',
                'duration_text'   => '5 tháng',
                'scope_text'      => 'Tư vấn chiến lược, đàm phán, tố tụng khẩn cấp',
                'result_headline' => '+40% giá mua lại cổ phần',
                'challenge'       => "Thân chủ là nhóm bốn cổ đông thiểu số nắm giữ tổng cộng 23% cổ phần của một tập đoàn bán lẻ có doanh thu lớn tại khu vực TP.HCM và các tỉnh lân cận. Nhóm cổ đông đa số đã âm thầm lên kế hoạch thâu tóm toàn bộ công ty thông qua một giao dịch chuyển nhượng nội bộ với mức định giá thấp hơn đáng kể so với giá trị thực tế của doanh nghiệp.\n\nThân chủ chỉ phát hiện kế hoạch này khi hồ sơ họp đại hội đồng cổ đông bất thường được gửi đi với thời hạn phản hồi rất ngắn — không đủ thời gian để tự tổ chức định giá độc lập hay tham vấn pháp lý kỹ lưỡng. Nếu giao dịch được thông qua theo đúng lịch trình, nhóm cổ đông thiểu số sẽ mất quyền kiểm soát và buộc phải bán lại cổ phần với mức giá bất lợi, không có cơ chế khiếu nại hiệu quả sau đó.\n\nBài toán đặt ra không chỉ là ngăn chặn giao dịch kịp thời về mặt thời gian, mà còn phải xây dựng đủ căn cứ pháp lý và tài chính để buộc bên thâu tóm phải đàm phán lại ở một mức giá công bằng hơn.",
                'solution'        => "Chúng tôi triển khai song song bốn hướng hành động trong vòng 3 tuần đầu tiên để vừa trì hoãn giao dịch, vừa xây dựng đòn bẩy đàm phán:\n\n- Rà soát pháp lý khẩn cấp — kiểm tra điều lệ công ty, hợp đồng cổ đông và trình tự triệu tập họp để xác định các vi phạm về thủ tục có thể sử dụng làm căn cứ trì hoãn.\n- Yêu cầu định giá độc lập — đề nghị tòa án và cơ quan có thẩm quyền chỉ định đơn vị định giá độc lập, làm cơ sở phản bác mức giá do bên thâu tóm đưa ra.\n- Biện pháp khẩn cấp tạm thời — nộp đơn yêu cầu tòa án áp dụng biện pháp ngăn chặn tạm thời đối với việc thông qua nghị quyết, tạo thời gian đàm phán.\n- Đàm phán song song — trong lúc thủ tục tố tụng diễn ra, trực tiếp đàm phán với bên thâu tóm trên cơ sở dữ liệu định giá độc lập vừa thu thập được.",
                'gallery_images'  => "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80&auto=format&fit=crop\nhttps://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80&auto=format&fit=crop\nhttps://images.unsplash.com/photo-1521791055366-0d553872125f?w=800&q=80&auto=format&fit=crop",
                'stats'           => "40|%|Tăng giá mua lại cổ phần\n5| tháng|Thời gian xử lý toàn bộ vụ việc\n100|%|Quyền biểu quyết được bảo toàn\n3| tuần|Thời gian hành động khẩn cấp ban đầu",
                'testimonial_content' => 'Chúng tôi từng nghĩ mình không có nhiều lựa chọn trước áp lực thời gian. Đội ngũ luật sư không chỉ hành động nhanh mà còn tìm ra đúng đòn bẩy pháp lý để chúng tôi có được vị thế đàm phán công bằng. Kết quả cuối cùng vượt xa những gì chúng tôi kỳ vọng.',
                'testimonial_author'  => 'Đại diện nhóm cổ đông thiểu số',
                'testimonial_title'   => 'Thương vụ M&A tập đoàn bán lẻ — 2023',
            ],
            'Bào chữa vụ án gian lận hợp đồng thương mại — Vô tội tại phiên phúc thẩm' => [
                'client_name'     => 'Doanh nhân bị truy tố (giấu tên theo nguyên tắc bảo mật thân chủ)',
                'practice_area'   => 'Hình sự kinh tế & Tranh tụng',
                'duration_text'   => '11 tháng (điều tra & 2 cấp xét xử)',
                'scope_text'      => 'Bào chữa toàn trình, thu thập chứng cứ, tranh tụng phúc thẩm',
                'result_headline' => 'Tuyên vô tội, bãi bỏ án sơ thẩm 5 năm tù',
                'challenge'       => "Thân chủ là chủ một doanh nghiệp thương mại vừa bị khởi tố về tội gian lận trong hoạt động thương mại, với cáo buộc chính dựa gần như hoàn toàn vào lời khai của một nhân chứng duy nhất — không có tài liệu chứng từ, hóa đơn hay bằng chứng vật chất trực tiếp nào khác đi kèm.\n\nTại phiên tòa sơ thẩm, do thiếu sự phản biện đủ mạnh và toàn diện, tòa đã tuyên thân chủ mức án 5 năm tù giam. Bản án gây ảnh hưởng nghiêm trọng đến uy tín cá nhân, hoạt động kinh doanh và cả gia đình thân chủ. Gia đình tìm đến chúng tôi ngay sau khi có bản án sơ thẩm, với thời hạn kháng cáo phúc thẩm đang gấp rút trôi qua.\n\nThách thức lớn nhất không chỉ là thời gian hạn hẹp, mà còn là việc phải xây dựng lại toàn bộ chiến lược bào chữa từ đầu — bao gồm việc chứng minh những mâu thuẫn trong lời khai nhân chứng duy nhất và khả năng thực tế của thân chủ trong việc thực hiện hành vi bị cáo buộc.",
                'solution'        => "Nhận vụ việc ngay sau bản án sơ thẩm, đội ngũ luật sư tranh tụng của chúng tôi triển khai chiến lược bào chữa toàn trình cho phiên phúc thẩm theo bốn bước:\n\n- Điều tra độc lập lại toàn bộ hồ sơ — rà soát chi tiết biên bản điều tra, cáo trạng và toàn bộ chứng cứ đã được sử dụng ở cấp sơ thẩm.\n- Đối chiếu mâu thuẫn lời khai — phát hiện và hệ thống hóa các điểm mâu thuẫn nghiêm trọng trong lời khai của nhân chứng duy nhất qua các thời điểm khác nhau.\n- Thu thập chứng cứ ngoại phạm — làm việc với chuyên gia giám định độc lập để chứng minh thân chủ không có khả năng thực tế thực hiện hành vi bị cáo buộc trong khung thời gian nêu trong cáo trạng.\n- Chiến lược tranh tụng tại phiên phúc thẩm — xây dựng lập luận pháp lý chặt chẽ, trình bày từng mâu thuẫn một cách có hệ thống trước hội đồng xét xử.",
                'gallery_images'  => "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80&auto=format&fit=crop\nhttps://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=800&q=80&auto=format&fit=crop\nhttps://images.unsplash.com/photo-1423592707957-3b212afa6733?w=800&q=80&auto=format&fit=crop",
                'stats'           => "5| năm|Bản án tù bị bãi bỏ hoàn toàn\n11| tháng|Thời gian xử lý toàn bộ vụ việc\n100|%|Luận điểm bào chữa được chấp thuận\n1||Phán quyết đảo ngược hoàn toàn án sơ thẩm",
                'testimonial_content' => 'Khi nhận bản án sơ thẩm, tôi gần như mất hết hy vọng. Luật sư phụ trách đã dành hàng trăm giờ đọc lại từng trang hồ sơ, tìm ra những điều mà chính tôi cũng không nhận ra. Họ không chỉ bào chữa cho tôi — họ trả lại công bằng cho cả gia đình tôi.',
                'testimonial_author'  => 'Thân chủ vụ án hình sự (giấu tên theo yêu cầu)',
                'testimonial_title'   => 'Vụ án gian lận hợp đồng thương mại — 2021',
            ],
        ];
        foreach ($cases as $title => $c) {
            $row = $this->queryOne("SELECT id, challenge FROM cases WHERE title=?", [$title]);
            if (!$row || $row['challenge'] !== null) continue;
            $this->execute(
                "UPDATE cases SET client_name=?, practice_area=?, duration_text=?, scope_text=?, result_headline=?, challenge=?, solution=?, gallery_images=?, stats=?, testimonial_content=?, testimonial_author=?, testimonial_title=? WHERE id=?",
                [
                    $c['client_name'], $c['practice_area'], $c['duration_text'], $c['scope_text'], $c['result_headline'],
                    $c['challenge'], $c['solution'], $c['gallery_images'], $c['stats'],
                    $c['testimonial_content'], $c['testimonial_author'], $c['testimonial_title'],
                    $row['id'],
                ]
            );
        }
    }
}

