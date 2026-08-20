<?php
declare(strict_types=1);

class BookingController {
  public function __construct(private Database $db) {}

  public function index(): void {
    Auth::require();
    $bookings = $this->db->query(
      "SELECT b.*, s.name as service_name FROM bookings b LEFT JOIN services s ON b.service_id = s.id ORDER BY b.created_at DESC"
    );
    Response::json($bookings);
  }

  public function update(array $p): void {
    Auth::require();
    $id = (int)($p['id'] ?? 0);
    if (!$id) { Response::error('Invalid ID'); return; }
    $b = bodyJson();
    $allowed = ['status'];
    $sets = []; $vals = [];
    foreach ($allowed as $f) {
      if (array_key_exists($f, $b)) { $sets[] = "$f = ?"; $vals[] = $b[$f]; }
    }
    if (!$sets) { Response::error('Không có dữ liệu cập nhật.'); return; }
    $vals[] = $id;
    $this->db->execute("UPDATE bookings SET " . implode(', ', $sets) . " WHERE id=?", $vals);
    Response::json(['ok' => true]);
  }

  public function destroy(array $p): void {
    Auth::require();
    $id = (int)($p['id'] ?? 0);
    if (!$id) { Response::error('Invalid ID'); return; }
    $this->db->execute("DELETE FROM bookings WHERE id=?", [$id]);
    Response::json(['ok' => true]);
  }
}
