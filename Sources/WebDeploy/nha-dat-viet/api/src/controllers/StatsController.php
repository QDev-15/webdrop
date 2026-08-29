<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json([
            'properties'       => (int)$this->db->scalar("SELECT COUNT(*) FROM properties"),
            'properties_ban'   => (int)$this->db->scalar("SELECT COUNT(*) FROM properties WHERE listing_type = 'ban'"),
            'properties_thue'  => (int)$this->db->scalar("SELECT COUNT(*) FROM properties WHERE listing_type = 'cho-thue'"),
            'agents'           => (int)$this->db->scalar("SELECT COUNT(*) FROM agents"),
            'projects'         => (int)$this->db->scalar("SELECT COUNT(*) FROM projects"),
            'faqs'             => (int)$this->db->scalar("SELECT COUNT(*) FROM faqs"),
            'testimonials'     => (int)$this->db->scalar("SELECT COUNT(*) FROM testimonials"),
            'contacts_total'   => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts"),
            'contacts_new'     => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status = 'new'"),
            'hero_slides'      => (int)$this->db->scalar("SELECT COUNT(*) FROM hero_slides"),
            'recent_contacts'  => $this->db->query("SELECT id, name, phone, subject, status, created_at FROM contacts ORDER BY created_at DESC LIMIT 5"),
        ]);
    }
}
