<?php
declare(strict_types=1);

class Database {
    private static ?PDO $pdo = null;

    public static function get(): PDO {
        if (self::$pdo === null) {
            self::$pdo = self::connect();
            self::migrate(self::$pdo);
        }
        return self::$pdo;
    }

    private static function connect(): PDO {
        $type = DB_TYPE;
        if ($type === 'sqlite') {
            $dir = dirname(DB_FILE);
            if (!is_dir($dir)) { @mkdir($dir, 0755, true); }
            $pdo = new PDO('sqlite:' . DB_FILE, null, null, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            $pdo->exec('PRAGMA foreign_keys = ON');
            $pdo->exec('PRAGMA journal_mode = WAL');
            return $pdo;
        }
        $dsn = "{$type}:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        return new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }

    private static function migrate(PDO $pdo): void {
        $sqlFile = __DIR__ . '/../schema.sql';
        $sql = file_get_contents($sqlFile);
        if ($sql === false) {
            throw new RuntimeException('schema.sql not found at ' . $sqlFile);
        }
        // Strip comments and empty lines
        $lines = explode("\n", $sql);
        $cleaned = [];
        foreach ($lines as $line) {
            $trimmed = trim($line);
            if ($trimmed === '' || str_starts_with($trimmed, '--')) continue;
            $cleaned[] = $line;
        }
        $cleanSql = implode("\n", $cleaned);

        // Execute each statement
        $stmts = array_filter(array_map('trim', explode(';', $cleanSql)));
        foreach ($stmts as $stmt) {
            if ($stmt !== '') {
                $pdo->exec($stmt);
            }
        }

        self::seedSettings($pdo);
        self::seedUsers($pdo);
        self::seedData($pdo);
    }

    private static function seedSettings(PDO $pdo): void {
        $defaults = [
            // general
            ['site_name',           'LuxDental',                           'general'],
            ['site_tagline',        'Nha Khoa Thẩm Mỹ Cao Cấp',            'general'],
            ['site_description',    'LuxDental — nha khoa thẩm mỹ cao cấp chuyên veneer sứ, bọc răng sứ, tẩy trắng răng và thiết kế nụ cười.', 'general'],
            ['logo_mark',           'L',                                   'general'],
            ['logo_sub',            'Aesthetic Dentistry',                 'general'],
            // seo
            ['meta_title',          'LuxDental — Nha Khoa Thẩm Mỹ Cao Cấp | Veneer, Bọc Sứ, Nụ Cười Hoàn Hảo', 'seo'],
            ['meta_description',    'LuxDental — nha khoa thẩm mỹ cao cấp chuyên veneer sứ, bọc răng sứ, tẩy trắng răng và thiết kế nụ cười.', 'seo'],
            ['meta_keywords',       'nha khoa thẩm mỹ, veneer sứ, bọc răng sứ, tẩy trắng răng, smile design', 'seo'],
            // social
            ['facebook',            'https://facebook.com/luxdental',      'social'],
            ['instagram',           'https://instagram.com/luxdental',     'social'],
            ['tiktok',              'https://tiktok.com/@luxdental',       'social'],
            ['zalo',                'https://zalo.me/0000000000',          'social'],
            // contact
            ['site_phone',          '0909 xxx xxx',                        'contact'],
            ['site_email',          'info@luxdental.vn',                   'contact'],
            ['site_address',        '123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM', 'contact'],
            ['working_hours',       'Thứ 2 – Thứ 7: 8:00 – 20:00 | Chủ nhật: 9:00 – 17:00', 'contact'],
            ['google_maps_embed',   '',                                    'contact'],
            // footer
            ['footer_description',  'Nha khoa thẩm mỹ cao cấp — kiến tạo nụ cười hoàn hảo bằng công nghệ hiện đại và tay nghề chuyên khoa.', 'footer'],
            ['footer_copyright',    '© 2026 LuxDental. Bảo lưu mọi quyền.', 'footer'],
            ['footer_license',      'Giấy phép CSYT số 001/GP-BYT',       'footer'],
            // stats
            ['stat_smiles',         '12000',                               'stats'],
            ['stat_years',          '18',                                  'stats'],
            ['stat_satisfaction',   '98',                                  'stats'],
            ['stat_doctors',        '15',                                  'stats'],
            // hero
            ['hero_badge',          'Nha Khoa Thẩm Mỹ Cao Cấp',           'hero'],
            ['hero_title_line1',    'Kiến tạo',                            'hero'],
            ['hero_title_line2',    'nụ cười hoàn hảo',                   'hero'],
            ['hero_subtitle',       'LuxDental hội tụ đội ngũ bác sĩ chuyên khoa thẩm mỹ và công nghệ scan 3D iTero — mang đến nụ cười tự nhiên, hài hòa và bền vững cho từng khách hàng.', 'hero'],
            ['hero_cta_primary',    'Đặt lịch tư vấn',                    'hero'],
            ['hero_cta_secondary',  'Xem dịch vụ',                        'hero'],
            // smtp
            ['smtp_host',           '',                                    'smtp'],
            ['smtp_port',           '587',                                 'smtp'],
            ['smtp_user',           '',                                    'smtp'],
            ['smtp_pass',           '',                                    'smtp'],
            ['smtp_from_name',      'LuxDental',                           'smtp'],
            ['smtp_from_email',     '',                                    'smtp'],
            // cloudinary
            ['cloudinary_cloud_name', '',                                  'cloudinary'],
            ['cloudinary_api_key',    '',                                  'cloudinary'],
            ['cloudinary_api_secret', '',                                  'cloudinary'],
            // integrations
            ['unsplash_access_key',   '',                                  'integrations'],
            ['google_analytics_id',   '',                                  'integrations'],
        ];

        $stmt = $pdo->prepare(
            'INSERT OR IGNORE INTO settings (key, value, "group") VALUES (?, ?, ?)'
        );
        foreach ($defaults as [$key, $val, $grp]) {
            $stmt->execute([$key, $val, $grp]);
        }
    }

    private static function seedUsers(PDO $pdo): void {
        $row = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
        if ((int)$row > 0) return;
        $hash = password_hash('123456', PASSWORD_BCRYPT);
        $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)")
            ->execute(['Administrator', 'sysadmin@admin.com', $hash, 'superadmin']);
    }

    private static function seedData(PDO $pdo): void {
        // Seed service categories
        $catCount = (int)$pdo->query("SELECT COUNT(*) FROM service_categories")->fetchColumn();
        if ($catCount === 0) {
            $cats = [
                ['veneer-su-tham-my',  'Veneer & Sứ thẩm mỹ', 1],
                ['chinh-nha-tham-my',  'Chỉnh nha thẩm mỹ',   2],
                ['tay-trang-cham-soc', 'Tẩy trắng & Chăm sóc', 3],
            ];
            $stmt = $pdo->prepare("INSERT INTO service_categories (slug, name, sort_order) VALUES (?, ?, ?)");
            foreach ($cats as $c) { $stmt->execute($c); }
        }

        // Seed services
        $svcCount = (int)$pdo->query("SELECT COUNT(*) FROM services")->fetchColumn();
        if ($svcCount === 0) {
            $catIds = [];
            foreach ($pdo->query("SELECT id, slug FROM service_categories")->fetchAll() as $r) {
                $catIds[$r['slug']] = $r['id'];
            }
            $services = [
                // Veneer & Sứ
                [$catIds['veneer-su-tham-my'] ?? null, 'Veneer sứ Emax', 'Mặt dán sứ siêu mỏng, giữ nguyên răng thật tối đa, cho độ trong và bóng tự nhiên như răng thật.', 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=75&auto=format&fit=crop', 'Bán chạy nhất', '5.000.000đ', '/ răng', 1, 1],
                [$catIds['veneer-su-tham-my'] ?? null, 'Bọc răng sứ Zirconia', 'Sứ Zirconia khung sườn chịu lực cao, phù hợp răng hư tổn nặng, form dáng bền đẹp lâu dài.', 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=75&auto=format&fit=crop', 'Phục hình toàn diện', '4.000.000đ', '/ răng', 1, 2],
                [$catIds['veneer-su-tham-my'] ?? null, 'Thiết kế nụ cười (Smile Design)', 'Phân tích số hóa khuôn mặt bằng phần mềm 3D, mô phỏng nụ cười trước khi thực hiện điều trị.', 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=75&auto=format&fit=crop', 'Cá nhân hóa', 'Miễn phí', 'tư vấn thiết kế', 1, 3],
                // Chỉnh nha
                [$catIds['chinh-nha-tham-my'] ?? null, 'Invisalign', 'Khay niềng trong suốt tháo lắp linh hoạt, hiệu quả chỉnh hình cao mà không lộ khí cụ kim loại.', 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600&q=75&auto=format&fit=crop', 'Trong suốt', '45.000.000đ', '/ liệu trình', 1, 4],
                [$catIds['chinh-nha-tham-my'] ?? null, 'Niềng răng mắc cài sứ', 'Mắc cài sứ trong màu răng, hiệu quả chỉnh nha tương đương mắc cài kim loại, thẩm mỹ vượt trội.', 'https://images.unsplash.com/photo-1606811951341-3352e77dae0c?w=600&q=75&auto=format&fit=crop', 'Thẩm mỹ cao', '35.000.000đ', '/ liệu trình', 0, 5],
                [$catIds['chinh-nha-tham-my'] ?? null, 'Cấy ghép Implant thẩm mỹ', 'Trụ Implant nhập khẩu chuẩn FDA, phục hình răng mất với độ thẩm mỹ và ăn nhai như răng thật.', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=75&auto=format&fit=crop', 'Phục hồi chức năng', '18.000.000đ', '/ trụ', 1, 6],
                // Tẩy trắng
                [$catIds['tay-trang-cham-soc'] ?? null, 'Tẩy trắng răng Laser', 'Công nghệ Laser Whitening cho răng trắng sáng lên nhiều tone chỉ sau một buổi điều trị.', 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=600&q=75&auto=format&fit=crop', 'Trắng sáng nhanh', '2.500.000đ', '/ liệu trình', 1, 7],
                [$catIds['tay-trang-cham-soc'] ?? null, 'Lấy cao răng & Đánh bóng', 'Vệ sinh chuyên sâu định kỳ, loại bỏ mảng bám, duy trì độ sáng bóng cho nụ cười thẩm mỹ.', 'https://images.unsplash.com/photo-1581590730456-b3ce65fd50ab?w=600&q=75&auto=format&fit=crop', 'Duy trì kết quả', '500.000đ', '/ lượt', 0, 8],
                [$catIds['tay-trang-cham-soc'] ?? null, 'Trám thẩm mỹ Composite', 'Khắc phục răng thưa, mẻ, sứt nhẹ bằng vật liệu Composite cùng màu răng, hoàn thành trong ngày.', 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=600&q=75&auto=format&fit=crop', 'Sửa chữa nhanh', '800.000đ', '/ răng', 0, 9],
            ];
            $stmt = $pdo->prepare("INSERT INTO services (category_id, name, description, image, tag, price, price_unit, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($services as $s) { $stmt->execute($s); }
        }

        // Seed doctors
        $docCount = (int)$pdo->query("SELECT COUNT(*) FROM doctors")->fetchColumn();
        if ($docCount === 0) {
            $doctors = [
                ['BS. Nguyễn Minh Hằng', 'Thẩm mỹ nha khoa', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=75&auto=format&fit=crop', 'Trưởng khoa thẩm mỹ với hơn 16 năm kinh nghiệm, chuyên gia hàng đầu về veneer và thiết kế nụ cười.', 16, 'Thạc sĩ Răng Hàm Mặt — ĐH Y Hà Nội | 3.500+ ca Veneer & Smile Design', 'Trưởng khoa', 1],
                ['BS. Trần Văn Dũng', 'Chỉnh nha thẩm mỹ', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=75&auto=format&fit=crop', 'Chứng chỉ Invisalign Diamond từ Mỹ, chuyên gia chỉnh nha trong suốt với hơn 2.100 ca thành công.', 11, 'Chứng chỉ Invisalign — Hoa Kỳ | 2.100+ ca chỉnh nha trong suốt', 'Chuyên gia', 2],
                ['BS. Lê Thị Phương', 'Phục hình sứ thẩm mỹ', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=75&auto=format&fit=crop', 'Tiến sĩ nha khoa tốt nghiệp Đại học Seoul, chuyên gia phục hình sứ với hơn 2.800 ca bọc sứ và veneer.', 13, 'Tiến sĩ Nha khoa — Seoul National University | 2.800+ ca bọc sứ & Veneer', 'Chuyên gia', 3],
                ['BS. Phạm Quốc Huy', 'Cấy ghép Implant', 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=75&auto=format&fit=crop', 'Bác sĩ CK II phẫu thuật hàm mặt, chuyên gia Implant thẩm mỹ với hơn 1.600 trụ Implant thành công.', 9, 'Bác sĩ CK II Phẫu thuật hàm mặt | 1.600+ trụ Implant thẩm mỹ', 'Chuyên gia', 4],
            ];
            $stmt = $pdo->prepare("INSERT INTO doctors (name, role, photo, description, experience_years, credentials, tag, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($doctors as $d) { $stmt->execute($d); }
        }

        // Seed testimonials
        $tesCount = (int)$pdo->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
        if ($tesCount === 0) {
            $testimonials = [
                ['Nguyễn Thị Lan', 'Khách hàng Veneer sứ', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop', 'Tôi làm veneer sứ tại LuxDental sau nhiều năm tự ti vì hàm răng lệch. Kết quả vượt xa mong đợi — nụ cười tự nhiên và hài hòa hoàn toàn với khuôn mặt.', 5, 1, 1],
                ['Trần Minh Châu', 'Khách hàng Smile Design', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80&auto=format&fit=crop', 'Bác sĩ tư vấn rất kỹ và sử dụng công nghệ scan 3D cho tôi xem trước kết quả. Quy trình thiết kế nụ cười ở đây thực sự chuyên nghiệp và cá nhân hóa.', 5, 1, 2],
                ['Phạm Thu Hà', 'Khách hàng Bọc răng sứ', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80&auto=format&fit=crop', 'Không gian phòng khám sang trọng, sạch sẽ. Đội ngũ nhân viên chăm sóc khách hàng rất tận tâm. Tôi đã giới thiệu cho cả gia đình đến làm răng ở đây.', 5, 1, 3],
            ];
            $stmt = $pdo->prepare("INSERT INTO testimonials (author_name, author_role, author_avatar, content, stars, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)");
            foreach ($testimonials as $t) { $stmt->execute($t); }
        }
    }

    /** Instance methods for query execution */
    public function __construct() {}

    public function query(string $sql, array $params = []): array {
        $stmt = self::get()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $stmt = self::get()->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function execute(string $sql, array $params = []): int {
        $stmt = self::get()->prepare($sql);
        $stmt->execute($params);
        return (int)self::get()->lastInsertId();
    }
}
