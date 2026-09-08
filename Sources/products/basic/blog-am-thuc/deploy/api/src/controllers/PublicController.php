<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        // Lọc bỏ nhóm nhạy cảm — KHÔNG được lộ smtp/cloudinary/integrations qua endpoint public không cần auth
        $rows = $this->db->query("SELECT key, value FROM settings WHERE grp NOT IN ('smtp','cloudinary','integrations')");
        $result = [];
        foreach ($rows as $r) { $result[$r['key']] = $r['value']; }
        Response::json($result);
    }

    public function heroSlides(array $p): void {
        $slides = $this->db->query(
            "SELECT id, title, subtitle, image, button_text, button_link, sort_order
             FROM hero_slides WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($slides);
    }

    public function categories(array $p): void {
        $cats = $this->db->query(
            "SELECT c.id, c.name, c.slug, c.sort_order, COUNT(po.id) as post_count
             FROM post_categories c
             LEFT JOIN posts po ON po.category_id = c.id AND po.status = 'published'
             GROUP BY c.id
             ORDER BY c.sort_order, c.name"
        );
        Response::json($cats);
    }

    public function posts(array $p): void {
        $type     = $_GET['type'] ?? '';
        $category = trim((string)($_GET['category'] ?? ''));
        $featured = $_GET['featured'] ?? '';
        $exclude  = trim((string)($_GET['exclude'] ?? ''));
        $sort     = $_GET['sort'] ?? 'latest';
        $limit    = max(1, min((int)($_GET['limit'] ?? 100), 200));

        $where  = ["po.status = 'published'"];
        $params = [];
        if ($type === 'article' || $type === 'recipe') { $where[] = "po.type = ?"; $params[] = $type; }
        if ($category !== '') { $where[] = "c.slug = ?"; $params[] = $category; }
        if ($featured === '1') { $where[] = "po.featured = 1"; }
        if ($exclude !== '') { $where[] = "po.slug != ?"; $params[] = $exclude; }

        $orderBy = $sort === 'saved' ? 'po.saved_count DESC' : 'po.published_at DESC';

        $posts = $this->db->query(
            "SELECT po.id, po.title, po.slug, po.type, po.excerpt, po.image, po.author_name, po.author_avatar,
                    po.read_minutes, po.tags, po.featured, po.difficulty, po.prep_time, po.cook_time,
                    po.servings, po.saved_count, po.published_at,
                    c.name as category_name, c.slug as category_slug
             FROM posts po
             LEFT JOIN post_categories c ON c.id = po.category_id
             WHERE " . implode(' AND ', $where) . "
             ORDER BY $orderBy
             LIMIT ?",
            array_merge($params, [$limit])
        );
        Response::json($posts);
    }

    public function postBySlug(array $p): void {
        $post = $this->db->queryOne(
            "SELECT po.*, c.name as category_name, c.slug as category_slug
             FROM posts po
             LEFT JOIN post_categories c ON c.id = po.category_id
             WHERE po.slug = ? AND po.status = 'published'",
            [$p['slug']]
        );
        if (!$post) { Response::error('Không tìm thấy bài viết.', 404); return; }
        // Tăng lượt xem — best effort, không chặn response nếu lỗi
        try { $this->db->execute("UPDATE posts SET views = views + 1 WHERE id = ?", [$post['id']]); } catch (\Throwable $e) {}
        Response::json($post);
    }

    public function latestRecipe(array $p): void {
        $post = $this->db->queryOne(
            "SELECT po.*, c.name as category_name, c.slug as category_slug
             FROM posts po
             LEFT JOIN post_categories c ON c.id = po.category_id
             WHERE po.type = 'recipe' AND po.status = 'published'
             ORDER BY po.published_at DESC LIMIT 1"
        );
        if (!$post) { Response::error('Chưa có công thức nào.', 404); return; }
        try { $this->db->execute("UPDATE posts SET views = views + 1 WHERE id = ?", [$post['id']]); } catch (\Throwable $e) {}
        Response::json($post);
    }

    public function popularPosts(array $p): void {
        $limit = max(1, min((int)($_GET['limit'] ?? 4), 20));
        Response::json($this->db->query(
            "SELECT id, title, slug, type, image, published_at, read_minutes
             FROM posts WHERE status = 'published' ORDER BY views DESC, published_at DESC LIMIT ?",
            [$limit]
        ));
    }

    public function testimonials(array $p): void {
        Response::json($this->db->query(
            "SELECT * FROM testimonials WHERE status = 'published' ORDER BY sort_order, id"
        ));
    }

    public function faqs(array $p): void {
        Response::json($this->db->query(
            "SELECT id, question, answer FROM faqs WHERE status = 'published' ORDER BY sort_order, id"
        ));
    }

    public function timeline(array $p): void {
        Response::json($this->db->query(
            "SELECT * FROM timeline_items ORDER BY sort_order, id"
        ));
    }

    public function submitContact(array $p): void {
        $b       = bodyJson();
        $name    = trim($b['name'] ?? '');
        $message = trim($b['message'] ?? '');
        if (!$name || !$message) { Response::error('Họ tên và nội dung không được để trống.'); return; }
        $id = $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, 'new')",
            [$name, trim($b['email'] ?? ''), trim($b['phone'] ?? ''), trim($b['subject'] ?? ''), $message]
        );
        Response::json(['ok' => true, 'id' => $id], 201);
    }

    public function sitemap(array $p): void {
        $base = rtrim(APP_URL, '/');
        $staticRoutes = ['/', '/chuyen-muc', '/cong-thuc-nau-an', '/ve-toi', '/lien-he', '/chinh-sach-bao-mat', '/dieu-khoan'];

        $urls = [];
        foreach ($staticRoutes as $route) { $urls[] = $base . $route; }

        $posts = $this->db->query("SELECT slug, type FROM posts WHERE status = 'published'");
        foreach ($posts as $post) {
            $prefix = $post['type'] === 'recipe' ? '/cong-thuc-nau-an' : '/bai-viet';
            $urls[] = $base . $prefix . '/' . $post['slug'];
        }

        header('Content-Type: application/xml; charset=utf-8');
        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($urls as $url) {
            echo '  <url><loc>' . htmlspecialchars($url, ENT_XML1) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
