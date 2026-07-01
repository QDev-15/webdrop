<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    /** GET /public/settings — flat {key: value} */
    public function settings(array $p): void {
        $rows   = $this->db->query("SELECT key, value FROM settings");
        $result = [];
        foreach ($rows as $r) {
            $result[$r['key']] = $r['value'];
        }
        Response::json($result);
    }

    /** GET /public/services — all services with category_name joined */
    public function services(array $p): void {
        $rows = $this->db->query(
            "SELECT s.*, sc.name AS category_name
             FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             ORDER BY s.category_id, s.sort_order, s.id"
        );
        Response::json($rows);
    }

    /** GET /public/services/featured — featured services */
    public function servicesFeatured(array $p): void {
        $rows = $this->db->query(
            "SELECT s.*, sc.name AS category_name
             FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             WHERE s.is_featured = 1
             ORDER BY s.sort_order, s.id"
        );
        Response::json($rows);
    }

    /** GET /public/service-categories — all categories */
    public function serviceCategories(array $p): void {
        $rows = $this->db->query(
            "SELECT * FROM service_categories ORDER BY sort_order, id"
        );
        Response::json($rows);
    }

    /** GET /public/testimonials — published testimonials */
    public function testimonials(array $p): void {
        $rows = $this->db->query(
            "SELECT * FROM testimonials
             WHERE is_published = 1
             ORDER BY sort_order, id"
        );
        Response::json($rows);
    }

    /** GET /public/team — published team members */
    public function team(array $p): void {
        $rows = $this->db->query(
            "SELECT * FROM team
             WHERE is_published = 1
             ORDER BY sort_order, id"
        );
        Response::json($rows);
    }

    /** GET /public/gallery — published gallery items */
    public function gallery(array $p): void {
        $rows = $this->db->query(
            "SELECT * FROM gallery_items
             WHERE is_published = 1
             ORDER BY sort_order, id"
        );
        Response::json($rows);
    }

    /** GET /public/hero-slides — published hero slides */
    public function heroSlides(array $p): void {
        $rows = $this->db->query(
            "SELECT * FROM hero_slides
             WHERE status = 'published'
             ORDER BY sort_order, id"
        );
        Response::json($rows);
    }
}
