<?php
declare(strict_types=1);

class Database {
    private PDO $pdo;
    private static ?Database $instance = null;

    private function __construct() {
        if (DB_TYPE === 'sqlite') {
            $dir = dirname(DB_FILE);
            if (!is_dir($dir)) mkdir($dir, 0755, true);
            $this->pdo = new PDO('sqlite:' . DB_FILE);
            $this->pdo->exec('PRAGMA foreign_keys = ON');
            $this->pdo->exec('PRAGMA journal_mode = WAL');
        } else {
            $dsn = DB_TYPE . ':host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS);
        }
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
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
        // PHẢI check false — nếu schema.sql thiếu, tables không được tạo
        if ($schema === false) {
            throw new \RuntimeException('schema.sql not found: ' . $schemaPath);
        }
        $stmts = array_filter(array_map('trim', explode(';', $schema)));
        foreach ($stmts as $stmt) {
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
        $this->seedTeamMembers();
        $this->seedTestimonials();
        $this->seedFaqs();
        $this->seedPricingPlans();
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
            ['site_name', 'VietFinance', 'general'],
            ['site_description', 'Tư vấn tài chính chuyên nghiệp — Bảo vệ và gia tăng tài sản của bạn', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'info@vietfinance.vn', 'general'],
            ['site_phone', '028 3823 4567', 'general'],
            ['site_phone_2', '0912 345 678', 'general'],
            ['site_address', '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', 'general'],
            ['working_hours', 'Thứ 2–6: 8:00–17:30 | Thứ 7: 8:00–12:00', 'general'],
            ['license_number', 'XXXX/UBCKNN', 'general'],
            ['footer_tagline', 'Đồng hành cùng bạn trên hành trình xây dựng tự do tài chính — từ kế hoạch đến thực thi.', 'general'],
            // seo
            ['meta_title', 'VietFinance — Tư Vấn Tài Chính Chuyên Nghiệp', 'seo'],
            ['meta_description', 'Dịch vụ tư vấn quản lý đầu tư, lập kế hoạch tài chính và tư vấn thuế chuyên nghiệp cho cá nhân và doanh nghiệp.', 'seo'],
            ['meta_keywords', 'tư vấn tài chính, quản lý đầu tư, hoạch định tài chính, tư vấn thuế', 'seo'],
            ['og_image', '', 'seo'],
            ['google_analytics_id', '', 'seo'],
            // social
            ['social_facebook', 'https://facebook.com/', 'social'],
            ['social_youtube', '', 'social'],
            ['social_instagram', '', 'social'],
            ['social_linkedin', 'https://linkedin.com/', 'social'],
            ['social_zalo', '0912345678', 'social'],
            // design
            ['primary_color', '#1565c0', 'design'],
            ['secondary_color', '#00897b', 'design'],
            // footer
            ['footer_copyright', '2025 VietFinance. Bảo lưu mọi quyền.', 'footer'],
            ['footer_description', 'Đồng hành cùng bạn trên hành trình xây dựng tự do tài chính — từ kế hoạch đến thực thi.', 'footer'],
            ['footer_show_social', '1', 'footer'],
            ['footer_disclaimer', 'Các thông tin trên website chỉ mang tính tham khảo và không cấu thành lời khuyên đầu tư. Đầu tư có rủi ro.', 'footer'],
            // contact
            ['contact_form_enabled', '1', 'contact'],
            ['contact_email_receiver', 'info@vietfinance.vn', 'contact'],
            ['google_map_embed', '', 'contact'],
            // smtp
            ['smtp_host', 'smtp.gmail.com', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_password', '', 'smtp'],
            ['smtp_from_name', 'VietFinance', 'smtp'],
            ['smtp_from_email', 'noreply@vietfinance.vn', 'smtp'],
            // system
            ['maintenance_mode', '0', 'system'],
            ['maintenance_message', 'Website đang bảo trì. Vui lòng quay lại sau.', 'system'],
            // about / hero
            ['hero_label', 'Tư Vấn Tài Chính Chuyên Nghiệp', 'about'],
            ['hero_title', 'Bảo vệ & gia tăng tài sản của bạn', 'about'],
            ['hero_subtitle', 'Chúng tôi cung cấp giải pháp tài chính toàn diện — từ quản lý đầu tư, hoạch định tài chính đến tư vấn thuế — giúp bạn đạt mục tiêu tài chính bền vững và an toàn.', 'about'],
            ['stat_years', '20+', 'about'],
            ['stat_clients', '500+', 'about'],
            ['stat_satisfaction', '98%', 'about'],
            ['stat_experts', '15+', 'about'],
            // cloudinary
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key', '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            ['cloudinary_folder', 'webdrop', 'cloudinary'],
            // integrations
            ['unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'integrations'],
        ];
        $stmt = $this->pdo->prepare("INSERT OR IGNORE INTO settings (key, value, \"group\") VALUES (?, ?, ?)");
        foreach ($settings as $s) {
            $stmt->execute($s);
        }
    }

    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        $slides = [
            [
                'title'       => 'Bảo vệ & gia tăng tài sản của bạn',
                'subtitle'    => 'Chúng tôi cung cấp giải pháp tài chính toàn diện — từ quản lý đầu tư, hoạch định tài chính đến tư vấn thuế.',
                'button_text' => 'Đặt lịch tư vấn miễn phí',
                'button_link' => '/lien-he',
                'image'       => 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1400&q=80&auto=format&fit=crop',
                'sort_order'  => 1,
            ],
            [
                'title'       => 'Kinh nghiệm thực chiến 20+ năm trên thị trường',
                'subtitle'    => 'Đội ngũ chuyên gia CFA, ACCA, CFP với kinh nghiệm qua nhiều chu kỳ kinh tế. Mạng lưới đối tác ngân hàng và quỹ đầu tư rộng lớn.',
                'button_text' => 'Gặp đội ngũ chuyên gia',
                'button_link' => '/doi-ngu',
                'image'       => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80&auto=format&fit=crop',
                'sort_order'  => 2,
            ],
            [
                'title'       => 'Quy trình minh bạch, báo cáo định kỳ đầy đủ',
                'subtitle'    => 'Bạn luôn biết tài sản của mình đang ở đâu và hoạt động như thế nào. Báo cáo hàng tháng, cổng thông tin trực tuyến 24/7.',
                'button_text' => 'Xem dịch vụ',
                'button_link' => '/dich-vu',
                'image'       => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&q=80&auto=format&fit=crop',
                'sort_order'  => 3,
            ],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order, status) VALUES (?,?,?,?,?,?,'published')"
        );
        foreach ($slides as $s) {
            $stmt->execute([$s['title'], $s['subtitle'], $s['button_text'], $s['button_link'], $s['image'], $s['sort_order']]);
        }
    }

    private function seedServices(): void {
        if ($this->scalar("SELECT COUNT(*) FROM services") > 0) return;
        $services = [
            [
                'Quản lý Đầu tư',
                'quan-ly-dau-tu',
                'Xây dựng danh mục đầu tư tối ưu dựa trên khẩu vị rủi ro và mục tiêu tài chính của từng khách hàng.',
                'Chúng tôi xây dựng và quản lý danh mục đầu tư đa dạng phù hợp với mục tiêu tài chính và khẩu vị rủi ro của từng khách hàng. Bao gồm cổ phiếu, trái phiếu, quỹ ETF, bất động sản và các công cụ tài chính khác.',
                'trending_up',
                '500 triệu (tối thiểu)',
                1, 1,
            ],
            [
                'Tư vấn Thuế',
                'tu-van-thue',
                'Tối ưu hóa nghĩa vụ thuế cho cá nhân và doanh nghiệp, đảm bảo tuân thủ pháp luật và tiết kiệm chi phí tối đa.',
                'Dịch vụ tư vấn thuế toàn diện cho cá nhân và doanh nghiệp. Chúng tôi giúp bạn tối ưu hóa nghĩa vụ thuế một cách hợp pháp, đảm bảo tuân thủ đúng quy định pháp luật và giảm thiểu chi phí thuế tối đa.',
                'receipt',
                'Từ 5 triệu/tháng',
                1, 2,
            ],
            [
                'Hoạch định Tài chính',
                'hoach-dinh-tai-chinh',
                'Lập kế hoạch tài chính dài hạn cho hưu trí, giáo dục con cái, mua nhà và các mục tiêu cuộc sống quan trọng.',
                'Lập kế hoạch tài chính toàn diện cho các mục tiêu dài hạn quan trọng trong cuộc sống: hưu trí, giáo dục con cái, mua nhà, du lịch và bảo hiểm.',
                'savings',
                'Tư vấn lần đầu Miễn phí',
                1, 3,
            ],
            [
                'Quản lý Rủi ro',
                'quan-ly-rui-ro',
                'Phân tích và xây dựng chiến lược quản lý rủi ro toàn diện, bảo vệ tài sản trước các biến động thị trường bất ngờ.',
                'Phân tích toàn diện các rủi ro tài chính và xây dựng chiến lược phòng ngừa phù hợp. Chúng tôi giúp bạn xác định và đánh giá các rủi ro tiềm ẩn, từ biến động thị trường đến rủi ro tập trung.',
                'security',
                'Tích hợp với Quản lý ĐT',
                1, 4,
            ],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO services (name, slug, description, content, icon, price, featured, sort_order, status) VALUES (?,?,?,?,?,?,?,?,'published')"
        );
        foreach ($services as $s) {
            $stmt->execute([$s[0], $s[1], $s[2], $s[3], $s[4], $s[5], $s[6], $s[7]]);
        }
    }

    private function seedTeamMembers(): void {
        if ($this->scalar("SELECT COUNT(*) FROM team_members") > 0) return;
        $members = [
            [
                'Nguyễn Minh Đức',
                'Tổng Giám đốc (CEO)',
                'Với hơn 20 năm kinh nghiệm trong lĩnh vực quản lý đầu tư và tư vấn tài chính, ông Đức đã dẫn dắt nhiều danh mục đầu tư giá trị hàng nghìn tỷ đồng. Từng là Giám đốc đầu tư tại Dragon Capital và SSI Asset Management.',
                '20 năm kinh nghiệm · Cựu quản lý quỹ tại Dragon Capital',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop&crop=face',
                'CFA Level III, MBA Harvard, CPA',
                1, 1,
            ],
            [
                'Trần Thị Thu Hà',
                'Phó Tổng Giám đốc (COO)',
                'Chuyên gia hàng đầu về quản lý rủi ro và tư vấn chiến lược tài chính doanh nghiệp. Từng là Partner tại PwC và Deloitte Vietnam, bà Hà đã tư vấn cho hàng trăm doanh nghiệp.',
                '18 năm kinh nghiệm · Cựu Partner tại Big 4',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80&auto=format&fit=crop&crop=face',
                'ACCA Fellow, CFP, CTA',
                1, 2,
            ],
            [
                'Lê Văn Hùng',
                'Trưởng phòng Quản lý Đầu tư',
                '15 năm phân tích cổ phiếu và quản lý danh mục tại VCSC và Maybank Kim Eng.',
                '15 năm kinh nghiệm',
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop&crop=face',
                'CFA, FRM',
                0, 3,
            ],
            [
                'Phạm Thị Lan Anh',
                'Trưởng phòng Thuế Doanh nghiệp',
                'Hơn 12 năm tư vấn thuế cho doanh nghiệp FDI và tập đoàn trong nước.',
                '12 năm kinh nghiệm',
                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop&crop=face',
                'ACCA, CTA',
                0, 4,
            ],
            [
                'Hoàng Văn Nam',
                'Chuyên gia Hoạch định Cá nhân',
                'Chuyên sâu về kế hoạch hưu trí, giáo dục tài chính và di sản gia đình.',
                '10 năm kinh nghiệm',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=face',
                'CFP, ChFC',
                0, 5,
            ],
            [
                'Nguyễn Thị Bích Ngọc',
                'Chuyên gia Quản lý Rủi ro',
                'Kinh nghiệm xây dựng mô hình rủi ro và chiến lược phòng ngừa biến động thị trường.',
                '8 năm kinh nghiệm',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop&crop=face',
                'FRM, PRM',
                0, 6,
            ],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO team_members (name, position, bio, experience, avatar, certificates, is_leader, sort_order, status) VALUES (?,?,?,?,?,?,?,?,'published')"
        );
        foreach ($members as $m) {
            $stmt->execute($m);
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $testimonials = [
            [
                'Nguyễn Văn An',
                'Giám đốc điều hành, Công ty ABC',
                'N',
                'Sau 3 năm hợp tác, danh mục đầu tư của tôi tăng trưởng vượt kỳ vọng. Đội ngũ luôn sẵn sàng giải thích và tư vấn kịp thời mỗi khi thị trường biến động.',
                5, 1,
            ],
            [
                'Trần Thị Bích',
                'CFO, Tập đoàn XYZ',
                'T',
                'Dịch vụ tư vấn thuế giúp công ty tiết kiệm được khoản chi phí đáng kể mỗi năm. Quy trình làm việc chuyên nghiệp, báo cáo minh bạch rõ ràng.',
                5, 2,
            ],
            [
                'Phạm Văn Cường',
                'Bác sĩ chuyên khoa, Bệnh viện Đa khoa',
                'P',
                'Kế hoạch hưu trí được lập rất chi tiết và thực tế. Tôi cảm thấy an tâm hơn rất nhiều về tương lai tài chính của gia đình mình.',
                5, 3,
            ],
        ];
        $stmt = $this->pdo->prepare(
            "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order, status) VALUES (?,?,?,?,?,?,'published')"
        );
        foreach ($testimonials as $t) {
            $stmt->execute([$t[0], $t[1], $t[2], $t[3], $t[4], $t[5]]);
        }
    }

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $faqs = [
            ['Tôi cần chuẩn bị gì cho buổi tư vấn đầu tiên?', 'Buổi tư vấn đầu tiên hoàn toàn miễn phí và không đòi hỏi chuẩn bị phức tạp. Bạn chỉ cần có sẵn thông tin cơ bản về tình hình tài chính hiện tại (thu nhập, chi tiêu, tài sản, nợ) và các mục tiêu tài chính muốn đạt được. Chuyên gia sẽ hỗ trợ bạn trong suốt quá trình.'],
            ['Mức phí quản lý tài sản (AUM) được tính như thế nào?', 'Phí quản lý được tính theo tỷ lệ % trên tổng tài sản đang quản lý (AUM) mỗi năm, thu định kỳ hàng tháng hoặc hàng quý tùy gói dịch vụ — mức phí cụ thể giảm dần khi quy mô tài sản tăng. Với các gói có phí cố định (ví dụ tư vấn thuế), chi phí được báo rõ trước khi ký hợp đồng, không phát sinh phí ẩn.'],
            ['Tài sản tối thiểu để bắt đầu sử dụng dịch vụ là bao nhiêu?', 'Không có mức sàn bắt buộc cho dịch vụ hoạch định tài chính cá nhân — buổi tư vấn đầu tiên luôn miễn phí dù bạn mới bắt đầu tích lũy. Với dịch vụ Quản lý Đầu tư chuyên sâu, tài sản tối thiểu tham khảo từ 500 triệu đồng; khách hàng dưới mức này sẽ được tư vấn định hướng tích lũy trước khi chuyển sang quản lý danh mục chủ động.'],
            ['VietFinance có giấy phép hoạt động của UBCKNN không?', 'Có. Công ty hoạt động theo giấy phép số XXXX/UBCKNN do Ủy ban Chứng khoán Nhà nước cấp cho hoạt động tư vấn đầu tư chứng khoán, cùng các chứng chỉ hành nghề CFA/ACCA của đội ngũ chuyên gia trực tiếp phụ trách khách hàng. Thông tin giấy phép được công khai tại chân trang website.'],
            ['Thông tin tài chính cá nhân của tôi được bảo mật ở mức độ nào?', 'Chúng tôi cam kết bảo mật tuyệt đối mọi thông tin cá nhân và tài chính của khách hàng theo Luật Bảo vệ dữ liệu cá nhân. Toàn bộ dữ liệu được mã hóa khi lưu trữ và truyền tải, chỉ chuyên gia phụ trách trực tiếp mới có quyền truy cập hồ sơ của bạn, và không chia sẻ cho bên thứ ba khi chưa có sự đồng ý bằng văn bản.'],
            ['Tôi nhận được báo cáo hiệu suất đầu tư bao lâu một lần?', 'Tần suất báo cáo phụ thuộc vào gói dịch vụ: gói Cơ Bản nhận báo cáo hàng quý, gói Chuyên Nghiệp và Cao Cấp nhận báo cáo chi tiết hàng tháng kèm buổi họp đánh giá cùng chuyên gia phụ trách. Ngoài ra bạn có thể theo dõi diễn biến danh mục bất kỳ lúc nào qua kênh hỗ trợ trực tiếp.'],
            ['Công ty có cam kết lợi nhuận cố định cho danh mục đầu tư không?', 'Không. Theo đúng quy định pháp luật về hoạt động tư vấn đầu tư, chúng tôi không cam kết bất kỳ mức lợi nhuận cố định nào — mọi hoạt động đầu tư đều tiềm ẩn rủi ro và hiệu suất trong quá khứ không đảm bảo cho kết quả tương lai. Vai trò của chúng tôi là xây dựng chiến lược phù hợp với khẩu vị rủi ro của bạn và quản lý rủi ro một cách chuyên nghiệp, minh bạch.'],
            ['Tôi có thể thay đổi gói dịch vụ sau khi đăng ký không?', 'Có, bạn có thể nâng cấp hoặc điều chỉnh gói dịch vụ bất kỳ lúc nào. Chúng tôi hiểu rằng nhu cầu tài chính thay đổi theo thời gian, vì vậy các gói dịch vụ đều linh hoạt để phù hợp với từng giai đoạn cuộc sống của bạn.'],
        ];
        $order = 1;
        foreach ($faqs as [$q, $a]) {
            $this->execute(
                "INSERT INTO faqs (question, answer, page, sort_order, status) VALUES (?, ?, 'dich-vu', ?, 'published')",
                [$q, $a, $order++]
            );
        }
    }

    private function seedPricingPlans(): void {
        if ($this->scalar("SELECT COUNT(*) FROM pricing_plans") > 0) return;
        $plans = [
            [
                'name' => 'Cơ Bản',
                'price' => '5 triệu/tháng',
                'description' => 'Dành cho cá nhân mới bắt đầu đầu tư, tài sản dưới 500 triệu đồng.',
                'features' => "Tư vấn hoạch định tài chính cơ bản\nBáo cáo hàng quý\nHỗ trợ email & điện thoại\n1 cuộc họp đánh giá/quý",
                'is_featured' => 0, 'cta_text' => 'Bắt đầu ngay', 'sort_order' => 1,
            ],
            [
                'name' => 'Chuyên Nghiệp',
                'price' => '15 triệu/tháng',
                'description' => 'Dành cho nhà đầu tư có kinh nghiệm, tài sản từ 500 triệu – 5 tỷ đồng.',
                'features' => "Tất cả tính năng gói Cơ bản\nQuản lý danh mục đầu tư chủ động\nBáo cáo hàng tháng chi tiết\nTư vấn thuế cơ bản\nChuyên gia riêng phụ trách\nHọp đánh giá hàng tháng",
                'is_featured' => 1, 'cta_text' => 'Đăng ký ngay', 'sort_order' => 2,
            ],
            [
                'name' => 'Cao Cấp',
                'price' => 'Liên hệ',
                'description' => 'Dành cho UHNW và doanh nghiệp, tài sản trên 5 tỷ đồng.',
                'features' => "Tất cả tính năng gói Chuyên nghiệp\nChiến lược đầu tư độc quyền\nTư vấn thuế doanh nghiệp đầy đủ\nKế hoạch di sản & thừa kế\nTiếp cận cơ hội đầu tư riêng\nHotline riêng 24/7",
                'is_featured' => 0, 'cta_text' => 'Liên hệ tư vấn', 'sort_order' => 3,
            ],
        ];
        foreach ($plans as $pl) {
            $this->execute(
                "INSERT INTO pricing_plans (name, price, description, features, is_featured, cta_text, cta_link, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, '/lien-he', ?, 'published')",
                [$pl['name'], $pl['price'], $pl['description'], $pl['features'], $pl['is_featured'], $pl['cta_text'], $pl['sort_order']]
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

    public function scalar(string $sql, array $params = []) {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchColumn();
    }
}
