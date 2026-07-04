<?php
declare(strict_types=1);

// ServiceCategoryController — stub (dental template uses services directly, no categories)
class ServiceCategoryController {
    public function __construct(private Database $db) {}

    public function index(array $p = []): void {
        Auth::require();
        Response::json([]);
    }
}
