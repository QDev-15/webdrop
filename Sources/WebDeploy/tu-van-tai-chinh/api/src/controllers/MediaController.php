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
        if (empty($_FILES['file'])) { Response::error('Không có file được upload.'); return; }
        $file    = $_FILES['file'];
        $allowed = ['image/jpeg','image/png','image/gif','image/webp','image/svg+xml'];
        if (!in_array($file['type'], $allowed, true)) {
            Response::error('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP, SVG).'); return;
        }
        if ($file['size'] > 5 * 1024 * 1024) {
            Response::error('File không được vượt quá 5MB.'); return;
        }
        $uploadDir = defined('UPLOAD_DIR') ? UPLOAD_DIR : __DIR__ . '/../../uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
        $ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('img_', true) . '.' . strtolower($ext);
        $filepath = $uploadDir . $filename;
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            Response::error('Upload thất bại.', 500); return;
        }
        $u = Auth::user();
        $id = $this->db->execute(
            "INSERT INTO media (filename, filepath, filesize, filetype, alt_text, uploaded_by) VALUES (?,?,?,?,?,?)",
            [$filename, 'uploads/' . $filename, $file['size'], $file['type'], $file['name'], $u['id']]
        );
        $url = (defined('UPLOAD_URL') ? UPLOAD_URL : '') . $filename;
        Response::json(['id' => $id, 'url' => $url, 'filename' => $filename], 201);
    }

    public function destroy(array $p): void {
        Auth::require();
        $m = $this->db->queryOne("SELECT * FROM media WHERE id=?", [$p['id']]);
        if (!$m) { Response::error('Không tìm thấy.', 404); return; }
        $uploadDir = defined('UPLOAD_DIR') ? UPLOAD_DIR : __DIR__ . '/../../uploads/';
        $path = $uploadDir . $m['filename'];
        if (file_exists($path)) @unlink($path);
        $this->db->execute("DELETE FROM media WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
