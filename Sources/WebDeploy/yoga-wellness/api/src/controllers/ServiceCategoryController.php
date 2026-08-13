<?php
class ServiceCategoryController {
  private $db;
  public function __construct($db) { $this->db = $db; }
  public function index() { Response::json([]); }
  public function store() { Response::json(['id' => 1], 201); }
  public function update() { Response::json([]); }
  public function destroy() { Response::json([]); }
}
