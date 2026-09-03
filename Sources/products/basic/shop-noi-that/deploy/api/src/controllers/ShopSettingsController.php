<?php
declare(strict_types=1);

// Admin: đồng bộ tài khoản ngân hàng từ SePay API — file TĨNH.
// SePay chỉ cấp 1 credential "API Access" — dùng Bearer để gọi API chính chủ lấy tài khoản đã liên kết.
class ShopSettingsController {
    public function __construct(private Database $db) {}

    public function syncSepayBankAccounts(): void {
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
