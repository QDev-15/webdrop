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
            "SELECT i.*, c.name as category_name, c.slug as category_slug
             FROM menu_items i LEFT JOIN menu_categories c ON c.id = i.category_id
             WHERE i.status='published' ORDER BY i.sort_order, i.id"
        );
        Response::json($items);
    }

    public function featuredMenuItems(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM menu_items WHERE status='published' AND featured=1 ORDER BY sort_order, id LIMIT 4"
        );
        Response::json($items);
    }

    public function galleryItems(array $p): void {
        $items = $this->db->query("SELECT * FROM gallery_items WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function testimonials(array $p): void {
        $items = $this->db->query("SELECT * FROM testimonials WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function contentBlocks(array $p): void {
        $section = $_GET['section'] ?? '';
        if ($section !== '') {
            $items = $this->db->query("SELECT * FROM content_blocks WHERE status='published' AND section=? ORDER BY sort_order, id", [$section]);
        } else {
            $items = $this->db->query("SELECT * FROM content_blocks WHERE status='published' ORDER BY section, sort_order, id");
        }
        Response::json($items);
    }

    public function spaces(array $p): void {
        $items = $this->db->query("SELECT * FROM spaces WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function teamMembers(array $p): void {
        $items = $this->db->query("SELECT * FROM team_members WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function timelineItems(array $p): void {
        $items = $this->db->query("SELECT * FROM timeline_items WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function faqs(array $p): void {
        $items = $this->db->query("SELECT * FROM faqs WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        $name  = trim($b['name'] ?? '');
        $phone = trim($b['phone'] ?? '');
        if (!$name || !$phone) { Response::error('Họ tên và số điện thoại không được để trống.'); return; }

        // Gộp ngày/số người vào message vì bảng contacts core chỉ có
        // name/email/phone/subject/message/status (không mở rộng cột).
        $reason  = trim($b['reason'] ?? '');
        $date    = trim($b['date'] ?? '');
        $people  = trim($b['people'] ?? '');
        $message = trim($b['message'] ?? '');

        $lines = [];
        if ($date)   $lines[] = "Ngày mong muốn: $date";
        if ($people) $lines[] = "Số người: $people";
        if ($message) $lines[] = $message;
        $fullMessage = implode("\n", $lines);

        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, 'new')",
            [$name, trim($b['email'] ?? ''), $phone, $reason ?: 'Yêu cầu từ website', $fullMessage]
        );
        Response::json(['ok' => true, 'message' => 'Cảm ơn bạn đã gửi yêu cầu! Chúng tôi sẽ phản hồi trong vòng 15 phút trong giờ mở cửa.'], 201);
    }

    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $base   = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        $staticRoutes = ['/', '/menu', '/khong-gian', '/gioi-thieu', '/lien-he', '/chinh-sach-bao-mat', '/dieu-khoan'];

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($base . $route, ENT_XML1) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
