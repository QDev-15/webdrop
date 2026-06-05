<?php
declare(strict_types=1);

class ServiceController
{
    public function __construct(private Database $db) {}

    public function index(array $p): void
    {
        Auth::require();
        $services = $this->db->query("SELECT * FROM services ORDER BY sort_order, id");
        Response::json($services);
    }

    public function show(array $p): void
    {
        Auth::require();
        $id = (int)$p['id'];
        $service = $this->db->row("SELECT * FROM services WHERE id=?", [$id]);
        if (!$service) Response::notFound('Dịch vụ không tồn tại.');
        Response::json($service);
    }

    public function store(array $p): void
    {
        Auth::require();
        $b = bodyJson();

        if (empty($b['name'])) {
            Response::error('Tên dịch vụ không được để trống.');
        }

        $slug = slugify($b['slug'] ?? $b['name']);

        $id = $this->db->execute(
            "INSERT INTO services (name, slug, number, description, content, icon, tags, price_text, featured, sort_order, status)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            [
                $b['name'],
                $slug,
                $b['number']      ?? '',
                $b['description'] ?? '',
                $b['content']     ?? '',
                $b['icon']        ?? '',
                $b['tags']        ?? '',
                $b['price_text']  ?? '',
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

        if (empty($b['name'])) {
            Response::error('Tên dịch vụ không được để trống.');
        }

        $this->db->execute(
            "UPDATE services SET name=?, number=?, description=?, content=?, icon=?,
             tags=?, price_text=?, featured=?, sort_order=?, status=? WHERE id=?",
            [
                $b['name'],
                $b['number']      ?? '',
                $b['description'] ?? '',
                $b['content']     ?? '',
                $b['icon']        ?? '',
                $b['tags']        ?? '',
                $b['price_text']  ?? '',
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
        $this->db->execute("DELETE FROM services WHERE id=?", [$id]);
        Response::json(['ok' => true]);
    }
}
