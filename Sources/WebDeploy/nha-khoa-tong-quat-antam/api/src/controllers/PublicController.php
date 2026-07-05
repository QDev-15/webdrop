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

    // POST /public/bookings
    public function createBooking(array $p): void {
        $b = bodyJson();

        $fullname = trim($b['fullname'] ?? '');
        $phone    = trim($b['phone']    ?? '');

        if (!$fullname || !$phone) {
            Response::error('Họ tên và số điện thoại là bắt buộc.', 422);
            return;
        }

        $this->db->execute(
            "INSERT INTO bookings (fullname, phone, email, service, doctor, date, time, note, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')",
            [
                $fullname,
                $phone,
                trim($b['email']   ?? ''),
                trim($b['service'] ?? ''),
                trim($b['doctor']  ?? ''),
                trim($b['date']    ?? ''),
                trim($b['time']    ?? ''),
                trim($b['note']    ?? ''),
            ]
        );

        Response::json(['ok' => true, 'message' => 'Đặt lịch thành công! Chúng tôi sẽ liên hệ xác nhận trong vòng 2 giờ.']);
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
            "INSERT INTO contacts (name, email, phone, subject, message, status)
             VALUES (?, ?, ?, ?, ?, 'new')",
            [$name, $email, $phone, $subject, $message]
        );

        Response::json(['ok' => true, 'message' => 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.']);
    }
}
