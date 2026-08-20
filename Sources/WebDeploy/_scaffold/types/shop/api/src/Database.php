<?php
declare(strict_types=1);

class Database extends \Database {
    protected function seedExtensions(): void {
        $this->seedProductCategories();
        $this->seedProducts();
        $this->seedCoupons();
    }

    private function seedProductCategories(): void {
        if ($this->scalar("SELECT COUNT(*) FROM product_categories") > 0) return;
        // TODO: AI điền category data thực từ template
    }

    private function seedProducts(): void {
        if ($this->scalar("SELECT COUNT(*) FROM products") > 0) return;
        // TODO: AI điền product data thực từ template (name, price, image, colors, description, v.v.)
    }

    private function seedCoupons(): void {
        if ($this->scalar("SELECT COUNT(*) FROM coupons") > 0) return;
        // TODO: AI điền coupon data thực từ template nếu template có coupon system
    }
}
?>
