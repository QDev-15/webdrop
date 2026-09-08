<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        // Lọc bỏ nhóm nhạy cảm (smtp_pass, cloudinary_api_secret, unsplash_access_key...)
        // khỏi endpoint public không cần auth — chỉ trả các nhóm an toàn để hiển thị website.
        $rows = $this->db->query("SELECT key, value FROM settings WHERE grp NOT IN ('smtp','cloudinary','integrations','system')");
        $out = [];
        foreach ($rows as $r) { $out[$r['key']] = $r['value']; }
        Response::json($out);
    }

    public function heroSlides(array $p): void {
        $slides = $this->db->query("SELECT * FROM hero_slides WHERE status='published' ORDER BY sort_order, id");
        Response::json($slides);
    }

    public function categories(array $p): void {
        $items = $this->db->query(
            "SELECT c.*, (SELECT COUNT(*) FROM posts WHERE category_slug = c.slug AND status='published') AS post_count
             FROM categories c ORDER BY c.sort_order, c.id"
        );
        Response::json($items);
    }

    // GET /public/posts?category=&featured=1&popular=1&saved=1&exclude_featured=1&exclude=&limit=
    public function posts(array $p): void {
        $where  = ["status = 'published'"];
        $params = [];

        if (!empty($_GET['category'])) { $where[] = 'category_slug = ?'; $params[] = trim($_GET['category']); }
        if (!empty($_GET['featured'])) { $where[] = 'featured = 1'; }
        if (!empty($_GET['popular']))  { $where[] = 'popular = 1'; }
        if (!empty($_GET['saved']))    { $where[] = 'saved = 1'; }
        if (!empty($_GET['exclude_featured'])) { $where[] = 'featured = 0'; }
        if (!empty($_GET['exclude']))  { $where[] = 'slug != ?'; $params[] = trim($_GET['exclude']); }

        $sql = "SELECT p.*, c.name AS category_name FROM posts p
                LEFT JOIN categories c ON c.slug = p.category_slug
                WHERE " . implode(' AND ', $where) . "
                ORDER BY p.published_at DESC, p.id DESC";

        if (!empty($_GET['limit'])) {
            $sql .= ' LIMIT ?';
            $params[] = (int)$_GET['limit'];
        }

        Response::json($this->db->query($sql, $params));
    }

    public function postBySlug(array $p): void {
        $item = $this->db->queryOne(
            "SELECT po.*, c.name AS category_name FROM posts po
             LEFT JOIN categories c ON c.slug = po.category_slug
             WHERE po.slug = ? AND po.status = 'published'",
            [$p['slug']]
        );
        if (!$item) { Response::error('Không tìm thấy bài viết.', 404); return; }
        Response::json($item);
    }

    public function relatedPosts(array $p): void {
        $current = $this->db->queryOne("SELECT category_slug FROM posts WHERE slug = ?", [$p['slug']]);
        $catSlug = $current['category_slug'] ?? '';
        $items = $this->db->query(
            "SELECT * FROM posts WHERE status='published' AND slug != ? AND category_slug = ?
             ORDER BY published_at DESC LIMIT 3",
            [$p['slug'], $catSlug]
        );
        if (count($items) < 3) {
            // Chưa đủ 3 bài cùng chuyên mục — bổ sung bài mới nhất khác bất kỳ
            $existingSlugs = array_merge([$p['slug']], array_column($items, 'slug'));
            $placeholders = implode(',', array_fill(0, count($existingSlugs), '?'));
            $more = $this->db->query(
                "SELECT * FROM posts WHERE status='published' AND slug NOT IN ($placeholders)
                 ORDER BY published_at DESC LIMIT " . (3 - count($items)),
                $existingSlugs
            );
            $items = array_merge($items, $more);
        }
        Response::json($items);
    }

    public function testimonials(array $p): void {
        Response::json($this->db->query("SELECT * FROM testimonials WHERE status='published' ORDER BY sort_order, id"));
    }

    public function faqs(array $p): void {
        Response::json($this->db->query("SELECT * FROM faqs WHERE status='published' ORDER BY sort_order, id"));
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        $name    = trim($b['name'] ?? '');
        $email   = trim($b['email'] ?? '');
        $message = trim($b['message'] ?? '');
        if (!$name || !$message) { Response::error('Họ tên và nội dung không được để trống.'); return; }

        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, 'new')",
            [$name, $email, trim($b['phone'] ?? ''), trim($b['subject'] ?? 'Liên hệ từ website'), $message]
        );
        Response::json(['ok' => true, 'message' => 'Cảm ơn bạn đã gửi tin nhắn! Hạ Vy sẽ phản hồi trong 3-5 ngày làm việc.'], 201);
    }

    public function subscribeNewsletter(array $p): void {
        $b = bodyJson();
        $email = trim($b['email'] ?? '');
        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Vui lòng nhập email hợp lệ.'); return;
        }
        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message, status) VALUES (?, ?, '', 'Đăng ký nhận bản tin', ?, 'new')",
            ['(Đăng ký bản tin)', $email, 'Đăng ký nhận bản tin hằng tuần qua email: ' . $email]
        );
        Response::json(['ok' => true, 'message' => 'Đăng ký thành công! Cảm ơn bạn đã theo dõi Cỏ Non.'], 201);
    }

    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $base   = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        $staticRoutes = ['/', '/chuyen-muc', '/cam-nang', '/ve-toi', '/lien-he', '/chinh-sach-bao-mat', '/dieu-khoan'];
        $postSlugs = $this->db->query("SELECT slug FROM posts WHERE status='published' AND slug IS NOT NULL AND slug != ''");

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($base . $route, ENT_XML1) . '</loc></url>' . "\n";
        }
        foreach ($postSlugs as $row) {
            echo '  <url><loc>' . htmlspecialchars($base . '/bai-viet/' . $row['slug'], ENT_XML1) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
