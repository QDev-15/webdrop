<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        $rows = $this->db->query("SELECT key, value FROM settings");
        $out = [];
        foreach ($rows as $r) {
            $out[$r['key']] = $r['value'];
        }
        Response::json($out);
    }

    public function categories(array $p): void {
        $cats = $this->db->query(
            "SELECT c.*, COUNT(po.id) as post_count
             FROM post_categories c
             LEFT JOIN posts po ON po.category_id = c.id AND po.status = 'published'
             GROUP BY c.id
             ORDER BY c.sort_order, c.id"
        );
        Response::json($cats);
    }

    public function tags(array $p): void {
        $tags = $this->db->query(
            "SELECT t.*, COUNT(pt.post_id) as post_count
             FROM tags t
             LEFT JOIN post_tags pt ON pt.tag_id = t.id
             GROUP BY t.id
             ORDER BY post_count DESC"
        );
        Response::json($tags);
    }

    public function featuredPost(array $p): void {
        $post = $this->db->queryOne(
            "SELECT po.*, c.name as category_name, c.slug as category_slug
             FROM posts po
             LEFT JOIN post_categories c ON c.id = po.category_id
             WHERE po.status = 'published' AND po.featured = 1
             ORDER BY po.created_at DESC
             LIMIT 1"
        );
        Response::json($post);
    }

    public function popularPosts(array $p): void {
        $limit = min((int)($_GET['limit'] ?? 5), 20);
        $posts = $this->db->query(
            "SELECT po.id, po.title, po.slug, po.thumbnail, po.views, po.read_time,
                    c.name as category_name
             FROM posts po
             LEFT JOIN post_categories c ON c.id = po.category_id
             WHERE po.status = 'published'
             ORDER BY po.views DESC
             LIMIT ?",
            [$limit]
        );
        Response::json($posts);
    }

    public function posts(array $p): void {
        $page     = max(1, (int)($_GET['page'] ?? 1));
        $limit    = min((int)($_GET['limit'] ?? 10), 50);
        $offset   = ($page - 1) * $limit;
        $category = $_GET['category'] ?? '';
        $tag      = $_GET['tag'] ?? '';
        $search   = $_GET['search'] ?? '';

        $where  = ["po.status = 'published'"];
        $params = [];

        if ($category) {
            $where[] = "c.slug = ?";
            $params[] = $category;
        }
        if ($tag) {
            $where[] = "EXISTS (SELECT 1 FROM post_tags pt JOIN tags t ON t.id = pt.tag_id WHERE pt.post_id = po.id AND t.slug = ?)";
            $params[] = $tag;
        }
        if ($search) {
            $where[] = "(po.title LIKE ? OR po.excerpt LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        $whereStr = implode(' AND ', $where);
        $total = $this->db->scalar(
            "SELECT COUNT(*) FROM posts po LEFT JOIN post_categories c ON c.id = po.category_id WHERE $whereStr",
            $params
        );

        $params2 = array_merge($params, [$limit, $offset]);
        $posts = $this->db->query(
            "SELECT po.id, po.title, po.slug, po.excerpt, po.thumbnail,
                    po.read_time, po.views, po.created_at,
                    c.name as category_name, c.slug as category_slug,
                    u.name as author_name, u.email as author_email
             FROM posts po
             LEFT JOIN post_categories c ON c.id = po.category_id
             LEFT JOIN users u ON u.id = po.created_by
             WHERE $whereStr
             ORDER BY po.created_at DESC
             LIMIT ? OFFSET ?",
            $params2
        );

        Response::json([
            'data'       => $posts,
            'total'      => (int)$total,
            'page'       => $page,
            'limit'      => $limit,
            'totalPages' => (int)ceil($total / $limit),
        ]);
    }

    public function postBySlug(array $p): void {
        $post = $this->db->queryOne(
            "SELECT po.*, c.name as category_name, c.slug as category_slug,
                    u.name as author_name
             FROM posts po
             LEFT JOIN post_categories c ON c.id = po.category_id
             LEFT JOIN users u ON u.id = po.created_by
             WHERE po.slug = ? AND po.status = 'published'",
            [$p['slug']]
        );
        if (!$post) {
            Response::error('Bài viết không tồn tại.', 404);
            return;
        }
        // Increment views
        $this->db->execute("UPDATE posts SET views = views + 1 WHERE id = ?", [$post['id']]);
        $post['views'] = (int)$post['views'] + 1;

        // Fetch tags
        $tags = $this->db->query(
            "SELECT t.name, t.slug FROM tags t
             JOIN post_tags pt ON pt.tag_id = t.id
             WHERE pt.post_id = ?",
            [$post['id']]
        );
        $post['tags'] = $tags;

        // Related posts
        $related = $this->db->query(
            "SELECT po.id, po.title, po.slug, po.thumbnail, po.read_time, po.created_at,
                    c.name as category_name
             FROM posts po
             LEFT JOIN post_categories c ON c.id = po.category_id
             WHERE po.status = 'published' AND po.id != ? AND po.category_id = ?
             ORDER BY po.created_at DESC LIMIT 3",
            [$post['id'], $post['category_id']]
        );
        $post['related'] = $related;

        Response::json($post);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        $name    = trim($b['name'] ?? '');
        $email   = trim($b['email'] ?? '');
        $message = trim($b['message'] ?? '');
        if (!$name || !$message) {
            Response::error('Vui lòng nhập họ tên và nội dung.');
            return;
        }
        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
            [$name, $email, $b['phone'] ?? '', $b['subject'] ?? '', $message]
        );
        Response::json(['ok' => true, 'message' => 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.']);
    }

    public function newsletter(array $p): void {
        $b = bodyJson();
        $email = trim($b['email'] ?? '');
        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Email không hợp lệ.');
            return;
        }
        // Store as contact with subject "newsletter"
        $exists = $this->db->scalar(
            "SELECT COUNT(*) FROM contacts WHERE email = ? AND subject = 'newsletter'",
            [$email]
        );
        if ($exists > 0) {
            Response::json(['ok' => true, 'message' => 'Email đã được đăng ký trước đó.']);
            return;
        }
        $this->db->execute(
            "INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, 'newsletter', 'Đăng ký nhận bài mới')",
            ['Subscriber', $email]
        );
        $thankYou = $this->db->scalar("SELECT value FROM settings WHERE key = 'newsletter_thank_you'") ?? 'Đăng ký thành công!';
        Response::json(['ok' => true, 'message' => $thankYou]);
    }

    // Sitemap XML động — route GET /sitemap.xml. Ghi đè Content-Type JSON mặc định của Router.
    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $base   = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        $staticRoutes = ['/', '/lien-he', '/ve-toi', '/tat-ca-bai-viet'];

        $urls = [];
        foreach ($staticRoutes as $route) {
            $urls[] = ['loc' => $base . $route, 'lastmod' => null];
        }

        $posts = $this->db->query("SELECT slug, updated_at FROM posts WHERE status = 'published'");
        foreach ($posts as $post) {
            $urls[] = ['loc' => $base . '/bai-viet/' . $post['slug'], 'lastmod' => substr($post['updated_at'], 0, 10)];
        }

        $cats = $this->db->query("SELECT slug FROM post_categories WHERE slug IS NOT NULL");
        foreach ($cats as $cat) {
            $urls[] = ['loc' => $base . '/danh-muc/' . $cat['slug'], 'lastmod' => null];
        }

        $tags = $this->db->query("SELECT slug FROM tags WHERE slug IS NOT NULL");
        foreach ($tags as $tag) {
            $urls[] = ['loc' => $base . '/tag/' . $tag['slug'], 'lastmod' => null];
        }

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($urls as $u) {
            echo '  <url><loc>' . htmlspecialchars($u['loc'], ENT_XML1) . '</loc>';
            if ($u['lastmod']) echo '<lastmod>' . $u['lastmod'] . '</lastmod>';
            echo '</url>' . "\n";
        }
        echo '</urlset>';
    }
}
