<?php

class LawyerController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM lawyers ORDER BY sort_order, id");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM lawyers WHERE id=?", [$p['id']]);
        if (!$item) Response::notFound();
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) Response::error('Tên luật sư không được để trống');
        $id = $this->db->execute(
            "INSERT INTO lawyers (name, role, bio, speciality, avatar, tags, is_partner, sort_order, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $b['name'],
                $b['role']       ?? '',
                $b['bio']        ?? '',
                $b['speciality'] ?? '',
                $b['avatar']     ?? '',
                $b['tags']       ?? '',
                (int)($b['is_partner'] ?? 0),
                (int)($b['sort_order'] ?? 0),
                $b['status']     ?? 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) Response::error('Tên luật sư không được để trống');
        $this->db->execute(
            "UPDATE lawyers SET name=?, role=?, bio=?, speciality=?, avatar=?, tags=?, is_partner=?, sort_order=?, status=?
             WHERE id=?",
            [
                $b['name'],
                $b['role']       ?? '',
                $b['bio']        ?? '',
                $b['speciality'] ?? '',
                $b['avatar']     ?? '',
                $b['tags']       ?? '',
                (int)($b['is_partner'] ?? 0),
                (int)($b['sort_order'] ?? 0),
                $b['status']     ?? 'published',
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM lawyers WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }

    public function reorder(array $p): void {
        Auth::require();
        $b = bodyJson();
        foreach ($b['order'] ?? [] as $i => $id) {
            $this->db->execute("UPDATE lawyers SET sort_order=? WHERE id=?", [$i, $id]);
        }
        Response::json(['ok' => true]);
    }
}
