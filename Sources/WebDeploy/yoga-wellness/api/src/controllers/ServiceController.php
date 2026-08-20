<?php
declare(strict_types=1);

class ServiceController {
  public function __construct(private Database $db) {}

  public function index(): void {
    Auth::require();
    $services = $this->db->query("SELECT * FROM services ORDER BY id");
    Response::json($services);
  }

  public function store(array $p = []): void {
    Auth::require();
    $b = bodyJson();
    $this->db->execute(
      "INSERT INTO services (name, description, duration, level, image, max_capacity, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [$b['name'] ?? '', $b['description'] ?? '', $b['duration'] ?? 60, $b['level'] ?? '', $b['image'] ?? '', $b['max_capacity'] ?? 15, $b['status'] ?? 'published']
    );
    Response::json(['ok' => true], 201);
  }

  public function update(array $p): void {
    Auth::require();
    $id = (int)($p['id'] ?? 0);
    if (!$id) { Response::error('Invalid ID'); return; }
    $b = bodyJson();
    $this->db->execute(
      "UPDATE services SET name=?, description=?, duration=?, level=?, image=?, max_capacity=?, status=? WHERE id=?",
      [$b['name'] ?? '', $b['description'] ?? '', $b['duration'] ?? 60, $b['level'] ?? '', $b['image'] ?? '', $b['max_capacity'] ?? 15, $b['status'] ?? 'published', $id]
    );
    Response::json(['ok' => true]);
  }

  public function destroy(array $p): void {
    Auth::require();
    $id = (int)($p['id'] ?? 0);
    if (!$id) { Response::error('Invalid ID'); return; }
    $this->db->execute("DELETE FROM services WHERE id=?", [$id]);
    Response::json(['ok' => true]);
  }
}
