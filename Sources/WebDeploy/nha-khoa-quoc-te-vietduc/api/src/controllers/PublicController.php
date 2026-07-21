<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(): void {
        $rows = $this->db->query("SELECT key, value FROM settings");
        $out  = [];
        foreach ($rows as $r) { $out[$r['key']] = $r['value']; }
        Response::json($out);
    }

    public function heroSlides(): void {
        $rows = $this->db->query(
            "SELECT id, title, subtitle, image, button_text, button_link, sort_order
             FROM hero_slides WHERE status = 'published' ORDER BY sort_order ASC"
        );
        Response::json($rows);
    }

    public function serviceCategories(): void {
        $rows = $this->db->query(
            "SELECT id, name, description, sort_order
             FROM service_categories WHERE is_active = 1 ORDER BY sort_order ASC"
        );
        Response::json($rows);
    }

    public function services(): void {
        $catId = isset($_GET['category_id']) ? (int)$_GET['category_id'] : 0;
        if ($catId > 0) {
            $rows = $this->db->query(
                "SELECT s.id, s.category_id, sc.name AS category_name, s.image, s.tag,
                        s.name, s.description, s.price, s.price_unit, s.sort_order
                 FROM services s
                 LEFT JOIN service_categories sc ON sc.id = s.category_id
                 WHERE s.is_active = 1 AND s.category_id = ?
                 ORDER BY s.sort_order ASC",
                [$catId]
            );
        } else {
            $rows = $this->db->query(
                "SELECT s.id, s.category_id, sc.name AS category_name, s.image, s.tag,
                        s.name, s.description, s.price, s.price_unit, s.sort_order
                 FROM services s
                 LEFT JOIN service_categories sc ON sc.id = s.category_id
                 WHERE s.is_active = 1
                 ORDER BY s.sort_order ASC"
            );
        }
        Response::json($rows);
    }

    public function doctors(): void {
        $flag = $_GET['flag'] ?? '';
        if ($flag !== '') {
            $rows = $this->db->query(
                "SELECT id, name, role, flag, experience_years, photo, tags, description
                 FROM doctors WHERE is_active = 1 AND flag = ? ORDER BY sort_order ASC",
                [$flag]
            );
        } else {
            $rows = $this->db->query(
                "SELECT id, name, role, flag, experience_years, photo, tags, description
                 FROM doctors WHERE is_active = 1 ORDER BY sort_order ASC"
            );
        }
        // tags: pipe-separated -> array
        foreach ($rows as &$r) {
            $r['tags'] = $r['tags'] ? explode('|', $r['tags']) : [];
        }
        Response::json($rows);
    }

    public function testimonials(): void {
        $rows = $this->db->query(
            "SELECT id, author_name, author_role, author_avatar, stars, content
             FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC"
        );
        Response::json($rows);
    }

    public function submitBooking(): void {
        $b = bodyJson();
        $required = ['fullname', 'phone'];
        foreach ($required as $f) {
            if (empty($b[$f])) { Response::error("Truong {$f} la bat buoc."); return; }
        }
        $this->db->execute(
            "INSERT INTO bookings (fullname, phone, email, service, branch, pref_date, pref_time, note)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                htmlspecialchars(trim($b['fullname']), ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['phone']),    ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['email']  ?? ''), ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['service'] ?? ''), ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['branch']  ?? ''), ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['pref_date'] ?? ''), ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['pref_time'] ?? ''), ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['note']    ?? ''), ENT_QUOTES, 'UTF-8'),
            ]
        );
        Response::json(['ok' => true, 'message' => 'Dat lich thanh cong. Chung toi se lien he trong thoi gian som nhat.']);
    }

    public function submitContact(): void {
        $b = bodyJson();
        if (empty($b['name']) || empty($b['message'])) {
            Response::error('Ten va noi dung la bat buoc.'); return;
        }
        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
            [
                htmlspecialchars(trim($b['name']),    ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['email']   ?? ''), ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['phone']   ?? ''), ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['subject'] ?? ''), ENT_QUOTES, 'UTF-8'),
                htmlspecialchars(trim($b['message']), ENT_QUOTES, 'UTF-8'),
            ]
        );
        Response::json(['ok' => true, 'message' => 'Cam on ban da lien he. Chung toi se phan hoi som nhat.']);
    }

    // Sitemap XML động — route GET /sitemap.xml. Ghi đè Content-Type JSON mặc định của Router.
    public function sitemap(): void {
        header('Content-Type: application/xml; charset=utf-8');

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $base   = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        // Site này không có trang chi tiết động — chỉ route tĩnh
        $staticRoutes = ['/', '/dich-vu', '/co-so-vat-chat', '/bac-si', '/dat-lich', '/lien-he'];

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($base . $route, ENT_XML1) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
