<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $categories = (int)$this->db->scalar("SELECT COUNT(*) FROM forum_categories WHERE status='published'");
        $threads    = (int)$this->db->scalar("SELECT COUNT(*) FROM forum_threads WHERE status='published'");
        $tags       = (int)$this->db->scalar("SELECT COUNT(*) FROM forum_tags");
        $contacts   = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status='new'");

        Response::json([
            'categories'      => $categories,
            'threads'         => $threads,
            'tags'            => $tags,
            'new_contacts'    => $contacts,
        ]);
    }
}
