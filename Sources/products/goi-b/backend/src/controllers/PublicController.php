<?php
/**
 * PublicController — read-only endpoints cho website public (không cần auth)
 * Rate limiting cơ bản cho contact form dùng session để tránh spam
 */
class PublicController {
    public function __construct(private Database $db) {}

    // Keys được phép trả về cho public — không expose SMTP, API keys, custom scripts
    private const PUBLIC_KEYS = [
        'site_name', 'site_description', 'site_logo', 'site_favicon',
        'site_email', 'site_phone', 'site_phone_2', 'site_address',
        'social_facebook', 'social_youtube', 'social_instagram',
        'social_tiktok', 'social_zalo', 'social_linkedin', 'social_twitter',
        'footer_copyright', 'footer_description', 'footer_show_social',
        'google_analytics_id',
    ];

    // GET /public/settings — trả về settings đã whitelist (không lộ SMTP, keys nhạy cảm)
    public function settings(array $params): void {
        $rows = $this->db->query('SELECT key, value FROM settings');
        $flat = [];
        foreach ($rows as $r) {
            if (in_array($r['key'], self::PUBLIC_KEYS, true)) {
                $flat[$r['key']] = $r['value'];
            }
        }
        Response::ok($flat);
    }

    // GET /public/pages — danh sách trang published (dùng cho nav)
    public function pages(array $params): void {
        $pages = $this->db->query(
            "SELECT id, title, slug FROM pages WHERE status = 'published' ORDER BY title"
        );
        Response::ok($pages);
    }

    // GET /public/pages/:slug — nội dung một trang
    public function pageBySlug(array $params): void {
        $page = $this->db->queryOne(
            "SELECT * FROM pages WHERE slug = ? AND status = 'published'",
            [$params['slug']]
        );
        if (!$page) Response::notFound('Trang không tồn tại');
        Response::ok($page);
    }

    // GET /public/posts — danh sách bài viết published (hỗ trợ limit, offset, category)
    public function posts(array $params): void {
        $limit    = min((int) ($_GET['limit'] ?? 12), 50);
        $offset   = max((int) ($_GET['offset'] ?? 0), 0);
        $catSlug  = $_GET['category'] ?? '';

        if ($catSlug) {
            $posts = $this->db->query(
                "SELECT p.id, p.title, p.slug, p.excerpt, p.thumbnail, p.featured, p.created_at,
                        c.name AS category_name, c.slug AS category_slug
                 FROM posts p
                 LEFT JOIN categories c ON p.category_id = c.id
                 WHERE p.status = 'published' AND c.slug = ?
                 ORDER BY p.created_at DESC LIMIT ? OFFSET ?",
                [$catSlug, $limit, $offset]
            );
            $total = $this->db->scalar(
                "SELECT COUNT(*) FROM posts p LEFT JOIN categories c ON p.category_id = c.id
                 WHERE p.status = 'published' AND c.slug = ?",
                [$catSlug]
            );
        } else {
            $posts = $this->db->query(
                "SELECT p.id, p.title, p.slug, p.excerpt, p.thumbnail, p.featured, p.created_at,
                        c.name AS category_name, c.slug AS category_slug
                 FROM posts p
                 LEFT JOIN categories c ON p.category_id = c.id
                 WHERE p.status = 'published'
                 ORDER BY p.created_at DESC LIMIT ? OFFSET ?",
                [$limit, $offset]
            );
            $total = $this->db->scalar(
                "SELECT COUNT(*) FROM posts WHERE status = 'published'"
            );
        }
        Response::ok(['posts' => $posts, 'total' => $total, 'limit' => $limit, 'offset' => $offset]);
    }

    // GET /public/posts/:slug — chi tiết một bài viết
    public function postBySlug(array $params): void {
        $post = $this->db->queryOne(
            "SELECT p.*, c.name AS category_name, c.slug AS category_slug
             FROM posts p
             LEFT JOIN categories c ON p.category_id = c.id
             WHERE p.slug = ? AND p.status = 'published'",
            [$params['slug']]
        );
        if (!$post) Response::notFound('Bài viết không tồn tại');

        // Bài viết liên quan (cùng danh mục) — chỉ fetch nếu có danh mục
        $post['related'] = $post['category_id']
            ? $this->db->query(
                "SELECT id, title, slug, thumbnail, created_at FROM posts
                 WHERE status = 'published' AND id != ? AND category_id = ?
                 ORDER BY created_at DESC LIMIT 3",
                [$post['id'], $post['category_id']]
              )
            : [];
        Response::ok($post);
    }

    // GET /public/categories — danh mục có bài viết
    public function categories(array $params): void {
        $cats = $this->db->query(
            "SELECT c.id, c.name, c.slug, COUNT(p.id) AS post_count
             FROM categories c
             INNER JOIN posts p ON p.category_id = c.id AND p.status = 'published'
             GROUP BY c.id ORDER BY c.name"
        );
        Response::ok($cats);
    }

    // GET /public/banners — banner theo position
    public function banners(array $params): void {
        $position = $_GET['position'] ?? '';
        if ($position) {
            $rows = $this->db->query(
                "SELECT * FROM banners WHERE status = 'published' AND position = ?
                 ORDER BY sort_order ASC",
                [$position]
            );
        } else {
            $rows = $this->db->query(
                "SELECT * FROM banners WHERE status = 'published' ORDER BY position, sort_order"
            );
        }
        Response::ok($rows);
    }

    // POST /public/contact — gửi form liên hệ
    public function contact(array $params): void {
        // Rate limit đơn giản: max 3 lần / session
        $count = (int) ($_SESSION['contact_count'] ?? 0);
        if ($count >= 3) {
            Response::error('Bạn đã gửi quá nhiều lần. Vui lòng thử lại sau.', 429);
        }

        $body    = bodyJson();
        $name    = trim($body['name'] ?? '');
        $message = trim($body['message'] ?? '');

        if (!$name)    Response::error('Vui lòng nhập họ tên');
        if (!$message) Response::error('Vui lòng nhập nội dung');

        // Validate email nếu có
        $email = trim($body['email'] ?? '');
        if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Email không hợp lệ');
        }

        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
            [
                htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
                htmlspecialchars($email, ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($body['phone'] ?? ''), ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($body['subject'] ?? ''), ENT_QUOTES, 'UTF-8'),
                htmlspecialchars($message, ENT_QUOTES, 'UTF-8'),
            ]
        );

        $_SESSION['contact_count'] = $count + 1;
        Response::ok(['message' => 'Cảm ơn! Chúng tôi sẽ liên hệ với bạn sớm nhất.']);
    }
}
