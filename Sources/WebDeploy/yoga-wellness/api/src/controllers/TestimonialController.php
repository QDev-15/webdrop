<?php
declare(strict_types=1);

class TestimonialController {
  public function __construct(private Database $db) {}

  public function index(): void {
    Auth::require();
    $testimonials = $this->db->queryAll("SELECT * FROM testimonials ORDER BY id DESC");
    Response::json($testimonials);
  }

  public function store(array $p = []): void {
    Auth::require();
    $b = bodyJson();
    $id = $this->db->execute(
      "INSERT INTO testimonials (author_name, author_role, author_avatar, rating, content, featured, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [$b['author_name'] ?? '', $b['author_role'] ?? '', $b['author_avatar'] ?? '', $b['rating'] ?? 5.0, $b['content'] ?? '', $b['featured'] ?? 0, $b['status'] ?? 'published']
    );
    Response::json(['id' => $id], 201);
  }

  public function update(array $p): void {
    Auth::require();
    $id = (int)($p['id'] ?? 0);
    if (!$id) { Response::error('Invalid ID'); return; }
    $b = bodyJson();
    $this->db->execute(
      "UPDATE testimonials SET author_name=?, author_role=?, author_avatar=?, rating=?, content=?, featured=?, status=? WHERE id=?",
      [$b['author_name'] ?? '', $b['author_role'] ?? '', $b['author_avatar'] ?? '', $b['rating'] ?? 5.0, $b['content'] ?? '', $b['featured'] ?? 0, $b['status'] ?? 'published', $id]
    );
    Response::json(['ok' => true]);
  }

  public function destroy(array $p): void {
    Auth::require();
    $id = (int)($p['id'] ?? 0);
    if (!$id) { Response::error('Invalid ID'); return; }
    $this->db->execute("DELETE FROM testimonials WHERE id=?", [$id]);
    Response::json(['ok' => true]);
  }
}
