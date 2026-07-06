<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    public function settings(): void {
        $rows   = $this->db->query(
            "SELECT key, value FROM settings WHERE grp NOT IN ('smtp','cloudinary','integrations')"
        );
        $result = [];
        foreach ($rows as $r) { $result[$r['key']] = $r['value']; }
        Response::json($result);
    }

    public function heroSlides(): void {
        $slides = $this->db->query(
            "SELECT * FROM hero_slides WHERE is_active = 1 ORDER BY sort_order ASC"
        );
        Response::json($slides);
    }

    public function productCategories(): void {
        $cats = $this->db->query(
            "SELECT pc.*, COUNT(p.id) as product_count
             FROM product_categories pc
             LEFT JOIN products p ON p.category_id = pc.id AND p.status = 'published'
             GROUP BY pc.id
             ORDER BY pc.sort_order ASC"
        );
        Response::json($cats);
    }

    public function products(): void {
        $cats = $this->db->query(
            "SELECT p.*, pc.name as category_name, pc.slug as category_slug
             FROM products p
             LEFT JOIN product_categories pc ON pc.id = p.category_id
             WHERE p.status = 'published'
             ORDER BY p.sort_order ASC, p.created_at DESC"
        );
        Response::json($cats);
    }

    public function productBySlug(array $params): void {
        $slug = $params['slug'] ?? '';
        $product = $this->db->queryOne(
            "SELECT p.*, pc.name as category_name, pc.slug as category_slug
             FROM products p
             LEFT JOIN product_categories pc ON pc.id = p.category_id
             WHERE p.slug = ? AND p.status = 'published'",
            [$slug]
        );
        if (!$product) { Response::error('Không tìm thấy sản phẩm', 404); return; }
        Response::json($product);
    }

    public function testimonials(): void {
        $reviews = $this->db->query(
            "SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC"
        );
        Response::json($reviews);
    }

    public function submitContact(): void {
        $data    = bodyJson();
        $name    = trim($data['name'] ?? '');
        $phone   = trim($data['phone'] ?? '');
        $email   = trim($data['email'] ?? '');
        $topic   = trim($data['topic'] ?? '');
        $message = trim($data['message'] ?? '');

        if (!$name || !$message) {
            Response::error('Vui lòng điền họ tên và nội dung tin nhắn', 422);
            return;
        }
        if (mb_strlen($name) > 120 || mb_strlen($phone) > 30 || mb_strlen($email) > 200 || mb_strlen($message) > 5000) {
            Response::error('Nội dung vượt quá độ dài cho phép', 422);
            return;
        }

        $this->db->execute(
            "INSERT INTO contacts (name, phone, email, topic, message) VALUES (?, ?, ?, ?, ?)",
            [$name, $phone, $email, $topic, $message]
        );
        Response::json(['message' => 'Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.']);
    }
}
