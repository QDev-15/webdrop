<?php
declare(strict_types=1);

class BookingController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $items = $this->db->query('SELECT * FROM bookings ORDER BY created_at DESC');
        Response::json($items);
    }

    public function show(int $id): void {
        Auth::require();
        $row = $this->db->queryOne('SELECT * FROM bookings WHERE id = ?', [$id]);
        if (!$row) { Response::error('Khong tim thay lich hen.', 404); }
        Response::json($row);
    }

    public function update(int $id): void {
        Auth::require();
        $d = bodyJson();
        $status = trim($d['status'] ?? 'new');
        $this->db->execute('UPDATE bookings SET status=? WHERE id=?', [$status, $id]);
        $row = $this->db->queryOne('SELECT * FROM bookings WHERE id = ?', [$id]);
        Response::json($row);
    }

    public function destroy(int $id): void {
        Auth::require();
        $this->db->execute('DELETE FROM bookings WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }
}
