<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json([
            'unit_types'      => (int)$this->db->scalar("SELECT COUNT(*) FROM unit_types"),
            'unit_available'  => (int)$this->db->scalar("SELECT COUNT(*) FROM unit_types WHERE status = 'con-hang'"),
            'amenities'       => (int)$this->db->scalar("SELECT COUNT(*) FROM amenities"),
            'faqs'            => (int)$this->db->scalar("SELECT COUNT(*) FROM faqs"),
            'testimonials'    => (int)$this->db->scalar("SELECT COUNT(*) FROM testimonials"),
            'contacts_total'  => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts"),
            'contacts_new'    => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status = 'new'"),
            'hero_slides'     => (int)$this->db->scalar("SELECT COUNT(*) FROM hero_slides"),
            'recent_contacts' => $this->db->query("SELECT id, name, phone, subject, status, created_at FROM contacts ORDER BY created_at DESC LIMIT 5"),
        ]);
    }
}
