<?php

class StatsController {
    private Database $db;
    public function __construct(Database $db) { $this->db = $db; }

    public function index(array $p): void {
        Auth::require();
        Response::json([
            'contacts'      => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts"),
            'new_contacts'  => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status='new'"),
            'demo_requests' => (int)$this->db->scalar("SELECT COUNT(*) FROM demo_requests"),
            'new_demos'     => (int)$this->db->scalar("SELECT COUNT(*) FROM demo_requests WHERE status='new'"),
            'features'      => (int)$this->db->scalar("SELECT COUNT(*) FROM features"),
            'pricing_plans' => (int)$this->db->scalar("SELECT COUNT(*) FROM pricing_plans"),
            'testimonials'  => (int)$this->db->scalar("SELECT COUNT(*) FROM testimonials"),
            'faqs'          => (int)$this->db->scalar("SELECT COUNT(*) FROM faqs"),
            'hero_slides'   => (int)$this->db->scalar("SELECT COUNT(*) FROM hero_slides"),
        ]);
    }
}
