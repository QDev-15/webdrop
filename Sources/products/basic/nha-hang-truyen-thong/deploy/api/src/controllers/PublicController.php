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
            "SELECT id, title, subtitle, button_text, button_link, image, sort_order
             FROM hero_slides WHERE status = 'published'
             ORDER BY sort_order, id"
        );
        Response::json($slides);
    }

    public function menu(array $p): void {
        $categories = $this->db->query(
            "SELECT * FROM menu_categories WHERE status = 'published' ORDER BY sort_order, id"
        );
        $items = $this->db->query(
            "SELECT i.*, c.name as category_name, c.slug as category_slug
             FROM menu_items i
             LEFT JOIN menu_categories c ON c.id = i.category_id
             WHERE i.status = 'published'
             ORDER BY i.sort_order, i.id"
        );
        Response::json(['categories' => $categories, 'items' => $items]);
    }

    public function gallery(array $p): void {
        $items = $this->db->query(
            "SELECT id, title, description, image, category, sort_order
             FROM gallery_items WHERE status = 'published'
             ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function testimonials(array $p): void {
        $items = $this->db->query(
            "SELECT id, author_name, author_title, author_avatar, content, rating, sort_order
             FROM testimonials WHERE status = 'published'
             ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        if (empty($b['name']) || empty($b['message'])) {
            Response::error('Vui lòng điền đầy đủ họ tên và nội dung.'); return;
        }
        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
            [
                trim($b['name']),
                trim($b['email'] ?? ''),
                trim($b['phone'] ?? ''),
                trim($b['subject'] ?? 'Liên hệ từ website'),
                trim($b['message']),
            ]
        );
        Response::json(['ok' => true, 'message' => 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.']);
    }

    public function submitReservation(array $p): void {
        $b = bodyJson();
        if (empty($b['name']) || empty($b['phone']) || empty($b['date']) || empty($b['time'])) {
            Response::error('Vui lòng điền đầy đủ thông tin đặt bàn.'); return;
        }
        $this->db->execute(
            "INSERT INTO reservations (name, phone, email, date, time, guests, menu_pkg, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                trim($b['name']),
                trim($b['phone']),
                trim($b['email'] ?? ''),
                $b['date'],
                $b['time'],
                (int)($b['guests'] ?? 2),
                trim($b['menu_pkg'] ?? ''),
                trim($b['note'] ?? ''),
            ]
        );
        Response::json(['ok' => true, 'message' => 'Đặt bàn thành công! Chúng tôi sẽ gọi xác nhận trong vòng 30 phút.']);
    }
}
