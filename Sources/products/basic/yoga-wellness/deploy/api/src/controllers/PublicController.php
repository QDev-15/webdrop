<?php
class PublicController {
  public function __construct(private Database $db) {}

  public function settings() {
    $rows = $this->db->query("SELECT key, value FROM settings WHERE grp NOT IN ('smtp','cloudinary','integrations','payment')");
    $result = [];
    foreach ($rows as $r) $result[$r['key']] = $r['value'];
    Response::json($result);
  }

  public function heroSlides() {
    $slides = $this->db->query("SELECT id, title, subtitle, image, button_text, button_link FROM hero_slides WHERE status='published' ORDER BY id");
    Response::json($slides);
  }

  public function services() {
    $services = $this->db->query("SELECT id, name, description, duration, level, image, max_capacity FROM services WHERE status='published' ORDER BY id");
    Response::json($services);
  }

  public function serviceBySlug(array $p): void {
    $slug = $p['slug'] ?? '';
    $service = $this->db->queryOne("SELECT id, name, description, duration, level, image, max_capacity FROM services WHERE LOWER(REPLACE(name, ' ', '-'))=? AND status='published' LIMIT 1", [$slug]);
    if (!$service) { Response::error('Không tìm thấy.', 404); return; }
    Response::json($service);
  }

  public function team() {
    $team = $this->db->query("SELECT id, name, role, image, experience, cert, specialties FROM team_members ORDER BY id");
    Response::json($team);
  }

  public function testimonials() {
    $tests = $this->db->query("SELECT id, author_name, author_role, author_avatar, rating, content FROM testimonials WHERE status='published' ORDER BY id DESC");
    Response::json($tests);
  }

  public function submitBooking() {
    $body = bodyJson();
    $id = $this->db->execute(
      "INSERT INTO bookings (name, email, phone, service_id, experience_level, preferred_time, start_date, package, health_note, goal, how_know, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')",
      [$body['name'] ?? '', $body['email'] ?? '', $body['phone'] ?? '', $body['service_id'] ?? 1, $body['experience_level'] ?? '', $body['preferred_time'] ?? '', $body['start_date'] ?? '', $body['package'] ?? '', $body['health_note'] ?? '', $body['goal'] ?? '', $body['how_know'] ?? '']
    );
    Response::json(['id' => $id], 201);
  }

  public function submitContact() {
    $body = bodyJson();
    $id = $this->db->execute(
      "INSERT INTO contacts (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, 'new')",
      [$body['name'] ?? '', $body['email'] ?? '', $body['phone'] ?? '', $body['subject'] ?? '', $body['message'] ?? '']
    );
    Response::json(['id' => $id], 201);
  }

  public function sitemap() {
    header('Content-Type: application/xml; charset=utf-8');
    $staticRoutes = ['/', '/dich-vu', '/dat-lich', '/lien-he'];
    echo '<?xml version="1.0" encoding="UTF-8"?>';
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    foreach ($staticRoutes as $route) {
      $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
      echo '<url><loc>https://' . htmlspecialchars($host) . $route . '</loc></url>';
    }
    echo '</urlset>';
  }
}
?>
