<?php
declare(strict_types=1);

class TeamController {
  public function __construct(private Database $db) {}

  public function index(): void {
    Auth::require();
    $members = $this->db->query("SELECT * FROM team_members ORDER BY id");
    Response::json($members);
  }

  public function store(array $p = []): void {
    Auth::require();
    $b = bodyJson();
    $id = $this->db->execute(
      "INSERT INTO team_members (name, role, image, experience, cert, specialties) VALUES (?, ?, ?, ?, ?, ?)",
      [$b['name'] ?? '', $b['role'] ?? '', $b['image'] ?? '', $b['experience'] ?? '', $b['cert'] ?? '', $b['specialties'] ?? '']
    );
    Response::json(['id' => $id], 201);
  }

  public function update(array $p): void {
    Auth::require();
    $id = (int)($p['id'] ?? 0);
    if (!$id) { Response::error('Invalid ID'); return; }
    $b = bodyJson();
    $this->db->execute(
      "UPDATE team_members SET name=?, role=?, image=?, experience=?, cert=?, specialties=? WHERE id=?",
      [$b['name'] ?? '', $b['role'] ?? '', $b['image'] ?? '', $b['experience'] ?? '', $b['cert'] ?? '', $b['specialties'] ?? '', $id]
    );
    Response::json(['ok' => true]);
  }

  public function destroy(array $p): void {
    Auth::require();
    $id = (int)($p['id'] ?? 0);
    if (!$id) { Response::error('Invalid ID'); return; }
    $this->db->execute("DELETE FROM team_members WHERE id=?", [$id]);
    Response::json(['ok' => true]);
  }
}
