<?php

class SettingsController {
    private Database $db;
    public function __construct(Database $db) { $this->db = $db; }

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query("SELECT key, value FROM settings");
        $result = [];
        foreach ($rows as $r) {
            $result[$r['key']] = $r['value'];
        }
        Response::json($result);
    }

    public function save(array $p): void {
        Auth::require();
        $b = bodyJson();
        foreach ($b as $key => $value) {
            $key = preg_replace('/[^a-z0-9_]/', '', strtolower($key));
            if (!$key) continue;
            $existing = $this->db->queryOne("SELECT \"group\" FROM settings WHERE key = ?", [$key]);
            if ($existing) {
                $this->db->execute("UPDATE settings SET value = ? WHERE key = ?", [(string)$value, $key]);
            }
        }
        Response::json(['ok' => true]);
    }
}
