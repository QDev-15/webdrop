<?php
declare(strict_types=1);

class SettingsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query("SELECT grp, key, value FROM settings ORDER BY grp, key");
        Response::json($rows);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();

        // Handle array of {grp, key, value} objects from admin
        if (is_array($b) && isset($b[0]['grp'])) {
            foreach ($b as $item) {
                if (isset($item['grp'], $item['key'], $item['value'])) {
                    $this->db->execute(
                        "UPDATE settings SET value = ? WHERE grp = ? AND key = ?",
                        [(string)$item['value'], $item['grp'], $item['key']]
                    );
                }
            }
        } else {
            // Handle flat key-value object for backward compatibility
            $stmt = $this->db->query("SELECT key, grp FROM settings");
            $groupMap = [];
            foreach ($stmt as $r) { $groupMap[$r['key']] = $r['grp']; }

            foreach ($b as $key => $value) {
                if (!is_string($key)) continue;
                if (!array_key_exists($key, $groupMap)) continue;
                $group = $groupMap[$key];
                $this->db->execute(
                    "UPDATE settings SET value = ? WHERE grp = ? AND key = ?",
                    [(string)$value, $group, $key]
                );
            }
        }
        Response::json(['ok' => true]);
    }
}
