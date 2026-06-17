<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $stats = [
            'reservations_total'   => (int) $this->db->scalar("SELECT COUNT(*) FROM reservations"),
            'reservations_pending' => (int) $this->db->scalar("SELECT COUNT(*) FROM reservations WHERE status = 'pending'"),
            'contacts_total'       => (int) $this->db->scalar("SELECT COUNT(*) FROM contacts"),
            'contacts_new'         => (int) $this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status = 'new'"),
            'menu_items'           => (int) $this->db->scalar("SELECT COUNT(*) FROM menu_items WHERE status = 'published'"),
            'gallery_items'        => (int) $this->db->scalar("SELECT COUNT(*) FROM gallery_items WHERE status = 'published'"),
            'testimonials'         => (int) $this->db->scalar("SELECT COUNT(*) FROM testimonials WHERE status = 'published'"),
            'recent_reservations'  => $this->db->query(
                "SELECT * FROM reservations ORDER BY created_at DESC LIMIT 5"
            ),
            'recent_contacts'      => $this->db->query(
                "SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5"
            ),
        ];
        Response::json($stats);
    }
}
