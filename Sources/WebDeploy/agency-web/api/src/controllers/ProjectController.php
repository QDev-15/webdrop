<?php
declare(strict_types=1);

class ProjectController
{
    public function __construct(private Database $db) {}

    public function index(array $p): void
    {
        Auth::require();
        $cat = $_GET['category'] ?? '';
        if ($cat) {
            $projects = $this->db->query(
                "SELECT * FROM projects WHERE category=? ORDER BY featured DESC, sort_order, id",
                [$cat]
            );
        } else {
            $projects = $this->db->query(
                "SELECT * FROM projects ORDER BY featured DESC, sort_order, id"
            );
        }
        Response::json($projects);
    }

    public function show(array $p): void
    {
        Auth::require();
        $id = (int)$p['id'];
        $project = $this->db->row("SELECT * FROM projects WHERE id=?", [$id]);
        if (!$project) Response::notFound('Dự án không tồn tại.');
        Response::json($project);
    }

    public function store(array $p): void
    {
        Auth::require();
        $b = bodyJson();

        if (empty($b['title'])) {
            Response::error('Tiêu đề dự án không được để trống.');
        }

        $slug = $b['slug'] ?? slugify($b['title']);

        $id = $this->db->execute(
            "INSERT INTO projects (title, slug, category, industry, description, image, client, url, featured, sort_order, status)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            [
                $b['title'],
                $slug,
                $b['category']    ?? 'web',
                $b['industry']    ?? '',
                $b['description'] ?? '',
                $b['image']       ?? '',
                $b['client']      ?? '',
                $b['url']         ?? '',
                (int)($b['featured']   ?? 0),
                (int)($b['sort_order'] ?? 0),
                $b['status']      ?? 'published',
            ]
        );

        Response::json(['id' => (int)$id], 201);
    }

    public function update(array $p): void
    {
        Auth::require();
        $id = (int)$p['id'];
        $b  = bodyJson();

        if (empty($b['title'])) {
            Response::error('Tiêu đề dự án không được để trống.');
        }

        $this->db->execute(
            "UPDATE projects SET
                title=?, category=?, industry=?, description=?, image=?, client=?,
                url=?, featured=?, sort_order=?, status=?
             WHERE id=?",
            [
                $b['title'],
                $b['category']    ?? 'web',
                $b['industry']    ?? '',
                $b['description'] ?? '',
                $b['image']       ?? '',
                $b['client']      ?? '',
                $b['url']         ?? '',
                (int)($b['featured']   ?? 0),
                (int)($b['sort_order'] ?? 0),
                $b['status']      ?? 'published',
                $id,
            ]
        );

        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void
    {
        Auth::require();
        $id = (int)$p['id'];
        $this->db->execute("DELETE FROM projects WHERE id=?", [$id]);
        Response::json(['ok' => true]);
    }
}
