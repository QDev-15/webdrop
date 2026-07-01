<?php
declare(strict_types=1);

class BookingController {
    public function __construct(private Database $db) {}

    /** GET /bookings — admin only */
    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT * FROM bookings ORDER BY created_at DESC"
        );
        Response::json($rows);
    }

    /** POST /bookings — public form submit (no auth required) */
    public function store(array $p): void {
        $b = bodyJson();

        $fullName = trim($b['full_name'] ?? '');
        $phone    = trim($b['phone'] ?? '');

        if (!$fullName) {
            Response::error('Họ tên là bắt buộc.');
            return;
        }
        if (!$phone) {
            Response::error('Số điện thoại là bắt buộc.');
            return;
        }

        $this->db->execute(
            "INSERT INTO bookings
                (full_name, phone, email, package_selected, guests, pref_date, pref_time, special_requests, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')",
            [
                $fullName,
                $phone,
                trim($b['email'] ?? ''),
                trim($b['package_selected'] ?? ''),
                max(1, (int)($b['guests'] ?? 1)),
                trim($b['pref_date'] ?? ''),
                trim($b['pref_time'] ?? ''),
                trim($b['special_requests'] ?? ''),
            ]
        );

        Response::json([
            'ok'      => true,
            'message' => 'Đặt lịch thành công! Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.',
        ], 201);
    }

    /** POST /bookings/:id/update — update status only, admin only */
    public function update(array $p): void {
        Auth::require();
        $b      = bodyJson();
        $status = $b['status'] ?? 'new';

        $allowed = ['new', 'confirmed', 'completed', 'cancelled'];
        if (!in_array($status, $allowed, true)) {
            Response::error('Trạng thái không hợp lệ.');
            return;
        }

        $this->db->execute(
            "UPDATE bookings SET status = ? WHERE id = ?",
            [$status, $p['id']]
        );
        Response::json(['ok' => true]);
    }

    /** POST /bookings/:id/delete — admin only */
    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM bookings WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
