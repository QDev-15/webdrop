<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json([
            'contacts'     => (int) $this->db->scalar("SELECT COUNT(*) FROM contacts"),
            'new_contacts' => (int) $this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status='new'"),
            'services'     => (int) $this->db->scalar("SELECT COUNT(*) FROM services"),
            'projects'     => (int) $this->db->scalar("SELECT COUNT(*) FROM projects"),
            'team'         => (int) $this->db->scalar("SELECT COUNT(*) FROM team_members"),
            'testimonials' => (int) $this->db->scalar("SELECT COUNT(*) FROM testimonials"),
            'slides'       => (int) $this->db->scalar("SELECT COUNT(*) FROM hero_slides"),
        ]);
    }
}
