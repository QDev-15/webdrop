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
        $items = $this->db->query(
            "SELECT * FROM hero_slides WHERE status='published' ORDER BY sort_order ASC"
        );
        Response::json($items);
    }

    public function menuCategories(): void {
        $items = $this->db->query(
            "SELECT mc.*, COUNT(mi.id) as item_count
             FROM menu_categories mc
             LEFT JOIN menu_items mi ON mi.category_id = mc.id AND mi.status='published'
             WHERE mc.status='published'
             GROUP BY mc.id
             ORDER BY mc.sort_order ASC"
        );
        Response::json($items);
    }

    public function menuItems(): void {
        $catId = isset($_GET['category_id']) ? (int)$_GET['category_id'] : null;
        if ($catId) {
            $items = $this->db->query(
                "SELECT mi.*, mc.name as category_name, mc.name_fr as category_name_fr
                 FROM menu_items mi
                 LEFT JOIN menu_categories mc ON mc.id = mi.category_id
                 WHERE mi.status='published' AND mi.category_id=?
                 ORDER BY mi.sort_order ASC",
                [$catId]
            );
        } else {
            $items = $this->db->query(
                "SELECT mi.*, mc.name as category_name, mc.name_fr as category_name_fr
                 FROM menu_items mi
                 LEFT JOIN menu_categories mc ON mc.id = mi.category_id
                 WHERE mi.status='published'
                 ORDER BY mi.category_id ASC, mi.sort_order ASC"
            );
        }
        Response::json($items);
    }

    public function gallery(): void {
        $category = isset($_GET['category']) ? trim($_GET['category']) : null;
        if ($category) {
            $items = $this->db->query(
                "SELECT * FROM gallery_items WHERE status='published' AND category=? ORDER BY sort_order ASC",
                [$category]
            );
        } else {
            $items = $this->db->query(
                "SELECT * FROM gallery_items WHERE status='published' ORDER BY sort_order ASC"
            );
        }
        Response::json($items);
    }

    public function testimonials(): void {
        $items = $this->db->query(
            "SELECT * FROM testimonials WHERE status='published' ORDER BY sort_order ASC"
        );
        Response::json($items);
    }

    public function submitContact(): void {
        $data = bodyJson();
        $name    = trim($data['name']    ?? '');
        $email   = trim($data['email']   ?? '');
        $phone   = trim($data['phone']   ?? '');
        $subject = trim($data['subject'] ?? '');
        $message = trim($data['message'] ?? '');

        if (!$name) { Response::error('Vui lòng nhập họ tên.', 422); return; }

        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
            [$name, $email, $phone, $subject, $message]
        );
        Response::json(['message' => 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.']);
    }

    public function submitReservation(): void {
        $data = bodyJson();
        $name    = trim($data['name']    ?? '');
        $phone   = trim($data['phone']   ?? '');
        $email   = trim($data['email']   ?? '');
        $date    = trim($data['date']    ?? '');
        $time    = trim($data['time']    ?? '');
        $guests  = (int)($data['guests'] ?? 2);
        $occasion = trim($data['occasion'] ?? '');
        $note    = trim($data['note']    ?? '');
        $menuPkg = trim($data['menu_pkg'] ?? '');

        if (!$name)  { Response::error('Vui lòng nhập họ tên.',         422); return; }
        if (!$phone) { Response::error('Vui lòng nhập số điện thoại.',  422); return; }
        if (!$date)  { Response::error('Vui lòng chọn ngày đặt bàn.',   422); return; }
        if (!$time)  { Response::error('Vui lòng chọn giờ đặt bàn.',    422); return; }

        $this->db->execute(
            "INSERT INTO reservations (name, phone, email, date, time, guests, occasion, note, menu_pkg)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [$name, $phone, $email, $date, $time, $guests, $occasion, $note, $menuPkg]
        );
        Response::json(['message' => 'Đặt bàn thành công! Chúng tôi sẽ xác nhận qua điện thoại trong vòng 2 giờ.']);
    }
}
