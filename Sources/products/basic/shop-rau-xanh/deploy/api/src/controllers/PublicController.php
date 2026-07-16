<?php
declare(strict_types=1);

// Public (không cần Auth): settings/hero-slides/contact form — site tự viết.
// KHÔNG đụng vào Product/Order/Payment — các endpoint đó nằm ở ShopPublicController.php (file tĩnh).
class PublicController {
    public function __construct(private Database $db) {}

    public function settings(): void {
        // ⚠️ Lọc bỏ nhóm 'payment' — tránh lộ sepay_webhook_secret qua endpoint public không cần auth.
        // Lọc thêm smtp/cloudinary/integrations vì đó là secret nội bộ, website không cần dùng.
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

    public function submitContact(): void {
        $data    = bodyJson();
        $name    = trim($data['name'] ?? '');
        $phone   = trim($data['phone'] ?? '');
        $email   = trim($data['email'] ?? '');
        $subject = trim($data['subject'] ?? '');
        $message = trim($data['message'] ?? '');

        if (!$name || !$phone || !$message) {
            Response::error('Vui lòng điền đầy đủ họ tên, số điện thoại và lời nhắn', 422);
            return;
        }
        if (mb_strlen($name) > 120 || mb_strlen($phone) > 30 || mb_strlen($email) > 200 || mb_strlen($subject) > 150 || mb_strlen($message) > 2000) {
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
