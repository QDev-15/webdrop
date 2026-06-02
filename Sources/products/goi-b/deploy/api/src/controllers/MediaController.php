<?php
class MediaController {
    // MIME type thật → extension an toàn (không dùng extension từ client)
    private const ALLOWED_MIME = [
        'image/jpeg'    => 'jpg',
        'image/png'     => 'png',
        'image/gif'     => 'gif',
        'image/webp'    => 'webp',
        'image/svg+xml' => 'svg',
    ];

    public function __construct(private Database $db) {}

    public function index(array $params): void {
        Auth::require();
        Response::ok($this->db->query("SELECT * FROM media ORDER BY created_at DESC"));
    }

    public function store(array $params): void {
        Auth::require();

        if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            Response::error('Không có file nào được gửi lên hoặc upload thất bại');
        }

        $file = $_FILES['file'];

        // Validate kích thước (5MB)
        if ($file['size'] > 5 * 1024 * 1024) {
            Response::error('File không được vượt quá 5MB');
        }

        // Validate MIME type bằng magic bytes (không tin client)
        $finfo    = new finfo(FILEINFO_MIME_TYPE);
        $realMime = $finfo->file($file['tmp_name']);

        if (!array_key_exists($realMime, self::ALLOWED_MIME)) {
            Response::error('Chỉ chấp nhận file ảnh (jpg, png, gif, webp, svg)');
        }

        // Tạo tên file an toàn từ MIME thật (không từ client)
        $ext      = self::ALLOWED_MIME[$realMime];
        $filename = uniqid('media_', true) . '.' . $ext;

        $uploadDir = UPLOAD_DIR;
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        // Tạo .htaccess trong uploads/ để chặn PHP execution (nếu chưa có)
        $htaccess = $uploadDir . '.htaccess';
        if (!file_exists($htaccess)) {
            file_put_contents($htaccess,
                "Options -Indexes -ExecCGI\n" .
                "php_flag engine off\n" .
                "<FilesMatch \"\\.php$\">\n  Require all denied\n</FilesMatch>\n"
            );
        }

        $filepath = $uploadDir . $filename;
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            Response::error('Upload thất bại. Kiểm tra quyền ghi thư mục uploads/');
        }

        $id = $this->db->execute(
            "INSERT INTO media (filename, filepath, filesize, filetype, alt_text, uploaded_by)
             VALUES (?, ?, ?, ?, ?, ?)",
            [
                basename($file['name']),
                UPLOAD_URL . $filename,
                $file['size'],
                $realMime,
                $_POST['alt_text'] ?? '',
                Auth::id(),
            ]
        );
        Response::created($this->db->queryOne("SELECT * FROM media WHERE id = ?", [$id]));
    }

    public function destroy(array $params): void {
        Auth::require();
        $media = $this->db->queryOne("SELECT * FROM media WHERE id = ?", [$params['id']]);
        if (!$media) Response::notFound('File không tồn tại');

        // Xóa file vật lý — kiểm tra path traversal trước khi unlink
        $filename  = basename(parse_url($media['filepath'], PHP_URL_PATH));
        $localPath = realpath(UPLOAD_DIR . $filename);
        $uploadDir = realpath(UPLOAD_DIR);

        if ($localPath && $uploadDir && str_starts_with($localPath, $uploadDir . DIRECTORY_SEPARATOR)) {
            @unlink($localPath);
        }

        $this->db->execute("DELETE FROM media WHERE id = ?", [$params['id']]);
        Response::ok();
    }
}
