<?php
declare(strict_types=1);

class MediaController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        Response::json($this->db->query("SELECT * FROM media ORDER BY created_at DESC"));
    }

    public function upload(array $p): void {
        Auth::require();
        if (empty($_FILES['file'])) { Response::error('Không có file.', 400); return; }
        $file = $_FILES['file'];
        if ($file['error'] !== UPLOAD_ERR_OK) { Response::error('Upload lỗi: ' . $file['error'], 400); return; }
        $allowed = ['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'];
        $mime = mime_content_type($file['tmp_name']);
        if (!in_array($mime, $allowed, true)) { Response::error('Chỉ hỗ trợ ảnh.', 400); return; }
        if ($file['size'] > 10 * 1024 * 1024) { Response::error('File quá lớn. Tối đa 10MB.', 400); return; }
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION) ?: 'jpg');
        $filename = uniqid('img_', true) . '.' . $ext;
        $dir = defined('UPLOAD_DIR') ? UPLOAD_DIR : __DIR__ . '/../../../uploads/';
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        if (!move_uploaded_file($file['tmp_name'], $dir . $filename)) {
            Response::error('Không thể lưu file.', 500); return;
        }
        $url = rtrim(APP_URL, '/') . '/api/uploads/' . $filename;
        $user = Auth::user();
        $id = $this->db->execute(
            "INSERT INTO media (filename, filepath, filesize, filetype, uploaded_by) VALUES (?, ?, ?, ?, ?)",
            [$filename, $url, $file['size'], $mime, $user['id'] ?? null]
        );
        Response::json(['id' => $id, 'url' => $url, 'filename' => $filename], 201);
    }

    public function destroy(array $p): void {
        Auth::require();
        $media = $this->db->queryOne("SELECT * FROM media WHERE id = ?", [$p['id']]);
        if (!$media) { Response::error('Không tìm thấy.', 404); return; }
        $dir = defined('UPLOAD_DIR') ? UPLOAD_DIR : __DIR__ . '/../../../uploads/';
        $filePath = $dir . $media['filename'];
        if (file_exists($filePath)) @unlink($filePath);
        $this->db->execute("DELETE FROM media WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
