<?php
declare(strict_types=1);

// ServiceCategory not used in this project -- stub returns 404
class ServiceCategoryController {
    public function __construct(private Database $db) {}

    public function index(array $p = []): void {
        Response::error('Not found', 404);
    }
}
