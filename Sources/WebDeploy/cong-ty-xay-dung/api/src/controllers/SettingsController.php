<?php
declare(strict_types=1);

class SettingsController
{
    public function __construct(private Database $db) {}

    public function index(array $p): void
    {
        Auth::require();
        $rows   = $this->db->query("SELECT key, value, \"group\" FROM settings ORDER BY \"group\", key");
        $result = [];
        foreach ($rows as $row) {
            $result[$row['key']] = ['value' => $row['value'], 'group' => $row['group']];
        }
        Response::json($result);
    }

    public function group(array $p): void
    {
        Auth::require();
        $group = $p['group'] ?? '';
        $rows  = $this->db->query(
            "SELECT key, value FROM settings WHERE \"group\"=? ORDER BY key",
            [$group]
        );
        $result = [];
        foreach ($rows as $row) {
            $result[$row['key']] = $row['value'];
        }
        Response::json($result);
    }

    public function save(array $p): void
    {
        Auth::require();
        $b = bodyJson();

        foreach ($b as $key => $value) {
            $key   = trim((string)$key);
            $value = (string)$value;
            if ($key === '') continue;

            $existing = $this->db->row("SELECT key FROM settings WHERE key=?", [$key]);
            if ($existing) {
                $this->db->execute("UPDATE settings SET value=? WHERE key=?", [$value, $key]);
            } else {
                // Xác định group dựa theo prefix
                $group = $this->guessGroup($key);
                $this->db->execute(
                    "INSERT INTO settings (key, value, \"group\") VALUES (?,?,?)",
                    [$key, $value, $group]
                );
            }
        }

        Response::json(['ok' => true]);
    }

    private function guessGroup(string $key): string
    {
        $map = [
            'meta_'    => 'seo',
            'og_'      => 'seo',
            'google_a' => 'seo',
            'social_'  => 'social',
            'smtp_'    => 'smtp',
            'footer_'  => 'footer',
            'hero_'    => 'hero',
            'stat'     => 'stats',
            'about_'   => 'about',
            'contact_' => 'contact',
            'google_m' => 'contact',
            'maintena' => 'system',
            'custom_'  => 'system',
            'primary_' => 'design',
            'secondar' => 'design',
        ];
        foreach ($map as $prefix => $group) {
            if (str_starts_with($key, $prefix)) return $group;
        }
        return 'general';
    }
}
