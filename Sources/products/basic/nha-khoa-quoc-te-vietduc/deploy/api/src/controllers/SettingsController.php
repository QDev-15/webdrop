<?php
declare(strict_types=1);

class SettingsController {
    public function __construct(private Database $db) {}

    public function index(array $p = []): void {
        Auth::require();
        $rows   = $this->db->query("SELECT key, value, grp FROM settings ORDER BY grp, key");
        $result = [];
        foreach ($rows as $r) {
            $result[$r['key']] = $r['value'];
        }
        Response::json($result);
    }

    public function update(array $p = []): void {
        Auth::require();
        $b = bodyJson();

        // Build grp map tu DB
        $existing = $this->db->query("SELECT key, grp FROM settings");
        $grpMap   = [];
        foreach ($existing as $r) { $grpMap[$r['key']] = $r['grp']; }

        // Chi update key da ton tai — khong tao key tuy y tu client
        foreach ($b as $key => $value) {
            if (!is_string($key)) continue;
            if (!array_key_exists($key, $grpMap)) continue;
            $grp = $grpMap[$key];
            $this->db->execute(
                "INSERT INTO settings (key, value, grp) VALUES (?, ?, ?)
                 ON CONFLICT(key) DO UPDATE SET value = excluded.value",
                [$key, (string)$value, $grp]
            );
        }
        Response::json(['ok' => true]);
    }
}
