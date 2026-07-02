<?php
declare(strict_types=1);

class ServiceCategoryController {
    public function __construct(private Database $db) {}

    /** GET /service-categories */
    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query(
            "SELECT * FROM service_categories ORDER BY sort_order, id"
        );
        Response::json($rows);
    }

    /** POST /service-categories */
    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();

        if (empty($b['name'])) {
            Response::error('Tên danh mục là bắt buộc.');
            return;
        }

        $name  = trim($b['name']);
        $slug  = $b['slug'] ?? $this->makeSlug($name);
        $order = (int)($b['sort_order'] ?? 0);

        $id = $this->db->execute(
            "INSERT INTO service_categories (name, slug, sort_order) VALUES (?, ?, ?)",
            [$name, $slug, $order]
        );
        Response::json(['id' => $id], 201);
    }

    /** POST /service-categories/:id/update */
    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();

        if (empty($b['name'])) {
            Response::error('Tên danh mục là bắt buộc.');
            return;
        }

        $name  = trim($b['name']);
        $slug  = $b['slug'] ?? $this->makeSlug($name);
        $order = (int)($b['sort_order'] ?? 0);

        $this->db->execute(
            "UPDATE service_categories SET name = ?, slug = ?, sort_order = ? WHERE id = ?",
            [$name, $slug, $order, $p['id']]
        );
        Response::json(['ok' => true]);
    }

    /** POST /service-categories/:id/delete */
    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute(
            "DELETE FROM service_categories WHERE id = ?",
            [$p['id']]
        );
        Response::json(['ok' => true]);
    }

    private function makeSlug(string $name): string {
        $slug = mb_strtolower($name, 'UTF-8');
        // Replace Vietnamese characters with ASCII equivalents
        $map = [
            'à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a',
            'ă'=>'a','ắ'=>'a','ặ'=>'a','ằ'=>'a','ẳ'=>'a','ẵ'=>'a',
            'â'=>'a','ấ'=>'a','ầ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a',
            'đ'=>'d',
            'è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e',
            'ê'=>'e','ế'=>'e','ề'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e',
            'ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i',
            'ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o',
            'ô'=>'o','ố'=>'o','ồ'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o',
            'ơ'=>'o','ớ'=>'o','ờ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o',
            'ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u',
            'ư'=>'u','ứ'=>'u','ừ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u',
            'ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y',
        ];
        $slug = strtr($slug, $map);
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        $slug = preg_replace('/[\s]+/', '-', trim($slug));
        return $slug;
    }
}
