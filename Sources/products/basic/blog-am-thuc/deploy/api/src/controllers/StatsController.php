<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json([
            'total_posts'      => (int)$this->db->scalar("SELECT COUNT(*) FROM posts"),
            'total_articles'   => (int)$this->db->scalar("SELECT COUNT(*) FROM posts WHERE type = 'article'"),
            'total_recipes'    => (int)$this->db->scalar("SELECT COUNT(*) FROM posts WHERE type = 'recipe'"),
            'total_categories' => (int)$this->db->scalar("SELECT COUNT(*) FROM post_categories"),
            'total_views'      => (int)$this->db->scalar("SELECT COALESCE(SUM(views), 0) FROM posts"),
            'new_contacts'     => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status = 'new'"),
            'total_contacts'   => (int)$this->db->scalar("SELECT COUNT(*) FROM contacts"),
            'total_testimonials' => (int)$this->db->scalar("SELECT COUNT(*) FROM testimonials"),
            'total_faqs'       => (int)$this->db->scalar("SELECT COUNT(*) FROM faqs"),
            'recent_posts'     => $this->db->query(
                "SELECT id, title, type, status, published_at FROM posts ORDER BY published_at DESC LIMIT 5"
            ),
            'recent_contacts'  => $this->db->query(
                "SELECT id, name, subject, status, created_at FROM contacts ORDER BY created_at DESC LIMIT 5"
            ),
        ]);
    }
}
