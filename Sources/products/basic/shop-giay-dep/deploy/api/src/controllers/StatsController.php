<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(): void {
        Auth::require();
        $products      = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM products")['c'] ?? 0);
        $categories    = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM product_categories")['c'] ?? 0);
        $newContacts   = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM contacts WHERE status = 'new'")['c'] ?? 0);
        $pendingOrders = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM orders WHERE status = 'pending'")['c'] ?? 0);

        Response::json([
            'products'       => $products,
            'categories'     => $categories,
            'new_contacts'   => $newContacts,
            'pending_orders' => $pendingOrders,
        ]);
    }
}
