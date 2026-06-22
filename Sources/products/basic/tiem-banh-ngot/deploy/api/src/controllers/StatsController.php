<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();

        $totalProducts  = (int)$this->db->scalar("SELECT COUNT(*) FROM products");
        $totalOrders    = (int)$this->db->scalar("SELECT COUNT(*) FROM orders");
        $pendingOrders  = (int)$this->db->scalar("SELECT COUNT(*) FROM orders WHERE status = 'pending'");
        $newContacts    = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status = 'new'");
        $totalGallery   = (int)$this->db->scalar("SELECT COUNT(*) FROM gallery_items");

        $recentOrders = $this->db->query(
            "SELECT id, name, phone, cake_type, status, created_at
             FROM orders ORDER BY created_at DESC LIMIT 5"
        );

        $recentContacts = $this->db->query(
            "SELECT id, name, email, subject, status, created_at
             FROM contacts ORDER BY created_at DESC LIMIT 5"
        );

        Response::json([
            'total_products'  => $totalProducts,
            'total_orders'    => $totalOrders,
            'pending_orders'  => $pendingOrders,
            'new_contacts'    => $newContacts,
            'total_gallery'   => $totalGallery,
            'recent_orders'   => $recentOrders,
            'recent_contacts' => $recentContacts,
        ]);
    }
}
