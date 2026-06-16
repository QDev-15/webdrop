<?php
declare(strict_types=1);

class ReservationController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $status = $_GET['status'] ?? '';
        $sql = "SELECT * FROM reservations";
        $params = [];
        if ($status) {
            $sql .= " WHERE status=?";
            $params[] = $status;
        }
        $sql .= " ORDER BY created_at DESC";
        Response::json($this->db->query($sql, $params));
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name']) || empty($b['phone']) || empty($b['date']) || empty($b['time'])) {
            Response::error('Vui lòng điền đầy đủ thông tin đặt bàn.');
            return;
        }
        $id = $this->db->execute(
            "INSERT INTO reservations (name, phone, email, date, time, guests, area, note, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                trim($b['name']),
                trim($b['phone']),
                trim($b['email'] ?? ''),
                trim($b['date']),
                trim($b['time']),
                (int)($b['guests'] ?? 2),
                trim($b['area'] ?? ''),
                trim($b['note'] ?? ''),
                $b['status'] ?? 'pending',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $allowed = ['pending', 'confirmed', 'cancelled'];
        $status = in_array($b['status'] ?? '', $allowed) ? $b['status'] : 'pending';
        $this->db->execute(
            "UPDATE reservations SET name=?, phone=?, email=?, date=?, time=?, guests=?, area=?, note=?, status=? WHERE id=?",
            [
                $b['name'] ?? '',
                $b['phone'] ?? '',
                $b['email'] ?? '',
                $b['date'] ?? '',
                $b['time'] ?? '',
                (int)($b['guests'] ?? 2),
                $b['area'] ?? '',
                $b['note'] ?? '',
                $status,
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM reservations WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
