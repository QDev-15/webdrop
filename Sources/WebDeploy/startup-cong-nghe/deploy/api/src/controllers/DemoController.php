<?php

class DemoController {
    private Database $db;
    public function __construct(Database $db) { $this->db = $db; }

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM demo_requests ORDER BY created_at DESC");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM demo_requests WHERE id=?", [$p['id']]);
        if (!$item) Response::notFound();
        if ($item['status'] === 'new') {
            $this->db->execute("UPDATE demo_requests SET status='contacted' WHERE id=?", [$p['id']]);
            $item['status'] = 'contacted';
        }
        Response::json($item);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $allowed = ['new', 'contacted', 'done', 'cancelled'];
        $status = in_array($b['status'] ?? '', $allowed) ? $b['status'] : 'new';
        $this->db->execute("UPDATE demo_requests SET status=? WHERE id=?", [$status, $p['id']]);
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM demo_requests WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
