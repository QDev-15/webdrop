<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        // Lọc bỏ nhóm nhạy cảm (smtp_pass, cloudinary_api_secret, unsplash_access_key...)
        // khỏi endpoint public không cần auth — chỉ trả các nhóm an toàn để hiển thị website.
        $rows = $this->db->query("SELECT key, value FROM settings WHERE grp NOT IN ('smtp','cloudinary','integrations','system')");
        $out = [];
        foreach ($rows as $r) { $out[$r['key']] = $r['value']; }
        Response::json($out);
    }

    public function heroSlides(array $p): void {
        $slides = $this->db->query("SELECT * FROM hero_slides WHERE status='published' ORDER BY sort_order, id");
        Response::json($slides);
    }

    public function projects(array $p): void {
        $items = $this->db->query("SELECT * FROM projects WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function featuredProjects(array $p): void {
        $items = $this->db->query("SELECT * FROM projects WHERE status='published' AND featured=1 ORDER BY sort_order, id LIMIT 4");
        Response::json($items);
    }

    public function projectBySlug(array $p): void {
        $item = $this->db->queryOne("SELECT * FROM projects WHERE slug=? AND status='published'", [$p['slug']]);
        if (!$item) { Response::error('Không tìm thấy dự án.', 404); return; }
        Response::json($item);
    }

    public function testimonials(array $p): void {
        $items = $this->db->query("SELECT * FROM testimonials WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function faqs(array $p): void {
        $page = trim($_GET['page'] ?? 'dich-vu');
        $items = $this->db->query(
            "SELECT * FROM faqs WHERE status='published' AND page=? ORDER BY sort_order, id",
            [$page]
        );
        Response::json($items);
    }

    public function pricingPlans(array $p): void {
        $items = $this->db->query("SELECT * FROM pricing_plans WHERE status='published' ORDER BY sort_order, id");
        Response::json($items);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        $name  = trim($b['name'] ?? '');
        $phone = trim($b['phone'] ?? '');
        $message = trim($b['message'] ?? '');
        if (!$name || !$phone) { Response::error('Họ tên và số điện thoại không được để trống.'); return; }

        // Gộp thông tin ngày dự kiến / gói dịch vụ / địa điểm vào message vì
        // bảng contacts core chỉ có name/email/phone/subject/message/status (không mở rộng cột).
        $extra = [];
        if (!empty($b['event_date']))  $extra[] = 'Ngày dự kiến: ' . trim($b['event_date']);
        if (!empty($b['package']))     $extra[] = 'Gói quan tâm: ' . trim($b['package']);
        if (!empty($b['location']))    $extra[] = 'Địa điểm dự kiến: ' . trim($b['location']);
        $fullMessage = trim(implode("\n", $extra) . ($extra ? "\n\n" : '') . $message);

        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, 'new')",
            [$name, trim($b['email'] ?? ''), $phone, 'Yêu cầu tư vấn chụp ảnh cưới', $fullMessage]
        );
        Response::json(['ok' => true, 'message' => 'Cảm ơn bạn đã gửi thông tin! Đăng sẽ liên hệ lại trong vòng 24 giờ.'], 201);
    }

    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $base   = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        $staticRoutes = ['/', '/du-an', '/dich-vu', '/ve-toi', '/lien-he', '/chinh-sach-bao-mat', '/dieu-khoan'];
        $projectSlugs = $this->db->query("SELECT slug FROM projects WHERE status='published' AND slug IS NOT NULL AND slug != ''");

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($base . $route, ENT_XML1) . '</loc></url>' . "\n";
        }
        foreach ($projectSlugs as $row) {
            echo '  <url><loc>' . htmlspecialchars($base . '/du-an/' . $row['slug'], ENT_XML1) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
