<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        $rows = $this->db->query("SELECT key, value FROM settings");
        $result = [];
        foreach ($rows as $r) { $result[$r['key']] = $r['value']; }
        Response::json($result);
    }

    public function heroSlides(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM hero_slides WHERE active = 1 ORDER BY sort_order ASC"
        );
        Response::json($items);
    }

    public function services(array $p): void {
        $items = $this->db->query(
            "SELECT s.*, sc.name AS category_name FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             WHERE s.active = 1 ORDER BY s.sort_order ASC"
        );
        Response::json($items);
    }

    public function servicePackages(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM service_packages WHERE active = 1 ORDER BY sort_order ASC"
        );
        Response::json($items);
    }

    public function testimonials(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM testimonials WHERE active = 1 ORDER BY sort_order ASC"
        );
        Response::json($items);
    }

    public function team(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM therapists WHERE active = 1 ORDER BY sort_order ASC"
        );
        Response::json($items);
    }

    public function serviceCategories(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM service_categories WHERE active = 1 ORDER BY sort_order ASC"
        );
        Response::json($items);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        $name    = trim((string)($b['name'] ?? ''));
        $phone   = trim((string)($b['phone'] ?? ''));
        $email   = trim((string)($b['email'] ?? ''));
        $subject = trim((string)($b['subject'] ?? ''));
        $message = trim((string)($b['message'] ?? ''));

        if (!$name || !$phone || !$message) {
            Response::error('Vui long dien day du thong tin bat buoc.', 422);
            return;
        }

        $this->db->execute(
            "INSERT INTO contacts (name, phone, email, subject, message, status) VALUES (?, ?, ?, ?, ?, 'new')",
            [$name, $phone, $email, $subject, $message]
        );
        Response::json(['ok' => true, 'message' => 'Da nhan tin nhan cua ban. Chung toi se phan hoi trong 24 gio.']);
    }

    public function submitBooking(array $p): void {
        $b = bodyJson();
        $name         = trim((string)($b['name'] ?? ''));
        $phone        = trim((string)($b['phone'] ?? ''));
        $service_type = trim((string)($b['service_type'] ?? ''));
        $duration     = trim((string)($b['duration'] ?? ''));
        $therapist    = trim((string)($b['therapist'] ?? ''));
        $book_date    = trim((string)($b['book_date'] ?? ''));
        $book_time    = trim((string)($b['book_time'] ?? ''));
        $health_note  = trim((string)($b['health_note'] ?? ''));

        if (!$name || !$phone || !$service_type || !$book_date || !$book_time) {
            Response::error('Vui long dien day du thong tin bat buoc.', 422);
            return;
        }

        $this->db->execute(
            "INSERT INTO bookings (name, phone, service_type, duration, therapist, book_date, book_time, health_note, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')",
            [$name, $phone, $service_type, $duration, $therapist, $book_date, $book_time, $health_note]
        );
        Response::json(['ok' => true, 'message' => 'Dat lich thanh cong. Nhan vien se lien he xac nhan trong 30 phut.']);
    }

    // GET /sitemap.xml
    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');
        $base = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https://' : 'http://') . ($_SERVER['HTTP_HOST'] ?? 'localhost');
        $staticRoutes = ['/', '/dich-vu', '/dat-lich', '/lien-he'];
        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($base . $route) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
