<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        $rows = $this->db->query("SELECT key, value FROM settings");
        $result = [];
        foreach ($rows as $row) $result[$row['key']] = $row['value'];
        Response::json($result);
    }

    public function heroSlides(array $p): void {
        $slides = $this->db->query(
            "SELECT id, title, subtitle, button_text, button_link, image FROM hero_slides
             WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($slides);
    }

    public function services(array $p): void {
        $services = $this->db->query(
            "SELECT id, name, slug, description, icon, image, sort_order FROM services
             WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($services);
    }

    public function projects(array $p): void {
        $category = $_GET['category'] ?? '';
        $featured = $_GET['featured'] ?? '';
        $sql = "SELECT id, name, slug, category, description, location, year_completed, area, floors, duration, value, image, featured
                FROM projects WHERE status = 'published'";
        $params = [];
        if ($category) { $sql .= " AND category = ?"; $params[] = $category; }
        if ($featured) { $sql .= " AND featured = 1"; }
        $sql .= " ORDER BY sort_order, id";
        Response::json($this->db->query($sql, $params));
    }

    public function testimonials(array $p): void {
        $testimonials = $this->db->query(
            "SELECT id, author_name, author_title, author_avatar, content, rating FROM testimonials
             WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($testimonials);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        $message = trim($b['message'] ?? '');
        if (!$name || !$message) {
            Response::error('Vui lòng điền họ tên và nội dung.'); return;
        }
        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message, project_type) VALUES (?, ?, ?, ?, ?, ?)",
            [
                $name,
                trim($b['email'] ?? ''),
                trim($b['phone'] ?? ''),
                trim($b['subject'] ?? 'Yêu cầu báo giá'),
                $message,
                trim($b['project_type'] ?? ''),
            ]
        );
        Response::json(['ok' => true, 'message' => 'Yêu cầu của bạn đã được ghi nhận!']);
    }

    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $base   = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        $staticRoutes = ['/', '/dich-vu', '/du-an', '/lien-he'];

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($base . $route, ENT_XML1) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
