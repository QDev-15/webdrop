<?php
declare(strict_types=1);

class BookingController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $bookings = $this->db->query(
            "SELECT * FROM bookings ORDER BY created_at DESC"
        );
        Response::json($bookings);
    }

    public function show(array $p): void {
        Auth::require();
        $id = (int)$p['id'];
        if (!$id) { Response::error('ID không hợp lệ.', 400); return; }
        $booking = $this->db->queryOne("SELECT * FROM bookings WHERE id = ?", [$id]);
        if (!$booking) { Response::error('Không tìm thấy.', 404); return; }
        // Mark as read when viewed
        if ($booking['status'] === 'new') {
            $this->db->execute("UPDATE bookings SET status = 'read' WHERE id = ?", [$id]);
            $booking['status'] = 'read';
        }
        Response::json($booking);
    }

    public function update(array $p): void {
        Auth::require();
        $b  = bodyJson();
        $id = (int)$p['id'];
        if (!$id) { Response::error('ID không hợp lệ.', 400); return; }
        $allowed = ['status', 'note'];
        $sets = [];
        $vals = [];
        foreach ($allowed as $col) {
            if (array_key_exists($col, $b)) {
                $sets[] = "$col = ?";
                $vals[] = $b[$col];
            }
        }
        if ($sets) {
            $vals[] = $id;
            $this->db->execute("UPDATE bookings SET " . implode(', ', $sets) . " WHERE id = ?", $vals);
        }
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $id = (int)$p['id'];
        if (!$id) { Response::error('ID không hợp lệ.', 400); return; }
        $this->db->execute("DELETE FROM bookings WHERE id = ?", [$id]);
        Response::json(['ok' => true]);
    }
}
