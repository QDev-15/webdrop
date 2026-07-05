<?php
declare(strict_types=1);

class BookingController {
    public function __construct(private Database $db) {}

    public function index(array $p = []): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM bookings ORDER BY created_at DESC");
        Response::json($items);
    }

    public function update(array $p = []): void {
        Auth::require();
        $b = bodyJson();
        $allowed = ['new', 'confirmed', 'done', 'cancelled'];
        $status  = in_array($b['status'] ?? '', $allowed) ? $b['status'] : 'new';
        $this->db->execute(
            "UPDATE bookings SET status = ? WHERE id = ?",
            [$status, $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p = []): void {
        Auth::require();
        $this->db->execute("DELETE FROM bookings WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
