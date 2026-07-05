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
            ['site_name',        'Future Dental',                    'general'],
            ['site_tagline',     'Implant 3D Clinic',                'general'],
            ['site_email',       'lienhe@futuredental.vn',           'general'],
            ['site_phone',       '028 3900 1111',                    'general'],
            ['site_phone_hotline','0909 111 222',                    'general'],
            ['site_address',     '123 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP. Hồ Chí Minh', 'general'],
            ['working_hours',    'T2-T7: 08:00 - 20:00 | CN: 09:00 - 17:00', 'general'],
            ['zalo_number',      '0909111222',                       'general'],
            ['meta_title',       'Future Dental - Chuyên Khoa Implant 3D Chính Xác Tuyệt Đối', 'seo'],
            ['meta_description', 'Future Dental chuyên khoa cấy ghép Implant ứng dụng công nghệ scan 3D, CAD-CAM và định vị phẫu thuật kỹ thuật số. Phục hình răng chính xác, an toàn, bền vững.', 'seo'],
            ['meta_keywords',    'implant 3d, cay ghep implant, scan 3d, cad-cam, all-on-4, all-on-6, future dental', 'seo'],
            ['facebook_url',     'https://facebook.com/futuredental',   'social'],
            ['instagram_url',    'https://instagram.com/futuredental',  'social'],
            ['youtube_url',      '',                                     'social'],
            ['tiktok_url',       '',                                     'social'],
            ['zalo_url',         'https://zalo.me/0909111222',          'social'],
            ['stat_years',       '10',                                   'about'],
            ['stat_cases',       '12000',                                'about'],
            ['stat_doctors',     '8',                                    'about'],
            ['stat_satisfaction','99',                                   'about'],
            ['hero_title_main',  'Cấy ghép Implant chuẩn 3D chính xác tuyệt đối',  'about'],
            ['hero_subtitle',    'Future Dental ứng dụng công nghệ scan 3D, thiết kế CAD-CAM và định vị phẫu thuật kỹ thuật số — mang lại kết quả phục hình chính xác đến từng milimet, an toàn và bền vững theo thời gian.', 'about'],
            ['og_image',         '',                                     'seo'],
            ['notify_email',     '',                                     'smtp'],
            ['map_embed',        '',                                     'contact'],
            ['footer_copy',      '© 2026 Future Dental. Bảo lưu mọi quyền.', 'footer'],
            ['smtp_host',        'smtp.gmail.com',                       'smtp'],
            ['smtp_port',        '587',                                  'smtp'],
            ['smtp_user',        '',                                     'smtp'],
            ['smtp_pass',        '',                                     'smtp'],
            ['smtp_from_name',   'Future Dental',                        'smtp'],
            ['smtp_from_email',  '',                                     'smtp'],
            ['cloudinary_cloud_name',    '',                             'cloudinary'],
            ['cloudinary_api_key',       '',                             'cloudinary'],
            ['cloudinary_api_secret',    '',                             'cloudinary'],
            ['cloudinary_upload_preset', '',                             'cloudinary'],
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
                'Cấy ghép Implant chuẩn 3D chính xác tuyệt đối',
                'Future Dental ứng dụng công nghệ scan 3D, thiết kế CAD-CAM và định vị phẫu thuật kỹ thuật số — mang lại kết quả phục hình chính xác đến từng milimet, an toàn và bền vững theo thời gian.',
                'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1600&q=80&auto=format&fit=crop',
                'Đặt lịch tư vấn miễn phí',
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
            ['01', 'Implant một răng',
             'Trụ Titanium chuẩn quốc tế tích hợp trực tiếp vào xương hàm, phục hình mão sứ cá nhân hóa theo dữ liệu scan 3D. Ăn nhai chắc chắn như răng thật, bảo hành dài hạn.',
             'Trụ Implant nhập khẩu cao cấp|Mão sứ Zirconia thẩm mỹ|Định vị 3D chính xác|Bảo hành dài hạn',
             'Từ 18.000.000đ / trụ',
             'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=75&auto=format&fit=crop',
             1, 0],
            ['02', 'All-on-4',
             'Phục hình cố định toàn hàm chỉ với 4 trụ Implant định vị bằng máng phẫu thuật kỹ thuật số. Kết quả trong 24-48 giờ, phục hồi khả năng ăn nhai toàn diện.',
             'Chỉ 4 trụ Implant cho cả hàm|Phục hình trong 24-48 giờ|Máng phẫu thuật in 3D|Phù hợp xát cạnh xương',
             'Từ 85.000.000đ / hàm',
             'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=75&auto=format&fit=crop',
             1, 1],
            ['03', 'All-on-6',
             '6 trụ Implant phân bổ lực nhai tối ưu, phù hợp nền xương yếu. Độ bền vượt trội, thích hợp khách hàng có mật độ xương thấp hoặc đã tiêu xương lâu năm.',
             '6 trụ phân bổ lực nhai đều|Phù hợp nền xương yếu|Bền vững theo thời gian|Mão sứ Zirconia toàn hàm',
             'Từ 115.000.000đ / hàm',
             'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600&q=75&auto=format&fit=crop',
             1, 2],
            ['04', 'Ghép xương & nâng xoang',
             'Tái tạo thể tích xương hàm cho trường hợp tiêu xương lâu năm, tăng tỷ lệ thành công Implant. Kỹ thuật hỗ trợ trước khi cấy Implant trên nền xương không đủ.',
             'Ghép xương tự thân hoặc xương nhân tạo|Nâng xoang hàm kỹ thuật nhẹ nhàng|Theo dõi hồi phục sau phẫu thuật|Tạo nền tảng cho Implant chắc chắn',
             'Từ 6.500.000đ / vị trí',
             'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=75&auto=format&fit=crop',
             0, 3],
            ['05', 'Implant tức thì',
             'Cấy trụ và gắn răng tạm ngay trong ngày cho các trường hợp đủ điều kiện xương hàm. Giảm thời gian điều trị, phục hồi chức năng nhanh chóng.',
             'Phẫu thuật và phục hình trong một buổi|Phù hợp trường hợp xương hạt|Máng phẫu thuật định vị chính xác|Theo dõi chặt chẽ sau phẫu thuật',
             'Từ 22.000.000đ / trụ',
             'https://images.unsplash.com/photo-1609838858845-33e5a3d6bbfd?w=600&q=75&auto=format&fit=crop',
             1, 4],
            ['06', 'Mão sứ trên Implant',
             'Mão sứ Zirconia hoặc Titan-sứ thẩm mỹ cao, thiết kế CAD-CAM khớp khít với dữ liệu scan 3D. Màu sắc tự nhiên, độ bền lâu dài, bảo vệ trụ Implant bên dưới.',
             'Thiết kế CAD-CAM chính xác|Zirconia hoặc Titan-sứ|Màu sắc tự nhiên bền vững|Lắp đặt nhanh chóng chính xác',
             'Từ 5.000.000đ / mão',
             'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&q=75&auto=format&fit=crop',
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
            ['BS. Nguyễn Thành Hùng',
             'Trưởng khoa Implant',
             'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=75&auto=format&fit=crop',
             'Hơn 10 năm kinh nghiệm cấy ghép Implant, chuyên sâu kỹ thuật All-on-4/6 và phẫu thuật định vị kỹ thuật số. Trực tiếp thực hiện hơn 4.000 ca Implant thành công tại phòng khám.',
             10, 'Implant All-on-4/6|Phẫu thuật định vị 3D|Tu nghiệp Hàn Quốc', 'Trưởng khoa Implant', 0],
            ['BS. Phạm Thị Lan Anh',
             'Chuyên khoa phục hình răng sứ',
             'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=75&auto=format&fit=crop',
             'Chuyên gia thiết kế CAD-CAM và phục hình răng sứ thẩm mỹ, đảm bảo mão sứ khớp khít tuyệt đối với dữ liệu scan 3D. Kinh nghiệm hơn 8 năm trong lĩnh vực phục hình kỹ thuật số.',
             8, 'Thiết kế CAD-CAM|Mão sứ Zirconia|Phục hình thẩm mỹ', '', 1],
            ['BS. Trần Minh Đức',
             'Chuyên khoa phẫu thuật hàm mặt',
             'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=75&auto=format&fit=crop',
             'Đảm nhận các ca ghép xương, nâng xoang phức tạp, tu nghiệp chuyên sâu Implant tại nước ngoài. Chuyên gia phẫu thuật ổ răng khôn và chỉnh hình xương hàm.',
             12, 'Ghép xương|Nâng xoang|Phẫu thuật hàm mặt', '', 2],
            ['BS. Lê Thị Bích Vân',
             'Chuyên khoa chẩn đoán hình ảnh',
             'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=75&auto=format&fit=crop',
             'Phụ trách đọc phim CBCT, phân tích dữ liệu 3D và lập kế hoạch định vị phẫu thuật cho từng ca bệnh. Chuyên gia đầu ngành về chẩn đoán hình ảnh trong nha khoa Implant.',
             9, 'Đọc phim CBCT|Phân tích dữ liệu 3D|Lập kế hoạch phẫu thuật', '', 3],
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
            ['Nguyễn Văn Minh', 'Implant All-on-4',
             'Quy trình scan 3D rất nhanh, không đau như tôi tưởng. Bác sĩ cho xem mô phỏng kết quả trước khi làm nên rất yên tâm. Chỉ sau 2 ngày tôi đã ăn uống bình thường.',
             5, 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&q=80&auto=format&fit=crop', 1, 0],
            ['Trần Thị Hồng', 'Implant một răng',
             'Sau 6 tháng cấy Implant, ăn nhai thoải mái như răng thật. Đội ngũ tư vấn tận tâm và theo dõi sát sao. Rất hài lòng với kết quả điều trị tại Future Dental.',
             5, 'https://images.unsplash.com/photo-1614289371518-722f2615943d?w=100&q=80&auto=format&fit=crop', 1, 1],
            ['Lê Quốc Bảo', 'Implant All-on-6',
             'Công nghệ định vị 3D giúp ca phẫu thuật của tôi diễn ra chỉ trong 40 phút, gần như không sưng đau. Quy trình minh bạch, bác sĩ giải thích kỹ từng bước rất chuyên nghiệp.',
             5, 'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=100&q=80&auto=format&fit=crop', 1, 2],
            ['Phạm Thị Thanh', 'Implant một răng',
             'Không gian phòng khám hiện đại, quy trình minh bạch từng bước trên màn hình. Rất chuyên nghiệp và an tâm. Sẽ giới thiệu bạn bè đến khám tại Future Dental.',
             5, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80&auto=format&fit=crop', 1, 3],
        ];
        foreach ($items as $i) { $stmt->execute($i); }
    }
}
