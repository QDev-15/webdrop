<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    // GET /public/settings — flat {key: value}
    public function settings(array $p = []): void {
        $rows   = $this->db->query("SELECT key, value FROM settings");
        $result = [];
        foreach ($rows as $r) { $result[$r['key']] = $r['value']; }
        Response::json($result);
    }

    // GET /public/hero-slides — array
    public function heroSlides(array $p = []): void {
        $slides = $this->db->query(
            "SELECT * FROM hero_slides WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($slides);
    }

    // GET /public/services — array
    public function services(array $p = []): void {
        $services = $this->db->query(
            "SELECT * FROM services ORDER BY sort_order, id"
        );
        Response::json($services);
    }

    // GET /public/doctors — array
    public function doctors(array $p = []): void {
        $doctors = $this->db->query(
            "SELECT * FROM doctors ORDER BY sort_order, id"
        );
        Response::json($doctors);
    }

    // GET /public/testimonials — array
    public function testimonials(array $p = []): void {
        $items = $this->db->query(
            "SELECT * FROM testimonials ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    // POST /public/bookings — khach gui dat lich
    public function submitBooking(array $p = []): void {
        $b = bodyJson();
        $name  = trim($b['customer_name'] ?? $b['name'] ?? '');
        $phone = trim($b['phone'] ?? '');
        if (!$name || !$phone) {
            Response::error('Ho ten va so dien thoai la bat buoc.', 422);
            return;
        }
        $this->db->execute(
            "INSERT INTO bookings (customer_name, phone, email, pref_service, pref_date, pref_time, note, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'new')",
            [
                htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
                htmlspecialchars($phone, ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['email'] ?? ''), ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['service'] ?? $b['pref_service'] ?? ''), ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['date'] ?? $b['pref_date'] ?? ''), ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['time'] ?? $b['pref_time'] ?? ''), ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['note'] ?? ''), ENT_QUOTES, 'UTF-8'),
            ]
        );
        Response::json(['message' => 'Dat lich thanh cong. Chung toi se lien he xac nhan som nhat.'], 201);
    }

    // POST /public/contact — khach gui lien he
    public function submitContact(array $p = []): void {
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) {
            Response::error('Ho ten la bat buoc.', 422);
            return;
        }
        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, 'new')",
            [
                htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['email'] ?? ''), ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['phone'] ?? ''), ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['subject'] ?? ''), ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['message'] ?? ''), ENT_QUOTES, 'UTF-8'),
            ]
        );
        Response::json(['message' => 'Cam on ban da lien he. Chung toi se phan hoi trong 24 gio lam viec.'], 201);
    }

    // GET /sitemap.xml — chi co route tinh, khong co trang chi tiet dong
    public function sitemap(array $p = []): void {
        header('Content-Type: application/xml; charset=utf-8');

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $base   = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        // Site nay khong co trang chi tiet dong — chi route tinh
        $staticRoutes = ['/', '/dich-vu', '/quy-trinh-nieng', '/bac-si', '/dat-lich', '/lien-he'];

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($base . $route, ENT_XML1) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
