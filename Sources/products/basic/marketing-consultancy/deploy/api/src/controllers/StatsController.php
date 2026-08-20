<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $servicesCount     = (int)$this->db->scalar("SELECT COUNT(*) FROM services");
        $slidesCount       = (int)$this->db->scalar("SELECT COUNT(*) FROM hero_slides");
        $teamCount         = (int)$this->db->scalar("SELECT COUNT(*) FROM team_members");
        $testimonialsCount = (int)$this->db->scalar("SELECT COUNT(*) FROM testimonials");
        $contactsCount     = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts");
        $newContacts       = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status='new'");

        Response::json([
            'services'     => $servicesCount,
            'slides'       => $slidesCount,
            'team'         => $teamCount,
            'testimonials' => $testimonialsCount,
            'contacts'     => $contactsCount,
            'newContacts'  => $newContacts,
        ]);
    }
}
