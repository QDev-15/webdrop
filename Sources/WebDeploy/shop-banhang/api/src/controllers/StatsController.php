<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    // GET /stats — dùng cho badge sidebar admin (superadmin only)
    public function index(array $p): void {
        Auth::requireRole('superadmin');
        $newContacts = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status = 'new'");
        $lowStockCount = 0;
        foreach ($this->db->query("SELECT * FROM products") as $pr) {
            $total = $pr['has_variants']
                ? (int)$this->db->scalar("SELECT COALESCE(SUM(stock),0) FROM product_variants WHERE product_id = ?", [$pr['id']])
                : (int)$pr['stock'];
            if ($total <= (int)$pr['min_stock']) $lowStockCount++;
        }
        $openShift = (int)$this->db->scalar("SELECT COUNT(*) FROM shifts WHERE status = 'open'");
        Response::json([
            'new_contacts' => $newContacts,
            'low_stock' => $lowStockCount,
            'open_shift' => $openShift,
            'products' => (int)$this->db->scalar("SELECT COUNT(*) FROM products"),
            'customers' => (int)$this->db->scalar("SELECT COUNT(*) FROM customers"),
        ]);
    }
}
