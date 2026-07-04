<?php
declare(strict_types=1);

class BookingController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $status = $_GET['status'] ?? '';
        $where  = [];
        $params = [];
        if ($status) { $where[] = 'status = ?'; $params[] = $status; }

        $sql = "SELECT * FROM bookings" . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . " ORDER BY created_at DESC";
        Response::json($this->db->query($sql, $params));
    }

    public function store(array $p): void {
        $b = bodyJson();
        $name  = trim($b['full_name'] ?? '');
        $phone = trim($b['phone'] ?? '');
        if (!$name || !$phone) {
            Response::error('Họ tên và số điện thoại không được để trống.'); return;
        }

        $this->db->execute(
            "INSERT INTO bookings (full_name, phone, email, service_name, pref_date, pref_time, message) VALUES (?,?,?,?,?,?,?)",
            [
                $name, $phone,
                trim($b['email'] ?? ''),
                trim($b['service_name'] ?? ''),
                trim($b['pref_date'] ?? ''),
                trim($b['pref_time'] ?? ''),
                trim($b['message'] ?? ''),
            ]
        );
        Response::json(['ok' => true, 'id' => $this->db->lastInsertId()], 201);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM bookings WHERE id = ?", [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function update(array $p): void {
        Auth::require();
        $b   = bodyJson();
        $id  = (int)$p['id'];
        $row = $this->db->queryOne("SELECT * FROM bookings WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }

        $allowedStatus = ['new','confirmed','completed','cancelled'];
        $status = in_array($b['status'] ?? '', $allowedStatus) ? $b['status'] : $row['status'];

        $this->db->execute(
            "UPDATE bookings SET status=?, note=? WHERE id=?",
            [$status, trim($b['note'] ?? $row['note']), $id]
        );
        Response::json($this->db->queryOne("SELECT * FROM bookings WHERE id = ?", [$id]));
    }

    public function destroy(array $p): void {
        Auth::require();
        $id = (int)$p['id'];
        if (!$this->db->queryOne("SELECT id FROM bookings WHERE id = ?", [$id])) {
            Response::error('Không tìm thấy.', 404); return;
        }
        $this->db->execute("DELETE FROM bookings WHERE id = ?", [$id]);
        Response::json(['ok' => true]);
    }
}
