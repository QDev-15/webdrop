<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json([
            'posts'        => (int)$this->db->scalar("SELECT COUNT(*) FROM posts"),
            'published'    => (int)$this->db->scalar("SELECT COUNT(*) FROM posts WHERE status='published'"),
            'categories'   => (int)$this->db->scalar("SELECT COUNT(*) FROM post_categories"),
            'slides'       => (int)$this->db->scalar("SELECT COUNT(*) FROM hero_slides"),
            'testimonials' => (int)$this->db->scalar("SELECT COUNT(*) FROM testimonials"),
            'faqs'         => (int)$this->db->scalar("SELECT COUNT(*) FROM faqs"),
            'timeline'     => (int)$this->db->scalar("SELECT COUNT(*) FROM timeline_items"),
            'contacts'     => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts"),
            'newContacts'  => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status='new'"),
        ]);
    }
}
