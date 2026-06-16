<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $stats = [
            'reservations_total'   => $this->db->scalar("SELECT COUNT(*) FROM reservations"),
            'reservations_pending' => $this->db->scalar("SELECT COUNT(*) FROM reservations WHERE status = 'pending'"),
            'reservations_today'   => $this->db->scalar("SELECT COUNT(*) FROM reservations WHERE date = date('now')"),
            'contacts_new'         => $this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status = 'new'"),
            'contacts_total'       => $this->db->scalar("SELECT COUNT(*) FROM contacts"),
            'menu_items'           => $this->db->scalar("SELECT COUNT(*) FROM menu_items WHERE status = 'published'"),
            'menu_categories'      => $this->db->scalar("SELECT COUNT(*) FROM menu_categories WHERE status = 'published'"),
            'gallery_items'        => $this->db->scalar("SELECT COUNT(*) FROM gallery_items WHERE status = 'published'"),
            'testimonials'         => $this->db->scalar("SELECT COUNT(*) FROM testimonials WHERE status = 'published'"),
            'hero_slides'          => $this->db->scalar("SELECT COUNT(*) FROM hero_slides WHERE status = 'published'"),
        ];
        Response::json($stats);
    }
}
