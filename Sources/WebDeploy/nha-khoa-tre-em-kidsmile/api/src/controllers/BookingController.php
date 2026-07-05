<?php
declare(strict_types=1);

class BookingController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT * FROM bookings ORDER BY created_at DESC"
        );
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM bookings WHERE id = ?", [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $id = (int)$p['id'];
        $row = $this->db->queryOne("SELECT id FROM bookings WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        $allowed = ['status', 'note'];
        foreach ($allowed as $field) {
            if (isset($b[$field])) {
                $this->db->execute("UPDATE bookings SET $field = ? WHERE id = ?", [$b[$field], $id]);
            }
        }
        Response::json($this->db->queryOne("SELECT * FROM bookings WHERE id = ?", [$id]));
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM bookings WHERE id = ?", [(int)$p['id']]);
        Response::json(['ok' => true]);
    }
}
