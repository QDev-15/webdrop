<?php
declare(strict_types=1);

/**
 * MyListingController — quản lý tin đăng của CHÍNH tài khoản đang đăng nhập (AccountAuth).
 * Mọi thao tác update/delete PHẢI kiểm tra account_id khớp session — không cho sửa/xoá
 * tin của người khác (rule bảo mật quan trọng nhất cho site marketplace này).
 */
class MyListingController {
    public function __construct(private Database $db) {}

    private const TYPE_KEYS = ['chung-cu', 'nha-pho', 'dat-nen', 'biet-thu', 'shophouse', 'can-ho-dich-vu'];
    private const DIRECTION_KEYS = ['dong', 'tay', 'nam', 'bac', 'dong-nam', 'dong-bac', 'tay-nam', 'tay-bac'];
    private const LEGAL_KEYS = ['so-do', 'so-hong', 'hop-dong-mua-ban', 'dang-cho-so'];
    private const FURNISHING_KEYS = ['day-du', 'co-ban', 'tho'];

    private function decorate(array $row): array {
        $now = new \DateTimeImmutable('now');
        $expires = new \DateTimeImmutable($row['expires_at']);
        $daysLeft = (int)ceil(($expires->getTimestamp() - $now->getTimestamp()) / 86400);
        $row['images'] = array_values(array_filter(explode('|', $row['images'])));
        $row['features'] = array_values(array_filter(explode('|', $row['features'])));
        $row['days_left'] = $daysLeft;
        $row['expired'] = $daysLeft < 0;
        $pkg = $this->db->queryOne("SELECT * FROM listing_packages WHERE tier = ?", [$row['tier']]);
        $row['tier_label'] = $pkg['label'] ?? $row['tier'];
        return $row;
    }

    public function index(array $p): void {
        $session = AccountAuth::require();
        $rows = $this->db->query(
            "SELECT * FROM listings WHERE account_id = ? ORDER BY created_at DESC",
            [$session['id']]
        );
        Response::json(array_map([$this, 'decorate'], $rows));
    }

    private function buildTitle(string $type, string $need, int $bedrooms, float $area, string $district): string {
        $labels = Database::typeLabels();
        $label = $labels[$type] ?? 'Bất động sản';
        $areaText = rtrim(rtrim(number_format($area, 1, '.', ''), '0'), '.') . 'm²';
        $t = $bedrooms > 0
            ? "{$label} {$bedrooms} phòng ngủ {$areaText} tại {$district}"
            : "{$label} {$areaText} tại {$district}";
        return $need === 'cho-thue' ? "{$t} - cho thuê" : $t;
    }

    private function uniqueSlug(string $base): string {
        $slug = $base; $i = 2;
        while ($this->db->queryOne("SELECT id FROM listings WHERE slug = ?", [$slug])) {
            $slug = $base . '-' . $i; $i++;
        }
        return $slug;
    }

    public function store(array $p): void {
        $session = AccountAuth::require();
        $b = bodyJson();

        $need = ($b['listing_type'] ?? '') === 'cho-thue' ? 'cho-thue' : 'ban';
        $type = in_array($b['property_type'] ?? '', self::TYPE_KEYS, true) ? $b['property_type'] : null;
        $direction = in_array($b['direction'] ?? '', self::DIRECTION_KEYS, true) ? $b['direction'] : null;
        $legal = in_array($b['legal_status'] ?? '', self::LEGAL_KEYS, true) ? $b['legal_status'] : null;
        $furnishing = in_array($b['furnishing'] ?? '', self::FURNISHING_KEYS, true) ? $b['furnishing'] : null;
        $district = trim($b['district'] ?? '');
        $city = trim($b['city'] ?? '');
        $address = trim($b['address'] ?? '');
        $area = (float)($b['area'] ?? 0);
        $price = (int)($b['price'] ?? 0);
        $bedrooms = max(0, (int)($b['bedrooms'] ?? 0));
        $bathrooms = max(0, (int)($b['bathrooms'] ?? 0));
        $description = trim($b['description'] ?? '');
        $images = array_values(array_filter(array_map('trim', (array)($b['images'] ?? []))));
        $tier = $b['tier'] ?? 'thuong';

        if (!$type || !$direction || !$legal || !$furnishing) { Response::error('Thông tin bất động sản không hợp lệ.'); return; }
        if (!$district || !$address) { Response::error('Vui lòng chọn khu vực và nhập địa chỉ cụ thể.'); return; }
        if ($area <= 0) { Response::error('Diện tích phải lớn hơn 0.'); return; }
        if ($price <= 0) { Response::error('Vui lòng nhập mức giá hợp lệ.'); return; }
        if (!$description) { Response::error('Vui lòng nhập mô tả chi tiết.'); return; }

        $pkg = $this->db->queryOne("SELECT * FROM listing_packages WHERE tier = ?", [$tier]);
        if (!$pkg) { Response::error('Gói tin không hợp lệ.'); return; }

        $acc = $this->db->queryOne("SELECT * FROM accounts WHERE id = ?", [$session['id']]);
        if ((int)$pkg['price'] > 0) {
            if ((int)$acc['credit_balance'] < (int)$pkg['price']) {
                Response::error('Số dư ví không đủ để đăng tin gói ' . $pkg['label'] . '. Vui lòng nạp thêm credit.', 402);
                return;
            }
        }

        $title = $this->buildTitle($type, $need, $bedrooms, $area, $district);
        $slug = $this->uniqueSlug(slugify($title));
        $now = new \DateTimeImmutable('now');
        $expires = $now->modify('+' . (int)$pkg['duration_days'] . ' days');

        $id = $this->db->execute(
            "INSERT INTO listings
                (account_id, title, slug, listing_type, property_type, price, area, bedrooms, bathrooms,
                 direction, legal_status, furnishing, district, city, address, lat, lng, description,
                 features, images, tier, status, posted_at, expires_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, '', ?, ?, 'pending', ?, ?)",
            [
                $session['id'], $title, $slug, $need, $type, $price, $area, $bedrooms, $bathrooms,
                $direction, $legal, $furnishing, $district, $city, $address, $description,
                implode('|', $images), $tier, $now->format('Y-m-d H:i:s'), $expires->format('Y-m-d H:i:s'),
            ]
        );

        if ((int)$pkg['price'] > 0) {
            $cost = (int)$pkg['price'];
            // UPDATE có điều kiện — atomic, chống race condition (2 request đồng thời không thể cùng
            // vượt qua kiểm tra số dư rồi cùng trừ, vì WHERE credit_balance >= ? được đánh giá lại tại
            // thời điểm ghi, không phải tại thời điểm SELECT phía trên).
            $affected = $this->db->executeAffected(
                "UPDATE accounts SET credit_balance = credit_balance - ? WHERE id = ? AND credit_balance >= ?",
                [$cost, $session['id'], $cost]
            );
            if ($affected === 0) {
                $this->db->execute("DELETE FROM listings WHERE id = ?", [$id]);
                Response::error('Số dư ví không đủ để đăng tin gói ' . $pkg['label'] . '. Vui lòng nạp thêm credit.', 402);
                return;
            }
            $this->db->execute(
                "INSERT INTO wallet_transactions (account_id, type, amount, method, note, status) VALUES (?, 'tru', ?, 'he-thong', ?, 'completed')",
                [$session['id'], $cost, 'Đăng tin gói ' . $pkg['label']]
            );
        }

        Response::json(['id' => $id, 'slug' => $slug], 201);
    }

    private function ownListing(int $accountId, $id): ?array {
        return $this->db->queryOne("SELECT * FROM listings WHERE id = ? AND account_id = ?", [$id, $accountId]);
    }

    public function renew(array $p): void {
        $session = AccountAuth::require();
        $listing = $this->ownListing($session['id'], $p['id']);
        if (!$listing) { Response::error('Không tìm thấy tin đăng.', 404); return; }

        $pkg = $this->db->queryOne("SELECT * FROM listing_packages WHERE tier = ?", [$listing['tier']]);
        if (!$pkg) { Response::error('Gói tin không hợp lệ.', 500); return; }

        $cost = (int)$pkg['price'];
        if ($cost > 0) {
            $affected = $this->db->executeAffected(
                "UPDATE accounts SET credit_balance = credit_balance - ? WHERE id = ? AND credit_balance >= ?",
                [$cost, $session['id'], $cost]
            );
            if ($affected === 0) {
                Response::error('Số dư ví không đủ để gia hạn gói ' . $pkg['label'] . '. Vui lòng nạp thêm credit.', 402);
                return;
            }
            $this->db->execute(
                "INSERT INTO wallet_transactions (account_id, type, amount, method, note, status) VALUES (?, 'tru', ?, 'he-thong', ?, 'completed')",
                [$session['id'], $cost, 'Gia hạn gói ' . $pkg['label']]
            );
        }

        $now = new \DateTimeImmutable('now');
        $expires = $now->modify('+' . (int)$pkg['duration_days'] . ' days');
        $this->db->execute("UPDATE listings SET posted_at = ?, expires_at = ? WHERE id = ?",
            [$now->format('Y-m-d H:i:s'), $expires->format('Y-m-d H:i:s'), $listing['id']]);
        Response::json(['ok' => true]);
    }

    public function upgrade(array $p): void {
        $session = AccountAuth::require();
        $listing = $this->ownListing($session['id'], $p['id']);
        if (!$listing) { Response::error('Không tìm thấy tin đăng.', 404); return; }

        $order = ['thuong', 'vip-bac', 'vip-vang', 'vip-kim-cuong'];
        $curIdx = array_search($listing['tier'], $order, true);
        if ($curIdx === false || $curIdx >= count($order) - 1) {
            Response::error('Tin này đã ở gói cao nhất — VIP Kim Cương.'); return;
        }
        $next = $order[$curIdx + 1];
        $pkg = $this->db->queryOne("SELECT * FROM listing_packages WHERE tier = ?", [$next]);
        if (!$pkg) { Response::error('Gói tin không hợp lệ.', 500); return; }

        $cost = (int)$pkg['price'];
        $affected = $this->db->executeAffected(
            "UPDATE accounts SET credit_balance = credit_balance - ? WHERE id = ? AND credit_balance >= ?",
            [$cost, $session['id'], $cost]
        );
        if ($affected === 0) {
            Response::error('Số dư ví không đủ. Vui lòng nạp thêm credit trước khi nâng cấp.', 402);
            return;
        }
        $this->db->execute(
            "INSERT INTO wallet_transactions (account_id, type, amount, method, note, status) VALUES (?, 'tru', ?, 'he-thong', ?, 'completed')",
            [$session['id'], $cost, 'Nâng cấp gói ' . $pkg['label']]
        );

        $now = new \DateTimeImmutable('now');
        $expires = $now->modify('+' . (int)$pkg['duration_days'] . ' days');
        $this->db->execute("UPDATE listings SET tier = ?, posted_at = ?, expires_at = ? WHERE id = ?",
            [$next, $now->format('Y-m-d H:i:s'), $expires->format('Y-m-d H:i:s'), $listing['id']]);
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        $session = AccountAuth::require();
        $listing = $this->ownListing($session['id'], $p['id']);
        if (!$listing) { Response::error('Không tìm thấy tin đăng.', 404); return; }
        $this->db->execute("DELETE FROM listings WHERE id = ?", [$listing['id']]);
        Response::json(['ok' => true]);
    }
}
