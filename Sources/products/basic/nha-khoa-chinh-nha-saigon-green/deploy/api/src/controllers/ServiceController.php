<?php
declare(strict_types=1);

class ServiceController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT s.*, sc.name AS category_name
             FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             ORDER BY s.sort_order ASC, s.id ASC"
        );
        Response::json($rows);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        $name  = trim($b['name'] ?? '');
        $catId = (int)($b['category_id'] ?? 0);
        if (!$name || !$catId) {
            Response::error('Tên dịch vụ và danh mục không được để trống.'); return;
        }
        $slug = $this->makeSlug($name);
        if ($this->db->queryOne("SELECT id FROM services WHERE slug = ?", [$slug])) $slug .= '-' . time();

        $this->db->execute(
            "INSERT INTO services (category_id, name, slug, description, price_from, price_unit, duration, recovery, image, is_featured, sort_order, status)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
            [
                $catId, $name, $slug,
                trim($b['description'] ?? ''),
                (int)($b['price_from'] ?? 0),
                trim($b['price_unit'] ?? 'ca điều trị'),
                trim($b['duration'] ?? ''),
                trim($b['recovery'] ?? ''),
                trim($b['image'] ?? ''),
                (int)($b['is_featured'] ?? 0),
                (int)($b['sort_order'] ?? 0),
                in_array($b['status'] ?? '', ['published','draft']) ? $b['status'] : 'published',
            ]
        );
        $row = $this->db->queryOne("SELECT * FROM services WHERE id = ?", [$this->db->lastInsertId()]);
        Response::json($row, 201);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM services WHERE id = ?", [(int)$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function update(array $p): void {
        Auth::require();
        $b   = bodyJson();
        $id  = (int)$p['id'];
        $row = $this->db->queryOne("SELECT * FROM services WHERE id = ?", [$id]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }

        $this->db->execute(
            "UPDATE services SET category_id=?, name=?, description=?, price_from=?, price_unit=?,
             duration=?, recovery=?, image=?, is_featured=?, sort_order=?, status=? WHERE id=?",
            [
                (int)($b['category_id'] ?? $row['category_id']),
                trim($b['name'] ?? $row['name']),
                trim($b['description'] ?? $row['description']),
                (int)($b['price_from'] ?? $row['price_from']),
                trim($b['price_unit'] ?? $row['price_unit']),
                trim($b['duration'] ?? $row['duration']),
                trim($b['recovery'] ?? $row['recovery']),
                trim($b['image'] ?? $row['image']),
                (int)($b['is_featured'] ?? $row['is_featured']),
                (int)($b['sort_order'] ?? $row['sort_order']),
                in_array($b['status'] ?? '', ['published','draft']) ? $b['status'] : $row['status'],
                $id,
            ]
        );
        Response::json($this->db->queryOne("SELECT * FROM services WHERE id = ?", [$id]));
    }

    public function destroy(array $p): void {
        Auth::require();
        $id = (int)$p['id'];
        if (!$this->db->queryOne("SELECT id FROM services WHERE id = ?", [$id])) {
            Response::error('Không tìm thấy.', 404); return;
        }
        $this->db->execute("DELETE FROM services WHERE id = ?", [$id]);
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
            'ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u','ư'=>'u','ứ'=>'u','ừ'=>'u','ữ'=>'u','ự'=>'u',
            'ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y','đ'=>'d',
        ]);
        return preg_replace('/[^a-z0-9]+/', '-', $str);
    }
}
