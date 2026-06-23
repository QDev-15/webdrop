<?php
declare(strict_types=1);

class BookingController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query(
            'SELECT * FROM bookings ORDER BY created_at DESC'
        );
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne('SELECT * FROM bookings WHERE id=?', [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function update(array $p): void {
        Auth::require();
        $row = $this->db->queryOne('SELECT id FROM bookings WHERE id=?', [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }

        $body   = bodyJson();
        $status = trim($body['status'] ?? 'pending');
        $allowed = ['pending','confirmed','cancelled','done'];
        if (!in_array($status, $allowed, true)) {
            Response::error('Trạng thái không hợp lệ.', 422);
            return;
        }

        $this->db->execute(
            'UPDATE bookings SET status=? WHERE id=?',
            [$status, (int)$p['id']]
        );
        Response::json(['message' => 'Đã cập nhật trạng thái.']);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute('DELETE FROM bookings WHERE id=?', [(int)$p['id']]);
        Response::json(['message' => 'Đã xóa.']);
    }
}
