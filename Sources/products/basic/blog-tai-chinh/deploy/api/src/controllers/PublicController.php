<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        // Lọc bỏ nhóm nhạy cảm khỏi endpoint public không cần auth.
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
            "SELECT c.*, (SELECT COUNT(*) FROM posts WHERE category_id = c.id AND status='published') AS post_count
             FROM post_categories c ORDER BY c.sort_order, c.id"
        );
        Response::json($items);
    }

    public function posts(array $p): void {
        $rows = $this->db->query(
            "SELECT p.id, p.title, p.slug, p.excerpt, p.thumbnail, p.author_name, p.author_avatar,
                    p.read_time, p.home_section, p.home_order, p.trending_order, p.published_at,
                    c.name AS category_name, c.slug AS category_slug
             FROM posts p LEFT JOIN post_categories c ON c.id = p.category_id
             WHERE p.status = 'published'
             ORDER BY p.published_at DESC, p.id DESC"
        );
        Response::json($rows);
    }

    public function postBySlug(array $p): void {
        $post = $this->db->queryOne(
            "SELECT p.*, c.name AS category_name, c.slug AS category_slug
             FROM posts p LEFT JOIN post_categories c ON c.id = p.category_id
             WHERE p.slug = ? AND p.status = 'published'",
            [$p['slug']]
        );
        if (!$post) { Response::error('Không tìm thấy bài viết.', 404); return; }

        $related = [];
        if (!empty($post['category_id'])) {
            $related = $this->db->query(
                "SELECT id, title, slug, thumbnail, read_time, published_at
                 FROM posts WHERE category_id = ? AND status = 'published' AND id != ?
                 ORDER BY RANDOM() LIMIT 3",
                [$post['category_id'], $post['id']]
            );
        }
        $post['related'] = $related;
        Response::json($post);
    }

    public function testimonials(array $p): void {
        $items = $this->db->query("SELECT * FROM testimonials WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function faqs(array $p): void {
        $items = $this->db->query("SELECT * FROM faqs WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function timelineItems(array $p): void {
        $items = $this->db->query("SELECT * FROM timeline_items WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        $name    = trim($b['name'] ?? '');
        $email   = trim($b['email'] ?? '');
        $message = trim($b['message'] ?? '');
        if (!$name || !$email || !$message) { Response::error('Họ tên, email và nội dung không được để trống.'); return; }

        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, 'new')",
            [$name, $email, trim($b['phone'] ?? ''), trim($b['subject'] ?? 'Câu hỏi chung'), $message]
        );
        Response::json(['ok' => true, 'message' => 'Cảm ơn bạn đã gửi lời nhắn! Chúng tôi sẽ phản hồi trong 1-2 ngày làm việc.'], 201);
    }

    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $base   = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        $staticRoutes = ['/', '/chuyen-muc', '/cong-cu-tinh-toan', '/ve-toi', '/lien-he', '/chinh-sach-bao-mat', '/dieu-khoan'];
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
