<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $totalServices     = (int)$this->db->query("SELECT COUNT(*) as c FROM services")[0]['c'];
        $totalBookings     = (int)$this->db->query("SELECT COUNT(*) as c FROM bookings")[0]['c'];
        $newBookings       = (int)$this->db->query("SELECT COUNT(*) as c FROM bookings WHERE status = 'new'")[0]['c'];
        $totalContacts     = (int)$this->db->query("SELECT COUNT(*) as c FROM contacts")[0]['c'];
        $newContacts       = (int)$this->db->query("SELECT COUNT(*) as c FROM contacts WHERE status = 'new'")[0]['c'];
        $totalTestimonials = (int)$this->db->query("SELECT COUNT(*) as c FROM testimonials")[0]['c'];
        $totalTherapists   = (int)$this->db->query("SELECT COUNT(*) as c FROM therapists")[0]['c'];

        Response::json([
            'total_services'      => $totalServices,
            'total_bookings'      => $totalBookings,
            'new_bookings'        => $newBookings,
            'total_contacts'      => $totalContacts,
            'new_contacts'        => $newContacts,
            'total_testimonials'  => $totalTestimonials,
            'total_therapists'    => $totalTherapists,
        ]);
    }
}
