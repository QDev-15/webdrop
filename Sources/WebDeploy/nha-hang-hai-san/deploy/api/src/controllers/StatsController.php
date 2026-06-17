<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();

        $totalReservations  = (int)$this->db->scalar("SELECT COUNT(*) FROM reservations");
        $pendingReservations = (int)$this->db->scalar("SELECT COUNT(*) FROM reservations WHERE status='pending'");
        $todayReservations  = (int)$this->db->scalar(
            "SELECT COUNT(*) FROM reservations WHERE date = date('now')"
        );
        $totalContacts  = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts");
        $newContacts    = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status='new'");
        $totalMenuItems = (int)$this->db->scalar("SELECT COUNT(*) FROM menu_items WHERE status='published'");
        $totalSlides    = (int)$this->db->scalar("SELECT COUNT(*) FROM hero_slides WHERE status='published'");
        $totalGallery   = (int)$this->db->scalar("SELECT COUNT(*) FROM gallery_items");

        $recentReservations = $this->db->query(
            "SELECT * FROM reservations ORDER BY created_at DESC LIMIT 5"
        );
        $recentContacts = $this->db->query(
            "SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5"
        );

        Response::json([
            'reservations'        => $totalReservations,
            'pending_reservations' => $pendingReservations,
            'today_reservations'  => $todayReservations,
            'contacts'            => $totalContacts,
            'new_contacts'        => $newContacts,
            'menu_items'          => $totalMenuItems,
            'hero_slides'         => $totalSlides,
            'gallery_items'       => $totalGallery,
            'recent_reservations' => $recentReservations,
            'recent_contacts'     => $recentContacts,
        ]);
    }
}
