<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();

        $products     = $this->db->queryOne("SELECT COUNT(*) as c FROM products WHERE status = 'published'");
        $categories   = $this->db->queryOne("SELECT COUNT(*) as c FROM product_categories");
        $contacts     = $this->db->queryOne("SELECT COUNT(*) as c FROM contacts WHERE status = 'new'");
        $testimonials = $this->db->queryOne("SELECT COUNT(*) as c FROM testimonials WHERE is_active = 1");
        $pendingOrders = $this->db->queryOne("SELECT COUNT(*) as c FROM orders WHERE status = 'pending'");

        Response::json([
            'products'       => (int)($products['c']     ?? 0),
            'categories'     => (int)($categories['c']   ?? 0),
            'new_contacts'   => (int)($contacts['c']     ?? 0),
            'testimonials'   => (int)($testimonials['c'] ?? 0),
            'pending_orders' => (int)($pendingOrders['c'] ?? 0),
        ]);
    }
}
