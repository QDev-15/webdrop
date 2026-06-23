<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        $rows = $this->db->query("SELECT key, value FROM settings");
        $result = [];
        foreach ($rows as $r) { $result[$r['key']] = $r['value']; }
        Response::json($result);
    }

    public function heroSlides(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM hero_slides WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function menuCategories(array $p): void {
        $items = $this->db->query(
            "SELECT c.*, (SELECT COUNT(*) FROM menu_items i WHERE i.category_id = c.id AND i.status = 'published') as item_count
             FROM menu_categories c
             WHERE c.status = 'published'
             ORDER BY c.sort_order, c.id"
        );
        Response::json($items);
    }

    public function menuItems(array $p): void {
        $catId = isset($_GET['category_id']) ? (int)$_GET['category_id'] : 0;
        if ($catId > 0) {
            $items = $this->db->query(
                "SELECT i.*, c.name as category_name FROM menu_items i
                 LEFT JOIN menu_categories c ON c.id = i.category_id
                 WHERE i.status = 'published' AND i.category_id = ?
                 ORDER BY i.sort_order, i.id",
                [$catId]
            );
        } else {
            $items = $this->db->query(
                "SELECT i.*, c.name as category_name FROM menu_items i
                 LEFT JOIN menu_categories c ON c.id = i.category_id
                 WHERE i.status = 'published'
                 ORDER BY i.sort_order, i.id"
            );
        }
        Response::json($items);
    }

    public function gallery(array $p): void {
        $cat = $_GET['category'] ?? '';
        if ($cat !== '') {
            $items = $this->db->query(
                "SELECT * FROM gallery_items WHERE status = 'published' AND category = ? ORDER BY sort_order, id",
                [$cat]
            );
        } else {
            $items = $this->db->query(
                "SELECT * FROM gallery_items WHERE status = 'published' ORDER BY sort_order, id"
            );
        }
        Response::json($items);
    }

    public function testimonials(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM testimonials WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        if (empty($b['name']) || empty($b['message'])) {
            Response::error('Vui lòng điền họ tên và nội dung.', 422);
            return;
        }
        $this->db->execute(
            "INSERT INTO contacts (name, phone, email, message, status) VALUES (?, ?, ?, ?, 'new')",
            [
                trim($b['name']),
                trim($b['phone'] ?? ''),
                trim($b['email'] ?? ''),
                trim($b['message']),
            ]
        );
        Response::json(['ok' => true, 'message' => 'Tin nhắn của bạn đã được gửi. Chúng tôi sẽ phản hồi sớm nhất!']);
    }

    public function submitReservation(array $p): void {
        $b = bodyJson();
        if (empty($b['name']) || empty($b['phone']) || empty($b['date']) || empty($b['time'])) {
            Response::error('Vui lòng điền đầy đủ thông tin bắt buộc.', 422);
            return;
        }
        $this->db->execute(
            "INSERT INTO reservations (name, phone, email, date, time, guests, table_type, note, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')",
            [
                trim($b['name']),
                trim($b['phone']),
                trim($b['email'] ?? ''),
                $b['date'],
                $b['time'],
                (int)($b['guests'] ?? 2),
                trim($b['table_type'] ?? ''),
                trim($b['note'] ?? ''),
            ]
        );
        Response::json(['ok' => true, 'message' => 'Đặt bàn thành công! Chúng tôi sẽ gọi xác nhận trong 15 phút.']);
    }
}
