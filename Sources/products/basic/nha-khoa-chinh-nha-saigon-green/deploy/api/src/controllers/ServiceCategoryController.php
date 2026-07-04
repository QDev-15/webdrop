<?php
declare(strict_types=1);

class ServiceCategoryController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT sc.*, (SELECT COUNT(*) FROM services s WHERE s.category_id = sc.id) AS service_count
             FROM service_categories sc ORDER BY sc.sort_order ASC, sc.id ASC"
        );
        Response::json($rows);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        if (!$name) { Response::error('Tên danh mục không được để trống.'); return; }
        $slug = $this->makeSlug($name);
        if ($this->db->queryOne("SELECT id FROM service_categories WHERE slug = ?", [$slug])) $slug .= '-' . time();

        $this->db->execute(
            "INSERT INTO service_categories (name, slug, description, icon_svg, sort_order) VALUES (?,?,?,?,?)",
            [$name, $slug, trim($b['description'] ?? ''), trim($b['icon_svg'] ?? ''), (int)($b['sort_order'] ?? 0)]
        );
        $row = $this->db->queryOne("SELECT * FROM service_categories WHERE id = ?", [$this->db->lastInsertId()]);
        Response::json($row, 201);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM service_categories WHERE id = ?", [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function update(array $p): void {
        Auth::require();
        $b   = bodyJson();
        $id  = (int)$p['id'];
        $row = $this->db->queryOne("SELECT * FROM service_categories WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }

        $name = trim($b['name'] ?? $row['name']);
        $this->db->execute(
            "UPDATE service_categories SET name=?, description=?, icon_svg=?, sort_order=? WHERE id=?",
            [$name, trim($b['description'] ?? $row['description']), trim($b['icon_svg'] ?? $row['icon_svg']),
             (int)($b['sort_order'] ?? $row['sort_order']), $id]
        );
        Response::json($this->db->queryOne("SELECT * FROM service_categories WHERE id = ?", [$id]));
    }

    public function destroy(array $p): void {
        Auth::require();
        $id = (int)$p['id'];
        if (!$this->db->queryOne("SELECT id FROM service_categories WHERE id = ?", [$id])) {
            Response::error('Không tìm thấy.', 404); return;
        }
        $this->db->execute("DELETE FROM service_categories WHERE id = ?", [$id]);
        Response::json(['ok' => true]);
    }

    private function makeSlug(string $str): string {
        $str = mb_strtolower($str);
        $str = strtr($str, [
            'à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a','ă'=>'a','ắ'=>'a','ặ'=>'a','ẵ'=>'a','ằ'=>'a','ẳ'=>'a',
            'â'=>'a','ấ'=>'a','ầ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a',
            'è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e','ê'=>'e','ế'=>'e','ề'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e',
            'ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i',
            'ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o','ô'=>'o','ố'=>'o','ồ'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o',
            'ơ'=>'o','ớ'=>'o','ờ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o',
            'ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u','ư'=>'u','ứ'=>'u','ừ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u',
            'ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y','đ'=>'d',
        ]);
        return preg_replace('/[^a-z0-9]+/', '-', $str);
    }
}
