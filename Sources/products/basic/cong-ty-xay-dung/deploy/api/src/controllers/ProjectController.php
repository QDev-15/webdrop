<?php
declare(strict_types=1);

class ProjectController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $category = $_GET['category'] ?? '';
        $sql = "SELECT * FROM projects";
        $params = [];
        if ($category) { $sql .= " WHERE category = ?"; $params[] = $category; }
        $sql .= " ORDER BY sort_order, id";
        Response::json($this->db->query($sql, $params));
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên dự án không được để trống.'); return; }
        $slug = slugify($name);
        $id = $this->db->execute(
            "INSERT INTO projects (name, slug, category, description, location, year_completed, area, floors, duration, value, image, featured, sort_order, status, investor_name, project_type_label, scale_text, result_summary, challenge, solution, gallery_images, stats, testimonial_content, testimonial_author, testimonial_title) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $name, $slug, $b['category'] ?? '', $b['description'] ?? '', $b['location'] ?? '', $b['year_completed'] ?? '', $b['area'] ?? '', $b['floors'] ?? '', $b['duration'] ?? '', $b['value'] ?? '', $b['image'] ?? '', $b['featured'] ?? 0, $b['sort_order'] ?? 0, $b['status'] ?? 'published',
                $b['investor_name']       ?? '',
                $b['project_type_label']  ?? '',
                $b['scale_text']          ?? '',
                $b['result_summary']      ?? '',
                $b['challenge']           ?? '',
                $b['solution']            ?? '',
                $b['gallery_images']      ?? '',
                $b['stats']               ?? '',
                $b['testimonial_content'] ?? '',
                $b['testimonial_author']  ?? '',
                $b['testimonial_title']   ?? '',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE projects SET name=?, category=?, description=?, location=?, year_completed=?, area=?, floors=?, duration=?, value=?, image=?, featured=?, sort_order=?, status=?, investor_name=?, project_type_label=?, scale_text=?, result_summary=?, challenge=?, solution=?, gallery_images=?, stats=?, testimonial_content=?, testimonial_author=?, testimonial_title=? WHERE id=?",
            [
                $b['name'] ?? '', $b['category'] ?? '', $b['description'] ?? '', $b['location'] ?? '', $b['year_completed'] ?? '', $b['area'] ?? '', $b['floors'] ?? '', $b['duration'] ?? '', $b['value'] ?? '', $b['image'] ?? '', $b['featured'] ?? 0, $b['sort_order'] ?? 0, $b['status'] ?? 'published',
                $b['investor_name']       ?? '',
                $b['project_type_label']  ?? '',
                $b['scale_text']          ?? '',
                $b['result_summary']      ?? '',
                $b['challenge']           ?? '',
                $b['solution']            ?? '',
                $b['gallery_images']      ?? '',
                $b['stats']               ?? '',
                $b['testimonial_content'] ?? '',
                $b['testimonial_author']  ?? '',
                $b['testimonial_title']   ?? '',
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM projects WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
