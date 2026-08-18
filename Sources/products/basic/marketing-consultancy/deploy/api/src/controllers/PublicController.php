<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        $rows = $this->db->query("SELECT key, value FROM settings WHERE grp NOT IN ('smtp','cloudinary','integrations','payment')");
        $result = [];
        foreach ($rows as $r) { $result[$r['key']] = $r['value']; }
        Response::json($result);
    }

    public function heroSlides(array $p): void {
        $slides = $this->db->query(
            "SELECT id, title, subtitle, image, button_text, button_link, sort_order FROM hero_slides WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($slides);
    }

    public function services(array $p): void {
        $services = $this->db->query(
            "SELECT id, icon, title, short_desc, long_desc, image, sort_order FROM services WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($services);
    }

    public function team(array $p): void {
        $team = $this->db->query(
            "SELECT id, name, position, bio, avatar, tier, sort_order FROM team_members WHERE status='published' ORDER BY CASE tier WHEN 'leadership' THEN 0 ELSE 1 END, sort_order, id"
        );
        Response::json($team);
    }

    public function testimonials(array $p): void {
        $testimonials = $this->db->query(
            "SELECT id, author_name, author_title, author_avatar, content, rating, sort_order FROM testimonials WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($testimonials);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        if (empty($b['name']) || empty($b['message'])) {
            Response::error('Vui lòng nhập họ tên và nội dung.', 400);
            return;
        }
        $id = $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, 'new')",
            [$b['name'], $b['email'] ?? '', $b['phone'] ?? '', $b['subject'] ?? '', $b['message']]
        );
        Response::json(['id' => $id], 201);
    }

    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');
        $staticRoutes = ['/', '/ve-chung-toi', '/dich-vu', '/doi-ngu', '/lien-he', '/chinh-sach-bao-mat', '/dieu-khoan'];
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        echo '<?xml version="1.0" encoding="UTF-8"?>';
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        foreach ($staticRoutes as $route) {
            echo '<url><loc>https://' . htmlspecialchars($host) . $route . '</loc></url>';
        }
        echo '</urlset>';
    }
}
