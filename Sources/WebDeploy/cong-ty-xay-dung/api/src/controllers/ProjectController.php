<?php
declare(strict_types=1);

class ProjectController
{
    public function __construct(private Database $db) {}

    public function index(array $p): void
    {
        Auth::require();
        $rows = $this->db->query(
            "SELECT pr.*, pc.name as category_name
             FROM projects pr
             LEFT JOIN project_categories pc ON pc.id = pr.category_id
             ORDER BY pr.sort_order, pr.id"
        );
        Response::json($rows);
    }

    public function show(array $p): void
    {
        Auth::require();
        $id  = (int)($p['id'] ?? 0);
        $row = $this->db->row(
            "SELECT pr.*, pc.name as category_name
             FROM projects pr
             LEFT JOIN project_categories pc ON pc.id = pr.category_id
             WHERE pr.id=?",
            [$id]
        );
        if (!$row) Response::notFound('Dự án không tìm thấy.');
        Response::json($row);
    }

    public function store(array $p): void
    {
        Auth::require();
        $b = bodyJson();

        if (empty($b['title'])) Response::error('Tên dự án không được để trống.');

        $slug = slugify($b['title']);
        $existing = $this->db->scalar("SELECT COUNT(*) FROM projects WHERE slug=?", [$slug]);
        if ($existing > 0) {
            $slug .= '-' . time();
        }

        $id = $this->db->execute(
            "INSERT INTO projects (category_id, title, slug, category, location, area, floors, duration, year, description, content, image, featured, sort_order, status)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
                $b['category_id']  ? (int)$b['category_id'] : null,
                $b['title'],
                $slug,
                $b['category']    ?? '',
                $b['location']    ?? '',
                $b['area']        ?? '',
                $b['floors']      ?? '',
                $b['duration']    ?? '',
                $b['year']        ?? '',
                $b['description'] ?? '',
                $b['content']     ?? '',
                $b['image']       ?? '',
                (int)($b['featured']   ?? 0),
                (int)($b['sort_order'] ?? 0),
                in_array($b['status'] ?? '', ['published', 'draft']) ? $b['status'] : 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void
    {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        $b  = bodyJson();

        if (empty($b['title'])) Response::error('Tên dự án không được để trống.');

        $this->db->execute(
            "UPDATE projects SET category_id=?, title=?, category=?, location=?, area=?, floors=?,
             duration=?, year=?, description=?, content=?, image=?, featured=?, sort_order=?, status=?
             WHERE id=?",
            [
                $b['category_id']  ? (int)$b['category_id'] : null,
                $b['title'],
                $b['category']    ?? '',
                $b['location']    ?? '',
                $b['area']        ?? '',
                $b['floors']      ?? '',
                $b['duration']    ?? '',
                $b['year']        ?? '',
                $b['description'] ?? '',
                $b['content']     ?? '',
                $b['image']       ?? '',
                (int)($b['featured']   ?? 0),
                (int)($b['sort_order'] ?? 0),
                in_array($b['status'] ?? '', ['published', 'draft']) ? $b['status'] : 'published',
                $id,
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void
    {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        $this->db->execute("DELETE FROM projects WHERE id=?", [$id]);
        Response::json(['ok' => true]);
    }

    // ── Project Categories ────────────────────────────────

    public function categories(array $p): void
    {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM project_categories ORDER BY sort_order, id");
        Response::json($rows);
    }

    public function storeCategory(array $p): void
    {
        Auth::require();
        $b = bodyJson();
        if (empty($b['name'])) Response::error('Tên danh mục không được để trống.');
        $slug = slugify($b['name']);
        $id = $this->db->execute(
            "INSERT INTO project_categories (name, slug, sort_order) VALUES (?,?,?)",
            [$b['name'], $slug, (int)($b['sort_order'] ?? 0)]
        );
        Response::json(['id' => $id], 201);
    }

    public function updateCategory(array $p): void
    {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        $b  = bodyJson();
        if (empty($b['name'])) Response::error('Tên danh mục không được để trống.');
        $this->db->execute(
            "UPDATE project_categories SET name=?, sort_order=? WHERE id=?",
            [$b['name'], (int)($b['sort_order'] ?? 0), $id]
        );
        Response::json(['ok' => true]);
    }

    public function destroyCategory(array $p): void
    {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        $this->db->execute("DELETE FROM project_categories WHERE id=?", [$id]);
        Response::json(['ok' => true]);
    }
}
