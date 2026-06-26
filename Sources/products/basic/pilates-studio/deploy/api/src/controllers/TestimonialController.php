<?php
declare(strict_types=1);

class TestimonialController {
    // GET /testimonials
    public static function index(array $params): void {
        Auth::require();
        $db = Database::getInstance();
        $rows = $db->query("SELECT * FROM testimonials ORDER BY sort_order ASC, id DESC");
        Response::json($rows);
    }

    // POST /testimonials
    public static function store(array $params): void {
        Auth::require();
        $db   = Database::getInstance();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        $name    = trim($body['name']    ?? '');
        $content = trim($body['content'] ?? '');
        if (!$name || !$content) {
            Response::error('Tên và nội dung đánh giá không được trống.');
            return;
        }

        $id = $db->execute(
            "INSERT INTO testimonials (name,role,avatar_url,content,rating,is_active,sort_order) VALUES (?,?,?,?,?,?,?)",
            [
                $name,
                $body['role']       ?? '',
                $body['avatar_url'] ?? '',
                $content,
                isset($body['rating'])     ? min(5, max(1, (int)$body['rating']))   : 5,
                isset($body['is_active'])  ? (int)(bool)$body['is_active']          : 1,
                isset($body['sort_order']) ? (int)$body['sort_order']               : 0,
            ]
        );
        Response::json($db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]), 201);
    }

    // GET /testimonials/:id
    public static function show(array $params): void {
        Auth::require();
        $db  = Database::getInstance();
        $row = $db->queryOne("SELECT * FROM testimonials WHERE id = ?", [(int)$params['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    // POST /testimonials/:id/update
    public static function update(array $params): void {
        Auth::require();
        $db   = Database::getInstance();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $id   = (int)$params['id'];

        $row = $db->queryOne("SELECT id FROM testimonials WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }

        $allowed = ['name','role','avatar_url','content','rating','is_active','sort_order'];
        $sets = []; $vals = [];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $body)) {
                $sets[] = "$f = ?";
                if (in_array($f, ['rating','is_active','sort_order'])) {
                    $vals[] = (int)$body[$f];
                } else {
                    $vals[] = $body[$f];
                }
            }
        }
        if (!$sets) { Response::error('Không có dữ liệu cập nhật.'); return; }
        $vals[] = $id;
        $db->run("UPDATE testimonials SET " . implode(', ', $sets) . " WHERE id = ?", $vals);
        Response::json($db->queryOne("SELECT * FROM testimonials WHERE id = ?", [$id]));
    }

    // POST /testimonials/:id/delete
    public static function destroy(array $params): void {
        Auth::require();
        $db  = Database::getInstance();
        $id  = (int)$params['id'];
        $row = $db->queryOne("SELECT id FROM testimonials WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        $db->run("DELETE FROM testimonials WHERE id = ?", [$id]);
        Response::json(['success' => true]);
    }
}
