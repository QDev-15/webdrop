<?php
declare(strict_types=1);

class SettingsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query("SELECT key, value, \"group\" FROM settings ORDER BY \"group\", key");
        $out = [];
        foreach ($rows as $r) {
            $out[$r['group']][$r['key']] = $r['value'];
        }
        Response::json($out);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        foreach ($b as $key => $value) {
            $this->db->execute(
                "INSERT INTO settings (key, value, \"group\") VALUES (?, ?, 'general')
                 ON CONFLICT(key) DO UPDATE SET value = excluded.value",
                [$key, $value]
            );
        }
        Response::json(['ok' => true]);
    }
}
