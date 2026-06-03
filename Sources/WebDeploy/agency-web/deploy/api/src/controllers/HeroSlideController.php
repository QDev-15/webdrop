<?php
declare(strict_types=1);

class HeroSlideController
{
    public function __construct(private Database $db) {}

    public function index(array $p): void
    {
        Auth::require();
        $slides = $this->db->query("SELECT * FROM hero_slides ORDER BY sort_order, id");
        Response::json($slides);
    }

    public function show(array $p): void
    {
        Auth::require();
        $id = (int)$p['id'];
        $slide = $this->db->row("SELECT * FROM hero_slides WHERE id=?", [$id]);
        if (!$slide) Response::notFound('Slide không tồn tại.');
        Response::json($slide);
    }

    public function store(array $p): void
    {
        Auth::require();
        $b = bodyJson();

        if (empty($b['title'])) {
            Response::error('Tiêu đề không được để trống.');
        }

        $id = $this->db->execute(
            "INSERT INTO hero_slides
                (title, subtitle, badge_text, button_text, button_link, button2_text, button2_link,
                 image, stat1_num, stat1_label, stat2_num, stat2_label, stat3_num, stat3_label,
                 sort_order, status)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
                $b['title'],
                $b['subtitle']     ?? '',
                $b['badge_text']   ?? '',
                $b['button_text']  ?? '',
                $b['button_link']  ?? '',
                $b['button2_text'] ?? '',
                $b['button2_link'] ?? '',
                $b['image']        ?? '',
                $b['stat1_num']    ?? '',
                $b['stat1_label']  ?? '',
                $b['stat2_num']    ?? '',
                $b['stat2_label']  ?? '',
                $b['stat3_num']    ?? '',
                $b['stat3_label']  ?? '',
                (int)($b['sort_order'] ?? 0),
                $b['status']       ?? 'published',
            ]
        );

        Response::json(['id' => (int)$id], 201);
    }

    public function update(array $p): void
    {
        Auth::require();
        $id = (int)$p['id'];
        $b  = bodyJson();

        if (empty($b['title'])) {
            Response::error('Tiêu đề không được để trống.');
        }

        $this->db->execute(
            "UPDATE hero_slides SET
                title=?, subtitle=?, badge_text=?, button_text=?, button_link=?,
                button2_text=?, button2_link=?, image=?,
                stat1_num=?, stat1_label=?, stat2_num=?, stat2_label=?, stat3_num=?, stat3_label=?,
                sort_order=?, status=?
             WHERE id=?",
            [
                $b['title'],
                $b['subtitle']     ?? '',
                $b['badge_text']   ?? '',
                $b['button_text']  ?? '',
                $b['button_link']  ?? '',
                $b['button2_text'] ?? '',
                $b['button2_link'] ?? '',
                $b['image']        ?? '',
                $b['stat1_num']    ?? '',
                $b['stat1_label']  ?? '',
                $b['stat2_num']    ?? '',
                $b['stat2_label']  ?? '',
                $b['stat3_num']    ?? '',
                $b['stat3_label']  ?? '',
                (int)($b['sort_order'] ?? 0),
                $b['status']       ?? 'published',
                $id,
            ]
        );

        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void
    {
        Auth::require();
        $id = (int)$p['id'];
        $this->db->execute("DELETE FROM hero_slides WHERE id=?", [$id]);
        Response::json(['ok' => true]);
    }

    public function reorder(array $p): void
    {
        Auth::require();
        $b = bodyJson();
        $items = $b['items'] ?? [];

        foreach ($items as $item) {
            $this->db->execute(
                "UPDATE hero_slides SET sort_order=? WHERE id=?",
                [(int)($item['sort_order'] ?? 0), (int)($item['id'] ?? 0)]
            );
        }

        Response::json(['ok' => true]);
    }
}
