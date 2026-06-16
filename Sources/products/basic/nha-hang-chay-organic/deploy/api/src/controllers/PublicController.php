<?php
declare(strict_types=1);

class PublicController
{
    public function __construct(private Database $db) {}

    public function settings(array $p): void
    {
        $rows = $this->db->query('SELECT key, value FROM settings');
        $out  = [];
        foreach ($rows as $row) {
            $out[$row['key']] = $row['value'];
        }
        Response::json($out);
    }

    public function heroSlides(array $p): void
    {
        $slides = $this->db->query(
            "SELECT * FROM hero_slides WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($slides);
    }

    public function menuCategories(array $p): void
    {
        $cats = $this->db->query(
            "SELECT c.*, (SELECT COUNT(*) FROM menu_items WHERE category_id = c.id AND status = 'published') as item_count
             FROM menu_categories c
             WHERE c.status = 'published'
             ORDER BY c.sort_order, c.id"
        );
        Response::json($cats);
    }

    public function menuItems(array $p): void
    {
        $catSlug = $_GET['category'] ?? '';
        if ($catSlug) {
            $items = $this->db->query(
                "SELECT i.*, c.name as category_name, c.slug as category_slug
                 FROM menu_items i
                 LEFT JOIN menu_categories c ON c.id = i.category_id
                 WHERE i.status = 'published' AND c.slug = ?
                 ORDER BY i.sort_order, i.id",
                [$catSlug]
            );
        } else {
            $items = $this->db->query(
                "SELECT i.*, c.name as category_name, c.slug as category_slug
                 FROM menu_items i
                 LEFT JOIN menu_categories c ON c.id = i.category_id
                 WHERE i.status = 'published'
                 ORDER BY i.sort_order, i.id"
            );
        }
        Response::json($items);
    }

    public function featuredItems(array $p): void
    {
        $items = $this->db->query(
            "SELECT i.*, c.name as category_name
             FROM menu_items i
             LEFT JOIN menu_categories c ON c.id = i.category_id
             WHERE i.status = 'published' AND i.featured = 1
             ORDER BY i.sort_order, i.id
             LIMIT 8"
        );
        Response::json($items);
    }

    public function testimonials(array $p): void
    {
        $items = $this->db->query(
            "SELECT * FROM testimonials WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function gallery(array $p): void
    {
        $items = $this->db->query(
            "SELECT * FROM gallery_items WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function submitContact(array $p): void
    {
        $b = bodyJson();
        if (empty($b['name']) || empty($b['message'])) {
            Response::error('Vui lòng điền tên và nội dung tin nhắn.', 422);
            return;
        }
        $id = $this->db->execute(
            'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
            [
                trim($b['name']),
                trim($b['email'] ?? ''),
                trim($b['phone'] ?? ''),
                trim($b['subject'] ?? ''),
                trim($b['message']),
            ]
        );
        Response::json(['id' => $id, 'message' => 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.'], 201);
    }

    public function submitReservation(array $p): void
    {
        $b = bodyJson();
        if (empty($b['name']) || empty($b['phone']) || empty($b['date']) || empty($b['time'])) {
            Response::error('Vui lòng điền đầy đủ thông tin bắt buộc: tên, số điện thoại, ngày và giờ.', 422);
            return;
        }
        $id = $this->db->execute(
            'INSERT INTO reservations (name, phone, email, date, time, guests, occasion, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                trim($b['name']),
                trim($b['phone']),
                trim($b['email'] ?? ''),
                $b['date'],
                $b['time'],
                (int)($b['guests'] ?? 2),
                trim($b['occasion'] ?? ''),
                trim($b['note'] ?? ''),
            ]
        );
        Response::json(['id' => $id, 'message' => 'Đặt bàn thành công! Chúng tôi sẽ xác nhận qua điện thoại trong vòng 30 phút.'], 201);
    }
}
