<?php
declare(strict_types=1);

class Database
{
    private \PDO $pdo;
    private static ?Database $instance = null;

    private function __construct()
    {
        $dir = dirname(DB_FILE);
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }

        $this->pdo = new \PDO('sqlite:' . DB_FILE);
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
        $this->pdo->exec('PRAGMA foreign_keys = ON');
        $this->pdo->exec('PRAGMA journal_mode = WAL');

        $this->migrate();
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function migrate(): void
    {
        $schemaPath = __DIR__ . '/../schema.sql';
        $schema = file_get_contents($schemaPath);
        if ($schema === false) {
            throw new \RuntimeException('schema.sql not found: ' . $schemaPath);
        }
        $statements = array_filter(array_map('trim', explode(';', $schema)));
        foreach ($statements as $stmt) {
            if ($stmt) {
                try {
                    $this->pdo->exec($stmt);
                } catch (\PDOException $e) {
                    // Ignore "already exists" errors from IF NOT EXISTS
                }
            }
        }
        $this->seedData();
    }

    private function seedData(): void
    {
        $this->seedUsers();
        $this->seedSettings();
        $this->seedHeroSlides();
        $this->seedMenuCategories();
        $this->seedMenuItems();
        $this->seedTestimonials();
        $this->seedGallery();
    }

    private function seedUsers(): void
    {
        if ($this->scalar('SELECT COUNT(*) FROM users') > 0) return;
        $this->execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['sysadmin', 'sysadmin@admin.com', password_hash('123456', PASSWORD_BCRYPT), 'superadmin']
        );
    }

    private function seedSettings(): void
    {
        if ($this->scalar('SELECT COUNT(*) FROM settings') > 0) return;
        $settings = [
            // general
            ['site_name',          'Lá Xanh Chay Organic',          'general'],
            ['site_description',   'Ẩm thực thuần chay 100%, nguyên liệu organic, không chất bảo quản. Thanh tịnh tâm hồn, nuôi dưỡng sức khỏe.', 'general'],
            ['site_logo',          '',                               'general'],
            ['site_favicon',       '',                               'general'],
            ['site_email',         'info@laxanhchay.vn',            'general'],
            ['site_phone',         '0901 234 567',                   'general'],
            ['site_phone_2',       '',                               'general'],
            ['site_address',       '123 Đường Lá Xanh, Quận 3, TP.HCM', 'general'],
            ['working_hours',      'Thứ 2 – Thứ 6: 07:00–21:00 | Thứ 7: 07:00–22:00 | Chủ nhật: 08:00–21:00', 'general'],
            // seo
            ['meta_title',         'Lá Xanh Chay Organic — Ẩm Thực Thuần Chay Tươi Lành', 'seo'],
            ['meta_description',   'Nhà hàng chay organic tại TP.HCM. Hơn 50 món chay từ nguyên liệu organic Đà Lạt, không chất bảo quản, không phụ gia.', 'seo'],
            ['meta_keywords',      'nhà hàng chay, ăn chay organic, quán chay, chay thuần, vegan, plant-based', 'seo'],
            ['og_image',           '',                               'seo'],
            ['google_analytics_id','',                               'seo'],
            // social
            ['social_facebook',    'https://facebook.com/laxanhchay', 'social'],
            ['social_youtube',     '',                               'social'],
            ['social_instagram',   'https://instagram.com/laxanhchay', 'social'],
            ['social_tiktok',      '',                               'social'],
            ['social_zalo',        '0901234567',                     'social'],
            // design
            ['primary_color',      '#15803d',                        'design'],
            ['secondary_color',    '#f6faf6',                        'design'],
            // footer
            ['footer_copyright',   '© 2026 Lá Xanh Chay Organic · Made in Vietnam 🇻🇳', 'footer'],
            ['footer_description', 'Ẩm thực chay organic, nấu từ tâm — mỗi bữa ăn là một lựa chọn yêu thương.', 'footer'],
            ['footer_show_social', '1',                              'footer'],
            // contact
            ['contact_form_enabled','1',                             'contact'],
            ['contact_email_receiver','info@laxanhchay.vn',          'contact'],
            ['google_map_embed',   '',                               'contact'],
            // smtp
            ['smtp_host',          'smtp.gmail.com',                 'smtp'],
            ['smtp_port',          '587',                            'smtp'],
            ['smtp_user',          '',                               'smtp'],
            ['smtp_password',      '',                               'smtp'],
            ['smtp_from_name',     'Lá Xanh Chay Organic',          'smtp'],
            ['smtp_from_email',    'info@laxanhchay.vn',            'smtp'],
            // system
            ['maintenance_mode',   '0',                              'system'],
            ['maintenance_message','Website đang bảo trì, vui lòng quay lại sau.', 'system'],
            // about
            ['about_title',        'Ẩm thực chay — không chỉ là thức ăn', 'about'],
            ['about_tagline',      'Từ nông trại organic thẳng đến bàn ăn', 'about'],
            ['about_content',      'Lá Xanh ra đời từ niềm tin rằng ăn chay không có nghĩa là từ bỏ hương vị. Ngược lại, ẩm thực thuần chay khi được làm đúng cách sẽ phong phú, đa dạng và mãn nguyện. Chúng tôi hợp tác trực tiếp với các nông trại hữu cơ tại Đà Lạt, đảm bảo mỗi nguyên liệu đều sạch, tươi và được trồng theo tiêu chuẩn organic.', 'about'],
            ['about_image',        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=80&auto=format&fit=crop', 'about'],
            // reservation
            ['reservation_enabled','1',                              'reservation'],
            ['reservation_note',   'Vui lòng thông báo dị ứng thực phẩm khi đặt bàn. Đặt bàn nhóm 7+ người: liên hệ trực tiếp.', 'reservation'],
            // cloudinary
            ['cloudinary_cloud_name', '',                            'cloudinary'],
            ['cloudinary_api_key',    '',                            'cloudinary'],
            ['cloudinary_api_secret', '',                            'cloudinary'],
            ['cloudinary_upload_folder', 'nha-hang-chay-organic',   'cloudinary'],
            // integrations
            ['unsplash_access_key',   '',                            'integrations'],
        ];
        foreach ($settings as [$key, $value, $group]) {
            $this->execute(
                'INSERT OR IGNORE INTO settings (key, value, "group") VALUES (?, ?, ?)',
                [$key, $value, $group]
            );
        }
    }

    private function seedHeroSlides(): void
    {
        if ($this->scalar('SELECT COUNT(*) FROM hero_slides') > 0) return;
        $slides = [
            [
                'title'       => 'Ăn chay, sống tươi xanh, tâm thêm tịnh.',
                'subtitle'    => 'Mỗi món ăn là một lựa chọn yêu thương — yêu bản thân, yêu thiên nhiên và yêu những người xung quanh bạn.',
                'button_text' => 'Xem thực đơn',
                'button_link' => '/thuc-don',
                'image'       => 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80&auto=format&fit=crop',
                'sort_order'  => 1,
            ],
            [
                'title'       => 'Từ nông trại organic thẳng đến bàn ăn',
                'subtitle'    => 'Mỗi sáng, rau củ được thu hái và chuyển đến nhà hàng trong vòng 6 giờ. Không kho lạnh, không hóa chất.',
                'button_text' => 'Câu chuyện của chúng tôi',
                'button_link' => '/ve-chung-toi',
                'image'       => 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80&auto=format&fit=crop',
                'sort_order'  => 2,
            ],
            [
                'title'       => 'Hơn 50 món chay organic đang chờ bạn',
                'subtitle'    => 'Phong phú, đa dạng khẩu vị — từ món nhẹ khai vị đến món chính no bụng, từ tươi mát đến ấm áp nuôi dưỡng.',
                'button_text' => 'Đặt bàn ngay',
                'button_link' => '/lien-he',
                'image'       => 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&q=80&auto=format&fit=crop',
                'sort_order'  => 3,
            ],
        ];
        foreach ($slides as $slide) {
            $this->execute(
                'INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order) VALUES (?,?,?,?,?,?)',
                [$slide['title'], $slide['subtitle'], $slide['button_text'], $slide['button_link'], $slide['image'], $slide['sort_order']]
            );
        }
    }

    private function seedMenuCategories(): void
    {
        if ($this->scalar('SELECT COUNT(*) FROM menu_categories') > 0) return;
        $cats = [
            ['name' => 'Khai Vị',               'slug' => 'khai-vi',      'icon' => '🥗', 'sort_order' => 1],
            ['name' => 'Salad Organic',          'slug' => 'salad',        'icon' => '🥬', 'sort_order' => 2],
            ['name' => 'Món Chính',              'slug' => 'mon-chinh',    'icon' => '🍱', 'sort_order' => 3],
            ['name' => 'Nước Ép & Trà Thảo Mộc','slug' => 'do-uong',      'icon' => '🍵', 'sort_order' => 4],
            ['name' => 'Tráng Miệng Chay',       'slug' => 'trang-mieng', 'icon' => '🍮', 'sort_order' => 5],
        ];
        foreach ($cats as $cat) {
            $this->execute(
                'INSERT INTO menu_categories (name, slug, icon, sort_order) VALUES (?,?,?,?)',
                [$cat['name'], $cat['slug'], $cat['icon'], $cat['sort_order']]
            );
        }
    }

    private function seedMenuItems(): void
    {
        if ($this->scalar('SELECT COUNT(*) FROM menu_items') > 0) return;
        $catIds = [];
        $rows = $this->query('SELECT id, slug FROM menu_categories');
        foreach ($rows as $row) {
            $catIds[$row['slug']] = (int)$row['id'];
        }

        $items = [
            // Khai vị
            ['cat' => 'khai-vi', 'name' => 'Súp Bí Đỏ & Gừng Tươi',  'desc' => 'Bí đỏ hữu cơ hầm mềm, xay nhuyễn cùng gừng tươi và sữa hạnh nhân. Vị ngọt bùi tự nhiên, không cần đường.', 'tags' => 'Bí đỏ organic,Gừng tươi,Sữa hạnh nhân', 'price' => 59000, 'calories' => '210 kcal', 'featured' => 0, 'sort' => 1],
            ['cat' => 'khai-vi', 'name' => 'Chả Giò Chay Kiểu Sài Gòn','desc' => 'Vỏ bánh gạo giòn rụm, nhân đậu phụ, miến, mộc nhĩ, hành tây. Chấm tương chua ngọt thảo mộc.', 'tags' => 'Bún tàu,Nấm mộc nhĩ,Đậu phụ', 'price' => 55000, 'calories' => '280 kcal', 'featured' => 0, 'sort' => 2],
            ['cat' => 'khai-vi', 'name' => 'Gỏi Xoài Xanh Mùa Hè',    'desc' => 'Xoài xanh thái sợi, rau thơm, cà rốt, đậu phộng rang. Sốt tắc sả đặc biệt — chua ngọt mát lạnh.', 'tags' => 'Xoài Cát Chu,Rau thơm hữu cơ,Đậu phộng rang', 'price' => 55000, 'calories' => '185 kcal', 'featured' => 0, 'sort' => 3],
            ['cat' => 'khai-vi', 'name' => 'Nấm Cuộn Rau Mầm',         'desc' => 'Nấm hương phi mềm, cuộn cùng rau mầm, bơ thái hạt lựu, sốt miso trắng. Thanh mát nhẹ bụng.', 'tags' => 'Nấm hương,Rau mầm hữu cơ', 'price' => 65000, 'calories' => '160 kcal', 'featured' => 0, 'sort' => 4],
            // Salad
            ['cat' => 'salad', 'name' => 'Salad Mùa Hè Organic',       'desc' => 'Mix rau organic Đà Lạt, cà chua bi, dưa leo, ớt chuông đỏ, hạt chia. Sốt balsamic mật ong thảo mộc.', 'tags' => 'Rau củ Đà Lạt,Hạt chia,Balsamic mật ong', 'price' => 69000, 'calories' => '180 kcal', 'featured' => 1, 'sort' => 1],
            ['cat' => 'salad', 'name' => 'Caesar Chay với Đậu Hũ Giòn', 'desc' => 'Rau cải romaine tươi giòn, đậu hũ chiên giòn thay crouton, sốt Caesar thuần chay từ hạt điều rang.', 'tags' => 'Romaine lettuce,Đậu hũ giòn,Sốt Caesar chay', 'price' => 79000, 'calories' => '295 kcal', 'featured' => 0, 'sort' => 2],
            ['cat' => 'salad', 'name' => 'Salad Rau Mầm & Quinoa',      'desc' => 'Quinoa protein cao, rau mầm đủ loại, bơ thái hạt lựu, cà rốt tím, sốt tahini chanh tươi.', 'tags' => 'Quinoa hữu cơ,Rau mầm tươi,Bơ chín', 'price' => 85000, 'calories' => '340 kcal', 'featured' => 1, 'sort' => 3],
            // Món chính
            ['cat' => 'mon-chinh', 'name' => 'Buddha Bowl Rực Rỡ',      'desc' => 'Quinoa protein cao, rau mầm, bơ, cà rốt tím, đậu hữu cơ nướng giòn, sốt tahini chanh. No bụng lâu, no đủ chất.', 'tags' => 'Quinoa,Đậu hũ nướng,Sốt tahini', 'price' => 89000, 'calories' => '420 kcal', 'featured' => 1, 'sort' => 1],
            ['cat' => 'mon-chinh', 'name' => 'Cơm Gạo Lứt Chay Đủ Chất','desc' => 'Cơm gạo lứt ST25 hữu cơ, 3 loại rau xào miso, nấm đùi gà rang bơ tỏi, canh rau củ dashi chay.', 'tags' => 'Gạo lứt hữu cơ,Rau xào miso,Nấm rang', 'price' => 85000, 'calories' => '380 kcal', 'featured' => 0, 'sort' => 2],
            ['cat' => 'mon-chinh', 'name' => 'Canh Nấm Hầm Thảo Dược',  'desc' => 'Nấm đông cô, linh chi đỏ, táo đỏ, kỷ tử, sen hạt hầm 4 giờ. Ngọt thanh, tốt cho sức khỏe nội tạng.', 'tags' => 'Nấm đông cô,Linh chi,Táo đỏ', 'price' => 75000, 'calories' => '145 kcal', 'featured' => 1, 'sort' => 3],
            ['cat' => 'mon-chinh', 'name' => 'Bún Bò Huế Chay',         'desc' => 'Nước dùng nấu từ sả, mắm ruốc chay đặc chế, nấm bào ngư thay thịt, rau sống tươi. Chuẩn vị Huế.', 'tags' => 'Bún tươi,Nấm bào ngư,Sả mắm ruốc chay', 'price' => 79000, 'calories' => '390 kcal', 'featured' => 0, 'sort' => 4],
            ['cat' => 'mon-chinh', 'name' => 'Mì Hạt Điều Xào Rau',     'desc' => 'Mì lúa mì hữu cơ, xào cùng rau củ Đà Lạt, sốt hạt điều rang béo ngậy, ít cay nhẹ nhàng.', 'tags' => 'Mì lúa mì hữu cơ,Rau củ hữu cơ,Sốt hạt điều', 'price' => 82000, 'calories' => '410 kcal', 'featured' => 0, 'sort' => 5],
            // Đồ uống
            ['cat' => 'do-uong', 'name' => 'Nước Ép Detox Xanh',        'desc' => 'Cải xoăn, táo xanh, cần tây, gừng tươi, chanh vàng. Detox toàn thân, tinh thần sảng khoái.', 'tags' => 'Cải xoăn,Táo xanh,Gừng', 'price' => 55000, 'calories' => '95 kcal', 'featured' => 0, 'sort' => 1],
            ['cat' => 'do-uong', 'name' => 'Trà Hoa Cúc Mật Ong',       'desc' => 'Cúc khô hữu cơ, mật ong rừng nguyên chất, chanh tươi. Phục hồi mắt, giảm căng thẳng.', 'tags' => 'Cúc hữu cơ,Mật ong rừng', 'price' => 42000, 'calories' => '45 kcal', 'featured' => 0, 'sort' => 2],
            ['cat' => 'do-uong', 'name' => 'Sữa Hạt Tươi (Hạnh Nhân / Yến Mạch)', 'desc' => 'Sữa hạt ép lạnh tươi mỗi ngày, không chất ổn định, không hương nhân tạo.', 'tags' => 'Hạt hữu cơ,Không đường tinh luyện', 'price' => 49000, 'calories' => '120–150 kcal', 'featured' => 0, 'sort' => 3],
            ['cat' => 'do-uong', 'name' => 'Matcha Latte Organic',       'desc' => 'Matcha ceremony grade từ Uji Nhật Bản, sữa yến mạch hữu cơ, một chút mật ong. Thanh đắng nhẹ, hậu ngọt dịu.', 'tags' => 'Matcha Nhật A-Grade,Sữa yến mạch', 'price' => 62000, 'calories' => '165 kcal', 'featured' => 0, 'sort' => 4],
            // Tráng miệng
            ['cat' => 'trang-mieng', 'name' => 'Bánh Mousse Xoài & Dừa','desc' => 'Mousse xoài thuần chay, đế hạt cashew nghiền, kem dừa tươi, phủ gelée lá dứa. Không cần lò nướng, 100% nguyên liệu tươi.', 'tags' => 'Xoài Cát Chu,Kem dừa tươi,Đế cashew', 'price' => 55000, 'calories' => '240 kcal', 'featured' => 1, 'sort' => 1],
            ['cat' => 'trang-mieng', 'name' => 'Chè Dưỡng Sinh Bạch Mộc Nhĩ','desc' => 'Bạch mộc nhĩ collagen chay, hạt sen Huế, thạch mã thầy, đường phèn thiên nhiên. Mát gan, đẹp da, ngủ ngon.', 'tags' => 'Bạch mộc nhĩ,Sen hạt,Thạch mã thầy', 'price' => 45000, 'calories' => '175 kcal', 'featured' => 0, 'sort' => 2],
            ['cat' => 'trang-mieng', 'name' => 'Chocolate Tart Thuần Chay','desc' => 'Cacao 70% không sữa, đế từ chà là nghiền và hạt điều, kem dừa tươi. Ngọt tự nhiên, không đường tinh luyện.', 'tags' => 'Cacao 70%,Đế date & hạt,Kem dừa', 'price' => 59000, 'calories' => '290 kcal', 'featured' => 0, 'sort' => 3],
        ];

        foreach ($items as $item) {
            $catId = $catIds[$item['cat']] ?? null;
            $slug = $this->makeSlug($item['name']);
            $this->execute(
                'INSERT OR IGNORE INTO menu_items (category_id, name, slug, description, tags, price, calories, featured, sort_order) VALUES (?,?,?,?,?,?,?,?,?)',
                [$catId, $item['name'], $slug, $item['desc'], $item['tags'], $item['price'], $item['calories'], $item['featured'], $item['sort']]
            );
        }
    }

    private function seedTestimonials(): void
    {
        if ($this->scalar('SELECT COUNT(*) FROM testimonials') > 0) return;
        $items = [
            [
                'author_name'  => 'Nguyễn Thanh Tùng',
                'author_title' => 'Lần đầu ăn chay · Hà Nội',
                'author_avatar'=> 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop&crop=face',
                'content'      => 'Tôi không hay ăn chay nhưng người bạn rủ đến đây và tôi hoàn toàn bị thuyết phục. Món Buddha Bowl ngon đến mức khó tin là không có thịt!',
                'rating'       => 5,
                'sort_order'   => 1,
            ],
            [
                'author_name'  => 'Phạm Bích Hà',
                'author_title' => 'Thực dưỡng · TP.HCM',
                'author_avatar'=> 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop&crop=face',
                'content'      => 'Không gian trong lành, nhẹ nhàng như thế này rất hiếm ở thành phố. Nguyên liệu organic thực sự tươi và khác biệt. Salad hôm nay ăn xong cảm giác mình thanh thản hẳn.',
                'rating'       => 5,
                'sort_order'   => 2,
            ],
            [
                'author_name'  => 'Lê Minh Trí',
                'author_title' => 'Phụ huynh · Đà Nẵng',
                'author_avatar'=> 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&crop=face',
                'content'      => 'Mang con nhỏ 3 tuổi đến ăn, con ăn rất ngon miệng. Nhân viên rất thân thiện và tư vấn món phù hợp. Đây là nhà hàng chay duy nhất tôi giới thiệu cho mọi người không ngại ngần.',
                'rating'       => 5,
                'sort_order'   => 3,
            ],
        ];
        foreach ($items as $item) {
            $this->execute(
                'INSERT INTO testimonials (author_name, author_title, author_avatar, content, rating, sort_order) VALUES (?,?,?,?,?,?)',
                [$item['author_name'], $item['author_title'], $item['author_avatar'], $item['content'], $item['rating'], $item['sort_order']]
            );
        }
    }

    private function seedGallery(): void
    {
        if ($this->scalar('SELECT COUNT(*) FROM gallery_items') > 0) return;
        $items = [
            ['title' => 'Buddha Bowl Rực Rỡ',      'image' => 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80&auto=format&fit=crop', 'category' => 'Món chính', 'sort_order' => 1],
            ['title' => 'Salad Mùa Hè Organic',     'image' => 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80&auto=format&fit=crop', 'category' => 'Salad',     'sort_order' => 2],
            ['title' => 'Canh Nấm Hầm Thảo Dược',  'image' => 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80&auto=format&fit=crop', 'category' => 'Món chính', 'sort_order' => 3],
            ['title' => 'Bánh Mousse Xoài & Dừa',  'image' => 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80&auto=format&fit=crop', 'category' => 'Tráng miệng','sort_order' => 4],
            ['title' => 'Nông trại organic Đà Lạt', 'image' => 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80&auto=format&fit=crop', 'category' => 'Không gian','sort_order' => 5],
            ['title' => 'Không gian nhà hàng',      'image' => 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format&fit=crop', 'category' => 'Không gian','sort_order' => 6],
        ];
        foreach ($items as $item) {
            $this->execute(
                'INSERT INTO gallery_items (title, image, category, sort_order) VALUES (?,?,?,?)',
                [$item['title'], $item['image'], $item['category'], $item['sort_order']]
            );
        }
    }

    private function makeSlug(string $text): string
    {
        $text = mb_strtolower($text, 'UTF-8');
        $map = [
            'à'=>'a','á'=>'a','â'=>'a','ã'=>'a','ä'=>'a','å'=>'a','æ'=>'ae',
            'è'=>'e','é'=>'e','ê'=>'e','ë'=>'e','ì'=>'i','í'=>'i','î'=>'i','ï'=>'i',
            'ò'=>'o','ó'=>'o','ô'=>'o','õ'=>'o','ö'=>'o','ø'=>'o','œ'=>'oe',
            'ù'=>'u','ú'=>'u','û'=>'u','ü'=>'u','ý'=>'y','ÿ'=>'y',
            'đ'=>'d','ß'=>'ss','ñ'=>'n','ç'=>'c',
            'ắ'=>'a','ặ'=>'a','ầ'=>'a','ấ'=>'a','ậ'=>'a','ẩ'=>'a','ẫ'=>'a',
            'ằ'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a','ă'=>'a',
            'ế'=>'e','ề'=>'e','ệ'=>'e','ể'=>'e','ễ'=>'e',
            'ị'=>'i','ỉ'=>'i','ĩ'=>'i',
            'ố'=>'o','ồ'=>'o','ộ'=>'o','ổ'=>'o','ỗ'=>'o','ớ'=>'o','ờ'=>'o','ợ'=>'o','ở'=>'o','ỡ'=>'o','ơ'=>'o',
            'ứ'=>'u','ừ'=>'u','ự'=>'u','ử'=>'u','ữ'=>'u','ư'=>'u',
            'ỳ'=>'y','ỵ'=>'y','ỷ'=>'y','ỹ'=>'y',
        ];
        $text = strtr($text, $map);
        $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
        $text = preg_replace('/[\s-]+/', '-', trim($text));
        return $text;
    }

    // ── Query helpers ────────────────────────────────────────────────────────

    public function query(string $sql, array $params = []): array
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): ?array
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function scalar(string $sql, array $params = []): mixed
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $val = $stmt->fetchColumn();
        return $val;
    }

    public function execute(string $sql, array $params = []): int
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (int)$this->pdo->lastInsertId();
    }
}
