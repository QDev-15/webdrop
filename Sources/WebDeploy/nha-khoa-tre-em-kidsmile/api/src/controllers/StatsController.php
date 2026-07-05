<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $bookings     = (int)$this->db->queryOne("SELECT COUNT(*) AS c FROM bookings")['c'];
        $newBookings  = (int)$this->db->queryOne("SELECT COUNT(*) AS c FROM bookings WHERE status = 'new'")['c'];
        $contacts     = (int)$this->db->queryOne("SELECT COUNT(*) AS c FROM contacts")['c'];
        $newContacts  = (int)$this->db->queryOne("SELECT COUNT(*) AS c FROM contacts WHERE status = 'new'")['c'];
        $doctors      = (int)$this->db->queryOne("SELECT COUNT(*) AS c FROM doctors WHERE is_active = 1")['c'];
        $services     = (int)$this->db->queryOne("SELECT COUNT(*) AS c FROM services")['c'];
        $testimonials = (int)$this->db->queryOne("SELECT COUNT(*) AS c FROM testimonials")['c'];
        $articles     = (int)$this->db->queryOne("SELECT COUNT(*) AS c FROM articles WHERE status = 'published'")['c'];

        Response::json([
            'bookings'     => $bookings,
            'new_bookings' => $newBookings,
            'contacts'     => $contacts,
            'new_contacts' => $newContacts,
            'doctors'      => $doctors,
            'services'     => $services,
            'testimonials' => $testimonials,
            'articles'     => $articles,
        ]);
    }
}
