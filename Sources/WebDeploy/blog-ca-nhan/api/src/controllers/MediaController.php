<?php
declare(strict_types=1);

class MediaController {
    public function __construct(private Database $db) {}

    public function index(array $p): void {
        Auth::require();
        $page   = max(1, (int)($_GET['page'] ?? 1));
        $limit  = min((int)($_GET['limit'] ?? 24), 100);
        $offset = ($page - 1) * $limit;
        $total  = $this->db->scalar("SELECT COUNT(*) FROM media");
        $items  = $this->db->query(
            "SELECT * FROM media ORDER BY created_at DESC LIMIT ? OFFSET ?",
            [$limit, $offset]
        );
        Response::json([
            'data'  => $items,
            'total' => (int)$total,
            'page'  => $page,
        ]);
    }

    public function upload(array $p): void {
        Auth::require();
        if (empty($_FILES['file'])) {
            Response::error('Không có file được upload.');
            return;
        }
        $file    = $_FILES['file'];
        $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!in_array($file['type'], $allowed, true)) {
            Response::error('Chỉ cho phép upload ảnh (JPG, PNG, GIF, WebP, SVG).');
            return;
        }
        if ($file['size'] > 10 * 1024 * 1024) {
            Response::error('File không được vượt quá 10MB.');
            return;
        }
        $uploadDir = UPLOAD_DIR;
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
        $ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('img_', true) . '.' . strtolower($ext);
        $filepath = $uploadDir . $filename;
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            Response::error('Upload thất bại.');
            return;
        }
        $user = Auth::user();
        $id = $this->db->execute(
            "INSERT INTO media (filename, filepath, filesize, filetype, alt_text, uploaded_by)
             VALUES (?, ?, ?, ?, ?, ?)",
            [
                $file['name'],
                UPLOAD_URL . $filename,
                $file['size'],
                $file['type'],
                $_POST['alt_text'] ?? '',
                $user['id'],
            ]
        );
        Response::json([
            'id'       => $id,
            'filename' => $file['name'],
            'filepath' => UPLOAD_URL . $filename,
            'filesize' => $file['size'],
            'filetype' => $file['type'],
        ], 201);
    }

    public function destroy(array $p): void {
        Auth::require();
        $item = $this->db->queryOne("SELECT * FROM media WHERE id = ?", [$p['id']]);
        if (!$item) { Response::error('Không tìm thấy.', 404); return; }
        // Delete physical file
        $filename = basename($item['filepath']);
        $localPath = UPLOAD_DIR . $filename;
        if (file_exists($localPath)) unlink($localPath);
        $this->db->execute("DELETE FROM media WHERE id = ?", [$p['id']]);
        Response::json(['ok' => true]);
    }
}
