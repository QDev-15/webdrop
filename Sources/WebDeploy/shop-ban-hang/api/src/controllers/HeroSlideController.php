<?php
declare(strict_types=1);

class HeroSlideController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $slides = $this->db->query(
            "SELECT *, btn_text AS button_text, btn_link AS button_link,
                    CASE WHEN is_active=1 THEN 'published' ELSE 'draft' END AS status
             FROM hero_slides ORDER BY sort_order, id"
        );
        Response::json($slides);
    }

    public function show(array $p): void {
        Auth::require();
        $slide = $this->db->queryOne(
            "SELECT *, btn_text AS button_text, btn_link AS button_link,
                    CASE WHEN is_active=1 THEN 'published' ELSE 'draft' END AS status
             FROM hero_slides WHERE id = ?",
            [$p['id']]
        );
        if (!$slide) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($slide);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề là bắt buộc.'); return; }
        $isActive = isset($b['status']) ? ($b['status'] === 'published' ? 1 : 0) : 1;
        $id = $this->db->execute(
            "INSERT INTO hero_slides (title, subtitle, btn_text, btn_link, image, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [$b['title'], $b['subtitle'] ?? '', $b['button_text'] ?? '', $b['button_link'] ?? '',
             $b['image'] ?? '', (int)($b['sort_order'] ?? 0), $isActive]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề là bắt buộc.'); return; }
        $isActive = isset($b['status']) ? ($b['status'] === 'published' ? 1 : 0) : 1;
        $this->db->execute(
            "UPDATE hero_slides SET title=?, subtitle=?, btn_text=?, btn_link=?, image=?, sort_order=?, is_active=? WHERE id=?",
            [$b['title'], $b['subtitle'] ?? '', $b['button_text'] ?? '', $b['button_link'] ?? '',
             $b['image'] ?? '', (int)($b['sort_order'] ?? 0), $isActive, $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM hero_slides WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }

    public function reorder(array $p): void {
        Auth::require();
        $b = bodyJson();
        $ids = $b['ids'] ?? [];
        foreach ($ids as $order => $id) {
            $this->db->execute("UPDATE hero_slides SET sort_order = ? WHERE id = ?", [$order, $id]);
        }
        Response::json(['ok' => true]);
    }
}
