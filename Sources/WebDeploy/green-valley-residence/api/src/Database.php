<?php
declare(strict_types=1);

class Database {
    private \PDO $pdo;
    private static ?Database $instance = null;

    private function __construct() {
        $dbDir = dirname(DB_FILE);
        if (!is_dir($dbDir)) {
            mkdir($dbDir, 0755, true);
        }
        $this->pdo = new \PDO('sqlite:' . DB_FILE);
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->pdo->exec('PRAGMA journal_mode = WAL');
        $this->migrate();
    }

    public static function getInstance(): self {
        if (!self::$instance) {
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
        // Strip comments TRƯỚC khi split — tránh filter loại bỏ CREATE TABLE sau comment block
        $schema = preg_replace('/^\s*--.*$/m', '', $schema);
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
        $this->seedExtensions();
    }

    // ─── Real Estate (Loại hình B — dự án chủ đầu tư đơn lẻ) ─────────────────────
    protected function seedExtensions(): void {
        $this->seedUnitTypes();
        $this->seedAmenities();
        $this->seedNearbyAmenities();
        $this->seedPaymentPhases();
        $this->seedSalesPolicies();
        $this->seedFaqs();
        $this->seedTestimonials();
    }

    private function seedUsers(): void {
        if ($this->scalar("SELECT COUNT(*) FROM users") > 0) return;
        $this->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['Admin', 'sysadmin@admin.com', password_hash('123456', PASSWORD_DEFAULT), 'superadmin']
        );
    }

    private function seedSettings(): void {
        if ($this->scalar("SELECT COUNT(*) FROM settings") > 0) return;
        $settings = [
            // ── Thông tin chung ──
            ['site_name', 'Green Valley Residence', 'general'],
            ['site_tagline', 'Dự án căn hộ ven sông', 'general'],
            ['site_description', 'Green Valley Residence — dự án căn hộ cao cấp ven sông Sài Gòn tại Thảo Điền, TP. Thủ Đức. 632 căn hộ từ 1PN đến Penthouse, sổ hồng lâu dài, bàn giao Quý 4/2027.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'kinhdoanh@greenvalleyresidence.vn', 'general'],
            ['site_phone', '1900 6868', 'general'],
            ['site_phone2', '0909 888 686', 'general'],
            ['site_address', 'Số 88 đường Nguyễn Văn Hưởng, phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh', 'general'],
            ['working_hours', '8:00 - 18:00, tất cả các ngày trong tuần (kể cả T7, CN)', 'general'],

            // ── SEO ──
            ['meta_title', 'Green Valley Residence — Căn hộ cao cấp ven sông Sài Gòn | Thảo Điền, TP. Thủ Đức', 'seo'],
            ['meta_description', 'Green Valley Residence — dự án căn hộ cao cấp ven sông Sài Gòn tại Thảo Điền, TP. Thủ Đức. 632 căn hộ từ 1PN đến Penthouse, sổ hồng lâu dài, bàn giao Quý 4/2027. Chủ đầu tư: Lộc Việt Land.', 'seo'],
            ['meta_keywords', 'green valley residence, căn hộ thảo điền, căn hộ ven sông sài gòn, chung cư thủ đức, lộc việt land', 'seo'],

            // ── Mạng xã hội ──
            ['social_facebook', '', 'social'],
            ['social_linkedin', '', 'social'],
            ['social_youtube', '', 'social'],
            ['zalo_phone', '0909888686', 'social'],

            // ── Footer ──
            ['footer_copyright', '© 2026 Green Valley Residence — Phát triển bởi Tập đoàn Lộc Việt Land. All rights reserved.', 'footer'],
            ['footer_description', 'Dự án căn hộ cao cấp ven sông Sài Gòn tại Thảo Điền, TP. Thủ Đức — phát triển bởi Tập đoàn Lộc Việt Land.', 'footer'],

            // ── Liên hệ ──
            ['contact_map_lat', '10.8046', 'contact'],
            ['contact_map_lng', '106.7350', 'contact'],
            ['sales_office_name', 'Phòng Kinh doanh dự án Green Valley Residence', 'contact'],
            ['sales_agent_avatar', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80', 'contact'],

            // ── Dự án (ngành cụ thể — Bất động sản) ──
            ['developer_name', 'Tập đoàn Lộc Việt Land', 'project'],
            ['developer_founded', '2009', 'project'],
            ['developer_projects_delivered', '14', 'project'],
            ['developer_units_delivered', '9800', 'project'],
            ['developer_bio', 'Thành lập từ năm 2009, Lộc Việt Land là chủ đầu tư bất động sản với gần 17 năm kinh nghiệm phát triển các dự án căn hộ và khu đô thị tại TP.HCM và các tỉnh lân cận. Green Valley Residence là dự án thứ 15 của tập đoàn, kế thừa toàn bộ kinh nghiệm thiết kế, thi công và vận hành từ 14 dự án đã bàn giao trước đó.', 'project'],
            ['developer_experience_years', '17', 'project'],
            ['project_location', 'Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh', 'project'],
            ['tower1_name', 'Tháp Aqua', 'project'],
            ['tower1_floors', '35', 'project'],
            ['tower1_units', '316', 'project'],
            ['tower2_name', 'Tháp Terra', 'project'],
            ['tower2_floors', '35', 'project'],
            ['tower2_units', '316', 'project'],
            ['total_units', '632', 'project'],
            ['site_area', '18500', 'project'],
            ['density', '32', 'project'],
            ['legal_status', 'Sổ hồng lâu dài — đã có Giấy phép xây dựng số 118/GPXD-TĐ, đang triển khai thi công phần thân', 'project'],
            ['progress_percent', '55', 'project'],
            ['progress_label', 'Đang thi công tầng 18/35 — Tháp Aqua', 'project'],
            ['progress_updated', '15/08/2026', 'project'],
            ['handover', 'Quý 4/2027', 'project'],
            ['groundbreaking', 'Quý 2/2024', 'project'],
            ['management_fee', '18000', 'project'],
            ['bank_partners', 'Vietcombank, Techcombank, BIDV', 'project'],
            ['loan_support_percent', '70', 'project'],
            ['loan_grace_months', '24', 'project'],

            // ── Nội dung mô tả (đoạn văn dài, hiển thị trên trang chủ + tổng quan dự án) ──
            ['content_home_about', 'Tọa lạc tại phường Thảo Điền — khu vực an cư cao cấp bậc nhất TP. Thủ Đức, Green Valley Residence sở hữu mặt tiền sông Sài Gòn cùng hệ thống tiện ích nội khu chuẩn 5 sao, kết nối thuận tiện tới trung tâm Quận 1 chỉ 15 phút di chuyển.', 'content'],
            ['content_home_location_feature', 'Mặt tiền đường Nguyễn Văn Hưởng, liền kề sông Sài Gòn, gần ga Metro số 1.', 'content'],
            ['content_home_progress', 'Cập nhật ngày 15/08/2026: Tháp Aqua đã hoàn thành phần móng, tầng hầm và đang thi công phần thân tầng 18/35. Dự kiến cất nóc Quý 2/2027, bàn giao căn hộ Quý 4/2027.', 'content'],
            ['content_about_location', 'Số 88 đường Nguyễn Văn Hưởng, phường Thảo Điền, TP. Thủ Đức — khu vực an cư cao cấp bậc nhất, kết nối trực tiếp Quận 1 chỉ 15 phút, thuận tiện tới các tiện ích ngoại khu hàng đầu khu Đông TP.HCM.', 'content'],
            ['content_about_progress', 'Tháp Aqua đã hoàn thành phần móng và 2 tầng hầm, hiện đang thi công phần thân tầng 18/35. Tháp Terra đang triển khai song song, chậm hơn Tháp Aqua khoảng 4 tầng. Dự kiến cất nóc cả 2 tháp vào Quý 2/2027.', 'content'],
            ['content_about_intro', 'Từ vị trí đắt giá ven sông Sài Gòn đến năng lực triển khai của Tập đoàn Lộc Việt Land — minh bạch mọi thông tin để khách hàng an tâm quyết định.', 'content'],
            ['content_amenities_intro', 'Trong bán kính 2km quanh Green Valley Residence đã có đầy đủ trường học quốc tế, bệnh viện, trung tâm thương mại và ga Metro — không cần di chuyển xa để tiếp cận các tiện ích thiết yếu.', 'content'],

            // ── SMTP ──
            ['smtp_host', 'smtp.gmail.com', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from_name', 'Green Valley Residence', 'smtp'],
            ['smtp_from_email', '', 'smtp'],

            // ── Nâng cao ──
            ['ga_id', '', 'system'],
            ['custom_scripts', '', 'system'],

            // ── Cloudinary ──
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key', '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            ['cloudinary_folder', 'green-valley-residence', 'cloudinary'],

            // ── Tích hợp ──
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];
        foreach ($settings as [$key, $value, $group]) {
            $this->execute(
                "INSERT OR IGNORE INTO settings (key, value, grp) VALUES (?, ?, ?)",
                [$key, $value, $group]
            );
        }
    }

    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        $slides = [
            [
                'title' => 'Sống xanh bên dòng sông Sài Gòn',
                'subtitle' => 'Green Valley Residence — 632 căn hộ cao cấp tại Thảo Điền, TP. Thủ Đức. Sổ hồng lâu dài, view sông trực diện, bàn giao Quý 4/2027.',
                'button_text' => 'Xem bảng giá căn hộ',
                'button_link' => '/bang-gia',
                'image' => 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1600&auto=format&fit=crop&q=80',
                'sort_order' => 1,
            ],
            [
                'title' => 'Tiện ích 5 sao ngay tầng thượng',
                'subtitle' => 'Hồ bơi vô cực, phòng gym, công viên cây xanh 5.000m², sân chơi trẻ em và hệ thống an ninh 24/7 — tất cả trong khuôn viên nội khu.',
                'button_text' => 'Khám phá tiện ích',
                'button_link' => '/tien-ich',
                'image' => 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1600&auto=format&fit=crop&q=80',
                'sort_order' => 2,
            ],
            [
                'title' => 'Căn hộ ánh sáng tự nhiên, view mở',
                'subtitle' => 'Từ Studio 1PN đến Penthouse 4PN — mỗi căn hộ đều tối ưu ánh sáng tự nhiên, ban công rộng và view xanh hoặc view sông.',
                'button_text' => 'Xem 10 loại căn',
                'button_link' => '/bang-gia',
                'image' => 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&auto=format&fit=crop&q=80',
                'sort_order' => 3,
            ],
            [
                'title' => 'Sổ hồng lâu dài — bàn giao Q4/2027',
                'subtitle' => 'Dự án đã có Giấy phép xây dựng, đang thi công tầng 18/35, tiến độ đạt 55% — minh bạch pháp lý, cam kết đúng tiến độ.',
                'button_text' => 'Xem tổng quan dự án',
                'button_link' => '/ve-chu-dau-tu',
                'image' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80',
                'sort_order' => 4,
            ],
        ];
        foreach ($slides as $slide) {
            $this->execute(
                "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                [$slide['title'], $slide['subtitle'], $slide['button_text'], $slide['button_link'], $slide['image'], $slide['sort_order']]
            );
        }
    }

    private function seedUnitTypes(): void {
        if ($this->scalar("SELECT COUNT(*) FROM unit_types") > 0) return;
        $units = [
            ['Green Studio 1PN','green-studio-1pn','1pn',1,1,46,2650000000,'dong-nam','5-15','Tháp Terra','View công viên nội khu','con-hang','moi',
                'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1000&auto=format&fit=crop&q=80',
                ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format&fit=crop&q=80'],
                'Căn hộ 1 phòng ngủ tối ưu diện tích cho người độc thân hoặc cặp đôi trẻ, thiết kế mở liên thông bếp – khách, ban công rộng đón sáng tự nhiên trọn ngày, view hướng công viên nội khu yên tĩnh.',
                ['Bàn giao hoàn thiện cơ bản','Cửa sổ kính lớn lấy sáng','Ban công riêng 4m²','Kho lưu trữ âm tường'], 0],
            ['Riverside Compact 1PN+1','riverside-compact-1pn1','1pn',1,2,52,3150000000,'dong','5-20','Tháp Aqua','View sông Sài Gòn một phần','con-hang','',
                'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1000&auto=format&fit=crop&q=80',
                ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1615529162924-f8605388461d?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format&fit=crop&q=80'],
                'Phiên bản 1PN+1 có thêm phòng đa năng nhỏ dùng làm phòng làm việc hoặc phòng cho con — phù hợp gia đình trẻ mới cưới. Có 2 phòng vệ sinh riêng biệt, ban công hướng Đông đón bình minh.',
                ['Phòng đa năng linh hoạt','2 phòng vệ sinh riêng biệt','Bếp có đảo bar mini','Sàn gỗ công nghiệp cao cấp'], 0],
            ['Garden View 2PN','garden-view-2pn','2pn',2,2,68,4250000000,'tay-nam','6-25','Tháp Terra','View sân vườn cảnh quan','con-hang','hot',
                'https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=1000&auto=format&fit=crop&q=80',
                ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&auto=format&fit=crop&q=80'],
                'Căn 2 phòng ngủ bán chạy nhất dự án, bố trí phòng ngủ tách biệt phòng khách tối ưu riêng tư, view trọn vẹn mảng xanh công viên nội khu, phù hợp gia đình 3-4 thành viên.',
                ['2 phòng ngủ tách biệt hoàn toàn','Logia phơi đồ riêng','View xanh mát quanh năm','Diện tích thông thủy chuẩn 68m²'], 1],
            ['River View 2PN','river-view-2pn','2pn',2,2,72,4980000000,'dong-nam','8-30','Tháp Aqua','View trực diện sông Sài Gòn','con-hang','hot',
                'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1000&auto=format&fit=crop&q=80',
                ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1615529162924-f8605388461d?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format&fit=crop&q=80'],
                'Căn hộ sở hữu view sông trực diện hiếm có, ban công lớn 8m² lý tưởng để ngắm hoàng hôn trên sông Sài Gòn mỗi ngày, thiết kế nội thất hiện đại tối ưu ánh sáng tự nhiên.',
                ['View sông trực diện không bị che chắn','Ban công lớn 8m²','Bếp tách biệt có cửa lùa kính','Sàn cao 3.1m thông thoáng'], 1],
            ['Family Plus 2PN+1','family-plus-2pn1','2pn',2,2,78,5450000000,'nam','10-28','Tháp Terra','View công viên & một phần sông','sap-mo-ban','sap-mo-ban',
                'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1000&auto=format&fit=crop&q=80',
                ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&auto=format&fit=crop&q=80'],
                'Phiên bản 2PN+1 dành cho gia đình 3 thế hệ, phòng đa năng thứ 3 có thể làm phòng cho ông bà hoặc phòng thờ riêng biệt, tổng diện tích rộng rãi 78m² thông thủy.',
                ['Phòng đa năng thứ 3 riêng biệt','Hướng Nam mát mẻ quanh năm','Bếp rộng có bàn ăn 6 người','Dự kiến mở bán Quý 4/2026'], 0],
            ['Sky Terrace 3PN','sky-terrace-3pn','3pn',3,2,95,6950000000,'dong-nam','12-32','Tháp Aqua','View sông & thành phố','con-hang','hot',
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80',
                ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&auto=format&fit=crop&q=80'],
                'Căn hộ 3 phòng ngủ tiêu chuẩn dành cho gia đình đông thành viên, có ban công phụ (tiểu logia) riêng cho phòng ngủ master, thiết kế 2 mặt thoáng đón gió Đông Nam quanh năm.',
                ['3 phòng ngủ đều có cửa sổ','Tiểu logia riêng phòng master','Toilet master có bồn tắm','Kho chứa đồ 3m²'], 1],
            ['River Corner 3PN','river-corner-3pn','3pn',3,3,105,7850000000,'dong','15-33','Tháp Aqua','Căn góc — 2 mặt thoáng view sông','con-hang','',
                'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1000&auto=format&fit=crop&q=80',
                ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1615529162924-f8605388461d?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&auto=format&fit=crop&q=80'],
                'Căn góc cao cấp với 2 mặt thoáng không bị căn hộ liền kề che view, 3 phòng vệ sinh riêng biệt cho từng phòng ngủ, phù hợp gia đình lớn hoặc nhu cầu cho thuê dài hạn cao cấp.',
                ['Căn góc 2 mặt thoáng','3 toilet riêng biệt','Phòng khách rộng 32m²','Ban công bao quanh 2 mặt'], 0],
            ['Vertical Villa Duplex','vertical-villa-duplex','duplex',3,4,140,11200000000,'dong-nam','33-34','Tháp Aqua','View toàn cảnh sông & thành phố','sap-mo-ban','sap-mo-ban',
                'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1000&auto=format&fit=crop&q=80',
                ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&auto=format&fit=crop&q=80'],
                'Căn hộ thông tầng (duplex) 2 tầng riêng biệt trong 1 căn hộ — tầng dưới bố trí phòng khách, bếp và phòng ngủ khách; tầng trên là khu vực riêng tư với phòng master và phòng làm việc, cầu thang nội bộ bằng kính cường lực.',
                ['Thông tầng 2 lầu riêng biệt','Cầu thang kính cường lực','Sân vườn trên không riêng','Dự kiến mở bán Quý 1/2027'], 0],
            ['Panorama Penthouse','panorama-penthouse','penthouse',4,5,210,14500000000,'dong-nam-tay-bac','35','Tháp Terra','Toàn cảnh 360° sông & trung tâm thành phố','con-hang','hot',
                'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1000&auto=format&fit=crop&q=80',
                ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&auto=format&fit=crop&q=80'],
                'Penthouse độc bản duy nhất mỗi tháp, chiếm trọn tầng áp mái với tầm nhìn 360° không giới hạn, sân vườn riêng trên không, thang máy riêng lên thẳng căn hộ, bàn giao nội thất cao cấp trọn gói.',
                ['Thang máy riêng lên thẳng căn hộ','Sân vườn & bể sục riêng trên không','Bàn giao nội thất cao cấp trọn gói','Chỉ 2 căn duy nhất toàn dự án'], 1],
            ['Sky Garden 3PN Góc','sky-garden-3pn-goc','3pn',3,2,112,8250000000,'tay-nam','20-32','Tháp Terra','Căn góc view công viên & sông','het-hang','',
                'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1000&auto=format&fit=crop&q=80',
                ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1615529162924-f8605388461d?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80'],
                'Căn góc 3 phòng ngủ đã bán hết trong đợt mở bán đầu tiên nhờ vị trí đẹp view kép công viên và sông — hiện chỉ còn nhận đặt chỗ ưu tiên chuyển nhượng lại từ khách hàng hiện hữu.',
                ['Đã bán hết 100% giỏ hàng','Căn góc view kép','Chuyển nhượng qua Phòng KD dự án','Chênh lệch thị trường thứ cấp'], 0],
        ];
        $sort = 0;
        foreach ($units as $u) {
            [$name,$slug,$typeTag,$bedrooms,$bathrooms,$area,$priceFrom,$direction,$floorRange,$block,$view,$status,$badge,$floorPlanImage,$gallery,$description,$features,$featured] = $u;
            $this->execute(
                "INSERT INTO unit_types (name, slug, type_tag, bedrooms, bathrooms, area, price_from, direction, floor_range, block, view_desc, status, badge, floor_plan_image, gallery, description, features, is_featured, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [$name,$slug,$typeTag,$bedrooms,$bathrooms,$area,$priceFrom,$direction,$floorRange,$block,$view,$status,$badge,$floorPlanImage,
                 json_encode($gallery, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                 $description,
                 json_encode($features, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                 $featured, $sort++]
            );
        }
    }

    private function seedAmenities(): void {
        if ($this->scalar("SELECT COUNT(*) FROM amenities") > 0) return;
        $items = [
            ['Hồ bơi vô cực tầng thượng', 'View toàn cảnh sông Sài Gòn, tầng 35 mỗi tháp', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&auto=format&fit=crop&q=80'],
            ['Phòng gym & yoga 24/7', 'Trang bị máy tập nhập khẩu, huấn luyện viên riêng', 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80'],
            ['Công viên cây xanh nội khu', 'Hơn 5.000m² mảng xanh, đường dạo bộ ven sông', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=900&auto=format&fit=crop&q=80'],
            ['Khu vui chơi trẻ em', 'Sân chơi an toàn tiêu chuẩn châu Âu', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&auto=format&fit=crop&q=80'],
            ['Sân BBQ & khu tiệc ngoài trời', 'Không gian tổ chức sự kiện cộng đồng cư dân', 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&auto=format&fit=crop&q=80'],
            ['Sân vườn cảnh quan tầng trệt', 'Thiết kế cảnh quan nhiệt đới, ghế nghỉ chân', 'https://images.unsplash.com/photo-1580041065738-e72023775cdc?w=900&auto=format&fit=crop&q=80'],
            ['Bãi đậu xe ngầm 2 tầng hầm', 'Đáp ứng 100% nhu cầu ô tô + xe máy cư dân', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&auto=format&fit=crop&q=80'],
            ['An ninh 24/7 + nhận diện khuôn mặt', 'Kiểm soát ra vào bằng thẻ từ và Face ID', 'https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=900&auto=format&fit=crop&q=80'],
        ];
        $sort = 0;
        foreach ($items as [$name, $desc, $image]) {
            $this->execute(
                "INSERT INTO amenities (name, description, image, sort_order) VALUES (?, ?, ?, ?)",
                [$name, $desc, $image, $sort++]
            );
        }
    }

    private function seedNearbyAmenities(): void {
        if ($this->scalar("SELECT COUNT(*) FROM nearby_amenities") > 0) return;
        $items = [
            ['Trường Quốc tế ABC School', '500m'],
            ['Bệnh viện Quốc tế City / FV', '2km'],
            ['TTTM Thảo Điền Pearl', '1km'],
            ['Sông Sài Gòn & Bến du thuyền', 'Liền kề dự án'],
            ['Nhà ga Metro số 1 — Thảo Điền', '800m'],
            ['Siêu thị Emart / Co.opmart', '1.5km'],
        ];
        $sort = 0;
        foreach ($items as [$name, $distance]) {
            $this->execute(
                "INSERT INTO nearby_amenities (name, distance, sort_order) VALUES (?, ?, ?)",
                [$name, $distance, $sort++]
            );
        }
    }

    private function seedPaymentPhases(): void {
        if ($this->scalar("SELECT COUNT(*) FROM payment_phases") > 0) return;
        $items = [
            ['Đợt 1', 20, 'Ký Hợp đồng mua bán (HĐMB)'],
            ['Đợt 2', 15, 'Hoàn thành móng & 2 tầng hầm'],
            ['Đợt 3', 15, 'Cất nóc tầng 15'],
            ['Đợt 4', 15, 'Cất nóc tầng 25'],
            ['Đợt 5', 15, 'Hoàn thiện thô toàn bộ, lắp đặt MEP'],
            ['Đợt 6', 10, 'Bàn giao căn hộ'],
            ['Đợt 7', 10, 'Nhận Giấy chứng nhận quyền sở hữu (sổ hồng)'],
        ];
        $sort = 0;
        foreach ($items as [$phase, $percent, $milestone]) {
            $this->execute(
                "INSERT INTO payment_phases (phase, percent, milestone, sort_order) VALUES (?, ?, ?, ?)",
                [$phase, $percent, $milestone, $sort++]
            );
        }
    }

    private function seedSalesPolicies(): void {
        if ($this->scalar("SELECT COUNT(*) FROM sales_policies") > 0) return;
        $items = [
            ['💸', 'Chiết khấu 8%', 'Áp dụng khi thanh toán sớm 95% giá trị Hợp đồng mua bán.'],
            ['🤝', 'Chiết khấu thêm 2%', 'Dành cho khách hàng thân thiết hoặc mua từ căn thứ 2 trở lên.'],
            ['🏦', 'Hỗ trợ vay 70%', 'Liên kết Vietcombank, Techcombank, BIDV — ân hạn gốc 24 tháng.'],
        ];
        $sort = 0;
        foreach ($items as [$icon, $title, $desc]) {
            $this->execute(
                "INSERT INTO sales_policies (icon, title, description, sort_order) VALUES (?, ?, ?, ?)",
                [$icon, $title, $desc, $sort++]
            );
        }
    }

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $items = [
            ['Dự án Green Valley Residence hiện đã có sổ đỏ/sổ hồng chưa?', 'Dự án đã được cấp Giấy phép xây dựng số 118/GPXD-TĐ và đang triển khai thi công phần thân đúng quy hoạch. Sổ hồng riêng từng căn hộ (sở hữu lâu dài) sẽ được cấp cho khách hàng sau khi hoàn tất nghiệm thu và bàn giao, dự kiến trong vòng 12-18 tháng kể từ ngày bàn giao căn hộ, đúng như cam kết trong Hợp đồng mua bán.'],
            ['Tiến độ thanh toán khi mua căn hộ tại dự án như thế nào?', 'Thanh toán chia làm 7 đợt gắn với tiến độ xây dựng thực tế: Đợt 1 (20%) khi ký HĐMB, các đợt tiếp theo (mỗi đợt 15%) gắn với mốc hoàn thành móng, cất nóc tầng 15, cất nóc tầng 25, hoàn thiện thô — đợt cuối 10% khi bàn giao và 10% khi nhận sổ hồng. Xem chi tiết đầy đủ tại trang chi tiết từng loại căn.'],
            ['Ngân hàng nào hỗ trợ vay mua căn hộ tại đây, tỷ lệ vay tối đa bao nhiêu?', 'Dự án liên kết với 3 ngân hàng: Vietcombank, Techcombank và BIDV — hỗ trợ vay tối đa 70% giá trị căn hộ, ân hạn nợ gốc 24 tháng đầu, lãi suất ưu đãi theo chính sách từng ngân hàng tại thời điểm giải ngân. Quý khách có thể dùng công cụ tính vay ngay tại trang chi tiết từng loại căn để ước tính khoản trả góp hàng tháng.'],
            ['Có chính sách chiết khấu hay ưu đãi nào khi mua căn hộ không?', 'Khách hàng thanh toán sớm 95% giá trị Hợp đồng mua bán được chiết khấu 8%; khách hàng thân thiết hoặc mua từ căn thứ 2 trở lên được chiết khấu thêm 2%. Ngoài ra dự án thường xuyên có chính sách ưu đãi theo từng đợt mở bán — liên hệ Phòng Kinh doanh dự án để cập nhật chính sách mới nhất.'],
            ['Phí quản lý vận hành căn hộ hàng tháng là bao nhiêu?', 'Phí quản lý vận hành áp dụng 18.000đ/m²/tháng, đã bao gồm chi phí vận hành tiện ích nội khu (hồ bơi, gym, công viên, an ninh 24/7), bảo trì thang máy và hệ thống kỹ thuật tòa nhà. Đơn vị vận hành là công ty quản lý bất động sản chuyên nghiệp do chủ đầu tư lựa chọn.'],
            ['Khi nào dự án dự kiến bàn giao căn hộ cho khách hàng?', 'Dự án khởi công Quý 2/2024 và dự kiến bàn giao căn hộ vào Quý 4/2027. Tính đến 15/08/2026, dự án đã hoàn thành 55% tiến độ tổng thể, đang thi công tầng 18/35 của Tháp Aqua — đúng theo lộ trình cam kết với khách hàng.'],
            ['Tôi có thể đặt lịch tham quan nhà mẫu và thực địa dự án không?', 'Có. Quý khách có thể đăng ký lịch tham quan nhà mẫu và thực địa dự án tại trang Liên hệ hoặc gọi trực tiếp hotline 1900 6868 / 0909 888 686 — Phòng Kinh doanh dự án sẽ sắp xếp xe đưa đón và tư vấn viên hỗ trợ trực tiếp tại nhà mẫu.'],
        ];
        $sort = 0;
        foreach ($items as [$q, $a]) {
            $this->execute(
                "INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)",
                [$q, $a, $sort++]
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $items = [
            ['Nguyễn Minh Anh', 'Chủ căn 4-08, Tháp Aqua', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
                'Đội ngũ tư vấn của Phòng Kinh doanh dự án rất chuyên nghiệp, giải thích rõ ràng chính sách thanh toán và hỗ trợ vay. Tôi đã đặt cọc căn River View 2PN chỉ sau 2 lần tham quan nhà mẫu.'],
            ['Trần Thu Hà', 'Chủ căn 12-15, Tháp Terra', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
                'Điều tôi thích nhất là view sông thật sự trực diện chứ không bị che chắn như quảng cáo của nhiều dự án khác. Tiến độ xây dựng cũng đúng như cam kết ban đầu.'],
            ['Lê Quốc Bảo', 'Chủ căn Sky Terrace 3PN', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
                'Chính sách chiết khấu thanh toán sớm khá hấp dẫn, cộng thêm ngân hàng liên kết hỗ trợ vay 70% với lãi suất ưu đãi 24 tháng đầu — rất phù hợp với kế hoạch tài chính của gia đình tôi.'],
        ];
        $sort = 0;
        foreach ($items as [$name, $role, $avatar, $content]) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_role, avatar, content, sort_order) VALUES (?, ?, ?, ?, ?)",
                [$name, $role, $avatar, $content, $sort++]
            );
        }
    }

    // ─── Query helpers ─────────────────────────────────────────────────────────

    public function query(string $sql, array $params = []): array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $rows = $this->query($sql, $params);
        return $rows[0] ?? null;
    }

    public function scalar(string $sql, array $params = []): mixed {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchColumn();
    }

    public function execute(string $sql, array $params = []): int|string {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $this->pdo->lastInsertId();
    }

    public function getPdo(): \PDO {
        return $this->pdo;
    }
}

// Helper functions
function bodyJson(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function slugify(string $text): string {
    $text = mb_strtolower($text, 'UTF-8');
    $map = [
        'à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a',
        'ă'=>'a','ắ'=>'a','ặ'=>'a','ằ'=>'a','ẳ'=>'a','ẵ'=>'a',
        'â'=>'a','ấ'=>'a','ầ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a',
        'è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e',
        'ê'=>'e','ế'=>'e','ề'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e',
        'ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i',
        'ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o',
        'ô'=>'o','ố'=>'o','ồ'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o',
        'ơ'=>'o','ớ'=>'o','ờ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o',
        'ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u',
        'ư'=>'u','ứ'=>'u','ừ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u',
        'ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y',
        'đ'=>'d',
    ];
    $text = strtr($text, $map);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', trim($text));
    return trim($text, '-');
}
?>
