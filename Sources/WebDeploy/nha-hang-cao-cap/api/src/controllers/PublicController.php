<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        $rows = $this->db->query("SELECT key, value FROM settings");
        $result = [];
        foreach ($rows as $r) {
            $result[$r['key']] = $r['value'];
        }
        Response::json($result);
    }

    public function heroSlides(array $p): void {
        $slides = $this->db->query(
            "SELECT * FROM hero_slides WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($slides);
    }

    public function menu(array $p): void {
        $categories = $this->db->query(
            "SELECT * FROM menu_categories WHERE status = 'published' ORDER BY sort_order, id"
        );
        $items = $this->db->query(
            "SELECT * FROM menu_items WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json([
            'categories' => $categories,
            'items'      => $items,
        ]);
    }

    public function gallery(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM gallery_items WHERE status = 'published' ORDER BY sort_order, id"
        );
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
            Response::error('Ho ten va noi dung la bat buoc.');
            return;
        }
        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
            [
                trim($b['name']),
                trim($b['email'] ?? ''),
                trim($b['phone'] ?? ''),
                trim($b['subject'] ?? ''),
                trim($b['message']),
            ]
        );
        Response::json(['ok' => true, 'message' => 'Tin nhan da duoc gui thanh cong!']);
    }

    public function submitReservation(array $p): void {
        $b = bodyJson();
        if (empty($b['name']) || empty($b['phone']) || empty($b['date']) || empty($b['time'])) {
            Response::error('Vui long dien day du thong tin bat buoc.');
            return;
        }
        $this->db->execute(
            "INSERT INTO reservations (name, phone, email, date, time, guests, menu_pkg, note, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')",
            [
                trim($b['name']),
                trim($b['phone']),
                trim($b['email'] ?? ''),
                trim($b['date']),
                trim($b['time']),
                (int)($b['guests'] ?? 2),
                trim($b['menu_pkg'] ?? ''),
                trim($b['note'] ?? ''),
            ]
        );
        Response::json(['ok' => true, 'message' => 'Dat ban thanh cong! Chung toi se lien he xac nhan trong vong 2 gio.']);
    }
}
