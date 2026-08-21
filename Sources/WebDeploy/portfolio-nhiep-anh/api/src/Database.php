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

    protected function seedExtensions(): void {
        $this->seedProjects();
        $this->seedTestimonials();
        $this->seedFaqs();
        $this->seedPricingPlans();
    }

    private function seedProjects(): void {
        if ($this->scalar("SELECT COUNT(*) FROM projects") > 0) return;

        $challenge1 = "Thảo & Huy chọn tổ chức lễ cưới giữa rừng thông cách trung tâm Đà Lạt 40 phút — nơi mang lại khung cảnh mộng mơ nhưng cũng kéo theo rủi ro về thời tiết: sương mù dày đặc buổi sáng có thể kéo dài đến 9-10h, còn mưa bất chợt buổi chiều là chuyện thường xảy ra ở Đà Lạt vào mùa cưới.\n\nThêm vào đó, tán thông dày khiến ánh sáng trong rừng thay đổi liên tục theo từng khoảng trống lá — khu vực làm lễ chính có ánh sáng dịu nhưng khu vực dựng rạp tiệc lại lọt nắng gắt vào giữa trưa, đòi hỏi phải tính toán kỹ thời điểm chụp cho từng phân đoạn để tránh chênh sáng gắt trên khuôn mặt cô dâu chú rể.";
        $solution1 = "Tôi khảo sát địa điểm thực tế trước 2 tuần cùng wedding planner để đo hướng sáng tại từng khung giờ, từ đó lên sẵn 2 kịch bản lịch trình song song — một cho ngày nắng, một dự phòng cho ngày sương mù kéo dài hoặc mưa nhẹ.\n\n- Khảo sát địa điểm trước 2 tuần — đo hướng sáng, đánh dấu 6 điểm chụp chính theo từng khung giờ trong ngày\n- Chuẩn bị ống kính khẩu độ lớn (f/1.4–f/1.8) để tận dụng tối đa ánh sáng tán xạ dịu qua tán thông, hạn chế dùng đèn flash phá vỡ không khí tự nhiên\n- Chia ekip 4 người thành 2 nhóm — 1 nhóm bám sát cô dâu chú rể ghi lại cảm xúc chính, 1 nhóm lưu động bắt các khoảnh khắc hậu trường và phản ứng khách mời\n- Chuẩn bị phương án dự phòng mưa: dù trong suốt phong cách vintage, đổi góc chụp sang khu vực có mái che gần đó mà vẫn giữ được background rừng thông";

        $challenge2 = "Ngọc & Bảo mê phong cách ảnh phim xưa nhưng chưa từng đứng trước ống kính chuyên nghiệp — cả hai khá gượng gạo trong những lần thử tạo dáng ban đầu, lo sợ ảnh sẽ trông \"diễn\" thay vì tự nhiên như mong muốn.\n\nThách thức lớn thứ hai là thời gian: khung giờ đẹp nhất ở phố cổ Hội An — lúc vắng khách du lịch và ánh sáng dịu nhất — chỉ kéo dài khoảng 90 phút vào sáng sớm và một khoảng tương tự lúc hoàng hôn. Bỏ lỡ khung giờ này đồng nghĩa với việc phải chụp giữa dòng người tham quan đông đúc, phá vỡ hoàn toàn không khí phim xưa mà cặp đôi mong muốn.";
        $solution2 = "Tôi sắp xếp một buổi gặp trước tại studio để hai bạn làm quen với ống kính, hướng dẫn cách di chuyển và tạo dáng tự nhiên thay vì cứng nhắc — giảm hẳn cảm giác \"chụp ảnh cưới\" để về đúng cảm giác hai người đang dạo phố cùng nhau.\n\n- Khảo sát trước 4 địa điểm tại phố cổ theo hướng ánh sáng vào từng khung giờ, lên bản đồ di chuyển tối ưu để không lãng phí thời gian vàng\n- Chia lịch trình thành 2 khung giờ: 5h30–7h sáng (ánh sáng dịu, phố vắng) và 17h–18h30 chiều (ánh nắng vàng và đèn lồng bắt đầu lên)\n- Dùng phim analog kết hợp máy digital giả lập tông màu phim để giữ được chất mộc mà vẫn đảm bảo tiến độ hậu kỳ nhanh hơn\n- Chuẩn bị sẵn 3 bộ trang phục truyền thống và áo dài để tạo nhịp điệu thay đổi phong cách xuyên suốt buổi chụp";

        $projects = [
            // Full case study — chi-tiet-1
            ['title'=>'Thảo & Huy — Đà Lạt','slug'=>'thao-huy-da-lat','category'=>'Destination Wedding',
             'description'=>'Lễ cưới giữa rừng thông với 80 khách mời thân thiết, phong cách tối giản, gần gũi thiên nhiên.',
             'image'=>'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80&auto=format&fit=crop',
             'client_name'=>'Thảo & Huy','year'=>'2025','location'=>'Rừng thông, Đà Lạt',
             'overview2_label'=>'Số khách mời','overview2_value'=>'80 khách',
             'scope_text'=>'Phóng sự cưới trọn gói + quay phim','duration'=>'2 ngày (lễ + tiệc)',
             'challenge'=>$challenge1,'solution'=>$solution1,
             'gallery_images'=>implode("\n",[
                'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=80&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1519741497674-611481863552?w=700&q=80&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=700&q=80&auto=format&fit=crop',
             ]),
             'stats'=>"850|+|Ảnh gốc bàn giao\n320||Ảnh đã chỉnh sửa hoàn chỉnh\n15| ngày|Thời gian bàn giao\n100|%|Khách hàng hài lòng",
             'testimonial_content'=>'Chúng tôi lo lắng nhất là thời tiết Đà Lạt thất thường, nhưng Đăng đã chuẩn bị sẵn phương án B rất kỹ. Đến giờ xem lại ảnh, tụi mình vẫn ngạc nhiên vì có những khoảnh khắc mình còn không nhớ đã xảy ra — như lúc ba dẫn mình vào lễ, ánh mắt của ba lúc đó, Đăng bắt được trọn vẹn.',
             'testimonial_author'=>'Thảo','testimonial_role'=>'Cô dâu — Đám cưới tại Đà Lạt, 2025',
             'testimonial_avatar'=>'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80&auto=format&fit=crop',
             'featured'=>1,'sort_order'=>1],

            // Full case study — chi-tiet-2
            ['title'=>'Ngọc & Bảo — Hội An','slug'=>'ngoc-bao-hoi-an','category'=>'Pre-wedding',
             'description'=>'Bộ ảnh phim xưa lấy cảm hứng từ phố cổ, ánh đèn lồng và những góc tường rêu phong.',
             'image'=>'https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=600&q=80&auto=format&fit=crop',
             'client_name'=>'Ngọc & Bảo','year'=>'2025','location'=>'Phố cổ Hội An',
             'overview2_label'=>'Phong cách','overview2_value'=>'Phim xưa (film-look)',
             'scope_text'=>'Trọn gói pre-wedding + trang phục','duration'=>'1 ngày (sáng sớm + hoàng hôn)',
             'challenge'=>$challenge2,'solution'=>$solution2,
             'gallery_images'=>implode("\n",[
                'https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=900&q=80&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=700&q=80&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=700&q=80&auto=format&fit=crop',
             ]),
             'stats'=>"400|+|Ảnh gốc bàn giao\n150||Ảnh chỉnh sửa phong cách phim\n10| ngày|Thời gian bàn giao\n3| tạp chí|Được đăng lại online",
             'testimonial_content'=>'Ban đầu tụi mình khá ngại vì chưa quen tạo dáng, nhưng buổi gặp trước với Đăng giúp tụi mình thoải mái hẳn. Đến ngày chụp thật thì gần như quên mất là đang có máy ảnh — chỉ còn lại cảm giác đang dạo phố Hội An lúc sáng sớm cùng nhau. Ảnh ra đúng như tụi mình mơ, thậm chí còn hơn thế.',
             'testimonial_author'=>'Ngọc','testimonial_role'=>'Cô dâu tương lai — Pre-wedding tại Hội An, 2025',
             'testimonial_avatar'=>'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80&auto=format&fit=crop',
             'featured'=>1,'sort_order'=>2],

            // Card-only projects (du-an.html list — không có trang case study riêng trong template gốc)
            ['title'=>'Vy & Khoa — Phú Quốc','slug'=>'vy-khoa-phu-quoc','category'=>'Beach Wedding',
             'description'=>'Tiệc cưới hoàng hôn bên bờ biển, 120 khách mời, ánh sáng tự nhiên xuyên suốt buổi lễ.',
             'image'=>'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&q=80&auto=format&fit=crop',
             'client_name'=>'Vy & Khoa','year'=>'2025','location'=>'Phú Quốc','featured'=>1,'sort_order'=>3],

            ['title'=>'Linh & Phát — Sài Gòn','slug'=>'linh-phat-sai-gon','category'=>'Lễ cưới truyền thống',
             'description'=>'Trọn vẹn hành trình một ngày cưới, từ lễ gia tiên đến tiệc tối tại trung tâm thành phố.',
             'image'=>'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=600&q=80&auto=format&fit=crop',
             'client_name'=>'Linh & Phát','year'=>'2025','location'=>'Sài Gòn','featured'=>1,'sort_order'=>4],

            ['title'=>'Hà & Minh — Ninh Thuận','slug'=>'ha-minh-ninh-thuan','category'=>'Destination Wedding',
             'description'=>'Tiệc cưới giữa đồi cát, ánh nắng chiều nhuộm vàng cả không gian, 60 khách mời thân thiết.',
             'image'=>'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80&auto=format&fit=crop',
             'client_name'=>'Hà & Minh','year'=>'2025','location'=>'Ninh Thuận','sort_order'=>5],

            ['title'=>'Trang & Đức — Hà Nội','slug'=>'trang-duc-ha-noi','category'=>'Lễ cưới truyền thống',
             'description'=>'Tiệc cưới trong khu vườn cổ giữa lòng Hà Nội, không khí ấm cúng của một buổi chiều thu.',
             'image'=>'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80&auto=format&fit=crop',
             'client_name'=>'Trang & Đức','year'=>'2024','location'=>'Hà Nội','sort_order'=>6],

            ['title'=>'My & Tuấn — Đà Lạt','slug'=>'my-tuan-da-lat','category'=>'Pre-wedding',
             'description'=>'Bộ ảnh vintage giữa những căn biệt thự cổ và đồi chè xanh mướt của thành phố sương mù.',
             'image'=>'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80&auto=format&fit=crop',
             'client_name'=>'My & Tuấn','year'=>'2024','location'=>'Đà Lạt','sort_order'=>7],

            ['title'=>'Uyên & Long — Nha Trang','slug'=>'uyen-long-nha-trang','category'=>'Beach Wedding',
             'description'=>'Lễ cưới nhỏ trên bãi biển lúc bình minh, chỉ 40 khách mời thân thiết nhất.',
             'image'=>'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80&auto=format&fit=crop',
             'client_name'=>'Uyên & Long','year'=>'2024','location'=>'Nha Trang','sort_order'=>8],

            ['title'=>'Chi & Nam — Sài Gòn','slug'=>'chi-nam-sai-gon','category'=>'Lễ cưới truyền thống',
             'description'=>'Lễ cưới tại nhà thờ cổ hơn 100 năm tuổi, ánh sáng xuyên qua cửa kính màu tạo hiệu ứng đặc biệt.',
             'image'=>'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&q=80&auto=format&fit=crop',
             'client_name'=>'Chi & Nam','year'=>'2024','location'=>'Sài Gòn','sort_order'=>9],

            ['title'=>'Quỳnh & Vinh — Đà Lạt','slug'=>'quynh-vinh-da-lat','category'=>'Elopement',
             'description'=>'Lễ cưới thân mật chỉ hai người và người thân thiết nhất, giữa một buổi sáng sương mù Đà Lạt.',
             'image'=>'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80&auto=format&fit=crop',
             'client_name'=>'Quỳnh & Vinh','year'=>'2024','location'=>'Đà Lạt','sort_order'=>10],
        ];

        foreach ($projects as $p) {
            $this->execute(
                "INSERT INTO projects (title, slug, category, description, image, client_name, year, location, overview2_label, overview2_value, scope_text, duration, challenge, solution, gallery_images, stats, testimonial_content, testimonial_author, testimonial_role, testimonial_avatar, featured, sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [
                    $p['title'], $p['slug'], $p['category'], $p['description'], $p['image'],
                    $p['client_name'] ?? '', $p['year'] ?? '', $p['location'] ?? '',
                    $p['overview2_label'] ?? '', $p['overview2_value'] ?? '',
                    $p['scope_text'] ?? '', $p['duration'] ?? '',
                    $p['challenge'] ?? '', $p['solution'] ?? '',
                    $p['gallery_images'] ?? '', $p['stats'] ?? '',
                    $p['testimonial_content'] ?? '', $p['testimonial_author'] ?? '', $p['testimonial_role'] ?? '', $p['testimonial_avatar'] ?? '',
                    $p['featured'] ?? 0, $p['sort_order'] ?? 0,
                ]
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $items = [
            ['author_name'=>'Thảo Nguyên','author_title'=>'Đà Lạt, 2025',
             'author_avatar'=>'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&auto=format&fit=crop',
             'content'=>'Đăng không chỉ chụp ảnh — anh ấy lặng lẽ đứng ở góc phòng và bắt trọn những khoảnh khắc mà chính chúng tôi cũng không kịp nhận ra. Xem lại ảnh, chúng tôi như sống lại đúng cảm xúc của ngày hôm đó.',
             'sort_order'=>1],
            ['author_name'=>'Ngọc','author_title'=>'Hội An, 2025',
             'author_avatar'=>'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80&auto=format&fit=crop',
             'content'=>'Ban đầu tụi mình khá ngại vì chưa quen tạo dáng, nhưng buổi gặp trước với Đăng giúp tụi mình thoải mái hẳn. Ảnh ra đúng như tụi mình mơ.',
             'sort_order'=>2],
            ['author_name'=>'Vy','author_title'=>'Phú Quốc, 2025',
             'author_avatar'=>'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80&auto=format&fit=crop',
             'content'=>'Ekip chuyên nghiệp, đúng giờ, và quan trọng nhất là biết tiết chế — không chỉ đạo quá nhiều khiến buổi lễ mất tự nhiên. Video highlight khiến cả nhà mình khóc khi xem lại.',
             'sort_order'=>3],
        ];
        foreach ($items as $t) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order) VALUES (?,?,?,?,?,?)",
                [$t['author_name'], $t['author_title'], $t['author_avatar'], $t['content'], 5, $t['sort_order']]
            );
        }
    }

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $items = [
            ['q'=>'Chi phí chụp ảnh cưới đã bao gồm những gì?','a'=>'Giá niêm yết đã bao gồm công chụp, công chỉnh sửa hậu kỳ, và chi phí thiết bị. Chi phí phát sinh duy nhất (nếu có) là di chuyển ngoại tỉnh và lưu trú qua đêm cho ekip khi chụp xa Đà Lạt — luôn được báo trước và thống nhất bằng văn bản, không phát sinh bất ngờ.'],
            ['q'=>'Quy trình đặt lịch và giữ chỗ như thế nào?','a'=>'Sau buổi tư vấn miễn phí, bạn đặt cọc 30% giá trị gói để giữ ngày. Đây cũng là bước xác nhận lịch chính thức trong hệ thống — mỗi ngày chỉ nhận tối đa 1 lễ cưới để đảm bảo chất lượng tác nghiệp.'],
            ['q'=>'Bao lâu thì nhận được ảnh sau ngày cưới?','a'=>'Tùy gói dịch vụ: Gói Cơ Bản 15 ngày, Gói Nâng Cao 12 ngày, Gói Trọn Gói ưu tiên 7 ngày làm việc. Trong 48 giờ đầu, bạn sẽ nhận trước 15–20 ảnh chọn lọc để chia sẻ ngay lên mạng xã hội.'],
            ['q'=>'Tôi có được yêu cầu chỉnh sửa lại ảnh sau khi nhận không?','a'=>'Có — mọi gói đều bao gồm 15 ngày hỗ trợ chỉnh sửa miễn phí sau bàn giao (màu sắc, crop, làm mịn nhẹ). Yêu cầu chỉnh sửa nằm ngoài phạm vi này (ví dụ ghép ảnh, thay đổi bố cục) sẽ được báo giá riêng theo giờ.'],
            ['q'=>'Hình thức thanh toán như thế nào?','a'=>'Đặt cọc 30% khi giữ lịch, 40% trước ngày chụp 7 ngày, 30% còn lại khi nhận bàn giao ảnh/video hoàn chỉnh. Nhận chuyển khoản ngân hàng hoặc tiền mặt, có xuất hóa đơn/biên nhận đầy đủ.'],
            ['q'=>'Nếu trời mưa vào đúng ngày chụp thì sao?','a'=>'Mọi buổi khảo sát đều có sẵn phương án dự phòng địa điểm có mái che hoặc trong nhà. Với lịch pre-wedding, nếu thời tiết quá xấu, bạn có thể dời lịch miễn phí 1 lần trong vòng 30 ngày mà không mất thêm chi phí.'],
            ['q'=>'Có nhận chụp ngoài khu vực Đà Lạt không?','a'=>'Có — tôi đã tác nghiệp tại hơn 45 tỉnh thành. Với lễ cưới ngoại tỉnh (Phú Quốc, Hội An, Hà Nội, Nha Trang...), chi phí di chuyển và lưu trú của ekip sẽ được báo giá riêng minh bạch, cộng thêm vào gói dịch vụ đã chọn.'],
        ];
        foreach ($items as $i => $f) {
            $this->execute(
                "INSERT INTO faqs (question, answer, page, sort_order) VALUES (?, ?, 'dich-vu', ?)",
                [$f['q'], $f['a'], $i + 1]
            );
        }
    }

    private function seedPricingPlans(): void {
        if ($this->scalar("SELECT COUNT(*) FROM pricing_plans") > 0) return;
        $plans = [
            ['name'=>'Gói Cơ Bản','description'=>'Phù hợp lễ cưới thân mật dưới 50 khách','price'=>'15.000.000đ',
             'features'=>"1 photographer chính\n6 giờ tác nghiệp trong ngày\n200 ảnh đã chỉnh sửa hoàn chỉnh\nBàn giao trong 15 ngày làm việc\nFile ảnh gốc chưa chỉnh (theo yêu cầu)",
             'is_featured'=>0,'sort_order'=>1],
            ['name'=>'Gói Nâng Cao','description'=>'Cho lễ cưới vừa, cần cả ảnh và video','price'=>'28.000.000đ',
             'features'=>"2 photographer + 1 quay phim\n10 giờ tác nghiệp trong ngày\n400 ảnh đã chỉnh sửa hoàn chỉnh\nVideo highlight 3–5 phút\n1 buổi pre-wedding mini (2 giờ)\nBàn giao trong 12 ngày làm việc",
             'is_featured'=>1,'sort_order'=>2],
            ['name'=>'Gói Trọn Gói','description'=>'Ghi trọn hành trình cả ngày cưới','price'=>'45.000.000đ',
             'features'=>"Ekip 4 người trọn ngày (12–14 giờ)\n600+ ảnh đã chỉnh sửa hoàn chỉnh\nPhim cưới đầy đủ 8–10 phút + trailer\n1 buổi pre-wedding riêng trọn ngày\nAlbum in ảnh cao cấp bìa da (30x30cm)\nBàn giao ưu tiên trong 7 ngày làm việc",
             'is_featured'=>0,'sort_order'=>3],
        ];
        foreach ($plans as $pl) {
            $this->execute(
                "INSERT INTO pricing_plans (name, description, price, unit, features, is_featured, badge_text, cta_text, cta_link, sort_order) VALUES (?,?,?,'/ trọn gói',?,?,'Phổ biến nhất','Chọn gói này','/lien-he',?)",
                [$pl['name'], $pl['description'], $pl['price'], $pl['features'], $pl['is_featured'], $pl['sort_order']]
            );
        }
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
            // ── Thông tin chung ──
            ['site_name', 'Đăng Photography', 'general'],
            ['site_tagline', 'Nhiếp ảnh gia cưới tự do — Đà Lạt', 'general'],
            ['site_description', 'Đăng Photography — nhiếp ảnh gia cưới tự do 9 năm kinh nghiệm, hơn 260 đám cưới khắp Việt Nam. Phong cách ảnh phim tự nhiên, storytelling chân thật, không dàn dựng.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hello@dangphotography.vn', 'general'],
            ['site_phone', '090 000 0000', 'general'],
            ['site_address', '12 Đường Trần Hưng Đạo, Phường 3, Đà Lạt, Lâm Đồng', 'general'],
            ['working_hours', '8:00 – 19:00, tất cả các ngày trong tuần', 'general'],
            ['service_area', 'Đà Lạt và 45+ tỉnh thành trên cả nước', 'general'],

            // ── SEO ──
            ['meta_title', 'Đăng Photography — Nhiếp ảnh gia cưới tự do | Đà Lạt', 'seo'],
            ['meta_description', 'Đăng Photography — nhiếp ảnh gia cưới tự do 9 năm kinh nghiệm, hơn 260 đám cưới khắp Việt Nam. Phong cách ảnh phim tự nhiên, storytelling chân thật, không dàn dựng.', 'seo'],
            ['meta_keywords', 'nhiếp ảnh cưới, chụp ảnh cưới Đà Lạt, wedding photographer, pre-wedding, phóng sự cưới', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80&auto=format&fit=crop', 'seo'],

            // ── Mạng xã hội ──
            ['facebook', '#', 'social'],
            ['instagram', '#', 'social'],
            ['zalo_phone', '0900000000', 'social'],

            // ── Footer ──
            ['footer_copyright', '© 2026 Đăng Photography. Toàn bộ hình ảnh thuộc bản quyền nhiếp ảnh gia.', 'footer'],
            ['footer_description', 'Nhiếp ảnh gia cưới tự do — 9 năm ghi lại những câu chuyện tình yêu thật khắp Việt Nam. Đặt trụ sở tại Đà Lạt.', 'footer'],

            // ── Liên hệ / Bản đồ ──
            ['map_embed', 'https://maps.google.com/maps?q=11.9404,108.4583&hl=vi&z=15&output=embed', 'contact'],

            // ── Nội dung trang — Trang chủ ──
            ['home_intro_name', 'Đăng', 'content'],
            ['home_intro_lead', 'Tôi tin rằng ngày cưới đẹp nhất khi *không ai diễn*. Suốt 9 năm cầm máy, tôi chọn đứng lùi lại, quan sát và chờ đợi những khoảnh khắc thật — một cái nắm tay run run, một giọt nước mắt của mẹ, một tràng cười không kịp che miệng. Đó là những gì tôi muốn trao lại cho các cặp đôi sau ngày trọng đại.', 'content'],
            ['feature1_title', 'Ánh sáng tự nhiên', 'content'],
            ['feature1_text', 'Không dùng flash trực diện, ưu tiên ánh sáng vàng golden hour và ánh sáng cửa sổ tự nhiên trong mọi buổi chụp.', 'content'],
            ['feature2_title', 'Storytelling chân thật', 'content'],
            ['feature2_text', 'Ghi lại theo trình tự thật của buổi lễ — không dàn cảnh, không yêu cầu diễn lại khoảnh khắc đã qua.', 'content'],
            ['feature3_title', 'Ekip chuyên nghiệp', 'content'],
            ['feature3_text', '4 người: 1 photographer chính, 1 phụ tá ánh sáng, 1 quay phim, 1 điều phối hậu kỳ — phối hợp nhịp nhàng trong suốt buổi lễ.', 'content'],
            ['stat1_number', '260', 'content'], ['stat1_suffix', '+', 'content'], ['stat1_label', 'Đám cưới đã ghi hình', 'content'],
            ['stat2_number', '9', 'content'], ['stat2_suffix', ' năm', 'content'], ['stat2_label', 'Kinh nghiệm hành nghề', 'content'],
            ['stat3_number', '45', 'content'], ['stat3_suffix', '+', 'content'], ['stat3_label', 'Tỉnh thành đã tác nghiệp', 'content'],
            ['stat4_number', '98', 'content'], ['stat4_suffix', '%', 'content'], ['stat4_label', 'Khách hàng giới thiệu lại', 'content'],
            ['home_strip_label', 'Dịch vụ', 'content'],
            ['home_strip_title', '3 gói chụp ảnh cưới phù hợp mọi quy mô lễ cưới', 'content'],
            ['home_strip_text', 'Từ gói phóng sự cưới cơ bản chỉ 1 photographer, đến gói trọn gói với ekip 4 người quay chụp toàn bộ hành trình — mỗi gói đều có bảng giá minh bạch, không phát sinh chi phí ẩn.', 'content'],
            ['home_strip_image', 'https://images.unsplash.com/photo-1521543387479-a9e5c4faa7a1?w=700&q=80&auto=format&fit=crop', 'content'],
            ['home_fb_title', 'Ngày cưới của bạn xứng đáng<br>được kể lại *thật nhất*', 'content'],
            ['home_fb_sub', 'Lịch chụp năm 2026 đang mở — đặt lịch tư vấn để giữ ngày cưới của bạn ngay hôm nay.', 'content'],
            ['home_fb_image', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1600&q=70&auto=format&fit=crop', 'content'],

            // ── Nội dung trang — Dự án ──
            ['projects_hero_title', 'Những câu chuyện *tôi đã kể*', 'content'],
            ['projects_hero_sub', '10 lễ cưới tiêu biểu tôi đã đồng hành suốt 9 năm qua — mỗi dự án là một câu chuyện riêng, được ghi lại đúng như nó đã xảy ra.', 'content'],
            ['projects_fb_title', 'Câu chuyện tiếp theo có thể<br>là của *bạn*', 'content'],
            ['projects_fb_sub', 'Cùng ngồi lại trò chuyện 30 phút để tôi hiểu ngày cưới bạn mong muốn — hoàn toàn miễn phí, không ràng buộc.', 'content'],
            ['projects_fb_image', 'https://images.unsplash.com/photo-1509927083803-4bd519298ac4?w=1600&q=70&auto=format&fit=crop', 'content'],

            // ── Nội dung trang — Dịch vụ ──
            ['services_hero_title', 'Gói dịch vụ *minh bạch*, không phát sinh', 'content'],
            ['services_hero_sub', '3 gói chụp ảnh cưới phù hợp với mọi quy mô lễ cưới — từ buổi lễ thân mật đến hành trình trọn vẹn cả ngày. Giá niêm yết rõ ràng, không phí ẩn.', 'content'],
            ['process1_title', 'Tư vấn miễn phí', 'content'],
            ['process1_desc', 'Trò chuyện 30 phút (online hoặc gặp trực tiếp) để hiểu phong cách, ngân sách và mong muốn của cặp đôi.', 'content'],
            ['process2_title', 'Khảo sát & lên kế hoạch', 'content'],
            ['process2_desc', 'Khảo sát địa điểm thực tế, lên timeline chi tiết theo lịch trình lễ cưới, chuẩn bị phương án dự phòng thời tiết.', 'content'],
            ['process3_title', 'Tác nghiệp ngày cưới', 'content'],
            ['process3_desc', 'Ekip có mặt đúng giờ, ghi lại toàn bộ hành trình từ chuẩn bị đến tiệc tối theo đúng timeline đã thống nhất.', 'content'],
            ['process4_title', 'Bàn giao & hậu mãi', 'content'],
            ['process4_desc', 'Chỉnh sửa và bàn giao đúng hạn cam kết, hỗ trợ chỉnh sửa thêm miễn phí trong 15 ngày sau bàn giao.', 'content'],
            ['pricing_sub', 'Giá áp dụng cho khu vực Đà Lạt & lân cận. Chụp ngoại tỉnh (Phú Quốc, Hà Nội, Hội An...) sẽ được báo giá riêng kèm chi phí di chuyển thực tế.', 'content'],
            ['services_fb_title', 'Chưa chắc chọn gói nào?<br>Cứ *trò chuyện* với tôi trước', 'content'],
            ['services_fb_sub', 'Buổi tư vấn 30 phút hoàn toàn miễn phí — tôi sẽ giúp bạn chọn gói phù hợp nhất với ngân sách và mong muốn.', 'content'],
            ['services_fb_image', 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1600&q=70&auto=format&fit=crop', 'content'],

            // ── Nội dung trang — Về tôi ──
            ['about_hero_title', 'Lê Minh Đăng — *Nhiếp ảnh gia cưới*', 'content'],
            ['about_hero_sub', '9 năm cầm máy, hơn 260 đám cưới, và một niềm tin không đổi: ảnh cưới đẹp nhất khi không ai phải diễn.', 'content'],
            ['about_bio_label', 'Câu chuyện của tôi', 'content'],
            ['about_bio_title', 'Từ một chiếc máy phim cũ đến 260 đám cưới', 'content'],
            ['about_bio_text1', 'Tôi bắt đầu chụp ảnh năm 2016 bằng một chiếc máy phim mượn của chú, ban đầu chỉ chụp phong cảnh Đà Lạt để bán postcard cho khách du lịch. Cơ duyên đến khi một người bạn nhờ chụp đám cưới vì "thấy ảnh phong cảnh của Đăng có cảm xúc thật". Sau buổi đó, tôi nhận ra: chụp cưới không phải là tạo ra ảnh đẹp, mà là giữ lại đúng cảm xúc đang trôi qua.', 'content'],
            ['about_bio_text2', 'Từ đó tôi chuyển hẳn sang chụp ảnh cưới toàn thời gian, xây dựng phong cách riêng dựa trên ánh sáng tự nhiên và storytelling không dàn dựng — thứ mà đến giờ vẫn là nguyên tắc cốt lõi trong mọi buổi chụp của tôi và ekip.', 'content'],
            ['about_bio_image', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700&q=80&auto=format&fit=crop', 'content'],
            ['timeline1_year', '2016', 'content'], ['timeline1_title', 'Bắt đầu với máy phim mượn', 'content'], ['timeline1_text', 'Chụp phong cảnh Đà Lạt bán cho khách du lịch, nhận buổi chụp cưới đầu tiên từ lời giới thiệu của bạn bè.', 'content'],
            ['timeline2_year', '2018', 'content'], ['timeline2_title', 'Chuyển hẳn sang chụp cưới toàn thời gian', 'content'], ['timeline2_text', 'Nghỉ công việc văn phòng, mở studio nhỏ đầu tiên tại Đà Lạt, tập trung phát triển phong cách ánh sáng tự nhiên.', 'content'],
            ['timeline3_year', '2020', 'content'], ['timeline3_title', 'Mở rộng ra Destination Wedding', 'content'], ['timeline3_text', 'Nhận những dự án ngoại tỉnh đầu tiên tại Phú Quốc và Hội An, xây dựng quy trình khảo sát địa điểm bài bản.', 'content'],
            ['timeline4_year', '2022', 'content'], ['timeline4_title', 'Cột mốc 150 đám cưới', 'content'], ['timeline4_text', 'Xây dựng ekip cố định 4 người, bắt đầu hợp tác thường xuyên với các wedding planner tại Đà Lạt và Sài Gòn.', 'content'],
            ['timeline5_year', '2024', 'content'], ['timeline5_title', 'Vượt mốc 250 đám cưới', 'content'], ['timeline5_text', 'Mở rộng dịch vụ quay phim cưới, đầu tư thiết bị chuyên nghiệp cho cả ảnh và video đồng bộ.', 'content'],
            ['timeline6_year', '2026', 'content'], ['timeline6_title', 'Hiện tại — 260+ đám cưới', 'content'], ['timeline6_text', 'Tiếp tục hành trình với ekip 4 người cố định, phục vụ khắp 45+ tỉnh thành trên cả nước.', 'content'],
            ['equipment1_name', 'Thân máy chính', 'content'], ['equipment1_meta', '2 thân máy full-frame mirrorless, dự phòng song song', 'content'],
            ['equipment2_name', 'Ống kính khẩu lớn', 'content'], ['equipment2_meta', 'Bộ ống kính prime f/1.2–f/1.8, tối ưu ánh sáng yếu & xóa phông', 'content'],
            ['equipment3_name', 'Thiết bị quay phim', 'content'], ['equipment3_meta', 'Máy quay 4K, gimbal chống rung, mic thu âm không dây', 'content'],
            ['equipment4_name', 'Ánh sáng bổ trợ', 'content'], ['equipment4_meta', 'Đèn LED cầm tay, phản quang gấp gọn — chỉ dùng khi thật cần thiết', 'content'],
            ['equipment5_name', 'Hậu kỳ & màu phim', 'content'], ['equipment5_meta', 'Quy trình chỉnh màu riêng mô phỏng chất phim analog, không dùng preset đại trà', 'content'],
            ['equipment6_name', 'Backup dữ liệu', 'content'], ['equipment6_meta', 'Sao lưu 3 lớp ngay trong ngày chụp — ổ cứng gắn ngoài, cloud, và thẻ nhớ gốc lưu riêng', 'content'],
            ['about_fb_title', 'Cùng nhau kể câu chuyện<br>của *bạn*', 'content'],
            ['about_fb_sub', 'Tôi luôn dành thời gian gặp trực tiếp trước mỗi lễ cưới — để hiểu bạn, chứ không chỉ để chụp bạn.', 'content'],
            ['about_fb_image', 'https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=1600&q=70&auto=format&fit=crop', 'content'],

            // ── Nội dung trang — Liên hệ ──
            ['contact_hero_title', 'Kể tôi nghe về *ngày cưới* của bạn', 'content'],
            ['contact_hero_sub', 'Điền thông tin bên dưới hoặc liên hệ trực tiếp — tôi sẽ phản hồi trong vòng 24 giờ để sắp xếp buổi tư vấn miễn phí.', 'content'],

            // ── Pháp lý ──
            ['legal_updated', '01/07/2026', 'legal'],
            ['privacy_content', "<h2>1. Thông tin chúng tôi thu thập</h2><p>Khi bạn liên hệ tư vấn hoặc đặt lịch chụp ảnh, Đăng Photography thu thập các thông tin sau: họ tên, số điện thoại, email, ngày dự kiến tổ chức lễ cưới, địa điểm và nội dung lời nhắn bạn cung cấp qua form liên hệ. Chúng tôi không thu thập thông tin thanh toán trực tiếp trên website — mọi giao dịch được thực hiện qua chuyển khoản hoặc trao đổi trực tiếp.</p><h2>2. Mục đích sử dụng thông tin</h2><ul><li>Liên hệ tư vấn và xác nhận lịch chụp ảnh cưới</li><li>Gửi báo giá, hợp đồng và các tài liệu liên quan đến dự án</li><li>Gửi bản xem trước ảnh/video và bàn giao sản phẩm cuối cùng</li><li>Gửi thông tin ưu đãi đặt lịch sớm (chỉ khi bạn đăng ký nhận tin qua form footer)</li></ul><h2>3. Sử dụng và chia sẻ hình ảnh</h2><p>Toàn bộ ảnh và video từ lễ cưới của bạn thuộc quyền sở hữu bản quyền của nhiếp ảnh gia theo Luật Sở hữu trí tuệ Việt Nam, đồng thời bạn được cấp quyền sử dụng trọn đời cho mục đích cá nhân. Chúng tôi chỉ đăng tải hình ảnh lên website, mạng xã hội hoặc hồ sơ năng lực khi có sự đồng ý rõ ràng từ bạn — nếu bạn không muốn ảnh cưới của mình xuất hiện công khai, vui lòng thông báo trước hoặc sau buổi chụp, chúng tôi sẽ tôn trọng tuyệt đối.</p><h2>4. Bảo mật dữ liệu</h2><p>Thông tin cá nhân và dữ liệu ảnh/video được lưu trữ trên hệ thống backup 3 lớp (ổ cứng gắn ngoài, cloud lưu trữ mã hoá, thẻ nhớ gốc) và chỉ được truy cập bởi thành viên ekip trực tiếp phụ trách dự án của bạn. Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba vì mục đích thương mại.</p><h2>5. Thời gian lưu trữ</h2><p>File ảnh gốc và ảnh đã chỉnh sửa được lưu trữ tối thiểu 12 tháng sau ngày bàn giao để phòng trường hợp bạn cần yêu cầu in lại hoặc gửi lại. Sau thời gian này, dữ liệu có thể được xoá khỏi hệ thống lưu trữ chính — chúng tôi khuyến khích bạn sao lưu file đã nhận về thiết bị cá nhân.</p><h2>6. Quyền của bạn</h2><p>Bạn có quyền yêu cầu chúng tôi cung cấp, chỉnh sửa hoặc xoá thông tin cá nhân đã cung cấp bất kỳ lúc nào bằng cách liên hệ qua email hoặc số điện thoại tại trang Liên hệ. Yêu cầu gỡ ảnh khỏi các kênh công khai (website, mạng xã hội) sẽ được xử lý trong vòng 7 ngày làm việc.</p><h2>7. Liên hệ</h2><p>Nếu có bất kỳ thắc mắc nào về chính sách bảo mật này, vui lòng liên hệ qua email hello@dangphotography.vn hoặc số điện thoại 090 000 0000.</p>", 'legal'],
            ['terms_content', "<h2>1. Phạm vi dịch vụ</h2><p>Đăng Photography cung cấp dịch vụ chụp ảnh và quay phim cưới theo 3 gói: Cơ Bản, Nâng Cao và Trọn Gói — chi tiết từng gói được công bố tại trang Dịch vụ. Phạm vi công việc cụ thể (số giờ tác nghiệp, số lượng ảnh bàn giao, hạng mục kèm theo) được xác nhận bằng văn bản trong hợp đồng trước ngày chụp.</p><h2>2. Đặt lịch & giữ chỗ</h2><p>Lịch chụp chỉ được xác nhận chính thức sau khi khách hàng đặt cọc tối thiểu 30% giá trị gói dịch vụ. Mỗi ngày, Đăng Photography chỉ nhận tối đa 1 lễ cưới để đảm bảo chất lượng tác nghiệp — vì vậy các ngày cao điểm (cuối tuần, mùa cưới tháng 10–12 và tháng 3–4) nên được đặt trước tối thiểu 2 tháng.</p><h2>3. Thanh toán</h2><ul><li>Đợt 1: Đặt cọc 30% khi ký hợp đồng giữ lịch</li><li>Đợt 2: Thanh toán 40% trước ngày chụp 7 ngày</li><li>Đợt 3: Thanh toán 30% còn lại khi nhận bàn giao sản phẩm hoàn chỉnh</li></ul><p>Hình thức thanh toán chấp nhận chuyển khoản ngân hàng hoặc tiền mặt, có xuất biên nhận/hóa đơn đầy đủ theo yêu cầu.</p><h2>4. Chính sách huỷ và dời lịch</h2><p>Trường hợp khách hàng huỷ lịch sau khi đã đặt cọc, khoản cọc sẽ không được hoàn lại do đã ảnh hưởng đến khả năng nhận dự án khác trong cùng ngày. Khách hàng được quyền dời lịch miễn phí 1 lần nếu thông báo trước tối thiểu 14 ngày; các lần dời lịch tiếp theo hoặc thông báo cận ngày sẽ áp dụng phí điều chỉnh 10% giá trị gói dịch vụ.</p><h2>5. Thời gian bàn giao</h2><p>Thời gian bàn giao ảnh/video hoàn chỉnh theo đúng cam kết của từng gói (7–15 ngày làm việc kể từ ngày chụp), không tính các ngày lễ Tết. Trường hợp có sự cố bất khả kháng ảnh hưởng tiến độ, Đăng Photography sẽ chủ động thông báo và thống nhất mốc thời gian mới với khách hàng.</p><h2>6. Bản quyền hình ảnh</h2><p>Toàn bộ ảnh và video thuộc bản quyền của nhiếp ảnh gia theo quy định pháp luật Việt Nam về Sở hữu trí tuệ. Khách hàng được cấp quyền sử dụng trọn đời cho mục đích cá nhân (in ấn, chia sẻ mạng xã hội, làm album gia đình) nhưng không được sử dụng cho mục đích thương mại nếu chưa có sự đồng ý bằng văn bản từ Đăng Photography.</p><h2>7. Trách nhiệm các bên</h2><p>Đăng Photography cam kết tác nghiệp đúng timeline đã thống nhất, sử dụng thiết bị dự phòng để giảm thiểu rủi ro kỹ thuật. Khách hàng có trách nhiệm cung cấp thông tin lịch trình chính xác và thông báo sớm mọi thay đổi để ekip kịp điều chỉnh phương án tác nghiệp.</p><h2>8. Giải quyết tranh chấp</h2><p>Mọi tranh chấp phát sinh sẽ được ưu tiên giải quyết thông qua thương lượng trực tiếp giữa hai bên. Trường hợp không đạt được thoả thuận, tranh chấp sẽ được giải quyết theo quy định pháp luật hiện hành của Việt Nam.</p>", 'legal'],

            // ── SMTP ──
            ['smtp_host', '', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from_name', 'Đăng Photography', 'smtp'],
            ['smtp_from_email', '', 'smtp'],

            // ── Nâng cao ──
            ['maintenance_mode', '0', 'system'],
            ['items_per_page', '20', 'system'],

            // ── Cloudinary ──
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key', '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],

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
        // Nút accent "Xem dự án" -> /du-an GIỐNG NHAU cả 4 slide (hardcode trong HeroSlider.tsx).
        // button_text/button_link ở đây CHỈ dùng cho nút outline (biến đổi theo slide).
        // subtitle format: "<nhãn eyebrow>||<đoạn mô tả>". image: 5 URL nối bằng "\n".
        $slides = [
            [
                'title' => 'Ảnh cưới kể chuyện tình yêu *thật*',
                'subtitle' => "Wedding Story · Đà Lạt||9 năm ghi lại khoảnh khắc chân thật của hơn 260 đám cưới khắp Việt Nam — ánh sáng tự nhiên, cảm xúc không dàn dựng.",
                'button_text' => 'Đặt lịch tư vấn',
                'button_link' => '/lien-he',
                'image' => implode("\n", [
                    'https://images.unsplash.com/photo-1519741497674-611481863552?w=700&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=500&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1521543387479-a9e5c4faa7a1?w=700&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80&auto=format&fit=crop',
                ]),
                'sort_order' => 1,
            ],
            [
                'title' => 'Mỗi khung hình là một *ký ức*',
                'subtitle' => "Pre-wedding · Hội An||Bộ ảnh pre-wedding phong cách phim xưa tại phố cổ Hội An — ánh đèn lồng, mái ngói rêu phong, từng góc phố kể chuyện tình yêu theo cách riêng.",
                'button_text' => 'Xem bảng giá',
                'button_link' => '/dich-vu',
                'image' => implode("\n", [
                    'https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=700&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=500&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=500&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=700&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1509927083803-4bd519298ac4?w=500&q=80&auto=format&fit=crop',
                ]),
                'sort_order' => 2,
            ],
            [
                'title' => 'Ghi lại ngày trọng đại *không dàn dựng*',
                'subtitle' => "Destination Wedding · Phú Quốc||Đám cưới bên bờ biển Phú Quốc — nắng, gió, tiếng sóng và những giọt nước mắt hạnh phúc thật sự, không có một khoảnh khắc nào bị đạo diễn.",
                'button_text' => 'Đặt lịch tư vấn',
                'button_link' => '/lien-he',
                'image' => implode("\n", [
                    'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=700&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=500&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=500&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=700&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80&auto=format&fit=crop',
                ]),
                'sort_order' => 3,
            ],
            [
                'title' => 'Từ lễ gia tiên đến tiệc cưới *trọn vẹn*',
                'subtitle' => "Lễ cưới truyền thống · Sài Gòn||Trọn vẹn hành trình một ngày cưới — từ lễ vu quy, đón dâu, gia tiên đến tiệc tối — ghi lại đầy đủ cảm xúc của cả hai gia đình.",
                'button_text' => 'Xem gói dịch vụ',
                'button_link' => '/dich-vu',
                'image' => implode("\n", [
                    'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=700&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=500&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1519741497674-611481863552?w=700&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80&auto=format&fit=crop',
                ]),
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
