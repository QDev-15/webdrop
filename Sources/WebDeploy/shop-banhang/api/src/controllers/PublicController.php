<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    // GET /public/settings — flat {key: value}, loại trừ nhóm nhạy cảm
    public function settings(array $p): void {
        $rows = $this->db->query(
            "SELECT key, value FROM settings WHERE grp NOT IN ('smtp', 'cloudinary', 'integrations')"
        );
        $result = [];
        foreach ($rows as $r) { $result[$r['key']] = $r['value']; }
        Response::json($result);
    }

    public function heroSlides(array $p): void {
        $rows = $this->db->query("SELECT * FROM hero_slides WHERE status = 'published' ORDER BY sort_order, id");
        Response::json($rows);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        $email = trim($b['email'] ?? '');
        $subject = trim($b['subject'] ?? '');
        $message = trim($b['message'] ?? '');
        $phone = trim($b['phone'] ?? '');

        if (!$name || !$email || !$subject || !$message) {
            Response::error('Vui lòng điền đủ thông tin bắt buộc.'); return;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Email không hợp lệ.'); return;
        }

        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, 'new')",
            [$name, $email, $phone, $subject, $message]
        );
        Response::json(['ok' => true]);
    }

    // GET /sitemap.xml — SEO cơ bản
    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');
        $base = rtrim(APP_URL, '/');
        $staticRoutes = ['/', '/gioi-thieu', '/lien-he', '/chinh-sach-bao-mat', '/dieu-khoan'];
        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($base . $route, ENT_XML1) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
