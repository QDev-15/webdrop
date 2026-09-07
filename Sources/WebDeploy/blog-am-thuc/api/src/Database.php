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
        // Strip comment lines TRƯỚC khi split theo ';' — tránh vỡ statement nếu comment chứa dấu ';'
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

    protected function seedExtensions(): void {
        $this->seedPostCategories();
        $this->seedPosts();
        $this->seedTestimonials();
        $this->seedFaqs();
        $this->seedTimeline();
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
            ['site_name', 'Bếp Xanh', 'general'],
            ['site_tagline', 'Blog ẩm thực: công thức nấu ăn, review quán ngon & mẹo bếp', 'general'],
            ['site_description', 'Bếp Xanh — blog ẩm thực chia sẻ công thức nấu ăn chuẩn vị, review quán ăn ngon thật, và mẹo bếp núc giúp bạn nấu ngon tại nhà mỗi ngày.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hello@bepxanh.vn', 'general'],
            ['site_phone', '0901 234 567', 'general'],
            ['site_address', 'Số 24, Ngõ Hàng Hành, Phường Hàng Trống, Quận Hoàn Kiếm, Hà Nội', 'general'],
            ['working_hours', 'Phản hồi email trong vòng 1–2 ngày làm việc', 'general'],
            // seo
            ['meta_title', 'Bếp Xanh — Blog Ẩm Thực: Công Thức Nấu Ăn, Review Quán Ngon & Mẹo Bếp', 'seo'],
            ['meta_description', 'Bếp Xanh — blog ẩm thực chia sẻ công thức nấu ăn chuẩn vị, review quán ăn ngon thật, và mẹo bếp núc giúp bạn nấu ngon tại nhà mỗi ngày.', 'seo'],
            ['meta_keywords', 'công thức nấu ăn, review quán ăn, mẹo bếp, ẩm thực, nấu ăn ngon', 'seo'],
            // social
            ['social_facebook', '#', 'social'],
            ['social_instagram', '#', 'social'],
            ['social_youtube', '#', 'social'],
            ['social_pinterest', '#', 'social'],
            ['zalo_number', '0901234567', 'social'],
            // footer
            ['footer_copyright', '© 2026 Bếp Xanh. Mọi quyền được bảo lưu.', 'footer'],
            ['footer_description', 'Blog ẩm thực chia sẻ công thức nấu ăn, review quán ngon và mẹo bếp núc mỗi ngày — nấu ngon tại nhà, sống lành mỗi bữa.', 'footer'],
            ['map_embed_url', 'https://maps.google.com/maps?q=21.0333,105.8500&hl=vi&z=15&output=embed', 'footer'],
            // about — nội dung trang "Về tôi" + stat-bar (rule 4: mọi text phải quản lý được)
            ['about_founder_name', 'Nguyễn Minh Anh', 'about'],
            ['about_founder_role', 'Người sáng lập & biên tập Bếp Xanh', 'about'],
            ['about_founder_avatar', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop', 'about'],
            ['about_founder_image', 'https://images.unsplash.com/photo-1428515613728-6b4607e44363?w=800&q=85&auto=format&fit=crop', 'about'],
            ['about_intro_p1', 'Tôi bắt đầu Bếp Xanh vào năm 2018, trong một căn bếp thuê rộng chưa đầy 6m² ở Hà Nội, chỉ với một chiếc điện thoại cũ và niềm tin rằng ai cũng có thể nấu ăn ngon nếu được hướng dẫn đúng cách.', 'about'],
            ['about_intro_p2', 'Trước đó tôi từng làm marketing cho một công ty thực phẩm suốt 4 năm — công việc cho tôi hiểu ngành ẩm thực, nhưng lại khiến tôi thấy thiếu đi phần quan trọng nhất: được thực sự đứng bếp và chia sẻ điều mình nấu. Bếp Xanh ra đời từ đó, và đến nay đã trở thành công việc toàn thời gian của tôi.', 'about'],
            ['stat_recipes', '420+', 'about'],
            ['stat_reviews', '85+', 'about'],
            ['stat_readers', '180k', 'about'],
            ['stat_years', '8', 'about'],
            // cloudinary
            ['cloudinary_cloud_name', '', 'cloudinary'],
            ['cloudinary_api_key', '', 'cloudinary'],
            ['cloudinary_api_secret', '', 'cloudinary'],
            ['cloudinary_folder', 'bep-xanh', 'cloudinary'],
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
        // subtitle format "label||desc" — bam-hero-label + bam-hero-desc gộp vào 1 cột (core schema chỉ có 1 subtitle)
        // title dùng *...* để đánh dấu phần <em> tô màu accent
        $slides = [
            [
                'title'       => 'Nấu ăn ngon *mỗi ngày* tại căn bếp nhà bạn',
                'subtitle'    => 'Mỗi tuần một công thức mới||Hơn 320 công thức đã được thử đi thử lại nhiều lần, đo lường chính xác từng gram — dễ làm, dễ thành công ngay từ lần vào bếp đầu tiên.',
                'button_text' => 'Xem công thức mới nhất',
                'button_link' => '/cong-thuc-nau-an',
                'image'       => 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=760&q=80&auto=format&fit=crop',
                'sort_order'  => 1,
            ],
            [
                'title'       => 'Review quán ăn ngon, *giá thật* quanh bạn',
                'subtitle'    => 'Review thật — không PR||Đi ăn thật, tự trả tiền, viết cảm nhận thật — từ quán vỉa hè quen thuộc tới nhà hàng sang trọng, không nhận bài PR trá hình.',
                'button_text' => 'Đọc bài review mới',
                'button_link' => '/bai-viet/quan-pho-gia-truyen-50-nam-o-hang-trong',
                'image'       => 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=760&q=80&auto=format&fit=crop',
                'sort_order'  => 2,
            ],
            [
                'title'       => 'Mẹo bếp núc giúp bạn *nấu ăn nhàn hơn*',
                'subtitle'    => 'Mẹo nhỏ, hiệu quả lớn||Từ cách bảo quản rau củ tươi lâu tới bí quyết hầm nước dùng trong veo — những mẹo được đúc kết từ hàng trăm lần thử-sai trong bếp.',
                'button_text' => 'Xem mẹo bếp hay',
                'button_link' => '/chuyen-muc?tab=meo-bep',
                'image'       => 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=760&q=80&auto=format&fit=crop',
                'sort_order'  => 3,
            ],
            [
                'title'       => 'Ăn lành, *sống xanh* mỗi ngày',
                'subtitle'    => 'Ăn ngon không đánh đổi sức khỏe||Gợi ý thực đơn cân bằng dinh dưỡng, nguyên liệu tươi sạch theo mùa và cách chế biến giữ trọn vitamin trong từng món ăn.',
                'button_text' => 'Xem thực đơn ăn lành',
                'button_link' => '/chuyen-muc?tab=an-lanh',
                'image'       => 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=760&q=80&auto=format&fit=crop',
                'sort_order'  => 4,
            ],
        ];
        foreach ($slides as $slide) {
            $this->execute(
                "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                [$slide['title'], $slide['subtitle'], $slide['button_text'], $slide['button_link'], $slide['image'], $slide['sort_order']]
            );
        }
    }

    private function seedPostCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM post_categories") > 0) return;
        $cats = [
            ['Món chính', 'mon-chinh', 1],
            ['Tráng miệng', 'trang-mieng', 2],
            ['Đồ uống', 'do-uong', 3],
            ['Review quán ăn', 'review', 4],
            ['Mẹo bếp', 'meo-bep', 5],
            ['Ăn lành', 'an-lanh', 6],
        ];
        foreach ($cats as [$name, $slug, $order]) {
            $this->execute(
                "INSERT INTO post_categories (name, slug, sort_order) VALUES (?, ?, ?)",
                [$name, $slug, $order]
            );
        }
    }

    private function catId(string $slug): ?int {
        $row = $this->queryOne("SELECT id FROM post_categories WHERE slug = ?", [$slug]);
        return $row ? (int)$row['id'] : null;
    }

    private function seedPosts(): void {
        if ($this->scalar("SELECT COUNT(*) FROM posts") > 0) return;

        $minhAnh = [
            'author_name'   => 'Nguyễn Minh Anh',
            'author_avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&auto=format&fit=crop',
        ];
        $ducAnh = [
            'author_name'   => 'Đức Anh',
            'author_avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80&auto=format&fit=crop',
        ];

        // ─────────────────────────────────────────────────────────────
        // ARTICLES (type = 'article')
        // ─────────────────────────────────────────────────────────────
        $articles = [
            [
                'category'   => 'review',
                'title'      => 'Quán Phở Gia Truyền 50 Năm Ở Hàng Trống: Bát Phở Giữ Trọn Vị Hà Nội Xưa',
                'slug'       => 'quan-pho-gia-truyen-50-nam-o-hang-trong',
                'excerpt'    => 'Bát phở giữ trọn vị Hà Nội xưa — nước dùng trong veo, bánh phở dai mềm đúng chuẩn phố cổ.',
                'image'      => 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1100&q=85&auto=format&fit=crop',
                'author'     => $ducAnh,
                'author_bio' => 'Cộng tác viên chuyên mục Review quán ăn của Bếp Xanh — chuyên đi tìm những quán ăn lâu đời, ít người biết đến ở Hà Nội. Mọi bài review đều là trải nghiệm và hóa đơn tự chi trả.',
                'read'       => 8,
                'tags'       => 'Phở|Review quán ăn|Ẩm thực Hà Nội|Quán gia truyền',
                'featured'   => 1,
                'published'  => '2026-08-24',
                'pullquote'  => '"Ngày xưa mẹ chồng tôi dặn, nước dùng phở ngon hay dở nằm ở chỗ hớt bọt cho khéo, chứ không phải ở việc cho bao nhiêu gia vị." — bà Lan, chủ quán',
                'content'    => "<p>7 giờ sáng, con phố Hàng Trống vẫn còn hơi se lạnh của tiết cuối thu. Tôi rẽ vào một con ngõ nhỏ không biển hiệu, chỉ có một nồi nước dùng bốc khói nghi ngút đặt ngay đầu ngõ và vài chục chiếc ghế nhựa xếp dọc bức tường cũ. Không cần hỏi đường — chỉ cần đi theo mùi hồi quế thoang thoảng trong không khí là đến nơi.</p>"
                    . "<h2>Một quán phở không cần biển hiệu</h2>"
                    . "<p>Chủ quán là bà Lan, năm nay ngoài 60 tuổi, đời thứ hai tiếp nối gánh phở của mẹ chồng để lại từ những năm 1970. Không có menu, không có bảng giá dán tường — khách quen chỉ cần ngồi xuống, gọi \"một tái, một chín\" là người phục vụ đã hiểu ý. Quán mở cửa từ 6 giờ sáng và thường hết hàng trước 9 giờ, có hôm chỉ 8 giờ đã cạn nồi.</p>"
                    . "<p>Điều khiến tôi ấn tượng ngay từ ngụm nước dùng đầu tiên là độ trong gần như tuyệt đối — không một gợn mỡ, không vị bột ngọt gắt, chỉ có vị ngọt thanh của xương ống được hầm đủ giờ và mùi thơm nhẹ của quế, hồi thoảng qua chứ không nồng gắt như nhiều quán phở \"cải tiến\" gần đây.</p>"
                    . "<div class=\"bam-inline-img\"><img src=\"https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=1100&q=85&auto=format&fit=crop\" alt=\"Thực khách đang thưởng thức tô phở nóng bằng đũa\" loading=\"lazy\"><div class=\"bam-inline-cap\">Tô phở tái được múc ngay khi khách gọi, thịt bò chín tái vừa tới nhờ nước dùng đang sôi già.</div></div>"
                    . "<p>Khi tôi hỏi bí quyết giữ được vị phở không đổi suốt hơn nửa thế kỷ, bà Lan chỉ cười và nói rằng công thức gia truyền gần như không thay đổi — vẫn xương ống, xương gà, gừng nướng, hành nướng và một túi gia vị nhỏ được rang tay mỗi sáng. \"Thời buổi này nhiều người thích nấu nhanh, cho thêm bột nêm cho đậm đà, nhưng tôi vẫn giữ cách cũ — chậm hơn nhưng khách ăn quen rồi thì không đổi quán khác được\", bà chia sẻ.</p>"
                    . "<h2>Vị phở giữ nguyên bản, giá cả vẫn bình dân</h2>"
                    . "<p>Một tô phở tái nạm tại đây có giá 45.000đ — không hề đắt so với mặt bằng chung phố cổ, đặc biệt khi lượng thịt bò khá hào phóng so với kích cỡ tô. Bánh phở được đặt riêng từ một cơ sở làm bánh gia truyền khác trong khu vực, sợi bánh mỏng, dai vừa phải, không bị nát dù ngâm trong nước dùng nóng khá lâu.</p>"
                    . "<p>Rau ăn kèm cũng là điểm cộng lớn: hành lá thái nhỏ, một chút rau mùi, và đặc biệt là đĩa quẩy nóng giòn được chiên ngay tại chỗ — một chi tiết nhỏ nhưng không phải quán phở truyền thống nào ở Hà Nội cũng còn giữ.</p>"
                    . "<h3>Những điều cần lưu ý nếu bạn muốn ghé thử</h3>"
                    . "<ul><li>Quán chỉ bán buổi sáng, thường hết hàng trước 9 giờ — nên đến sớm để tránh hết phở.</li>"
                    . "<li>Không gian khá chật, chủ yếu là ghế nhựa thấp kê tạm ngoài ngõ — phù hợp trải nghiệm hơn là ăn thoải mái.</li>"
                    . "<li>Quán không nhận chuyển khoản, chỉ thanh toán tiền mặt.</li>"
                    . "<li>Không có chỗ để xe riêng, nên gửi xe ở bãi gần đó và đi bộ vào ngõ.</li></ul>"
                    . "<p>Rời quán khi bụng đã no căng và người vẫn còn thoảng mùi hồi quế trên áo, tôi hiểu vì sao suốt 50 năm qua, dù phố Hàng Trống đã đổi thay không ít, gánh phở nhỏ không biển hiệu này vẫn đông khách mỗi sáng. Đôi khi, thứ giữ chân thực khách lâu nhất không phải là không gian sang trọng, mà là một công thức được giữ nguyên vẹn qua nhiều thế hệ.</p>",
            ],
            [
                'category'  => 'meo-bep',
                'title'     => '7 Mẹo Bảo Quản Rau Củ Tươi Lâu Gấp Đôi Trong Tủ Lạnh',
                'slug'      => '7-meo-bao-quan-rau-cu-tuoi-lau-gap-doi',
                'excerpt'   => 'Không cần tủ lạnh xịn, chỉ cần đúng cách gói và đúng ngăn — rau vẫn tươi sau cả tuần.',
                'image'     => 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1100&q=85&auto=format&fit=crop',
                'author'    => $minhAnh,
                'read'      => 5,
                'tags'      => 'Mẹo bếp|Bảo quản thực phẩm',
                'published' => '2026-08-20',
                'content'   => "<p>Một trong những câu hỏi mình nhận được nhiều nhất qua email là: \"Làm sao để rau không héo chỉ sau 2-3 ngày trong tủ lạnh?\" Sau nhiều năm thử nghiệm, mình đúc kết được 7 mẹo đơn giản nhưng hiệu quả rõ rệt.</p>"
                    . "<h2>1. Rửa sạch nhưng phải làm khô hoàn toàn trước khi cất</h2>"
                    . "<p>Độ ẩm còn sót lại là nguyên nhân số một khiến rau nhanh úng và thối. Sau khi rửa, hãy dùng rổ hoặc khăn giấy sạch thấm khô rau trước khi cho vào hộp hoặc túi bảo quản.</p>"
                    . "<h2>2. Bọc rau lá xanh trong khăn giấy hơi ẩm</h2>"
                    . "<p>Với xà lách, cải, rau thơm — lót một lớp khăn giấy hơi ẩm (không ướt sũng) trước khi cho vào túi zip. Khăn giấy sẽ hút bớt hơi ẩm dư thừa mà vẫn giữ độ tươi cho rau.</p>"
                    . "<h2>3. Không rửa trước những loại củ quả để được lâu</h2>"
                    . "<p>Cà rốt, khoai tây, hành tây nên giữ nguyên lớp vỏ khô và chỉ rửa sạch ngay trước khi chế biến — rửa sớm sẽ làm chúng nhanh mọc mầm hoặc mềm nhũn hơn.</p>"
                    . "<ul><li>Cà chua nên để ở nhiệt độ phòng, không cho vào tủ lạnh vì sẽ mất vị ngọt tự nhiên.</li>"
                    . "<li>Hành lá cắt gốc, cắm đứng trong ly nước như cắm hoa sẽ tươi thêm cả tuần.</li>"
                    . "<li>Nấm nên đựng trong túi giấy, không đựng túi nilon kín vì nấm cần \"thở\".</li></ul>"
                    . "<p>Áp dụng đều 7 mẹo này, gia đình mình đã giảm hẳn lượng rau củ phải bỏ đi mỗi tuần — vừa tiết kiệm, vừa đỡ áy náy vì lãng phí thực phẩm.</p>",
            ],
            [
                'category'  => 'do-uong',
                'title'     => '3 Công Thức Sinh Tố Detox Buổi Sáng Dễ Làm',
                'slug'      => '3-cong-thuc-sinh-to-detox-buoi-sang',
                'excerpt'   => 'Chỉ mất 5 phút mỗi sáng để có một ly sinh tố đủ chất, đẹp da mà không cần đường tinh luyện.',
                'image'     => 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=1100&q=85&auto=format&fit=crop',
                'author'    => $minhAnh,
                'read'      => 6,
                'tags'      => 'Đồ uống|Ăn lành|Detox',
                'published' => '2026-08-18',
                'content'   => "<p>Buổi sáng bận rộn không có nghĩa là phải bỏ bữa. Ba công thức sinh tố dưới đây mình làm gần như mỗi ngày — chuẩn bị nhanh, không cần thêm đường mà vẫn ngọt tự nhiên từ trái cây.</p>"
                    . "<h2>1. Sinh tố chuối — bơ đậu phộng</h2>"
                    . "<p>1 quả chuối chín, 1 muỗng bơ đậu phộng, 200ml sữa hạnh nhân, vài viên đá. Xay nhuyễn tất cả — vị béo bùi, no lâu, rất hợp cho buổi sáng cần vận động nhiều.</p>"
                    . "<h2>2. Sinh tố xanh detox</h2>"
                    . "<p>1 nắm rau bina, 1/2 quả táo xanh, 1/2 quả chuối, nước cốt 1/2 quả chanh, 200ml nước dừa. Vị chua nhẹ của táo và chanh át hẳn vị rau, dễ uống hơn bạn nghĩ.</p>"
                    . "<h2>3. Sinh tố việt quất — sữa chua</h2>"
                    . "<p>1 nắm việt quất (tươi hoặc đông lạnh), 100g sữa chua không đường, 1 muỗng mật ong, vài lá bạc hà. Giàu chất chống oxy hóa, rất hợp uống sau khi tập thể dục.</p>"
                    . "<p>Mẹo nhỏ: xay xong nên uống ngay trong 15-20 phút để giữ trọn vitamin — sinh tố để lâu trong tủ lạnh sẽ mất dần dưỡng chất và dễ bị tách lớp.</p>",
            ],
            [
                'category'  => 'trang-mieng',
                'title'     => 'Pancake Bông Xốp Kiểu Nhật — Bí Quyết Không Bị Xẹp',
                'slug'      => 'pancake-bong-xop-kieu-nhat-bi-quyet-khong-bi-xep',
                'excerpt'   => 'Ba lỗi thường gặp khiến pancake xẹp lép sau khi ra chảo, và cách khắc phục từng lỗi.',
                'image'     => 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1100&q=85&auto=format&fit=crop',
                'author'    => $minhAnh,
                'read'      => 7,
                'tags'      => 'Tráng miệng|Mẹo bếp',
                'published' => '2026-08-15',
                'content'   => "<p>Pancake bông xốp kiểu Nhật (soufflé pancake) trông thì đơn giản nhưng rất nhiều bạn nhắn mình than thở rằng bánh xẹp lép ngay khi vừa nhấc khỏi chảo. Dưới đây là 3 lỗi phổ biến nhất và cách khắc phục.</p>"
                    . "<h2>Lỗi 1: Đánh lòng trắng trứng chưa đủ bông</h2>"
                    . "<p>Lòng trắng trứng phải được đánh đến khi tạo chóp cứng (stiff peak) — nếu chỉ đánh đến chóp mềm, hỗn hợp sẽ không đủ \"khí\" để giữ bánh phồng khi nướng.</p>"
                    . "<h2>Lỗi 2: Trộn bột quá mạnh tay</h2>"
                    . "<p>Sau khi trộn lòng trắng trứng đã đánh bông với phần bột lòng đỏ, chỉ nên trộn nhẹ nhàng theo kiểu fold từ dưới lên — trộn mạnh tay sẽ làm vỡ hết bọt khí đã đánh bông công phu.</p>"
                    . "<h2>Lỗi 3: Lửa quá lớn hoặc không đậy nắp khi chiên</h2>"
                    . "<p>Chiên pancake ở lửa cực nhỏ và đậy nắp kín để bánh chín đều từ trong ra ngoài nhờ hơi nước, thay vì chỉ chín phần đáy khiến bánh xẹp khi nguội.</p>"
                    . "<p>Áp dụng đúng cả 3 điểm trên, mẻ pancake của bạn sẽ giữ được độ phồng đẹp mắt kể cả sau khi nguội — không còn cảnh bánh xẹp lép chỉ sau vài phút.</p>",
            ],
            [
                'category'  => 'an-lanh',
                'title'     => 'Thực Đơn Ăn Lành 5 Ngày Cho Người Bận Rộn',
                'slug'      => 'thuc-don-an-lanh-5-ngay-cho-nguoi-ban-ron',
                'excerpt'   => 'Chuẩn bị 1 lần cuối tuần, ăn đủ chất cả tuần — kèm bảng nguyên liệu chi tiết đi chợ.',
                'image'     => 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=1100&q=85&auto=format&fit=crop',
                'author'    => $minhAnh,
                'read'      => 9,
                'tags'      => 'Ăn lành|Meal prep',
                'published' => '2026-08-12',
                'content'   => "<p>\"Ăn lành\" không có nghĩa là phải nấu nướng cầu kỳ mỗi ngày. Với thực đơn 5 ngày dưới đây, bạn chỉ cần dành khoảng 2 tiếng vào cuối tuần để chuẩn bị sẵn, những ngày trong tuần chỉ việc hâm nóng.</p>"
                    . "<h2>Nguyên tắc chọn thực đơn</h2>"
                    . "<p>Mỗi bữa đều đảm bảo 3 nhóm: tinh bột phức hợp (gạo lứt, khoai lang), đạm nạc (ức gà, cá, đậu phụ) và rau củ nhiều màu sắc — vừa cân bằng dinh dưỡng, vừa dễ đổi món để không bị ngán.</p>"
                    . "<ul><li>Ngày 1-2: Ức gà áp chảo, gạo lứt, bông cải xanh hấp</li>"
                    . "<li>Ngày 3: Cá hồi nướng sốt chanh, khoai lang nghiền, salad rau trộn</li>"
                    . "<li>Ngày 4: Đậu phụ sốt cà chua, cơm gạo lứt, rau muống xào tỏi</li>"
                    . "<li>Ngày 5: Súp rau củ thập cẩm, trứng luộc, bánh mì nguyên cám</li></ul>"
                    . "<h2>Mẹo bảo quản khi meal-prep</h2>"
                    . "<p>Chia phần vào hộp thủy tinh riêng biệt, để riêng nước sốt cho đến bữa ăn để rau không bị úng. Thức ăn đã nấu chín có thể bảo quản ngăn mát tối đa 4 ngày, nếu để lâu hơn nên cấp đông ngay sau khi nguội.</p>",
            ],
            [
                'category'  => 'trang-mieng',
                'title'     => 'Donut Nướng Không Chiên — Ít Ngán Hơn Vẫn Ngon',
                'slug'      => 'donut-nuong-khong-chien-it-ngan-hon-van-ngon',
                'excerpt'   => 'Công thức donut nướng bằng khuôn, không cần chiên ngập dầu.',
                'image'     => 'https://images.unsplash.com/photo-1615937691194-97dbd3f3dc29?w=1100&q=85&auto=format&fit=crop',
                'author'    => $minhAnh,
                'read'      => 6,
                'tags'      => 'Tráng miệng|Bánh nướng',
                'published' => '2026-08-02',
                'content'   => "<p>Donut chiên ngon nhưng khá ngán nếu ăn nhiều — phiên bản nướng bằng khuôn donut dưới đây giữ được độ mềm xốp mà nhẹ bụng hơn hẳn, rất hợp cho bữa sáng hoặc ăn xế.</p>"
                    . "<h2>Nguyên liệu chính</h2>"
                    . "<p>200g bột mì đa dụng, 80g đường, 2 quả trứng, 100ml sữa tươi, 40g bơ lạt đun chảy, 1 muỗng cà phê bột nở. Trộn đều theo thứ tự khô trước, ướt sau để bột mịn không vón cục.</p>"
                    . "<h2>Cách nướng</h2>"
                    . "<p>Đổ bột vào túi bắt kem, bơm vào khuôn donut đã quét bơ, nướng ở 175°C trong 10-12 phút đến khi mặt bánh vàng nhẹ và có độ đàn hồi khi ấn nhẹ.</p>"
                    . "<p>Sau khi bánh nguội, có thể phủ một lớp chocolate tan chảy hoặc đường glaze chanh mỏng lên mặt — vừa đẹp mắt vừa giảm cảm giác \"khô\" thường gặp ở donut nướng.</p>",
            ],
            [
                'category'  => 'review',
                'title'     => 'BBQ Quán Nướng Ngõ Nhỏ — Giá Sinh Viên, Chất Lượng Nhà Hàng',
                'slug'      => 'bbq-quan-nuong-ngo-nho-gia-sinh-vien',
                'excerpt'   => 'Một quán nướng bình dân nhưng khiến tôi quay lại 3 lần trong 1 tháng.',
                'image'     => 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=1100&q=85&auto=format&fit=crop',
                'author'    => $ducAnh,
                'author_bio'=> 'Cộng tác viên chuyên mục Review quán ăn của Bếp Xanh — chuyên đi tìm những quán ăn lâu đời, ít người biết đến ở Hà Nội. Mọi bài review đều là trải nghiệm và hóa đơn tự chi trả.',
                'read'      => 7,
                'tags'      => 'Review quán ăn|BBQ|Giá bình dân',
                'published' => '2026-08-08',
                'content'   => "<p>Nằm sâu trong một con ngõ nhỏ gần khu sinh viên, quán BBQ này không có gì nổi bật về mặt hình thức — bàn ghế nhựa, không gian chật, nhưng chất lượng thịt nướng thì hoàn toàn khác biệt so với mức giá.</p>"
                    . "<h2>Set nướng thập cẩm giá chỉ 89.000đ</h2>"
                    . "<p>Với mức giá này, một set gồm ba rọi bò Mỹ, cánh gà, tôm và rau ăn kèm là con số khó tin ở khu vực trung tâm. Thịt được tẩm ướp vừa miệng, không bị mặn hay ngọt gắt như nhiều quán nướng bình dân khác.</p>"
                    . "<h2>Điểm trừ nhỏ</h2>"
                    . "<p>Không gian khá nóng vào giờ cao điểm vì bếp than đặt ngay giữa bàn, và quán không nhận đặt bàn trước — phải xếp hàng nếu đi vào cuối tuần.</p>"
                    . "<p>Nhìn chung, đây là lựa chọn xứng đáng nếu bạn muốn ăn ngon mà không cần chi tiêu nhiều — chính vì vậy mà mình đã quay lại tới 3 lần chỉ trong vòng 1 tháng.</p>",
            ],
            [
                'category'  => 'meo-bep',
                'title'     => 'Vì Sao Bánh Mì Tự Nướng Ở Nhà Hay Bị Đặc Ruột?',
                'slug'      => 'vi-sao-banh-mi-tu-nuong-o-nha-hay-bi-dac-ruot',
                'excerpt'   => '5 nguyên nhân phổ biến và cách khắc phục từ khâu nhồi bột.',
                'image'     => 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=1100&q=85&auto=format&fit=crop',
                'author'    => $minhAnh,
                'read'      => 11,
                'tags'      => 'Mẹo bếp|Bánh mì',
                'published' => '2026-07-28',
                'content'   => "<p>Rất nhiều bạn nhắn mình rằng đã làm theo đúng công thức nhưng bánh mì tự nướng ở nhà vẫn bị đặc ruột, không nở xốp như ngoài tiệm. Dưới đây là 5 nguyên nhân thường gặp nhất.</p>"
                    . "<h2>1. Men nở đã yếu hoặc hết hạn</h2>"
                    . "<p>Men nở là yếu tố quyết định độ nở của bánh. Trước khi trộn bột, nên thử kích hoạt men với nước ấm và một chút đường — nếu sau 10 phút không nổi bọt, men đã yếu và cần thay men mới.</p>"
                    . "<h2>2. Nhồi bột chưa đủ thời gian</h2>"
                    . "<p>Bột cần được nhồi đến khi đạt \"màng gluten\" — kéo giãn một miếng bột nhỏ thấy mỏng trong suốt mà không rách là đạt. Nhồi chưa đủ khiến bánh không giữ được khí, dẫn đến ruột đặc.</p>"
                    . "<h2>3. Ủ bột ở nhiệt độ không phù hợp</h2>"
                    . "<p>Nhiệt độ lý tưởng để ủ bột là 28-30°C. Nếu trời lạnh, có thể ủ bột trong lò nướng tắt lửa kèm một bát nước nóng để tạo môi trường ấm ẩm.</p>"
                    . "<h2>4. Nướng thiếu nhiệt hoặc mở lò quá sớm</h2>"
                    . "<p>Lò cần được làm nóng trước ít nhất 15 phút. Mở cửa lò quá sớm trong lúc bánh đang nở sẽ làm nhiệt độ sụt đột ngột, khiến bánh xẹp và đặc ruột.</p>"
                    . "<h2>5. Cắt bánh khi còn quá nóng</h2>"
                    . "<p>Bánh mì cần nghỉ ít nhất 20-30 phút sau khi ra lò trước khi cắt — cắt sớm khi hơi nước bên trong chưa thoát hết sẽ khiến ruột bánh bị bết dính, tạo cảm giác đặc hơn thực tế.</p>",
            ],
            [
                'category'  => 'an-lanh',
                'title'     => 'Buddha Bowl — Công Thức Nền Và 6 Cách Biến Tấu',
                'slug'      => 'buddha-bowl-cong-thuc-nen-va-6-cach-bien-tau',
                'excerpt'   => 'Một công thức nền để bạn tự do phối nguyên liệu theo mùa.',
                'image'     => 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=1100&q=85&auto=format&fit=crop',
                'author'    => $minhAnh,
                'read'      => 8,
                'tags'      => 'Ăn lành|Buddha bowl',
                'published' => '2026-07-30',
                'content'   => "<p>Buddha bowl không phải một công thức cố định mà là một \"công thức nền\" — cứ theo đúng tỷ lệ dưới đây, bạn có thể thay đổi nguyên liệu tùy theo mùa hoặc những gì có sẵn trong tủ lạnh.</p>"
                    . "<h2>Công thức nền: 1/4 - 1/4 - 1/2</h2>"
                    . "<p>1/4 bát là tinh bột (gạo lứt, quinoa, khoai lang), 1/4 bát là đạm (đậu gà, đậu phụ, ức gà, trứng), và 1/2 bát còn lại là rau củ tươi hoặc hấp nhiều màu sắc.</p>"
                    . "<h2>6 cách biến tấu mình hay làm</h2>"
                    . "<ul><li>Buddha bowl kiểu Địa Trung Hải: quinoa, đậu gà, dưa leo, cà chua bi, phô mai feta</li>"
                    . "<li>Buddha bowl Hàn Quốc: cơm gạo lứt, kim chi, trứng ốp la, rau chân vịt trộn mè</li>"
                    . "<li>Buddha bowl nhiệt đới: gạo lứt, tôm áp chảo, xoài xanh, đậu que</li>"
                    . "<li>Buddha bowl chay: đậu phụ nướng, khoai lang, cải xoăn, hạt bí</li>"
                    . "<li>Buddha bowl mùa hè: quinoa lạnh, dưa hấu, phô mai dê, hạt óc chó</li>"
                    . "<li>Buddha bowl mùa đông: khoai lang nướng, đậu đen, cải brussels nướng</li></ul>"
                    . "<p>Nước sốt là \"linh hồn\" của cả bát — chỉ cần trộn dầu olive, nước cốt chanh, mật ong và một chút mù tạt là đã có một loại sốt hợp với hầu hết mọi biến tấu.</p>",
            ],
        ];

        foreach ($articles as $a) {
            $this->execute(
                "INSERT INTO posts (category_id, type, title, slug, excerpt, content, pullquote, image,
                    author_name, author_avatar, author_bio, read_minutes, tags, featured, status, published_at)
                 VALUES (?, 'article', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)",
                [
                    $this->catId($a['category']), $a['title'], $a['slug'], $a['excerpt'], $a['content'],
                    $a['pullquote'] ?? '', $a['image'], $a['author']['author_name'], $a['author']['author_avatar'],
                    $a['author_bio'] ?? '', $a['read'], $a['tags'], $a['featured'] ?? 0, $a['published'] . ' 08:00:00',
                ]
            );
        }

        // ─────────────────────────────────────────────────────────────
        // RECIPES (type = 'recipe')
        // ─────────────────────────────────────────────────────────────
        $recipes = [
            [
                'category' => 'mon-chinh',
                'title'    => 'Cách Nấu Phở Bò Truyền Thống Chuẩn Vị Hà Nội',
                'slug'     => 'cach-nau-pho-bo-truyen-thong-chuan-vi-ha-noi',
                'excerpt'  => 'Công thức đầy đủ từ hầm xương, nêm gia vị đến cách trần bánh phở sao cho không bị nát.',
                'image'    => 'https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?w=900&q=85&auto=format&fit=crop',
                'difficulty' => 'Trung bình', 'prep' => '30 phút', 'cook' => '8 giờ', 'servings' => '4 người', 'saved' => 4500,
                'ingredients' => [
                    '2kg|xương ống bò', '500g|xương gà (tạo vị ngọt thanh)', '400g|thịt bò nạm, gầu, bắp (tùy chọn)',
                    '1 củ|gừng tươi', '2 củ|hành tây', '3 cánh|hoa hồi', '1 thanh|quế', '2 quả|thảo quả',
                    '5 cái|đinh hương', '1 muỗng|hạt ngò (rau mùi)', 'Vừa đủ|nước mắm, đường phèn, muối',
                    '1kg|bánh phở tươi', 'Vừa đủ|hành lá, húng quế, ngò gai, chanh, ớt',
                ],
                'steps' => [
                    'Sơ chế xương và thịt bò||Chần xương ống bò và xương gà qua nước sôi khoảng 5 phút để loại bỏ tạp chất và mùi hôi, sau đó rửa sạch lại dưới vòi nước lạnh cho đến khi nước trong.||',
                    'Nướng gừng và hành tây||Nướng gừng và hành tây trực tiếp trên lửa (hoặc lò nướng 200°C) đến khi vỏ ngoài cháy xém, dậy mùi thơm. Cạo bỏ lớp vỏ cháy, rửa sạch trước khi cho vào nồi.||https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80&auto=format&fit=crop',
                    'Rang thơm gia vị||Rang hoa hồi, quế, thảo quả, đinh hương và hạt ngò trên chảo khô lửa nhỏ khoảng 3-4 phút đến khi dậy mùi thơm nồng, sau đó cho vào túi vải buộc kín.||',
                    'Hầm xương lấy nước dùng||Cho xương, gừng và hành đã nướng vào nồi lớn, đổ nước ngập xương, hầm lửa nhỏ liu riu trong 6-8 tiếng. Thường xuyên hớt bọt trong 30 phút đầu để nước dùng trong veo.||https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80&auto=format&fit=crop',
                    'Cho túi gia vị vào nước dùng||Khoảng 45 phút cuối trước khi tắt bếp, thả túi gia vị đã rang vào nồi. Không ninh gia vị quá lâu vì sẽ khiến nước dùng bị đắng và nồng quá mức.||',
                    'Nêm nếm và lọc nước dùng||Nêm nước mắm, đường phèn và muối theo khẩu vị, ưu tiên nêm nhạt hơn bình thường một chút vì bánh phở và rau ăn kèm cũng có vị riêng. Lọc nước dùng qua rây mịn để loại bỏ cặn.||',
                    'Trần bánh phở và hoàn thiện tô phở||Trần bánh phở qua nước sôi vài giây, xếp vào tô cùng thịt bò thái mỏng, chan nước dùng đang sôi lên trên để thịt chín tái. Rắc hành lá, ăn kèm rau thơm, chanh và ớt tươi.||',
                ],
                'tip' => 'Muốn nước dùng trong veo như ở hàng phở gia truyền, tuyệt đối không đậy vung khi hầm và luôn hớt bọt ngay từ khi nước vừa sôi lăn tăn — bọt để lâu sẽ tan ngược vào nước dùng làm nước bị đục.',
                'author' => $minhAnh, 'read' => 12, 'published' => '2026-08-22',
            ],
            [
                'category' => 'mon-chinh',
                'title'    => 'Cà Ri Gà Nước Cốt Dừa Đậm Đà Kiểu Miền Nam',
                'slug'     => 'ca-ri-ga-nuoc-cot-dua-dam-da-kieu-mien-nam',
                'excerpt'  => 'Bí quyết để nước cốt dừa không bị tách dầu khi nấu lâu trên bếp.',
                'image'    => 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=900&q=85&auto=format&fit=crop',
                'difficulty' => 'Trung bình', 'prep' => '20 phút', 'cook' => '50 phút', 'servings' => '4 người', 'saved' => 1500,
                'ingredients' => [
                    '800g|đùi gà, chặt miếng vừa ăn', '400ml|nước cốt dừa', '2 củ|khoai tây, cắt khúc',
                    '2 củ|cà rốt, cắt khúc', '2 muỗng|bột cà ri', '3 tép|tỏi băm', '1 củ|hành tím băm',
                    'Vừa đủ|muối, đường, hạt nêm, sả',
                ],
                'steps' => [
                    'Ướp gà||Ướp gà với bột cà ri, tỏi, hành tím, muối và đường trong 30 phút cho ngấm gia vị.||',
                    'Xào săn||Phi thơm sả và hành tỏi còn lại, cho gà vào xào săn đến khi thịt se lại và dậy mùi cà ri.||',
                    'Nấu cùng nước cốt dừa||Cho khoai tây, cà rốt vào xào sơ, đổ nước cốt dừa và nước lọc ngập mặt, nấu lửa nhỏ 35-40 phút đến khi khoai mềm.||',
                    'Nêm nếm và hoàn thiện||Nêm lại gia vị vừa ăn, khuấy nhẹ tay để nước cốt dừa không tách dầu, tắt bếp khi nước sánh lại.||',
                ],
                'tip' => 'Cho nước cốt dừa vào cuối cùng và nấu lửa nhỏ, khuấy đều tay — nấu lửa lớn hoặc khuấy mạnh dễ khiến nước cốt dừa bị tách dầu.',
                'author' => $minhAnh, 'read' => 10, 'published' => '2026-08-10',
            ],
            [
                'category' => 'mon-chinh',
                'title'    => 'Thali Chay — Set Cơm Ấn Độ Đủ 5 Món Cho 1 Người',
                'slug'     => 'thali-chay-set-com-an-do-du-5-mon',
                'excerpt'  => 'Trải nghiệm nấu thử bộ Thali chay truyền thống ngay tại bếp nhà.',
                'image'    => 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=900&q=85&auto=format&fit=crop',
                'difficulty' => 'Khó', 'prep' => '40 phút', 'cook' => '35 phút', 'servings' => '1 người', 'saved' => 980,
                'ingredients' => [
                    '1 chén|gạo basmati', '1 chén|đậu lăng vàng (dal)', '200g|rau bina (spinach)',
                    '1 củ|khoai tây', '100g|sữa chua không đường', 'Vừa đủ|bơ ghee, thì là, nghệ, ớt bột',
                ],
                'steps' => [
                    'Nấu cơm basmati||Vo gạo, nấu cùng chút bơ ghee và một nhúm muối cho hạt cơm tơi, thơm.||',
                    'Nấu dal đậu lăng||Ninh đậu lăng vàng cùng nghệ, thì là đến khi mềm nhừ, phi thơm gia vị rồi trộn vào.||',
                    'Xào rau bina và khoai tây||Xào khoai tây chín tới, cho rau bina vào đảo nhanh tay để rau vẫn giữ màu xanh.||',
                    'Bày biện thali||Múc mỗi món ra một ô nhỏ, thêm sữa chua và dưa chua ăn kèm, dùng nóng cùng cơm basmati.||',
                ],
                'tip' => 'Mỗi món trong thali nên nêm nhạt hơn bình thường một chút — vì khi ăn thali bạn sẽ trộn lẫn nhiều món với cơm.',
                'author' => $minhAnh, 'read' => 9, 'published' => '2026-08-05',
            ],
            [
                'category' => 'mon-chinh',
                'title'    => 'Cà Ri Bò Hầm Kiểu Việt Đậm Đà',
                'slug'     => 'ca-ri-bo-ham-kieu-viet-dam-da',
                'excerpt'  => 'Bí quyết hầm bò mềm nhừ mà nước cà ri vẫn sánh đậm đà chuẩn vị Việt.',
                'image'    => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&q=85&auto=format&fit=crop',
                'difficulty' => 'Trung bình', 'prep' => '20 phút', 'cook' => '90 phút', 'servings' => '4 người', 'saved' => 2100,
                'ingredients' => [
                    '600g|thịt bò gân, bắp bò', '2 củ|khoai tây', '2 củ|cà rốt', '2 muỗng|bột cà ri Ấn',
                    '1 cây|sả đập dập', 'Vừa đủ|nước dừa tươi, tỏi, hành tím',
                ],
                'steps' => [
                    'Ướp bò||Ướp thịt bò với bột cà ri, tỏi, hành tím trong 30 phút.||',
                    'Xào săn thịt||Phi thơm sả, cho thịt bò vào xào săn đến khi dậy mùi cà ri.||',
                    'Hầm cùng nước dừa||Đổ nước dừa tươi ngập mặt thịt, hầm lửa nhỏ 70-80 phút đến khi thịt mềm.||',
                    'Thêm rau củ||Cho khoai tây, cà rốt vào hầm thêm 15-20 phút, nêm lại vừa ăn trước khi tắt bếp.||',
                ],
                'tip' => 'Hầm bò với nước dừa tươi thay vì nước lọc giúp nước cà ri có vị béo ngậy tự nhiên mà không cần cho thêm nước cốt dừa.',
                'author' => $minhAnh, 'read' => 8, 'published' => '2026-08-14',
            ],
            [
                'category' => 'an-lanh',
                'title'    => 'Bơ Nhồi Salad Phô Mai Lựu',
                'slug'     => 'bo-nhoi-salad-pho-mai-luu',
                'excerpt'  => 'Món khai vị thanh mát, không cần bật bếp mà vẫn đủ chất.',
                'image'    => 'https://images.unsplash.com/photo-1495546968767-f0573cca821e?w=900&q=85&auto=format&fit=crop',
                'difficulty' => 'Dễ', 'prep' => '15 phút', 'cook' => '0 phút', 'servings' => '2 người', 'saved' => 1800,
                'ingredients' => [
                    '2 trái|bơ sáp chín vừa', '50g|phô mai feta', '1/2 trái|lựu, tách hạt',
                    '1 nắm|rau xà lách trộn', 'Vừa đủ|dầu olive, chanh, muối, tiêu',
                ],
                'steps' => [
                    'Sơ chế bơ||Bổ đôi bơ, bỏ hạt, khoét nhẹ phần thịt bơ tạo hõm vừa đủ để nhồi nhân.||',
                    'Trộn nhân salad||Trộn phô mai feta, hạt lựu, rau xà lách với dầu olive, nước cốt chanh, muối và tiêu.||',
                    'Hoàn thiện||Nhồi hỗn hợp salad vào từng nửa quả bơ, rắc thêm hạt lựu lên trên và dùng ngay.||',
                ],
                'tip' => 'Chọn bơ vừa chín tới (ấn nhẹ hơi lún) để thịt bơ chắc, không bị nát khi nhồi nhân.',
                'author' => $minhAnh, 'read' => 4, 'published' => '2026-08-06',
            ],
            [
                'category' => 'mon-chinh',
                'title'    => 'Bò Áp Chảo Kiểu Bistro Pháp',
                'slug'     => 'bo-ap-chao-kieu-bistro-phap',
                'excerpt'  => 'Bí quyết áp chảo bò xém cạnh bên ngoài, mềm hồng bên trong kiểu nhà hàng Pháp.',
                'image'    => 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=900&q=85&auto=format&fit=crop',
                'difficulty' => 'Khó', 'prep' => '15 phút', 'cook' => '20 phút', 'servings' => '2 người', 'saved' => 3400,
                'ingredients' => [
                    '2 miếng|thăn bò (ribeye hoặc thăn nội)', '2 muỗng|bơ lạt', '2 tép|tỏi đập dập',
                    '1 nhánh|hương thảo (rosemary)', 'Vừa đủ|muối, tiêu đen xay, dầu olive',
                ],
                'steps' => [
                    'Làm bò về nhiệt độ phòng||Để thịt bò ngoài tủ lạnh khoảng 30 phút trước khi áp chảo để thịt chín đều.||',
                    'Áp chảo||Áp chảo lửa lớn mỗi mặt 2-3 phút để tạo lớp vỏ xém cạnh, giữ nhiệt độ bên trong theo độ chín mong muốn.||',
                    'Rưới bơ tỏi||Hạ lửa vừa, cho bơ, tỏi và hương thảo vào, nghiêng chảo rưới bơ liên tục lên mặt thịt khoảng 1 phút.||',
                    'Nghỉ thịt||Để thịt nghỉ 5 phút trên thớt trước khi cắt, giúp nước thịt giữ lại thay vì chảy hết ra khi cắt.||',
                ],
                'tip' => "Đừng bỏ qua bước để thịt \"nghỉ\" sau khi áp chảo — cắt ngay sẽ làm mất hết nước ngọt bên trong miếng bò.",
                'author' => $minhAnh, 'read' => 6, 'published' => '2026-08-03',
            ],
            [
                'category' => 'mon-chinh',
                'title'    => 'Ramen Nước Dùng Nhanh 30 Phút',
                'slug'     => 'ramen-nuoc-dung-nhanh-30-phut',
                'excerpt'  => 'Tô ramen đậm đà chỉ trong 30 phút nhờ mẹo dùng nước dùng có sẵn.',
                'image'    => 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=900&q=85&auto=format&fit=crop',
                'difficulty' => 'Dễ', 'prep' => '10 phút', 'cook' => '20 phút', 'servings' => '2 người', 'saved' => 2700,
                'ingredients' => [
                    '2 gói|mì ramen tươi (hoặc mì trứng)', '1 lít|nước dùng gà/xương ống có sẵn',
                    '2 muỗng|tương miso', '2 quả|trứng lòng đào', 'Vừa đủ|hành lá, rong biển nori, bắp non',
                ],
                'steps' => [
                    'Đun nước dùng||Đun nóng nước dùng có sẵn, khuấy tan tương miso vào, nêm lại vừa ăn.||',
                    'Luộc mì||Trụng mì ramen theo hướng dẫn trên bao bì, vớt ra tô.||',
                    'Hoàn thiện tô ramen||Chan nước dùng nóng vào tô mì, xếp trứng lòng đào, hành lá, rong biển và bắp non lên trên.||',
                ],
                'tip' => 'Dùng nước dùng gà hầm sẵn (thay vì nước lọc + hạt nêm) sẽ cho vị ramen đậm đà hơn nhiều dù rút ngắn thời gian nấu.',
                'author' => $minhAnh, 'read' => 5, 'published' => '2026-07-30',
            ],
        ];

        foreach ($recipes as $r) {
            $this->execute(
                "INSERT INTO posts (category_id, type, title, slug, excerpt, image, author_name, author_avatar,
                    read_minutes, status, difficulty, prep_time, cook_time, servings, saved_count,
                    ingredients, steps, tip, published_at)
                 VALUES (?, 'recipe', ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    $this->catId($r['category']), $r['title'], $r['slug'], $r['excerpt'], $r['image'],
                    $r['author']['author_name'], $r['author']['author_avatar'], $r['read'],
                    $r['difficulty'], $r['prep'], $r['cook'], $r['servings'], $r['saved'],
                    implode("\n", $r['ingredients']), implode("\n", $r['steps']), $r['tip'],
                    $r['published'] . ' 08:00:00',
                ]
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $items = [
            [
                'Thu Hà', 'Độc giả từ 2021',
                'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80&auto=format&fit=crop',
                'Công thức phở bò của Bếp Xanh là công thức đầu tiên tôi làm thành công sau 3 lần thất bại ở chỗ khác. Các bước hướng dẫn rất chi tiết, không bỏ sót phần nào.',
            ],
            [
                'Phương Linh', 'Độc giả từ 2022',
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80&auto=format&fit=crop',
                'Mình thích nhất là các bài review quán ăn của Bếp Xanh vì luôn nói thật cả điểm chưa tốt, không phải bài nào cũng toàn lời khen như quảng cáo.',
            ],
            [
                'Ngọc Trâm', 'Độc giả từ 2023',
                'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80&auto=format&fit=crop',
                'Mẹo bảo quản rau củ trên blog giúp gia đình mình giảm hẳn lượng thực phẩm bỏ đi mỗi tuần. Cảm ơn Bếp Xanh vì những nội dung thực tế như vậy.',
            ],
        ];
        foreach ($items as $i => [$name, $role, $avatar, $content]) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_role, author_avatar, content, rating, sort_order) VALUES (?, ?, ?, ?, 5, ?)",
                [$name, $role, $avatar, $content, $i + 1]
            );
        }
    }

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $items = [
            ['Làm sao để đóng góp công thức cho Bếp Xanh?', 'Gửi công thức kèm ảnh (nếu có) qua form ở trang Liên hệ, ghi rõ tên món, khẩu phần và nguồn gốc công thức (gia truyền/tự sáng tạo). Bếp Xanh sẽ test lại trước khi đăng và luôn ghi credit đúng tên bạn.'],
            ['Bếp Xanh đăng bài mới với tần suất như thế nào?', 'Trung bình 3 bài viết mới mỗi tuần — xen kẽ giữa công thức nấu ăn, review quán ăn và mẹo bếp núc. Bạn có thể đăng ký nhận bản tin để không bỏ lỡ bài mới.'],
            ['Tôi có thể sử dụng lại công thức trên blog để đăng lên kênh khác không?', 'Bạn có thể nấu theo và chia sẻ trải nghiệm cá nhân, nhưng vui lòng không sao chép nguyên văn nội dung/ảnh để đăng lại trên nền tảng khác mà không xin phép hoặc không dẫn nguồn về Bếp Xanh. Chi tiết xem tại Điều khoản sử dụng.'],
            ['Bếp Xanh có nhận hợp tác quảng cáo hoặc review nhà hàng/quán ăn không?', 'Có — Bếp Xanh nhận hợp tác review có gắn nhãn "Bài viết được tài trợ" rõ ràng, tách biệt hoàn toàn với các bài review tự chi trả. Liên hệ qua trang Liên hệ để trao đổi chi tiết gói hợp tác.'],
            ['Làm sao để đăng ký nhận bản tin (newsletter) từ Bếp Xanh?', 'Điền email vào ô đăng ký ở cuối trang chủ hoặc trong chân trang (footer). Bản tin gửi 1 lần/tuần, tổng hợp bài viết mới và công thức được yêu thích nhất — có thể hủy đăng ký bất cứ lúc nào.'],
            ['Chính sách bình luận trên Bếp Xanh như thế nào?', 'Mọi bình luận góp ý, hỏi đáp về công thức đều được hoan nghênh. Bình luận spam, quảng cáo trá hình hoặc công kích cá nhân sẽ bị ẩn/xóa mà không cần báo trước.'],
            ['Bếp Xanh có bán khóa học nấu ăn hay ebook công thức không?', 'Hiện tại toàn bộ nội dung trên Bếp Xanh đều miễn phí. Trong tương lai có thể ra mắt ebook tổng hợp công thức theo chủ đề — thông tin sẽ được thông báo qua bản tin trước tiên.'],
        ];
        foreach ($items as $i => [$q, $a]) {
            $this->execute(
                "INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)",
                [$q, $a, $i + 1]
            );
        }
    }

    private function seedTimeline(): void {
        if ($this->scalar("SELECT COUNT(*) FROM timeline_items") > 0) return;
        $items = [
            ['2018', 'Bài viết đầu tiên', 'Đăng công thức canh chua cá lóc từ căn bếp thuê 6m², chỉ với 12 lượt xem trong tuần đầu tiên.'],
            ['2020', 'Được báo ẩm thực trong nước giới thiệu', 'Bếp Xanh lọt vào danh sách "5 blog nấu ăn đáng theo dõi" của một chuyên trang ẩm thực, lượng độc giả tăng gấp 6 lần chỉ trong 3 tháng.'],
            ['2022', '100.000 độc giả mỗi tháng', 'Mở thêm chuyên mục Review quán ăn sau khi nhận ra độc giả không chỉ muốn nấu, mà còn muốn biết nên ăn ở đâu.'],
            ['2024', 'Có studio bếp riêng', 'Sau 6 năm quay chụp trong bếp gia đình, Bếp Xanh chuyển sang một studio nhỏ được thiết kế riêng cho việc quay công thức.'],
            ['2026', 'Hơn 420 công thức, 85 quán ăn được review', 'Bếp Xanh hiện đón khoảng 180.000 độc giả mỗi tháng — vẫn giữ nguyên tinh thần ban đầu: nấu thật, ăn thật, viết thật.'],
        ];
        foreach ($items as $i => [$year, $title, $desc]) {
            $this->execute(
                "INSERT INTO timeline_items (year, title, description, sort_order) VALUES (?, ?, ?, ?)",
                [$year, $title, $desc, $i + 1]
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
