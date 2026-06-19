<?php
declare(strict_types=1);

class Database {
    private \PDO $pdo;
    private static ?Database $instance = null;

    private function __construct() {
        if (DB_TYPE === 'sqlite') {
            $dir = dirname(DB_FILE);
            if (!is_dir($dir)) mkdir($dir, 0755, true);
            $isNew = !file_exists(DB_FILE);
            $this->pdo = new \PDO('sqlite:' . DB_FILE);
            $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            $this->pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
            $this->pdo->exec('PRAGMA foreign_keys = ON');
            $this->pdo->exec('PRAGMA journal_mode = WAL');
            if ($isNew) {
                $this->migrate();
            }
        } else {
            $dsn = DB_TYPE . ':host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            $this->pdo = new \PDO($dsn, DB_USER, DB_PASS);
            $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            $this->pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
        }
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
        // ⚠️ PHẢI check false — nếu schema.sql bị thiếu, tables không được tạo
        if ($schema === false) {
            throw new \RuntimeException('schema.sql not found: ' . $schemaPath);
        }
        $statements = array_filter(array_map('trim', explode(';', $schema)));
        foreach ($statements as $stmt) {
            if ($stmt) {
                try {
                    $this->pdo->exec($stmt);
                } catch (\PDOException $e) {
                    // ignore IF NOT EXISTS errors
                }
            }
        }
        $this->seedData();
    }

    private function seedData(): void {
        $this->seedUsers();
        $this->seedSettings();
        $this->seedCategories();
        $this->seedPosts();
        $this->seedTags();
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
            ['site_name', 'Blog Cá Nhân', 'general'],
            ['site_description', 'Blog chia sẻ về công nghệ, tư duy và cuộc sống. Viết để hiểu — không phải để nổi tiếng.', 'general'],
            ['site_logo', '', 'general'],
            ['site_favicon', '', 'general'],
            ['site_email', '', 'general'],
            ['site_phone', '', 'general'],
            ['site_phone_2', '', 'general'],
            ['site_address', '', 'general'],
            ['working_hours', '', 'general'],
            // author
            ['author_name', 'Nguyễn Văn A', 'author'],
            ['author_title', 'Developer & Writer', 'author'],
            ['author_bio', 'Tôi viết về công nghệ, tư duy và cuộc sống. Mỗi tuần một bài, đúng giờ.', 'author'],
            ['author_avatar', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80&auto=format&fit=crop&crop=face', 'author'],
            // seo
            ['meta_title', 'Blog Cá Nhân — Công nghệ, Tư duy & Cuộc sống', 'seo'],
            ['meta_description', 'Blog chia sẻ kiến thức về công nghệ, tư duy và cuộc sống — bài viết chuyên sâu, thực tế.', 'seo'],
            ['meta_keywords', 'blog, công nghệ, tư duy, cuộc sống, lập trình, productivity', 'seo'],
            ['og_image', '', 'seo'],
            ['google_analytics_id', '', 'seo'],
            // social
            ['social_facebook', '', 'social'],
            ['social_youtube', '', 'social'],
            ['social_instagram', '', 'social'],
            ['social_tiktok', '', 'social'],
            ['social_zalo', '', 'social'],
            // design
            ['primary_color', '#1a6b52', 'design'],
            ['secondary_color', '#2d9b73', 'design'],
            // footer
            ['footer_copyright', '© 2025 Nguyễn Văn A. Xây dựng với ♥ và nhiều cà phê.', 'footer'],
            ['footer_description', 'Blog chia sẻ về công nghệ, tư duy và cuộc sống. Viết để hiểu — không phải để nổi tiếng.', 'footer'],
            ['footer_show_social', '1', 'footer'],
            // contact
            ['contact_form_enabled', '1', 'contact'],
            ['contact_email_receiver', '', 'contact'],
            ['google_map_embed', '', 'contact'],
            // smtp
            ['smtp_host', 'smtp.gmail.com', 'smtp'],
            ['smtp_port', '587', 'smtp'],
            ['smtp_user', '', 'smtp'],
            ['smtp_password', '', 'smtp'],
            ['smtp_from_name', 'Blog Cá Nhân', 'smtp'],
            ['smtp_from_email', '', 'smtp'],
            // system
            ['maintenance_mode', '0', 'system'],
            ['maintenance_message', 'Website đang bảo trì, vui lòng quay lại sau.', 'system'],
            // newsletter
            ['newsletter_enabled', '1', 'newsletter'],
            ['newsletter_thank_you', 'Cảm ơn bạn đã đăng ký! Mỗi tuần một bài mới nhất sẽ được gửi đến email của bạn.', 'newsletter'],
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
                "INSERT OR IGNORE INTO settings (key, value, \"group\") VALUES (?, ?, ?)",
                [$key, $value, $group]
            );
        }
    }

    private function seedCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM post_categories") > 0) return;
        $cats = [
            ['Công nghệ', 'cong-nghe', 'Bài viết về lập trình, phần mềm, AI và xu hướng công nghệ'],
            ['Tư duy', 'tu-duy', 'Bài viết về tư duy, mental models và cách suy nghĩ hiệu quả'],
            ['Cuộc sống', 'cuoc-song', 'Bài viết về cuộc sống, tối giản, sức khỏe và hạnh phúc'],
            ['Review sách', 'review-sach', 'Tóm tắt và đánh giá các cuốn sách hay đã đọc'],
        ];
        foreach ($cats as $i => [$name, $slug, $desc]) {
            $this->execute(
                "INSERT INTO post_categories (name, slug, description, sort_order) VALUES (?, ?, ?, ?)",
                [$name, $slug, $desc, $i]
            );
        }
    }

    private function seedPosts(): void {
        if ($this->scalar("SELECT COUNT(*) FROM posts") > 0) return;
        $posts = [
            [
                'category_slug' => 'tu-duy',
                'title' => 'Làm thế nào để viết mỗi ngày — và không bao giờ hết ý tưởng',
                'slug' => 'lam-the-nao-de-viet-moi-ngay',
                'excerpt' => 'Viết mỗi ngày không phải là tài năng bẩm sinh. Đó là kỹ năng có thể luyện tập. Bài viết này chia sẻ hệ thống tôi dùng để viết đều đặn mà không bao giờ cạn ý tưởng.',
                'content' => '<p>Nhiều người nghĩ rằng viết mỗi ngày đòi hỏi cảm hứng. Thực tế hoàn toàn ngược lại — bạn viết để tìm cảm hứng, không phải đợi cảm hứng để viết.</p><p>Sau 3 năm viết blog, tôi đã xây dựng được một hệ thống giúp tôi luôn có thứ để viết...</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1400&q=80&auto=format&fit=crop',
                'status' => 'published',
                'featured' => 1,
                'read_time' => 8,
                'views' => 5200,
            ],
            [
                'category_slug' => 'cong-nghe',
                'title' => 'Học lập trình từ đầu — lộ trình thực tế cho người không có background IT',
                'slug' => 'hoc-lap-trinh-tu-dau-lo-trinh-thuc-te',
                'excerpt' => 'Nhiều người nghĩ học code cần giỏi toán, cần học đại học IT. Thực tế không hẳn vậy. Sau 2 năm tự học và làm việc thực tế, tôi tổng hợp lộ trình hiệu quả nhất.',
                'content' => '<p>Tôi bắt đầu học lập trình ở tuổi 25, không có background IT, không học đại học CNTT. 2 năm sau tôi đã làm việc full-time như một developer...</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80&auto=format&fit=crop',
                'status' => 'published',
                'featured' => 0,
                'read_time' => 6,
                'views' => 4200,
            ],
            [
                'category_slug' => 'tu-duy',
                'title' => 'Deep work — cách tôi tập trung làm việc 4 tiếng không xao nhãng',
                'slug' => 'deep-work-tap-trung-lam-viec-4-tieng',
                'excerpt' => 'Chúng ta sống trong thế giới đầy distraction. Điện thoại, notification, mạng xã hội... Đây là hệ thống tôi dùng để bảo vệ sự tập trung.',
                'content' => '<p>Deep work — làm việc tập trung sâu không bị gián đoạn — là kỹ năng hiếm nhất và giá trị nhất trong nền kinh tế tri thức hiện đại...</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80&auto=format&fit=crop',
                'status' => 'published',
                'featured' => 0,
                'read_time' => 5,
                'views' => 3100,
            ],
            [
                'category_slug' => 'cuoc-song',
                'title' => 'Sáng tác khi không có cảm hứng — bí quyết của người viết chuyên nghiệp',
                'slug' => 'sang-tac-khi-khong-co-cam-hung',
                'excerpt' => 'Hầu hết mọi người đợi cảm hứng mới bắt đầu viết. Người viết chuyên nghiệp làm ngược lại — họ viết để tìm cảm hứng.',
                'content' => '<p>Cảm hứng không phải là điều kiện tiên quyết để sáng tác. Nó là sản phẩm phụ của hành động sáng tác. Khi bạn bắt đầu viết, cảm hứng sẽ đến...</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&q=80&auto=format&fit=crop',
                'status' => 'published',
                'featured' => 0,
                'read_time' => 4,
                'views' => 2800,
            ],
            [
                'category_slug' => 'cong-nghe',
                'title' => 'AI và tương lai của công việc sáng tạo — góc nhìn thực tế',
                'slug' => 'ai-va-tuong-lai-cong-viec-sang-tao',
                'excerpt' => 'AI không thay thế bạn. Người dùng AI thành thạo mới thay thế bạn. Đây là những gì tôi học được sau 1 năm dùng AI trong công việc hàng ngày.',
                'content' => '<p>Sau 1 năm dùng các công cụ AI như ChatGPT, Midjourney, GitHub Copilot trong công việc hàng ngày, tôi có một số nhận xét thực tế...</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80&auto=format&fit=crop',
                'status' => 'published',
                'featured' => 0,
                'read_time' => 7,
                'views' => 3800,
            ],
            [
                'category_slug' => 'cuoc-song',
                'title' => 'Review 1 năm sống tối giản — những gì thực sự thay đổi',
                'slug' => 'review-1-nam-song-toi-gian',
                'excerpt' => 'Tôi đã bán, cho đi hoặc vứt đi 60% đồ đạc trong nhà. Không gian trống hơn, đầu óc cũng nhẹ hơn. Đây là điều tôi học được...',
                'content' => '<p>Tôi đã thử sống tối giản trong 1 năm. Đây không phải về việc có ít đồ nhất có thể, mà về việc chỉ giữ lại những thứ thực sự có giá trị với bạn...</p>',
                'thumbnail' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80&auto=format&fit=crop',
                'status' => 'published',
                'featured' => 0,
                'read_time' => 5,
                'views' => 2900,
            ],
        ];
        foreach ($posts as $post) {
            $catId = $this->scalar(
                "SELECT id FROM post_categories WHERE slug = ?",
                [$post['category_slug']]
            );
            $this->execute(
                "INSERT INTO posts (category_id, title, slug, excerpt, content, thumbnail, status, featured, read_time, views, created_by)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)",
                [
                    $catId ?: null,
                    $post['title'], $post['slug'], $post['excerpt'],
                    $post['content'], $post['thumbnail'],
                    $post['status'], $post['featured'],
                    $post['read_time'], $post['views'],
                ]
            );
        }
    }

    private function seedTags(): void {
        if ($this->scalar("SELECT COUNT(*) FROM tags") > 0) return;
        $tags = [
            ['lập trình', 'lap-trinh'],
            ['productivity', 'productivity'],
            ['AI', 'ai'],
            ['tư duy', 'tu-duy'],
            ['review sách', 'review-sach'],
            ['startup', 'startup'],
            ['career', 'career'],
            ['minimalism', 'minimalism'],
            ['writing', 'writing'],
        ];
        foreach ($tags as [$name, $slug]) {
            $this->execute("INSERT INTO tags (name, slug) VALUES (?, ?)", [$name, $slug]);
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

    public function scalar(string $sql, array $params = []): mixed {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $val = $stmt->fetchColumn();
        return $val === false ? null : $val;
    }

    public function execute(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (int)$this->pdo->lastInsertId();
    }

    public function beginTransaction(): void { $this->pdo->beginTransaction(); }
    public function commit(): void { $this->pdo->commit(); }
    public function rollback(): void { $this->pdo->rollBack(); }
}
