<?php
declare(strict_types=1);

/** PublicController — mọi endpoint KHÔNG cần đăng nhập (website công khai gọi). */
class PublicController {
    public function __construct(private Database $db) {}

    // ─── Settings / Hero / Contact ─────────────────────────────────────────────

    public function settings(array $p): void {
        // Lọc bỏ nhóm nhạy cảm — TUYỆT ĐỐI không để lộ sepay_webhook_secret / smtp / cloudinary qua endpoint public
        // ⚠️ Cột thật trong schema core là `grp` (không phải `group`) — dùng sai tên cột khiến SQLite
        // âm thầm coi "group" là string literal (quirk tương thích ngược), WHERE luôn đúng => lộ hết dữ liệu.
        $rows = $this->db->query(
            "SELECT key, value FROM settings WHERE grp NOT IN ('smtp','cloudinary','integrations','payment')"
        );
        $result = [];
        foreach ($rows as $r) { $result[$r['key']] = $r['value']; }
        Response::json($result);
    }

    public function heroSlides(array $p): void {
        $rows = $this->db->query("SELECT * FROM hero_slides WHERE status = 'published' ORDER BY sort_order, id");
        Response::json($rows);
    }

    public function submitContact(array $p): void {
        $b = bodyJson();
        $name = trim($b['name'] ?? '');
        $message = trim($b['message'] ?? '');
        if (!$name || !$message) { Response::error('Vui lòng nhập họ tên và nội dung.'); return; }
        $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
            [$name, trim($b['email'] ?? ''), trim($b['phone'] ?? ''), trim($b['subject'] ?? ''), $message]
        );
        Response::json(['ok' => true]);
    }

    // ─── Payment methods (public — chỉ trạng thái bật/tắt + thông tin NH hiển thị, KHÔNG lộ secret) ──

    public function paymentMethods(array $p): void {
        $rows = $this->db->query(
            "SELECT key, value FROM settings WHERE key IN
             ('payment_sepay_enabled','payment_manual_enabled','sepay_bank_name','sepay_account_number','sepay_account_name')"
        );
        $s = [];
        foreach ($rows as $r) { $s[$r['key']] = $r['value']; }
        Response::json([
            'sepay_enabled'  => ($s['payment_sepay_enabled'] ?? '0') === '1',
            'manual_enabled' => ($s['payment_manual_enabled'] ?? '0') === '1',
            'bank_name'      => $s['sepay_bank_name'] ?? '',
            'account_number' => $s['sepay_account_number'] ?? '',
            'account_name'   => $s['sepay_account_name'] ?? '',
        ]);
    }

    // ─── Listings ───────────────────────────────────────────────────────────────

    private function decorateListing(array $row): array {
        $now = new \DateTimeImmutable('now');
        $posted = new \DateTimeImmutable($row['posted_at']);
        $daysAgo = (int)floor(($now->getTimestamp() - $posted->getTimestamp()) / 86400);
        $badge = null;
        if ($daysAgo <= 3) $badge = 'moi';
        elseif (in_array($row['tier'], ['vip-vang', 'vip-kim-cuong'], true)) $badge = 'hot';

        $row['images'] = array_values(array_filter(explode('|', $row['images'])));
        $row['features'] = array_values(array_filter(explode('|', $row['features'])));
        $row['badge'] = $badge;
        $row['poster'] = [
            'name'   => $row['poster_name'] ?? '',
            'role'   => $row['poster_role'] ?? '',
            'phone'  => $row['poster_phone'] ?? '',
            'avatar' => $row['poster_avatar'] ?? '',
            'slug'   => $row['poster_account_id'] ?? null,
        ];
        unset($row['poster_name'], $row['poster_role'], $row['poster_phone'], $row['poster_avatar'], $row['poster_account_id']);
        return $row;
    }

    private const LISTING_SELECT = "SELECT l.*, a.id AS poster_account_id, a.name AS poster_name, a.role AS poster_role,
             a.phone AS poster_phone, a.avatar AS poster_avatar
             FROM listings l JOIN accounts a ON a.id = l.account_id";

    /** GET /public/listings — trả TOÀN BỘ tin đã duyệt + còn hạn dưới dạng array thuần.
     *  Website lọc/sắp xếp/phân trang client-side (giống hệt hành vi bat-dong-san.html gốc — instant filter, không Apply). */
    public function listings(array $p): void {
        $rows = $this->db->query(
            self::LISTING_SELECT . " WHERE l.status = 'approved' AND l.expires_at >= datetime('now','localtime') ORDER BY l.created_at DESC"
        );
        Response::json(array_map([$this, 'decorateListing'], $rows));
    }

    private function relatedListings(array $current, int $n): array {
        $sameType = $this->db->query(
            self::LISTING_SELECT . " WHERE l.id != ? AND l.property_type = ? AND l.status='approved' AND l.expires_at >= datetime('now','localtime')",
            [$current['id'], $current['property_type']]
        );
        $sameArea = $this->db->query(
            self::LISTING_SELECT . " WHERE l.id != ? AND l.district = ? AND l.property_type != ? AND l.status='approved' AND l.expires_at >= datetime('now','localtime')",
            [$current['id'], $current['district'], $current['property_type']]
        );
        $rest = $this->db->query(
            self::LISTING_SELECT . " WHERE l.id != ? AND l.status='approved' AND l.expires_at >= datetime('now','localtime') ORDER BY l.created_at DESC",
            [$current['id']]
        );
        $seen = []; $out = [];
        foreach ([...$sameType, ...$sameArea, ...$rest] as $row) {
            if (isset($seen[$row['id']])) continue;
            $seen[$row['id']] = true;
            $out[] = $this->decorateListing($row);
            if (count($out) >= $n) break;
        }
        return $out;
    }

    public function listingBySlug(array $p): void {
        $row = $this->db->queryOne(
            self::LISTING_SELECT . " WHERE l.slug = ? AND l.status = 'approved' AND l.expires_at >= datetime('now','localtime')",
            [$p['slug']]
        );
        if (!$row) { Response::error('Không tìm thấy tin đăng hoặc tin đã hết hạn.', 404); return; }
        $decorated = $this->decorateListing($row);
        Response::json([
            'listing' => $decorated,
            'related' => $this->relatedListings($row, 4),
        ]);
    }

    public function listingPackages(array $p): void {
        $rows = $this->db->query("SELECT * FROM listing_packages ORDER BY sort_order");
        foreach ($rows as &$r) { $r['benefits'] = array_values(array_filter(explode('|', $r['benefits']))); }
        Response::json($rows);
    }

    // ─── FAQ / Testimonials / Articles ──────────────────────────────────────────

    public function faqs(array $p): void {
        Response::json($this->db->query("SELECT * FROM faqs ORDER BY sort_order, id"));
    }

    public function testimonials(array $p): void {
        Response::json($this->db->query("SELECT * FROM testimonials ORDER BY sort_order, id"));
    }

    public function articles(array $p): void {
        Response::json($this->db->query("SELECT * FROM articles ORDER BY published_at DESC"));
    }

    public function articleBySlug(array $p): void {
        $row = $this->db->queryOne("SELECT * FROM articles WHERE slug = ?", [$p['slug']]);
        if (!$row) { Response::error('Không tìm thấy bài viết.', 404); return; }
        $related = $this->db->query("SELECT * FROM articles WHERE id != ? ORDER BY published_at DESC LIMIT 3", [$row['id']]);
        Response::json(['article' => $row, 'related' => $related]);
    }

    // ─── Sitemap ─────────────────────────────────────────────────────────────────

    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');
        $base = rtrim(APP_URL, '/');
        $staticRoutes = [
            '', 'bat-dong-san', 'dang-tin', 'tin-tuc', 've-chung-toi', 'lien-he',
            'chinh-sach-bao-mat', 'dieu-khoan', 'dang-nhap', 'dang-ky',
        ];
        $urls = array_map(fn($r) => $base . ($r ? "/{$r}" : '/'), $staticRoutes);

        foreach ($this->db->query("SELECT slug FROM listings WHERE status='approved' AND expires_at >= datetime('now','localtime')") as $r) {
            $urls[] = "{$base}/chi-tiet-bds?slug=" . $r['slug'];
        }
        foreach ($this->db->query("SELECT slug FROM articles") as $r) {
            $urls[] = "{$base}/tin-tuc-chi-tiet?slug=" . $r['slug'];
        }

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($urls as $u) {
            echo '  <url><loc>' . htmlspecialchars($u, ENT_XML1) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
