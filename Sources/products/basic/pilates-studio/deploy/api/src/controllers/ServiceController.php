<?php
declare(strict_types=1);

class ServiceController {
    // GET /services
    public static function index(array $params): void {
        Auth::require();
        $db = Database::getInstance();
        $rows = $db->query(
            "SELECT s.*, sc.name AS category_name
             FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             ORDER BY s.sort_order ASC, s.name ASC"
        );
        Response::json($rows);
    }

    // POST /services
    public static function store(array $params): void {
        Auth::require();
        $db   = Database::getInstance();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        $name = trim($body['name'] ?? '');
        if (!$name) { Response::error('Tên dịch vụ không được trống.'); return; }

        $slug = $body['slug'] ?? self::makeSlug($name);

        try {
            $id = $db->execute(
                "INSERT INTO services (category_id,name,slug,description,duration_min,max_students,level,price_per_session,image_url,tag,is_featured,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                [
                    $body['category_id'] ? (int)$body['category_id'] : null,
                    $name,
                    $slug,
                    $body['description'] ?? '',
                    isset($body['duration_min'])      ? (int)$body['duration_min']      : null,
                    isset($body['max_students'])      ? (int)$body['max_students']      : null,
                    $body['level']          ?? '',
                    isset($body['price_per_session']) ? (int)$body['price_per_session'] : null,
                    $body['image_url']      ?? '',
                    $body['tag']            ?? '',
                    isset($body['is_featured'])       ? (int)(bool)$body['is_featured'] : 0,
                    isset($body['sort_order'])        ? (int)$body['sort_order']        : 0,
                ]
            );
            Response::json(self::findOne($id), 201);
        } catch (PDOException $e) {
            if (str_contains($e->getMessage(), 'UNIQUE')) {
                Response::error('Slug đã tồn tại.', 409); return;
            }
            throw $e;
        }
    }

    // GET /services/:id
    public static function show(array $params): void {
        Auth::require();
        $row = self::findOne((int)$params['id']);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    // POST /services/:id/update
    public static function update(array $params): void {
        Auth::require();
        $db   = Database::getInstance();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $id   = (int)$params['id'];

        if (!self::findOne($id)) { Response::error('Không tìm thấy.', 404); return; }

        $allowed = ['category_id','name','slug','description','duration_min','max_students','level','price_per_session','image_url','tag','is_featured','sort_order'];
        $sets = []; $vals = [];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $body)) {
                $sets[] = "$f = ?";
                if (in_array($f, ['category_id','duration_min','max_students','price_per_session','sort_order'])) {
                    $vals[] = $body[$f] !== null && $body[$f] !== '' ? (int)$body[$f] : null;
                } elseif ($f === 'is_featured') {
                    $vals[] = (int)(bool)$body[$f];
                } else {
                    $vals[] = $body[$f];
                }
            }
        }
        if (!$sets) { Response::error('Không có dữ liệu cập nhật.'); return; }
        $vals[] = $id;
        try {
            $db->run("UPDATE services SET " . implode(', ', $sets) . " WHERE id = ?", $vals);
        } catch (PDOException $e) {
            if (str_contains($e->getMessage(), 'UNIQUE')) {
                Response::error('Slug đã tồn tại.', 409); return;
            }
            throw $e;
        }
        Response::json(self::findOne($id));
    }

    // POST /services/:id/delete
    public static function destroy(array $params): void {
        Auth::require();
        $db  = Database::getInstance();
        $id  = (int)$params['id'];
        if (!self::findOne($id)) { Response::error('Không tìm thấy.', 404); return; }
        $db->run("DELETE FROM services WHERE id = ?", [$id]);
        Response::json(['success' => true]);
    }

    private static function findOne(int $id): ?array {
        return Database::getInstance()->queryOne(
            "SELECT s.*, sc.name AS category_name
             FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             WHERE s.id = ?",
            [$id]
        );
    }

    private static function makeSlug(string $text): string {
        $text = mb_strtolower($text);
        $map  = ['à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a','ă'=>'a','ắ'=>'a','ặ'=>'a','ằ'=>'a','ẳ'=>'a','ẵ'=>'a','â'=>'a','ấ'=>'a','ầ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a','đ'=>'d','è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e','ê'=>'e','ế'=>'e','ề'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e','ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i','ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o','ô'=>'o','ố'=>'o','ồ'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o','ơ'=>'o','ớ'=>'o','ờ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o','ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u','ư'=>'u','ứ'=>'u','ừ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u','ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y'];
        $text = strtr($text, $map);
        return preg_replace('/[^a-z0-9]+/', '-', $text);
    }
}
