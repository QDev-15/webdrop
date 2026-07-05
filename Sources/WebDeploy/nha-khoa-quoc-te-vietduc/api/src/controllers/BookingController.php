<?php
declare(strict_types=1);

class BookingController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT id, fullname, phone, email, service, branch,
                    pref_date, pref_time, note, status, created_at
             FROM bookings ORDER BY created_at DESC"
        );
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne(
            "SELECT id, fullname, phone, email, service, branch,
                    pref_date, pref_time, note, status, created_at
             FROM bookings WHERE id = ?",
            [(int)$p[1]]
        );
        if (!$row) { Response::error('Khong tim thay.', 404); return; }
        Response::json($row);
    }

    public function update(array $p): void {
        Auth::require();
        $b      = bodyJson();
        $id     = (int)$p[1];
        $status = in_array($b['status'] ?? '', ['new', 'confirmed', 'cancelled'])
                  ? $b['status']
                  : 'new';
        $this->db->execute(
            "UPDATE bookings SET status = ? WHERE id = ?",
            [$status, $id]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM bookings WHERE id = ?", [(int)$p[1]]);
        Response::json(['ok' => true]);
    }
}
