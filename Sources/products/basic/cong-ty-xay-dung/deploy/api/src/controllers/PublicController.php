<?php
declare(strict_types=1);

class PublicController
{
    public function __construct(private Database $db) {}

    public function settings(array $p): void
    {
        $rows   = $this->db->query("SELECT key, value FROM settings");
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
            $rows = $this->db->query(
                "SELECT * FROM services WHERE status='published' AND featured=1 ORDER BY sort_order, id"
            );
        } else {
            $rows = $this->db->query(
                "SELECT * FROM services WHERE status='published' ORDER BY sort_order, id"
            );
        }
        Response::json($rows);
    }

    public function projects(array $p): void
    {
        $cat      = $_GET['category'] ?? '';
        $limit    = min((int)($_GET['limit'] ?? 50), 100);
        $featured = $_GET['featured'] ?? '';

        $where  = "WHERE p.status='published'";
        $params = [];

        if ($cat && $cat !== 'all') {
            $where   .= " AND p.category=?";
            $params[] = $cat;
        }
        if ($featured === '1') {
            $where .= " AND p.featured=1";
        }

        $projects = $this->db->query(
            "SELECT p.*, c.name as category_name, c.slug as category_slug
             FROM projects p
             LEFT JOIN project_categories c ON c.id = p.category_id
             $where ORDER BY p.featured DESC, p.sort_order, p.id LIMIT ?",
            array_merge($params, [$limit])
        );
        Response::json($projects);
    }

    public function projectCategories(array $p): void
    {
        $cats = $this->db->query("SELECT * FROM project_categories ORDER BY sort_order, id");
        Response::json($cats);
    }

    public function testimonials(array $p): void
    {
        $rows = $this->db->query(
            "SELECT * FROM testimonials WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($rows);
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
        $name              = trim($b['name'] ?? '');
        $phone             = trim($b['phone'] ?? '');
        $email             = trim($b['email'] ?? '');
        $constructionType  = trim($b['construction_type'] ?? '');
        $area              = trim($b['area'] ?? '');
        $budget            = trim($b['budget'] ?? '');
        $location          = trim($b['location'] ?? '');
        $message           = trim($b['message'] ?? '');

        if (!$name || !$phone) {
            Response::error('Họ tên và số điện thoại không được để trống.');
        }

        $this->db->execute(
            "INSERT INTO contacts (name, phone, email, construction_type, area, budget, location, message, status)
             VALUES (?,?,?,?,?,?,?,?,'new')",
            [$name, $phone, $email, $constructionType, $area, $budget, $location, $message]
        );

        Response::json([
            'ok'      => true,
            'message' => 'Yêu cầu báo giá đã được ghi nhận. Chúng tôi sẽ liên hệ trong vòng 24 giờ.',
        ], 201);
    }
}
