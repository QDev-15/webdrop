<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json([
            'contacts'     => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts"),
            'new_contacts' => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status='new'"),
            'services'     => (int)$this->db->scalar("SELECT COUNT(*) FROM services WHERE status='published'"),
            'team_members' => (int)$this->db->scalar("SELECT COUNT(*) FROM team_members WHERE status='published'"),
            'testimonials' => (int)$this->db->scalar("SELECT COUNT(*) FROM testimonials WHERE status='published'"),
            'hero_slides'  => (int)$this->db->scalar("SELECT COUNT(*) FROM hero_slides WHERE status='published'"),
            'recent_contacts' => $this->db->query(
                "SELECT id, name, phone, email, service, status, created_at FROM contacts ORDER BY created_at DESC LIMIT 5"
            ),
        ]);
    }
}
