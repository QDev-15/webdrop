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
        // Strip comment TRƯỚC khi split — tránh vỡ explode(';') nếu comment chứa dấu ';'
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
        $this->seedMenuCategories();
        $this->seedMenuItems();
        $this->seedFeaturedDrinks();
        $this->seedRetailBeans();
        $this->seedBrewMethods();
        $this->seedRoastSteps();
        $this->seedWorkAreas();
        $this->seedGalleryItems();
        $this->seedTimelineItems();
        $this->seedTestimonials();
        $this->seedFaqs();
    }

    // ─── Users ───────────────────────────────────────────────────────────────
    private function seedUsers(): void {
        if ($this->scalar("SELECT COUNT(*) FROM users") > 0) return;
        $this->execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ['sysadmin', 'sysadmin@admin.com', password_hash('123456', PASSWORD_BCRYPT), 'superadmin']
        );
    }

    // ─── Settings ────────────────────────────────────────────────────────────
    private function seedSettings(): void {
        if ($this->scalar("SELECT COUNT(*) FROM settings") > 0) return;
        $settings = [
            // ── Thông tin chung ── (site_name = tên thương hiệu, chữ " Roastery" cố định trong Header/Footer)
            ['site_name', 'Mộc Rang', 'general'],
            ['site_tagline', 'Xưởng rang cà phê đặc sản', 'general'],
            ['site_description', 'Mộc Rang Roastery — xưởng rang cà phê đặc sản, tự rang xay mỗi ngày từ hạt single-origin Việt Nam. Không gian mộc mạc, ấm áp kiểu xưởng thủ công.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', 'hello@mocrang.vn', 'general'],
            ['site_phone', '090 123 4567', 'general'],
            ['site_address', '12 Đường Nguyễn Văn Đậu, Phường 5, Quận Bình Thạnh, TP.HCM', 'general'],
            ['working_hours', '7:00 – 21:00 hàng ngày (kể cả cuối tuần)', 'general'],
            ['zalo_phone', '0901234567', 'general'],

            // ── SEO ──
            ['meta_title', 'Mộc Rang Roastery | Xưởng Rang Cà Phê Đặc Sản', 'seo'],
            ['meta_description', 'Mộc Rang Roastery — xưởng rang cà phê đặc sản, tự rang xay mỗi ngày từ hạt single-origin Việt Nam. Không gian mộc mạc, ấm áp kiểu xưởng thủ công.', 'seo'],
            ['meta_keywords', 'cà phê rang xay, xưởng rang cà phê, cà phê specialty, single origin việt nam, cà phê đặc sản', 'seo'],
            ['og_image', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80&auto=format&fit=crop', 'seo'],

            // ── Mạng xã hội ──
            ['facebook', '#', 'social'],
            ['instagram', '#', 'social'],
            ['tiktok', '#', 'social'],

            // ── Footer ──
            ['footer_description', 'Xưởng rang cà phê đặc sản — chọn hạt, rang và pha chế ngay tại chỗ. Mỗi mẻ rang là một lần thử nghiệm hương vị mới.', 'footer'],
            ['footer_copyright', '© 2026 Mộc Rang Roastery · Made in Vietnam 🇻🇳', 'footer'],

            // ── Liên hệ / Bản đồ ──
            ['map_embed', 'https://maps.google.com/maps?q=10.7769,106.7009&hl=vi&z=15&output=embed', 'contact'],
            ['contact_delivery_note', 'Nội thành giao trong ngày · Tỉnh khác qua GHN/GHTK', 'contact'],

            // ── Nội dung — Trang chủ ──
            ['home_intro_eyebrow', 'Triết lý rang xay', 'content'],
            ['home_intro_lead', 'Cà phê ngon không phải may mắn — đó là kết quả của việc *chọn hạt đúng*, *rang đúng thời điểm* và *pha đúng công thức* cho từng loại hạt.', 'content'],
            ['home_intro_paragraph', 'Xưởng rang của chúng tôi vận hành theo mô hình rang mẻ nhỏ (micro-batch) — tối đa 5kg mỗi mẻ — để kiểm soát nhiệt độ và thời gian rang chính xác đến từng giây, giữ trọn hương vị đặc trưng của từng vùng nguyên liệu.', 'content'],
            ['home_process1_title', 'Chọn hạt', 'content'],
            ['home_process1_desc', 'Thu mua trực tiếp từ nông trại, chọn lọc thủ công từng lô hạt xanh chất lượng cao.', 'content'],
            ['home_process2_title', 'Rang mẻ nhỏ', 'content'],
            ['home_process2_desc', 'Rang tối đa 5kg/mẻ, theo dõi đường cong nhiệt độ để ra đúng profile mong muốn.', 'content'],
            ['home_process3_title', 'Pha chế thử', 'content'],
            ['home_process3_desc', 'Cupping mỗi mẻ rang trước khi đưa vào menu — đảm bảo hương vị đồng nhất.', 'content'],
            ['home_drinks_eyebrow', 'Thức uống nổi bật', 'content'],
            ['home_drinks_title', 'Những gì *khách hay gọi nhất*', 'content'],
            ['home_drinks_sub', 'Từ espresso rang đậm đến pour over single-origin — mỗi ly đều bắt đầu từ hạt do chính xưởng chúng tôi rang.', 'content'],
            ['home_brew_eyebrow', 'Phương pháp pha chế', 'content'],
            ['home_brew_title', 'Cùng một hạt, *bốn trải nghiệm*', 'content'],
            ['home_brew_sub', 'Mỗi phương pháp khai thác một khía cạnh hương vị khác nhau của cùng một loại hạt rang.', 'content'],
            ['stat1_num', '3', 'content'], ['stat1_label', 'Vùng nguyên liệu chính', 'content'],
            ['stat2_num', '6+', 'content'], ['stat2_label', 'Năm vận hành xưởng rang', 'content'],
            ['stat3_num', '5kg', 'content'], ['stat3_label', 'Mỗi mẻ rang micro-batch', 'content'],
            ['stat4_num', '120+', 'content'], ['stat4_label', 'Kg hạt rang mỗi tuần', 'content'],
            ['home_space_eyebrow', 'Không gian xưởng', 'content'],
            ['home_space_title', 'Ba khu vực, *một quy trình*', 'content'],
            ['home_space_sub', 'Từ khu rang hạt đến bàn pha chế và khu ngồi — mọi công đoạn đều có thể nhìn thấy tận mắt.', 'content'],
            ['home_review_eyebrow', 'Đánh giá từ khách', 'content'],
            ['home_review_title', 'Họ nói gì về *xưởng rang*', 'content'],
            ['home_faq_eyebrow', 'Câu hỏi thường gặp', 'content'],
            ['home_faq_title', 'Giải đáp *nhanh*', 'content'],
            ['home_fb_title', 'Ghé xưởng, uống thử\n*một mẻ rang mới*', 'content'],
            ['home_fb_sub', 'Mỗi tuần chúng tôi đều có mẻ rang mới — ghé xưởng để cupping cùng barista hoặc đặt hàng giao tận nơi.', 'content'],

            // ── Nội dung — Trang Thực đơn ──
            ['menu_hero_tag', 'Thực đơn', 'content'],
            ['menu_hero_title', 'Từ ly cà phê pha sẵn\nđến *hạt rang mang về*', 'content'],
            ['menu_hero_sub', 'Toàn bộ nguyên liệu cà phê đều do chính xưởng rang — giá niêm yết rõ ràng cho từng loại.', 'content'],
            ['menu_retail_eyebrow', 'Mua mang về', 'content'],
            ['menu_retail_title', 'Cà phê *hạt rang* nguyên chất', 'content'],
            ['menu_retail_sub', 'Đóng túi có van thoát khí, ghi rõ ngày rang. Giá niêm yết theo trọng lượng.', 'content'],

            // ── Nội dung — Trang Không gian ──
            ['space_hero_tag', 'Không gian', 'content'],
            ['space_hero_title', 'Xưởng rang mở —\n*nhìn thấy từng công đoạn*', 'content'],
            ['space_hero_sub', 'Không có gì giấu sau cánh cửa — khách có thể quan sát toàn bộ quá trình rang, pha chế ngay tại quầy.', 'content'],
            ['space_stat1_num', '45', 'content'], ['space_stat1_label', 'm² khu rang mở', 'content'],
            ['space_stat2_num', '12', 'content'], ['space_stat2_label', 'Chỗ ngồi tại quầy bar', 'content'],
            ['space_stat3_num', '40', 'content'], ['space_stat3_label', 'Chỗ ngồi khu vực chính', 'content'],
            ['space_stat4_num', '7:00', 'content'], ['space_stat4_label', 'Mở cửa mỗi ngày', 'content'],
            ['space_gallery_eyebrow', 'Thư viện ảnh', 'content'],
            ['space_gallery_title', 'Vài khoảnh khắc *tại xưởng*', 'content'],
            ['space_fb_title', 'Ghé thăm xưởng rang\n*bất cứ lúc nào*', 'content'],
            ['space_fb_sub', 'Không cần đặt trước để tham quan khu rang và pha chế — chỉ cần ghé và hỏi nhân viên tại quầy.', 'content'],

            // ── Nội dung — Trang Giới thiệu ──
            ['about_hero_tag', 'Giới thiệu', 'content'],
            ['about_hero_title', 'Câu chuyện của\n*một xưởng rang nhỏ*', 'content'],
            ['about_hero_sub', 'Bắt đầu từ một chiếc máy rang mẫu 1kg, đến nay chúng tôi vẫn giữ nguyên triết lý: rang mẻ nhỏ, kiểm soát chất lượng từng lô hạt.', 'content'],
            ['about_eyebrow', 'Khởi đầu', 'content'],
            ['about_lead', 'Chúng tôi bắt đầu chỉ vì *không tìm được* một ly cà phê single-origin Việt Nam đúng nghĩa trong thành phố.', 'content'],
            ['about_paragraph1', 'Năm đó, sau nhiều chuyến đi tìm hiểu vùng nguyên liệu tại Cầu Đất (Đà Lạt), Khe Sanh (Quảng Trị) và Sơn La, chúng tôi nhận ra Việt Nam có những lô hạt Arabica chất lượng rất cao — nhưng phần lớn bị trộn lẫn và rang công nghiệp, làm mất đi đặc trưng vùng miền.', 'content'],
            ['about_paragraph2', 'Từ đó, xưởng rang nhỏ của chúng tôi ra đời — với một chiếc máy rang trống công suất 1kg đặt trong một căn nhà thuê nhỏ. Sau nhiều năm, chúng tôi vẫn giữ nguyên cách làm ấy, chỉ mở rộng quy mô đủ để phục vụ nhiều khách hàng hơn mà không đánh đổi chất lượng.', 'content'],
            ['about_timeline_eyebrow', 'Hành trình', 'content'],
            ['about_timeline_title', 'Từ căn nhà thuê nhỏ *đến xưởng rang hôm nay*', 'content'],
            ['about_process_eyebrow', 'Quy trình', 'content'],
            ['about_process_title', 'Chọn hạt kỹ tính, *rang có kiểm soát*', 'content'],
            ['about_process_sub', 'Ba bước cố định cho mọi lô hạt trước khi lên kệ hoặc pha thành ly cà phê phục vụ khách.', 'content'],
            ['about_faq_eyebrow', 'Câu hỏi thường gặp', 'content'],
            ['about_faq_title', 'Những điều *khách hay hỏi*', 'content'],
            ['about_faq_sub', 'Nếu câu hỏi của bạn chưa có ở đây, đừng ngại nhắn tin qua trang Liên hệ.', 'content'],
            ['about_fb_title', 'Muốn nếm thử\n*trước khi đặt sỉ?*', 'content'],
            ['about_fb_sub', 'Ghé xưởng để cupping trực tiếp cùng barista trước khi quyết định đặt hàng số lượng lớn.', 'content'],

            // ── Nội dung — Trang Liên hệ ──
            ['contact_hero_tag', 'Liên hệ', 'content'],
            ['contact_hero_title', 'Đặt hạt rang, đặt sỉ\nhoặc *ghé thăm xưởng*', 'content'],
            ['contact_hero_sub', 'Điền thông tin bên dưới hoặc liên hệ trực tiếp qua điện thoại / Zalo — chúng tôi phản hồi trong vòng 30 phút giờ hành chính.', 'content'],

            // ── Pháp lý ──
            ['legal_updated', '01/07/2026', 'legal'],
            ['privacy_content', "<h2>1. Mục đích thu thập thông tin</h2><p>Mộc Rang Roastery thu thập thông tin cá nhân (họ tên, số điện thoại, email, địa chỉ giao hàng) khi khách hàng đặt hạt rang, đặt sỉ, đặt lịch tham quan xưởng hoặc liên hệ qua form trên website. Thông tin này chỉ nhằm mục đích xử lý đơn hàng, liên hệ tư vấn và chăm sóc khách hàng.</p><h2>2. Phạm vi sử dụng thông tin</h2><ul><li>Xác nhận và xử lý đơn đặt hàng, đặt sỉ.</li><li>Liên hệ giao hàng, thông báo tình trạng mẻ rang mới.</li><li>Gửi bản tin (nếu khách hàng chủ động đăng ký qua form newsletter).</li><li>Hỗ trợ giải quyết khiếu nại, đổi trả theo chính sách công bố.</li></ul><h2>3. Thời gian lưu trữ</h2><p>Thông tin khách hàng được lưu trữ trong suốt thời gian duy trì quan hệ giao dịch và tối đa 2 năm sau giao dịch cuối cùng, trừ khi có yêu cầu xóa từ khách hàng hoặc quy định pháp luật yêu cầu khác.</p><h2>4. Đơn vị được tiếp cận thông tin</h2><p>Chúng tôi không bán, trao đổi thông tin cá nhân của khách hàng cho bên thứ ba vì mục đích thương mại. Thông tin chỉ được chia sẻ với đơn vị vận chuyển (GHN/GHTK) để phục vụ giao hàng, và tuân thủ khi có yêu cầu hợp pháp từ cơ quan nhà nước.</p><h2>5. Quyền của khách hàng</h2><ul><li>Yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân đã cung cấp.</li><li>Từ chối nhận bản tin/email marketing bất cứ lúc nào.</li><li>Khiếu nại về việc sử dụng thông tin sai mục đích đã công bố.</li></ul><h2>6. Bảo mật thông tin</h2><p>Dữ liệu khách hàng được lưu trữ có kiểm soát truy cập, chỉ nhân sự liên quan trực tiếp đến xử lý đơn hàng mới được phép truy cập. Chúng tôi áp dụng các biện pháp kỹ thuật hợp lý để ngăn ngừa truy cập trái phép.</p><h2>7. Liên hệ</h2><p>Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ qua email hello@mocrang.vn hoặc số điện thoại 090 123 4567.</p>", 'legal'],
            ['terms_content', "<h2>1. Phạm vi áp dụng</h2><p>Điều khoản này áp dụng cho mọi giao dịch đặt hàng, đặt sỉ, đặt lịch tham quan xưởng và mọi tương tác của khách hàng với website Mộc Rang Roastery. Việc tiếp tục sử dụng website đồng nghĩa với việc khách hàng đồng ý với các điều khoản dưới đây.</p><h2>2. Đặt hàng &amp; xác nhận</h2><p>Đơn đặt hàng qua form liên hệ hoặc điện thoại/Zalo được xem là hoàn tất sau khi nhân viên xác nhận lại thông tin sản phẩm, số lượng và địa chỉ giao hàng. Giá niêm yết trên website có thể thay đổi theo mùa vụ nguyên liệu và sẽ được thông báo trước khi xác nhận đơn.</p><h2>3. Chính sách đổi trả</h2><p>Áp dụng đổi trong vòng 3 ngày kể từ ngày nhận hàng đối với sản phẩm chưa mở túi hoặc lỗi từ phía xưởng (rang không đều, đóng gói hở van, sai loại hạt so với đơn đặt). Chi phí vận chuyển đổi trả trong trường hợp lỗi từ xưởng sẽ do xưởng chi trả.</p><h2>4. Giao hàng</h2><ul><li>Nội thành: giao trong ngày, miễn phí cho đơn từ 300.000đ.</li><li>Ngoại thành/tỉnh khác: giao qua đơn vị vận chuyển GHN/GHTK, thời gian và phí theo chính sách của đơn vị vận chuyển.</li><li>Xưởng không chịu trách nhiệm cho các sự cố phát sinh ngoài tầm kiểm soát trong quá trình vận chuyển (thất lạc do đơn vị vận chuyển, thiên tai...).</li></ul><h2>5. Đặt sỉ / Bán buôn</h2><p>Áp dụng cho đơn hàng từ 5kg/tháng trở lên. Mức giá sỉ, chu kỳ giao hàng và profile rang riêng sẽ được thỏa thuận cụ thể qua hợp đồng hoặc xác nhận bằng văn bản/tin nhắn giữa hai bên trước khi giao dịch chính thức.</p><h2>6. Quyền sở hữu trí tuệ</h2><p>Toàn bộ nội dung, hình ảnh, logo trên website thuộc quyền sở hữu của Mộc Rang Roastery. Không sao chép, sử dụng lại cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản.</p><h2>7. Thay đổi điều khoản</h2><p>Chúng tôi có quyền cập nhật, điều chỉnh điều khoản sử dụng bất cứ lúc nào. Phiên bản mới nhất luôn được đăng tải công khai tại trang này.</p><h2>8. Liên hệ</h2><p>Mọi thắc mắc liên quan đến điều khoản sử dụng, vui lòng liên hệ qua email hello@mocrang.vn hoặc số điện thoại 090 123 4567.</p>", 'legal'],

            // ── SMTP ──
            ['smtp_host', '', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_pass', '', 'smtp'],
            ['smtp_from_name', 'Mộc Rang Roastery', 'smtp'],
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

    // ─── Hero Slides ─────────────────────────────────────────────────────────
    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        // title: "\n" xuống dòng, "*từ*" in nghiêng màu accent.
        // subtitle format: "label||desc||primaryText||primaryLink". button_text/button_link (core) = nút OUTLINE (phụ).
        // image: 4 URL nối bằng "\n" (lưới ảnh magazine grid) — mọi ảnh trong 1 slide link tới primaryLink.
        $slides = [
            [
                'title' => "Từ hạt xanh\nđến *tách cà phê*\ntrong xưởng.",
                'subtitle' => "🔥 Rang mẻ nhỏ mỗi ngày||Chúng tôi chọn lọc, rang và pha chế cà phê ngay tại chỗ — mỗi mẻ rang chỉ 3–5kg để giữ trọn hương vị nguyên bản của từng vùng trồng.||Xem thực đơn||/thuc-don",
                'button_text' => 'Khám phá xưởng rang →',
                'button_link' => '/khong-gian',
                'image' => implode("\n", [
                    'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=700&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=700&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=700&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80&auto=format&fit=crop',
                ]),
                'sort_order' => 1,
            ],
            [
                'title' => "Cầu Đất, Khe Sanh,\nSơn La — *ba vùng*\nba hương vị.",
                'subtitle' => "🌱 Single-origin Việt Nam||Chúng tôi làm việc trực tiếp với nông trại tại Đà Lạt, Quảng Trị và Sơn La, chọn lô hạt Arabica chất lượng cao nhất mỗi vụ mùa.||Câu chuyện của chúng tôi||/gioi-thieu",
                'button_text' => 'Menu Pour Over →',
                'button_link' => '/thuc-don',
                'image' => implode("\n", [
                    'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=700&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1587734195342-579ed260ba8c?w=700&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1524350876685-274059332603?w=700&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=700&q=80&auto=format&fit=crop',
                ]),
                'sort_order' => 2,
            ],
            [
                'title' => "Mỗi ly pha chế\nlà một *lần thử*\nnghiệm hương vị.",
                'subtitle' => "☕ Barista tận tâm||Đội ngũ barista được đào tạo bài bản, luôn thử nếm và điều chỉnh công thức rang — pha để hương vị luôn ở trạng thái tốt nhất.||Đặt lịch tham quan||/lien-he",
                'button_text' => 'Xem khu pha chế →',
                'button_link' => '/khong-gian',
                'image' => implode("\n", [
                    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=700&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1442550528053-c431ecb55509?w=700&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=700&q=80&auto=format&fit=crop',
                ]),
                'sort_order' => 3,
            ],
            [
                'title' => "Mua hạt rang\ntươi mới xuất\n*lò mỗi tuần*.",
                'subtitle' => "🛍️ Mang cà phê về nhà||Hạt rang đóng túi có van thoát khí, ghi rõ ngày rang và vùng trồng — giao tận nơi trong ngày tại nội thành.||Mua hạt rang||/thuc-don",
                'button_text' => 'Đặt sỉ số lượng lớn →',
                'button_link' => '/lien-he',
                'image' => implode("\n", [
                    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=700&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=700&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=700&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1516557070061-c3d1653fa646?w=700&q=80&auto=format&fit=crop',
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

    // ─── Thực đơn ────────────────────────────────────────────────────────────
    private function seedMenuCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_categories") > 0) return;
        $cats = [
            ['☕ Espresso-Based', 'espresso-based'],
            ['🫗 Pour Over & Single Origin', 'pour-over-single-origin'],
            ['🧊 Cold Brew & Đá Xay', 'cold-brew-da-xay'],
            ['🍵 Trà & Bánh Kèm', 'tra-banh-kem'],
        ];
        foreach ($cats as $i => [$name, $slug]) {
            $this->execute(
                "INSERT INTO menu_categories (name, slug, sort_order) VALUES (?, ?, ?)",
                [$name, $slug, $i + 1]
            );
        }
    }

    private function seedMenuItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM menu_items") > 0) return;
        $catIds = $this->query("SELECT id, slug FROM menu_categories ORDER BY sort_order");
        $map = [];
        foreach ($catIds as $c) { $map[$c['slug']] = $c['id']; }

        $items = [
            // Espresso-Based
            ['espresso-based', 'Espresso Nguyên Chất', 'Robusta Đắk Lắk 100%, rang đậm, hậu vị socola đắng', 35000],
            ['espresso-based', 'Signature Blend Espresso', 'Arabica Cầu Đất + Robusta Đắk Lắk, crema dày, hậu caramel', 42000],
            ['espresso-based', 'Cappuccino Rang Xưởng', 'Foam mịn, note hạt dẻ rang, rắc bột cacao nguyên chất', 48000],
            ['espresso-based', 'Latte Caramel Xưởng', 'Caramel tự nấu thủ công, sữa tươi local, foam mượt', 52000],
            ['espresso-based', 'Flat White', 'Double ristretto, microfoam mịn, vị đậm cân bằng', 50000],
            ['espresso-based', 'Mocha Cacao Đắk Lắk', 'Cacao nguyên chất địa phương, socola đậm, kem tươi', 55000],
            ['espresso-based', 'Bạc Xỉu Đá', 'Espresso, sữa đặc, sữa tươi — phong cách cà phê Việt', 45000],
            // Pour Over & Single Origin
            ['pour-over-single-origin', 'Pour Over Cầu Đất — Đà Lạt', 'Arabica Bourbon, hương hoa nhài, hậu cam quýt', 68000],
            ['pour-over-single-origin', 'Pour Over Khe Sanh — Quảng Trị', 'Arabica Catimor, vị trái cây mọng, hậu ngọt mật ong', 65000],
            ['pour-over-single-origin', 'Pour Over Sơn La', 'Arabica vùng cao, note táo xanh và trà đen', 70000],
            ['pour-over-single-origin', 'Syphon Ethiopia Yirgacheffe', 'Hạt nhập khẩu, hương hoa cỏ và berry, chiết xuất bằng syphon', 85000],
            ['pour-over-single-origin', 'AeroPress Robusta Rang Sáng', 'Vị đậm, chua nhẹ thanh, hậu ngọt kéo dài', 55000],
            ['pour-over-single-origin', 'Cold Drip 8 Giờ', 'Nhỏ giọt lạnh trong 8 giờ, vị thanh, gần như không chua', 75000],
            // Cold Brew & Đá Xay
            ['cold-brew-da-xay', 'Cold Brew Nguyên Bản 18h', 'Ngâm lạnh 18 giờ, vị mượt, ít acid, hậu ngọt tự nhiên', 55000],
            ['cold-brew-da-xay', 'Cold Brew Sữa Dừa', 'Cold brew nền, nước cốt dừa tươi, đá viên', 62000],
            ['cold-brew-da-xay', 'Đá Xay Caramel Rang Xưởng', 'Espresso xay đá, caramel tự nấu, kem tươi phủ mặt', 58000],
            ['cold-brew-da-xay', 'Cascara Soda', 'Nước lên men từ vỏ quả cà phê, vị chua ngọt, có gas', 50000],
            ['cold-brew-da-xay', 'Americano Đá', 'Espresso pha loãng với nước, đá viên, vị nhẹ nhàng', 42000],
            // Trà & Bánh Kèm
            ['tra-banh-kem', 'Trà Ô Long Rang Lửa', 'Ô long rang thủ công, hương khói nhẹ, hậu ngọt', 48000],
            ['tra-banh-kem', 'Nước Ép Cam Vàng', 'Cam vắt tươi tại chỗ, không đường', 42000],
            ['tra-banh-kem', 'Croissant Bơ Pháp', 'Bơ AOP, lớp vỏ giòn, ruột mềm thơm — đặt kèm cà phê rất hợp', 38000],
            ['tra-banh-kem', 'Bánh Phô Mai Yến Mạch', 'Không nướng, mịn béo, ăn kèm espresso giảm ngán rất tốt', 45000],
        ];
        foreach ($items as $i => [$catSlug, $name, $desc, $price]) {
            $this->execute(
                "INSERT INTO menu_items (category_id, name, slug, description, price, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                [$map[$catSlug] ?? null, $name, slugify($name), $desc, $price, $i + 1]
            );
        }
    }

    private function seedFeaturedDrinks(): void {
        if ($this->scalar("SELECT COUNT(*) FROM featured_drinks") > 0) return;
        $items = [
            ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80&auto=format&fit=crop', 'Signature Blend', 'Espresso Nguyên Chất', 'Robusta Đắk Lắk 100%, rang đậm, hậu vị socola đắng', 35000],
            ['https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&q=80&auto=format&fit=crop', 'Cầu Đất, Đà Lạt', 'Pour Over Bourbon', 'Arabica Bourbon, hương hoa nhài, hậu cam quýt', 68000],
            ['https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80&auto=format&fit=crop', 'Signature Blend', 'Latte Caramel Xưởng', 'Caramel tự nấu, sữa tươi local, foam mịn', 52000],
            ['https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&q=80&auto=format&fit=crop', 'Khe Sanh, Quảng Trị', 'Cold Brew Nguyên Bản', 'Ngâm lạnh 18 giờ, vị mượt, ít acid, hậu ngọt', 55000],
        ];
        foreach ($items as $i => [$image, $origin, $name, $desc, $price]) {
            $this->execute(
                "INSERT INTO featured_drinks (image, origin, name, description, price, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                [$image, $origin, $name, $desc, $price, $i + 1]
            );
        }
    }

    private function seedRetailBeans(): void {
        if ($this->scalar("SELECT COUNT(*) FROM retail_beans") > 0) return;
        $items = [
            ['https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=500&q=80&auto=format&fit=crop', 'Đắk Lắk', 'Robusta Rang Đậm Cổ Điển', '200g: 70.000đ · 500g: 150.000đ', 'Từ 70.000đ'],
            ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&q=80&auto=format&fit=crop', 'Blend Xưởng', 'Signature Blend', '200g: 85.000đ · 500g: 180.000đ', 'Từ 85.000đ'],
            ['https://images.unsplash.com/photo-1587734195342-579ed260ba8c?w=500&q=80&auto=format&fit=crop', 'Cầu Đất, Đà Lạt', 'Single Origin Bourbon', '200g: 115.000đ · 500g: 260.000đ', 'Từ 115.000đ'],
            ['https://images.unsplash.com/photo-1516557070061-c3d1653fa646?w=500&q=80&auto=format&fit=crop', 'Nhập khẩu', 'Ethiopia Yirgacheffe', '200g: 140.000đ · 500g: 320.000đ', 'Từ 140.000đ'],
        ];
        foreach ($items as $i => [$image, $origin, $name, $desc, $priceLabel]) {
            $this->execute(
                "INSERT INTO retail_beans (image, origin, name, description, price_label, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
                [$image, $origin, $name, $desc, $priceLabel, $i + 1]
            );
        }
    }

    private function seedBrewMethods(): void {
        if ($this->scalar("SELECT COUNT(*) FROM brew_methods") > 0) return;
        $items = [
            ['☕', 'Espresso', 'Áp suất 9 bar, chiết xuất 25–30 giây. Nền tảng của mọi thức uống cà phê sữa, crema dày và đậm đà.', 'Đậm đà · Nhanh'],
            ['🫗', 'Pour Over', 'Rót tay qua giấy lọc, tỉ lệ nước/cà phê chuẩn xác. Hương vị sạch, thể hiện rõ đặc trưng hạt single-origin.', 'Tinh tế · Hoa & trái cây'],
            ['🧊', 'Cold Brew', 'Ngâm lạnh 18–24 giờ ở nhiệt độ thấp. Vị mượt, ít acid, ngọt tự nhiên — uống đá hoặc pha soda đều ngon.', 'Mát lạnh · Mượt mà'],
            ['🔥', 'Syphon', 'Chiết xuất bằng chân không và nhiệt, trình diễn ngay tại bàn. Hương thơm nổi bật, vị trong và sạch.', 'Trình diễn · Hương thơm cao'],
        ];
        foreach ($items as $i => [$icon, $name, $desc, $tag]) {
            $this->execute(
                "INSERT INTO brew_methods (icon, name, description, tag, sort_order) VALUES (?, ?, ?, ?, ?)",
                [$icon, $name, $desc, $tag, $i + 1]
            );
        }
    }

    private function seedRoastSteps(): void {
        if ($this->scalar("SELECT COUNT(*) FROM roast_steps") > 0) return;
        $items = [
            ['🌾', 'Chọn lô hạt xanh', 'Kiểm tra độ ẩm, tỉ lệ lỗi hạt, và nếm thử (cupping) hạt xanh trước khi quyết định thu mua cả lô.'],
            ['🔥', 'Xây dựng profile rang', 'Mỗi vùng nguyên liệu có một đường cong nhiệt độ riêng, được ghi lại và điều chỉnh qua nhiều lần rang thử.'],
            ['📋', 'Cupping kiểm định', 'Mỗi mẻ rang đều được cupping trước khi đóng gói — chỉ những mẻ đạt chuẩn mới được đưa ra bán.'],
            ['📦', 'Đóng gói có van khí', 'Túi zip có van thoát khí một chiều, ghi rõ ngày rang và vùng trồng trên từng bao bì.'],
        ];
        foreach ($items as $i => [$icon, $name, $desc]) {
            $this->execute(
                "INSERT INTO roast_steps (icon, name, description, sort_order) VALUES (?, ?, ?, ?)",
                [$icon, $name, $desc, $i + 1]
            );
        }
    }

    private function seedWorkAreas(): void {
        if ($this->scalar("SELECT COUNT(*) FROM work_areas") > 0) return;
        $items = [
            ['Khu Rang', 'Khu rang', 'Rang Trống Micro-Batch', 'Máy rang trống · Quan sát trực tiếp',
             'Máy rang trống công suất nhỏ, mỗi mẻ tối đa 5kg. Khách có thể đứng ngay cạnh quan sát và ngửi mùi hạt chuyển màu qua từng phút rang.',
             'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=700&q=80&auto=format&fit=crop'],
            ['Khu Pha Chế', 'Khu pha chế', 'Quầy Bar Mở', 'Quầy bar mở · Barista trình diễn',
             'Quầy bar thiết kế mở hoàn toàn — khách ngồi ngay trước mặt barista, có thể trò chuyện về profile rang và cách pha từng loại hạt.',
             'https://images.unsplash.com/photo-1442550528053-c431ecb55509?w=700&q=80&auto=format&fit=crop'],
            ['Khu Ngồi', 'Khu ngồi', 'Bàn Gỗ Mộc & Ánh Sáng Tự Nhiên', 'Gỗ mộc · Ánh sáng tự nhiên',
             'Nội thất gỗ thô mộc, cửa kính lớn đón ánh sáng tự nhiên. Có khu bàn dài cho nhóm và góc bàn đơn cho khách làm việc một mình.',
             'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80&auto=format&fit=crop'],
        ];
        foreach ($items as $i => [$name, $caption, $detailTitle, $shortSub, $desc, $image]) {
            $this->execute(
                "INSERT INTO work_areas (name, caption, detail_title, short_sub, description, image, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [$name, $caption, $detailTitle, $shortSub, $desc, $image, $i + 1]
            );
        }
    }

    private function seedGalleryItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM gallery_items") > 0) return;
        $items = [
            ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80&auto=format&fit=crop', 'Máy rang cà phê đang hoạt động'],
            ['https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80&auto=format&fit=crop', 'Hạt cà phê vừa rang xong đổ ra khay làm nguội'],
            ['https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80&auto=format&fit=crop', 'Barista đang pha chế tại quầy bar'],
            ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80&auto=format&fit=crop', 'Khu ngồi ánh sáng tự nhiên'],
            ['https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80&auto=format&fit=crop', 'Hạt cà phê rang mộc để trong khay gỗ'],
            ['https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80&auto=format&fit=crop', 'Ly latte art tại quầy bar'],
            ['https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&q=80&auto=format&fit=crop', 'Dụng cụ pha cà phê thủ công trên kệ gỗ'],
            ['https://images.unsplash.com/photo-1442550528053-c431ecb55509?w=600&q=80&auto=format&fit=crop', 'Toàn cảnh quầy bar mở'],
            ['https://images.unsplash.com/photo-1524350876685-274059332603?w=600&q=80&auto=format&fit=crop', 'Bao tải hạt cà phê xanh nhập về xưởng'],
        ];
        foreach ($items as $i => [$image, $title]) {
            $this->execute(
                "INSERT INTO gallery_items (title, image, sort_order) VALUES (?, ?, ?)",
                [$title, $image, $i + 1]
            );
        }
    }

    private function seedTimelineItems(): void {
        if ($this->scalar("SELECT COUNT(*) FROM timeline_items") > 0) return;
        $items = [
            ['Năm đầu tiên', 'Chiếc máy rang 1kg đầu tiên', 'Bắt đầu rang thử nghiệm tại nhà, mang mẫu đến từng quán quen để xin góp ý.'],
            ['Năm thứ 2–3', 'Kết nối trực tiếp với nông trại', 'Đến tận nơi tại Cầu Đất và Khe Sanh, xây dựng quan hệ thu mua trực tiếp, bỏ qua thương lái trung gian.'],
            ['Năm thứ 4–5', 'Mở xưởng rang có không gian pha chế', 'Chuyển sang địa điểm hiện tại — xưởng rang mở, khách có thể ngồi lại và quan sát toàn bộ quy trình.'],
            ['Hiện tại', '120kg hạt rang mỗi tuần', 'Phục vụ khách lẻ tại quán và hơn 15 quán cà phê đối tác đặt hạt rang định kỳ mỗi tháng.'],
        ];
        foreach ($items as $i => [$year, $title, $desc]) {
            $this->execute(
                "INSERT INTO timeline_items (year_label, title, description, sort_order) VALUES (?, ?, ?, ?)",
                [$year, $title, $desc, $i + 1]
            );
        }
    }

    private function seedTestimonials(): void {
        if ($this->scalar("SELECT COUNT(*) FROM testimonials") > 0) return;
        $items = [
            ['Phạm Anh Tuấn', 'Kỹ sư phần mềm · TP.HCM', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80&auto=format&fit=crop',
             'Lần đầu thấy cà phê được rang ngay trước mắt, mùi hạt rang thơm nức cả quán. Espresso đậm và crema dày hơn hẳn mấy chỗ khác.'],
            ['Đỗ Thu Hà', 'Content Creator · Hà Nội', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80&auto=format&fit=crop',
             'Pour Over Cầu Đất uống có vị hoa và cam quýt rõ ràng, không nghĩ cà phê Việt Nam lại có hương vị tinh tế đến vậy. Sẽ quay lại mua hạt về nhà.'],
            ['Lê Quốc Bảo', 'Chủ quán cà phê · Đà Nẵng', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&auto=format&fit=crop',
             'Đặt sỉ hạt rang cho quán mình được gần 1 năm, chất lượng ổn định mẻ nào cũng như mẻ nào. Đội ngũ tư vấn rất kỹ về profile rang.'],
        ];
        foreach ($items as $i => [$name, $title, $avatar, $content]) {
            $this->execute(
                "INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order) VALUES (?, ?, ?, ?, 5, ?)",
                [$name, $title, $avatar, $content, $i + 1]
            );
        }
    }

    private function seedFaqs(): void {
        if ($this->scalar("SELECT COUNT(*) FROM faqs") > 0) return;
        $home = [
            ['Giá cà phê hạt tại xưởng tính như thế nào?', 'Giá theo trọng lượng và vùng nguyên liệu, dao động từ 150.000đ đến 320.000đ/500g tùy loại hạt và mức độ rang. Xem bảng giá chi tiết tại trang Thực đơn.'],
            ['Cà phê có bị hết hạn sau khi rang không?', 'Hạt rang ngon nhất trong 2–4 tuần sau khi rang. Chúng tôi luôn ghi ngày rang trên bao bì để khách nắm được độ tươi.'],
            ['Có nhận đặt sỉ cho quán khác không?', 'Có. Xem thêm chi tiết chính sách đặt sỉ và bảo quản tại trang Giới thiệu — mục Câu hỏi thường gặp.'],
        ];
        $full = [
            ['Giá cà phê hạt tại xưởng tính như thế nào?', 'Giá theo trọng lượng (200g hoặc 500g) và vùng nguyên liệu — dao động từ 150.000đ đến 320.000đ cho gói 500g. Hạt càng hiếm (như Ethiopia nhập khẩu) giá càng cao. Xem đầy đủ tại trang Thực đơn, mục "Hạt Rang Mang Về".'],
            ['Cà phê tại xưởng có nguồn gốc từ đâu?', 'Chủ yếu từ ba vùng: Cầu Đất (Đà Lạt), Khe Sanh (Quảng Trị) và Sơn La — thu mua trực tiếp từ nông trại. Ngoài ra có thêm một số lô hạt nhập khẩu theo mùa như Ethiopia Yirgacheffe.'],
            ['Cách bảo quản cà phê hạt/bột sau khi mua?', 'Giữ trong túi zip kín có van khí, để nơi khô ráo, tránh ánh nắng trực tiếp và nhiệt độ cao. Nên dùng hết trong 2–4 tuần kể từ ngày rang (ghi trên bao bì) để giữ trọn hương vị. Không nên để trong tủ lạnh vì hơi ẩm sẽ ảnh hưởng đến hạt.'],
            ['Có nhận đặt sỉ / bán buôn cho quán khác không?', 'Có. Chúng tôi hiện đang cung cấp hạt rang định kỳ cho hơn 15 quán cà phê đối tác. Số lượng từ 5kg/tháng trở lên sẽ có mức giá sỉ riêng — liên hệ trực tiếp qua trang Liên hệ để được tư vấn profile rang phù hợp với concept quán.'],
            ['Có giao hàng tận nơi không? Phí giao ra sao?', 'Nội thành giao trong ngày, miễn phí cho đơn từ 300.000đ trở lên (dưới mức này phụ thu 20.000đ). Khu vực ngoại thành và tỉnh khác giao qua đối tác vận chuyển GHN/GHTK, phí tính theo khoảng cách thực tế.'],
            ['Chính sách đổi trả nếu cà phê không đúng khẩu vị?', 'Đổi trong vòng 3 ngày kể từ ngày nhận hàng nếu túi chưa mở hoặc phát hiện lỗi từ phía xưởng (rang không đều, đóng gói hở van...). Trường hợp không hợp khẩu vị cá nhân, chúng tôi tư vấn đổi sang loại hạt/mức rang khác phù hợp hơn.'],
            ['Có thể đặt lịch tham quan xưởng rang không?', 'Có. Khách lẻ có thể ghé tham quan khu rang bất cứ giờ mở cửa nào. Với nhóm từ 10 người trở lên hoặc muốn trải nghiệm cupping cùng barista, vui lòng đặt lịch trước ít nhất 1 ngày qua trang Liên hệ.'],
        ];
        $order = 1;
        foreach ($home as [$q, $a]) {
            $this->execute("INSERT INTO faqs (question, answer, show_home, sort_order) VALUES (?, ?, 1, ?)", [$q, $a, $order++]);
        }
        foreach ($full as [$q, $a]) {
            $this->execute("INSERT INTO faqs (question, answer, show_home, sort_order) VALUES (?, ?, 0, ?)", [$q, $a, $order++]);
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
