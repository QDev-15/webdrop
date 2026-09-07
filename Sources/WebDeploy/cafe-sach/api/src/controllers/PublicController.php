<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(): void {
        // Lọc bỏ các nhóm nhạy cảm (smtp/cloudinary/integrations) — không lộ key/secret ra endpoint public
        $rows = $this->db->query("SELECT key, value FROM settings WHERE grp NOT IN ('smtp','cloudinary','integrations')");
        $result = [];
        foreach ($rows as $r) { $result[$r['key']] = $r['value']; }
        Response::json($result);
    }

    public function heroSlides(): void {
        $items = $this->db->query(
            "SELECT * FROM hero_slides WHERE status='published' ORDER BY sort_order ASC, id ASC"
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
             ORDER BY mc.sort_order ASC, mc.id ASC"
        );
        Response::json($items);
    }

    public function menuItems(): void {
        $catId = isset($_GET['category_id']) && $_GET['category_id'] !== '' ? (int)$_GET['category_id'] : null;
        if ($catId) {
            $items = $this->db->query(
                "SELECT mi.*, mc.name as category_name
                 FROM menu_items mi
                 LEFT JOIN menu_categories mc ON mc.id = mi.category_id
                 WHERE mi.status='published' AND mi.category_id=?
                 ORDER BY mi.sort_order ASC, mi.id ASC",
                [$catId]
            );
        } else {
            $items = $this->db->query(
                "SELECT mi.*, mc.name as category_name
                 FROM menu_items mi
                 LEFT JOIN menu_categories mc ON mc.id = mi.category_id
                 WHERE mi.status='published'
                 ORDER BY mc.sort_order ASC, mi.sort_order ASC, mi.id ASC"
            );
        }
        Response::json($items);
    }

    public function gallery(): void {
        $category = isset($_GET['category']) ? trim((string)$_GET['category']) : '';
        if ($category !== '') {
            $items = $this->db->query(
                "SELECT * FROM gallery_items WHERE status='published' AND category=? ORDER BY sort_order ASC, id ASC",
                [$category]
            );
        } else {
            $items = $this->db->query(
                "SELECT * FROM gallery_items WHERE status='published' ORDER BY sort_order ASC, id ASC"
            );
        }
        Response::json($items);
    }

    public function testimonials(): void {
        $items = $this->db->query(
            "SELECT * FROM testimonials WHERE status='published' ORDER BY sort_order ASC, id ASC"
        );
        Response::json($items);
    }

    public function faqs(): void {
        $items = $this->db->query(
            "SELECT * FROM faqs WHERE status='published' ORDER BY sort_order ASC, id ASC"
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

        if (!$name)  { Response::error('Vui lòng nhập họ tên.',        422); return; }
        if (!$phone) { Response::error('Vui lòng nhập số điện thoại.', 422); return; }

        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
            [$name, $email, $phone, $subject, $message]
        );
        Response::json(['message' => 'Đã gửi yêu cầu đặt chỗ! Chúng tôi sẽ phản hồi trong 24h.']);
    }

    // GET /sitemap.xml
    public function sitemap(): void {
        header('Content-Type: application/xml; charset=utf-8');
        $base = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https://' : 'http://') . ($_SERVER['HTTP_HOST'] ?? 'localhost');
        $staticRoutes = ['/', '/menu', '/khong-gian', '/gioi-thieu', '/lien-he', '/chinh-sach-bao-mat', '/dieu-khoan'];
        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($base . $route) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
