<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $projects      = $this->db->scalar("SELECT COUNT(*) FROM projects WHERE status = 'published'") ?? 0;
        $skills        = $this->db->scalar("SELECT COUNT(*) FROM skills WHERE status = 'published'") ?? 0;
        $testimonials  = $this->db->scalar("SELECT COUNT(*) FROM testimonials WHERE status = 'published'") ?? 0;
        $contacts      = $this->db->scalar("SELECT COUNT(*) FROM contacts") ?? 0;
        $newContacts   = $this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status = 'new'") ?? 0;
        Response::json([
            'projects'     => $projects,
            'skills'       => $skills,
            'testimonials' => $testimonials,
            'contacts'     => $contacts,
            'new_contacts' => $newContacts,
        ]);
    }
}
