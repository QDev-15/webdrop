<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $stats = [
            'slides_total'       => (int)$this->db->scalar("SELECT COUNT(*) FROM hero_slides"),
            'menu_items_total'   => (int)$this->db->scalar("SELECT COUNT(*) FROM menu_items"),
            'menu_categories_total' => (int)$this->db->scalar("SELECT COUNT(*) FROM menu_categories"),
            'gallery_total'      => (int)$this->db->scalar("SELECT COUNT(*) FROM gallery_items"),
            'testimonials_total' => (int)$this->db->scalar("SELECT COUNT(*) FROM testimonials"),
            'contacts_total'     => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts"),
            'contacts_new'       => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status = 'new'"),
            'recent_contacts'    => $this->db->query("SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5"),
        ];
        Response::json($stats);
    }
}
