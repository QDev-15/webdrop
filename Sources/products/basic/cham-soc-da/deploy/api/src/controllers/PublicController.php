<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(): void {
        $rows   = $this->db->query('SELECT key, value FROM settings');
        $result = [];
        foreach ($rows as $r) { $result[$r['key']] = $r['value']; }
        Response::json($result);
    }

    public function heroSlides(): void {
        $slides = $this->db->query(
            'SELECT * FROM hero_slides WHERE is_active = 1 ORDER BY sort_order ASC'
        );
        Response::json($slides);
    }

    public function services(): void {
        $items = $this->db->query(
            'SELECT s.*, sc.name AS category_name FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             WHERE s.is_active = 1 ORDER BY s.sort_order ASC'
        );
        Response::json($items);
    }

    public function serviceCategories(): void {
        $cats = $this->db->query(
            'SELECT * FROM service_categories WHERE is_active = 1 ORDER BY sort_order ASC'
        );
        Response::json($cats);
    }

    public function team(): void {
        $members = $this->db->query(
            'SELECT * FROM team_members WHERE is_active = 1 ORDER BY sort_order ASC'
        );
        Response::json($members);
    }

    public function testimonials(): void {
        $items = $this->db->query(
            'SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC'
        );
        Response::json($items);
    }

    public function submitContact(): void {
        $data = bodyJson();
        $name    = trim($data['name'] ?? '');
        $phone   = trim($data['phone'] ?? '');
        $email   = trim($data['email'] ?? '');
        $subject = trim($data['subject'] ?? '');
        $message = trim($data['message'] ?? '');

        if (!$name || !$phone) {
            Response::error('Vui long dien ho ten va so dien thoai.', 422);
        }

        $this->db->execute(
            'INSERT INTO contacts (name, phone, email, subject, message) VALUES (?, ?, ?, ?, ?)',
            [$name, $phone, $email, $subject, $message]
        );
        Response::json(['success' => true, 'message' => 'Da gui tin nhan. Chung toi se phan hoi som nhat!']);
    }

    public function submitBooking(): void {
        $data = bodyJson();
        $name    = trim($data['name'] ?? '');
        $phone   = trim($data['phone'] ?? '');
        $email   = trim($data['email'] ?? '');

        if (!$name || !$phone) {
            Response::error('Vui long dien ho ten va so dien thoai.', 422);
        }

        $concerns = is_array($data['skin_concerns'] ?? null)
            ? implode(',', $data['skin_concerns'])
            : (string)($data['skin_concerns'] ?? '');

        $this->db->execute(
            'INSERT INTO bookings (name, phone, email, skin_concerns, skin_type, prev_treatment, prefer_doctor, appt_date, appt_time, note)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $name,
                $phone,
                $email,
                $concerns,
                trim($data['skin_type'] ?? ''),
                trim($data['prev_treatment'] ?? ''),
                trim($data['prefer_doctor'] ?? ''),
                trim($data['appt_date'] ?? ''),
                trim($data['appt_time'] ?? ''),
                trim($data['note'] ?? ''),
            ]
        );
        Response::json(['success' => true, 'message' => 'Dat lich thanh cong! Chung toi se goi xac nhan trong 30 phut.']);
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
