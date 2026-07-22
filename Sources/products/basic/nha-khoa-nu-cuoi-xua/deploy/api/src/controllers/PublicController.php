<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p = []): void {
        $rows   = $this->db->query("SELECT key, value FROM settings");
        $result = [];
        foreach ($rows as $r) { $result[$r['key']] = $r['value']; }
        Response::json($result);
    }

    public function heroSlides(array $p = []): void {
        $slides = $this->db->query(
            "SELECT * FROM hero_slides WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($slides);
    }

    public function serviceCategories(array $p = []): void {
        $cats = $this->db->query(
            "SELECT * FROM service_categories WHERE is_active = 1 ORDER BY sort_order, id"
        );
        Response::json($cats);
    }

    public function services(array $p = []): void {
        $items = $this->db->query(
            "SELECT s.*, sc.name AS category_name FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             WHERE s.is_active = 1 ORDER BY s.category_id, s.sort_order, s.id"
        );
        Response::json($items);
    }

    public function doctors(array $p = []): void {
        $items = $this->db->query(
            "SELECT * FROM doctors WHERE is_active = 1 ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function testimonials(array $p = []): void {
        $items = $this->db->query(
            "SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function submitBooking(array $p = []): void {
        $b       = bodyJson();
        $name    = trim($b['fullname'] ?? $b['name'] ?? '');
        $phone   = trim($b['phone'] ?? '');
        if (!$name || !$phone) {
            Response::error('Ho ten va so dien thoai la bat buoc.', 422);
            return;
        }
        $this->db->execute(
            "INSERT INTO bookings (fullname, phone, email, service, pref_date, pref_time, pref_doctor, note, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')",
            [
                htmlspecialchars($name,                                     ENT_QUOTES, 'UTF-8'),
                htmlspecialchars($phone,                                    ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['email']       ?? ''),             ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['service']     ?? ''),             ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['pref_date']   ?? $b['date'] ?? ''), ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['pref_time']   ?? $b['time'] ?? ''), ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['pref_doctor'] ?? ''),             ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['note']        ?? ''),             ENT_QUOTES, 'UTF-8'),
            ]
        );
        Response::json(['message' => 'Dat lich thanh cong. Nu Cuoi Xua se lien he xac nhan qua Zalo/dien thoai trong 15 phut.'], 201);
    }

    public function submitContact(array $p = []): void {
        $b    = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) {
            Response::error('Ho ten la bat buoc.', 422);
            return;
        }
        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, 'new')",
            [
                htmlspecialchars($name,                           ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['email']   ?? ''),       ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['phone']   ?? ''),       ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['subject'] ?? ''),       ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['message'] ?? ''),       ENT_QUOTES, 'UTF-8'),
            ]
        );
        Response::json(['message' => 'Cam on ban da lien he. Chung toi se phan hoi trong thoi gian som nhat.'], 201);
    }

    // Sitemap XML động — route GET /sitemap.xml. Ghi đè Content-Type JSON mặc định của Router.
    public function sitemap(array $p = []): void {
        header('Content-Type: application/xml; charset=utf-8');

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $base   = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        // Site này không có trang chi tiết động — chỉ route tĩnh
        $staticRoutes = ['/', '/dich-vu', '/cau-chuyen', '/bac-si', '/dat-lich', '/lien-he'];

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($base . $route, ENT_XML1) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
