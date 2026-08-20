<?php
declare(strict_types=1);

class PricingController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $plans = $this->db->query("SELECT * FROM pricing_plans ORDER BY sort_order, id");
        Response::json($plans);
    }

    public function show(array $p): void {
        Auth::require();
        $plan = $this->db->queryOne("SELECT * FROM pricing_plans WHERE id = ?", [$p['id']]);
        if (!$plan) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($plan);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name']) || empty($b['price'])) { Response::error('Tên gói và giá là bắt buộc.'); return; }
        $id = $this->db->execute(
            "INSERT INTO pricing_plans (name, price, description, features, is_featured, cta_text, cta_link, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $b['name'], $b['price'], $b['description'] ?? '', $b['features'] ?? '',
                !empty($b['is_featured']) ? 1 : 0, $b['cta_text'] ?? 'Yêu cầu demo', $b['cta_link'] ?? '/lien-he',
                (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name']) || empty($b['price'])) { Response::error('Tên gói và giá là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE pricing_plans SET name=?, price=?, description=?, features=?, is_featured=?, cta_text=?, cta_link=?, sort_order=?, status=? WHERE id=?",
            [
                $b['name'], $b['price'], $b['description'] ?? '', $b['features'] ?? '',
                !empty($b['is_featured']) ? 1 : 0, $b['cta_text'] ?? 'Yêu cầu demo', $b['cta_link'] ?? '/lien-he',
                (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published', $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM pricing_plans WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
