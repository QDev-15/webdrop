<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json([
            'slides'       => (int)$this->db->scalar("SELECT COUNT(*) FROM hero_slides"),
            'menuCategories' => (int)$this->db->scalar("SELECT COUNT(*) FROM menu_categories"),
            'menuItems'    => (int)$this->db->scalar("SELECT COUNT(*) FROM menu_items"),
            'gallery'      => (int)$this->db->scalar("SELECT COUNT(*) FROM gallery_items"),
            'testimonials' => (int)$this->db->scalar("SELECT COUNT(*) FROM testimonials"),
            'spaces'       => (int)$this->db->scalar("SELECT COUNT(*) FROM spaces"),
            'team'         => (int)$this->db->scalar("SELECT COUNT(*) FROM team_members"),
            'timeline'     => (int)$this->db->scalar("SELECT COUNT(*) FROM timeline_items"),
            'faqs'         => (int)$this->db->scalar("SELECT COUNT(*) FROM faqs"),
            'contacts'     => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts"),
            'newContacts'  => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status='new'"),
        ]);
    }
}
