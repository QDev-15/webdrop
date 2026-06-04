<?php
declare(strict_types=1);

class StatsController
{
    public function __construct(private Database $db) {}

    public function index(array $p): void
    {
        Auth::require();

        $totalServices    = $this->db->scalar("SELECT COUNT(*) FROM services") ?? 0;
        $totalProjects    = $this->db->scalar("SELECT COUNT(*) FROM projects") ?? 0;
        $totalTestimonials = $this->db->scalar("SELECT COUNT(*) FROM testimonials") ?? 0;
        $totalContacts    = $this->db->scalar("SELECT COUNT(*) FROM contacts") ?? 0;
        $newContacts      = $this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status='new'") ?? 0;

        // Liên hệ 30 ngày gần nhất
        $recentContacts = $this->db->query(
            "SELECT id, name, phone, construction_type, status, created_at
             FROM contacts ORDER BY created_at DESC LIMIT 10"
        );

        Response::json([
            'total_services'     => (int)$totalServices,
            'total_projects'     => (int)$totalProjects,
            'total_testimonials' => (int)$totalTestimonials,
            'total_contacts'     => (int)$totalContacts,
            'new_contacts'       => (int)$newContacts,
            'recent_contacts'    => $recentContacts,
        ]);
    }
}
