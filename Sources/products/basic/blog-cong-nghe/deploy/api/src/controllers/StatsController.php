<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $postsCount      = (int)$this->db->scalar("SELECT COUNT(*) FROM posts");
        $publishedCount  = (int)$this->db->scalar("SELECT COUNT(*) FROM posts WHERE status='published'");
        $reviewsCount    = (int)$this->db->scalar("SELECT COUNT(*) FROM posts WHERE review_score IS NOT NULL");
        $categoriesCount = (int)$this->db->scalar("SELECT COUNT(*) FROM post_categories");
        $slidesCount     = (int)$this->db->scalar("SELECT COUNT(*) FROM hero_slides");
        $faqsCount       = (int)$this->db->scalar("SELECT COUNT(*) FROM faqs");
        $contactsCount   = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts");
        $newContacts     = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status='new'");

        Response::json([
            'posts'       => $postsCount,
            'published'   => $publishedCount,
            'reviews'     => $reviewsCount,
            'categories'  => $categoriesCount,
            'slides'      => $slidesCount,
            'faqs'        => $faqsCount,
            'contacts'    => $contactsCount,
            'newContacts' => $newContacts,
        ]);
    }
}
