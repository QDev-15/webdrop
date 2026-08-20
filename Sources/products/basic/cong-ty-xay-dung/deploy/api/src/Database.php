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
        $this->seedFaqs();
        $this->seedPricingPlans();
        $this->backfillProjectCaseStudy();
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
            ['unsplash_access_key',  'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
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

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $faqs = [
            ['Thời gian thi công một căn nhà ở dân dụng mất bao lâu?', 'Tùy quy mô công trình. Nhà phố 1 trệt 2 lầu thường mất 4–6 tháng, biệt thự lớn hoặc nhà xưởng công nghiệp có thể từ 8–14 tháng. Chúng tôi luôn cam kết mốc tiến độ cụ thể trong hợp đồng trước khi khởi công.'],
            ['Chi phí phát sinh trong quá trình thi công được xử lý như thế nào?', 'Trước khi thi công, chúng tôi lập dự toán chi tiết dựa trên khảo sát thực tế để hạn chế tối đa phát sinh. Nếu có thay đổi ngoài dự toán (do yêu cầu điều chỉnh thiết kế từ chủ nhà, hoặc điều kiện địa chất khác khảo sát ban đầu), chúng tôi báo giá và xin xác nhận bằng văn bản trước khi thực hiện — không tự ý phát sinh chi phí.'],
            ['Công trình được bảo hành trong bao lâu?', 'Phần kết cấu (móng, cột, dầm, sàn) bảo hành tối thiểu 5 năm. Phần hoàn thiện (sơn nước, ốp lát, chống thấm) bảo hành 1–2 năm tùy hạng mục. Điều khoản bảo hành cụ thể được ghi rõ trong hợp đồng thi công.'],
            ['Quy trình giám sát thi công diễn ra như thế nào?', 'Mỗi công trình có kỹ sư giám sát hiện trường theo dõi hàng ngày, kiểm tra vật liệu đầu vào, quy trình đổ bê tông, lắp đặt kết cấu theo đúng bản vẽ. Chủ đầu tư nhận báo cáo tiến độ kèm hình ảnh định kỳ và có thể giám sát trực tiếp bất kỳ lúc nào.'],
            ['Hình thức thanh toán theo giai đoạn cụ thể ra sao?', 'Thông thường chia 4–5 đợt theo mốc nghiệm thu: tạm ứng khi ký hợp đồng, thanh toán khi hoàn thành phần móng, phần thô, phần hoàn thiện và đợt cuối khi bàn giao nghiệm thu. Tỷ lệ mỗi đợt được thống nhất rõ trong hợp đồng.'],
            ['Ai chịu trách nhiệm xin giấy phép xây dựng?', 'Với gói Thiết Kế Kiến Trúc và Thi Công trọn gói, chúng tôi hỗ trợ toàn bộ thủ tục xin cấp phép xây dựng, giải trình kỹ thuật với cơ quan nhà nước. Với khách hàng đã có giấy phép sẵn, chúng tôi tiếp nhận hồ sơ và triển khai thi công ngay.'],
            ['Tôi có thể thay đổi thiết kế trong lúc đang thi công không?', 'Có thể, nhưng nên hạn chế thay đổi sau khi đã đổ móng và dựng khung kết cấu vì ảnh hưởng tiến độ và chi phí. Với các thay đổi về hoàn thiện (gạch, sơn, thiết bị vệ sinh...) hoàn toàn có thể điều chỉnh linh hoạt cho đến trước giai đoạn thi công hạng mục đó.'],
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
                'name' => 'Gói Cơ Bản',
                'price' => 'Từ 3.500.000đ/m²',
                'description' => 'Thi công phần thô, bàn giao để khách tự hoàn thiện.',
                'features' => "Thi công phần thô (móng, cột, dầm, sàn, mái)\nXây tường, trát, láng nền cơ bản\nHệ thống điện âm tường đơn giản\nCấp thoát nước cơ bản\nBàn giao thô để khách tự hoàn thiện",
                'is_featured' => 0, 'cta_text' => 'Nhận báo giá', 'sort_order' => 1,
            ],
            [
                'name' => 'Gói Tiêu Chuẩn',
                'price' => 'Từ 5.800.000đ/m²',
                'description' => 'Hoàn thiện đầy đủ, dọn vào ở được ngay, bảo hành 5 năm.',
                'features' => "Tất cả hạng mục gói Cơ Bản\nHoàn thiện sơn nước, ốp lát gạch tiêu chuẩn\nCửa nhôm kính, cửa nhựa lõi thép\nĐiện, nước đầy đủ theo tiêu chuẩn\nBàn giao hoàn thiện, dọn vào ở được\nBảo hành công trình 5 năm",
                'is_featured' => 1, 'cta_text' => 'Nhận báo giá', 'sort_order' => 2,
            ],
            [
                'name' => 'Gói Cao Cấp',
                'price' => 'Từ 8.500.000đ/m²',
                'description' => 'Vật liệu cao cấp, smart home cơ bản, bảo hành 10 năm.',
                'features' => "Tất cả hạng mục gói Tiêu Chuẩn\nVật liệu cao cấp: gạch nhập, sơn Dulux/Jotun\nCửa nhôm xingfa, cửa gỗ tự nhiên\nThiết kế nội thất theo yêu cầu\nSmart home cơ bản: đèn, điều hòa, camera\nBảo hành công trình 10 năm + bảo trì định kỳ",
                'is_featured' => 0, 'cta_text' => 'Nhận báo giá', 'sort_order' => 3,
            ],
        ];
        foreach ($plans as $pl) {
            $this->execute(
                "INSERT INTO pricing_plans (name, price, description, features, is_featured, cta_text, cta_link, sort_order) VALUES (?, ?, ?, ?, ?, ?, '/lien-he', ?)",
                [$pl['name'], $pl['price'], $pl['description'], $pl['features'], $pl['is_featured'], $pl['cta_text'], $pl['sort_order']]
            );
        }
    }

    // ⚠️ Chạy độc lập với seedProjects() (không có guard COUNT>0) — đảm bảo 2 công trình
    // đã seed từ trước (trước khi có cột case-study) vẫn được điền dữ liệu mẫu cho trang
    // chi tiết /du-an/:slug. Chỉ điền khi investor_name còn NULL — không ghi đè nội dung
    // khách đã tự chỉnh qua admin. Nội dung lấy từ 2 case study tĩnh đã retrofit trước đó
    // tại Sources/templates/web/Companies/cong-ty-xay-dung/du-an-chi-tiet-{1,2}.html, điều
    // chỉnh nhẹ số liệu (diện tích, số tầng, thời gian thi công, chủ đầu tư) cho khớp với
    // dữ liệu đã seed sẵn của đúng 2 slug 'sunrise-tower' và 'biet-thu-verdana' — tránh mâu
    // thuẫn với các cột year_completed/location/area/floors/duration đã có sẵn.
    private function backfillProjectCaseStudy(): void {
        $cases = [
            'sunrise-tower' => [
                'investor_name' => 'Công ty CP Đầu Tư Sunrise Group',
                'project_type_label' => 'Văn phòng cho thuê hạng A 22 tầng',
                'scale_text' => '18.500 m² sàn xây dựng',
                'result_summary' => 'Tiết kiệm 8% chi phí đầu tư',
                'challenge' => "Sunrise Group đã ký hợp đồng cho thuê văn phòng với 3 khách thuê lớn trước cả khi khởi công — đồng nghĩa mọi trễ hạn đều kéo theo thiệt hại tài chính trực tiếp cho chủ đầu tư. Bài toán tiến độ vì vậy trở thành ưu tiên số một, trong khi khu đất thi công tòa nhà 22 tầng lại nằm giữa khu trung tâm Quận 1 đông đúc, mặt bằng tập kết vật tư chỉ rộng chưa đến 200m², không có chỗ cho xe cẩu tháp cỡ lớn hoạt động tự do.\n\nThêm vào đó, ngân sách đầu tư được chủ đầu tư khống chế chặt từ đầu, buộc phương án kết cấu phải vừa đảm bảo an toàn cho công trình cao tầng, vừa tối ưu chi phí móng và vật liệu — đồng thời phải kiểm soát tiếng ồn, bụi thi công nghiêm ngặt để không ảnh hưởng đến khu vực xung quanh trong suốt 18 tháng thi công.",
                'solution' => "Để giải quyết đồng thời bài toán tiến độ, ngân sách và mặt bằng hạn chế, chúng tôi triển khai quy trình thi công theo pha với 4 trọng tâm sau:\n\n- Lập kế hoạch logistics vật tư chi tiết theo khung giờ — phối hợp chính quyền địa phương để hạn chế ảnh hưởng giao thông và tiếng ồn khu trung tâm\n- Áp dụng kết cấu khung thép kết hợp sàn bê tông nhẹ (composite deck) — giảm tải trọng công trình, tối ưu kích thước móng và tiết kiệm chi phí phần thô\n- Giám sát an toàn lao động và độ ồn nghiêm ngặt theo khung giờ quy định — chỉ thi công hạng mục gây ồn lớn trong giờ hành chính\n- Nghiệm thu theo từng tầng, triển khai song song hoàn thiện M&E ngay khi phần thô mỗi tầng đạt chuẩn — rút ngắn đáng kể tổng thời gian bàn giao",
                'gallery_images' => "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80&auto=format&fit=crop\nhttps://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80&auto=format&fit=crop\nhttps://images.unsplash.com/photo-1497366811353-6870744d04b2?w=700&q=80&auto=format&fit=crop",
                'stats' => "18| tháng|Hoàn thành đúng hạn\n18500|m²|Sàn xây dựng\n8|%|Tiết kiệm chi phí đầu tư\n100|%|Nghiệm thu đạt chuẩn lần đầu",
                'testimonial_content' => 'Với hợp đồng cho thuê đã ký sẵn, chậm tiến độ dù chỉ 1 tuần cũng gây thiệt hại lớn cho chúng tôi. Hoàng Gia không chỉ bàn giao đúng hạn mà còn chủ động đề xuất phương án kết cấu giúp tiết kiệm gần 8% ngân sách ban đầu — điều chúng tôi không hề kỳ vọng khi bắt đầu dự án.',
                'testimonial_author' => 'Đại diện Ban Đầu Tư',
                'testimonial_title' => 'Công ty CP Đầu Tư Sunrise Group',
            ],
            'biet-thu-verdana' => [
                'investor_name' => 'Công ty TNHH Đầu Tư Verdana',
                'project_type_label' => 'Khu biệt thự cao cấp 15 căn ven sông',
                'scale_text' => '6.200 m² đất dự án · 3 tầng mỗi căn',
                'result_summary' => 'Bàn giao sớm 3 tuần',
                'challenge' => "Công ty TNHH Đầu Tư Verdana tìm đến chúng tôi với mục tiêu xây dựng một khu biệt thự nghỉ dưỡng ven sông gồm 15 căn theo kiến trúc Châu Âu, kịp bàn giao trước mùa mưa để mở bán đúng kế hoạch tài chính đã cam kết với khách hàng. Yêu cầu đặt ra không đơn giản: toàn bộ khu đất nằm sát bờ sông có nền địa chất yếu, mực nước ngầm cao — nếu xử lý móng không đúng kỹ thuật, các căn biệt thự dễ lún nứt và thấm ẩm về lâu dài, ảnh hưởng trực tiếp đến uy tín chủ đầu tư khi bàn giao cho khách mua.\n\nBên cạnh bài toán kỹ thuật, chủ đầu tư còn đặt mục tiêu rút ngắn tiến độ để kịp mùa cao điểm bất động sản — khoảng 15% thời gian so với tiến độ thi công khu biệt thự thông thường cùng quy mô 15 căn, trong khi vẫn phải đảm bảo chất lượng chống thấm và kết cấu tuyệt đối an toàn cho từng căn.",
                'solution' => "Đội ngũ kỹ sư của chúng tôi triển khai phương án thi công theo 4 bước trọng tâm, ưu tiên xử lý triệt để nền móng trước khi tăng tốc các hạng mục còn lại:\n\n- Khảo sát địa chất chi tiết toàn khu đất và thiết kế phương án móng cọc ép — giải pháp phù hợp với nền đất yếu ven sông, đảm bảo khả năng chịu tải lâu dài cho cả 15 căn\n- Rút ngắn giai đoạn duyệt thiết kế kiến trúc 3D mẫu nhà xuống còn 2 tuần nhờ trao đổi trực tiếp và điều chỉnh nhanh cùng chủ đầu tư\n- Bố trí song song nhiều tổ đội thi công các cụm biệt thự độc lập (kết cấu, điện nước, hoàn thiện) để tối ưu tiến độ toàn dự án mà không ảnh hưởng chất lượng\n- Giám sát nghiêm ngặt khâu chống thấm tầng hầm và móng từng căn — kiểm tra độ kín nước từng lớp trước khi nghiệm thu chuyển bước",
                'gallery_images' => "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=80&auto=format&fit=crop\nhttps://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80&auto=format&fit=crop\nhttps://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80&auto=format&fit=crop",
                'stats' => "100|%|Đúng & vượt tiến độ\n6200|m²|Diện tích đất dự án\n0| sự cố|Thấm sau 1 năm bàn giao\n18| tháng|Thời gian hoàn thành",
                'testimonial_content' => 'Hoàng Gia không chỉ thi công đúng tiến độ mà còn chủ động cảnh báo và xử lý triệt để vấn đề nền đất yếu ngay từ đầu — thứ mà 2 nhà thầu trước đó chúng tôi tư vấn đều bỏ qua. Sau hơn 1 năm bàn giao, toàn bộ 15 căn hoàn toàn không có dấu hiệu thấm hay lún nứt.',
                'testimonial_author' => 'Đại diện Chủ Đầu Tư',
                'testimonial_title' => 'Công ty TNHH Đầu Tư Verdana',
            ],
        ];
        foreach ($cases as $slug => $c) {
            $row = $this->queryOne("SELECT id, investor_name FROM projects WHERE slug=?", [$slug]);
            if (!$row || $row['investor_name'] !== null) continue;
            $this->execute(
                "UPDATE projects SET investor_name=?, project_type_label=?, scale_text=?, result_summary=?, challenge=?, solution=?, gallery_images=?, stats=?, testimonial_content=?, testimonial_author=?, testimonial_title=? WHERE id=?",
                [$c['investor_name'], $c['project_type_label'], $c['scale_text'], $c['result_summary'], $c['challenge'], $c['solution'], $c['gallery_images'], $c['stats'], $c['testimonial_content'], $c['testimonial_author'], $c['testimonial_title'], $row['id']]
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
