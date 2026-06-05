<?php
declare(strict_types=1);

class UploadController {
    private const ALLOWED = ['image/jpeg','image/png','image/webp','image/gif','image/svg+xml','image/x-icon','image/vnd.microsoft.icon'];
    private const MAX_MB  = 10;

    public function __construct(private Database $db) {}

    private function getCloudinaryConfig(): ?array {
        $rows = $this->db->query(
            "SELECT key, value FROM settings WHERE key IN
             ('cloudinary_cloud_name','cloudinary_api_key','cloudinary_api_secret','cloudinary_folder')"
        );
        $s = [];
        foreach ($rows as $r) $s[$r['key']] = trim($r['value'] ?? '');
        if (empty($s['cloudinary_cloud_name']) || empty($s['cloudinary_api_key']) || empty($s['cloudinary_api_secret'])) {
            return null;
        }
        return [
            'cloudName' => $s['cloudinary_cloud_name'],
            'apiKey'    => $s['cloudinary_api_key'],
            'apiSecret' => $s['cloudinary_api_secret'],
            'folder'    => $s['cloudinary_folder'] ?: 'webdrop',
        ];
    }

    public function upload(array $p): void {
        Auth::require();

        if (empty($_FILES['file'])) {
            Response::error('Không có file được upload.', 400); return;
        }
        $file = $_FILES['file'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            Response::error('Upload thất bại, mã lỗi: ' . $file['error'], 400); return;
        }
        $mime = mime_content_type($file['tmp_name']);
        if (!in_array($mime, self::ALLOWED, true)) {
            Response::error('Chỉ hỗ trợ ảnh (JPG, PNG, WEBP, GIF, SVG).', 400); return;
        }
        if ($file['size'] > self::MAX_MB * 1024 * 1024) {
            Response::error('File quá lớn. Tối đa ' . self::MAX_MB . 'MB.', 400); return;
        }

        $cfg = $this->getCloudinaryConfig();
        $url = $cfg ? $this->uploadToCloudinary($file, $cfg) : $this->uploadToLocal($file);

        if ($url === null) {
            Response::error('Upload thất bại. Thử lại sau.', 500); return;
        }
        Response::json(['url' => $url]);
    }

    private function uploadToCloudinary(array $file, array $cfg): ?string {
        $timestamp = time();
        $params    = ['folder' => $cfg['folder'], 'timestamp' => $timestamp];
        ksort($params);
        $paramStr  = implode('&', array_map(
            fn($k, $v) => "{$k}={$v}", array_keys($params), array_values($params)
        ));
        $signature = sha1($paramStr . $cfg['apiSecret']);

        $ch = curl_init("https://api.cloudinary.com/v1_1/{$cfg['cloudName']}/image/upload");
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_TIMEOUT        => 60,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_POSTFIELDS     => [
                'file'      => new CURLFile($file['tmp_name'], $file['type'] ?? 'image/jpeg', $file['name']),
                'api_key'   => $cfg['apiKey'],
                'timestamp' => (string)$timestamp,
                'signature' => $signature,
                'folder'    => $cfg['folder'],
            ],
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErr  = curl_error($ch);
        curl_close($ch);

        if ($curlErr || $response === false || $httpCode !== 200) {
            error_log("[Upload] Cloudinary HTTP {$httpCode}: {$curlErr}");
            return null;
        }
        $data = json_decode((string)$response, true);
        return $data['secure_url'] ?? null;
    }

    private function uploadToLocal(array $file): ?string {
        $ext      = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION) ?: 'jpg');
        $filename = uniqid('img_', true) . '.' . $ext;
        $dir      = defined('UPLOAD_DIR') ? UPLOAD_DIR : rtrim(dirname(__DIR__, 3), '/') . '/uploads/';
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        if (!move_uploaded_file($file['tmp_name'], $dir . $filename)) return null;
        return rtrim(APP_URL, '/') . '/uploads/' . $filename;
    }
}
