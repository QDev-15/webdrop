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
        $rows = $this->db->query(
            "SELECT id, title, subtitle, cta_text, cta_url, image, sort_order
             FROM hero_slides WHERE is_active = 1 ORDER BY sort_order ASC"
        );
        Response::json($rows);
    }

    public function serviceCategories(array $p): void {
        $rows = $this->db->query(
            "SELECT id, name, slug, sort_order FROM service_categories ORDER BY sort_order ASC"
        );
        Response::json($rows);
    }

    public function services(array $p): void {
        $catId    = isset($_GET['category_id']) ? (int)$_GET['category_id'] : null;
        $featured = isset($_GET['featured'])    ? (int)$_GET['featured']    : null;
        $sql = "SELECT s.id, s.category_id, s.name, s.description, s.image, s.tag, s.price, s.price_unit,
                       s.is_featured, s.sort_order, c.name AS category_name
                FROM services s LEFT JOIN service_categories c ON s.category_id = c.id WHERE 1=1";
        $params = [];
        if ($catId !== null)    { $sql .= " AND s.category_id = ?"; $params[] = $catId; }
        if ($featured !== null) { $sql .= " AND s.is_featured = ?"; $params[] = $featured; }
        $sql .= " ORDER BY s.sort_order ASC";
        Response::json($this->db->query($sql, $params));
    }

    public function doctors(array $p): void {
        $rows = $this->db->query(
            "SELECT id, name, role, photo, description, experience_years, credentials, tag, sort_order
             FROM doctors ORDER BY sort_order ASC"
        );
        Response::json($rows);
    }

    public function testimonials(array $p): void {
        $rows = $this->db->query(
            "SELECT id, author_name, author_role, author_avatar, content, stars, is_featured, sort_order
             FROM testimonials WHERE is_featured = 1 ORDER BY sort_order ASC"
        );
        Response::json($rows);
    }

    public function createBooking(array $p): void {
        $b = bodyJson();
        $fullname = trim($b['fullname'] ?? '');
        $phone    = trim($b['phone']    ?? '');
        if (!$fullname || !$phone) {
            Response::json(['error' => 'Họ tên và số điện thoại là bắt buộc.'], 400);
            return;
        }
        $this->db->execute(
            "INSERT INTO bookings (fullname, phone, email, service, pref_date, pref_time, note) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                $fullname,
                $phone,
                trim($b['email']     ?? ''),
                trim($b['service']   ?? ''),
                trim($b['pref_date'] ?? ''),
                trim($b['pref_time'] ?? ''),
                trim($b['note']      ?? ''),
            ]
        );
        Response::json(['ok' => true, 'message' => 'Đặt lịch thành công! Chúng tôi sẽ liên hệ xác nhận trong vòng 24 giờ.']);
    }

    public function createContact(array $p): void {
        $b = bodyJson();
        $name    = trim($b['name']    ?? '');
        $phone   = trim($b['phone']   ?? '');
        $message = trim($b['message'] ?? '');
        if (!$name || !$phone) {
            Response::json(['error' => 'Họ tên và số điện thoại là bắt buộc.'], 400);
            return;
        }
        $this->db->execute(
            "INSERT INTO contacts (name, phone, email, subject, message) VALUES (?, ?, ?, ?, ?)",
            [$name, $phone, trim($b['email'] ?? ''), trim($b['subject'] ?? 'Liên hệ website'), $message]
        );
        Response::json(['ok' => true, 'message' => 'Gửi tin nhắn thành công! LuxDental sẽ phản hồi sớm nhất.']);
    }
}
