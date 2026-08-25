<?php
declare(strict_types=1);

class PaymentPhaseController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json($this->db->query("SELECT * FROM payment_phases ORDER BY sort_order, id"));
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM payment_phases WHERE id = ?", [$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['phase'])) { Response::error('Tên đợt thanh toán là bắt buộc.'); return; }
        $id = $this->db->execute(
            "INSERT INTO payment_phases (phase, percent, milestone, sort_order) VALUES (?, ?, ?, ?)",
            [$b['phase'], (float)($b['percent'] ?? 0), $b['milestone'] ?? '', (int)($b['sort_order'] ?? 0)]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['phase'])) { Response::error('Tên đợt thanh toán là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE payment_phases SET phase=?, percent=?, milestone=?, sort_order=? WHERE id=?",
            [$b['phase'], (float)($b['percent'] ?? 0), $b['milestone'] ?? '', (int)($b['sort_order'] ?? 0), $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM payment_phases WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
