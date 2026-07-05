<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $services     = $this->db->queryOne("SELECT COUNT(*) AS cnt FROM services");
        $doctors      = $this->db->queryOne("SELECT COUNT(*) AS cnt FROM doctors");
        $bookings     = $this->db->queryOne("SELECT COUNT(*) AS cnt FROM bookings");
        $bookingsNew  = $this->db->queryOne("SELECT COUNT(*) AS cnt FROM bookings WHERE status = 'new'");
        $testimonials = $this->db->queryOne("SELECT COUNT(*) AS cnt FROM testimonials");
        $contacts     = $this->db->queryOne("SELECT COUNT(*) AS cnt FROM contacts");
        $contactsNew  = $this->db->queryOne("SELECT COUNT(*) AS cnt FROM contacts WHERE status = 'new'");

        Response::json([
            'services'      => (int)($services['cnt']    ?? 0),
            'doctors'       => (int)($doctors['cnt']     ?? 0),
            'bookings'      => (int)($bookings['cnt']    ?? 0),
            'bookings_new'  => (int)($bookingsNew['cnt'] ?? 0),
            'testimonials'  => (int)($testimonials['cnt'] ?? 0),
            'contacts'      => (int)($contacts['cnt']    ?? 0),
            'contacts_new'  => (int)($contactsNew['cnt'] ?? 0),
        ]);
    }
}
