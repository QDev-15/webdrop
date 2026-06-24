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
        $slide = $this->db->queryOne("SELECT * FROM hero_slides WHERE id = ?", [(int)$p['id']]);
        if (!$slide) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($slide);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề là bắt buộc.', 422); return; }
        $id = $this->db->execute(
            "INSERT INTO hero_slides (title, subtitle, badge_text, btn_label, btn_url, image, sort_order, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                trim($b['title']),
                trim($b['subtitle'] ?? ''),
                trim($b['badge_text'] ?? ''),
                trim($b['btn_label'] ?? ''),
                trim($b['btn_url'] ?? ''),
                trim($b['image'] ?? ''),
                (int)($b['sort_order'] ?? 0),
                (int)($b['is_active'] ?? 1),
            ]
        );
        $row = $this->db->queryOne("SELECT * FROM hero_slides WHERE id = ?", [$id]);
        Response::json($row, 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề là bắt buộc.', 422); return; }
        $this->db->execute(
            "UPDATE hero_slides SET title=?, subtitle=?, badge_text=?, btn_label=?, btn_url=?, image=?, sort_order=?, is_active=? WHERE id=?",
            [
                trim($b['title']),
                trim($b['subtitle'] ?? ''),
                trim($b['badge_text'] ?? ''),
                trim($b['btn_label'] ?? ''),
                trim($b['btn_url'] ?? ''),
                trim($b['image'] ?? ''),
                (int)($b['sort_order'] ?? 0),
                (int)($b['is_active'] ?? 1),
                (int)$p['id'],
            ]
        );
        $row = $this->db->queryOne("SELECT * FROM hero_slides WHERE id = ?", [(int)$p['id']]);
        Response::json($row);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM hero_slides WHERE id = ?", [(int)$p['id']]);
        Response::json(['ok' => true]);
    }
}
