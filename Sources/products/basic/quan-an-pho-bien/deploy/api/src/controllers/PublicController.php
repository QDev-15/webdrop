<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        $rows = $this->db->query("SELECT key, value FROM settings");
        $result = [];
        foreach ($rows as $row) {
            $result[$row['key']] = $row['value'];
        }
        Response::json($result);
    }

    public function heroSlides(array $p): void {
        $slides = $this->db->query(
            "SELECT * FROM hero_slides WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($slides);
    }

    public function menuCategories(array $p): void {
        $cats = $this->db->query(
            "SELECT * FROM menu_categories WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($cats);
    }

    public function menu(array $p): void {
        $cats = $this->db->query(
            "SELECT * FROM menu_categories WHERE status = 'published' ORDER BY sort_order, id"
        );
        $items = $this->db->query(
            "SELECT * FROM menu_items WHERE status = 'published' ORDER BY sort_order, id"
        );
        $itemsByCategory = [];
        foreach ($items as $item) {
            $catId = $item['category_id'] ?? 0;
            if (!isset($itemsByCategory[$catId])) {
                $itemsByCategory[$catId] = [];
            }
            $itemsByCategory[$catId][] = $item;
        }
        $result = [];
        foreach ($cats as $cat) {
            $cat['items'] = $itemsByCategory[$cat['id']] ?? [];
            $result[] = $cat;
        }
        Response::json($result);
    }

    public function testimonials(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM testimonials WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function gallery(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM gallery_items WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        $name    = trim($b['name'] ?? '');
        $phone   = trim($b['phone'] ?? '');
        $message = trim($b['message'] ?? '');
        if (!$name) {
            Response::error('Vui lòng nhập tên.');
            return;
        }
        if (!$message) {
            Response::error('Vui lòng nhập nội dung.');
            return;
        }
        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, 'new')",
            [$name, $b['email'] ?? '', $phone, $b['subject'] ?? 'Liên hệ từ website', $message]
        );
        Response::json(['ok' => true, 'message' => 'Tin nhắn của bạn đã được gửi. Chúng tôi sẽ phản hồi sớm nhất!']);
    }
}
