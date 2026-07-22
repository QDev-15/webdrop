<?php
declare(strict_types=1);

class BookingController
{
    public function __construct(private Database $db) {}

    public function index(): void
    {
        Auth::require();
        $rows = $this->db->query(
            "SELECT * FROM bookings ORDER BY created_at DESC"
        );
        Response::json($rows);
    }

    public function update(int $id): void
    {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM bookings WHERE id = ?", [$id]);
        if (!$row) { Response::error('Khong tim thay lich hen.', 404); return; }

        $body   = bodyJson();
        $status = trim($body['status'] ?? $row['status']);
        $note   = trim($body['note']   ?? $row['note']);

        $this->db->execute(
            "UPDATE bookings SET status = ?, note = ? WHERE id = ?",
            [$status, $note, $id]
        );
        $updated = $this->db->queryOne("SELECT * FROM bookings WHERE id = ?", [$id]);
        Response::json($updated);
    }

    public function destroy(int $id): void
    {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM bookings WHERE id = ?", [$id]);
        if (!$row) { Response::error('Khong tim thay lich hen.', 404); return; }
        $this->db->execute("DELETE FROM bookings WHERE id = ?", [$id]);
        Response::json(['message' => 'Da xoa lich hen.']);
    }
}
