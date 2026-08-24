<?php
declare(strict_types=1);

class PricingController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM pricing_plans ORDER BY sort_order, id");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM pricing_plans WHERE id=?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name']) || empty($b['price'])) { Response::error('Tên gói và giá không được để trống.'); return; }
        $id = $this->db->execute(
            "INSERT INTO pricing_plans (name, description, price, unit, features, is_featured, badge_text, cta_text, cta_link, sort_order, status) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            [
                $b['name'], $b['description'] ?? '', $b['price'], $b['unit'] ?? '/ tranh', $b['features'] ?? '',
                (int)($b['is_featured'] ?? 0), $b['badge_text'] ?? 'Phổ biến nhất', $b['cta_text'] ?? 'Chọn gói này', $b['cta_link'] ?? '/lien-he',
                (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name']) || empty($b['price'])) { Response::error('Tên gói và giá không được để trống.'); return; }
        $this->db->execute(
            "UPDATE pricing_plans SET name=?, description=?, price=?, unit=?, features=?, is_featured=?, badge_text=?, cta_text=?, cta_link=?, sort_order=?, status=? WHERE id=?",
            [
                $b['name'], $b['description'] ?? '', $b['price'], $b['unit'] ?? '/ tranh', $b['features'] ?? '',
                (int)($b['is_featured'] ?? 0), $b['badge_text'] ?? 'Phổ biến nhất', $b['cta_text'] ?? 'Chọn gói này', $b['cta_link'] ?? '/lien-he',
                (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published', $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM pricing_plans WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
