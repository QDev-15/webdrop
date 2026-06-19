<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();

        $menuItems   = $this->db->scalar("SELECT COUNT(*) FROM menu_items WHERE status = 'published'") ?? 0;
        $menuCats    = $this->db->scalar("SELECT COUNT(*) FROM menu_categories WHERE status = 'published'") ?? 0;
        $testimonials= $this->db->scalar("SELECT COUNT(*) FROM testimonials WHERE status = 'published'") ?? 0;
        $gallery     = $this->db->scalar("SELECT COUNT(*) FROM gallery_items WHERE status = 'published'") ?? 0;
        $contacts    = $this->db->scalar("SELECT COUNT(*) FROM contacts") ?? 0;
        $newContacts = $this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status = 'new'") ?? 0;
        $heroSlides  = $this->db->scalar("SELECT COUNT(*) FROM hero_slides WHERE status = 'published'") ?? 0;

        $recentContacts = $this->db->query(
            "SELECT id, name, phone, subject, status, created_at FROM contacts ORDER BY created_at DESC LIMIT 5"
        );

        Response::json([
            'menu_items'      => (int) $menuItems,
            'menu_categories' => (int) $menuCats,
            'testimonials'    => (int) $testimonials,
            'gallery'         => (int) $gallery,
            'contacts'        => (int) $contacts,
            'new_contacts'    => (int) $newContacts,
            'hero_slides'     => (int) $heroSlides,
            'recent_contacts' => $recentContacts,
        ]);
    }
}
