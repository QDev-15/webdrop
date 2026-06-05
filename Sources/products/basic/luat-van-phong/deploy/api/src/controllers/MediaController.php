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
        if (empty($_FILES['file'])) Response::error('Không có file được upload');
        $file = $_FILES['file'];
        if ($file['error'] !== UPLOAD_ERR_OK) Response::error('Upload thất bại');

        $allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime  = $finfo->file($file['tmp_name']);
        if (!in_array($mime, $allowed)) Response::error('Loại file không được phép');
        if ($file['size'] > 10 * 1024 * 1024) Response::error('File quá lớn (tối đa 10MB)');

        $ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('media_', true) . '.' . strtolower($ext);
        $dest     = UPLOAD_DIR . $filename;

        if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);
        if (!move_uploaded_file($file['tmp_name'], $dest)) Response::error('Lưu file thất bại');

        $user = Auth::user();
        $id   = $this->db->execute(
            "INSERT INTO media (filename, filepath, filesize, filetype, alt_text, uploaded_by)
             VALUES (?, ?, ?, ?, ?, ?)",
            [
                $file['name'],
                UPLOAD_URL . $filename,
                $file['size'],
                $mime,
                $_POST['alt_text'] ?? '',
                $user['id'] ?? null,
            ]
        );
        Response::json([
            'id'       => $id,
            'filename' => $file['name'],
            'filepath' => UPLOAD_URL . $filename,
            'filetype' => $mime,
        ], 201);
    }

    public function destroy(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM media WHERE id=?", [$p['id']]);
        if (!$item) Response::notFound();
        $localPath = UPLOAD_DIR . basename($item['filepath']);
        if (is_file($localPath)) unlink($localPath);
        $this->db->execute("DELETE FROM media WHERE id=?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
