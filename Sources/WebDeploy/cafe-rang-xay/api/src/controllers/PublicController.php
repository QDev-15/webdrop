<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        // Lọc bỏ nhóm nhạy cảm (smtp, cloudinary, integrations, system) khỏi endpoint
        // public không cần auth — chỉ trả các nhóm an toàn để hiển thị website.
        $rows = $this->db->query("SELECT key, value FROM settings WHERE grp NOT IN ('smtp','cloudinary','integrations','system')");
        $out = [];
        foreach ($rows as $r) { $out[$r['key']] = $r['value']; }
        Response::json($out);
    }

    public function heroSlides(array $p): void {
        $slides = $this->db->query("SELECT * FROM hero_slides WHERE status='published' ORDER BY sort_order, id");
        Response::json($slides);
    }

    public function menuCategories(array $p): void {
        $items = $this->db->query("SELECT * FROM menu_categories WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function menuItems(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM menu_items WHERE status='published' ORDER BY category_id, sort_order, id"
        );
        Response::json($items);
    }

    public function featuredDrinks(array $p): void {
        $items = $this->db->query("SELECT * FROM featured_drinks WHERE status='published' ORDER BY sort_order, id LIMIT 4");
        Response::json($items);
    }

    public function retailBeans(array $p): void {
        $items = $this->db->query("SELECT * FROM retail_beans WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function brewMethods(array $p): void {
        $items = $this->db->query("SELECT * FROM brew_methods WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function roastSteps(array $p): void {
        $items = $this->db->query("SELECT * FROM roast_steps WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function workAreas(array $p): void {
        $items = $this->db->query("SELECT * FROM work_areas WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function galleryItems(array $p): void {
        $items = $this->db->query("SELECT * FROM gallery_items WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function timelineItems(array $p): void {
        $items = $this->db->query("SELECT * FROM timeline_items WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function testimonials(array $p): void {
        $items = $this->db->query("SELECT * FROM testimonials WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function faqs(array $p): void {
        // ?home=1 -> chỉ FAQ tóm tắt hiển thị ở trang chủ; mặc định trả TẤT CẢ (trang Giới thiệu).
        $home = ($_GET['home'] ?? '') === '1';
        if ($home) {
            $items = $this->db->query("SELECT * FROM faqs WHERE status='published' AND show_home=1 ORDER BY sort_order, id");
        } else {
            $items = $this->db->query("SELECT * FROM faqs WHERE status='published' ORDER BY sort_order, id");
        }
        Response::json($items);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        $name  = trim($b['name'] ?? '');
        $phone = trim($b['phone'] ?? '');
        $message = trim($b['message'] ?? '');
        if (!$name || !$phone) { Response::error('Họ tên và số điện thoại không được để trống.'); return; }

        $topic = trim($b['topic'] ?? '') ?: 'Đặt hạt rang lẻ';

        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, 'new')",
            [$name, trim($b['email'] ?? ''), $phone, $topic, $message]
        );
        Response::json(['ok' => true, 'message' => 'Cảm ơn bạn đã gửi yêu cầu! Chúng tôi sẽ phản hồi trong vòng 30 phút giờ hành chính.'], 201);
    }

    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $base   = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        $staticRoutes = ['/', '/thuc-don', '/khong-gian', '/gioi-thieu', '/lien-he', '/chinh-sach-bao-mat', '/dieu-khoan'];

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($base . $route, ENT_XML1) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
