<?php

class PricingController {
    private Database $db;
    public function __construct(Database $db) { $this->db = $db; }

    private function withItems(array $plans): array {
        foreach ($plans as &$plan) {
            $plan['items'] = $this->db->query(
                "SELECT id, item, available FROM pricing_plan_items WHERE plan_id=? ORDER BY sort_order, id",
                [$plan['id']]
            );
        }
        return $plans;
    }

    public function index(array $p): void {
        Auth::require();
        $plans = $this->db->query("SELECT * FROM pricing_plans ORDER BY sort_order, id");
        Response::json($this->withItems($plans));
    }

    public function show(array $p): void {
        Auth::require();
        $plan = $this->db->queryOne("SELECT * FROM pricing_plans WHERE id=?", [$p['id']]);
        if (!$plan) Response::notFound();
        $plan['items'] = $this->db->query(
            "SELECT id, item, available FROM pricing_plan_items WHERE plan_id=? ORDER BY sort_order, id",
            [$plan['id']]
        );
        Response::json($plan);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) Response::error('Tên gói không được để trống');
        $slug = slugify($b['name']);
        $planId = $this->db->execute(
            "INSERT INTO pricing_plans (name, slug, description, price_monthly, price_yearly, is_featured, is_free, cta_text, cta_link, sort_order, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                strip_tags($b['name']),
                $slug,
                strip_tags($b['description']  ?? ''),
                (float)($b['price_monthly']   ?? 0),
                (float)($b['price_yearly']    ?? 0),
                (int)($b['is_featured']       ?? 0),
                (int)($b['is_free']           ?? 0),
                strip_tags($b['cta_text']     ?? 'Bắt đầu'),
                strip_tags($b['cta_link']     ?? '/lien-he'),
                (int)($b['sort_order']        ?? 0),
                $b['status']                  ?? 'published',
            ]
        );
        // Save items
        if (!empty($b['items']) && is_array($b['items'])) {
            foreach ($b['items'] as $i => $item) {
                $this->db->execute(
                    "INSERT INTO pricing_plan_items (plan_id, item, available, sort_order) VALUES (?, ?, ?, ?)",
                    [$planId, strip_tags($item['item'] ?? ''), (int)($item['available'] ?? 1), $i + 1]
                );
            }
        }
        Response::json(['id' => $planId], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE pricing_plans SET name=?, description=?, price_monthly=?, price_yearly=?, is_featured=?, is_free=?, cta_text=?, cta_link=?, sort_order=?, status=?
             WHERE id=?",
            [
                strip_tags($b['name']         ?? ''),
                strip_tags($b['description']  ?? ''),
                (float)($b['price_monthly']   ?? 0),
                (float)($b['price_yearly']    ?? 0),
                (int)($b['is_featured']       ?? 0),
                (int)($b['is_free']           ?? 0),
                strip_tags($b['cta_text']     ?? 'Bắt đầu'),
                strip_tags($b['cta_link']     ?? '/lien-he'),
                (int)($b['sort_order']        ?? 0),
                $b['status']                  ?? 'published',
                $p['id'],
            ]
        );
        // Replace items
        if (isset($b['items']) && is_array($b['items'])) {
            $this->db->execute("DELETE FROM pricing_plan_items WHERE plan_id=?", [$p['id']]);
            foreach ($b['items'] as $i => $item) {
                $this->db->execute(
                    "INSERT INTO pricing_plan_items (plan_id, item, available, sort_order) VALUES (?, ?, ?, ?)",
                    [$p['id'], strip_tags($item['item'] ?? ''), (int)($item['available'] ?? 1), $i + 1]
                );
            }
        }
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM pricing_plan_items WHERE plan_id=?", [$p['id']]);
        $this->db->execute("DELETE FROM pricing_plans WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
