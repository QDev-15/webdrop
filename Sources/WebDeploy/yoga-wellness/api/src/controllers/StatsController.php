<?php
declare(strict_types=1);

class StatsController {
  public function __construct(private Database $db) {}

  public function index(): void {
    Auth::require();
    $serviceCount = (int)$this->db->query("SELECT COUNT(*) FROM services")->fetchColumn();
    $bookingCount = (int)$this->db->query("SELECT COUNT(*) FROM bookings")->fetchColumn();
    $teamCount = (int)$this->db->query("SELECT COUNT(*) FROM team_members")->fetchColumn();
    $testimonialCount = (int)$this->db->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
    $contactCount = (int)$this->db->query("SELECT COUNT(*) FROM contacts WHERE status='new'")->fetchColumn();

    Response::json([
      'services' => $serviceCount,
      'bookings' => $bookingCount,
      'team' => $teamCount,
      'testimonials' => $testimonialCount,
      'newContacts' => $contactCount,
    ]);
  }
}
