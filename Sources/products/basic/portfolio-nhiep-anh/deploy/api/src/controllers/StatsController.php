<?php
declare(strict_types=1);

class StatsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $projectsCount     = (int)$this->db->scalar("SELECT COUNT(*) FROM projects");
        $slidesCount       = (int)$this->db->scalar("SELECT COUNT(*) FROM hero_slides");
        $testimonialsCount = (int)$this->db->scalar("SELECT COUNT(*) FROM testimonials");
        $faqsCount         = (int)$this->db->scalar("SELECT COUNT(*) FROM faqs");
        $pricingCount      = (int)$this->db->scalar("SELECT COUNT(*) FROM pricing_plans");
        $contactsCount     = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts");
        $newContacts       = (int)$this->db->scalar("SELECT COUNT(*) FROM contacts WHERE status='new'");

        Response::json([
            'projects'     => $projectsCount,
            'slides'       => $slidesCount,
            'testimonials' => $testimonialsCount,
            'faqs'         => $faqsCount,
            'pricing'      => $pricingCount,
            'contacts'     => $contactsCount,
            'newContacts'  => $newContacts,
        ]);
    }
}
