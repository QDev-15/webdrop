<?php
declare(strict_types=1);

class Database {
    private static ?PDO $pdo = null;

    public static function get(): PDO {
        if (self::$pdo !== null) return self::$pdo;

        $dbDir = dirname(DB_FILE);
        if (!is_dir($dbDir)) {
            if (!@mkdir($dbDir, 0755, true) && !is_dir($dbDir)) {
                throw new \RuntimeException('Không thể tạo thư mục database: ' . $dbDir);
            }
        }

        $needsSeed = !file_exists(DB_FILE);

        $dsn = 'sqlite:' . DB_FILE;
        self::$pdo = new PDO($dsn, null, null, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        self::$pdo->exec('PRAGMA foreign_keys = ON');
        self::$pdo->exec('PRAGMA journal_mode = WAL');

        if ($needsSeed) {
            self::migrate();
        }

        return self::$pdo;
    }

    private static function migrate(): void {
        $sql = file_get_contents(__DIR__ . '/../schema.sql');
        if ($sql === false) {
            throw new \RuntimeException('Không đọc được schema.sql — file bị thiếu.');
        }
        self::$pdo->exec($sql);
    }

    public function query(string $sql, array $params = []): array {
        $stmt = self::get()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $stmt = self::get()->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function execute(string $sql, array $params = []): int {
        $stmt = self::get()->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount();
    }

    public function lastInsertId(): int {
        return (int) self::get()->lastInsertId();
    }
}
