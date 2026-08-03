<?php
declare(strict_types=1);

class PublicController {
    private Database $db;

    public function __construct(Database $db) {
        $this->db = $db;
    }

    public function settings(): void {
        // Loại bỏ 'payment' — chứa sepay_webhook_secret, lộ ra là lỗ hổng cho phép giả mạo webhook
        $settings = $this->db->query(
            "SELECT key, value FROM settings WHERE grp NOT IN ('smtp', 'system', 'cloudinary', 'integrations', 'payment')"
        );
        $data = [];
        foreach ($settings as $s) {
            $data[$s['key']] = $s['value'];
        }
        Response::json(['data' => $data]);
    }

    public function heroSlides(): void {
        $slides = $this->db->query(
            "SELECT id, title, subtitle, image, button_text, button_link
             FROM hero_slides WHERE status='published' ORDER BY sort_order"
        );
        Response::json(['data' => $slides]);
    }

    public function submitContact(): void {
        $body = bodyJson();
        if (empty($body['name']) || empty($body['email']) || empty($body['message'])) {
            Response::json(['error' => 'Vui lòng điền đầy đủ thông tin'], 400);
            return;
        }
        try {
            $this->db->execute(
                "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
                [
                    $body['name']    ?? '',
                    $body['email']   ?? '',
                    $body['phone']   ?? '',
                    $body['subject'] ?? 'Liên hệ từ website',
                    $body['message'] ?? '',
                ]
            );
            Response::json(['success' => true, 'message' => 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.']);
        } catch (Throwable $e) {
            Response::json(['error' => 'Không thể gửi tin nhắn. Vui lòng thử lại.'], 500);
        }
    }
}
