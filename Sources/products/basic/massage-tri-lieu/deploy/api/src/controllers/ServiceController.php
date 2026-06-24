<?php
declare(strict_types=1);

class ServiceController {
    public function __construct(private Database $db) {}

    // ─── Services ─────────────────────────────────────────────────────────────

    public function index(array $p): void {
        Auth::require();
        $items = $this->db->query(
            "SELECT s.*, sc.name AS category_name FROM services s
             LEFT JOIN service_categories sc ON sc.id = s.category_id
             ORDER BY s.sort_order ASC"
        );
        Response::json($items);
    }

    public function store(array $p): void {
        Auth::require();
        $b    = bodyJson();
        $name = trim((string)($b['name'] ?? ''));
        if (!$name) { Response::error('Ten dich vu khong duoc de trong.', 422); return; }
        $catId      = (int)($b['category_id'] ?? 1);
        $tag        = trim((string)($b['tag'] ?? ''));
        $desc       = trim((string)($b['description'] ?? ''));
        $image      = trim((string)($b['image'] ?? ''));
        $priceFrom  = (int)($b['price_from'] ?? 0);
        $duration   = trim((string)($b['duration'] ?? ''));
        $sort       = (int)($b['sort_order'] ?? 0);
        $featured   = isset($b['featured']) ? (int)$b['featured'] : 0;
        $active     = isset($b['active']) ? (int)$b['active'] : 1;
        $id = $this->db->execute(
            "INSERT INTO services (category_id, name, tag, description, image, price_from, duration, sort_order, featured, active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [$catId, $name, $tag, $desc, $image, $priceFrom, $duration, $sort, $featured, $active]
        );
        Response::json($this->db->queryOne("SELECT * FROM services WHERE id = ?", [$id]), 201);
    }

    public function update(array $p): void {
        Auth::require();
        $id  = (int)($p['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM services WHERE id = ?", [$id]);
        if (!$row) { Response::error('Khong tim thay dich vu.', 404); return; }
        $b          = bodyJson();
        $catId      = isset($b['category_id']) ? (int)$b['category_id'] : (int)$row['category_id'];
        $name       = trim((string)($b['name'] ?? $row['name']));
        $tag        = trim((string)($b['tag'] ?? $row['tag']));
        $desc       = trim((string)($b['description'] ?? $row['description']));
        $image      = trim((string)($b['image'] ?? $row['image']));
        $priceFrom  = isset($b['price_from']) ? (int)$b['price_from'] : (int)$row['price_from'];
        $duration   = trim((string)($b['duration'] ?? $row['duration']));
        $sort       = isset($b['sort_order']) ? (int)$b['sort_order'] : (int)$row['sort_order'];
        $featured   = isset($b['featured']) ? (int)$b['featured'] : (int)$row['featured'];
        $active     = isset($b['active']) ? (int)$b['active'] : (int)$row['active'];
        $this->db->execute(
            "UPDATE services SET category_id=?, name=?, tag=?, description=?, image=?, price_from=?, duration=?, sort_order=?, featured=?, active=? WHERE id=?",
            [$catId, $name, $tag, $desc, $image, $priceFrom, $duration, $sort, $featured, $active, $id]
        );
        Response::json($this->db->queryOne("SELECT * FROM services WHERE id = ?", [$id]));
    }

    public function destroy(array $p): void {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        if (!$this->db->queryOne("SELECT id FROM services WHERE id = ?", [$id])) {
            Response::error('Khong tim thay dich vu.', 404); return;
        }
        $this->db->execute("DELETE FROM services WHERE id = ?", [$id]);
        Response::json(['ok' => true]);
    }

    // ─── Service Packages ─────────────────────────────────────────────────────

    public function indexPackages(array $p): void {
        Auth::require();
        $items = $this->db->query("SELECT * FROM service_packages ORDER BY sort_order ASC");
        Response::json($items);
    }

    public function storePackage(array $p): void {
        Auth::require();
        $b    = bodyJson();
        $name = trim((string)($b['name'] ?? ''));
        if (!$name) { Response::error('Ten goi khong duoc de trong.', 422); return; }
        $tagline       = trim((string)($b['tagline'] ?? ''));
        $price         = (int)($b['price'] ?? 0);
        $priceOriginal = (int)($b['price_original'] ?? 0);
        $items         = trim((string)($b['items'] ?? ''));
        $featured      = isset($b['featured']) ? (int)$b['featured'] : 0;
        $sort          = (int)($b['sort_order'] ?? 0);
        $active        = isset($b['active']) ? (int)$b['active'] : 1;
        $id = $this->db->execute(
            "INSERT INTO service_packages (name, tagline, price, price_original, items, featured, sort_order, active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [$name, $tagline, $price, $priceOriginal, $items, $featured, $sort, $active]
        );
        Response::json($this->db->queryOne("SELECT * FROM service_packages WHERE id = ?", [$id]), 201);
    }

    public function updatePackage(array $p): void {
        Auth::require();
        $id  = (int)($p['id'] ?? 0);
        $row = $this->db->queryOne("SELECT * FROM service_packages WHERE id = ?", [$id]);
        if (!$row) { Response::error('Khong tim thay goi dich vu.', 404); return; }
        $b             = bodyJson();
        $name          = trim((string)($b['name'] ?? $row['name']));
        $tagline       = trim((string)($b['tagline'] ?? $row['tagline']));
        $price         = isset($b['price']) ? (int)$b['price'] : (int)$row['price'];
        $priceOriginal = isset($b['price_original']) ? (int)$b['price_original'] : (int)$row['price_original'];
        $items         = trim((string)($b['items'] ?? $row['items']));
        $featured      = isset($b['featured']) ? (int)$b['featured'] : (int)$row['featured'];
        $sort          = isset($b['sort_order']) ? (int)$b['sort_order'] : (int)$row['sort_order'];
        $active        = isset($b['active']) ? (int)$b['active'] : (int)$row['active'];
        $this->db->execute(
            "UPDATE service_packages SET name=?, tagline=?, price=?, price_original=?, items=?, featured=?, sort_order=?, active=? WHERE id=?",
            [$name, $tagline, $price, $priceOriginal, $items, $featured, $sort, $active, $id]
        );
        Response::json($this->db->queryOne("SELECT * FROM service_packages WHERE id = ?", [$id]));
    }

    public function destroyPackage(array $p): void {
        Auth::require();
        $id = (int)($p['id'] ?? 0);
        if (!$this->db->queryOne("SELECT id FROM service_packages WHERE id = ?", [$id])) {
            Response::error('Khong tim thay goi dich vu.', 404); return;
        }
        $this->db->execute("DELETE FROM service_packages WHERE id = ?", [$id]);
        Response::json(['ok' => true]);
    }
}
