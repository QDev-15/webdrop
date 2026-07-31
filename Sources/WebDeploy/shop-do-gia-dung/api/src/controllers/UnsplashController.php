<?php
declare(strict_types=1);

class UnsplashController {
    public function __construct(private Database $db) {}

    private function getAccessKey(): ?string {
        $row = $this->db->queryOne("SELECT value FROM settings WHERE key = 'unsplash_access_key' LIMIT 1");
        $v   = trim($row['value'] ?? '');
        if ($v) return $v;

        // Fallback: try environment variable (default from webdrop.store)
        $env = getenv('UNSPLASH_API_KEY');
        return $env ? trim($env) : null;
    }

    public function search(array $p): void {
        Auth::require();

        $q    = trim($_GET['q'] ?? '');
        $page = max(1, (int)($_GET['page'] ?? 1));

        if (!$q) {
            Response::json(['results' => [], 'total' => 0, 'total_pages' => 0]); return;
        }

        $accessKey = $this->getAccessKey();
        if (!$accessKey) {
            Response::error('Chưa cấu hình Unsplash Access Key. Vào Cài đặt → Tích hợp để thêm.', 400); return;
        }

        $url = 'https://api.unsplash.com/search/photos?query=' . urlencode($q)
             . "&per_page=12&page={$page}&orientation=landscape";

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => ["Authorization: Client-ID {$accessKey}"],
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErr  = curl_error($ch);
        curl_close($ch);

        if ($curlErr || $response === false) {
            Response::error('Không thể kết nối Unsplash. Thử lại sau.', 500); return;
        }

        if ($httpCode === 401) {
            Response::error('Access Key không hợp lệ. Kiểm tra lại trong Cài đặt → Tích hợp.', 400); return;
        }
        if ($httpCode === 403) {
            Response::error('Đã vượt giới hạn request Unsplash (50 req/giờ). Thử lại sau.', 429); return;
        }
        if ($httpCode !== 200) {
            Response::error('Lỗi kết nối Unsplash. Thử lại sau.', 500); return;
        }

        $data    = json_decode((string)$response, true);
        $results = array_map(fn($p) => [
            'id'               => $p['id'],
            'thumb'            => $p['urls']['small'],
            'regular'          => $p['urls']['regular'],
            'alt'              => $p['alt_description'] ?? $p['description'] ?? '',
            'author'           => $p['user']['name'] ?? '',
            'authorUrl'        => $p['user']['links']['html'] ?? '',
            'downloadLocation' => $p['links']['download_location'] ?? '',
        ], $data['results'] ?? []);

        Response::json([
            'results'     => $results,
            'total'       => $data['total']       ?? 0,
            'total_pages' => $data['total_pages'] ?? 0,
        ]);
    }

    public function trackDownload(array $p): void {
        Auth::require();
        $body             = bodyJson();
        $downloadLocation = $body['downloadLocation'] ?? '';

        if ($downloadLocation && ($accessKey = $this->getAccessKey())) {
            $ch = curl_init($downloadLocation);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER     => ["Authorization: Client-ID {$accessKey}"],
                CURLOPT_TIMEOUT        => 5,
            ]);
            curl_exec($ch);
            curl_close($ch);
        }
        Response::json(['ok' => true]);
    }
}
