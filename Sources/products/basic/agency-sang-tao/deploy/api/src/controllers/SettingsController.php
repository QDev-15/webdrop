<?php
declare(strict_types=1);

class SettingsController
{
    public function __construct(private Database $db) {}

    public function index(array $p): void
    {
        Auth::require();
        $rows = $this->db->query("SELECT key, value, \"group\" FROM settings ORDER BY \"group\", key");
        $grouped = [];
        foreach ($rows as $row) {
            $grouped[$row['group']][$row['key']] = $row['value'];
        }
        Response::json($grouped);
    }

    public function group(array $p): void
    {
        Auth::require();
        $group = $p['group'];
        $rows = $this->db->query(
            "SELECT key, value FROM settings WHERE \"group\"=? ORDER BY key",
            [$group]
        );
        $result = [];
        foreach ($rows as $row) {
            $result[$row['key']] = $row['value'];
        }
        Response::json($result);
    }

    public function save(array $p): void
    {
        Auth::require();
        $b = bodyJson();

        if (!isset($b['group']) || !isset($b['data']) || !is_array($b['data'])) {
            Response::error('Thiếu group hoặc data.');
        }

        $group = $b['group'];

        foreach ($b['data'] as $key => $value) {
            $existing = $this->db->scalar(
                "SELECT COUNT(*) FROM settings WHERE key=?", [$key]
            );
            if ($existing > 0) {
                $this->db->execute(
                    "UPDATE settings SET value=? WHERE key=?",
                    [(string)$value, $key]
                );
            } else {
                $this->db->execute(
                    "INSERT INTO settings (key, value, \"group\") VALUES (?,?,?)",
                    [$key, (string)$value, $group]
                );
            }
        }

        Response::json(['ok' => true]);
    }
}
