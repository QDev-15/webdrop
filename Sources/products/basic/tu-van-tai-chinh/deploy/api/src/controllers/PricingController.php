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
        $pl = $this->db->queryOne("SELECT * FROM pricing_plans WHERE id=?", [$p['id']]);
        if (!$pl) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($pl);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name  = trim($b['name'] ?? '');
        $price = trim($b['price'] ?? '');
        if (!$name || !$price) { Response::error('Tên gói và giá không được để trống.'); return; }
        $id = $this->db->execute(
            "INSERT INTO pricing_plans (name, price, description, features, is_featured, cta_text, cta_link, sort_order, status) VALUES (?,?,?,?,?,?,?,?,?)",
            [$name, $price, $b['description'] ?? '', $b['features'] ?? '', $b['is_featured'] ?? 0, $b['cta_text'] ?? 'Nhận báo giá', $b['cta_link'] ?? '/lien-he', $b['sort_order'] ?? 0, $b['status'] ?? 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name  = trim($b['name'] ?? '');
        $price = trim($b['price'] ?? '');
        if (!$name || !$price) { Response::error('Tên gói và giá không được để trống.'); return; }
        $this->db->execute(
            "UPDATE pricing_plans SET name=?, price=?, description=?, features=?, is_featured=?, cta_text=?, cta_link=?, sort_order=?, status=? WHERE id=?",
            [$name, $price, $b['description'] ?? '', $b['features'] ?? '', $b['is_featured'] ?? 0, $b['cta_text'] ?? 'Nhận báo giá', $b['cta_link'] ?? '/lien-he', $b['sort_order'] ?? 0, $b['status'] ?? 'published', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM pricing_plans WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
