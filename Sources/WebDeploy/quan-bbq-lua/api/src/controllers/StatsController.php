<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $totalMenuItems    = (int)$this->db->queryOne("SELECT COUNT(*) as c FROM menu_items")['c'];
        $totalMenuCats     = (int)$this->db->queryOne("SELECT COUNT(*) as c FROM menu_categories")['c'];
        $totalReservations = (int)$this->db->queryOne("SELECT COUNT(*) as c FROM reservations")['c'];
        $pendingReservations = (int)$this->db->queryOne("SELECT COUNT(*) as c FROM reservations WHERE status = 'pending'")['c'];
        $confirmedReservations = (int)$this->db->queryOne("SELECT COUNT(*) as c FROM reservations WHERE status = 'confirmed'")['c'];
        $totalContacts     = (int)$this->db->queryOne("SELECT COUNT(*) as c FROM contacts")['c'];
        $newContacts       = (int)$this->db->queryOne("SELECT COUNT(*) as c FROM contacts WHERE status = 'new'")['c'];
        $totalGallery      = (int)$this->db->queryOne("SELECT COUNT(*) as c FROM gallery_items")['c'];
        $totalTestimonials = (int)$this->db->queryOne("SELECT COUNT(*) as c FROM testimonials")['c'];

        $recentReservations = $this->db->query(
            "SELECT name, phone, date, time, guests, table_type, status, created_at FROM reservations ORDER BY created_at DESC LIMIT 5"
        );

        Response::json([
            'menu_items'             => $totalMenuItems,
            'menu_categories'        => $totalMenuCats,
            'reservations'           => $totalReservations,
            'pending_reservations'   => $pendingReservations,
            'confirmed_reservations' => $confirmedReservations,
            'contacts'               => $totalContacts,
            'new_contacts'           => $newContacts,
            'gallery_items'          => $totalGallery,
            'testimonials'           => $totalTestimonials,
            'recent_reservations'    => $recentReservations,
        ]);
    }
}
