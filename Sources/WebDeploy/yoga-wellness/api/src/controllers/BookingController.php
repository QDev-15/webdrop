<?php
declare(strict_types=1);

class BookingController {
  public function __construct(private Database $db) {}

  public function index(): void {
    Auth::require();
    $bookings = $this->db->queryAll(
      "SELECT b.*, s.name as service_name FROM bookings b LEFT JOIN services s ON b.service_id = s.id ORDER BY b.created_at DESC"
    );
    Response::json($bookings);
  }

  public function destroy(array $p): void {
    Auth::require();
    $id = (int)($p['id'] ?? 0);
    if (!$id) { Response::error('Invalid ID'); return; }
    $this->db->execute("DELETE FROM bookings WHERE id=?", [$id]);
    Response::json(['ok' => true]);
  }
}
