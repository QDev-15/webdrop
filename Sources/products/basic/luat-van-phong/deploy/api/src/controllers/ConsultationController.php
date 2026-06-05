<?php

class ConsultationController {
    private Database $db;
    public function __construct(Database $db) { $this->db = $db; }

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM consultations ORDER BY created_at DESC");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM consultations WHERE id=?", [$p['id']]);
        if (!$item) Response::notFound();
        if ($item['status'] === 'new') {
            $this->db->execute("UPDATE consultations SET status='contacted' WHERE id=?", [$p['id']]);
            $item['status'] = 'contacted';
        }
        Response::json($item);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $allowed = ['new', 'contacted', 'done', 'cancelled'];
        $status = in_array($b['status'] ?? '', $allowed) ? $b['status'] : 'contacted';
        $this->db->execute("UPDATE consultations SET status=? WHERE id=?", [$status, $p['id']]);
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM consultations WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
