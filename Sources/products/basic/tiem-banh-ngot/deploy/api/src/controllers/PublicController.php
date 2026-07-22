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
            "SELECT id, title, subtitle, button_text, button_link, image, sort_order
             FROM hero_slides WHERE status = 'published'
             ORDER BY sort_order, id"
        );
        Response::json($slides);
    }

    public function productCategories(array $p): void {
        $cats = $this->db->query(
            "SELECT id, name, slug, description, icon, image, sort_order
             FROM product_categories WHERE status = 'published'
             ORDER BY sort_order, id"
        );
        Response::json($cats);
    }

    public function products(array $p): void {
        $items = $this->db->query(
            "SELECT p.*, c.name as category_name, c.slug as category_slug
             FROM products p
             LEFT JOIN product_categories c ON c.id = p.category_id
             WHERE p.status = 'published'
             ORDER BY p.category_id, p.sort_order, p.id"
        );
        Response::json($items);
    }

    public function gallery(array $p): void {
        $items = $this->db->query(
            "SELECT id, title, description, image, category, sort_order
             FROM gallery_items WHERE status = 'published'
             ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function testimonials(array $p): void {
        $items = $this->db->query(
            "SELECT id, author_name, author_title, author_avatar, content, rating, emoji, sort_order
             FROM testimonials WHERE status = 'published'
             ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function flavors(array $p): void {
        $items = $this->db->query(
            "SELECT id, name, icon, description, tags, bg_color, sort_order
             FROM flavors WHERE status = 'published'
             ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        if (empty($b['name']) || empty($b['message'])) {
            Response::error('Vui lòng điền đầy đủ họ tên và nội dung.'); return;
        }
        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
            [
                trim($b['name']),
                trim($b['email'] ?? ''),
                trim($b['phone'] ?? ''),
                trim($b['subject'] ?? 'Liên hệ từ website'),
                trim($b['message']),
            ]
        );
        Response::json(['ok' => true, 'message' => 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.']);
    }

    public function submitOrder(array $p): void {
        $b = bodyJson();
        if (empty($b['name']) || empty($b['phone'])) {
            Response::error('Vui lòng điền đầy đủ họ tên và số điện thoại.'); return;
        }
        if (empty($b['pickup_date'])) {
            Response::error('Vui lòng chọn ngày nhận bánh.'); return;
        }
        $this->db->execute(
            "INSERT INTO orders (name, phone, email, cake_type, cake_size, flavors, decoration_style, color_theme, cake_message, special_request, pickup_date, delivery_type, delivery_address)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                trim($b['name']),
                trim($b['phone']),
                trim($b['email'] ?? ''),
                trim($b['cake_type'] ?? ''),
                trim($b['cake_size'] ?? ''),
                is_array($b['flavors'] ?? null) ? implode(', ', $b['flavors']) : trim($b['flavors'] ?? ''),
                trim($b['decoration_style'] ?? ''),
                trim($b['color_theme'] ?? ''),
                trim($b['cake_message'] ?? ''),
                trim($b['special_request'] ?? ''),
                $b['pickup_date'],
                trim($b['delivery_type'] ?? 'pickup'),
                trim($b['delivery_address'] ?? ''),
            ]
        );
        Response::json(['ok' => true, 'message' => 'Yêu cầu đặt bánh đã được gửi! Chúng tôi sẽ liên hệ trong vòng 2 giờ để xác nhận và báo giá chi tiết.']);
    }

    // GET /sitemap.xml
    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');
        $base = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https://' : 'http://') . ($_SERVER['HTTP_HOST'] ?? 'localhost');
        $staticRoutes = ['/', '/san-pham', '/dat-hang', '/lien-he'];
        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($base . $route) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
