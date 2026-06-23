<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $totalBookings   = $this->db->count('SELECT COUNT(*) FROM bookings');
        $pendingBookings = $this->db->count("SELECT COUNT(*) FROM bookings WHERE status='pending'");
        $totalContacts   = $this->db->count('SELECT COUNT(*) FROM contacts');
        $newContacts     = $this->db->count("SELECT COUNT(*) FROM contacts WHERE status='new'");
        $totalServices   = $this->db->count('SELECT COUNT(*) FROM services');
        $totalTeam       = $this->db->count('SELECT COUNT(*) FROM team_members');

        $recentBookings = $this->db->query(
            'SELECT id, name, phone, service_group, book_date, book_time, status, created_at
             FROM bookings ORDER BY created_at DESC LIMIT 5'
        );

        Response::json([
            'total_bookings'   => $totalBookings,
            'pending_bookings' => $pendingBookings,
            'total_contacts'   => $totalContacts,
            'new_contacts'     => $newContacts,
            'total_services'   => $totalServices,
            'total_team'       => $totalTeam,
            'recent_bookings'  => $recentBookings,
        ]);
    }
}
