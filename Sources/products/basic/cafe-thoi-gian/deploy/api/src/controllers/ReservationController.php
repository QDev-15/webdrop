<?php
declare(strict_types=1);

class ReservationController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $status = $_GET['status'] ?? '';
        if ($status) {
            $items = $this->db->query("SELECT * FROM reservations WHERE status = ? ORDER BY created_at DESC", [$status]);
        } else {
            $items = $this->db->query("SELECT * FROM reservations ORDER BY created_at DESC");
        }
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM reservations WHERE id = ?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name']) || empty($b['phone'])) {
            Response::error('Họ tên và số điện thoại là bắt buộc.');
            return;
        }
        $id = $this->db->execute(
            "INSERT INTO reservations (name, phone, email, date, time, guests, area, purpose, note, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [$b['name'], $b['phone'], $b['email'] ?? '', $b['date'] ?? '', $b['time'] ?? '', (int)($b['guests'] ?? 2), $b['area'] ?? '', $b['purpose'] ?? '', $b['note'] ?? '', $b['status'] ?? 'pending']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE reservations SET name=?, phone=?, email=?, date=?, time=?, guests=?, area=?, purpose=?, note=?, status=? WHERE id=?",
            [$b['name'] ?? '', $b['phone'] ?? '', $b['email'] ?? '', $b['date'] ?? '', $b['time'] ?? '', (int)($b['guests'] ?? 2), $b['area'] ?? '', $b['purpose'] ?? '', $b['note'] ?? '', $b['status'] ?? 'pending', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM reservations WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
