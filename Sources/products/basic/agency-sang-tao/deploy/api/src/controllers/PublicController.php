<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        $rows = $this->db->query("SELECT key, value FROM settings");
        $out = [];
        foreach ($rows as $r) $out[$r['key']] = $r['value'];
        Response::json($out);
    }

    public function heroSlides(array $p): void {
        $slides = $this->db->query(
            "SELECT * FROM hero_slides WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($slides);
    }

    public function services(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM services WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function featuredServices(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM services WHERE status='published' AND featured=1 ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function projects(array $p): void {
        $category = trim($_GET['category'] ?? '');
        if ($category && $category !== 'all') {
            $items = $this->db->query(
                "SELECT * FROM projects WHERE status='published' AND category=? ORDER BY sort_order, id",
                [$category]
            );
        } else {
            $items = $this->db->query(
                "SELECT * FROM projects WHERE status='published' ORDER BY sort_order, id"
            );
        }
        Response::json($items);
    }

    public function featuredProjects(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM projects WHERE status='published' AND featured=1 ORDER BY sort_order, id LIMIT 5"
        );
        Response::json($items);
    }

    public function team(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM team_members WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function testimonials(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM testimonials WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        $name    = trim($b['name'] ?? '');
        $email   = trim($b['email'] ?? '');
        $message = trim($b['message'] ?? '');
        if (!$name || !$message) { Response::error('Tên và nội dung không được để trống.'); return; }
        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message, service) VALUES (?, ?, ?, ?, ?, ?)",
            [$name, $email, $b['phone'] ?? '', $b['subject'] ?? '', $message, $b['service'] ?? '']
        );
        Response::json(['ok' => true, 'message' => 'Tin nhắn của bạn đã được gửi thành công!'], 201);
    }

    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $base   = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        $staticRoutes = ['/', '/du-an', '/dich-vu', '/ve-chung-toi', '/lien-he'];

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($base . $route, ENT_XML1) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
