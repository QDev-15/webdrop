<?php
declare(strict_types=1);

class ServiceController
{
    public function __construct(private Database $db) {}

    public function index(array $p): void
    {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM services ORDER BY sort_order, id");
        Response::json($rows);
    }

    public function show(array $p): void
    {
        Auth::require();
        $id  = (int)($p['id'] ?? 0);
        $row = $this->db->row("SELECT * FROM services WHERE id=?", [$id]);
        if (!$row) Response::notFound('Dịch vụ không tìm thấy.');
        Response::json($row);
    }

    public function store(array $p): void
    {
        Auth::require();
        $b = bodyJson();

        if (empty($b['name'])) Response::error('Tên dịch vụ không được để trống.');

        $slug = slugify($b['name']);
        // Đảm bảo slug duy nhất
        $existing = $this->db->scalar("SELECT COUNT(*) FROM services WHERE slug=?", [$slug]);
        if ($existing > 0) {
            $slug .= '-' . time();
        }

        $id = $this->db->execute(
            "INSERT INTO services (name, slug, number, description, content, icon_svg, image, anchor_id, featured, sort_order, status)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            [
                $b['name'],
                $slug,
                $b['number']     ?? '',
                $b['description'] ?? '',
                $b['content']    ?? '',
                $b['icon_svg']   ?? '',
                $b['image']      ?? '',
                $b['anchor_id']  ?? '',
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

        if (empty($b['name'])) Response::error('Tên dịch vụ không được để trống.');

        $this->db->execute(
            "UPDATE services SET name=?, number=?, description=?, content=?, icon_svg=?, image=?,
             anchor_id=?, featured=?, sort_order=?, status=? WHERE id=?",
            [
                $b['name'],
                $b['number']     ?? '',
                $b['description'] ?? '',
                $b['content']    ?? '',
                $b['icon_svg']   ?? '',
                $b['image']      ?? '',
                $b['anchor_id']  ?? '',
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
        $this->db->execute("DELETE FROM services WHERE id=?", [$id]);
        Response::json(['ok' => true]);
    }
}
