<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $stats = [
            'bookings'       => $this->db->count('SELECT COUNT(*) FROM bookings'),
            'new_bookings'   => $this->db->count("SELECT COUNT(*) FROM bookings WHERE status = 'new'"),
            'services'       => $this->db->count('SELECT COUNT(*) FROM services WHERE is_active = 1'),
            'team_members'   => $this->db->count('SELECT COUNT(*) FROM team_members WHERE is_active = 1'),
            'testimonials'   => $this->db->count('SELECT COUNT(*) FROM testimonials WHERE is_active = 1'),
            'contacts'       => $this->db->count('SELECT COUNT(*) FROM contacts'),
            'new_contacts'   => $this->db->count("SELECT COUNT(*) FROM contacts WHERE status = 'new'"),
            'recent_bookings'=> $this->db->query(
                "SELECT id, name, phone, appt_date, appt_time, status, created_at FROM bookings ORDER BY created_at DESC LIMIT 5"
            ),
            'recent_contacts'=> $this->db->query(
                "SELECT id, name, phone, subject, status, created_at FROM contacts ORDER BY created_at DESC LIMIT 5"
            ),
        ];
        Response::json($stats);
    }
}
