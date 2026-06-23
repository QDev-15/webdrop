<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();

        $menuItems   = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM menu_items WHERE status='published'")['c'] ?? 0);
        $totalMenuItems = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM menu_items")['c'] ?? 0);
        $reservations   = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM reservations WHERE status='pending'")['c'] ?? 0);
        $totalReservations = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM reservations")['c'] ?? 0);
        $newContacts    = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM contacts WHERE status='new'")['c'] ?? 0);
        $totalContacts  = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM contacts")['c'] ?? 0);
        $galleryCount   = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM gallery_items WHERE status='published'")['c'] ?? 0);
        $testimonials   = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM testimonials WHERE status='published'")['c'] ?? 0);
        $categories     = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM menu_categories WHERE status='published'")['c'] ?? 0);

        $recentReservations = $this->db->query(
            "SELECT name, date, time, guests, status, created_at
             FROM reservations ORDER BY created_at DESC LIMIT 5"
        );
        $recentContacts = $this->db->query(
            "SELECT name, email, created_at, status
             FROM contacts ORDER BY created_at DESC LIMIT 5"
        );

        Response::json([
            'menu_items'        => $menuItems,
            'total_menu_items'  => $totalMenuItems,
            'pending_reservations' => $reservations,
            'total_reservations' => $totalReservations,
            'new_contacts'      => $newContacts,
            'total_contacts'    => $totalContacts,
            'gallery_count'     => $galleryCount,
            'testimonials'      => $testimonials,
            'categories'        => $categories,
            'recent_reservations' => $recentReservations,
            'recent_contacts'   => $recentContacts,
        ]);
    }
}
