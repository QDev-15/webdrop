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
        if (!$row) { Response::error('Không tìm thấy phiếu giảm giá', 404); return; }
        Response::json($row);
    }

    public function store(): void {
        Auth::require();
        $data = bodyJson();
        $code = strtoupper(trim($data['code'] ?? ''));
        if (!$code) { Response::error('Vui lòng nhập mã giảm giá', 422); return; }
        try {
            $id = $this->db->execute(
                "INSERT INTO coupons (code, type, value, min_order, max_uses, expires_at, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                    $code,
                    in_array($data['type'] ?? '', ['percent', 'fixed']) ? $data['type'] : 'percent',
                    (int)($data['value'] ?? 0),
                    (int)($data['min_order'] ?? 0),
                    (int)($data['max_uses'] ?? 0),
                    ($data['expires_at'] ?? '') ?: null,
                    (int)($data['is_active'] ?? 1),
                ]
            );
        } catch (\PDOException $e) {
            if (str_contains($e->getMessage(), 'UNIQUE')) {
                Response::error('Mã giảm giá đã tồn tại', 409); return;
            }
            throw $e;
        }
        Response::json($this->db->queryOne("SELECT * FROM coupons WHERE id = ?", [$id]), 201);
    }

    public function update(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT id FROM coupons WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy phiếu giảm giá', 404); return; }
        $data = bodyJson();
        $code = strtoupper(trim($data['code'] ?? ''));
        if (!$code) { Response::error('Vui lòng nhập mã giảm giá', 422); return; }
        try {
            $this->db->execute(
                "UPDATE coupons SET code=?, type=?, value=?, min_order=?, max_uses=?, expires_at=?, is_active=? WHERE id=?",
                [
                    $code,
                    in_array($data['type'] ?? '', ['percent', 'fixed']) ? $data['type'] : 'percent',
                    (int)($data['value'] ?? 0),
                    (int)($data['min_order'] ?? 0),
                    (int)($data['max_uses'] ?? 0),
                    ($data['expires_at'] ?? '') ?: null,
                    (int)($data['is_active'] ?? 1),
                    $id,
                ]
            );
        } catch (\PDOException $e) {
            if (str_contains($e->getMessage(), 'UNIQUE')) {
                Response::error('Mã giảm giá đã tồn tại', 409); return;
            }
            throw $e;
        }
        Response::json($this->db->queryOne("SELECT * FROM coupons WHERE id = ?", [$id]));
    }

    public function destroy(array $params): void {
        Auth::require();
        $id  = (int)($params['id'] ?? 0);
        $row = $this->db->queryOne("SELECT id FROM coupons WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy phiếu giảm giá', 404); return; }
        $this->db->execute("DELETE FROM coupons WHERE id = ?", [$id]);
        Response::json(['success' => true]);
    }
}
