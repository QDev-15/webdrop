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

    public function postCategories(array $p): void {
        $items = $this->db->query(
            "SELECT c.*, (SELECT COUNT(*) FROM posts WHERE category_id = c.id AND status='published') AS post_count
             FROM post_categories c ORDER BY c.sort_order, c.id"
        );
        Response::json($items);
    }

    public function posts(array $p): void {
        $category = trim($_GET['category'] ?? '');
        $limit    = max(1, min(50, (int)($_GET['limit'] ?? 100)));
        $where  = "WHERE p.status='published'";
        $params = [];
        if ($category !== '') {
            $where .= " AND c.slug = ?";
            $params[] = $category;
        }
        $items = $this->db->query(
            "SELECT p.id, p.title, p.slug, p.thumbnail, p.excerpt, p.tags, p.read_time, p.published_date, p.updated_date,
                    p.featured, c.name AS category_name, c.slug AS category_slug, c.tag_class
             FROM posts p LEFT JOIN post_categories c ON c.id = p.category_id
             $where ORDER BY p.published_date DESC, p.id DESC LIMIT $limit",
            $params
        );
        Response::json($items);
    }

    public function postBySlug(array $p): void {
        $item = $this->db->queryOne(
            "SELECT p.*, c.name AS category_name, c.slug AS category_slug, c.tag_class
             FROM posts p LEFT JOIN post_categories c ON c.id = p.category_id
             WHERE p.slug = ? AND p.status='published'",
            [$p['slug']]
        );
        if (!$item) { Response::error('Không tìm thấy bài viết.', 404); return; }
        Response::json($item);
    }

    public function relatedPosts(array $p): void {
        // 3 bài khác ngẫu nhiên (ưu tiên khác chuyên mục để đa dạng nội dung gợi ý)
        $current = $this->db->queryOne("SELECT category_id FROM posts WHERE slug=?", [$p['slug']]);
        $items = $this->db->query(
            "SELECT p.id, p.title, p.slug, p.thumbnail, p.read_time, c.name AS category_name, c.tag_class
             FROM posts p LEFT JOIN post_categories c ON c.id = p.category_id
             WHERE p.status='published' AND p.slug != ?
             ORDER BY RANDOM() LIMIT 3",
            [$p['slug']]
        );
        Response::json($items);
    }

    public function destinations(array $p): void {
        $items = $this->db->query("SELECT * FROM destinations WHERE status='published' ORDER BY sort_order, id LIMIT 5");
        Response::json($items);
    }

    public function faqs(array $p): void {
        $items = $this->db->query("SELECT * FROM faqs WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        $name    = trim($b['name'] ?? '');
        $email   = trim($b['email'] ?? '');
        $message = trim($b['message'] ?? '');
        if (!$name || !$message) { Response::error('Họ tên và nội dung không được để trống.'); return; }

        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, 'new')",
            [$name, $email, trim($b['phone'] ?? ''), trim($b['subject'] ?? 'Câu hỏi chung'), $message]
        );
        Response::json(['ok' => true, 'message' => 'Cảm ơn bạn đã gửi tin nhắn! Tôi sẽ phản hồi sớm nhất có thể.'], 201);
    }

    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $base   = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        $staticRoutes = ['/', '/chuyen-muc', '/cam-nang-du-lich', '/ve-toi', '/lien-he', '/chinh-sach-bao-mat', '/dieu-khoan'];
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
