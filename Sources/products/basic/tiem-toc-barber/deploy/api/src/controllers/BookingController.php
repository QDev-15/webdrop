<?php
declare(strict_types=1);

class BookingController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $status = $_GET['status'] ?? '';
        if ($status && in_array($status, ['new', 'confirmed', 'completed', 'cancelled'], true)) {
            $rows = $this->db->query('SELECT * FROM bookings WHERE status = ? ORDER BY created_at DESC', [$status]);
        } else {
            $rows = $this->db->query('SELECT * FROM bookings ORDER BY created_at DESC');
        }
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne('SELECT * FROM bookings WHERE id = ?', [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $fullName = trim($b['full_name'] ?? '');
        $phone    = trim($b['phone'] ?? '');
        if (!$fullName || !$phone) { Response::error('Họ tên và số điện thoại là bắt buộc.'); return; }
        $id = $this->db->execute(
            'INSERT INTO bookings (full_name, phone, service_name, stylist_pref, pref_date, pref_time, note) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                $fullName, $phone,
                trim($b['service_name'] ?? ''), trim($b['stylist_pref'] ?? ''),
                trim($b['pref_date'] ?? ''), trim($b['pref_time'] ?? ''), trim($b['note'] ?? ''),
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $id = (int)$p['id'];
        $row = $this->db->queryOne('SELECT id FROM bookings WHERE id = ?', [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        $b = bodyJson();

        $allowed = ['full_name', 'phone', 'service_name', 'stylist_pref', 'pref_date', 'pref_time', 'note', 'status'];
        $sets = []; $vals = [];
        foreach ($allowed as $k) {
            if (array_key_exists($k, $b)) {
                $sets[] = "$k = ?";
                $vals[] = is_string($b[$k]) ? trim($b[$k]) : $b[$k];
            }
        }
        if ($sets) {
            $vals[] = $id;
            $this->db->execute('UPDATE bookings SET ' . implode(', ', $sets) . ' WHERE id = ?', $vals);
        }
        Response::json($this->db->queryOne('SELECT * FROM bookings WHERE id = ?', [$id]));
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute('DELETE FROM bookings WHERE id = ?', [(int)$p['id']]);
        Response::json(['ok' => true]);
    }
}
