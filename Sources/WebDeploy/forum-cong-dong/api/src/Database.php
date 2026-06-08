<?php
declare(strict_types=1);

class Database {
    private \PDO $pdo;
    private static ?Database $instance = null;

    private function __construct() {
        if (DB_TYPE === 'sqlite') {
            $dir = dirname(DB_FILE);
            if (!is_dir($dir)) mkdir($dir, 0755, true);
            $this->pdo = new \PDO('sqlite:' . DB_FILE);
            $this->pdo->exec('PRAGMA foreign_keys = ON');
            $this->pdo->exec('PRAGMA journal_mode = WAL');
        } else {
            $dsn = DB_TYPE . ':host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            $this->pdo = new \PDO($dsn, DB_USER, DB_PASS);
        }
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
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
        // Phai check false — neu schema.sql thieu, tables khong duoc tao
        if ($schema === false) {
            throw new \RuntimeException('schema.sql not found: ' . $schemaPath);
        }
        foreach (array_filter(array_map('trim', explode(';', $schema))) as $stmt) {
            if ($stmt) {
                try {
                    $this->pdo->exec($stmt);
                } catch (\PDOException $e) {
                    // Only ignore "already exists" errors from IF NOT EXISTS clauses
                    if (strpos($e->getMessage(), 'already exists') === false) {
                        throw $e;
                    }
                }
            }
        }
        $this->seedData();
    }

    private function seedData(): void {
        $this->seedUsers();
        $this->seedSettings();
        $this->seedHeroSlides();
        $this->seedForumCategories();
        $this->seedForumThreads();
        $this->seedForumTags();
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
        $rows = [
            // general
            ['site_name',        'Forum Cộng Đồng',                                       'general'],
            ['site_description', 'Diễn đàn cộng đồng — nơi chia sẻ kiến thức, thảo luận và kết nối cho người đam mê công nghệ, thiết kế và kinh doanh tại Việt Nam.', 'general'],
            ['site_logo',        '',                                                        'general'],
            ['site_favicon',     '',                                                        'general'],
            ['site_email',       'hello@forumcongdong.vn',                                 'general'],
            ['site_phone',       '',                                                        'general'],
            ['site_phone_2',     '',                                                        'general'],
            ['site_address',     '',                                                        'general'],
            ['working_hours',    '',                                                        'general'],
            // forum specific
            ['forum_tagline',    'Nơi kết nối cộng đồng',                                  'forum'],
            ['forum_description','Cùng nhau thảo luận, chia sẻ kinh nghiệm và giải quyết vấn đề. Cộng đồng thân thiện, không toxic.', 'forum'],
            ['forum_rules_url',  '',                                                        'forum'],
            ['forum_stat_members','12,840',                                                 'forum'],
            ['forum_stat_threads','3,250',                                                  'forum'],
            ['forum_stat_posts', '48,900',                                                  'forum'],
            // seo
            ['meta_title',       'Forum Cộng Đồng — Chia sẻ, Thảo luận, Kết nối',         'seo'],
            ['meta_description', 'Diễn đàn cộng đồng cho người đam mê công nghệ, thiết kế và kinh doanh tại Việt Nam.', 'seo'],
            ['meta_keywords',    'diễn đàn, forum, cộng đồng, công nghệ, lập trình, thiết kế, startup', 'seo'],
            ['og_image',         '',                                                        'seo'],
            ['google_analytics_id','',                                                      'seo'],
            // social
            ['social_facebook',  '',                                                        'social'],
            ['social_youtube',   '',                                                        'social'],
            ['social_instagram', '',                                                        'social'],
            ['social_tiktok',    '',                                                        'social'],
            ['social_zalo',      '',                                                        'social'],
            // design
            ['primary_color',    '#1a6b52',                                                 'design'],
            ['secondary_color',  '#2d9b73',                                                 'design'],
            // footer
            ['footer_copyright', '© 2025 Forum Cộng Đồng. Cộng đồng Việt Nam.',            'footer'],
            ['footer_description','Cộng đồng dành cho những người đam mê công nghệ, thiết kế và kinh doanh tại Việt Nam.', 'footer'],
            ['footer_show_social','1',                                                       'footer'],
            // contact
            ['contact_form_enabled', '1',                                                   'contact'],
            ['contact_email_receiver','hello@forumcongdong.vn',                             'contact'],
            ['google_map_embed', '',                                                         'contact'],
            // smtp
            ['smtp_host',   'smtp.gmail.com',                                               'smtp'],
            ['smtp_port',   '587',                                                           'smtp'],
            ['smtp_user',   '',                                                              'smtp'],
            ['smtp_password','',                                                             'smtp'],
            ['smtp_from_name','Forum Cộng Đồng',                                            'smtp'],
            ['smtp_from_email','',                                                           'smtp'],
            // system
            ['maintenance_mode',    '0',                                                     'system'],
            ['maintenance_message', 'Website đang bảo trì. Vui lòng quay lại sau.',         'system'],
            // cloudinary
            ['cloudinary_cloud_name', '',                                                    'cloudinary'],
            ['cloudinary_api_key',    '',                                                    'cloudinary'],
            ['cloudinary_api_secret', '',                                                    'cloudinary'],
            ['cloudinary_folder',     'forum-cong-dong',                                    'cloudinary'],
            // integrations
            ['unsplash_access_key',   '',                                                    'integrations'],
        ];
        $stmt = $this->pdo->prepare("INSERT OR IGNORE INTO settings (key, value, \"group\") VALUES (?, ?, ?)");
        foreach ($rows as $r) {
            $stmt->execute($r);
        }
    }

    private function seedHeroSlides(): void {
        if ($this->scalar("SELECT COUNT(*) FROM hero_slides") > 0) return;
        $slides = [
            [
                'title'       => 'Forum Cộng Đồng — Nơi kết nối',
                'subtitle'    => 'Cùng nhau thảo luận, chia sẻ kinh nghiệm và giải quyết vấn đề. Cộng đồng thân thiện cho người đam mê công nghệ, thiết kế và kinh doanh.',
                'button_text' => 'Khám phá diễn đàn',
                'button_link' => '/',
                'image'       => 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop',
                'sort_order'  => 1,
                'status'      => 'published',
            ],
        ];
        foreach ($slides as $s) {
            $this->execute(
                "INSERT INTO hero_slides (title, subtitle, button_text, button_link, image, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [$s['title'], $s['subtitle'], $s['button_text'], $s['button_link'], $s['image'], $s['sort_order'], $s['status']]
            );
        }
    }

    private function seedForumCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM forum_categories") > 0) return;
        $cats = [
            ['Lập trình & Công nghệ', 'lap-trinh-cong-nghe', 'Code, framework, tools, tips & tricks dành cho developer', '💻', 1],
            ['Design & UI/UX',        'design-ui-ux',         'Figma, Photoshop, thiết kế web/app, xu hướng design',       '🎨', 2],
            ['Startup & Kinh doanh',  'startup-kinh-doanh',   'Ý tưởng khởi nghiệp, gọi vốn, marketing, quản trị',        '🚀', 3],
            ['Học tập & Phát triển',  'hoc-tap-phat-trien',   'Career, kỹ năng mềm, review sách, chia sẻ kinh nghiệm',    '📚', 4],
            ['Góc tự do',             'goc-tu-do',             'Cuộc sống, sở thích cá nhân, off-topic, giải trí',         '🌱', 5],
            ['Tuyển dụng & Hợp tác',  'tuyen-dung-hop-tac',   'Job opportunity, freelance, tìm cộng sự, dự án chung',     '🤝', 6],
            ['Thông báo',             'thong-bao',             'Thông báo từ ban quản trị diễn đàn',                       '📢', 7],
        ];
        foreach ($cats as $c) {
            $this->execute(
                "INSERT INTO forum_categories (name, slug, description, icon, sort_order) VALUES (?, ?, ?, ?, ?)",
                $c
            );
        }
    }

    private function seedForumThreads(): void {
        if ($this->scalar("SELECT COUNT(*) FROM forum_threads") > 0) return;

        $catMap = [];
        $rows = $this->query("SELECT id, slug FROM forum_categories");
        foreach ($rows as $r) { $catMap[$r['slug']] = (int)$r['id']; }

        $threads = [
            [
                'category_id'   => $catMap['thong-bao'] ?? null,
                'title'         => '[Đọc trước] Quy tắc cộng đồng và hướng dẫn đăng bài',
                'slug'          => 'quy-tac-cong-dong-huong-dan-dang-bai',
                'content'       => 'Chào mừng đến với Forum Cộng Đồng! Vui lòng đọc kỹ quy tắc trước khi tham gia thảo luận.',
                'author_name'   => 'Admin Team',
                'reply_count'   => 248,
                'is_pinned'     => 1,
                'is_hot'        => 0,
                'status'        => 'published',
                'sort_order'    => 0,
            ],
            [
                'category_id'   => $catMap['lap-trinh-cong-nghe'] ?? null,
                'title'         => 'Từ 0 đến có việc làm sau 6 tháng học code — chia sẻ kinh nghiệm thực tế',
                'slug'          => 'tu-0-den-co-viec-lam-sau-6-thang-hoc-code',
                'content'       => 'Mình muốn chia sẻ hành trình 6 tháng tự học code và đã có offer đầu tiên. Hi vọng bài viết này sẽ giúp ích cho các bạn đang bắt đầu.',
                'author_name'   => 'Minh Tuấn',
                'reply_count'   => 84,
                'is_pinned'     => 0,
                'is_hot'        => 1,
                'status'        => 'published',
                'sort_order'    => 1,
            ],
            [
                'category_id'   => $catMap['design-ui-ux'] ?? null,
                'title'         => 'Figma vs Framer — bạn đang dùng gì cho dự án 2025?',
                'slug'          => 'figma-vs-framer-ban-dang-dung-gi-2025',
                'content'       => 'Sau một thời gian dùng Framer cho production, mình muốn nghe ý kiến của cộng đồng về sự so sánh này.',
                'author_name'   => 'Hải Đăng',
                'reply_count'   => 32,
                'is_pinned'     => 0,
                'is_hot'        => 0,
                'status'        => 'published',
                'sort_order'    => 2,
            ],
            [
                'category_id'   => $catMap['tuyen-dung-hop-tac'] ?? null,
                'title'         => 'Tuyển Frontend React tại startup fintech TP.HCM — remote 50%',
                'slug'          => 'tuyen-frontend-react-startup-fintech-hcm',
                'content'       => 'Công ty fintech đang scale nhanh, tìm kiếm Frontend Developer React/Next.js có ít nhất 2 năm kinh nghiệm.',
                'author_name'   => 'Lan Anh',
                'reply_count'   => 12,
                'is_pinned'     => 0,
                'is_hot'        => 0,
                'status'        => 'published',
                'sort_order'    => 3,
            ],
            [
                'category_id'   => $catMap['startup-kinh-doanh'] ?? null,
                'title'         => 'Làm thế nào để định giá dự án freelance web đúng giá trị?',
                'slug'          => 'dinh-gia-du-an-freelance-web-dung-gia-tri',
                'content'       => 'Một câu hỏi mà hầu hết freelancer mới đều mắc phải. Mình tổng hợp một số phương pháp định giá hiệu quả.',
                'author_name'   => 'Quang Minh',
                'reply_count'   => 56,
                'is_pinned'     => 0,
                'is_hot'        => 0,
                'status'        => 'published',
                'sort_order'    => 4,
            ],
            [
                'category_id'   => $catMap['lap-trinh-cong-nghe'] ?? null,
                'title'         => 'Chia sẻ tool AI yêu thích đang dùng hàng ngày [Thread tổng hợp]',
                'slug'          => 'chia-se-tool-ai-yeu-thich-hang-ngay',
                'content'       => 'Thread tổng hợp những AI tools hữu ích nhất cho developer, designer và marketer.',
                'author_name'   => 'Thành Nam',
                'reply_count'   => 41,
                'is_pinned'     => 0,
                'is_hot'        => 0,
                'status'        => 'published',
                'sort_order'    => 5,
            ],
            [
                'category_id'   => $catMap['hoc-tap-phat-trien'] ?? null,
                'title'         => 'Review sách "The Design of Everyday Things" — Bắt buộc đọc với designer',
                'slug'          => 'review-sach-the-design-of-everyday-things',
                'content'       => 'Một trong những cuốn sách kinh điển về UX/Design. Mình review chi tiết và những điểm học được sau khi đọc xong.',
                'author_name'   => 'Thu Hà',
                'reply_count'   => 18,
                'is_pinned'     => 0,
                'is_hot'        => 0,
                'status'        => 'published',
                'sort_order'    => 6,
            ],
            [
                'category_id'   => $catMap['tuyen-dung-hop-tac'] ?? null,
                'title'         => 'Tìm cộng sự làm side project — app quản lý tài chính nhóm bạn bè',
                'slug'          => 'tim-cong-su-side-project-app-tai-chinh',
                'content'       => 'Mình có idea về app quản lý tài chính nhóm, đang tìm 1-2 người muốn xây dựng cùng.',
                'author_name'   => 'Bảo Châu',
                'reply_count'   => 9,
                'is_pinned'     => 0,
                'is_hot'        => 0,
                'status'        => 'published',
                'sort_order'    => 7,
            ],
        ];
        foreach ($threads as $t) {
            $this->execute(
                "INSERT INTO forum_threads (category_id, title, slug, content, author_name, reply_count, is_pinned, is_hot, status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [$t['category_id'], $t['title'], $t['slug'], $t['content'], $t['author_name'], $t['reply_count'], $t['is_pinned'], $t['is_hot'], $t['status'], $t['sort_order']]
            );
        }
    }

    private function seedForumTags(): void {
        if ($this->scalar("SELECT COUNT(*) FROM forum_tags") > 0) return;
        $tags = [
            ['#javascript', 'javascript', 45],
            ['#react',      'react',      38],
            ['#nextjs',     'nextjs',     22],
            ['#figma',      'figma',      29],
            ['#freelance',  'freelance',  31],
            ['#career',     'career',     24],
            ['#startup',    'startup',    18],
            ['#ai-tools',   'ai-tools',   52],
        ];
        foreach ($tags as $t) {
            $this->execute(
                "INSERT INTO forum_tags (name, slug, usage_count) VALUES (?, ?, ?)",
                $t
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

    public function scalar(string $sql, array $params = []): mixed {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $val = $stmt->fetchColumn();
        return $val === false ? null : $val;
    }
}
