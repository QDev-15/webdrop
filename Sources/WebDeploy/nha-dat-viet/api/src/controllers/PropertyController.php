<?php
declare(strict_types=1);

class PropertyController {
    // Whitelist field — không dùng bodyJson() trực tiếp vào INSERT/UPDATE.
    // KHÔNG chứa 'title'/'slug' — 2 cột này được store()/update() xử lý riêng.
    private const FIELDS = [
        'listing_type', 'property_type', 'price', 'price_unit', 'area',
        'bedrooms', 'bathrooms', 'direction', 'legal_status', 'furnishing',
        'district', 'street', 'lat', 'lng', 'badge', 'posted_date', 'agent_id',
        'description', 'features', 'images',
    ];

    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $search = trim((string)($_GET['q'] ?? ''));
        $page = max(1, (int)($_GET['page'] ?? 1));
        $perPage = max(1, min(100, (int)($_GET['per_page'] ?? 20)));
        $offset = ($page - 1) * $perPage;

        $where = '';
        $params = [];
        if ($search !== '') {
            $search = mb_substr($search, 0, 100);
            $where = "WHERE pr.title LIKE ? OR pr.street LIKE ?";
            $params = ["%$search%", "%$search%"];
        }

        $total = (int)$this->db->scalar("SELECT COUNT(*) FROM properties pr $where", $params);
        $rows = $this->db->query(
            "SELECT pr.*, a.name AS agent_name FROM properties pr
             LEFT JOIN agents a ON a.id = pr.agent_id
             $where ORDER BY pr.created_at DESC LIMIT ? OFFSET ?",
            [...$params, $perPage, $offset]
        );
        header('X-Total-Count: ' . $total);
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM properties WHERE id = ?", [$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        Response::json($row);
    }

    public function store(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề tin đăng là bắt buộc.'); return; }
        $data = $this->extract($b);
        $slug = slugify((string)$b['title']) . '-' . time();
        $cols = array_merge(['title', 'slug'], self::FIELDS);
        $placeholders = implode(',', array_fill(0, count($cols), '?'));
        $values = array_merge([$b['title'], $slug], array_values($data));
        $id = $this->db->execute(
            "INSERT INTO properties (" . implode(',', $cols) . ") VALUES ($placeholders)",
            $values
        );
        Response::json(['id' => $id], 201);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['title'])) { Response::error('Tiêu đề tin đăng là bắt buộc.'); return; }
        $data = $this->extract($b);
        $set = implode(',', array_map(fn($c) => "$c=?", array_keys($data)));
        $this->db->execute(
            "UPDATE properties SET title=?, $set WHERE id=?",
            [$b['title'], ...array_values($data), $p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        Auth::require();
        $this->db->execute("DELETE FROM properties WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }

    private function extract(array $b): array {
        $out = [];
        foreach (self::FIELDS as $f) {
            $out[$f] = match ($f) {
                'price', 'lat', 'lng' => (float)($b[$f] ?? 0),
                'bedrooms', 'bathrooms', 'agent_id' => isset($b[$f]) && $b[$f] !== '' ? (int)$b[$f] : ($f === 'agent_id' ? null : 0),
                default => (string)($b[$f] ?? ''),
            };
        }
        return $out;
    }
}
