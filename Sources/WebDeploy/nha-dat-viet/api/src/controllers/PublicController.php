<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    // GET /public/settings — flat {key: value}, loại bỏ nhóm nhạy cảm
    public function settings(array $p): void {
        $rows = $this->db->query("SELECT key, value FROM settings WHERE grp NOT IN ('smtp','cloudinary','integrations')");
        $result = [];
        foreach ($rows as $r) { $result[$r['key']] = $r['value']; }
        Response::json($result);
    }

    // GET /public/hero-slides
    public function heroSlides(array $p): void {
        Response::json($this->db->query("SELECT * FROM hero_slides WHERE status = 'published' ORDER BY sort_order, id"));
    }

    // GET /public/properties — toàn bộ tin đăng, filter/sort/phân trang client-side như template
    // gốc (dataset nhỏ ~42 tin, giữ đúng behavior LOCKED: filter tức thì, không nút Apply).
    public function properties(array $p): void {
        $rows = $this->db->query(
            "SELECT pr.*, a.name AS agent_name, a.title AS agent_title, a.phone AS agent_phone,
                    a.zalo AS agent_zalo, a.avatar AS agent_avatar
             FROM properties pr LEFT JOIN agents a ON a.id = pr.agent_id
             ORDER BY pr.created_at DESC"
        );
        Response::json(array_map([$this, 'decorateProperty'], $rows));
    }

    // GET /public/properties/:slug
    public function propertyBySlug(array $p): void {
        $row = $this->db->queryOne(
            "SELECT pr.*, a.name AS agent_name, a.title AS agent_title, a.phone AS agent_phone,
                    a.zalo AS agent_zalo, a.avatar AS agent_avatar
             FROM properties pr LEFT JOIN agents a ON a.id = pr.agent_id
             WHERE pr.slug = ?",
            [$p['slug']]
        );
        if (!$row) { Response::error('Không tìm thấy bất động sản.', 404); return; }
        Response::json($this->decorateProperty($row));
    }

    private function decorateProperty(array $row): array {
        $row['images'] = array_values(array_filter(explode('|', (string)($row['images'] ?? ''))));
        $row['features'] = array_values(array_filter(explode('|', (string)($row['features'] ?? ''))));
        $row['agent'] = $row['agent_id'] ? [
            'id' => $row['agent_id'], 'name' => $row['agent_name'], 'title' => $row['agent_title'],
            'phone' => $row['agent_phone'], 'zalo' => $row['agent_zalo'], 'avatar' => $row['agent_avatar'],
        ] : null;
        unset($row['agent_name'], $row['agent_title'], $row['agent_phone'], $row['agent_zalo'], $row['agent_avatar']);
        return $row;
    }

    // GET /public/agents — đội ngũ môi giới (trang Giới thiệu)
    public function agents(array $p): void {
        Response::json($this->db->query("SELECT * FROM agents ORDER BY sort_order, id"));
    }

    // GET /public/projects — dự án đang phân phối
    public function projects(array $p): void {
        Response::json($this->db->query("SELECT * FROM projects ORDER BY sort_order, id"));
    }

    // GET /public/testimonials
    public function testimonials(array $p): void {
        Response::json($this->db->query("SELECT * FROM testimonials ORDER BY sort_order, id"));
    }

    // GET /public/faqs
    public function faqs(array $p): void {
        Response::json($this->db->query("SELECT * FROM faqs ORDER BY sort_order, id"));
    }

    // POST /public/contact — dùng chung cho form Liên hệ (lien-he.html) và form Đặt lịch xem nhà
    // (chi-tiet-bds.html) — bảng contacts core không có cột riêng cho property/ngày/giờ nên gộp
    // vào message (đúng pattern đã dùng ở các site BĐS trước, xem rule 5).
    public function submitContact(array $p): void {
        $b = bodyJson();
        $name  = trim((string)($b['name'] ?? ''));
        $phone = trim((string)($b['phone'] ?? ''));
        if (!$name || !$phone) { Response::error('Họ tên và số điện thoại là bắt buộc.'); return; }

        $email   = trim((string)($b['email'] ?? ''));
        $subject = trim((string)($b['subject'] ?? 'Yêu cầu tư vấn'));

        $lines = [];
        if (!empty($b['property_title'])) $lines[] = 'Bất động sản quan tâm: ' . trim((string)$b['property_title']);
        if (!empty($b['visit_date']))     $lines[] = 'Ngày mong muốn xem nhà: ' . trim((string)$b['visit_date']);
        if (!empty($b['visit_time']))     $lines[] = 'Khung giờ: ' . trim((string)$b['visit_time']);
        if (!empty($b['message']))        $lines[] = trim((string)$b['message']);
        elseif (!empty($b['note']))       $lines[] = 'Ghi chú: ' . trim((string)$b['note']);
        $message = implode("\n", $lines);

        $id = $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
            [$name, $email, $phone, $subject, $message]
        );
        Response::json(['ok' => true, 'id' => $id], 201);
    }

    // GET /sitemap.xml
    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');
        $appUrl = rtrim(APP_URL, '/');
        $staticRoutes = ['/', '/bat-dong-san', '/du-an', '/ve-chung-toi', '/lien-he', '/chinh-sach-bao-mat', '/dieu-khoan'];
        $slugs = array_column($this->db->query("SELECT slug FROM properties"), 'slug');

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($appUrl . $route, ENT_XML1) . '</loc></url>' . "\n";
        }
        foreach ($slugs as $slug) {
            echo '  <url><loc>' . htmlspecialchars($appUrl . '/bat-dong-san/' . $slug, ENT_XML1) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
