<?php
declare(strict_types=1);

// Admin stats: orders, revenue, visits, products
class StatsController {
    public function __construct(private Database $db) {}

    public function overview(): void {
        $totalOrders = $this->db->queryOne("SELECT COUNT(*) as count FROM orders")['count'] ?? 0;
        $revenue = $this->db->queryOne("SELECT COALESCE(SUM(total), 0) as sum FROM orders WHERE paid_at IS NOT NULL")['sum'] ?? 0;
        $totalCustomers = $this->db->queryOne("SELECT COUNT(DISTINCT email) as count FROM orders")['count'] ?? 0;
        $totalProducts = $this->db->queryOne("SELECT COUNT(*) as count FROM products")['count'] ?? 0;

        Response::json(compact('totalOrders', 'revenue', 'totalCustomers', 'totalProducts'));
    }

    public function recentOrders(): void {
        $limit = (int)($_GET['limit'] ?? 10);
        $limit = min(max($limit, 1), 50);
        
        $orders = $this->db->query(
            "SELECT id, code, customer_name, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT ?",
            [$limit]
        );
        Response::json($orders);
    }
}
