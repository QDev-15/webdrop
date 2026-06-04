<?php

class PublicController {
    private Database $db;
    public function __construct(Database $db) { $this->db = $db; }

    public function settings(array $p): void {
        $rows = $this->db->query("SELECT key, value FROM settings");
        $result = [];
        foreach ($rows as $r) $result[$r['key']] = $r['value'];
        Response::json($result);
    }

    public function heroSlides(array $p): void {
        $items = $this->db->query(
            "SELECT id, title, subtitle, button_text, button_link, image
             FROM hero_slides WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function features(array $p): void {
        $featured = isset($_GET['featured']) ? (int)$_GET['featured'] : null;
        if ($featured !== null) {
            $items = $this->db->query(
                "SELECT * FROM features WHERE status='published' AND featured=? ORDER BY sort_order, id",
                [$featured]
            );
        } else {
            $items = $this->db->query(
                "SELECT * FROM features WHERE status='published' ORDER BY sort_order, id"
            );
        }
        Response::json($items);
    }

    public function pricing(array $p): void {
        $plans = $this->db->query(
            "SELECT * FROM pricing_plans WHERE status='published' ORDER BY sort_order, id"
        );
        foreach ($plans as &$plan) {
            $plan['items'] = $this->db->query(
                "SELECT item, available FROM pricing_plan_items WHERE plan_id=? ORDER BY sort_order, id",
                [$plan['id']]
            );
        }
        Response::json($plans);
    }

    public function testimonials(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM testimonials WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function faqs(array $p): void {
        $items = $this->db->query(
            "SELECT id, question, answer FROM faqs WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        if (empty($b['name']) || empty($b['message'])) {
            Response::error('Họ tên và nội dung không được để trống');
        }
        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, company, subject, message) VALUES (?, ?, ?, ?, ?, ?)",
            [
                strip_tags($b['name']),
                strip_tags($b['email']   ?? ''),
                strip_tags($b['phone']   ?? ''),
                strip_tags($b['company'] ?? ''),
                strip_tags($b['subject'] ?? ''),
                strip_tags($b['message']),
            ]
        );
        Response::json(['ok' => true, 'message' => 'Cảm ơn bạn đã liên hệ. Đội ngũ chúng tôi sẽ phản hồi trong vòng 2 giờ làm việc.']);
    }

    public function submitDemo(array $p): void {
        $b = bodyJson();
        if (empty($b['name']) || empty($b['email'])) {
            Response::error('Họ tên và email không được để trống');
        }
        $this->db->execute(
            "INSERT INTO demo_requests (name, email, phone, time_pref, note) VALUES (?, ?, ?, ?, ?)",
            [
                strip_tags($b['name']),
                strip_tags($b['email']),
                strip_tags($b['phone']     ?? ''),
                strip_tags($b['time_pref'] ?? ''),
                strip_tags($b['note']      ?? ''),
            ]
        );
        Response::json(['ok' => true, 'message' => 'Đăng ký demo thành công! Chúng tôi sẽ liên hệ để sắp xếp lịch phù hợp.']);
    }
}
