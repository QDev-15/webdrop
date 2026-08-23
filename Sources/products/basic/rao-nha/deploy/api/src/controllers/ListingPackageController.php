<?php
declare(strict_types=1);

/** ListingPackageController — Admin quản lý 4 gói tin (thuong/vip-bac/vip-vang/vip-kim-cuong). */
class ListingPackageController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM listing_packages ORDER BY sort_order");
        foreach ($rows as &$r) { $r['benefits'] = array_values(array_filter(explode('|', $r['benefits']))); }
        Response::json($rows);
    }

    public function show(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM listing_packages WHERE tier = ?", [$p['id']]);
        if (!$row) { Response::error('Không tìm thấy.', 404); return; }
        $row['benefits'] = array_values(array_filter(explode('|', $row['benefits'])));
        Response::json($row);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        if (empty($b['label'])) { Response::error('Tên gói là bắt buộc.'); return; }
        $benefits = is_array($b['benefits'] ?? null) ? implode('|', array_filter($b['benefits'])) : ($b['benefits'] ?? '');
        $this->db->execute(
            "UPDATE listing_packages SET label=?, price=?, duration_days=?, benefits=?, sort_order=? WHERE tier=?",
            [$b['label'], (int)($b['price'] ?? 0), (int)($b['duration_days'] ?? 30), $benefits, (int)($b['sort_order'] ?? 0), $p['id']]
        );
        Response::json(['ok' => true]);
    }
}
