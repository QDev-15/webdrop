<?php
declare(strict_types=1);

class SettingsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query("SELECT key, value, \"group\" FROM settings ORDER BY \"group\", key");
        $out  = [];
        foreach ($rows as $row) {
            $out[$row['key']] = ['value' => $row['value'], 'group' => $row['group']];
        }
        Response::json($out);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (!is_array($b)) {
            Response::error('Dữ liệu không hợp lệ.');
            return;
        }
        $stmt = $this->db->query("SELECT key, \"group\" FROM settings");
        $existing = [];
        foreach ($stmt as $row) {
            $existing[$row['key']] = $row['group'];
        }

        foreach ($b as $key => $value) {
            if (isset($existing[$key])) {
                $this->db->execute(
                    "UPDATE settings SET value=? WHERE key=?",
                    [(string)$value, $key]
                );
            }
        }
        Response::json(['ok' => true]);
    }
}
