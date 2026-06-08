<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json([
            'projects'     => (int)$this->db->scalar("SELECT COUNT(*) FROM projects"),
            'services'     => (int)$this->db->scalar("SELECT COUNT(*) FROM services"),
            'team_members' => (int)$this->db->scalar("SELECT COUNT(*) FROM team_members"),
            'testimonials' => (int)$this->db->scalar("SELECT COUNT(*) FROM testimonials"),
            'contacts'     => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts"),
            'new_contacts' => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status='new'"),
            'hero_slides'  => (int)$this->db->scalar("SELECT COUNT(*) FROM hero_slides"),
        ]);
    }
}
