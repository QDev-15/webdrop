<?php
declare(strict_types=1);

class MediaController
{
    private array $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    private int   $maxSize      = 5 * 1024 * 1024; // 5 MB

    public function __construct(private Database $db) {}

    public function index(array $p): void
    {
        Auth::require();
        $media = $this->db->query("SELECT * FROM media ORDER BY created_at DESC");
        Response::json($media);
    }

    public function upload(array $p): void
    {
        Auth::require();

        if (empty($_FILES['file'])) {
            Response::error('Không tìm thấy file.');
        }

        $file = $_FILES['file'];

        if ($file['error'] !== UPLOAD_ERR_OK) {
            Response::error('Lỗi upload: ' . $file['error']);
        }

        if ($file['size'] > $this->maxSize) {
            Response::error('File quá lớn. Tối đa 5MB.');
        }

        $finfo    = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($file['tmp_name']);

        if (!in_array($mimeType, $this->allowedTypes, true)) {
            Response::error('Loại file không được phép.');
        }

        $ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('media_', true) . '.' . strtolower($ext);
        $destDir  = UPLOAD_DIR;

        if (!is_dir($destDir)) {
            mkdir($destDir, 0755, true);
        }

        $destPath = $destDir . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destPath)) {
            Response::error('Không thể lưu file.', 500);
        }

        $altText = trim($_POST['alt_text'] ?? '');
        $user    = Auth::user();

        $id = $this->db->execute(
            "INSERT INTO media (filename, filepath, filesize, filetype, alt_text, uploaded_by)
             VALUES (?,?,?,?,?,?)",
            [$filename, UPLOAD_URL . $filename, $file['size'], $mimeType, $altText, $user['id']]
        );

        Response::json([
            'id'       => (int)$id,
            'filename' => $filename,
            'filepath' => UPLOAD_URL . $filename,
            'filetype' => $mimeType,
        ], 201);
    }

    public function destroy(array $p): void
    {
        Auth::require();
        $id    = (int)$p['id'];
        $media = $this->db->row("SELECT * FROM media WHERE id=?", [$id]);

        if (!$media) Response::notFound('File không tồn tại.');

        // Delete physical file
        $localPath = UPLOAD_DIR . $media['filename'];
        if (file_exists($localPath)) {
            unlink($localPath);
        }

        $this->db->execute("DELETE FROM media WHERE id=?", [$id]);
        Response::json(['ok' => true]);
    }
}
