<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        $rows = $this->db->query("SELECT key, value FROM settings");
        $out  = [];
        foreach ($rows as $row) {
            $out[$row['key']] = $row['value'];
        }
        Response::json($out);
    }

    public function heroSlides(array $p): void {
        $slides = $this->db->query(
            "SELECT * FROM hero_slides WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($slides);
    }

    public function services(array $p): void {
        $services = $this->db->query(
            "SELECT * FROM services WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($services);
    }

    public function projects(array $p): void {
        $category = $_GET['category'] ?? '';
        $sql      = "SELECT * FROM projects WHERE status='published'";
        $params   = [];
        if ($category) {
            $sql    .= " AND category=?";
            $params[] = $category;
        }
        $sql .= " ORDER BY featured DESC, sort_order, id";
        Response::json($this->db->query($sql, $params));
    }

    public function team(array $p): void {
        $team = $this->db->query(
            "SELECT * FROM team_members WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($team);
    }

    public function testimonials(array $p): void {
        $testimonials = $this->db->query(
            "SELECT * FROM testimonials WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($testimonials);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        $name    = trim($b['name'] ?? '');
        $phone   = trim($b['phone'] ?? '');
        $email   = trim($b['email'] ?? '');
        $subject = trim($b['subject'] ?? '');
        $message = trim($b['message'] ?? '');

        if (!$name) {
            Response::error('Họ tên không được để trống.');
            return;
        }
        if (!$message && !$phone) {
            Response::error('Vui lòng nhập nội dung hoặc số điện thoại.');
            return;
        }

        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
            [$name, $email, $phone, $subject, $message]
        );
        Response::json(['ok' => true, 'message' => 'Đã gửi thành công. Chúng tôi sẽ liên hệ lại sớm nhất.'], 201);
    }

    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $base   = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        // Site này không có trang chi tiết dự án/dịch vụ riêng — chỉ route tĩnh
        $staticRoutes = ['/', '/dich-vu', '/du-an', '/ve-chung-toi', '/lien-he'];

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($base . $route, ENT_XML1) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
