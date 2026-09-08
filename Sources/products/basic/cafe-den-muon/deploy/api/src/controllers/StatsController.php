<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();

        $totalContacts  = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts");
        $newContacts    = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status='new'");
        $totalMenuItems = (int)$this->db->scalar("SELECT COUNT(*) FROM menu_items WHERE status='published'");
        $totalSlides    = (int)$this->db->scalar("SELECT COUNT(*) FROM hero_slides WHERE status='published'");
        $totalGallery   = (int)$this->db->scalar("SELECT COUNT(*) FROM gallery_items");
        $totalTestimonials = (int)$this->db->scalar("SELECT COUNT(*) FROM testimonials");
        $totalFaqs      = (int)$this->db->scalar("SELECT COUNT(*) FROM faqs");

        $recentContacts = $this->db->query(
            "SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5"
        );

        Response::json([
            'contacts'       => $totalContacts,
            'new_contacts'   => $newContacts,
            'menu_items'     => $totalMenuItems,
            'hero_slides'    => $totalSlides,
            'gallery_items'  => $totalGallery,
            'testimonials'   => $totalTestimonials,
            'faqs'           => $totalFaqs,
            'recent_contacts' => $recentContacts,
        ]);
    }
}
