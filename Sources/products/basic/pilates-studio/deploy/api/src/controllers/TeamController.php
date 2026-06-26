<?php
declare(strict_types=1);

class TeamController {
    // GET /team
    public static function index(array $params): void {
        Auth::require();
        $db = Database::getInstance();
        $rows = $db->query("SELECT * FROM team ORDER BY sort_order ASC, id ASC");
        Response::json($rows);
    }

    // POST /team
    public static function store(array $params): void {
        Auth::require();
        $db   = Database::getInstance();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        $name = trim($body['name'] ?? '');
        if (!$name) { Response::error('Tên không được trống.'); return; }

        $id = $db->execute(
            "INSERT INTO team (name,role,cert,bio,image_url,tags,sort_order,is_active) VALUES (?,?,?,?,?,?,?,?)",
            [
                $name,
                $body['role']       ?? '',
                $body['cert']       ?? '',
                $body['bio']        ?? '',
                $body['image_url']  ?? '',
                $body['tags']       ?? '',
                isset($body['sort_order']) ? (int)$body['sort_order'] : 0,
                isset($body['is_active'])  ? (int)(bool)$body['is_active'] : 1,
            ]
        );
        Response::json($db->queryOne("SELECT * FROM team WHERE id = ?", [$id]), 201);
    }

    // GET /team/:id
    public static function show(array $params): void {
        Auth::require();
        $db  = Database::getInstance();
        $row = $db->queryOne("SELECT * FROM team WHERE id = ?", [(int)$params['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    // POST /team/:id/update
    public static function update(array $params): void {
        Auth::require();
        $db   = Database::getInstance();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $id   = (int)$params['id'];

        $row = $db->queryOne("SELECT id FROM team WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }

        $allowed = ['name','role','cert','bio','image_url','tags','sort_order','is_active'];
        $sets = []; $vals = [];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $body)) {
                $sets[] = "$f = ?";
                if (in_array($f, ['sort_order','is_active'])) {
                    $vals[] = (int)$body[$f];
                } else {
                    $vals[] = $body[$f];
                }
            }
        }
        if (!$sets) { Response::error('Không có dữ liệu cập nhật.'); return; }
        $vals[] = $id;
        $db->run("UPDATE team SET " . implode(', ', $sets) . " WHERE id = ?", $vals);
        Response::json($db->queryOne("SELECT * FROM team WHERE id = ?", [$id]));
    }

    // POST /team/:id/delete
    public static function destroy(array $params): void {
        Auth::require();
        $db  = Database::getInstance();
        $id  = (int)$params['id'];
        $row = $db->queryOne("SELECT id FROM team WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        $db->run("DELETE FROM team WHERE id = ?", [$id]);
        Response::json(['success' => true]);
    }
}
