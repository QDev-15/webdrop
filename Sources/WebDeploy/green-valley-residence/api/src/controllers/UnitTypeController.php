<?php
declare(strict_types=1);

class UnitTypeController {
    private const FIELDS = [
        'name', 'slug', 'type_tag', 'bedrooms', 'bathrooms', 'area', 'price_from',
        'direction', 'floor_range', 'block', 'view_desc', 'status', 'badge',
        'floor_plan_image', 'gallery', 'description', 'features', 'is_featured', 'sort_order',
    ];

    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM unit_types ORDER BY sort_order, id");
        Response::json(array_map([$this, 'decorate'], $rows));
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM unit_types WHERE id = ?", [$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($this->decorate($row));
    }

    public function store(array $p): void {
        Auth::require();
        $b = $this->extract(bodyJson());
        if (empty($b['name'])) { Response::error('Tên loại căn là bắt buộc.'); return; }
        $slug = !empty($b['slug']) ? slugify($b['slug']) : slugify($b['name']);
        $slug = $this->uniqueSlug($slug);
        $id = $this->db->execute(
            "INSERT INTO unit_types (name, slug, type_tag, bedrooms, bathrooms, area, price_from, direction, floor_range, block, view_desc, status, badge, floor_plan_image, gallery, description, features, is_featured, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                $b['name'], $slug, $b['type_tag'], $b['bedrooms'], $b['bathrooms'], $b['area'], $b['price_from'],
                $b['direction'], $b['floor_range'], $b['block'], $b['view_desc'], $b['status'], $b['badge'],
                $b['floor_plan_image'], $b['gallery'], $b['description'], $b['features'], $b['is_featured'], $b['sort_order'],
            ]
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = $this->extract(bodyJson());
        if (empty($b['name'])) { Response::error('Tên loại căn là bắt buộc.'); return; }
        $existing = $this->db->queryOne("SELECT slug FROM unit_types WHERE id = ?", [$p['id']]);
        if (!$existing) { Response::error('Không tìm thấy.', 404); return; }
        $slug = !empty($b['slug']) ? slugify($b['slug']) : $existing['slug'];
        $slug = $this->uniqueSlug($slug, (int)$p['id']);
        $this->db->execute(
            "UPDATE unit_types SET name=?, slug=?, type_tag=?, bedrooms=?, bathrooms=?, area=?, price_from=?, direction=?, floor_range=?, block=?, view_desc=?, status=?, badge=?, floor_plan_image=?, gallery=?, description=?, features=?, is_featured=?, sort_order=? WHERE id=?",
            [
                $b['name'], $slug, $b['type_tag'], $b['bedrooms'], $b['bathrooms'], $b['area'], $b['price_from'],
                $b['direction'], $b['floor_range'], $b['block'], $b['view_desc'], $b['status'], $b['badge'],
                $b['floor_plan_image'], $b['gallery'], $b['description'], $b['features'], $b['is_featured'], $b['sort_order'],
                $p['id'],
            ]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM unit_types WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }

    private function extract(array $b): array {
        $gallery = $b['gallery'] ?? [];
        if (is_string($gallery)) { $decoded = json_decode($gallery, true); $gallery = is_array($decoded) ? $decoded : []; }
        $gallery = array_values(array_filter(array_map('trim', $gallery), fn($v) => $v !== ''));

        $features = $b['features'] ?? [];
        if (is_string($features)) { $decoded = json_decode($features, true); $features = is_array($decoded) ? $decoded : []; }
        $features = array_values(array_filter(array_map('trim', $features), fn($v) => $v !== ''));

        return [
            'name'             => trim((string)($b['name'] ?? '')),
            'slug'             => trim((string)($b['slug'] ?? '')),
            'type_tag'         => (string)($b['type_tag'] ?? '1pn'),
            'bedrooms'         => (int)($b['bedrooms'] ?? 1),
            'bathrooms'        => (int)($b['bathrooms'] ?? 1),
            'area'             => (float)($b['area'] ?? 0),
            'price_from'       => (float)($b['price_from'] ?? 0),
            'direction'        => (string)($b['direction'] ?? 'dong'),
            'floor_range'      => (string)($b['floor_range'] ?? ''),
            'block'            => (string)($b['block'] ?? ''),
            'view_desc'        => (string)($b['view_desc'] ?? ''),
            'status'           => (string)($b['status'] ?? 'con-hang'),
            'badge'            => (string)($b['badge'] ?? ''),
            'floor_plan_image' => (string)($b['floor_plan_image'] ?? ''),
            'gallery'          => json_encode($gallery, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'description'      => (string)($b['description'] ?? ''),
            'features'         => json_encode($features, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'is_featured'      => !empty($b['is_featured']) ? 1 : 0,
            'sort_order'       => (int)($b['sort_order'] ?? 0),
        ];
    }

    private function decorate(array $row): array {
        $row['gallery']  = json_decode($row['gallery'] ?? '[]', true) ?: [];
        $row['features'] = json_decode($row['features'] ?? '[]', true) ?: [];
        return $row;
    }

    private function uniqueSlug(string $slug, ?int $excludeId = null): string {
        $base = $slug ?: 'loai-can';
        $i = 1;
        while (true) {
            $sql = "SELECT id FROM unit_types WHERE slug = ?" . ($excludeId ? " AND id != ?" : "");
            $params = $excludeId ? [$slug, $excludeId] : [$slug];
            if (!$this->db->queryOne($sql, $params)) return $slug;
            $slug = $base . '-' . (++$i);
        }
    }
}
