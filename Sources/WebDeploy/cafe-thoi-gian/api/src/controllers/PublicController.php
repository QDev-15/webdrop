<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        $rows = $this->db->query("SELECT key, value FROM settings");
        $result = [];
        foreach ($rows as $r) {
            $result[$r['key']] = $r['value'];
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
        $categorySlug = $_GET['category'] ?? '';
        if ($categorySlug) {
            $items = $this->db->query(
                "SELECT i.*, c.name as category_name, c.slug as category_slug
                 FROM menu_items i
                 LEFT JOIN menu_categories c ON c.id = i.category_id
                 WHERE c.slug = ? AND i.status = 'published'
                 ORDER BY i.sort_order, i.id",
                [$categorySlug]
            );
        } else {
            $items = $this->db->query(
                "SELECT i.*, c.name as category_name, c.slug as category_slug
                 FROM menu_items i
                 LEFT JOIN menu_categories c ON c.id = i.category_id
                 WHERE i.status = 'published'
                 ORDER BY c.sort_order, i.sort_order, i.id"
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
        $name = trim($b['name'] ?? '');
        $message = trim($b['message'] ?? '');
        if (!$name || !$message) {
            Response::error('Họ tên và nội dung là bắt buộc.');
            return;
        }
        $id = $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
            [$name, $b['email'] ?? '', $b['phone'] ?? '', $b['subject'] ?? '', $message]
        );
        Response::json(['ok' => true, 'id' => $id], 201);
    }

    public function submitReservation(array $p): void {
        $b = bodyJson();
        $name  = trim($b['name'] ?? '');
        $phone = trim($b['phone'] ?? '');
        if (!$name || !$phone) {
            Response::error('Họ tên và số điện thoại là bắt buộc.');
            return;
        }
        $id = $this->db->execute(
            "INSERT INTO reservations (name, phone, email, date, time, guests, area, purpose, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $name, $phone,
                $b['email'] ?? '',
                $b['date'] ?? '',
                $b['time'] ?? '',
                (int)($b['guests'] ?? 2),
                $b['area'] ?? '',
                $b['purpose'] ?? '',
                $b['note'] ?? '',
            ]
        );
        Response::json(['ok' => true, 'id' => $id], 201);
    }

    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $base   = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        // Site này KHÔNG có route chi tiết động (menu/gallery không có trang riêng) — chỉ liệt kê route tĩnh thật từ App.tsx
        $staticRoutes = ['/', '/menu', '/khong-gian', '/lien-he'];

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($base . $route, ENT_XML1) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
