<?php
declare(strict_types=1);

class HeroSlideController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $slides = $this->db->query("SELECT * FROM hero_slides ORDER BY sort_order, id");
        Response::json($slides);
    }

    public function show(array $p): void {
        Auth::require();
        $slide = $this->db->queryOne("SELECT * FROM hero_slides WHERE id = ?", [$p['id']]);
        if (!$slide) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($slide);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề là bắt buộc.'); return; }
        $this->db->execute(
            "INSERT INTO hero_slides (title, subtitle, btn_text, btn_url, image, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                $b['title'],
                $b['subtitle']    ?? '',
                $b['btn_text']    ?? '',
                $b['btn_url']     ?? '',
                $b['image']       ?? '',
                (int)($b['sort_order'] ?? 0),
                isset($b['is_active']) ? (int)$b['is_active'] : 1,
            ]
        );
        $id  = $this->db->lastInsertId();
        $row = $this->db->queryOne("SELECT * FROM hero_slides WHERE id = ?", [$id]);
        Response::json($row, 201);
    }

    public function update(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM hero_slides WHERE id = ?", [$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE hero_slides SET title=?, subtitle=?, btn_text=?, btn_url=?, image=?, sort_order=?, is_active=? WHERE id=?",
            [
                $b['title'],
                $b['subtitle']    ?? $row['subtitle'],
                $b['btn_text']    ?? $row['btn_text'],
                $b['btn_url']     ?? $row['btn_url'],
                $b['image']       ?? $row['image'],
                isset($b['sort_order']) ? (int)$b['sort_order'] : (int)$row['sort_order'],
                isset($b['is_active'])  ? (int)$b['is_active']  : (int)$row['is_active'],
                $p['id'],
            ]
        );
        $updated = $this->db->queryOne("SELECT * FROM hero_slides WHERE id = ?", [$p['id']]);
        Response::json($updated);
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
