<?php
declare(strict_types=1);

class SettingsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query("SELECT key, value FROM settings");
        $result = [];
        foreach ($rows as $r) {
            $result[$r['key']] = $r['value'];
        }
        Response::json($result);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $rows2 = $this->db->query("SELECT key, \"group\" FROM settings");
        $existingKeys = [];
        foreach ($rows2 as $row) { $existingKeys[$row['key']] = $row['group']; }

        foreach ($b as $key => $value) {
            if (!is_string($key) || !isset($existingKeys[$key])) continue;
            $this->db->execute(
                "UPDATE settings SET value = ? WHERE key = ?",
                [(string)$value, $key]
            );
        }
        Response::json(['ok' => true]);
    }
}
