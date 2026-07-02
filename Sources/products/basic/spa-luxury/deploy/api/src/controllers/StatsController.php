<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    /** GET /stats */
    public function index(array $p): void {
        Auth::require();

        $totalBookings = $this->db->queryOne(
            "SELECT COUNT(*) AS cnt FROM bookings"
        )['cnt'] ?? 0;

        $newBookings = $this->db->queryOne(
            "SELECT COUNT(*) AS cnt FROM bookings WHERE status = 'new'"
        )['cnt'] ?? 0;

        $totalContacts = $this->db->queryOne(
            "SELECT COUNT(*) AS cnt FROM contacts"
        )['cnt'] ?? 0;

        $newContacts = $this->db->queryOne(
            "SELECT COUNT(*) AS cnt FROM contacts WHERE status = 'new'"
        )['cnt'] ?? 0;

        $totalServices = $this->db->queryOne(
            "SELECT COUNT(*) AS cnt FROM services"
        )['cnt'] ?? 0;

        $totalTestimonials = $this->db->queryOne(
            "SELECT COUNT(*) AS cnt FROM testimonials WHERE is_published = 1"
        )['cnt'] ?? 0;

        Response::json([
            'total_bookings'    => (int)$totalBookings,
            'new_bookings'      => (int)$newBookings,
            'total_contacts'    => (int)$totalContacts,
            'new_contacts'      => (int)$newContacts,
            'total_services'    => (int)$totalServices,
            'total_testimonials' => (int)$totalTestimonials,
        ]);
    }
}
