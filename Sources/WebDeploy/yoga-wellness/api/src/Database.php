<?php
class Database {
  private static self $instance;
  private PDO $pdo;

  private function __construct() {
    $this->pdo = new PDO('sqlite:' . DB_FILE, null, null, [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $this->pdo->exec('PRAGMA foreign_keys = ON');
  }

  public static function getInstance(): self {
    if (!isset(self::$instance)) {
      self::$instance = new self();
      self::$instance->migrate();
    }
    return self::$instance;
  }

  private function migrate(): void {
    $sqlFile = __DIR__ . '/../schema.sql';
    $sql = file_get_contents($sqlFile);
    if ($sql === false) throw new RuntimeException('Cannot read schema.sql');
    $sql = preg_replace('/^\s*--.*$/m', '', $sql);
    $statements = array_filter(array_map('trim', explode(';', $sql)), fn($s) => $s !== '');
    foreach ($statements as $stmt) {
      $this->pdo->exec($stmt . ';');
    }
    $this->seedData();
  }

  private function seedData(): void {
    $this->seedUsers();
    $this->seedSettings();
    $this->seedHeroSlides();
    $this->seedServices();
  }

  private function seedUsers(): void {
    $count = (int)$this->pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
    if ($count > 0) return;
    $hash = password_hash('123456', PASSWORD_DEFAULT);
    $stmt = $this->pdo->prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
    $stmt->execute(['Admin', 'sysadmin@admin.com', $hash, 'superadmin']);
  }

  private function seedSettings(): void {
    $count = (int)$this->pdo->query('SELECT COUNT(*) FROM settings')->fetchColumn();
    if ($count > 0) return;
    $defaults = [
      ['general', 'site_name', 'Yoga & Wellness'],
      ['general', 'site_tagline', 'Không gian bình yên'],
      ['general', 'site_phone', '0901 234 567'],
      ['general', 'site_email', 'hello@yoga-wellness.vn'],
      ['general', 'site_address', 'Số 123, Tên Đường, Quận 1, TP.HCM'],
      ['general', 'working_hours', 'Thứ 2–6: 6:00–21:00 | Thứ 7: 6:00–21:00 | CN: 7:00–19:00'],
      ['seo', 'meta_title', 'Yoga & Wellness — Không gian bình yên'],
      ['seo', 'meta_description', 'Yoga studio tại TP.HCM — Hatha, Vinyasa, Thiền định, Prenatal Yoga'],
      ['seo', 'meta_keywords', 'yoga, wellness, thiền định, hatha yoga, vinyasa'],
      ['social', 'facebook', ''],
      ['social', 'instagram', ''],
      ['social', 'youtube', ''],
      ['social', 'tiktok', ''],
      ['footer', 'copyright', '© 2026 Yoga & Wellness — Chứng nhận RYT · Yoga Alliance'],
      ['integrations', 'unsplash_access_key', 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY'],
      ['about', 'tagline', 'Hơi thở. Chuyển động. Cân bằng.'],
      ['about', 'description', 'Mỗi buổi tập là một hành trình trở về với chính mình. Khám phá không gian yoga thuần khiết, nơi thân và tâm được nuôi dưỡng qua từng hơi thở.'],
    ];
    $stmt = $this->pdo->prepare('INSERT INTO settings (grp, key, value) VALUES (?, ?, ?)');
    foreach ($defaults as [$grp, $key, $value]) {
      $stmt->execute([$grp, $key, $value]);
    }
  }

  private function seedHeroSlides(): void {
    $count = (int)$this->pdo->query('SELECT COUNT(*) FROM hero_slides')->fetchColumn();
    if ($count > 0) return;
    $slides = [
      ['Hơi thở. Chuyển động. Cân bằng.', 'Mỗi buổi tập là một hành trình trở về với chính mình.', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80&auto=format&fit=crop', 'Đăng ký lớp học', 'dat-lich', 'published'],
    ];
    $stmt = $this->pdo->prepare('INSERT INTO hero_slides (title, subtitle, image, button_text, button_link, status) VALUES (?, ?, ?, ?, ?, ?)');
    foreach ($slides as $slide) {
      $stmt->execute($slide);
    }
  }

  private function seedServices(): void {
    $count = (int)$this->pdo->query('SELECT COUNT(*) FROM services')->fetchColumn();
    if ($count > 0) return;
    $services = [
      ['Hatha Yoga', 'Nền tảng yoga cổ điển. Kết hợp tư thế (asana) và kiểm soát hơi thở (pranayama)', 60, 'Người mới & Tất cả cấp độ', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=70&auto=format&fit=crop', 15, 1, 'published'],
      ['Vinyasa Flow', 'Dòng chảy liên tục, đồng bộ hơi thở và chuyển động. Đốt cháy năng lượng.', 75, 'Trung cấp trở lên', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=70&auto=format&fit=crop', 12, 2, 'published'],
      ['Thiền Định & Mindfulness', 'Lớp thiền chánh niệm kết hợp các kỹ thuật thiền định khác nhau', 45, 'Mọi cấp độ', 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&q=70&auto=format&fit=crop', 20, 3, 'published'],
      ['Prenatal Yoga', 'Được thiết kế đặc biệt cho phụ nữ mang thai từ tam cá nguyệt thứ hai trở đi.', 60, 'Dành cho mẹ bầu', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=70&auto=format&fit=crop', 8, 4, 'published'],
    ];
    $stmt = $this->pdo->prepare('INSERT INTO services (name, description, duration, level, image, max_capacity, teacher_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    foreach ($services as $service) {
      $stmt->execute($service);
    }
  }

  public function query(string $sql): PDOStatement {
    return $this->pdo->query($sql);
  }

  public function prepare(string $sql): PDOStatement {
    return $this->pdo->prepare($sql);
  }

  public function exec(string $sql): int {
    return $this->pdo->exec($sql);
  }
}
?>
