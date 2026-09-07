<?php
declare(strict_types=1);

class PublicController {
    public function __construct(private Database $db) {}

    // Trả flat {key: value} — lọc bỏ nhóm nhạy cảm không cần thiết ở public.
    public function settings(array $p): void {
        $rows = $this->db->query(
            "SELECT key, value FROM settings WHERE grp NOT IN ('smtp', 'cloudinary', 'integrations', 'system')"
        );
        $result = [];
        foreach ($rows as $r) {
            $result[$r['key']] = $r['value'];
        }
        Response::json($result);
    }

    public function heroSlides(array $p): void {
        $slides = $this->db->query(
            "SELECT * FROM hero_slides WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($slides);
    }

    // Danh mục kèm món ăn published — dùng cho trang Thực đơn đầy đủ
    public function menu(array $p): void {
        $cats = $this->db->query(
            "SELECT * FROM menu_categories WHERE status = 'published' ORDER BY sort_order, id"
        );
        foreach ($cats as &$cat) {
            $cat['items'] = $this->db->query(
                "SELECT * FROM menu_items WHERE category_id = ? AND status = 'published' ORDER BY sort_order, id",
                [$cat['id']]
            );
        }
        Response::json($cats);
    }

    // Danh sách phẳng món ăn — lọc theo category slug (?category=) hoặc featured (?featured=1)
    public function menuItems(array $p): void {
        $categorySlug = $_GET['category'] ?? '';
        $featuredOnly = ($_GET['featured'] ?? '') === '1';

        $sql = "SELECT i.*, c.name as category_name, c.slug as category_slug
                FROM menu_items i
                LEFT JOIN menu_categories c ON c.id = i.category_id
                WHERE i.status = 'published'";
        $params = [];
        if ($categorySlug !== '') {
            $sql .= " AND c.slug = ?";
            $params[] = $categorySlug;
        }
        if ($featuredOnly) {
            $sql .= " AND i.featured = 1";
        }
        $sql .= " ORDER BY c.sort_order, i.sort_order, i.id";

        Response::json($this->db->query($sql, $params));
    }

    public function gallery(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM gallery_items WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    public function testimonials(array $p): void {
        $items = $this->db->query(
            "SELECT * FROM testimonials WHERE status = 'published' ORDER BY sort_order, id"
        );
        Response::json($items);
    }

    // Form "Đặt chỗ / Đặt bánh" (trang chủ + liên hệ) đều nộp vào đây — gộp các
    // trường phụ (nhu cầu, ngày mong muốn, số người/kích thước bánh) vào message.
    public function submitContact(array $p): void {
        $b = bodyJson();
        $name    = trim($b['name'] ?? '');
        $phone   = trim($b['phone'] ?? '');
        $email   = trim($b['email'] ?? '');
        $subject = trim($b['subject'] ?? '');
        $message = trim($b['message'] ?? '');

        if (!$name || !$phone) {
            Response::error('Họ tên và số điện thoại là bắt buộc.');
            return;
        }

        $extra = [];
        if (!empty($b['date']))    $extra[] = 'Ngày mong muốn: ' . trim((string)$b['date']);
        if (!empty($b['detail']))  $extra[] = 'Số người/kích thước bánh: ' . trim((string)$b['detail']);
        if ($extra) {
            $message = trim($message . "\n" . implode("\n", $extra));
        }
        if (!$message) $message = '(Không có ghi chú thêm)';

        $id = $this->db->execute(
            "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
            [$name, $email, $phone, $subject, $message]
        );
        Response::json(['ok' => true, 'id' => $id], 201);
    }

    public function sitemap(array $p): void {
        header('Content-Type: application/xml; charset=utf-8');

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $base   = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

        // Site này không có trang chi tiết động (menu/gallery/testimonial không có route riêng)
        $staticRoutes = ['/', '/menu', '/khong-gian', '/gioi-thieu', '/lien-he', '/chinh-sach-bao-mat', '/dieu-khoan'];

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($staticRoutes as $route) {
            echo '  <url><loc>' . htmlspecialchars($base . $route, ENT_XML1) . '</loc></url>' . "\n";
        }
        echo '</urlset>';
    }
}
