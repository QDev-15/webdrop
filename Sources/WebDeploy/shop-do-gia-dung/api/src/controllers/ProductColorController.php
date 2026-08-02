<?php
declare(strict_types=1);

class ProductColorController {
    public function __construct(private Database $db) {}

    public function index(): void {
        $rows = $this->db->query("SELECT * FROM product_colors ORDER BY sort_order ASC, id ASC");
        Response::json($rows);
    }

    public function show(array $p): void {
        $row = $this->db->queryOne("SELECT * FROM product_colors WHERE id = ?", [(int)$p['id']]);
        if (!$row) { Response::json(['error' => 'Không tìm thấy'], 404); return; }
        Response::json($row);
    }

    public function store(): void {
        if (!Auth::check()) { Response::json(['error' => 'Chưa đăng nhập'], 401); return; }
        $body = bodyJson();
        $name = trim((string)($body['name'] ?? ''));
        $hex  = trim((string)($body['hex']  ?? '#000000'));
        if (!$name) { Response::json(['error' => 'Tên màu không được trống'], 422); return; }
        if (!preg_match('/^#[0-9a-fA-F]{3,8}$/', $hex)) { $hex = '#000000'; }
        $id = $this->db->execute(
            "INSERT INTO product_colors (name, hex, sort_order) VALUES (?, ?, ?)",
            [$name, $hex, (int)($body['sort_order'] ?? 0)]
        );
        Response::json(['id' => $id, 'name' => $name, 'hex' => $hex], 201);
    }

    public function update(array $p): void {
        if (!Auth::check()) { Response::json(['error' => 'Chưa đăng nhập'], 401); return; }
        $row = $this->db->queryOne("SELECT id FROM product_colors WHERE id = ?", [(int)$p['id']]);
        if (!$row) { Response::json(['error' => 'Không tìm thấy'], 404); return; }
        $body = bodyJson();
        $name = trim((string)($body['name'] ?? ''));
        $hex  = trim((string)($body['hex']  ?? '#000000'));
        if (!$name) { Response::json(['error' => 'Tên màu không được trống'], 422); return; }
        if (!preg_match('/^#[0-9a-fA-F]{3,8}$/', $hex)) { $hex = '#000000'; }
        $this->db->execute(
            "UPDATE product_colors SET name = ?, hex = ?, sort_order = ? WHERE id = ?",
            [$name, $hex, (int)($body['sort_order'] ?? 0), (int)$p['id']]
        );
        Response::json(['ok' => true]);
    }

    public function destroy(array $p): void {
        if (!Auth::check()) { Response::json(['error' => 'Chưa đăng nhập'], 401); return; }
        $this->db->execute("DELETE FROM product_colors WHERE id = ?", [(int)$p['id']]);
        Response::json(['ok' => true]);
    }
}
