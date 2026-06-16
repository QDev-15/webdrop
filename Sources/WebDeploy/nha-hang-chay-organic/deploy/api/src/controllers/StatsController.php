<?php
declare(strict_types=1);

class StatsController
{
    public function __construct(private Database $db) {}

    public function index(array $p): void
    {
        Auth::require();

        $totalMenuItems  = (int)$this->db->scalar('SELECT COUNT(*) FROM menu_items');
        $totalCategories = (int)$this->db->scalar('SELECT COUNT(*) FROM menu_categories');
        $totalReservations = (int)$this->db->scalar('SELECT COUNT(*) FROM reservations');
        $pendingReservations = (int)$this->db->scalar("SELECT COUNT(*) FROM reservations WHERE status = 'pending'");
        $totalContacts   = (int)$this->db->scalar('SELECT COUNT(*) FROM contacts');
        $newContacts     = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status = 'new'");
        $totalTestimonials = (int)$this->db->scalar('SELECT COUNT(*) FROM testimonials');
        $totalGallery    = (int)$this->db->scalar('SELECT COUNT(*) FROM gallery_items');
        $totalSlides     = (int)$this->db->scalar('SELECT COUNT(*) FROM hero_slides');

        $recentReservations = $this->db->query(
            "SELECT * FROM reservations ORDER BY created_at DESC LIMIT 5"
        );
        $recentContacts = $this->db->query(
            "SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5"
        );

        Response::json([
            'menu_items'           => $totalMenuItems,
            'menu_categories'      => $totalCategories,
            'reservations'         => $totalReservations,
            'pending_reservations' => $pendingReservations,
            'contacts'             => $totalContacts,
            'new_contacts'         => $newContacts,
            'testimonials'         => $totalTestimonials,
            'gallery'              => $totalGallery,
            'slides'               => $totalSlides,
            'recent_reservations'  => $recentReservations,
            'recent_contacts'      => $recentContacts,
        ]);
    }
}
