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
            Response::error('Không có file được upload.');
            return;
        }
        $file = $_FILES['file'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            Response::error('Upload thất bại, mã lỗi: ' . $file['error']);
            return;
        }
        $maxSize = 10 * 1024 * 1024; // 10MB
        if ($file['size'] > $maxSize) {
            Response::error('File quá lớn. Tối đa 10MB.');
            return;
        }
        $allowed = ['image/jpeg','image/png','image/gif','image/webp','image/svg+xml'];
        $mime = mime_content_type($file['tmp_name']);
        if (!in_array($mime, $allowed, true)) {
            Response::error('Chỉ chấp nhận file ảnh (jpg, png, gif, webp, svg).');
            return;
        }
        $ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('img_', true) . '.' . strtolower($ext);
        $uploadDir = UPLOAD_DIR;
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
        $dest = $uploadDir . $filename;
        if (!move_uploaded_file($file['tmp_name'], $dest)) {
            Response::error('Không thể lưu file.');
            return;
        }
        $user = Auth::user();
        $id = $this->db->execute(
            "INSERT INTO media (filename, filepath, filesize, filetype, alt_text, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)",
            [$filename, UPLOAD_URL . $filename, $file['size'], $mime, $file['name'], $user['id'] ?? null]
        );
        Response::json([
            'id'       => $id,
            'filename' => $filename,
            'filepath' => UPLOAD_URL . $filename,
            'filesize' => $file['size'],
            'filetype' => $mime,
        ], 201);
    }

    public function destroy(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM media WHERE id = ?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        $localPath = UPLOAD_DIR . $item['filename'];
        if (file_exists($localPath)) unlink($localPath);
        $this->db->execute("DELETE FROM media WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
