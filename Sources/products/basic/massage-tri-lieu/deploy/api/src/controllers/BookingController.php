<?php
declare(strict_types=1);

class BookingController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM bookings ORDER BY created_at DESC");
        Response::json($items);
    }

    public function update(array $p): void {
        Auth::require();
        $id  = (int)($p['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM bookings WHERE id = ?", [$id]);
        if (!$row) { Response::error('Khong tim thay dat lich.', 404); return; }
        $b      = bodyJson();
        $status = trim((string)($b['status'] ?? $row['status']));
        $allowed = ['new', 'confirmed', 'completed', 'cancelled'];
        if (!in_array($status, $allowed, true)) $status = $row['status'];
        $this->db->execute("UPDATE bookings SET status = ? WHERE id = ?", [$status, $id]);
        Response::json($this->db->queryOne("SELECT * FROM bookings WHERE id = ?", [$id]));
    }

    public function destroy(array $p): void {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        if (!$this->db->queryOne("SELECT id FROM bookings WHERE id = ?", [$id])) {
            Response::error('Khong tim thay dat lich.', 404); return;
        }
        $this->db->execute("DELETE FROM bookings WHERE id = ?", [$id]);
        Response::json(['ok' => true]);
    }
}
