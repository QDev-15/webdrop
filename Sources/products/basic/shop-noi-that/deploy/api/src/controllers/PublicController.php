<?php
declare(strict_types=1);

// Public (không cần Auth): settings / hero-slides / collections / testimonials / coupons / contact form.
// Sitemap chính (bao gồm cả sản phẩm) do ShopPublicController::sitemap() đảm nhiệm (xem bootstrap.php).
class PublicController {
    public function __construct(private Database $db) {}

    public function settings(): void {
        // Lọc bỏ nhóm nhạy cảm — tránh lộ sepay_webhook_secret/SMTP/Cloudinary/Unsplash key
        // qua endpoint public không cần auth.
        $rows = $this->db->query(
            "SELECT key, value FROM settings WHERE grp NOT IN ('smtp','cloudinary','integrations','payment')"
        );
        $result = [];
        foreach ($rows as $r) { $result[$r['key']] = $r['value']; }
        Response::json($result);
    }

    public function heroSlides(): void {
        $rows = $this->db->query(
            "SELECT * FROM hero_slides WHERE status = 'published' ORDER BY sort_order ASC, id ASC"
        );
        Response::json($rows);
    }

    public function collections(): void {
        $rows = $this->db->query(
            "SELECT c.*, COUNT(p.id) as product_count
             FROM collections c
             LEFT JOIN products p ON p.collection_id = c.id AND p.status = 'published'
             GROUP BY c.id
             ORDER BY c.sort_order ASC"
        );
        Response::json($rows);
    }

    public function testimonials(): void {
        $rows = $this->db->query("SELECT * FROM testimonials ORDER BY sort_order ASC");
        Response::json($rows);
    }

    public function coupons(): void {
        $rows = $this->db->query("SELECT * FROM coupons WHERE active = 1 ORDER BY sort_order ASC");
        Response::json($rows);
    }

    public function submitContact(): void {
        $data    = bodyJson();
        $name    = trim($data['name'] ?? '');
        $phone   = trim($data['phone'] ?? '');
        $email   = trim($data['email'] ?? '');
        $subject = trim($data['subject'] ?? '');
        $message = trim($data['message'] ?? '');

        if (!$name || !$phone || !$email || !$message) {
            Response::error('Vui lòng điền đầy đủ họ tên, số điện thoại, email và nội dung', 422);
            return;
        }
        if (mb_strlen($name) > 120 || mb_strlen($email) > 200 || mb_strlen($phone) > 30 || mb_strlen($subject) > 150 || mb_strlen($message) > 2000) {
            Response::error('Nội dung vượt quá độ dài cho phép', 422);
            return;
        }

        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
            [$name, $email, $phone, $subject, $message]
        );
        Response::json(['message' => 'Đã gửi tin nhắn thành công'], 201);
    }
}
