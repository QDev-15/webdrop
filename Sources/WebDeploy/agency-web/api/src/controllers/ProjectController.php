<?php
declare(strict_types=1);

class ProjectController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json($this->db->query("SELECT * FROM projects ORDER BY sort_order, id"));
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM projects WHERE id=?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b  = bodyJson();
        $id = $this->db->execute(
            "INSERT INTO projects (title, slug, description, image, client, category, tags, link, featured, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $b['title']       ?? '',
                slugify($b['title'] ?? ''),
                $b['description'] ?? '',
                $b['image']       ?? '',
                $b['client']      ?? '',
                $b['category']    ?? '',
                $b['tags']        ?? '',
                $b['link']        ?? '',
                (int)($b['featured']   ?? 0),
                (int)($b['sort_order'] ?? 0),
                $b['status']      ?? 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE projects SET title=?, description=?, image=?, client=?, category=?, tags=?, link=?, featured=?, sort_order=?, status=? WHERE id=?",
            [
                $b['title']       ?? '',
                $b['description'] ?? '',
                $b['image']       ?? '',
                $b['client']      ?? '',
                $b['category']    ?? '',
                $b['tags']        ?? '',
                $b['link']        ?? '',
                (int)($b['featured']   ?? 0),
                (int)($b['sort_order'] ?? 0),
                $b['status']      ?? 'published',
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM projects WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
