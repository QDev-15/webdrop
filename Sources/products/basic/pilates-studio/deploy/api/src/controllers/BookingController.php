<?php
declare(strict_types=1);

class BookingController {
    // GET /bookings (admin only)
    public static function index(array $params): void {
        Auth::require();
        $db = Database::getInstance();
        $rows = $db->query(
            "SELECT * FROM bookings ORDER BY created_at DESC"
        );
        Response::json($rows);
    }

    // POST /bookings (public — from registration form)
    public static function store(array $params): void {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        $name  = trim($body['name']  ?? '');
        $phone = trim($body['phone'] ?? '');
        if (!$name || !$phone) {
            Response::error('Họ tên và số điện thoại không được trống.');
            return;
        }

        $db = Database::getInstance();
        $id = $db->execute(
            "INSERT INTO bookings (name,phone,email,birth_year,class_type,level,package,goal,preferred_days,preferred_time,start_date,health_conditions,medications,notes)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
                $name,
                $phone,
                $body['email']             ?? '',
                $body['birth_year']        ?? '',
                $body['class_type']        ?? '',
                $body['level']             ?? '',
                $body['package']           ?? '',
                $body['goal']              ?? '',
                $body['preferred_days']    ?? '',
                $body['preferred_time']    ?? '',
                $body['start_date']        ?? '',
                $body['health_conditions'] ?? '',
                $body['medications']       ?? '',
                $body['notes']             ?? '',
            ]
        );

        Response::json(['success' => true, 'id' => $id, 'message' => 'Đăng ký thành công! Chúng tôi sẽ liên hệ trong vòng 2 giờ.'], 201);
    }

    // GET /bookings/:id
    public static function show(array $params): void {
        Auth::require();
        $db  = Database::getInstance();
        $row = $db->queryOne("SELECT * FROM bookings WHERE id = ?", [(int)$params['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    // POST /bookings/:id/update
    public static function update(array $params): void {
        Auth::require();
        $db   = Database::getInstance();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $id   = (int)$params['id'];

        $row = $db->queryOne("SELECT id FROM bookings WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }

        $allowed = ['status', 'notes'];
        $sets = []; $vals = [];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $body)) { $sets[] = "$f = ?"; $vals[] = $body[$f]; }
        }
        if (!$sets) { Response::error('Không có dữ liệu cập nhật.'); return; }
        $vals[] = $id;
        $db->run("UPDATE bookings SET " . implode(', ', $sets) . " WHERE id = ?", $vals);
        Response::json($db->queryOne("SELECT * FROM bookings WHERE id = ?", [$id]));
    }

    // POST /bookings/:id/delete
    public static function destroy(array $params): void {
        Auth::require();
        $db  = Database::getInstance();
        $id  = (int)$params['id'];
        $row = $db->queryOne("SELECT id FROM bookings WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        $db->run("DELETE FROM bookings WHERE id = ?", [$id]);
        Response::json(['success' => true]);
    }
}
