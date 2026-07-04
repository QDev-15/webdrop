<?php
declare(strict_types=1);

class PublicController
{
    public function __construct(private Database $db) {}

    public function settings(): void
    {
        $rows   = $this->db->query("SELECT key, value FROM settings");
        $result = [];
        foreach ($rows as $r) {
            $result[$r['key']] = $r['value'];
        }
        Response::json($result);
    }

    public function heroSlides(): void
    {
        $slides = $this->db->query(
            "SELECT * FROM hero_slides WHERE is_active = 1 ORDER BY sort_order ASC"
        );
        Response::json($slides);
    }

    public function services(): void
    {
        $services = $this->db->query(
            "SELECT s.*, sc.name AS category_name FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             WHERE s.is_active = 1 ORDER BY s.sort_order ASC"
        );
        Response::json($services);
    }

    public function serviceCategories(): void
    {
        $cats = $this->db->query(
            "SELECT * FROM service_categories ORDER BY sort_order ASC"
        );
        Response::json($cats);
    }

    public function testimonials(): void
    {
        $testimonials = $this->db->query(
            "SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC"
        );
        Response::json($testimonials);
    }

    public function team(): void
    {
        $members = $this->db->query(
            "SELECT * FROM team_members WHERE is_active = 1 ORDER BY sort_order ASC"
        );
        Response::json($members);
    }

    public function submitContact(): void
    {
        $body    = bodyJson();
        $name    = trim($body['name'] ?? '');
        $phone   = trim($body['phone'] ?? '');
        $subject = trim($body['subject'] ?? '');
        $message = trim($body['message'] ?? '');

        if (!$name || !$phone) {
            Response::error('Vui long dien day du ho ten va so dien thoai.', 422);
            return;
        }

        $this->db->execute(
            "INSERT INTO contacts (name, phone, subject, message) VALUES (?, ?, ?, ?)",
            [$name, $phone, $subject, $message]
        );
        Response::json(['message' => 'Cam on ban da lien he! Chung toi se phan hoi som.']);
    }

    public function submitBooking(): void
    {
        $body     = bodyJson();
        // Accept both "customer_name" (from React form) and "name" (legacy)
        $name     = trim($body['customer_name'] ?? $body['name'] ?? '');
        $phone    = trim($body['phone'] ?? '');
        $email    = trim($body['email'] ?? '');
        // Accept both "service_id" (int from React) and "service" (text)
        $serviceId = isset($body['service_id']) ? (int)$body['service_id'] : null;
        $service   = $serviceId ? (string)$serviceId : trim($body['service'] ?? '');
        // Accept both "booking_date" (from React) and "date" (legacy)
        $date     = trim($body['booking_date'] ?? $body['date'] ?? '');
        $timeSlot = trim($body['time_slot'] ?? '');
        // Accept both "notes" (from React) and "note" (legacy)
        $note     = trim($body['notes'] ?? $body['note'] ?? '');

        if (!$name || !$phone) {
            Response::error('Vui long dien day du ho ten va so dien thoai.', 422);
            return;
        }

        $this->db->execute(
            "INSERT INTO bookings (name, phone, email, service, date, time_slot, note)
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            [$name, $phone, $email, $service, $date, $timeSlot, $note]
        );
        Response::json(['message' => 'Dat lich thanh cong! Chung toi se xac nhan qua SMS/Zalo trong vong 15 phut.']);
    }
}
