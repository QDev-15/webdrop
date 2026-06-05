<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $totalPosts     = (int)$this->db->scalar("SELECT COUNT(*) FROM posts");
        $publishedPosts = (int)$this->db->scalar("SELECT COUNT(*) FROM posts WHERE status = 'published'");
        $draftPosts     = (int)$this->db->scalar("SELECT COUNT(*) FROM posts WHERE status = 'draft'");
        $totalViews     = (int)$this->db->scalar("SELECT COALESCE(SUM(views),0) FROM posts");
        $totalContacts  = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts");
        $newContacts    = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status = 'new'");
        $totalCategories= (int)$this->db->scalar("SELECT COUNT(*) FROM post_categories");
        $totalTags      = (int)$this->db->scalar("SELECT COUNT(*) FROM tags");
        $newsletters    = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE subject = 'newsletter'");
        $recentPosts    = $this->db->query(
            "SELECT po.id, po.title, po.slug, po.status, po.views, po.created_at,
                    c.name as category_name
             FROM posts po
             LEFT JOIN post_categories c ON c.id = po.category_id
             ORDER BY po.created_at DESC LIMIT 5"
        );
        Response::json([
            'totalPosts'      => $totalPosts,
            'publishedPosts'  => $publishedPosts,
            'draftPosts'      => $draftPosts,
            'totalViews'      => $totalViews,
            'totalContacts'   => $totalContacts,
            'newContacts'     => $newContacts,
            'totalCategories' => $totalCategories,
            'totalTags'       => $totalTags,
            'newsletters'     => $newsletters,
            'recentPosts'     => $recentPosts,
        ]);
    }
}
