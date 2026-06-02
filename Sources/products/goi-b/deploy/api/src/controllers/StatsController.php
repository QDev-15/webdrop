<?php
class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $params): void {
        Auth::require();
        Response::ok([
            'posts'    => $this->db->scalar("SELECT COUNT(*) FROM posts"),
            'pages'    => $this->db->scalar("SELECT COUNT(*) FROM pages"),
            'contacts' => $this->db->scalar("SELECT COUNT(*) FROM contacts"),
            'new_contacts' => $this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status = 'new'"),
            'media'    => $this->db->scalar("SELECT COUNT(*) FROM media"),
            'banners'  => $this->db->scalar("SELECT COUNT(*) FROM banners"),
        ]);
    }
}
