<?php
declare(strict_types=1);

class CategoryController {
    public function __construct(private Database $db) {}

    // Danh mục cố định theo template (không có UI CRUD danh mục trong bản tĩnh) —
    // dùng chung cho cả POS (pills lọc) lẫn form sản phẩm admin (dropdown).
    public function index(array $p): void {
        Auth::require();
        $rows = $this->db->query("SELECT * FROM categories ORDER BY sort_order, id");
        Response::json($rows);
    }
}
