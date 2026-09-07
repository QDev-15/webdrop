<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json([
            'menuCategories'  => (int)$this->db->scalar("SELECT COUNT(*) FROM menu_categories"),
            'menuItems'       => (int)$this->db->scalar("SELECT COUNT(*) FROM menu_items"),
            'featuredDrinks'  => (int)$this->db->scalar("SELECT COUNT(*) FROM featured_drinks"),
            'retailBeans'     => (int)$this->db->scalar("SELECT COUNT(*) FROM retail_beans"),
            'brewMethods'     => (int)$this->db->scalar("SELECT COUNT(*) FROM brew_methods"),
            'roastSteps'      => (int)$this->db->scalar("SELECT COUNT(*) FROM roast_steps"),
            'workAreas'       => (int)$this->db->scalar("SELECT COUNT(*) FROM work_areas"),
            'galleryItems'    => (int)$this->db->scalar("SELECT COUNT(*) FROM gallery_items"),
            'timelineItems'   => (int)$this->db->scalar("SELECT COUNT(*) FROM timeline_items"),
            'testimonials'    => (int)$this->db->scalar("SELECT COUNT(*) FROM testimonials"),
            'faqs'            => (int)$this->db->scalar("SELECT COUNT(*) FROM faqs"),
            'slides'          => (int)$this->db->scalar("SELECT COUNT(*) FROM hero_slides"),
            'contacts'        => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts"),
            'newContacts'     => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status='new'"),
        ]);
    }
}
