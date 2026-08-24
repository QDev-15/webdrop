<?php
declare(strict_types=1);

class ProjectController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM projects ORDER BY sort_order, id");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM projects WHERE id=?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề không được để trống.'); return; }
        $slug = !empty($b['slug']) ? slugify($b['slug']) : slugify($b['title']);
        $id = $this->db->execute(
            "INSERT INTO projects (title, slug, category, description, image, year, client_name, role_text, publication_type, duration, illustration_count, challenge, process_heading, process_steps, gallery_images, result_summary, result_stats, testimonial_content, testimonial_author, testimonial_role, testimonial_avatar, featured, sort_order, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
                $b['title'], $slug, $b['category'] ?? '', $b['description'] ?? '', $b['image'] ?? '', $b['year'] ?? '',
                $b['client_name'] ?? '', $b['role_text'] ?? '', $b['publication_type'] ?? '', $b['duration'] ?? '', $b['illustration_count'] ?? '',
                $b['challenge'] ?? '', $b['process_heading'] ?? '', $b['process_steps'] ?? '',
                $b['gallery_images'] ?? '', $b['result_summary'] ?? '', $b['result_stats'] ?? '',
                $b['testimonial_content'] ?? '', $b['testimonial_author'] ?? '', $b['testimonial_role'] ?? '', $b['testimonial_avatar'] ?? '',
                (int)($b['featured'] ?? 0), (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published',
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề không được để trống.'); return; }
        $slug = !empty($b['slug']) ? slugify($b['slug']) : slugify($b['title']);
        $this->db->execute(
            "UPDATE projects SET title=?, slug=?, category=?, description=?, image=?, year=?, client_name=?, role_text=?, publication_type=?, duration=?, illustration_count=?, challenge=?, process_heading=?, process_steps=?, gallery_images=?, result_summary=?, result_stats=?, testimonial_content=?, testimonial_author=?, testimonial_role=?, testimonial_avatar=?, featured=?, sort_order=?, status=? WHERE id=?",
            [
                $b['title'], $slug, $b['category'] ?? '', $b['description'] ?? '', $b['image'] ?? '', $b['year'] ?? '',
                $b['client_name'] ?? '', $b['role_text'] ?? '', $b['publication_type'] ?? '', $b['duration'] ?? '', $b['illustration_count'] ?? '',
                $b['challenge'] ?? '', $b['process_heading'] ?? '', $b['process_steps'] ?? '',
                $b['gallery_images'] ?? '', $b['result_summary'] ?? '', $b['result_stats'] ?? '',
                $b['testimonial_content'] ?? '', $b['testimonial_author'] ?? '', $b['testimonial_role'] ?? '', $b['testimonial_avatar'] ?? '',
                (int)($b['featured'] ?? 0), (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published', $p['id'],
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
