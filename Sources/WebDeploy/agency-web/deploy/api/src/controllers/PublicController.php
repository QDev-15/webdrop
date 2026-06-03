<?php
declare(strict_types=1);

class PublicController
{
    public function __construct(private Database $db) {}

    public function settings(array $p): void
    {
        $rows = $this->db->query("SELECT key, value FROM settings");
        $result = [];
        foreach ($rows as $row) {
            $result[$row['key']] = $row['value'];
        }
        Response::json($result);
    }

    public function heroSlides(array $p): void
    {
        $slides = $this->db->query(
            "SELECT * FROM hero_slides WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($slides);
    }

    public function services(array $p): void
    {
        $services = $this->db->query(
            "SELECT * FROM services WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($services);
    }

    public function projects(array $p): void
    {
        $cat = $_GET['category'] ?? '';
        if ($cat && $cat !== 'all') {
            $projects = $this->db->query(
                "SELECT * FROM projects WHERE status='published' AND category=? ORDER BY featured DESC, sort_order, id",
                [$cat]
            );
        } else {
            $projects = $this->db->query(
                "SELECT * FROM projects WHERE status='published' ORDER BY featured DESC, sort_order, id"
            );
        }
        Response::json($projects);
    }

    public function team(array $p): void
    {
        $members = $this->db->query(
            "SELECT * FROM team_members WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($members);
    }

    public function testimonials(array $p): void
    {
        $testimonials = $this->db->query(
            "SELECT * FROM testimonials WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($testimonials);
    }

    public function posts(array $p): void
    {
        $limit = min((int)($_GET['limit'] ?? 10), 50);
        $posts = $this->db->query(
            "SELECT id, title, slug, excerpt, thumbnail, category, created_at
             FROM posts WHERE status='published'
             ORDER BY created_at DESC LIMIT ?",
            [$limit]
        );
        Response::json($posts);
    }

    public function submitContact(array $p): void
    {
        $formEnabled = $this->db->scalar(
            "SELECT value FROM settings WHERE key='contact_form_enabled'"
        );
        if ($formEnabled === '0') {
            Response::error('Form liên hệ hiện đang tắt.', 403);
        }

        $b = bodyJson();
        $name    = trim($b['name'] ?? '');
        $phone   = trim($b['phone'] ?? '');
        $email   = trim($b['email'] ?? '');
        $subject = trim($b['subject'] ?? '');
        $service = trim($b['service'] ?? '');
        $message = trim($b['message'] ?? '');

        if (!$name || !$message) {
            Response::error('Họ tên và nội dung không được để trống.');
        }

        $this->db->execute(
            "INSERT INTO contacts (name, phone, email, subject, service, message, status)
             VALUES (?,?,?,?,?,?,'new')",
            [$name, $phone, $email, $subject, $service, $message]
        );

        Response::json(['ok' => true, 'message' => 'Đã nhận yêu cầu. Chúng tôi sẽ liên hệ lại trong 2 giờ làm việc.'], 201);
    }
}
