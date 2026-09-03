<?php
declare(strict_types=1);

// Admin: CRUD mã khuyến mãi — hiển thị dạng voucher-card thông tin tại trang /khuyen-mai.
// Đây KHÔNG phải hệ thống áp dụng mã tự động (template gốc không có ô nhập mã ở gio-hang.html) —
// chỉ phục vụ quản lý nội dung hiển thị (đúng rule 4: mọi text hiển thị phải quản lý được qua admin).
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
        if (!$row) { Response::error('Không tìm thấy mã khuyến mãi', 404); return; }
        Response::json($row);
    }

    public function store(): void {
        Auth::require();
        $data = bodyJson();
        $code = strtoupper(trim($data['code'] ?? ''));
        if (!$code) { Response::error('Mã khuyến mãi không được để trống', 422); return; }
        if ($this->db->queryOne("SELECT id FROM coupons WHERE code = ?", [$code])) {
            Response::error('Mã khuyến mãi này đã tồn tại', 422);
            return;
        }

        $id = $this->db->execute(
            "INSERT INTO coupons (code, description, sort_order) VALUES (?, ?, ?)",
            [$code, trim($data['description'] ?? ''), (int)($data['sort_order'] ?? 0)]
        );
        $row = $this->db->queryOne("SELECT * FROM coupons WHERE id = ?", [$id]);
        Response::json($row, 201);
    }

    public function update(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM coupons WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy mã khuyến mãi', 404); return; }

        $data = bodyJson();
        $code = isset($data['code']) ? strtoupper(trim($data['code'])) : $row['code'];
        if ($code === '') { Response::error('Mã khuyến mãi không được để trống', 422); return; }
        $dup = $this->db->queryOne("SELECT id FROM coupons WHERE code = ? AND id != ?", [$code, $id]);
        if ($dup) { Response::error('Mã khuyến mãi này đã tồn tại', 422); return; }

        $this->db->execute(
            "UPDATE coupons SET code = ?, description = ?, sort_order = ? WHERE id = ?",
            [$code, trim($data['description'] ?? $row['description']), (int)($data['sort_order'] ?? $row['sort_order']), $id]
        );
        $row = $this->db->queryOne("SELECT * FROM coupons WHERE id = ?", [$id]);
        Response::json($row);
    }

    public function destroy(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT id FROM coupons WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy mã khuyến mãi', 404); return; }
        $this->db->execute("DELETE FROM coupons WHERE id = ?", [$id]);
        Response::json(['message' => 'Đã xóa mã khuyến mãi']);
    }
}
