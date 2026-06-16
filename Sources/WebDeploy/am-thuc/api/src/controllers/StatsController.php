<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $stats = [
            'total_reservations'   => (int)$this->db->scalar("SELECT COUNT(*) FROM reservations"),
            'pending_reservations' => (int)$this->db->scalar("SELECT COUNT(*) FROM reservations WHERE status='pending'"),
            'total_contacts'       => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts"),
            'new_contacts'         => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status='new'"),
            'total_menu_items'     => (int)$this->db->scalar("SELECT COUNT(*) FROM menu_items WHERE status='published'"),
            'total_gallery'        => (int)$this->db->scalar("SELECT COUNT(*) FROM gallery_items WHERE status='published'"),
            'total_testimonials'   => (int)$this->db->scalar("SELECT COUNT(*) FROM testimonials WHERE status='published'"),
            'recent_reservations'  => $this->db->query(
                "SELECT id, name, phone, date, time, guests, status, created_at
                 FROM reservations ORDER BY created_at DESC LIMIT 5"
            ),
            'recent_contacts' => $this->db->query(
                "SELECT id, name, phone, subject, status, created_at
                 FROM contacts ORDER BY created_at DESC LIMIT 5"
            ),
        ];
        Response::json($stats);
    }
}
