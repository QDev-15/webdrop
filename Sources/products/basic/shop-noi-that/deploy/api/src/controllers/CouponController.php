<?php
declare(strict_types=1);

// Admin: CRUD mã giảm giá hiển thị ở trang khuyen-mai.html — chỉ "sao chép mã" (đúng hành vi
// template gốc), KHÔNG áp dụng trừ tiền tự động ở checkout.
class CouponController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM coupons ORDER BY sort_order ASC, created_at DESC");
        Response::json($rows);
    }

    public function show(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM coupons WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy mã giảm giá', 404); return; }
        Response::json($row);
    }

    public function store(): void {
        Auth::require();
        $data       = bodyJson();
        $code       = strtoupper(trim($data['code'] ?? ''));
        $description = trim($data['description'] ?? '');
        $sortOrder  = (int)($data['sort_order'] ?? 0);
        $active     = (int)($data['active'] ?? 1);

        if (!$code) { Response::error('Mã giảm giá không được để trống', 422); return; }
        if ($this->db->queryOne("SELECT id FROM coupons WHERE code = ?", [$code])) {
            Response::error('Mã giảm giá này đã tồn tại', 422); return;
        }

        $id = $this->db->execute(
            "INSERT INTO coupons (code, description, sort_order, active) VALUES (?, ?, ?, ?)",
            [$code, $description, $sortOrder, $active]
        );
        $row = $this->db->queryOne("SELECT * FROM coupons WHERE id = ?", [$id]);
        Response::json($row, 201);
    }

    public function update(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM coupons WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy mã giảm giá', 404); return; }

        $data        = bodyJson();
        $code        = isset($data['code']) ? strtoupper(trim($data['code'])) : $row['code'];
        $description = trim($data['description'] ?? $row['description']);
        $sortOrder   = (int)($data['sort_order'] ?? $row['sort_order']);
        $active      = array_key_exists('active', $data) ? (int)$data['active'] : (int)$row['active'];

        if (!$code) { Response::error('Mã giảm giá không được để trống', 422); return; }
        $dup = $this->db->queryOne("SELECT id FROM coupons WHERE code = ? AND id != ?", [$code, $id]);
        if ($dup) { Response::error('Mã giảm giá này đã tồn tại', 422); return; }

        $this->db->execute(
            "UPDATE coupons SET code = ?, description = ?, sort_order = ?, active = ? WHERE id = ?",
            [$code, $description, $sortOrder, $active, $id]
        );
        $row = $this->db->queryOne("SELECT * FROM coupons WHERE id = ?", [$id]);
        Response::json($row);
    }

    public function destroy(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT id FROM coupons WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy mã giảm giá', 404); return; }
        $this->db->execute("DELETE FROM coupons WHERE id = ?", [$id]);
        Response::json(['message' => 'Đã xóa mã giảm giá']);
    }
}
