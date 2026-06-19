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
        // $b is flat key=>value map
        $stmt = $this->db->query("SELECT key, \"group\" FROM settings");
        $groupMap = [];
        foreach ($stmt as $r) { $groupMap[$r['key']] = $r['group']; }

        foreach ($b as $key => $value) {
            if (!is_string($key)) continue;
            $group = $groupMap[$key] ?? 'general';
            $this->db->execute(
                "INSERT INTO settings (key, value, \"group\") VALUES (?, ?, ?)
                 ON CONFLICT(key) DO UPDATE SET value = excluded.value",
                [$key, (string)$value, $group]
            );
        }
        Response::json(['ok' => true]);
    }
}
