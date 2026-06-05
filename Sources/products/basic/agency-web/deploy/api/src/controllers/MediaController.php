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
        if (!isset($_FILES['file'])) {
            Response::error('Không có file được upload.');
            return;
        }
        $file   = $_FILES['file'];
        $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!in_array($file['type'], $allowed, true)) {
            Response::error('Loại file không được hỗ trợ.');
            return;
        }
        if ($file['size'] > 10 * 1024 * 1024) {
            Response::error('File quá lớn. Tối đa 10MB.');
            return;
        }

        $uploadDir = UPLOAD_DIR;
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        $ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('', true) . '.' . $ext;
        $filepath = $uploadDir . $filename;

        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            Response::error('Upload thất bại.', 500);
            return;
        }

        $user    = Auth::user();
        $altText = $_POST['alt_text'] ?? '';
        $id   = $this->db->execute(
            "INSERT INTO media (filename, filepath, filesize, filetype, alt_text, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)",
            [
                $file['name'],
                $filename,
                $file['size'],
                $file['type'],
                $altText,
                $user['id'],
            ]
        );

        Response::json([
            'id'       => $id,
            'filename' => $file['name'],
            'url'      => UPLOAD_URL . $filename,
        ], 201);
    }

    public function destroy(array $p): void {
        Auth::require();
        $media = $this->db->queryOne("SELECT * FROM media WHERE id=?", [$p['id']]);
        if ($media) {
            $path = UPLOAD_DIR . $media['filepath'];
            if (file_exists($path)) unlink($path);
            $this->db->execute("DELETE FROM media WHERE id=?", [$p['id']]);
        }
        Response::json(['ok' => true]);
    }
}
