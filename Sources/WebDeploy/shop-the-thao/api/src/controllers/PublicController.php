<?php
declare(strict_types=1);

// Public (không cần Auth): settings/hero-slides/sitemap/contact form
class PublicController {
    public function __construct(private Database $db) {}

    public function settings(): void {
        // Lọc bỏ nhóm 'payment' — tránh lộ sepay_webhook_secret qua endpoint public không cần auth.
        $rows = $this->db->query(
            "SELECT key, value FROM settings WHERE grp NOT IN ('smtp','cloudinary','integrations','payment')"
        );
        $result = [];
        foreach ($rows as $r) { $result[$r['key']] = $r['value']; }
        Response::json($result);
    }

    public function heroSlides(): void {
        $rows = $this->db->query(
            "SELECT * FROM hero_slides WHERE status = 'published' ORDER BY sort_order ASC, id ASC"
        );
        Response::json($rows);
    }

    public function sitemap(): void {
        header('Content-Type: application/xml; charset=utf-8');

        $staticRoutes = ['/', '/bo-suu-tap', '/khuyen-mai', '/dich-vu', '/lien-he', '/chinh-sach-bao-mat', '/dieu-khoan'];
        
        $categories = $this->db->query("SELECT slug FROM product_categories ORDER BY name ASC");
        $catSlugs = array_map(fn($c) => "/?category=" . urlencode($c['slug']), $categories);

        $allRoutes = array_merge($staticRoutes, $catSlugs);
        $domain = ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
        echo "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
        foreach ($allRoutes as $route) {
            $loc = htmlspecialchars($domain . $route, ENT_XML1);
            echo "  <url><loc>$loc</loc></url>\n";
        }
        echo "</urlset>";
        exit;
    }

    public function submitContact(): void {
        $data    = bodyJson();
        $name    = trim($data['name'] ?? '');
        $phone   = trim($data['phone'] ?? '');
        $email   = trim($data['email'] ?? '');
        $subject = trim($data['subject'] ?? '');
        $message = trim($data['message'] ?? '');

        if (!$name || !$email || !$message) {
            Response::error('Vui lòng điền đầy đủ họ tên, email và nội dung tin nhắn', 422);
            return;
        }
        if (mb_strlen($name) > 120 || mb_strlen($email) > 200 || mb_strlen($subject) > 150 || mb_strlen($message) > 2000) {
            Response::error('Nội dung vượt quá độ dài cho phép', 422);
            return;
        }

        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
            [$name, $email, $phone, $subject, $message]
        );
        Response::json(['message' => 'Đã gửi tin nhắn thành công'], 201);
    }
}
