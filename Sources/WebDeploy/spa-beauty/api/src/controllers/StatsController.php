<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();

        $services     = (int)$this->db->queryOne("SELECT COUNT(*) AS c FROM services")['c'];
        $bookings     = (int)$this->db->queryOne("SELECT COUNT(*) AS c FROM bookings")['c'];
        $newBookings  = (int)$this->db->queryOne("SELECT COUNT(*) AS c FROM bookings WHERE status = 'new'")['c'];
        $contacts     = (int)$this->db->queryOne("SELECT COUNT(*) AS c FROM contacts")['c'];
        $newContacts  = (int)$this->db->queryOne("SELECT COUNT(*) AS c FROM contacts WHERE status = 'new'")['c'];
        $team         = (int)$this->db->queryOne("SELECT COUNT(*) AS c FROM team_members")['c'];
        $testimonials = (int)$this->db->queryOne("SELECT COUNT(*) AS c FROM testimonials")['c'];
        $gallery      = (int)$this->db->queryOne("SELECT COUNT(*) AS c FROM gallery_items")['c'];

        Response::json([
            'services'     => $services,
            'bookings'     => $bookings,
            'new_bookings' => $newBookings,
            'contacts'     => $contacts,
            'new_contacts' => $newContacts,
            'team'         => $team,
            'testimonials' => $testimonials,
            'gallery'      => $gallery,
        ]);
    }
}
