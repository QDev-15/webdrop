<?php
declare(strict_types=1);

class ProjectController {
    private const FIELDS = [
        'title', 'slug', 'category', 'image', 'short_desc', 'year', 'has_case_study',
        'client_name', 'hero_desc', 'industry', 'duration', 'services_provided', 'key_result',
        'challenge_title', 'challenge_intro', 'challenge_details',
        'solution_items', 'gallery_images', 'results_note', 'results_items',
        'testimonial_content', 'testimonial_author', 'testimonial_role',
        'featured', 'sort_order', 'status',
    ];

    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM projects ORDER BY sort_order, id");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM projects WHERE id=?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy dự án.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề không được để trống.'); return; }
        $slug = !empty($b['slug']) ? slugify($b['slug']) : slugify($b['title']);

        $cols = self::FIELDS;
        $placeholders = implode(',', array_fill(0, count($cols), '?'));
        $values = $this->extractValues($b, $slug);

        $id = $this->db->execute(
            "INSERT INTO projects (" . implode(',', $cols) . ") VALUES ($placeholders)",
            $values
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề không được để trống.'); return; }
        $slug = !empty($b['slug']) ? slugify($b['slug']) : slugify($b['title']);

        $cols = self::FIELDS;
        $setClause = implode(',', array_map(fn($c) => "$c=?", $cols));
        $values = $this->extractValues($b, $slug);
        $values[] = $p['id'];

        $this->db->execute("UPDATE projects SET $setClause WHERE id=?", $values);
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM projects WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }

    private function extractValues(array $b, string $slug): array {
        $values = [];
        foreach (self::FIELDS as $col) {
            if ($col === 'slug') { $values[] = $slug; continue; }
            if ($col === 'has_case_study' || $col === 'featured') { $values[] = (int)($b[$col] ?? 0); continue; }
            if ($col === 'sort_order') { $values[] = (int)($b[$col] ?? 0); continue; }
            if ($col === 'status') { $values[] = $b[$col] ?? 'published'; continue; }
            $values[] = $b[$col] ?? '';
        }
        return $values;
    }
}
