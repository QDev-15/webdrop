<?php
declare(strict_types=1);

class SettingsController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query("SELECT key, value FROM settings");
        $result = [];
        foreach ($rows as $r) {
            $result[$r['key']] = $r['value'];
        }
        Response::json($result);
    }

    public function update(array $p): void {
        Auth::require();
        $b = bodyJson();
        $stmt = $this->db->query("SELECT key, grp FROM settings");
        $groupMap = [];
        foreach ($stmt as $r) { $groupMap[$r['key']] = $r['grp']; }

        // Chỉ cho phép update các key đã tồn tại trong DB — không tạo key tùy ý
        foreach ($b as $key => $value) {
            if (!is_string($key)) continue;
            if (!array_key_exists($key, $groupMap)) continue; // bỏ qua key không có trong settings
            $grp = $groupMap[$key];
            $this->db->execute(
                "INSERT INTO settings (key, value, grp) VALUES (?, ?, ?)
                 ON CONFLICT(key) DO UPDATE SET value = excluded.value",
                [$key, (string)$value, $grp]
            );
        }
        Response::json(['ok' => true]);
    }

    // Gọi API chính chủ của SePay để lấy tài khoản ngân hàng đã liên kết với
    // API Access token — SePay chỉ cấp 1 credential nhưng dùng được cho cả xác
    // thực webhook (Authorization: Apikey) và gọi API tài khoản (Authorization: Bearer).
    public function syncSepayBankAccounts(array $p): void {
        Auth::require();
        $b = bodyJson();
        $apiKey = trim((string)($b['api_key'] ?? ''));
        if ($apiKey === '') {
            Response::error('Chưa nhập SePay API Access', 400);
            return;
        }

        $ch = curl_init('https://my.sepay.vn/userapi/bankaccounts/list');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => ["Authorization: Bearer {$apiKey}"],
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErr  = curl_error($ch);
        curl_close($ch);

        if ($curlErr || $response === false) {
            error_log("[SePay] Sync lỗi kết nối: {$curlErr}");
            Response::error('Không kết nối được đến SePay', 502);
            return;
        }
        if ($httpCode !== 200) {
            error_log("[SePay] Sync HTTP {$httpCode}: {$response}");
            Response::error('SePay API Access không hợp lệ hoặc đã hết hạn', 502);
            return;
        }

        $data = json_decode((string)$response, true);
        $all  = is_array($data['bankaccounts'] ?? null) ? $data['bankaccounts'] : [];
        // Bỏ tài khoản đã ngừng liên kết — chỉ đồng bộ tài khoản còn hoạt động
        $accounts = array_values(array_filter($all, fn($a) => (string)($a['active'] ?? '1') !== '0'));
        if (count($accounts) === 0) {
            Response::error('Tài khoản SePay chưa liên kết ngân hàng nào đang hoạt động', 404);
            return;
        }

        $account = $accounts[0];
        $bank = [
            'bank_code'    => $account['bank_short_name'] ?? $account['bank_code'] ?? '',
            'account_no'   => $account['account_number'] ?? '',
            'account_name' => $account['account_holder_name'] ?? '',
        ];
        $warning = count($accounts) > 1
            ? 'Tài khoản SePay có ' . count($accounts) . ' ngân hàng đang liên kết — đã chọn tài khoản đầu tiên (' . $bank['bank_code'] . ' ' . $bank['account_no'] . '), kiểm tra lại nếu không đúng.'
            : null;

        Response::json(['ok' => true, 'bank' => $bank, 'warning' => $warning]);
    }
}
