<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $postsCount        = (int)$this->db->scalar("SELECT COUNT(*) FROM posts");
        $categoriesCount   = (int)$this->db->scalar("SELECT COUNT(*) FROM post_categories");
        $destinationsCount = (int)$this->db->scalar("SELECT COUNT(*) FROM destinations");
        $faqsCount         = (int)$this->db->scalar("SELECT COUNT(*) FROM faqs");
        $slidesCount       = (int)$this->db->scalar("SELECT COUNT(*) FROM hero_slides");
        $contactsCount     = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts");
        $newContacts       = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status='new'");

        Response::json([
            'posts'        => $postsCount,
            'categories'   => $categoriesCount,
            'destinations' => $destinationsCount,
            'faqs'         => $faqsCount,
            'slides'       => $slidesCount,
            'contacts'     => $contactsCount,
            'newContacts'  => $newContacts,
        ]);
    }
}
