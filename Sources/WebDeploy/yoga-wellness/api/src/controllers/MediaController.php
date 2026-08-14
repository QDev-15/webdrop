<?php
declare(strict_types=1);

class MediaController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM media ORDER BY created_at DESC");
        Response::json($items);
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
        $allowed = ['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'];
        $mime = mime_content_type($file['tmp_name']);
        if (!in_array($mime, $allowed, true)) {
            Response::error('Chỉ hỗ trợ ảnh (JPG, PNG, WEBP, GIF, SVG).', 400); return;
        }
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION) ?: 'jpg');
        $filename = uniqid('media_', true) . '.' . $ext;
        $dir = defined('UPLOAD_DIR') ? UPLOAD_DIR : rtrim(dirname(__DIR__, 2), '/') . '/uploads/';
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        if (!move_uploaded_file($file['tmp_name'], $dir . $filename)) {
            Response::error('Lỗi lưu file.', 500); return;
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
        $item = $this->db->queryOne("SELECT * FROM media WHERE id = ?", [$p['id']]);
        if ($item) {
            $dir = defined('UPLOAD_DIR') ? UPLOAD_DIR : rtrim(dirname(__DIR__, 2), '/') . '/uploads/';
            @unlink($dir . $item['filename']);
            $this->db->execute("DELETE FROM media WHERE id = ?", [$p['id']]);
        }
        Response::json(['ok' => true]);
    }
}
