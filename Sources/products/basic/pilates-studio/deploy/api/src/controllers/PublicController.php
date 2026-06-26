<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $params): void {
        $rows = $this->db->query("SELECT key, value FROM settings");
        $out = [];
        foreach ($rows as $r) $out[$r['key']] = $r['value'];
        Response::json($out);
    }

    public function heroSlides(array $params): void {
        $rows = $this->db->query(
            "SELECT * FROM hero_slides WHERE is_active = 1 ORDER BY sort_order ASC"
        );
        Response::json($rows);
    }

    public function services(array $params): void {
        $rows = $this->db->query(
            "SELECT s.*, sc.name AS category_name
             FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             ORDER BY s.sort_order ASC"
        );
        Response::json($rows);
    }

    public function testimonials(array $params): void {
        $rows = $this->db->query(
            "SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC"
        );
        Response::json($rows);
    }

    public function team(array $params): void {
        $rows = $this->db->query(
            "SELECT * FROM team WHERE is_active = 1 ORDER BY sort_order ASC"
        );
        Response::json($rows);
    }
}
