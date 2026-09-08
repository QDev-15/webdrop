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
        $this->seedPostCategories();
        $this->seedPosts();
        $this->seedTestimonials();
        $this->seedFaqs();
        $this->seedTimelineItems();
    }

    private function seedPostCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM post_categories") > 0) return;
        $cats = [
            ['Tiết kiệm',        'tiet-kiem',   1, 1],
            ['Đầu tư',           'dau-tu',      1, 2],
            ['Quản lý nợ',       'quan-ly-no',  1, 3],
            ['Ngân sách',        'ngan-sach',   1, 4],
            ['Bảo hiểm',         'bao-hiem',    1, 5],
            ['Hưu trí',          'huu-tri',     1, 6],
            ['Kiến thức chung',  'tong-quan',   0, 7],
        ];
        foreach ($cats as [$name, $slug, $showOnHome, $order]) {
            $this->execute(
                "INSERT INTO post_categories (name, slug, show_on_home, sort_order) VALUES (?, ?, ?, ?)",
                [$name, $slug, $showOnHome, $order]
            );
        }
    }

    private function categoryId(string $slug): ?int {
        $row = $this->queryOne("SELECT id FROM post_categories WHERE slug = ?", [$slug]);
        return $row ? (int)$row['id'] : null;
    }

    private function insertPost(array $p): void {
        $this->execute(
            "INSERT INTO posts (
                category_id, title, slug, excerpt, content, thumbnail,
                author_name, author_avatar, author_role, author_bio, tags,
                read_time, home_section, home_order, trending_order,
                status, published_at
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
                $this->categoryId($p['category']), $p['title'], $p['slug'], $p['excerpt'], $p['content'], $p['thumbnail'],
                $p['author_name'], $p['author_avatar'], $p['author_role'], $p['author_bio'], $p['tags'] ?? '',
                $p['read_time'], $p['home_section'] ?? '', $p['home_order'] ?? 0, $p['trending_order'] ?? 0,
                'published', $p['published_at'],
            ]
        );
    }

    private function seedPosts(): void {
        if ($this->scalar("SELECT COUNT(*) FROM posts") > 0) return;

        $author = [
            'author_name'   => 'Đặng Minh Thư',
            'author_avatar' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=78',
            'author_role'   => 'Người sáng lập La Bàn Tài Chính',
            'author_bio'    => '7 năm làm việc trong lĩnh vực phân tích tài chính ngân hàng trước khi chuyển sang viết lách toàn thời gian với mong muốn giúp người trẻ Việt Nam tiếp cận kiến thức tài chính dễ hiểu hơn.',
        ];

        $laiKepContent = <<<'HTML'
<p>Nếu bạn hỏi 10 chuyên gia tài chính đâu là bí quyết quan trọng nhất để xây dựng tài sản dài hạn, gần như tất cả sẽ nhắc đến một khái niệm: <strong>lãi kép</strong>. Đây không phải một mẹo đầu tư bí mật hay công cụ phức tạp — mà là một quy luật toán học đơn giản, nhưng lại bị đánh giá thấp bởi phần lớn mọi người vì hiệu quả của nó chỉ thực sự rõ ràng sau nhiều năm.</p>

<img class="btc-inline-img" src="https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=1000&auto=format&fit=crop&q=80" alt="Biểu đồ minh họa tăng trưởng tài sản theo thời gian">

<h2 id="s1">Lãi kép là gì?</h2>
<p>Lãi kép (compound interest) là hiện tượng lãi sinh ra không chỉ từ số tiền gốc ban đầu, mà còn từ chính phần lãi đã tích lũy trước đó. Nói cách khác, tiền của bạn không chỉ "sinh lời" — nó sinh lời trên cả phần lời đã có, tạo thành một vòng lặp tăng trưởng ngày càng nhanh theo thời gian.</p>
<p>Ngược lại với lãi kép là <strong>lãi đơn</strong> (simple interest) — chỉ tính trên số tiền gốc, không tính trên phần lãi đã sinh ra. Với lãi đơn, tài sản của bạn tăng theo đường thẳng. Với lãi kép, tài sản tăng theo đường cong ngày càng dốc — đây chính là lý do Albert Einstein được cho là đã gọi lãi kép là "kỳ quan thứ 8 của thế giới" (dù giai thoại này chưa được xác thực hoàn toàn, nó vẫn phản ánh đúng bản chất mạnh mẽ của hiện tượng này).</p>

<h2 id="s2">Công thức tính lãi kép</h2>
<p>Công thức cơ bản của lãi kép được biểu diễn như sau:</p>
<div class="btc-blockquote">A = P × (1 + r/n)<sup>n×t</sup></div>
<p>Trong đó: <strong>A</strong> là số tiền cuối cùng bạn nhận được, <strong>P</strong> là số tiền gốc ban đầu, <strong>r</strong> là lãi suất hàng năm (dạng thập phân), <strong>n</strong> là số lần ghép lãi mỗi năm, và <strong>t</strong> là số năm đầu tư. Nếu bạn có đóng góp thêm định kỳ (ví dụ hàng tháng), công thức sẽ phức tạp hơn một chút vì phải cộng dồn từng khoản đóng góp theo thời gian còn lại — đây cũng chính là lý do các công cụ tính toán tự động (như công cụ lãi kép của La Bàn Tài Chính) sẽ tiện lợi hơn nhiều so với việc tự tính tay.</p>

<h2 id="s3">Vì sao thời gian quan trọng hơn số tiền</h2>
<p>Yếu tố mạnh nhất trong công thức lãi kép không phải là lãi suất hay số tiền gốc — mà là <strong>thời gian</strong>. Vì lãi được tính trên cả phần lãi cũ, càng để lâu, tốc độ tăng trưởng càng nhanh theo cấp số nhân chứ không phải cấp số cộng. Điều này có nghĩa là hai người đầu tư cùng lãi suất, nhưng người bắt đầu sớm hơn dù chỉ vài năm — thậm chí đóng góp ít tiền hơn tổng cộng — vẫn có thể kết thúc với số tài sản lớn hơn đáng kể.</p>

<h2 id="s4">Ví dụ thực tế: Bắt đầu ở tuổi 25 so với tuổi 35</h2>
<p>Giả sử lãi suất kỳ vọng trung bình là 9%/năm (tương đương mức tăng trưởng dài hạn của một danh mục đầu tư cổ phiếu đa dạng hóa):</p>
<ul>
<li><strong>Người A</strong> bắt đầu đầu tư 3.000.000 đ/tháng từ năm 25 tuổi, dừng đóng góp ở tuổi 35 (tổng cộng 10 năm, 360.000.000 đ), nhưng để tiền tiếp tục sinh lời đến năm 60 tuổi.</li>
<li><strong>Người B</strong> bắt đầu đầu tư 3.000.000 đ/tháng từ năm 35 tuổi và duy trì liên tục đến năm 60 tuổi (25 năm, 900.000.000 đ đóng góp).</li>
</ul>
<p>Dù Người B đóng góp tổng cộng nhiều hơn gấp 2,5 lần, đến năm 60 tuổi, tài sản của Người A — người chỉ đóng góp trong 10 năm đầu rồi để tiền tự sinh lời — vẫn tương đương hoặc thậm chí vượt qua Người B, tùy thời điểm dừng đóng góp cụ thể. Đây chính là minh chứng rõ ràng nhất cho câu nói "thời gian trên thị trường quan trọng hơn việc chọn đúng thời điểm vào thị trường".</p>

<img class="btc-inline-img" src="https://images.unsplash.com/photo-1579532536935-619928decd08?w=1000&auto=format&fit=crop&q=80" alt="Cây non mọc từ đồng tiền xu minh họa tăng trưởng đầu tư theo thời gian">
<p class="btc-inline-cap">Đầu tư càng sớm, "hạt giống" tài sản càng có nhiều thời gian để lớn lên.</p>

<h2 id="s5">Áp dụng lãi kép vào đời sống hàng ngày</h2>
<p>Bạn không cần một khoản tiền lớn để bắt đầu tận dụng lãi kép. Một vài cách áp dụng thực tế:</p>
<ol>
<li><strong>Bắt đầu càng sớm càng tốt</strong> — kể cả với số tiền nhỏ. 500.000 đ/tháng bắt đầu từ năm 22 tuổi có thể hiệu quả hơn 2.000.000 đ/tháng bắt đầu từ năm 32 tuổi.</li>
<li><strong>Duy trì đóng góp đều đặn</strong> — tự động hóa việc chuyển tiền vào tài khoản đầu tư/tiết kiệm ngay khi nhận lương để tránh trì hoãn.</li>
<li><strong>Tránh rút tiền giữa chừng</strong> — mỗi lần rút ra là một lần "cắt đứt" chuỗi lãi kép, buộc phải bắt đầu lại từ số dư thấp hơn.</li>
<li><strong>Tái đầu tư cổ tức/lãi nhận được</strong> — thay vì tiêu ngay, hãy để phần lãi tiếp tục sinh lời.</li>
</ol>

<h2 id="s6">Những sai lầm khiến bạn đánh mất lãi kép</h2>
<p>Lãi kép cũng có thể "phản chủ" nếu bạn đứng ở phía người đi vay thay vì người cho vay/đầu tư. Nợ thẻ tín dụng với lãi suất 20-40%/năm cũng tăng trưởng theo đúng cơ chế lãi kép — chỉ khác là nó làm tài sản của bạn âm đi nhanh hơn theo thời gian. Đây là lý do việc trả hết nợ lãi suất cao luôn nên được ưu tiên trước khi dồn tiền vào đầu tư dài hạn.</p>
<p>Một sai lầm phổ biến khác là liên tục rút tiền ra khỏi tài khoản đầu tư mỗi khi thị trường biến động hoặc khi có nhu cầu chi tiêu ngắn hạn — hành động này phá vỡ chuỗi tăng trưởng kép và khiến bạn phải bắt đầu lại gần như từ đầu.</p>

<h2 id="s7">Kết luận</h2>
<p>Lãi kép không phải là một chiến lược đầu tư — nó là một quy luật toán học vận hành âm thầm phía sau mọi quyết định tài chính của bạn, dù bạn có nhận ra hay không. Điều duy nhất bạn cần làm là bắt đầu càng sớm càng tốt, duy trì kỷ luật, và để thời gian làm phần việc còn lại. Nếu bạn muốn hình dung cụ thể số tiền mình có thể tích lũy được, hãy thử ngay công cụ tính lãi kép miễn phí của La Bàn Tài Chính ở trang Công cụ tính toán.</p>
HTML;

        $this->insertPost([
            'category' => 'dau-tu',
            'title' => 'Lãi kép là gì? Vì sao Warren Buffett gọi đây là kỳ quan thứ 8 của thế giới',
            'slug' => 'lai-kep-la-gi-ky-quan-thu-8',
            'excerpt' => 'Chỉ cần bắt đầu sớm vài năm, số tiền bạn có ở tuổi nghỉ hưu có thể chênh lệch gấp đôi, gấp ba — ngay cả khi số tiền đóng góp hàng tháng là như nhau. Đây là công thức toán học đơn giản nhưng ít người thực sự tận dụng.',
            'content' => $laiKepContent,
            'thumbnail' => 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1000&auto=format&fit=crop&q=80',
            'tags' => 'Lãi kép, Đầu tư dài hạn, Kiến thức cơ bản, Quỹ hưu trí',
            'read_time' => 9,
            'home_section' => 'bento_main', 'home_order' => 0, 'trending_order' => 1,
            'published_at' => '2026-08-12 09:00:00',
        ] + $author);

        $this->insertPost([
            'category' => 'ngan-sach',
            'title' => 'Quy tắc 50/30/20: Cách chia ngân sách đơn giản mà hiệu quả',
            'slug' => 'quy-tac-50-30-20',
            'excerpt' => 'Công thức chia thu nhập kinh điển, dễ áp dụng cho bất kỳ ai mới bắt đầu quản lý chi tiêu.',
            'content' => '<p>Công thức chia thu nhập kinh điển, dễ áp dụng cho bất kỳ ai mới bắt đầu quản lý chi tiêu.</p><p>Quy tắc 50/30/20 chia thu nhập của bạn thành 3 nhóm: 50% cho nhu cầu thiết yếu (nhà ở, ăn uống, điện nước, đi lại), 30% cho mong muốn cá nhân (giải trí, mua sắm, du lịch), và 20% cho tiết kiệm hoặc trả nợ. Bạn có thể áp dụng ngay với <a href="/cong-cu-tinh-toan">công cụ lập ngân sách miễn phí</a> của La Bàn Tài Chính.</p>',
            'thumbnail' => 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&auto=format&fit=crop&q=78',
            'read_time' => 6,
            'home_section' => 'bento_side', 'home_order' => 1, 'trending_order' => 2,
            'published_at' => '2026-08-08 09:00:00',
        ] + $author);

        $this->insertPost([
            'category' => 'tiet-kiem',
            'title' => 'Quỹ khẩn cấp: Bạn cần bao nhiêu tiền để an tâm trước rủi ro bất ngờ?',
            'slug' => 'quy-khan-cap-can-bao-nhieu-tien',
            'excerpt' => 'Công thức tính quỹ dự phòng phù hợp với từng loại công việc và hoàn cảnh sống.',
            'content' => '<p>Công thức tính quỹ dự phòng phù hợp với từng loại công việc và hoàn cảnh sống. Tùy vào mức độ ổn định thu nhập, bạn nên dự phòng: 3 tháng chi phí sinh hoạt nếu công việc ổn định, 6 tháng theo khuyến nghị phổ biến, 9 tháng nếu thu nhập không ổn định, hoặc 12 tháng nếu bạn làm freelancer/kinh doanh riêng. Dùng <a href="/cong-cu-tinh-toan">công cụ tính quỹ khẩn cấp</a> để có con số chính xác cho hoàn cảnh của bạn.</p>',
            'thumbnail' => 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&auto=format&fit=crop&q=78',
            'read_time' => 7,
            'home_section' => 'bento_side', 'home_order' => 2,
            'published_at' => '2026-08-02 09:00:00',
        ] + $author);

        $this->insertPost([
            'category' => 'quan-ly-no',
            'title' => 'Cách trả nợ nhanh hơn với phương pháp Snowball và Avalanche',
            'slug' => 'tra-no-nhanh-hon-snowball-avalanche',
            'excerpt' => 'Hai chiến lược trả nợ phổ biến nhất — chọn cách nào phù hợp với tâm lý của bạn?',
            'content' => '<p>Hai chiến lược trả nợ phổ biến nhất — chọn cách nào phù hợp với tâm lý của bạn?</p><p>Phương pháp Snowball ưu tiên trả hết khoản nợ nhỏ nhất trước để tạo động lực tâm lý, trong khi Avalanche ưu tiên trả khoản nợ có lãi suất cao nhất trước để tiết kiệm tiền lãi về lâu dài.</p>',
            'thumbnail' => 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=78',
            'read_time' => 8,
            'home_section' => 'bento_side', 'home_order' => 3, 'trending_order' => 4,
            'published_at' => '2026-07-26 09:00:00',
        ] + $author);

        $this->insertPost([
            'category' => 'huu-tri',
            'title' => 'Về hưu sớm (FIRE) tại Việt Nam: Giấc mơ có thực tế không?',
            'slug' => 'fire-ve-huu-som-tai-viet-nam',
            'excerpt' => 'Phong trào FIRE đang lan rộng, nhưng áp dụng vào bối cảnh Việt Nam cần điều chỉnh ra sao?',
            'content' => '<p>Phong trào FIRE đang lan rộng, nhưng áp dụng vào bối cảnh Việt Nam cần điều chỉnh ra sao?</p><p>Bài viết đầy đủ đang được biên tập và sẽ sớm được cập nhật.</p>',
            'thumbnail' => 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=500&auto=format&fit=crop&q=78',
            'read_time' => 10,
            'home_section' => 'latest', 'home_order' => 0, 'trending_order' => 3,
            'published_at' => '2026-08-20 09:00:00',
        ] + $author);

        $this->insertPost([
            'category' => 'dau-tu',
            'title' => 'So sánh gửi tiết kiệm ngân hàng và trái phiếu doanh nghiệp',
            'slug' => 'so-sanh-tiet-kiem-ngan-hang-trai-phieu',
            'excerpt' => 'Kênh nào an toàn hơn, kênh nào sinh lời tốt hơn trong giai đoạn lãi suất hiện nay?',
            'content' => '<p>Kênh nào an toàn hơn, kênh nào sinh lời tốt hơn trong giai đoạn lãi suất hiện nay?</p><p>Bài viết đầy đủ đang được biên tập và sẽ sớm được cập nhật.</p>',
            'thumbnail' => 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=500&auto=format&fit=crop&q=78',
            'read_time' => 8,
            'home_section' => 'latest', 'home_order' => 1,
            'published_at' => '2026-08-16 09:00:00',
        ] + $author);

        $this->insertPost([
            'category' => 'ngan-sach',
            'title' => '5 ứng dụng quản lý chi tiêu miễn phí đáng dùng nhất 2026',
            'slug' => '5-ung-dung-quan-ly-chi-tieu-mien-phi',
            'excerpt' => 'Không cần Excel phức tạp — những app này giúp bạn theo dõi dòng tiền chỉ trong vài giây mỗi ngày.',
            'content' => '<p>Không cần Excel phức tạp — những app này giúp bạn theo dõi dòng tiền chỉ trong vài giây mỗi ngày.</p><p>Bài viết đầy đủ đang được biên tập và sẽ sớm được cập nhật.</p>',
            'thumbnail' => 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=500&auto=format&fit=crop&q=78',
            'read_time' => 5,
            'home_section' => 'latest', 'home_order' => 2,
            'published_at' => '2026-08-10 09:00:00',
        ] + $author);

        $this->insertPost([
            'category' => 'bao-hiem',
            'title' => 'Bảo hiểm nhân thọ: Mua thế nào để không lãng phí tiền',
            'slug' => 'bao-hiem-nhan-tho-mua-sao-cho-dung',
            'excerpt' => 'Phân biệt bảo hiểm bảo vệ thuần túy và sản phẩm đầu tư lồng ghép trước khi đặt bút ký hợp đồng.',
            'content' => '<p>Phân biệt bảo hiểm bảo vệ thuần túy và sản phẩm đầu tư lồng ghép trước khi đặt bút ký hợp đồng.</p><p>Bài viết đầy đủ đang được biên tập và sẽ sớm được cập nhật.</p>',
            'thumbnail' => 'https://images.unsplash.com/photo-1553729784-e91953dec042?w=500&auto=format&fit=crop&q=78',
            'read_time' => 7,
            'home_section' => 'latest', 'home_order' => 3, 'trending_order' => 5,
            'published_at' => '2026-08-04 09:00:00',
        ] + $author);

        $this->insertPost([
            'category' => 'tong-quan',
            'title' => '7 sai lầm tài chính phổ biến khiến bạn mãi không giàu lên được',
            'slug' => '7-sai-lam-tai-chinh-pho-bien',
            'excerpt' => 'Từ việc không có ngân sách đến trì hoãn đầu tư — những lỗi ai cũng từng mắc ít nhất một lần.',
            'content' => '<p>Từ việc không có ngân sách đến trì hoãn đầu tư — những lỗi ai cũng từng mắc ít nhất một lần.</p><p>Bài viết đầy đủ đang được biên tập và sẽ sớm được cập nhật.</p>',
            'thumbnail' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=78',
            'read_time' => 8,
            'published_at' => '2026-07-30 09:00:00',
        ] + $author);

        $this->insertPost([
            'category' => 'dau-tu',
            'title' => 'Đầu tư chứng chỉ quỹ (ETF) cho người mới bắt đầu',
            'slug' => 'dau-tu-chung-chi-quy-etf-cho-nguoi-moi',
            'excerpt' => 'Không cần chọn cổ phiếu, ETF vẫn giúp bạn tiếp cận toàn thị trường với chi phí thấp.',
            'content' => '<p>Không cần chọn cổ phiếu, ETF vẫn giúp bạn tiếp cận toàn thị trường với chi phí thấp.</p><p>Bài viết đầy đủ đang được biên tập và sẽ sớm được cập nhật.</p>',
            'thumbnail' => 'https://images.unsplash.com/photo-1554260570-e9689a3418b8?w=500&auto=format&fit=crop&q=78',
            'read_time' => 9,
            'published_at' => '2026-07-22 09:00:00',
        ] + $author);

        $this->insertPost([
            'category' => 'tong-quan',
            'title' => 'Tâm lý học tiền bạc: Vì sao ta luôn tiêu nhiều hơn dự tính',
            'slug' => 'tam-ly-hoc-tien-bac',
            'excerpt' => 'Những thiên kiến tâm lý âm thầm chi phối mọi quyết định chi tiêu của bạn.',
            'content' => '<p>Những thiên kiến tâm lý âm thầm chi phối mọi quyết định chi tiêu của bạn.</p><p>Bài viết đầy đủ đang được biên tập và sẽ sớm được cập nhật.</p>',
            'thumbnail' => 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&auto=format&fit=crop&q=78',
            'read_time' => 8,
            'published_at' => '2026-07-14 09:00:00',
        ] + $author);

        $this->insertPost([
            'category' => 'quan-ly-no',
            'title' => 'Cách xây dựng điểm tín dụng tốt khi vay mua nhà, mua xe',
            'slug' => 'xay-dung-diem-tin-dung-vay-mua-nha',
            'excerpt' => 'Điểm tín dụng ảnh hưởng trực tiếp đến lãi suất bạn được vay — xây dựng từ hôm nay.',
            'content' => '<p>Điểm tín dụng ảnh hưởng trực tiếp đến lãi suất bạn được vay — xây dựng từ hôm nay.</p><p>Bài viết đầy đủ đang được biên tập và sẽ sớm được cập nhật.</p>',
            'thumbnail' => 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=500&auto=format&fit=crop&q=78',
            'read_time' => 7,
            'published_at' => '2026-07-18 09:00:00',
        ] + $author);

        $this->insertPost([
            'category' => 'bao-hiem',
            'title' => 'Bảo hiểm sức khỏe tư nhân có thực sự cần thiết?',
            'slug' => 'bao-hiem-suc-khoe-tu-nhan-co-can-thiet',
            'excerpt' => 'Khi nào bảo hiểm y tế nhà nước là đủ, khi nào bạn cần thêm một lớp bảo vệ nữa?',
            'content' => '<p>Khi nào bảo hiểm y tế nhà nước là đủ, khi nào bạn cần thêm một lớp bảo vệ nữa?</p><p>Bài viết đầy đủ đang được biên tập và sẽ sớm được cập nhật.</p>',
            'thumbnail' => 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500&auto=format&fit=crop&q=78',
            'read_time' => 6,
            'published_at' => '2026-07-11 09:00:00',
        ] + $author);

        $this->insertPost([
            'category' => 'huu-tri',
            'title' => 'Bảo hiểm xã hội tự nguyện: Nên bắt đầu đóng từ tuổi nào?',
            'slug' => 'bao-hiem-xa-hoi-tu-nguyen-nen-dong-tu-tuoi-nao',
            'excerpt' => 'Càng đóng sớm, mức lương hưu nhận được khi về già càng cao — tính toán cụ thể trong bài.',
            'content' => '<p>Càng đóng sớm, mức lương hưu nhận được khi về già càng cao — tính toán cụ thể trong bài.</p><p>Bài viết đầy đủ đang được biên tập và sẽ sớm được cập nhật.</p>',
            'thumbnail' => 'https://images.unsplash.com/photo-1620266757065-5814239881fd?w=500&auto=format&fit=crop&q=78',
            'read_time' => 7,
            'published_at' => '2026-07-05 09:00:00',
        ] + $author);

        $this->insertPost([
            'category' => 'tiet-kiem',
            'title' => 'Tiết kiệm tiền khi lương thấp: 10 mẹo thực tế đã được kiểm chứng',
            'slug' => 'tiet-kiem-tien-khi-luong-thap',
            'excerpt' => 'Không cần lương cao mới tiết kiệm được — chỉ cần đúng phương pháp.',
            'content' => '<p>Không cần lương cao mới tiết kiệm được — chỉ cần đúng phương pháp.</p><p>Bài viết đầy đủ đang được biên tập và sẽ sớm được cập nhật.</p>',
            'thumbnail' => 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=78',
            'read_time' => 9,
            'published_at' => '2026-06-28 09:00:00',
        ] + $author);
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $items = [
            [
                'Quốc Huy', 'Nhân viên văn phòng, 27 tuổi',
                'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&auto=format&fit=crop&q=75',
                'Bài viết về quỹ khẩn cấp đã thay đổi cách mình nhìn nhận tiết kiệm. Trước đây mình nghĩ tiết kiệm là để dành mua đồ, giờ mình hiểu đó là lớp bảo vệ đầu tiên trước rủi ro.', 1,
            ],
            [
                'Thanh Huyền', 'Freelancer thiết kế, 24 tuổi',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=75',
                'Công cụ tính lãi kép cực kỳ trực quan — mình nhập thử vài kịch bản và nhận ra bắt đầu đầu tư sớm 5 năm khác biệt lớn đến mức nào. Đã chia sẻ cho cả nhóm bạn thân.', 2,
            ],
            [
                'Minh Đức', 'Kỹ sư phần mềm, 30 tuổi',
                'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=75',
                'Cách viết dễ hiểu, không dùng thuật ngữ khó nuốt như nhiều nguồn tài chính khác. Loạt bài về Snowball và Avalanche giúp mình trả hết nợ thẻ tín dụng sau 14 tháng.', 3,
            ],
        ];
        foreach ($items as [$name, $role, $avatar, $content, $order]) {
            $this->execute(
                "INSERT INTO testimonials (name, role, avatar, content, sort_order) VALUES (?,?,?,?,?)",
                [$name, $role, $avatar, $content, $order]
            );
        }
    }

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $items = [
            ['Nội dung trên blog có phải là lời khuyên đầu tư không?', 'Không. Toàn bộ nội dung trên La Bàn Tài Chính mang tính chất giáo dục và tham khảo, không phải lời khuyên đầu tư hay tư vấn tài chính cá nhân hóa. Trước khi đưa ra quyết định tài chính quan trọng, bạn nên tìm hiểu kỹ hoặc trao đổi với chuyên gia tài chính được cấp phép phù hợp với hoàn cảnh của mình.'],
            ['Làm sao để đóng góp bài viết cho La Bàn Tài Chính?', 'Bạn có thể gửi đề xuất chủ đề hoặc bản nháp bài viết qua form ở trang Liên hệ, ghi rõ chủ đề "Đóng góp bài viết". Đội ngũ biên tập sẽ phản hồi trong vòng 5-7 ngày làm việc nếu nội dung phù hợp với định hướng của blog.'],
            ['Blog đăng bài mới với tần suất như thế nào?', 'Trung bình 2-3 bài viết mới mỗi tuần, xoay quanh 6 chuyên mục chính. Bạn có thể đăng ký nhận bản tin để không bỏ lỡ bài viết mới ngay khi xuất bản.'],
            ['Tôi có thể sử dụng lại nội dung của blog không?', 'Bạn có thể trích dẫn một phần nội dung kèm theo liên kết nguồn rõ ràng về bài viết gốc. Việc sao chép toàn bộ bài viết để đăng lại trên nền tảng khác mà không xin phép là không được phép — xem chi tiết tại trang Điều khoản sử dụng.'],
            ['La Bàn Tài Chính có nhận hợp tác quảng cáo, tài trợ không?', 'Có, nhưng với tiêu chí chọn lọc nghiêm ngặt — chỉ hợp tác với các sản phẩm/dịch vụ tài chính minh bạch, phù hợp với độc giả. Mọi bài viết có yếu tố tài trợ đều được gắn nhãn rõ ràng. Liên hệ qua email hợp tác ở trang Liên hệ để trao đổi chi tiết.'],
            ['Làm sao để đăng ký nhận bản tin (newsletter)?', 'Điền email vào form đăng ký ở cuối trang chủ hoặc trong khối CTA phía dưới trang này. Bạn sẽ nhận email tổng hợp bài viết mới và mẹo tài chính ngắn gọn mỗi tuần, có thể hủy đăng ký bất kỳ lúc nào.'],
            ['Chính sách bình luận trên blog như thế nào?', 'Mọi bình luận đều được khuyến khích miễn là tôn trọng và mang tính xây dựng. Bình luận chứa quảng cáo trá hình, spam, hoặc ngôn từ công kích sẽ bị ẩn mà không cần báo trước.'],
            ['Công cụ tính toán trên blog có chính xác 100% không?', 'Các công cụ (lãi kép, ngân sách 50/30/20, quỹ khẩn cấp) tính toán dựa trên công thức tài chính chuẩn và giả định bạn nhập vào, chỉ mang tính ước lượng tham khảo — không tính đến thuế, phí giao dịch hay biến động lãi suất thực tế theo từng năm.'],
        ];
        foreach ($items as $i => [$q, $a]) {
            $this->execute(
                "INSERT INTO faqs (question, answer, sort_order) VALUES (?,?,?)",
                [$q, $a, $i + 1]
            );
        }
    }

    private function seedTimelineItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM timeline_items") > 0) return;
        $items = [
            ['2016', 'Bắt đầu sự nghiệp tại ngân hàng', 'Gia nhập bộ phận phân tích tín dụng cá nhân, tiếp xúc trực tiếp với hàng trăm hồ sơ vay mỗi năm.'],
            ['2021', 'Viết bài đầu tiên về tài chính cá nhân', 'Chia sẻ những ghi chú cá nhân về quản lý chi tiêu lên một trang blog nhỏ, nhận được phản hồi tích cực ngoài mong đợi.'],
            ['2022', 'La Bàn Tài Chính chính thức ra mắt', 'Xây dựng blog với 6 chuyên mục kiến thức có cấu trúc rõ ràng, thay vì các bài viết rời rạc như trước.'],
            ['2024', 'Nghỉ việc ngân hàng, viết toàn thời gian', 'Quyết định dành toàn bộ thời gian cho blog sau khi lượng độc giả vượt mốc 20.000 người/tháng.'],
            ['2026', 'Ra mắt bộ công cụ tính toán miễn phí', 'Phát triển công cụ tính lãi kép, lập ngân sách 50/30/20 và tính quỹ khẩn cấp — giúp độc giả áp dụng kiến thức ngay lập tức.'],
        ];
        foreach ($items as $i => [$year, $title, $desc]) {
            $this->execute(
                "INSERT INTO timeline_items (year, title, description, sort_order) VALUES (?,?,?,?)",
                [$year, $title, $desc, $i + 1]
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
            // ─── general ─────────────────────────────────────────────────────
            ['site_name', 'La Bàn Tài Chính', 'general'],
            ['site_tagline', 'Blog tài chính cá nhân dành cho người Việt trẻ', 'general'],
            ['site_description', 'La Bàn Tài Chính — blog chia sẻ kiến thức tài chính cá nhân dễ hiểu cho người Việt trẻ: tiết kiệm, đầu tư, quản lý nợ, ngân sách và kế hoạch nghỉ hưu.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hello@labantaichinh.vn', 'general'],
            ['site_phone', '024 1234 5678', 'general'],
            ['site_address', 'Số 15, Phố Trần Thái Tông, Quận Cầu Giấy, Hà Nội', 'general'],
            ['working_hours', 'Thứ 2 - Thứ 6: 9:00 - 18:00', 'general'],
            ['nav_logo_prefix', 'La Bàn', 'general'],
            ['nav_logo_accent', 'Tài Chính', 'general'],
            // ─── seo ─────────────────────────────────────────────────────────
            ['meta_title', 'La Bàn Tài Chính — Blog tài chính cá nhân: tiết kiệm, đầu tư, quản lý chi tiêu', 'seo'],
            ['meta_description', 'La Bàn Tài Chính — blog chia sẻ kiến thức tài chính cá nhân dễ hiểu cho người Việt trẻ: tiết kiệm, đầu tư, quản lý nợ, ngân sách và kế hoạch nghỉ hưu.', 'seo'],
            ['meta_keywords', 'tài chính cá nhân, tiết kiệm, đầu tư, quản lý nợ, ngân sách, hưu trí', 'seo'],
            // ─── social ──────────────────────────────────────────────────────
            ['social_facebook', 'https://facebook.com/labantaichinh', 'social'],
            ['social_youtube', 'https://youtube.com/@labantaichinh', 'social'],
            ['social_tiktok', 'https://tiktok.com/@labantaichinh', 'social'],
            ['social_zalo', '0987654321', 'social'],
            // ─── footer ──────────────────────────────────────────────────────
            ['footer_copyright', '© 2026 La Bàn Tài Chính. Bản quyền thuộc về La Bàn Tài Chính.', 'footer'],
            ['footer_description', 'Blog chia sẻ kiến thức tài chính cá nhân dễ hiểu — tiết kiệm, đầu tư, quản lý chi tiêu và kế hoạch nghỉ hưu cho người Việt trẻ. Nội dung mang tính tham khảo, không phải lời khuyên đầu tư.', 'footer'],
            // ─── contact ─────────────────────────────────────────────────────
            ['contact_response_time', 'Trong vòng 1-2 ngày làm việc', 'contact'],
            ['contact_disclaimer', 'Lưu ý: đội ngũ La Bàn Tài Chính không cung cấp tư vấn đầu tư cá nhân hóa qua email/điện thoại. Mọi câu hỏi mang tính chất chia sẻ kiến thức chung sẽ được ưu tiên phản hồi.', 'contact'],
            ['map_embed', 'https://maps.google.com/maps?q=21.0285,105.8542&hl=vi&z=15&output=embed', 'contact'],
            // ─── about (trang Về tôi) ────────────────────────────────────────
            ['about_name', 'Minh Thư', 'about'],
            ['about_tag', 'Người đứng sau La Bàn Tài Chính', 'about'],
            ['about_intro', 'Tôi tin rằng ai cũng xứng đáng hiểu rõ về tiền của chính mình — không cần bằng cấp tài chính, không cần thuật ngữ khó hiểu.', 'about'],
            ['about_photo', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=700&auto=format&fit=crop&q=80', 'about'],
            ['about_story_tag', 'Câu chuyện của tôi', 'about'],
            ['about_story_title', "Từ ngân hàng đến *trang viết*", 'about'],
            ['about_story_p1', 'Tôi từng làm chuyên viên phân tích tín dụng tại một ngân hàng thương mại trong 7 năm. Công việc cho tôi tiếp xúc hàng ngày với hồ sơ vay của hàng trăm khách hàng — và một điều khiến tôi trăn trở: rất nhiều người rơi vào khó khăn tài chính không phải vì thu nhập thấp, mà vì chưa từng được dạy cách quản lý tiền một cách bài bản.', 'about'],
            ['about_story_p2', 'Năm 2021, tôi bắt đầu viết những bài đầu tiên trên một trang blog cá nhân nhỏ, chia sẻ lại chính những gì mình học được — từ cách đọc báo cáo tài chính đến cách lập ngân sách cho một gia đình trẻ. Không ngờ những bài viết đó lại chạm đến rất nhiều người có cùng trăn trở. La Bàn Tài Chính ra đời từ đó, với một mục tiêu duy nhất: biến kiến thức tài chính phức tạp thành thứ ai cũng có thể hiểu và áp dụng ngay.', 'about'],
            ['stat_years_experience', '7', 'about'],
            ['stat_monthly_readers_num', '42', 'about'],
            ['stat_monthly_readers_suffix', 'k', 'about'],
            ['stat_years_active', '5', 'about'],
            ['stat_newsletter_num', '12', 'about'],
            ['stat_newsletter_suffix', 'k', 'about'],
            ['about_value1_title', 'Trung thực & minh bạch', 'about'],
            ['about_value1_desc', 'Không nhận quảng cáo cho sản phẩm mà tôi không tự tin giới thiệu cho người thân của mình.', 'about'],
            ['about_value2_title', 'Dễ hiểu, không hàn lâm', 'about'],
            ['about_value2_desc', 'Mọi khái niệm phức tạp đều được diễn giải bằng ví dụ thực tế, gần gũi với đời sống người Việt.', 'about'],
            ['about_value3_title', 'Có căn cứ, có kiểm chứng', 'about'],
            ['about_value3_desc', 'Mọi số liệu, công thức đều được kiểm tra kỹ trước khi xuất bản — không viết theo cảm tính.', 'about'],
            // ─── content (copy các section khác trên site) ──────────────────
            ['home_bento_tag', 'Đang được đọc nhiều nhất', 'content'],
            ['home_bento_title', 'Bài viết *nổi bật*', 'content'],
            ['home_category_tag', 'Khám phá theo chủ đề', 'content'],
            ['home_category_title', '6 *chuyên mục* kiến thức', 'content'],
            ['home_category_sub', 'Mỗi chuyên mục là một mảnh ghép trong bức tranh tài chính cá nhân toàn diện của bạn.', 'content'],
            ['home_latest_tag', 'Cập nhật liên tục', 'content'],
            ['home_latest_title', 'Bài viết *mới nhất*', 'content'],
            ['home_tool1_tag', 'Công cụ miễn phí', 'content'],
            ['home_tool1_title', 'Tính *lãi kép* chỉ trong vài giây', 'content'],
            ['home_tool1_desc', 'Nhập số tiền gốc, lãi suất kỳ vọng và thời gian đầu tư — công cụ sẽ tính ngay tổng tài sản bạn có thể tích lũy được, không cần công thức phức tạp.', 'content'],
            ['home_tool2_tag', 'Quy tắc 50/30/20', 'content'],
            ['home_tool2_title', 'Lập ngân sách *không đau đầu*', 'content'],
            ['home_tool2_desc', 'Chỉ cần nhập thu nhập hàng tháng, công cụ tự động chia thành 3 nhóm: nhu cầu thiết yếu, mong muốn cá nhân và tiết kiệm — dễ áp dụng ngay từ hôm nay.', 'content'],
            ['home_testi_tag', 'Độc giả nói gì', 'content'],
            ['home_testi_title', 'Câu chuyện từ *người đọc*', 'content'],
            ['home_faq_tag', 'Giải đáp thắc mắc', 'content'],
            ['home_faq_title', 'Câu hỏi *thường gặp*', 'content'],
            ['home_cta_title', 'Nhận bài viết mới mỗi tuần *miễn phí*', 'content'],
            ['home_cta_sub', 'Không spam. Chỉ những kiến thức tài chính thực sự hữu ích, gửi thẳng vào hộp thư của bạn.', 'content'],
            ['category_page_title', 'Toàn bộ *bài viết*', 'content'],
            ['category_page_sub', 'Lọc bài viết theo chuyên mục bạn quan tâm — từ tiết kiệm cơ bản đến chiến lược đầu tư dài hạn.', 'content'],
            ['category_trending_tag', 'Đọc nhiều nhất tuần này', 'content'],
            ['tools_page_tag', '3 công cụ miễn phí', 'content'],
            ['tools_page_title', 'Công cụ tính toán *tài chính*', 'content'],
            ['tools_page_sub', 'Không cần công thức phức tạp — nhập số liệu của bạn, kết quả hiển thị ngay lập tức, tính toán hoàn toàn trên trình duyệt của bạn.', 'content'],
            ['tools_disclaimer', 'Các công cụ trên chỉ mang tính ước lượng tham khảo dựa trên số liệu bạn nhập vào, không tính đến thuế, phí giao dịch hay biến động lãi suất thực tế. Đây không phải lời khuyên đầu tư — vui lòng cân nhắc kỹ hoặc tham khảo chuyên gia tài chính trước khi ra quyết định.', 'content'],
            ['contact_page_tag', 'Luôn sẵn sàng lắng nghe', 'content'],
            ['contact_page_title', 'Liên hệ với *chúng tôi*', 'content'],
            ['contact_page_sub', 'Có câu hỏi, góp ý, hoặc muốn đề xuất chủ đề bài viết? Điền form bên dưới hoặc liên hệ trực tiếp qua các kênh sau.', 'content'],
            ['about_timeline_tag', 'Hành trình', 'content'],
            ['about_timeline_title', 'Các cột mốc *quan trọng*', 'content'],
            ['about_value_tag', 'Nguyên tắc viết', 'content'],
            ['about_value_title', 'Giá trị tôi *theo đuổi*', 'content'],
            ['about_cta_title', 'Có câu hỏi muốn *trao đổi riêng?*', 'content'],
            ['about_cta_sub', 'Gửi email hoặc để lại lời nhắn — tôi đọc và phản hồi mọi tin nhắn của độc giả.', 'content'],
            // ─── unsplash mặc định ───────────────────────────────────────────
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
        // subtitle format: "label||desc" — label hiển thị eyebrow, desc là đoạn mô tả dưới tiêu đề.
        // Nút phụ (outline) của mỗi slide hardcode theo vị trí trong HeroSlider.tsx (không lưu DB).
        $slides = [
            [
                'title' => "Hiểu tiền của bạn,\n*làm chủ* tương lai",
                'subtitle' => 'Kiến thức tài chính cá nhân||Những bài viết dễ hiểu, không hàn lâm về tiết kiệm, đầu tư và quản lý chi tiêu — dành cho người Việt trẻ mới bắt đầu hành trình tài chính.',
                'button_text' => 'Khám phá bài viết',
                'button_link' => '/chuyen-muc',
                'image' => 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=1400&auto=format&fit=crop&q=80',
                'sort_order' => 1,
            ],
            [
                'title' => "Lập ngân sách\nchỉ trong *5 phút*",
                'subtitle' => 'Ngân sách thông minh||Áp dụng quy tắc 50/30/20 với công cụ tính toán miễn phí — nhập thu nhập, nhận ngay kế hoạch chi tiêu hợp lý.',
                'button_text' => 'Thử ngay công cụ',
                'button_link' => '/cong-cu-tinh-toan',
                'image' => 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=1400&auto=format&fit=crop&q=80',
                'sort_order' => 2,
            ],
            [
                'title' => "An tâm trước\nmọi *rủi ro* bất ngờ",
                'subtitle' => 'Quỹ dự phòng||Bạn cần bao nhiêu tiền trong quỹ khẩn cấp? Tính toán chính xác theo chi phí sinh hoạt thực tế của riêng bạn.',
                'button_text' => 'Tính quỹ khẩn cấp',
                'button_link' => '/cong-cu-tinh-toan',
                'image' => 'https://images.unsplash.com/photo-1621981386829-9b458a2cddde?w=1400&auto=format&fit=crop&q=80',
                'sort_order' => 3,
            ],
            [
                'title' => "Lãi kép — *kỳ quan*\nthứ 8 của thế giới",
                'subtitle' => 'Đầu tư dài hạn||Tìm hiểu vì sao bắt đầu đầu tư sớm — dù chỉ với số tiền nhỏ — lại tạo ra khác biệt lớn sau nhiều năm.',
                'button_text' => 'Đọc bài viết',
                'button_link' => '/bai-viet/lai-kep-la-gi-ky-quan-thu-8',
                'image' => 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=1400&auto=format&fit=crop&q=80',
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
