<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();

        $totalBookings = (int)$this->db->query("SELECT COUNT(*) AS c FROM bookings")[0]['c'];
        $newBookings   = (int)$this->db->query("SELECT COUNT(*) AS c FROM bookings WHERE status = 'new'")[0]['c'];
        $totalContacts = (int)$this->db->query("SELECT COUNT(*) AS c FROM contacts")[0]['c'];
        $newContacts   = (int)$this->db->query("SELECT COUNT(*) AS c FROM contacts WHERE status = 'new'")[0]['c'];
        $totalDoctors  = (int)$this->db->query("SELECT COUNT(*) AS c FROM doctors WHERE is_active = 1")[0]['c'];
        $totalServices = (int)$this->db->query("SELECT COUNT(*) AS c FROM services")[0]['c'];

        Response::json([
            'total_bookings' => $totalBookings,
            'new_bookings'   => $newBookings,
            'total_contacts' => $totalContacts,
            'new_contacts'   => $newContacts,
            'total_doctors'  => $totalDoctors,
            'total_services' => $totalServices,
        ]);
    }
}
