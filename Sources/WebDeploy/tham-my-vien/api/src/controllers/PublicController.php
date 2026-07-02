<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(array $p): void {
        $rows = $this->db->query("SELECT key, value FROM settings");
        $out = [];
        foreach ($rows as $r) $out[$r['key']] = $r['value'];
        Response::json($out);
    }

    public function slides(array $p): void {
        $rows = $this->db->query(
            "SELECT id, title, subtitle, button_text, button_link, image, sort_order
             FROM hero_slides WHERE status = 'published'
             ORDER BY sort_order ASC, id ASC"
        );
        Response::json($rows);
    }

    public function serviceCategories(array $p): void {
        $rows = $this->db->query(
            "SELECT id, name, slug, description, icon_svg, sort_order FROM service_categories ORDER BY sort_order ASC, id ASC"
        );
        Response::json($rows);
    }

    public function services(array $p): void {
        $featured = isset($_GET['featured']) && $_GET['featured'] === '1';
        $catSlug  = $_GET['category'] ?? '';

        $where  = ["s.status = 'published'"];
        $params = [];

        if ($featured) {
            $where[] = 's.is_featured = 1';
        }
        if ($catSlug) {
            $where[] = 'sc.slug = ?';
            $params[] = $catSlug;
        }

        $sql = "SELECT s.id, s.name, s.slug, s.description, s.price_from, s.price_unit,
                       s.duration, s.recovery, s.image, s.is_featured, s.sort_order,
                       sc.id AS category_id, sc.name AS category_name, sc.slug AS category_slug
                FROM services s
                LEFT JOIN service_categories sc ON sc.id = s.category_id
                WHERE " . implode(' AND ', $where) . "
                ORDER BY s.sort_order ASC, s.id ASC";

        Response::json($this->db->query($sql, $params));
    }

    public function team(array $p): void {
        $rows = $this->db->query(
            "SELECT id, name, title, role, specialty, education, experience, cases_count,
                    certifications, image, badge, sort_order
             FROM team WHERE status = 'published'
             ORDER BY sort_order ASC, id ASC"
        );
        Response::json($rows);
    }

    public function testimonials(array $p): void {
        $rows = $this->db->query(
            "SELECT id, customer_name, avatar, service_name, rating, content, sort_order
             FROM testimonials WHERE status = 'published'
             ORDER BY sort_order ASC, id ASC"
        );
        Response::json($rows);
    }
}
