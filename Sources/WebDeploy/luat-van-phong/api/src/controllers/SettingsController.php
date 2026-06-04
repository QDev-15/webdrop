<?php

class SettingsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query("SELECT key, value, \"group\" FROM settings ORDER BY \"group\", key");
        $result = [];
        foreach ($rows as $row) {
            $result[$row['group']][$row['key']] = $row['value'];
        }
        Response::json($result);
    }

    public function save(array $p): void {
        Auth::require();
        $b = bodyJson();
        foreach ($b as $key => $value) {
            $this->db->execute(
                "INSERT INTO settings (key, value, \"group\") VALUES (?, ?, ?)
                 ON CONFLICT(key) DO UPDATE SET value = excluded.value",
                [$key, $value, $this->detectGroup($key)]
            );
        }
        Response::json(['ok' => true]);
    }

    private function detectGroup(string $key): string {
        $map = [
            'site_'     => 'general',
            'working_'  => 'general',
            'established_' => 'general',
            'meta_'     => 'seo',
            'og_'       => 'seo',
            'google_analytics' => 'seo',
            'social_'   => 'social',
            'footer_'   => 'footer',
            'contact_'  => 'contact',
            'google_map' => 'contact',
            'smtp_'     => 'smtp',
            'maintenance' => 'system',
            'hero_'     => 'about',
            'stat_'     => 'about',
        ];
        foreach ($map as $prefix => $group) {
            if (str_starts_with($key, $prefix)) return $group;
        }
        return 'general';
    }
}
