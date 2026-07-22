<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(): void {
        $rows = $this->db->query('SELECT key, value FROM settings');
        $result = [];
        foreach ($rows as $r) { $result[$r['key']] = $r['value']; }
        Response::json($result);
    }

    public function heroSlides(): void {
        $rows = $this->db->query(
            "SELECT * FROM hero_slides WHERE status='published' ORDER BY sort_order ASC"
        );
        Response::json($rows);
    }

    public function serviceCategories(): void {
        $rows = $this->db->query(
            'SELECT * FROM service_categories ORDER BY sort_order ASC'
        );
        Response::json($rows);
    }

    public function services(): void {
        $rows = $this->db->query(
            'SELECT s.*, sc.name AS category_name, sc.slug AS category_slug, sc.icon AS category_icon
             FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             ORDER BY s.category_id ASC, s.sort_order ASC'
        );
        Response::json($rows);
    }

    public function team(): void {
        $rows = $this->db->query(
            "SELECT * FROM team_members WHERE is_visible=1 ORDER BY sort_order ASC"
        );
        Response::json($rows);
    }

    public function testimonials(): void {
        $rows = $this->db->query(
            "SELECT * FROM testimonials WHERE is_visible=1 ORDER BY sort_order ASC"
        );
        Response::json($rows);
    }

    public function gallery(): void {
        $rows = $this->db->query(
            'SELECT * FROM gallery_items ORDER BY sort_order ASC'
        );
        Response::json($rows);
    }

    public function promoCombos(): void {
        $rows = $this->db->query(
            "SELECT * FROM promo_combos WHERE is_visible=1 ORDER BY sort_order ASC"
        );
        Response::json($rows);
    }

    public function submitContact(): void {
        $body = bodyJson();
        $name    = trim($body['name'] ?? '');
        $email   = trim($body['email'] ?? '');
        $phone   = trim($body['phone'] ?? '');
        $subject = trim($body['subject'] ?? '');
        $message = trim($body['message'] ?? '');

        if (!$name || !$message) {
            Response::error('Vui lòng điền họ tên và nội dung.', 422);
            return;
        }

        $this->db->execute(
            'INSERT INTO contacts (name,email,phone,subject,message) VALUES (?,?,?,?,?)',
            [$name, $email, $phone, $subject, $message]
        );
        Response::json(['message' => 'Đã nhận tin nhắn. Chúng tôi sẽ phản hồi sớm!']);
    }

    public function submitBooking(): void {
        $body = bodyJson();
        $name          = trim($body['name'] ?? '');
        $phone         = trim($body['phone'] ?? '');
        $service_group = trim($body['service_group'] ?? '');
        $service_detail= trim($body['service_detail'] ?? '');
        $stylist       = trim($body['stylist'] ?? '');
        $book_date     = trim($body['book_date'] ?? '');
        $book_time     = trim($body['book_time'] ?? '');
        $note          = trim($body['note'] ?? '');

        if (!$name || !$phone || !$service_group || !$book_date || !$book_time) {
            Response::error('Vui lòng điền đầy đủ các trường bắt buộc.', 422);
            return;
        }

        $this->db->execute(
            'INSERT INTO bookings (name,phone,service_group,service_detail,stylist,book_date,book_time,note) VALUES (?,?,?,?,?,?,?,?)',
            [$name, $phone, $service_group, $service_detail, $stylist, $book_date, $book_time, $note]
        );
        Response::json(['message' => 'Đặt lịch thành công! Chúng tôi sẽ xác nhận trong vòng 30 phút.']);
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
