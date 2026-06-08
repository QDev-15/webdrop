<?php
declare(strict_types=1);

class MediaController {
    private const ALLOWED = ['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'];
    private const MAX_MB  = 10;

    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json($this->db->query("SELECT * FROM media ORDER BY created_at DESC LIMIT 100"));
    }

    public function upload(array $p): void {
        Auth::require();
        if (empty($_FILES['file'])) { Response::error('Không có file.', 400); return; }
        $file = $_FILES['file'];
        if ($file['error'] !== UPLOAD_ERR_OK) { Response::error('Upload lỗi: ' . $file['error'], 400); return; }
        $mime = mime_content_type($file['tmp_name']);
        if (!in_array($mime, self::ALLOWED, true)) { Response::error('Chỉ hỗ trợ ảnh JPG, PNG, WEBP, GIF, SVG.', 400); return; }
        if ($file['size'] > self::MAX_MB * 1024 * 1024) { Response::error('File tối đa ' . self::MAX_MB . 'MB.', 400); return; }

        $ext      = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION) ?: 'jpg');
        $filename = uniqid('media_', true) . '.' . $ext;
        $dir      = defined('UPLOAD_DIR') ? UPLOAD_DIR : __DIR__ . '/../../../uploads/';
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        if (!move_uploaded_file($file['tmp_name'], $dir . $filename)) {
            Response::error('Lỗi lưu file.', 500); return;
        }
        $url = rtrim(APP_URL, '/') . '/api/uploads/' . $filename;

        $user = Auth::user();
        $id = $this->db->execute(
            "INSERT INTO media (filename, filepath, filesize, filetype, alt_text, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)",
            [$filename, $url, $file['size'], $mime, $file['name'], $user['id'] ?? null]
        );
        Response::json(['id' => $id, 'url' => $url, 'filename' => $filename], 201);
    }

    public function destroy(array $p): void {
        Auth::require();
        $row = $this->db->queryOne("SELECT * FROM media WHERE id = ?", [$p['id']]);
        if ($row) {
            $dir  = defined('UPLOAD_DIR') ? UPLOAD_DIR : __DIR__ . '/../../../uploads/';
            $file = $dir . $row['filename'];
            if (file_exists($file)) @unlink($file);
            $this->db->execute("DELETE FROM media WHERE id = ?", [$p['id']]);
        }
        Response::json(['ok' => true]);
    }
}
