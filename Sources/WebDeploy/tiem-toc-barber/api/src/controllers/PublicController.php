<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        $rows = $this->db->query('SELECT key, value FROM settings');
        $out = [];
        foreach ($rows as $r) $out[$r['key']] = $r['value'];
        Response::json($out);
    }

    public function slides(array $p): void {
        $rows = $this->db->query(
            "SELECT id, title, subtitle, button_text, button_link, image, sort_order
             FROM hero_slides WHERE status = 'published'
             ORDER BY sort_order ASC, id ASC"
        );
        Response::json($rows);
    }

    public function serviceCategories(array $p): void {
        $rows = $this->db->query(
            'SELECT id, name, slug, icon, tag, sort_order FROM service_categories ORDER BY sort_order ASC, id ASC'
        );
        Response::json($rows);
    }

    public function services(array $p): void {
        $featured = isset($_GET['featured']) && $_GET['featured'] === '1';
        $catSlug  = $_GET['category'] ?? '';

        $where  = ["s.status = 'published'"];
        $params = [];

        if ($featured) {
            $where[] = 's.is_featured = 1';
        }
        if ($catSlug) {
            $where[] = 'sc.slug = ?';
            $params[] = $catSlug;
        }

        $sql = "SELECT s.id, s.name, s.note, s.description, s.price_text, s.image,
                       s.is_featured, s.sort_order,
                       sc.id AS category_id, sc.name AS category_name, sc.slug AS category_slug,
                       sc.icon AS category_icon, sc.tag AS category_tag
                FROM services s
                LEFT JOIN service_categories sc ON sc.id = s.category_id
                WHERE " . implode(' AND ', $where) . '
                ORDER BY sc.sort_order ASC, s.sort_order ASC, s.id ASC';

        Response::json($this->db->query($sql, $params));
    }

    public function team(array $p): void {
        $rows = $this->db->query(
            "SELECT id, name, role, specialty, image, sort_order
             FROM team WHERE status = 'published'
             ORDER BY sort_order ASC, id ASC"
        );
        Response::json($rows);
    }

    public function testimonials(array $p): void {
        $rows = $this->db->query(
            "SELECT id, customer_name, avatar, meta, rating, content, sort_order
             FROM testimonials WHERE status = 'published'
             ORDER BY sort_order ASC, id ASC"
        );
        Response::json($rows);
    }

    public function gallery(array $p): void {
        $rows = $this->db->query(
            "SELECT id, image, alt_text, sort_order
             FROM gallery_items WHERE status = 'published'
             ORDER BY sort_order ASC, id ASC"
        );
        Response::json($rows);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Họ tên là bắt buộc.'); return; }
        $this->db->execute(
            'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
            [$name, trim($b['email'] ?? ''), trim($b['phone'] ?? ''), trim($b['subject'] ?? ''), trim($b['message'] ?? '')]
        );
        Response::json(['ok' => true, 'message' => 'Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi trong vòng 24 giờ.'], 201);
    }

    public function submitBooking(array $p): void {
        $b = bodyJson();
        $fullName = trim($b['full_name'] ?? '');
        $phone    = trim($b['phone'] ?? '');
        if (!$fullName || !$phone) {
            Response::error('Họ tên và số điện thoại là bắt buộc.'); return;
        }
        $this->db->execute(
            'INSERT INTO bookings (full_name, phone, service_name, stylist_pref, pref_date, pref_time, note)
             VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                $fullName, $phone,
                trim($b['service_name'] ?? ''),
                trim($b['stylist_pref'] ?? ''),
                trim($b['pref_date'] ?? ''),
                trim($b['pref_time'] ?? ''),
                trim($b['note'] ?? ''),
            ]
        );
        Response::json(['ok' => true, 'message' => 'Đặt lịch thành công! Chúng tôi sẽ xác nhận qua Zalo trong vòng 15 phút.'], 201);
    }
}
