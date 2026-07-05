<?php
declare(strict_types=1);

class BookingController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $status = $_GET['status'] ?? null;
        $sql = "SELECT * FROM bookings";
        $params = [];
        if ($status) { $sql .= " WHERE status = ?"; $params[] = $status; }
        $sql .= " ORDER BY created_at DESC";
        Response::json($this->db->query($sql, $params));
    }

    public function show(array $p): void {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        if (!$id) { Response::json(['error' => 'ID không hợp lệ.'], 400); return; }
        $row = $this->db->queryOne("SELECT * FROM bookings WHERE id = ?", [$id]);
        if (!$row) { Response::json(['error' => 'Không tìm thấy.'], 404); return; }
        Response::json($row);
    }

    public function update(array $p): void {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        if (!$id) { Response::json(['error' => 'ID không hợp lệ.'], 400); return; }
        $b = bodyJson();
        $status = trim($b['status'] ?? 'new');
        $allowed = ['new', 'confirmed', 'done', 'cancelled'];
        if (!in_array($status, $allowed, true)) {
            Response::json(['error' => 'Trạng thái không hợp lệ.'], 400); return;
        }
        $this->db->execute("UPDATE bookings SET status = ? WHERE id = ?", [$status, $id]);
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        if (!$id) { Response::json(['error' => 'ID không hợp lệ.'], 400); return; }
        $this->db->execute("DELETE FROM bookings WHERE id = ?", [$id]);
        Response::json(['ok' => true]);
    }
}
