<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();

        $totalMenuItems    = (int)$this->db->scalar("SELECT COUNT(*) FROM menu_items WHERE status = 'published'");
        $totalReservations = (int)$this->db->scalar("SELECT COUNT(*) FROM reservations");
        $pendingRes        = (int)$this->db->scalar("SELECT COUNT(*) FROM reservations WHERE status = 'pending'");
        $confirmedRes      = (int)$this->db->scalar("SELECT COUNT(*) FROM reservations WHERE status = 'confirmed'");
        $totalContacts     = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts");
        $newContacts       = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status = 'new'");
        $totalGallery      = (int)$this->db->scalar("SELECT COUNT(*) FROM gallery_items WHERE status = 'published'");
        $totalTestimonials = (int)$this->db->scalar("SELECT COUNT(*) FROM testimonials WHERE status = 'published'");

        // Recent reservations
        $recentReservations = $this->db->query(
            "SELECT id, name, phone, date, time, guests, status, created_at
             FROM reservations ORDER BY created_at DESC LIMIT 5"
        );

        // Recent contacts
        $recentContacts = $this->db->query(
            "SELECT id, name, email, phone, subject, status, created_at
             FROM contacts ORDER BY created_at DESC LIMIT 5"
        );

        Response::json([
            'total_menu_items'    => $totalMenuItems,
            'total_reservations'  => $totalReservations,
            'pending_reservations'=> $pendingRes,
            'confirmed_reservations' => $confirmedRes,
            'total_contacts'      => $totalContacts,
            'new_contacts'        => $newContacts,
            'total_gallery'       => $totalGallery,
            'total_testimonials'  => $totalTestimonials,
            'recent_reservations' => $recentReservations,
            'recent_contacts'     => $recentContacts,
        ]);
    }
}
