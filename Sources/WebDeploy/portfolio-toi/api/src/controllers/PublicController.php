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

    public function projects(array $p): void {
        $featured = $_GET['featured'] ?? '';
        if ($featured === '1') {
            $items = $this->db->query(
                "SELECT * FROM projects WHERE status = 'published' AND featured = 1 ORDER BY sort_order, id"
            );
        } else {
            $items = $this->db->query(
                "SELECT * FROM projects WHERE status = 'published' ORDER BY sort_order, id"
            );
        }
        Response::json($items);
    }

    public function skills(array $p): void {
        $groups = $this->db->query(
            "SELECT * FROM skill_groups ORDER BY sort_order, id"
        );
        foreach ($groups as &$group) {
            $group['skills'] = $this->db->query(
                "SELECT * FROM skills WHERE group_id = ? AND status = 'published' ORDER BY sort_order, id",
                [$group['id']]
            );
        }
        Response::json($groups);
    }

    public function testimonials(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM testimonials WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        $name    = trim($b['name'] ?? '');
        $message = trim($b['message'] ?? '');
        if (!$name || !$message) {
            Response::error('Họ tên và nội dung là bắt buộc.');
            return;
        }
        $id = $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
            [$name, $b['email'] ?? '', $b['phone'] ?? '', $b['subject'] ?? '', $message]
        );
        Response::json(['ok' => true, 'id' => $id], 201);
    }
}
