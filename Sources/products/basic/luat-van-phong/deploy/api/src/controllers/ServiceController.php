<?php

class ServiceController {
    private Database $db;
    public function __construct(Database $db) { $this->db = $db; }

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM services ORDER BY sort_order, id");
        foreach ($items as &$item) {
            $item['items'] = array_column(
                $this->db->query(
                    "SELECT item FROM service_items WHERE service_id=? ORDER BY sort_order",
                    [$item['id']]
                ),
                'item'
            );
        }
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM services WHERE id=?", [$p['id']]);
        if (!$item) Response::notFound();
        $item['items'] = array_column(
            $this->db->query(
                "SELECT item FROM service_items WHERE service_id=? ORDER BY sort_order",
                [$item['id']]
            ),
            'item'
        );
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) Response::error('Tên lĩnh vực không được để trống');
        $slug = slugify($b['name']);
        $id = $this->db->execute(
            "INSERT INTO services (name, slug, tag, description, content, sort_order, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                $b['name'],
                $slug,
                $b['tag']         ?? '',
                $b['description'] ?? '',
                $b['content']     ?? '',
                (int)($b['sort_order'] ?? 0),
                $b['status']      ?? 'published',
            ]
        );
        if (!empty($b['items']) && is_array($b['items'])) {
            foreach ($b['items'] as $i => $item) {
                $this->db->execute(
                    "INSERT INTO service_items (service_id, item, sort_order) VALUES (?, ?, ?)",
                    [$id, $item, $i + 1]
                );
            }
        }
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) Response::error('Tên lĩnh vực không được để trống');
        $this->db->execute(
            "UPDATE services SET name=?, tag=?, description=?, content=?, sort_order=?, status=? WHERE id=?",
            [
                $b['name'],
                $b['tag']         ?? '',
                $b['description'] ?? '',
                $b['content']     ?? '',
                (int)($b['sort_order'] ?? 0),
                $b['status']      ?? 'published',
                $p['id'],
            ]
        );
        if (isset($b['items']) && is_array($b['items'])) {
            $this->db->execute("DELETE FROM service_items WHERE service_id=?", [$p['id']]);
            foreach ($b['items'] as $i => $item) {
                $this->db->execute(
                    "INSERT INTO service_items (service_id, item, sort_order) VALUES (?, ?, ?)",
                    [$p['id'], $item, $i + 1]
                );
            }
        }
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM service_items WHERE service_id=?", [$p['id']]);
        $this->db->execute("DELETE FROM services WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
