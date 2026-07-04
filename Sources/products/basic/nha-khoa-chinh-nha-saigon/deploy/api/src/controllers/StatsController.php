<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p = []): void {
        Auth::require();
        $services    = (int)($this->db->queryOne("SELECT COUNT(*) c FROM services")['c'] ?? 0);
        $doctors     = (int)($this->db->queryOne("SELECT COUNT(*) c FROM doctors")['c'] ?? 0);
        $bookings    = (int)($this->db->queryOne("SELECT COUNT(*) c FROM bookings")['c'] ?? 0);
        $newBookings = (int)($this->db->queryOne("SELECT COUNT(*) c FROM bookings WHERE status='new'")['c'] ?? 0);
        $contacts    = (int)($this->db->queryOne("SELECT COUNT(*) c FROM contacts")['c'] ?? 0);
        $newContacts = (int)($this->db->queryOne("SELECT COUNT(*) c FROM contacts WHERE status='new'")['c'] ?? 0);
        $testimonials= (int)($this->db->queryOne("SELECT COUNT(*) c FROM testimonials")['c'] ?? 0);
        Response::json([
            'services'     => $services,
            'doctors'      => $doctors,
            'bookings'     => $bookings,
            'new_bookings' => $newBookings,
            'contacts'     => $contacts,
            'new_contacts' => $newContacts,
            'testimonials' => $testimonials,
        ]);
    }
}
