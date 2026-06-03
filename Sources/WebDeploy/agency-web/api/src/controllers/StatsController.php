<?php
declare(strict_types=1);

class StatsController
{
    public function __construct(private Database $db) {}

    public function index(array $p): void
    {
        Auth::require();

        $stats = [
            'contacts_total'  => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts"),
            'contacts_new'    => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status='new'"),
            'services_total'  => (int)$this->db->scalar("SELECT COUNT(*) FROM services"),
            'projects_total'  => (int)$this->db->scalar("SELECT COUNT(*) FROM projects"),
            'team_total'      => (int)$this->db->scalar("SELECT COUNT(*) FROM team_members"),
            'testimonials_total' => (int)$this->db->scalar("SELECT COUNT(*) FROM testimonials"),
            'posts_total'     => (int)$this->db->scalar("SELECT COUNT(*) FROM posts"),
            'posts_published' => (int)$this->db->scalar("SELECT COUNT(*) FROM posts WHERE status='published'"),
            'slides_total'    => (int)$this->db->scalar("SELECT COUNT(*) FROM hero_slides"),
            'recent_contacts' => $this->db->query(
                "SELECT id, name, phone, email, subject, service, status, created_at
                 FROM contacts ORDER BY created_at DESC LIMIT 5"
            ),
        ];

        Response::json($stats);
    }
}
