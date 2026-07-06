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
        $rows = $this->db->query("SELECT key, value, grp FROM settings");
        $current  = [];
        $groupMap = [];
        foreach ($rows as $r) { $current[$r['key']] = $r['value']; $groupMap[$r['key']] = $r['grp']; }

        // ── Verify kết nối SePay thật trước khi cho lưu, nếu bật SePay hoặc đổi thông tin kết nối ──
        $wasSepayEnabled = ($current['payment_sepay_enabled'] ?? '0') === '1';
        $newSepayEnabled = array_key_exists('payment_sepay_enabled', $b)
            ? (string)$b['payment_sepay_enabled'] === '1'
            : $wasSepayEnabled;

        $newToken   = array_key_exists('sepay_api_token', $b) ? trim((string)$b['sepay_api_token']) : ($current['sepay_api_token'] ?? '');
        $newBank    = array_key_exists('sepay_bank_code', $b) ? trim((string)$b['sepay_bank_code']) : ($current['sepay_bank_code'] ?? '');
        $newAccount = array_key_exists('sepay_account_number', $b) ? trim((string)$b['sepay_account_number']) : ($current['sepay_account_number'] ?? '');

        $connChanged = $newToken !== ($current['sepay_api_token'] ?? '')
            || $newBank !== ($current['sepay_bank_code'] ?? '')
            || $newAccount !== ($current['sepay_account_number'] ?? '');

        if ($newSepayEnabled && (!$wasSepayEnabled || $connChanged)) {
            if (!$newToken || !$newBank || !$newAccount) {
                Response::error('Vui lòng điền đầy đủ API Token, mã ngân hàng và số tài khoản SePay trước khi bật phương thức này.', 422);
                return;
            }
            $check = $this->verifySepayConnection($newToken, $newBank, $newAccount);
            if (!$check['ok']) {
                Response::error($check['message'], 422);
                return;
            }
        }

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

    /**
     * Gọi thật API SePay (https://docs.sepay.vn) để xác nhận API Token hợp lệ
     * và số tài khoản/ngân hàng cấu hình khớp với tài khoản đã liên kết trên SePay.
     */
    private function verifySepayConnection(string $token, string $bankCode, string $accountNumber): array {
        if (!function_exists('curl_init')) {
            return ['ok' => false, 'message' => 'Server không có extension cURL — không thể kiểm tra kết nối SePay.'];
        }

        $ch = curl_init('https://my.sepay.vn/userapi/bankaccounts/list');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json', 'Authorization: Bearer ' . $token],
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErr  = curl_error($ch);
        curl_close($ch);

        if ($response === false || $curlErr) {
            return ['ok' => false, 'message' => 'Không thể kết nối tới SePay: ' . $curlErr . '. Kiểm tra lại kết nối mạng của server.'];
        }
        if ($httpCode === 401 || $httpCode === 403) {
            return ['ok' => false, 'message' => 'API Token SePay không hợp lệ hoặc đã bị thu hồi. Tạo lại tại my.sepay.vn > Cài đặt công ty > API Access.'];
        }
        if ($httpCode === 429) {
            return ['ok' => false, 'message' => 'SePay đang giới hạn tần suất request — vui lòng thử lưu lại sau ít phút.'];
        }

        $data = json_decode($response, true);
        if ($httpCode !== 200 || !is_array($data) || (($data['messages']['success'] ?? false) !== true)) {
            $msg = is_array($data) ? (string)($data['error'] ?? '') : '';
            return ['ok' => false, 'message' => 'SePay từ chối yêu cầu (HTTP ' . $httpCode . ')' . ($msg !== '' ? ": $msg" : '.')];
        }

        $accounts = is_array($data['bankaccounts'] ?? null) ? $data['bankaccounts'] : [];
        foreach ($accounts as $acc) {
            $accNum  = (string)($acc['account_number'] ?? '');
            $accBank = (string)($acc['bank_code'] ?? '');
            if ($accNum === $accountNumber && strcasecmp($accBank, $bankCode) === 0) {
                return ['ok' => true, 'message' => 'Kết nối SePay thành công'];
            }
        }

        return ['ok' => false, 'message' => "Không tìm thấy tài khoản $accountNumber (ngân hàng $bankCode) trong danh sách tài khoản đã liên kết với API Token này trên SePay. Kiểm tra lại mã ngân hàng/số tài khoản, hoặc liên kết tài khoản tại my.sepay.vn."];
    }
}
