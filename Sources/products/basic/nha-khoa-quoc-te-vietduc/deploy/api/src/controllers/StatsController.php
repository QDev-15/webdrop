<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $bookings    = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM bookings")['c'] ?? 0);
        $newBookings = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM bookings WHERE status = 'new'")['c'] ?? 0);
        $contacts    = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM contacts")['c'] ?? 0);
        $newContacts = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM contacts WHERE status = 'new'")['c'] ?? 0);
        $doctors     = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM doctors WHERE is_active = 1")['c'] ?? 0);
        $services    = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM services WHERE is_active = 1")['c'] ?? 0);

        Response::json([
            'bookings'     => $bookings,
            'new_bookings' => $newBookings,
            'contacts'     => $contacts,
            'new_contacts' => $newContacts,
            'doctors'      => $doctors,
            'services'     => $services,
        ]);
    }
}
