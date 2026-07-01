<?php
declare(strict_types=1);

class BookingController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $status = $_GET['status'] ?? '';
        if ($status && in_array($status, ['new','confirmed','completed','cancelled'])) {
            $rows = $this->db->query("SELECT * FROM bookings WHERE status = ? ORDER BY created_at DESC", [$status]);
        } else {
            $rows = $this->db->query("SELECT * FROM bookings ORDER BY created_at DESC");
        }
        Response::json($rows);
    }

    public function store(array $p): void {
        $b = bodyJson();
        $fullName = trim($b['full_name'] ?? $b['fullName'] ?? '');
        $phone    = trim($b['phone'] ?? '');
        if (!$fullName || !$phone) {
            Response::error('Họ tên và số điện thoại không được để trống.'); return;
        }
        $this->db->execute(
            "INSERT INTO bookings (full_name, phone, email, service_name, doctor_pref, pref_date, pref_time, message)
             VALUES (?,?,?,?,?,?,?,?)",
            [
                $fullName, $phone,
                trim($b['email'] ?? ''),
                trim($b['service_name'] ?? $b['service'] ?? ''),
                trim($b['doctor_pref'] ?? $b['doctor'] ?? ''),
                trim($b['pref_date'] ?? $b['prefDate'] ?? ''),
                trim($b['pref_time'] ?? $b['prefTime'] ?? ''),
                trim($b['message'] ?? ''),
            ]
        );
        Response::json(['ok' => true, 'message' => 'Đặt lịch thành công! Chúng tôi sẽ liên hệ xác nhận trong vòng 30 phút.'], 201);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM bookings WHERE id = ?", [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function update(array $p): void {
        Auth::require();
        $b  = bodyJson();
        $id = (int)$p['id'];
        $row = $this->db->queryOne("SELECT * FROM bookings WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }

        $allowed = ['full_name','phone','email','service_name','doctor_pref','pref_date','pref_time','message','status','note'];
        $sets = []; $vals = [];
        foreach ($allowed as $k) {
            if (array_key_exists($k, $b)) {
                $sets[] = "$k = ?";
                $vals[] = is_string($b[$k]) ? trim($b[$k]) : $b[$k];
            }
        }
        if ($sets) {
            $vals[] = $id;
            $this->db->execute("UPDATE bookings SET " . implode(', ', $sets) . " WHERE id = ?", $vals);
        }
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
