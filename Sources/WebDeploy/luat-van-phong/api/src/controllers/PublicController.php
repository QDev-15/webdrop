<?php

class PublicController {
    private Database $db;
    public function __construct(Database $db) { $this->db = $db; }

    public function settings(array $p): void {
        $rows = $this->db->query("SELECT key, value FROM settings");
        $result = [];
        foreach ($rows as $r) $result[$r['key']] = $r['value'];
        Response::json($result);
    }

    public function heroSlides(array $p): void {
        $items = $this->db->query(
            "SELECT id, title, subtitle, button_text, button_link, image FROM hero_slides
             WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function services(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM services WHERE status='published' ORDER BY sort_order, id"
        );
        foreach ($items as &$item) {
            $item['items'] = array_column(
                $this->db->query(
                    "SELECT item FROM service_items WHERE service_id=? ORDER BY sort_order",
                    [$item['id']]
                ),
                'item'
            );
        }
        Response::json($items);
    }

    public function lawyers(array $p): void {
        $items = $this->db->query(
            "SELECT id, name, role, bio, speciality, avatar, tags, is_partner, sort_order
             FROM lawyers WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function cases(array $p): void {
        $category = $_GET['category'] ?? null;
        if ($category) {
            $items = $this->db->query(
                "SELECT * FROM cases WHERE status='published' AND category=? ORDER BY sort_order, year DESC, id",
                [$category]
            );
        } else {
            $items = $this->db->query(
                "SELECT * FROM cases WHERE status='published' ORDER BY sort_order, year DESC, id"
            );
        }
        Response::json($items);
    }

    public function testimonials(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM testimonials WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        if (empty($b['name']) || empty($b['message'])) {
            Response::error('Họ tên và nội dung không được để trống');
        }
        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
            [
                strip_tags($b['name']),
                strip_tags($b['email']   ?? ''),
                strip_tags($b['phone']   ?? ''),
                strip_tags($b['subject'] ?? ''),
                strip_tags($b['message']),
            ]
        );
        Response::json(['ok' => true, 'message' => 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm.']);
    }

    public function submitConsultation(array $p): void {
        $b = bodyJson();
        if (empty($b['name']) || empty($b['phone'])) {
            Response::error('Họ tên và số điện thoại không được để trống');
        }
        $this->db->execute(
            "INSERT INTO consultations (name, phone, email, field, message, time_pref, source)
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                strip_tags($b['name']),
                strip_tags($b['phone']),
                strip_tags($b['email']     ?? ''),
                strip_tags($b['field']     ?? ''),
                strip_tags($b['message']   ?? ''),
                strip_tags($b['time_pref'] ?? ''),
                strip_tags($b['source']    ?? 'website'),
            ]
        );
        Response::json(['ok' => true, 'message' => 'Đăng ký tư vấn thành công. Chúng tôi sẽ liên hệ trong vòng 2 giờ.']);
    }

    // Sitemap XML động — route GET /sitemap.xml. Ghi đè Content-Type JSON mặc định của Router.
    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $base   = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        // Site này không có trang chi tiết động — chỉ route tĩnh
        $staticRoutes = ['/', '/dich-vu', '/luat-su', '/du-an', '/lien-he'];

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($base . $route, ENT_XML1) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
