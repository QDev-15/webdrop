<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json([
            'posts'        => (int)$this->db->scalar("SELECT COUNT(*) FROM posts"),
            'categories'   => (int)$this->db->scalar("SELECT COUNT(*) FROM categories"),
            'slides'       => (int)$this->db->scalar("SELECT COUNT(*) FROM hero_slides"),
            'testimonials' => (int)$this->db->scalar("SELECT COUNT(*) FROM testimonials"),
            'faqs'         => (int)$this->db->scalar("SELECT COUNT(*) FROM faqs"),
            'contacts'     => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts"),
            'newContacts'  => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status='new'"),
        ]);
    }
}
