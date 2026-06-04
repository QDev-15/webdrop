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

    public function services(array $p): void
    {
        $featured = $_GET['featured'] ?? '';
        if ($featured === '1') {
            $services = $this->db->query(
                "SELECT * FROM services WHERE status='published' AND featured=1 ORDER BY sort_order, id"
            );
        } else {
            $services = $this->db->query(
                "SELECT * FROM services WHERE status='published' ORDER BY sort_order, id"
            );
        }
        Response::json($services);
    }

    public function projects(array $p): void
    {
        $cat     = $_GET['category'] ?? '';
        $limit   = min((int)($_GET['limit'] ?? 50), 100);
        $featured = $_GET['featured'] ?? '';

        $where = "WHERE status='published'";
        $params = [];

        if ($cat && $cat !== 'all') {
            $where .= " AND category=?";
            $params[] = $cat;
        }
        if ($featured === '1') {
            $where .= " AND featured=1";
        }

        $projects = $this->db->query(
            "SELECT * FROM projects $where ORDER BY featured DESC, sort_order, id LIMIT ?",
            array_merge($params, [$limit])
        );
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

    public function processSteps(array $p): void
    {
        $steps = $this->db->query(
            "SELECT * FROM process_steps WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($steps);
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
        $email   = trim($b['email'] ?? '');
        $phone   = trim($b['phone'] ?? '');
        $company = trim($b['company'] ?? '');
        $service = trim($b['service'] ?? '');
        $budget  = trim($b['budget'] ?? '');
        $message = trim($b['message'] ?? '');

        if (!$name || !$message) {
            Response::error('Họ tên và mô tả dự án không được để trống.');
        }

        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, company, service, budget, message, status)
             VALUES (?,?,?,?,?,?,?,'new')",
            [$name, $email, $phone, $company, $service, $budget, $message]
        );

        Response::json(['ok' => true, 'message' => 'Brief của bạn đã được gửi. Chúng tôi sẽ phản hồi trong 24 giờ.'], 201);
    }
}
