<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        // Lọc bỏ nhóm nhạy cảm (smtp, cloudinary, integrations, system) khỏi endpoint
        // public không cần auth — chỉ trả các nhóm an toàn để hiển thị website.
        $rows = $this->db->query(
            "SELECT key, value FROM settings WHERE grp NOT IN ('smtp','cloudinary','integrations','system')"
        );
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
            "SELECT c.*, (SELECT COUNT(*) FROM posts po WHERE po.category_id = c.id AND po.status='published' AND po.review_score IS NULL) AS post_count
             FROM post_categories c ORDER BY c.sort_order, c.id"
        );
        Response::json($items);
    }

    // GET /public/posts?type=post|review&category=slug&featured=1&order_by=created_at|views&limit=N
    public function posts(array $p): void {
        $type     = ($_GET['type'] ?? 'post') === 'review' ? 'review' : 'post';
        $category = trim((string)($_GET['category'] ?? ''));
        $featured = ($_GET['featured'] ?? '') === '1';
        $orderBy  = ($_GET['order_by'] ?? '') === 'views' ? 'po.views DESC' : 'po.created_at DESC';
        $limit    = min(100, max(1, (int)($_GET['limit'] ?? 100)));

        $where  = ["po.status = 'published'"];
        $params = [];
        $where[] = $type === 'review' ? 'po.review_score IS NOT NULL' : 'po.review_score IS NULL';

        if ($category !== '') {
            $where[] = 'c.slug = ?';
            $params[] = $category;
        }
        if ($featured) {
            $where[] = 'po.featured = 1';
        }
        $whereSql = implode(' AND ', $where);

        // X-Total-Count: tổng số bản ghi khớp điều kiện (không tính LIMIT) — dùng cho
        // thanh số liệu trang chủ (đếm tổng bài viết/đánh giá thực tế), vẫn giữ nguyên
        // response body là array thuần theo đúng rule PublicController.
        $total = (int)$this->db->scalar(
            "SELECT COUNT(*) FROM posts po LEFT JOIN post_categories c ON c.id = po.category_id WHERE $whereSql",
            $params
        );
        header('X-Total-Count: ' . $total);

        $rows = $this->db->query(
            "SELECT po.id, po.title, po.slug, po.excerpt, po.thumbnail, po.author_name, po.author_avatar,
                    po.featured, po.read_time, po.views, po.review_score, po.review_score_label, po.review_category,
                    po.created_at, c.name AS category_name, c.slug AS category_slug
             FROM posts po LEFT JOIN post_categories c ON c.id = po.category_id
             WHERE $whereSql
             ORDER BY $orderBy
             LIMIT ?",
            [...$params, $limit]
        );
        Response::json($rows);
    }

    public function postBySlug(array $p): void {
        $item = $this->db->queryOne(
            "SELECT po.*, c.name AS category_name, c.slug AS category_slug
             FROM posts po LEFT JOIN post_categories c ON c.id = po.category_id
             WHERE po.slug = ? AND po.status = 'published'",
            [$p['slug']]
        );
        if (!$item) { Response::error('Không tìm thấy bài viết.', 404); return; }
        $this->db->execute("UPDATE posts SET views = views + 1 WHERE id = ?", [$item['id']]);
        $item['views'] = (int)$item['views'] + 1;
        Response::json($item);
    }

    public function relatedPosts(array $p): void {
        $current = $this->db->queryOne("SELECT id, category_id, review_score FROM posts WHERE slug = ?", [$p['slug']]);
        if (!$current) { Response::json([]); return; }
        $type = $current['review_score'] !== null ? 'IS NOT NULL' : 'IS NULL';
        $items = $this->db->query(
            "SELECT id, title, slug, thumbnail, author_name, author_avatar, created_at
             FROM posts
             WHERE status='published' AND slug != ? AND category_id = ? AND review_score $type
             ORDER BY created_at DESC LIMIT 3",
            [$p['slug'], $current['category_id']]
        );
        if (count($items) < 3) {
            // Bù thêm bài viết khác (ngẫu nhiên) nếu chuyên mục không đủ 3 bài liên quan
            $existingIds = array_column($items, 'id');
            $existingIds[] = $current['id'];
            $placeholders = implode(',', array_fill(0, count($existingIds), '?'));
            $more = $this->db->query(
                "SELECT id, title, slug, thumbnail, author_name, author_avatar, created_at
                 FROM posts WHERE status='published' AND id NOT IN ($placeholders)
                 ORDER BY RANDOM() LIMIT ?",
                [...$existingIds, 3 - count($items)]
            );
            $items = [...$items, ...$more];
        }
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
            [$name, $email, trim($b['phone'] ?? ''), trim($b['subject'] ?? ''), $message]
        );
        Response::json(['ok' => true, 'message' => 'Cảm ơn bạn đã liên hệ, PIXEL. sẽ phản hồi sớm nhất!'], 201);
    }

    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $base   = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        $staticRoutes = ['/', '/chuyen-muc', '/danh-gia-san-pham', '/ve-toi', '/lien-he', '/chinh-sach-bao-mat', '/dieu-khoan'];
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
