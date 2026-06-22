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
        $stmt = $this->db->query("SELECT key, \"group\" FROM settings");
        $groupMap = [];
        foreach ($stmt as $r) { $groupMap[$r['key']] = $r['group']; }

        // Chỉ cho phép update các key đã tồn tại trong DB — không tạo key tùy ý
        foreach ($b as $key => $value) {
            if (!is_string($key)) continue;
            if (!array_key_exists($key, $groupMap)) continue; // bỏ qua key không có trong settings
            $group = $groupMap[$key];
            $this->db->execute(
                "INSERT INTO settings (key, value, \"group\") VALUES (?, ?, ?)
                 ON CONFLICT(key) DO UPDATE SET value = excluded.value",
                [$key, (string)$value, $group]
            );
        }
        Response::json(['ok' => true]);
    }
}
