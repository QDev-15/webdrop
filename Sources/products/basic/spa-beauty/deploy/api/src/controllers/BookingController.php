<?php
declare(strict_types=1);

class BookingController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM bookings ORDER BY created_at DESC");
        Response::json($rows);
    }

    public function update(array $params): void {
        Auth::require();
        $id     = (int)($params['id'] ?? 0);
        $body   = bodyJson();
        $status = trim($body['status'] ?? 'new');
        $allowed = ['new', 'confirmed', 'done', 'cancelled'];
        if (!in_array($status, $allowed)) { Response::error('Trạng thái không hợp lệ.', 422); return; }

        $this->db->execute("UPDATE bookings SET status=? WHERE id=?", [$status, $id]);
        Response::json(['message' => 'Đã cập nhật trạng thái.']);
    }

    public function destroy(array $params): void {
        Auth::require();
        $id = (int)($params['id'] ?? 0);
        $this->db->execute("DELETE FROM bookings WHERE id=?", [$id]);
        Response::json(['message' => 'Đã xóa.']);
    }
}
