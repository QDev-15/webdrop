<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json([
            'listings_pending'   => (int)$this->db->scalar("SELECT COUNT(*) FROM listings WHERE status = 'pending'"),
            'listings_approved'  => (int)$this->db->scalar("SELECT COUNT(*) FROM listings WHERE status = 'approved'"),
            'listings_total'     => (int)$this->db->scalar("SELECT COUNT(*) FROM listings"),
            'accounts_total'     => (int)$this->db->scalar("SELECT COUNT(*) FROM accounts"),
            'wallet_pending'     => (int)$this->db->scalar("SELECT COUNT(*) FROM wallet_transactions WHERE status = 'pending'"),
            'contacts_new'       => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status = 'new'"),
        ]);
    }
}
