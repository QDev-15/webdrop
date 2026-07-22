<?php
declare(strict_types=1);

class CouponController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM coupons ORDER BY created_at DESC");
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
        $data      = bodyJson();
        $code      = strtoupper(trim($data['code'] ?? ''));
        $type      = trim($data['type'] ?? 'percent');
        $value     = (int)($data['value'] ?? 0);
        $minOrder  = (int)($data['min_order'] ?? 0);
        $maxUses   = isset($data['max_uses']) && $data['max_uses'] !== '' ? (int)$data['max_uses'] : null;
        $expiresAt = trim($data['expires_at'] ?? '') ?: null;
        $isActive  = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1;

        if (!$code) { Response::error('Mã giảm giá không được để trống', 422); return; }
        if (!in_array($type, ['percent', 'fixed'], true)) { Response::error('Loại giảm giá không hợp lệ', 422); return; }
        if ($value <= 0) { Response::error('Giá trị giảm giá phải lớn hơn 0', 422); return; }
        if ($type === 'percent' && $value > 100) { Response::error('Giảm giá theo phần trăm không được vượt quá 100%', 422); return; }
        if ($this->db->queryOne("SELECT id FROM coupons WHERE code = ?", [$code])) {
            Response::error('Mã giảm giá đã tồn tại', 409);
            return;
        }

        $id = $this->db->execute(
            "INSERT INTO coupons (code, type, value, min_order, max_uses, expires_at, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            [$code, $type, $value, $minOrder, $maxUses, $expiresAt, $isActive]
        );
        $row = $this->db->queryOne("SELECT * FROM coupons WHERE id = ?", [$id]);
        Response::json($row, 201);
    }

    public function update(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM coupons WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy mã giảm giá', 404); return; }

        $data      = bodyJson();
        $type      = trim($data['type'] ?? $row['type']);
        $value     = (int)($data['value'] ?? $row['value']);
        $minOrder  = (int)($data['min_order'] ?? $row['min_order']);
        $maxUses   = isset($data['max_uses']) ? ($data['max_uses'] !== '' ? (int)$data['max_uses'] : null) : $row['max_uses'];
        $expiresAt = array_key_exists('expires_at', $data) ? (trim((string)$data['expires_at']) ?: null) : $row['expires_at'];
        $isActive  = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : (int)$row['is_active'];

        if (!in_array($type, ['percent', 'fixed'], true)) { Response::error('Loại giảm giá không hợp lệ', 422); return; }
        if ($value <= 0) { Response::error('Giá trị giảm giá phải lớn hơn 0', 422); return; }
        if ($type === 'percent' && $value > 100) { Response::error('Giảm giá theo phần trăm không được vượt quá 100%', 422); return; }

        $this->db->execute(
            "UPDATE coupons SET type=?, value=?, min_order=?, max_uses=?, expires_at=?, is_active=? WHERE id=?",
            [$type, $value, $minOrder, $maxUses, $expiresAt, $isActive, $id]
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
