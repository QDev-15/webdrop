<?php
declare(strict_types=1);

class StatsController
{
    public function __construct(private Database $db) {}

    public function index(): void
    {
        Auth::require();

        $totalServices  = $this->db->queryOne("SELECT COUNT(*) AS c FROM services")['c']    ?? 0;
        $totalBookings  = $this->db->queryOne("SELECT COUNT(*) AS c FROM bookings")['c']    ?? 0;
        $newBookings    = $this->db->queryOne("SELECT COUNT(*) AS c FROM bookings WHERE status = 'new'")['c'] ?? 0;
        $totalContacts  = $this->db->queryOne("SELECT COUNT(*) AS c FROM contacts")['c']    ?? 0;
        $newContacts    = $this->db->queryOne("SELECT COUNT(*) AS c FROM contacts WHERE status = 'new'")['c'] ?? 0;
        $totalTeam      = $this->db->queryOne("SELECT COUNT(*) AS c FROM team_members")['c'] ?? 0;
        $totalTesti     = $this->db->queryOne("SELECT COUNT(*) AS c FROM testimonials")['c'] ?? 0;

        $recentBookings = $this->db->query(
            "SELECT id, name, phone, service, date, time_slot, status, created_at
             FROM bookings ORDER BY created_at DESC LIMIT 5"
        );
        $recentContacts = $this->db->query(
            "SELECT id, name, phone, subject, status, created_at
             FROM contacts ORDER BY created_at DESC LIMIT 5"
        );

        Response::json([
            'total_services'   => (int)$totalServices,
            'total_bookings'   => (int)$totalBookings,
            'new_bookings'     => (int)$newBookings,
            'total_contacts'   => (int)$totalContacts,
            'new_contacts'     => (int)$newContacts,
            'total_team'       => (int)$totalTeam,
            'total_testimonials' => (int)$totalTesti,
            'recent_bookings'  => $recentBookings,
            'recent_contacts'  => $recentContacts,
        ]);
    }
}
