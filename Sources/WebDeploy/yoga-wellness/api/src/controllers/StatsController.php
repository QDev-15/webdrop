<?php
declare(strict_types=1);

class StatsController {
  public function __construct(private Database $db) {}

  public function index(): void {
    Auth::require();
    $serviceCount = (int)$this->db->scalar("SELECT COUNT(*) FROM services");
    $bookingCount = (int)$this->db->scalar("SELECT COUNT(*) FROM bookings");
    $contactCount = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status='new'");

    Response::json([
      'services' => $serviceCount,
      'bookings' => $bookingCount,
      'newContacts' => $contactCount,
    ]);
  }
}
