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
    $this->seedTeamMembers();
    $this->seedTestimonials();
    $this->seedBookings();
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

  private function seedTeamMembers(): void {
    $count = (int)$this->pdo->query('SELECT COUNT(*) FROM team_members')->fetchColumn();
    if ($count > 0) return;
    $teamMembers = [
      ['Yoga Master Hana', 'Founder & Lead Instructor', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&auto=format&fit=crop', 'Chuyên gia yoga với 15 năm kinh nghiệm'],
      ['Wellness Coach Linh', 'Wellness Coach', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&auto=format&fit=crop', 'Hỗ trợ khách hàng đạt mục tiêu wellness'],
      ['Therapist Mai', 'Massage Therapist', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&auto=format&fit=crop', 'Chuyên trị liệu massage thư giãn'],
      ['Instructor Tuấn', 'Pilates Instructor', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&auto=format&fit=crop', 'Giảng dạy Pilates nâng cao'],
      ['Nutritionist Vy', 'Nutritionist', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&auto=format&fit=crop', 'Tư vấn dinh dưỡng toàn bộ'],
    ];
    $stmt = $this->pdo->prepare('INSERT INTO team_members (name, role, image, experience) VALUES (?, ?, ?, ?)');
    foreach ($teamMembers as $member) {
      $stmt->execute($member);
    }
  }

  private function seedTestimonials(): void {
    $count = (int)$this->pdo->query('SELECT COUNT(*) FROM testimonials')->fetchColumn();
    if ($count > 0) return;
    $testimonials = [
      ['Anh Nguyễn', 'Yoga tại đây thay đổi cuộc sống tôi. Cảm thấy bình tĩnh và khỏe mạnh hơn!', 'Student', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&auto=format&fit=crop', 5.0, 1, 'published'],
      ['Chị Hương', 'Các instructor rất tận tâm. Lớp Pilates giúp tôi cải thiện tư thế lâu năm.', 'Working Professional', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&auto=format&fit=crop', 5.0, 1, 'published'],
      ['Anh Minh', 'Môi trường yên tĩnh, thoải mái. Đó là nơi tôi tìm được sự bình yên.', 'Executive', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&auto=format&fit=crop', 4.0, 1, 'published'],
      ['Chị Hoa', 'Dịch vụ massage thư giãn tuyệt vời. Cơ thể và tâm trí đều được chăm sóc.', 'Freelancer', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&auto=format&fit=crop', 5.0, 1, 'published'],
    ];
    $stmt = $this->pdo->prepare('INSERT INTO testimonials (author_name, content, author_role, author_avatar, rating, featured, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
    foreach ($testimonials as $test) {
      $stmt->execute($test);
    }
  }

  private function seedBookings(): void {
    // Placeholder — bookings are created when users submit via frontend form
  }

  public function query(string $sql, array $params = []): array {
    $stmt = $this->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function prepare(string $sql): PDOStatement {
    return $this->pdo->prepare($sql);
  }

  public function exec(string $sql): int {
    return $this->pdo->exec($sql);
  }

  public function execute(string $sql, array $params = []): int {
    $stmt = $this->prepare($sql);
    $stmt->execute($params);
    if (stripos(trim($sql), 'INSERT') === 0) {
      return (int)$this->pdo->lastInsertId();
    }
    return $stmt->rowCount();
  }

  public function queryOne(string $sql, array $params = []): ?array {
    $stmt = $this->prepare($sql);
    $stmt->execute($params);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result ?: null;
  }

  public function queryAll(string $sql, array $params = []): array {
    $stmt = $this->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function scalar(string $sql, array $params = []): mixed {
    $stmt = $this->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchColumn();
  }
}
?>
