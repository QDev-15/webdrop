<?php
declare(strict_types=1);

class SettingsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query("SELECT key, value, \"group\" FROM settings ORDER BY \"group\", key");
        Response::json($rows);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        foreach ($b as $key => $value) {
            if (!is_string($key)) continue;
            $existing = $this->db->queryOne("SELECT key FROM settings WHERE key = ?", [$key]);
            if ($existing) {
                $this->db->execute("UPDATE settings SET value=? WHERE key=?", [(string)$value, $key]);
            }
            // Only update existing keys — no new keys from frontend
        }
        Response::json(['ok' => true]);
    }
}
