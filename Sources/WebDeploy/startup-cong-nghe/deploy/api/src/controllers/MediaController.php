<?php

class MediaController {
    private Database $db;
    public function __construct(Database $db) { $this->db = $db; }

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM media ORDER BY created_at DESC");
        Response::json($items);
    }

    public function upload(array $p): void {
        Auth::require();
        if (empty($_FILES['file'])) {
            Response::error('Không có file được upload');
        }
        $file = $_FILES['file'];
        $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!in_array($file['type'], $allowed)) {
            Response::error('Chỉ cho phép upload ảnh (JPG, PNG, GIF, WebP, SVG)');
        }
        $maxSize = 5 * 1024 * 1024; // 5MB
        if ($file['size'] > $maxSize) {
            Response::error('File quá lớn (tối đa 5MB)');
        }
        $ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('media_', true) . '.' . $ext;
        $uploadDir = UPLOAD_DIR;
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
        $filepath = $uploadDir . $filename;
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            Response::error('Upload thất bại');
        }
        $user = Auth::user();
        $id = $this->db->execute(
            "INSERT INTO media (filename, filepath, filesize, filetype, uploaded_by) VALUES (?, ?, ?, ?, ?)",
            [$filename, UPLOAD_URL . $filename, $file['size'], $file['type'], $user['id'] ?? null]
        );
        Response::json([
            'id'       => $id,
            'filename' => $filename,
            'url'      => UPLOAD_URL . $filename,
            'filesize' => $file['size'],
            'filetype' => $file['type'],
        ], 201);
    }

    public function destroy(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM media WHERE id=?", [$p['id']]);
        if ($item) {
            $localPath = UPLOAD_DIR . $item['filename'];
            if (file_exists($localPath)) @unlink($localPath);
            $this->db->execute("DELETE FROM media WHERE id=?", [$p['id']]);
        }
        Response::json(['ok' => true]);
    }
}
