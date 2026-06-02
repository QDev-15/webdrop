<?php
/**
 * Database — PDO wrapper cho SQLite / MySQL / PostgreSQL
 */
class Database {
    private PDO $pdo;

    public function __construct() {
        if (DB_TYPE === 'sqlite') {
            $dir = dirname(DB_FILE);
            if (!is_dir($dir)) mkdir($dir, 0755, true);
            $this->pdo = new PDO('sqlite:' . DB_FILE, null, null, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            $this->pdo->exec('PRAGMA foreign_keys = ON');
        } elseif (DB_TYPE === 'mysql') {
            $dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        } else {
            $dsn = 'pgsql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME;
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        }
        $this->init();
    }

    private function init(): void {
        $schema = file_get_contents(__DIR__ . '/../schema.sql');

        // Strip SQL comments trước khi parse (-- dòng đơn và /* */ khối)
        $schema = preg_replace('/--[^\n]*/', '', $schema);
        $schema = preg_replace('/\/\*.*?\*\//s', '', $schema);

        // Thực thi từng statement (chỉ CREATE TABLE IF NOT EXISTS — an toàn khi chạy lại)
        foreach (array_filter(array_map('trim', explode(';', $schema))) as $stmt) {
            try {
                $this->pdo->exec($stmt);
            } catch (\PDOException $e) {
                // Chỉ bỏ qua lỗi "table already exists" hoặc UNIQUE constraint
                // Không swallow lỗi HY000 blanket — kiểm tra message cụ thể
                $msg = $e->getMessage();
                $isAlreadyExists = str_contains($msg, 'already exists');
                $isUnique        = $e->getCode() === '23000';
                if (!$isAlreadyExists && !$isUnique) throw $e;
            }
        }

        $this->seedAdmin();
        $this->seedSettings();
    }

    private function seedAdmin(): void {
        // Chỉ seed nếu chưa có user nào trong DB
        $count = (int) $this->pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
        if ($count === 0) {
            $hash = password_hash('admin@123', PASSWORD_BCRYPT);
            $stmt = $this->pdo->prepare(
                "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
            );
            $stmt->execute(['Admin', 'admin@example.com', $hash, 'superadmin']);
        }
    }

    private function seedSettings(): void {
        $defaults = [
            ['site_name',        'Tên website',       'general'],
            ['site_description', 'Mô tả website',     'general'],
            ['site_email',       'contact@example.com','general'],
            ['site_phone',       '',                  'general'],
            ['site_address',     '',                  'general'],
            ['meta_title',       '',                  'seo'],
            ['meta_description', '',                  'seo'],
            ['google_analytics_id', '',               'seo'],
            ['social_facebook',  '',                  'social'],
            ['social_youtube',   '',                  'social'],
            ['social_instagram', '',                  'social'],
            ['social_zalo',      '',                  'social'],
            ['maintenance_mode', '0',                 'system'],
        ];
        $stmt = $this->pdo->prepare(
            'INSERT OR IGNORE INTO settings (key, value, "group") VALUES (?, ?, ?)'
        );
        foreach ($defaults as $row) $stmt->execute($row);
    }

    public function query(string $sql, array $params = []): array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $result = $this->query($sql, $params);
        return $result[0] ?? null;
    }

    public function execute(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (int) $this->pdo->lastInsertId();
    }

    public function scalar(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }
}
