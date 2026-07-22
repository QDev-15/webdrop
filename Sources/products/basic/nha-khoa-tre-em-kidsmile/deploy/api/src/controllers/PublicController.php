<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    // GET /public/settings
    public function settings(array $p): void {
        $rows = $this->db->query("SELECT key, value FROM settings");
        $result = [];
        foreach ($rows as $r) {
            $result[$r['key']] = $r['value'];
        }
        Response::json($result);
    }

    // GET /public/hero-slides
    public function heroSlides(array $p): void {
        $slides = $this->db->query(
            "SELECT * FROM hero_slides WHERE status = 'published' ORDER BY sort_order ASC"
        );
        Response::json($slides);
    }

    // GET /public/service-categories
    public function serviceCategories(array $p): void {
        $cats = $this->db->query(
            "SELECT * FROM service_categories ORDER BY sort_order ASC"
        );
        Response::json($cats);
    }

    // GET /public/services
    public function services(array $p): void {
        $services = $this->db->query(
            "SELECT s.*, sc.name AS category_name, sc.slug AS category_slug
             FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             ORDER BY s.sort_order ASC"
        );
        Response::json($services);
    }

    // GET /public/doctors
    public function doctors(array $p): void {
        $doctors = $this->db->query(
            "SELECT * FROM doctors WHERE is_active = 1 ORDER BY sort_order ASC"
        );
        Response::json($doctors);
    }

    // GET /public/testimonials
    public function testimonials(array $p): void {
        $testimonials = $this->db->query(
            "SELECT * FROM testimonials WHERE is_featured = 1 ORDER BY sort_order ASC"
        );
        Response::json($testimonials);
    }

    // GET /public/articles
    public function articles(array $p): void {
        $articles = $this->db->query(
            "SELECT id, title, slug, excerpt, thumbnail, tag, read_time, created_at
             FROM articles WHERE status = 'published' ORDER BY sort_order ASC, created_at DESC"
        );
        Response::json($articles);
    }

    // POST /public/bookings
    public function createBooking(array $p): void {
        $b = bodyJson();

        $parentName = trim($b['parent_name'] ?? '');
        $phone      = trim($b['phone']       ?? '');

        if (!$parentName || !$phone) {
            Response::error('Họ tên phụ huynh và số điện thoại là bắt buộc.', 422);
            return;
        }

        $this->db->execute(
            "INSERT INTO bookings (parent_name, child_name, child_age, phone, email, service, date, time, note, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')",
            [
                $parentName,
                trim($b['child_name'] ?? ''),
                trim($b['child_age']  ?? ''),
                $phone,
                trim($b['email']      ?? ''),
                trim($b['service']    ?? ''),
                trim($b['date']       ?? ''),
                trim($b['time']       ?? ''),
                trim($b['note']       ?? ''),
            ]
        );

        Response::json(['ok' => true, 'message' => 'Đặt lịch thành công! Đội ngũ KidSmile sẽ gọi điện xác nhận trong vòng 2 giờ làm việc.']);
    }

    // POST /public/contact
    public function createContact(array $p): void {
        $b = bodyJson();

        $name    = trim($b['name']    ?? '');
        $phone   = trim($b['phone']   ?? '');
        $email   = trim($b['email']   ?? '');
        $subject = trim($b['subject'] ?? '');
        $message = trim($b['message'] ?? '');

        if (!$name || (!$phone && !$email)) {
            Response::error('Vui lòng điền đầy đủ thông tin bắt buộc.', 422);
            return;
        }

        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, 'new')",
            [$name, $email, $phone, $subject, $message]
        );

        Response::json(['ok' => true, 'message' => 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.']);
    }

    // GET /sitemap.xml
    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');

        $base = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https://' : 'http://') . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        $staticRoutes = ['/', '/dich-vu', '/cam-nang-cha-me', '/bac-si', '/dat-lich', '/lien-he'];

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($base . $route) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
