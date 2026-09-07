<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();

        $totalMenuItems = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM menu_items")['c'] ?? 0);
        $publishedMenuItems = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM menu_items WHERE status='published'")['c'] ?? 0);
        $categories     = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM menu_categories WHERE status='published'")['c'] ?? 0);
        $newContacts    = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM contacts WHERE status='new'")['c'] ?? 0);
        $totalContacts  = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM contacts")['c'] ?? 0);
        $galleryCount   = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM gallery_items WHERE status='published'")['c'] ?? 0);
        $testimonials   = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM testimonials WHERE status='published'")['c'] ?? 0);
        $faqs           = (int)($this->db->queryOne("SELECT COUNT(*) as c FROM faqs WHERE status='published'")['c'] ?? 0);

        $recentContacts = $this->db->query(
            "SELECT name, email, phone, subject, created_at, status
             FROM contacts ORDER BY created_at DESC LIMIT 5"
        );

        Response::json([
            'total_menu_items'     => $totalMenuItems,
            'menu_items'           => $publishedMenuItems,
            'categories'           => $categories,
            'new_contacts'         => $newContacts,
            'total_contacts'       => $totalContacts,
            'gallery_count'        => $galleryCount,
            'testimonials'         => $testimonials,
            'faqs'                 => $faqs,
            'recent_contacts'      => $recentContacts,
        ]);
    }
}
