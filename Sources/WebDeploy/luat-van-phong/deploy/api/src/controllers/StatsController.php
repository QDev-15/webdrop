<?php

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $stats = [
            'contacts'      => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts"),
            'new_contacts'  => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status = 'new'"),
            'consultations' => (int)$this->db->scalar("SELECT COUNT(*) FROM consultations"),
            'new_consults'  => (int)$this->db->scalar("SELECT COUNT(*) FROM consultations WHERE status = 'new'"),
            'lawyers'       => (int)$this->db->scalar("SELECT COUNT(*) FROM lawyers WHERE status = 'published'"),
            'cases'         => (int)$this->db->scalar("SELECT COUNT(*) FROM cases WHERE status = 'published'"),
            'services'      => (int)$this->db->scalar("SELECT COUNT(*) FROM services WHERE status = 'published'"),
            'testimonials'  => (int)$this->db->scalar("SELECT COUNT(*) FROM testimonials WHERE status = 'published'"),
        ];
        Response::json($stats);
    }
}
