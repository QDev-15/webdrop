<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    // GET /public/settings — flat {key: value}, loại bỏ nhóm nhạy cảm (smtp/cloudinary/integrations)
    public function settings(array $p): void {
        $rows = $this->db->query("SELECT key, value FROM settings WHERE grp NOT IN ('smtp','cloudinary','integrations')");
        $result = [];
        foreach ($rows as $r) { $result[$r['key']] = $r['value']; }
        Response::json($result);
    }

    // GET /public/hero-slides
    public function heroSlides(array $p): void {
        $rows = $this->db->query("SELECT * FROM hero_slides WHERE status = 'published' ORDER BY sort_order, id");
        Response::json($rows);
    }

    // GET /public/unit-types — toàn bộ 10 loại căn (dataset nhỏ, lọc/sort client-side như template gốc)
    public function unitTypes(array $p): void {
        $rows = $this->db->query("SELECT * FROM unit_types ORDER BY sort_order, id");
        Response::json(array_map([$this, 'decorateUnit'], $rows));
    }

    // GET /public/unit-types/:slug
    public function unitTypeBySlug(array $p): void {
        $row = $this->db->queryOne("SELECT * FROM unit_types WHERE slug = ?", [$p['slug']]);
        if (!$row) { Response::error('Không tìm thấy loại căn.', 404); return; }
        Response::json($this->decorateUnit($row));
    }

    private function decorateUnit(array $row): array {
        $row['gallery']  = json_decode($row['gallery'] ?? '[]', true) ?: [];
        $row['features'] = json_decode($row['features'] ?? '[]', true) ?: [];
        return $row;
    }

    // GET /public/amenities
    public function amenities(array $p): void {
        Response::json($this->db->query("SELECT * FROM amenities ORDER BY sort_order, id"));
    }

    // GET /public/nearby-amenities
    public function nearbyAmenities(array $p): void {
        Response::json($this->db->query("SELECT * FROM nearby_amenities ORDER BY sort_order, id"));
    }

    // GET /public/payment-phases
    public function paymentPhases(array $p): void {
        Response::json($this->db->query("SELECT * FROM payment_phases ORDER BY sort_order, id"));
    }

    // GET /public/sales-policies
    public function salesPolicies(array $p): void {
        Response::json($this->db->query("SELECT * FROM sales_policies ORDER BY sort_order, id"));
    }

    // GET /public/faqs
    public function faqs(array $p): void {
        Response::json($this->db->query("SELECT * FROM faqs ORDER BY sort_order, id"));
    }

    // GET /public/testimonials
    public function testimonials(array $p): void {
        Response::json($this->db->query("SELECT * FROM testimonials ORDER BY sort_order, id"));
    }

    // POST /public/contact — form đăng ký nhận bảng giá / tư vấn / tham quan nhà mẫu
    public function submitContact(array $p): void {
        $b = bodyJson();
        $name  = trim((string)($b['name'] ?? ''));
        $phone = trim((string)($b['phone'] ?? ''));
        if (!$name || !$phone) { Response::error('Họ tên và số điện thoại là bắt buộc.'); return; }

        $email  = trim((string)($b['email'] ?? ''));
        $subject = trim((string)($b['subject'] ?? 'Đăng ký nhận bảng giá & tư vấn'));

        // Gộp các trường đặc thù BĐS (loại căn quan tâm, ngày tham quan, hình thức liên hệ ưu tiên,
        // ghi chú) vào message — bảng contacts core không có cột riêng cho các trường này (rule 5).
        $lines = [];
        if (!empty($b['unit_interest'])) $lines[] = 'Loại căn quan tâm: ' . trim((string)$b['unit_interest']);
        if (!empty($b['visit_date']))    $lines[] = 'Ngày mong muốn tham quan: ' . trim((string)$b['visit_date']);
        if (!empty($b['contact_method'])) $lines[] = 'Hình thức liên hệ ưu tiên: ' . trim((string)$b['contact_method']);
        if (!empty($b['note']))          $lines[] = 'Ghi chú: ' . trim((string)$b['note']);
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
        $staticRoutes = ['/', '/ve-chu-dau-tu', '/bang-gia', '/tien-ich', '/lien-he', '/chinh-sach-bao-mat', '/dieu-khoan'];
        $slugs = array_column($this->db->query("SELECT slug FROM unit_types"), 'slug');

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($appUrl . $route, ENT_XML1) . '</loc></url>' . "\n";
        }
        foreach ($slugs as $slug) {
            echo '  <url><loc>' . htmlspecialchars($appUrl . '/loai-can-chi-tiet?loai=' . $slug, ENT_XML1) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
