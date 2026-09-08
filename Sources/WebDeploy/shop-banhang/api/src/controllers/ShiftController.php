<?php
declare(strict_types=1);

class ShiftController {
    public function __construct(private Database $db) {}

    private function stats(int $shiftId): array {
        $orders = $this->db->query("SELECT * FROM orders WHERE shift_id = ?", [$shiftId]);
        $totalRevenue = array_sum(array_map(fn($o) => (float)$o['total'], $orders));
        $cashRevenue = array_sum(array_map(fn($o) => (float)$o['total'], array_filter($orders, fn($o) => $o['payment_method'] === 'cash')));
        return ['order_count' => count($orders), 'total_revenue' => $totalRevenue, 'cash_revenue' => $cashRevenue];
    }

    // GET /shifts/current — ca đang mở của CHÍNH người dùng đang đăng nhập
    public function current(array $p): void {
        Auth::require();
        $userId = Auth::user()['id'];
        $shift = $this->db->queryOne("SELECT * FROM shifts WHERE user_id = ? AND status = 'open' ORDER BY id DESC LIMIT 1", [$userId]);
        if (!$shift) { Response::json(null); return; }
        $shift['stats'] = $this->stats((int)$shift['id']);
        Response::json($shift);
    }

    public function open(array $p): void {
        Auth::require();
        $userId = Auth::user()['id'];
        $b = bodyJson();
        $cash = $b['opening_cash'] ?? null;
        if ($cash === null || !is_numeric($cash) || (float)$cash < 0) {
            Response::error('Tiền mặt đầu ca không hợp lệ.'); return;
        }
        $existing = $this->db->queryOne("SELECT id FROM shifts WHERE user_id = ? AND status = 'open'", [$userId]);
        if ($existing) { Response::error('Đã có ca đang mở, vui lòng đóng ca hiện tại trước.'); return; }
        $id = $this->db->execute(
            "INSERT INTO shifts (user_id, opened_at, opening_cash, status) VALUES (?, ?, ?, 'open')",
            [$userId, date('Y-m-d H:i:s'), (float)$cash]
        );
        Response::json(['id' => $id], 201);
    }

    public function close(array $p): void {
        Auth::require();
        $userId = Auth::user()['id'];
        $b = bodyJson();
        $countedRaw = $b['closing_cash_counted'] ?? null;
        if ($countedRaw === null || $countedRaw === '' || !is_numeric($countedRaw) || (float)$countedRaw < 0) {
            Response::error('Vui lòng nhập số tiền mặt đếm thực tế hợp lệ (>= 0).'); return;
        }
        $shift = $this->db->queryOne("SELECT * FROM shifts WHERE user_id = ? AND status = 'open' ORDER BY id DESC LIMIT 1", [$userId]);
        if (!$shift) { Response::error('Không có ca nào đang mở.', 404); return; }

        $counted = (float)$countedRaw;
        $stats = $this->stats((int)$shift['id']);
        $expected = (float)$shift['opening_cash'] + $stats['cash_revenue'];
        $difference = $counted - $expected;

        $this->db->execute(
            "UPDATE shifts SET closed_at = ?, closing_cash_counted = ?, closing_cash_expected = ?, difference = ?, status = 'closed' WHERE id = ?",
            [date('Y-m-d H:i:s'), $counted, $expected, $difference, $shift['id']]
        );
        Response::json(['ok' => true, 'difference' => $difference, 'closing_cash_expected' => $expected]);
    }
}
