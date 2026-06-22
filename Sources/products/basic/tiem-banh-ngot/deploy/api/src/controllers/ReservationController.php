<?php
declare(strict_types=1);

// Note: This controller handles the bakery orders table
class ReservationController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $status = $_GET['status'] ?? '';
        $allowed = ['pending','confirmed','in_progress','ready','completed','cancelled'];
        if ($status && in_array($status, $allowed, true)) {
            $items = $this->db->query(
                "SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC",
                [$status]
            );
        } else {
            $items = $this->db->query("SELECT * FROM orders ORDER BY created_at DESC");
        }
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM orders WHERE id = ?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name']) || empty($b['phone'])) {
            Response::error('Họ tên và số điện thoại là bắt buộc.'); return;
        }
        $id = $this->db->execute(
            "INSERT INTO orders (name, phone, email, cake_type, cake_size, flavors, decoration_style, color_theme, cake_message, special_request, pickup_date, delivery_type, delivery_address, status, note)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $b['name'],
                $b['phone'],
                $b['email'] ?? '',
                $b['cake_type'] ?? '',
                $b['cake_size'] ?? '',
                $b['flavors'] ?? '',
                $b['decoration_style'] ?? '',
                $b['color_theme'] ?? '',
                $b['cake_message'] ?? '',
                $b['special_request'] ?? '',
                $b['pickup_date'] ?? '',
                $b['delivery_type'] ?? 'pickup',
                $b['delivery_address'] ?? '',
                $b['status'] ?? 'pending',
                $b['note'] ?? '',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $allowed = ['pending','confirmed','in_progress','ready','completed','cancelled'];
        $status = $b['status'] ?? 'pending';
        if (!in_array($status, $allowed, true)) {
            Response::error('Trạng thái không hợp lệ.'); return;
        }
        $this->db->execute(
            "UPDATE orders SET name=?, phone=?, email=?, cake_type=?, cake_size=?, flavors=?, decoration_style=?, color_theme=?, cake_message=?, special_request=?, pickup_date=?, delivery_type=?, delivery_address=?, status=?, note=? WHERE id=?",
            [
                $b['name'] ?? '',
                $b['phone'] ?? '',
                $b['email'] ?? '',
                $b['cake_type'] ?? '',
                $b['cake_size'] ?? '',
                $b['flavors'] ?? '',
                $b['decoration_style'] ?? '',
                $b['color_theme'] ?? '',
                $b['cake_message'] ?? '',
                $b['special_request'] ?? '',
                $b['pickup_date'] ?? '',
                $b['delivery_type'] ?? 'pickup',
                $b['delivery_address'] ?? '',
                $status,
                $b['note'] ?? '',
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM orders WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
