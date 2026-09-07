<?php
declare(strict_types=1);

// Gộp 3 danh sách icon+text ngắn (Vì sao chọn / Giá trị cốt lõi / Tiện ích) — filter theo ?section=
class ContentBlockController {
    private const SECTIONS = ['why-us', 'values', 'amenities'];

    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $section = $_GET['section'] ?? '';
        if ($section !== '' && in_array($section, self::SECTIONS, true)) {
            $items = $this->db->query("SELECT * FROM content_blocks WHERE section = ? ORDER BY sort_order, id", [$section]);
        } else {
            $items = $this->db->query("SELECT * FROM content_blocks ORDER BY section, sort_order, id");
        }
        Response::json($items);
    }

    public function show(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM content_blocks WHERE id = ?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($item);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title']) || empty($b['section']) || !in_array($b['section'], self::SECTIONS, true)) {
            Response::error('Tiêu đề và section hợp lệ là bắt buộc.'); return;
        }
        $id = $this->db->execute(
            "INSERT INTO content_blocks (section, icon, title, description, sort_order, status) VALUES (?, ?, ?, ?, ?, ?)",
            [$b['section'], $b['icon'] ?? '', $b['title'], $b['description'] ?? '', (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published']
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề là bắt buộc.'); return; }
        $this->db->execute(
            "UPDATE content_blocks SET icon=?, title=?, description=?, sort_order=?, status=? WHERE id=?",
            [$b['icon'] ?? '', $b['title'], $b['description'] ?? '', (int)($b['sort_order'] ?? 0), $b['status'] ?? 'published', $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM content_blocks WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
