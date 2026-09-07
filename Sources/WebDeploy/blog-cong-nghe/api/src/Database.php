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
            ['site_name', 'PIXEL.', 'general'],
            ['site_tagline', 'Blog Công Nghệ', 'general'],
            ['site_description', 'PIXEL. — blog công nghệ cập nhật tin tức, đánh giá sản phẩm và thủ thuật hữu ích mỗi ngày. Nội dung chọn lọc, không giật tít.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'bientap@pixelblog.vn', 'general'],
            ['site_phone', '098 123 45 67', 'general'],
            ['site_address', 'Tầng 5, tòa Innotech, số 39A Ngô Quyền, Cầu Giấy, Hà Nội', 'general'],
            ['working_hours', '8:00 - 18:00, Thứ 2 - Thứ 6', 'general'],
            // seo
            ['meta_title', 'PIXEL. — Blog Công Nghệ | Tin tức, đánh giá & thủ thuật công nghệ', 'seo'],
            ['meta_description', 'PIXEL. — blog công nghệ cập nhật tin tức, đánh giá sản phẩm và thủ thuật hữu ích mỗi ngày. Nội dung chọn lọc, không giật tít.', 'seo'],
            ['meta_keywords', 'blog công nghệ, tin tức công nghệ, đánh giá sản phẩm, thủ thuật, AI, bảo mật', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=70', 'seo'],
            // social
            ['facebook', '', 'social'],
            ['twitter_x', '', 'social'],
            ['youtube', '', 'social'],
            ['tiktok', '', 'social'],
            ['zalo', '', 'social'],
            // footer
            ['footer_copyright', '© 2026 PIXEL. Blog Công Nghệ. Mọi quyền được bảo lưu.', 'footer'],
            ['footer_description', 'Blog công nghệ độc lập — cập nhật tin tức, đánh giá sản phẩm và thủ thuật hữu ích mỗi ngày, viết bởi người thật dùng thật.', 'footer'],
            // contact
            ['contact_email', 'bientap@pixelblog.vn', 'contact'],
            ['contact_ads_email', 'quangcao@pixelblog.vn', 'contact'],
            ['contact_hotline', '098 123 45 67', 'contact'],
            ['contact_hours', '3-5 ngày làm việc đối với bài viết cộng tác', 'contact'],
            ['map_embed', 'https://maps.google.com/maps?q=21.0378,105.7826&hl=vi&z=15&output=embed', 'contact'],
            // smtp
            ['smtp_host', 'smtp.gmail.com', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_password', '', 'smtp'],
            ['smtp_from_name', 'PIXEL. Blog Công Nghệ', 'smtp'],
            ['smtp_from_email', '', 'smtp'],
            // system
            ['maintenance_mode', '0', 'system'],
            ['maintenance_message', 'Website đang bảo trì, vui lòng quay lại sau.', 'system'],
            // legal (trang Chính sách bảo mật / Điều khoản sử dụng)
            ['legal_updated', '01/08/2026', 'legal'],
            ['privacy_content', '<p>PIXEL. ("chúng tôi") tôn trọng quyền riêng tư của độc giả. Chính sách này giải thích rõ chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân như thế nào khi bạn truy cập và sử dụng blog công nghệ PIXEL.</p><h2>1. Thông tin chúng tôi thu thập</h2><ul><li>Email khi bạn đăng ký nhận bản tin công nghệ hàng tuần.</li><li>Họ tên, email và nội dung tin nhắn khi bạn gửi form liên hệ hoặc bài viết cộng tác.</li><li>Dữ liệu truy cập ẩn danh (trang xem, thời gian trên trang, thiết bị) nhằm cải thiện trải nghiệm đọc.</li><li>Bình luận công khai bạn để lại dưới bài viết (nếu tính năng bình luận được kích hoạt).</li></ul><h2>2. Mục đích sử dụng thông tin</h2><p>Chúng tôi chỉ sử dụng thông tin thu thập được để: gửi bản tin công nghệ định kỳ, phản hồi yêu cầu liên hệ/hợp tác, cải thiện chất lượng nội dung dựa trên hành vi đọc tổng hợp (ẩn danh), và tuân thủ nghĩa vụ pháp lý khi có yêu cầu từ cơ quan chức năng.</p><h2>3. Chia sẻ thông tin với bên thứ ba</h2><p>PIXEL. không bán, cho thuê hay trao đổi thông tin cá nhân của độc giả cho bất kỳ bên thứ ba nào vì mục đích thương mại. Thông tin chỉ được chia sẻ với các nhà cung cấp dịch vụ kỹ thuật (gửi email bản tin, phân tích lưu lượng truy cập) theo mức độ cần thiết tối thiểu để vận hành blog.</p><h2>4. Cookie &amp; công nghệ theo dõi</h2><p>PIXEL. sử dụng cookie để ghi nhớ tùy chọn hiển thị và đo lường lượt truy cập ẩn danh. Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy nhiên một số tính năng có thể hoạt động không như mong đợi.</p><h2>5. Quyền của độc giả</h2><p>Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân mà PIXEL. đang lưu trữ, cũng như hủy đăng ký nhận bản tin bất cứ lúc nào chỉ với 1 cú nhấp trong email. Mọi yêu cầu vui lòng gửi qua trang Liên hệ.</p><h2>6. Bảo mật dữ liệu</h2><p>Chúng tôi áp dụng các biện pháp kỹ thuật hợp lý để bảo vệ thông tin bạn cung cấp khỏi truy cập trái phép. Tuy nhiên, không có phương thức truyền tải nào qua Internet là an toàn tuyệt đối 100%.</p><h2>7. Thay đổi chính sách</h2><p>Chính sách này có thể được cập nhật theo thời gian. Phiên bản mới nhất luôn được đăng tại trang này kèm ngày cập nhật.</p>', 'legal'],
            ['terms_content', '<p>Bằng việc truy cập và sử dụng website PIXEL. ("chúng tôi", "PIXEL."), bạn đồng ý tuân thủ các điều khoản sử dụng dưới đây. Vui lòng đọc kỹ trước khi tiếp tục sử dụng nội dung trên blog.</p><h2>1. Bản quyền nội dung</h2><p>Toàn bộ bài viết, hình ảnh minh họa, biểu đồ so sánh và video trên PIXEL. thuộc bản quyền của PIXEL. hoặc tác giả cộng tác, trừ khi có ghi chú khác. Bạn được phép trích dẫn tối đa 150 từ kèm liên kết dẫn nguồn rõ ràng về bài viết gốc cho mục đích phi thương mại. Sao chép toàn văn hoặc sử dụng cho mục đích thương mại cần có sự đồng ý bằng văn bản từ PIXEL.</p><h2>2. Tính chính xác của nội dung</h2><p>PIXEL. nỗ lực đảm bảo thông tin, số liệu kỹ thuật và kết quả đánh giá sản phẩm được cập nhật chính xác tại thời điểm đăng bài. Tuy nhiên, thông số sản phẩm, giá bán và tình trạng phần mềm có thể thay đổi theo thời gian mà không có thông báo trước từ nhà sản xuất — độc giả nên kiểm tra thông tin mới nhất trước khi ra quyết định mua sắm.</p><h2>3. Đánh giá sản phẩm &amp; nội dung tài trợ</h2><p>Các bài đánh giá sản phẩm phản ánh trải nghiệm thực tế và quan điểm độc lập của đội ngũ PIXEL., không bị chi phối bởi việc sản phẩm có được nhãn hàng gửi tặng/cho mượn để thử nghiệm hay không. Mọi bài viết có yếu tố hợp tác thương mại đều được gắn nhãn "Có tài trợ" rõ ràng ngay đầu bài.</p><h2>4. Quy tắc bình luận</h2><p>Chúng tôi khuyến khích thảo luận văn minh, đúng chủ đề dưới mỗi bài viết. PIXEL. có quyền ẩn hoặc xóa bình luận có nội dung công kích cá nhân, phát ngôn thù ghét, spam liên kết/quảng cáo không liên quan mà không cần thông báo trước.</p><h2>5. Giới hạn trách nhiệm</h2><p>PIXEL. không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp hay gián tiếp nào phát sinh từ quyết định mua sắm hoặc sử dụng sản phẩm/dịch vụ dựa trên nội dung đăng tải trên blog. Nội dung mang tính tham khảo, không thay thế cho việc tự tìm hiểu và kiểm chứng của người đọc.</p><h2>6. Liên kết đến website bên thứ ba</h2><p>PIXEL. có thể chứa liên kết đến các website bên thứ ba (nhà bán lẻ, nhà sản xuất...). Chúng tôi không kiểm soát và không chịu trách nhiệm về nội dung, chính sách bảo mật của các website này.</p><h2>7. Thay đổi điều khoản</h2><p>PIXEL. có quyền cập nhật điều khoản sử dụng theo thời gian. Phiên bản áp dụng luôn là phiên bản mới nhất được đăng công khai tại trang này.</p>', 'legal'],
            // about (trang "Về tôi")
            ['about_title', 'Tôi là Đăng Khoa, người viết ra PIXEL.', 'about'],
            ['about_text1', 'Tôi bắt đầu sự nghiệp là kỹ sư kiểm thử phần cứng tại một công ty gia công linh kiện điện tử, trước khi nhận ra mình thích giải thích công nghệ hơn là chỉ kiểm tra nó. Năm 2022, PIXEL. ra đời từ một blog cá nhân viết vào cuối tuần — và giờ đã trở thành nơi hơn 32.000 độc giả ghé qua mỗi tuần để đọc tin tức, đánh giá và thủ thuật công nghệ được viết một cách trung thực nhất có thể.', 'about'],
            ['about_text2', 'Tôi tin rằng một bài đánh giá tốt không cần tô hồng sản phẩm để lấy lòng nhãn hàng, cũng không cần giật tít để câu lượt xem. Nó chỉ cần trung thực, có dẫn chứng, và giúp người đọc ra quyết định đúng cho chính mình.', 'about'],
            ['about_photo', 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=700&auto=format&fit=crop&q=75', 'about'],
            // stats (thanh số liệu trang chủ — stats_posts tính realtime từ COUNT(*), không seed ở đây)
            ['stats_monthly_reads', '850', 'stats'],
            ['stats_newsletter_subs', '32', 'stats'],
            ['stats_years_active', '6', 'stats'],
            // cloudinary
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key', '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            ['cloudinary_folder', 'webdrop', 'cloudinary'],
            // integrations
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
        // subtitle format: "label||mô tả||nhãn ảnh||chữ nút chính||link nút chính"
        // button_text/button_link (cột core) = nút phụ (outline)
        $slides = [
            [
                'title' => 'Cập nhật *công nghệ* mỗi ngày, đúng trọng tâm',
                'subtitle' => 'Công nghệ hôm nay||Tin tức, đánh giá và thủ thuật công nghệ được chọn lọc kỹ càng — không giật tít, không lan man, chỉ những gì đáng đọc.||Mới cập nhật||Đọc bài mới nhất||/bai-viet/ben-trong-nha-may-chip-2nm',
                'button_text' => 'Xem chuyên mục',
                'button_link' => '/chuyen-muc',
                'image' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&auto=format&fit=crop&q=70',
                'sort_order' => 1,
            ],
            [
                'title' => 'AI tạo sinh đang định hình lại cách chúng ta làm việc',
                'subtitle' => 'AI & Lập trình||Phân tích chuyên sâu các xu hướng AI, mô hình ngôn ngữ lớn và công cụ lập trình đáng chú ý nhất năm 2026.||AI & Xu hướng||Xem bài phân tích||/chuyen-muc?cat=ai-xu-huong',
                'button_text' => 'Về tôi',
                'button_link' => '/ve-toi',
                'image' => 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=700&auto=format&fit=crop&q=70',
                'sort_order' => 2,
            ],
            [
                'title' => 'Đánh giá trung thực trước khi bạn xuống tiền',
                'subtitle' => 'Đánh giá thiết bị||Từ smartphone, laptop đến thiết bị đeo thông minh — thử nghiệm thực tế nhiều tuần, chấm điểm rõ ràng theo từng tiêu chí.||Review||Xem đánh giá||/danh-gia-san-pham',
                'button_text' => 'Bảng so sánh',
                'button_link' => '/danh-gia-san-pham#bcn-compare',
                'image' => 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=700&auto=format&fit=crop&q=70',
                'sort_order' => 3,
            ],
            [
                'title' => 'Bảo mật dữ liệu không còn là chuyện của riêng ai',
                'subtitle' => 'Bảo mật & Hạ tầng||Hướng dẫn thực tế giúp bạn và doanh nghiệp nhỏ an toàn hơn trước rủi ro an ninh mạng ngày càng tinh vi.||Bảo mật||Đọc thủ thuật||/chuyen-muc?cat=bao-mat',
                'button_text' => 'Liên hệ hợp tác',
                'button_link' => '/lien-he',
                'image' => 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=700&auto=format&fit=crop&q=70',
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

    protected function seedExtensions(): void {
        $this->seedPostCategories();
        $this->seedPosts();
        $this->seedFaqs();
    }

    private function seedPostCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM post_categories") > 0) return;
        $cats = [
            ['Tin tức công nghệ', 'tin-tuc', 'bi-broadcast', 1],
            ['Đánh giá sản phẩm', 'danh-gia', 'bi-star', 2],
            ['Thủ thuật & Mẹo', 'thu-thuat', 'bi-lightbulb', 3],
            ['AI & Xu hướng', 'ai-xu-huong', 'bi-cpu', 4],
            ['Bảo mật', 'bao-mat', 'bi-shield-lock', 5],
            ['Di động', 'di-dong', 'bi-phone', 6],
        ];
        foreach ($cats as [$name, $slug, $icon, $order]) {
            $this->execute(
                "INSERT INTO post_categories (name, slug, icon, sort_order) VALUES (?, ?, ?, ?)",
                [$name, $slug, $icon, $order]
            );
        }
    }

    private function catId(string $slug): ?int {
        $id = $this->scalar("SELECT id FROM post_categories WHERE slug = ?", [$slug]);
        return $id !== false && $id !== null ? (int)$id : null;
    }

    private function seedPosts(): void {
        if ($this->scalar("SELECT COUNT(*) FROM posts") > 0) return;

        $DK = ['Đăng Khoa', 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&auto=format&fit=crop&q=70', 'Biên tập viên công nghệ',
            'Biên tập viên công nghệ tại PIXEL., theo dõi mảng bán dẫn và phần cứng máy tính hơn 6 năm. Từng là kỹ sư kiểm thử phần cứng trước khi chuyển sang viết lách toàn thời gian.'];
        $TH = ['Thu Hà', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&auto=format&fit=crop&q=70', 'Biên tập viên thủ thuật & bảo mật',
            'Biên tập viên thủ thuật & bảo mật tại PIXEL., đồng hành cùng chuyên mục này từ năm 2024, phụ trách mảng thủ thuật hệ điều hành và an toàn thông tin.'];

        $chip2nmContent = <<<'HTML'
<p>Giữa năm 2026, cụm từ "2 nanomet" xuất hiện dày đặc trong các buổi công bố kết quả kinh doanh của TSMC, Samsung và Intel. Đây không đơn thuần là một con số kỹ thuật — nó là ranh giới quyết định ai sẽ làm chủ thế hệ chip tiếp theo cho smartphone, laptop và cả trung tâm dữ liệu AI. Bài viết này sẽ giải thích vì sao tiến trình 2nm quan trọng đến vậy, và điều gì đang thực sự diễn ra bên trong các nhà máy trị giá hàng chục tỷ đô la.</p>
<h2 id="vi-sao">Vì sao 2nm lại là cột mốc quan trọng</h2>
<p>Mỗi khi tiến trình sản xuất chip thu nhỏ hơn, số lượng bóng bán dẫn có thể nhồi vào cùng một diện tích silicon tăng lên đáng kể — kéo theo hiệu năng cao hơn và mức tiêu thụ điện thấp hơn. So với tiến trình 3nm hiện tại, chip 2nm được kỳ vọng cải thiện khoảng 15% tốc độ xử lý hoặc giảm tới 25-30% điện năng tiêu thụ ở cùng mức hiệu năng — con số cực kỳ ý nghĩa với các thiết bị chạy pin như smartphone và laptop mỏng nhẹ.</p>
<p>Điểm khác biệt lớn nhất ở thế hệ 2nm là việc chuyển từ kiến trúc bóng bán dẫn FinFET sang <strong>Gate-All-Around (GAA)</strong> — cho phép dòng điện được kiểm soát chính xác hơn từ mọi phía của kênh dẫn, giảm thất thoát điện năng vốn là vấn đề nan giải khi tiến trình càng thu nhỏ.</p>
<blockquote>"2nm không chỉ là bước tiến kỹ thuật — nó là bài kiểm tra xem công ty nào đủ vốn, đủ kiên nhẫn để tiếp tục cuộc chơi bán dẫn trong 5 năm tới." — nhận định từ một kỹ sư thiết kế chip giấu tên tại Đài Loan.</blockquote>
<h2 id="ai-dan-dau">Ai đang dẫn đầu cuộc đua?</h2>
<p><strong>TSMC</strong> hiện vẫn giữ vị trí dẫn đầu về sản lượng, với nhà máy N2 tại Tân Trúc và Cao Hùng đã bắt đầu sản xuất đại trà từ cuối 2025, phục vụ trước tiên cho các khách hàng lớn như Apple và AMD. <strong>Samsung Foundry</strong> đặt cược vào việc là hãng đầu tiên áp dụng GAA từ tiến trình 3nm, và đang tận dụng kinh nghiệm đó để đẩy nhanh tiến trình 2nm (SF2) nhắm vào cả khách hàng di động lẫn trung tâm dữ liệu. Trong khi đó, <strong>Intel</strong> đặt toàn bộ tham vọng phục hồi vào tiến trình 18A (tương đương khoảng 1.8nm) với công nghệ cấp điện mặt sau (backside power) độc quyền — một canh bạc lớn để giành lại vị thế dẫn đầu công nghệ đã đánh mất suốt gần một thập kỷ.</p>
<ul>
<li><strong>TSMC N2</strong> — sản lượng lớn nhất, giá thành sản xuất cao nhất, khách hàng chủ lực: Apple, AMD, Qualcomm.</li>
<li><strong>Samsung SF2</strong> — kinh nghiệm GAA lâu năm, giá cạnh tranh hơn, đang tìm cách thu hút thêm khách hàng ngoài Samsung Electronics.</li>
<li><strong>Intel 18A</strong> — công nghệ cấp điện mặt sau độc đáo, mục tiêu giành lại đơn hàng gia công (foundry) từ bên thứ ba.</li>
</ul>
<div class="bcn-article-gallery">
<img src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=500&auto=format&fit=crop&q=70" alt="Cận cảnh bảng mạch bán dẫn với các đường dẫn điện tử phức tạp">
<img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=70" alt="Laptop hiển thị sơ đồ thiết kế chip trong phòng nghiên cứu">
<img src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=500&auto=format&fit=crop&q=70" alt="Thiết bị đo kiểm chính xác trong dây chuyền sản xuất bán dẫn">
</div>
<h2 id="tac-dong">Tác động đến người dùng cuối</h2>
<p>Với người dùng phổ thông, lợi ích rõ ràng nhất là thời lượng pin. Các mẫu smartphone flagship dùng chip 2nm dự kiến ra mắt cuối 2026 hoặc đầu 2027 được kỳ vọng kéo dài thời gian sử dụng thêm nửa ngày so với thế hệ hiện tại ở cùng dung lượng pin. Ở mảng laptop, hiệu năng xử lý AI on-device (chạy mô hình ngôn ngữ nhỏ ngay trên máy, không cần gửi lên cloud) sẽ tăng đáng kể — mở đường cho các tính năng như dịch thuật thời gian thực, tạo ảnh, và trợ lý ảo hoạt động mượt mà ngay cả khi không có kết nối mạng.</p>
<p>Ở quy mô lớn hơn, các trung tâm dữ liệu AI cũng hưởng lợi trực tiếp: chip 2nm giúp giảm chi phí điện năng vận hành — vốn đang chiếm tỷ trọng ngày càng lớn trong tổng chi phí huấn luyện các mô hình AI khổng lồ.</p>
<h2 id="thach-thuc">Thách thức phía trước</h2>
<p>Không phải mọi thứ đều thuận lợi. Chi phí xây dựng một nhà máy 2nm hiện đại đã vượt mốc 20 tỷ USD, và tỷ lệ chip đạt chuẩn trên mỗi tấm wafer (yield) trong giai đoạn đầu thường thấp hơn đáng kể so với tiến trình cũ đã ổn định. Điều này đồng nghĩa giá thành sản xuất chip 2nm ở giai đoạn đầu sẽ cao hơn 30-50% so với 3nm — và chi phí đó gần như chắc chắn sẽ được phản ánh vào giá bán thiết bị cuối cùng.</p>
<p>Bên cạnh đó, căng thẳng địa chính trị xoay quanh chuỗi cung ứng bán dẫn — đặc biệt là các quy định xuất khẩu thiết bị quang khắc EUV — tiếp tục là biến số khó lường, có thể làm chậm tiến độ mở rộng công suất tại một số khu vực.</p>
<h2 id="ket-luan">Kết luận</h2>
<p>Cuộc đua 2nm không chỉ là câu chuyện của riêng ba tập đoàn bán dẫn lớn nhất thế giới. Nó sẽ định hình trực tiếp trải nghiệm mà bạn có với chiếc điện thoại, laptop tiếp theo — và cả tốc độ phát triển của AI trong vài năm tới. PIXEL. sẽ tiếp tục theo dõi sát diễn biến này và cập nhật khi có thông tin chính thức từ các nhà sản xuất.</p>
HTML;

        $posts = [
            // ── Bài viết chung (13) ──────────────────────────────────────────
            [
                'cat' => 'tin-tuc', 'title' => 'Bên trong nhà máy chip 2nm: cuộc đua bán dẫn toàn cầu đang nóng lên thế nào',
                'slug' => 'ben-trong-nha-may-chip-2nm',
                'excerpt' => 'TSMC, Samsung và Intel đều dồn lực cho tiến trình 2nm trong năm 2026. Bài viết phân tích vì sao cuộc đua này quyết định tương lai của mọi thiết bị bạn dùng hàng ngày.',
                'content' => $chip2nmContent,
                'thumbnail' => 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&auto=format&fit=crop&q=75',
                'author' => $DK, 'tags' => 'bán dẫn,chip 2nm,AI,TSMC,Samsung,Intel',
                'featured' => 1, 'read_time' => 9, 'views' => 24600, 'created_at' => '2026-08-15 09:00:00',
                'meta_title' => 'Bên trong nhà máy chip 2nm: cuộc đua bán dẫn toàn cầu | PIXEL.',
                'meta_description' => 'TSMC, Samsung và Intel đều dồn lực cho tiến trình 2nm trong năm 2026. Vì sao cuộc đua bán dẫn này quyết định tương lai của mọi thiết bị bạn dùng hàng ngày.',
            ],
            [
                'cat' => 'ai-xu-huong', 'title' => 'Snapdragon 8 Elite Gen 2 lộ diện: bước nhảy vọt về hiệu năng AI',
                'slug' => 'snapdragon-8-elite-gen-2-lo-dien',
                'excerpt' => 'Chip flagship mới của Qualcomm hứa hẹn tăng 40% hiệu năng xử lý AI on-device so với thế hệ trước.',
                'content' => '<p>Qualcomm vừa vén màn Snapdragon 8 Elite Gen 2 — dòng chip flagship dành cho Android thế hệ tiếp theo, với trọng tâm gần như tuyệt đối dồn vào khả năng xử lý AI ngay trên thiết bị (on-device). Theo công bố chính thức, nhân NPU mới đạt hiệu năng cao hơn tới 40% so với Snapdragon 8 Elite thế hệ trước, trong khi mức tiêu thụ điện năng giảm khoảng 25%.</p><p>Điểm đáng chú ý nhất là khả năng chạy các mô hình ngôn ngữ lớn (LLM) tới 10 tỷ tham số hoàn toàn offline — mở đường cho các tính năng như dịch thuật thời gian thực, tóm tắt cuộc gọi và trợ lý ảo hoạt động mượt mà kể cả khi không có Internet. Qualcomm cho biết những chiếc smartphone flagship đầu tiên trang bị chip này sẽ ra mắt ngay trong quý IV/2026.</p><p>Với người dùng phổ thông, thay đổi lớn nhất có thể không nằm ở các bài benchmark, mà ở việc pin bền hơn dù xử lý nhiều tác vụ AI hơn — điều mà PIXEL. sẽ kiểm chứng ngay khi có thiết bị thương mại trong tay.</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&auto=format&fit=crop&q=75',
                'author' => $DK, 'tags' => 'Qualcomm,Snapdragon,AI,chip di động',
                'featured' => 0, 'read_time' => 6, 'views' => 8400, 'created_at' => '2026-08-12 10:00:00',
                'meta_title' => 'Snapdragon 8 Elite Gen 2 lộ diện | PIXEL.',
                'meta_description' => 'Chip flagship mới của Qualcomm hứa hẹn tăng 40% hiệu năng xử lý AI on-device so với thế hệ trước.',
            ],
            [
                'cat' => 'thu-thuat', 'title' => '5 thủ thuật tăng tốc Windows 11 không cần phần mềm thứ ba',
                'slug' => '5-thu-thuat-tang-toc-windows-11',
                'excerpt' => 'Chỉ với vài thao tác trong Settings, máy tính của bạn có thể khởi động nhanh hơn rõ rệt.',
                'content' => '<p>Không cần cài thêm bất kỳ phần mềm "dọn rác" nào, Windows 11 đã có sẵn đủ công cụ để bạn tối ưu tốc độ khởi động và vận hành máy. Dưới đây là 5 thao tác PIXEL. khuyên bạn thử ngay hôm nay.</p><p>1. Tắt bớt ứng dụng khởi động cùng Windows qua Task Manager → tab Startup. 2. Bật Storage Sense để tự động dọn file tạm. 3. Chuyển chế độ nguồn sang "Best performance" nếu máy đang cắm sạc. 4. Tắt hiệu ứng trong suốt (transparency effects) trong Settings → Personalization nếu máy cấu hình yếu. 5. Kiểm tra và gỡ các ứng dụng nền chạy ngầm không cần thiết trong Settings → Apps → Installed apps.</p><p>Áp dụng đủ 5 bước trên, nhiều máy cấu hình trung bình có thể giảm thời gian khởi động tới 20-30% mà không tốn một đồng nào.</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&auto=format&fit=crop&q=75',
                'author' => $TH, 'tags' => 'Windows 11,thủ thuật,tối ưu máy tính',
                'featured' => 0, 'read_time' => 5, 'views' => 6100, 'created_at' => '2026-08-10 08:30:00',
                'meta_title' => '5 thủ thuật tăng tốc Windows 11 | PIXEL.',
                'meta_description' => 'Chỉ với vài thao tác trong Settings, máy tính của bạn có thể khởi động nhanh hơn rõ rệt.',
            ],
            [
                'cat' => 'tin-tuc', 'title' => 'Google Gemini 3 chính thức ra mắt: đối thủ đáng gờm của GPT-5',
                'slug' => 'google-gemini-3-chinh-thuc-ra-mat',
                'excerpt' => 'Mô hình mới của Google vượt trội ở khả năng suy luận đa bước và xử lý video thời gian thực.',
                'content' => '<p>Google chính thức phát hành Gemini 3 sau nhiều tháng thử nghiệm nội bộ, định vị đây là đối thủ trực tiếp của GPT-5. Điểm nhấn lớn nhất nằm ở khả năng suy luận đa bước (multi-step reasoning) — Gemini 3 có thể tự chia nhỏ một bài toán phức tạp thành nhiều bước trung gian và tự kiểm tra lại kết quả trước khi trả lời.</p><p>Ngoài ra, Gemini 3 xử lý video thời gian thực tốt hơn hẳn phiên bản trước, cho phép mô tả, tóm tắt hoặc trả lời câu hỏi về nội dung video ngay khi đang phát — tính năng có thể tích hợp trực tiếp vào Google Meet và YouTube trong các bản cập nhật sắp tới.</p><p>Google cho biết Gemini 3 sẽ được triển khai dần vào các sản phẩm Workspace, Android và Search trong những tháng cuối năm 2026.</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=75',
                'author' => $DK, 'tags' => 'Google,Gemini,AI,mô hình ngôn ngữ',
                'featured' => 0, 'read_time' => 7, 'views' => 11200, 'created_at' => '2026-08-08 09:15:00',
                'meta_title' => 'Google Gemini 3 chính thức ra mắt | PIXEL.',
                'meta_description' => 'Mô hình mới của Google vượt trội ở khả năng suy luận đa bước và xử lý video thời gian thực.',
            ],
            [
                'cat' => 'danh-gia', 'title' => 'Đánh giá tai nghe chống ồn ANC thế hệ mới: đáng tiền hay không?',
                'slug' => 'danh-gia-tai-nghe-chong-on-anc-the-he-moi',
                'excerpt' => 'Chúng tôi đeo thử suốt 3 tuần làm việc để trả lời câu hỏi này một cách công tâm nhất.',
                'content' => '<p>Thị trường tai nghe chống ồn (ANC) tầm trung đang ngày càng chật chội, và thế hệ chip chống ồn mới nhất hứa hẹn thu hẹp khoảng cách với các mẫu cao cấp. Sau 3 tuần đeo liên tục khi làm việc tại nhà lẫn ở quán cà phê, đây là những gì chúng tôi ghi nhận được.</p><p>Khả năng chống ồn xử lý tốt tiếng ồn đều đều (quạt, máy lạnh, tiếng ồn đường phố) nhưng vẫn còn lọt một phần tiếng nói ở cường độ trung bình. Thời lượng pin thực tế đạt khoảng 28 giờ với ANC bật liên tục — khá ấn tượng ở tầm giá này. Chất âm được chỉnh cân bằng, dễ nghe cho nhiều thể loại nhạc, dù bass hơi nhẹ so với gu người thích âm trầm sâu.</p><p>Nhìn chung, đây là lựa chọn hợp lý nếu bạn cần một tai nghe ANC "vừa đủ dùng" cho công việc hàng ngày mà không muốn chi quá nhiều tiền.</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop&q=75',
                'author' => $TH, 'tags' => 'tai nghe,ANC,đánh giá,âm thanh',
                'featured' => 0, 'read_time' => 8, 'views' => 5300, 'created_at' => '2026-08-06 14:00:00',
                'meta_title' => 'Đánh giá tai nghe chống ồn ANC thế hệ mới | PIXEL.',
                'meta_description' => 'Chúng tôi đeo thử suốt 3 tuần làm việc để trả lời câu hỏi này một cách công tâm nhất.',
            ],
            [
                'cat' => 'bao-mat', 'title' => 'Lỗ hổng bảo mật zero-day trên Chrome: người dùng cần làm gì ngay?',
                'slug' => 'lo-hong-bao-mat-zero-day-tren-chrome',
                'excerpt' => 'Google đã phát hành bản vá khẩn cấp — nhưng bạn cần chủ động cập nhật ngay hôm nay.',
                'content' => '<p>Google vừa xác nhận một lỗ hổng zero-day nghiêm trọng trên trình duyệt Chrome, cho phép kẻ tấn công thực thi mã từ xa nếu người dùng truy cập một trang web độc hại được thiết kế riêng. Lỗ hổng đã được xếp mức độ nghiêm trọng cao và ghi nhận có bằng chứng bị khai thác trong thực tế.</p><p>Google đã phát hành bản vá khẩn cấp ngay sau khi phát hiện. Để tự bảo vệ, bạn nên: mở Chrome → menu ba chấm → Help → About Google Chrome để trình duyệt tự kiểm tra và cập nhật; khởi động lại trình duyệt ngay sau khi cập nhật xong (bản vá chỉ có hiệu lực sau khi restart); tránh nhấp vào các liên kết lạ trong lúc chờ cập nhật.</p><p>Đây không phải lần đầu Chrome dính lỗ hổng zero-day trong năm 2026 — PIXEL. khuyến nghị bật tính năng tự động cập nhật trình duyệt để không bỏ lỡ các bản vá quan trọng trong tương lai.</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=1200&auto=format&fit=crop&q=75',
                'author' => $DK, 'tags' => 'bảo mật,Chrome,zero-day,Google',
                'featured' => 0, 'read_time' => 6, 'views' => 9700, 'created_at' => '2026-08-04 11:00:00',
                'meta_title' => 'Lỗ hổng bảo mật zero-day trên Chrome | PIXEL.',
                'meta_description' => 'Google đã phát hành bản vá khẩn cấp — nhưng bạn cần chủ động cập nhật ngay hôm nay.',
            ],
            [
                'cat' => 'di-dong', 'title' => 'Trải nghiệm gập ba lần: điện thoại màn hình gập thế hệ tiếp theo',
                'slug' => 'trai-nghiem-gap-ba-lan-dien-thoai-man-hinh-gap',
                'excerpt' => 'Thiết kế bản lề mới giúp nếp gấp gần như biến mất — nhưng độ bền vẫn còn là dấu hỏi.',
                'content' => '<p>Sau nhiều năm hoàn thiện công nghệ gập đơn, các nhà sản xuất giờ đây bắt đầu thử nghiệm smartphone gập ba lần (tri-fold) — mở ra một màn hình lớn gần bằng máy tính bảng mini khi trải phẳng hoàn toàn. Chúng tôi đã có dịp trải nghiệm nhanh một mẫu máy thử nghiệm.</p><p>Điểm ấn tượng nhất là bản lề mới giúp nếp gấp gần như biến mất khi nhìn trực diện — một bước tiến lớn so với thế hệ gập đơn đầu tiên. Tuy nhiên với hai bản lề thay vì một, độ bền lâu dài vẫn là dấu hỏi lớn, đặc biệt với thói quen gập/mở hàng trăm lần mỗi ngày của người dùng thực tế.</p><p>Giá bán dự kiến cũng sẽ cao hơn đáng kể so với dòng gập đơn hiện tại — đây rõ ràng là sản phẩm dành cho nhóm người dùng sớm (early adopter) hơn là số đông trong giai đoạn đầu.</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&auto=format&fit=crop&q=75',
                'author' => $TH, 'tags' => 'smartphone gập,di động,trải nghiệm',
                'featured' => 0, 'read_time' => 7, 'views' => 7800, 'created_at' => '2026-08-02 16:00:00',
                'meta_title' => 'Trải nghiệm điện thoại màn hình gập ba lần | PIXEL.',
                'meta_description' => 'Thiết kế bản lề mới giúp nếp gấp gần như biến mất — nhưng độ bền vẫn còn là dấu hỏi.',
            ],
            [
                'cat' => 'ai-xu-huong', 'title' => 'Bên trong trung tâm dữ liệu AI lớn nhất Đông Nam Á',
                'slug' => 'ben-trong-trung-tam-du-lieu-ai-lon-nhat-dong-nam-a',
                'excerpt' => 'Một góc nhìn hiếm hoi vào hạ tầng đứng sau các mô hình AI bạn dùng mỗi ngày.',
                'content' => '<p>PIXEL. có dịp tham quan một trong những trung tâm dữ liệu quy mô lớn nhất khu vực Đông Nam Á, nơi hàng chục nghìn GPU vận hành liên tục để huấn luyện và phục vụ các mô hình AI cho hàng triệu người dùng mỗi ngày.</p><p>Điều gây ấn tượng nhất không phải là số lượng máy chủ, mà là hệ thống làm mát bằng chất lỏng (liquid cooling) — công nghệ đang dần thay thế làm mát bằng khí truyền thống khi mật độ GPU trên mỗi rack ngày càng dày đặc. Đại diện vận hành cho biết hệ thống này giúp giảm khoảng 30% chi phí điện năng làm mát so với thế hệ trung tâm dữ liệu cũ.</p><p>Với tốc độ mở rộng hiện tại, khu vực Đông Nam Á được dự báo sẽ trở thành một trong những điểm đến hạ tầng AI quan trọng nhất châu Á trong 3-5 năm tới.</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=75',
                'author' => $DK, 'tags' => 'AI,trung tâm dữ liệu,hạ tầng',
                'featured' => 0, 'read_time' => 8, 'views' => 15400, 'created_at' => '2026-07-30 09:00:00',
                'meta_title' => 'Bên trong trung tâm dữ liệu AI lớn nhất Đông Nam Á | PIXEL.',
                'meta_description' => 'Một góc nhìn hiếm hoi vào hạ tầng đứng sau các mô hình AI bạn dùng mỗi ngày.',
            ],
            [
                'cat' => 'thu-thuat', 'title' => 'Cách dọn dẹp ổ cứng chỉ trong 5 phút, không cần cài thêm app',
                'slug' => 'cach-don-dep-o-cung-chi-trong-5-phut',
                'excerpt' => 'Công cụ có sẵn trong Windows và macOS đủ mạnh để giải phóng hàng chục GB dung lượng.',
                'content' => '<p>Ổ cứng đầy thường là thủ phạm khiến máy chạy chậm, nhưng bạn không cần cài thêm bất kỳ phần mềm dọn dẹp nào từ bên thứ ba. Trên Windows, vào Settings → System → Storage → Temporary files để xóa các file cache, log và thùng rác tích lũy — thao tác này thường giải phóng 10-20GB chỉ sau vài phút.</p><p>Trên macOS, vào About This Mac → Storage → Manage để xem chi tiết dung lượng theo từng loại file, sau đó dùng gợi ý "Optimize Storage" có sẵn của hệ thống. Cả hai nền tảng đều có tùy chọn tự động dọn dẹp định kỳ — bật lên để không phải lặp lại thao tác này mỗi tháng.</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&auto=format&fit=crop&q=75',
                'author' => $TH, 'tags' => 'thủ thuật,ổ cứng,dọn dẹp máy tính',
                'featured' => 0, 'read_time' => 4, 'views' => 4200, 'created_at' => '2026-07-28 10:30:00',
                'meta_title' => 'Cách dọn dẹp ổ cứng chỉ trong 5 phút | PIXEL.',
                'meta_description' => 'Công cụ có sẵn trong Windows và macOS đủ mạnh để giải phóng hàng chục GB dung lượng.',
            ],
            [
                'cat' => 'danh-gia', 'title' => 'So sánh nhanh 3 laptop mỏng nhẹ tầm giá 20 triệu đáng mua nhất',
                'slug' => 'so-sanh-3-laptop-mong-nhe-tam-gia-20-trieu',
                'excerpt' => 'Cùng một tầm giá nhưng trải nghiệm sử dụng thực tế lại khác biệt rất nhiều.',
                'content' => '<p>Phân khúc laptop mỏng nhẹ tầm giá 20 triệu đồng đang có nhiều lựa chọn đáng cân nhắc hơn bao giờ hết. Chúng tôi đã thử nghiệm 3 mẫu máy nổi bật nhất hiện tại để tìm ra lựa chọn phù hợp cho từng nhu cầu sử dụng.</p><p>Nếu ưu tiên thời lượng pin và độ mỏng nhẹ để di chuyển nhiều, mẫu máy dùng chip Intel Core Ultra thế hệ mới cho kết quả tốt nhất. Nếu cần xử lý đa nhiệm nặng và có ngân sách dư dả hơn một chút, mẫu dùng RAM 32GB tỏ ra vượt trội. Xem chi tiết bảng so sánh đầy đủ tại trang <a href="/danh-gia-san-pham#bcn-compare">Đánh giá sản phẩm</a> của PIXEL.</p><p>Nhìn chung, không có "người thắng cuộc" tuyệt đối — lựa chọn tốt nhất phụ thuộc vào việc bạn ưu tiên thời lượng pin, hiệu năng đa nhiệm hay mức giá thấp nhất.</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&auto=format&fit=crop&q=75',
                'author' => $DK, 'tags' => 'laptop,so sánh,đánh giá',
                'featured' => 0, 'read_time' => 10, 'views' => 13100, 'created_at' => '2026-07-25 09:00:00',
                'meta_title' => 'So sánh 3 laptop mỏng nhẹ tầm giá 20 triệu | PIXEL.',
                'meta_description' => 'Cùng một tầm giá nhưng trải nghiệm sử dụng thực tế lại khác biệt rất nhiều.',
            ],
            [
                'cat' => 'bao-mat', 'title' => 'Mẹo bảo vệ tài khoản khỏi lừa đảo deepfake giọng nói, khuôn mặt',
                'slug' => 'meo-bao-ve-tai-khoan-khoi-lua-dao-deepfake',
                'excerpt' => 'Công nghệ deepfake ngày càng khó phân biệt — đây là 4 nguyên tắc tự bảo vệ cơ bản.',
                'content' => '<p>Công nghệ deepfake giọng nói và khuôn mặt đang được kẻ xấu lợi dụng ngày càng tinh vi để giả mạo người thân, đồng nghiệp hoặc lãnh đạo nhằm lừa chuyển tiền. PIXEL. tổng hợp 4 nguyên tắc cơ bản giúp bạn tự bảo vệ mình.</p><p>1. Luôn xác minh lại qua một kênh liên lạc khác (gọi điện trực tiếp, nhắn tin) trước khi thực hiện bất kỳ giao dịch chuyển tiền nào, dù video call trông "giống thật" đến đâu. 2. Thiết lập một "mật khẩu gia đình" bí mật để xác minh trong tình huống khẩn cấp. 3. Cẩn trọng với các cuộc gọi tạo cảm giác gấp gáp, yêu cầu hành động ngay lập tức. 4. Bật xác thực 2 lớp cho mọi tài khoản ngân hàng và mạng xã hội quan trọng.</p><p>Không có công nghệ nào bảo vệ bạn tốt hơn thói quen luôn hoài nghi đúng lúc.</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=75',
                'author' => $TH, 'tags' => 'bảo mật,deepfake,lừa đảo',
                'featured' => 0, 'read_time' => 6, 'views' => 10300, 'created_at' => '2026-07-22 13:00:00',
                'meta_title' => 'Mẹo bảo vệ tài khoản khỏi lừa đảo deepfake | PIXEL.',
                'meta_description' => 'Công nghệ deepfake ngày càng khó phân biệt — đây là 4 nguyên tắc tự bảo vệ cơ bản.',
            ],
            [
                'cat' => 'di-dong', 'title' => 'Vì sao pin smartphone flagship 2026 lại "trâu" hơn hẳn năm ngoái?',
                'slug' => 'vi-sao-pin-smartphone-flagship-2026-trau-hon',
                'excerpt' => 'Không chỉ nhờ dung lượng pin lớn hơn — chip mới mới là yếu tố quyết định.',
                'content' => '<p>Nếu để ý, bạn sẽ thấy các smartphone flagship ra mắt năm 2026 đều được quảng cáo với thời lượng pin ấn tượng hơn hẳn năm ngoái — dù dung lượng pin (mAh) không tăng nhiều. Vậy điều gì thực sự tạo nên khác biệt?</p><p>Câu trả lời chính nằm ở các chip flagship thế hệ mới được sản xuất trên tiến trình nhỏ hơn (3nm, tiến tới 2nm), tiêu thụ điện năng thấp hơn đáng kể ở cùng mức hiệu năng. Ngoài ra, các thuật toán quản lý pin dựa trên AI cũng học được thói quen sử dụng của từng người dùng để tối ưu mức tiêu thụ theo thời gian thực, thay vì áp dụng một công thức cố định cho tất cả.</p><p>Kết hợp cả hai yếu tố này, nhiều mẫu flagship 2026 đạt thời gian sử dụng thực tế cả ngày dài ngay cả với cường độ sử dụng nặng — điều gần như không tưởng chỉ vài năm trước.</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200&auto=format&fit=crop&q=75',
                'author' => $DK, 'tags' => 'pin,smartphone,chip di động',
                'featured' => 0, 'read_time' => 7, 'views' => 8900, 'created_at' => '2026-07-18 09:00:00',
                'meta_title' => 'Vì sao pin smartphone flagship 2026 trâu hơn hẳn | PIXEL.',
                'meta_description' => 'Không chỉ nhờ dung lượng pin lớn hơn — chip mới mới là yếu tố quyết định.',
            ],
            [
                'cat' => 'tin-tuc', 'title' => 'Robot hình người bắt đầu vào nhà máy sản xuất',
                'slug' => 'robot-hinh-nguoi-bat-dau-vao-nha-may-san-xuat',
                'excerpt' => 'Một góc nhìn về làn sóng robot hình người được thử nghiệm trong dây chuyền sản xuất thực tế.',
                'content' => '<p>Nhiều tập đoàn công nghệ và sản xuất lớn đã bắt đầu triển khai thử nghiệm robot hình người (humanoid robot) trực tiếp trên dây chuyền lắp ráp, thay vì chỉ dừng lại ở các bản demo trong phòng thí nghiệm như vài năm trước.</p><p>Các mẫu robot mới có thể thực hiện những thao tác đòi hỏi độ khéo léo cao như lắp ráp linh kiện nhỏ, phân loại vật liệu và vận chuyển hàng hóa giữa các trạm làm việc — những công việc trước đây khó tự động hóa hoàn toàn bằng cánh tay robot công nghiệp truyền thống.</p><p>Dù còn nhiều rào cản về chi phí và độ tin cậy trước khi được triển khai đại trà, đây rõ ràng là tín hiệu cho thấy làn sóng tự động hóa thế hệ mới đang tiến gần hơn tới thực tế sản xuất.</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=75',
                'author' => $DK, 'tags' => 'robot,tự động hóa,sản xuất',
                'featured' => 0, 'read_time' => 6, 'views' => 7200, 'created_at' => '2026-07-16 09:00:00',
                'meta_title' => 'Robot hình người bắt đầu vào nhà máy sản xuất | PIXEL.',
                'meta_description' => 'Một góc nhìn về làn sóng robot hình người được thử nghiệm trong dây chuyền sản xuất thực tế.',
            ],
            // ── Đánh giá sản phẩm (6, có review_score) ────────────────────────
            [
                'cat' => 'danh-gia', 'title' => 'Đồng hồ thông minh Series X',
                'slug' => 'danh-gia-dong-ho-thong-minh-series-x',
                'excerpt' => 'Pin trâu hơn hẳn thế hệ trước, theo dõi sức khỏe chính xác đáng ngạc nhiên. Điểm trừ duy nhất là mặt kính vẫn dễ trầy sau vài tuần sử dụng.',
                'content' => '<p>Đồng hồ thông minh Series X là bản nâng cấp đáng chú ý nhất trong dòng sản phẩm năm nay, tập trung cải thiện thời lượng pin và độ chính xác của các cảm biến sức khỏe.</p><p>Sau 3 tuần đeo liên tục kể cả khi ngủ, pin trung bình trụ được 2.5 ngày cho một lần sạc — vượt trội so với thế hệ trước chỉ đạt khoảng 1.5 ngày. Cảm biến đo nhịp tim và SpO2 cho kết quả gần sát với thiết bị y tế tham chiếu trong hầu hết các bài kiểm tra. Điểm trừ đáng tiếc nhất là mặt kính, dù được quảng cáo chống trầy, vẫn xuất hiện vài vết xước nhỏ chỉ sau khoảng 3 tuần sử dụng bình thường.</p><p>Nhìn chung, đây là lựa chọn đáng cân nhắc hàng đầu nếu bạn ưu tiên thời lượng pin và độ chính xác theo dõi sức khỏe hơn là độ bền mặt kính.</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1200&auto=format&fit=crop&q=75',
                'author' => $DK, 'tags' => 'đồng hồ thông minh,thiết bị đeo,đánh giá',
                'featured' => 0, 'read_time' => 6, 'views' => 9100, 'created_at' => '2026-08-14 09:00:00',
                'review_score' => 9.2, 'review_score_label' => 'Xuất sắc', 'review_category' => 'Thiết bị đeo',
                'meta_title' => 'Đánh giá Đồng hồ thông minh Series X | PIXEL.',
                'meta_description' => 'Pin trâu hơn hẳn thế hệ trước, theo dõi sức khỏe chính xác đáng ngạc nhiên.',
            ],
            [
                'cat' => 'danh-gia', 'title' => 'Tai nghe chống ồn Aria Pro',
                'slug' => 'danh-gia-tai-nghe-chong-on-aria-pro',
                'excerpt' => 'Chống ồn tốt nhất phân khúc dưới 5 triệu, âm trầm chắc và ấm. Ứng dụng đi kèm để chỉnh EQ vẫn còn hơi rối cho người mới.',
                'content' => '<p>Aria Pro định vị mình ở phân khúc dưới 5 triệu đồng nhưng mang lại khả năng chống ồn chủ động thuộc hàng tốt nhất trong tầm giá này.</p><p>Khả năng chống ồn xử lý rất tốt tiếng ồn tần số thấp như động cơ máy bay, tiếng ồn giao thông. Chất âm được chỉnh theo hướng ấm, bass chắc nhưng không lấn át dải mid, phù hợp nghe nhạc pop, R&B trong thời gian dài. Điểm trừ nằm ở ứng dụng đi kèm — giao diện chỉnh EQ và các chế độ chống ồn còn khá rối, người dùng mới có thể mất vài phút để làm quen.</p><p>Nếu ngân sách dưới 5 triệu và ưu tiên chống ồn tốt, đây là một trong những lựa chọn đáng tiền nhất hiện tại.</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop&q=75',
                'author' => $TH, 'tags' => 'tai nghe,ANC,âm thanh,đánh giá',
                'featured' => 0, 'read_time' => 6, 'views' => 7600, 'created_at' => '2026-08-11 10:00:00',
                'review_score' => 8.8, 'review_score_label' => 'Rất tốt', 'review_category' => 'Âm thanh',
                'meta_title' => 'Đánh giá Tai nghe chống ồn Aria Pro | PIXEL.',
                'meta_description' => 'Chống ồn tốt nhất phân khúc dưới 5 triệu, âm trầm chắc và ấm.',
            ],
            [
                'cat' => 'danh-gia', 'title' => 'Laptop mỏng nhẹ UltraBook 14',
                'slug' => 'danh-gia-laptop-ultrabook-14',
                'excerpt' => 'Thời lượng pin cả ngày làm việc, bàn phím gõ sướng tay, loa ngoài tốt hiếm thấy ở phân khúc này. Điểm trừ duy nhất là mức giá.',
                'content' => '<p>UltraBook 14 gây ấn tượng ngay từ những giờ sử dụng đầu tiên nhờ thân máy mỏng nhẹ nhưng vẫn đảm bảo độ bền chắc chắn khi cầm nắm.</p><p>Với tác vụ văn phòng và duyệt web thông thường, máy trụ được trọn một ngày làm việc 8 tiếng mà không cần sạc lại — con số hiếm thấy ở nhiều mẫu máy cùng tầm giá. Bàn phím có hành trình phím vừa phải, gõ êm và chính xác. Loa ngoài cho chất âm rõ ràng, đủ lớn cho các cuộc họp video mà không cần dùng tai nghe.</p><p>Điểm trừ lớn nhất chính là mức giá — cao hơn khoảng 1.5 triệu so với đối thủ cùng cấu hình, nhưng bù lại là trải nghiệm hoàn thiện tổng thể tốt hơn hẳn.</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&auto=format&fit=crop&q=75',
                'author' => $DK, 'tags' => 'laptop,đánh giá,UltraBook',
                'featured' => 0, 'read_time' => 7, 'views' => 12400, 'created_at' => '2026-08-09 09:00:00',
                'review_score' => 9.0, 'review_score_label' => 'Xuất sắc', 'review_category' => 'Laptop',
                'meta_title' => 'Đánh giá Laptop mỏng nhẹ UltraBook 14 | PIXEL.',
                'meta_description' => 'Thời lượng pin cả ngày làm việc, bàn phím gõ sướng tay, loa ngoài tốt hiếm thấy ở phân khúc này.',
            ],
            [
                'cat' => 'danh-gia', 'title' => 'Smartphone màn hình gập Fold V3',
                'slug' => 'danh-gia-smartphone-man-hinh-gap-fold-v3',
                'excerpt' => 'Bản lề bền hơn thế hệ trước, nếp gấp gần như mờ hẳn khi nhìn thẳng. Camera chính vẫn thua các flagship thanh (bar-type) cùng tầm giá.',
                'content' => '<p>Fold V3 là thế hệ thứ ba trong dòng sản phẩm gập của hãng, và những cải tiến về bản lề là điều dễ nhận thấy nhất ngay từ lần mở máy đầu tiên.</p><p>Bản lề mới cho cảm giác chắc chắn hơn hẳn, nếp gấp ở giữa màn hình gần như mờ hẳn khi nhìn trực diện — chỉ còn lộ rõ ở góc nghiêng. Về camera, dù đã cải thiện so với thế hệ trước, cảm biến chính vẫn thua các flagship dạng thanh (bar-type) cùng tầm giá, đặc biệt trong điều kiện thiếu sáng.</p><p>Nhìn chung, Fold V3 tiếp tục là đại diện đáng cân nhắc nhất của dòng smartphone gập trong năm nay, dù chưa hoàn toàn vượt trội về camera.</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200&auto=format&fit=crop&q=75',
                'author' => $TH, 'tags' => 'smartphone gập,đánh giá,di động',
                'featured' => 0, 'read_time' => 7, 'views' => 10800, 'created_at' => '2026-08-07 15:00:00',
                'review_score' => 8.6, 'review_score_label' => 'Rất tốt', 'review_category' => 'Smartphone',
                'meta_title' => 'Đánh giá Smartphone màn hình gập Fold V3 | PIXEL.',
                'meta_description' => 'Bản lề bền hơn thế hệ trước, nếp gấp gần như mờ hẳn khi nhìn thẳng.',
            ],
            [
                'cat' => 'danh-gia', 'title' => 'Vòng theo dõi sức khỏe FitBand Mini',
                'slug' => 'danh-gia-vong-theo-doi-suc-khoe-fitband-mini',
                'excerpt' => 'Nhỏ gọn, đeo ngủ không vướng, pin dùng được 6 ngày. Thiếu màn hình AMOLED khiến trải nghiệm xem thông báo hơi hạn chế.',
                'content' => '<p>FitBand Mini nhắm tới nhóm người dùng muốn theo dõi sức khỏe liên tục 24/7 mà không muốn đeo một chiếc đồng hồ cồng kềnh cả ngày lẫn đêm.</p><p>Thiết kế mảnh, nhẹ, gần như không cảm nhận được khi đeo ngủ — phù hợp cho việc theo dõi giấc ngủ chi tiết. Pin dùng được trung bình 6 ngày cho một lần sạc, thuộc hàng bền bỉ trong phân khúc thiết bị theo dõi sức khỏe cỡ nhỏ. Tuy nhiên màn hình chỉ là loại LCD đơn sắc, không phải AMOLED, khiến việc xem thông báo chi tiết hoặc đọc tin nhắn dài hơi bất tiện.</p><p>Đây là lựa chọn hợp lý nếu ưu tiên sự thoải mái khi đeo liên tục hơn là trải nghiệm màn hình đầy đủ tính năng.</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=75',
                'author' => $TH, 'tags' => 'thiết bị đeo,đánh giá,sức khỏe',
                'featured' => 0, 'read_time' => 5, 'views' => 4800, 'created_at' => '2026-08-05 09:00:00',
                'review_score' => 8.1, 'review_score_label' => 'Tốt', 'review_category' => 'Thiết bị đeo',
                'meta_title' => 'Đánh giá Vòng theo dõi sức khỏe FitBand Mini | PIXEL.',
                'meta_description' => 'Nhỏ gọn, đeo ngủ không vướng, pin dùng được 6 ngày.',
            ],
            [
                'cat' => 'danh-gia', 'title' => 'Loa di động BoomCube 2',
                'slug' => 'danh-gia-loa-di-dong-boomcube-2',
                'excerpt' => 'Chống nước IP67, âm lượng lớn không rè ở mức tối đa. Bass hơi yếu so với kích thước loa khi so với đối thủ cùng tầm giá.',
                'content' => '<p>BoomCube 2 là mẫu loa di động hướng tới các hoạt động ngoài trời, dã ngoại nhờ khả năng chống nước đạt chuẩn IP67 — có thể ngâm nước tạm thời mà không lo hỏng hóc.</p><p>Ở mức âm lượng tối đa, loa vẫn giữ được độ trong, không bị rè hay méo tiếng — điểm cộng lớn so với nhiều mẫu loa di động cùng tầm giá thường bị vỡ tiếng khi vặn hết cỡ. Tuy nhiên xét về dải bass, với kích thước loa khá lớn, BoomCube 2 lại cho lực bass nhẹ hơn kỳ vọng so với một vài đối thủ cùng phân khúc.</p><p>Nếu ưu tiên độ bền và khả năng chống nước để mang theo dã ngoại, đây vẫn là lựa chọn đáng cân nhắc dù chưa hoàn hảo về chất âm.</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=1200&auto=format&fit=crop&q=75',
                'author' => $DK, 'tags' => 'loa di động,âm thanh,đánh giá',
                'featured' => 0, 'read_time' => 5, 'views' => 3900, 'created_at' => '2026-08-03 09:00:00',
                'review_score' => 7.9, 'review_score_label' => 'Tốt', 'review_category' => 'Âm thanh',
                'meta_title' => 'Đánh giá Loa di động BoomCube 2 | PIXEL.',
                'meta_description' => 'Chống nước IP67, âm lượng lớn không rè ở mức tối đa.',
            ],
        ];

        foreach ($posts as $p) {
            [$authorName, $authorAvatar, $authorRole, $authorBio] = $p['author'];
            $this->execute(
                "INSERT INTO posts (category_id, title, slug, excerpt, content, thumbnail, author_name, author_avatar, author_role, author_bio, tags, featured, read_time, views, review_score, review_score_label, review_category, status, meta_title, meta_description, created_by, created_at, updated_at)
                 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'published', ?, ?, 1, ?, ?)",
                [
                    $this->catId($p['cat']), $p['title'], $p['slug'], $p['excerpt'], $p['content'], $p['thumbnail'],
                    $authorName, $authorAvatar, $authorRole, $authorBio, $p['tags'],
                    $p['featured'], $p['read_time'], $p['views'],
                    $p['review_score'] ?? null, $p['review_score_label'] ?? '', $p['review_category'] ?? '',
                    $p['meta_title'], $p['meta_description'],
                    $p['created_at'], $p['created_at'],
                ]
            );
        }
    }

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $faqs = [
            ['Làm sao để đóng góp bài viết cho PIXEL.?', 'Bạn có thể gửi bản nháp bài viết (định dạng .docx hoặc Google Docs) kèm chủ đề đề xuất qua trang Liên hệ. Đội ngũ biên tập sẽ phản hồi trong vòng 3-5 ngày làm việc, kèm góp ý chỉnh sửa nếu cần trước khi đăng.'],
            ['PIXEL. đăng bài mới với tần suất như thế nào?', 'Trung bình 4-6 bài viết mới mỗi tuần, gồm tin tức nóng cập nhật trong 24 giờ và các bài phân tích/đánh giá chuyên sâu xuất bản định kỳ vào thứ Ba và thứ Sáu hàng tuần.'],
            ['Tôi có thể sử dụng lại nội dung trên PIXEL. không?', 'Bạn được phép trích dẫn tối đa 150 từ kèm liên kết dẫn nguồn rõ ràng về bài viết gốc. Việc đăng lại toàn văn hoặc sử dụng cho mục đích thương mại cần có sự đồng ý bằng văn bản — vui lòng liên hệ trước.'],
            ['PIXEL. có nhận review sản phẩm tài trợ không?', 'Có. Chúng tôi nhận sản phẩm dùng thử từ nhãn hàng để đánh giá, nhưng mọi nhận định trong bài đều độc lập và không bị chi phối bởi nhà tài trợ. Bài viết hợp tác luôn được gắn nhãn "Có tài trợ" minh bạch.'],
            ['Làm sao để đăng ký nhận bản tin công nghệ hàng tuần?', 'Chỉ cần nhập email vào form "Đăng ký nhận tin" ở cuối trang chủ hoặc trên thanh điều hướng. Bản tin được gửi vào sáng thứ Hai mỗi tuần, bạn có thể hủy đăng ký bất cứ lúc nào chỉ với 1 cú nhấp.'],
            ['Chính sách bình luận của PIXEL. như thế nào?', 'Chúng tôi khuyến khích thảo luận văn minh, đúng chủ đề. Bình luận công kích cá nhân, spam liên kết hoặc quảng cáo không liên quan sẽ bị ẩn mà không cần báo trước.'],
            ['Thông tin đánh giá sản phẩm trên PIXEL. có khách quan không?', 'Mọi sản phẩm đều được thử nghiệm thực tế tối thiểu 1-2 tuần trước khi lên bài, chấm điểm theo bộ tiêu chí cố định (hiệu năng, thời lượng pin, giá trị so với giá tiền...). Xem chi tiết phương pháp đánh giá tại trang Đánh giá sản phẩm.'],
        ];
        foreach ($faqs as $i => [$q, $a]) {
            $this->execute(
                "INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)",
                [$q, $a, $i + 1]
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
