<?php
declare(strict_types=1);

class StatsController {
    // GET /stats
    public static function index(array $params): void {
        Auth::require();
        $db = Database::getInstance();

        $totalBookings   = (int) $db->pdo()->query("SELECT COUNT(*) FROM bookings")->fetchColumn();
        $newBookings     = (int) $db->pdo()->query("SELECT COUNT(*) FROM bookings WHERE status = 'new'")->fetchColumn();
        $totalContacts   = (int) $db->pdo()->query("SELECT COUNT(*) FROM contacts")->fetchColumn();
        $newContacts     = (int) $db->pdo()->query("SELECT COUNT(*) FROM contacts WHERE status = 'new'")->fetchColumn();
        $totalServices   = (int) $db->pdo()->query("SELECT COUNT(*) FROM services")->fetchColumn();
        $totalTestimonials = (int) $db->pdo()->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
        $totalTeam       = (int) $db->pdo()->query("SELECT COUNT(*) FROM team WHERE is_active = 1")->fetchColumn();

        // Recent bookings
        $recentBookings = $db->query(
            "SELECT id, name, phone, class_type, status, created_at FROM bookings ORDER BY created_at DESC LIMIT 5"
        );

        Response::json([
            'total_bookings'     => $totalBookings,
            'new_bookings'       => $newBookings,
            'total_contacts'     => $totalContacts,
            'new_contacts'       => $newContacts,
            'total_services'     => $totalServices,
            'total_testimonials' => $totalTestimonials,
            'total_team'         => $totalTeam,
            'recent_bookings'    => $recentBookings,
        ]);
    }
}
