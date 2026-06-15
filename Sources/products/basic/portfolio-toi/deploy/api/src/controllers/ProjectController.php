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
        $item = $this->db->queryOne("SELECT * FROM projects WHERE id = ?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề là bắt buộc.'); return; }
        $slug = $this->makeSlug($b['title']);
        $id = $this->db->execute(
            "INSERT INTO projects (title, slug, category, description, content, image, tags, project_url, github_url, featured, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [$b['title'], $slug, $b['category'] ?? '', $b['description'] ?? '', $b['content'] ?? '',
             $b['image'] ?? '', $b['tags'] ?? '', $b['project_url'] ?? '', $b['github_url'] ?? '',
             (int)($b['featured'] ?? 0), (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE projects SET title=?, category=?, description=?, content=?, image=?, tags=?, project_url=?, github_url=?, featured=?, sort_order=?, status=? WHERE id=?",
            [$b['title'], $b['category'] ?? '', $b['description'] ?? '', $b['content'] ?? '',
             $b['image'] ?? '', $b['tags'] ?? '', $b['project_url'] ?? '', $b['github_url'] ?? '',
             (int)($b['featured'] ?? 0), (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM projects WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }

    private function makeSlug(string $text): string {
        $text = mb_strtolower($text, 'UTF-8');
        $text = preg_replace('/[àáảãạăắặẵặầẫẩấậâ]/u', 'a', $text);
        $text = preg_replace('/[đ]/u', 'd', $text);
        $text = preg_replace('/[èéẻẽẹêếệềểễ]/u', 'e', $text);
        $text = preg_replace('/[ìíỉĩị]/u', 'i', $text);
        $text = preg_replace('/[òóỏõọôốộồổỗơớợờởỡ]/u', 'o', $text);
        $text = preg_replace('/[ùúủũụưứựừửữ]/u', 'u', $text);
        $text = preg_replace('/[ỳýỷỹỵ]/u', 'y', $text);
        $text = preg_replace('/[^a-z0-9\s-]/', '', $text ?? '');
        $text = preg_replace('/[\s-]+/', '-', trim($text ?? ''));
        return $text ?: 'project-' . time();
    }
}
