<?php
declare(strict_types=1);

class ReservationController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $status = $_GET['status'] ?? '';
        if ($status && in_array($status, ['pending','confirmed','cancelled'], true)) {
            $items = $this->db->query(
                "SELECT * FROM reservations WHERE status = ? ORDER BY created_at DESC",
                [$status]
            );
        } else {
            $items = $this->db->query(
                "SELECT * FROM reservations ORDER BY created_at DESC"
            );
        }
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM reservations WHERE id = ?", [$p['id']]);
        if (!$item) { Response::error('Khong tim thay.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name']) || empty($b['phone']) || empty($b['date']) || empty($b['time'])) {
            Response::error('Vui long dien day du thong tin bat buoc.'); return;
        }
        $id = $this->db->execute(
            "INSERT INTO reservations (name, phone, email, date, time, guests, menu_pkg, note, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $b['name'], $b['phone'], $b['email'] ?? '',
                $b['date'], $b['time'], (int)($b['guests'] ?? 2),
                $b['menu_pkg'] ?? '', $b['note'] ?? '',
                $b['status'] ?? 'pending',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (!empty($b['status'])) {
            if (!in_array($b['status'], ['pending','confirmed','cancelled'], true)) {
                Response::error('Trang thai khong hop le.'); return;
            }
            // Update status only if that's what was sent
            if (count($b) === 1) {
                $this->db->execute(
                    "UPDATE reservations SET status = ? WHERE id = ?",
                    [$b['status'], $p['id']]
                );
                Response::json(['ok' => true]);
                return;
            }
        }
        $this->db->execute(
            "UPDATE reservations SET name=?, phone=?, email=?, date=?, time=?, guests=?, menu_pkg=?, note=?, status=? WHERE id=?",
            [
                $b['name'] ?? '', $b['phone'] ?? '', $b['email'] ?? '',
                $b['date'] ?? '', $b['time'] ?? '', (int)($b['guests'] ?? 2),
                $b['menu_pkg'] ?? '', $b['note'] ?? '',
                $b['status'] ?? 'pending',
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM reservations WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
