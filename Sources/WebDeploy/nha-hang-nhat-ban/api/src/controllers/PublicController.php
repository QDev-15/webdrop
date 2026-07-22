<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        $rows = $this->db->query("SELECT key, value FROM settings");
        $result = [];
        foreach ($rows as $row) {
            $result[$row['key']] = $row['value'];
        }
        Response::json($result);
    }

    public function heroSlides(array $p): void {
        $slides = $this->db->query(
            "SELECT * FROM hero_slides WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($slides);
    }

    public function menu(array $p): void {
        $cats = $this->db->query(
            "SELECT * FROM menu_categories WHERE status = 'published' ORDER BY sort_order, id"
        );
        foreach ($cats as &$cat) {
            $cat['items'] = $this->db->query(
                "SELECT * FROM menu_items WHERE category_id = ? AND status = 'published' ORDER BY sort_order, id",
                [$cat['id']]
            );
        }
        Response::json($cats);
    }

    public function menuItems(array $p): void {
        $featured = isset($_GET['featured']) && $_GET['featured'] === '1';
        if ($featured) {
            $items = $this->db->query(
                "SELECT i.*, c.name as category_name FROM menu_items i
                 LEFT JOIN menu_categories c ON c.id = i.category_id
                 WHERE i.status = 'published' AND i.featured = 1
                 ORDER BY i.sort_order, i.id LIMIT 6"
            );
        } else {
            $items = $this->db->query(
                "SELECT i.*, c.name as category_name FROM menu_items i
                 LEFT JOIN menu_categories c ON c.id = i.category_id
                 WHERE i.status = 'published'
                 ORDER BY i.sort_order, i.id"
            );
        }
        Response::json($items);
    }

    public function gallery(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM gallery_items WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function testimonials(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM testimonials WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        if (empty($b['name']) || empty($b['message'])) {
            Response::error('Vui lòng điền họ tên và nội dung.', 422);
            return;
        }
        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
            [
                trim($b['name']),
                trim($b['email'] ?? ''),
                trim($b['phone'] ?? ''),
                trim($b['subject'] ?? ''),
                trim($b['message']),
            ]
        );
        Response::json(['ok' => true, 'message' => 'Tin nhắn đã được gửi thành công!'], 201);
    }

    public function submitReservation(array $p): void {
        $b = bodyJson();
        if (empty($b['name']) || empty($b['phone']) || empty($b['date']) || empty($b['time'])) {
            Response::error('Vui lòng điền đầy đủ thông tin đặt bàn.', 422);
            return;
        }
        $this->db->execute(
            "INSERT INTO reservations (name, phone, email, date, time, guests, menu_type, dietary, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                trim($b['name']),
                trim($b['phone']),
                trim($b['email'] ?? ''),
                trim($b['date']),
                trim($b['time']),
                intval($b['guests'] ?? 2),
                trim($b['menu_type'] ?? ''),
                trim($b['dietary'] ?? ''),
                trim($b['note'] ?? ''),
            ]
        );
        Response::json(['ok' => true, 'message' => 'Đặt bàn thành công! Chúng tôi sẽ xác nhận trong vòng 2 giờ.'], 201);
    }

    // GET /sitemap.xml
    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');
        $base = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https://' : 'http://') . ($_SERVER['HTTP_HOST'] ?? 'localhost');
        $staticRoutes = ['/', '/thuc-don', '/sushi-bar', '/dat-ban', '/lien-he'];
        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($base . $route) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
