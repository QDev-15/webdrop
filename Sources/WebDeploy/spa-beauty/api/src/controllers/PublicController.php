<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(): void {
        $rows = $this->db->query("SELECT key, value FROM settings");
        $result = [];
        foreach ($rows as $r) { $result[$r['key']] = $r['value']; }
        Response::json($result);
    }

    public function heroSlides(): void {
        $rows = $this->db->query("SELECT * FROM hero_slides ORDER BY sort_order ASC");
        Response::json($rows);
    }

    public function services(): void {
        $rows = $this->db->query("
            SELECT s.*, c.name AS category_name, c.icon AS category_icon
            FROM services s
            LEFT JOIN service_categories c ON c.id = s.category_id
            ORDER BY s.sort_order ASC, s.id ASC
        ");
        Response::json($rows);
    }

    public function gallery(): void {
        $rows = $this->db->query("SELECT * FROM gallery_items ORDER BY sort_order ASC");
        Response::json($rows);
    }

    public function testimonials(): void {
        $rows = $this->db->query("SELECT * FROM testimonials ORDER BY sort_order ASC");
        Response::json($rows);
    }

    public function team(): void {
        $rows = $this->db->query("SELECT * FROM team_members ORDER BY sort_order ASC");
        Response::json($rows);
    }

    public function serviceCategories(): void {
        $rows = $this->db->query("SELECT * FROM service_categories ORDER BY sort_order ASC, id ASC");
        Response::json($rows);
    }

    public function submitContact(): void {
        $body    = bodyJson();
        $name    = trim($body['name']    ?? '');
        $phone   = trim($body['phone']   ?? '');
        $email   = trim($body['email']   ?? '');
        $subject = trim($body['subject'] ?? '');
        $message = trim($body['message'] ?? '');

        if (!$name || !$message) {
            Response::error('Vui lòng điền họ tên và nội dung.', 422);
            return;
        }

        $this->db->execute(
            "INSERT INTO contacts (name, phone, email, subject, message) VALUES (?,?,?,?,?)",
            [$name, $phone, $email, $subject, $message]
        );
        Response::json(['message' => 'Đã gửi thành công! Chúng tôi sẽ liên hệ sớm nhất.']);
    }

    public function submitBooking(): void {
        $body      = bodyJson();
        $name      = trim($body['name']      ?? '');
        $phone     = trim($body['phone']     ?? '');
        $service   = trim($body['service']   ?? '');
        $therapist = trim($body['therapist'] ?? '');
        $date      = trim($body['date']      ?? '');
        $time      = trim($body['time']      ?? '');
        $note      = trim($body['note']      ?? '');

        if (!$name || !$phone || !$service || !$date || !$time) {
            Response::error('Vui lòng điền đầy đủ thông tin đặt lịch.', 422);
            return;
        }

        $this->db->execute(
            "INSERT INTO bookings (name, phone, service, therapist, date, time, note) VALUES (?,?,?,?,?,?,?)",
            [$name, $phone, $service, $therapist, $date, $time, $note]
        );
        Response::json(['message' => 'Đặt lịch thành công! Chúng tôi sẽ xác nhận qua Zalo trong vòng 15 phút.']);
    }

    // GET /sitemap.xml
    public function sitemap(): void {
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
