<?php
class SettingsController {
    public function __construct(private Database $db) {}

    public function index(array $params): void {
        Auth::require();
        $rows = $this->db->query("SELECT key, value, \"group\" FROM settings ORDER BY \"group\", key");

        // Group settings theo nhóm
        $grouped = [];
        foreach ($rows as $row) {
            $grouped[$row['group']][$row['key']] = $row['value'];
        }
        Response::ok($grouped);
    }

    public function update(array $params): void {
        Auth::require();
        $body = bodyJson();
        // body là object {key: value} hoặc {group: {key: value}}
        // Hỗ trợ cả 2 dạng
        $pairs = [];
        foreach ($body as $k => $v) {
            if (is_array($v)) {
                // dạng grouped: {general: {site_name: "..."}}
                foreach ($v as $key => $val) {
                    $pairs[] = [$key, (string) $val, $k];
                }
            } else {
                // dạng flat: {site_name: "..."}
                $pairs[] = [$k, (string) $v, 'general'];
            }
        }

        foreach ($pairs as [$key, $value, $group]) {
            // INSERT OR REPLACE — atomic upsert, tránh race condition check-then-write
            $this->db->execute(
                'INSERT OR REPLACE INTO settings (key, value, "group") VALUES (?, ?, ?)',
                [$key, $value, $group]
            );
        }
        Response::ok();
    }
}
