<?php
declare(strict_types=1);

class ServiceCategoryController {
    // GET /service-categories
    public static function index(array $params): void {
        Auth::require();
        $db = Database::getInstance();
        $rows = $db->query("SELECT * FROM service_categories ORDER BY sort_order ASC, name ASC");
        Response::json($rows);
    }

    // POST /service-categories
    public static function store(array $params): void {
        Auth::require();
        $db   = Database::getInstance();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        $name = trim($body['name'] ?? '');
        if (!$name) { Response::error('Tên danh mục không được trống.'); return; }

        $slug = $body['slug'] ?? self::makeSlug($name);

        try {
            $id = $db->execute(
                "INSERT INTO service_categories (name, slug, description, sort_order) VALUES (?,?,?,?)",
                [$name, $slug, $body['description'] ?? '', (int)($body['sort_order'] ?? 0)]
            );
            Response::json($db->queryOne("SELECT * FROM service_categories WHERE id = ?", [$id]), 201);
        } catch (PDOException $e) {
            if (str_contains($e->getMessage(), 'UNIQUE')) {
                Response::error('Slug đã tồn tại.', 409); return;
            }
            throw $e;
        }
    }

    // GET /service-categories/:id
    public static function show(array $params): void {
        Auth::require();
        $db  = Database::getInstance();
        $row = $db->queryOne("SELECT * FROM service_categories WHERE id = ?", [(int)$params['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    // POST /service-categories/:id/update
    public static function update(array $params): void {
        Auth::require();
        $db   = Database::getInstance();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $id   = (int)$params['id'];

        $row = $db->queryOne("SELECT * FROM service_categories WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }

        $allowed = ['name', 'slug', 'description', 'sort_order'];
        $sets = []; $vals = [];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $body)) { $sets[] = "$f = ?"; $vals[] = $body[$f]; }
        }
        if (!$sets) { Response::error('Không có dữ liệu cập nhật.'); return; }
        $vals[] = $id;
        try {
            $db->run("UPDATE service_categories SET " . implode(', ', $sets) . " WHERE id = ?", $vals);
        } catch (PDOException $e) {
            if (str_contains($e->getMessage(), 'UNIQUE')) {
                Response::error('Slug đã tồn tại.', 409); return;
            }
            throw $e;
        }
        Response::json($db->queryOne("SELECT * FROM service_categories WHERE id = ?", [$id]));
    }

    // POST /service-categories/:id/delete
    public static function destroy(array $params): void {
        Auth::require();
        $db  = Database::getInstance();
        $id  = (int)$params['id'];
        $row = $db->queryOne("SELECT id FROM service_categories WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        $db->run("UPDATE services SET category_id = NULL WHERE category_id = ?", [$id]);
        $db->run("DELETE FROM service_categories WHERE id = ?", [$id]);
        Response::json(['success' => true]);
    }

    private static function makeSlug(string $text): string {
        $text = mb_strtolower($text);
        $map  = ['à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a','ă'=>'a','ắ'=>'a','ặ'=>'a','ằ'=>'a','ẳ'=>'a','ẵ'=>'a','â'=>'a','ấ'=>'a','ầ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a','đ'=>'d','è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e','ê'=>'e','ế'=>'e','ề'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e','ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i','ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o','ô'=>'o','ố'=>'o','ồ'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o','ơ'=>'o','ớ'=>'o','ờ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o','ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u','ư'=>'u','ứ'=>'u','ừ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u','ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y'];
        $text = strtr($text, $map);
        return preg_replace('/[^a-z0-9]+/', '-', $text);
    }
}
