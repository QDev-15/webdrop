<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();

        $bookings    = $this->db->queryOne("SELECT COUNT(*) AS cnt FROM bookings")['cnt'] ?? 0;
        $newBookings = $this->db->queryOne("SELECT COUNT(*) AS cnt FROM bookings WHERE status = 'new'")['cnt'] ?? 0;
        $contacts    = $this->db->queryOne("SELECT COUNT(*) AS cnt FROM contacts")['cnt'] ?? 0;
        $newContacts = $this->db->queryOne("SELECT COUNT(*) AS cnt FROM contacts WHERE status = 'new'")['cnt'] ?? 0;
        $services    = $this->db->queryOne("SELECT COUNT(*) AS cnt FROM services WHERE status = 'published'")['cnt'] ?? 0;
        $team        = $this->db->queryOne("SELECT COUNT(*) AS cnt FROM team WHERE status = 'published'")['cnt'] ?? 0;
        $testimonials= $this->db->queryOne("SELECT COUNT(*) AS cnt FROM testimonials WHERE status = 'published'")['cnt'] ?? 0;

        $recentBookings = $this->db->query(
            "SELECT id, full_name, phone, service_name, status, created_at
             FROM bookings ORDER BY created_at DESC LIMIT 5"
        );

        Response::json([
            'bookings'        => (int) $bookings,
            'new_bookings'    => (int) $newBookings,
            'contacts'        => (int) $contacts,
            'new_contacts'    => (int) $newContacts,
            'services'        => (int) $services,
            'team'            => (int) $team,
            'testimonials'    => (int) $testimonials,
            'recent_bookings' => $recentBookings,
        ]);
    }
}
