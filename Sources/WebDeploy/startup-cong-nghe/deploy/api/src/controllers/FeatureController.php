<?php

class FeatureController {
    private Database $db;
    public function __construct(Database $db) { $this->db = $db; }

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM features ORDER BY sort_order, id");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM features WHERE id=?", [$p['id']]);
        if (!$item) Response::notFound();
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) Response::error('Tên tính năng không được để trống');
        $slug = slugify($b['name']);
        $id = $this->db->execute(
            "INSERT INTO features (name, slug, tag, description, content, icon, image, featured, sort_order, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                strip_tags($b['name']),
                $slug,
                strip_tags($b['tag']         ?? ''),
                strip_tags($b['description'] ?? ''),
                $b['content']                ?? '',
                strip_tags($b['icon']        ?? ''),
                strip_tags($b['image']       ?? ''),
                (int)($b['featured']         ?? 0),
                (int)($b['sort_order']       ?? 0),
                $b['status']                 ?? 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE features SET name=?, tag=?, description=?, content=?, icon=?, image=?, featured=?, sort_order=?, status=?
             WHERE id=?",
            [
                strip_tags($b['name']        ?? ''),
                strip_tags($b['tag']         ?? ''),
                strip_tags($b['description'] ?? ''),
                $b['content']                ?? '',
                strip_tags($b['icon']        ?? ''),
                strip_tags($b['image']       ?? ''),
                (int)($b['featured']         ?? 0),
                (int)($b['sort_order']       ?? 0),
                $b['status']                 ?? 'published',
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM features WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
