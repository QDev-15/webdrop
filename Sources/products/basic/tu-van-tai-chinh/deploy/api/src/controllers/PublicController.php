<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        $rows = $this->db->query("SELECT key, value FROM settings");
        $out  = [];
        foreach ($rows as $r) $out[$r['key']] = $r['value'];
        Response::json($out);
    }

    public function heroSlides(array $p): void {
        $slides = $this->db->query(
            "SELECT * FROM hero_slides WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($slides);
    }

    public function services(array $p): void {
        $services = $this->db->query(
            "SELECT * FROM services WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($services);
    }

    public function team(array $p): void {
        $members = $this->db->query(
            "SELECT * FROM team_members WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($members);
    }

    public function testimonials(array $p): void {
        $testimonials = $this->db->query(
            "SELECT * FROM testimonials WHERE status='published' ORDER BY sort_order, id"
        );
        Response::json($testimonials);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        $message = trim($b['message'] ?? $b['note'] ?? '');
        if (!$name) { Response::error('Vui lòng điền họ tên.'); return; }
        if (!$message && empty($b['phone'])) { Response::error('Vui lòng điền thêm thông tin.'); return; }

        $id = $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message, service, preferred_date, preferred_time, asset_range, consult_format, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')",
            [
                $name,
                $b['email'] ?? '',
                $b['phone'] ?? '',
                $b['subject'] ?? 'Đặt lịch tư vấn',
                $message ?: 'Khách hàng muốn đặt lịch tư vấn',
                $b['service'] ?? '',
                $b['preferred_date'] ?? '',
                $b['preferred_time'] ?? '',
                $b['asset_range'] ?? '',
                $b['consult_format'] ?? '',
            ]
        );
        Response::json(['ok' => true, 'id' => $id], 201);
    }
}
