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
        $id = $this->db->execute(
            "INSERT INTO projects (title, slug, category, description, image, tags, client_name, featured, sort_order, status, year, duration, scope_text, result_summary, challenge, solution, gallery_images, stats, testimonial_content, testimonial_author, testimonial_title, testimonial_avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [$b['title'], slugify($b['title']), $b['category'] ?? '', $b['description'] ?? '', $b['image'] ?? '', $b['tags'] ?? '', $b['client_name'] ?? '', $b['featured'] ?? 0, $b['sort_order'] ?? 0, $b['status'] ?? 'published',
             $b['year'] ?? '', $b['duration'] ?? '', $b['scope_text'] ?? '', $b['result_summary'] ?? '', $b['challenge'] ?? '', $b['solution'] ?? '', $b['gallery_images'] ?? '', $b['stats'] ?? '', $b['testimonial_content'] ?? '', $b['testimonial_author'] ?? '', $b['testimonial_title'] ?? '', $b['testimonial_avatar'] ?? '']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $this->db->execute(
            "UPDATE projects SET title=?, category=?, description=?, image=?, tags=?, client_name=?, featured=?, sort_order=?, status=?, year=?, duration=?, scope_text=?, result_summary=?, challenge=?, solution=?, gallery_images=?, stats=?, testimonial_content=?, testimonial_author=?, testimonial_title=?, testimonial_avatar=? WHERE id=?",
            [$b['title'] ?? '', $b['category'] ?? '', $b['description'] ?? '', $b['image'] ?? '', $b['tags'] ?? '', $b['client_name'] ?? '', $b['featured'] ?? 0, $b['sort_order'] ?? 0, $b['status'] ?? 'published',
             $b['year'] ?? '', $b['duration'] ?? '', $b['scope_text'] ?? '', $b['result_summary'] ?? '', $b['challenge'] ?? '', $b['solution'] ?? '', $b['gallery_images'] ?? '', $b['stats'] ?? '', $b['testimonial_content'] ?? '', $b['testimonial_author'] ?? '', $b['testimonial_title'] ?? '', $b['testimonial_avatar'] ?? '', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM projects WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
