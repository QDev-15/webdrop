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
        $stmt = $this->db->query("SELECT key FROM settings");
        $existingKeys = array_column($stmt, 'key');
        foreach ($b as $key => $value) {
            if (in_array($key, $existingKeys, true)) {
                $this->db->execute("UPDATE settings SET value=? WHERE key=?", [(string)$value, $key]);
            }
        }
        Response::json(['ok' => true]);
    }
}
