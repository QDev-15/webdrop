<?php

class CaseController {
    private Database $db;
    public function __construct(Database $db) { $this->db = $db; }

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM cases ORDER BY sort_order, year DESC, id");
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM cases WHERE id=?", [$p['id']]);
        if (!$item) Response::notFound();
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) Response::error('Tiêu đề không được để trống');
        $slug = $this->uniqueSlug(slugify($b['title']));
        $id = $this->db->execute(
            "INSERT INTO cases (title, slug, category, summary, outcome, year, location, sort_order, status,
                client_name, practice_area, duration_text, scope_text, result_headline,
                challenge, solution, gallery_images, stats, testimonial_content, testimonial_author, testimonial_title)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $b['title'],
                $slug,
                $b['category']   ?? '',
                $b['summary']    ?? '',
                $b['outcome']    ?? '',
                (int)($b['year'] ?? date('Y')),
                $b['location']   ?? '',
                (int)($b['sort_order'] ?? 0),
                $b['status']     ?? 'published',
                $b['client_name']         ?? '',
                $b['practice_area']       ?? '',
                $b['duration_text']       ?? '',
                $b['scope_text']          ?? '',
                $b['result_headline']     ?? '',
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
        if (empty($b['title'])) Response::error('Tiêu đề không được để trống');
        // Slug được sinh 1 lần duy nhất lúc tạo mới — không đổi khi sửa title, tránh vỡ link đã chia sẻ.
        $this->db->execute(
            "UPDATE cases SET title=?, category=?, summary=?, outcome=?, year=?, location=?, sort_order=?, status=?,
                client_name=?, practice_area=?, duration_text=?, scope_text=?, result_headline=?,
                challenge=?, solution=?, gallery_images=?, stats=?, testimonial_content=?, testimonial_author=?, testimonial_title=?
             WHERE id=?",
            [
                $b['title'],
                $b['category']   ?? '',
                $b['summary']    ?? '',
                $b['outcome']    ?? '',
                (int)($b['year'] ?? date('Y')),
                $b['location']   ?? '',
                (int)($b['sort_order'] ?? 0),
                $b['status']     ?? 'published',
                $b['client_name']         ?? '',
                $b['practice_area']       ?? '',
                $b['duration_text']       ?? '',
                $b['scope_text']          ?? '',
                $b['result_headline']     ?? '',
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
        $this->db->execute("DELETE FROM cases WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }

    // Đảm bảo slug duy nhất trong bảng cases — thêm hậu tố -2, -3... nếu đã tồn tại.
    private function uniqueSlug(string $base): string {
        if ($base === '') $base = 'vu-viec';
        $slug = $base;
        $n = 2;
        while ((int)$this->db->scalar("SELECT COUNT(*) FROM cases WHERE slug=?", [$slug]) > 0) {
            $slug = $base . '-' . $n;
            $n++;
        }
        return $slug;
    }
}
