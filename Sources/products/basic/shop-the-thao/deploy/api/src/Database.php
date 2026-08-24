<?php
class Database {
    public static $instance = null;
    public $pdo;

    public function __construct() {
        $this->connect();
        $this->ensureSchema();
    }

    public function connect() {
        try {
            $this->pdo = new PDO('sqlite:' . DB_FILE);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->pdo->exec('PRAGMA foreign_keys = ON');
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }

    public function ensureSchema() {
        if (file_exists(DB_FILE) && filesize(DB_FILE) > 0) {
            return;
        }
        $this->seedDatabase();
    }

    public function seedDatabase() {
        $schema = file_get_contents(__DIR__ . '/../schema.sql');
        $this->pdo->exec($schema);

        // Seed users (check count to avoid duplicates)
        $count = $this->pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
        if ($count == 0) {
            $this->pdo->prepare(
                "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
            )->execute([
                'Admin',
                'sysadmin@admin.com',
                password_hash('123456', PASSWORD_DEFAULT),
                'superadmin'
            ]);
        }

        // Seed settings
        $settings = [
            ['key' => 'site_name', 'value' => 'SPORT THE THAO', 'group' => 'general'],
            ['key' => 'site_tagline', 'value' => '40 sản phẩm thể thao chính hãng', 'group' => 'general'],
            ['key' => 'site_phone', 'value' => '(028) 3730-5757', 'group' => 'general'],
            ['key' => 'site_email', 'value' => 'hello@sportthethao.vn', 'group' => 'general'],
            ['key' => 'site_address', 'value' => '123 Lê Lợi, Quận 1, TP.HCM', 'group' => 'general'],
            ['key' => 'working_hours', 'value' => 'Thứ 2–7: 8:00 - 21:00 | CN: 9:00 - 20:00', 'group' => 'general'],
            ['key' => 'site_theme', 'value' => 'dark-energy', 'group' => 'design'],
            ['key' => 'meta_title', 'value' => 'SPORT THE THAO — Dụng Cụ Gym & Quần Áo Thể Thao', 'group' => 'seo'],
            ['key' => 'meta_description', 'value' => 'Mua quần áo gym, dụng cụ tập luyện & phụ kiện thể thao chính hãng với giá tốt. Miễn phí ship, đổi size miễn phí, bảo hành 12 tháng.', 'group' => 'seo'],
            ['key' => 'shipping_fee', 'value' => '25000', 'group' => 'shop'],
            ['key' => 'free_shipping_threshold', 'value' => '500000', 'group' => 'shop'],
            // Payment — payment_cod_enabled/payment_sepay_enabled/sepay_webhook_secret là 3 key BẮT BUỘC
            // cho luồng thanh toán COD+SePay (xem ShopPublicController::paymentMethods()/createOrder()/sepayWebhook()).
            ['key' => 'payment_cod_enabled', 'value' => '1', 'group' => 'payment'],
            ['key' => 'payment_sepay_enabled', 'value' => '0', 'group' => 'payment'],
            ['key' => 'sepay_webhook_secret', 'value' => '', 'group' => 'payment'],
            ['key' => 'sepay_bank_name', 'value' => 'VPBank', 'group' => 'payment'],
            ['key' => 'sepay_bank_code', 'value' => 'VPB', 'group' => 'payment'],
            // Tên cột đúng phải là sepay_account_number (khớp ShopPublicController.php + PaymentSettingsTab.tsx)
            ['key' => 'sepay_account_number', 'value' => '123456789', 'group' => 'payment'],
            ['key' => 'sepay_account_name', 'value' => 'CONG TY CO PHAN SPORT THE THAO', 'group' => 'payment'],
            ['key' => 'hero_topbar_1', 'value' => 'Miễn phí ship đơn từ 500K', 'group' => 'hero'],
            ['key' => 'hero_topbar_2', 'value' => 'Đổi size miễn phí', 'group' => 'hero'],
            ['key' => 'hero_topbar_3', 'value' => 'Bảo hành 12 tháng', 'group' => 'hero'],
            // Social
            ['key' => 'facebook', 'value' => '', 'group' => 'social'],
            ['key' => 'instagram', 'value' => '', 'group' => 'social'],
            ['key' => 'youtube', 'value' => '', 'group' => 'social'],
            ['key' => 'tiktok', 'value' => '', 'group' => 'social'],
            // Footer
            ['key' => 'footer_about', 'value' => 'Chuyên cung cấp đồ thể thao & gym chính hãng. Tất cả sản phẩm có bảo hành, đổi size miễn phí trong 30 ngày.', 'group' => 'footer'],
            // SMTP
            ['key' => 'smtp_host', 'value' => '', 'group' => 'smtp'],
            ['key' => 'smtp_port', 'value' => '587', 'group' => 'smtp'],
            ['key' => 'smtp_user', 'value' => '', 'group' => 'smtp'],
            ['key' => 'smtp_pass', 'value' => '', 'group' => 'smtp'],
            ['key' => 'smtp_from', 'value' => '', 'group' => 'smtp'],
            ['key' => 'smtp_from_name', 'value' => 'SPORT THE THAO', 'group' => 'smtp'],
            // System
            ['key' => 'maintenance_mode', 'value' => '0', 'group' => 'system'],
            // Cloudinary (tùy chọn — không điền vẫn upload local bình thường)
            ['key' => 'cloudinary_cloud_name', 'value' => '', 'group' => 'cloudinary'],
            ['key' => 'cloudinary_api_key', 'value' => '', 'group' => 'cloudinary'],
            ['key' => 'cloudinary_api_secret', 'value' => '', 'group' => 'cloudinary'],
            ['key' => 'cloudinary_folder', 'value' => 'shop-the-thao', 'group' => 'cloudinary'],
            // Integrations
            ['key' => 'unsplash_access_key', 'value' => 'BdVQbpMxCxFAU2ijjhhvwC5-t3Y9CqFe65Mf09t11kY', 'group' => 'integrations'],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO settings (key, value, grp) VALUES (?, ?, ?)");
        foreach ($settings as $s) {
            $stmt->execute([$s['key'], $s['value'], $s['group']]);
        }

        // Seed product categories
        $categories = [
            ['name' => 'Quần áo', 'slug' => 'quan-ao', 'description' => 'Áo, quần, short, hoodie thể thao'],
            ['name' => 'Giày', 'slug' => 'giay', 'description' => 'Giày chạy bộ, giày thể thao, giày tập luyện'],
            ['name' => 'Dụng cụ', 'slug' => 'dung-cu', 'description' => 'Dụng cụ gym, tạa, thảm tập, dây kéo'],
            ['name' => 'Phụ kiện', 'slug' => 'phu-kien', 'description' => 'Vòng tay thông minh, túi xách, nón, kính'],
            ['name' => 'Yoga', 'slug' => 'yoga', 'description' => 'Thảm yoga, áo yoga, quần yoga, tựa khối'],
        ];
        $stmt = $this->pdo->prepare("INSERT INTO product_categories (name, slug) VALUES (?, ?)");
        foreach ($categories as $cat) {
            $stmt->execute([$cat['name'], $cat['slug']]);
        }

        // Seed products (40 items)
        $products = $this->getProducts();
        $stmt = $this->pdo->prepare(
            "INSERT INTO products (name, slug, category_id, price, price_sale, brand, colors, sizes, theme, sold, description, badge, image)
             VALUES (?, ?, (SELECT id FROM product_categories WHERE slug = ?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );

        foreach ($products as $p) {
            $stmt->execute([
                $p['name'], $p['slug'], $p['category_slug'], $p['price'], $p['price_sale'],
                $p['brand'], $p['colors'], $p['sizes'], $p['theme'], $p['sold'],
                $p['description'], $p['badge'], $p['image']
            ]);
        }
    }

    private function getProducts() {
        return [
            // QUẦN ÁO (12)
            ['name' => 'Áo thun thể thao nam DryFit', 'slug' => 'ao-thun-the-thao-nam-dryfit', 'category_slug' => 'quan-ao', 'price' => 290000, 'price_sale' => null, 'brand' => 'SportPro', 'colors' => 'Xám:#8b8b8b', 'sizes' => '|S|M|L|XL|', 'theme' => '|ban-chay|', 'sold' => 145, 'description' => 'Áo thun dryfit cao cấp, thoáng khí, giúp thấm mồ hôi nhanh chóng', 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Quần legging nữ Hi-Rise 4 chiều', 'slug' => 'quan-legging-nu-hi-rise', 'category_slug' => 'quan-ao', 'price' => 420000, 'price_sale' => 350000, 'brand' => 'FlexFit', 'colors' => 'Đen:#000000', 'sizes' => '|XS|S|M|L|XL|', 'theme' => '|ban-chay|giam-gia|', 'sold' => 230, 'description' => 'Quần legging 4 chiều co giãn, tạo dáng vóc, phù hợp tập gym', 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Áo zip hoodie thể thao', 'slug' => 'ao-zip-hoodie-the-thao', 'category_slug' => 'quan-ao', 'price' => 590000, 'price_sale' => null, 'brand' => 'ActiveX', 'colors' => 'Xanh navy:#1f4788', 'sizes' => '|M|L|XL|XXL|', 'theme' => '|moi-ve|', 'sold' => 78, 'description' => 'Hoodie thể thao mặc mỗi ngày, chất liệu cotton blend', 'badge' => 'new', 'image' => 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Quần short chạy bộ nam 7 inch', 'slug' => 'quan-short-chay-bo-nam', 'category_slug' => 'quan-ao', 'price' => 350000, 'price_sale' => null, 'brand' => 'SportPro', 'colors' => 'Xanh navy:#1f4788', 'sizes' => '|S|M|L|XL|XXL|', 'theme' => '|ban-chay|', 'sold' => 198, 'description' => 'Quần short chạy bộ nhẹ nhàng, khô nhanh', 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Áo ba lỗ tank top nam thoáng khí', 'slug' => 'ao-ba-lo-tank-top-nam', 'category_slug' => 'quan-ao', 'price' => 250000, 'price_sale' => 190000, 'brand' => 'ActiveX', 'colors' => 'Trắng:#ffffff', 'sizes' => '|S|M|L|XL|XXL|', 'theme' => '|giam-gia|', 'sold' => 112, 'description' => 'Tank top thoáng khí, dễ chăm sóc', 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Bộ đồ tập gym nữ hai mảnh', 'slug' => 'bo-do-tap-gym-nu-hai-manh', 'category_slug' => 'quan-ao', 'price' => 650000, 'price_sale' => null, 'brand' => 'FlexFit', 'colors' => 'Đen:#000000', 'sizes' => '|XS|S|M|L|', 'theme' => '|ban-chay|', 'sold' => 156, 'description' => 'Bộ áo crop + quần legging thể thao', 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Áo khoác thể thao nam chống nước', 'slug' => 'ao-khoac-the-thao-nam-chong-nuoc', 'category_slug' => 'quan-ao', 'price' => 850000, 'price_sale' => 720000, 'brand' => 'SportPro', 'colors' => 'Xám:#8b8b8b', 'sizes' => '|S|M|L|XL|XXL|', 'theme' => '|giam-gia|moi-ve|', 'sold' => 89, 'description' => 'Áo khoác chống nước, thoáng khí, nhẹ', 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Quần tây thể thao nam thoải mái', 'slug' => 'quan-tay-the-thao-nam-thoai-mai', 'category_slug' => 'quan-ao', 'price' => 480000, 'price_sale' => null, 'brand' => 'ActiveX', 'colors' => 'Xanh lá:#22c55e', 'sizes' => '|M|L|XL|', 'theme' => '|ban-chay|', 'sold' => 67, 'description' => 'Quần tây thể thao, phù hợp mặc hằng ngày', 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Áo tank nữ yoga thoáng khí', 'slug' => 'ao-tank-nu-yoga-thoang-khi', 'category_slug' => 'quan-ao', 'price' => 320000, 'price_sale' => null, 'brand' => 'FlexFit', 'colors' => 'Hồng:#ff69b4', 'sizes' => '|XS|S|M|L|', 'theme' => '|moi-ve|', 'sold' => 143, 'description' => 'Tank yoga cao cấp, co giãn 4 chiều', 'badge' => 'new', 'image' => 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Quần tập yoga nữ cao cấp', 'slug' => 'quan-tap-yoga-nu-cao-cap', 'category_slug' => 'quan-ao', 'price' => 580000, 'price_sale' => 490000, 'brand' => 'FlexFit', 'colors' => 'Tím:#a855f7', 'sizes' => '|S|M|L|', 'theme' => '|giam-gia|ban-chay|', 'sold' => 201, 'description' => 'Quần yoga co giãn cao, không tôn dáng', 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Bộ đồ bơi nam thể thao', 'slug' => 'bo-do-boi-nam-the-thao', 'category_slug' => 'quan-ao', 'price' => 380000, 'price_sale' => null, 'brand' => 'SportPro', 'colors' => 'Đen:#000000', 'sizes' => '|S|M|L|XL|', 'theme' => '|moi-ve|', 'sold' => 52, 'description' => 'Bộ bơi nam chất lượng cao, nhanh khô', 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Áo gió thể thao unisex chống gió', 'slug' => 'ao-gio-the-thao-unisex-chong-gio', 'category_slug' => 'quan-ao', 'price' => 420000, 'price_sale' => 359000, 'brand' => 'ActiveX', 'colors' => 'Đen:#000000', 'sizes' => '|S|M|L|XL|', 'theme' => '|giam-gia|', 'sold' => 96, 'description' => 'Áo gió nhẹ, cản gió tốt, gấp gọn mang theo tiện lợi', 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80'],

            // GIÀY (8)
            ['name' => 'Giày chạy bộ nam cushioning tốt', 'slug' => 'giay-chay-bo-nam-cushioning-tot', 'category_slug' => 'giay', 'price' => 1290000, 'price_sale' => null, 'brand' => 'RunElite', 'colors' => 'Xanh lá:#22c55e', 'sizes' => '|38|39|40|41|42|43|', 'theme' => '|ban-chay|', 'sold' => 278, 'description' => 'Giày chạy bộ với công nghệ giảm chấn tốt', 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Giày thể thao nữ nhẹ nhàng', 'slug' => 'giay-the-thao-nu-nhe-nang', 'category_slug' => 'giay', 'price' => 890000, 'price_sale' => 750000, 'brand' => 'SportFlex', 'colors' => 'Trắng:#ffffff', 'sizes' => '|35|36|37|38|39|40|', 'theme' => '|giam-gia|', 'sold' => 189, 'description' => 'Giày thể thao nữ thoải mái, nhẹ', 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Giày tập gym nam bền bỉ', 'slug' => 'giay-tap-gym-nam-ben-bi', 'category_slug' => 'giay', 'price' => 720000, 'price_sale' => null, 'brand' => 'FitStride', 'colors' => 'Đen:#000000', 'sizes' => '|38|39|40|41|42|43|', 'theme' => '|ban-chay|', 'sold' => 156, 'description' => 'Giày tập gym với độ cứng vừa phải', 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Giày basketball nam cao cấp', 'slug' => 'giay-basketball-nam-cao-cap', 'category_slug' => 'giay', 'price' => 1890000, 'price_sale' => null, 'brand' => 'BallPro', 'colors' => 'Đen:#000000', 'sizes' => '|39|40|41|42|43|44|', 'theme' => '|moi-ve|', 'sold' => 94, 'description' => 'Giày basketball chuyên nghiệp, hỗ trợ cổ chân tốt', 'badge' => 'new', 'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Giày yoga nữ chuyên dụng', 'slug' => 'giay-yoga-nu-chuyen-dung', 'category_slug' => 'giay', 'price' => 450000, 'price_sale' => 380000, 'brand' => 'YogaStride', 'colors' => 'Hồng:#ff69b4', 'sizes' => '|35|36|37|38|39|40|', 'theme' => '|giam-gia|moi-ve|', 'sold' => 112, 'description' => 'Giày yoga mềm mại, đàn hồi tốt', 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Giày đi bộ đường dài nam', 'slug' => 'giay-di-bo-duong-dai-nam', 'category_slug' => 'giay', 'price' => 980000, 'price_sale' => null, 'brand' => 'TrailWalk', 'colors' => 'Nâu:#8b4513', 'sizes' => '|39|40|41|42|43|', 'theme' => '|ban-chay|', 'sold' => 178, 'description' => 'Giày đi bộ chắc chắn, bảo vệ chân tốt', 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Giày thể thao bé gái dễ thương', 'slug' => 'giay-the-thao-be-gai-de-thuong', 'category_slug' => 'giay', 'price' => 420000, 'price_sale' => null, 'brand' => 'KidsFlex', 'colors' => 'Hồng:#ff69b4', 'sizes' => '|30|31|32|33|34|', 'theme' => '|moi-ve|', 'sold' => 68, 'description' => 'Giày thể thao bé gái êm ái, an toàn', 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Giày chạy nữ tốc độ cao', 'slug' => 'giay-chay-nu-toc-do-cao', 'category_slug' => 'giay', 'price' => 1450000, 'price_sale' => 1200000, 'brand' => 'SpeedRun', 'colors' => 'Đỏ:#ff0000', 'sizes' => '|36|37|38|39|40|', 'theme' => '|giam-gia|ban-chay|', 'sold' => 245, 'description' => 'Giày chạy nữ được thiết kế cho tốc độ', 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'],

            // DỤNG CỤ (12)
            ['name' => 'Tạa tay nam 5kg bộ đôi', 'slug' => 'ta-tay-nam-5kg-bo-doi', 'category_slug' => 'dung-cu', 'price' => 380000, 'price_sale' => null, 'brand' => 'IronPro', 'colors' => 'Xám:#8b8b8b', 'sizes' => 'Freesize', 'theme' => '|ban-chay|', 'sold' => 412, 'description' => 'Tạa tay 5kg bộ đôi, bề mặt nhập khẩu', 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Thảm yoga cao su tự nhiên 6mm', 'slug' => 'tham-yoga-cao-su-tu-nhien-6mm', 'category_slug' => 'dung-cu', 'price' => 650000, 'price_sale' => 540000, 'brand' => 'YogaMat', 'colors' => 'Tím:#a855f7', 'sizes' => 'Freesize', 'theme' => '|giam-gia|moi-ve|', 'sold' => 289, 'description' => 'Thảm yoga 6mm eco-friendly, bền bỉ', 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Dây kéo tập lực tay túi 5 tấm', 'slug' => 'day-keo-tap-luc-tay-tui-5-tam', 'category_slug' => 'dung-cu', 'price' => 280000, 'price_sale' => null, 'brand' => 'ResistBand', 'colors' => 'Đa sắc:#ff0000', 'sizes' => 'Freesize', 'theme' => '|ban-chay|', 'sold' => 567, 'description' => '5 mức kéo khác nhau, dễ mang đi', 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Bóng tập core 65cm', 'slug' => 'bong-tap-core-65cm', 'category_slug' => 'dung-cu', 'price' => 450000, 'price_sale' => null, 'brand' => 'CoreBall', 'colors' => 'Xanh lá:#22c55e', 'sizes' => 'Freesize', 'theme' => '|moi-ve|', 'sold' => 178, 'description' => 'Bóng stability cao, chịu lực tốt', 'badge' => 'new', 'image' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Tạa đĩa nam có nam châm 10kg', 'slug' => 'ta-dia-nam-co-nam-cham-10kg', 'category_slug' => 'dung-cu', 'price' => 890000, 'price_sale' => 750000, 'brand' => 'IronPro', 'colors' => 'Đen:#000000', 'sizes' => 'Freesize', 'theme' => '|giam-gia|', 'sold' => 234, 'description' => 'Tạa đĩa 10kg có nam châm, an toàn', 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Giàn tập đa năng mini', 'slug' => 'gian-tap-da-nang-mini', 'category_slug' => 'dung-cu', 'price' => 1580000, 'price_sale' => null, 'brand' => 'MultiGym', 'colors' => 'Xám:#8b8b8b', 'sizes' => 'Freesize', 'theme' => '|ban-chay|', 'sold' => 89, 'description' => 'Giàn tập đa năng cho nhà, tiết kiệm không gian', 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Vòng lắc Pilates trơn 38cm', 'slug' => 'vong-lac-pilates-tron-38cm', 'category_slug' => 'dung-cu', 'price' => 380000, 'price_sale' => null, 'brand' => 'PilatesPro', 'colors' => 'Hồng:#ff69b4', 'sizes' => 'Freesize', 'theme' => '|moi-ve|', 'sold' => 145, 'description' => 'Vòng Pilates trơn, tập luyện core hiệu quả', 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Roller massage cơ lăn trị liệu', 'slug' => 'roller-massage-co-lan-tri-lieu', 'category_slug' => 'dung-cu', 'price' => 580000, 'price_sale' => 480000, 'brand' => 'MassagePro', 'colors' => 'Đen:#000000', 'sizes' => 'Freesize', 'theme' => '|giam-gia|ban-chay|', 'sold' => 312, 'description' => 'Roller giải phóng căng cơ, hỗ trợ phục hồi', 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Dây nhảy tốc độ cao không xoắn', 'slug' => 'day-nhay-toc-do-cao-khong-xoan', 'category_slug' => 'dung-cu', 'price' => 290000, 'price_sale' => null, 'brand' => 'JumpPro', 'colors' => 'Xanh lá:#22c55e', 'sizes' => 'Freesize', 'theme' => '|ban-chay|', 'sold' => 478, 'description' => 'Dây nhảy tốc độ cao, không xoắn', 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Túi cát đấm boxing đứng 1.2m', 'slug' => 'tui-cat-dam-boxing-dung-1-2m', 'category_slug' => 'dung-cu', 'price' => 2180000, 'price_sale' => 1890000, 'brand' => 'BoxingPro', 'colors' => 'Đen:#000000', 'sizes' => 'Freesize', 'theme' => '|giam-gia|moi-ve|', 'sold' => 76, 'description' => 'Túi boxing đứng vững, có giảm xóc', 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Thảm tập cardio chuyên dụng', 'slug' => 'tham-tap-cardio-chuyen-dung', 'category_slug' => 'dung-cu', 'price' => 750000, 'price_sale' => null, 'brand' => 'CardioPad', 'colors' => 'Đen:#000000', 'sizes' => 'Freesize', 'theme' => '|ban-chay|', 'sold' => 156, 'description' => 'Thảm tập cardio chống trơn, bền bỉ', 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Bao tay tập gym chống trượt', 'slug' => 'bao-tay-tap-gym-chong-truot', 'category_slug' => 'dung-cu', 'price' => 190000, 'price_sale' => null, 'brand' => 'IronPro', 'colors' => 'Đen:#000000', 'sizes' => '|S|M|L|', 'theme' => '|moi-ve|', 'sold' => 134, 'description' => 'Bao tay tập gym chống trượt, bảo vệ lòng bàn tay khi nâng tạ', 'badge' => 'new', 'image' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'],

            // PHỤ KIỆN (5)
            ['name' => 'Vòng tay thông minh theo dõi sức khỏe', 'slug' => 'vong-tay-thong-minh-theo-doi-suc-khoe', 'category_slug' => 'phu-kien', 'price' => 890000, 'price_sale' => 750000, 'brand' => 'FitBand', 'colors' => 'Đen:#000000', 'sizes' => 'M/L', 'theme' => '|giam-gia|', 'sold' => 234, 'description' => 'Vòng tay theo dõi nhịp tim, bước chân, giấc ngủ', 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Tai nghe không dây chống ồn', 'slug' => 'tai-nghe-khong-day-chong-on', 'category_slug' => 'phu-kien', 'price' => 1290000, 'price_sale' => null, 'brand' => 'AudioFit', 'colors' => 'Đen:#000000', 'sizes' => 'Freesize', 'theme' => '|moi-ve|', 'sold' => 156, 'description' => 'Tai nghe Bluetooth chống ồn, pin 8h', 'badge' => 'new', 'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Túi xách thể thao chống nước', 'slug' => 'tui-xach-the-thao-chong-nuoc', 'category_slug' => 'phu-kien', 'price' => 580000, 'price_sale' => 490000, 'brand' => 'SportBag', 'colors' => 'Xám:#8b8b8b', 'sizes' => 'Freesize', 'theme' => '|giam-gia|ban-chay|', 'sold' => 289, 'description' => 'Túi xách chống nước, nhiều ngăn', 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Nón thể thao nửa đầu breathable', 'slug' => 'non-the-thao-nua-dau-breathable', 'category_slug' => 'phu-kien', 'price' => 280000, 'price_sale' => null, 'brand' => 'SunPro', 'colors' => 'Xanh lá:#22c55e', 'sizes' => 'Freesize', 'theme' => '|ban-chay|', 'sold' => 423, 'description' => 'Nón thể thao thoáng khí, chống tia UV', 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Kính bảo vệ mắt thể thao UV400', 'slug' => 'kinh-bao-ve-mat-the-thao-uv400', 'category_slug' => 'phu-kien', 'price' => 480000, 'price_sale' => null, 'brand' => 'EyeFit', 'colors' => 'Đen:#000000', 'sizes' => 'Freesize', 'theme' => '|moi-ve|', 'sold' => 167, 'description' => 'Kính thể thao chống tia UV, bảo vệ mắt', 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'],

            // YOGA (3)
            ['name' => 'Khối yoga EVA cứng chắc', 'slug' => 'khoi-yoga-eva-cung-chac', 'category_slug' => 'yoga', 'price' => 320000, 'price_sale' => null, 'brand' => 'YogaBloc', 'colors' => 'Hồng:#ff69b4', 'sizes' => 'Freesize', 'theme' => '|ban-chay|', 'sold' => 234, 'description' => 'Khối yoga EVA cứng, hỗ trợ tư thế', 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Tựa khối yoga hỗ trợ cơ thể', 'slug' => 'tua-khoi-yoga-ho-tro-co-the', 'category_slug' => 'yoga', 'price' => 450000, 'price_sale' => 380000, 'brand' => 'YogaSupp', 'colors' => 'Tím:#a855f7', 'sizes' => 'Freesize', 'theme' => '|giam-gia|moi-ve|', 'sold' => 178, 'description' => 'Tựa khối yoga hỗ trợ tư thế hiệu quả', 'badge' => 'sale', 'image' => 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80'],
            ['name' => 'Giá treo yoga cao cấp', 'slug' => 'gia-treo-yoga-cao-cap', 'category_slug' => 'yoga', 'price' => 1890000, 'price_sale' => null, 'brand' => 'YogaSwing', 'colors' => 'Xanh lá:#22c55e', 'sizes' => 'Freesize', 'theme' => '|ban-chay|', 'sold' => 45, 'description' => 'Giá treo yoga hỗ trợ anti-gravity', 'badge' => '', 'image' => 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80'],
        ];
    }

    public function query(string $sql, array $params = []): array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function queryOne(string $sql, array $params = []): ?array {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function exec(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount();
    }

    // Alias — toàn bộ controller trong site này gọi $this->db->execute(...) cho INSERT/UPDATE/DELETE,
    // trả về lastInsertId() cho INSERT (khớp với cách ProductController/HeroSlideController... đang dùng
    // giá trị trả về làm $id), rowCount() nếu không phải INSERT.
    public function execute(string $sql, array $params = []): int {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        if (stripos(ltrim($sql), 'INSERT') === 0) {
            return (int)$this->pdo->lastInsertId();
        }
        return $stmt->rowCount();
    }

    public function lastInsertId(): string {
        return $this->pdo->lastInsertId();
    }

    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new Database();
        }
        return self::$instance;
    }
}
?>
